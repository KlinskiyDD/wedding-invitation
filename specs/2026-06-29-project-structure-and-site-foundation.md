# Project Structure And Wedding Site Foundation

## 0. Метаданные
- Тип (профиль): `delivery-task`; stack profile `frontend-spa-typescript`; overlay profile `refactor-local`; context `testing-frontend`.
- Владелец: Dmitriy.
- Масштаб: large.
- Целевая модель: gpt-5.5.
- Целевой релиз / ветка: текущая ветка репозитория `wedding-invitation`; отдельный git commit/push выполняется только по явной просьбе пользователя.
- Ограничения:
  - Фаза `SPEC`: изменяется только этот файл в `./specs/`.
  - Фаза `EXEC`: начинать только после фразы пользователя `Спеку подтверждаю`.
  - Сохранить успешный Cloudflare deployment path: `next.config.ts` со static export, `wrangler.jsonc` с `assets.directory: "./out"`, build output `out`.
  - Не возвращаться к OpenNext/Workers SSR для текущего статического лендинга.
  - Следовать локальному `AGENTS.md`: перед изменением Next.js-кода читать релевантные guides из `node_modules/next/dist/docs/`.
- Связанные ссылки:
  - `C:\Users\Dmitriy\.codex\agents\templates\specs\_template.md`
  - `C:\Users\Dmitriy\.codex\agents\instructions\profiles\frontend-spa-typescript.md`
  - `C:\Users\Dmitriy\.codex\agents\instructions\profiles\refactor-local.md`
  - `C:\Users\Dmitriy\.codex\agents\instructions\contexts\testing-frontend.md`
  - `C:\Users\Dmitriy\.codex\agents\instructions\governance\refactoring-policy.md`

## 1. Overview / Цель
Привести свежий Next.js проект свадебного лендинга к понятной рабочей структуре и заменить дефолтный `create-next-app` шаблон на первую настоящую основу сайта: компонентный скелет, централизованный контент, базовые проверки и сохранённый Cloudflare static deploy.

Outcome contract:
- Success means:
  - корень репозитория однозначно является корнем Next.js приложения;
  - пустая/случайная вложенная папка `wedding-invitation/` удалена, если она всё ещё пуста;
  - дефолтный `Create Next App` контент, README и неиспользуемые public assets заменены или удалены;
  - сайт состоит из секций `Hero`, `Schedule`, `Location`, `Rsvp`, `Faq`, собранных в `app/page.tsx`;
  - изменяемые свадебные данные живут в `content/wedding.ts`;
  - проверки `lint`, `typecheck`, `build` и smoke e2e доступны через npm scripts;
  - `npx wrangler deploy --dry-run` продолжает читать static assets из `out`.
- Итоговый артефакт / output:
  - обновлённая структура проекта;
  - первая версия статического свадебного лендинга с placeholder-контентом, который легко заменить;
  - обновлённый README с локальными и Cloudflare-командами;
  - минимальный e2e smoke test для видимого пользовательского пути.
- Stop rules:
  - остановиться до реализации, если пользователь не написал `Спеку подтверждаю`;
  - остановиться и спросить пользователя, если `wedding-invitation/` окажется непустой или содержит неизвестные файлы;
  - остановиться и спросить пользователя, если для EXEC потребуется выбор между materially different визуальными направлениями;
  - остановиться перед завершением EXEC при падении `npm run lint`, `npm run typecheck`, `npm run build` или `npx wrangler deploy --dry-run`;
  - если e2e suite добавлен, не завершать EXEC с падающим smoke e2e.

## 2. Текущее состояние (AS-IS)
- Репозиторий уже приведён к схеме, где Next.js приложение находится в корне:
  - `app/page.tsx`
  - `app/layout.tsx`
  - `app/globals.css`
  - `public/*.svg`
  - `package.json`
  - `next.config.ts`
  - `wrangler.jsonc`
- В корне всё ещё есть пустая папка `wedding-invitation/`; Git её не трекает, но она создаёт когнитивный шум.
- `app/page.tsx` содержит дефолтный `create-next-app` экран с Next/Vercel ссылками.
- `app/layout.tsx` содержит дефолтные metadata: `Create Next App`.
- `README.md` содержит шаблонный текст Next.js и не фиксирует текущий Cloudflare deployment path.
- `package.json` содержит только `dev`, `build`, `start`, `lint`; отдельного `typecheck` и тестовых команд нет.
- `next.config.ts` уже настроен для static export:
  - `output: "export"`
  - `images.unoptimized: true`
