import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  
  try {
    console.log("Testing cron job")
    return NextResponse.json({ message: "Test Works" })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}