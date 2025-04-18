import { google } from "googleapis";
import { getOAuthClient } from "./google";

/**
 * Gets user profile information from Google OAuth
 */
export async function getUserProfile(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const oauth2 = google.oauth2({ auth: client, version: "v2" });
  const { data: profile } = await oauth2.userinfo.get();

  return {
    profile,
    tokens,
  };
}

/**
 * Re-export necessary Google APIs
 */
export { google } from "googleapis";