- `wrangler.jsonc` уже настроен для успешного Cloudflare Workers static assets deploy:
  - `build.command: "npm run build"`
  - `assets.directory: "./out"`
- Hidden/generated директории `.next/`, `out/`, `.wrangler/`, `node_modules/` существуют локально и должны оставаться вне Git.
- Скрытая локальная зависимость: на машине есть `C:\Users\Dmitriy\package-lock.json`, из-за которого Next/Turbopack локально предупреждает о workspace root. На Cloudflare это не должно воспроизводиться, так как build идёт в `/opt/buildhome/repo`.

## 3. Проблема
Проект уже деплоится, но его внутренняя структура и содержимое всё ещё выглядят как стартовый шаблон, поэтому дальнейшая разработка свадебного сайта будет быстро смешивать контент, UI-секции, deployment-инварианты и проверочные команды в одном месте.

## 4. Цели дизайна
- Разделение ответственности:
  - `app/` отвечает за маршруты, layout и композицию страницы;
  - `components/` отвечает за визуальные секции;
  - `content/` отвечает за редактируемые свадебные данные;
  - `lib/` содержит только небольшие локальные utilities, если они реально используются.
- Повторное использование:
  - секции должны принимать данные или читать единый контентный объект, без дублирования строк по компонентам;
  - shared UI patterns должны оставаться простыми, без преждевременной component library.
- Тестируемость:
  - добавить `typecheck`;
  - добавить smoke e2e, который проверяет, что главная страница содержит ключевые секции и CTA;
  - сохранить `lint`, `build`, `wrangler dry-run`.
- Консистентность:
  - структура должна соответствовать обычному Next App Router проекту;
  - naming: PascalCase для компонентов, camelCase для данных, kebab-case для spec-файлов.
- Обратная совместимость:
  - URL `/` должен остаться рабочим;
  - Cloudflare deployment через `npx wrangler deploy` должен продолжить работать;
  - static export не должен получить серверные зависимости.

## 5. Non-Goals (чего НЕ делаем)
- Не добавляем RSVP backend, базу данных, Cloudflare D1/KV, Workers API или Server Actions.
- Не подключаем OpenNext, SSR, ISR, middleware/proxy или Next API routes.
- Не настраиваем custom domain, DNS, analytics, email, CAPTCHA или внешнюю форму без отдельной задачи.
- Не делаем финальный художественный дизайн на уровне production polish, если пользователь не предоставил реальные фото, палитру и тексты.
- Не меняем Cloudflare project settings из кода, кроме уже существующего `wrangler.jsonc`.
- Не делаем git commit/push автоматически без отдельного явного запроса.
- Не трогаем файлы вне границ этой спеки на фазе SPEC.

## 6. Предлагаемое решение (TO-BE)
### 6.1 Распределение ответственности
- `app/layout.tsx` -> глобальная HTML-оболочка, metadata, lang, fonts, body class.
- `app/page.tsx` -> композиция секций главной страницы, без крупных inline-блоков и hardcoded контента.
- `app/globals.css` -> базовые CSS variables, Tailwind import, global typography/background, responsive-safe defaults.
- `components/Hero.tsx` -> первый экран: имена, дата, место, основной CTA.
- `components/Schedule.tsx` -> тайминг дня.
- `components/Location.tsx` -> место проведения, адрес, ссылка на карту.
- `components/Rsvp.tsx` -> RSVP CTA; на первом этапе внешняя ссылка или placeholder.
- `components/Faq.tsx` -> вопросы и ответы: dress code, подарки, дети/плюс один, контакты.
- `content/wedding.ts` -> единый source of truth для имён, даты, места, расписания, RSVP URL, FAQ.
- `lib/cn.ts` -> маленький helper для className composition, только если class merging реально используется в нескольких местах.
- `public/images/` -> место для будущих реальных изображений; если пока нет изображений, добавить `.gitkeep` или не создавать папку до появления первого ассета.
- `tests/e2e/home.spec.ts` -> smoke e2e проверки главной страницы.
- `playwright.config.ts` -> локальная конфигурация e2e, которая поднимает dev server или проверяет production build в понятном режиме.
- `README.md` -> команды разработки, проверки, Cloudflare deploy path, структура проекта.

