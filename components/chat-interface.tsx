"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Message } from "../types/cars"
import { ChatMessage } from "./chat-message"

interface ChatInterfaceProps {
  messages: Message[]
  currentQuestion: string
  onSendMessage: (message: string) => void
}

export function ChatInterface({ messages, currentQuestion, onSendMessage }: ChatInterfaceProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [scrollRef]) // Updated dependency

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = inputRef.current?.value.trim()
    if (message) {
      onSendMessage(message)
      inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Input ref={inputRef} placeholder={currentQuestion} className="flex-1" />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  )
}

