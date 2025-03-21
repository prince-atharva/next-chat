import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../../../server/model/user.model";
import { connectToDB } from "../database";
import mongoose from "mongoose";

async function getUserById(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid ObjectId:", userId);
    return null;
  }

  return await User.findById(new mongoose.Types.ObjectId(userId)).select(
    "id name username image email isEmailVerified"
  );
}


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://mail.google.com/",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        await connectToDB();
        const user = await User.findOne({ email: credentials.email, provider: "credentials" });

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          image: user.image,
          isEmailVerified: user.isEmailVerified,
          google_accesstoken: "accesstoken"
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectToDB();
        let existingUser = await User.findOne({ email: user.email });

        if (account?.provider === "google" && !existingUser) {
          existingUser = new User({
            name: user.name,
            email: user.email?.toLowerCase(),
            image: user.image || null,
            provider: "google",
            username: null,
            isEmailVerified: (profile as { email_verified?: boolean })?.email_verified ?? false,
          });
          await existingUser.save();
        }

        if (!existingUser) throw new Error("User not found");

        user.id = existingUser._id
        user.name = existingUser.name
        user.username = existingUser.username
        user.image = existingUser.image;
        user.isEmailVerified = existingUser.isEmailVerified;
        user.google_accesstoken = account?.access_token || "accesstoken"
        return true;
      } catch (error) {
        console.error("Sign-in Error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
        token.image = user.image;
        token.isEmailVerified = user.isEmailVerified;
        token.google_accesstoken = user.google_accesstoken
      }
      return token;
    },

    async session({ session, token }) {
      await connectToDB();

      if (!token.id || typeof token.id !== "string" || !mongoose.Types.ObjectId.isValid(token.id)) {
        console.error("Invalid token ID:", token.id);
        return session;
      }

      const updatedUser = await getUserById(token.id);


      if (updatedUser) {
        session.user = {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          username: updatedUser.username,
          image: updatedUser.image,
          isEmailVerified: updatedUser.isEmailVerified,
          google_accesstoken: token.google_accesstoken as string
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};