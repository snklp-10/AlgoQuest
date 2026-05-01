import { NextRequest, NextResponse } from "next/server";
import { getDashboard } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const data = await getDashboard(userId);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 },
    );
  }
}
