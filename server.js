import express from "express";
import bodyParser from "body-parser";
import { OpenAI } from "openai";

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY   // QUI la chiave resterà protetta
});

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: "Sei un agente AI specializzato in criptovalute, trading e analisi di mercato. Non dare consigli finanziari diretti."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel server AI" });
  }
});

app.get("/", (req, res) => {
  res.send("CryptoAle AI Agent Backend is running ✔️");
});

app.listen(3000, () => console.log("Backend attivo su porta 3000"));