### 6.2 Детальный дизайн
- Потоки данных:
  - `content/wedding.ts` экспортирует typed object `weddingContent`.
  - `app/page.tsx` передаёт нужные части `weddingContent` в секции.
  - Секции не мутируют данные и не выполняют side effects.
- Контракты / API:
  - `weddingContent` должен быть обычным TypeScript объектом с типом `WeddingContent`.
  - Обязательные поля:
    - `couple.names`
    - `event.dateLabel`
    - `event.placeName`
    - `event.address`
    - `event.mapUrl`
    - `rsvp.url`
    - `schedule[]`
    - `faq[]`
  - Для placeholder-значений использовать очевидные временные тексты, например `Уточнить адрес`, без выдумывания персональных данных.
- Output contract / evidence rules:
  - Для EXEC финальный отчёт должен перечислить изменённые файлы и команды проверки.
  - Для visual/UI работы перед завершением выполнить хотя бы smoke verification: e2e или браузерная проверка локальной страницы, если dev server доступен.
- Границы сохранения поведения / допустимые изменения контракта:
  - Допустимо полностью заменить дефолтный Next экран на свадебный лендинг.
  - Недопустимо ломать static export и Cloudflare deploy.
  - Недопустимо добавлять серверные features, несовместимые с `output: "export"`.
- Обработка ошибок:
  - Если `rsvp.url` пустой, `Rsvp` должен показывать disabled/placeholder state без битой ссылки.
  - Внешние ссылки должны иметь `target="_blank"` и `rel="noreferrer"` или эквивалент.
  - Если карта/адрес не заданы, `Location` должен показывать нейтральный текст без runtime error.
- Производительность:
  - Не добавлять runtime animation libraries на этом этапе.
  - Не добавлять крупные изображения без оптимизации размера.
  - Сохранить static export; страница должна оставаться полностью статической.

## 7. Бизнес-правила / Алгоритмы (если есть)
- Сайт является публичным свадебным приглашением, поэтому контент должен быть редактируемым в одном месте.
- CTA RSVP должен быть видим в первом экране и повторяться в отдельной секции ниже.
- Дата, место и расписание должны быть представлены как пользовательский контент, а не как технические комментарии.
- Если точные данные свадьбы не предоставлены, использовать placeholder-контент и явно пометить его как требующий замены в `content/wedding.ts`.
- Никакие секреты, приватные телефоны или email не добавлять без явного предоставления пользователем.

## 8. Точки интеграции и триггеры
- Next App Router:
  - `/` рендерится через `app/page.tsx`.
  - metadata задаётся через `app/layout.tsx`.
- Static export:
  - `npm run build` создаёт `out/`.
  - `npx wrangler deploy` использует `wrangler.jsonc` и публикует `out/`.
