"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { FC, useState, useEffect } from "react";
import toast from "react-hot-toast";

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  name: string;
  email: string;
  isAccepted: boolean;
}

type RequestResponse = {
  id: string;
  status: string;
};

type WaitingListProps = {
  sessionId: string;
};

const WaitingList = ({ sessionId }: WaitingListProps) => {
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

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:Requests`));

    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const ResponseHandler = (props: RequestResponse) => {
      setRequests((prev) => {
        console.log("Before filtering:", prev);
        console.log("Removing ID:", props.id);

        const filteredRequests = prev.filter(
          (item) => item.sender_id !== props.id
        );

        console.log("After filtering:", filteredRequests);

        return filteredRequests;
      });
      if (props.status == "accept") {
        toast.success(`Friend Request Accepted`);
      } else {
        toast.success(`Friend Request Removed`);
      }
    };

    const friendRequestHandler = (props: FriendRequest) => {
      setRequests((prev) => [
        ...prev,
        {
          id: props.id,
          sender_id: props.sender_id,
          receiver_id: props.receiver_id,
          name: props.name,
          email: props.email,
          isAccepted: props.isAccepted,
        },
      ]);

      toast.success(`Friend Request from ${props.name}`);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);
    pusherClient.bind("RequestResponse", ResponseHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);

      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:Requests`));
      pusherClient.unbind("RequestResponse", ResponseHandler);
    };
  }, []);

  const handleRequest = async (event: any) => {
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
        <div className="text-2xl font-medium leading-10 mb-2">Requests</div>

        {requests?.length != 0 ? (
          requests?.map((user) => (
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-row gap-2 justify-center items-center">
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
