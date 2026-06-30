import Image from "next/image";
import type { ReactNode } from "react";

type VintageFrameProps = {
  children: ReactNode;
};

export function VintageFrame({ children }: VintageFrameProps) {
  return (
    <div className="vintage-shell">
      <div className="vintage-page">
        <span className="corner corner-top-left" aria-hidden="true">
          <Image
            src="/images/vintage/corner-top-left.png"
            alt=""
            fill
            sizes="96px"
          />
        </span>
        <span className="corner corner-top-right" aria-hidden="true">
          <Image
            src="/images/vintage/corner-top-right.png"
            alt=""
            fill
            sizes="96px"
          />
        </span>
        <span className="corner corner-bottom-left" aria-hidden="true">
          <Image
            src="/images/vintage/corner-bottom-left.png"
            alt=""
            fill
            sizes="96px"
          />
        </span>
        <span className="corner corner-bottom-right" aria-hidden="true">
          <Image
            src="/images/vintage/corner-bottom-right.png"
            alt=""
            fill
            sizes="96px"
          />
        </span>
        {children}
      </div>
    </div>
  );
}
