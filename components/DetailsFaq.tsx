import Image from "next/image";

import type { WeddingContent } from "@/content/wedding";

type DetailsFaqProps = {
  dressCode: WeddingContent["dressCode"];
  faq: WeddingContent["faq"];
};

export function DetailsFaq({ dressCode, faq }: DetailsFaqProps) {
  return (
    <section data-testid="details-faq" className="details-faq-section vintage-panel">
      <div data-testid="dress-code" className="dress-code-compact">
        <h2>Дресс-код</h2>
        <div className="color-dots" aria-label={dressCode.title}>
          {dressCode.stopColors.map((color) => (
            <span
              key={color.name}
              title={color.name}
              aria-label={color.name}
              style={{
                backgroundColor: color.value,
                borderColor: color.border ?? color.value,
              }}
            />
          ))}
        </div>
        <p>{dressCode.description}</p>
      </div>

      <div id="faq" data-testid="faq" className="faq-compact">
        <h2>Частые вопросы</h2>
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="flower-sketch" aria-hidden="true">
        <Image
          src="/images/vintage/branch-flower.png"
          alt=""
          width={145}
          height={145}
        />
      </div>
    </section>
  );
}
