import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";

type PhotoStoryProps = {
  photoStory: WeddingContent["photoStory"];
};

export function PhotoStory({ photoStory }: PhotoStoryProps) {
  return (
    <section data-testid="photo-strip" className="photo-strip-section">
      <div className="photo-strip" aria-label={photoStory.title}>
        {photoStory.photos.map((photo, index) => (
          <figure
            key={`${photo.alt}-${index}`}
            data-testid="photo-slot"
            className={`photo-slot photo-slot-${photo.tone} photo-polaroid-${
              index + 1
            }`}
          >
            <div className="photo-image-frame">
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 900px) 24vw, 50vw"
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
        ))}
      </div>
      <span className="photo-heart" aria-hidden="true" />
    </section>
  );
}
