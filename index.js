import express from "express";
import { put, head, del } from "@vercel/blob";

const app = express();
app.use(express.json());

/**
 * Write JSON/text to Blob
 */
app.post("/write", async (req, res) => {
  try {
    const data = JSON.stringify(req.body, null, 2);

    const blob = await put("data.json", data, {
      access: "public",        // or "private"
      addRandomSuffix: false,  // overwrite same file each time
      contentType: "application/json"
    });

    res.json({ url: blob.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * Read file from Blob
 */
app.get("/read", async (_req, res) => {
  try {
    // 1. Get metadata (contains blob URL)
    const meta = await head("data.json");

    // 2. Fetch file contents directly over HTTP
    const response = await fetch(meta.url);
    const text = await response.text();

    res.json({ metadata: meta, contents: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * Delete a blob
 */
app.delete("/delete", async (req, res) => {
  try {
    const { pathname } = req.query;  // e.g., ?pathname=data.json
    if (!pathname) {
      return res.status(400).json({ error: "pathname required" });
    }
    await del(pathname);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default app;

/**
 * ✅ Start Express locally (ignored by Vercel)
 */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
