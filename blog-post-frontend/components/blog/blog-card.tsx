import { BlogCardProps } from "@/types/blog-card.type";
import React from "react";
import BlogAction from "./blog-action";
import { useSessionData } from "@/hooks/useSession";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const BlogCard = ({
  id,
  title,
  content,
  authorName,
  authorEmail,
}: BlogCardProps) => {
  const session = useSessionData();
  const user = session.user;
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="">
          <h1 className="text-sm font-semibold">{authorName}</h1>
          <h1 className="text-xs text-gray-700">{authorEmail}</h1>
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-center p-2 rounded-lg shadow-md border bg-white w-full">
        <button className="absolute top-1 right-1 hover:text-gray-800">
          {user.email === authorEmail ? (
            <BlogAction
              id={id}
              title={title}
              content={content}
              authorName={authorName}
              authorEmail={authorEmail}
            />
          ) : (
            ""
          )}
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
    </div>
  );
};

export default BlogCard;
