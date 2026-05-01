import { NextRequest, NextResponse } from "next/server";
import { reviewConcept } from "@/lib/db/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, conceptId, quality } = body;

    if (!userId || !conceptId || quality === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: "Quality must be between 0 and 5" },
        { status: 400 },
      );
    }

    const result = await reviewConcept({
      userId,
      conceptId,
      quality,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 },
    );
  }
}
