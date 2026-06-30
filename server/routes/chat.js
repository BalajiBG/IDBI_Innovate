const express = require('express');
const { getSevaResponse } = require('../services/bedrockService');

const router = express.Router();

// In-memory conversation store (per session for demo)
const conversations = new Map();

// POST /api/chat — Send message to Seva AI
router.post('/', async (req, res) => {
  try {
    const { message, sessionId = 'default', language = 'hi' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message zaroor bhejo.' });
    }

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const history = conversations.get(sessionId);

    // Get AI response
    const response = await getSevaResponse(message, history, language);

    // Update history (keep last 20 turns)
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: response });
    if (history.length > 40) {
      conversations.set(sessionId, history.slice(-20));
    }

    res.json({
      reply: response,
      timestamp: new Date().toISOString(),
      suggestions: getSuggestions(message)
    });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.json({
      reply: "Abhi thoda busy hoon, ek minute mein try karo. Tab tak apna spending page dekho!",
      timestamp: new Date().toISOString(),
      suggestions: ["Mera score kaise badhega?", "SIP kaise shuru karein?"],
      fallback: true
    });
  }
});

// Generate contextual follow-up suggestions
function getSuggestions(userMessage) {
  const lower = userMessage.toLowerCase();
  if (lower.includes('paisa') || lower.includes('kharcha') || lower.includes('spend')) {
    return ["Food delivery kaise kam karein?", "Savings kaise badhayein?", "Budget plan banao"];
  }
  if (lower.includes('sip') || lower.includes('mutual') || lower.includes('invest')) {
    return ["Kitna SIP shuru karein?", "Tax saving options?", "Risk kya hai?"];
  }
  if (lower.includes('score') || lower.includes('health')) {
    return ["Score kaise improve hoga?", "Kya missing hai?", "Insurance chahiye?"];
  }
  if (lower.includes('emergency') || lower.includes('goal')) {
    return ["Emergency fund kitna chahiye?", "Child education plan?", "Retirement planning"];
  }
  return ["Mera paisa kahan ja raha hai?", "SIP kaise shuru karein?", "Emergency fund kitna chahiye?", "Mera score kaise badhega?"];
}

module.exports = router;
