"use client";
import React, { use, useEffect, useState } from "react";
import BlogCard from "@/components/blog/blog-card";
import axios from "axios";
import { PostType } from "@/types/post.type";
import AddBlogPost from "./add-blog-post";
import { useSessionData } from "@/hooks/useSession";

const Post = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const session = useSessionData();

  // console.log("🚀 ~ Post ~ user:", session?.user);
  // console.log("🚀 ~ Post ~ token:", session?.accessToken);

  const [post, setPost] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [meta, setMeta] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (!session?.accessToken) return; // wait until accessToken is ready
    try {
      const fetchAllPostCount = async () => {
        const res = await axios.get(`${API_URL}/post/count`, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
          // withCredentials: true,
        });
        if (res.status === 200) {
          const tot = res.data.total;
          setMeta({
            page,
            limit: 5,
            total: tot,
            totalPages: Math.ceil(tot / limit),
          });
        }
      };
      fetchAllPostCount();
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
    }

    try {
      const fetchPosts = async () => {
        const res = await axios.get(`${API_URL}/post`, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
          // withCredentials: true,
          params: { page, limit },
        });
        if (res.status == 200) {
          // console.log("Response data:", res.data);
          setPost(res.data);
        } else if (res.status === 401) {
          console.log("unauthorized access");
        } else {
          console.log("Error fetching posts");
        }
      };
      fetchPosts();
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
    }
  }, [page, session?.accessToken]);

  return (
    <div className="flex flex-col items-center justify-center mb-5">
      <div className="">
        <p className="text-lg text-gray-900">Welcome to the blog</p>
      </div>
      <div className="self-center">
        <AddBlogPost />
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4 mb-5 w-5/6 sm:w-3/4 lg:w-1/2">
        {post &&
          post.map((item) => (
            <BlogCard
              key={item.id}
              id={String(item.id ?? "")}
              title={item.title}
              content={item.content}
              authorId={item.author.id}
              authorName={item.author.name}
              authorEmail={item.author.email}
              images={item.images ?? []}
            />
          ))}
      </div>
      <div className="flex items-center justify-evenly w-full">
        <button
          className="bg-zinc-500 hover:bg-zinc-600 py-1 px-2 rounded "
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span>
          page {meta.page} of {meta.totalPages}
        </span>
        <button
          className="bg-zinc-500 hover:bg-zinc-600 py-1 px-2 rounded "
          onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
          disabled={page === meta.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Post;
