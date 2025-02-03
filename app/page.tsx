"use client"

import { useState } from "react"
import { cars } from "../data/cars"
import type { Car } from "../types/cars"
import { CarCard } from "@/components/frontpage-ui/car-card"
import { motion} from "framer-motion"
import { ChatWithSuggestions } from "@/components/chat-box/chat-with-suggestions"



export default function CarRecommendation() {

  const [recommendations, setRecommendations] = useState<Car[]>(cars.slice(0, 3))
 

  const handleGPTtext = (newrecomendations : Car[]) => {

    setRecommendations(newrecomendations.slice(0, 3))


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
          <ChatWithSuggestions onSendData={handleGPTtext}/>
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
