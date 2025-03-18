"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { FaCheckCircle, FaTimesCircle, FaPen, FaSignOutAlt } from "react-icons/fa";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  avatar: z.string().optional(),
});

export default function SetupProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session)
  const [error, setError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(session?.user?.image || "/default-avatar.png");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: session?.user?.username || "",
      avatar: session?.user?.image || "",
    },
  });

  const onSubmit = async (data: any) => {
    // setError("");
    // router.push("/");
  };

  const handleFileChange = (e: any) => {
    if (e.target.files?.[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setSelectedAvatar(fileURL);
    }
  };

  const predefinedAvatars = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Complete Your Profile</h2>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <Image
            src={selectedAvatar}
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full border-4 border-gray-300 shadow-md object-cover"
          />
          <label className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full shadow cursor-pointer hover:bg-gray-300 transition">
            <FaPen className="text-gray-600" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {/* User Info */}
        <p className="text-gray-700 font-medium text-lg text-center">{session?.user?.email}</p>
        <p className="text-md flex items-center justify-center gap-2 text-gray-600 mb-6">
          {session?.user?.isEmailVerified ? (
            <FaCheckCircle className="text-green-500 text-xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-xl" />
          )}
          {session?.user?.isEmailVerified ? "Email Verified" : "Email Not Verified"}
        </p>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-left">
            <label className="block text-md font-semibold text-gray-700 mb-1">Username</label>
            <input
              {...register("username")}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 shadow-md bg-gray-50"
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          {/* Avatar Selection */}
          <div className="text-left">
            <label className="block text-md font-semibold text-gray-700 mb-2">Choose Avatar (Optional)</label>
            <div className="flex gap-3 justify-center">
              {predefinedAvatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-2 rounded-full border-4 transition-all duration-300 ${selectedAvatar === avatar ? "border-blue-500 shadow-md" : "border-gray-200"
                    }`}
                >
                  <Image src={avatar} alt="Avatar" width={64} height={64} className="rounded-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full text-lg py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-lg"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
