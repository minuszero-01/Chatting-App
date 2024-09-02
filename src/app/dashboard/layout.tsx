import GetFriends from "@/components/GetFriends";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode, FC } from "react";
import { FaRegUser } from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

interface SideBarOption {
  id: number;
  name: string;
  href: string;
  icon: ReactNode;
}

const siderbarOptions: SideBarOption[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    icon: <FaRegUser />,
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return (
    <div className="w-full flex h-[90vh]">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-auto border-r border-gray-200 bd-white px-6 ">
        <Link href={"/dashboard"} className="flex h-16 shrink-0 items-center">
          Logo Link
        </Link>
        <div className="text-sm font-semibold leading-6 text-gray-400">
          Your Chats
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <GetFriends />
            </li>
            <li>
              <div className="text-sm font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="list" className="">
                {siderbarOptions.map((option) => {
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-green-500 hover:bg-accent group flex gap-3 rounded-md text-sm p-2 leading-6 font-semibold items-center"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:text-green-500 group-hover:border-green-500 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium">
                          {option.icon}
                        </span>
                        <span className="trucate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      {children}
    </div>
  );
};

export default Layout;
