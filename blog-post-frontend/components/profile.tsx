"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { UserType } from "@/lib/user.type";

const Profile = ({ user }: { user: UserType }) => {
  //   console.log("User in Profile:", user);
  const { data: session } = useSession();
  console.log("🚀 ~ Profile ~ session:", session?.user);
  console.log("🚀 ~ Profile ~ token:", session?.accessToken);

  const logout = async () => {
    signOut();
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session?.user.name} </DropdownMenuItem>
          <DropdownMenuItem>{session?.user.email}</DropdownMenuItem>
          <DropdownMenuItem>
            <button onClick={logout}>Log out</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
