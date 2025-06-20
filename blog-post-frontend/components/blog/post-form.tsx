"use client";
import { useSessionData } from "@/hooks/useSession";
import { BlogPostSchema, Inputs } from "@/schemas/blog-post-form-shema";
import { BlogCardProps } from "@/types/blog-card.type";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/constant/api-url";

const PostForm = ({ id, title, content }: BlogCardProps) => {
  const session = useSessionData();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: { title: title, content: content },
  });

  // Define mutation functions at the top level
  const newPostMutation = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(`${API_URL}/post`, formData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      handleError(error, "Error creating post");
    },
  });

  const updatePostMutation = useMutation({
    mutationKey: ["updatePost", id],
    mutationFn: async (formData: FormData) => {
      const res = await axios.patch(`${API_URL}/post/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      handleError(error, "Error updating post");
    },
  });

  const handleError = (error: any, defaultMessage: string) => {
    if (error.response) {
      const status = error.response.status;
      let message = error.response.data.message || defaultMessage;

      if (Array.isArray(message)) {
        message = message.join(", ");
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
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("authorId", session?.user?.id || "");

    if (data.image) {
      data.image.forEach((image) => formData.append("image", image));
    }

    if (id) {
      updatePostMutation.mutate(formData);
    } else {
      newPostMutation.mutate(formData);
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
          disabled={
            isSubmitting ||
            newPostMutation.isPending ||
            updatePostMutation.isPending
          }
          className="mt-4 bg-zinc-800 text-white px-4 py-2 rounded-md"
        >
          {isSubmitting ||
          newPostMutation.isPending ||
          updatePostMutation.isPending
            ? "Loading..."
            : id
            ? "Update Post"
            : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
