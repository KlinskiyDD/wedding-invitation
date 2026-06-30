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
    ["дней", countdown?.timeLeft.days, "days"],
    ["часов", countdown?.timeLeft.hours, "hours"],
    ["минут", countdown?.timeLeft.minutes, "minutes"],
    ["секунд", countdown?.timeLeft.seconds, "seconds"],
  ] as const;

  return (
    <section data-testid="countdown" className="countdown-section">
      <div className="countdown-frame">
        <p className="section-kicker">До нашей свадьбы осталось</p>
        {countdown?.isPast ? (
          <p className="countdown-finished">Наш праздник уже состоялся</p>
        ) : (
          <dl className="countdown-grid">
            {items.map(([label, value, id]) => (
              <div key={label} className="countdown-item">
                <dt data-testid={`countdown-${id}`}>{value ?? "—"}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        )}
        <span className="countdown-heart" aria-hidden="true">
          ♡
        </span>
      </div>
    </section>
  );
}
