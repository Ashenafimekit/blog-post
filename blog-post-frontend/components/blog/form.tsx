"use client";
import { useSessionData } from "@/hooks/useSession";
import { BlogCardProps } from "@/types/blog-card.type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PostForm = ({ id, title, content }: BlogCardProps) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const session = useSessionData();
  // console.log("🚀 ~ PostForm ~ session:", session)

  const [formData, setFormData] = useState({
    title: title || "",
    content: content || "",
    authorId: "",
  });

  useEffect(() => {
    if (session?.user?.id) {
      setFormData((prev) => ({
        ...prev,
        authorId: session.user.id,
      }));
    }
  }, [session?.user?.id]);

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
          headers: { Authorization: `Bearer ${session.accessToken}` },
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
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        if (res.status === 200) {
          toast.success("updated successfully");
        } else {
          toast.error("unable to update");
        }
      } catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          let message = error.response.data.message || "something went wrong";

          if (Array.isArray(message)) {
            message.join(", ");
          }
          if (status === 401) {
            toast.error(`Unauthorized: ${message}`);
          } else if (status === 404) {
            toast.error(`Not found: ${message}`);
          } else {
            toast.error(message);
          }

          console.log(`[${status}]`, message);
        } else if (error.request) {
          toast.error("No response from server");
          console.error("No response:", error.request);
        } else {
          toast.error("Unexpected error");
          console.error("Error:", error.message);
        }
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
        <div className="flex flex-col gap-2 mt-4">
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-00 mb-2"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="block border border-gray-300 rounded-md w-1/2 text-sm text-gray-900
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-gray-900"
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
