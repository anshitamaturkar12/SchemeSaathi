import { NextRequest, NextResponse } from "next/server";
import { registerUser, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, username, password } = body;

    if (!full_name || !email || !username || !password) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const { user, profile } = await registerUser({
      full_name,
      email,
      username,
      password,
    });

    const token = createSessionToken(user.id, user.email);

    const response = NextResponse.json({
      success: true,
      user,
      profile,
      message: "Account created successfully.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Registration failed." },
      { status: 400 }
    );
  }
}
