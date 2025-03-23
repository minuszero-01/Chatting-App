import { NextResponse } from "next/server";
import { addFriendValidator } from "@/lib/validations/add-friend";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const dbData = await prisma.user.findFirst({
      where: {
        email: emailToAdd,
      },
    });

    if (!dbData) {
      return NextResponse.json("This person doesn't exist", { status: 401 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (dbData.id === session.user.id) {
      return NextResponse.json("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    const existingRequest = await prisma.friends.findFirst({
      where: {
        sender_id: session.user.id,
        receiver_id: dbData.id,
      },
    });

    if (existingRequest) {
      if (!existingRequest.isAccepted) {
        return NextResponse.json("Already sent a friend request", {
          status: 400,
        });
      } else {
        return NextResponse.json("Already a friend.", {
          status: 400,
        });
      }
    }

    await prisma.friends.create({
      data: {
        sender_id: session.user.id,
        receiver_id: dbData.id,
        name: session.user.name,
        isAccepted: false,
        email: session.user.email,
      },
    });

    return NextResponse.json("Friend request sent.", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("An error occurred", { status: 500 });
  }
}
