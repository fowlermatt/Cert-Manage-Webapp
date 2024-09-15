import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { DashboardCertificate, Employee } from "@/lib/types";
import { format } from "date-fns";
import { getExpiryDate } from "@/lib/utils";

export function DashboardYearSelect({
  data,
  setYear,
}: {
  data: Employee[];
  setYear: (year: string) => void;
}) {
  const allYears = data.flatMap((certificate) => {
    return certificate.achievements.map((achievement) =>
      new Date(achievement.certifiedDate).getFullYear().toString(),
    );
  });

  const uniqueYears = Array.from(new Set(allYears)).sort(
    (a, b) => parseInt(b) - parseInt(a),
  );

  return (
    <Select
      defaultValue={new Date().getFullYear().toString()}
      onValueChange={(value) => setYear(value)}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Filter by year" />
      </SelectTrigger>
      <SelectContent>
        {uniqueYears.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function filterByYear(data: Employee[], year: string) {
  // Remove achievements not achieved in current year
  const filteredData = data.map((employee) => {
    const achievements = employee.achievements.filter(
      (achievement) =>
        new Date(achievement.certifiedDate).getFullYear().toString() === year,
    );
    return {
      ...employee,
      achievements: achievements,
    };
  });

  // Flatten the data to have one record per certificate per employee
  // Use one entry with no certificates for employees with no achievements
  const flattenedData = filteredData.flatMap((employee) => {
    if (!employee.achievements.length) {
      return [
        {
          employeeId: employee.id,
          fullName: employee.fullName,
          role: employee.role,
          grade: employee.grade,
          email: employee.email,
          certificateName: "",
          certificateLevel: "No certificates",
          certifiedDate: "",
          expiryDate: "",
        },
      ];
    }
    return employee.achievements.map((achievement) => {
      // Calculate the expiry date based on the certificate level
      const date = getExpiryDate(
        achievement.certificate.level,
        achievement.certifiedDate,
        achievement.expiryDate,
      );
      const expiryDate = date ? format(date, "MM/dd/yyyy") : "N/A";
      return {
        employeeId: employee.id,
        fullName: employee.fullName,
        role: employee.role,
        grade: employee.grade,
        email: employee.email,
        certificateName: achievement.certificateName,
        certificateLevel: achievement.certificate.level,
        certifiedDate: format(achievement.certifiedDate, "MM/dd/yyyy"),
        expiryDate: expiryDate,
      };
    });
  });

  return flattenedData as DashboardCertificate[];
}
