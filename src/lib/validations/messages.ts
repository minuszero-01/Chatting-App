import { timeStamp } from "console";
import { z } from "zod";

export const messageValidator = z.object({
  id: z.string(),
  message_chat_id: z.string(),
  sender_id: z.string(),
  receiver_id: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
