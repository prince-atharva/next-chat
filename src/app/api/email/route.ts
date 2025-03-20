import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface Email {
  id: string;
  threadId: string;
  subject: string;
  date: Date;
  from: string;
  name: string;
  email: string | null;
  profileImage: string;
  snippet: string;
}

const ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error("Missing Gmail API access token.");
}


const extractSenderInfo = (fromHeader: string): { name: string; email: string | null } => {
  const match = fromHeader.match(/(.*?)\s*<(.*?)>/);
  return {
    name: match ? match[1].trim() : fromHeader,
    email: match ? match[2] : null,
  };
};

const getProfileImageUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${(name).toLocaleLowerCase()}&background=random`;
};

export async function GET(req: NextRequest) {
  try {
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized: Missing Access Token" }, { status: 401 });
    }

    const { data } = await axios.get<{ messages: { id: string; threadId: string }[] }>(
      "https://www.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { maxResults: 50 },
      }
    );

    if (!data.messages) return NextResponse.json([], { status: 200 });

    const latestThreads = new Map<string, string>();
    for (const msg of data.messages) {
      if (!latestThreads.has(msg.threadId)) {
        latestThreads.set(msg.threadId, msg.id);
      }
    }

    const latestMessageIds = Array.from(latestThreads.values());

    const emailPromises = latestMessageIds.map(async (id): Promise<Email> => {
      const emailData = await axios.get<{ payload: { headers: { name: string; value: string }[] }; snippet: string }>(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const headers = emailData.data.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject";
      const dateHeader = headers.find((h) => h.name === "Date")?.value || new Date().toUTCString();
      const fromHeader = headers.find((h) => h.name === "From")?.value || "Unknown Sender";
      const snippet = emailData.data.snippet?.split(" ").slice(0, 20).join(" ") || "No Preview Available"; // Max 2 lines

      const { name, email } = extractSenderInfo(fromHeader);
      const profileImage = getProfileImageUrl(name);

      return {
        id,
        threadId: latestThreads.get(id) || id,
        subject,
        date: new Date(dateHeader),
        name,
        email,
        from: fromHeader,
        profileImage,
        snippet,
      };
    });

    const emails = await Promise.all(emailPromises);
    return NextResponse.json(emails, { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}

