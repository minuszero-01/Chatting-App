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

    const receivedFriends = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
      include: {
        friends: {
          where: {
            isAccepted: true,
          },
        },
      },
    });

    if (!receivedFriends) {
      return new Response("Nothing to show here...", { status: 401 });
    }

    console.log(receivedFriends);
    return new Response(JSON.stringify(receivedFriends.friends), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
  }
}
