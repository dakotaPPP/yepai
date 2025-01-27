import type { Car, Question } from "../types/cars"

export const cars: Car[] = [
  {
    id: "corolla-2025",
    name: "2025 Corolla",
    msrp: 22325,
    imageUrl:
      "https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/2025/corolla/base.png",
    tags: ["efficient", "compact", "affordable"],
    type: "sedan",
    link: "https://toyota.com",
    certainty: '90%',
  },
  {
    id: "camry-2025",
    name: "2025 Camry",
    msrp: 28700,
    imageUrl:
      "https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/2025/grsupra/base.png",
    tags: ["spacious", "reliable", "comfortable"],
    type: "sedan",
    link: "https://toyota.com",
    certainty: '90%',
  },
  {
    id: "rav4-2025",
    name: "2025 RAV4",
    msrp: 30725,
    imageUrl:
      "https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/2025/grsupra/base.png",
    tags: ["suv", "versatile", "popular"],
    type: "suv",
    link: "https://toyota.com",
    certainty: '90%',
  },
  {
    id: "highlander-2025",
    name: "2025 Highlander",
    msrp: 36620,
    imageUrl:
      "	https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/2025/grsupra/base.png",
    tags: ["family", "spacious", "suv"],
    type: "suv",
    link: "https://toyota.com",
    certainty: '90%',
  },
]

export const questions: Question[] = [
  {
    id: "initial",
    text: "Hello! I'm here to help you find your dream Toyota. What kind of car are you looking for? Sporty, spacious, or fuel-efficient?",
    nextQuestion: "budget",
  },
  {
    id: "budget",
    text: "Great choice! What is your preferred price range?",
    nextQuestion: "powertrain",
  },
  {
    id: "powertrain",
    text: "Do you prefer a traditional gas engine, hybrid, or fully electric vehicle?",
    nextQuestion: "final",
  },
  {
    id: "final",
    text: "Almost there! Are there any specific features you're looking for in your new Toyota?",
    nextQuestion: "complete",
  },
]

