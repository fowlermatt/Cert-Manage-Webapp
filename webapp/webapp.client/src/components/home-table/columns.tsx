import { HomeCertificate } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ModifyAchievement } from "@/components/achievements/update/dialog";
import { Trash2 } from "lucide-react";
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

export function DeleteComponent({
  id,
  triggerRefresh,
}: {
  id: number;
  triggerRefresh: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 className="flex cursor-pointer text-red-600 w-5 h-5" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this certificate?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await fetch(`achievement/${id}`, {
                method: "DELETE",
              });
              triggerRefresh();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function getColumns(
  triggerRefresh: () => Promise<void>,
): ColumnDef<HomeCertificate>[] {
  return [
    {
      accessorKey: "certification",
      header: "Certification",
    },
    {
      accessorKey: "certificateLevel",
      header: "Certificate Level",
    },
    {
      accessorKey: "certifiedDate",
      header: "Certified Date",
    },

    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const achievement = row.original;

        if (!achievement.expiryDate) {
          return null;
        }

        const expiryDate = new Date(achievement.expiryDate);
        const currentDate = new Date();
        const isExpired = expiryDate < currentDate;
        const color = isExpired ? "text-red-500" : "text-green-500";
        const className = `${color} rounded-full px-2 py-1`;

        return (
          <span className={className}>{isExpired ? "Expired" : "Valid"}</span>
        );
      },
    },
    {
      id: "modify",
      header: "Modify",
      cell: ({ row }) => {
        const achievement = row.original;

        return (
          <div className="flex w-full justify-center">
            <ModifyAchievement
              achievement={achievement}
              triggerRefresh={triggerRefresh}
            />
          </div>
        );
      },
    },
    {
      id: "delete",
      header: "Delete",
      cell: ({ row }) => {
        const achievement = row.original;

        return (
          <div className="flex w-full justify-center">
            <DeleteComponent
              id={achievement.id}
              triggerRefresh={triggerRefresh}
            />
          </div>
        );
      },
    },
  ];
}
