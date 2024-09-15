import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useContext, useEffect } from "react";
import { UserContext } from "@/components/layout";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ChangePassword() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {}, [user]);

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentPassword = (
      document.getElementById("current_password") as HTMLInputElement
    ).value;

    const formData = new FormData();

    formData.append("id", user!);
    formData.append("password", currentPassword);

    await fetch("user/verifyPassword", {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.status == 200) {
        checkNewPassword();
      }
    });
  }

  async function checkNewPassword() {
    const newPassword = (
      document.getElementById("password") as HTMLInputElement
    ).value;
    const confirmPassword = (
      document.getElementById("password_confirm") as HTMLInputElement
    ).value;

    if (newPassword != confirmPassword) {
      alert("New passwords do not match. Please try again.");
    } else {
      const formData = new FormData();

      formData.append("id", user!);
      formData.append("password", newPassword);

      await fetch("user/changePassword", {
        method: "POST",
        body: formData,
      }).then((response) => {
        if (response.status == 200) {
          alert(
            "Password sucessfully changed. You will now be redirected to login again.",
          );
          localStorage.removeItem("user");
          setUser(null);
          navigate("/");
        } else {
          alert("Password couldn't be changed. Please try again.");
        }
      });
    }

    //const formData = new FormData();

    //formData.append("id", user!);
    //formData.append("password", currentPassword);

    //await fetch("user/verifyPassword", {
    //    method: "POST",
    //    body: formData,
    //}).then((response) => {
    //    if (response.status == 200) {
    //        return true;
    //    } else {
    //        alert("Invalid password");

    //    }
    //});
    //return false;
  }

  return (
    <div className="flex w-full h-[45vh] justify-center items-end">
      <Card>
        <form id="login_form" onSubmit={changePassword}>
          <CardHeader>
            <CardTitle>Change Password </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 min-w-[25vw]">
            <label id="current_password_label">Current Password</label>
            <Input id="current_password" type="password"></Input>
            <label id="password_label">Password</label>
            <Input id="password" type="password"></Input>
            <label id="password_confirm_label">Confirm Password</label>
            <Input id="password_confirm" type="password"></Input>
          </CardContent>
          <CardFooter className="flex flex-col w-full gap-2">
            <div className="flex flex-row justify-between w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button variant="default">Change Password</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
