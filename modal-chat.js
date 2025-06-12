const chatHistory = document.getElementById('chatHistory');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');

// Agent responses based on user input patterns
const agentResponses = {
  email: [
    "I'll help you create an email monitoring agent! This agent can check for new emails, filter by criteria, and perform actions like summarizing or forwarding. What specific email tasks do you want to automate?",
    "Great! An email agent can help with notifications, auto-replies, organizing emails, or extracting important information. Would you like it to work with a specific email provider like Gmail?"
  ],
  weather: [
    "Perfect! A weather agent can monitor conditions, send alerts for severe weather, provide daily forecasts, or track weather for multiple locations. What weather information matters most to you?",
    "Weather monitoring is very useful! I can set up an agent that checks conditions hourly, sends storm warnings, or provides travel weather updates. Which features interest you?"
  ],
  news: [
    "A news aggregation agent is excellent for staying informed! It can collect headlines from multiple sources, filter by topics, summarize articles, or send daily briefings. What news topics are you most interested in?",
    "News monitoring helps you stay current! The agent can track specific keywords, compare coverage across sources, or create personalized news digests. What's your preferred news focus?"
  ],
  stock: [
    "Stock monitoring agents are great for investors! They can track price movements, send alerts on thresholds, analyze trends, or provide portfolio summaries. Which stocks or metrics do you want to monitor?",
    "Financial monitoring is crucial! The agent can watch for volatility, dividend announcements, earnings reports, or market news. What's your investment focus?"
  ],
  website: [
    "Website monitoring is essential for uptime and performance! The agent can check site availability, monitor loading speeds, track changes, or alert on downtime. What aspects of your website need monitoring?",
    "Great choice! A website monitoring agent can perform health checks, monitor SSL certificates, track user analytics, or check for broken links. What's most important for your site?"
  ],
  social: [
    "Social media agents can help manage your online presence! They can monitor mentions, schedule posts, analyze engagement, or track competitor activity. Which platforms do you want to focus on?",
    "Social monitoring is powerful for brand awareness! The agent can track hashtags, respond to comments, analyze sentiment, or create content reports. What social goals do you have?"
  ],
  shopping: [
    "A shopping assistant agent can save you time and money! It can track prices, find deals, manage wishlists, or compare products across stores. What shopping tasks would you like to automate?",
    "Smart shopping automation is very helpful! The agent can monitor for sales, check inventory, apply coupons automatically, or send price drop alerts. What products are you interested in?"
  ],
  schedule: [
    "Calendar and scheduling agents are great for productivity! They can manage appointments, send reminders, find meeting times, or sync across platforms. How do you want to optimize your schedule?",
    "Scheduling automation saves so much time! The agent can handle booking, rescheduling, time blocking, or meeting preparation. What scheduling challenges do you face?"
  ]
};

