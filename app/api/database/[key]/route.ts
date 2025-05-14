import { NextRequest, NextResponse } from "next/server";

import Data from "@/models/DataModel";
import connectMongo from "@/lib/connectMongo";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  const { key } = await context.params;

  await connectMongo();

  const node = await Data.findOne({ key });

  if (!node) {
    return new NextResponse(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.json({ node });
}