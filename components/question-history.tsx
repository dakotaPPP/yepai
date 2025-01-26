"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import type { QuestionHistory } from "../types/cars"

interface QuestionHistoryProps {
  history: QuestionHistory[]
}

export function QuestionHistoryList({ history }: QuestionHistoryProps) {
  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4 space-y-4">
        <AnimatePresence initial={false}>
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <p className="font-semibold text-primary mb-2">{item.question}</p>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  )
}