- Проверки:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:e2e` или `npm run test:e2e:with-dev`, в зависимости от выбранной конфигурации
  - `npm run build`
  - `npx wrangler deploy --dry-run`

## 9. Изменения модели данных / состояния
- Новая локальная TypeScript модель контента:
  - `WeddingContent`
  - `ScheduleItem`
  - `FaqItem`
- Persisted state не добавляется.
- Runtime state не добавляется, кроме возможного UI state в будущих интерактивных компонентах; в этой спеки интерактивность ограничивается ссылками.
- Внешнее хранилище не используется.

## 10. Миграция / Rollout / Rollback
- Первый запуск:
  - после EXEC `npm install` может потребоваться, если добавляются e2e dev dependencies;
  - `npm run build` должен создать `out/`;
  - `npx wrangler deploy --dry-run` должен прочитать assets из `out/`.
- Rollout:
  - выполнить изменения локально;
  - пройти проверки;
  - после подтверждения пользователем выполнить commit/push отдельной командой, если пользователь попросит;
  - Cloudflare deploy выполнится из Git или вручную через `npx wrangler deploy`.
- Rollback:
  - откатить один commit или восстановить затронутые файлы из Git;
  - если ломается Cloudflare, первым делом вернуть прежние `next.config.ts` и `wrangler.jsonc`;
  - если e2e setup создаёт лишнюю сложность, можно временно удалить e2e dev dependencies/scripts, сохранив `lint/typecheck/build/wrangler dry-run` как minimum safety net только после отдельного согласования.
- Обратная совместимость:
  - public route `/` сохраняется;
  - Cloudflare static deploy сохраняется;
  - package manager остаётся `npm`, потому что в репозитории есть `package-lock.json`.

## 11. Тестирование и критерии приёмки
- Acceptance Criteria:
  - `app/page.tsx` не содержит дефолтный `Create Next App` экран.
  - `app/layout.tsx` содержит wedding-specific title/description и корректный `lang`, предпочтительно `ru`.
  - В проекте есть `components/` с секциями `Hero`, `Schedule`, `Location`, `Rsvp`, `Faq`.
  - В проекте есть `content/wedding.ts` с типизированным контентом.
  - README описывает структуру и команды `dev`, `lint`, `typecheck`, `build`, Cloudflare dry-run/deploy.
  - Пустая папка `wedding-invitation/` удалена, если она пустая; если непустая - EXEC останавливается.
  - Неиспользуемые дефолтные assets из `public/` удалены, если они больше не импортируются.
  - `next.config.ts` сохраняет `output: "export"` и `images.unoptimized: true`.
  - `wrangler.jsonc` сохраняет static assets deploy через `./out`.
  - Git status после EXEC содержит только ожидаемые изменения.
- Какие тесты добавить/изменить:
  - Добавить `typecheck`: `tsc --noEmit`.
  - Добавить Playwright smoke e2e для `/`:
    - страница открывается;
    - виден главный заголовок/имена;
    - видны секции расписания, места, RSVP и FAQ;
    - RSVP CTA имеет корректное состояние: ссылка, если URL задан; placeholder/disabled, если URL пустой.
  - Unit tests не добавлять на первом шаге, если бизнес-логики нет; при добавлении форматтеров/условной логики в следующих задачах добавить unit tests.
- Characterization tests / contract checks для текущего поведения:
  - До рефакторинга выполнить `npm run build`, чтобы зафиксировать, что static export работает.
  - После рефакторинга выполнить тот же build и `npx wrangler deploy --dry-run`.
- Базовые замеры до/после для performance tradeoff:
  - Не применимо: performance-оптимизация не является целью, tradeoff не вводится.
- Команды для проверки:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:e2e`
  - `npm run build`
  - `npx wrangler deploy --dry-run`
- Stop rules для test/retrieval/tool/validation loops:
  - не добавлять новые инструменты, если проверка покрывается существующими `eslint`, `tsc`, `next build`;
  - добавить Playwright только один раз как smoke e2e; не расширять suite beyond homepage smoke без отдельного решения;
  - если Playwright browser install недоступен локально, явно зафиксировать это в отчёте и выполнить `lint/typecheck/build/wrangler dry-run` как next-best checks;
  - если `wrangler dry-run` требует network/auth и падает не из-за проекта, сохранить лог и объяснить остаточный риск.

## 12. Риски и edge cases
- Риск: Cloudflare опять включит OpenNext auto-config.
  - Смягчение: сохранить явный `wrangler.jsonc` с `assets.directory`.
- Риск: статический экспорт сломается из-за будущих server-only Next features.
  - Смягчение: в spec и README зафиксировать запрет на Server Actions/API routes для текущего deploy mode.
- Риск: добавление e2e усложнит маленький проект.
  - Смягчение: один smoke test, без широкой матрицы браузеров на первом этапе.
- Риск: placeholder-контент случайно уйдёт в production.
  - Смягчение: пометить placeholder в `content/wedding.ts` и README; пользователь позже заменит данные отдельной задачей.
- Риск: пустая папка `wedding-invitation/` окажется непустой между SPEC и EXEC.
  - Смягчение: перед удалением перечитать её содержимое и остановиться при любых файлах.
- Риск: локальное предупреждение Turbopack про `C:\Users\Dmitriy\package-lock.json`.
  - Смягчение: не менять файлы вне репозитория; если предупреждение мешает, отдельной задачей настроить `turbopack.root` после проверки docs.

## 13. План выполнения
1. Baseline and guardrails:
   - проверить `git status --short -uall`;
   - прочитать релевантные Next docs из `node_modules/next/dist/docs/` перед изменением Next-кода;
   - выполнить baseline `npm run build`.
2. Project cleanup:
   - проверить, что `wedding-invitation/` пустая, и удалить её;
   - удалить неиспользуемые default public SVG после замены страницы;
   - оставить generated dirs игнорируемыми.
3. Content and components:
   - создать `content/wedding.ts` с typed placeholder content;
   - создать секции `Hero`, `Schedule`, `Location`, `Rsvp`, `Faq`;
   - собрать секции в `app/page.tsx`.
