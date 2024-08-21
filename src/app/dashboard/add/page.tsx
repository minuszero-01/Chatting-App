import AddFriend from "@/components/AddFriend";
import WaitingList from "@/components/WaitingList";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-[90vh] border flex flex-col gap-4">
      <AddFriend />
      <WaitingList />
    </div>
  );
};

export default page;
