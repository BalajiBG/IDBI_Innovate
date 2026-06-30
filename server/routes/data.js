const express = require('express');
const { customerProfile, portfolio, wealthVitals, transactions, monthlyBreakdown, products } = require('../data/mockData');

const router = express.Router();

// GET /api/data/customer
router.get('/customer', (req, res) => {
  res.json(customerProfile);
});

// GET /api/data/portfolio
router.get('/portfolio', (req, res) => {
  res.json(portfolio);
});

// GET /api/data/wealth-vitals
router.get('/wealth-vitals', (req, res) => {
  // Dynamic calculation from actual customer data
  const salary = customerProfile.monthlySalary; // ₹65,000
  const emi = 18000; // Home Loan EMI
  const totalExpense = monthlyBreakdown.totalMonthlyExpense; // ₹49,700
  const surplus = monthlyBreakdown.monthlySurplus; // ₹17,300
  const rdInvestment = 2000; // monthly RD

  // 1. Emergency Fund: (saved / target) × 20
  const emergencyTarget = customerProfile.goals[1].targetAmount; // ₹1,95,000
  const emergencySaved = customerProfile.goals[1].savedSoFar; // ₹1,20,000
  const emergencyPct = Math.min(1, emergencySaved / emergencyTarget);
  const emergencyPoints = Math.round(emergencyPct * 20);

  // 2. Debt-to-Income: EMI/salary ratio (lower is better)
  const emiRatio = emi / salary; // 0.277
  const debtPoints = emiRatio <= 0.20 ? 20 : emiRatio <= 0.30 ? 15 : emiRatio <= 0.40 ? 10 : 5;

  // 3. Savings Rate: (surplus / salary) × 20, but penalize if not invested
  const surplusRate = surplus / salary; // 26.6% — good surplus
  const investedRate = rdInvestment / salary; // 3.1% — actually invested
  const effectiveRate = (surplusRate * 0.4) + (investedRate * 0.6); // weighted: having surplus is good, but investing is better
  const savingsPoints = Math.min(20, Math.round(effectiveRate * 100));

  // 4. Investment Diversity: count of distinct asset types / 5 × 20
  const assetTypes = portfolio.holdings.length; // 2 (RD + FD)
  const idealTypes = 5; // RD, FD, MF, PPF, Insurance
  const diversityPoints = Math.min(20, Math.round((assetTypes / idealTypes) * 20));

  // 5. Goal Progress: average completion across all goals × 20
  const goals = customerProfile.goals;
  const avgProgress = goals.reduce((sum, g) => sum + (g.savedSoFar / g.targetAmount), 0) / goals.length;
  const goalPoints = Math.min(20, Math.round(avgProgress * 20));

  const totalScore = emergencyPoints + debtPoints + savingsPoints + diversityPoints + goalPoints;
  const grade = totalScore >= 80 ? 'A' : totalScore >= 60 ? 'B' : totalScore >= 40 ? 'C' : 'D';

  res.json({
    totalScore,
    grade,
    trend: 'improving',
    subScores: [
      { name: "Emergency Fund", points: emergencyPoints, maxPoints: 20, detail: `${Math.round(emergencyPct * 100)}% funded`, color: emergencyPoints >= 14 ? '#00836C' : '#F98220' },
      { name: "Debt-to-Income", points: debtPoints, maxPoints: 20, detail: `EMI = ${Math.round(emiRatio * 100)}% of income`, color: debtPoints >= 14 ? '#00836C' : '#F98220' },
      { name: "Savings Rate", points: savingsPoints, maxPoints: 20, detail: `${Math.round(surplusRate * 100)}% surplus, ${(investedRate * 100).toFixed(1)}% invested`, color: savingsPoints >= 10 ? '#F98220' : '#E06D0E' },
      { name: "Investment Diversity", points: diversityPoints, maxPoints: 20, detail: `${assetTypes} of ${idealTypes} types`, color: diversityPoints >= 10 ? '#F98220' : '#E06D0E' },
      { name: "Goal Progress", points: goalPoints, maxPoints: 20, detail: `${Math.round(avgProgress * 100)}% average`, color: goalPoints >= 10 ? '#F98220' : '#E06D0E' }
    ],
    sevaComment: totalScore >= 70 ? "Great progress!" : "Score can improve — start SIP and get insurance.",
    calculation: {
      emergencyFund: { saved: emergencySaved, target: emergencyTarget, pct: Math.round(emergencyPct * 100) },
      debtRatio: { emi, salary, ratio: Math.round(emiRatio * 100) },
      savingsRate: { invested: rdInvestment, salary, rate: (effectiveSavingsRate * 100).toFixed(1) },
      diversity: { current: assetTypes, ideal: idealTypes },
      goalProgress: { avg: Math.round(avgProgress * 100) }
    }
  });
});

// GET /api/data/transactions
router.get('/transactions', (req, res) => {
  res.json({ transactions, monthlyBreakdown, totalTransactions: transactions.length });
});

// GET /api/data/products
router.get('/products', (req, res) => {
  const lang = req.query.lang || 'hi';
  const localizedProducts = products.map(p => ({
    ...p,
    reason: typeof p.reason === 'object' ? (p.reason[lang] || p.reason.hi) : p.reason,
    cta: typeof p.cta === 'object' ? (p.cta[lang] || p.cta.hi) : p.cta
  }));
  res.json(localizedProducts);
});

