import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";

type LocationProps = {
  event: WeddingContent["event"];
};

export function Location({ event }: LocationProps) {
  return (
    <section
      id="place"
      data-testid="location"
      data-motion-reveal
      className="venue-section vintage-panel"
    >
      <div className="venue-photo" aria-hidden="true">
        <Image
          src="/images/venue/restaurant-interior-banquet.jpg"
          alt=""
          fill
          sizes="(min-width: 900px) 52vw, 100vw"
          className="venue-photo-image"
        />
      </div>

      <div className="venue-copy">
        <h2>{event.placeName}</h2>
        <p className="venue-address">
          <Image
            src="/images/generated/icon-pin-premium.png"
            alt=""
            width={28}
            height={28}
            aria-hidden="true"
          />
          <span>{event.address}</span>
        </p>
        <div className="venue-actions">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Открыть в Яндекс Картах"
          >
            <span>Посмотреть на карте</span>
            <Image
              src="/images/generated/icon-arrow-light.png"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
