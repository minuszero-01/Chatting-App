import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validations/add-friend";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const dbData = await prisma.user.findFirst({
      where: {
        email: emailToAdd,
      },
    });

    console.log("friend data", dbData);

    const idToAdd = dbData?.id;
    if (!idToAdd) {
      return new Response("This person doesn't exist", { status: 401 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd == session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    //Add a check if user is already added

    const friendRequest = await prisma.friends.findFirst({
      where: {
        sender_id: session.user.id,
      },
    });
    if (
      friendRequest?.receiver_id == dbData.id &&
      friendRequest?.isAccepted == false
    ) {
      return new Response("Already sent a friend request", {
        status: 400,
      });
    }
    if (
      friendRequest?.receiver_id == dbData.id &&
      friendRequest?.isAccepted == true
    ) {
      return new Response("Already a friend.", {
        status: 400,
      });
    }

    await prisma.friends.create({
      data: {
        sender_id: session.user.id,
        receiver_id: dbData?.id,
        name: session.user.name,
        isAccepted: false,
        email: session.user.email,
      },
    });

    return new Response("Friend request sent.", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
  }
}
