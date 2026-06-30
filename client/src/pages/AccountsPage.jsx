import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatINR } from '../utils/formatCurrency';

const labels = {
  title: { hi: 'मेरे खाते', en: 'My Accounts', kn: 'ನನ್ನ ಖಾತೆಗಳು' },
  subtitle: { hi: 'सभी खातों का एक जगह दृश्य', en: 'All accounts in one place', kn: 'ಎಲ್ಲಾ ಖಾತೆಗಳು ಒಂದೇ ಕಡೆ' },
  idbiAccounts: { hi: 'IDBI ಖಾತೆ�ಳು', en: 'IDBI Accounts', kn: 'IDBI ಖಾತೆಗಳು' },
  linkedAccounts: { hi: 'मेरा निवेश Portfolio', en: 'My Investment Portfolio', kn: 'ನನ್ನ ಹೂಡಿಕೆ Portfolio' },
  addIdbi: { hi: '+ IDBI खाता जोड़ें', en: '+ Add IDBI Account', kn: '+ IDBI ಖಾತೆ ಸೇರಿಸಿ' },
  addExternal: { hi: '+ निवेश / खाता जोड़ें', en: '+ Add Investment / Account', kn: '+ ಹೂಡಿಕೆ / ಖಾತೆ ಸೇರಿಸಿ' },
  totalWealth: { hi: 'कुल संपत्ति', en: 'Total Wealth', kn: 'ಒಟ್ಟು ಸಂಪತ್ತು' },
  savings: { hi: 'बचत खाता', en: 'Savings Account', kn: 'ಉಳಿತಾಯ ಖಾತೆ' },
  current: { hi: 'चालू खाता', en: 'Current Account', kn: 'ಚಾಲ್ತಿ ಖಾತೆ' },
  fd: { hi: 'FD', en: 'FD', kn: 'FD' },
  rd: { hi: 'RD', en: 'RD', kn: 'RD' },
  loan: { hi: 'ऋण', en: 'Loan', kn: 'ಸಾಲ' },
  mf: { hi: 'Mutual Fund', en: 'Mutual Fund', kn: 'Mutual Fund' },
  ppf: { hi: 'PPF', en: 'PPF', kn: 'PPF' },
  nps: { hi: 'NPS', en: 'NPS', kn: 'NPS' },
  stocks: { hi: 'शेयर', en: 'Stocks', kn: 'ಷೇರುಗಳು' },
  epf: { hi: 'EPF', en: 'EPF', kn: 'EPF' },
  linked: { hi: 'जुड़ा हुआ', en: 'Linked', kn: 'ಲಿಂಕ್ ಆಗಿದೆ' },
  linkNow: { hi: 'अभी जोड़ें', en: 'Link Now', kn: 'ಈಗ ಲಿಂಕ್ ಮಾಡಿ' },
  remove: { hi: 'हटाएं', en: 'Remove', kn: 'ತೆಗೆಯಿರಿ' },
  consentNote: { hi: 'आपका डेटा RBI अनुमोदित खाता एग्रीगेटर से सुरक्षित रूप से प्राप्त होता है।', en: 'Your data is securely fetched via RBI-approved Account Aggregator framework.', kn: 'ನಿಮ್ಮ ಡೇಟಾ RBI ಅನುಮೋದಿತ ಖಾತೆ ಒಟ್ಟುಗೂಡಿಕೆ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ಪಡೆಯಲಾಗುತ್ತದೆ.' },
  selectType: { hi: 'खाता प्रकार चुनें', en: 'Select Account Type', kn: 'ಖಾತೆ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ' },
  selectBank: { hi: 'बैंक / संस्था चुनें', en: 'Select Institution', kn: 'ಸಂಸ್ಥೆ ಆಯ್ಕೆಮಾಡಿ' },
  accountNumber: { hi: 'खाता संख्या', en: 'Account Number', kn: 'ಖಾತೆ ಸಂಖ್ಯೆ' },
  linkSuccess: { hi: '✓ खाता सफलतापूर्वक जोड़ा गया!', en: '✓ Account linked successfully!', kn: '✓ ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ಲಿಂಕ್ ಆಗಿದೆ!' },
  cancel: { hi: 'रद्द करें', en: 'Cancel', kn: 'ರದ್ದುಮಾಡಿ' },
  confirm: { hi: 'जोड़ें', en: 'Link', kn: 'ಲಿಂಕ್ ಮಾಡಿ' }
};

// Mock IDBI accounts
const idbiAccountsData = [
  { id: 'idbi-1', type: 'savings', name: 'Savings Account', number: 'XXXX-XXXX-4521', balance: 87500, icon: '🏦' },
  { id: 'idbi-2', type: 'rd', name: 'RD - 12 Month', number: 'RD-0012456', balance: 103000, icon: '📅' },
  { id: 'idbi-3', type: 'fd', name: 'Tax Saving FD', number: 'FD-0098712', balance: 38500, icon: '🔒' },
  { id: 'idbi-4', type: 'loan', name: 'Home Loan', number: 'HL-2024-001', balance: -1850000, icon: '🏠' }
];

