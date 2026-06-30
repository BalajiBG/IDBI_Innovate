const express = require('express');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { customerProfile, portfolio, wealthVitals, monthlyBreakdown, products } = require('../data/mockData');

const router = express.Router();

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});

const LANGUAGE_INSTRUCTIONS = {
  hi: 'Respond in Hindi (Devanagari script). Use simple language. Financial terms like SIP, EMI, PPF, FD, Portfolio can stay in English.',
  en: 'Respond in simple, clear English.',
  kn: 'Respond in Kannada (ಕನ್ನಡ script). Use simple spoken Kannada. Financial terms like SIP, EMI, PPF, FD, Portfolio can stay in English.',
  ta: 'Respond in Tamil (தமிழ் script). Use simple spoken Tamil. Financial terms can stay in English.',
  te: 'Respond in Telugu (తెలుగు script). Use simple spoken Telugu. Financial terms can stay in English.',
  ml: 'Respond in Malayalam (മലയാളം script). Use simple spoken Malayalam. Financial terms can stay in English.',
  mr: 'Respond in Marathi (मराठी, Devanagari script). Use simple spoken Marathi. Financial terms can stay in English.',
  bn: 'Respond in Bengali (বাংলা script). Use simple spoken Bengali. Financial terms can stay in English.',
  gu: 'Respond in Gujarati (ગુજરાતી script). Use simple spoken Gujarati. Financial terms can stay in English.',
  pa: 'Respond in Punjabi (ਪੰਜਾਬੀ Gurmukhi script). Use simple spoken Punjabi. Financial terms can stay in English.',
  or: 'Respond in Odia (ଓଡ଼ିଆ script). Use simple spoken Odia. Financial terms can stay in English.',
  as: 'Respond in Assamese (অসমীয়া script). Use simple spoken Assamese. Financial terms can stay in English.'
};

const HELP_SYSTEM_PROMPT = `You are the Help Assistant for WealthSeva AI — IDBI Bank's wealth advisory app.

Your job is to help the customer understand and use every feature of this app. You have complete knowledge of:

## APP FEATURES:

1. **Dashboard (Home)**
   - Shows WealthVitals Score (0-100) — a financial health score
   - 5 sub-scores: Emergency Fund, Debt-to-Income, Savings Rate, Investment Diversity, Goal Progress
   - Quick stats: Monthly Surplus, Largest Spend, Portfolio Value, Next Milestone
   - Proactive nudge notifications (e.g., salary day SIP reminder)

2. **Chat with Seva**
   - AI advisor that answers financial questions
   - Quick prompt chips for common questions
   - Responds in customer's chosen language
   - Can discuss spending, savings, SIP, goals, insurance, products

3. **Accounts (Account Aggregation)**
   - Shows all IDBI accounts (Savings, RD, FD, Loans)
   - Can link external bank accounts (SBI, HDFC, ICICI, etc.)
   - Can link investment accounts (Zerodha, Groww, EPFO, NPS)
   - Shows total wealth across all accounts
   - Uses RBI-approved Account Aggregator framework (secure)

4. **Spending Insights**
   - Donut chart showing monthly spend by category
   - 6-month trend line chart
   - Behavioral archetype (e.g., "Family Builder")
   - Insight cards (overspending alerts, achievements, opportunities)

5. **Goals**
   - Track financial goals (Child Education, Emergency Fund, Retirement)
   - Progress bar for each goal
   - Required SIP calculation to reach target
   - Seva's personalized advice per goal
   - Can add new goals

6. **Products**
   - Personalized IDBI product recommendations
   - Based on portfolio gaps (missing insurance, no MF, no PPF)
   - Priority badges (Urgent, High, Medium)
   - One-tap request — bank team contacts customer

7. **Help (You)**
   - You are the interactive help system
   - Answer questions about any feature
   - If you truly cannot help, set showContact: true

## CUSTOMER DATA:
- Name: ${customerProfile.name}, Age: ${customerProfile.age}, City: ${customerProfile.city}
- Monthly Salary: ₹${customerProfile.monthlySalary.toLocaleString('en-IN')}
- Monthly Surplus: ₹${monthlyBreakdown.monthlySurplus.toLocaleString('en-IN')}
- WealthVitals Score: ${wealthVitals.totalScore}/100
- Portfolio: RD (₹1,03,000) + Tax Saving FD (₹38,500) = ₹1,41,500
- Missing: ${portfolio.missingAssets.join(', ')}
- Goals: Child Education (5.7%), Emergency Fund (61.5%), Retirement (0.6%)
- Monthly expenses: EMI ₹18,000, Groceries ₹8,500, Food Delivery ₹4,200

## RULES:
1. Always be helpful, patient, and clear
2. If the question is about how to use a feature, give step-by-step instructions
3. If the question is about their financial data, use the data above
4. If you genuinely cannot answer (e.g., specific bank policy, account-specific issue), say you cannot help with this specific query and suggest contacting customer care
5. Keep responses concise (under 100 words)
6. Never make up information about bank policies or interest rates you don't know`;

