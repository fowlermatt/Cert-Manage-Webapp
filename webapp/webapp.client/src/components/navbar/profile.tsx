import { User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { User } from "./user";

export function Profile() {
  return (
    <Button variant="outline" size="icon" className="relative">
      <UserIcon />
      <span className="sr-only">Profile</span>
    </Button>
  );
}
