export interface Car {
  id: string
  name: string
  msrp: number
  image: string
  link: string
}

export interface Message {
  id: string
  content: string
  type: "bot" | "user"
  timestamp: number
}

export interface Question {
  id: string
  text: string
  nextQuestion: string
}

