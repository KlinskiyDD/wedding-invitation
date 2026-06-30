import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";

type HeroProps = {
  couple: WeddingContent["couple"];
  event: WeddingContent["event"];
  greeting: WeddingContent["greeting"];
  navigation: WeddingContent["navigation"];
};

export function Hero({ couple, event, greeting, navigation }: HeroProps) {
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
            src="/images/vintage/monogram.png"
            alt=""
            fill
            sizes="104px"
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

      <div className="hero-composition">
        <div className="hero-art hero-art-left">
          <Image
            src="/images/vintage/building-large.png"
            alt="Декоративная иллюстрация здания"
            width={300}
            height={240}
            priority
            className="hero-sketch-image"
          />
        </div>

        <div className="hero-copy">
          <p className="hero-eyebrow">{couple.headline}</p>
          <h1 className="hero-title">
            <span>{couple.groomName}</span>
            <em>и</em>
            <span>{couple.brideName}</span>
          </h1>
          <p className="hero-date">{event.dateLabel}</p>
          <div className="ornament-divider" aria-hidden="true" />
          <div className="hero-greeting">
            {greeting.map((paragraph, index) =>
              index === 0 ? (
                <h2 key={paragraph}>{paragraph}</h2>
              ) : (
                <p key={paragraph}>{paragraph}</p>
              ),
            )}
          </div>
        </div>

        <div className="hero-art hero-art-right">
          <Image
            src="/images/vintage/branch-hero.png"
            alt=""
            width={235}
            height={318}
            className="hero-botanical-image"
          />
        </div>
      </div>
    </section>
  );
}
