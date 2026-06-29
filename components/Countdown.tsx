"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  target: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CountdownState = {
  timeLeft: TimeLeft;
  isPast: boolean;
};

const emptyTime: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdownState(targetDate: Date): CountdownState {
  const distance = targetDate.getTime() - Date.now();

  if (distance <= 0) {
    return {
      timeLeft: emptyTime,
      isPast: true,
    };
  }

  return {
    timeLeft: {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    },
    isPast: false,
  };
}

export function Countdown({ target }: CountdownProps) {
  const targetDate = useMemo(() => new Date(target), [target]);
  const [countdown, setCountdown] = useState<CountdownState | null>(null);

  useEffect(() => {
    const update = () => setCountdown(getCountdownState(targetDate));

    update();
    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const items = [
    ["дней", countdown?.timeLeft.days],
    ["часов", countdown?.timeLeft.hours],
    ["минут", countdown?.timeLeft.minutes],
    ["секунд", countdown?.timeLeft.seconds],
  ] as const;

  return (
    <section
      data-testid="countdown"
      className="bg-[#1d2b24] px-5 py-12 text-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e9cfae]">
            До свадьбы
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Считаем дни до встречи
          </h2>
        </div>
        {countdown?.isPast ? (
          <p className="text-xl font-semibold text-[#e9cfae]">
            Наш праздник уже состоялся
          </p>
        ) : (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map(([label, value]) => (
              <div
                key={label}
                className="min-w-28 border border-white/18 bg-white/7 px-5 py-4 text-center"
              >
                <dt className="text-3xl font-semibold text-[#e9cfae]">
                  {value ?? "—"}
                </dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#d9e4db]">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
