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
    console.log("Received request:", JSON.stringify(req.body, null, 2));
    
    // Extract message from A2A JSON-RPC format
    // Telex sends: { jsonrpc, id, method, params: { message: { parts: [{ text }] } } }
    const userMessage = 
      req.body.params?.message?.parts?.[0]?.text || // A2A format from Telex
      req.body.message; // Fallback for direct testing

    const requestId = req.body.id || `task-${Date.now()}`;

    if (!userMessage) {
      return res.status(400).json({
        jsonrpc: "2.0",
        id: requestId,
        error: {
          code: -32602,
          message: "Invalid params: message is required",
        },
      });
    }

    console.log("Generating response for:", userMessage);
    
    // Generate response with maxSteps to ensure tools execute
    const response = await cryptoAgent.generate(userMessage, {
      maxSteps: 10, // Allow multiple tool calls
    });

    const { text, toolResults } = response;
    console.log("Generated response:", text);
    console.log("Tool results:", JSON.stringify(toolResults, null, 2));

    // Extract IDs from request or generate new ones
    const taskId = req.body.params?.message?.taskId || `task-${Date.now()}`;
    const messageId = req.body.params?.message?.messageId || `msg-${Date.now()}`;
    const contextId = req.body.params?.contextId || `context-${Date.now()}`;
    const responseMessageId = `response-${Date.now()}`;
    const artifactId = `artifact-${Date.now()}`;

    // Build artifacts array - include tool results if available
    const artifacts: any[] = [
      {
        artifactId: artifactId,
        name: "cryptoAgentResponse",
        parts: [
          {
            kind: "text",
            text: text,
          },
        ],
      },
    ];

    // Add tool results as artifacts if they exist
    if (toolResults && toolResults.length > 0) {
      artifacts.push({
        artifactId: `tool-${Date.now()}`,
        name: "ToolResults",
        parts: toolResults.map((result: any) => ({
          kind: "data",
          data: result,
        })),
      });
    }

    // Return A2A protocol compliant response (matching Phoenix's exact format)
    return res.status(200).json({
      jsonrpc: "2.0",
      id: requestId,
      result: {
        id: taskId,
        contextId: contextId,
        status: {
          state: "completed",
          timestamp: new Date().toISOString(),
          message: {
            messageId: responseMessageId,
            role: "agent",
            parts: [
              {
                kind: "text",
                text: text,
              },
            ],
            kind: "message",
          },
        },
        artifacts: artifacts,
        history: [
          {
            kind: "message",
            role: "user",
            parts: [
              {
                kind: "text",
                text: userMessage,
              },
            ],
            messageId: messageId,
            taskId: taskId,
          },
          {
            kind: "message",
            role: "agent",
            parts: [
              {
                kind: "text",
                text: text,
              },
            ],
            messageId: responseMessageId,
            taskId: taskId,
          },
        ],
        kind: "task",
      },
    });
  } catch (error) {
    console.error("Error in /agent endpoint:", error);
    return res.status(500).json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : "Internal error",
      },
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
