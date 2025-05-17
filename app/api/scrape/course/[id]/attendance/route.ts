import { NextRequest, NextResponse } from "next/server";

import { getCourseAttendanceFromQalam } from "@/lib/scraping/courseAttendance";
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
    const attendances = await getCourseAttendanceFromQalam(id, credentials, cookies)
    if (isVerified(credentials)) await initNode({key: `course-${id}-attendance`, value: JSON.stringify(attendances)});
    
    console.log({attendances})
    
    return NextResponse.json({ attendances })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}