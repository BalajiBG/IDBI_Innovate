import { useState, useEffect } from 'react';
import { formatINR } from '../utils/formatCurrency';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import AffordabilityCheck from '../components/AffordabilityCheck';

const labels = {
  createTitle: { hi: 'नई बचत शुरू करें', en: 'Start New Savings', kn: 'ಹೊಸ ಉಳಿತಾಯ ಶುರು ಮಾಡಿ' },
  purpose: { hi: 'किसके लिए बचत?', en: 'What are you saving for?', kn: 'ಏನಕ್ಕಾಗಿ ಉಳಿತಾಯ?' },
  amount: { hi: 'राशि (₹)', en: 'Amount (₹)', kn: 'ಮೊತ್ತ (₹)' },
  frequency: { hi: 'कितनी बार?', en: 'How often?', kn: 'ಎಷ್ಟು ಬಾರಿ?' },
  tenure: { hi: 'कितने समय तक?', en: 'For how long?', kn: 'ಎಷ್ಟು ಸಮಯ?' },
  tenureYears: { hi: 'साल', en: 'years', kn: 'ವರ್ಷ' },
  projection: { hi: 'अनुमानित राशि', en: 'Projected Amount', kn: 'ಅಂದಾಜು ಮೊತ್ತ' },
  invested: { hi: 'कुल निवेश', en: 'Total Invested', kn: 'ಒಟ್ಟು ಹೂಡಿಕೆ' },
  returns: { hi: 'अनुमानित लाभ', en: 'Estimated Returns', kn: 'ಅಂದಾಜು ಲಾಭ' },
  rate: { hi: 'अनुमानित वार्षिक दर', en: 'Estimated annual rate', kn: 'ಅಂದಾಜು ವಾರ್ಷಿಕ ದರ' },
  start: { hi: 'बचत शुरू करें', en: 'Start Saving', kn: 'ಉಳಿತಾಯ ಶುರು ಮಾಡಿ' },
  cancel: { hi: 'रद्द करें', en: 'Cancel', kn: 'ರದ್ದುಮಾಡಿ' },
  success: { hi: '✓ बचत योजना सफलतापूर्वक बनाई गई!', en: '✓ Savings plan created successfully!', kn: '✓ ಉಳಿತಾಯ ಯೋಜನೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!' },
  purposePlaceholder: { hi: 'उदा: बाइक, छुट्टी, शादी...', en: 'e.g. Bike, Vacation, Wedding...', kn: 'ಉದಾ: ಬೈಕ್, ರಜೆ, ಮದುವೆ...' }
};

const frequencies = [
  { value: 'daily', label: { hi: 'रोज़', en: 'Daily', kn: 'ದಿನಂಪ್ರತಿ' }, multiplier: 365 },
  { value: 'weekly', label: { hi: 'साप्ताहिक', en: 'Weekly', kn: 'ವಾರಕ್ಕೊಮ್ಮೆ' }, multiplier: 52 },
  { value: 'biweekly', label: { hi: 'पाक्षिक', en: 'Bi-Weekly', kn: 'ಎರಡು ವಾರಕ್ಕೊಮ್ಮೆ' }, multiplier: 26 },
  { value: 'monthly', label: { hi: 'मासिक', en: 'Monthly', kn: 'ಮಾಸಿಕ' }, multiplier: 12 },
  { value: 'quarterly', label: { hi: 'तिमाही', en: 'Quarterly', kn: 'ತ್ರೈಮಾಸಿಕ' }, multiplier: 4 },
  { value: 'halfyearly', label: { hi: 'छमाही', en: 'Half-Yearly', kn: 'ಅರ್ಧ ವಾರ್ಷಿಕ' }, multiplier: 2 },
  { value: 'yearly', label: { hi: 'वार्षिक', en: 'Yearly', kn: 'ವಾರ್ಷಿಕ' }, multiplier: 1 }
];

