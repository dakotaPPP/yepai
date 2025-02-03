import type { Car, Question } from "../types/cars"

export const cars: Car[] = [
  {
    id: "corolla-2025",
    name: "2025 Corolla",
    msrp: 22325,
    imageUrl:
      "https://tmna.aemassets.toyota.com/is/image/toyota/toyota/jellies/relative/2025/corolla/base.png",
    tags: ["efficient", "compact", "affordable"],
    type: "sedan",
    link: "https://www.toyota.com/configurator/build/step/model/year/2025/series/corolla",
    certainty: '90%',
  },
  {
    id: "2025,Toyota,GR Supra",
    name: "2025 GR Supra",
    msrp: 56250,
    imageUrl:
      "https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/2025/grsupra/base.png",
    tags: ["spacious", "reliable", "comfortable"],
    type: "sedan",
    link: "https://www.toyota.com/configurator/build/step/model/year/2025/series/grsupra",
    certainty: '90%',
  },
  {
    id: "rav4-2025",
    name: "2024 Tacoma",
    msrp: 31590,
    imageUrl:
      "https://tmna.aemassets.toyota.com/is/image/toyota/toyota/jellies/relative/2024/tacoma/base.png",
    tags: ["suv", "versatile", "popular"],
    type: "suv",
    link: "https://www.toyota.com/configurator/build/step/model/year/2024/series/tacoma",
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

