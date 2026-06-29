import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";

type PhotoStoryProps = {
  photoStory: WeddingContent["photoStory"];
};

export function PhotoStory({ photoStory }: PhotoStoryProps) {
  return (
    <section
      data-testid="photo-story"
      className="bg-white px-5 py-20 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b45]">
            Фото
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1d2b24] sm:text-5xl">
            {photoStory.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-[#56645c]">
            {photoStory.description}
          </p>
        </div>
        {photoStory.photos.length > 0 ? (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {photoStory.photos.map((photo) => (
              <figure
                key={photo.src}
                className="relative aspect-[4/5] overflow-hidden bg-[#f4e6d3]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-[#cdbb9f] bg-[#fbfaf7] p-8 text-center">
            <p className="text-base font-semibold text-[#1d2b24]">
              Фотографии появятся после выбора наших любимых кадров.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
