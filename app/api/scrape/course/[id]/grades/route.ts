import { NextRequest, NextResponse } from "next/server";

import { getCourseGradesFromQalam } from "@/lib/scraping/courseGrades";
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
    const grades = await getCourseGradesFromQalam(id, credentials, cookies)
    if (isVerified(credentials)) await initNode({key: `course-${id}-grades`, value: JSON.stringify(grades)});    
    return NextResponse.json({ grades })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}