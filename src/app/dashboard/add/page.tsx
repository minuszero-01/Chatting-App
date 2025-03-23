import AddFriend from "@/components/AddFriend";
import WaitingList from "@/components/WaitingList";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  return (
    <div className="w-full h-[90vh] border flex flex-col gap-4">
      <AddFriend />
      <div className="border border-gray-200 mx-10"></div>
      <WaitingList sessionId={session.user.id} />
    </div>
  );
};

export default page;
