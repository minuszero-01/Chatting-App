"use client";
import { FC, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface ChatInputProps {
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatId }) => {
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const sendMessage = async () => {
    setIsLoading(true);

    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput(" ");
      textareaRef.current?.focus();
    } catch (error) {
      setInput("");
      toast.error("Something is Wrong !!!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative flex gap-4 justify-center items-center ">
      <Toaster />
      <TextareaAutosize
        id="mesaage"
        className="w-full p-4 rounded-full ring-1 ring-gray-400"
        placeholder="Write a message..."
        autoComplete="off"
        ref={textareaRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        rows={1}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <Button type="submit" className=" flex justify-center items-center   ">
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
