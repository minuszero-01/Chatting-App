import { Button } from "./ui/button";
import { LuMessageCircle } from "react-icons/lu";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: any;
  onSignout: any;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="h-max w-full flex justify-between p-4 border items-center">
      <p className=" flex items-center gap-2 text-3xl font-medium">
        <LuMessageCircle />
        Chat App <span>.</span>
      </p>
      <Button onClick={user ? onSignout : onSignin}>
        {user ? "Logout" : "Login"}
      </Button>
    </div>
  );
};
