"use client";
import React, { Suspense, useState } from "react";
import BlogCard from "@/components/blog/blog-card";
import axios from "axios";
import AddBlogPost from "./add-blog-post";
import { useSessionData } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { API_URL } from "@/constant/api-url";
import { FetchPosts, FetchPostsCount } from "@/api";

const Post = () => {
  const session = useSessionData();
  const [page, setPage] = useState(1);
  const limit = 5;

  // console.log("🚀 ~ Post ~ user:", session?.user);
  // console.log("🚀 ~ Post ~ token:", session?.accessToken);

  const { data: countPosts } = useQuery({
    queryKey: ["countPosts"],
    queryFn: () => FetchPostsCount({ session }),
    enabled: !!session?.accessToken,
  });

  const meta = {
    page,
    limit,
    total: countPosts?.total || 0,
    totalPages: Math.ceil((countPosts?.total || 0) / limit),
  };

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => FetchPosts({ page, limit, session }),
    enabled: !!session?.accessToken,
    // suspense: true,
  });

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen ">
  //       <LoaderIcon className="animate-spin" />
  //     </div>
  //   );
  // }
  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error fetching posts: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mb-5">
      <div className="self-center pt-5">
        <AddBlogPost />
      </div>
      <Suspense fallback={<LoaderIcon className="animate-spin" />}>
        <div className="grid grid-cols-1 gap-4 mt-4 mb-5 w-5/6 sm:w-3/4 lg:w-1/2">
          {posts &&
            posts.map((item: any) => (
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
      </Suspense>
      <div
        className={`${
          meta.totalPages === 0 ? "hidden" : "block"
        } flex items-center justify-evenly w-full`}
      >
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
