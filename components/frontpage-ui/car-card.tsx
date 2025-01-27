"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/frontpage-ui/card"
import type { Car } from "../../types/cars"
import Link from "next/link"

interface CarCardProps {
  car: Car
  index: number
}

export function CarCard({ car, index }: CarCardProps) {

  // console.log("carcard insdie", car)
  return (


      <Link href = {car.link}>
       
          <Card className="overflow-hidden h-full">
            <CardContent className="p-6">
              <div className=" relative mb-4 overflow-hidden rounded-lg bg-muted">
                <img
                  src={car.imageUrl || "/placeholder.svg"}
                  alt={car.name}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
              <p className="text-lg text-primary">Starting at ${car.msrp}</p>
            </CardContent>
          </Card>
 
      </Link>
    )
}

