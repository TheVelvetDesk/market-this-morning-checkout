import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market This Morning",
  description:
    "Weekday US-market morning brief before the open. First month free promo, then $10/mo. Not trading advice. Cancel anytime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
