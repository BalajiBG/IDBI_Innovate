const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { customerProfile, portfolio, monthlyBreakdown, wealthVitals } = require('../data/mockData');

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});

const SYSTEM_PROMPT = `You are Seva, IDBI Bank's personal AI wealth advisor AND in-app help assistant.

Personality: Warm, simple, non-judgmental. Like a trusted family friend who happens to know finance well.

You handle TWO types of questions:
1. FINANCIAL ADVICE — spending, savings, SIP, goals, insurance, products
2. APP HELP — how to use features, navigate the app, link accounts, read charts

PROACTIVE BEHAVIOR: Even when the user asks a simple question, if you notice a critical gap in their finances, BRIEFLY mention it. For example:
- If they ask about spending, also mention they have no equity investments
- If they ask about goals, also note that their savings rate is low
- If they ask anything, you can add "By the way..." with one relevant insight
- Always connect advice to WEALTH BUILDING: "If you save ₹X, in Y years it becomes ₹Z"

You are not a passive chatbot. You are an ACTIVE wealth builder who:
1. NOTICES financial gaps and TELLS the customer
2. CALCULATES growth projections to motivate action
3. CONNECTS daily spending decisions to long-term wealth impact
4. CELEBRATES progress (Emergency Fund 61.5% done!)
5. CREATES urgency when appropriate ("₹900 saved monthly = ₹2.1L in 10 years")

Rules:
- Never recommend specific stocks, crypto, or unlisted securities
- Always ground advice in the customer's actual data below
- Keep responses under 80 words (mobile-first)
- End with one actionable suggestion or a follow-up question
- If customer seems stressed about money, be extra gentle
- Use ₹ symbol with Indian number format (₹X,XX,XXX)
- Be encouraging but honest about financial gaps
- For app navigation questions, give clear step-by-step instructions

RESPONSIBLE ADVISOR GUIDELINES:
- All suggestions are informational only — not SEBI-registered investment advice
- Never guarantee returns — always say "expected" or "approximate"
- Never ask for OTP, password, CVV, or full card number
- If customer asks about tax filing specifics, suggest consulting a CA
- Do not discriminate based on gender, religion, caste, or location
- If customer mentions financial distress or debt crisis, respond with empathy and suggest professional help (IDBI customer care: 1800-209-4324)
- Never push a product aggressively — always explain why it suits THIS customer
- Clearly state lock-in periods and risks for any investment suggestion
- Protect customer privacy — never repeat sensitive data like full account numbers

UNBIASED ADVISOR PRINCIPLES:
- Recommend based ONLY on financial data (income, expenses, goals, risk profile) — never on gender, age stereotypes, religion, or community
- Do not assume spending habits based on city tier or cultural background
- If comparing to "industry averages" or "peers", clarify these are approximate benchmarks
- Present multiple options where possible — don't force a single product
- Acknowledge that IDBI products are shown because this is an IDBI app, but customer is free to choose any provider
- Treat all family structures equally (single, joint, single parent, etc.)
- Never make assumptions about financial literacy based on language choice
- If customer's question has no clear answer, say "I'm not sure" rather than guessing

APP FEATURES (use this to answer "how to" questions — ONLY reference these, nothing else):
- Home (🏠): Financial Health Score, Accounts overview, Upcoming Bills, Credit Score, Wealth Advisor Insights
- Seva Chat (💬): This conversation — ask anything about finances or app usage
- Spending (📊): Monthly spending breakdown chart, 6-month trends, salary flow analysis
- Goals (🎯): Track goals, create savings plans, tax saving instruments, wealth growth projection
- Products (💡): IDBI product recommendations, loans, credit cards, eligibility check
- Accounts (via Home → Accounts card): IDBI accounts, Investment Portfolio, Insurances, Physical Assets, Other Income
- Profile (via top-right avatar): Lifestyle expenses, family details
- Reach Us (in Seva chat): Call 1800-209-4324, Email customercare@idbi.co.in, WhatsApp

DO NOT reference features that don't exist: No "Branch Locator", no "Help & Support menu", no "Live agent chat", no "Settings page". Only mention what is listed above.`;

