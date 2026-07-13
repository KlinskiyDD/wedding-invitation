import { publicAssetPath } from "@/lib/public-path";

export type NavigationItem = {
  label: string;
  href: string;
};

export type ScheduleItem = {
  time: string;
  title: string;
  description: string;
  icon:
    | "rings"
    | "heart"
    | "glasses"
    | "cloche"
    | "dance"
    | "finale"
    | "guestGathering"
    | "ceremony"
    | "photoshoot";
};

export type DressCodeColor = {
  name: string;
  value: string;
  border?: string;
  texture?: "speckled";
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type PhotoItem = {
  src: string;
  alt: string;
  tone: "couple" | "field" | "portrait" | "walk" | "kiss";
};

export type CalendarLinks = {
  label: string;
  googleUrl: string;
  appleUrl: string;
};

export type GuestFormContent = {
  attendance: string[];
  ceremony: string[];
  food: string[];
  drinks: string[];
  submitMessage: string;
};

export type WeddingContent = {
  navigation: NavigationItem[];
  greeting: string[];
  couple: {
    names: string;
    headline: string;
    subtitle: string;
    groomName: string;
    brideName: string;
    monogram: string;
  };
  event: {
    dateLabel: string;
    dateShort: string;
    dayNumber: string;
    monthLabel: string;
    timeLabel: string;
    placeName: string;
    address: string;
    mapUrl: string;
    websiteUrl: string;
    countdownTarget: string;
    calendar: CalendarLinks;
  };
  rsvp: {
    url: string;
    deadline: string;
    description: string;
    questions: string[];
  };
  scheduleIntro: string;
  schedule: ScheduleItem[];
  dressCode: {
    title: string;
    description: string;
    preferredDescription: string;
    avoidDescription: string;
    preferredColors: DressCodeColor[];
    stopColors: DressCodeColor[];
  };
  photoStory: {
    title: string;
    description: string;
    photos: PhotoItem[];
  };
  guestForm: GuestFormContent;
  faq: FaqItem[];
};

const eventAddress =
  "Московская область, Мытищинский район, д. Пирогово, ул. Центральная, 100Б";

const googleCalendarUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams(
  {
    action: "TEMPLATE",
    text: "Свадьба Дмитрия и Марины",
    dates: "20260822T153000/20260822T233000",
    ctz: "Europe/Moscow",
    details:
      "Сбор гостей и приветственный фуршет в 15:30. Ресторан «Пироговский дворик».",
    location: eventAddress,
  },
).toString()}`;

const banquetGoogleCalendarUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams(
  {
    action: "TEMPLATE",
    text: "Свадьба Дмитрия и Марины",
    dates: "20260822T180000/20260823T000000",
    ctz: "Europe/Moscow",
    details:
      "Начало праздничного банкета в 18:00. Ресторан «Пироговский дворик».",
    location: eventAddress,
  },
).toString()}`;

