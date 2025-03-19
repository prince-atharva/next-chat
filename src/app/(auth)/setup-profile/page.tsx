"use client";

import { useState, ChangeEvent, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { FaCheckCircle, FaTimesCircle, FaPen, FaSignOutAlt, FaSyncAlt, FaEnvelope } from "react-icons/fa";
import { debounce } from "lodash";
import { checkUsername, setupProfile } from "@/actions/auth";
import { profileSchema } from "@/lib/schemas";
import Button from "@/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface ProfileForm {
  username: string;
  avatar?: string;
}

export default function SetupProfile() {
  const router = useRouter();
  const { user, updateSession } = useAuth();
  console.log(user)
  const [error, setError] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user?.image || "");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [sendingVerification, setSendingVerification] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      avatar: user?.image || "",
    },
  });

  const username = watch("username") || "";

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      if (username === user?.username) {
        setUsernameAvailable(true);
        return;
      }

      setCheckingUsername(true);
      try {
        const isAvailable = await checkUsername(username);
        setUsernameAvailable(isAvailable);
      } catch (error) {
        console.error("Username Check Failed", error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500),
    [user?.username]
  );

  useMemo(() => {
    if (!username) {
      setUsernameAvailable(null);
    } else {
      checkUsernameAvailability(username);
    }
  }, [username, checkUsernameAvailability]);

  const onSubmit = async (data: ProfileForm) => {
    setError(null);

    if (!user?.isEmailVerified) {
      setError("Please verify your email before submitting.");
      return;
    }

    if (usernameAvailable === false) {
      setError("Username is already taken.");
      return;
    }

    try {
      const response = await setupProfile({ username: data.username, avatar: selectedAvatar });

      if (response.error) {
        setError(response.error);
      } else {
        await updateSession();
        router.replace("/");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setSelectedAvatar(fileURL);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    setError(null);
    try {
      throw new Error("filed")
      // await sendVerificationEmail();
    } catch (error) {
      setError("Failed to send verification email.");
    } finally {
      setSendingVerification(false);
    }
  };


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
            src={selectedAvatar || "https://ui-avatars.com/api/?name=User&format=png"}
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full border-4 border-gray-300 shadow-md object-cover"
          />
          <label className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full shadow cursor-pointer hover:bg-gray-300 transition">
            <FaPen className="text-gray-600" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          {/* Reset Avatar Button */}
          <button
            onClick={() => setSelectedAvatar(user?.image || "")}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <FaSyncAlt className="text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <p className="text-gray-700 font-semibold italic text-lg text-center">{user?.email}</p>
        <p className="text-md flex items-center justify-center gap-2 text-gray-600 mb-6 mt-2">
          {user?.isEmailVerified && (
            <FaCheckCircle className="text-green-500 text-xl" />
          )}
          {user?.isEmailVerified ? "Email Verified" :
            <Button className="gap-2 flex items-center justify-center cursor-pointer" size="md" isLoading={sendingVerification} onClick={handleSendVerification}>
              <FaEnvelope /> Send Verification Email
            </Button>}
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-left">
            <label className="block text-md font-semibold text-gray-700 mb-1">Username</label>
            <div className="relative">
              <input
                {...register("username")}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 shadow-md bg-gray-50"
                placeholder="Enter your username"
              />
              {checkingUsername ? (
                <span className="absolute right-4 top-4 text-lg animate-spin">⏳</span>
              ) : usernameAvailable !== null && (
                <span className="absolute right-4 top-4 text-lg">
                  {usernameAvailable ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                </span>
              )}
            </div>
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            size="md"
            isLoading={isSubmitting}
            className="w-full"
            disabled={checkingUsername}
          >
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
}