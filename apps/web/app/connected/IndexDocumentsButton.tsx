"use client";

export function IndexDocumentsButton() {
  const handleClick = async () => {
    const res = await fetch("/api/index-documents", {
      method: "POST",
      body: JSON.stringify({ email: "daniel.nixa@gmail.com" }),
    });

    if (res.ok) {
      console.log("✅ Indexing job started!");
    } else {
      console.error("❌ Failed to start indexing job.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Index Documents
    </button>
  );
}
