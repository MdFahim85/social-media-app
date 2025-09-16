import { auth } from "@/auth";
import Image from "next/image";

export default async function Profile() {
  const session = await auth();
  const user = session?.user;
  if (user)
    return (
      <div>
        <div>{session?.user?.name}</div>
        <div>{session?.user?.email}</div>
        <div>
          {user?.image && (
            <Image
              src={session?.user?.image || "randomimage.com"}
              alt="Avatar"
              width={40}
              height={40}
            />
          )}
        </div>
      </div>
    );
  if (!user) return <div>No data available</div>;
}
