import Image from "next/image";
import type { ReactNode } from "react";

type VintageFrameProps = {
  children: ReactNode;
};

export function VintageFrame({ children }: VintageFrameProps) {
  return (
    <div className="vintage-shell">
      <div className="vintage-page">
        <span className="page-branch page-branch-right" aria-hidden="true">
          <Image
            src="/images/generated/botanical-spray-right.png"
            alt=""
            fill
            sizes="420px"
          />
        </span>
        <span className="page-branch page-branch-bottom" aria-hidden="true">
          <Image
            src="/images/generated/hero-sprig-right.png"
            alt=""
            fill
            sizes="260px"
          />
        </span>
        <span className="page-corner page-corner-bottom-right" aria-hidden="true">
          <Image
            src="/images/generated/corner-floral-bottom-right.png"
            alt=""
            fill
            sizes="260px"
          />
        </span>
        <span className="gold-dust gold-dust-left" aria-hidden="true" />
        <span className="gold-dust gold-dust-right" aria-hidden="true" />
        <span className="gold-dust gold-dust-bottom" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
