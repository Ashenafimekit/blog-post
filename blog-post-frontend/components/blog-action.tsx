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
import { BlogCardProps } from "@/types/blog-card.type";
import PostForm from "./blog/post-form";
import AddBlogPost from "./blog/add-blog-post";
import { Button } from "./ui/button";

const BlogAction = ({
  id,
  title,
  content,
  authorName,
  authorEmail,
}: BlogCardProps) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = getCookie("jwtToken");

  const deletePost = async () => {
    try {
      const res = await axios.delete(`${API_URL}/post/${id}`, {
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
          <DropdownMenuItem>
            {/* <PostForm/> */}
            <div onClick={(e) => e.stopPropagation()}>
              <AddBlogPost
                id={id}
                title={title}
                content={content}
                authorName={authorName}
                authorEmail={authorEmail}
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="ghost" onClick={() => deletePost()}>
              delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BlogAction;
