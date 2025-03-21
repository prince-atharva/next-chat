import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      image: string;
      isEmailVerified: boolean;
      google_accesstoken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    username: string;
    image: string;
    isEmailVerified: boolean;
    google_accesstoken: string;
  }
}