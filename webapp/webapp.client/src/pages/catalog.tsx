import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/catalog-table/columns";
import { Certificate } from "@/lib/types";

export function Catalog() {
  const [certificates, setCertificates] = useState<Certificate[]>();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center text-4xl font-bold my-4">
        Certification Catalog
      </h1>
      {certificates && <DataTable columns={columns} data={certificates} />}
    </div>
  );

  async function fetchData() {
    const response = await fetch("certificate");
    const data = await response.json();
    setCertificates(data);
  }
}
