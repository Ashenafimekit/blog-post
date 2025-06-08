import Link from "next/link";
import React from "react";
import Profile from "./profile";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const Header = async () => {

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
