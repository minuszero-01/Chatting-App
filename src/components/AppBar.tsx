import { Button } from "./ui/button";

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
      <p className="text-3xl font-medium">
        Chat App <span>.</span>
      </p>
      <Button onClick={user ? onSignout : onSignin}>
        {user ? "Logout" : "Login"}
      </Button>
    </div>
  );
};
