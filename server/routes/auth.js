const express = require('express');
const jwt = require('jsonwebtoken');
const { customerProfile } = require('../data/mockData');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'wealthseva-hackathon-2026';

// POST /api/auth/login — Mock login (accepts any credentials for demo)
router.post('/login', (req, res) => {
  const { customerId, pin, language = 'hi' } = req.body;

  const errors = {
    missing: { hi: 'Customer ID और PIN दोनों ज़रूरी हैं।', en: 'Both Customer ID and PIN are required.', kn: 'Customer ID ಮತ್ತು PIN ಎರಡೂ ಅಗತ್ಯ.' },
    invalidPin: { hi: 'PIN गलत है। 4 अंकों का PIN डालें।', en: 'Invalid PIN. Please enter a 4-digit PIN.', kn: 'PIN ತಪ್ಪಾಗಿದೆ. 4 ಅಂಕಿಯ PIN ನಮೂದಿಸಿ.' }
  };

  if (!customerId || !pin) {
    return res.status(400).json({ success: false, message: errors.missing[language] || errors.missing.en });
  }

  // Mock: accept any 4+ digit PIN for demo
  if (pin.length < 4) {
    return res.status(401).json({ success: false, message: errors.invalidPin[language] || errors.invalidPin.en });
  }

  const token = jwt.sign(
    { customerId: customerProfile.customerId, name: customerProfile.name, archetype: customerProfile.archetype },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    customer: {
      customerId: customerProfile.customerId,
      name: customerProfile.name,
      city: customerProfile.city,
      archetype: customerProfile.archetype,
      wealthVitalsScore: customerProfile.wealthVitalsScore
    },
    message: `Namaste ${customerProfile.name} ji! Welcome back.`
  });
});

module.exports = router;