// Get appropriate response based on user input
function getAgentResponse(userText) {
  const text = userText.toLowerCase();
  
  // Check for keywords and return appropriate response
  for (const [keyword, responses] of Object.entries(agentResponses)) {
    if (text.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Default responses for general queries
  const defaultResponses = [
    "That sounds like an interesting agent! Could you tell me more about what specific tasks you'd like it to perform?",
    "I'd be happy to help you build that agent! What triggers should it respond to, and what actions should it take?",
    "Great idea! Let me understand the workflow better - what data sources will it need and what outputs do you want?",
    "This agent could be very useful! What schedule should it run on, and how would you like to receive its results?",
    "I can help you create that! What are the key features you want this agent to have?",
    "Excellent concept! What platforms or services should this agent integrate with?",
    "That's a practical automation! What conditions should trigger the agent, and what should it do when triggered?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Send message
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Clear placeholder if it exists
  const placeholder = chatHistory.querySelector('.text-center');
  if (placeholder) {
    chatHistory.innerHTML = '';
  }

  // User bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'bg-blue-600 px-4 py-3 rounded-lg w-fit max-w-[85%] self-end ml-auto shadow-lg';
  userBubble.innerHTML = `<div class="text-white font-medium text-sm">${text}</div>`;
  chatHistory.appendChild(userBubble);
  
  chatInput.value = '';
  chatHistory.scrollTop = chatHistory.scrollHeight;

  // Show typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'bg-gray-700 px-4 py-3 rounded-lg w-fit max-w-[85%] shadow-lg';
  typingIndicator.innerHTML = `
    <div class="flex items-center space-x-2 text-gray-300">
      <div class="text-blue-400">🤖</div>
      <div class="text-sm">AI Assistant is typing</div>
      <div class="flex space-x-1">
        <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
        <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  `;
  chatHistory.appendChild(typingIndicator);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  // Mock agent response after delay
  setTimeout(() => {
    chatHistory.removeChild(typingIndicator);
    
    const botBubble = document.createElement('div');
    botBubble.className = 'bg-gray-700 px-4 py-3 rounded-lg w-fit max-w-[85%] shadow-lg';
    
    const response = getAgentResponse(text);
    botBubble.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="text-blue-400 text-lg">🤖</div>
        <div class="text-white text-sm leading-relaxed">${response}</div>
      </div>
    `;
    
    chatHistory.appendChild(botBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }, 1000 + Math.random() * 1000);
}

sendChat.addEventListener('click', sendMessage);

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize input as user types
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = chatInput.scrollHeight + 'px';
});

// Audio input using Web Speech API
const micBtn = document.getElementById('micBtn');
let isRecording = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  micBtn.addEventListener('click', () => {
    if (!isRecording) {
      recognition.start();
      micBtn.classList.add('text-red-400', 'animate-pulse');
      micBtn.innerHTML = '🔴';
      micBtn.title = 'Recording... Click to stop';
      isRecording = true;
    } else {
      recognition.stop();
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    
    // Auto-send if transcript seems complete
    if (transcript.length > 10) {
      setTimeout(() => {
        sendMessage();
      }, 500);
    }
  };

  recognition.onstart = () => {
    console.log('Speech recognition started');
  };

  recognition.onend = () => {
    micBtn.classList.remove('text-red-400', 'animate-pulse');
    micBtn.innerHTML = '🎤';
    micBtn.title = 'Click to speak';
    isRecording = false;
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    micBtn.classList.remove('text-red-400', 'animate-pulse');
    micBtn.innerHTML = '🎤';
    micBtn.title = 'Speech recognition error. Click to try again.';
    isRecording = false;
  };

} else {
  micBtn.disabled = true;
  micBtn.classList.add('opacity-50', 'cursor-not-allowed');
  micBtn.title = "Speech recognition not supported in this browser";
}

// Add some example prompts for users
function addExamplePrompts() {
  const examples = [
    "📧 Create an email summarizer that processes my inbox daily",
    "🌤️ Build a weather alert system for my city",
    "📈 Monitor my stock portfolio and send alerts",
    "🔍 Track mentions of my brand on social media",
    "🛒 Find the best deals on products I'm watching",
    "📰 Aggregate news from my favorite sources"
  ];
  
  const exampleContainer = document.createElement('div');
  exampleContainer.className = 'mt-4 space-y-2';
  exampleContainer.innerHTML = `
    <div class="text-xs text-gray-400 mb-2">💡 Try these examples:</div>
    ${examples.map(example => `
      <button class="example-prompt text-left w-full p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-xs transition-colors cursor-pointer border border-gray-700/50 hover:border-blue-500/30">
        ${example}
      </button>
    `).join('')}
  `;
  
  // Add click handlers for examples
  setTimeout(() => {
    const exampleButtons = exampleContainer.querySelectorAll('.example-prompt');
    exampleButtons.forEach(button => {
      button.addEventListener('click', () => {
        chatInput.value = button.textContent.trim();
        sendMessage();
      });
    });
  }, 0);
  
  return exampleContainer;
}

// Initialize with examples if chat is empty
document.addEventListener('DOMContentLoaded', () => {
  const hasContent = chatHistory.querySelector('.bg-blue-600, .bg-gray-600');
  if (!hasContent) {
    chatHistory.appendChild(addExamplePrompts());
  }
});