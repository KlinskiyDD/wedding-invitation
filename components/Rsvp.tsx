"use client";

import Image from "next/image";
import { useState } from "react";

import type { WeddingContent } from "@/content/wedding";

type RsvpProps = {
  guestForm: WeddingContent["guestForm"];
  rsvp: WeddingContent["rsvp"];
};

type RsvpSubmitStatus = "idle" | "submitting" | "success" | "error";

type RsvpResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function Rsvp({ guestForm, rsvp }: RsvpProps) {
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<RsvpSubmitStatus>("idle");
  const isSubmitting = submitStatus === "submitting";

  return (
    <section
      id="rsvp"
      data-testid="rsvp"
      data-motion-reveal
      className="guest-form-section vintage-panel"
    >
      <div className="section-heading">
        <h2>Анкета гостя</h2>
        <div className="section-divider" aria-hidden="true" />
        <p>{rsvp.deadline}</p>
      </div>

      <form
        className="guest-form"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);

          setSubmitStatus("submitting");
          setMessage("Отправляем ответ...");

          try {
            const response = await fetch("/api/rsvp", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                guestName: readFormValue(formData, "guestName"),
                attendance: readFormValue(formData, "attendance"),
                foodPreference: readFormValue(formData, "foodPreference"),
                drinkPreference: readFormValue(formData, "drinkPreference"),
                foodRestrictions: readFormValue(formData, "foodRestrictions"),
              }),
            });
            const body = (await response
              .json()
              .catch(() => ({}))) as RsvpResponse;

            if (!response.ok || !body.ok) {
              throw new Error(
                body.error ??
                  "Не получилось сохранить ответ. Попробуйте отправить форму ещё раз.",
              );
            }

            setSubmitStatus("success");
            setMessage(body.message ?? guestForm.submitMessage);
            form.reset();
          } catch (error) {
            setSubmitStatus("error");
            setMessage(
              error instanceof Error
                ? error.message
                : "Не получилось сохранить ответ. Попробуйте отправить форму ещё раз.",
            );
          }
        }}
      >
        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            <Image src="/images/generated/icon-user-premium.png" alt="" width={24} height={24} />
          </span>
          <span className="sr-only">Имя и фамилия</span>
          <input
            id="guest-name"
            name="guestName"
            autoComplete="name"
            placeholder="Имя и фамилия"
            required
            disabled={isSubmitting}
          />
        </label>

        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            <Image src="/images/generated/icon-envelope-premium.png" alt="" width={24} height={24} />
          </span>
          <span className="sr-only">Подтверждение участия</span>
          <select
            name="attendance"
            defaultValue={guestForm.attendance[0]}
            disabled={isSubmitting}
          >
            {guestForm.attendance.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            <Image src="/images/generated/icon-food-premium.png" alt="" width={24} height={24} />
          </span>
          <span className="sr-only">Предпочтение по еде</span>
          <select
            name="foodPreference"
            defaultValue={guestForm.food[0]}
            disabled={isSubmitting}
          >
            {guestForm.food.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="compact-field">
          <span className="field-icon" aria-hidden="true">
            <Image src="/images/generated/icon-drink-premium.png" alt="" width={24} height={24} />
          </span>
          <span className="sr-only">Предпочтение по алкоголю</span>
          <select
            name="drinkPreference"
            defaultValue={guestForm.drinks[0]}
            disabled={isSubmitting}
          >
            {guestForm.drinks.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="compact-field compact-field-wide compact-field-textarea">
          <span className="field-icon" aria-hidden="true">
            <Image src="/images/generated/icon-note-premium.png" alt="" width={24} height={24} />
          </span>
          <span className="sr-only">Ограничения по блюдам / аллергии</span>
          <textarea
            name="foodRestrictions"
            placeholder="Ограничения по блюдам / аллергии"
            disabled={isSubmitting}
          />
        </label>

        <div className="form-submit">
          <button type="submit" data-testid="rsvp-submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Отправляем..." : "Отправить ответ"}</span>
            <Image
              src="/images/generated/button-heart-light.png"
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
            />
          </button>
          {message ? (
            <p
              data-testid="rsvp-message"
              className={`form-status form-status-${submitStatus}`}
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}
        </div>
      </form>

      <p className="signature">С любовью, Дима и Марина</p>
    </section>
  );
}
