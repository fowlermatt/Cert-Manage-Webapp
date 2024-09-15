import { useEffect, useState } from "react";
import { Employee } from "@/lib/types";
import { Button } from "../components/ui/button";
import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee>();
  const { user } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState<boolean>(false);

  console.log(selectedImage);

  function readFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const image = document.getElementById("imgUpload") as HTMLInputElement;

    // null checking
    if (!image.files) return;

    const formData = new FormData();
    formData.append("file", image!.files[0]!);
    formData.append("userId", user!);
    sendFile(formData);
  }

  const sendFile = async (formData: FormData) => {
    await fetch("user/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(true);
    } else {
      setSelectedImage(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    async function populateProfileData() {
      const response = await fetch("employee/" + user);
      const data = await response.json();
      setEmployee(data);
    }

    populateProfileData();
  }, [user]);

  return (
    <div className="flex flex-col gap-3 border-2 p-4  mt-8">
      <div className="flex flex-row gap-3 items-center ">
        <Avatar className="h-48 w-48">
          <AvatarImage
            src={`https://csce590groupprojecta025.blob.core.windows.net/profile-pics/${user}.jpg`}
          />
          <AvatarFallback>
            {employee?.firstName.charAt(0).toUpperCase()}
            {employee?.lastName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4 p-4">
          {employee && (
            <div className="grid grid-cols-2 gap-1">
              <h3 className="font-bold">Name: </h3>
              <h3>{employee.fullName}</h3>
              <h3 className="font-bold">Email: </h3>
              <h3>{employee.email}</h3>
              <h3 className="font-bold">Phone Number: </h3>
              <h3>{employee.phoneNumber}</h3>
              <h3 className="font-bold">Employee ID: </h3>
              <h3>{employee.id}</h3>
            </div>
          )}

          <Button
            variant="outline"
            className="relative"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <form
          onSubmit={readFile}
          className="flex flex-row gap-2 items-center w-full"
        >
          {selectedImage && <Button variant="outline">Update Photo</Button>}
          <input
            onChange={handleImageChange}
            className="flex w-full"
            id="imgUpload"
            type="file"
            accept="image/*"
            defaultValue=""
            required
          />
        </form>
      </div>
    </div>
  );
}
