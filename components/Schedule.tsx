import type { ScheduleItem } from "@/content/wedding";

type ScheduleProps = {
  items: ScheduleItem[];
};

export function Schedule({ items }: ScheduleProps) {
  return (
    <section
      id="details"
      data-testid="schedule"
      className="bg-[#fbfaf7] px-5 py-20 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b45]">
            План дня
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1d2b24] sm:text-5xl">
            Вечер без спешки
          </h2>
          <p className="mt-4 text-base leading-7 text-[#56645c]">
            Мы собрали ориентировочный тайминг, чтобы вам было проще
            спланировать приезд и насладиться каждым моментом.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={`${item.time}-${item.title}`}
              className="border border-[#ddd2c4] bg-white p-6 shadow-sm"
            >
              <time className="text-sm font-semibold text-[#9a6b45]">
                {item.time}
              </time>
              <h3 className="mt-3 text-xl font-semibold text-[#1d2b24]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#56645c]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
