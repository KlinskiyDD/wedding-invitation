export type NavigationItem = {
  label: string;
  href: string;
};

export type ScheduleItem = {
  time: string;
  title: string;
  description: string;
  icon: "venue" | "rings" | "arch" | "glasses";
};

export type DressCodeStopColor = {
  name: string;
  value: string;
  border?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type PhotoItem = {
  src: string;
  alt: string;
  tone: "warm" | "cream" | "olive" | "sunset";
};

export type GuestFormContent = {
  attendance: string[];
  companions: string[];
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
    stopColors: DressCodeStopColor[];
  };
  photoStory: {
    title: string;
    description: string;
    photos: PhotoItem[];
  };
  guestForm: GuestFormContent;
  faq: FaqItem[];
};

export const weddingContent: WeddingContent = {
  navigation: [
    { label: "Приглашение", href: "#invitation" },
    { label: "Тайминг", href: "#timing" },
    { label: "Детали", href: "#details" },
    { label: "Анкета", href: "#rsvp" },
    { label: "FAQ", href: "#faq" },
  ],
  greeting: [
    "Дорогие гости!",
    "Совсем скоро в нашей жизни наступит один из самых счастливых дней — день, когда мы станем семьёй.",
    "Мы будем бесконечно рады, если вы разделите этот особенный момент вместе с нами и станете частью истории, которую мы только начинаем писать.",
    "С любовью приглашаем вас на день рождения нашей семьи!",
  ],
  couple: {
    names: "Дмитрий и Марина",
    headline: "Приглашение на свадьбу Марины и Дмитрия",
    subtitle: "Будем рады видеть вас рядом в день нашей свадьбы",
    groomName: "Дмитрий",
    brideName: "Марина",
    monogram: "Д | М",
  },
  event: {
    dateLabel: "22 августа 2026",
    dateShort: "22.08.2026",
    dayNumber: "22",
    monthLabel: "августа",
    timeLabel: "15:30",
    placeName: "Ресторан «Пироговский дворик»",
    address:
      "МО, Мытищинский городской округ, деревня Пирогово, ул. Центральная, д. 100Б",
    mapUrl:
      "https://yandex.ru/maps/?text=Ресторан%20Пироговский%20дворик%20Пирогово%20Центральная%20100Б",
    websiteUrl: "https://dvorik-rest.ru/",
    countdownTarget: "2026-08-22T15:30:00+03:00",
  },
  rsvp: {
    url: "",
    deadline: "Пожалуйста, подтвердите присутствие до 1 августа",
    description:
      "Позже мы отправим каждому гостю персональную ссылку для подтверждения.",
    questions: [
      "Придете ли вы на свадьбу?",
      "Поедете ли вы на роспись или приедете сразу на банкет?",
      "Какой алкоголь предпочитаете? В форме есть вариант «не пью».",
      "Какие продукты вы не едите?",
    ],
  },
  scheduleIntro:
    "Мы подготовили программу дня, чтобы вы заранее знали, как будет проходить наш праздник.",
  schedule: [
    {
      time: "15:30",
      title: "Сбор гостей",
      description: "Встречаемся, знакомимся и готовимся к началу торжества.",
      icon: "venue",
    },
    {
      time: "15:45",
      title: "Церемония",
      description: "Торжественная часть и первые поздравления.",
      icon: "rings",
    },
    {
      time: "16:00",
      title: "Время для фотографий",
      description: "Памятные кадры с родными и друзьями.",
      icon: "arch",
    },
    {
      time: "18:00",
      title: "Ресторан",
      description: "Праздничный ужин, поздравления и вечерняя программа.",
      icon: "glasses",
    },
  ],
  dressCode: {
    title: "Стоп-цвета",
    description:
      "Стоп-цвета: просим избегать в образах красного, белого и total black.",
    stopColors: [
      {
        name: "Красный",
        value: "#b44a3c",
      },
      {
        name: "Белый",
        value: "#ffffff",
        border: "#d8cabb",
      },
      {
        name: "Total black",
        value: "#18140f",
      },
    ],
  },
  photoStory: {
    title: "Наши фотографии",
    description:
      "Здесь будет место для любимых кадров Марины и Дмитрия.",
    photos: [
      { src: "", alt: "Первый кадр фотоленты", tone: "warm" },
      { src: "", alt: "Второй кадр фотоленты", tone: "cream" },
      { src: "", alt: "Третий кадр фотоленты", tone: "olive" },
      { src: "", alt: "Четвертый кадр фотоленты", tone: "sunset" },
    ],
  },
  guestForm: {
    attendance: ["С радостью приду!", "Не смогу присутствовать"],
    companions: ["Приду один(а)", "+1 спутник", "+2 спутника"],
    ceremony: ["Поеду на роспись", "Приеду сразу на банкет"],
    food: [
      "Мясо",
      "Птица",
      "Рыба",
      "Морепродукты",
      "Салаты",
      "Овощи",
      "Вегетарианское",
      "Диетическое",
    ],
    drinks: [
      "Шампанское",
      "Вино белое",
      "Вино красное",
      "Виски",
      "Водка",
      "Безалкогольное",
      "Не пью",
    ],
    submitMessage:
      "Персональная анкета будет доступна по вашей ссылке. Сейчас ответы не сохраняются.",
  },
  faq: [
    {
      question: "Будет ли трансфер?",
      answer:
        "Пока планируем, что гости добираются самостоятельно. Если решение изменится, мы заранее сообщим.",
    },
    {
      question: "Можно ли подарить подарок в конверте?",
      answer:
        "Да, мы будем благодарны за вклад в бюджет нашей молодой семьи.",
    },
    {
      question: "Что с цветами?",
      answer:
        "Будем признательны, если вместо большого количества цветов вы подарите бутылку вина.",
    },
    {
      question: "Где припарковаться?",
      answer:
        "У ресторана есть место для автомобилей. Лучше заложить немного времени на дорогу и парковку.",
    },
  ],
};
