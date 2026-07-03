import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";

type PhotoStoryProps = {
  photoStory: WeddingContent["photoStory"];
};

export function PhotoStory({ photoStory }: PhotoStoryProps) {
  const galleryLayout = [
    { photoIndex: 1, className: "photo-collage-main" },
    { photoIndex: 0, className: "photo-collage-ring" },
    { photoIndex: 4, className: "photo-collage-heli" },
    { photoIndex: 2, className: "photo-collage-brick" },
    { photoIndex: 3, className: "photo-collage-lake" },
  ] as const;

  return (
    <section
      data-testid="photo-strip"
      data-motion-reveal
      className="photo-strip-section"
      aria-labelledby="photo-story-title"
    >
      <header className="photo-story-heading">
        <span className="photo-story-kicker">Пять любимых моментов</span>
        <h2 id="photo-story-title">{photoStory.title}</h2>
        <div className="section-divider" aria-hidden="true" />
      </header>

      <div className="photo-strip" data-testid="photo-gallery-card">
        {galleryLayout.map(({ photoIndex, className }, index) => {
          const photo = photoStory.photos[photoIndex] ?? photoStory.photos[index];

          if (!photo) {
            return null;
          }

          return (
            <figure
              key={`${photo.alt}-${photoIndex}`}
              data-testid="photo-slot"
              className={`photo-slot photo-slot-${photo.tone} ${className}`}
            >
              <div className="photo-image-frame">
                {photo.src ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={
                      className === "photo-collage-main"
                        ? "(min-width: 900px) 34vw, 100vw"
                        : "(min-width: 900px) 23vw, 50vw"
                    }
                    className="photo-image"
                  />
                ) : (
                  <span
                    className="photo-placeholder"
                    role="img"
                    aria-label={photo.alt}
                  />
                )}
              </div>
              <figcaption className="sr-only">{photo.alt}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
