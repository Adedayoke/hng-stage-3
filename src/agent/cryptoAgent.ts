import { Agent, createTool } from "@mastra/core";
import "dotenv/config";
import { z } from "zod";
import {
  assessCryptoRisk,
  fetchCoinDetails,
  fetchCurrentPrice,
} from "../services/cryptoService";
import { createGroq } from "@ai-sdk/groq";

const fetchPriceTool = createTool({
  id: "fetch-current-price",
  description: "This tool is for fetching the price of a coin",
  inputSchema: z.object({
    coin: z
      .string()
      .describe("The coin to fetch the price for, e.g., 'bitcoin'"),
  }),

  execute: async ({ context }) => {
    const { coin } = context;
    const priceData = await fetchCurrentPrice(coin);
    return priceData;
  },
});

const fetchCoinDetailsTool = createTool({
  id: "fetch-coin-details",
  description: "This tool is for fetching the details of a coin",
  inputSchema: z.object({
    coin: z
      .string()
      .describe("The coin to fetch the details for, e.g., 'bitcoin'"),
  }),
  execute: async ({ context }) => {
    const { coin } = context;
    const coinDetails = await fetchCoinDetails(coin);
    return coinDetails;
  },
});
const fetchAssessmentRiskTool = createTool({
  id: "fetch-assessment-risk",
  description: "This tool is for fetching the risk assessment of a coin",
  inputSchema: z.object({
    coin: z
      .string()
      .describe("The coin to fetch the risk assessment for, e.g., 'bitcoin'"),
  }),
  execute: async ({ context }) => {
    const { coin } = context;
    const riskAssessment = await assessCryptoRisk(coin);
    return riskAssessment;
  },
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

const groqModel = groq("llama-3.3-70b-versatile");

const cryptoAgent = new Agent({
  name: "Lynx the crypto genie",
  instructions: `You are Lynx, an expert cryptocurrency analysis agent. Your job is to help users make informed decisions about crypto investments.

When users ask about a cryptocurrency:
1. Always fetch the current price and 24h change using the fetch-current-price tool
2. Fetch detailed coin information using the fetch-coin-details tool when needed
3. Assess the risk level using the fetch-assessment-risk tool
4. Provide clear, actionable recommendations
5. Explain your reasoning in simple terms

Be helpful, professional, and data-driven. Always cite the specific numbers you're analyzing.
Always use the available tools to get real-time data before responding.`,
  model: groqModel,
  tools: { fetchPriceTool, fetchCoinDetailsTool, fetchAssessmentRiskTool },
});

export { cryptoAgent };
