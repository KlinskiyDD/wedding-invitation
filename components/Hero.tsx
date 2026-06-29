import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";

type HeroProps = {
  couple: WeddingContent["couple"];
  event: WeddingContent["event"];
  rsvp: WeddingContent["rsvp"];
};

export function Hero({ couple, event, rsvp }: HeroProps) {
  return (
    <section
      data-testid="hero"
      className="relative min-h-[92svh] overflow-hidden bg-[#f7f2ea]"
    >
      <Image
        src="/images/wedding-flatlay.jpg"
        alt="Свадебная композиция с цветами, приглашениями и кольцами"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,43,36,0.76)_0%,rgba(29,43,36,0.58)_38%,rgba(29,43,36,0.12)_72%,rgba(29,43,36,0)_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-6xl items-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-2xl text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e9cfae]">
            Свадебное приглашение
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-none sm:text-7xl lg:text-8xl">
            {couple.names}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#f8f1e8] sm:text-xl">
            {couple.subtitle}
          </p>
          <dl className="mt-10 grid max-w-xl gap-4 text-sm sm:grid-cols-3">
            <div className="border-l border-[#e9cfae] pl-4">
              <dt className="text-[#e9cfae]">Дата</dt>
              <dd className="mt-1 text-base font-semibold">{event.dateLabel}</dd>
            </div>
            <div className="border-l border-[#e9cfae] pl-4">
              <dt className="text-[#e9cfae]">Начало</dt>
              <dd className="mt-1 text-base font-semibold">{event.timeLabel}</dd>
            </div>
            <div className="border-l border-[#e9cfae] pl-4">
              <dt className="text-[#e9cfae]">Место</dt>
              <dd className="mt-1 text-base font-semibold">{event.placeName}</dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#rsvp"
              data-testid="hero-rsvp-link"
              className="inline-flex h-12 items-center justify-center bg-[#e9cfae] px-6 text-sm font-semibold text-[#1d2b24] transition hover:bg-[#f7dfbd] focus:outline-none focus:ring-2 focus:ring-[#f7dfbd] focus:ring-offset-2 focus:ring-offset-[#1d2b24]"
            >
              Подтвердить присутствие
            </a>
            <a
              href="#details"
              className="inline-flex h-12 items-center justify-center border border-white/60 px-6 text-sm font-semibold text-white transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1d2b24]"
            >
              Посмотреть детали
            </a>
          </div>
          <p className="mt-4 text-sm text-[#f3e6d7]">{rsvp.deadline}</p>
        </div>
      </div>
    </section>
  );
}
