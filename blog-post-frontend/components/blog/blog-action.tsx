"use client";
import React, { useState } from "react";
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
import { BlogCardProps } from "@/types/blog-card.type";
import PostForm from "./post-form";
import AddBlogPost from "./add-blog-post";
import { Button } from "../ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useSessionData } from "@/hooks/useSession";

const BlogAction = ({
  id,
  title,
  content,
  authorName,
  authorEmail,
}: BlogCardProps) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const session = useSessionData();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const deletePost = async () => {
    try {
      const res = await axios.delete(`${API_URL}/post/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
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
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setEditDialogOpen(true);
            }}
          >
            <Button variant="ghost">Edit</Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="ghost" onClick={deletePost}>
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddBlogPost
        id={id}
        title={title}
        content={content}
        authorName={authorName}
        authorEmail={authorEmail}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};

export default BlogAction;
