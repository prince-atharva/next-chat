import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../../../server/model/user.model";
import { connectToDB } from "../database";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
          username: user.username || "",
          image: user.image || null,
          isEmailVerified: user.isEmailVerified || false,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectToDB();
        let existingUser = await User.findOne({ email: user.email });

        if (account?.provider === "google") {
          if (existingUser && existingUser.provider !== "google") {
            return false;
          }
          if (!existingUser) {
            existingUser = new User({
              name: user.name,
              email: user.email?.toLowerCase(),
              image: user.image || null,
              provider: "google",
              username: "",
              isEmailVerified: (profile as { email_verified?: boolean })?.email_verified ?? false,
            });
            await existingUser.save();
          }
        }

        user.id = existingUser._id
        user.name = existingUser.name
        user.username = existingUser.username
        user.image = existingUser.image;
        user.isEmailVerified = existingUser.isEmailVerified;
        return true;
      } catch {
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.image = token.image as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
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
    maxAge: 604800,
    updateAge: 86400,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};