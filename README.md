# Lynx - Cryptocurrency Analysis Agent 🐾

An intelligent AI agent built with Mastra that provides real-time cryptocurrency analysis, price tracking, and investment recommendations. Integrated with Telex.im using the A2A (Agent-to-Agent) protocol.

## 🚀 Features

- **Real-time Price Tracking**: Get current cryptocurrency prices from CoinGecko API
- **Detailed Market Analysis**: Access comprehensive market data including 24h/7d/30d changes
- **Risk Assessment**: Automated volatility analysis and risk level evaluation
- **Investment Recommendations**: Data-driven suggestions based on market conditions
- **A2A Protocol Integration**: Seamless communication with Telex.im platform

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development
- **Mastra** - AI agent framework with A2A protocol support
- **Express.js** - Web server framework
- **Groq AI** - LLM provider (Llama 3.3 70B)
- **CoinGecko API** - Cryptocurrency market data
- **Railway** - Deployment platform

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Adedayoke/hng-stage-3.git
cd hng-stage-3

# Install dependencies
npm install

# Create .env file
echo "PORT=3000" > .env
echo "GROQ_API_KEY=your_groq_api_key_here" >> .env

# Run development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com/

## 🎯 Usage

### Test Locally

```bash
# Start the server
npm run dev

# Test with the test script
node test-agent.js
```

### API Endpoint

**POST** `/agent`

Send A2A protocol-compliant JSON-RPC 2.0 requests:

```json
{
  "jsonrpc": "2.0",
  "id": "request-001",
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "What is the current price of Bitcoin?"
        }
      ],
      "messageId": "msg-001",
      "taskId": "task-001"
    }
  }
}
```

### Example Queries

- "What is the current price of Bitcoin?"
- "Should I invest in Ethereum right now?"
- "What's the risk level of Solana?"
- "Give me a detailed analysis of Cardano"

## 🌐 Live Deployment

**Production URL**: https://hng-stage-3-production.up.railway.app/agent

Test the live endpoint:
```bash
node test-railway.js
```

## 🤖 Agent Capabilities

### Tools

1. **fetchPriceTool** - Retrieves current price and 24h change
2. **fetchCoinDetailsTool** - Gets comprehensive market data
3. **fetchAssessmentRiskTool** - Analyzes volatility and risk level

### Supported Cryptocurrencies

Common IDs (use lowercase):
- bitcoin
- ethereum
- cardano
- solana
- ripple (XRP)
- dogecoin
- polkadot
- And 10,000+ more from CoinGecko

## 🔗 Telex.im Integration

This agent is integrated with Telex.im using Mastra's A2A protocol.

**Workflow Configuration**: See the workflow JSON in the project for Telex setup.

**Key Features**:
- JSON-RPC 2.0 compliance
- Proper artifact handling
- Conversation history tracking
- Multi-step tool execution

## 📚 Project Structure

```
stage-3/
├── src/
│   ├── agent/
│   │   └── cryptoAgent.ts       # Main agent configuration
│   ├── services/
│   │   └── cryptoService.ts     # CoinGecko API integration
│   └── index.ts                 # Express server & A2A endpoint
├── test-agent.js                # Local testing script
├── test-railway.js              # Production testing script
├── package.json
└── README.md
```

## 🧪 Testing

```bash
# Test local endpoint
node test-agent.js

# Test Railway deployment
node test-railway.js
```

## 🐛 Troubleshooting

### Agent returns "fetching price data" but no result
**Solution**: Ensure `maxSteps: 10` is set in the agent.generate() call to allow tool execution.

### Missing GROQ_API_KEY error
**Solution**: Set the GROQ_API_KEY environment variable in your .env file and deployment platform.

### CoinGecko API errors
**Solution**: Use lowercase cryptocurrency IDs (e.g., 'bitcoin' not 'Bitcoin').

## 📖 Learn More

- [Mastra Documentation](https://mastra.ai/docs)
- [A2A Protocol Specification](https://a2a.ai)
- [Telex.im Platform](https://telex.im)
- [CoinGecko API](https://www.coingecko.com/en/api)

## 👨‍💻 Author

Built for HNG Internship Stage 3 Backend Task

## 📄 License

MIT

---

**Note**: This project was developed as part of the HNG Stage 3 Backend Task focusing on building and integrating AI agents with the Telex.im platform using the A2A protocol.
