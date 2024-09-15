import { NavBar } from "@/components/navbar/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
  user: null as string | null,
  setUser: (_: string | null) => {},
});

export function Layout({
  children,
  navbar,
}: {
  children: React.ReactNode;
  navbar: boolean;
}) {
  const [user, actualSetUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser !== null && storedUser !== "" && storedUser !== "null") {
      actualSetUser(storedUser);
    } else {
      actualSetUser(null);
    }
  }, []);

  function setUser(newUser: string | null) {
    actualSetUser(newUser);
    localStorage.setItem("user", newUser!);
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ScrollArea className="flex flex-col h-screen w-screen">
        {navbar && <NavBar />}
        <main className="flex flex-col items-center flex-1 bg-background pb-4 dark:[color-scheme:dark]">
          {children}
        </main>
      </ScrollArea>
    </UserContext.Provider>
  );
}
