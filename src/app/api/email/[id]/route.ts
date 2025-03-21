import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

const GMAIL_API_URL = "https://www.googleapis.com/gmail/v1/users/me/messages";
const THREAD_API_URL = "https://www.googleapis.com/gmail/v1/users/me/threads";

// Decode Base64 email content
function decodeBase64(base64Text: string): string {
  return Buffer.from(base64Text, "base64").toString("utf-8");
}

// Extract latest email message (removes quoted replies)
function extractLatestMessage(emailHtml: string): string {
  const $ = cheerio.load(emailHtml);

  // Remove quoted text (previous messages)
  $("blockquote").remove(); // Gmail uses <blockquote> for quoted replies
  $("div.gmail_quote").remove(); // Remove Gmail quoted text

  return $.html(); // Return cleaned HTML content
}

// Extract sender details (Name & Email)
const extractSenderInfo = (fromHeader: string): { name: string; email: string | null } => {
  const match = fromHeader.match(/(.*?)\s*<(.*?)>/);
  return {
    name: match ? match[1].trim() : fromHeader,
    email: match ? match[2] : null,
  };
};

// Generate profile image based on sender's name
const getProfileImageUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.toLocaleLowerCase())}&background=random`;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const ACCESS_TOKEN = session?.user.google_accesstoken;

    if (!ACCESS_TOKEN) {
      return NextResponse.json({ error: "Unauthorized: Missing Access Token" }, { status: 401 });
    }

    // Extract email ID from query params
    const url = new URL(req.nextUrl.href);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Invalid email ID." }, { status: 400 });
    }

    // Fetch primary email to get the threadId
    const emailResponse = await axios.get(`${GMAIL_API_URL}/${id}?format=full`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    if (!emailResponse.data) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    const primaryEmail = emailResponse.data;
    const threadId = primaryEmail.threadId; // Extract thread ID

    // Fetch the entire thread
    const threadResponse = await axios.get(`${THREAD_API_URL}/${threadId}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    const messages = threadResponse.data.messages || []; // Ensure `messages` is an array

    // Extract metadata from the first message (for header details)
    const firstMessage = messages[0];
    const firstMessageData = await axios.get(`${GMAIL_API_URL}/${firstMessage.id}?format=full`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    const firstHeaders = firstMessageData.data.payload.headers;
    const subject = firstHeaders.find((h: any) => h.name === "Subject")?.value || "No Subject";
    const fromHeader = firstHeaders.find((h: any) => h.name === "From")?.value || "Unknown Sender";
    const { name, email } = extractSenderInfo(fromHeader);
    const profileImage = getProfileImageUrl(name);

    // Process each message in the thread
    const emails = await Promise.all(
      messages.map(async (message: any) => {
        const messageId = message.id;
        const messageData = await axios.get(`${GMAIL_API_URL}/${messageId}?format=full`, {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        });

        const headers = messageData.data.payload.headers;
        const date = headers.find((h: any) => h.name === "Date")?.value || "Unknown Date";

        // Extract email content
        let content = "No Content";
        const payload = messageData.data.payload;

        if (payload.body?.data) {
          content = decodeBase64(payload.body.data);
        } else if (payload.parts) {
          for (const part of payload.parts) {
            if (part.mimeType === "text/html" && part.body?.data) {
              content = decodeBase64(part.body.data);
              break; // Use HTML as priority
            } else if (part.mimeType === "text/plain" && part.body?.data) {
              content = decodeBase64(part.body.data);
            }
          }
        }

        return {
          messageId,
          date,
          content: extractLatestMessage(content),
        };
      })
    );

    // Return the structured response
    return NextResponse.json(
      {
        threadId,
        subject,
        name,
        email,
        from: fromHeader,
        profileImage,
        messages: emails, // Array of messages in the thread
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching email thread:", error);
    return NextResponse.json({ error: "Failed to fetch email thread" }, { status: 500 });
  }
}