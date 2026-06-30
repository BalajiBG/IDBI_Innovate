// ═══════════════════════════════════════════════════════════════
// WealthSeva AI — Synthetic Data Layer
// IDBI Innovate Hackathon 2026
// ═══════════════════════════════════════════════════════════════

const customerProfile = {
  customerId: "IDBI-2024-RK001",
  name: "Rajesh Kumar",
  age: 34,
  city: "Pune",
  cityTier: 2,
  monthlySalary: 65000,
  familySize: 4,
  archetype: "Family Builder",
  wealthVitalsScore: 61,
  existingProducts: ["Savings Account", "Home Loan", "RD ₹2000/month"],
  goals: [
    { id: "g1", name: "Child Education", icon: "🎓", targetAmount: 1500000, targetYear: 2033, savedSoFar: 85000 },
    { id: "g2", name: "Emergency Fund", icon: "🛡️", targetAmount: 195000, targetYear: null, savedSoFar: 120000 },
    { id: "g3", name: "Retirement", icon: "🏖️", targetAmount: 8000000, targetYear: 2051, savedSoFar: 45000 }
  ],
  riskProfile: "moderate",
  salaryDay: 1,
  pin: "1234"
};

const portfolio = {
  totalInvested: 130000,
  currentValue: 141500,
  holdings: [
    { type: "Recurring Deposit", name: "IDBI RD 12-Month", amount: 96000, currentValue: 103000, returns: "7.2% p.a.", maturityDate: "2027-01-01" },
    { type: "IDBI Tax Saving FD", name: "IDBI 5Y Tax Saver FD", amount: 34000, currentValue: 38500, returns: "8.1% p.a.", maturityDate: "2029-03-15" }
  ],
  missingAssets: ["Mutual Funds", "Health Insurance", "Term Life Insurance", "PPF"],
  assetAllocation: { fixedIncome: 100, equity: 0, gold: 0, insurance: 0 }
};

const wealthVitals = {
  totalScore: 61,
  grade: "B",
  trend: "improving",
  subScores: [
    { name: "Emergency Fund", nameHindi: "Emergency Fund", score: 62, maxPoints: 20, points: 12, detail: "62% funded", status: "fair", color: "#F98220" },
    { name: "Debt-to-Income", nameHindi: "Karz-Aay Ratio", score: 65, maxPoints: 20, points: 13, detail: "EMIs = 32% of income", status: "fair", color: "#F98220" },
    { name: "Savings Rate", nameHindi: "Bachat Rate", score: 26, maxPoints: 20, points: 8, detail: "5.2% savings rate", status: "poor", color: "#E06D0E" },
    { name: "Investment Diversity", nameHindi: "Nivesh Vibhinnata", score: 30, maxPoints: 20, points: 6, detail: "Only 2 asset types", status: "poor", color: "#E06D0E" },
    { name: "Goal Progress", nameHindi: "Lakshya Pragati", score: 60, maxPoints: 20, points: 12, detail: "15% average progress", status: "fair", color: "#F98220" }
  ],
  sevaComment: "Aapka score 4 points badha is mahine! Mutual fund shuru karne se score aur better hoga."
};

