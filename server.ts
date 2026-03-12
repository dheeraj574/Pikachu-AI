import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";
import cors from "cors";
import Database from "better-sqlite3";

async function startServer() {
  const app = express();
  const PORT = 3000;

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
