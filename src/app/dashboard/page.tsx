import AddFriend from "@/components/AddFriend";
import { AppbarClient } from "@/components/AppbarClient";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import { FC, useState } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return <div className="border h-[90vh] w-full border-black">Dashboard</div>;
};

export default page;
