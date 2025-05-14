import Data from "@/models/DataModel"
import connectMongo from "./connectMongo"

export const initNode = async ({key, value}: {key: string, value: string}) => {
  await connectMongo()
  const fetchedNode = await Data.findOne({ key });

  if (!fetchedNode) {
    const newNode = await Data.create({key, value})
    await newNode.save()
  } else {
    await Data.findOneAndUpdate({key}, {value}).exec()
  }
}