import AddFriend from "@/components/AddFriend";
import WaitingList from "@/components/WaitingList";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-[90vh] border flex flex-col gap-4">
      <AddFriend />
      <div className="border border-gray-200 mx-10"></div>
      <WaitingList />
    </div>
  );
};

export default page;
