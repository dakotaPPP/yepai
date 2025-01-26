"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { cars, questions } from "../data/cars"
import type { Car, Message, Question } from "../types/cars"
import { CarCard } from "../components/frontpage-ui/car-card"
import { motion, AnimatePresence} from "framer-motion"
import { ChatWithSuggestions } from "@/components/chat-box/chat-with-suggestions"

export default function CarRecommendation() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0])
  const [recommendations, setRecommendations] = useState<Car[]>(cars.slice(0, 3))
  const [oldRecommendations, setOldRecommendations] = useState<Car[]>([]) // To store old cards
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      content: questions[0].text,
      type: "bot",
      timestamp: Date.now(),
    },
  ])

  const handleMessage = (message: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        content: message,
        type: "user",
        timestamp: Date.now(),
      },
    ])

    // Handle old cards animation
    handleOldCards(() => {
      // Update old recommendations
      setOldRecommendations([...recommendations]) // Move current to old
      setRecommendations(cars.slice(4,7)) // Replace with new recommendations
    })

    // Move to next question
    const nextQuestion = questions.find((q) => q.id === currentQuestion.nextQuestion)
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            content: nextQuestion.text,
            type: "bot",
            timestamp: Date.now(),
          },
        ])
      }, 500)
    }
  }

  // Handle old cards animation
  const handleOldCards = (onComplete: () => void) => {
    setOldRecommendations([...recommendations]) // Move current cards to old
    setTimeout(() => {
      onComplete() // Trigger callback after the animation delay
    }, 500) // Match the animation duration
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto h-1/2">
        <header className="flex items-center space-x-3 relative top-12">
          <img
            src={"/toyota-logo.png"}
            alt={"toyota logo"}
            className="h-8 w-8"
          />
          <span className="text-xl font-bold">Toyota</span>
        </header>

        <h1 className="text-3xl font-bold text-center mb-8 mt-4">
          Find Your Perfect Toyota
        </h1>
        <hr className="border-gray-300 mb-8" />

        {/* Top Recommendations */}
        <div className="mb-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full relative">
            {/* Render Old Cards */}
            {oldRecommendations.map((car, index) => (
              <motion.div
                key={`old-${car.id || index}`}
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 1300, opacity: 0 }} // Move off-screen to the right
                exit={{ x: 1300, opacity: 0 }} // Ensure exit animation matches
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="absolute top-0 left-0 w-full h-full"
              >
                <CarCard car={car} index={index} />
              </motion.div>
            ))}

            {/* Render New Cards */}
            {recommendations.map((car, index) => (
              <motion.div
                key={`new-${car.id || index}`}
                initial={{ x: -200, opacity: 0 }} // Start slightly off-screen to the left
                animate={{ x: 0, opacity: 1 }} // Move into view
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative h-full"
              >
                <CarCard car={car} index={index} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="fixed bottom-0 left-0 w-full h-1/2 overflow-y-scroll px-12 py-4">
          <ChatWithSuggestions />
        </div>
        
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  )
}
