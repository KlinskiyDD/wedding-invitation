import type { ScheduleItem } from "@/content/wedding";

type ScheduleProps = {
  items: ScheduleItem[];
  intro: string;
};

export function Schedule({ items, intro }: ScheduleProps) {
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
            {intro}
          </p>
        </div>
        <div className="mt-12 max-w-3xl">
          {items.map((item, index) => (
            <article
              key={`${item.time}-${item.title}`}
              className="relative grid grid-cols-[4rem_1fr] gap-5 pb-10 last:pb-0 sm:grid-cols-[6rem_1fr]"
            >
              <div className="text-right">
                <time className="text-sm font-semibold text-[#9a6b45]">
                  {item.time}
                </time>
              </div>
              <div className="relative border-l border-[#d4c6b4] pl-8">
                <span
                  aria-hidden="true"
                  className="absolute -left-[9px] top-0 h-4 w-4 bg-[#9a6b45] ring-4 ring-[#fbfaf7]"
                />
                <div className="border border-[#ddd2c4] bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6b45]">
                    Этап {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#1d2b24]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#56645c]">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
