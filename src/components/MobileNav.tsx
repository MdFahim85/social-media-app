import Link from "next/link";
import { Bell, Home, Menu } from "lucide-react";
import { auth } from "@/auth";
import NotificationCount from "./NotificationCount";
import { ModeToggle } from "./ModeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoginButton, LogoutButton } from "./SignIn";
import ImageBox from "./ImageBox";

async function MobileNav() {
  const session = await auth();
  const user = session?.user;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                href="/"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/notifications"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                <NotificationCount />
              </Link>
            </li>

            {!user ? (
              <li className="mt-4">
                <div className="p-3">
                  <LoginButton variant={"secondary"} text={"Sign In"} />
                </div>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href={`/profile/${user.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ImageBox src={user.image} size={32} />
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <div className="p-3">
                    <LogoutButton text={"Log Out"} />
                  </div>
                </li>
              </>
            )}
            <li className="mt-4 border-t pt-4">
              <div className="flex items-center gap-3 p-3">
                <span>Theme</span>
                <ModeToggle />
              </div>
            </li>
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
