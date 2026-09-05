import { NextRequest, NextResponse } from "next/server";
import {
  getUserFromSession,
  recordSchemeActivity,
  getUserSchemeActivities,
  removeSchemeActivity,
  SESSION_COOKIE_NAME,
} from "@/lib/auth-service";
import { ActivityType } from "@/types/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sessionData = await getUserFromSession(token);

    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const activities = await getUserSchemeActivities(sessionData.user.id);
    return NextResponse.json({
      success: true,
      activities,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch activities." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sessionData = await getUserFromSession(token);

    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { scheme_id, scheme_name, activity_type, status } = body;

    if (!scheme_id || !scheme_name || !activity_type) {
      return NextResponse.json(
        { success: false, error: "scheme_id, scheme_name, and activity_type are required." },
        { status: 400 }
      );
    }

    const activity = await recordSchemeActivity({
      userId: sessionData.user.id,
      schemeId: scheme_id,
      schemeName: scheme_name,
      activityType: activity_type as ActivityType,
      status,
    });

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record activity." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sessionData = await getUserFromSession(token);

    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const scheme_id = searchParams.get("scheme_id");
    const activity_type = searchParams.get("activity_type") as ActivityType;

    if (!scheme_id || !activity_type) {
      return NextResponse.json(
        { success: false, error: "scheme_id and activity_type are required query params." },
        { status: 400 }
      );
    }

    await removeSchemeActivity(sessionData.user.id, scheme_id, activity_type);
    return NextResponse.json({ success: true, message: "Activity removed." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete activity." },
      { status: 400 }
    );
  }
}
