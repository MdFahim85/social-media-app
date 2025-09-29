import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Bell, Home } from "lucide-react";
import { auth } from "@/auth";
import { LogoutButton } from "./SignInButtons";
import Image from "next/image";
import NotificationCount from "./NotificationCount";
import { Button } from "./ui/button";

async function DesktopNav() {
  const session = await auth();
  const user = session?.user;
  return (
    <div>
      <ul className="flex gap-6 items-center justify-between">
        <li>
          <Link href="/">
            <span className="flex gap-2">
              <Home /> Home
            </span>
          </Link>
        </li>
        <li>
          <Link href="/notifications">
            <span className="flex gap-2">
              <Bell /> <NotificationCount />
            </span>
          </Link>
        </li>

        {!user ? (
          <>
            <li>
              <Button variant={"outline"}>
                <Link href="/signin">Sign In</Link>
              </Button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href={`/profile/${user.id}`}>
                <Image
                  src={user.image || "/avatar.png"}
                  alt="UserAvatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            </li>
            <li>
              <LogoutButton text={"Log Out"} />
            </li>
          </>
        )}
        <li>
          <ModeToggle />
        </li>
      </ul>
    </div>
  );
}

export default DesktopNav;
