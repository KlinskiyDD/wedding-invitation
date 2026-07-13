import Image from "next/image";

import type { ScheduleItem } from "@/content/wedding";
import { publicAssetPath } from "@/lib/public-path";

type ScheduleProps = {
  items: ScheduleItem[];
  intro: string;
};

const scheduleIcons: Record<ScheduleItem["icon"], { src: string; alt: string }> = {
  rings: {
    src: publicAssetPath("/images/generated/icon-rings-premium.png"),
    alt: "Декоративная иконка колец",
  },
  heart: {
    src: publicAssetPath("/images/generated/icon-heart-premium.png"),
    alt: "Декоративная иконка сердца",
  },
  glasses: {
    src: publicAssetPath("/images/generated/icon-glasses-premium.png"),
    alt: "Декоративная иконка бокалов",
  },
  cloche: {
    src: publicAssetPath("/images/generated/icon-cloche-premium.png"),
    alt: "Декоративная иконка праздничного ужина",
  },
  dance: {
    src: publicAssetPath("/images/generated/icon-dance-custom.png"),
    alt: "Декоративная иконка танцующей пары",
  },
  finale: {
    src: publicAssetPath("/images/generated/icon-evening-finale-custom.png"),
    alt: "Декоративная иконка завершения вечера",
  },
  guestGathering: {
    src: publicAssetPath("/images/generated/icon-guest-gathering-custom.png"),
    alt: "Декоративная иконка сбора гостей",
  },
  ceremony: {
    src: publicAssetPath("/images/generated/icon-ceremony-custom.png"),
    alt: "Декоративная иконка бракосочетания",
  },
  photoshoot: {
    src: publicAssetPath("/images/generated/icon-photoshoot-custom.png"),
    alt: "Декоративная иконка фотосессии",
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
      data-testid="schedule-icon-image"
      data-schedule-icon={type}
      className={`schedule-icon-image schedule-icon-image-${type}`}
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

      <div
        className={`schedule-line schedule-line-count-${items.length}`}
        data-schedule-count={items.length}
        role="list"
      >
        {items.map((item) => (
          <article
            key={`${item.time}-${item.title}`}
            className={`schedule-event${
              item.description ? "" : " schedule-event-compact"
            }`}
            role="listitem"
          >
            <div className="schedule-icon">
              <ScheduleIcon type={item.icon} />
            </div>
            <time>{item.time}</time>
            <h3>{item.title}</h3>
            {item.description ? <p>{item.description}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
