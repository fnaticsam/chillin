import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chillin — Your Personal Customer Support Concierge",
  description:
    "Chillin is your personal concierge for every annoying customer support issue. We sit on hold, fight the fights, and get it sorted. We handle it. You chill.",
  openGraph: {
    title: "Chillin — We handle it. You chill.",
    description:
      "A real human picks up your customer support fight, so you never speak to a call centre again.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
