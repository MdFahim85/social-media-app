import { auth } from "@/auth";
import ImageBox from "@/components/ImageBox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default async function Profile() {
  const session = await auth();
  const user = session?.user;
  if (user)
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
          <CardFooter className="flex justify-between gap-2 text-gray-500 font-medium"></CardFooter>
        </Card>
      </div>
    );
  if (!user) return <div>No data available</div>;
}
