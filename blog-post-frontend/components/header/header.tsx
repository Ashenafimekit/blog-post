import Link from "next/link";
import React from "react";
import ProfileIcon from "../profile/profile-icon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-row items-center justify-between p-4 bg-zinc-800 text-white">
      <div className="">
        <Link href="/" className="text-lg">
          Blog-Post
        </Link>
      </div>
      <div className="flex gap-1"></div>
      <div className="flex gap-2">
        {session ? <ProfileIcon /> : <Link href="/login">Login</Link>}
      </div>
    </div>
  );
};

export default Header;
