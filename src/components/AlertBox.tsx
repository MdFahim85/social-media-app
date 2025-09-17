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
    <div className="z-999">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"secondary"}>
            <Trash stroke="red" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border border-slate-500  text-slate-500 hover:text-white hover:bg-slate-500">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="border border-red-500  text-red-500 hover:text-white hover:bg-red-500"
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
