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
  const authorId = session.user.id;

  const deletePost = async () => {
    try {
      const res = await axios.delete(`${API_URL}/post/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        data: { authorId },
      });
      if (res.status === 200) {
        toast.success("posted deleted");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        let message = data?.message || "Something went wrong";

        // If message is an array (like from class-validator), join it
        if (Array.isArray(message)) {
          message = message.join(", ");
        }

        // Optional: customize toast by error type
        if (status === 401) {
          toast.error(`Unauthorized: ${message}`);
        } else if (status === 404) {
          toast.error(`Not found: ${message}`);
        } else {
          toast.error(message);
        }

        console.log(`[${status}]`, message);
      } else if (error.request) {
        // Request was made, but no response
        toast.error("No response from server");
        console.error("No response:", error.request);
      } else {
        // Something else (e.g., config issue)
        toast.error("Unexpected error");
        console.error("Error:", error.message);
      }
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
