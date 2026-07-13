import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { publicAssetPath } from "@/lib/public-path";

import "./globals.css";

export const metadata: Metadata = {
  title: "Дмитрий и Марина | Свадебное приглашение",
  description: "Приглашение на свадьбу Марины и Дмитрия.",
};

const publicAssetStyles = {
  "--asset-gold-dust": `url("${publicAssetPath("/images/generated/gold-dust-sprinkle.png")}")`,
  "--asset-heart-tiny": `url("${publicAssetPath("/images/generated/heart-tiny-gold.png")}")`,
  "--asset-hero-sprig-left": `url("${publicAssetPath("/images/generated/hero-sprig-left.png")}")`,
  "--asset-corner-bottom-left": `url("${publicAssetPath("/images/generated/corner-floral-bottom-left.png")}")`,
  "--asset-corner-bottom-right": `url("${publicAssetPath("/images/generated/corner-floral-bottom-right.png")}")`,
  "--asset-section-venue": `url("${publicAssetPath("/images/generated/section-bg-venue-v3.png")}")`,
  "--asset-section-dresscode": `url("${publicAssetPath("/images/generated/section-bg-dresscode-v3.png")}")`,
  "--asset-section-faq": `url("${publicAssetPath("/images/generated/section-bg-faq-v3.png")}")`,
  "--asset-section-rsvp": `url("${publicAssetPath("/images/generated/section-bg-rsvp-v3.png")}")`,
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body style={publicAssetStyles}>{children}</body>
    </html>
  );
}