4. Layout and global styles:
   - обновить metadata и `html lang`;
   - привести `app/globals.css` к базовой дизайн-системе без сложных декоративных слоёв.
5. Quality scripts and tests:
   - добавить `typecheck`;
   - добавить минимальный Playwright smoke e2e и npm script;
   - обновить lockfile через `npm install`, если появляются dev dependencies.
6. Documentation:
   - обновить `README.md` с commands, structure, deployment notes и placeholder-content note.
7. Validation:
   - выполнить `npm run lint`;
   - выполнить `npm run typecheck`;
   - выполнить `npm run test:e2e`;
   - выполнить `npm run build`;
   - выполнить `npx wrangler deploy --dry-run`.
8. Post-EXEC review:
   - проверить, что diff не содержит скрытого SSR/OpenNext перехода;
   - проверить, что default template удалён;
   - проверить, что README не обещает несуществующие команды;
   - при найденных критичных проблемах исправить и повторить затронутые проверки.

## 14. Открытые вопросы
- Нет блокирующих вопросов для структурной реализации.
- Неблокирующие вопросы для будущего контентного этапа:
  - реальные имена пары;
  - дата и время;
  - адрес и ссылка на карту;
  - RSVP ссылка;
  - фото/визуальный стиль;
  - финальный текст FAQ.

## 15. Соответствие профилю
- Профиль:
  - `frontend-spa-typescript`
  - `refactor-local`
  - `testing-frontend`
- Выполненные требования профиля:
  - TypeScript структура сохраняется, npm остаётся package manager.
  - Изменение UI flow покрывается smoke e2e.
  - Перед завершением EXEC обязательны `lint`, `typecheck`, `build`, e2e smoke и Cloudflare dry-run.
  - Refactor отделён от функционального поведения: структура и компоненты меняются отдельно от deployment-инвариантов.
  - Минимальная страховка: baseline build до изменений, затем повтор build/dry-run/e2e после.
  - Изменения выполняются малыми этапами, каждый этап проверяем по diff.

## 16. Таблица изменений файлов
| Файл | Изменения | Причина |
| --- | --- | --- |
| `specs/2026-06-29-project-structure-and-site-foundation.md` | Рабочая спецификация | SPEC-first gate перед реализацией |
| `wedding-invitation/` | Удалить, если пустая | Убрать случайную вложенную структуру |
| `app/page.tsx` | Заменить дефолтный экран на композицию секций | Создать реальный landing page |
| `app/layout.tsx` | Обновить metadata/lang/body defaults | Убрать template identity |
| `app/globals.css` | Базовые tokens/layout styles | Консистентный визуальный фундамент |
| `components/Hero.tsx` | Новый компонент | Первый экран |
| `components/Schedule.tsx` | Новый компонент | Расписание |
| `components/Location.tsx` | Новый компонент | Место и карта |
| `components/Rsvp.tsx` | Новый компонент | RSVP CTA |
| `components/Faq.tsx` | Новый компонент | FAQ |
| `content/wedding.ts` | Новый typed content module | Единый source of truth для текста |
| `lib/cn.ts` | Новый helper, если реально используется | Упростить className composition |
| `public/*.svg` | Удалить неиспользуемые default assets | Убрать template мусор |
| `public/images/` | Создать при наличии ассетов или `.gitkeep` | Подготовить место для будущих изображений |
| `README.md` | Переписать под проект | Документировать структуру, команды и deploy |
| `package.json` | Добавить `typecheck`, e2e scripts и dev deps при необходимости | Проверяемость |
| `package-lock.json` | Обновить при добавлении dev deps | Зафиксировать npm dependency graph |
| `playwright.config.ts` | Новый файл при добавлении e2e | Smoke verification |
| `tests/e2e/home.spec.ts` | Новый smoke test | Проверить ключевой user-facing flow |
| `next.config.ts` | Сохранить static export; менять только при необходимости | Deployment invariant |
| `wrangler.jsonc` | Сохранить assets deploy; менять только при необходимости | Cloudflare invariant |