const LANGUAGE_INSTRUCTIONS = {
  hi: `Language: Respond in natural Hinglish (Hindi-English mix). Use simple Hindi words mixed with English financial terms. Example: "Aapka savings rate thoda kam hai, SIP shuru karna best hoga."`,
  en: `Language: Respond in simple, clear English. Avoid jargon. Use short sentences. Be warm and friendly like a trusted Indian advisor speaking in English.`,
  kn: `Language: Respond in natural Kannada mixed with English financial terms (Kanglish). Use simple spoken Kannada. Example: "Nimma savings rate swalpa kammi ide, SIP shuru maadodu best option." Use Kannada script (ಕನ್ನಡ) for Kannada words.`,
  ta: `Language: Respond in natural Tamil mixed with English financial terms. Use Tamil script (தமிழ்) for Tamil words. Keep it simple and conversational.`,
  te: `Language: Respond in natural Telugu mixed with English financial terms. Use Telugu script (తెలుగు) for Telugu words. Keep it simple and friendly.`,
  ml: `Language: Respond in natural Malayalam mixed with English financial terms. Use Malayalam script (മലയാളം) for Malayalam words. Keep it conversational.`,
  mr: `Language: Respond in natural Marathi mixed with English financial terms. Use Devanagari script for Marathi words. Keep it simple like talking to a friend.`,
  bn: `Language: Respond in natural Bengali mixed with English financial terms. Use Bengali script (বাংলা) for Bengali words. Keep it warm and simple.`,
  gu: `Language: Respond in natural Gujarati mixed with English financial terms. Use Gujarati script (ગુજરાતી) for Gujarati words. Keep it friendly.`,
  pa: `Language: Respond in natural Punjabi mixed with English financial terms. Use Gurmukhi script (ਪੰਜਾਬੀ) for Punjabi words. Keep it warm.`,
  or: `Language: Respond in natural Odia mixed with English financial terms. Use Odia script (ଓଡ଼ିଆ) for Odia words. Keep it simple.`,
  as: `Language: Respond in natural Assamese mixed with English financial terms. Use Assamese script (অসমীয়া) for Assamese words. Keep it friendly.`
};

const CUSTOMER_CONTEXT = `
Customer Profile:
Name: ${customerProfile.name}, Age: ${customerProfile.age}, City: ${customerProfile.city}
Monthly Salary: ₹${customerProfile.monthlySalary.toLocaleString('en-IN')}
Monthly Surplus: ₹${monthlyBreakdown.monthlySurplus.toLocaleString('en-IN')}
Behavioral Archetype: ${customerProfile.archetype}
Family Size: ${customerProfile.familySize}

Current Portfolio:
- RD ₹2,000/month (value: ₹1,03,000)
- Tax Saving FD ₹34,000 (value: ₹38,500)
- Total Portfolio: ₹1,41,500

Missing: ${portfolio.missingAssets.join(', ')}

WealthVitals Score: ${wealthVitals.totalScore}/100 (Grade: ${wealthVitals.grade})
- Savings Rate: 5.2% (poor)
- Investment Diversity: Only 2 asset types (poor)
- Emergency Fund: 62% funded (fair)
- Debt-to-Income: 32% (fair)
- Goal Progress: 15% average (fair)

Goals:
- Child Education: ₹15,00,000 target, ₹85,000 saved (5.7%)
- Emergency Fund: ₹1,95,000 target, ₹1,20,000 saved (61.5%)
- Retirement: ₹80,00,000 target, ₹45,000 saved (0.6%)

Top Spending (monthly):
- Home Loan EMI: ₹18,000
- Groceries: ₹8,500
- Food Delivery: ₹4,200 (high — industry avg is 3% of income)
- School Fees: ₹4,500
- Utilities: ₹3,200
- Travel: ₹3,000
- Entertainment: ₹2,800

Credit Score: 742/900 (Good)
- On-time EMI payments: 3 consecutive months
- Credit utilization: 4.1% (well below 30%)
- Only 1 credit type (Home Loan) — needs mix improvement
- 8 more points needed for "Excellent" (750+)

Insurance:
- Health Insurance: IDBI Federal ₹5,00,000 family floater (ACTIVE)
- Term Life Insurance: NOT AVAILABLE (critical gap — 4 dependents)
- Vehicle Insurance: NOT AVAILABLE

Upcoming Bills (this month):
- Home Loan EMI: ₹18,000 (5th)
- HDFC Car Loan: ₹8,500 (7th)
- Credit Cards: ₹8,200 total (3 cards, 10-15th)
- Mobile/WiFi: ₹2,047 (12-15th)
- Electricity/Water/Gas: ₹2,550 (18-22nd)
- Society Maintenance: ₹3,500 (1st)
- Insurance Premium: ₹1,000 (25th)
- Total monthly bills: ₹44,797

IDBI Accounts:
- Savings Account: ₹87,500
- RD (12 month): ₹1,03,000
- Tax Saving FD: ₹38,500
- Home Loan outstanding: ₹18,50,000

Linked External:
- SBI Savings: ₹42,300

Tax Status:
- 80C used: ₹34,000 out of ₹1,50,000 limit (23%)
- Tax saving potential: ₹35,880 more (at 30% slab)`;

