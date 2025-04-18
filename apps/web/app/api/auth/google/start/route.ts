import { NextResponse } from "next/server";
import { getOAuthClient } from "@repo/google";

export async function GET() {
  const client = getOAuthClient();
  console.log("client secret", client._clientSecret);
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "openid",
      "email",
      "profile",
    ],
  });

  return NextResponse.redirect(url);
}
