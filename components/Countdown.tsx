"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalendarLinks } from "@/content/wedding";

type CountdownProps = {
  target: string;
  calendar: CalendarLinks;
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

export function Countdown({ target, calendar }: CountdownProps) {
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
    <section
      data-testid="countdown"
      data-motion-reveal
      className="countdown-section"
    >
      <div className="countdown-frame">
        <p className="section-kicker">До нашей свадьбы осталось</p>
        {countdown?.isPast ? (
          <p className="countdown-finished">Наш праздник уже состоялся</p>
        ) : (
          <dl className="countdown-grid">
            {items.map(([label, value, id]) => (
              <div key={label} className="countdown-item">
                <dt data-testid={`countdown-${id}`}>
                  <span
                    key={`${id}-${value ?? "empty"}`}
                    className="countdown-value"
                  >
                    {value ?? "—"}
                  </span>
                </dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        )}
        {!countdown?.isPast && (
          <nav
            aria-label="Добавить свадьбу в календарь"
            className="countdown-calendar"
          >
            <span className="countdown-calendar-label">{calendar.label}</span>
            <a
              aria-label="Добавить свадьбу в Google Calendar"
              className="countdown-calendar-button countdown-calendar-button-primary"
              href={calendar.googleUrl}
              rel="noreferrer"
              target="_blank"
            >
              Google
            </a>
            <a
              aria-label="Скачать событие для Apple Calendar"
              className="countdown-calendar-button"
              download
              href={calendar.appleUrl}
            >
              Apple
            </a>
          </nav>
        )}
      </div>
    </section>
  );
}
