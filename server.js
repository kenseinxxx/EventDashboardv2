// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve static files

// Route: fetch dashboard data
app.get("/dashboard", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Storage")  // your table name
      .select("*")
      .limit(1)
      .single();

    if (error) throw error;

    res.json({
      total: data.total || 0,
      abstracts: data.abstracts || 0,
      countries: data.countries || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Route: save dashboard data
app.post("/dashboard", async (req, res) => {
  const { total, abstracts, countries } = req.body;

  try {
    const { data, error } = await supabase
      .from("Storage") // your table name
      .upsert([{ id: 1, total, abstracts, countries }], { onConflict: ["id"] });

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save dashboard data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

