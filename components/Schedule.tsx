import Image from "next/image";

import type { ScheduleItem } from "@/content/wedding";

type ScheduleProps = {
  items: ScheduleItem[];
  intro: string;
};

const scheduleIcons: Record<ScheduleItem["icon"], { src: string; alt: string }> = {
  rings: {
    src: "/images/generated/icon-rings-premium.png",
    alt: "Декоративная иконка колец",
  },
  heart: {
    src: "/images/generated/icon-heart-premium.png",
    alt: "Декоративная иконка сердца",
  },
  glasses: {
    src: "/images/generated/icon-glasses-premium.png",
    alt: "Декоративная иконка бокалов",
  },
  cloche: {
    src: "/images/generated/icon-cloche-premium.png",
    alt: "Декоративная иконка праздничного ужина",
  },
};

function ScheduleIcon({ type }: { type: ScheduleItem["icon"] }) {
  const icon = scheduleIcons[type];

  return (
    <Image
      src={icon.src}
      alt={icon.alt}
      width={112}
      height={122}
      className="schedule-icon-image"
    />
  );
}

export function Schedule({ items, intro }: ScheduleProps) {
  return (
    <section
      id="timing"
      data-testid="schedule"
      data-motion-reveal
      className="schedule-section"
    >
      <div className="section-heading">
        <h2>Тайминг дня</h2>
        <div className="section-divider" aria-hidden="true" />
        <p className="sr-only">{intro}</p>
      </div>

      <div className="schedule-line" role="list">
        {items.map((item) => (
          <article
            key={`${item.time}-${item.title}`}
            className="schedule-event"
            role="listitem"
          >
            <div className="schedule-icon">
              <ScheduleIcon type={item.icon} />
            </div>
            <time>{item.time}</time>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
