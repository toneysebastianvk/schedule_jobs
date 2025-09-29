import express from "express";
import { put, head, del } from "@vercel/blob";

const app = express();
app.use(express.json());

app.post("/write", async (req, res) => {
  try {
    const data = JSON.stringify(req.body, null, 2);
    const blob = await put("data.json", data, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    res.json({ url: blob.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/read", async (_req, res) => {
  try {
    const meta = await head("data.json");
    const r = await fetch(meta.url);
    const text = await r.text();
    res.json({ metadata: meta, contents: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const { pathname } = req.query;
    if (!pathname) return res.status(400).json({ error: "pathname required" });
    await del(pathname);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default app;
