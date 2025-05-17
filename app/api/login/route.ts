import { NextRequest, NextResponse } from "next/server"

import { login } from "@/lib/scraping/login"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {
  
  const { credentials } = await request.json()

  try {
    const cookies = await login(credentials)
    console.log({cookies})
    return NextResponse.json({ verified: true, cookies })
  } catch (error) {
    return NextResponse.json({ verified: false, error })
  }
}