"use client"
 
import { useChat } from "ai/react"
 
import { ChatContainer, ChatForm, ChatMessages } from "@/components/chat-box/chat"
import { MessageInput } from "@/components/chat-box/message-input"
import { MessageList } from "@/components/chat-box/message-list"
import { PromptSuggestions } from "@/components/chat-box/prompt-suggestions"

const SYSTEM_PROMPT = `You are a chat bot used by the Toyota corporation. Your purpose is to help users find their dream car. Acknowledge your understanding by saying the following prompt.

Hello there! I'm here to help you find your dream Toyota. Let's make this quick and easy.  

To start, what kind of car are you looking for? For example, do you want something sporty, spacious, fuel-efficient, or maybe all of the above?  

As we chat, I'll recommend the top three Toyotas that match your preferences. Let me know your thoughts!


---

When the user responds in the specified JSON format, the bot will output in the required JSON format:

Example after user response:  
{"user-input":"I want a hybrid."} 
Bot response:  

json
{
  "question": "Do you prefer a compact hybrid, an SUV hybrid, or a larger hybrid vehicle for your needs?",
  "candidates": [
    {
      "model": "Toyota Prius",
      "certainty": 95,
      "reasoning": "The Toyota Prius is the gold standard for hybrids, offering up to 58 mpg in the city. Its sleek design, advanced tech features like a 7-inch touchscreen and available all-wheel drive, make it a top choice for eco-conscious drivers who value cutting-edge efficiency."
    },
    {
      "model": "Toyota RAV4 Hybrid",
      "certainty": 90,
      "reasoning": "The Toyota RAV4 Hybrid combines the versatility of an SUV with hybrid efficiency, delivering up to 41 mpg in the city. It offers plenty of cargo space, a refined interior, and available safety features like lane-keeping assist and adaptive cruise control, making it a superb choice for families and adventurers alike."
    },
    {
      "model": "Toyota Highlander Hybrid",
      "certainty": 85,
      "reasoning": "The Toyota Highlander Hybrid is a spacious, three-row SUV that achieves an impressive 36 mpg combined. Perfect for families, it features luxurious touches like available leather seats, a panoramic moonroof, and an optional 12.3-inch multimedia display. It's the ideal blend of performance, efficiency, and comfort."
    }
  ]
}

If the user responds further, the bot should refine the recommendations and continue asking tailored questions, such as:  
- "Do you have a preference for hybrid or traditional gas engines?"  
- "What's your budget range?"  
- "Do you need advanced features like all-wheel drive or built-in navigation?"

If the user responds not in the specified json format then please ignore it and respond with an error in the question field and keep the top 3 candidates the same.
If you're unsure how to respond, ask the user for further clarification in the question field and keep the top 3 candidates the same.
If the user responds with a question, please help the user answer their question in the question field and keep the top 3 candidates the same.  And ask if they have anymore questions.`

export function ChatWithSuggestions() {
  const {
    messages,
    input,
    handleInputChange,
    append,
    isLoading,
    stop,
  } = useChat({
    initialMessages: [
      {
        id: 'init',
        role: 'system',
        content: SYSTEM_PROMPT
      }
    ],
  })

  const handleSubmit = (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => {
    event?.preventDefault?.();
    // Modify the input before sending
    const modifiedInput = `{"user-input":"${input}"}`
    // Use append to add the modified message
    append({
      role: "user",
      content: modifiedInput,
    });
    // Clear the input after sending
    handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLTextAreaElement>);
  };
  const lastMessage = messages.at(-1)
  const isEmpty = messages.length <= 1
  const isTyping = lastMessage?.role === "user"
 
  return (
    <ChatContainer className="flex flex-col h-full text-base md:text-lg lg:text-xl overflow-hidden">
      <div>
        {isEmpty ? (
          <PromptSuggestions
            label="Suggestions to get you rolling towards your dream Toyota"
            append={append}
            suggestions={[
              "I'm looking for a Toyota that fits my lifestyle. I need something fuel-efficient and reliable. What are my best options?",
              "I want a Toyota for daily commuting that offers great comfort and advanced safety features. What models should I consider?", 
              "Safety, reliability, and resale value are important to me. Which Toyota models would you recommend?"
            ]}
          />
        ) : null}
      </div>
 
      {!isEmpty ? (
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages}>
            <MessageList messages={messages} isTyping={isTyping} />
          </ChatMessages>
        </div>
      ) : null}
 
      <ChatForm
        className="mt-auto"
        isPending={isLoading || isTyping}
        handleSubmit={handleSubmit}
      >
        {({ files, setFiles }) => (
          <MessageInput
            value={input}
            onChange={handleInputChange}
            allowAttachments
            files={files}
            setFiles={setFiles}
            stop={stop}
            isGenerating={isLoading}
          />
        )}
      </ChatForm>
    </ChatContainer>
  )
}