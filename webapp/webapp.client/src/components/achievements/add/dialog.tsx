import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddAchievementForm } from "./form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AddAchievement({
  triggerRefresh,
}: {
  triggerRefresh: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen(!open);
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button onClick={toggleOpen}>Add Achievement</Button>
      </AlertDialogTrigger>
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Achievement</AlertDialogTitle>
          <AlertDialogDescription>
            Add a new achievement to your profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AddAchievementForm
          triggerRefresh={triggerRefresh}
          callback={toggleOpen}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
