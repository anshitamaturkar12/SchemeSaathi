import { NextRequest, NextResponse } from "next/server";
import { loginUser, SESSION_COOKIE_NAME } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, password } = body;

    if (!credential || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide your email/username and password." },
        { status: 400 }
      );
    }

    const { user, profile, sessionToken } = await loginUser({
      credential,
      password,
    });

    const response = NextResponse.json({
      success: true,
      user,
      profile,
      message: "Logged in successfully.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Invalid credentials." },
      { status: 401 }
    );
  }
}
