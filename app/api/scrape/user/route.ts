import { NextRequest, NextResponse } from "next/server"

import { getUserData } from "@/lib/scraping/user"
import { initNode } from "@/lib/initNode"
import { isVerified } from "@/lib/isVerified"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {
  
  const { credentials, cookies } = await request.json()
  
  try {
    const user = await getUserData(credentials, cookies)
    if (isVerified(credentials)) await initNode({key: "qalam-user", value: JSON.stringify(user)})
    return NextResponse.json({ user })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}