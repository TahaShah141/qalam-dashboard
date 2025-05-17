import { NextRequest, NextResponse } from "next/server"

import { getCourseInfoFromQalam } from "@/lib/scraping/dashboard"
import { initNode } from "@/lib/initNode"
import { isVerified } from "@/lib/isVerified"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {
  
  const { credentials, cookies } = await request.json()

  try {
    const courses = await getCourseInfoFromQalam(credentials, cookies)
    if (isVerified(credentials)) await initNode({key: "courses", value: JSON.stringify(courses)})
    return NextResponse.json({ courses })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}