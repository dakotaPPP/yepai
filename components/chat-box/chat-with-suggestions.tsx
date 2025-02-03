"use client"
 
import { useChat } from "ai/react"
import type { Car, Message, Question, Topqualities } from "../../types/cars"
import { ChatContainer, ChatForm, ChatMessages } from "@/components/chat-box/chat"
import { MessageInput } from "@/components/chat-box/message-input"
import { MessageList } from "@/components/chat-box/message-list"
import { PromptSuggestions } from "@/components/chat-box/prompt-suggestions"
import { useEffect } from "react";


// "candidates": [
//   {
//     id: "supra-2025",
//     name: "2025 Supra",
//     msrp: 22325,
//     imageUrl:
//       "https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/2025/corolla/base.png",
//     tags: ["efficient", "compact", "affordable"],
//     type: "sedan",
//     link: "https://toyota.com",
//     certainty: '90%',
//   },
//   {
//     id: "camry-2025",
//     name: "2025 Super",
//     msrp: 28700,
//     imageUrl:
//       "https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/2025/grsupra/base.png",
//     tags: ["spacious", "reliable", "comfortable"],
//     type: "sedan",
//     link: "https://toyota.com",
//     certainty: '80%',
//   },
//   {
//     id: "rav4-2025",
//     name: "2025 Supra",
//     msrp: 30725,
//     imageUrl:
//       "https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/2025/grsupra/base.png",
//     tags: ["suv", "versatile", "popular"],
//     type: "suv",
//     link: "https://toyota.com",
//     certainty: '70%',
// }
// ]

const SYSTEM_PROMPT = `You are a chat bot used by the Toyota corporation. Your purpose is to help users find their dream car. 

Your purpose is to provide with a tailored question to help narow down the users dream car, and to provide with the top qualities that they are looking in the fromat of the example provided below.

Acknowledge your understanding by saying the following prompt.

Hello there! I'm here to help you find your dream Toyota. Let's make this quick and easy.  

To start, what kind of car are you looking for? For example, do you want something sporty, spacious, fuel-efficient, or maybe all of the above?  

As we chat, I'll recommend the top three Toyotas that match your preferences. Let me know your thoughts!


---

When the user responds in the specified JSON format, the bot will output in the required JSON format:

Example after user response:  
{"user-input":"I want a hybrid."} 
Bot sample response:  
json
{
  "question": "Do you prefer a compact hybrid, an SUV hybrid, or a larger hybrid vehicle for your needs?",
  "topqualities": 
    {
      minprice: provide an int
      maxprice: provide an int
      fuelType: provide one of the following Gasoline, Hybrid EV, Battery EV, Fuel Cell EV, Plug-in Hybrid EV
      model: if narowed down you could provide a model name else return null for this category
    }
  

}

If the user responds further, the bot should refine the recommendations and continue asking tailored questions, such as:  
- "Do you have a preference for hybrid or traditional gas engines?"  
- "Would you like a plug-in-hybrid or a battery ev "
- "What's your budget range?"  
- "Do you need advanced features like all-wheel drive or built-in navigation?"

If the user responds not in the specified json format then please ignore it and respond with an error in the question field and keep the topqualities the same.
If you're unsure how to respond, ask the user for further clarification in the question field and keep the topqualities.
If the user responds with a question, please help the user answer their question in the question field and keep the topqualities the same.  And ask if they have anymore questions.
If given a lower range but not a higher range estimate a higher range, if given a higher range but not a lower range estimate a lower range`



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
    if (onMessagesUpdate) {
      onMessagesUpdate([...messages, { role: "user", content: modifiedInput }]);
      
    }
  
    // Clear the input
    handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const handleResponse = async (qualities:Topqualities) => {
    try{
      console.log('pared in handle response ', qualities)
      const response = await fetch("/api/query",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qualities),
      });
      const data = response.json();
      return data
    }
    catch(e){
      console.log('Failed To fetch topqualities', e)
    }
 


    
  }
  const lastMessage = messages.at(-1)
  const isEmpty = messages.length <= 1
  const isTyping = lastMessage?.role === "user"

  // console.log('lastMessage',lastMessage?.content)
  // console.log("this is is typing",isTyping)
  // console.log('full message', messages)


  useEffect(() => {
    if (messages.length > 1) {
      
      const lastMessage = messages.at(-1);

     
      if(!lastMessage){
        return
      }

     if (lastMessage.role === "assistant" ) {
    
        try {
          console.log('RESPONSE MESSAGE', lastMessage.content)
          const startIndex = lastMessage.content.indexOf("{");
          const endIndex = lastMessage.content.lastIndexOf("}");
          const jsonContent = lastMessage.content.slice(startIndex,endIndex + 1);
          const parsed = JSON.parse(jsonContent);

          console.log('usestate parsed', parsed)

          handleResponse(parsed.topqualities)

          // onSendData(parsed.candidates)

          
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
