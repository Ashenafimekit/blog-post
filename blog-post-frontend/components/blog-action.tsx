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
import { EllipsisVertical } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "@/lib/get-cookies";

const BlogAction = ({ id }: { id: string }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = getCookie("jwtToken");

  const deletePost = async () => {
    try {
      const res = await axios.delete(`${API_URL}/post/:${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success("posted deleted");
      }
    } catch (error) {
      console.log("🚀 ~ deletePost ~ error:", error);
      toast.error("unable to delete post");
    }
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button onClick={() => deletePost()}>delete</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BlogAction;
