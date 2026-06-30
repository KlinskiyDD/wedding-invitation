"use client";

import { useState } from "react";

import type { WeddingContent } from "@/content/wedding";

type RsvpProps = {
  guestForm: WeddingContent["guestForm"];
  rsvp: WeddingContent["rsvp"];
};

type OptionGroupProps = {
  title: string;
  name: string;
  options: string[];
  type: "radio" | "checkbox";
  columns?: boolean;
  wide?: boolean;
  note?: string;
};

function OptionGroup({
  title,
  name,
  options,
  type,
  columns = false,
  wide = false,
  note,
}: OptionGroupProps) {
  return (
    <fieldset className={wide ? "form-fieldset form-fieldset-wide" : "form-fieldset"}>
      <legend>{title}</legend>
      {note ? <p className="form-note">{note}</p> : null}
      <div className={columns ? "option-grid" : "option-list"}>
        {options.map((option, index) => {
          const id = `${name}-${index}`;

          return (
            <label key={option} htmlFor={id} className="choice-row">
              <input
                id={id}
                name={name}
                type={type}
                value={option}
                defaultChecked={type === "radio" && index === 0}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Rsvp({ guestForm, rsvp }: RsvpProps) {
  const [message, setMessage] = useState("");

  return (
    <section id="rsvp" data-testid="rsvp" className="guest-form-section vintage-panel">
      <div className="section-heading">
        <h2>Анкета гостя</h2>
        <div className="ornament-divider" aria-hidden="true" />
      </div>

      <form
        className="guest-form"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(guestForm.submitMessage);
        }}
      >
        <div className="form-block">
          <label htmlFor="guest-name">Ваше имя</label>
          <input id="guest-name" name="guestName" placeholder="Введите ваше имя" />
        </div>

        <OptionGroup
          title="Вы придёте?"
          name="attendance"
          options={guestForm.attendance}
          type="radio"
        />

        <OptionGroup
          title="Со спутником?"
          name="companions"
          options={guestForm.companions}
          type="radio"
        />

        <OptionGroup
          title="На роспись?"
          name="ceremony"
          options={guestForm.ceremony}
          type="radio"
        />

        <OptionGroup
          title="Что будете есть?"
          name="food"
          options={guestForm.food}
          type="checkbox"
          columns
          wide
          note="Можно выбрать несколько вариантов"
        />

        <OptionGroup
          title="Что будете пить?"
          name="drinks"
          options={guestForm.drinks}
          type="checkbox"
          columns
          wide
          note="Можно выбрать несколько вариантов"
        />

        <div className="form-block form-block-wide">
          <label htmlFor="food-restrictions">
            Продукты, которые вы не едите
          </label>
          <textarea
            id="food-restrictions"
            name="foodRestrictions"
            placeholder="Введите текст"
          />
        </div>

        <div className="form-block form-block-wide">
          <label htmlFor="guest-comment">Дополнительные пожелания</label>
          <textarea id="guest-comment" name="comment" placeholder="Введите текст" />
        </div>

        <div className="form-submit">
          <button type="submit" data-testid="rsvp-submit">
            Отправить анкету
          </button>
          <p>{rsvp.deadline}</p>
          {message ? (
            <p data-testid="rsvp-message" className="form-status" aria-live="polite">
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
