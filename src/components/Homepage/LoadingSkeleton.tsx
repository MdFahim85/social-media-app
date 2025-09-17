import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "../ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Card className="w-full ">
        <CardContent>
          <div className="flex gap-4 items-start">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className=" h-32 w-128 px-0" />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between ps-14">
            <Skeleton className=" size-6" />
            <Skeleton className=" size-6" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
