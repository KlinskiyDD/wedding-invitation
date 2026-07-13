# GitHub Pages с рабочей RSVP-формой через Cloudflare Worker

## 0. Метаданные
- Тип (профиль): `frontend-spa-typescript` + инфраструктурная интеграция Cloudflare Workers
- Владелец: Дмитрий / Codex
- Масштаб: medium
- Целевая модель: gpt-5.5
- Целевой релиз / ветка: `main`, GitHub Pages project site `https://klinskiydd.github.io/wedding-invitation/`
- Ограничения:
  - до фразы пользователя `Спеку подтверждаю` изменяется только эта спецификация;
  - GitHub Pages остаётся статическим хостингом и не получает секреты Google;
  - существующий Cloudflare Worker остаётся единственной серверной точкой записи RSVP в Google Sheets;
  - обычная Cloudflare-сборка без Pages-переменных должна продолжать работать с корневым URL и относительным `/api/rsvp`;
  - GitHub Pages уже настроен на `Source: GitHub Actions`, custom domain не используется, HTTPS включён;
  - папка `out/` остаётся generated artifact и не коммитится.
- Связанные ссылки:
  - [GitHub Pages: configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
  - [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
  - [Official Next.js GitHub Pages example](https://github.com/nextjs/deploy-github-pages)
  - [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
  - [Cloudflare Workers CORS example](https://developers.cloudflare.com/workers/examples/cors-header-proxy/)
  - [Cloudflare Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
  - [Cloudflare Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)

## 1. Overview / Цель
Опубликовать обе статические версии свадебного приглашения в GitHub Pages и сохранить рабочую RSVP-форму, которая из браузера обращается к существующему Cloudflare Worker и записывает ответы в Google Sheets.

Outcome contract:
- Success means:
  - `https://klinskiydd.github.io/wedding-invitation/` и `/wedding-invitation/banquet` открываются после push в `main`;
  - HTML, Next.js bundles, изображения, фоновые изображения и `.ics`-файлы загружаются из project-site base path без 404;
  - RSVP из GitHub Pages проходит CORS preflight, получает JSON-ответ Worker и сохраняет данные через существующий Google Sheets flow;
  - текущий Cloudflare deployment остаётся совместимым: при обычной сборке base path пуст, а RSVP использует `/api/rsvp`;
  - GitHub Actions собирает и публикует `out/`, не коммитя generated files и не используя секрет Google.
- Итоговый артефакт / output:
  - код поддержки Pages base path;
  - GitHub Actions workflow;
  - конфигурируемый публичный RSVP endpoint;
  - CORS-контракт Worker;
  - автоматические проверки export-артефакта, RSVP endpoint selection и CORS;
  - документация rollout/rollback.
- Stop rules:
  - не переходить к реализации до точной фразы `Спеку подтверждаю`;
  - на EXEC остановить production rollout, если нельзя достоверно определить публичный Worker URL или отсутствует авторизация Cloudflare/GitHub;
  - не выполнять `git push` или `wrangler deploy`, пока lint, typecheck, tests, Pages build и Wrangler dry-run не завершились успешно;
  - не публиковать Pages, если export audit обнаруживает корневые `/images`, `/calendar` или `/_next` ссылки, обходящие `/wedding-invitation`;
  - после успешного post-deploy smoke не расширять scope дополнительным hosting/refactor work.

## 2. Текущее состояние (AS-IS)
- Репозиторий `KlinskiyDD/wedding-invitation` публичный, ветка `main` отслеживает `origin/main`.
- В GitHub `Settings -> Pages` уже выбрано `Source: GitHub Actions`, включён HTTPS, workflow ещё не создан, поэтому Pages URL пока возвращает 404.
- `next.config.ts` использует `output: "export"` и `images.unoptimized: true`; `npm run build` формирует `out/`.
- Текущий export содержит главную страницу, `banquet.html`, изображения, Next.js assets и `.ics`-файлы; размер около 9.65 MiB, что существенно ниже лимита GitHub Pages.
- В приложении используются абсолютные public paths вида `/images/...` и `/calendar/...` в TypeScript/TSX и `app/globals.css`. На project-site URL они обращались бы к корню `klinskiydd.github.io`, а не к `/wedding-invitation`.
- `components/Rsvp.tsx` отправляет JSON на относительный `/api/rsvp`.
- `worker/index.js` обрабатывает `POST /api/rsvp`, получает Google access token и добавляет строку в Google Sheets.
- Секрет `GOOGLE_SERVICE_ACCOUNT_JSON_B64` хранится локально в ignored `.dev.vars` и должен оставаться Cloudflare secret в production; Spreadsheet ID и sheet name являются несекретной конфигурацией `wrangler.jsonc`.
- Worker и static assets сейчас рассчитаны на один origin: явной обработки CORS preflight и allowlist origins нет.
- Playwright уже проверяет обе версии приглашения и успешный UI-flow RSVP через mock маршрута `**/api/rsvp`.
- `.github/workflows/` отсутствует, `out/` исключён через `.gitignore`.

Скрытые зависимости и инварианты:
- `Content-Type: application/json` при cross-origin `POST` инициирует browser preflight `OPTIONS`; без корректного ответа форма упадёт до фактического POST.
- Pages base path является build-time значением; смена Pages URL или репозитория требует новой сборки.
- Next.js автоматически применяет `basePath` не ко всем public asset ссылкам: строки `src="/images/..."`, content URLs и CSS `url("/images/...")` должны быть обработаны явно.
- Тот же репозиторий должен по-прежнему собираться для Cloudflare с пустым base path.
- CORS ограничивает браузеры, но не является аутентификацией API; эта задача не превращает публичную RSVP-форму в закрытый endpoint.

## 3. Проблема
Текущая статическая сборка и RSVP API связаны допущением об одном корневом origin, поэтому прямой перенос фронтенда на project-site GitHub Pages ломает public assets и отправку формы.

## 4. Цели дизайна
- Разделение ответственности:
  - GitHub Pages публикует только статический фронтенд;
  - Cloudflare Worker валидирует запрос и выполняет секретную запись в Google Sheets;
  - GitHub Actions воспроизводимо собирает Pages artifact.
- Повторное использование: единый helper формирует base-path-aware public URLs вместо разрозненной конкатенации.
- Тестируемость: base path, endpoint selection и CORS проверяются без обязательной записи тестовой строки в production Google Sheet.
- Консистентность: одинаковые правила применяются к `next/image`, обычным `<img>`, `.ics` и CSS backgrounds.
- Обратная совместимость: локальная разработка и текущий Cloudflare flow сохраняют пустой base path и относительный `/api/rsvp`.
- Безопасность: Google credential не попадает в GitHub Actions, `NEXT_PUBLIC_*`, client bundle или репозиторий.
- Операционность: Worker разворачивается раньше Pages, чтобы у первого посетителя не возникло временного CORS-сбоя.

## 5. Non-Goals (чего НЕ делаем)
- Не заменяем Cloudflare Worker на GitHub Actions, GitHub Pages Functions, Google Apps Script, Google Forms или сторонний form backend.
- Не переносим Google service account credential в GitHub Secrets или frontend.
- Не меняем структуру Google Sheets, spreadsheet ID, sheet name и состав RSVP payload.
- Не меняем тексты, дизайн, расписание, фотографии, маршруты `/` и `/banquet`.
- Не подключаем custom domain и не создаём репозиторий `KlinskiyDD.github.io`.
- Не коммитим `out/` и не создаём ветку `gh-pages`.
- Не добавляем в этой задаче Turnstile, rate limiting, guest tokens, уведомления или административную панель.
- Не выполняем несвязанный рефакторинг Worker или UI.

## 6. Предлагаемое решение (TO-BE)
### 6.1 Распределение ответственности
- `.github/workflows/deploy-pages.yml` -> build и deployment `out/` через GitHub Pages Actions.
- `next.config.ts` -> `output: "export"` плюс build-time `basePath` для Pages; Cloudflare build остаётся без prefix.
- `lib/public-path.ts` (новый) -> единственный helper для внутренних public asset URLs и RSVP endpoint fallback.
- `app/layout.tsx` -> передаёт base-path-aware CSS background URLs через CSS custom properties.
- `app/globals.css` -> использует CSS variables вместо абсолютных `url("/images/...")`.
- `content/wedding.ts` и компоненты с asset paths -> получают URL через общий helper.
- `components/Rsvp.tsx` -> выбирает `NEXT_PUBLIC_RSVP_API_URL` для Pages и `/api/rsvp` как совместимый fallback.
- `worker/cors.mjs` (новый) -> чистые функции разбора allowlist, проверки Origin, preflight и добавления CORS headers.
- `worker/index.js` -> применяет CORS-контракт только к `/api/rsvp`, сохраняя Google Sheets flow и static asset fallback.
- `wrangler.jsonc` -> хранит несекретную allowlist origin `https://klinskiydd.github.io`; Google credential остаётся secret.
- `tests/e2e/home.spec.ts` -> проверяет endpoint-agnostic RSVP UI flow и base-path-aware public links.
- `tests/worker/rsvp-cors.test.mjs` (новый) -> проверяет CORS business rules без реального Google API.
- `tests/deployment/pages-export.test.mjs` (новый) -> проверяет готовый `out/` на Pages prefix и запрещённые root-relative ссылки.
- `package.json` -> добавляет воспроизводимые test scripts для Worker CORS и Pages export audit.
- `README.md` -> описывает два deployment target, переменные сборки, порядок rollout и ручную проверку.

### 6.2 Детальный дизайн
#### GitHub Pages workflow
- Trigger: push в `main` и `workflow_dispatch`.
- Permissions: `contents: read`, `pages: write`, `id-token: write`.
- Concurrency group: `pages`, без отмены уже выполняющегося deployment.
- Build job:
  1. `actions/checkout`;
  2. `actions/setup-node` с Node.js 22 и npm cache;
  3. `npm ci`;
  4. `actions/configure-pages` для получения `base_path`;
  5. `npm run build` с одинаковым значением `PAGES_BASE_PATH` и `NEXT_PUBLIC_BASE_PATH`, а также с публичным HTTPS URL Worker в `NEXT_PUBLIC_RSVP_API_URL`;
  6. export audit;
  7. `actions/upload-pages-artifact` с `path: ./out`.
- Deploy job использует environment `github-pages`, зависит от build и вызывает `actions/deploy-pages`.
- В workflow не передаются `GOOGLE_SERVICE_ACCOUNT_JSON_B64`, Google access tokens или другие секреты Worker.
- Публичный Worker endpoint допускается хранить как несекретное значение workflow; если URL нельзя достоверно определить автоматически на EXEC, rollout останавливается до предоставления URL пользователем.

#### Base path и public assets
- `next.config.ts` читает `PAGES_BASE_PATH`; отсутствие/пустое значение означает корневой Cloudflare/local build.
- `NEXT_PUBLIC_BASE_PATH` в client/server-rendered коде получает то же значение.
- `publicAssetPath(path)`:
  - принимает только внутренний путь, начинающийся с `/`;
  - при пустом base path возвращает исходный путь;
  - при Pages build возвращает `/wedding-invitation${path}`;
  - не применяется к внешним `https:`, `mailto:`, `tel:` и hash-only ссылкам.
- Все текущие `/images/...` и `/calendar/...` в TS/TSX проходят через helper.
- CSS backgrounds получают полностью сформированные `url(...)` через custom properties, заданные в layout; CSS не выполняет хрупкую относительную навигацию от `/_next/static/css`.
- Export audit проходит по HTML/CSS/text output и запрещает непредусмотренные `src`, `href` и `url()` к корневым `/_next`, `/images`, `/calendar`.
- Навигационные anchors `#...` и внешние карты/Google Calendar не префиксуются.

#### RSVP endpoint selection
- `NEXT_PUBLIC_RSVP_API_URL` содержит полный HTTPS URL `.../api/rsvp` только в Pages build.
- При отсутствии переменной `Rsvp` использует `/api/rsvp`, сохраняя localhost и Cloudflare same-origin behavior.
- Значение публично и попадает в bundle; это ожидаемо, поскольку endpoint посещается браузером и не является секретом.
- Формат POST, content type, payload, сообщения успеха/ошибки и UI state не меняются.

#### Worker CORS contract
- Allowlist задаётся несекретной переменной `RSVP_ALLOWED_ORIGINS` в `wrangler.jsonc`; production включает точный origin `https://klinskiydd.github.io` без path.
- Разрешены:
  - same-origin запросы к текущему Worker host;
  - origin из allowlist;
  - запросы без `Origin` для совместимости с CLI/серверными клиентами.
- Явно присутствующий origin вне allowlist получает JSON `403` до разбора payload и обращения к Google.
- Для разрешённого preflight `OPTIONS /api/rsvp` Worker отвечает `204` с:
  - `Access-Control-Allow-Origin: <точный origin>`;
  - `Access-Control-Allow-Methods: POST, OPTIONS`;
  - `Access-Control-Allow-Headers: Content-Type`;
  - `Access-Control-Max-Age` с конечным значением;
  - `Vary: Origin`.
- Разрешённые POST success/error responses также получают точный `Access-Control-Allow-Origin` и `Vary: Origin`, чтобы browser мог прочитать JSON при 2xx/4xx/5xx.
- `Access-Control-Allow-Origin: *` и credentials mode не используются.
- CORS helper не хранит request state в module-level mutable data, не содержит секретов и не запускает floating promises.
- Static assets fallback `env.ASSETS.fetch(request)` не получает новые CORS headers и не меняет поведение.

#### Output contract / evidence rules
- Локальные проверки дают evidence для кода и generated export.
- `wrangler deploy --dry-run` подтверждает собираемость Worker без production side effect.
- Production evidence:
  - успешный Worker deployment URL;
  - успешный GitHub Pages Actions run;
  - HTTP 2xx для Pages `/` и `/banquet`;
  - отсутствие 404 для representative JS/CSS/image/ICS;
  - успешный preflight с origin `https://klinskiydd.github.io`;
  - браузерный RSVP smoke подтверждается пользователем или явно маркированной тестовой записью, если пользователь разрешит запись в production Sheet.
- Без разрешения не создаётся тестовая строка в production Google Sheet; автоматические проверки используют mocks/invalid payload, не доходящий до append.

#### Обработка ошибок
- Пустой Worker URL в Pages workflow -> build/deployment fail-fast с понятным сообщением.
- Некорректный public asset path -> helper/test fail, а не silent URL corruption.
- Disallowed origin -> `403` JSON без Google API call.
- Неподдерживаемый метод после CORS routing -> существующий `405` с `Allow: POST` сохраняется; `OPTIONS` обрабатывается отдельно.
- Google auth/append error -> текущий sanitized `500` сохраняется и становится читаемым cross-origin благодаря CORS headers.
- Failed Pages job не влияет на уже работающий Cloudflare deployment.

#### Производительность
- Дополнительный helper и CORS checks имеют пренебрежимо малую стоимость.
- GitHub Pages остаётся статическим CDN-хостингом; runtime Next.js server не добавляется.
- Новые CSS variables не добавляют сетевых запросов сверх уже существующих assets.
- Базовые performance-замеры до/после не требуются, потому что алгоритм рендеринга и состав ресурсов не меняются.

## 7. Бизнес-правила / Алгоритмы (если есть)
### Public path
| Build target | `PAGES_BASE_PATH` / `NEXT_PUBLIC_BASE_PATH` | `/images/x.png` становится |
| --- | --- | --- |
| Local / Cloudflare | пусто | `/images/x.png` |
| GitHub Pages project site | `/wedding-invitation` | `/wedding-invitation/images/x.png` |

### RSVP endpoint
| `NEXT_PUBLIC_RSVP_API_URL` | Endpoint |
| --- | --- |
| пусто/не задан | `/api/rsvp` |
| валидный HTTPS Worker URL | значение переменной |

### CORS origin decision
| `Origin` | Результат |
| --- | --- |
| отсутствует | разрешить для совместимости |
| равен origin текущего Worker URL | разрешить |
| `https://klinskiydd.github.io` | разрешить |
| любое другое явно заданное значение | `403`, без Google API call |

Инварианты:
- секрет Google никогда не используется в build/frontend;
- origin сравнивается целиком, без substring/regex matching;
- `/wedding-invitation` является path, а не частью CORS origin;
- Pages deployment всегда собирает новый artifact, а не публикует локальный `out/`.

## 8. Точки интеграции и триггеры
- Push в `main` -> GitHub Actions build -> export audit -> Pages deployment.
- `workflow_dispatch` -> тот же pipeline вручную.
- `next build` с Pages env -> base-path-aware export.
- `next build` без Pages env -> текущий Cloudflare-compatible export.
- Submit RSVP в GitHub Pages -> browser `OPTIONS` -> Worker CORS response -> browser `POST` -> Google Sheets append.
- Submit RSVP на Cloudflare origin -> same-origin POST -> прежний Google Sheets flow.
- Изменение Worker CORS/config -> `wrangler deploy` перед публикацией Pages.

## 9. Изменения модели данных / состояния
- RSVP payload и Google Sheets schema: без изменений.
- Новая persisted configuration:
  - `RSVP_ALLOWED_ORIGINS` в `wrangler.jsonc` — несекретная строка allowlist;
  - GitHub workflow с публичным Worker endpoint — несекретная build configuration.
- Новые calculated/build-time values:
  - `PAGES_BASE_PATH`;
  - `NEXT_PUBLIC_BASE_PATH`;
  - выбранный RSVP endpoint.
- Секрет `GOOGLE_SERVICE_ACCOUNT_JSON_B64`: без изменения значения и места хранения; в GitHub не копируется.

## 10. Миграция / Rollout / Rollback
### Rollout
1. Реализовать base path, endpoint selection, CORS и тесты локально.
2. Запустить полный локальный quality gate и Pages export audit.
3. Выполнить `wrangler deploy --dry-run`.
4. Убедиться, что Cloudflare production secret `GOOGLE_SERVICE_ACCOUNT_JSON_B64` существует, не читая и не выводя его значение.
5. Определить фактический HTTPS Worker URL и встроить его как публичную Pages build configuration.
6. Задеплоить Worker первым.
7. Проверить production preflight для GitHub origin и regression same-origin behavior без записи тестовой строки.
8. Commit/push изменений в `main`; push запускает Pages workflow.
9. Проверить Actions deployment, обе Pages routes, representative assets и `.ics`.
10. Выполнить браузерный RSVP smoke только с разрешённым способом проверки production записи.

### Обратная совместимость
- До Pages deployment текущий Cloudflare сайт продолжает работать.
- После изменений обычный `npm run build` без Pages env выдаёт прежние root-relative URLs.
- Относительный `/api/rsvp` остаётся fallback для Cloudflare/local flow.
- Google Sheets payload и ответы API не меняются.

### Rollback
- GitHub Pages: отменить/откатить проблемный commit или отключить Pages deployment; Cloudflare сайт остаётся независимым fallback.
- Worker: выбрать предыдущую успешную Worker version/deployment либо откатить commit и повторно задеплоить.
- При частичном rollout безопасный порядок такой:
  - Worker с CORS может работать до Pages без изменения существующего сайта;
  - Pages нельзя публиковать раньше Worker CORS;
  - rollback Pages не требует rollback Worker, поскольку дополнительный разрешённый origin не ломает same-origin flow.

## 11. Тестирование и критерии приёмки
### Acceptance Criteria
- [x] В репозитории существует Pages workflow с push/manual triggers, минимальными permissions, build и deploy jobs.
- [x] Workflow использует `actions/configure-pages` base path и публикует только `out/`.
- [x] `npm run build` без Pages env остаётся успешным и формирует root deployment для Cloudflare.
- [x] Pages build с `/wedding-invitation` успешен.
- [x] Export audit не находит непредусмотренных root-relative `/_next`, `/images` и `/calendar` ссылок.
- [ ] Главная и `/banquet` доступны на Pages; изображения, backgrounds, JS/CSS и оба `.ics` загружаются без 404.
- [x] Pages bundle отправляет RSVP на точный HTTPS Worker endpoint; local/Cloudflare build использует `/api/rsvp`.
- [x] Разрешённый GitHub origin получает корректный `OPTIONS 204` и CORS headers.
- [x] Разрешённые RSVP 2xx/4xx/5xx responses содержат читаемые браузером CORS headers.
- [x] Явно запрещённый origin получает `403`, а Google API не вызывается.
- [x] Same-origin и Origin-less API usage не регрессируют.
- [x] RSVP payload, Google Sheets target и пользовательские сообщения не изменились.
- [x] В GitHub workflow, client bundle и tracked files отсутствует `GOOGLE_SERVICE_ACCOUNT_JSON_B64` и его значение.
- [x] Lint, typecheck, Worker tests, Playwright, оба build modes и Wrangler dry-run проходят.
- [ ] Production Worker развёрнут до Pages, Pages Actions run успешен, post-deploy smoke evidence зафиксирован.

### Автоматические тесты
- Обновить Playwright:
  - сохранить текущие UI assertions;
  - mock должен перехватывать относительный и абсолютный `*/api/rsvp`;
  - проверить, что payload не изменился;
  - проверить base-path-aware Apple Calendar links в Pages-configured режиме либо в export audit.
- Добавить CORS unit/contract tests:
  - разрешённый GitHub origin;
  - same-origin;
  - Origin отсутствует;
  - disallowed origin;
  - allowed OPTIONS headers;
  - `Vary: Origin` на success/error decoration;
  - отсутствие wildcard.
- Добавить Pages export tests:
  - обязательные output files;
  - префикс `_next`, images и calendars;
  - отсутствие запрещённых root-relative ссылок;
  - наличие configured Worker endpoint в client output;
  - обе статические routes.

### Команды для проверки
```powershell
npm ci
npm run lint
npm run typecheck
npm run test:worker
npm run test:e2e
npm run build

$env:PAGES_BASE_PATH = '/wedding-invitation'
$env:NEXT_PUBLIC_BASE_PATH = '/wedding-invitation'
$env:NEXT_PUBLIC_RSVP_API_URL = '<FACTUAL_WORKER_HTTPS_URL>/api/rsvp'
npm run build
npm run test:pages-export
Remove-Item Env:PAGES_BASE_PATH, Env:NEXT_PUBLIC_BASE_PATH, Env:NEXT_PUBLIC_RSVP_API_URL

npx wrangler deploy --dry-run
```

Post-deploy read-only/safe smoke:
```powershell
Invoke-WebRequest -Uri 'https://klinskiydd.github.io/wedding-invitation/'
Invoke-WebRequest -Uri 'https://klinskiydd.github.io/wedding-invitation/banquet'

$headers = @{
  Origin = 'https://klinskiydd.github.io'
  'Access-Control-Request-Method' = 'POST'
  'Access-Control-Request-Headers' = 'content-type'
}
Invoke-WebRequest -Method Options -Headers $headers -Uri '<FACTUAL_WORKER_HTTPS_URL>/api/rsvp'
```

### Stop rules для validation loops
- Повторять проверку только после изменения затронутого слоя: asset paths, frontend endpoint, Worker CORS или workflow.
- Не заменять failing automated check визуальным предположением.
- Не делать production RSVP POST без согласованного способа удалить/пометить тестовую запись.
- Если Pages/Worker URL недоступен из execution environment, зафиксировать точную непроверенную acceptance criterion и передать пользователю минимальную ручную проверку.

## 12. Риски и edge cases
- Абсолютный asset path останется в редко используемом компоненте или CSS -> export audit по generated output, а не только source grep.
- `next/image` и обычные CSS URLs обрабатывают base path по-разному -> единый helper плюс CSS variables.
- Workflow получает пустой Worker URL -> fail-fast до deployment.
- Worker public URL отличается от предполагаемого `<name>.<subdomain>.workers.dev` -> использовать только URL из Wrangler deployment evidence, не угадывать account subdomain.
- CORS header присутствует на success, но отсутствует на validation/500 -> единая response decoration на всех `/api/rsvp` branches и contract tests.
- Allowlist ошибочно содержит `/wedding-invitation` -> тестирует точный origin без path.
- Cache смешивает CORS responses разных origins -> `Vary: Origin`.
- Pages build случайно становится default и ломает Cloudflare assets -> env-gated base path и отдельная root-build проверка.
- GitHub Pages deploy успешен, но `/banquet` direct navigation даёт 404 -> post-deploy direct URL smoke и при необходимости `trailingSlash` только если это подтвердит фактическое поведение Pages.
- Публичный репозиторий и Pages публикуют фотографии/контент всем посетителям -> это уже текущее состояние репозитория и ожидаемый характер приглашения; секретные данные не добавляются.
- CORS allowlist не предотвращает scripted abuse -> явно вне scope; возможный follow-up Turnstile/rate limiting после отдельного решения.
- GitHub/Cloudflare auth отсутствует локально -> код и dry-run могут быть подготовлены, production rollout останавливается с точной инструкцией пользователю.

## 13. План выполнения
1. Base-path outcome:
   - добавить env-gated config и общий public-path helper;
   - перевести TS/TSX и CSS assets;
   - получить успешные root и Pages builds.
2. Cross-origin RSVP outcome:
   - добавить configurable endpoint fallback во frontend;
   - выделить тестируемый CORS helper;
   - применить allowlist/preflight/headers ко всем RSVP responses.
3. Validation outcome:
   - обновить Playwright;
   - добавить Worker CORS и generated export tests;
   - пройти lint/typecheck/tests/build/dry-run.
4. Deployment automation outcome:
   - добавить официальный Pages workflow;
   - обновить README;
   - выполнить post-EXEC review.
5. Rollout outcome:
   - определить factual Worker URL;
   - Worker deploy и preflight smoke;
   - commit/push `main`, Pages Actions verification;
   - проверить routes/assets/form по acceptance contract.

## 14. Открытые вопросы
- Блокирующих продуктовых вопросов нет: выбран default GitHub Pages project URL без custom domain, существующий Worker остаётся backend.
- Операционный факт, определяемый на EXEC: фактический HTTPS URL Worker. Если Wrangler не авторизован и URL нельзя получить из deployment state, потребуется одно значение от пользователя до production rollout.
- Production запись для финального RSVP smoke выполняется только после явного согласования тестовой строки; до этого достаточны automated contract tests и live preflight.

## 15. Соответствие профилю
- Профиль: `frontend-spa-typescript`.
- Дополнительные применённые инструкции: Cloudflare platform skill и Workers best practices для CORS/config/secrets.
- Выполненные требования профиля:
  - изменение пользовательского RSVP flow покрывается Playwright;
  - endpoint/base path/CORS получают автоматические contract checks;
  - обязательны полный build, e2e, lint и typecheck;
  - существующие `data-testid` сохраняются;
  - Worker secret остаётся secret binding и не переносится в client/config vars.

## 16. Таблица изменений файлов
| Файл | Изменения | Причина |
| --- | --- | --- |
| `.github/workflows/deploy-pages.yml` | Новый build/deploy workflow | Автоматическая публикация Pages |
| `next.config.ts` | Env-gated `basePath` | Project-site URL без поломки Cloudflare build |
| `lib/public-path.ts` | Новый helper public paths/endpoint | Единый контракт URL |
| `app/layout.tsx` | Base-path-aware CSS asset variables | Корректные backgrounds на Pages |
| `app/globals.css` | Заменить root URLs на variables | Убрать обход Pages prefix |
| `content/wedding.ts` | Префикс внутренних image/calendar paths | Корректный content-driven asset routing |
| `components/Hero.tsx` | Применить helper к image | Pages assets |
| `components/Location.tsx` | Применить helper к images | Pages assets |
| `components/Rsvp.tsx` | Endpoint selection и asset paths | Cross-origin form + Pages assets |
| `components/Schedule.tsx` | Применить helper к icons | Pages assets |
| `components/VintageFrame.tsx` | Применить helper к decoration images | Pages assets |
| `worker/cors.mjs` | Новый чистый CORS contract | Тестируемый allowlist/preflight |
| `worker/index.js` | Интегрировать CORS в `/api/rsvp` | Разрешить форму с GitHub origin |
| `wrangler.jsonc` | Добавить несекретную allowed-origin config | Source of truth Worker config |
| `worker-configuration.d.ts` | Сгенерированные Wrangler binding types | Проверяемая синхронизация config/bindings |
| `tests/e2e/home.spec.ts` | Обновить RSVP/public-link assertions | UI regression coverage |
| `tests/worker/rsvp-cors.test.mjs` | Новые contract tests | CORS безопасность/совместимость |
| `tests/deployment/pages-export.test.mjs` | Новый generated-output audit | Поймать сломанные base paths |
| `package.json` | Test scripts и pinned Wrangler devDependency | Воспроизводимый quality gate и deployment CLI |
| `package-lock.json` | Lockfile после добавления Wrangler | Зафиксировать точную dependency graph |
| `eslint.config.mjs` | Исключить generated Wrangler types из lint | Убрать ложные warnings, не скрывая source code |
| `README.md` | Pages/Worker deployment docs | Операционный handoff |
| `specs/2026-07-13-github-pages-rsvp-deployment.md` | Эта спецификация и EXEC journal | QUEST audit trail |

Допустимо исключить конкретный компонент из diff, если source audit подтвердит отсутствие внутренних public paths; новые файлы вне этой таблицы требуют обновления спеки до изменения.

## 17. Таблица соответствий (было -> стало)
| Область | Было | Стало |
| --- | --- | --- |
| Hosting frontend | Cloudflare Worker static assets | Cloudflare остаётся совместимым; дополнительно GitHub Pages |
| Pages deployment | Не настроен workflow, URL 404 | Push в `main` автоматически публикует `out/` |
| App base path | Только `/` | Пустой для local/Cloudflare, `/wedding-invitation` для Pages |
| Public assets | Root-relative `/images`, `/calendar` | Build-target-aware paths |
| RSVP frontend | `/api/rsvp` | Full Worker URL на Pages, fallback `/api/rsvp` elsewhere |
| Worker CORS | Не реализован | Exact-origin allowlist + OPTIONS + headers на всех RSVP responses |
| Google secret | Только Cloudflare/local ignored file | Без изменений; не попадает в GitHub |
| Проверка deployment | Build/e2e без Pages artifact audit | Два build modes + export/CORS contract tests + live smoke |

## 18. Альтернативы и компромиссы
- Вариант: оставить весь сайт только на Cloudflare.
  - Плюсы: минимум изменений, same-origin RSVP.
  - Минусы: не достигает выбранной цели публикации на GitHub Pages.
  - Почему не выбран: пользователь уже включил GitHub Actions как Pages source и запросил соответствующую спецификацию.
- Вариант: GitHub Pages + Google Apps Script/Google Forms.
  - Плюсы: можно отказаться от Worker.
  - Минусы: новый backend, другой контракт/ошибки/секреты, миграция уже работающей записи в Sheets.
  - Почему не выбран: существующий Worker решает задачу с меньшим риском и изменением.
- Вариант: custom domain для Pages.
  - Плюсы: не нужен repository base path, красивый URL.
  - Минусы: DNS и дополнительный ручной rollout; custom domain сейчас не задан.
  - Почему не выбран: default Pages URL уже согласован; helper всё равно делает приложение переносимым.
- Вариант: публиковать `out/` в ветку `gh-pages`.
  - Плюсы: традиционный статический flow.
  - Минусы: generated files в Git, отдельная ветка, хуже auditability; GitHub рекомендует Actions artifact deployment.
  - Почему не выбран: `Source: GitHub Actions` уже включён и официальный Next.js example использует artifact deployment.
- Вариант: разрешить CORS wildcard.
  - Плюсы: минимальный код.
  - Минусы: любой browser origin сможет читать ответы; сложнее контролировать intended clients.
  - Почему не выбран: точный origin известен, поэтому allowlist объективно безопаснее без заметной стоимости.

## 19. Результат quality gate и review
### SPEC Linter — детальная проверка 1..20
| № | Проверка | Статус | Комментарий |
| --- | --- | --- | --- |
| 1 | Цель | PASS | Outcome сформулирован через рабочий Pages frontend и Worker RSVP. |
| 2 | AS-IS | PASS | Зафиксированы export, paths, Worker, tests и GitHub settings. |
| 3 | Корневая проблема | PASS | Одна проблема: допущение об одном root origin. |
| 4 | Цели дизайна | PASS | Разделение, совместимость, тестируемость и безопасность заданы. |
| 5 | Non-Goals | PASS | Hosting/API/content/security расширения ограничены. |
| 6 | Ответственность | PASS | Файлы и роли перечислены. |
| 7 | Интеграция | PASS | Описаны Actions, build env, browser preflight и Worker. |
| 8 | Бизнес-правила | PASS | Есть таблицы public path, endpoint и origin decision. |
| 9 | Ошибки | PASS | Fail-fast, 403/405/500 и failed deployment описаны. |
| 10 | Performance | PASS | Изменения не добавляют runtime server/network assets. |
| 11 | Данные | PASS | Payload/schema неизменны, новые config values классифицированы. |
| 12 | Миграция | PASS | Worker-first rollout задан по этапам. |
| 13 | Совместимость/rollback | PASS | Cloudflare fallback и независимый rollback сохранены. |
| 14 | Acceptance Criteria | PASS | Критерии измеримы и охватывают production outcome. |
| 15 | Тест-план | PASS | E2E, CORS contracts, export audit и smoke определены. |
| 16 | Команды | PASS | Локальные, dry-run и post-deploy команды приведены. |
| 17 | План этапов | PASS | Пять outcome-oriented этапов с зависимостями. |
| 18 | Открытые вопросы | PASS | Нет блокирующего выбора; Worker URL — discoverable operational fact. |
| 19 | Масштаб | PASS | Medium соответствует frontend + Worker + CI интеграции. |
| 20 | Профиль | PASS | Требования frontend и Worker skills отражены. |

### SPEC Linter Result
| Блок | Пункты | Статус | Комментарий |
|---|---|---|---|
| A. Полнота спеки | 1-5 | PASS | Цель, AS-IS, проблема, цели и границы полны. |
| B. Качество дизайна | 6-10 | PASS | Ответственность, интеграция, правила, ошибки и perf определены. |
| C. Безопасность изменений | 11-13 | PASS | Секреты, совместимость, rollout и rollback закрыты. |
| D. Проверяемость | 14-16 | PASS | AC, тесты и команды воспроизводимы. |
| E. Готовность к автономной реализации | 17-19 | PASS | План полный, блокирующего продуктового выбора нет. |
| F. Соответствие профилю | 20 | PASS | Frontend SPA и Cloudflare требования учтены. |

Итог: **ГОТОВО**

### SPEC Rubric Result
| Критерий | Балл (0/2/5) | Обоснование |
|---|---:|---|
| 1. Ясность цели и границ | 5 | Hosting outcome и Non-Goals однозначны. |
| 2. Понимание текущего состояния | 5 | Указаны конкретные configs, assets, API, tests и settings. |
| 3. Конкретность целевого дизайна | 5 | Определены build env, helper, workflow и CORS contract. |
| 4. Безопасность (миграция, откат) | 5 | Secret boundary, Worker-first rollout и независимый rollback заданы. |
| 5. Тестируемость | 5 | Generated output, Worker rules, UI и live preflight проверяемы. |
| 6. Готовность к автономной реализации | 5 | Файлы, этапы, команды и stop rules достаточны; URL discoverable. |

Итоговый балл: **30 / 30**
Зона: **готово к автономному выполнению**

### Post-SPEC Review
- Статус: PASS
- Что исправлено:
  - явно сохранена двойная совместимость GitHub Pages и текущего Cloudflare static deployment;
  - добавлен generated export audit, потому что source-only grep не гарантирует корректный Next.js output;
  - CORS headers распространены на validation и 500 responses, а не только на success;
  - rollout упорядочен Worker-first, чтобы исключить временно сломанную форму;
  - production Sheet smoke отделён от безопасных автоматических проверок, чтобы не создавать данные без согласования;
  - factual Worker URL запрещено угадывать по имени сервиса.
- Что осталось на решение пользователя: только утверждение спеки точной фразой `Спеку подтверждаю`.

### Post-EXEC Review
- Статус: PASS
- Что исправлено до завершения:
  - Wrangler закреплён в `devDependencies`, поэтому локальные и CI-команды используют одну версию;
  - после изменения `wrangler.jsonc` сгенерирован `worker-configuration.d.ts`;
  - generated Wrangler types исключены из ESLint после обнаружения двух ложных `eslint-disable` warnings;
  - generated export проверяется после Pages build, а root Cloudflare build повторно проверяется через Wrangler dry-run;
  - factual Worker URL подтверждён HTTP 200 текущего production deployment, а не угадан только по имени аккаунта.
- Что проверено дополнительно для refactor / comments:
  - unrelated UI/content/refactor отсутствуют;
  - `GOOGLE_SERVICE_ACCOUNT_JSON_B64` существует как Cloudflare secret, его значение не читалось и не попало в diff;
  - Worker не хранит request state глобально, все Promises awaited/returned, CORS применяется только к `/api/rsvp`;
  - startup analysis проходит; созданный diagnostic profile удалён из worktree.
- Остаточные риски / follow-ups:
  - `npm audit --omit=dev` сообщает о двух moderate advisory в bundled PostCSS текущего `next@16.2.9`; автоматический fix предлагает breaking downgrade, поэтому dependency upgrade вынесен из scope;
  - Playwright сообщает существующие LCP hints для декоративных изображений; функциональные тесты проходят, performance tuning не входит в эту задачу;
  - валидный live RSVP POST в production Google Sheet не выполняется без согласованной тестовой строки; вместо него production Worker проверен безопасным validation POST, который завершается до обращения к Google API.

## Approval
Получено: пользователь написал `Спеку подтверждаю`.

## 20. Журнал действий агента
| Фаза (SPEC/EXEC) | Тип намерения/сценария | Уверенность в решении (0.0-1.0) | Каких данных не хватает | Следующее действие | Нужна ли передача управления/решения человеку | Было ли фактическое обращение к человеку / решение человека | Короткое объяснение выбора | Затронутые артефакты/файлы |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SPEC | Собрать instruction stack и границы QUEST | 1.0 | Нет | Проанализировать hosting/API paths | Нет | Нет | Central template и SPEC gates обязательны для инфраструктурного изменения | `specs/2026-07-13-github-pages-rsvp-deployment.md` |
| SPEC | Зафиксировать AS-IS и deployment constraints | 0.98 | Фактический Worker URL будет получен на EXEC | Спроектировать TO-BE | Нет | Нет | Репозиторий уже static-export-ready, но требует base path и cross-origin API | `next.config.ts`, `components/Rsvp.tsx`, `worker/index.js`, `wrangler.jsonc`, `tests/e2e/home.spec.ts` |
| SPEC | Спроектировать Pages + Worker решение | 0.96 | Нет блокирующего продуктового выбора | Пройти linter/rubric/review | Нет | Нет | Split hosting сохраняет серверный secret boundary и текущий Google Sheets flow | Эта спецификация |
| SPEC | Выполнить SPEC linter, rubric и post-SPEC review | 0.97 | Требуется утверждение пользователя | Запросить фразу утверждения | Да | Нет | Спека получила 30/30, объективные review-находки встроены | Эта спецификация |
| SPEC | Выполнить финальный sanity-check структуры | 0.99 | Требуется утверждение пользователя | Передать спеку на approval | Да | Нет | Все canonical sections присутствуют, незаполненных template markers нет, вне спеки файлы не менялись | Эта спецификация |
| EXEC | Получить approval и начать реализацию | 1.0 | Нет | Загрузить EXEC/stack инструкции и реализовать base path | Нет | Да: пользователь написал `Спеку подтверждаю` | Единственный QUEST-гейт перехода в EXEC выполнен | Эта спецификация |
| EXEC | Сверить Next.js/Cloudflare/Wrangler требования | 0.98 | Нет | Закрепить Wrangler и прочитать полный Worker | Нет | Нет | Актуальные docs подтверждают build-time basePath, explicit image prefix, exact CORS preflight и secret binding boundary | `package.json`, `package-lock.json`, `worker/index.js`, `wrangler.jsonc` |
| EXEC | Реализовать переносимые public paths и RSVP endpoint | 0.97 | Нет | Реализовать Worker CORS | Нет | Нет | Единый build-time helper применяется к TS/TSX assets и CSS variables; root build, lint и typecheck проходят | `lib/public-path.ts`, `next.config.ts`, `app/layout.tsx`, `app/globals.css`, `content/wedding.ts`, `components/*.tsx` |
| EXEC | Реализовать CORS, workflow и автоматические проверки | 0.98 | Нет | Выполнить post-EXEC review | Нет | Нет | 7 CORS tests, 7 Playwright tests, Pages export audit, оба build modes и Wrangler dry-run проходят | `worker/cors.mjs`, `worker/index.js`, `wrangler.jsonc`, `.github/workflows/deploy-pages.yml`, `tests/**`, `README.md` |
| EXEC | Выполнить post-EXEC review и полный local gate | 0.98 | Live deployment evidence | Задеплоить Worker первым | Нет | Нет | Критичных отклонений нет; lint/typecheck/tests/build/dry-run/startup green, residual advisories задокументированы | Эта спецификация, `eslint.config.mjs`, `worker-configuration.d.ts` |
| EXEC | Развернуть Worker и выполнить production CORS smoke | 0.99 | GitHub Pages deployment | Commit/push `main` и проверить Actions | Нет | Нет | Wrangler asset-session transport завершался `fetch failed/terminated`; официальный Version Upload API с `keep_assets: true` безопасно переиспользовал текущие assets и унаследовал secret. Версия `8a3340f3-529b-4ded-9d80-d7528891741d` развёрнута на 100%; live smoke: preflight 204, allowed validation POST 400 с CORS, disallowed POST 403, static root 200. Локальные временные обходы удалены, `npm ci` восстановил зависимости | Cloudflare Worker deployment, эта спецификация |
