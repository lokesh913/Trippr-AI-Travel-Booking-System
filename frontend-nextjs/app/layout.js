import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "Trippr AI: Multi-Agent Travel Orchestrator",
  description:
    "Plan your perfect trip with four AI agents that search flights, find hotels, build itineraries, and deliver a complete travel plan. Powered by Trippr AI: Multi-Agent Travel Orchestrator.",
  keywords: [
    "AI travel",
    "travel planner",
    "flight search",
    "hotel booking",
    "itinerary",
    "multi-agent AI",
    "Trippr",
    "Trippr AI: Multi-Agent Travel Orchestrator"
  ],
  openGraph: {
    title: "Trippr AI: Multi-Agent Travel Orchestrator",
    description:
      "Four specialized AI agents collaborate in real-time to search flights, find hotels, build itineraries, and deliver your perfect trip.",
    type: "website",
    locale: "en_US",
    siteName: "Trippr AI: Multi-Agent Travel Orchestrator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trippr AI: Multi-Agent Travel Orchestrator",
    description:
      "Four specialized AI agents collaborate in real-time to plan your perfect trip.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
