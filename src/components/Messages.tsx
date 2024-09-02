"use client";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validations/messages";
import { FC, useRef, useState } from "react";
import { format } from "date-fns";

interface MessagesProps {
  intialMessages: Message[] | undefined;
  sessionId: string;
}

const Messages: FC<MessagesProps> = ({ intialMessages, sessionId }) => {
  const [messages, setMessages] = useState<Message[] | undefined>(
    intialMessages
  );

  const formatTimeStamp = (timeStamp: number) => {
    return format(timeStamp, "HH:mm");
  };

  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-grey scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch "
    >
      <div ref={scrollDownRef} />
      {messages?.map((message, index) => {
        const isCurrentUser = message.sender_id === sessionId;

        const hasNextMessageSameUser =
          messages[index - 1]?.sender_id === messages[index]?.sender_id;
        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col spac-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-sky-500 text-white text-base": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none": !hasNextMessageSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs font-light  text-gray-900">
                    {formatTimeStamp(message.timestamp)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
