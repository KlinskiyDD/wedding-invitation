export type ScheduleItem = {
  time: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type WeddingContent = {
  couple: {
    names: string;
    subtitle: string;
  };
  event: {
    dateLabel: string;
    timeLabel: string;
    placeName: string;
    address: string;
    mapUrl: string;
  };
  rsvp: {
    url: string;
    deadline: string;
  };
  schedule: ScheduleItem[];
  faq: FaqItem[];
};

export const weddingContent: WeddingContent = {
  couple: {
    names: "Анна & Дмитрий",
    subtitle: "Будем счастливы разделить с вами день нашей свадьбы",
  },
  event: {
    dateLabel: "24 августа 2026",
    timeLabel: "16:00",
    placeName: "Усадьба у воды",
    address: "Адрес будет уточнен в финальном приглашении",
    mapUrl: "",
  },
  rsvp: {
    url: "",
    deadline: "Пожалуйста, подтвердите присутствие до 1 августа",
  },
  schedule: [
    {
      time: "16:00",
      title: "Сбор гостей",
      description: "Встречаемся, знакомимся и настраиваемся на вечер.",
    },
    {
      time: "16:30",
      title: "Церемония",
      description: "Короткая выездная церемония и первые поздравления.",
    },
    {
      time: "17:30",
      title: "Ужин",
      description: "Тосты, музыка, теплые истории и много общения.",
    },
    {
      time: "20:00",
      title: "Вечерняя программа",
      description: "Танцы, торт и финальные фотографии дня.",
    },
  ],
  faq: [
    {
      question: "Что с дресс-кодом?",
      answer:
        "Будем рады спокойным праздничным оттенкам: молочный, шалфейный, пудровый, графитовый. Главное - чтобы вам было комфортно.",
    },
    {
      question: "Можно ли прийти с детьми?",
      answer:
        "Мы уточним формат ближе к дате. Если для вас это важно, напишите нам заранее.",
    },
    {
      question: "Что подарить?",
      answer:
        "Самый удобный подарок - в конверте. Ваше присутствие для нас важнее всего.",
    },
    {
      question: "Как подтвердить присутствие?",
      answer:
        "Ссылка RSVP появится здесь после финального согласования формы.",
    },
  ],
};
