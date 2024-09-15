import { DashboardCertificate } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<DashboardCertificate>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "certificateName",
    header: "Certificate Name",
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
];
