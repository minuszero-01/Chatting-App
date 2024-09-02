import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { authOptions } from "@/lib/auth";
import { Message, messageArrayValidator } from "@/lib/validations/messages";
import { UserType } from "@/lib/validations/user";
import prisma from "@/prisma";
import axios from "axios";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { IoPersonOutline, IoSendSharp } from "react-icons/io5";

interface pageProps {
  params: {
    chatid: string;
  };
}

async function getChatPatnerDetails(
  chatPatnerId: string
): Promise<UserType | null> {
  const res = await prisma.user.findFirst({
    where: {
      id: chatPatnerId,
    },
  });

  return res;
}

async function getChatMessages(chatid: string) {
  try {
    const res = await prisma.chat.findFirst({
      where: {
        chat_id: chatid,
      },
      include: {
        messages: {
          where: {
            message_chat_id: chatid,
          },
        },
      },
    });

    const dbMessages = res?.messages;
    const dbMessages_reverse = dbMessages?.reverse();

    console.log(dbMessages_reverse);

    const messages = messageArrayValidator.parse(dbMessages_reverse);

    console.log("Reverse", messages);
    return messages;
  } catch (error) {
    console.log("No Messages", error);
  }
}

const page = async ({ params }: pageProps) => {
  const { chatid } = params;

  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const { user } = session;

  const [userid1, userid2] = chatid.split("-");

  if (userid1 !== user.id && userid2 !== user.id) {
    notFound();
  }

  const chatPatnerId = user.id === userid1 ? userid2 : userid1;

  const chatPatner = await getChatPatnerDetails(chatPatnerId);

  console.log(chatPatner);

  const intialMessages = await getChatMessages(chatid);

  console.log(params);

  return (
    <div className="p-4 w-full h-full">
      {chatid}
      <div className="flex flex-col w-full h-full">
        <div className="flex rounded-xl items-center gap-4 border p-2 bg-gray-100 text-[20px] font-medium">
          <div className="rounded-full bg-white p-2 ring-1 ring-black">
            <IoPersonOutline />
          </div>
          <div className="flex flex-col gap-1 ">
            <span>{chatPatner?.name}</span>
            <span className="text-sm text-gray-700">{chatPatner?.email}</span>
          </div>
        </div>

        <div className="px-4 overflow-auto border h-[600px]">
          {/* All my chat messages */}
          <Messages
            intialMessages={intialMessages}
            sessionId={session.user.id}
          />
        </div>

        <ChatInput chatId={chatid} />
      </div>
    </div>
  );
};

export default page;
