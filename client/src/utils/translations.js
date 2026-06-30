// All UI strings in 3 languages.
// ONLY real financial terms stay in English: SIP, EMI, PPF, FD, MF, NPS, Portfolio, Credit Score

const translations = {
  // Login Page
  login_tagline: {
    hi: 'आपका निजी संपत्ति सलाहकार, 24/7',
    en: 'Your Personal Wealth Advisor, 24/7',
    kn: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಸಂಪತ್ತು ಸಲಹೆಗಾರ, 24/7'
  },
  login_powered_by: {
    hi: 'WealthSeva AI × AWS Bedrock द्वारा संचालित',
    en: 'Powered by WealthSeva AI × AWS Bedrock',
    kn: 'WealthSeva AI × AWS Bedrock ನಿಂದ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ'
  },
  login_customer_id: {
    hi: 'ग्राहक आईडी',
    en: 'Customer ID',
    kn: 'ಗ್ರಾಹಕ ಐಡಿ'
  },
  login_pin: {
    hi: 'पिन',
    en: 'PIN',
    kn: 'ಪಿನ್'
  },
  login_button: {
    hi: 'लॉगिन करें',
    en: 'Login',
    kn: 'ಲಾಗಿನ್ ಮಾಡಿ'
  },
  login_select_language: {
    hi: 'भाषा चुनें',
    en: 'Select Language',
    kn: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ'
  },

  // Header
  greeting: {
    hi: 'नमस्ते, {name} जी 👋',
    en: 'Hello, {name} 👋',
    kn: 'ನಮಸ್ಕಾರ, {name} 👋'
  },
  salary_credited: {
    hi: '✓ 3 दिन पहले वेतन जमा हुआ',
    en: '✓ Salary credited 3 days ago',
    kn: '✓ 3 ದಿನ ಹಿಂದೆ ವೇತನ ಜಮಾ ಆಗಿದೆ'
  },

  // Dashboard
  wealth_vitals_title: {
    hi: 'आर्थिक स्वास्थ्य स्कोर',
    en: 'Financial Health Score',
    kn: 'ಆರ್ಥಿಕ ಆರೋಗ್ಯ ಸ್ಕೋರ್'
  },
  monthly_surplus: {
    hi: 'मासिक बचत',
    en: 'Monthly Surplus',
    kn: 'ಮಾಸಿಕ ಉಳಿತಾಯ'
  },
  largest_spend: {
    hi: 'सबसे बड़ा खर्चा',
    en: 'Largest Spend',
    kn: 'ಅತಿ ಹೆಚ್ಚು ಖರ್ಚು'
  },
  food_delivery: {
    hi: 'खाना डिलीवरी',
    en: 'Food Delivery',
    kn: 'ಆಹಾರ ಡೆಲಿವರಿ'
  },
  portfolio_value: {
    hi: 'Portfolio मूल्य',
    en: 'Portfolio Value',
    kn: 'Portfolio ಮೌಲ್ಯ'
  },
  next_milestone: {
    hi: 'आपातकालीन निधि 4 महीने में',
    en: 'Emergency Fund in 4 months',
    kn: 'ತುರ್ತು ನಿಧಿ 4 ತಿಂಗಳಲ್ಲಿ'
  },
  seva_comment: {
    hi: 'आपका स्कोर इस महीने 4 अंक बढ़ा! Mutual Fund शुरू करने से स्कोर और बेहतर होगा।',
    en: 'Your score improved by 4 points this month! Starting a Mutual Fund will improve it further.',
    kn: 'ನಿಮ್ಮ ಸ್ಕೋರ್ ಈ ತಿಂಗಳು 4 ಅಂಕ ಹೆಚ್ಚಾಗಿದೆ! Mutual Fund ಶುರು ಮಾಡಿದರೆ ಸ್ಕೋರ್ ಇನ್ನೂ ಉತ್ತಮವಾಗುತ್ತದೆ.'
  },

  // Nudge
  nudge_title: {
    hi: 'Seva की याद',
    en: "Seva's Reminder",
    kn: 'Seva ನ ನೆನಪು'
  },
  nudge_message: {
    hi: 'राजेश जी, 3 दिन पहले वेतन आया। ₹5,000 SIP में आज निवेश करें?',
    en: 'Rajesh, your salary came 3 days ago. Auto-invest ₹5,000 in SIP today?',
    kn: 'ರಾಜೇಶ್, 3 ದಿನ ಹಿಂದೆ ವೇತನ ಬಂದಿದೆ. ₹5,000 SIP ನಲ್ಲಿ ಇಂದು ಹೂಡಿಕೆ ಮಾಡೋಣವೇ?'
  },
  nudge_accept: {
    hi: 'हाँ, करो',
    en: 'Yes, Do It',
    kn: 'ಹೌದು, ಮಾಡಿ'
  },
  nudge_dismiss: {
    hi: 'बाद में',
    en: 'Later',
    kn: 'ನಂತರ'
  },
  nudge_success: {
    hi: 'SIP निर्धारित! हर महीने 5 तारीख को ₹5,000 निवेश होगा।',
    en: 'SIP Scheduled! ₹5,000 will be invested on 5th every month.',
    kn: 'SIP ನಿಗದಿಯಾಗಿದೆ! ₹5,000 ಪ್ರತಿ ತಿಂಗಳ 5 ನೇ ತಾರೀಖು ಹೂಡಿಕೆ ಆಗುತ್ತದೆ.'
  },

  // Chat
  chat_placeholder: {
    hi: 'यहाँ टाइप करें...',
    en: 'Type here...',
    kn: 'ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
  },
  chat_empty: {
    hi: 'Seva से कुछ भी पूछें — खर्चा, बचत, लक्ष्य, या उत्पादों के बारे में!',
    en: 'Ask Seva anything — about spending, savings, goals, or products!',
    kn: 'Seva ಅನ್ನು ಏನು ಬೇಕಾದರೂ ಕೇಳಿ — ಖರ್ಚು, ಉಳಿತಾಯ, ಗುರಿಗಳು, ಅಥವಾ ಉತ್ಪನ್ನಗಳ ಬಗ್ಗೆ!'
  },
  seva_name: {
    hi: 'Seva AI',
    en: 'Seva AI',
    kn: 'Seva AI'
  },
  seva_subtitle: {
    hi: 'IDBI संपत्ति सलाहकार',
    en: 'IDBI Wealth Advisor',
    kn: 'IDBI ಸಂಪತ್ತು ಸಲಹೆಗಾರ'
  },

  // Spending Page
  spending_title: {
    hi: 'आपके पैसे की कहानी',
    en: 'Your Money Story',
    kn: 'ನಿಮ್ಮ ಹಣದ ಕಥೆ'
  },
  spending_subtitle: {
    hi: 'पिछले 6 महीनों का विश्लेषण',
    en: 'Last 6 months analysis',
    kn: 'ಕಳೆದ 6 ತಿಂಗಳ ವಿಶ್ಲೇಷಣೆ'
  },
  archetype_label: {
    hi: 'परिवार निर्माता',
    en: 'Family Builder',
    kn: 'ಕುಟುಂಬ ನಿರ್ಮಾತ'
  },
  archetype_desc: {
    hi: 'आप परिवार के लिए संतुलन बनाए रखते हैं, लेकिन निवेश अभी भी कम है।',
    en: 'You maintain a good balance for your family, but investments are still low.',
    kn: 'ನೀವು ಕುಟುಂಬಕ್ಕಾಗಿ ಸಮತೋಲನ ಕಾಪಾಡುತ್ತೀರಿ, ಆದರೆ ಹೂಡಿಕೆ ಇನ್ನೂ ಕಡಿಮೆ ಇದೆ.'
  },
  monthly_breakdown: {
    hi: 'मासिक खर्च विवरण',
    en: 'Monthly Spend Breakdown',
    kn: 'ಮಾಸಿಕ ಖರ್ಚು ವಿವರ'
  },
  trend_title: {
    hi: '6 महीने का रुझान — शीर्ष श्रेणियाँ',
    en: '6-Month Trend — Top Categories',
    kn: '6 ತಿಂಗಳ ಪ್ರವೃತ್ತಿ — ಪ್ರಮುಖ ವಿಭಾಗಗಳು'
  },
  insight_alert: {
    hi: 'खाना डिलीवरी पर ₹4,200 खर्च हुआ — आय का 6.5%। उद्योग औसत 3% है।',
    en: 'You spent ₹4,200 on food delivery — 6.5% of income. Industry average is 3%.',
    kn: 'ಆಹಾರ ಡೆಲಿವರಿಗೆ ₹4,200 ಖರ್ಚಾಗಿದೆ — ಆದಾಯದ 6.5%. ಉದ್ಯಮ ಸರಾಸರಿ 3% ಇದೆ.'
  },
  insight_alert_cta: {
    hi: '₹2,000 बचाओ → SIP में डालो',
    en: 'Save ₹2,000 → Put it in SIP',
    kn: '₹2,000 ಉಳಿಸಿ → SIP ನಲ್ಲಿ ಹಾಕಿ'
  },
  insight_achievement: {
    hi: 'आपने लगातार 3 महीने EMI समय पर दी। Credit Score सुधर रहा है!',
    en: 'You paid EMI on time for 3 consecutive months. Your Credit Score is improving!',
    kn: 'ನೀವು ಸತತ 3 ತಿಂಗಳು EMI ಸಮಯಕ್ಕೆ ಪಾವತಿ ಮಾಡಿದ್ದೀರಿ. Credit Score ಸುಧಾರಿಸುತ್ತಿದೆ!'
  },
  insight_opportunity: {
    hi: 'हर महीने ₹17,300 बचत है। सिर्फ ₹5,000 SIP शुरू करने से 10 साल में ₹11.6 लाख बन सकता है।',
    en: 'You have ₹17,300 surplus every month. Just ₹5,000 SIP can grow to ₹11.6 lakh in 10 years.',
    kn: 'ಪ್ರತಿ ತಿಂಗಳು ₹17,300 ಉಳಿತಾಯ ಇದೆ. ₹5,000 SIP ಶುರು ಮಾಡಿದರೆ 10 ವರ್ಷದಲ್ಲಿ ₹11.6 ಲಕ್ಷ ಆಗುತ್ತದೆ.'
  },

  // Goals Page
  goals_title: {
    hi: 'आपके सपने, Seva की योजना',
    en: 'Your Dreams, Seva\'s Planning',
    kn: 'ನಿಮ್ಮ ಕನಸುಗಳು, Seva ನ ಯೋಜನೆ'
  },
  goal_target: {
    hi: 'लक्ष्य',
    en: 'Target',
    kn: 'ಗುರಿ'
  },
  goal_saved: {
    hi: 'जमा',
    en: 'Saved',
    kn: 'ಉಳಿತಾಯ'
  },
  goal_required_sip: {
    hi: 'ज़रूरी SIP',
    en: 'Required SIP',
    kn: 'ಅಗತ್ಯ SIP'
  },
  goal_child_comment: {
    hi: 'अभी सिर्फ ₹2,000 RD है। ₹5,200 और निवेश करने से लक्ष्य पूरा होगा!',
    en: 'Currently only ₹2,000 in RD. Investing ₹5,200 more will help hit the target!',
    kn: 'ಈಗ ₹2,000 RD ಮಾತ್ರ ಇದೆ. ₹5,200 ಇನ್ನೂ ಹೂಡಿಕೆ ಮಾಡಿದರೆ ಗುರಿ ತಲುಪುತ್ತೀರಿ!'
  },
  goal_emergency_comment: {
    hi: 'लगभग पूरा! सिर्फ 4 महीने और।',
    en: 'Almost there! Just 4 more months.',
    kn: 'ಬಹುತೇಕ ಆಗಿದೆ! ಇನ್ನು 4 ತಿಂಗಳು ಮಾತ್ರ.'
  },
  goal_retirement_comment: {
    hi: 'सेवानिवृत्ति की योजना अभी से शुरू करें। ₹3,000/महीना PPF से 27 साल में ₹31 लाख बन सकता है।',
    en: 'Start retirement planning now. ₹3,000/month in PPF can grow to ₹31 lakh in 27 years.',
    kn: 'ನಿವೃತ್ತಿ ಯೋಜನೆ ಈಗಲೇ ಶುರು ಮಾಡಿ. ₹3,000/ತಿಂಗಳು PPF ನಲ್ಲಿ 27 ವರ್ಷದಲ್ಲಿ ₹31 ಲಕ್ಷ ಆಗುತ್ತದೆ.'
  },
  goal_sip_cta: {
    hi: 'SIP शुरू करें',
    en: 'Start SIP',
    kn: 'SIP ಶುರು ಮಾಡಿ'
  },
  goal_ppf_cta: {
    hi: 'PPF खाता खोलें',
    en: 'Open PPF Account',
    kn: 'PPF ಖಾತೆ ತೆರೆಯಿರಿ'
  },
  goal_add_new: {
    hi: '+ नया सपना जोड़ें',
    en: '+ Add New Goal',
    kn: '+ ಹೊಸ ಕನಸು ಸೇರಿಸಿ'
  },

  // Products Page
  products_title: {
    hi: 'Seva की सिफारिशें',
    en: "Seva's Recommendations",
    kn: 'Seva ನ ಶಿಫಾರಸುಗಳು'
  },
  products_subtitle: {
    hi: 'सिर्फ आपके लिए',
    en: 'Personalized for You',
    kn: 'ನಿಮಗಾಗಿ ಮಾತ್ರ'
  },
  product_action_success: {
    hi: '✓ अनुरोध भेजा गया! टीम आपसे संपर्क करेगी।',
    en: '✓ Request submitted! Team will contact you.',
    kn: '✓ ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ! ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.'
  },

  // Bottom Nav
  nav_home: {
    hi: 'होम',
    en: 'Home',
    kn: 'ಮುಖಪುಟ'
  },
  nav_chat: {
    hi: 'Seva',
    en: 'Seva',
    kn: 'Seva'
  },
  nav_spending: {
    hi: 'खर्चा',
    en: 'Spending',
    kn: 'ಖರ್ಚು'
  },
  nav_accounts: {
    hi: 'खाते',
    en: 'Accounts',
    kn: 'ಖಾತೆಗಳು'
  },
  nav_goals: {
    hi: 'सपने',
    en: 'Goals',
    kn: 'ಗುರಿಗಳು'
  },
  nav_products: {
    hi: 'उत्पाद',
    en: 'Products',
    kn: 'ಉತ್ಪನ್ನಗಳು'
  }
};

export function t(key, language = 'hi', replacements = {}) {
  const entry = translations[key];
  if (!entry) return key;
  // For languages without full UI translations, fall back to English
  let text = entry[language] || entry.en || entry.hi || key;

  // Replace {name} style placeholders
  Object.entries(replacements).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });

  return text;
}

export default translations;
