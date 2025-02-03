"use client"
 
import { useChat } from "ai/react"
import type { Car, Message, Question, Topqualities } from "../../types/cars"
import { ChatContainer, ChatForm, ChatMessages } from "@/components/chat-box/chat"
import { MessageInput } from "@/components/chat-box/message-input"
import { MessageList } from "@/components/chat-box/message-list"
import { PromptSuggestions } from "@/components/chat-box/prompt-suggestions"
import { useEffect } from "react";



const SYSTEM_PROMPT = `

### Key Differences Between \`"user"\` and \`"data"\` Role Handling:

| Role   | Purpose | Response Structure |
|--------|---------|--------------------|
| \`"user"\` | User-provided input to refine preferences | Returns \`"question"\` for further narrowing and \`"topqualities"\` based on preferences. |
| \`"data"\` | Fetching car recommendations from the database | Returns a \`"candidates"\` list of matching cars with certainty percentages. |


You are a chatbot used by the Toyota corporation. Your purpose is to help users find their dream car.

Your job is to ask tailored questions to narrow down the user's dream car and provide the top qualities they are looking for in the required format.

---

### Handling User Responses (\`role: "user"\`)
When the user responds in the specified **JSON format**, the bot will output in the required JSON format:

Example after user response:  
{"user-input":"I want a hybrid."}  
Bot sample response:  
\`\`\`json
{
  "question": "Do you prefer a compact hybrid, an SUV hybrid, or a larger hybrid vehicle for your needs?",
  "topqualities": 
    {
      minprice: provide an int,
      maxprice: provide an int,
      fuelType: provide one of the following: Gasoline, Hybrid EV, Battery EV, Fuel Cell EV, Plug-in Hybrid EV,
      model: if narrowed down, provide a model name, else return null for this category
    }
}
\`\`\`

---

### Handling Database Responses (\`role: "data"\`)
If the **role** is \`"data"\`, the bot should return results from the database and structure the response as follows:

Example database response:
\`\`\`json
{
  "candidates": [
    {
      "id": sample id from database,
      "name": model name from database,
      "msrp": price as an int,
      "imageUrl": image URL from database,
      "tags": ["tag1", "tag2", "tag3"],
      "type": type from database (e.g., "sedan", "SUV"),
      "link": car's build URL from the database,
      "certainty": "percentage of match certainty"
    },
    {
      "id": sample id from database,
      "name": model name from database,
      "msrp": price as an int,
      "imageUrl": image URL from database,
      "tags": ["tag1", "tag2", "tag3"],
      "type": type from database (e.g., "sedan", "SUV"),
      "link": car's build URL from the database,
      "certainty": "percentage of match certainty"
    },
    {
      "id": sample id from database,
      "name": model name from database,
      "msrp": price as an int,
      "imageUrl": image URL from database,
      "tags": ["tag1", "tag2", "tag3"],
      "type": type from database (e.g., "sedan", "SUV"),
      "link": car's build URL from the database,
      "certainty": "percentage of match certainty"
    }
  ]
}
\`\`\`

The \`"candidates"\` section should be **populated using database information**, ensuring the most relevant vehicles are shown based on user preferences.

- If **no matches** are found, generate alternative Toyota models that fit the user’s criteria.  
- The \`"certainty"\` field should **indicate how well each vehicle matches** the user's needs.

---


`



interface ChatBoxProps {
  onSendData: (cars: Car[]) => void; // Callback function type
}


export function ChatWithSuggestions( {onSendData} : ChatBoxProps) {
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
        id: "init",
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ],
  });

  const handleSubmit = (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => {
    event?.preventDefault?.();
  
    // Format the user's input
    const modifiedInput = `{"user-input":"${input}"}`;
    append({
      role: "user",
      content: modifiedInput,
    });
  
    // Call the onMessagesUpdate callback with updated messages
    // if (onMessagesUpdate) {
    //   onMessagesUpdate([...messages, { role: "user", content: modifiedInput }]);
      
    // }
  
    // Clear the input
    handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const handleResponse = async (qualities:Topqualities) => {
    try{
      const response = await fetch("/api/query",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qualities),
      });

      const data = await response.json();

      const modifiedInput = JSON.stringify({ "system-input": data })

      append({
        role: "system",
        content: modifiedInput,
      });
      
    }
    catch(e){
      console.log('Failed To fetch topqualities', e)
    }

    
  }
  const lastMessage = messages.at(-1)
  const isEmpty = messages.length <= 1
  const isTyping = lastMessage?.role === "user"




  useEffect(() => {
    if (messages.length > 1) {
      
      const lastMessage = messages.at(-1);

     
      if(!lastMessage){
        return
      }

     if (lastMessage.role === "assistant" ) {
    
        try {
          
          const startIndex = lastMessage.content.indexOf("{");
          const endIndex = lastMessage.content.lastIndexOf("}");
          const jsonContent = lastMessage.content.slice(startIndex,endIndex + 1);
          const parsed = JSON.parse(jsonContent);

          if(parsed.topqualities){
            handleResponse(parsed.topqualities)
          }

          
          if(parsed.candidates)
            onSendData(parsed.candidates)

          
        } catch (e) {
        return
        }
      }
              
    }
  }, [messages]);
  


 
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
              "Safety, reliability, and resale value are important to me. Which Toyota models would you recommend?",
            ]}
          />
        ) : null}
      </div>

      {!isEmpty ? (
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages}>
            <MessageList messages={messages} isTyping={isTyping}/>

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
  );
}
