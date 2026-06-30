// Self-serve help content for each feature, in all 3 languages.
// Financial terms (SIP, EMI, PPF, FD, Portfolio) stay in English.

const helpContent = {
  dashboard: {
    title: {
      hi: 'डैशबोर्ड कैसे उपयोग करें',
      en: 'How to Use the Dashboard',
      kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಹೇಗೆ ಬಳಸುವುದು'
    },
    steps: {
      hi: [
        'स्वास्थ्य स्कोर आपकी कुल आर्थिक स्थिति दिखाता है (0-100)',
        'स्कोर के नीचे 5 उप-स्कोर हैं — हर एक बताता है कहाँ सुधार चाहिए',
        'नीचे 4 कार्ड हैं: मासिक बचत, सबसे बड़ा खर्चा, Portfolio मूल्य, अगला लक्ष्य',
        'सूचना आने पर "हाँ, करो" दबाकर SIP शुरू कर सकते हैं',
        'नीचे के टैब से अन्य पेज पर जाएं'
      ],
      en: [
        'The health score shows your overall financial wellness (0-100)',
        'Below the score are 5 sub-scores — each tells you where to improve',
        'The 4 cards show: Monthly Surplus, Largest Spend, Portfolio Value, Next Milestone',
        'When a notification appears, tap "Yes, Do It" to start a SIP instantly',
        'Use the bottom tabs to navigate to other sections'
      ],
      kn: [
        'ಆರೋಗ್ಯ ಸ್ಕೋರ್ ನಿಮ್ಮ ಒಟ್ಟಾರೆ ಆರ್ಥಿಕ ಸ್ಥಿತಿಯನ್ನು ತೋರಿಸುತ್ತದೆ (0-100)',
        'ಸ್ಕೋರ್ ಕೆಳಗೆ 5 ಉಪ-ಸ್ಕೋರ್‌ಗಳಿವೆ — ಪ್ರತಿಯೊಂದೂ ಎಲ್ಲಿ ಸುಧಾರಿಸಬೇಕೆಂದು ಹೇಳುತ್ತದೆ',
        'ಕೆಳಗಿನ 4 ಕಾರ್ಡ್‌ಗಳು: ಮಾಸಿಕ ಉಳಿತಾಯ, ಅತಿ ಹೆಚ್ಚು ಖರ್ಚು, Portfolio ಮೌಲ್ಯ, ಮುಂದಿನ ಗುರಿ',
        'ಸೂಚನೆ ಬಂದಾಗ "ಹೌದು, ಮಾಡಿ" ಒತ್ತಿದರೆ SIP ತಕ್ಷಣ ಶುರು ಆಗುತ್ತದೆ',
        'ಕೆಳಗಿನ ಟ್ಯಾಬ್‌ಗಳಿಂದ ಇತರ ವಿಭಾಗಗಳಿಗೆ ಹೋಗಿ'
      ]
    }
  },
  chat: {
    title: {
      hi: 'Seva से बात कैसे करें',
      en: 'How to Chat with Seva',
      kn: 'Seva ಜೊತೆ ಮಾತನಾಡುವುದು ಹೇಗೆ'
    },
    steps: {
      hi: [
        'नीचे के बॉक्स में अपना सवाल टाइप करें — हिंदी या अंग्रेज़ी में',
        'या ऊपर दिए सुझाव बटन दबाएं — Seva तुरंत जवाब देगा',
        'Seva आपके असली आँकड़ों के आधार पर सलाह देता है',
        'आप खर्चा, बचत, SIP, लक्ष्य, बीमा — कुछ भी पूछ सकते हैं',
        'Seva कभी कोई विशेष शेयर या क्रिप्टो की सलाह नहीं देगा'
      ],
      en: [
        'Type your question in the input box below — in any language',
        'Or tap the quick suggestion buttons above — Seva responds instantly',
        'Seva gives advice based on your actual financial data',
        'You can ask about spending, savings, SIP, goals, insurance — anything',
        'Seva will never recommend specific stocks or crypto'
      ],
      kn: [
        'ಕೆಳಗಿನ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ — ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ',
        'ಅಥವಾ ಮೇಲಿನ ಸಲಹೆ ಬಟನ್ ಒತ್ತಿ — Seva ತಕ್ಷಣ ಉತ್ತರಿಸುತ್ತಾರೆ',
        'Seva ನಿಮ್ಮ ನಿಜವಾದ ಆರ್ಥಿಕ ಡೇಟಾ ಆಧಾರದ ಮೇಲೆ ಸಲಹೆ ನೀಡುತ್ತಾರೆ',
        'ನೀವು ಖರ್ಚು, ಉಳಿತಾಯ, SIP, ಗುರಿಗಳು, ವಿಮೆ — ಏನು ಬೇಕಾದರೂ ಕೇಳಬಹುದು',
        'Seva ಯಾವತ್ತೂ ನಿರ್ದಿಷ್ಟ ಷೇರು ಅಥವಾ ಕ್ರಿಪ್ಟೋ ಶಿಫಾರಸು ಮಾಡುವುದಿಲ್ಲ'
      ]
    }
  },
  spending: {
    title: {
      hi: 'खर्चा विश्लेषण कैसे समझें',
      en: 'How to Read Spending Insights',
      kn: 'ಖರ್ಚು ವಿಶ್ಲೇಷಣೆ ಹೇಗೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು'
    },
    steps: {
      hi: [
        'गोल चार्ट आपके मासिक खर्चे की श्रेणियाँ दिखाता है',
        'रेखा चार्ट 6 महीनों का रुझान दिखाता है — कहाँ खर्चा बढ़ा/घटा',
        'नीचे स्क्रॉल करें — "ध्यान दें" कार्ड बताता है कहाँ ज़्यादा खर्च हो रहा है',
        '"अच्छा किया" कार्ड आपकी अच्छी आदतों को दिखाता है',
        '"अवसर" कार्ड बताता है कि बचत से क्या-क्या हो सकता है'
      ],
      en: [
        'The donut chart shows your monthly spending by category',
        'The line chart shows 6-month trends — where spending rose or fell',
        'Scroll sideways — the "Attention" card highlights overspending areas',
        'The "Great Job" card celebrates your good financial habits',
        'The "Opportunity" card shows what your savings could grow into'
      ],
      kn: [
        'ವೃತ್ತ ಚಾರ್ಟ್ ನಿಮ್ಮ ಮಾಸಿಕ ಖರ್ಚನ್ನು ವಿಭಾಗವಾರು ತೋರಿಸುತ್ತದೆ',
        'ರೇಖಾ ಚಾರ್ಟ್ 6 ತಿಂಗಳ ಪ್ರವೃತ್ತಿ ತೋರಿಸುತ್ತದೆ — ಎಲ್ಲಿ ಖರ್ಚು ಹೆಚ್ಚಾಯಿತು/ಕಡಿಮೆಯಾಯಿತು',
        'ಪಕ್ಕಕ್ಕೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ — "ಗಮನ" ಕಾರ್ಡ್ ಅಧಿಕ ಖರ್ಚಿನ ಕ್ಷೇತ್ರಗಳನ್ನು ತೋರಿಸುತ್ತದೆ',
        '"ಉತ್ತಮ ಕೆಲಸ" ಕಾರ್ಡ್ ನಿಮ್ಮ ಒಳ್ಳೆಯ ಆರ್ಥಿಕ ಅಭ್ಯಾಸಗಳನ್ನು ಶ್ಲಾಘಿಸುತ್ತದೆ',
        '"ಅವಕಾಶ" ಕಾರ್ಡ್ ನಿಮ್ಮ ಉಳಿತಾಯ ಹೇಗೆ ಬೆಳೆಯಬಹುದು ಎಂದು ತೋರಿಸುತ್ತದೆ'
      ]
    }
  },
  goals: {
    title: {
      hi: 'लक्ष्य कैसे प्रबंधित करें',
      en: 'How to Manage Your Goals',
      kn: 'ಗುರಿಗಳನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸುವುದು'
    },
    steps: {
      hi: [
        'हर कार्ड एक आर्थिक लक्ष्य दिखाता है — लक्ष्य राशि और प्रगति',
        'प्रगति बार दिखाता है कितना पूरा हुआ है (% में)',
        '"ज़रूरी SIP" बताता है हर महीने कितना निवेश करना चाहिए',
        'Seva की टिप्पणी बताती है लक्ष्य कैसे पूरा करें',
        'बटन दबाकर SIP शुरू करें या PPF खाता खोलें',
        'नीचे "+ नया सपना जोड़ें" से नया लक्ष्य बनाएं'
      ],
      en: [
        'Each card shows a financial goal — target amount and progress',
        'The progress bar shows how much is completed (in %)',
        '"Required SIP" tells you how much to invest monthly',
        'Seva\'s comment gives personalized advice to reach the goal',
        'Tap the button to start SIP or open a PPF account',
        'Tap "+ Add New Goal" at the bottom to create a new goal'
      ],
      kn: [
        'ಪ್ರತಿ ಕಾರ್ಡ್ ಒಂದು ಆರ್ಥಿಕ ಗುರಿ ತೋರಿಸುತ್ತದೆ — ಗುರಿ ಮೊತ್ತ ಮತ್ತು ಪ್ರಗತಿ',
        'ಪ್ರಗತಿ ಬಾರ್ ಎಷ್ಟು ಪೂರ್ಣವಾಗಿದೆ ಎಂದು ತೋರಿಸುತ್ತದೆ (% ನಲ್ಲಿ)',
        '"ಅಗತ್ಯ SIP" ಪ್ರತಿ ತಿಂಗಳು ಎಷ್ಟು ಹೂಡಿಕೆ ಮಾಡಬೇಕೆಂದು ಹೇಳುತ್ತದೆ',
        'Seva ನ ಸಲಹೆ ಗುರಿ ತಲುಪಲು ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ',
        'ಬಟನ್ ಒತ್ತಿ SIP ಶುರು ಮಾಡಿ ಅಥವಾ PPF ಖಾತೆ ತೆರೆಯಿರಿ',
        'ಕೆಳಗೆ "+ ಹೊಸ ಕನಸು ಸೇರಿಸಿ" ಒತ್ತಿ ಹೊಸ ಗುರಿ ರಚಿಸಿ'
      ]
    }
  },
  products: {
    title: {
      hi: 'उत्पाद सिफारिशें कैसे समझें',
      en: 'How to Use Product Recommendations',
      kn: 'ಉತ್ಪನ್ನ ಶಿಫಾರಸುಗಳನ್ನು ಹೇಗೆ ಬಳಸುವುದು'
    },
    steps: {
      hi: [
        'हर कार्ड एक IDBI उत्पाद है जो आपकी ज़रूरतों से मेल खाता है',
        'रंगीन बैज प्राथमिकता दिखाता है — नारंगी = तत्काल, हरा = उच्च',
        'कारण बताता है यह उत्पाद आपके लिए क्यों सही है',
        '"अपेक्षित लाभ" बताता है आपको क्या मिलेगा',
        'बटन दबाने पर अनुरोध भेजा जाता है — बैंक टीम संपर्क करेगी',
        'यह सिर्फ सूचनात्मक है — अंतिम निर्णय आपका है'
      ],
      en: [
        'Each card is an IDBI product matched to your financial needs',
        'The colored badge shows priority — orange = urgent, green = high',
        'The reason explains why this product is right for YOU specifically',
        '"Expected benefit" shows what you will get from this product',
        'Tapping the button sends a request — bank team will contact you',
        'This is informational only — the final decision is always yours'
      ],
      kn: [
        'ಪ್ರತಿ ಕಾರ್ಡ್ ನಿಮ್ಮ ಆರ್ಥಿಕ ಅಗತ್ಯಗಳಿಗೆ ಹೊಂದಿಕೊಳ್ಳುವ IDBI ಉತ್ಪನ್ನವಾಗಿದೆ',
        'ಬಣ್ಣದ ಬ್ಯಾಡ್ಜ್ ಆದ್ಯತೆ ತೋರಿಸುತ್ತದೆ — ಕಿತ್ತಳೆ = ತುರ್ತು, ಹಸಿರು = ಹೆಚ್ಚು',
        'ಕಾರಣ ಈ ಉತ್ಪನ್ನ ನಿಮಗೆ ಏಕೆ ಸರಿ ಎಂದು ವಿವರಿಸುತ್ತದೆ',
        '"ನಿರೀಕ್ಷಿತ ಲಾಭ" ನಿಮಗೆ ಏನು ಸಿಗುತ್ತದೆ ಎಂದು ತೋರಿಸುತ್ತದೆ',
        'ಬಟನ್ ಒತ್ತಿದರೆ ವಿನಂತಿ ಕಳುಹಿಸಲಾಗುತ್ತದೆ — ಬ್ಯಾಂಕ್ ತಂಡ ಸಂಪರ್ಕಿಸುತ್ತದೆ',
        'ಇದು ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ — ಅಂತಿಮ ನಿರ್ಧಾರ ಯಾವಾಗಲೂ ನಿಮ್ಮದು'
      ]
    }
  }
};

