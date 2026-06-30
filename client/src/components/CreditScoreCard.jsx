import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CreditIcon, CheckCircleIcon, AlertIcon } from './Icons';

const labels = {
  title: { hi: 'क्रेडिट स्कोर', en: 'Credit Score', kn: 'ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್' },
  checkBtn: { hi: 'स्कोर देखें', en: 'Check Score', kn: 'ಸ್ಕೋರ್ ನೋಡಿ' },
  powered: { hi: 'CIBIL / Experian द्वारा', en: 'Powered by CIBIL / Experian', kn: 'CIBIL / Experian ಮೂಲಕ' },
  excellent: { hi: 'उत्कृष्ट', en: 'Excellent', kn: 'ಅತ್ಯುತ್ತಮ' },
  good: { hi: 'अच्छा', en: 'Good', kn: 'ಉತ್ತಮ' },
  fair: { hi: 'ठीक', en: 'Fair', kn: 'ಸಾಧಾರಣ' },
  poor: { hi: 'कमज़ोर', en: 'Poor', kn: 'ಕಳಪೆ' },
  factors: { hi: 'आपके स्कोर को प्रभावित करने वाले कारण', en: 'Factors affecting your score', kn: 'ನಿಮ್ಮ ಸ್ಕೋರ್ ಮೇಲೆ ಪ್ರಭಾವ ಬೀರುವ ಅಂಶಗಳು' },
  recommendations: { hi: 'स्कोर सुधारने के उपाय', en: 'How to improve', kn: 'ಸ್ಕೋರ್ ಸುಧಾರಿಸುವ ವಿಧಾನ' },
  lastChecked: { hi: 'अंतिम बार जाँचा', en: 'Last checked', kn: 'ಕೊನೆಯ ಬಾರಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ' }
};

const creditData = {
  score: 742,
  maxScore: 900,
  rating: 'good', // excellent (750+), good (700-749), fair (650-699), poor (<650)
  lastChecked: '2026-06-20',
  factors: {
    positive: [
      { icon: '✅', text: { hi: 'Home Loan EMI ₹18,000 — लगातार 3 महीने समय पर भुगतान', en: 'Home Loan EMI ₹18,000 — paid on time for 3 consecutive months', kn: 'Home Loan EMI ₹18,000 — ಸತತ 3 ತಿಂಗಳು ಸಮಯಕ್ಕೆ ಪಾವತಿ' } },
      { icon: '✅', text: { hi: 'क्रेडिट उपयोग ₹8,200/₹2,00,000 (4.1%) — 30% से बहुत कम', en: 'Credit utilization ₹8,200/₹2,00,000 (4.1%) — well below 30% threshold', kn: 'ಕ್ರೆಡಿಟ್ ಬಳಕೆ ₹8,200/₹2,00,000 (4.1%) — 30% ಮಿತಿಗಿಂತ ಬಹಳ ಕಡಿಮೆ' } },
      { icon: '✅', text: { hi: 'क्रेडिट इतिहास 5 वर्ष (Home Loan 2021 से) — लंबा इतिहास अच्छा', en: 'Credit history 5 years (Home Loan since 2021) — longer history helps', kn: 'ಕ್ರೆಡಿಟ್ ಇತಿಹಾಸ 5 ವರ್ಷ (Home Loan 2021 ರಿಂದ) — ದೀರ್ಘ ಇತಿಹಾಸ ಒಳ್ಳೆಯದು' } }
    ],
    negative: [
      { icon: '⚠️', text: { hi: 'केवल 1 प्रकार का ऋण (Home Loan) — Credit Card जोड़ने से mix सुधरेगा', en: 'Only 1 credit type (Home Loan) — adding a Credit Card will improve mix', kn: 'ಕೇವಲ 1 ಕ್ರೆಡಿಟ್ ಪ್ರಕಾರ (Home Loan) — Credit Card ಸೇರಿಸಿದರೆ mix ಸುಧಾರಿಸುತ್ತದೆ' } },
      { icon: '⚠️', text: { hi: 'पिछले 6 महीने में 2 ऋण पूछताछ (Car Loan + Credit Card enquiry)', en: '2 loan inquiries in last 6 months (Car Loan + Credit Card enquiry)', kn: 'ಕಳೆದ 6 ತಿಂಗಳಲ್ಲಿ 2 ಸಾಲ ವಿಚಾರಣೆ (Car Loan + Credit Card enquiry)' } }
    ]
  },
  recommendations: [
    { icon: '💳', text: { hi: 'IDBI Credit Card लें — आपकी ₹65,000 salary पर Imperium Card eligible। Credit mix +15-20 अंक', en: 'Get IDBI Credit Card — eligible for Imperium Card on ₹65,000 salary. Credit mix boost: +15-20 points', kn: 'IDBI Credit Card ತೆಗೆದುಕೊಳ್ಳಿ — ₹65,000 ವೇತನದಲ್ಲಿ Imperium Card ಅರ್ಹ. Credit mix: +15-20 ಅಂಕ' } },
    { icon: '⏰', text: { hi: 'EMI भुगतान जारी रखें — 3 और महीने on-time = 750+ possible (अभी 742)', en: 'Continue on-time EMI — 3 more months on-time = 750+ possible (currently 742)', kn: 'EMI ಸಮಯಕ್ಕೆ ಪಾವತಿ ಮುಂದುವರಿಸಿ — 3 ತಿಂಗಳು ಇನ್ನೂ = 750+ ಸಾಧ್ಯ (ಈಗ 742)' } },
    { icon: '🚫', text: { hi: 'अगले 6 महीने कोई नया loan/card apply न करें — hard enquiry कम होगी', en: 'Avoid new loan/card applications for 6 months — reduces hard inquiries', kn: '6 ತಿಂಗಳು ಹೊಸ ಸಾಲ/ಕಾರ್ಡ್ ಅರ್ಜಿ ಬೇಡ — hard inquiry ಕಡಿಮೆ ಆಗುತ್ತದೆ' } },
    { icon: '📊', text: { hi: 'HDFC Car Loan EMI ₹8,500 — balance ₹3.2L बचा है। Prepay करने से debt ratio सुधरेगा', en: 'HDFC Car Loan EMI ₹8,500 — ₹3.2L balance remaining. Prepaying will improve debt ratio', kn: 'HDFC Car Loan EMI ₹8,500 — ₹3.2L ಬಾಕಿ ಇದೆ. Prepay ಮಾಡಿದರೆ debt ratio ಸುಧಾರಿಸುತ್ತದೆ' } }
  ]
};

