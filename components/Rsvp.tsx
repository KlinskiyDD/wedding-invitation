import type { WeddingContent } from "@/content/wedding";

type RsvpProps = {
  rsvp: WeddingContent["rsvp"];
};

export function Rsvp({ rsvp }: RsvpProps) {
  const hasUrl = rsvp.url.trim().length > 0;

  return (
    <section
      id="rsvp"
      data-testid="rsvp"
      className="bg-[#f4e6d3] px-5 py-20 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7d5538]">
          RSVP
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[#1d2b24] sm:text-5xl">
          Нам важно знать, что вы будете рядом
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#56645c]">
          {rsvp.deadline}. {rsvp.description}
        </p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left md:grid-cols-2">
          {rsvp.questions.map((question) => (
            <div
              key={question}
              className="border border-[#dcc8aa] bg-white/55 p-4 text-sm font-medium leading-6 text-[#1d2b24]"
            >
              {question}
            </div>
          ))}
        </div>
        {hasUrl ? (
          <a
            href={rsvp.url}
            data-testid="rsvp-link"
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex h-12 items-center justify-center bg-[#1d2b24] px-8 text-sm font-semibold text-white transition hover:bg-[#2f4438] focus:outline-none focus:ring-2 focus:ring-[#1d2b24] focus:ring-offset-2 focus:ring-offset-[#f4e6d3]"
          >
            Заполнить форму
          </a>
        ) : (
          <button
            type="button"
            data-testid="rsvp-placeholder"
            disabled
            className="mt-9 inline-flex h-12 cursor-not-allowed items-center justify-center bg-[#8d9b8d] px-8 text-sm font-semibold text-white"
          >
            Форма скоро появится
          </button>
        )}
      </div>
    </section>
  );
}
