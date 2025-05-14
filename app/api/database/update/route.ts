import { NextRequest, NextResponse } from "next/server"

import Data from "@/models/DataModel"
import connectMongo from "@/lib/connectMongo"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {
  
  const { key, value } = await request.json()

  try {
    await connectMongo()

    const node = await Data.findOne({key})
    if (!node) return NextResponse.json({error: "Node Doesn't Exist"})

    node.value = JSON.stringify(value)
    await node.save()

    return NextResponse.json({ node })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}