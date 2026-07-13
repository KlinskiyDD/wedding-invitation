import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";
import { publicAssetPath } from "@/lib/public-path";

type HeroProps = {
  couple: WeddingContent["couple"];
  event: WeddingContent["event"];
  navigation: WeddingContent["navigation"];
};

export function Hero({ couple, event, navigation }: HeroProps) {
  const leftNavigation = navigation.slice(0, 3);
  const rightNavigation = navigation.slice(3);

  return (
    <section id="invitation" data-testid="hero" className="hero-section">
      <nav className="vintage-nav" aria-label="Навигация по приглашению">
        <div className="vintage-nav-group">
          {leftNavigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="monogram" aria-label={`Монограмма ${couple.monogram}`}>
          <Image
            src={publicAssetPath("/images/generated/monogram-premium.png")}
            alt=""
            width={360}
            height={270}
            className="monogram-image"
            priority
          />
          <span className="sr-only">{couple.monogram}</span>
        </div>
        <div className="vintage-nav-group">
          {rightNavigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="hero-copy">
        <h1 className="hero-title">{couple.names}</h1>
        <div className="hero-divider" aria-hidden="true" />
        <p className="hero-date">{event.dateLabel}</p>
        <p className="hero-subtitle">{couple.subtitle}</p>
        <span className="hero-heart" aria-hidden="true" />
      </div>
    </section>
  );
}