// Generate 6 months of transactions (Jan-Jun 2026)
function generateTransactions() {
  const transactions = [];
  let id = 1;
  const months = [
    { month: "2026-01", days: 31 },
    { month: "2026-02", days: 28 },
    { month: "2026-03", days: 31 },
    { month: "2026-04", days: 30 },
    { month: "2026-05", days: 31 },
    { month: "2026-06", days: 23 }
  ];

  const recurring = [
    { category: "Salary", description: "Monthly Salary Credit", amount: 65000, type: "credit", day: 1 },
    { category: "EMI (Home Loan)", description: "IDBI Home Loan EMI", amount: 18000, type: "debit", day: 5 },
    { category: "Investment (RD)", description: "IDBI RD Auto-Debit", amount: 2000, type: "debit", day: 5 },
    { category: "Utilities", description: "Electricity + Gas + Internet", amount: 3200, type: "debit", day: 7 },
    { category: "School Fees", description: "DPS School Fees", amount: 4500, type: "debit", day: 10 }
  ];

  const variable = [
    { category: "Groceries", descriptions: ["DMart Groceries", "BigBasket Order", "Local Kirana Store", "Reliance Fresh"], minAmount: 1500, maxAmount: 3500 },
    { category: "Food Delivery", descriptions: ["Swiggy Order", "Zomato Order", "Swiggy Instamart", "Zomato Gold Order"], minAmount: 250, maxAmount: 800 },
    { category: "Entertainment", descriptions: ["Netflix Subscription", "BookMyShow Tickets", "Amazon Prime", "Hotstar"], minAmount: 199, maxAmount: 1200 },
    { category: "Medical", descriptions: ["Apollo Pharmacy", "Doctor Consultation", "Lab Tests"], minAmount: 300, maxAmount: 2500 },
    { category: "Travel", descriptions: ["Uber Ride", "Ola Auto", "Petrol - HP", "Metro Card Recharge"], minAmount: 150, maxAmount: 2000 },
    { category: "ATM Withdrawal", descriptions: ["ATM Cash Withdrawal"], minAmount: 2000, maxAmount: 5000 }
  ];

  // Monthly food delivery targets (showing a spike pattern for insight)
  const foodDeliveryMonthly = [3800, 4200, 5100, 4000, 4200, 3900];

  months.forEach((m, monthIdx) => {
    // Recurring transactions
    recurring.forEach(r => {
      transactions.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        date: `${m.month}-${String(r.day).padStart(2, '0')}`,
        category: r.category,
        description: r.description,
        amount: r.amount,
        type: r.type,
        isRecurring: true
      });
    });

    // Groceries — 3-4 transactions per month
    const groceryCount = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < groceryCount; i++) {
      const day = 8 + Math.floor(Math.random() * 20);
      transactions.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        date: `${m.month}-${String(Math.min(day, m.days)).padStart(2, '0')}`,
        category: "Groceries",
        description: variable[0].descriptions[Math.floor(Math.random() * variable[0].descriptions.length)],
        amount: Math.round((8500 / groceryCount) + (Math.random() * 500 - 250)),
        type: "debit",
        isRecurring: false
      });
    }

    // Food Delivery — 6-8 transactions per month
    const fdTarget = foodDeliveryMonthly[monthIdx];
    const fdCount = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < fdCount; i++) {
      const day = 2 + Math.floor(Math.random() * (m.days - 3));
      transactions.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        date: `${m.month}-${String(Math.min(day, m.days)).padStart(2, '0')}`,
        category: "Food Delivery",
        description: variable[1].descriptions[Math.floor(Math.random() * variable[1].descriptions.length)],
        amount: Math.round(fdTarget / fdCount + (Math.random() * 100 - 50)),
        type: "debit",
        isRecurring: false
      });
    }

    // Entertainment — 2-3 per month
    const entCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < entCount; i++) {
      const day = 5 + Math.floor(Math.random() * 22);
      transactions.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        date: `${m.month}-${String(Math.min(day, m.days)).padStart(2, '0')}`,
        category: "Entertainment",
        description: variable[2].descriptions[Math.floor(Math.random() * variable[2].descriptions.length)],
        amount: Math.round(2800 / entCount + (Math.random() * 200 - 100)),
        type: "debit",
        isRecurring: false
      });
    }

    // Medical — 1-2 per month
    const medCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < medCount; i++) {
      const day = 3 + Math.floor(Math.random() * 25);
      transactions.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        date: `${m.month}-${String(Math.min(day, m.days)).padStart(2, '0')}`,
        category: "Medical",
        description: variable[3].descriptions[Math.floor(Math.random() * variable[3].descriptions.length)],
        amount: Math.round(1500 / medCount + (Math.random() * 300)),
        type: "debit",
        isRecurring: false
      });
    }

    // Travel — 4-6 per month
    const travelCount = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < travelCount; i++) {
      const day = 2 + Math.floor(Math.random() * (m.days - 3));
      transactions.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        date: `${m.month}-${String(Math.min(day, m.days)).padStart(2, '0')}`,
        category: "Travel",
        description: variable[4].descriptions[Math.floor(Math.random() * variable[4].descriptions.length)],
        amount: Math.round(3000 / travelCount + (Math.random() * 200 - 100)),
        type: "debit",
        isRecurring: false
      });
    }

    // ATM — 1-2 per month
    if (Math.random() > 0.3) {
      const day = 10 + Math.floor(Math.random() * 15);
      transactions.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        date: `${m.month}-${String(Math.min(day, m.days)).padStart(2, '0')}`,
        category: "ATM Withdrawal",
        description: "ATM Cash Withdrawal",
        amount: 2000 + Math.floor(Math.random() * 3) * 1000,
        type: "debit",
        isRecurring: false
      });
    }
  });

  return transactions.sort((a, b) => a.date.localeCompare(b.date));
}

const transactions = generateTransactions();

