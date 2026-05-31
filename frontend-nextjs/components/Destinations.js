"use client";

import Image from "next/image";
import styles from "./Destinations.module.css";
import ScrollReveal from "./ScrollReveal";

const DESTINATIONS = [
  {
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
    query: "Plan a 7-day trip to Tokyo, Japan with flights, hotels, and sightseeing",
  },
  {
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
    query: "Plan a romantic 5-day Paris trip including flights, boutique hotels, and must-see attractions",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80",
    query: "Plan a 4-day Bangkok trip with flights, hotels near temples, and street food tours",
  },
  {
    city: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80",
    query: "Plan a 6-day Rome and Italy trip with flights, centrally located hotels, and historical tours",
  },
  {
    city: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80",
    query: "Plan a luxury 3-day weekend getaway to Dubai with flights and 5-star hotels",
  },
  {
    city: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
    query: "Plan a 10-day Bali backpacking adventure with budget flights and hostels",
  },
];

export default function Destinations({ onSelectDestination }) {
  return (
    <section className={styles.section} id="destinations" aria-label="Popular destinations">
      <ScrollReveal>
        <h2 className={styles.title}>Popular Destinations</h2>
        <p className={styles.subtitle}>
          Click a destination to instantly start planning your trip
        </p>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className={styles.scrollContainer}>
          <div className={styles.cardRow}>
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.city}
                className={styles.card}
                onClick={() => onSelectDestination(dest.query)}
                aria-label={`Plan a trip to ${dest.city}, ${dest.country}`}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={dest.image}
                    alt={`${dest.city}, ${dest.country}`}
                    fill
                    sizes="(max-width: 768px) 260px, 220px"
                    className={styles.image}
                  />
                  <div className={styles.overlay} />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.flag}>{dest.flag}</span>
                  <h3 className={styles.cityName}>{dest.city}</h3>
                  <p className={styles.countryName}>{dest.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