const purposeSuggestions = [
  { icon: '🏍️', label: { hi: 'बाइक/कार', en: 'Bike/Car', kn: 'ಬೈಕ್/ಕಾರ್' } },
  { icon: '✈️', label: { hi: 'छुट्टी', en: 'Vacation', kn: 'ರಜೆ' } },
  { icon: '💍', label: { hi: 'शादी', en: 'Wedding', kn: 'ಮದುವೆ' } },
  { icon: '📱', label: { hi: 'गैजेट', en: 'Gadget', kn: 'ಗ್ಯಾಜೆಟ್' } },
  { icon: '🏠', label: { hi: 'घर डाउनपेमेंट', en: 'Home Down Payment', kn: 'ಮನೆ ಡೌನ್ ಪೇಮೆಂಟ್' } },
  { icon: '🎓', label: { hi: 'पढ़ाई', en: 'Education', kn: 'ಶಿಕ್ಷಣ' } }
];

function calculateProjection(amount, frequencyMultiplier, tenureYears, annualRate = 7.5) {
  const n = frequencyMultiplier; // deposits per year
  const r = annualRate / 100;
  const t = tenureYears;
  const periodicRate = r / n;
  const totalPeriods = n * t;

  // Future value of recurring deposit: P * [((1 + r/n)^(n*t) - 1) / (r/n)]
  const futureValue = amount * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
  const totalInvested = amount * totalPeriods;
  const totalReturns = futureValue - totalInvested;

  return { futureValue: Math.round(futureValue), totalInvested: Math.round(totalInvested), totalReturns: Math.round(totalReturns) };
}

