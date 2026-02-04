/** server.mjs */
/* server contains endpoint definitions, index listens */
/* test this and not index.mjs! */
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

export const app = express();

app.use(cors());
app.use(express.json());

export const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ai_chat",
  password: "",
});

app.get("/messages", async (req, res) => {
    try {
        const sql = 'SELECT id, thread_id, role, message_content FROM chat_completions ORDER BY id ASC LIMIT 100';

        const [results, fields] = await connection.execute(sql);
        console.log('GET /messages results count:', results.length);

        return res.status(200).json({ results, fields });
    } catch (error) {
        console.warn('GET /messages error', error);
        return res.status(500).json({ error });
    }
});

app.post("/messages", async (req, res) => {
    try {
        const role = req.body?.role;
        const content = req.body?.content;

        if (!role || !content) return res.status(400).json({ error: "Invalid data" });

        const sql = "INSERT INTO chat_completions (role, message_content) VALUES (?, ?)";
        const values = [role, content];

        const [result, fields] = await connection.execute(sql, values);

        return res.status(201).json({ result, fields });
    } catch (error) {
        console.warn("POST /messages error", error);
        return res.status(500).json({ error });
    }
});

export const port = process?.env?.PORT || 3333;
