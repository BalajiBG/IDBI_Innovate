import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import { formatINR } from '../utils/formatCurrency';
import { CreditIcon, ShieldIcon, InvestIcon } from '../components/Icons';

const labels = {
  title: { hi: 'IDBI उत्पाद', en: 'IDBI Products', kn: 'IDBI ಉತ್ಪನ್ನಗಳು' },
  subtitle: { hi: 'आपके लिए चुने गए', en: 'Selected for you', kn: 'ನಿಮಗಾಗಿ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ' },
  investTab: { hi: 'निवेश', en: 'Invest', kn: 'ಹೂಡಿಕೆ' },
  loanTab: { hi: 'ऋण', en: 'Loans', kn: 'ಸಾಲ' },
  cardTab: { hi: 'कार्ड', en: 'Cards', kn: 'ಕಾರ್ಡ್' },
  checkEligibility: { hi: 'पात्रता जाँचें', en: 'Check Eligibility', kn: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ' },
  eligible: { hi: '✓ आप पात्र हैं!', en: '✓ You are eligible!', kn: '✓ ನೀವು ಅರ್ಹರು!' },
  notEligible: { hi: '✗ अभी पात्र नहीं', en: '✗ Not eligible currently', kn: '✗ ಪ್ರಸ್ತುತ ಅರ್ಹರಲ್ಲ' },
  eligibleAmount: { hi: 'अनुमानित राशि', en: 'Estimated amount', kn: 'ಅಂದಾಜು ಮೊತ್ತ' },
  apply: { hi: 'आवेदन करें', en: 'Apply Now', kn: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
  whyNot: { hi: 'कारण', en: 'Reason', kn: 'ಕಾರಣ' },
  features: { hi: 'मुख्य विशेषताएं', en: 'Key Features', kn: 'ಮುಖ್ಯ ವೈಶಿಷ್ಟ್ಯಗಳು' },
  applied: { hi: '✓ आवेदन भेजा गया! टीम संपर्क करेगी।', en: '✓ Application sent! Team will contact you.', kn: '✓ ಅರ್ಜಿ ಕಳುಹಿಸಲಾಗಿದೆ! ತಂಡ ಸಂಪರ್ಕಿಸುತ್ತದೆ.' }
};

// IDBI Banking Products
const bankingProducts = {
  cards: [
    {
      id: 'cc-1',
      name: 'IDBI Imperium Credit Card',
      type: 'credit_card',
      image: null,
      annualFee: 1500,
      features: {
        hi: ['5X रिवॉर्ड पॉइंट्स', 'हवाई अड्डा लाउंज', 'ईंधन छूट 1%', 'शून्य विदेशी मुद्रा शुल्क'],
        en: ['5X reward points', 'Airport lounge access', '1% fuel surcharge waiver', 'Zero forex markup'],
        kn: ['5X ರಿವಾರ್ಡ್ ಪಾಯಿಂಟ್ಸ್', 'ವಿಮಾನ ನಿಲ್ದಾಣ ಲೌಂಜ್', 'ಇಂಧನ ರಿಯಾಯಿತಿ 1%', 'ಶೂನ್ಯ ವಿದೇಶಿ ವಿನಿಮಯ ಶುಲ್ಕ']
      },
      eligibility: { minSalary: 40000, minAge: 21, maxAge: 60, minCibil: 700 },
      limit: 200000
    },
    {
      id: 'cc-2',
      name: 'IDBI Winnings Credit Card',
      type: 'credit_card',
      annualFee: 500,
      features: {
        hi: ['2X रिवॉर्ड पॉइंट्स', 'ऑनलाइन खरीदारी पर कैशबैक', 'EMI पर कोई ब्याज नहीं', 'मूवी टिकट ऑफर'],
        en: ['2X reward points', 'Online shopping cashback', 'No-interest EMI', 'Movie ticket offers'],
        kn: ['2X ರಿವಾರ್ಡ್ ಪಾಯಿಂಟ್ಸ್', 'ಆನ್‌ಲೈನ್ ಶಾಪಿಂಗ್ ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್', 'ಬಡ್ಡಿ-ರಹಿತ EMI', 'ಚಲನಚಿತ್ರ ಟಿಕೆಟ್ ಆಫರ್']
      },
      eligibility: { minSalary: 25000, minAge: 21, maxAge: 60, minCibil: 650 },
      limit: 100000
    }
  ],
  loans: [
    {
      id: 'pl-1',
      name: 'IDBI Personal Loan',
      type: 'personal_loan',
      rate: '10.50%',
      tenure: '1-5 years',
      features: {
        hi: ['कोई गारंटी नहीं', '24 घंटे में स्वीकृति', 'न्यूनतम दस्तावेज़', '₹50 लाख तक'],
        en: ['No collateral needed', 'Approval in 24 hours', 'Minimal documentation', 'Up to ₹50 lakh'],
        kn: ['ಯಾವುದೇ ಭದ್ರತೆ ಬೇಡ', '24 ಗಂಟೆಯಲ್ಲಿ ಅನುಮೋದನೆ', 'ಕನಿಷ್ಠ ದಾಖಲೆ', '₹50 ಲಕ್ಷದವರೆಗೆ']
      },
      eligibility: { minSalary: 25000, minAge: 23, maxAge: 58, minCibil: 700 },
      maxAmount: 2000000
    },
    {
      id: 'vl-1',
      name: 'IDBI Vehicle Loan',
      type: 'vehicle_loan',
      rate: '8.70%',
      tenure: '1-7 years',
      features: {
        hi: ['100% ऑन-रोड वित्तपोषण', '8.70% से ब्याज दर', 'तत्काल स्वीकृति', 'लचीला EMI'],
        en: ['100% on-road financing', 'Interest from 8.70%', 'Instant approval', 'Flexible EMI'],
        kn: ['100% ರಸ್ತೆ ಮೇಲಿನ ಹಣಕಾಸು', '8.70% ರಿಂದ ಬಡ್ಡಿ', 'ತಕ್ಷಣ ಅನುಮೋದನೆ', 'ಹೊಂದಿಕೊಳ್ಳುವ EMI']
      },
      eligibility: { minSalary: 20000, minAge: 21, maxAge: 60, minCibil: 650 },
      maxAmount: 1500000
    },
    {
      id: 'hl-1',
      name: 'IDBI Home Loan',
      type: 'home_loan',
      rate: '8.40%',
      tenure: '5-30 years',
      features: {
        hi: ['8.40% से ब्याज दर', '80C + 24(b) कर लाभ', '30 साल तक अवधि', '₹5 करोड़ तक'],
        en: ['Interest from 8.40%', '80C + 24(b) tax benefit', 'Up to 30 year tenure', 'Up to ₹5 crore'],
        kn: ['8.40% ರಿಂದ ಬಡ್ಡಿ', '80C + 24(b) ತೆರಿಗೆ ಲಾಭ', '30 ವರ್ಷದವರೆಗೆ ಅವಧಿ', '₹5 ಕೋಟಿವರೆಗೆ']
      },
      eligibility: { minSalary: 30000, minAge: 23, maxAge: 60, minCibil: 700 },
      maxAmount: 50000000
    },
    {
      id: 'bl-1',
      name: 'IDBI Business Loan',
      type: 'business_loan',
      rate: '11.00%',
      tenure: '1-5 years',
      features: {
        hi: ['कोई गारंटी नहीं (₹10L तक)', 'MSME के लिए विशेष दर', 'कार्यशील पूंजी + विस्तार', 'सरल प्रक्रिया'],
        en: ['No collateral (up to ₹10L)', 'Special rate for MSME', 'Working capital + expansion', 'Simple process'],
        kn: ['ಯಾವುದೇ ಭದ್ರತೆ ಇಲ್ಲ (₹10L ವರೆಗೆ)', 'MSME ಗೆ ವಿಶೇಷ ದರ', 'ಕಾರ್ಯ ಬಂಡವಾಳ + ವಿಸ್ತರಣೆ', 'ಸರಳ ಪ್ರಕ್ರಿಯೆ']
      },
      eligibility: { minSalary: 30000, minAge: 25, maxAge: 55, minCibil: 700 },
      maxAmount: 5000000
    }
  ],
  invest: [] // will be loaded from API
};

// Customer data for eligibility check
const customer = { salary: 65000, age: 34, cibil: 742 };

function checkEligibility(product) {
  const { minSalary, minAge, maxAge, minCibil } = product.eligibility;
  const eligible = customer.salary >= minSalary && customer.age >= minAge && customer.age <= maxAge && customer.cibil >= minCibil;

  const reasons = [];
  if (customer.salary < minSalary) reasons.push({ hi: `न्यूनतम वेतन ${formatINR(minSalary)} चाहिए`, en: `Min salary ${formatINR(minSalary)} required`, kn: `ಕನಿಷ್ಠ ವೇತನ ${formatINR(minSalary)} ಬೇಕು` });
  if (customer.cibil < minCibil) reasons.push({ hi: `CIBIL ${minCibil}+ चाहिए (आपका: ${customer.cibil})`, en: `CIBIL ${minCibil}+ required (yours: ${customer.cibil})`, kn: `CIBIL ${minCibil}+ ಬೇಕು (ನಿಮ್ಮದು: ${customer.cibil})` });
  if (customer.age < minAge || customer.age > maxAge) reasons.push({ hi: `आयु ${minAge}-${maxAge} वर्ष होनी चाहिए`, en: `Age must be ${minAge}-${maxAge} years`, kn: `ವಯಸ್ಸು ${minAge}-${maxAge} ವರ್ಷ ಇರಬೇಕು` });

  // Calculate eligible amount for loans
  let eligibleAmount = null;
  if (eligible && product.maxAmount) {
    eligibleAmount = Math.min(product.maxAmount, customer.salary * 20);
  }
  if (eligible && product.limit) {
    eligibleAmount = product.limit;
  }

  return { eligible, reasons, eligibleAmount };
}

export default function ProductsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('invest');
  const [investProducts, setInvestProducts] = useState([]);
  const [eligibilityResults, setEligibilityResults] = useState({});
  const [appliedProducts, setAppliedProducts] = useState({});

  const l = (key) => labels[key]?.[language] || labels[key]?.en || key;

  useEffect(() => {
    fetch(`/api/data/products?lang=${language}`)
      .then(res => res.json())
      .then(setInvestProducts)
      .catch(console.error);
  }, [language]);

  const handleCheckEligibility = (product) => {
    const result = checkEligibility(product);
    setEligibilityResults(prev => ({ ...prev, [product.id]: result }));
  };

  const handleApply = (productId) => {
    setAppliedProducts(prev => ({ ...prev, [productId]: true }));
  };

  const tabs = [
    { key: 'invest', label: l('investTab') },
    { key: 'loans', label: l('loanTab') },
    { key: 'cards', label: l('cardTab') }
  ];

  const renderProduct = (product) => {
    const result = eligibilityResults[product.id];
    const applied = appliedProducts[product.id];

    return (
      <div key={product.id} className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{product.name}</h3>
            {product.rate && <p className="text-xs text-idbi-teal font-medium mt-0.5">{product.rate} p.a.</p>}
            {product.annualFee !== undefined && <p className="text-xs text-text-secondary mt-0.5">{formatINR(product.annualFee)}/year</p>}
          </div>
          {product.tenure && <span className="text-[10px] bg-surface px-2 py-1 rounded-full text-text-secondary">{product.tenure}</span>}
        </div>

        {/* Features */}
        <div className="mt-3">
          <p className="text-[10px] font-semibold text-text-secondary uppercase mb-1">{l('features')}</p>
          <div className="grid grid-cols-2 gap-1">
            {(product.features[language] || product.features.en).map((f, i) => (
              <p key={i} className="text-[11px] text-text-primary font-hindi">• {f}</p>
            ))}
          </div>
        </div>

        {/* Eligibility Result */}
        {result && (
          <div className={`mt-3 p-3 rounded-xl ${result.eligible ? 'bg-success/5 border border-success/20' : 'bg-red-50 border border-red-100'}`}>
            <p className={`text-sm font-semibold ${result.eligible ? 'text-success' : 'text-red-600'}`}>
              {result.eligible ? l('eligible') : l('notEligible')}
            </p>
            {result.eligible && result.eligibleAmount && (
              <p className="text-xs text-text-secondary mt-1">
                {l('eligibleAmount')}: <span className="font-bold text-idbi-teal">{formatINR(result.eligibleAmount)}</span>
              </p>
            )}
            {!result.eligible && result.reasons.length > 0 && (
              <div className="mt-1">
                {result.reasons.map((r, i) => (
                  <p key={i} className="text-[11px] text-red-600 font-hindi">• {r[language] || r.en}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-3 flex gap-2">
          {!result && (
            <button onClick={() => handleCheckEligibility(product)} className="flex-1 py-2.5 rounded-full border-2 border-idbi-teal text-idbi-teal text-xs font-semibold hover:bg-idbi-teal/5 transition-colors">
              {l('checkEligibility')}
            </button>
          )}
          {result?.eligible && !applied && (
            <button onClick={() => handleApply(product.id)} className="flex-1 py-2.5 rounded-full bg-idbi-orange text-white text-xs font-semibold hover:bg-idbi-orange-dark transition-colors">
              {l('apply')}
            </button>
          )}
          {applied && (
            <p className="flex-1 py-2.5 text-center text-xs font-semibold text-success animate-fade-in">{l('applied')}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-text-primary font-hindi">{l('title')}</h2>
        <p className="text-xs text-text-secondary font-hindi">{l('subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.key ? 'bg-white text-idbi-teal shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Invest Tab — existing recommendations */}
      {activeTab === 'invest' && (
        <div className="space-y-3">
          {investProducts.map((product) => (
            <div key={product.id} className="card p-4">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-idbi-teal/10 flex items-center justify-center flex-shrink-0">
                  <InvestIcon size={16} color="#00836C" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">{product.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: product.priorityColor }}>
                      {product.priority}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 font-hindi">{product.reason}</p>
                  <p className="text-[11px] text-success font-medium mt-1">{product.expectedBenefit}</p>
                </div>
              </div>
              <button onClick={() => handleApply(product.id)} className="btn-primary text-xs w-full mt-3">
                {appliedProducts[product.id] ? l('applied') : product.cta}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <div className="space-y-3">
          {bankingProducts.loans.map(renderProduct)}
        </div>
      )}

      {/* Cards Tab */}
      {activeTab === 'cards' && (
        <div className="space-y-3">
          {bankingProducts.cards.map(renderProduct)}
        </div>
      )}

      {/* Responsible AI Disclaimer */}
      <p className="text-[10px] text-text-secondary text-center px-4 pt-2 font-hindi">
        {language === 'hi' ? '⚖️ यह जानकारी सूचनात्मक है। निवेश बाजार जोखिम के अधीन है। अंतिम निर्णय लेने से पहले विशेषज्ञ से परामर्श लें।' :
         language === 'kn' ? '⚖️ ಈ ಮಾಹಿತಿ ಕೇವಲ ಮಾಹಿತಿಗಾಗಿ. ಹೂಡಿಕೆ ಮಾರುಕಟ್ಟೆ ಅಪಾಯಕ್ಕೆ ಒಳಪಟ್ಟಿದೆ. ಅಂತಿಮ ನಿರ್ಧಾರ ಮಾಡುವ ಮೊದಲು ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.' :
         '⚖️ This information is for guidance only. Investments are subject to market risks. Consult an expert before making final decisions.'}
      </p>
    </div>
  );
}
