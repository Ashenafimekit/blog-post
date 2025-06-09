"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import PostForm from "./post-form";
import { BlogCardProps } from "@/types/blog-card.type";

const AddBlogPost = ({
  id,
  title,
  content,
  authorName,
  authorEmail,
  open,
  onOpenChange,
}: BlogCardProps) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {id ? (
            <Button variant="ghost"></Button>
          ) : (
            <Button className="bg-zinc-800 text-white px-4 py-1 rounded-md">
              Add Post
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Create your Post</DialogTitle>
          </DialogHeader>
          <PostForm
            id={id}
            title={title}
            content={content}
            authorName={authorName}
            authorEmail={authorEmail}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBlogPost;
