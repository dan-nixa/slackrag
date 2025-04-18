import { NextResponse } from "next/server";

export async function POST() {
  console.log("Indexing documents");

  try {
    const response = await fetch("http://localhost:3002/api/index-documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "daniel.nixa@gmail.com" }),
    });
    console.log("Status:", response.status);
    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error indexing documents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to index documents" },
      { status: 500 }
    );
  }
}
