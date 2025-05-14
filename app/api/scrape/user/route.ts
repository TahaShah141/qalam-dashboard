import { NextResponse } from "next/server"
import { getUserData } from "@/lib/user"
import { initNode } from "@/lib/initNode"

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  try {
    const user = await getUserData()
    await initNode({key: "qalam-user", value: JSON.stringify(user)})
    return NextResponse.json({ user })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}