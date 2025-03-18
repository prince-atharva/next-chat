'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { loginSchema, LoginSchemaType } from "@/lib/schemas";
import Button from "@/ui/Button";
import { FaComments } from "react-icons/fa";

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-300 px-4">
      <div className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md text-center relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <FaComments className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-4">Welcome Back 👋</h2>
        <p className="text-gray-500 mb-6">Sign in to continue chatting with your friends.</p>
        <LoginForm />
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center gap-3 text-lg py-3"
          onClick={() => signIn("google", { redirect: true, callbackUrl: "/" })}
        >
          <FcGoogle className="w-6 h-6" />
          Continue with Google
        </Button>
        <p className="text-sm text-gray-600 mt-4">
          Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 shadow-sm"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 shadow-sm"
          placeholder="Enter your password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="w-full text-lg py-3">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-sm text-center text-gray-600 mt-2">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
      </p>
    </form>
  );
}