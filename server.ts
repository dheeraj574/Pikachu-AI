import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";
import cors from "cors";
import Database from "better-sqlite3";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const geminiApiKey = process.env.GEMINI_API_KEY || "";
  const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

  app.use(cors());
  app.use(express.json());

  // Database Setup
  const db = new Database("academic_vault.db");
  
  // Create Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT,
      unit TEXT,
      topic TEXT,
      difficulty TEXT,
      importance TEXT,
      resource_type TEXT,
      exam_frequency INTEGER,
      rating REAL,
      downloads INTEGER
    );

    CREATE TABLE IF NOT EXISTS pyq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT,
      topic TEXT,
      year INTEGER,
      marks INTEGER,
      question_type TEXT,
      difficulty TEXT,
      importance_score REAL
    );
  `);

  // Seed Data from CSV if empty
  const resourcesCount = db.prepare("SELECT COUNT(*) as count FROM resources").get() as { count: number };
  if (resourcesCount.count === 0) {
    console.log("Seeding resources from CSV...");
    const resourcesPath = path.join(process.cwd(), "resources_dataset.csv");
    try {
      const resourcesContent = fs.readFileSync(resourcesPath, "utf-8");
      const resourcesData = parse(resourcesContent, { columns: true, skip_empty_lines: true });
      const insert = db.prepare(`
        INSERT INTO resources (subject, unit, topic, difficulty, importance, resource_type, exam_frequency, rating, downloads)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const transaction = db.transaction((data) => {
        for (const r of data) {
          insert.run(
            r.subject, 
            r.unit, 
            r.topic, 
            r.difficulty, 
            r.importance, 
            r.resource_type, 
            parseInt(r.exam_frequency) || 0, 
            parseFloat(r.rating) || 0, 
            parseInt(r.downloads) || 0
          );
        }
      });
      transaction(resourcesData);
    } catch (err) {
      console.error("Error seeding resources:", err);
    }
  }

  const pyqCount = db.prepare("SELECT COUNT(*) as count FROM pyq").get() as { count: number };
  if (pyqCount.count === 0) {
    console.log("Seeding PYQs from CSV...");
    const pyqPath = path.join(process.cwd(), "pyq_topics_dataset.csv");
    try {
      const pyqContent = fs.readFileSync(pyqPath, "utf-8");
      const pyqData = parse(pyqContent, { columns: true, skip_empty_lines: true });
      const insert = db.prepare(`
        INSERT INTO pyq (subject, topic, year, marks, question_type, difficulty, importance_score)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const transaction = db.transaction((data) => {
        for (const r of data) {
          insert.run(
            r.subject, 
            r.topic, 
            parseInt(r.year) || 2023, 
            parseInt(r.marks) || 0,
            r.question_type || 'Theory',
            r.difficulty || 'Medium',
            parseFloat(r.importance_score) || 0
          );
        }
      });
      transaction(pyqData);
    } catch (err) {
      console.error("Error seeding PYQs:", err);
    }
  }

  // API Routes
  app.get("/api/resources", (req, res) => {
    const { subject, topic, unit, limit } = req.query;
    let query = "SELECT * FROM resources WHERE 1=1";
    const params: any[] = [];

    if (subject) {
      query += " AND LOWER(subject) = LOWER(?)";
      params.push(subject);
    }
    if (topic) {
      query += " AND LOWER(topic) LIKE LOWER(?)";
      params.push(`%${topic}%`);
    }
    if (unit) {
      query += " AND LOWER(unit) = LOWER(?)";
      params.push(unit);
    }

    query += " ORDER BY id DESC";

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit as string));
    }

    const results = db.prepare(query).all(...params);
    res.json(results);
  });

  app.post("/api/resources", (req, res) => {
    const { subject, unit, topic, resource_type } = req.body;
    
    const insert = db.prepare(`
      INSERT INTO resources (subject, unit, topic, difficulty, importance, resource_type, exam_frequency, rating, downloads)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      subject,
      unit || 'Unit 1',
      topic,
      'Medium',
      'Medium',
      resource_type,
      0,
      5.0,
      0
    );

    const newResource = db.prepare("SELECT * FROM resources WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(newResource);
  });

  app.get("/api/pyq", (req, res) => {
    const { subject, year, marks } = req.query;
    let query = "SELECT * FROM pyq WHERE 1=1";
    const params: any[] = [];

    if (subject) {
      query += " AND LOWER(subject) = LOWER(?)";
      params.push(subject);
    }
    if (year && !isNaN(parseInt(year as string))) {
      query += " AND year = ?";
      params.push(parseInt(year as string));
    }
    if (marks && !isNaN(parseInt(marks as string))) {
      query += " AND marks = ?";
      params.push(parseInt(marks as string));
    }

    query += " ORDER BY year DESC";

    const results = db.prepare(query).all(...params);
    res.json(results);
  });

  app.get("/api/subjects", (req, res) => {
    const results = db.prepare(`
      SELECT DISTINCT subject FROM (
        SELECT subject FROM resources
        UNION
        SELECT subject FROM pyq
      )
    `).all() as { subject: string }[];
    res.json(results.map(r => r.subject));
  });

  app.post("/api/ai/summary", async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const { content } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Summarize the following academic content into concise bullet points for quick revision: ${content}`,
      });
      res.json({ text: response.text || "" });
    } catch (error) {
      console.error("Gemini summary error:", error);
      res.status(500).json({ error: "Failed to generate summary." });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const { message, history } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...history, { role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction:
            "You are Pikachu AI, a helpful academic assistant for university students. Provide concise, accurate, and encouraging study advice, explain concepts, and help with academic resources.",
        },
      });
      res.json({ text: response.text || "" });
    } catch (error) {
      console.error("Gemini chat error:", error);
      res.status(500).json({ error: "Failed to get AI response." });
    }
  });

  app.post("/api/ai/important-questions", async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const { subject, topics } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the subject "${subject}" and topics [${topics.join(", ")}], predict 5 high-yield "Important Questions" that are likely to appear in an exam. Provide them as a JSON array of strings.`,
        config: { responseMimeType: "application/json" },
      });

      try {
        res.json({ items: JSON.parse(response.text || "[]") });
      } catch {
        res.json({ items: [] });
      }
    } catch (error) {
      console.error("Gemini important questions error:", error);
      res.status(500).json({ error: "Failed to generate important questions." });
    }
  });

  app.post("/api/ai/recommendations", async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const { query, availableResources } = req.body;
      const context = (availableResources || [])
        .slice(0, 20)
        .map((r: { topic?: string; resource_type?: string }) => `${r.topic} (${r.resource_type})`)
        .join(", ");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `User is searching for: "${query}".
Available resources: [${context}].
Recommend the top 3 most relevant resources from the list. Return a JSON array of objects with "topic" and "reason" fields.`,
        config: { responseMimeType: "application/json" },
      });

      try {
        res.json({ items: JSON.parse(response.text || "[]") });
      } catch {
        res.json({ items: [] });
      }
    } catch (error) {
      console.error("Gemini recommendation error:", error);
      res.status(500).json({ error: "Failed to generate recommendations." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
