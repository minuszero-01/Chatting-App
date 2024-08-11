import { AppbarClient } from "@/components/ui/AppbarClient";
import { Button } from "@/components/ui/button";

import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      page
      <Button>Hello</Button>
    </div>
  );
};

export default page;
