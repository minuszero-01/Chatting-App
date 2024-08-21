"use client";
import axios, { AxiosError } from "axios";
import { FC, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { json } from "stream/consumers";

interface WaitingListProps {}

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  name: string;
  email: string;
  isAccepted: boolean;
}

const WaitingList = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  useEffect(() => {
    const incomingRequests = async () => {
      try {
        const res = await axios.get("/api/friends/requests");
        console.log(res.data);

        setRequests(res.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Failed to fetch friend requests", error);
        }
      }
    };

    incomingRequests();
  }, []);

  const handleRequest = async (event: any) => {
    console.log(event);
    const friendId = event.target.value;
    const userRes = event.target.innerText;
    const res = await axios.post("/api/friends/requests", {
      friendId,
      userRes,
    });
  };

  return (
    <div className="h-1/2 border border-red-200">
      <div className="flex flex-col w-max p-4 ">
        <div className="text-2xl font-medium leading-10">Waiting List</div>
        <div className="text-sm block font-medium leading-6 text-gray-900 divide-x-2">
          Friend requests
        </div>
        {requests.map((user) => (
          <div
            key={user.id}
            className="flex flex-row gap-2 justify-center items-center"
          >
            <div>
              {user.name}
              <span className="mx-2">|</span>
              <span>({user.email})</span>
            </div>
            <button
              onClick={handleRequest}
              value={user.sender_id}
              className="p-1 rounded-lg ring-1 bg-green-400 text-white"
            >
              accept
            </button>
            <button
              onClick={handleRequest}
              value={user.sender_id}
              className="p-1 rounded-lg ring-1 bg-red-400 text-white"
            >
              delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaitingList;
