import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPassword() {
  async function getUserId(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const response = await fetch("user/" + username + "/id");
    response.text().then((id) =>
      fetch("email/reset-password/" + id, {
        method: "POST",
      }),
    );
  }

  return (
    <div className="flex w-full h-[65vh] justify-center items-end">
      <Card>
        <form id="login_form" onSubmit={getUserId}>
          <CardHeader>
            <CardTitle>Forgot Password? </CardTitle>
            <label>
              Please enter your username below to receive a link to reset your
              password.
            </label>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 min-w-[25vw]">
            <label id="username_label">Username</label>
            <Input id="username"></Input>
          </CardContent>
          <CardFooter className="flex flex-col w-full gap-2">
            <div className="flex flex-row justify-between w-full">
              <Button variant="outline">Send Email</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
