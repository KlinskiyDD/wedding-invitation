import type { WeddingContent } from "@/content/wedding";

type DetailsFaqProps = {
  dressCode: WeddingContent["dressCode"];
  faq: WeddingContent["faq"];
};

type ColorListProps = {
  label: string;
  colors: WeddingContent["dressCode"]["stopColors"];
};

function ColorList({ label, colors }: ColorListProps) {
  return (
    <div className="dress-palette">
      <p>{label}</p>
      <div className="color-dots">
        {colors.map((color) => (
          <span
            key={color.name}
            title={color.name}
            aria-label={color.name}
            className={
              color.texture === "speckled"
                ? "color-swatch color-swatch-speckled"
                : "color-swatch"
            }
            style={{
              backgroundColor: color.value,
              borderColor: color.border ?? color.value,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function DetailsFaq({ dressCode, faq }: DetailsFaqProps) {
  return (
    <>
      <section
        id="dress-code"
        data-testid="dress-code"
        data-motion-reveal
        className="dress-code-section vintage-panel"
      >
        <h2>{dressCode.title}</h2>
        <div className="section-divider" aria-hidden="true" />
        <ColorList label={dressCode.avoidDescription} colors={dressCode.stopColors} />
      </section>

      <section
        id="faq"
        data-testid="faq"
        data-motion-reveal
        className="faq-section vintage-panel"
      >
        <h2>Часто задаваемые вопросы</h2>
        <div className="section-divider" aria-hidden="true" />
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
