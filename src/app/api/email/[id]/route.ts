import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

const GMAIL_API_URL = "https://www.googleapis.com/gmail/v1/users/me/messages";
const THREAD_API_URL = "https://www.googleapis.com/gmail/v1/users/me/threads";
const ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error("Missing Gmail API access token.");
}

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

export async function GET(req: NextRequest) {
  try {
    // Extract email ID from query params
    const url = new URL(req.nextUrl.href);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Invalid email ID." }, { status: 400 });
    }

    // Fetch the primary email
    const emailResponse = await axios.get(
      `${GMAIL_API_URL}/${id}?format=full`,
      {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      }
    );

    if (!emailResponse.data) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    const primaryEmail = emailResponse.data;
    const threadId = primaryEmail.threadId; // Extract thread ID

    // Fetch the entire thread
    const threadResponse = await axios.get(
      `${THREAD_API_URL}/${threadId}`,
      {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      }
    );

    const messages = threadResponse.data.messages || []; // Ensure `messages` is an array

    // Fetch and parse each email in the thread
    const emails = await Promise.all(
      messages.map(async (message: any) => {
        const messageId = message.id;
        const messageData = await axios.get(
          `${GMAIL_API_URL}/${messageId}?format=full`,
          {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          }
        );

        // Extract email headers
        const headers = messageData.data.payload.headers;
        const subject = headers.find((h: any) => h.name === "Subject")?.value || "No Subject";
        const from = headers.find((h: any) => h.name === "From")?.value || "Unknown Sender";
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
          subject,
          from,
          date,
          content: extractLatestMessage(content),
        };
      })
    );

    // Always return the array, even if there's only one email
    return NextResponse.json(emails, { status: 200 });
  } catch (error) {
    console.error("Error fetching email thread:", error);
    return NextResponse.json(
      { error: "Failed to fetch email thread" },
      { status: 500 }
    );
  }
}
