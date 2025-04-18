import { listDriveFiles } from "@repo/google";
import { IndexDocumentsButton } from "./IndexDocumentsButton";
import { cookies } from "next/headers";

export default async function ConnectedPage() {
  const email = cookies().get("user")?.value;

  if (!email) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-semibold">Not authenticated</h1>
      </main>
    );
  }

  const files = await listDriveFiles(email, "slackrag");

  return (
    <main className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">📁 Files in “slackrag”</h1>
        <IndexDocumentsButton />
      </div>

      {files.length === 0 ? (
        <p>
          No files found in Google Drive folder named <code>slackrag</code>.
        </p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.id} className="border p-2 rounded">
              <strong>{file.name}</strong>
              <div className="text-sm text-gray-500">{file.mimeType}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