export default function GoalsPage() {
  const { language } = useLanguage();
  const [showCreate, setShowCreate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customGoals, setCustomGoals] = useState([]);
  const [startedTax, setStartedTax] = useState({});
  const [taxModal, setTaxModal] = useState(null);
  const [taxAmount, setTaxAmount] = useState('');
  const [taxFrequency, setTaxFrequency] = useState('monthly');

  // Form state
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');
  const [tenure, setTenure] = useState(3);

  // Fetch saved goals on mount
  useEffect(() => {
    fetch('/api/data/custom-goals')
      .then(res => res.json())
      .then(setCustomGoals)
      .catch(console.error);
  }, []);

  const l = (key) => labels[key]?.[language] || labels[key]?.en || key;

  const freq = frequencies.find(f => f.value === selectedFrequency);
  const numAmount = parseInt(amount) || 0;
  const projection = numAmount > 0 ? calculateProjection(numAmount, freq.multiplier, tenure) : null;

  const handleCreate = async () => {
    const freq = frequencies.find(f => f.value === selectedFrequency);
    const numAmt = parseInt(amount) || 0;
    const proj = calculateProjection(numAmt, freq.multiplier, tenure);

    const newGoal = {
      icon: purposeSuggestions.find(s => (s.label[language] || s.label.en) === purpose)?.icon || '🎯',
      purpose,
      amount: numAmt,
      frequency: selectedFrequency,
      frequencyLabel: freq.label[language] || freq.label.en,
      tenure,
      projection: proj
    };

    try {
      const res = await fetch('/api/data/custom-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      const data = await res.json();
      if (data.success) {
        setCustomGoals(prev => [data.goal, ...prev]);
      }
    } catch (err) {
      // Fallback to local state if API fails
      newGoal.id = `custom-${Date.now()}`;
      newGoal.createdAt = new Date().toISOString();
      setCustomGoals(prev => [newGoal, ...prev]);
    }

    setShowCreate(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
    setPurpose('');
    setAmount('');
    setSelectedFrequency('monthly');
    setTenure(3);
  };

  const goals = [
    {
      id: 'g1', icon: '🎓', name: 'Child Education',
      targetAmount: 1500000, targetYear: 2033,
      savedSoFar: 85000, progressPercent: 5.7,
      requiredSIP: 7200,
      sevaComment: t('goal_child_comment', language),
      cta: t('goal_sip_cta', language),
      statusColor: '#F98220'
    },
    {
      id: 'g2', icon: '🛡️', name: 'Emergency Fund',
      targetAmount: 195000, targetYear: null,
      savedSoFar: 120000, progressPercent: 61.5,
      requiredSIP: 18750,
      sevaComment: t('goal_emergency_comment', language),
      cta: null,
      statusColor: '#00836C'
    },
    {
      id: 'g3', icon: '🏖️', name: 'Retirement',
      targetAmount: 8000000, targetYear: 2051,
      savedSoFar: 45000, progressPercent: 0.6,
      requiredSIP: 3000,
      sevaComment: t('goal_retirement_comment', language),
      cta: t('goal_ppf_cta', language),
      statusColor: '#F98220'
    }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-idbi-orange font-hindi">{t('goals_title', language)}</h2>
      </div>

      {/* Wealth Growth Plan */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold text-text-secondary mb-2">
          {language === 'hi' ? 'आपकी संपत्ति वृद्धि योजना' : language === 'kn' ? 'ನಿಮ್ಮ ಸಂಪತ್ತು ಬೆಳವಣಿಗೆ ಯೋಜನೆ' : 'Your Wealth Growth Plan'}
        </h3>
        <div className="flex items-end gap-1 mb-2">
          {[
            { year: language === 'hi' ? 'अभी' : language === 'kn' ? 'ಈಗ' : 'Now', value: 1.4 },
            { year: '1Y', value: Math.round((141500 + 17300*12*0.5) * 1.10 / 100000) / 10 },
            { year: '3Y', value: Math.round((141500 + 17300*12*3*0.6) * Math.pow(1.10, 3) / 100000) / 10 },
            { year: '5Y', value: Math.round((141500 + 17300*12*5*0.6) * Math.pow(1.10, 5) / 100000) / 10 },
            { year: '10Y', value: Math.round((141500 + 17300*12*10*0.6) * Math.pow(1.10, 10) / 100000) / 10 }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <span className="text-[9px] font-bold tabular-nums" style={{ color: i === 0 ? '#F98220' : '#00836C' }}>₹{bar.value}L</span>
              <div className="w-full rounded-t mt-0.5" style={{ height: `${(bar.value / 40) * 50 + 8}px`, backgroundColor: i === 0 ? '#F98220' : '#00836C', opacity: 0.6 + (i * 0.1) }} />
              <span className="text-[8px] text-text-secondary mt-0.5">{bar.year}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-text-secondary mb-2">
          {language === 'hi' ? '₹17,300/माह बचत × 10% अनुमानित लाभ × समय' :
           language === 'kn' ? '₹17,300/ತಿಂಗಳು ಉಳಿತಾಯ × 10% ಅಂದಾಜು ಲಾಭ × ಸಮಯ' :
           'Based on YOUR ₹17,300/month surplus × 10% est. returns × time'}
        </p>
        <div className="pt-2 border-t border-gray-100 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">{language === 'hi' ? '₹5,000 SIP शुरू करें' : language === 'kn' ? '₹5,000 SIP ಶುರು ಮಾಡಿದರೆ' : 'If you start ₹5,000 SIP'}</span>
            <span className="font-bold text-idbi-teal">+₹11.6L (10Y @12%)</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">{language === 'hi' ? '₹3,000 PPF शुरू करें' : language === 'kn' ? '₹3,000 PPF ಶುರು ಮಾಡಿದರೆ' : 'If you start ₹3,000 PPF'}</span>
            <span className="font-bold text-idbi-teal">+₹7.8L (10Y @7.1%)</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">{language === 'hi' ? 'Food Delivery ₹2,000 बचाकर SIP' : language === 'kn' ? 'Food Delivery ₹2,000 ಉಳಿಸಿ SIP' : 'Save ₹2,000 from Food Delivery → SIP'}</span>
            <span className="font-bold text-idbi-teal">+₹4.6L (10Y @12%)</span>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-sm text-success font-medium text-center animate-slide-up font-hindi">
          {l('success')}
        </div>
      )}

      {/* Custom Savings Plans */}
      {customGoals.map((goal) => (
        <div key={goal.id} className="card p-4 border-l-4 border-l-idbi-teal">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{goal.icon}</span>
              <div>
                <h3 className="font-semibold text-text-primary">{goal.purpose}</h3>
                <p className="text-xs text-text-secondary">
                  {formatINR(goal.amount)} • {goal.frequencyLabel} • {goal.tenure} {l('tenureYears')}
                </p>
              </div>
            </div>
            <span className="status-pill bg-idbi-teal/10 text-idbi-teal text-[10px] font-bold">
              Active
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 p-3 bg-surface rounded-xl text-center">
            <div>
              <p className="text-sm font-bold text-idbi-teal tabular-nums">{formatINR(goal.projection.futureValue)}</p>
              <p className="text-[9px] text-text-secondary font-hindi">{l('projection')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary tabular-nums">{formatINR(goal.projection.totalInvested)}</p>
              <p className="text-[9px] text-text-secondary font-hindi">{l('invested')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-success tabular-nums">{formatINR(goal.projection.totalReturns)}</p>
              <p className="text-[9px] text-text-secondary font-hindi">{l('returns')}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Goal Cards */}
      {goals.map((goal) => (
        <div key={goal.id} className="card p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{goal.icon}</span>
              <div>
                <h3 className="font-semibold text-text-primary">{goal.name}</h3>
                <p className="text-xs text-text-secondary">
                  {t('goal_target', language)}: {formatINR(goal.targetAmount)}
                  {goal.targetYear && ` by ${goal.targetYear}`}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold tabular-nums" style={{ color: goal.statusColor }}>
              {goal.progressPercent}%
            </span>
          </div>

          <div className="progress-bar mt-3">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(goal.progressPercent, 100)}%`, backgroundColor: goal.statusColor }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>{t('goal_saved', language)}: {formatINR(goal.savedSoFar)}</span>
            <span>{t('goal_required_sip', language)}: {formatINR(goal.requiredSIP)}/mo</span>
          </div>

          <p className="text-xs text-text-secondary mt-3 p-2 bg-surface rounded-lg font-hindi">
            💬 Seva: "{goal.sevaComment}"
          </p>

          {goal.cta && (
            <button className="btn-outline text-xs mt-3 w-full">{goal.cta}</button>
          )}
        </div>
      ))}

      {/* Tax Saving Plan */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-idbi-orange/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F98220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary font-hindi">
              {language === 'hi' ? 'कर बचत योजना' : language === 'kn' ? 'ತೆರಿಗೆ ಉಳಿತಾಯ ಯೋಜನೆ' : 'Tax Saving Plan'}
            </h3>
            <p className="text-[10px] text-text-secondary font-hindi">
              {language === 'hi' ? '₹1.5 लाख तक धारा 80C के तहत बचत' : language === 'kn' ? '₹1.5 ಲಕ್ಷದವರೆಗೆ ಸೆಕ್ಷನ್ 80C ಅಡಿ ಉಳಿತಾಯ' : 'Save up to ₹1.5 lakh under Section 80C'}
            </p>
          </div>
        </div>

        {/* Tax saving instruments */}
        <div className="mt-3 space-y-2">
          {[
            { name: 'PPF', section: '80C', returns: 7.1, lockIn: 15, limit: 150000, status: 'not_started',
              desc: { hi: 'कर-मुक्त लाभ, 15 वर्ष', en: 'Tax-free returns, 15 years', kn: 'ತೆರಿಗೆ-ಮುಕ್ತ ಲಾಭ, 15 ವರ್ಷ' } },
            { name: 'Tax Saving FD', section: '80C', returns: 7.5, lockIn: 5, limit: 150000, status: 'active',
              desc: { hi: '5 साल लॉक-इन, गारंटी लाभ', en: '5-year lock-in, guaranteed returns', kn: '5 ವರ್ಷ ಲಾಕ್-ಇನ್, ಖಾತರಿ ಲಾಭ' } },
            { name: 'ELSS', section: '80C', returns: 13, lockIn: 3, limit: 150000, status: 'not_started',
              desc: { hi: '3 साल लॉक-इन, Equity Mutual Fund', en: '3-year lock-in, Equity Mutual Fund', kn: '3 ವರ್ಷ ಲಾಕ್-ಇನ್, Equity Mutual Fund' } },
            { name: 'SCSS', section: '80C', returns: 8.2, lockIn: 5, limit: 3000000, status: 'not_eligible',
              desc: { hi: 'वरिष्ठ नागरिक (60+), 5 वर्ष', en: 'Senior citizens (60+), 5 years', kn: 'ಹಿರಿಯ ನಾಗಿರಕರು (60+), 5 ವರ್ಷ' } },
            { name: 'Capital Gain Bond', section: '54EC', returns: 5.25, lockIn: 5, limit: 5000000, status: 'not_started',
              desc: { hi: 'संपत्ति बिक्री पर कर बचत', en: 'Save tax on property sale gains', kn: 'ಆಸ್ತಿ ಮಾರಾಟದ ಲಾಭದ ತೆರಿಗೆ ಉಳಿಸಿ' } }
          ].map((inst, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-surface rounded-xl">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">{inst.name}</span>
                  <span className="px-1.5 py-0.5 bg-idbi-teal/10 text-idbi-teal text-[9px] font-medium rounded">{inst.section}</span>
                </div>
                <p className="text-[10px] text-text-secondary mt-0.5 font-hindi">{inst.desc[language] || inst.desc.en}</p>
              </div>
              <div className="text-right ml-2">
                <p className="text-xs font-bold text-idbi-teal">{inst.returns}% p.a.</p>
                {(inst.status === 'active' || startedTax[inst.name]) && (
                  <span className="text-[9px] text-success font-medium">{language === 'hi' ? '✓ चालू' : language === 'kn' ? '✓ ಸಕ್ರಿಯ' : '✓ Active'}</span>
                )}
                {inst.status === 'not_started' && !startedTax[inst.name] && (
                  <button
                    onClick={() => setTaxModal(inst)}
                    className="text-[9px] text-white bg-idbi-orange px-2 py-0.5 rounded-full font-medium hover:bg-idbi-orange-dark transition-colors"
                  >
                    {language === 'hi' ? 'शुरू करें' : language === 'kn' ? 'ಶುರು ಮಾಡಿ' : 'Start'}
                  </button>
                )}
                {inst.status === 'not_eligible' && <span className="text-[9px] text-text-secondary">{language === 'hi' ? 'पात्र नहीं' : language === 'kn' ? 'ಅರ್ಹರಲ್ಲ' : 'Not eligible'}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Active Tax Plans — show details of started investments */}
        {Object.entries(startedTax).length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-[10px] font-semibold text-text-secondary uppercase">
              {language === 'hi' ? 'आपकी चालू कर बचत योजनाएं' : language === 'kn' ? 'ನಿಮ್ಮ ಸಕ್ರಿಯ ತೆರಿಗೆ ಉಳಿತಾಯ ಯೋಜನೆಗಳು' : 'Your Active Tax Saving Plans'}
            </p>
            {Object.entries(startedTax).map(([name, plan]) => (
              <div key={name} className="p-3 bg-success/5 border border-success/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-text-primary">{name}</span>
                  <span className="text-[9px] bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                    {language === 'hi' ? '✓ चालू' : language === 'kn' ? '✓ ಸಕ್ರಿಯ' : '✓ Active'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs font-bold text-text-primary tabular-nums">{formatINR(plan.totalInvested)}</p>
                    <p className="text-[9px] text-text-secondary">{language === 'hi' ? 'कुल निवेश' : language === 'kn' ? 'ಒಟ್ಟು ಹೂಡಿಕೆ' : 'Invested'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-idbi-teal tabular-nums">{formatINR(plan.maturityValue)}</p>
                    <p className="text-[9px] text-text-secondary">{language === 'hi' ? 'परिपक्वता' : language === 'kn' ? 'ಮುಕ್ತಾಯ' : 'Maturity'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-idbi-orange tabular-nums">{formatINR(plan.taxSaved)}</p>
                    <p className="text-[9px] text-text-secondary">{language === 'hi' ? 'कर बचत/वर्ष' : language === 'kn' ? 'ತೆರಿಗೆ ಉಳಿತಾಯ/ವರ್ಷ' : 'Tax Saved/yr'}</p>
                  </div>
                </div>
                <p className="text-[9px] text-text-secondary mt-2 text-center">
                  {plan.frequency !== 'lumpsum'
                    ? `${formatINR(plan.amount)} × ${plan.frequency} × ${plan.years} ${language === 'hi' ? 'वर्ष' : language === 'kn' ? 'ವರ್ಷ' : 'years'} @ ${plan.rate}% p.a.`
                    : `${formatINR(plan.amount)} × ${plan.years} ${language === 'hi' ? 'वर्ष' : language === 'kn' ? 'ವರ್ಷ' : 'years'} @ ${plan.rate}% p.a.`
                  }
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 80C usage summary */}
        <div className="mt-3 p-3 bg-idbi-orange/5 rounded-xl border border-idbi-orange/10">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-text-secondary font-hindi">
              {language === 'hi' ? '80C सीमा उपयोग' : language === 'kn' ? '80C ಮಿತಿ ಬಳಕೆ' : '80C Limit Usage'}
            </span>
            <span className="text-xs font-bold text-idbi-orange">₹34,000 / ₹1,50,000</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill bg-idbi-orange" style={{ width: '22.7%' }} />
          </div>
          <p className="text-[10px] text-text-secondary mt-1.5 font-hindi">
            {language === 'hi' ? '₹1,16,000 और निवेश करें → ₹35,880 कर बचत (30% स्लैब)' :
             language === 'kn' ? '₹1,16,000 ಇನ್ನೂ ಹೂಡಿಕೆ ಮಾಡಿ → ₹35,880 ತೆರಿಗೆ ಉಳಿತಾಯ (30% ಸ್ಲ್ಯಾಬ್)' :
             'Invest ₹1,16,000 more → Save ₹35,880 in tax (30% slab)'}
          </p>
        </div>
      </div>

      {/* Create New Savings Goal Button */}
      <button
        onClick={() => setShowCreate(true)}
        className="w-full py-4 border-2 border-dashed border-idbi-orange/30 rounded-2xl text-sm font-semibold text-idbi-orange hover:border-idbi-orange hover:bg-idbi-orange/5 transition-colors font-hindi"
      >
        + {l('createTitle')}
      </button>

      {/* Tax Investment Modal */}
      {taxModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setTaxModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primary">{taxModal.name}</h3>
              <button onClick={() => setTaxModal(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary">✕</button>
            </div>

            {/* Product Info */}
            <div className="p-3 bg-surface rounded-xl mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">{language === 'hi' ? 'अनुमानित लाभ' : language === 'kn' ? 'ಅಂದಾಜು ಲಾಭ' : 'Expected Returns'}</span>
                <span className="font-bold text-idbi-teal">{taxModal.returns}% p.a.</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-text-secondary">{language === 'hi' ? 'लॉक-इन अवधि' : language === 'kn' ? 'ಲಾಕ್-ಇನ್ ಅವಧಿ' : 'Lock-in Period'}</span>
                <span className="font-bold text-text-primary">{taxModal.lockIn} {language === 'hi' ? 'वर्ष' : language === 'kn' ? 'ವರ್ಷ' : 'years'}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-text-secondary">{language === 'hi' ? 'कर लाभ धारा' : language === 'kn' ? 'ತೆರಿಗೆ ಲಾಭ ಸೆಕ್ಷನ್' : 'Tax Benefit Section'}</span>
                <span className="font-bold text-idbi-orange">{taxModal.section}</span>
              </div>
            </div>

            {/* Investment Amount */}
            <div className="mb-4">
              <label className="text-xs font-medium text-text-secondary mb-1.5 block font-hindi">
                {language === 'hi' ? 'निवेश राशि (₹)' : language === 'kn' ? 'ಹೂಡಿಕೆ ಮೊತ್ತ (₹)' : 'Investment Amount (₹)'}
              </label>
              <input
                type="number"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                placeholder={taxModal.name === 'ELSS' ? '5000' : '50000'}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 tabular-nums"
              />
              {/* Quick amount buttons */}
              <div className="flex gap-2 mt-2">
                {[5000, 10000, 25000, 50000, 100000].map(amt => (
                  <button key={amt} onClick={() => setTaxAmount(String(amt))} className={`px-2 py-1 rounded-lg text-[10px] font-medium ${taxAmount === String(amt) ? 'bg-idbi-teal text-white' : 'bg-surface text-text-secondary'}`}>
                    {formatINR(amt)}
                  </button>
                ))}
              </div>
              <AffordabilityCheck
                amount={parseInt(taxAmount) || 0}
                type={(taxModal?.name === 'PPF' || taxModal?.name === 'ELSS') ? 'recurring' : 'lumpsum'}
                frequency={taxFrequency}
              />
            </div>

            {/* Frequency (for PPF/ELSS) */}
            {(taxModal.name === 'PPF' || taxModal.name === 'ELSS') && (
              <div className="mb-4">
                <label className="text-xs font-medium text-text-secondary mb-1.5 block font-hindi">
                  {language === 'hi' ? 'निवेश आवृत्ति' : language === 'kn' ? 'ಹೂಡಿಕೆ ಆವರ್ತನ' : 'Investment Frequency'}
                </label>
                <div className="flex gap-2">
                  {[
                    { val: 'monthly', label: { hi: 'मासिक', en: 'Monthly', kn: 'ಮಾಸಿಕ' }, mult: 12 },
                    { val: 'quarterly', label: { hi: 'तिमाही', en: 'Quarterly', kn: 'ತ್ರೈಮಾಸಿಕ' }, mult: 4 },
                    { val: 'yearly', label: { hi: 'वार्षिक', en: 'Yearly', kn: 'ವಾರ್ಷಿಕ' }, mult: 1 }
                  ].map(f => (
                    <button key={f.val} onClick={() => setTaxFrequency(f.val)} className={`flex-1 py-2 rounded-lg text-xs font-medium ${taxFrequency === f.val ? 'bg-idbi-teal text-white' : 'bg-surface text-text-primary'}`}>
                      {f.label[language] || f.label.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calculations */}
            {parseInt(taxAmount) > 0 && (() => {
              const amt = parseInt(taxAmount);
              const rate = taxModal.returns / 100;
              const years = taxModal.lockIn;
              const isRecurring = (taxModal.name === 'PPF' || taxModal.name === 'ELSS');
              const freqMult = taxFrequency === 'monthly' ? 12 : taxFrequency === 'quarterly' ? 4 : 1;

              let maturityValue, totalInvested, totalReturns, annualInvestment, taxSaved;

              if (isRecurring) {
                annualInvestment = amt * freqMult;
                totalInvested = annualInvestment * years;
                // FV of recurring: P * [((1+r)^n - 1) / r] * (1+r)
                maturityValue = Math.round(annualInvestment * ((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate));
                totalReturns = maturityValue - totalInvested;
              } else {
                totalInvested = amt;
                maturityValue = Math.round(amt * Math.pow(1 + rate, years));
                totalReturns = maturityValue - totalInvested;
                annualInvestment = amt;
              }

              // Tax saved (assuming 30% slab, max 1.5L under 80C)
              const taxableAmount = Math.min(annualInvestment, taxModal.limit);
              taxSaved = Math.round(taxableAmount * 0.3);

              return (
                <div className="p-4 bg-gradient-to-r from-idbi-teal/5 to-idbi-orange/5 rounded-xl border border-idbi-teal/10 mb-4">
                  <p className="text-[10px] font-semibold text-text-secondary uppercase mb-2">
                    {language === 'hi' ? 'गणना परिणाम' : language === 'kn' ? 'ಲೆಕ್ಕಾಚಾರ ಫಲಿತಾಂಶ' : 'Calculation Results'}
                  </p>
                  <div className="space-y-2">
                    {isRecurring && (
                      <div className="flex justify-between">
                        <span className="text-xs text-text-secondary">{language === 'hi' ? 'वार्षिक निवेश' : language === 'kn' ? 'ವಾರ್ಷಿಕ ಹೂಡಿಕೆ' : 'Annual Investment'}</span>
                        <span className="text-xs font-bold tabular-nums">{formatINR(annualInvestment)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-xs text-text-secondary">{language === 'hi' ? 'कुल निवेश' : language === 'kn' ? 'ಒಟ್ಟು ಹೂಡಿಕೆ' : 'Total Invested'}</span>
                      <span className="text-xs font-bold tabular-nums">{formatINR(totalInvested)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-text-secondary">{language === 'hi' ? 'परिपक्वता मूल्य' : language === 'kn' ? 'ಮುಕ್ತಾಯ ಮೌಲ್ಯ' : 'Maturity Value'}</span>
                      <span className="text-sm font-bold text-idbi-teal tabular-nums">{formatINR(maturityValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-text-secondary">{language === 'hi' ? 'अनुमानित लाभ' : language === 'kn' ? 'ಅಂದಾಜು ಲಾಭ' : 'Estimated Returns'}</span>
                      <span className="text-xs font-bold text-success tabular-nums">{formatINR(totalReturns)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-text-secondary">{language === 'hi' ? 'वार्षिक कर बचत' : language === 'kn' ? 'ವಾರ್ಷಿಕ ತೆರಿಗೆ ಉಳಿತಾಯ' : 'Annual Tax Saved'}</span>
                      <span className="text-sm font-bold text-idbi-orange tabular-nums">{formatINR(taxSaved)}</span>
                    </div>
                    <p className="text-[9px] text-text-secondary">
                      {language === 'hi' ? `(30% कर स्लैब पर, ${taxModal.section} के तहत)` :
                       language === 'kn' ? `(30% ತೆರಿಗೆ ಸ್ಲ್ಯಾಬ್‌ನಲ್ಲಿ, ${taxModal.section} ಅಡಿ)` :
                       `(At 30% tax slab, under ${taxModal.section})`}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Confirm Button */}
            <div className="flex gap-3">
              <button onClick={() => setTaxModal(null)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-medium text-text-secondary">
                {language === 'hi' ? 'रद्द करें' : language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  const amt = parseInt(taxAmount);
                  const rate = taxModal.returns / 100;
                  const years = taxModal.lockIn;
                  const isRecurring = (taxModal.name === 'PPF' || taxModal.name === 'ELSS');
                  const freqMult = taxFrequency === 'monthly' ? 12 : taxFrequency === 'quarterly' ? 4 : 1;
                  let maturityValue, totalInvested, annualInvestment;
                  if (isRecurring) {
                    annualInvestment = amt * freqMult;
                    totalInvested = annualInvestment * years;
                    maturityValue = Math.round(annualInvestment * ((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate));
                  } else {
                    totalInvested = amt;
                    maturityValue = Math.round(amt * Math.pow(1 + rate, years));
                    annualInvestment = amt;
                  }
                  const taxSaved = Math.round(Math.min(annualInvestment, taxModal.limit) * 0.3);

                  setStartedTax(prev => ({
                    ...prev,
                    [taxModal.name]: {
                      amount: amt,
                      frequency: isRecurring ? taxFrequency : 'lumpsum',
                      annualInvestment,
                      totalInvested,
                      maturityValue,
                      returns: maturityValue - totalInvested,
                      taxSaved,
                      years,
                      rate: taxModal.returns
                    }
                  }));
                  setTaxModal(null);
                  setTaxAmount('');
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 4000);
                }}
                disabled={!parseInt(taxAmount)}
                className="flex-1 py-3 rounded-full bg-idbi-teal text-white text-sm font-semibold disabled:opacity-40"
              >
                {language === 'hi' ? 'निवेश शुरू करें' : language === 'kn' ? 'ಹೂಡಿಕೆ ಶುರು ಮಾಡಿ' : 'Start Investment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Savings Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary font-hindi">{l('createTitle')}</h3>
                <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary">✕</button>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block font-hindi">{l('purpose')}</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={l('purposePlaceholder')}
                  className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 font-hindi"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {purposeSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setPurpose(s.label[language] || s.label.en)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                        purpose === (s.label[language] || s.label.en)
                          ? 'bg-idbi-teal text-white'
                          : 'bg-surface text-text-secondary hover:bg-gray-100'
                      }`}
                    >
                      {s.icon} {s.label[language] || s.label.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block font-hindi">{l('amount')}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 tabular-nums"
                />
                <AffordabilityCheck amount={parseInt(amount) || 0} type="recurring" frequency={selectedFrequency} />
              </div>

              {/* Frequency */}
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block font-hindi">{l('frequency')}</label>
                <div className="flex flex-wrap gap-1.5">
                  {frequencies.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setSelectedFrequency(f.value)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                        selectedFrequency === f.value
                          ? 'bg-idbi-teal text-white'
                          : 'bg-surface text-text-primary hover:bg-gray-100'
                      }`}
                    >
                      {f.label[language] || f.label.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-text-secondary font-hindi">{l('tenure')}</label>
                  <span className="text-sm font-bold text-idbi-teal tabular-nums">{tenure} {l('tenureYears')}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={tenure}
                  onChange={(e) => setTenure(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-idbi-teal"
                />
                <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                </div>
              </div>

              {/* Projection Card */}
              {projection && numAmount > 0 && (
                <div className="bg-gradient-to-r from-idbi-teal/5 to-idbi-orange/5 rounded-xl p-4 border border-idbi-teal/10">
                  <p className="text-xs text-text-secondary mb-2">{l('rate')}: 7.5% p.a.</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-idbi-teal tabular-nums">{formatINR(projection.futureValue)}</p>
                      <p className="text-[10px] text-text-secondary font-hindi">{l('projection')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary tabular-nums">{formatINR(projection.totalInvested)}</p>
                      <p className="text-[10px] text-text-secondary font-hindi">{l('invested')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-success tabular-nums">{formatINR(projection.totalReturns)}</p>
                      <p className="text-[10px] text-text-secondary font-hindi">{l('returns')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-medium text-text-secondary font-hindi">
                  {l('cancel')}
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!purpose || !numAmount}
                  className="flex-1 py-3 rounded-full bg-idbi-teal text-white text-sm font-semibold disabled:opacity-40 font-hindi"
                >
                  {l('start')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
