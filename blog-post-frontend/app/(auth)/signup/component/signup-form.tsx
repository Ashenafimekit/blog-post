"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupFormSchema, signupInputs } from "../schema/signup-form.schema";
import axios from "axios";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupInputs>({ resolver: zodResolver(signupFormSchema) });

  const onSubmit: SubmitHandler<signupInputs> = async (data) => {
    console.log("🚀 ~ data:", data);

    try {
      const res = await axios.post(`${API_URL}/auth/signup`, data);
      if (res.status === 201) {
        console.log("res : ", res);
        toast.success("Account created successfully");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Internal Server Error");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        {errors.root && (
          <span className="text-sm text-red-500">{errors.root.message}</span>
        )}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input placeholder="Ashe Melos" {...register("name")} />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input {...register("email")} placeholder="m@example.com" />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input {...register("password")} type="password" />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="cPassword">Confirm Password</Label>
          </div>
          <Input {...register("confirmPassword")} type="password" />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </div>
      <div className="text-center text-sm">
        I have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </form>
  );
}
