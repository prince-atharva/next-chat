"use server";

import { hash } from "bcryptjs";
import { RegisterSchemaType } from "@/lib/schemas";
import User from "../../server/model/user.model";
import { connectToDB } from "@/app/api/auth/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

interface RegisterResponse {
  error?: string;
  success?: string;
}

interface ProfileUpdateResponse {
  error?: string;
  success?: string;
}

export async function registerUser(data: RegisterSchemaType): Promise<RegisterResponse> {
  try {
    await connectToDB();

    const existingUser = await User.findOne({ email: data.email, provider: "credentials" });
    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await hash(data.password, 10);

    await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      provider: "credentials",
    });

    return { success: "User registered successfully" };
  } catch (error) {
    console.error("Signup Error:", error);
    return { error: "Something went wrong, please try again" };
  }
}

export async function checkUsername(username: string): Promise<boolean> {
  try {
    await connectToDB();
    if (!username || username.trim().length < 3) {
      throw new Error("Invalid username");
    }

    const userExists = await User.findOne({ username });
    return !userExists;
  } catch (error) {
    console.error("Username Check Error:", error);
    return false;
  }
}

export async function setupProfile(data: { username: string; avatar?: string }) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized request" };
    }

    const _id = session.user.id;
    const existingUser = await User.findOne({ username: data.username });

    if (existingUser && existingUser.id !== _id) {
      return { error: "Username is already taken" };
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { username: data.username, image: data.avatar },
      { new: true }
    );

    if (!updatedUser) {
      return { error: "User not found" };
    }

    return { success: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile Update Error:", error);
    return { error: "Something went wrong, please try again" };
  }
}