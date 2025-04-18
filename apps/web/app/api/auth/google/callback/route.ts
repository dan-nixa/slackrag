import { NextRequest, NextResponse } from "next/server";
import { getUserProfile } from "@repo/google";
import { prisma } from "@repo/database";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      console.warn("⚠️ Missing OAuth code in callback");
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const { profile, tokens } = await getUserProfile(code);

    const email = profile.email!;
    await prisma.user.upsert({
      where: { email },
      update: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiryDate: BigInt(tokens.expiry_date!),
        name: profile.name,
        picture: profile.picture,
      },
      create: {
        email,
        name: profile.name,
        picture: profile.picture,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiryDate: BigInt(tokens.expiry_date!),
      },
    });

    console.log("✅ Google OAuth success for:", email);
    console.log("🔐 Tokens:", {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Number(tokens.expiry_date)).toISOString(),
    });

    cookies().set("user", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    const redirectUrl = new URL("/connected", process.env.NEXT_PUBLIC_BASE_URL);
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ Google OAuth callback error:", err);
    return NextResponse.json(
      { error: "OAuth callback failed" },
      { status: 500 }
    );
  }
}
