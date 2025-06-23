"use client";
import { LoaderIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const RouteProtector = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }
  if (status === "unauthenticated") {
    router.push("/login");
  }
  return <>{children}</>;
};

export default RouteProtector;
