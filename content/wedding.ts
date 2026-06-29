export type ScheduleItem = {
  time: string;
  title: string;
  description: string;
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
};

export type WeddingContent = {
  couple: {
    names: string;
    headline: string;
    subtitle: string;
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
  faq: FaqItem[];
};

export const weddingContent: WeddingContent = {
  couple: {
    names: "Марина & Дмитрий",
    headline: "Приглашение на свадьбу Марины и Дмитрия",
    subtitle: "Будем рады видеть вас рядом в день нашей свадьбы",
  },
  event: {
    dateLabel: "22 августа 2026",
    dateShort: "22.08.2026",
    dayNumber: "22",
    monthLabel: "августа",
    timeLabel: "15:30",
    placeName: "Ресторан «Дворик»",
    address:
      "МО, Мытищинский городской округ, деревня Пирогово, ул. Центральная, д. 100Б",
    mapUrl: "https://dvorik-rest.ru/",
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
      "Какой алкоголь предпочитаете? В форме будет вариант «не пью».",
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
    },
    {
      time: "15:45",
      title: "Церемония",
      description: "Торжественная часть и первые поздравления.",
    },
    {
      time: "16:00",
      title: "Время для фотографий",
      description: "Несколько памятных кадров с родными и друзьями.",
    },
    {
      time: "18:00",
      title: "Ресторан",
      description: "Праздничный ужин, поздравления и вечерняя программа.",
    },
  ],
  dressCode: {
    title: "Стоп-цвета",
    description:
      "Просим избегать этих цветов в образах: красный, белый и total black.",
    stopColors: [
      {
        name: "Красный",
        value: "#b91c1c",
      },
      {
        name: "Белый",
        value: "#ffffff",
        border: "#d6ccbd",
      },
      {
        name: "Total black",
        value: "#111111",
      },
    ],
  },
  photoStory: {
    title: "Наши фотографии",
    description:
      "Мы добавим сюда любимые кадры Марины и Дмитрия после отбора фотографий.",
    photos: [],
  },
  faq: [
    {
      question: "Что подарить?",
      answer:
        "Если вы хотите сделать подарок, будем благодарны за вклад в бюджет нашей молодой семьи. Такой формат поможет нам исполнить общие планы после свадьбы.",
    },
    {
      question: "Что с цветами?",
      answer:
        "Будем признательны, если вместо большого количества цветов вы подарите бутылку вина. Так подарок не завянет и станет частью наших будущих уютных вечеров.",
    },
    {
      question: "Как подтвердить присутствие?",
      answer:
        "Мы подготовим персональные ссылки для каждого гостя после финального списка приглашенных.",
    },
  ],
};
