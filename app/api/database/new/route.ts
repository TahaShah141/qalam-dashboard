import { NextRequest, NextResponse } from "next/server"

import Data from "@/models/DataModel"
import connectMongo from "@/lib/connectMongo"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {
  
  const { key, value } = await request.json()

  try {
    await connectMongo()

    const newNode = await Data.create({key, value: JSON.stringify(value)})
    await newNode.save()

    return NextResponse.json({ node: newNode })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error})
  }
}