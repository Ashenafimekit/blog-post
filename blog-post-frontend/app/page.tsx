import React from "react";
import Header from "@/components/header/header";
import Post from "@/components/blog/post";

const page = () => {
  return (
    <div className="flex flex-col gap-3 bg-slate-200 min-h-screen">
      <Post />
    </div>
  );
};

export default page;
