import { authOptions } from "@/lib/auth";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized0", { status: 401 });

    const [userid1, userid2] = chatId.split("-");

    if (session.user.id !== userid1 && session.user.id !== userid2) {
      return new Response("Unauthorized1", { status: 401 });
    }

    //identify chat patner id
    const friendId = session.user.id === userid1 ? userid2 : userid1;

    //Find all the friends of the logged in user
    const FriendList = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        friends: {
          where: {
            isAccepted: true,
          },
        },
      },
    });

    //Map all friends ID
    const allFriends = FriendList?.friends.map((item) => {
      return item.sender_id;
    });

    //Check whether the chat patner is a friend or not
    const isFriend = allFriends?.includes(friendId);

    console.log(allFriends, "  ", friendId);

    if (!isFriend) {
      return new Response("Unauthorized2", { status: 401 });
    }

    //Sender Details
    const senderDetails = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    //Validations Done

    const time = Date.now();

    await prisma.message.create({
      data: {
        message_chat_id: chatId,
        sender_id: session.user.id,
        receiver_id: friendId,
        text: text,
        timestamp: time,
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
  }
}
