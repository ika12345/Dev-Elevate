import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, enum: ["pdf", "ebook", "note", "youtube", "github"], required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now },
});

const Content = mongoose.model("Content", ContentSchema);
export default Content;
