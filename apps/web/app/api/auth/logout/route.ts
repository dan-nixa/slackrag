import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_BASE_URL)
  );
  res.cookies.set("user", "", { path: "/", maxAge: 0 });
  return res;
}
