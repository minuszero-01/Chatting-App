"use client";
import axios, { AxiosError } from "axios";
import { FC, useState, useEffect } from "react";

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
    await axios.post("/api/friends/requests", {
      friendId,
      userRes,
    });
  };

  return (
    <div className="h-1/2 ">
      <div className="flex flex-col w-max p-4 ">
        <div className="text-2xl font-medium leading-10 mb-2">Waiting List</div>
        <div className="text-md block font-light leading-6 text-gray-900 divide-x-2 mb-2">
          Friend requests
        </div>
        {requests?.length != 0 ? (
          requests?.map((user) => (
            <div className="flex flex-col items-start gap-2">
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
            </div>
          ))
        ) : (
          <div className="text-slate-400">No Requests...</div>
        )}
      </div>
    </div>
  );
};

export default WaitingList;
