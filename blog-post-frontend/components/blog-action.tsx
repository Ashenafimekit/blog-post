"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const BlogAction = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
            <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            edit
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
           <DropdownMenuItem>
            delete
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BlogAction;
