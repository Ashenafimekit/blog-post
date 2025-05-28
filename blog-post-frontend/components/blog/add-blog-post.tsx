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

const AddBlogPost = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="bg-zinc-800 text-white px-4 py-1 rounded-md">
            Add Post
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Create your Post</DialogTitle>
          </DialogHeader>
          <PostForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBlogPost;
