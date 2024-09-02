"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

type Friend = {
  id: string;
  sender_id: string;
  receiver_id: string;
  name: string;
  email: string;
  isAccepted: boolean;
};

const GetFriends = () => {
  const [requests, setRequests] = useState<Friend[]>([]);
  useEffect(() => {
    const incomingRequests = async () => {
      try {
        const res = await axios.get("/api/friends/showfriends");

        setRequests(res.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Failed to fetch friend requests", error);
        }
      }
    };

    incomingRequests();
  }, []);

  return (
    <div>
      {requests.map((friend, index) => {
        const sortedIds = [friend.sender_id, friend.receiver_id].sort();
        const chatId = `${sortedIds[0]}-${sortedIds[1]}`;

        return (
          <Link href={`/dashboard/chat/${chatId}`} key={index}>
            <button className="text-gray-700 hover:text-green-500 hover:bg-accent w-full flex gap-3 rounded-md text-sm p-2 leading-6 font-semibold items-center">
              {friend.name.charAt(0).toUpperCase() + friend.name.slice(1)}
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default GetFriends;
