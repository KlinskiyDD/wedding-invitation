"use client";

import { useState } from "react";

import type { WeddingContent } from "@/content/wedding";

type RsvpProps = {
  guestForm: WeddingContent["guestForm"];
  rsvp: WeddingContent["rsvp"];
};

export function Rsvp({ guestForm, rsvp }: RsvpProps) {
  const [message, setMessage] = useState("");

  return (
    <section id="rsvp" data-testid="rsvp" className="guest-form-section vintage-panel">
      <div className="section-heading">
        <h2>Анкета гостя</h2>
        <div className="section-divider" aria-hidden="true" />
        <p>{rsvp.deadline}</p>
      </div>

      <form
        className="guest-form"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(guestForm.submitMessage);
        }}
      >
        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            ♙
          </span>
          <span className="sr-only">Имя и фамилия</span>
          <input
            id="guest-name"
            name="guestName"
            autoComplete="name"
            placeholder="Имя и фамилия"
          />
        </label>

        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            ✉
          </span>
          <span className="sr-only">Подтверждение участия</span>
          <select name="attendance" defaultValue={guestForm.attendance[0]}>
            {guestForm.attendance.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            ♙
          </span>
          <span className="sr-only">Количество гостей</span>
          <select name="companions" defaultValue={guestForm.companions[0]}>
            {guestForm.companions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            ◇
          </span>
          <span className="sr-only">Предпочтение по еде</span>
          <select name="foodPreference" defaultValue={guestForm.food[0]}>
            {guestForm.food.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            ♡
          </span>
          <span className="sr-only">Предпочтение по алкоголю</span>
          <select name="drinkPreference" defaultValue={guestForm.drinks[0]}>
            {guestForm.drinks.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="compact-field compact-field-wide compact-field-textarea">
          <span className="field-icon" aria-hidden="true">
            !
          </span>
          <span className="sr-only">Ограничения по блюдам / аллергии</span>
          <textarea
            name="foodRestrictions"
            placeholder="Ограничения по блюдам / аллергии"
          />
        </label>

        <div className="form-submit">
          <button type="submit" data-testid="rsvp-submit">
            <span>Отправить ответ</span>
            <span aria-hidden="true">♡</span>
          </button>
          {message ? (
            <p data-testid="rsvp-message" className="form-status" aria-live="polite">
              {message}
            </p>
          ) : null}
        </div>
      </form>

      <p className="signature">♡ С любовью, Дима и Марина ♥</p>
    </section>
  );
}
