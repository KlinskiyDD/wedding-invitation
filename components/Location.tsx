import type { WeddingContent } from "@/content/wedding";

type LocationProps = {
  event: WeddingContent["event"];
};

export function Location({ event }: LocationProps) {
  return (
    <section
      id="details"
      data-testid="location"
      className="venue-section vintage-panel"
    >
      <div className="venue-copy">
        <p className="section-kicker">Место проведения</p>
        <h2>{event.placeName}</h2>
        <p>{event.address}</p>
        <div className="venue-actions">
          <a href={event.mapUrl} target="_blank" rel="noreferrer">
            Как добраться
          </a>
          <a href={event.websiteUrl} target="_blank" rel="noreferrer">
            Сайт ресторана
          </a>
        </div>
      </div>

      <a
        href={event.mapUrl}
        target="_blank"
        rel="noreferrer"
        className="map-preview"
        aria-label="Открыть в Яндекс Картах"
      >
        <span className="map-river" aria-hidden="true" />
        <span className="map-road map-road-one" aria-hidden="true" />
        <span className="map-road map-road-two" aria-hidden="true" />
        <span className="map-road map-road-three" aria-hidden="true" />
        <span className="map-pin" aria-hidden="true" />
        <span className="map-label">Пироговский дворик</span>
        <span className="map-button">Открыть в Яндекс Картах</span>
      </a>
    </section>
  );
}