// External accounts (some linked, some suggestions)
const externalBanks = [
  // Public Sector Banks
  { id: 'sbi', name: 'SBI', logo: '🏛️', category: 'bank' },
  { id: 'bob', name: 'Bank of Baroda', logo: '🏛️', category: 'bank' },
  { id: 'pnb', name: 'PNB', logo: '🏛️', category: 'bank' },
  { id: 'canara', name: 'Canara Bank', logo: '🏛️', category: 'bank' },
  { id: 'union', name: 'Union Bank', logo: '🏛️', category: 'bank' },
  { id: 'iob', name: 'Indian Overseas Bank', logo: '🏛️', category: 'bank' },
  { id: 'boi', name: 'Bank of India', logo: '🏛️', category: 'bank' },
  { id: 'central', name: 'Central Bank', logo: '🏛️', category: 'bank' },
  { id: 'indian', name: 'Indian Bank', logo: '🏛️', category: 'bank' },
  { id: 'uco', name: 'UCO Bank', logo: '🏛️', category: 'bank' },
  { id: 'bom', name: 'Bank of Maharashtra', logo: '🏛️', category: 'bank' },
  { id: 'psb', name: 'Punjab & Sind Bank', logo: '🏛️', category: 'bank' },
  // Private Banks
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏛️', category: 'bank' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏛️', category: 'bank' },
  { id: 'axis', name: 'Axis Bank', logo: '🏛️', category: 'bank' },
  { id: 'kotak', name: 'Kotak Mahindra', logo: '🏛️', category: 'bank' },
  { id: 'indusind', name: 'IndusInd Bank', logo: '🏛️', category: 'bank' },
  { id: 'yes', name: 'Yes Bank', logo: '🏛️', category: 'bank' },
  { id: 'idfcfb', name: 'IDFC First Bank', logo: '🏛️', category: 'bank' },
  { id: 'federal', name: 'Federal Bank', logo: '🏛️', category: 'bank' },
  { id: 'rbl', name: 'RBL Bank', logo: '🏛️', category: 'bank' },
  { id: 'bandhan', name: 'Bandhan Bank', logo: '🏛️', category: 'bank' },
  { id: 'csb', name: 'CSB Bank', logo: '🏛️', category: 'bank' },
  { id: 'kvb', name: 'Karur Vysya Bank', logo: '🏛️', category: 'bank' },
  { id: 'cub', name: 'City Union Bank', logo: '🏛️', category: 'bank' },
  { id: 'south', name: 'South Indian Bank', logo: '🏛️', category: 'bank' },
  { id: 'dcb', name: 'DCB Bank', logo: '🏛️', category: 'bank' },
  // Small Finance & Payments
  { id: 'au', name: 'AU Small Finance', logo: '🏛️', category: 'bank' },
  { id: 'equitas', name: 'Equitas SFB', logo: '🏛️', category: 'bank' },
  { id: 'ujjivan', name: 'Ujjivan SFB', logo: '🏛️', category: 'bank' },
  { id: 'paytm', name: 'Paytm Payments Bank', logo: '🏛️', category: 'bank' },
  { id: 'airtel', name: 'Airtel Payments Bank', logo: '🏛️', category: 'bank' },
  // Investment Platforms
  { id: 'zerodha', name: 'Zerodha', logo: '📈', category: 'invest' },
  { id: 'groww', name: 'Groww', logo: '📈', category: 'invest' },
  { id: 'kuvera', name: 'Kuvera', logo: '📈', category: 'invest' },
  { id: 'coin', name: 'Coin (Zerodha)', logo: '📈', category: 'invest' },
  { id: 'upstox', name: 'Upstox', logo: '📈', category: 'invest' },
  { id: 'angelone', name: 'Angel One', logo: '📈', category: 'invest' },
  { id: 'motilal', name: 'Motilal Oswal', logo: '📈', category: 'invest' },
  { id: 'icici_direct', name: 'ICICI Direct', logo: '📈', category: 'invest' },
  { id: 'hdfc_sec', name: 'HDFC Securities', logo: '📈', category: 'invest' },
  { id: 'parag', name: 'Parag Parikh MF', logo: '📈', category: 'invest' },
  // Digital Gold
  { id: 'augmont', name: 'Augmont Gold', logo: '🥇', category: 'invest', subtype: 'digigold' },
  { id: 'safegold', name: 'SafeGold', logo: '🥇', category: 'invest', subtype: 'digigold' },
  { id: 'mmtc_pamp', name: 'MMTC-PAMP', logo: '🥇', category: 'invest', subtype: 'digigold' },
  { id: 'paytm_gold', name: 'Paytm Gold', logo: '🥇', category: 'invest', subtype: 'digigold' },
  { id: 'phonepe_gold', name: 'PhonePe Gold', logo: '🥇', category: 'invest', subtype: 'digigold' },
  { id: 'gpay_gold', name: 'Google Pay Gold', logo: '🥇', category: 'invest', subtype: 'digigold' },
  { id: 'jar_gold', name: 'Jar (Digital Gold)', logo: '🥇', category: 'invest', subtype: 'digigold' },
  // Bonds
  { id: 'goldbond', name: 'RBI Gold Bond (SGB)', logo: '🏛️', category: 'invest', subtype: 'bonds' },
  { id: 'corpbond', name: 'Corporate Bonds', logo: '📄', category: 'invest', subtype: 'bonds' },
  { id: 'taxfree', name: 'Tax-Free Bonds', logo: '📄', category: 'invest', subtype: 'bonds' },
  { id: 'govtsec', name: 'Govt Securities (G-Sec)', logo: '🏛️', category: 'invest', subtype: 'bonds' },
  { id: 'rbi54ec', name: '54EC Capital Gain Bond', logo: '📄', category: 'invest', subtype: 'bonds' },
  { id: 'wint', name: 'Wint Wealth', logo: '📄', category: 'invest', subtype: 'bonds' },
  { id: 'grip', name: 'Grip Invest', logo: '📄', category: 'invest', subtype: 'bonds' },
  // Government Schemes
  { id: 'epfo', name: 'EPFO', logo: '👷', category: 'govt' },
  { id: 'nps', name: 'NPS (PFRDA)', logo: '🧓', category: 'govt' },
  { id: 'kvp', name: 'KVP / NSC', logo: '📜', category: 'govt' },
  { id: 'sukanya', name: 'Sukanya Samriddhi', logo: '👧', category: 'govt' },
  { id: 'sgb', name: 'Sovereign Gold Bond', logo: '🥇', category: 'govt' },
  { id: 'scss', name: 'Senior Citizen Savings', logo: '🧓', category: 'govt' },
  { id: 'ppf_ext', name: 'PPF (Other Bank)', logo: '🏦', category: 'govt' },
  { id: 'pm_vaya', name: 'PM Vaya Vandana', logo: '🛡️', category: 'govt' }
];