const contactInfo = {
  title: {
    hi: 'और सहायता चाहिए?',
    en: 'Still need help?',
    kn: 'ಇನ್ನೂ ಸಹಾಯ ಬೇಕೇ?'
  },
  subtitle: {
    hi: 'अगर आपको और मदद चाहिए, हमारी टीम से संपर्क करें:',
    en: 'If you need further assistance, contact our team:',
    kn: 'ನಿಮಗೆ ಇನ್ನೂ ಸಹಾಯ ಬೇಕಾದರೆ, ನಮ್ಮ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ:'
  },
  phone: '1800-209-4324',
  phoneLabel: {
    hi: 'कॉल करें (निःशुल्क)',
    en: 'Call (Toll-Free)',
    kn: 'ಕರೆ ಮಾಡಿ (ಉಚಿತ)'
  },
  email: 'customercare@idbi.co.in',
  emailLabel: {
    hi: 'ईमेल करें',
    en: 'Send Email',
    kn: 'ಇಮೇಲ್ ಕಳುಹಿಸಿ'
  },
  hours: {
    hi: 'सोम-शनि, सुबह 9 बजे - रात 9 बजे',
    en: 'Mon-Sat, 9 AM - 9 PM',
    kn: 'ಸೋಮ-ಶನಿ, ಬೆಳಿಗ್ಗೆ 9 - ರಾತ್ರಿ 9'
  }
};

