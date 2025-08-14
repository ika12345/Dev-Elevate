import React, { useState, useEffect, useRef } from "react";

type Content = {
  _id: string;
  title: string;
  link: string;
  type: string;
};
import axiosInstance from "../../api/axiosinstance";

const ContentUploadManager: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [form, setForm] = useState({ title: "", link: "", type: "pdf" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchContents = async () => {
    setLoading(true);
    try {
  const res = await axiosInstance.get("/api/v1/admin/content/content");
      setContents(res.data as Content[]);
    } catch (err) {
      setError("Failed to fetch contents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Only accept text/links, not files
    const text = e.dataTransfer.getData("text/plain");
    if (text) {
      setForm((prev) => ({ ...prev, link: text }));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    setForm({ ...form, link: e.clipboardData.getData("text") });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.link || !form.type) return setError("All fields required");
    setLoading(true);
    setError("");
    try {
  await axiosInstance.post("/api/v1/admin/content/content/upload", form);
      setForm({ title: "", link: "", type: "pdf" });
      fetchContents();
    } catch (err) {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
  await axiosInstance.delete(`/api/v1/admin/content/content/${id}`);
      fetchContents();
    } catch (err) {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Content Upload Manager</h2>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <div
          className={`border-2 border-dashed rounded p-4 text-center ${dragActive ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            ref={inputRef}
            name="link"
            value={form.link}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="Paste or drag online link (PDF, YouTube, GitHub, etc.)"
            className="border p-2 rounded w-full mb-2"
          />
          <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full mb-2">
            <option value="pdf">PDF</option>
            <option value="ebook">Ebook</option>
            <option value="note">Note</option>
            <option value="youtube">YouTube</option>
            <option value="github">GitHub</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
          <div className="text-sm text-gray-500 mt-2">Drag a link or paste it above. No file uploads supported.</div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </form>
      <h3 className="text-xl font-semibold mb-2">Uploaded Contents</h3>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((c) => (
              <tr key={c._id}>
                <td className="p-2 border">{c.title}</td>
                <td className="p-2 border">{c.type}</td>
                <td className="p-2 border">
                  <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View
                  </a>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentUploadManager;
