"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { loginFormSchema } from "../schema/login-form.schema";
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const result = loginFormSchema.safeParse(formData);
      if (result.success) {
        //   const res = await axios.post(`${API_URL}/auth/login`, formData);
        //   if (res.data.success) {
        //     console.log("Response data:", res.data);
        //     toast.success("Login successful");
        //   } else {
        //     console.log("Error logging in");
        //     toast.error("Error logging in");
        //   }

        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        if (res?.error) {
          console.log("Error logging in:", res.error);
          toast.error("Invalid email or password");
        } else {
          // console.log("Login successful");
          toast.success("Login successful");
         
          window.location.href = "/";
        }
      }
      if (result.error) {
        console.log("Form is invalid", result.error.format());
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred while logging in");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        {/* <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials below to login to your account
        </p> */}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
