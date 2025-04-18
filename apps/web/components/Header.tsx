// components/Header.tsx (server component)
import Link from "next/link";

export async function Header() {
  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Slack RAG</h1>
      <Link href="/api/auth/google/start">
        <button className="px-3 py-1 bg-blue-600 text-white rounded">
          Connect Google Drive
        </button>
      </Link>
    </header>
  );
}
