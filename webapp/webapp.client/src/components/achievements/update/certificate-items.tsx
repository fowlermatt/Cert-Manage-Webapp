import { SelectItem } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Certificate } from "@/lib/types";

export function CertificateItems() {
  const [certificates, setCertificates] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCertificates() {
      const response = await fetch("certificate");
      const data: Certificate[] = await response.json();
      const names = data.map((certificate) => certificate.name);
      setCertificates(names);
    }
    fetchCertificates();
  }, []);

  return (
    <>
      {certificates.map((certificate) => (
        <SelectItem className="px-4" key={certificate} value={certificate}>
          {certificate}
        </SelectItem>
      ))}
    </>
  );
}