## 17. Таблица соответствий (было -> стало)
| Область | Было | Стало |
| --- | --- | --- |
| Корень проекта | Next app в корне, но есть пустая `wedding-invitation/` | Однозначный корень без пустой вложенной папки |
| Главная страница | Default `Create Next App` | Свадебный лендинг из секций |
| Контент | Hardcoded template text в компоненте | Typed `content/wedding.ts` |
| Компоненты | Всё в `app/page.tsx` | `components/*` по секциям |
| Public assets | Default Next/Vercel SVG | Только используемые assets; будущие images в `public/images/` |
| Проверки | `lint`, `build` | `lint`, `typecheck`, e2e smoke, `build`, `wrangler dry-run` |
| Deploy | Рабочий static Cloudflare через Wrangler | Сохранён и задокументирован |
| README | Next template | Проектные команды и структура |

## 18. Альтернативы и компромиссы
- Вариант: оставить всё в `app/page.tsx`.
  - Плюсы: меньше файлов.
  - Минусы: быстро смешает контент, layout и секции; сложнее менять текст и проверять diff.
  - Почему выбранное решение лучше в контексте этой задачи: свадебный лендинг естественно делится на секции; отдельные компоненты уменьшают риск случайных правок.
- Вариант: сразу делать полноценную дизайн-систему.
  - Плюсы: масштабируемость.
  - Минусы: избыточно для одного лендинга, добавляет абстракции без проверенной необходимости.
  - Почему выбранное решение лучше: лёгкая компонентная структура даёт порядок без лишней архитектуры.
- Вариант: использовать Cloudflare Pages вместо Wrangler Workers static assets.
  - Плюсы: проще conceptual model для static site.
  - Минусы: текущий Cloudflare деплой уже успешно прошёл через `wrangler deploy`; смена режима сейчас лишняя.
  - Почему выбранное решение лучше: сохраняем работающий deployment path и не добавляем операционный риск.
- Вариант: не добавлять e2e.
  - Плюсы: меньше зависимостей.
  - Минусы: UI flow меняется существенно; нет автоматической защиты от пустой/сломавшейся страницы.
  - Почему выбранное решение лучше: один smoke e2e покрывает главную ценность без тяжёлой тестовой матрицы.

## 19. Результат quality gate и review
### SPEC Linter Result
| Блок | Пункты | Статус | Комментарий |
|---|---|---|---|
| A. Полнота спеки | 1-5 | PASS | Цель, AS-IS, проблема, цели дизайна и Non-Goals заполнены. |
| B. Качество дизайна | 6-10 | PASS | Ответственности, данные, интеграции, rollout и rollback описаны. |
| C. Безопасность изменений | 11-13 | PASS | Есть safety net, этапы, rollback, Cloudflare invariants и stop rules. |
| D. Проверяемость | 14-16 | PASS | Acceptance Criteria, тесты и команды проверки перечислены. |
| E. Готовность к автономной реализации | 17-19 | PASS | План по этапам, tradeoffs и review зафиксированы; блокирующих вопросов нет. |
| F. Соответствие профилю | 20 | PASS | Frontend/TypeScript, local refactor и testing требования отражены. |

Итог: ГОТОВО

### SPEC Rubric Result
| Критерий | Балл (0/2/5) | Обоснование |
|---|---:|---|
| 1. Ясность цели и границ | 5 | Область включает структуру, стартовый сайт, проверки и docs; Non-Goals явные. |
| 2. Понимание текущего состояния | 5 | AS-IS основан на текущих файлах, Cloudflare config и локальном предупреждении Turbopack. |
| 3. Конкретность целевого дизайна | 5 | Файлы, ответственности, контентный контракт и компоненты перечислены. |
| 4. Безопасность (миграция, откат) | 5 | Rollout/rollback, deployment invariants и stop rules описаны. |
| 5. Тестируемость | 5 | Есть `lint`, `typecheck`, e2e smoke, `build`, `wrangler dry-run`. |
| 6. Готовность к автономной реализации | 5 | План этапов и действия при неопределённости зафиксированы. |

Итоговый балл: 30 / 30
Зона: готово к автономному выполнению

### Post-SPEC Review
- Статус: PASS
- Что исправлено:
  - Добавлен явный stop rule для непустой `wedding-invitation/`.
  - Уточнено, что реальные свадебные данные являются неблокирующими и заменяются placeholder-контентом.
  - Добавлен smoke e2e как safety net для UI flow, чтобы соблюсти frontend/testing профиль.
  - Зафиксировано сохранение Cloudflare static deploy через `wrangler.jsonc`, чтобы не уйти обратно в OpenNext.
