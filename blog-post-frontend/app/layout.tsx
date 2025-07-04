import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import SessionProviderWrapper from "@/lib/SessionProviderWrapper";
import { getServerSession } from "next-auth";
import { QueryClientProviderWrapper } from "@/lib/queryClientProvider";
import Header from "@/components/header/header";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import RouteProtector from "@/lib/route-protector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Post",
  description: "A simple blog post application with next.js and nestjs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProviderWrapper>
          <SessionProviderWrapper session={session}>
            <RouteProtector>
              <ToastContainer
                autoClose={2000}
                position="top-center"
                theme="dark"
              />
              <Header />
              {children}
            </RouteProtector>
          </SessionProviderWrapper>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