// In-memory help conversation
const helpConversations = new Map();

router.post('/', async (req, res) => {
  const { message, language = 'hi', sessionId = 'help-default' } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message required' });
  }

  // Get conversation history
  if (!helpConversations.has(sessionId)) {
    helpConversations.set(sessionId, []);
  }
  const history = helpConversations.get(sessionId);

  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en;
  const fullPrompt = `${HELP_SYSTEM_PROMPT}\n\n${langInstruction}\n\nIMPORTANT: If you cannot help, end your message with [CONTACT_SUPPORT]`;

  const messages = [
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  try {
    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-sonnet-4-20250514-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 400,
        temperature: 0.5,
        system: fullPrompt,
        messages
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    let reply = responseBody.content?.[0]?.text || getFallbackHelp(message, language);

    // Check if AI flagged it needs contact support
    let showContact = false;
    if (reply.includes('[CONTACT_SUPPORT]')) {
      reply = reply.replace('[CONTACT_SUPPORT]', '').trim();
      showContact = true;
    }

    // Save to history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: reply });
    if (history.length > 20) helpConversations.set(sessionId, history.slice(-10));

    res.json({ reply, showContact });
  } catch (error) {
    console.error('Help chat error:', error.message);
    const reply = getFallbackHelp(message, language);
    res.json({ reply, showContact: false });
  }
});

