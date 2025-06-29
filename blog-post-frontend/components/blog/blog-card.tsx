import { BlogCardProps } from "@/types/blog-card.type";
import React, { Suspense, useEffect, useState } from "react";
import BlogAction from "./blog-action";
import { useSessionData } from "@/hooks/useSession";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { API_URL } from "@/constant/api-url";
import axios from "axios";
import { LoaderIcon } from "lucide-react";

const BlogCard = ({
  id,
  title,
  content,
  authorId,
  authorName,
  authorEmail,
  images,
}: BlogCardProps) => {
  // console.log("🚀 ~ images:", images);
  const session = useSessionData();
  const user = session.user;
  const [userData, setUserData] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    profile: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${API_URL}/user/${authorId}`);
      if (res.status === 200) {
        setUserData(res.data);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center justify-center ">
      <div className="flex flex-col gap-2 w-full sm:w-3/4 ">
        <div className="flex flex-row gap-2 self-start ">
          <Suspense fallback={<LoaderIcon />}>
            <Avatar>
              <AvatarImage
                src={
                  `${API_URL}/${userData?.profile}` ||
                  "https://github.com/shadcn.png"
                }
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Suspense>
          <div className="">
            <h1 className="text-sm font-semibold">{authorName}</h1>
            <h1 className="text-xs text-gray-700">{authorEmail}</h1>
          </div>
        </div>
        <div className="relative flex flex-col items-start justify-center p-2 rounded-lg shadow-md border bg-white w-full">
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
          <div className="flex flex-col gap-2 w-full">
            <h1 className="font-semibold text-sm sm:text-lg text-black">
              {title}
            </h1>
            {images && images.length > 0 && (
              <div className="w-full ">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${images[0].path}`}
                  width={400}
                  height={300}
                  alt={images[0].originalName}
                  priority
                  className="object-cover w-full h-auto rounded"
                />
              </div>
            )}
            <p className="text-xs sm:text-sm text-gray-900 ">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
