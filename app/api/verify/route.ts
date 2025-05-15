import { NextRequest, NextResponse } from "next/server"

import { isVerified } from "@/lib/isVerified"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {
  
  const { credentials } = await request.json()
  
  try {
    return NextResponse.json({ verified: isVerified(credentials) })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}