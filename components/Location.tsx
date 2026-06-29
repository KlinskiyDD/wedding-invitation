import type { WeddingContent } from "@/content/wedding";

type LocationProps = {
  event: WeddingContent["event"];
};

export function Location({ event }: LocationProps) {
  const hasMap = event.mapUrl.trim().length > 0;

  return (
    <section
      data-testid="location"
      className="bg-[#1d2b24] px-5 py-20 text-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e9cfae]">
            Локация
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">
            {event.placeName}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#e8eee8]">
            {event.address}
          </p>
          {hasMap ? (
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex h-12 items-center justify-center bg-[#e9cfae] px-6 text-sm font-semibold text-[#1d2b24] transition hover:bg-[#f7dfbd] focus:outline-none focus:ring-2 focus:ring-[#f7dfbd] focus:ring-offset-2 focus:ring-offset-[#1d2b24]"
            >
              Открыть карту
            </a>
          ) : (
            <p className="mt-8 inline-flex min-h-12 items-center border border-white/30 px-6 text-sm font-semibold text-[#e9cfae]">
              Карта появится после уточнения адреса
            </p>
          )}
        </div>
        <div className="grid min-h-72 place-items-center border border-white/18 bg-white/7 p-8">
          <div className="max-w-md text-center">
            <p className="text-6xl font-semibold text-[#e9cfae]">24</p>
            <p className="mt-3 text-xl font-semibold">августа</p>
            <p className="mt-4 text-sm leading-6 text-[#d9e4db]">
              Добавьте дату в календарь и заложите немного времени на дорогу.
              Финальные детали маршрута появятся здесь ближе к событию.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
