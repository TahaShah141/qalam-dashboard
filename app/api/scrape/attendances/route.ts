import { NextRequest, NextResponse } from "next/server"

import { getAttendanceFromQalam } from "@/lib/attendance"
import { initNode } from "@/lib/initNode"
import { isVerified } from "@/lib/isVerified"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {
  
  const { credentials, cookies } = await request.json()

  try {
    const attendances = await getAttendanceFromQalam(credentials, cookies)
    if (isVerified(credentials)) await initNode({key: "attendances", value: JSON.stringify(attendances)})
    return NextResponse.json({ attendances })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}