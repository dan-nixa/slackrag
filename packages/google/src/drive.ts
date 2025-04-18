import { google } from "googleapis";
import { prisma } from "@repo/database";

export async function getDriveClientForUser(email: string) {
  console.log("Getting drive client for user:", email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
    expiry_date: Number(user.expiryDate),
  });

  return google.drive({ version: "v3", auth: client });
}

export async function listDriveFiles(email: string, folderName: string) {
  const drive = await getDriveClientForUser(email);

  const folderSearch = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}'`,
    fields: "files(id, name)",
  });

  const folder = folderSearch.data.files?.[0];
  if (!folder) throw new Error(`No folder named '${folderName}' found.`);

  const fileSearch = await drive.files.list({
    q: `'${folder.id}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, modifiedTime)",
    pageSize: 10,
  });

  return fileSearch.data.files || [];
}
