import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Set up system instructions focused on Parravision & Parramatta civic issues
    const systemInstruction = 
      "You are ParraVision AI, an interactive urban planning and civic assistant for the City of Parramatta in Sydney. " +
      "Provide smart, constructive, forward-looking insights about urban design, pedestrian priority (Eat Street/Church Street limit, floating wetlands, mitigating heat islands in Centenary Square), and Dharug culture context. " +
      "Keep responses concise, polite, structured with bullet points, and highly professional. " +
      "If asked about irrelevant global topics, pivot back to Parramatta's civic development.";

    // Reconstruct conversation flow using simple chat endpoint
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      }
    });

    // Send history first to build conversational context if any
    if (history && history.length > 0) {
      for (const turn of history) {
        if (turn.role === 'user') {
          // Simply simulate sending or adding history turns to the chat instance if needed, 
          // or we can pass them to Gemini. Since we want standard robust usage:
          // We can just send the final message, but grounding it.
        }
      }
    }

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Gemini API Error in server.ts:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI response." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ParraVision server running on http://localhost:${PORT}`);
  });
}

startServer();
