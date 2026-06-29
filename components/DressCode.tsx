import type { WeddingContent } from "@/content/wedding";

type DressCodeProps = {
  dressCode: WeddingContent["dressCode"];
};

export function DressCode({ dressCode }: DressCodeProps) {
  return (
    <section
      data-testid="dress-code"
      className="bg-[#fbfaf7] px-5 py-20 sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b45]">
            Дресс-код
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1d2b24] sm:text-5xl">
            {dressCode.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#56645c]">
            {dressCode.description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {dressCode.stopColors.map((color) => (
            <article
              key={color.name}
              className="border border-[#ddd2c4] bg-white p-5 shadow-sm"
            >
              <div
                aria-hidden="true"
                className="h-20 w-full border"
                style={{
                  backgroundColor: color.value,
                  borderColor: color.border ?? color.value,
                }}
              />
              <h3 className="mt-4 text-lg font-semibold text-[#1d2b24]">
                {color.name}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