export { helpContent, contactInfo, featureGuides };

const featureGuides = {
  dashboard: {
    icon: '🏠',
    path: '/',
    title: helpContent.dashboard.title,
    keywords: {
      hi: ['स्कोर', 'डैशबोर्ड', 'बचत', 'कार्ड', 'सूचना'],
      en: ['score', 'dashboard', 'surplus', 'cards', 'notification', 'health'],
      kn: ['ಸ್ಕೋರ್', 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', 'ಉಳಿತಾಯ', 'ಕಾರ್ಡ್', 'ಸೂಚನೆ']
    },
    steps: helpContent.dashboard.steps,
    tips: {
      hi: [
        '70+ स्कोर का मतलब है आप अच्छी स्थिति में हैं!',
        'लाल रंग = तत्काल ध्यान दें, हरा = अच्छा कर रहे हैं',
        null,
        'SIP शुरू करने पर स्कोर तुरंत बढ़ता है',
        null
      ],
      en: [
        '70+ score means you are in good financial shape!',
        'Red = needs urgent attention, Green = doing well',
        null,
        'Starting a SIP immediately boosts your score',
        null
      ],
      kn: [
        '70+ ಸ್ಕೋರ್ ಎಂದರೆ ನಿಮ್ಮ ಆರ್ಥಿಕ ಸ್ಥಿತಿ ಉತ್ತಮವಾಗಿದೆ!',
        'ಕೆಂಪು = ತಕ್ಷಣ ಗಮನ ಬೇಕು, ಹಸಿರು = ಚೆನ್ನಾಗಿದೆ',
        null,
        'SIP ಶುರು ಮಾಡಿದರೆ ಸ್ಕೋರ್ ತಕ್ಷಣ ಹೆಚ್ಚಾಗುತ್ತದೆ',
        null
      ]
    }
  },
  chat: {
    icon: '💬',
    path: '/chat',
    title: helpContent.chat.title,
    keywords: {
      hi: ['चैट', 'बात', 'Seva', 'पूछें', 'सवाल', 'सलाह'],
      en: ['chat', 'talk', 'seva', 'ask', 'question', 'advice', 'avatar'],
      kn: ['ಚಾಟ್', 'ಮಾತು', 'Seva', 'ಕೇಳಿ', 'ಪ್ರಶ್ನೆ', 'ಸಲಹೆ']
    },
    steps: helpContent.chat.steps,
    tips: {
      hi: [
        'आप हिंदी, अंग्रेज़ी या कन्नड — किसी भी भाषा में पूछ सकते हैं',
        'सुझाव बटन सबसे आम सवालों के लिए हैं — एक क्लिक में जवाब',
        null,
        'Seva आपकी गोपनीयता का ध्यान रखता है — डेटा सुरक्षित है',
        null
      ],
      en: [
        'You can ask in Hindi, English, or Kannada — Seva understands all',
        'Quick buttons are for the most common questions — one tap answers',
        null,
        'Seva respects your privacy — your data stays secure',
        null
      ],
      kn: [
        'ನೀವು ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಬಹುದು — Seva ಎಲ್ಲವನ್ನೂ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತಾರೆ',
        'ಶೀಘ್ರ ಬಟನ್‌ಗಳು ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ — ಒಂದೇ ಟ್ಯಾಪ್‌ನಲ್ಲಿ ಉತ್ತರ',
        null,
        'Seva ನಿಮ್ಮ ಗೌಪ್ಯತೆಯನ್ನು ಗೌರಿವಿಸುತ್ತಾರೆ — ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತವಾಗಿದೆ',
        null
      ]
    }
  },
  spending: {
    icon: '📊',
    path: '/spending',
    title: helpContent.spending.title,
    keywords: {
      hi: ['खर्चा', 'खर्च', 'चार्ट', 'विश्लेषण', 'श्रेणी', 'रुझान'],
      en: ['spending', 'chart', 'analysis', 'category', 'trend', 'money', 'expense'],
      kn: ['ಖರ್ಚು', 'ಚಾರ್ಟ್', 'ವಿಶ್ಲೇಷಣೆ', 'ವಿಭಾಗ', 'ಪ್ರವೃತ್ತಿ', 'ಹಣ']
    },
    steps: helpContent.spending.steps,
    tips: {
      hi: [
        'सबसे बड़ा हिस्सा वह श्रेणी है जहाँ सबसे ज़्यादा खर्च होता है',
        'अगर कोई रेखा ऊपर जा रही है, उस श्रेणी में खर्चा बढ़ रहा है',
        'इस जानकारी से आप तय कर सकते हैं कहाँ कम करना है',
        null,
        null
      ],
      en: [
        'The biggest slice is the category where you spend the most',
        'If a line goes up, spending in that category is increasing',
        'Use this info to decide where to cut back',
        null,
        null
      ],
      kn: [
        'ಅತಿ ದೊಡ್ಡ ಭಾಗ ನೀವು ಅತಿ ಹೆಚ್ಚು ಖರ್ಚು ಮಾಡುವ ವಿಭಾಗ',
        'ರೇಖೆ ಮೇಲಕ್ಕೆ ಹೋದರೆ, ಆ ವಿಭಾಗದಲ್ಲಿ ಖರ್ಚು ಹೆಚ್ಚಾಗುತ್ತಿದೆ',
        'ಈ ಮಾಹಿತಿ ಬಳಸಿ ಎಲ್ಲಿ ಕಡಿಮೆ ಮಾಡಬೇಕೆಂದು ನಿರ್ಧರಿಸಿ',
        null,
        null
      ]
    }
  },
  goals: {
    icon: '🎯',
    path: '/goals',
    title: helpContent.goals.title,
    keywords: {
      hi: ['लक्ष्य', 'सपना', 'SIP', 'शिक्षा', 'सेवानिवृत्ति', 'आपातकालीन'],
      en: ['goals', 'dream', 'SIP', 'education', 'retirement', 'emergency', 'target'],
      kn: ['ಗುರಿ', 'ಕನಸು', 'SIP', 'ಶಿಕ್ಷಣ', 'ನಿವೃತ್ತಿ', 'ತುರ್ತು']
    },
    steps: helpContent.goals.steps,
    tips: {
      hi: [
        'हर लक्ष्य के लिए एक निश्चित समय और राशि तय करें',
        'हरा बार = अच्छी प्रगति, नारंगी = और निवेश करें',
        'SIP राशि कंपाउंड इंटरेस्ट के साथ गणना की गई है',
        null,
        'एक बटन दबाने से बैंक से संपर्क हो जाएगा',
        null
      ],
      en: [
        'Set a specific time and amount for each goal',
        'Green bar = good progress, Orange = invest more',
        'SIP amount is calculated with compound interest',
        null,
        'One tap connects you with the bank for setup',
        null
      ],
      kn: [
        'ಪ್ರತಿ ಗುರಿಗೆ ನಿರ್ದಿಷ್ಟ ಸಮಯ ಮತ್ತು ಮೊತ್ತ ನಿಗದಿಪಡಿಸಿ',
        'ಹಸಿರು ಬಾರ್ = ಒಳ್ಳೆಯ ಪ್ರಗತಿ, ಕಿತ್ತಳೆ = ಇನ್ನೂ ಹೂಡಿಕೆ ಮಾಡಿ',
        'SIP ಮೊತ್ತ ಸಂಯುಕ್ತ ಬಡ್ಡಿಯೊಂದಿಗೆ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
        null,
        'ಒಂದು ಟ್ಯಾಪ್ ಮಾಡಿದರೆ ಬ್ಯಾಂಕ್ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ',
        null
      ]
    }
  },
  products: {
    icon: '💡',
    path: '/products',
    title: helpContent.products.title,
    keywords: {
      hi: ['उत्पाद', 'सिफारिश', 'SIP', 'बीमा', 'PPF', 'FD'],
      en: ['product', 'recommendation', 'SIP', 'insurance', 'PPF', 'FD', 'invest'],
      kn: ['ಉತ್ಪನ್ನ', 'ಶಿಫಾರಸು', 'SIP', 'ವಿಮೆ', 'PPF', 'FD', 'ಹೂಡಿಕೆ']
    },
    steps: helpContent.products.steps,
    tips: {
      hi: [
        'ये सिफारिशें आपकी Portfolio की कमियों पर आधारित हैं',
        'तत्काल = अभी ध्यान दें, उच्च = जल्दी करें, मध्यम = जब तैयार हों',
        null,
        null,
        'अनुरोध भेजने के बाद 24 घंटे में टीम संपर्क करेगी',
        'यह सिर्फ जानकारी है — कोई भी खरीद आपकी मंज़ूरी बिना नहीं होगी'
      ],
      en: [
        'These recommendations are based on gaps in your Portfolio',
        'Urgent = act now, High = do soon, Medium = when ready',
        null,
        null,
        'After sending request, team will contact within 24 hours',
        'This is informational — no purchase happens without your approval'
      ],
      kn: [
        'ಈ ಶಿಫಾರಸುಗಳು ನಿಮ್ಮ Portfolio ನ ಕೊರತೆಗಳ ಆಧಾರದ ಮೇಲೆ ಇವೆ',
        'ತುರ್ತು = ಈಗಲೇ ಕ್ರಮ ತೆಗೆದುಕೊಳ್ಳಿ, ಹೆಚ್ಚು = ಶೀಘ್ರ ಮಾಡಿ, ಮಧ್ಯಮ = ಸಿದ್ಧರಾದಾಗ',
        null,
        null,
        'ವಿನಂತಿ ಕಳುಹಿಸಿದ ನಂತರ 24 ಗಂಟೆಯಲ್ಲಿ ತಂಡ ಸಂಪರ್ಕಿಸುತ್ತದೆ',
        'ಇದು ಮಾಹಿತಿ ಮಾತ್ರ — ನಿಮ್ಮ ಒಪ್ಪಿಗೆ ಇಲ್ಲದೆ ಯಾವುದೇ ಖರೀದಿ ಆಗುವುದಿಲ್ಲ'
      ]
    }
  }
};