const monthlyBreakdown = {
  "Food Delivery": 4200,
  "Groceries": 8500,
  "EMI (Home Loan)": 18000,
  "School Fees": 4500,
  "Utilities": 3200,
  "Entertainment": 2800,
  "Medical": 1500,
  "Travel": 3000,
  "Investment (RD)": 2000,
  "ATM Withdrawal": 2000,
  totalMonthlyExpense: 49700,
  monthlySurplus: 17300
};

const products = [
  {
    id: "prod-001",
    name: "IDBI Mutual Fund SIP",
    icon: "📈",
    priority: "URGENT",
    priorityColor: "#F98220",
    reason: {
      hi: "आपके पास एक भी Mutual Fund नहीं है। ₹2,000/महीना SIP से शुरू करो।",
      en: "You don't have a single Mutual Fund. Start with ₹2,000/month SIP.",
      kn: "ನಿಮ್ಮ ಬಳಿ ಒಂದೂ Mutual Fund ಇಲ್ಲ. ₹2,000/ತಿಂಗಳು SIP ನಿಂದ ಶುರು ಮಾಡಿ."
    },
    expectedBenefit: "12% p.a. CAGR",
    cta: {
      hi: "SIP शुरू करें",
      en: "Start SIP",
      kn: "SIP ಶುರು ಮಾಡಿ"
    },
    category: "mutual_fund"
  },
  {
    id: "prod-002",
    name: "IDBI Term Life Insurance",
    icon: "🛡️",
    priority: "HIGH",
    priorityColor: "#00836C",
    reason: {
      hi: "4 परिवार के सदस्य आप पर निर्भर हैं। ₹1 करोड़ कवर सिर्फ ~₹700/महीना में।",
      en: "4 family members depend on you. ₹1 Cr term cover at just ~₹700/month.",
      kn: "4 ಕುಟುಂಬ ಸದಸ್ಯರು ನಿಮ್ಮ ಮೇಲೆ ಅವಲಂಬಿತರು. ₹1 ಕೋಟಿ ಕವರ್ ಕೇವಲ ~₹700/ತಿಂಗಳಿಗೆ."
    },
    expectedBenefit: "₹1 Crore life cover",
    cta: {
      hi: "प्रीमियम जाँचें",
      en: "Check Premium",
      kn: "ಪ್ರೀಮಿಯಂ ಪರಿಶೀಲಿಸಿ"
    },
    category: "insurance"
  },
  {
    id: "prod-003",
    name: "IDBI Health Insurance",
    icon: "🏥",
    priority: "HIGH",
    priorityColor: "#00836C",
    reason: {
      hi: "आपकी बचत एक अस्पताल भर्ती में खत्म हो सकती है। ₹5 लाख कवर ज़रूर लें।",
      en: "One hospitalization can wipe out your savings. Get ₹5 lakh cover for sure.",
      kn: "ಒಂದು ಆಸ್ಪತ್ರೆ ಭರ್ತಿಯಲ್ಲಿ ನಿಮ್ಮ ಉಳಿತಾಯ ಮುಗಿಯಬಹುದು. ₹5 ಲಕ್ಷ ಕವರ್ ಖಂಡಿತ ತೆಗೆದುಕೊಳ್ಳಿ."
    },
    expectedBenefit: "₹5 Lakh family floater",
    cta: {
      hi: "कोट देखें",
      en: "View Quote",
      kn: "ಕೋಟ್ ನೋಡಿ"
    },
    category: "insurance"
  },
  {
    id: "prod-004",
    name: "IDBI PPF Account",
    icon: "🏦",
    priority: "MEDIUM",
    priorityColor: "#006B57",
    reason: {
      hi: "कर बचाएं + सेवानिवृत्ति बनाएं। 80C लाभ भी मिलेगा।",
      en: "Save tax + build retirement corpus. Get 80C benefit too.",
      kn: "ತೆರಿಗೆ ಉಳಿಸಿ + ನಿವೃತ್ತಿ ನಿಧಿ ಕಟ್ಟಿ. 80C ಲಾಭವೂ ಸಿಗುತ್ತದೆ."
    },
    expectedBenefit: "7.1% p.a. tax-free",
    cta: {
      hi: "खाता खोलें",
      en: "Open Account",
      kn: "ಖಾತೆ ತೆರೆಯಿರಿ"
    },
    category: "ppf"
  }
];

module.exports = {
  customerProfile,
  portfolio,
  wealthVitals,
  transactions,
  monthlyBreakdown,
  products
};
