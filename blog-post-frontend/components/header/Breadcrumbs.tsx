// components/Breadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-start justify-start px-2 py-2 text-sm ">
      <ul className="flex  text-gray-600 p-3 border">
        <li>
          <Link href="/">Home</Link>
        </li>
        <span>
          <ChevronRight size={20}/>
        </span>
        {segments.map((segment, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const label = decodeURIComponent(segment);

          const isLast = i === segments.length - 1;
          return (
            <li key={i}>
              {!isLast ? (
                <Link href={href}>{label}</Link>
              ) : (
                <span className="font-medium text-black">{label}</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
