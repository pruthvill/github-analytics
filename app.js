const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require('readline');

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Initialize the Gemini Pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Set up the readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Start the conversation
async function startChat() {
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 200,
    },
  });

  console.log('Welcome to the chatbot! Type "exit" to end the conversation.');

  // Handle user input and send messages to the chatbot
  rl.on('line', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const result = await chat.sendMessage(input, { role: 'user' });
    const response = await result.response;
    const text = response.text();
    console.log('Chatbot:', text);
  });
}

startChat();