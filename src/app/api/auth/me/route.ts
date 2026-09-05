import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-service";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false, user: null, profile: null });
    }

    const sessionData = await getUserFromSession(token);
    if (!sessionData) {
      return NextResponse.json({ authenticated: false, user: null, profile: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: sessionData.user,
      profile: sessionData.profile,
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, user: null, profile: null });
  }
}
