import axios from "axios";
import { NextAuthOptions, Session, User } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Extend the Session and User types to include 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
    accessToken?: string;
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email,
              password,
            },
            { withCredentials: true }
          );
          if (!response.data.success) {
            return null;
          }

          // console.log("Response data:", response.data);

          const { user } = response.data;
          // console.log("🚀 ~ authorize ~ user:", user);

          return user;
        } catch (error) {
          console.error("Error during authorization:", error);
          (await cookies()).delete("jwtToken");
          (await cookies()).delete("user");
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      // console.log("🚀 ~ jwt: ~ user:", user);
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // console.log("🚀 ~ session: ~ token:", token)
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      // (session as any).accessToken = token;
      return session;
    },
  },
};
