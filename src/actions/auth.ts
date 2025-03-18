"use server";

import { hash } from "bcryptjs";
import { RegisterSchemaType } from "@/lib/schemas";
import User from "../../server/model/user.model";
import { connectToDB } from "@/app/api/auth/database";

interface RegisterResponse {
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