const accountTypes = [
  { value: 'savings', label: { hi: 'बैंक खाता', en: 'Bank Account', kn: 'ಬ್ಯಾಂಕ್ ಖಾತೆ' } },
  { value: 'fd', label: { hi: 'FD', en: 'Fixed Deposit', kn: 'FD' } },
  { value: 'mf', label: { hi: 'Mutual Fund', en: 'Mutual Fund', kn: 'Mutual Fund' } },
  { value: 'stocks', label: { hi: 'शेयर / Demat', en: 'Stocks / Demat', kn: 'ಷೇರು / Demat' } },
  { value: 'ppf', label: { hi: 'PPF', en: 'PPF', kn: 'PPF' } },
  { value: 'nps', label: { hi: 'NPS', en: 'NPS', kn: 'NPS' } },
  { value: 'epf', label: { hi: 'EPF', en: 'EPF', kn: 'EPF' } },
  { value: 'bonds', label: { hi: 'बॉण्ड', en: 'Bonds', kn: 'ಬಾಂಡ್' } },
  { value: 'govt', label: { hi: 'सरकारी योजना', en: 'Govt Scheme', kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆ' } },
  { value: 'loan', label: { hi: 'ऋण', en: 'Loan', kn: 'ಸಾಲ' } },
  { value: 'other', label: { hi: 'अन्य', en: 'Other', kn: 'ಇತರ' } }
];

const insuranceIcons = { health: '🏥', vehicle: '🚗', term: '🛡️', home: '🏠', travel: '✈️', life: '❤️' };

const insuranceTypeLabels = {
  health: { hi: 'स्वास्थ्य बीमा', en: 'Health Insurance', kn: 'ಆರೋಗ್ಯ ವಿಮೆ' },
  vehicle: { hi: 'वाहन बीमा', en: 'Vehicle Insurance', kn: 'ವಾಹನ ವಿಮೆ' },
  term: { hi: 'टर्म बीमा', en: 'Term Life Insurance', kn: 'ಟರ್ಮ್ ಜೀವ ವಿಮೆ' },
  home: { hi: 'गृह बीमा', en: 'Home Insurance', kn: 'ಗೃಹ ವಿಮೆ' },
  travel: { hi: 'यात्रा बीमा', en: 'Travel Insurance', kn: 'ಪ್ರಯಾಣ ವಿಮೆ' },
  life: { hi: 'जीवन बीमा', en: 'Life Insurance', kn: 'ಜೀವ ವಿಮೆ' }
};

export default function AccountsPage() {
  const { language } = useLanguage();
  const [linkedExternal, setLinkedExternal] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [bankFilter, setBankFilter] = useState('all');

  // Insurance state
  const [insurances, setInsurances] = useState([]);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [insType, setInsType] = useState('');
  const [insProvider, setInsProvider] = useState('');
  const [insPolicyNum, setInsPolicyNum] = useState('');
  const [insCover, setInsCover] = useState('');
  const [insPremium, setInsPremium] = useState('');
  const [insPremiumFreq, setInsPremiumFreq] = useState('yearly');
  const [insExpiry, setInsExpiry] = useState('');
  const [insMembers, setInsMembers] = useState('');

  // Other Income state
  const [otherIncome, setOtherIncome] = useState([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incSource, setIncSource] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incFrequency, setIncFrequency] = useState('monthly');
  const [incNotes, setIncNotes] = useState('');

  // Physical Assets state
  const [assets, setAssets] = useState([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetType, setAssetType] = useState('');
  const [assetDesc, setAssetDesc] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetNotes, setAssetNotes] = useState('');

  // Fetch linked portfolio from backend on mount
  useEffect(() => {
    fetch('/api/data/portfolio-linked').then(res => res.json()).then(setLinkedExternal).catch(console.error);
    fetch('/api/data/insurances').then(res => res.json()).then(setInsurances).catch(console.error);
    fetch('/api/data/other-income').then(res => res.json()).then(setOtherIncome).catch(console.error);
    fetch('/api/data/assets').then(res => res.json()).then(setAssets).catch(console.error);
  }, []);

  const l = (key) => labels[key]?.[language] || labels[key]?.en || key;
  const navigate = useNavigate();

  const totalIdbi = idbiAccountsData.reduce((sum, a) => sum + (a.balance > 0 ? a.balance : 0), 0);
  const totalExternal = linkedExternal.reduce((sum, a) => sum + (a.balance > 0 ? a.balance : 0), 0);
  const totalAssets = assets.reduce((sum, a) => sum + (a.estimatedValue || 0), 0);
  const totalOtherIncome = otherIncome.reduce((sum, i) => sum + (i.amount || 0), 0) * 12; // annualized
  const totalWealth = totalIdbi + totalExternal + totalAssets;

  const handleLink = async () => {
    if (!selectedBank) return;
    const bank = externalBanks.find(b => b.id === selectedBank);
    const identifier = accountNum || upiId || panNumber || mobileNum || 'XXXX-' + Math.floor(Math.random() * 9000 + 1000);
    const newItem = {
      bank: bank?.name || selectedBank,
      type: bank?.category || 'other',
      number: identifier.length > 8 ? 'XXXX-' + identifier.slice(-4) : identifier,
      balance: Math.floor(Math.random() * 200000) + 10000,
      icon: bank?.logo || '🏦'
    };

    try {
      const res = await fetch('/api/data/portfolio-linked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const data = await res.json();
      if (data.success) {
        setLinkedExternal(prev => [data.item, ...prev]);
      }
    } catch {
      newItem.id = `ext-${Date.now()}`;
      setLinkedExternal(prev => [newItem, ...prev]);
    }

    setShowAddModal(false);
    setSelectedBank('');
    setSelectedType('');
    setAccountNum('');
    setIfscCode('');
    setUpiId('');
    setPanNumber('');
    setMobileNum('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const removeExternal = async (id) => {
    try { await fetch(`/api/data/portfolio-linked/${id}`, { method: 'DELETE' }); } catch {}
    setLinkedExternal(prev => prev.filter(a => a.id !== id));
  };

  const addInsurance = async () => {
    const newIns = {
      type: insType, provider: insProvider, policyNumber: insPolicyNum,
      coverAmount: parseInt(insCover) || 0, premium: parseInt(insPremium) || 0,
      premiumFrequency: insPremiumFreq, expiryDate: insExpiry, members: insMembers
    };
    try {
      const res = await fetch('/api/data/insurances', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newIns) });
      const data = await res.json();
      if (data.success) setInsurances(prev => [data.insurance, ...prev]);
    } catch { newIns.id = `ins-${Date.now()}`; setInsurances(prev => [newIns, ...prev]); }
    setShowInsuranceModal(false);
    setInsType(''); setInsProvider(''); setInsPolicyNum(''); setInsCover(''); setInsPremium(''); setInsExpiry(''); setInsMembers('');
    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000);
  };

  const removeInsurance = async (id) => {
    try { await fetch(`/api/data/insurances/${id}`, { method: 'DELETE' }); } catch {}
    setInsurances(prev => prev.filter(i => i.id !== id));
  };

  const addOtherIncome = async () => {
    const newInc = { source: incSource, amount: parseInt(incAmount) || 0, frequency: incFrequency, notes: incNotes };
    try {
      const res = await fetch('/api/data/other-income', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newInc) });
      const data = await res.json();
      if (data.success) setOtherIncome(prev => [data.income, ...prev]);
    } catch { newInc.id = `inc-${Date.now()}`; setOtherIncome(prev => [newInc, ...prev]); }
    setShowIncomeModal(false);
    setIncSource(''); setIncAmount(''); setIncFrequency('monthly'); setIncNotes('');
    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000);
  };

  const removeOtherIncome = async (id) => {
    try { await fetch(`/api/data/other-income/${id}`, { method: 'DELETE' }); } catch {}
    setOtherIncome(prev => prev.filter(i => i.id !== id));
  };

  const addAsset = async () => {
    const newAsset = { type: assetType, description: assetDesc, estimatedValue: parseInt(assetValue) || 0, notes: assetNotes };
    try {
      const res = await fetch('/api/data/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAsset) });
      const data = await res.json();
      if (data.success) setAssets(prev => [data.asset, ...prev]);
    } catch { newAsset.id = `asset-${Date.now()}`; setAssets(prev => [newAsset, ...prev]); }
    setShowAssetModal(false);
    setAssetType(''); setAssetDesc(''); setAssetValue(''); setAssetNotes('');
    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000);
  };

  const removeAsset = async (id) => {
    try { await fetch(`/api/data/assets/${id}`, { method: 'DELETE' }); } catch {}
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-xs text-idbi-teal font-medium mb-2">
          ← {language === 'hi' ? 'होम' : language === 'kn' ? 'ಮುಖಪುಟ' : 'Home'}
        </button>
        <h2 className="text-lg font-bold text-text-primary font-hindi">{l('title')}</h2>
        <p className="text-xs text-text-secondary font-hindi">{l('subtitle')}</p>
      </div>

      {/* Total Wealth Card */}
      <div className="card p-4 bg-gradient-to-r from-idbi-teal to-idbi-teal-dark text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs opacity-80">{l('totalWealth')}</p>
            <p className="text-2xl font-bold tabular-nums mt-1">{formatINR(totalWealth)}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[10px] opacity-70">IDBI: {formatINR(totalIdbi)}</p>
            <p className="text-[10px] opacity-70">Portfolio: {formatINR(totalExternal)}</p>
            {totalAssets > 0 && <p className="text-[10px] opacity-70">{language === 'hi' ? 'संपत्ति' : language === 'kn' ? 'ಆಸ್ತಿ' : 'Assets'}: {formatINR(totalAssets)}</p>}
            {totalOtherIncome > 0 && <p className="text-[10px] opacity-70">{language === 'hi' ? 'अन्य आय' : language === 'kn' ? 'ಇತರ ಆದಾಯ' : 'Other Income'}: {formatINR(totalOtherIncome)}/{language === 'hi' ? 'वर्ष' : language === 'kn' ? 'ವರ್ಷ' : 'yr'}</p>}
          </div>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-sm text-success font-medium text-center animate-slide-up font-hindi">
          {l('linkSuccess')}
        </div>
      )}

      {/* IDBI Accounts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-text-primary">{l('idbiAccounts')}</p>
        </div>
        <div className="space-y-2">
          {idbiAccountsData.map(account => (
            <div key={account.id} className="card p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{account.icon}</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">{account.name}</p>
                  <p className="text-[11px] text-text-secondary">{account.number}</p>
                </div>
              </div>
              <p className={`text-sm font-bold tabular-nums ${account.balance < 0 ? 'text-red-500' : 'text-idbi-teal'}`}>
                {formatINR(account.balance)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* My Investment Portfolio */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-text-primary">{l('linkedAccounts')}</p>
          <button onClick={() => { setAddType('external'); setShowAddModal(true); }} className="text-xs text-idbi-orange font-medium">
            {l('addExternal')}
          </button>
        </div>
        {linkedExternal.length > 0 ? (
          <div className="space-y-2">
            {linkedExternal.map(account => (
              <div key={account.id} className="card p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{account.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{account.bank} — {account.type.toUpperCase()}</p>
                    <p className="text-[11px] text-text-secondary">{account.number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold tabular-nums text-text-primary">{formatINR(account.balance)}</p>
                  <button onClick={() => removeExternal(account.id)} className="text-[10px] text-red-400 hover:text-red-600">✕</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-4 text-center">
            <p className="text-sm text-text-secondary font-hindi">{l('addExternal')}</p>
          </div>
        )}
      </div>

      {/* My Insurances */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-text-primary">
            {language === 'hi' ? 'मेरी बीमा पॉलिसी' : language === 'kn' ? 'ನನ್ನ ವಿಮೆ ಪಾಲಿಸಿ' : 'My Insurances'}
          </p>
          <button onClick={() => setShowInsuranceModal(true)} className="text-xs text-idbi-orange font-medium">
            {language === 'hi' ? '+ बीमा जोड़ें' : language === 'kn' ? '+ ವಿಮೆ ಸೇರಿಸಿ' : '+ Add Insurance'}
          </button>
        </div>
        {insurances.length > 0 ? (
          <div className="space-y-2">
            {insurances.map(ins => (
              <div key={ins.id} className="card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{insuranceIcons[ins.type] || '📋'}</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{insuranceTypeLabels[ins.type]?.[language] || ins.type}</p>
                      <p className="text-[10px] text-text-secondary">{ins.provider} • {ins.policyNumber}</p>
                    </div>
                  </div>
                  <button onClick={() => removeInsurance(ins.id)} className="text-[10px] text-red-400 hover:text-red-600">✕</button>
                </div>
                <div className="flex gap-3 mt-2 pt-2 border-t border-gray-50">
                  <div>
                    <p className="text-[9px] text-text-secondary">{language === 'hi' ? 'कवर' : language === 'kn' ? 'ಕವರ್' : 'Cover'}</p>
                    <p className="text-xs font-bold text-idbi-teal tabular-nums">{formatINR(ins.coverAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-secondary">{language === 'hi' ? 'प्रीमियम' : language === 'kn' ? 'ಪ್ರೀಮಿಯಂ' : 'Premium'}</p>
                    <p className="text-xs font-semibold tabular-nums">{formatINR(ins.premium)}/{ins.premiumFrequency === 'yearly' ? (language === 'hi' ? 'वर्ष' : language === 'kn' ? 'ವರ್ಷ' : 'yr') : (language === 'hi' ? 'माह' : language === 'kn' ? 'ತಿಂಗಳು' : 'mo')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-secondary">{language === 'hi' ? 'समाप्ति' : language === 'kn' ? 'ಮುಕ್ತಾಯ' : 'Expires'}</p>
                    <p className="text-xs font-semibold">{ins.expiryDate}</p>
                  </div>
                </div>
                {ins.members && <p className="text-[10px] text-text-secondary mt-1">{ins.members}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-4 text-center">
            <p className="text-sm text-text-secondary font-hindi">
              {language === 'hi' ? 'कोई बीमा नहीं जोड़ी — जोड़ने के लिए ऊपर "+" दबाएं' : language === 'kn' ? 'ಯಾವುದೇ ವಿಮೆ ಸೇರಿಸಲಾಗಿಲ್ಲ — ಸೇರಿಸಲು "+" ಒತ್ತಿ' : 'No insurance added — tap "+" above to add'}
            </p>
          </div>
        )}
      </div>

      {/* My Assets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-text-primary">
            {language === 'hi' ? 'मेरी संपत्ति' : language === 'kn' ? 'ನನ್ನ ಆಸ್ತಿಗಳು' : 'My Assets'}
          </p>
          <button onClick={() => setShowAssetModal(true)} className="text-xs text-idbi-orange font-medium">
            {language === 'hi' ? '+ संपत्ति जोड़ें' : language === 'kn' ? '+ ಆಸ್ತಿ ಸೇರಿಸಿ' : '+ Add Asset'}
          </button>
        </div>
        {assets.length > 0 ? (
          <div className="space-y-2">
            {assets.map(asset => (
              <div key={asset.id} className="card p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{
                    asset.type === 'property' ? '🏠' :
                    asset.type === 'gold' ? '🥇' :
                    asset.type === 'silver' ? '🥈' :
                    asset.type === 'land' ? '🌍' :
                    asset.type === 'cash' ? '💵' :
                    asset.type === 'vehicle' ? '🚗' :
                    '📦'
                  }</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{asset.description}</p>
                    <p className="text-xs text-text-secondary">
                      {asset.type === 'property' ? (language === 'hi' ? 'संपत्ति' : language === 'kn' ? 'ಆಸ್ತಿ' : 'Property') :
                       asset.type === 'gold' ? (language === 'hi' ? 'सोना' : language === 'kn' ? 'ಚಿನ್ನ' : 'Gold') :
                       asset.type === 'silver' ? (language === 'hi' ? 'चाँदी' : language === 'kn' ? 'ಬೆಳ್ಳಿ' : 'Silver') :
                       asset.type === 'land' ? (language === 'hi' ? 'ज़मीन' : language === 'kn' ? 'ಭೂಮಿ' : 'Land') :
                       asset.type === 'cash' ? (language === 'hi' ? 'नकद' : language === 'kn' ? 'ನಗದು' : 'Cash') :
                       asset.type === 'vehicle' ? (language === 'hi' ? 'वाहन' : language === 'kn' ? 'ವಾಹನ' : 'Vehicle') :
                       (language === 'hi' ? 'अन्य' : language === 'kn' ? 'ಇತರ' : 'Other')}
                      {asset.notes ? ` • ${asset.notes}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold tabular-nums text-idbi-teal">{formatINR(asset.estimatedValue)}</p>
                  <button onClick={() => removeAsset(asset.id)} className="text-[10px] text-red-400 hover:text-red-600">✕</button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center px-1 pt-1">
              <span className="text-xs text-text-secondary">
                {language === 'hi' ? 'कुल संपत्ति मूल्य (अनुमानित)' : language === 'kn' ? 'ಒಟ್ಟು ಆಸ್ತಿ ಮೌಲ್ಯ (ಅಂದಾಜು)' : 'Total asset value (estimated)'}
              </span>
              <span className="text-xs font-bold text-idbi-teal tabular-nums">{formatINR(assets.reduce((s, a) => s + (a.estimatedValue || 0), 0))}</span>
            </div>
          </div>
        ) : (
          <div className="card p-4 text-center">
            <p className="text-xs text-text-secondary font-hindi">
              {language === 'hi' ? 'संपत्ति, सोना, ज़मीन, वाहन — कुछ भी जोड़ें' :
               language === 'kn' ? 'ಆಸ್ತಿ, ಚಿನ್ನ, ಭೂಮಿ, ವಾಹನ — ಏನು ಬೇಕಾದರೂ ಸೇರಿಸಿ' :
               'Add properties, gold, land, vehicles — any physical asset'}
            </p>
          </div>
        )}
      </div>

      {/* My Other Income */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-text-primary">
            {language === 'hi' ? 'मेरी अन्य आय' : language === 'kn' ? 'ನನ್ನ ಇತರ ಆದಾಯ' : 'My Other Income'}
          </p>
          <button onClick={() => setShowIncomeModal(true)} className="text-xs text-idbi-orange font-medium">
            {language === 'hi' ? '+ आय जोड़ें' : language === 'kn' ? '+ ಆದಾಯ ಸೇರಿಸಿ' : '+ Add Income'}
          </button>
        </div>
        {otherIncome.length > 0 ? (
          <div className="space-y-2">
            {otherIncome.map(inc => (
              <div key={inc.id} className="card p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{
                    inc.source?.toLowerCase().includes('shop') ? '🏪' :
                    inc.source?.toLowerCase().includes('agri') || inc.source?.toLowerCase().includes('farm') ? '🌾' :
                    inc.source?.toLowerCase().includes('rent') ? '🏠' :
                    inc.source?.toLowerCase().includes('free') || inc.source?.toLowerCase().includes('consult') ? '💼' :
                    inc.source?.toLowerCase().includes('tutor') || inc.source?.toLowerCase().includes('teach') ? '📚' :
                    '💵'
                  }</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{inc.source}</p>
                    <p className="text-[10px] text-text-secondary">
                      {inc.frequency === 'monthly' ? (language === 'hi' ? 'मासिक' : language === 'kn' ? 'ಮಾಸಿಕ' : 'Monthly') :
                       inc.frequency === 'weekly' ? (language === 'hi' ? 'साप्ताहिक' : language === 'kn' ? 'ವಾರಕ್ಕೊಮ್ಮೆ' : 'Weekly') :
                       inc.frequency === 'seasonal' ? (language === 'hi' ? 'मौसमी' : language === 'kn' ? 'ಋತುಮಾನಿಕ' : 'Seasonal') :
                       (language === 'hi' ? 'वार्षिक' : language === 'kn' ? 'ವಾರ್ಷಿಕ' : 'Yearly')}
                      {inc.notes ? ` • ${inc.notes}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold tabular-nums text-idbi-teal">{formatINR(inc.amount)}</p>
                  <button onClick={() => removeOtherIncome(inc.id)} className="text-[10px] text-red-400 hover:text-red-600">✕</button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center px-1 pt-1">
              <span className="text-[10px] text-text-secondary">
                {language === 'hi' ? 'अनुमानित कुल अतिरिक्त आय' : language === 'kn' ? 'ಅಂದಾಜು ಒಟ್ಟು ಹೆಚ್ಚುವರಿ ಆದಾಯ' : 'Est. total additional income'}
              </span>
              <span className="text-xs font-bold text-idbi-teal tabular-nums">
                {formatINR(otherIncome.reduce((s, i) => s + (i.amount || 0), 0))}/{language === 'hi' ? 'माह' : language === 'kn' ? 'ತಿಂಗಳು' : 'mo'}
              </span>
            </div>
          </div>
        ) : (
          <div className="card p-4 text-center">
            <p className="text-xs text-text-secondary font-hindi">
              {language === 'hi' ? 'दुकान, खेती, किराया, फ्रीलांस — कोई भी अतिरिक्त आय यहाँ जोड़ें' :
               language === 'kn' ? 'ಅಂಗಡಿ, ಕೃಷಿ, ಬಾಡಿಗೆ, ಫ್ರೀಲ್ಯಾನ್ಸ್ — ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಆದಾಯ ಇಲ್ಲಿ ಸೇರಿಸಿ' :
               'Add any additional income — shop, farming, rent, freelance, tutoring, etc.'}
            </p>
          </div>
        )}
      </div>

      {/* RBI Consent Note */}
      <p className="text-[11px] text-text-secondary text-center px-4 font-hindi">
        🔒 {l('consentNote')}
      </p>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 animate-slide-up">
            <h3 className="text-base font-bold text-text-primary mb-4 font-hindi">
              {l('addExternal')}
            </h3>

            {/* Institution Selection */}
            <div className="mb-4">
              <label className="text-xs font-medium text-text-secondary mb-1 block font-hindi">{l('selectBank')}</label>
              {/* Category filter */}
              <div className="flex gap-1 mb-2">
                {[
                  { key: 'all', label: { hi: 'सभी', en: 'All', kn: 'ಎಲ್ಲಾ' } },
                  { key: 'bank', label: { hi: 'बैंक', en: 'Banks', kn: 'ಬ್ಯಾಂಕ್' } },
                  { key: 'invest', label: { hi: 'निवेश', en: 'Investment', kn: 'ಹೂಡಿಕೆ' } },
                  { key: 'govt', label: { hi: 'सरकारी', en: 'Govt', kn: 'ಸರ್ಕಾರಿ' } }
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setBankFilter(cat.key)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                      bankFilter === cat.key ? 'bg-idbi-teal text-white' : 'bg-surface text-text-secondary'
                    }`}
                  >
                    {cat.label[language] || cat.label.en}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {externalBanks.filter(b => bankFilter === 'all' || b.category === bankFilter).map(bank => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-2 rounded-xl text-center text-xs font-medium transition-all ${
                        selectedBank === bank.id
                          ? 'bg-idbi-teal/10 border-2 border-idbi-teal text-idbi-teal'
                          : 'bg-surface border-2 border-transparent text-text-primary hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg block">{bank.logo}</span>
                      <span className="mt-0.5 block">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            {/* Dynamic Fields based on institution category */}
            {selectedBank && (() => {
              const bank = externalBanks.find(b => b.id === selectedBank);
              const cat = bank?.category;

              if (cat === 'bank') return (
                <div className="mb-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary mb-1 block">
                      {language === 'hi' ? 'खाता संख्या' : language === 'kn' ? 'ಖಾತೆ ಸಂಖ್ಯೆ' : 'Account Number'}
                    </label>
                    <input type="text" value={accountNum} onChange={(e) => setAccountNum(e.target.value)}
                      placeholder="e.g. 1234567890123"
                      className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary mb-1 block">IFSC Code</label>
                    <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234"
                      className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 uppercase" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary mb-1 block">
                      {language === 'hi' ? 'या UPI ID दर्ज करें' : language === 'kn' ? 'ಅಥವಾ UPI ID ನಮೂದಿಸಿ' : 'Or enter UPI ID'}
                    </label>
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. rajesh@sbi"
                      className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                  </div>
                  <p className="text-[10px] text-text-secondary">
                    {language === 'hi' ? 'खाता संख्या + IFSC या UPI ID में से कोई एक दें' : language === 'kn' ? 'ಖಾತೆ ಸಂಖ್ಯೆ + IFSC ಅಥವಾ UPI ID ಒಂದನ್ನು ನೀಡಿ' : 'Provide either Account + IFSC or UPI ID'}
                  </p>
                </div>
              );

              if (cat === 'invest') return (
                <div className="mb-4 space-y-3">
                  {bank.subtype === 'digigold' ? (
                    <>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1 block">
                          {language === 'hi' ? 'डिजी गोल्ड खाता संख्या' : language === 'kn' ? 'ಡಿಜಿ ಗೋಲ್ಡ್ ಖಾತೆ ಸಂಖ್ಯೆ' : 'Digi Gold Account Number'}
                        </label>
                        <input type="text" value={accountNum} onChange={(e) => setAccountNum(e.target.value)}
                          placeholder="e.g. AG-1234567890"
                          className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1 block">
                          {language === 'hi' ? 'रजिस्टर्ड मोबाइल नंबर' : language === 'kn' ? 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ನಂಬರ್' : 'Registered Mobile Number'}
                        </label>
                        <input type="tel" value={mobileNum} onChange={(e) => setMobileNum(e.target.value)}
                          placeholder="e.g. 9876543210" maxLength={10}
                          className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1 block">PAN ({language === 'hi' ? 'वैकल्पिक' : language === 'kn' ? 'ಐಚ್ಛಿಕ' : 'optional'})</label>
                        <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                          placeholder="e.g. ABCDE1234F" maxLength={10}
                          className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 uppercase" />
                      </div>
                      <p className="text-[10px] text-text-secondary">
                        {language === 'hi' ? 'खाता संख्या या मोबाइल नंबर से आपका डिजी गोल्ड बैलेंस प्राप्त किया जाएगा' :
                         language === 'kn' ? 'ಖಾತೆ ಸಂಖ್ಯೆ ಅಥವಾ ಮೊಬೈಲ್ ನಂಬರ್ ಮೂಲಕ ನಿಮ್ಮ ಡಿಜಿ ಗೋಲ್ಡ್ ಬ್ಯಾಲೆನ್ಸ್ ಪಡೆಯಲಾಗುತ್ತದೆ' :
                         'Your Digi Gold balance will be fetched using account number or mobile number'}
                      </p>
                    </>
                  ) : bank.subtype === 'bonds' ? (
                    <>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1 block">
                          {language === 'hi' ? 'बॉण्ड / ISIN संख्या' : language === 'kn' ? 'ಬಾಂಡ್ / ISIN ಸಂಖ್ಯೆ' : 'Bond / ISIN Number'}
                        </label>
                        <input type="text" value={accountNum} onChange={(e) => setAccountNum(e.target.value)}
                          placeholder="e.g. INE123A45678"
                          className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1 block">
                          {language === 'hi' ? 'Demat खाता (जहाँ बॉण्ड है)' : language === 'kn' ? 'Demat ಖಾತೆ (ಬಾಂಡ್ ಇರುವಲ್ಲಿ)' : 'Demat Account (where bond is held)'}
                        </label>
                        <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value)}
                          placeholder="e.g. 1234567890123456"
                          className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                      </div>
                      <p className="text-[10px] text-text-secondary">
                        {language === 'hi' ? 'बॉण्ड विवरण Demat खाते से स्वतः प्राप्त होगा' :
                         language === 'kn' ? 'ಬಾಂಡ್ ವಿವರ Demat ಖಾತೆಯಿಂದ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಿಗುತ್ತದೆ' :
                         'Bond details will be auto-fetched from your Demat account'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1 block">PAN</label>
                        <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                          placeholder="e.g. ABCDE1234F" maxLength={10}
                          className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 uppercase" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1 block">
                          {language === 'hi' ? 'Demat खाता संख्या' : language === 'kn' ? 'Demat ಖಾತೆ ಸಂಖ್ಯೆ' : 'Demat Account Number'}
                        </label>
                        <input type="text" value={accountNum} onChange={(e) => setAccountNum(e.target.value)}
                          placeholder="e.g. 1234567890123456"
                          className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                      </div>
                      <p className="text-[10px] text-text-secondary">
                        {language === 'hi' ? 'PAN से सभी निवेश स्वतः जुड़ जाएंगे' : language === 'kn' ? 'PAN ಮೂಲಕ ಎಲ್ಲಾ ಹೂಡಿಕೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲಿಂಕ್ ಆಗುತ್ತದೆ' : 'All investments will auto-link via PAN'}
                      </p>
                    </>
                  )}
                </div>
              );

              if (cat === 'govt') return (
                <div className="mb-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary mb-1 block">
                      {bank.name.includes('EPFO') ? 'UAN (Universal Account Number)' :
                       bank.name.includes('NPS') ? 'PRAN (Permanent Retirement Account Number)' :
                       bank.name.includes('Sukanya') ? 'Sukanya Samriddhi Account Number' :
                       bank.name.includes('PPF') ? 'PPF Account Number' :
                       bank.name.includes('Gold') ? 'SGB Reference Number' :
                       language === 'hi' ? 'योजना खाता संख्या' : language === 'kn' ? 'ಯೋಜನೆ ಖಾತೆ ಸಂಖ್ಯೆ' : 'Scheme Account Number'}
                    </label>
                    <input type="text" value={accountNum} onChange={(e) => setAccountNum(e.target.value)}
                      placeholder={bank.name.includes('EPFO') ? 'e.g. 100123456789' : bank.name.includes('NPS') ? 'e.g. 110012345678' : 'e.g. 1234567890'}
                      className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                  </div>
                  {bank.name.includes('EPFO') && (
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1 block">
                        {language === 'hi' ? 'रजिस्टर्ड मोबाइल नंबर' : language === 'kn' ? 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ನಂಬರ್' : 'Registered Mobile Number'}
                      </label>
                      <input type="tel" value={mobileNum} onChange={(e) => setMobileNum(e.target.value)}
                        placeholder="e.g. 9876543210" maxLength={10}
                        className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
                    </div>
                  )}
                  <p className="text-[10px] text-text-secondary">
                    {language === 'hi' ? 'RBI Account Aggregator से सुरक्षित रूप से सत्यापित होगा' : language === 'kn' ? 'RBI Account Aggregator ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ' : 'Will be securely verified via RBI Account Aggregator'}
                  </p>
                </div>
              );

              return null;
            })()}

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-medium text-text-secondary">
                {l('cancel')}
              </button>
              <button
                onClick={handleLink}
                disabled={!selectedBank || (!accountNum && !upiId && !panNumber && !mobileNum)}
                className="flex-1 py-3 rounded-full bg-idbi-teal text-white text-sm font-medium disabled:opacity-40"
              >
                {l('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Insurance Modal */}
      {showInsuranceModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowInsuranceModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-5 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primary font-hindi">
                {language === 'hi' ? 'बीमा जोड़ें' : language === 'kn' ? 'ವಿಮೆ ಸೇರಿಸಿ' : 'Add Insurance'}
              </h3>
              <button onClick={() => setShowInsuranceModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary">✕</button>
            </div>

            {/* Insurance Type */}
            <div className="mb-4">
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                {language === 'hi' ? 'बीमा प्रकार' : language === 'kn' ? 'ವಿಮೆ ಪ್ರಕಾರ' : 'Insurance Type'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(insuranceTypeLabels).map(([key, label]) => (
                  <button key={key} onClick={() => setInsType(key)}
                    className={`p-2 rounded-xl text-center text-[10px] font-medium transition-all ${insType === key ? 'bg-idbi-teal/10 border-2 border-idbi-teal text-idbi-teal' : 'bg-surface border-2 border-transparent text-text-primary'}`}>
                    <span className="text-lg block">{insuranceIcons[key]}</span>
                    <span className="mt-0.5 block">{label[language] || label.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Provider */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'बीमा कंपनी' : language === 'kn' ? 'ವಿಮೆ ಕಂಪನಿ' : 'Insurance Provider'}
              </label>
              <input type="text" value={insProvider} onChange={(e) => setInsProvider(e.target.value)}
                placeholder="e.g. IDBI Federal, LIC, Star Health"
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
            </div>

            {/* Policy Number */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'पॉलिसी नंबर' : language === 'kn' ? 'ಪಾಲಿಸಿ ನಂಬರ್' : 'Policy Number'}
              </label>
              <input type="text" value={insPolicyNum} onChange={(e) => setInsPolicyNum(e.target.value)}
                placeholder="e.g. HF-2024-12345"
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
            </div>

            {/* Cover Amount */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'कवर राशि (₹)' : language === 'kn' ? 'ಕವರ್ ಮೊತ್ತ (₹)' : 'Cover Amount (₹)'}
              </label>
              <input type="number" value={insCover} onChange={(e) => setInsCover(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 tabular-nums" />
            </div>

            {/* Premium + Frequency */}
            <div className="mb-3 flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-medium text-text-secondary mb-1 block">
                  {language === 'hi' ? 'प्रीमियम (₹)' : language === 'kn' ? 'ಪ್ರೀಮಿಯಂ (₹)' : 'Premium (₹)'}
                </label>
                <input type="number" value={insPremium} onChange={(e) => setInsPremium(e.target.value)}
                  placeholder="12000"
                  className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 tabular-nums" />
              </div>
              <div className="w-28">
                <label className="text-xs font-medium text-text-secondary mb-1 block">
                  {language === 'hi' ? 'आवृत्ति' : language === 'kn' ? 'ಆವರ್ತನ' : 'Frequency'}
                </label>
                <select value={insPremiumFreq} onChange={(e) => setInsPremiumFreq(e.target.value)}
                  className="w-full px-3 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20">
                  <option value="yearly">{language === 'hi' ? 'वार्षिक' : language === 'kn' ? 'ವಾರ್ಷಿಕ' : 'Yearly'}</option>
                  <option value="monthly">{language === 'hi' ? 'मासिक' : language === 'kn' ? 'ಮಾಸಿಕ' : 'Monthly'}</option>
                </select>
              </div>
            </div>

            {/* Expiry */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'समाप्ति तिथि' : language === 'kn' ? 'ಮುಕ್ತಾಯ ದಿನಾಂಕ' : 'Expiry Date'}
              </label>
              <input type="date" value={insExpiry} onChange={(e) => setInsExpiry(e.target.value)}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
            </div>

            {/* Members (for health) */}
            {(insType === 'health' || insType === 'life') && (
              <div className="mb-4">
                <label className="text-xs font-medium text-text-secondary mb-1 block">
                  {language === 'hi' ? 'कवर किए सदस्य' : language === 'kn' ? 'ಒಳಗೊಂಡ ಸದಸ್ಯರು' : 'Members Covered'}
                </label>
                <input type="text" value={insMembers} onChange={(e) => setInsMembers(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा: परिवार (4 सदस्य)' : 'e.g. Family Floater (4 members)'}
                  className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20" />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setShowInsuranceModal(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-medium text-text-secondary">
                {language === 'hi' ? 'रद्द करें' : language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>
              <button onClick={addInsurance} disabled={!insType || !insProvider || !insCover}
                className="flex-1 py-3 rounded-full bg-idbi-teal text-white text-sm font-semibold disabled:opacity-40">
                {language === 'hi' ? 'जोड़ें' : language === 'kn' ? 'ಸೇರಿಸಿ' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAssetModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primary font-hindi">
                {language === 'hi' ? 'संपत्ति जोड़ें' : language === 'kn' ? 'ಆಸ್ತಿ ಸೇರಿಸಿ' : 'Add Asset'}
              </h3>
              <button onClick={() => setShowAssetModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary">✕</button>
            </div>

            {/* Asset Type */}
            <div className="mb-4">
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                {language === 'hi' ? 'संपत्ति प्रकार' : language === 'kn' ? 'ಆಸ್ತಿ ಪ್ರಕಾರ' : 'Asset Type'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'property', icon: '🏠', label: { hi: 'संपत्ति', en: 'Property', kn: 'ಆಸ್ತಿ' } },
                  { key: 'gold', icon: '🥇', label: { hi: 'सोना', en: 'Gold', kn: 'ಚಿನ್ನ' } },
                  { key: 'silver', icon: '🥈', label: { hi: 'चाँदी', en: 'Silver', kn: 'ಬೆಳ್ಳಿ' } },
                  { key: 'land', icon: '🌍', label: { hi: 'ज़मीन', en: 'Land', kn: 'ಭೂಮಿ' } },
                  { key: 'cash', icon: '💵', label: { hi: 'नकद', en: 'Cash', kn: 'ನಗದು' } },
                  { key: 'vehicle', icon: '🚗', label: { hi: 'वाहन', en: 'Vehicle', kn: 'ವಾಹನ' } },
                  { key: 'jewellery', icon: '💎', label: { hi: 'आभूषण', en: 'Jewellery', kn: 'ಒಡವೆ' } },
                  { key: 'other', icon: '📦', label: { hi: 'अन्य', en: 'Other', kn: 'ಇತರ' } }
                ].map(t => (
                  <button key={t.key} onClick={() => setAssetType(t.key)}
                    className={`p-2 rounded-xl text-center text-[10px] font-medium transition-all ${assetType === t.key ? 'bg-idbi-teal/10 border-2 border-idbi-teal text-idbi-teal' : 'bg-surface border-2 border-transparent text-text-primary'}`}>
                    <span className="text-lg block">{t.icon}</span>
                    <span className="mt-0.5 block">{t.label[language] || t.label.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'विवरण' : language === 'kn' ? 'ವಿವರ' : 'Description'}
              </label>
              <input type="text" value={assetDesc} onChange={(e) => setAssetDesc(e.target.value)}
                placeholder={language === 'hi' ? 'उदा: 2BHK फ्लैट पुणे, 50gm सोना...' : language === 'kn' ? 'ಉದಾ: 2BHK ಫ್ಲ್ಯಾಟ್ ಪುಣೆ, 50gm ಚಿನ್ನ...' : 'e.g. 2BHK Flat Pune, 50gm Gold...'}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 font-hindi" />
            </div>

            {/* Estimated Value */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'अनुमानित मूल्य (₹)' : language === 'kn' ? 'ಅಂದಾಜು ಮೌಲ್ಯ (₹)' : 'Estimated Value (₹)'}
              </label>
              <input type="number" value={assetValue} onChange={(e) => setAssetValue(e.target.value)}
                placeholder="e.g. 5000000"
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 tabular-nums" />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'नोट (वैकल्पिक)' : language === 'kn' ? 'ಟಿಪ್ಪಣಿ (ಐಚ್ಛಿಕ)' : 'Notes (optional)'}
              </label>
              <input type="text" value={assetNotes} onChange={(e) => setAssetNotes(e.target.value)}
                placeholder={language === 'hi' ? 'उदा: बाजार मूल्य 2024' : language === 'kn' ? 'ಉದಾ: ಮಾರುಕಟ್ಟೆ ಮೌಲ್ಯ 2024' : 'e.g. Market value 2024'}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 font-hindi" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setShowAssetModal(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-medium text-text-secondary">
                {language === 'hi' ? 'रद्द करें' : language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>
              <button onClick={addAsset} disabled={!assetType || !assetDesc || !assetValue}
                className="flex-1 py-3 rounded-full bg-idbi-teal text-white text-sm font-semibold disabled:opacity-40">
                {language === 'hi' ? 'जोड़ें' : language === 'kn' ? 'ಸೇರಿಸಿ' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Other Income Modal */}
      {showIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowIncomeModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primary font-hindi">
                {language === 'hi' ? 'अन्य आय जोड़ें' : language === 'kn' ? 'ಇತರ ಆದಾಯ ಸೇರಿಸಿ' : 'Add Other Income'}
              </h3>
              <button onClick={() => setShowIncomeModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary">✕</button>
            </div>

            {/* Source */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                {language === 'hi' ? 'आय का स्रोत' : language === 'kn' ? 'ಆದಾಯದ ಮೂಲ' : 'Income Source'}
              </label>
              <input type="text" value={incSource} onChange={(e) => setIncSource(e.target.value)}
                placeholder={language === 'hi' ? 'उदा: दुकान, खेती, किराया...' : language === 'kn' ? 'ಉದಾ: ಅಂಗಡಿ, ಕೃಷಿ, ಬಾಡಿಗೆ...' : 'e.g. Shop, Farming, Rent...'}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 font-hindi" />
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: { hi: 'दुकान', en: 'Shop', kn: 'ಅಂಗಡಿ' }, val: language === 'hi' ? 'दुकान' : language === 'kn' ? 'ಅಂಗಡಿ' : 'Shop' },
                  { label: { hi: 'खेती', en: 'Farming', kn: 'ಕೃಷಿ' }, val: language === 'hi' ? 'खेती' : language === 'kn' ? 'ಕೃಷಿ' : 'Farming' },
                  { label: { hi: 'किराया', en: 'Rent', kn: 'ಬಾಡಿಗೆ' }, val: language === 'hi' ? 'किराया' : language === 'kn' ? 'ಬಾಡಿಗೆ' : 'Rent' },
                  { label: { hi: 'फ्रीलांस', en: 'Freelance', kn: 'ಫ್ರೀಲ್ಯಾನ್ಸ್' }, val: language === 'hi' ? 'फ्रीलांस' : language === 'kn' ? 'ಫ್ರೀಲ್ಯಾನ್ಸ್' : 'Freelance' },
                  { label: { hi: 'ट्यूशन', en: 'Tutoring', kn: 'ಟ್ಯೂಶನ್' }, val: language === 'hi' ? 'ट्यूशन' : language === 'kn' ? 'ಟ್ಯೂಶನ್' : 'Tutoring' },
                  { label: { hi: 'परामर्श', en: 'Consulting', kn: 'ಸಲಹೆ' }, val: language === 'hi' ? 'परामर्श' : language === 'kn' ? 'ಸಲಹೆ' : 'Consulting' }
                ].map((s, i) => (
                  <button key={i} onClick={() => setIncSource(s.val)}
                    className={`px-2 py-1 rounded-full text-[10px] font-medium ${incSource === s.val ? 'bg-idbi-teal text-white' : 'bg-surface text-text-secondary'}`}>
                    {s.label[language] || s.label.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'अनुमानित राशि (₹)' : language === 'kn' ? 'ಅಂದಾಜು ಮೊತ್ತ (₹)' : 'Approximate Amount (₹)'}
              </label>
              <input type="number" value={incAmount} onChange={(e) => setIncAmount(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 tabular-nums" />
            </div>

            {/* Frequency */}
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'कितनी बार?' : language === 'kn' ? 'ಎಷ್ಟು ಬಾರಿ?' : 'How often?'}
              </label>
              <div className="flex gap-2">
                {[
                  { val: 'weekly', label: { hi: 'साप्ताहिक', en: 'Weekly', kn: 'ವಾರಕ್ಕೊಮ್ಮೆ' } },
                  { val: 'monthly', label: { hi: 'मासिक', en: 'Monthly', kn: 'ಮಾಸಿಕ' } },
                  { val: 'seasonal', label: { hi: 'मौसमी', en: 'Seasonal', kn: 'ಋತುಮಾನಿಕ' } },
                  { val: 'yearly', label: { hi: 'वार्षिक', en: 'Yearly', kn: 'ವಾರ್ಷಿಕ' } }
                ].map(f => (
                  <button key={f.val} onClick={() => setIncFrequency(f.val)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-medium ${incFrequency === f.val ? 'bg-idbi-teal text-white' : 'bg-surface text-text-primary'}`}>
                    {f.label[language] || f.label.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                {language === 'hi' ? 'नोट (वैकल्पिक)' : language === 'kn' ? 'ಟಿಪ್ಪಣಿ (ಐಚ್ಛಿಕ)' : 'Notes (optional)'}
              </label>
              <input type="text" value={incNotes} onChange={(e) => setIncNotes(e.target.value)}
                placeholder={language === 'hi' ? 'उदा: सब्ज़ी की दुकान, लक्ष्मी नगर' : language === 'kn' ? 'ಉದಾ: ತರಕಾರಿ ಅಂಗಡಿ, ಲಕ್ಷ್ಮಿ ನಗರ' : 'e.g. Vegetable shop, Laxmi Nagar'}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 font-hindi" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setShowIncomeModal(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-medium text-text-secondary">
                {language === 'hi' ? 'रद्द करें' : language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>
              <button onClick={addOtherIncome} disabled={!incSource || !incAmount}
                className="flex-1 py-3 rounded-full bg-idbi-teal text-white text-sm font-semibold disabled:opacity-40">
                {language === 'hi' ? 'जोड़ें' : language === 'kn' ? 'ಸೇರಿಸಿ' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
