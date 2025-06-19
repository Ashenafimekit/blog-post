"use client";
import Breadcrumbs from "@/components/header/Breadcrumbs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessionData } from "@/hooks/useSession";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditInput, ProfileEditSchema } from "./schema/profile-edit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { API_URL } from "@/constant/api-url";
import { Camera } from "lucide-react";

const Profile = () => {
  const session = useSessionData();
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
  }>({});
  const userId = session.user.id;
  const { status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditInput>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("avatar", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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
          // console.log("🚀 ~ userData ~ res.data:", res.data);
          reset(res.data);
          setUser(res.data);
          setAvatar(`${API_URL}/${res.data.profile}`);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (session?.user?.id) {
      userData();
    }
  }, [session?.user?.id]);

  const onSubmit: SubmitHandler<EditInput> = async (data) => {
    console.log("🚀 ~ onSubmit: ~ data:", data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    try {
      const res = await axios.patch(`${API_URL}/user/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        toast.success("successfully updated");
      }
    } catch (error: any) {
      console.log("🚀 ~ onSubmit~ error:", error);
      if (error.response) {
        const status = error.response.status;
        let message = error.response.data.message || "something went wrong";

        if (Array.isArray(message)) {
          message.join(",");
        }
        if (status === 404) {
          toast(`user not found `, message);
        } else {
          toast("Internal Server Error");
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-200 ">
      <div className="self-start">
        <Breadcrumbs />
      </div>
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-4 py-2 w-2/3 sm:w-1/2 md:w-1/2 lg:w-1/4 rounded-lg bg-white"
        >
          <div>
            <Input
              type="file"
              accept="image/*"
              {...register("avatar")}
              onChange={handleFileChange}
              ref={(e) => {
                register("avatar").ref(e);
                fileInputRef.current = e;
              }}
              className="hidden"
            />
          </div>
          <div className="self-center">
            <div
              className="relative w-20 h-20 group"
              onClick={handleAvatarClick}
            >
              <Avatar className="w-full h-full shadow-xl cursor-pointer">
                <AvatarImage src={previewUrl || avatar} />
                <AvatarFallback>{session.user.name?.[0] ?? "P"}</AvatarFallback>
              </Avatar>

              {/* Hover Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full pointer-events-none">
                <Camera className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
          {errors.avatar && (
            <p className="text-sm text-red-500">{errors.avatar.message}</p>
          )}
          <div className="flex flex-col gap-6 px-3 md:px-0">
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
        </form>
      </div>
    </div>
  );
};

export default Profile;