function getFallbackHelp(message, language) {
  const lower = message.toLowerCase();

  const responses = {
    balance: {
      hi: `आपके IDBI खातों का विवरण:\n• बचत खाता: ₹87,500\n• RD (12 महीने): ₹1,03,000\n• Tax Saving FD: ₹38,500\n• Home Loan बकाया: ₹18,50,000\n\nकुल Portfolio मूल्य: ₹1,41,500\nमासिक वेतन: ₹65,000 | मासिक बचत: ₹17,300\n\n"खाते" (🏦) टैब पर सभी खाते विस्तार से देखें।`,
      en: `Here are your IDBI account details:\n• Savings Account: ₹87,500\n• RD (12 months): ₹1,03,000\n• Tax Saving FD: ₹38,500\n• Home Loan outstanding: ₹18,50,000\n\nTotal Portfolio Value: ₹1,41,500\nMonthly Salary: ₹65,000 | Monthly Surplus: ₹17,300\n\nTap "Accounts" (🏦) tab to see all accounts in detail.`,
      kn: `ನಿಮ್ಮ IDBI ಖಾತೆ ವಿವರ:\n• ಉಳಿತಾಯ ಖಾತೆ: ₹87,500\n• RD (12 ತಿಂಗಳು): ₹1,03,000\n• Tax Saving FD: ₹38,500\n• Home Loan ಬಾಕಿ: ₹18,50,000\n\nಒಟ್ಟು Portfolio ಮೌಲ್ಯ: ₹1,41,500\nಮಾಸಿಕ ವೇತನ: ₹65,000 | ಮಾಸಿಕ ಉಳಿತಾಯ: ₹17,300\n\n"ಖಾತೆಗಳು" (🏦) ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಎಲ್ಲಾ ಖಾತೆಗಳನ್ನು ವಿವರವಾಗಿ ನೋಡಿ.`
    },
    score: {
      hi: 'आपका WealthVitals Score 61/100 है। 5 उप-स्कोर: आपातकालीन निधि (12/20), कर्ज-आय अनुपात (13/20), बचत दर (8/20), निवेश विविधता (6/20), लक्ष्य प्रगति (12/20)। SIP शुरू करने से +12 अंक और बीमा लेने से +8 अंक बढ़ सकता है।',
      en: 'Your WealthVitals Score is 61/100. Sub-scores: Emergency Fund (12/20), Debt-to-Income (13/20), Savings Rate (8/20), Investment Diversity (6/20), Goal Progress (12/20). Starting SIP gives +12 points, getting insurance gives +8 points.',
      kn: 'ನಿಮ್ಮ WealthVitals Score 61/100. ಉಪ-ಸ್ಕೋರ್: ತುರ್ತು ನಿಧಿ (12/20), ಸಾಲ-ಆದಾಯ (13/20), ಉಳಿತಾಯ ದರ (8/20), ಹೂಡಿಕೆ ವೈವಿಧ್ಯ (6/20), ಗುರಿ ಪ್ರಗತಿ (12/20). SIP ಶುರು ಮಾಡಿದರೆ +12 ಅಂಕ, ವಿಮೆ ತೆಗೆದುಕೊಂಡರೆ +8 ಅಂಕ ಹೆಚ್ಚಾಗುತ್ತದೆ.'
    },
    sip: {
      hi: 'SIP शुरू करने के लिए: "उत्पाद" टैब पर जाएं → "IDBI Mutual Fund SIP" कार्ड पर "SIP शुरू करें" बटन दबाएं → बैंक टीम 24 घंटे में संपर्क करेगी।',
      en: 'To start a SIP: Go to "Products" tab → Tap "Start SIP" on the "IDBI Mutual Fund SIP" card → Bank team will contact you within 24 hours.',
      kn: 'SIP ಶುರು ಮಾಡಲು: "ಉತ್ಪನ್ನಗಳು" ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ → "IDBI Mutual Fund SIP" ಕಾರ್ಡ್‌ನಲ್ಲಿ "SIP ಶುರು ಮಾಡಿ" ಒತ್ತಿ → ಬ್ಯಾಂಕ್ ತಂಡ 24 ಗಂಟೆಯಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ.'
    },
    account: {
      hi: 'खाता जोड़ने के लिए: नीचे "खाते" (🏦) टैब दबाएं → "+ बाहरी खाता जोड़ें" बटन दबाएं → बैंक चुनें → खाता प्रकार चुनें → जोड़ें दबाएं। यह RBI अनुमोदित सुरक्षित प्रक्रिया है।',
      en: 'To add an account: Tap "Accounts" (🏦) tab below → Tap "+ Add External Account" → Select bank → Select account type → Tap Link. This is secure via RBI-approved framework.',
      kn: 'ಖಾತೆ ಸೇರಿಸಲು: ಕೆಳಗೆ "ಖಾತೆಗಳು" (🏦) ಟ್ಯಾಬ್ ಒತ್ತಿ → "+ ಬಾಹ್ಯ ಖಾತೆ ಸೇರಿಸಿ" ಒತ್ತಿ → ಬ್ಯಾಂಕ್ ಆಯ್ಕೆಮಾಡಿ → ಖಾತೆ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ → ಲಿಂಕ್ ಒತ್ತಿ. ಇದು RBI ಅನುಮೋದಿತ ಸುರಕ್ಷಿತ ಪ್ರಕ್ರಿಯೆ.'
    },
    spending: {
      hi: 'खर्चा देखने के लिए: होम पेज पर "📊" बटन दबाएं। वहां आपको गोल चार्ट (श्रेणी अनुसार खर्चा), 6 महीने का रुझान, और विशेष सुझाव कार्ड मिलेंगे।',
      en: 'To see spending: Tap "📊" button on the home page. You will see a donut chart (spend by category), 6-month trend, and insight cards with suggestions.',
      kn: 'ಖರ್ಚು ನೋಡಲು: ಮುಖಪುಟದಲ್ಲಿ "📊" ಬಟನ್ ಒತ್ತಿ. ಅಲ್ಲಿ ವೃತ್ತ ಚಾರ್ಟ್ (ವಿಭಾಗವಾರು ಖರ್ಚು), 6 ತಿಂಗಳ ಪ್ರವೃತ್ತಿ, ಮತ್ತು ಸಲಹೆ ಕಾರ್ಡ್‌ಗಳು ಸಿಗುತ್ತವೆ.'
    },
    goal: {
      hi: 'लक्ष्य देखने/जोड़ने के लिए: नीचे "🎯" टैब दबाएं। हर लक्ष्य में प्रगति बार, ज़रूरी SIP राशि, और Seva की सलाह दिखती है। नीचे "+ नया सपना जोड़ें" से नया लक्ष्य बनाएं।',
      en: 'To view/add goals: Tap "🎯" tab below. Each goal shows progress bar, required SIP, and Seva\'s advice. Tap "+ Add New Goal" at bottom to create a new one.',
      kn: 'ಗುರಿ ನೋಡಲು/ಸೇರಿಸಲು: ಕೆಳಗೆ "🎯" ಟ್ಯಾಬ್ ಒತ್ತಿ. ಪ್ರತಿ ಗುರಿಯಲ್ಲಿ ಪ್ರಗತಿ ಬಾರ್, ಅಗತ್ಯ SIP, ಮತ್ತು Seva ಸಲಹೆ ಇರುತ್ತದೆ. ಕೆಳಗೆ "+ ಹೊಸ ಕನಸು ಸೇರಿಸಿ" ಒತ್ತಿ ಹೊಸ ಗುರಿ ರಚಿಸಿ.'
    },
    default: {
      hi: 'मैं इस ऐप की हर सुविधा में मदद कर सकता हूँ। आप पूछ सकते हैं: स्कोर कैसे बढ़ाएं, SIP कैसे शुरू करें, खाता कैसे जोड़ें, खर्चा कैसे देखें, लक्ष्य कैसे बनाएं — कुछ भी!',
      en: 'I can help with every feature of this app. You can ask: how to improve score, how to start SIP, how to link accounts, how to see spending, how to set goals — anything!',
      kn: 'ನಾನು ಈ ಆ್ಯಪ್‌ನ ಪ್ರತಿಯೊಂದು ವೈಶಿಷ್ಟ್ಯದಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ಕೇಳಬಹುದು: ಸ್ಕೋರ್ ಹೇಗೆ ಸುಧಾರಿಸುವುದು, SIP ಹೇಗೆ ಶುರು ಮಾಡುವುದು, ಖಾತೆ ಹೇಗೆ ಲಿಂಕ್ ಮಾಡುವುದು — ಏನು ಬೇಕಾದರೂ!'
    }
  };

  if (lower.includes('balance') || lower.includes('money') || lower.includes('salary') || lower.includes('paisa') || lower.includes('kitna') || lower.includes('portfolio') || lower.includes('loan') || lower.includes('fd') || lower.includes('rd') || lower.includes('saving')) return responses.balance[language] || responses.balance.en;
  if (lower.includes('score') || lower.includes('health') || lower.includes('improve') || lower.includes('badhao')) return responses.score[language] || responses.score.en;
  if (lower.includes('sip') || lower.includes('mutual') || lower.includes('invest')) return responses.sip[language] || responses.sip.en;
  if (lower.includes('account') || lower.includes('link') || lower.includes('add') || lower.includes('external') || lower.includes('aggregate')) return responses.account[language] || responses.account.en;
  if (lower.includes('spend') || lower.includes('kharcha') || lower.includes('expense') || lower.includes('chart')) return responses.spending[language] || responses.spending.en;
  if (lower.includes('goal') || lower.includes('sapna') || lower.includes('dream') || lower.includes('target') || lower.includes('education') || lower.includes('retire') || lower.includes('emergency')) return responses.goal[language] || responses.goal.en;
  return responses.default[language] || responses.default.en;
}

module.exports = router;
