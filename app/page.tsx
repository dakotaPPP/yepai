"use client"

import { ChatWithSuggestions } from "@/components/ui/chat-with-suggestions"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 h-1/3" /> {/* Top 1/3 empty space */}
      <div className="h-2/3 p-8"> {/* Bottom 2/3 with chat */}
        <ChatWithSuggestions />
      </div>
    </main>
  )
}
