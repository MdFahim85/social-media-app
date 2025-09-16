import { auth } from "@/auth";
import { LoginButton } from "@/components/SignIn";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/actions/user.action";
import Image from "next/image";
import ImageBox from "../ImageBox";

async function Sidebar() {
  const session = await auth();
  const sessionUser = session?.user;
  const user = await getUser(sessionUser?.id);
  if (!user) {
    return (
      <Card className="w-full max-w-sm text-sm min-h-32 flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Login with github</CardDescription>
          <CardAction>
            <LoginButton variant={"link"} text={"Sign Up"} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <LoginButton variant={"default"} text={"Sign In"} />
        </CardFooter>
      </Card>
    );
  }
  return (
    <div>
      <Card className="w-full text-sm">
        <CardHeader>
          <CardTitle>
            <div className="w-full flex justify-center">
              <ImageBox src={user.image} size={40} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex items-center flex-col">
          <div>{user.name}</div>
          <div>{user.email}</div>
        </CardContent>
        <div className="border-t border-gray-500 mx-6"></div>
        <CardFooter className="flex justify-between gap-2 text-gray-500 font-medium">
          <div> Followers : {user._count.followers}</div>
          <div> Following : {user._count.following}</div>
        </CardFooter>
      </Card>
    </div>
  );
}
export default Sidebar;
