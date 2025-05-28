import Link from "next/link";
import React from "react";
import Profile from "./profile";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const Header = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;
  const userString = cookieStore.get("user")?.value;
  const user = userString ? JSON.parse(userString) : null;
  // console.log("Token:", token);
  // console.log("User:", user);

  const session = await getServerSession(authOptions);
  // console.log("🚀 ~ Header ~ session:", session)

  return (
    <div className="flex flex-row items-center justify-between p-4 bg-zinc-800 text-white">
      <div className="">
        <h1 className="text-lg">Blog-Post</h1>
      </div>
      <div className="flex gap-1"></div>
      <div className="flex gap-2">
        {session ? (
          <Profile user={session.user} />
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
