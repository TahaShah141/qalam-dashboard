import mongoose from "mongoose"

type Data = {
  id?: mongoose.Types.ObjectId
  key: string
  value: string
}

const DataSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
}, { timestamps: true })

export default mongoose.models.Data || mongoose.model<Data>("Data", DataSchema)