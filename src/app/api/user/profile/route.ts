import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession, updateUserProfile, SESSION_COOKIE_NAME } from "@/lib/auth-service";

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

    return NextResponse.json({
      success: true,
      profile: sessionData.profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
    const {
      full_name,
      phone,
      date_of_birth,
      gender,
      state,
      city,
      occupation,
      annual_income,
      social_category,
    } = body;

    const updatedProfile = await updateUserProfile(sessionData.user.id, {
      ...(full_name !== undefined && { full_name: full_name.trim() }),
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(date_of_birth !== undefined && { date_of_birth }),
      ...(gender !== undefined && { gender }),
      ...(state !== undefined && { state }),
      ...(city !== undefined && { city }),
      ...(occupation !== undefined && { occupation }),
      ...(annual_income !== undefined && {
        annual_income: annual_income !== "" ? Number(annual_income) : undefined,
      }),
      ...(social_category !== undefined && { social_category }),
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status: 400 }
    );
  }
}
