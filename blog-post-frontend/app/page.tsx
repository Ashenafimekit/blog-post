import React from "react";
import Header from "@/components/header";
import Post from "@/components/blog/post";

const page = () => {
  
  return (
    <div className="flex flex-col gap-3 bg-slate-200 min-h-screen">
      <Header />
      <Post />
    </div>
  );
};

export default page;