export default function CreditScoreCard() {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const l = (key) => labels[key]?.[language] || labels[key]?.en || key;

  const score = creditData.score;
  const percentage = (score / creditData.maxScore) * 100;

  const getRating = () => {
    if (score >= 750) return { label: l('excellent'), color: '#00836C' };
    if (score >= 700) return { label: l('good'), color: '#F98220' };
    if (score >= 650) return { label: l('fair'), color: '#E06D0E' };
    return { label: l('poor'), color: '#DC2626' };
  };

  const rating = getRating();

  // Gauge arc calculation
  const radius = 50;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card p-4">
      {!expanded ? (
        /* Collapsed — teaser */
        <button onClick={() => setExpanded(true)} className="w-full text-left flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-idbi-orange/10 flex items-center justify-center">
            <CreditIcon size={20} color="#F98220" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">{l('title')}</p>
            <p className="text-[10px] text-text-secondary">{l('powered')}</p>
          </div>
          <span className="text-sm font-bold" style={{ color: rating.color }}>{score}</span>
          <span className="text-text-secondary text-sm">→</span>
        </button>
      ) : (
        /* Expanded — full credit score view */
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-text-primary">{l('title')}</h3>
            <button onClick={() => setExpanded(false)} className="text-xs text-text-secondary">✕</button>
          </div>

          {/* Score Gauge */}
          <div className="flex flex-col items-center mb-4">
            <svg width="160" height="90" viewBox="0 0 160 90">
              {/* Background arc */}
              <path
                d="M 10 80 A 60 60 0 0 1 150 80"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Score arc */}
              <path
                d="M 10 80 A 60 60 0 0 1 150 80"
                fill="none"
                stroke={rating.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 188} 188`}
              />
            </svg>
            <div className="-mt-10 text-center">
              <p className="text-3xl font-bold tabular-nums" style={{ color: rating.color }}>{score}</p>
              <p className="text-xs font-medium" style={{ color: rating.color }}>{rating.label}</p>
              <div className="flex justify-between w-[140px] mx-auto mt-1 text-[9px] text-text-secondary">
                <span>300</span>
                <span>900</span>
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5">{l('lastChecked')}: {creditData.lastChecked}</p>
            </div>
          </div>

          {/* Factors */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-text-primary mb-2 font-hindi">{l('factors')}</p>
            <div className="space-y-1.5">
              {creditData.factors.positive.map((f, i) => (
                <div key={`p${i}`} className="flex items-start gap-2 text-xs text-text-primary font-hindi">
                  <span>{f.icon}</span>
                  <span>{f.text[language] || f.text.en}</span>
                </div>
              ))}
              {creditData.factors.negative.map((f, i) => (
                <div key={`n${i}`} className="flex items-start gap-2 text-xs text-text-primary font-hindi">
                  <span>{f.icon}</span>
                  <span>{f.text[language] || f.text.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-xs font-semibold text-text-primary mb-2 font-hindi">{l('recommendations')}</p>
            <div className="space-y-2">
              {creditData.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-surface rounded-lg">
                  <span className="text-sm">{r.icon}</span>
                  <span className="text-xs text-text-primary font-hindi">{r.text[language] || r.text.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
