import type { FaqItem } from "@/content/wedding";

type FaqProps = {
  items: FaqItem[];
};

export function Faq({ items }: FaqProps) {
  return (
    <section
      data-testid="faq"
      className="bg-white px-5 py-20 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b45]">
              Вопросы
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1d2b24] sm:text-5xl">
              Несколько важных деталей
            </h2>
          </div>
          <div className="divide-y divide-[#e4dccf] border-y border-[#e4dccf]">
            {items.map((item) => (
              <article key={item.question} className="py-6">
                <h3 className="text-lg font-semibold text-[#1d2b24]">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#56645c]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
