"use client"

import { ChatWithSuggestions } from "@/components/ui/chat-with-suggestions"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col text-base md:text-lg lg:text-xl">
      <div className="flex-1 h-1/3 md:h-1/4 lg:h-1/3" /> {/* Top empty space */}
      <div className="h-2/3 md:h-3/4 lg:h-2/3 p-4 md:p-6 lg:p-8"> {/* Bottom with chat */}
        <ChatWithSuggestions />
      </div>
    </main>
  )
}