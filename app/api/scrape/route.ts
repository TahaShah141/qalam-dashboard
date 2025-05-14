import { NextResponse } from "next/server"
import { getAttendanceFromQalam } from "@/lib/attendance"
import { initNode } from "@/lib/initNode"

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  
  try {
    const attendances = await getAttendanceFromQalam()
    await initNode({key: "attendances", value: JSON.stringify(attendances)})
    return NextResponse.json({ attendances })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}