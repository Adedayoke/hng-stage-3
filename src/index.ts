import express from "express";
import { cryptoAgent } from "./agent/cryptoAgent";
import "dotenv/config"

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;


app.get("/", async (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.post("/agent", async (req, res) => {
  try {
    console.log("Received request:", req.body);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("Generating response for:", message);
    const response = await cryptoAgent.generate(message);

    const { text } = response;
    console.log("Generated response:", text);

    return res.status(200).json({
      message: text,
    });
  } catch (error) {
    console.error("Error in /agent endpoint:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Something went wrong",
    });
  }
});

app.get("/test-agent", async (req, res) => {
  try {
    const response = await cryptoAgent.generate("What is the price of Bitcoin?");
    res.json({ response });
  } catch (error) {
    if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.get("/test-risk", async (req, res) => {
  try {
    const response = await cryptoAgent.generate("What's the risk of investing in Bitcoin right now?");
    res.json({ response: response.text });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
