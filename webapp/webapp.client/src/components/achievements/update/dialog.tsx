import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModifyAchievementForm } from "./form";
import { PenSquare } from "lucide-react";
import { HomeCertificate } from "@/lib/types";

export function ModifyAchievement({
  achievement,
  triggerRefresh,
}: {
  achievement: HomeCertificate;
  triggerRefresh: () => Promise<void>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <PenSquare className="flex cursor-pointer w-5 h-5" />
      </AlertDialogTrigger>
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Modify Achievement</AlertDialogTitle>
          <AlertDialogDescription>
            Modify an existing achievement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ModifyAchievementForm
          achievement={achievement}
          triggerRefresh={triggerRefresh}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
