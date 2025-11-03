import express from "express";
import { cryptoAgent } from "./agent/cryptoAgent";
import "dotenv/config"

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.post("/agent", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await cryptoAgent.generate(message);

    const { text } = response;

    return res.status(200).json({
      message: text,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
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

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
