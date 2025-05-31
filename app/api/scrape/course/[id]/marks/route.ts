import { NextRequest, NextResponse } from "next/server";

import { getCourseMarksFromQalam } from "@/lib/scraping/courseMarks";
import { initNode } from "@/lib/initNode";
import { isVerified } from "@/lib/isVerified";

export const dynamic = "force-dynamic";

type ParamsType = {
  id: string
}

export async function POST(request: NextRequest, context: { params: Promise<ParamsType> }): Promise<NextResponse> {
  
  const { id } = await context.params;
  const { credentials, cookies } = await request.json()

  try {
    const marks = await getCourseMarksFromQalam(id, credentials, cookies)
    if (isVerified(credentials)) await initNode({key: `course-${id}-marks`, value: JSON.stringify(marks)});    
    return NextResponse.json({ marks })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}