- Что осталось на решение пользователя:
  - Только подтверждение спеки фразой `Спеку подтверждаю`.
  - Реальные тексты, дата, адрес, RSVP и фото можно передать позже отдельным контентным этапом.

### Post-EXEC Review
- Статус: PASS WITH FOLLOW-UP
- Что исправлено до завершения:
  - Убран `create-next-app` экран и default public SVG assets.
  - Добавлены typed content module, секции лендинга и hero bitmap asset.
  - Добавлены `typecheck`, Playwright smoke e2e и игнор Playwright artifacts.
  - Уточнён `next.config.ts` через `turbopack.root`, чтобы убрать локальное предупреждение о workspace root.
  - Проверен Cloudflare static deploy path через `npx wrangler deploy --dry-run`.
- Что проверено дополнительно для refactor / comments:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:e2e`
  - `npm run build`
  - `npx wrangler deploy --dry-run`
  - desktop/mobile screenshots через Playwright; static mobile screenshot из `out/`
  - `git diff --check`
- Остаточные риски / follow-ups:
  - Папка `wedding-invitation/` пустая и не трекается Git, но Windows держит её открытой внешним процессом; удалить вручную после перезапуска терминала/проводника.
  - `npm audit --omit=dev` показывает 2 moderate advisories в `next` -> bundled `postcss`; `npm audit fix --force` предлагает downgrade до `next@9.3.3`, поэтому автофикс не применялся.
  - Реальные свадебные данные, карта, RSVP URL и финальные фото нужно заменить в отдельном контентном проходе.

## Approval
Ожидается фраза: "Спеку подтверждаю"

## 20. Журнал действий агента
Заполняется инкрементально после каждого значимого блока работ. Одна строка = один завершённый значимый блок.

| Фаза (SPEC/EXEC) | Тип намерения/сценария | Уверенность в решении (0.0-1.0) | Каких данных не хватает | Следующее действие | Нужна ли передача управления/решения человеку | Было ли фактическое обращение к человеку / решение человека | Короткое объяснение выбора | Затронутые артефакты/файлы |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SPEC | Собрать instruction stack | 0.98 | Нет | Сформировать спеку | Нет | Нет | Прочитаны центральные QUEST, frontend, testing и refactor правила; локального override нет. | `C:\Users\Dmitriy\.codex\agents\...`, `AGENTS.md` |
| SPEC | Проанализировать AS-IS | 0.95 | Нет | Создать рабочий spec-файл | Нет | Нет | Проверены текущие файлы, package scripts, пустая вложенная папка и Cloudflare config. | `app/*`, `package.json`, `next.config.ts`, `wrangler.jsonc`, `README.md` |
| SPEC | Создать и self-review спецификацию | 0.93 | Нужны реальные свадебные данные для будущего контентного этапа, но они не блокируют структуру | Ожидать подтверждение пользователя | Да | Нет | Спека содержит план, критерии, риски, проверки и post-SPEC review; реализация запрещена до подтверждения. | `specs/2026-06-29-project-structure-and-site-foundation.md` |
| EXEC | Baseline и визуальный asset | 0.92 | Нет | Создать основной UI-слой | Нет | Да: пользователь подтвердил спеку | Выполнен baseline build, прочитаны Next docs, сгенерирован и сжат hero bitmap для сайта. | `public/images/wedding-flatlay.jpg`, `node_modules/next/dist/docs/...` |
| EXEC | Контент и компоненты | 0.9 | Нет | Добавить проверки и e2e | Нет | Нет | Дефолтный Next экран заменён на секции, контент вынесен в typed module, unused default SVG удалены. | `content/wedding.ts`, `components/*`, `app/*`, `public/*.svg` |
| EXEC | Проверки и документация | 0.92 | Нет | Выполнить post-EXEC review | Нет | Нет | Добавлены `typecheck`, Playwright smoke e2e, README и ignore для test artifacts; проверки прошли. | `package.json`, `package-lock.json`, `playwright.config.ts`, `tests/e2e/home.spec.ts`, `README.md`, `.gitignore` |
| EXEC | Post-EXEC review | 0.88 | Нет для кода; реальные свадебные данные нужны позже | Завершить задачу и отчитаться | Нет | Нет | Проверены diff, визуальные screenshots, Cloudflare dry-run и остаточные риски; пустая локальная папка заблокирована Windows, но не влияет на Git/deploy. | `specs/2026-06-29-project-structure-and-site-foundation.md`, `test-results/visual/*` |
