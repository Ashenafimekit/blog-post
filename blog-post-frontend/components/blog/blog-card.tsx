import { BlogCardProps } from "@/types/blog-card.type";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import BlogAction from "../blog-action";

const BlogCard = ({
  title,
  content,
  authorName,
  authorEmail,
}: BlogCardProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-2 rounded-lg shadow-md border bg-white w-full">
      <button className="absolute top-1 right-1 hover:text-gray-800">
        <BlogAction />
      </button>
      <h1 className="font-semibold text-sm sm:text-lg md:text-xl text-black">
        {title}
      </h1>
      <p className="text-xs sm:text-sm md:text-lg text-gray-900 text-end">
        {content}
      </p>
      <div className="flex flex-col items-center justify-center mt-2">
        <h1 className="text-xs sm:text-sm md:text-lg text-gray-900">
          author : {authorName}
        </h1>
        <p className="text-sm text-gray-500">{authorEmail}</p>
      </div>
    </div>
  );
};

export default BlogCard;