async function getSevaResponse(userMessage, conversationHistory = [], language = 'hi') {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.hi;
  const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n${langInstruction}\n\n${CUSTOMER_CONTEXT}`;
  // Build messages array
  const messages = [];

  // Add conversation history
  conversationHistory.forEach(turn => {
    messages.push({ role: turn.role, content: turn.content });
  });

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  try {
    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-sonnet-4-20250514-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 300,
        temperature: 0.7,
        system: fullSystemPrompt,
        messages: messages
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    if (responseBody.content && responseBody.content[0]) {
      return responseBody.content[0].text;
    }

    return getFallbackResponse(userMessage, language);
  } catch (error) {
    console.error('Bedrock error:', error.message);
    return getFallbackResponse(userMessage, language);
  }
}

// Fallback responses when Bedrock is unavailable
function getFallbackResponse(userMessage, language = 'hi') {
  const lower = userMessage.toLowerCase();

  const responses = {
    spending: {
      hi: "Rajesh ji, aapka sabse bada kharcha Home Loan EMI (₹18,000) hai — yeh toh zaroori hai. Lekin Food Delivery pe ₹4,200 thoda zyada hai — industry average 3% income hai, aapka 6.5% hai. Agar ₹2,000 bachao toh SIP mein daal sakte ho! Spending page pe detail dekhein?",
      en: "Rajesh, your biggest expense is Home Loan EMI (₹18,000) — that's essential. But Food Delivery at ₹4,200 is a bit high — industry average is 3% of income, yours is 6.5%. If you save ₹2,000, you can put it in SIP! Want to check the Spending page for details?",
      kn: "ರಾಜೇಶ್, ನಿಮ್ಮ ಅತಿ ದೊಡ್ಡ ಖರ್ಚು Home Loan EMI (₹18,000) — ಇದು ಅಗತ್ಯ. ಆದರೆ Food Delivery ₹4,200 ಸ್ವಲ್ಪ ಹೆಚ್ಚು — ಉದ್ಯಮ ಸರಾಸರಿ ಆದಾಯದ 3%, ನಿಮ್ಮದು 6.5%. ₹2,000 ಉಳಿಸಿದರೆ SIP ನಲ್ಲಿ ಹಾಕಬಹುದು! ಖರ್ಚು ಪುಟದಲ್ಲಿ ವಿವರ ನೋಡಿ?"
    },
    sip: {
      hi: "Rajesh ji, SIP matlab Systematic Investment Plan — har mahine fixed amount mutual fund mein invest hota hai. Aap ₹2,000/month se shuru kar sakte ho. 10 saal mein 12% return pe yeh ₹4.6 lakh ban jayega! IDBI ka Nifty 50 Index Fund best option hai beginners ke liye. Shuru karein?",
      en: "Rajesh, SIP means Systematic Investment Plan — a fixed amount gets invested in mutual funds every month. You can start with ₹2,000/month. At 12% returns, it grows to ₹4.6 lakh in 10 years! IDBI's Nifty 50 Index Fund is the best option for beginners. Want to start?",
      kn: "ರಾಜೇಶ್, SIP ಎಂದರೆ Systematic Investment Plan — ಪ್ರತಿ ತಿಂಗಳು ನಿಗದಿತ ಮೊತ್ತ Mutual Fund ನಲ್ಲಿ ಹೂಡಿಕೆ ಆಗುತ್ತದೆ. ₹2,000/ತಿಂಗಳಿಂದ ಶುರು ಮಾಡಬಹುದು. 12% ರಿಟರ್ನ್‌ನಲ್ಲಿ 10 ವರ್ಷದಲ್ಲಿ ₹4.6 ಲಕ್ಷ ಆಗುತ್ತದೆ! IDBI Nifty 50 Index Fund ಹೊಸಬರಿಗೆ ಉತ್ತಮ. ಶುರು ಮಾಡೋಣವೇ?"
    },
    score: {
      hi: "Rajesh ji, aapka WealthVitals Score 61/100 hai — 'Good' category mein ho! Score badhane ke 3 quick wins: 1) SIP shuru karo (Investment Diversity +12 points), 2) Health Insurance lo (Protection +8 points), 3) Food delivery ₹2,000 kam karo (Savings Rate +5 points). Total 25 points jump possible hai!",
      en: "Rajesh, your WealthVitals Score is 61/100 — you're in the 'Good' category! 3 quick wins to boost it: 1) Start SIP (+12 points for Investment Diversity), 2) Get Health Insurance (+8 points for Protection), 3) Cut food delivery by ₹2,000 (+5 points for Savings Rate). A 25-point jump is possible!",
      kn: "ರಾಜೇಶ್, ನಿಮ್ಮ WealthVitals Score 61/100 — 'Good' ವಿಭಾಗದಲ್ಲಿದ್ದೀರಿ! ಸ್ಕೋರ್ ಹೆಚ್ಚಿಸಲು 3 ತ್ವರಿತ ಮಾರ್ಗಗಳು: 1) SIP ಶುರು ಮಾಡಿ (ಹೂಡಿಕೆ ವೈವಿಧ್ಯ +12 ಅಂಕ), 2) Health Insurance ತೆಗೆದುಕೊಳ್ಳಿ (ಸುರಕ್ಷತೆ +8 ಅಂಕ), 3) Food delivery ₹2,000 ಕಡಿಮೆ ಮಾಡಿ (ಉಳಿತಾಯ +5 ಅಂಕ). 25 ಅಂಕ ಹೆಚ್ಚಳ ಸಾಧ್ಯ!"
    },
    emergency: {
      hi: "Rajesh ji, Emergency Fund ka rule hai — 3 mahine ka kharcha hona chahiye. Aapka monthly expense ₹49,700 hai, toh ₹1,95,000 chahiye. Abhi ₹1,20,000 hai — 61.5% done! Sirf ₹75,000 aur chahiye. Agar ₹18,750/month save karo toh 4 mahine mein complete ho jayega. Almost there!",
      en: "Rajesh, the Emergency Fund rule is: you need 3 months of expenses. Your monthly expense is ₹49,700, so you need ₹1,95,000. You currently have ₹1,20,000 — 61.5% done! Just ₹75,000 more needed. If you save ₹18,750/month, it'll be complete in 4 months. Almost there!",
      kn: "ರಾಜೇಶ್, ತುರ್ತು ನಿಧಿ ನಿಯಮ — 3 ತಿಂಗಳ ಖರ್ಚಿನಷ್ಟು ಬೇಕು. ನಿಮ್ಮ ಮಾಸಿಕ ಖರ್ಚು ₹49,700, ಹಾಗಾಗಿ ₹1,95,000 ಬೇಕು. ಈಗ ₹1,20,000 ಇದೆ — 61.5% ಆಗಿದೆ! ₹75,000 ಮಾತ್ರ ಬೇಕು. ₹18,750/ತಿಂಗಳು ಉಳಿಸಿದರೆ 4 ತಿಂಗಳಲ್ಲಿ ಪೂರ್ಣ ಆಗುತ್ತದೆ. ಬಹುತೇಕ ಆಗಿದೆ!"
    },
    retirement: {
      hi: "Rajesh ji, retirement ke liye abhi se sochna smart hai! Aapko 2051 tak ₹80 lakh chahiye. PPF mein ₹3,000/month se 25 saal mein ~₹31 lakh ban sakta hai (7.1% tax-free). Baaki ke liye equity SIP add karo. PPF account kholein IDBI mein?",
      en: "Rajesh, thinking about retirement now is smart! You need ₹80 lakh by 2051. ₹3,000/month in PPF can grow to ~₹31 lakh in 25 years (7.1% tax-free). Add an equity SIP for the rest. Want to open a PPF account with IDBI?",
      kn: "ರಾಜೇಶ್, ಈಗಲೇ ನಿವೃತ್ತಿ ಬಗ್ಗೆ ಯೋಚಿಸುವುದು ಬುದ್ಧಿವಂತಿಕೆ! 2051 ರ ಹೊತ್ತಿಗೆ ₹80 ಲಕ್ಷ ಬೇಕು. PPF ನಲ್ಲಿ ₹3,000/ತಿಂಗಳು 25 ವರ್ಷದಲ್ಲಿ ~₹31 ಲಕ್ಷ ಆಗುತ್ತದೆ (7.1% ತೆರಿಗೆ-ಮುಕ್ತ). ಉಳಿದಕ್ಕೆ equity SIP ಸೇರಿಸಿ. IDBI ನಲ್ಲಿ PPF ಖಾತೆ ತೆರೆಯೋಣವೇ?"
    },
    default: {
      hi: "Rajesh ji, main aapka financial advisor Seva hoon! Aap mujhse spending, savings, SIP, goals — kuch bhi pooch sakte ho. Aapka WealthVitals Score 61/100 hai aur ₹17,300 surplus hai har mahine. Kya aap apna paisa better invest karna chahte ho?",
      en: "Rajesh, I'm Seva, your financial advisor! You can ask me about spending, savings, SIP, goals — anything. Your WealthVitals Score is 61/100 and you have ₹17,300 surplus every month. Would you like to invest your money better?",
      kn: "ರಾಜೇಶ್, ನಾನು Seva, ನಿಮ್ಮ ಆರ್ಥಿಕ ಸಲಹೆಗಾರ! ಖರ್ಚು, ಉಳಿತಾಯ, SIP, ಗುರಿಗಳ ಬಗ್ಗೆ — ಏನು ಬೇಕಾದರೂ ಕೇಳಬಹುದು. ನಿಮ್ಮ WealthVitals Score 61/100 ಮತ್ತು ಪ್ರತಿ ತಿಂಗಳು ₹17,300 ಉಳಿತಾಯ ಇದೆ. ನಿಮ್ಮ ಹಣವನ್ನು ಉತ್ತಮವಾಗಿ ಹೂಡಿಕೆ ಮಾಡಲು ಬಯಸುವಿರಾ?"
    },
    greeting: {
      hi: "Good morning Rajesh ji! 🙏 Main Seva, aapka AI wealth advisor. Aaj aapke liye kya kar sakta hoon? Aapka score 61/100 hai, ₹17,300 surplus hai — kya SIP, goals, ya spending ke baare mein baat karein?",
      en: "Good morning Rajesh! 🙏 I'm Seva, your AI wealth advisor. How can I help you today? Your score is 61/100, you have ₹17,300 monthly surplus — shall we discuss SIP, goals, or review your spending?",
      kn: "ಶುಭೋದಯ ರಾಜೇಶ್! 🙏 ನಾನು Seva, ನಿಮ್ಮ AI ಸಂಪತ್ತು ಸಲಹೆಗಾರ. ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ನಿಮ್ಮ ಸ್ಕೋರ್ 61/100, ₹17,300 ಮಾಸಿಕ ಉಳಿತಾಯ ಇದೆ — SIP, ಗುರಿಗಳು, ಅಥವಾ ಖರ್ಚು ಬಗ್ಗೆ ಮಾತಾಡೋಣವೇ?"
    },
    yesConfirm: {
      hi: "Rajesh ji, SIP shuru karne ke liye Products tab pe jayein → 'IDBI Mutual Fund SIP' select karein → ₹2,000/month se shuru kar sakte hain. Ya agar aap Goals tab pe jayein toh wahan bhi SIP calculator hai. Kya main aur kuch madad kar sakta hoon?",
      en: "Rajesh, to start a SIP go to Products tab → select 'IDBI Mutual Fund SIP' → you can start from ₹2,000/month. Or visit the Goals tab for the SIP calculator. Can I help with anything else?",
      kn: "ರಾಜೇಶ್, SIP ಶುರು ಮಾಡಲು Products ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ → 'IDBI Mutual Fund SIP' ಆಯ್ಕೆ ಮಾಡಿ → ₹2,000/ತಿಂಗಳಿಂದ ಶುರು ಮಾಡಬಹುದು. ಅಥವಾ Goals ಟ್ಯಾಬ್‌ನಲ್ಲಿ SIP ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಇದೆ. ಇನ್ನೇನಾದರೂ ಸಹಾಯ ಬೇಕೇ?"
    },
    balance: {
      hi: "Rajesh ji, aapke accounts ka summary: Savings ₹87,500 | RD ₹1,03,000 | FD ₹38,500 | Home Loan baki ₹18,50,000. Total Portfolio: ₹1,41,500. Monthly salary ₹65,000, surplus ₹17,300. Accounts tab (🏦) pe full detail hai.",
      en: "Rajesh, here's your account summary: Savings ₹87,500 | RD ₹1,03,000 | FD ₹38,500 | Home Loan outstanding ₹18,50,000. Total Portfolio: ₹1,41,500. Monthly salary ₹65,000, surplus ₹17,300. Check Accounts tab (🏦) for full details.",
      kn: "ರಾಜೇಶ್, ನಿಮ್ಮ ಖಾತೆ ಸಾರಾಂಶ: ಉಳಿತಾಯ ₹87,500 | RD ₹1,03,000 | FD ₹38,500 | Home Loan ಬಾಕಿ ₹18,50,000. ಒಟ್ಟು Portfolio: ₹1,41,500. ಮಾಸಿಕ ವೇತನ ₹65,000, ಉಳಿತಾಯ ₹17,300. ಖಾತೆಗಳು ಟ್ಯಾಬ್ (🏦) ನಲ್ಲಿ ಪೂರ್ಣ ವಿವರ ನೋಡಿ."
    },
    bills: {
      hi: "Rajesh ji, aapke upcoming bills:\n• Home Loan EMI: ₹18,000 (5 Jul)\n• HDFC Car Loan: ₹8,500 (7 Jul)\n• Credit Cards: ₹8,200 (3 cards — 10-15 Jul)\n• Mobile/WiFi: ₹2,047 (12-15 Jul)\n• Electricity/Water/Gas: ₹2,550 (18-22 Jul)\n• Society Maintenance: ₹3,500 (1 Jul)\n\nTotal is mahine: ₹44,797. Surplus ke baad ₹20,203 bachega.",
      en: "Rajesh, here are your upcoming bills:\n• Home Loan EMI: ₹18,000 (5 Jul)\n• HDFC Car Loan: ₹8,500 (7 Jul)\n• Credit Cards: ₹8,200 (3 cards — 10-15 Jul)\n• Mobile/WiFi: ₹2,047 (12-15 Jul)\n• Electricity/Water/Gas: ₹2,550 (18-22 Jul)\n• Society Maintenance: ₹3,500 (1 Jul)\n\nTotal this month: ₹44,797. After bills, ₹20,203 remains.",
      kn: "ರಾಜೇಶ್, ನಿಮ್ಮ ಮುಂಬರುವ ಬಿಲ್‌ಗಳು:\n• Home Loan EMI: ₹18,000 (5 Jul)\n• HDFC Car Loan: ₹8,500 (7 Jul)\n• Credit Cards: ₹8,200 (3 ಕಾರ್ಡ್ — 10-15 Jul)\n• Mobile/WiFi: ₹2,047 (12-15 Jul)\n• Electricity/Water/Gas: ₹2,550 (18-22 Jul)\n• Society Maintenance: ₹3,500 (1 Jul)\n\nಈ ತಿಂಗಳ ಒಟ್ಟು: ₹44,797. ಬಿಲ್ ನಂತರ ₹20,203 ಉಳಿಯುತ್ತದೆ."
    },
    income: {
      hi: "Rajesh ji, aapki income sources:\n• IDBI Salary: ₹65,000/month\n• Other income: Aapne jo bhi add kiya hai woh Accounts → 'My Other Income' mein dekh sakte hain.\n\nAgar koi aur income hai (dukaan, kiraya, freelance) toh Accounts page pe '+ Add Income' se add karein — Seva uska bhi hisaab rakhega!",
      en: "Rajesh, your income sources:\n• IDBI Salary: ₹65,000/month\n• Other income: You can view everything you've added in Accounts → 'My Other Income'.\n\nIf you have more income (shop, rent, freelance), add it via '+ Add Income' on the Accounts page — Seva will factor it into your planning!",
      kn: "ರಾಜೇಶ್, ನಿಮ್ಮ ಆದಾಯ ಮೂಲಗಳು:\n• IDBI ವೇತನ: ₹65,000/ತಿಂಗಳು\n• ಇತರ ಆದಾಯ: ನೀವು ಸೇರಿಸಿದ ಎಲ್ಲವನ್ನೂ ಖಾತೆಗಳು → 'ನನ್ನ ಇತರ ಆದಾಯ' ನಲ್ಲಿ ನೋಡಬಹುದು.\n\nಇನ್ನೂ ಆದಾಯ ಇದ್ದರೆ (ಅಂಗಡಿ, ಬಾಡಿಗೆ, ಫ್ರೀಲ್ಯಾನ್ಸ್), ಖಾತೆಗಳು ಪುಟದಲ್ಲಿ '+ ಆದಾಯ ಸೇರಿಸಿ' ಮೂಲಕ ಸೇರಿಸಿ!"
    },
    insurance: {
      hi: "Rajesh ji, aapki insurance status:\n• Health Insurance: IDBI Federal ₹5L cover (active ✓)\n• Term Life: ❌ Nahi hai — 4 family members ke liye zaroor lein (₹1Cr cover ~₹700/month)\n• Vehicle: ❌ Missing\n\nHealth cover hai, lekin Term Life nahi hona risky hai. Products tab pe IDBI Term Life dekhein.",
      en: "Rajesh, your insurance status:\n• Health Insurance: IDBI Federal ₹5L cover (active ✓)\n• Term Life: ❌ Not available — critical with 4 family members (₹1Cr cover ~₹700/month)\n• Vehicle: ❌ Missing\n\nHealth cover exists, but missing Term Life is risky. Check Products tab for IDBI Term Life.",
      kn: "ರಾಜೇಶ್, ನಿಮ್ಮ ವಿಮೆ ಸ್ಥಿತಿ:\n• Health Insurance: IDBI Federal ₹5L ಕವರ್ (ಸಕ್ರಿಯ ✓)\n• Term Life: ❌ ಇಲ್ಲ — 4 ಕುಟುಂಬ ಸದಸ್ಯರಿಗೆ ಖಂಡಿತ ಬೇಕು (₹1Cr cover ~₹700/ತಿಂಗಳು)\n• Vehicle: ❌ ಇಲ್ಲ\n\nHealth cover ಇದೆ, ಆದರೆ Term Life ಇಲ್ಲದಿರುವುದು ಅಪಾಯಕಾರಿ. ಉತ್ಪನ್ನಗಳ ಟ್ಯಾಬ್‌ನಲ್ಲಿ IDBI Term Life ನೋಡಿ."
    },
    creditScore: {
      hi: "Rajesh ji, aapka Credit Score 742/900 hai — 'Good' category. 750+ ke liye:\n• EMI samay pe dete rahein (✓ 3 months done)\n• Credit card lein (credit mix improve hoga, +15-20 points)\n• Naye loan applications avoid karein\n\n8 points aur badhne se 'Excellent' category mein aa jayenge!",
      en: "Rajesh, your Credit Score is 742/900 — 'Good' category. To reach 750+:\n• Continue on-time EMI payments (✓ 3 months done)\n• Get a credit card (improves credit mix, +15-20 points)\n• Avoid new loan applications\n\nJust 8 more points and you'll be in 'Excellent' category!",
      kn: "ರಾಜೇಶ್, ನಿಮ್ಮ Credit Score 742/900 — 'Good' ವಿಭಾಗ. 750+ ತಲುಪಲು:\n• EMI ಸಮಯಕ್ಕೆ ಪಾವತಿ ಮುಂದುವರಿಸಿ (✓ 3 ತಿಂಗಳು ಆಗಿದೆ)\n• Credit card ತೆಗೆದುಕೊಳ್ಳಿ (credit mix ಸುಧಾರಿಸುತ್ತದೆ, +15-20 ಅಂಕ)\n• ಹೊಸ ಸಾಲ ಅರ್ಜಿ ಬೇಡ\n\nಇನ್ನು 8 ಅಂಕ ಹೆಚ್ಚಾದರೆ 'Excellent' ವಿಭಾಗ!"
    },
    products: {
      hi: "Rajesh ji, aapke liye IDBI products available hain:\n• Mutual Fund SIP (₹2,000/month se shuru)\n• Term Life Insurance (₹1Cr cover, ~₹700/month)\n• Health Insurance (₹5L family floater)\n• PPF Account (7.1% tax-free)\n• Personal Loan (pre-approved ₹13L)\n• Credit Card (Imperium — 5X rewards)\n\nProducts tab pe details aur eligibility check karein!",
      en: "Rajesh, IDBI products available for you:\n• Mutual Fund SIP (start from ₹2,000/month)\n• Term Life Insurance (₹1Cr cover, ~₹700/month)\n• Health Insurance (₹5L family floater)\n• PPF Account (7.1% tax-free)\n• Personal Loan (pre-approved ₹13L)\n• Credit Card (Imperium — 5X rewards)\n\nCheck Products tab for details and eligibility!",
      kn: "ರಾಜೇಶ್, ನಿಮಗೆ ಲಭ್ಯವಿರುವ IDBI ಉತ್ಪನ್ನಗಳು:\n• Mutual Fund SIP (₹2,000/ತಿಂಗಳಿಂದ ಶುರು)\n• Term Life Insurance (₹1Cr ಕವರ್, ~₹700/ತಿಂಗಳು)\n• Health Insurance (₹5L ಕುಟುಂಬ ಫ್ಲೋಟರ್)\n• PPF Account (7.1% ತೆರಿಗೆ-ಮುಕ್ತ)\n• Personal Loan (ಪೂರ್ವ-ಅನುಮೋದಿತ ₹13L)\n• Credit Card (Imperium — 5X ರಿವಾರ್ಡ್)\n\nಉತ್ಪನ್ನಗಳ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ವಿವರ ಮತ್ತು ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ!"
    },
    account: {
      hi: "External account link karne ke liye: Niche 'Accounts' (🏦) tab dabayein → '+ Bahari khata jodein' button dabayein → Bank chunein (SBI, HDFC, etc.) → Account type chunein → 'Jodein' dabayein. Yeh RBI-approved safe process hai.",
      en: "To link an external account: Tap 'Accounts' (🏦) tab below → Tap '+ Add External Account' → Select your bank (SBI, HDFC, etc.) → Select account type → Tap 'Link'. This is a secure RBI-approved process.",
      kn: "ಬಾಹ್ಯ ಖಾತೆ ಲಿಂಕ್ ಮಾಡಲು: ಕೆಳಗೆ 'ಖಾತೆಗಳು' (🏦) ಟ್ಯಾಬ್ ಒತ್ತಿ → '+ ಬಾಹ್ಯ ಖಾತೆ ಸೇರಿಸಿ' ಒತ್ತಿ → ಬ್ಯಾಂಕ್ ಆಯ್ಕೆಮಾಡಿ (SBI, HDFC, ಇತ್ಯಾದಿ) → ಖಾತೆ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ → 'ಲಿಂಕ್' ಒತ್ತಿ. ಇದು RBI ಅನುಮೋದಿತ ಸುರಕ್ಷಿತ ಪ್ರಕ್ರಿಯೆ."
    },
    howTo: {
      hi: "Main aapki madad kar sakta hoon! Aap pooch sakte hain: 'Mera balance batao', 'SIP kaise shuru karein', 'Khata kaise jodein', 'Score kaise badhega', 'Kharcha kahan ja raha hai'. Ya niche ke tabs use karein: 🏠 Home, 🏦 Accounts, 🎯 Goals, 💡 Products.",
      en: "I can help you! You can ask: 'Show my balance', 'How to start SIP', 'How to link accounts', 'How to improve score', 'Where is my money going'. Or use the tabs below: 🏠 Home, 🏦 Accounts, 🎯 Goals, 💡 Products.",
      kn: "ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ! ನೀವು ಕೇಳಬಹುದು: 'ನನ್ನ ಬ್ಯಾಲೆನ್ಸ್ ತೋರಿಸಿ', 'SIP ಹೇಗೆ ಶುರು ಮಾಡುವುದು', 'ಖಾತೆ ಹೇಗೆ ಲಿಂಕ್ ಮಾಡುವುದು', 'ಸ್ಕೋರ್ ಹೇಗೆ ಸುಧಾರಿಸುವುದು'. ಅಥವಾ ಕೆಳಗಿನ ಟ್ಯಾಬ್ ಬಳಸಿ: 🏠 ಮುಖಪುಟ, 🏦 ಖಾತೆಗಳು, 🎯 ಗುರಿಗಳು, 💡 ಉತ್ಪನ್ನಗಳು."
    }
  };

  if (lower.includes('paisa') || lower.includes('kharcha') || lower.includes('spend') || lower.includes('money') || lower.includes('going') || lower.includes('where') || lower.includes('expense') || lower.includes('biggest') || lower.includes('highest')) return responses.spending[language] || responses.spending.en;
  if (lower.match(/^(hello|hi|hey|namaste|good morning|good evening)/) || lower.includes('ನಮಸ್ಕಾರ')) return responses.greeting[language] || responses.greeting.en;
  if (lower.match(/^(yes|ok|sure|haan|ha|please|shuru)$/) || lower === 'ಹೌದು') return responses.yesConfirm[language] || responses.yesConfirm.en;
  if (lower.includes('bill') || lower.includes('emi') || lower.includes('due') || lower.includes('payment') || lower.includes('बिल') || lower.includes('ಬಿಲ್')) return responses.bills[language] || responses.bills.en;
  if (lower.includes('income') || lower.includes('earn') || lower.includes('आय') || lower.includes('ಆದಾಯ') || lower.includes('kamai')) return responses.income[language] || responses.income.en;
  if (lower.includes('insurance') || lower.includes('बीमा') || lower.includes('ವಿಮೆ') || lower.includes('cover') || lower.includes('policy')) return responses.insurance[language] || responses.insurance.en;
  if (lower.includes('credit') || lower.includes('cibil') || lower.includes('क्रेडिट') || lower.includes('ಕ್ರೆಡಿಟ್')) return responses.creditScore[language] || responses.creditScore.en;
  if (lower.includes('product') || lower.includes('loan') || lower.includes('card') || lower.includes('उत्पाद') || lower.includes('ಉತ್ಪನ್ನ')) return responses.products[language] || responses.products.en;
  if (lower.includes('balance') || lower.includes('kitna') || lower.includes('how much') || lower.includes('total')) return responses.balance[language] || responses.balance.en;
  if (lower.includes('sip') || lower.includes('mutual') || lower.includes('invest')) return responses.sip[language] || responses.sip.en;
  if (lower.includes('score') || lower.includes('improve') || lower.includes('badh') || lower.includes('health')) return responses.score[language] || responses.score.en;
  if (lower.includes('emergency') || lower.includes('fund')) return responses.emergency[language] || responses.emergency.en;
  if (lower.includes('retire') || lower.includes('pension')) return responses.retirement[language] || responses.retirement.en;
  if (lower.includes('account') || lower.includes('link') || lower.includes('add') || lower.includes('connect') || lower.includes('external')) return responses.account[language] || responses.account.en;
  if (lower.includes('how') || lower.includes('help') || lower.includes('use') || lower.includes('kaise') || lower.includes('ಹೇಗೆ')) return responses.howTo[language] || responses.howTo.en;
  return responses.default[language] || responses.default.en;
}

module.exports = { getSevaResponse };
