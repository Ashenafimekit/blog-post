"use client";
import { useSessionData } from "@/hooks/useSession";
import { BlogPostSchema, Inputs } from "@/schemas/blog-post-form-shema";
import { BlogCardProps } from "@/types/blog-card.type";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

const PostForm = ({ id, title, content }: BlogCardProps) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const session = useSessionData();
  // console.log("🚀 ~ PostForm ~ session:", session)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: { title: title, content: content },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("🚀 ~ PostForm ~ data:", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("authorId", session.user.id);

    if (data.image) {
      data.image.forEach((image) => formData.append("image", image));
    }

    const newPost = async () => {
      try {
        const res = await axios.post(`${API_URL}/post`, formData, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("resposne : ", res);
        if (res.status === 201) {
          toast.success("Post created successfully");
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
      console.log("form ", formData);
      try {
        const res = await axios.patch(`${API_URL}/post/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
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
      updatePost();
    } else {
      newPost();
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit, (err) =>
          console.log("validation error", err)
        )}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900">Title</label>
          <input
            type="text"
            {...register("title")}
            className="border border-gray-300 rounded-md p-2"
          />

          {errors.title && (
            <span className="text-sm text-red-500">{errors.title.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-medium text-gray-900">Content</label>
          <textarea
            className="border border-gray-300 rounded-md p-2"
            {...register("content")}
          />
          {errors.content && (
            <span className="text-sm text-red-500">
              {errors.content.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label className="block text-sm font-medium text-gray-00 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            {...register("image")}
            multiple
            accept="image/*"
            className="block border border-gray-300 rounded-md w-1/2 text-sm text-gray-900
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-100 file:text-gray-900"
          />
          {typeof errors.image?.message === "string" && (
            <span className="text-sm text-red-500">{errors.image.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 bg-zinc-800 text-white px-4 py-2 rounded-md"
        >
          {isSubmitting ? "loading" : id ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
