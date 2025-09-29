import express from "express";
import { put, get } from "@vercel/blob";

const app = express();
app.use(express.json());

/**
 * Write JSON/text to Blob
 * Example: POST /write { "message": "Hello Blob!" }
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
    // fetch blob directly
    const response = await get("data.json"); 
    const text = await response.text();

    res.json({ contents: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default app;