// ═══ Custom Savings Goals (in-memory persistence) ═══
const customGoals = [];

// ═══ Customer Lifestyle Profile ═══
let customerLifestyle = null;

// ═══ Linked External Accounts / Portfolio ═══
const linkedPortfolio = [
  { id: 'ext-1', bank: 'SBI', type: 'savings', number: 'XXXX-8834', balance: 42300, icon: '🏛️' }
];

// ═══ Customer Insurances ═══
const customerInsurances = [
  { id: 'ins-1', type: 'health', provider: 'IDBI Federal', policyNumber: 'HF-2024-98712', coverAmount: 500000, premium: 12000, premiumFrequency: 'yearly', expiryDate: '2027-03-15', members: 'Family Floater (4)' }
];

// ═══ Other Income Sources ═══
const otherIncome = [];

// ═══ Customer Physical Assets ═══
const customerAssets = [];

// GET /api/data/portfolio-linked
router.get('/portfolio-linked', (req, res) => {
  res.json(linkedPortfolio);
});

// POST /api/data/portfolio-linked
router.post('/portfolio-linked', (req, res) => {
  const item = req.body;
  item.id = `ext-${Date.now()}`;
  linkedPortfolio.unshift(item);
  res.json({ success: true, item });
});

// DELETE /api/data/portfolio-linked/:id
router.delete('/portfolio-linked/:id', (req, res) => {
  const idx = linkedPortfolio.findIndex(a => a.id === req.params.id);
  if (idx !== -1) {
    linkedPortfolio.splice(idx, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ═══ Insurance Endpoints ═══

// GET /api/data/insurances
router.get('/insurances', (req, res) => {
  res.json(customerInsurances);
});

// POST /api/data/insurances
router.post('/insurances', (req, res) => {
  const insurance = req.body;
  insurance.id = `ins-${Date.now()}`;
  customerInsurances.unshift(insurance);
  res.json({ success: true, insurance });
});

// DELETE /api/data/insurances/:id
router.delete('/insurances/:id', (req, res) => {
  const idx = customerInsurances.findIndex(i => i.id === req.params.id);
  if (idx !== -1) {
    customerInsurances.splice(idx, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ═══ Other Income Endpoints ═══

// GET /api/data/other-income
router.get('/other-income', (req, res) => {
  res.json(otherIncome);
});

// POST /api/data/other-income
router.post('/other-income', (req, res) => {
  const income = req.body;
  income.id = `inc-${Date.now()}`;
  otherIncome.unshift(income);
  res.json({ success: true, income });
});

// DELETE /api/data/other-income/:id
router.delete('/other-income/:id', (req, res) => {
  const idx = otherIncome.findIndex(i => i.id === req.params.id);
  if (idx !== -1) {
    otherIncome.splice(idx, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ═══ Physical Assets Endpoints ═══

router.get('/assets', (req, res) => { res.json(customerAssets); });

router.post('/assets', (req, res) => {
  const asset = req.body;
  asset.id = `asset-${Date.now()}`;
  customerAssets.unshift(asset);
  res.json({ success: true, asset });
});

router.delete('/assets/:id', (req, res) => {
  const idx = customerAssets.findIndex(a => a.id === req.params.id);
  if (idx !== -1) { customerAssets.splice(idx, 1); res.json({ success: true }); }
  else { res.status(404).json({ error: 'Not found' }); }
});

// GET /api/data/profile
router.get('/profile', (req, res) => {
  res.json(customerLifestyle || {});
});

// POST /api/data/profile
router.post('/profile', (req, res) => {
  customerLifestyle = req.body;
  res.json({ success: true });
});

// GET /api/data/custom-goals
router.get('/custom-goals', (req, res) => {
  res.json(customGoals);
});

// POST /api/data/custom-goals
router.post('/custom-goals', (req, res) => {
  const goal = req.body;
  goal.id = `custom-${Date.now()}`;
  goal.createdAt = new Date().toISOString();
  customGoals.unshift(goal); // newest first
  res.json({ success: true, goal });
});

// DELETE /api/data/custom-goals/:id
router.delete('/custom-goals/:id', (req, res) => {
  const idx = customGoals.findIndex(g => g.id === req.params.id);
  if (idx !== -1) {
    customGoals.splice(idx, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

// GET /api/data/spending-breakdown
router.get('/spending-breakdown', (req, res) => {
  // Aggregate from transactions
  const categoryTotals = {};
  const monthlyTrends = {};

  transactions.filter(t => t.type === 'debit').forEach(t => {
    // Category totals
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;

    // Monthly trends
    const month = t.date.substring(0, 7);
    if (!monthlyTrends[month]) monthlyTrends[month] = {};
    monthlyTrends[month][t.category] = (monthlyTrends[month][t.category] || 0) + t.amount;
  });

  const totalSpend = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const breakdown = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount: Math.round(amount / 6), // monthly average
      percentage: Math.round((amount / totalSpend) * 100 * 10) / 10
    }))
    .sort((a, b) => b.amount - a.amount);

  res.json({ breakdown, monthlyTrends, totalMonthlySpend: Math.round(totalSpend / 6) });
});

module.exports = router;
