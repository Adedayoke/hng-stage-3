// Simple test script to test the agent endpoint
const testEndpoint = async () => {
  const url = 'http://localhost:3000/agent';
  
  const payload = {
    jsonrpc: "2.0",
    id: "test-001",
    method: "message/send",
    params: {
      message: {
        kind: "message",
        role: "user",
        parts: [
          {
            kind: "text",
            text: "What is the current price of Bitcoin?"
          }
        ],
        messageId: "msg-001",
        taskId: "task-001"
      },
      configuration: {
        blocking: true
      }
    }
  };

  try {
    console.log('Sending request to:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('\n=== RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.result?.status?.message?.parts?.[0]?.text) {
      console.log('\n=== AGENT RESPONSE TEXT ===');
      console.log(data.result.status.message.parts[0].text);
    }
    
    if (data.result?.artifacts) {
      console.log('\n=== ARTIFACTS ===');
      console.log(JSON.stringify(data.result.artifacts, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testEndpoint();
