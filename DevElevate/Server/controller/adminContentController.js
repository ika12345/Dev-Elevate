import Content from "../models/Content.js";

export async function uploadContent(req, res) {
  const { title, link, type } = req.body;
  if (!title || !link || !type) return res.status(400).json({ error: "All fields required" });
  try {
    const content = await Content.create({ title, link, type, uploadedBy: req.adminId });
    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
}

export async function deleteContent(req, res) {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
}

export async function getAllContent(req, res) {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
}
