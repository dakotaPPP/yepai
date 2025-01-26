import {
  ChatMessage,
  type ChatMessageProps,
  type Message,
} from "@/components/chat-box/chat-message";
import { TypingIndicator } from "@/components/chat-box/typing-indicator";

type AdditionalMessageOptions = Partial<Omit<ChatMessageProps, keyof Message>>;

interface MessageListProps {
  messages: Message[];
  showTimeStamps?: boolean;
  isTyping?: boolean;
  messageOptions?:
    | AdditionalMessageOptions
    | ((message: Message) => AdditionalMessageOptions);
}

export function MessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
  messageOptions,
}: MessageListProps) {
  return (
    <div className="space-y-4 overflow-visible">
      {messages
        .filter((message) => message.role !== "system")
        .map((message, index) => {
          const additionalOptions =
            typeof messageOptions === "function"
              ? messageOptions(message)
              : messageOptions;


        // For assistant messages, try to parse JSON
        if (message.role === "assistant") {
          try {
            const startIndex = message.content.indexOf("{");
            const endIndex = message.content.lastIndexOf("}");
            const jsonContent = message.content.slice(startIndex,endIndex + 1);
            const parsed = JSON.parse(jsonContent);
            return (
              <ChatMessage
                key={index}
                showTimeStamp={showTimeStamps}
                {...message}
                content={parsed.question || message.content}
                {...additionalOptions}
              />
            );
          } catch (e) {
            // If JSON parsing fails, show typing indicator
            return <TypingIndicator key={index} />;
          }

          // Handle user messages
          const modifiedMessage = {
            ...message,
            content: message.content.slice(15, -2),
          };

          return (
            <ChatMessage
              key={index}
              showTimeStamp={showTimeStamps}
              {...modifiedMessage}
              {...additionalOptions}
            />
          );
        })}
      {isTyping && <TypingIndicator />}
    </div>
  );
}