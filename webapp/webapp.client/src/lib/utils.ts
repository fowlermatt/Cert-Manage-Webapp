import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getExpiryDate(
  certificateLevel: string,
  certifiedDate: string,
  expiryDate?: string,
) {
  // Fundamental never expires
  if (certificateLevel.toLowerCase() === "foundation") return undefined;

  // If expiry date is provided, use it
  const expiryDateObj = expiryDate ? new Date(expiryDate) : undefined;
  if (expiryDate) return expiryDateObj;

  // Default to 6 months from certified date
  return addDays(certifiedDate, 182);
}

export function getStatus(expiryDate?: Date) {
  if (!expiryDate) return "Valid";
  return expiryDate < new Date() ? "Expired" : "Valid";
}