export const weddingContent: WeddingContent = {
  navigation: [
    { label: "ГЛАВНАЯ", href: "#invitation" },
    { label: "ТАЙМИНГ", href: "#timing" },
    { label: "МЕСТО", href: "#place" },
    { label: "ДРЕСС-КОД", href: "#dress-code" },
    { label: "FAQ", href: "#faq" },
    { label: "АНКЕТА ГОСТЯ", href: "#rsvp" },
  ],
  greeting: [
    "Дорогие гости!",
    "Совсем скоро в нашей жизни наступит один из самых счастливых дней — день, когда мы станем семьёй.",
    "Мы будем бесконечно рады, если вы разделите этот особенный момент вместе с нами и станете частью истории, которую мы только начинаем писать.",
    "С любовью приглашаем вас на день рождения нашей семьи!",
  ],
  couple: {
    names: "Дмитрий и Марина",
    headline: "Дмитрий и Марина",
    subtitle:
      "Мы создаём день, полный любви и радости, и будем счастливы разделить его с вами!",
    groomName: "Дмитрий",
    brideName: "Марина",
    monogram: "Д / М",
  },
  event: {
    dateLabel: "22 августа 2026",
    dateShort: "22.08.2026",
    dayNumber: "22",
    monthLabel: "августа",
    timeLabel: "15:30",
    placeName: "Ресторан «Пироговский дворик»",
    address: eventAddress,
    mapUrl:
      "https://yandex.ru/maps/?text=Ресторан%20Пироговский%20дворик%20Пирогово%20Центральная%20100Б",
    websiteUrl: "https://dvorik-rest.ru/",
    countdownTarget: "2026-08-22T15:30:00+03:00",
    calendar: {
      label: "Добавить в календарь",
      googleUrl: googleCalendarUrl,
      appleUrl: publicAssetPath("/calendar/dmitriy-marina-wedding.ics"),
    },
  },
  rsvp: {
    url: "",
    deadline:
      "Пожалуйста, подтвердите своё присутствие до 22 июля 2026 года.",
    description:
      "Ответы из анкеты сохраняются в список гостей.",
    questions: [
      "Подтверждаю участие",
      "Предпочтение по еде",
      "Ограничения по блюдам / аллергии",
      "Предпочтение по алкоголю",
    ],
  },
  scheduleIntro: "Мы будем рядом на каждом этапе этого особенного дня.",
  schedule: [
    {
      time: "15:30",
      title: "Сбор гостей у ЗАГСА",
      description: "",
      icon: "guestGathering",
    },
    {
      time: "15:45",
      title: "Церемония",
      description: "бракосочетания",
      icon: "ceremony",
    },
    {
      time: "16:00",
      title: "Фотосессия",
      description: "",
      icon: "photoshoot",
    },
    {
      time: "18:00",
      title: "Начало праздничного банкета",
      description: "",
      icon: "cloche",
    },
  ],
  dressCode: {
    title: "Дресс-код",
    description:
      "Мы не вводим дресс-код — приходите так, как вам комфортно и красиво",
    preferredDescription:
      "Нежные природные оттенки для гостей:",
    avoidDescription:
      "Единственное пожелание:\nизбегать белого, Total Black и ярко-красного цветов",
    preferredColors: [],
    stopColors: [
      { name: "Белый", value: "#ffffff", border: "#bcae99" },
      { name: "Чёрный", value: "#020604" },
      { name: "Красный", value: "#c9161c" },
    ],
  },
  photoStory: {
    title: "Наша история в кадрах",
    description:
      "Место для любимых фотографий Марины и Дмитрия.",
    photos: [
      {
        src: publicAssetPath("/images/couple/couple-mirror-hall.jpg"),
        alt: "Дмитрий и Марина в зеркальном зале",
        tone: "portrait",
      },
      {
        src: publicAssetPath("/images/couple/couple-studio-seated.jpg"),
        alt: "Дмитрий и Марина в студии",
        tone: "field",
      },
      {
        src: publicAssetPath("/images/couple/couple-sofa-selfie.jpg"),
        alt: "Дмитрий и Марина на уютном селфи",
        tone: "couple",
      },
      {
        src: publicAssetPath("/images/couple/couple-lake-view.jpg"),
        alt: "Дмитрий и Марина на прогулке у воды",
        tone: "walk",
      },
      {
        src: publicAssetPath("/images/couple/couple-helicopter-ring.jpg"),
        alt: "Дмитрий и Марина с помолвочным кольцом",
        tone: "kiss",
      },
    ],
  },
  guestForm: {
    attendance: ["Подтверждаю участие", "Не смогу присутствовать"],
    ceremony: ["Поеду на роспись", "Приеду сразу на банкет"],
    food: [
      "Без предпочтений",
      "Мясо",
      "Птица",
      "Рыба",
      "Морепродукты",
      "Вегетарианское",
    ],
    drinks: [
      "Без предпочтений",
      "Шампанское",
      "Вино белое",
      "Вино красное",
      "Виски",
      "Водка",
      "Безалкогольное",
      "Не пью",
    ],
    submitMessage:
      "Спасибо! Ваш ответ сохранён.",
  },
  faq: [
    {
      question: "Можно ли взять с собой плюс-один?",
      answer:
        "Пожалуйста, согласуйте это с нами заранее, чтобы мы корректно подготовили рассадку и банкет.",
    },
    {
      question: "Во сколько завершится мероприятие?",
      answer:
        "Мероприятие завершится в 00:00. Основная программа продлится до позднего вечера, а последний час мы проведём в формате дискотеки с диджеем — чтобы красиво и весело завершить этот день.",
    },
    {
      question: "Будет ли трансфер?",
      answer:
        "Пока гости добираются самостоятельно. Если появится общий трансфер, мы заранее сообщим детали.",
    },
    {
      question: "Есть ли парковка на территории?",
      answer:
        "У ресторана есть место для автомобилей. Лучше заложить немного времени на дорогу и парковку.",
    },
    {
      question: "Можно ли подарить подарок в конверте?",
      answer:
        "Да, мы будем благодарны за вклад в бюджет нашей молодой семьи.",
    },
    {
      question: "Что делать, если у меня аллергия / ограничения в еде?",
      answer:
        "Укажите это в анкете гостя, и мы постараемся учесть ваши пожелания при согласовании меню.",
    },
  ],
};

export const banquetWeddingContent: WeddingContent = {
  ...weddingContent,
  event: {
    ...weddingContent.event,
    timeLabel: "18:00",
    countdownTarget: "2026-08-22T18:00:00+03:00",
    calendar: {
      ...weddingContent.event.calendar,
      googleUrl: banquetGoogleCalendarUrl,
      appleUrl: publicAssetPath(
        "/calendar/dmitriy-marina-wedding-banquet.ics",
      ),
    },
  },
  schedule: [
    {
      time: "18:00",
      title: "Начало праздничного банкета",
      description: "",
      icon: "cloche",
    },
    {
      time: "23:00",
      title: "Танцы",
      description: "",
      icon: "dance",
    },
    {
      time: "00:00",
      title: "Завершение вечера",
      description: "",
      icon: "finale",
    },
  ],
};
