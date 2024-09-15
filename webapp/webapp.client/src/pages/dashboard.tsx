import { useEffect, useState } from "react";
import { DashboardCertificate } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard-table/columns";
import { Employee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import {
  DashboardYearSelect,
  filterByYear,
} from "@/components/dashboard-table/filter";

export function Dashboard() {
  const [data, setData] = useState<Employee[]>();
  const [filteredData, setFilteredData] = useState<DashboardCertificate[]>();
  const [adoption, setAdoption] = useState<number>();
  const [year, setYear] = useState<string>();

  useEffect(() => {
    populateData();
  }, []);

  useEffect(() => {
    if (data) {
      const filteredData = filterByYear(
        data,
        new Date().getFullYear().toString(),
      );
      setFilteredData(filteredData);
    }
  }, [data]);

  useEffect(() => {
    if (data && year) {
      const filteredData = filterByYear(data, year);
      setFilteredData(filteredData);
    }
  }, [year]);

  useEffect(() => {
    if (filteredData) {
      const noCertificates = filteredData.filter(
        (certificate) => certificate.certificateLevel === "No certificates",
      ).length;
      const adoptionRate =
        ((filteredData.length - noCertificates) / filteredData.length) * 100;
      const roundedAdoptionRate = parseFloat(adoptionRate.toFixed(2));
      setAdoption(roundedAdoptionRate);
    }
  }, [filteredData]);

  return (
    <div className="flex flex-col gap-2 px-8">
      <h1 className="text-center text-4xl font-bold mt-4 mb-2">Dashboard</h1>
      <div className="flex flex-row justify-between w-full items-center">
        <DashboardYearSelect data={data || []} setYear={setYear} />
        <div className="flex flex-row gap-2">
          <h2 className="text-xl">Adoption Rate:</h2>
          <span className="text-xl">{adoption ? adoption : "Loading..."}%</span>
        </div>
        <Button variant="outline" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>
      {data && <DataTable columns={columns} data={filteredData || []} />}
    </div>
  );

  async function populateData() {
    const response = await fetch("employee");
    const data: Employee[] = await response.json();
    // Fetch all certificates along with it
    // Fan out the data to have one record per certificate per employee
    setData(data);
  }

  function exportToExcel() {
    if (!data || data.length === 0) {
      console.error("No data available to export at this moment.");
      return;
    }

    const dataToExport = filteredData || data;
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();

    const sheetName = year ? `Conscea Dashboard ${year}` : "Conscea Dashboard";
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const filename = year
      ? `conscea_dashboard_${year}.xlsx`
      : "conscea_dashboard.xlsx";
    XLSX.writeFile(wb, filename);
  }
}
