"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Email {
  id: string;
  subject: string;
  threadId: string;
  date: string;
  from: string;
  name: string;
  email: string | null;
  profileImage: string;
  snippet: string;
}

const EmailList = () => {
  const { id } = useParams()
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter()

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("/api/email");
        setEmails(response.data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const formatted = formatDistanceToNowStrict(date, { addSuffix: false });
    return formatted
      .replace(" seconds", "s")
      .replace(" second", "s")
      .replace(" minutes", "m")
      .replace(" minute", "m")
      .replace(" hours", "h")
      .replace(" hour", "h")
      .replace(" days", "d")
      .replace(" day", "d");
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading emails...</p>;
  }

  return (
    <div className="p-2 bg-white rounded-lg w-full h-full">
      <h2 className="text-lg font-semibold mb-4">Emails</h2>

      <ul className="space-y-4">
        {emails.map((email) => (
          <li
            onClick={() => router.push(`/chat/${email.threadId}`)}
            key={email.id}
            className={`flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer ${id===email.threadId && "bg-gray-200"}`}
          >
            <Image
              src={email.profileImage}
              width={50}
              height={50}
              className="rounded-full"
              alt={email.name}
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium">{email.from}</h3>
              <p className="text-xs text-gray-500 line-clamp-2"><span className="font-black">{email.subject}</span> - <span></span><span>{email.snippet}</span></p>
            </div>
            <span className="text-xs text-gray-400">{formatTime(email.date)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;