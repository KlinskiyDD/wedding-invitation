import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";

type PhotoStoryProps = {
  photoStory: WeddingContent["photoStory"];
};

export function PhotoStory({ photoStory }: PhotoStoryProps) {
  return (
    <section data-testid="photo-strip" className="photo-strip-section">
      <div className="side-leaf side-leaf-left" aria-hidden="true">
        <Image src="/images/vintage/branch-side.png" alt="" fill sizes="90px" />
      </div>
      <div className="photo-strip" aria-label={photoStory.title}>
        {photoStory.photos.map((photo, index) => (
          <figure
            key={`${photo.alt}-${index}`}
            data-testid="photo-slot"
            className={`photo-slot photo-slot-${photo.tone}`}
          >
            {photo.src ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 900px) 24vw, 50vw"
                className="photo-image"
              />
            ) : (
              <span role="img" aria-label={photo.alt} />
            )}
          </figure>
        ))}
      </div>
      <div className="side-leaf side-leaf-right" aria-hidden="true">
        <Image src="/images/vintage/branch-side.png" alt="" fill sizes="90px" />
      </div>
    </section>
  );
}
