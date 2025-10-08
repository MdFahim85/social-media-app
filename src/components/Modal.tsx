import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "../../types/types";
import ImageBox from "./ImageBox";
import Link from "next/link";
import { CardContent } from "./ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-dropdown-menu";

function Modal({ user, type }: { user: User; type: string }) {
  const count =
    type === "followers" ? user._count.followers : user._count.following;
  return (
    <Dialog>
      <DialogTrigger disabled={count === 0}>
        <div className="flex flex-col items-center">
          <div className="text-lg">
            {type === "followers"
              ? user._count.followers
              : user._count.following}
          </div>
          <div className="text-gray-500 text-sm">
            {type === "followers" ? "Followers" : "Following"}
          </div>
        </div>
      </DialogTrigger>
      {type === "followers" ? (
        <DialogContent>
          {user.followers.map((follower) => (
            <DialogHeader key={follower.follower.id}>
              <DialogTitle>
                <CardContent>
                  <ScrollArea className="h-fit w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <Link href={`/profile/${follower.follower.id}`}>
                        <div className="flex items-center gap-4">
                          <ImageBox src={follower.follower.image} size={40} />
                          <div className="text-sm md:text-base">
                            <div className="font-medium">
                              {follower.follower.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {follower.follower._count.followers} followers
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="flex justify-end sm:justify-start"></div>
                    </div>
                    <Separator className="my-2" />
                  </ScrollArea>
                </CardContent>
              </DialogTitle>
            </DialogHeader>
          ))}
        </DialogContent>
      ) : (
        <DialogContent>
          {user.following.map((following) => (
            <DialogHeader key={following.following.id}>
              <DialogTitle>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Link href={`/profile/${following.following.id}`}>
                    <div className="flex items-center gap-4">
                      <ImageBox src={following.following.image} size={40} />
                      <div className="text-sm md:text-base">
                        <div className="font-medium">
                          {following.following.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {following.following._count.followers} followers
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex justify-end sm:justify-start"></div>
                </div>
              </DialogTitle>
            </DialogHeader>
          ))}
        </DialogContent>
      )}
    </Dialog>
  );
}

export default Modal;
