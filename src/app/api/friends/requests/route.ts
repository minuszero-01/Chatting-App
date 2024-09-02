import { authOptions } from "@/lib/auth";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log(session.user?.id);
    const userData = await prisma.user.findFirst({
      where: {
        id: session.user?.id,
      },
      include: {
        friends: {
          where: {
            isAccepted: false,
          },
        },
      },
    });

    if (!userData) {
      return new Response("Nothing to show here...", { status: 401 });
    }

    const friendRequests = userData.friends.map((friend) => ({
      id: friend.id,
      sender_id: friend.sender_id,
      receiver_id: friend.receiver_id,
      name: friend.name,
      email: friend.email,
      isAccepted: friend.isAccepted,
    }));

    console.log(friendRequests);

    return new Response(JSON.stringify(friendRequests), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { userRes, friendId } = body;

    console.log("body", body);

    const requestIdData = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        friends: {
          where: {
            sender_id: friendId,
          },
        },
      },
    });

    if (userRes === "accept") {
      const requestIdFriend = requestIdData?.friends[0].id;

      await prisma.friends.update({
        where: {
          id: requestIdFriend,
        },
        data: {
          isAccepted: true,
        },
      });

      await prisma.friends.create({
        data: {
          sender_id: session.user.id,
          receiver_id: friendId,
          isAccepted: true,
          name: requestIdData?.name,
          email: requestIdData?.email,
        },
      });

      const sortedIds = [session.user.id, friendId].sort();
      const chatId = `${sortedIds[0]}-${sortedIds[1]}`;

      await prisma.chat.create({
        data: {
          chat_id: chatId,
        },
      });
    }

    if (userRes === "delete") {
      const requestId = requestIdData?.friends[0].id;

      await prisma.friends.delete({
        where: {
          id: requestId,
        },
      });
    }

    return new Response("ok", {
      status: 200,
    });
  } catch (error) {
    return new Response("Invalid request payload", { status: 422 });
  }
}
