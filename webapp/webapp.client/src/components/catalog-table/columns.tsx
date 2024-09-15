import { Certificate } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Certificate>[] = [
  {
    accessorKey: "name",
    header: "Certificate Name",
  },
  {
    accessorKey: "level",
    header: "Expertise",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
];
