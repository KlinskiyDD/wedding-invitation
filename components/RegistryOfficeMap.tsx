import Image from "next/image";

import type { RegistryOfficeContent } from "@/content/wedding";
import { publicAssetPath } from "@/lib/public-path";

type RegistryOfficeMapProps = {
  office: RegistryOfficeContent;
};

export function RegistryOfficeMap({ office }: RegistryOfficeMapProps) {
  return (
    <section
      data-testid="registry-office"
      className="registry-office-section vintage-panel"
      aria-labelledby="registry-office-title"
    >
      <div className="registry-office-copy">
        <p className="registry-office-eyebrow">Место церемонии</p>
        <h2 id="registry-office-title">{office.name}</h2>
        <p className="registry-office-address">
          <Image
            src={publicAssetPath("/images/generated/icon-pin-premium.png")}
            alt=""
            width={28}
            height={28}
            aria-hidden="true"
          />
          <span>{office.address}</span>
        </p>
        <a
          className="registry-office-link"
          href={office.mapUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Открыть ЗАГС в Яндекс Картах"
        >
          <span>Открыть в Яндекс Картах</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="registry-office-map-shell">
        <iframe
          src={office.embedUrl}
          title="Интерактивная карта ЗАГСа"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
