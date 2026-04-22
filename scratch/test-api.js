const fetch = require('node-fetch');

async function testChat() {
  const url = 'http://localhost:3001/api/chat';
  const body = {
    messages: [{ role: 'user', content: 'Hello' }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testChat();
