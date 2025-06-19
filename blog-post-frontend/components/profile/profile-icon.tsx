"use client";
import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import axios from "axios";
import { API_URL } from "@/constant/api-url";

const ProfileIcon = () => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    profile: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/${session?.user.id}`);
        if (res.status === 200) {
          // console.log("🚀 ~ fetchProfile ~ res.data:", res.data);
          setUser(res.data);
        }
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
      }
    };

    if (status === "authenticated" && session?.user?.id) {
      fetchProfile();
    } else {
      console.warn("user id is required ");
      const handleRefetch = async () => {
        const newSession = await update();
        // console.log("🔄 Session refetched:", newSession);
      };
      handleRefetch();
    }
  }, [status, session?.user?.id]);

  const logout = () => {
    signOut();
  };

  const avatarSrc = user?.profile
    ? `${API_URL}/${user.profile}`
    : "";
  const avatarFallback = user?.name?.[0]?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={avatarSrc}
            alt={user?.name?.[0]?.toUpperCase() || "P"}
          />
          <AvatarFallback className="text-black">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileIcon;
