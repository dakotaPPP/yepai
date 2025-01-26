"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Message } from "../types/cars"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.type === "bot"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex w-full", isBot ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%] shadow-sm",
          isBot ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </motion.div>
  )
}

