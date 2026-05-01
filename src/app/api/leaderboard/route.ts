import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  try {
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 20;

    const data = await getLeaderboard(limit);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
