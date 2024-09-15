import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavBar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState<string>();

  async function populateUserName() {
    console.log(user);
    const response = await fetch("employee/" + user + "/name");
    response.text().then((data) => setName(data));
  }

  useEffect(() => {
    if (user !== null && user !== "") populateUserName();
  }, [user]);

  return (
    <div className="flex sticky top-0 z-50 h-[56px] w-full items-center justify-center py-2 border-b-2">
      <div className="flex w-full max-w-4xl">
        <div className="flex flex-row w-full items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild={true}
                >
                  <Link to="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild={true}
                >
                  <Link to="/dashboard">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild={true}
                >
                  <Link to="/catalog">Certificate Catalog</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {user !== null ? (
            <div className="flex flex-row gap-2 items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/my-profile">
                        <Avatar>
                          <AvatarImage
                            src={`https://csce590groupprojecta025.blob.core.windows.net/profile-pics/${user}.jpg`}
                            alt="@shadcn"
                          />
                          <AvatarFallback>
                            {name?.charAt(0)}
                            {name?.charAt(name.indexOf(" ") + 1)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem style={styles.userName}>
                    {name}
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <Button
                        variant="outline"
                        onClick={() => {
                          localStorage.removeItem("user");
                          setUser(null);
                          navigate("/");
                        }}
                      >
                        Logout
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          ) : (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    asChild
                  >
                    <Link to="/Login">Login</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  userName: {
    padding: 20,
  },
};
