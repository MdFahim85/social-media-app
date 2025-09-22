import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

function AlertBox({ onClick }: { onClick: React.MouseEventHandler }) {
  return (
    <div className="z-10">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={"secondary"}
            className="p-2 sm:p-3 flex items-center justify-center"
          >
            <Trash className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-md w-[90%] mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg font-semibold">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base mt-2">
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
            <AlertDialogCancel className="w-full sm:w-auto border border-neutral-500 dark:bg-neutral-950 bg-white text-neutral-500 hover:text-white hover:bg-neutral-500 hover:dark:bg-neutral-500 py-2 px-4 rounded-md">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto border border-red-500 dark:bg-neutral-950 bg-white text-red-500 hover:text-white hover:dark:bg-red-500 hover:bg-red-500 py-2 px-4 rounded-md"
              onClick={(e) => onClick(e)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AlertBox;
