"use client";
import Breadcrumbs from "@/components/header/Breadcrumbs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessionData } from "@/hooks/useSession";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditInput, ProfileEditSchema } from "./schema/profile-edit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const session = useSessionData();
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
  }>({});
  const userId = session.user.id;
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    const userData = async () => {
      const userId = session?.user?.id;
      if (!userId) return;

      try {
        const res = await axios.get(`${API_URL}/user/${userId}`);
        if (res.status === 200) {
          console.log("🚀 ~ userData ~ res.data:", res.data);
          reset(res.data);
          setUser(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (session?.user?.id) {
      userData();
    }
    console.log("user : ", user);
  }, [session?.user?.id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditInput>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit: SubmitHandler<EditInput> = () => {};

  return (
    <div className="flex flex-col min-h-screen bg-slate-200 ">
      <div className="self-start">
        <Breadcrumbs />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 py-2 w-2/3 sm:w-1/3 rounded-lg bg-white">
          <div className="self-center">
            <Avatar className="w-20 h-20">
              <AvatarFallback>Profile</AvatarFallback>
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
          </div>
          <div className="flex flex-col gap-2 px-3 md:px-0">
            <div className="flex flex-row gap-3">
              <Label>Name </Label>
              <Input {...register("name")} />
              {/* <h1>Name : {user.name}</h1> */}
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-row gap-3">
              <Label>Email </Label>
              <Input {...register("email")} />
              {/* <h1>Email : {user.email}</h1> */}
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="">
              <h1 className="space-x-3">
                <span> Role </span>
                <span className="bg-sky-300 px-3 rounded-sm">{user.role}</span>
              </h1>
            </div>
          </div>
          <div className="self-center">
            <Button type="submit">Update</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
