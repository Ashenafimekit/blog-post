"use client";
import { getUser } from "@/lib/current-user";
import { getCookie } from "@/lib/get-cookies";
import { BlogCardProps } from "@/types/blog-card.type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PostForm = ({
  id,
  title,
  content,
  authorName,
  authorEmail,
}: BlogCardProps) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = getCookie("jwtToken");
  const user = getUser();
  // console.log("🚀 ~ PostForm ~ user:", user);
  // console.log("🚀 ~ PostForm ~ token:", token);

  const [formData, setFormData] = useState({
    title: title || "",
    content: content || "",
    authorId: user.id,
  });

  const onchangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form data:", formData);

    const newPost = async () => {
      try {
        const res = await axios.post(`${API_URL}/post`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 201) {
          toast.success("Post created successfully");
          setFormData({
            title: "",
            content: "",
            authorId: "",
          });
        } else {
          toast.error("Error creating post");
          console.error("Error creating post:", res.data);
        }
      } catch (error) {
        console.error("Error creating post:", error);
        toast.error("Error creating post");
      }
    };

    const updatePost = async () => {
      try {
        const res = await axios.patch(`${API_URL}/post/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success("updated successfully");
        } else {
          toast.error("unable to update");
        }
      } catch (error) {
        console.log("🚀 ~ updatePost ~ error:", error);
        toast.error("internal server error");
      }
    };

    if (id) {
      console.log(formData);
      updatePost();
    } else {
      newPost();
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={onchangeHandler}
            className="border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label
            htmlFor="content"
            className="text-sm font-medium text-gray-900"
          >
            Content
          </label>
          <textarea
            name="content"
            id="content"
            value={formData.content}
            onChange={onchangeHandler}
            className="border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-zinc-800 text-white px-4 py-2 rounded-md"
        >
          {id ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
