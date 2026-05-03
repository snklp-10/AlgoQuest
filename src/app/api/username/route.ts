import { NextResponse } from "next/server";
import { checkUsernameAvailable } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();

  if (!username || username.length < 3) {
    return NextResponse.json(
      { available: false, error: "Too short" },
      { status: 400 },
    );
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json(
      { available: false, error: "Only letters, numbers, underscores" },
      { status: 400 },
    );
  }

  const available = await checkUsernameAvailable(username);
  return NextResponse.json({ available });
}
