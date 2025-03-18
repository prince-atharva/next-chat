'use client';

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, RegisterSchemaType } from "@/lib/schemas";
import Button from "@/ui/Button";
import { FaUserPlus } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { registerUser } from "@/actions/auth";

export default function Signup() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-300 px-4">
      <div className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md text-center relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white p-4 rounded-full shadow-lg">
          <FaUserPlus className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-4">Join Us 🚀</h2>
        <p className="text-gray-500 mb-6">Create an account to start chatting.</p>
        <SignupForm />
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
          Sign up with Google
        </Button>
        <p className="text-sm text-gray-600 mt-4">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setError("");
    startTransition(async () => {
      const signUpResponse = await registerUser(data);

      if (signUpResponse?.error) {
        setError(signUpResponse.error);
        return;
      }
      const signInResponse = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
  
      if (signInResponse?.error) {
        setError("Registration successful, but login failed. Please try logging in.");
        return;
      }
      router.push("/");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full p-3 border rounded-lg focus:ring focus:ring-green-400 shadow-sm"
          placeholder="Enter your name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full p-3 border rounded-lg focus:ring focus:ring-green-400 shadow-sm"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full p-3 border rounded-lg focus:ring focus:ring-green-400 shadow-sm"
          placeholder="Enter your password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="w-full p-3 border rounded-lg focus:ring focus:ring-green-400 shadow-sm"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button type="submit" isLoading={isPending} disabled={isPending} className="w-full text-lg py-3">
        {isPending ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}