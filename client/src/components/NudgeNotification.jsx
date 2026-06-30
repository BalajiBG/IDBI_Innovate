import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

export default function NudgeNotification() {
  const [visible, setVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { language } = useLanguage();

  // Context-aware nudge selection based on customer data:
  // - Salary: ₹65,000 credited 3 days ago
  // - Emergency Fund: 61.5% done (₹75,000 remaining)
  // - Term Life Insurance: MISSING (critical, 4 dependents)
  // - No SIP yet
  // - Food Delivery: ₹4,200 (above average)
  //
  // Priority: Emergency Fund is closest to completion → nudge to finish it
  // (Instead of always pushing SIP which customer may not sustain)

  const nudgeData = {
    title: {
      hi: 'Seva की सलाह',
      en: "Seva's Advice",
      kn: 'Seva ನ ಸಲಹೆ'
    },
    message: {
      hi: 'Rajesh ji, salary 3 दिन पहले आई। आपका Emergency Fund बस ₹75,000 दूर है (61.5% पूरा)। ₹18,750 इस महीने डालें तो 4 महीने में पूरा हो जाएगा। यह SIP से पहले ज़रूरी है।',
      en: 'Rajesh, salary came 3 days ago. Your Emergency Fund is just ₹75,000 away (61.5% done). Put ₹18,750 this month and it completes in 4 months. This should come before SIP.',
      kn: 'ರಾಜೇಶ್, 3 ದಿನ ಹಿಂದೆ salary ಬಂದಿದೆ. ನಿಮ್ಮ ತುರ್ತು ನಿಧಿ ₹75,000 ಮಾತ್ರ ಬಾಕಿ (61.5% ಆಗಿದೆ). ₹18,750 ಈ ತಿಂಗಳು ಹಾಕಿ, 4 ತಿಂಗಳಲ್ಲಿ ಪೂರ್ಣ. SIP ಗಿಂತ ಮೊದಲು ಇದು ಮುಖ್ಯ.'
    },
    acceptLabel: {
      hi: '₹18,750 ಜ ಮा करें',
      en: 'Transfer ₹18,750',
      kn: '₹18,750 ವರ್ಗಾಯಿಸಿ'
    },
    amount: 18750,
    purpose: 'Emergency Fund',
    confirmDetails: {
      amount: '₹18,750',
      to: 'IDBI Emergency Fund RD',
      from: 'IDBI Savings XXXX-4521'
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed || !visible) return null;

  if (accepted) {
    return (
      <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-bounce-in">
        <div className="card border border-success p-3 flex items-center gap-3">
          <span className="text-lg">✅</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-success">{language === 'hi' ? 'जमा सफल!' : language === 'kn' ? 'ವರ್ಗಾವಣೆ ಯಶಸ್ವಿ!' : 'Transfer Successful!'}</p>
            <p className="text-[10px] text-text-secondary">{language === 'hi' ? '₹18,750 Emergency Fund में जमा। अब 65% पूरा!' : language === 'kn' ? '₹18,750 ತುರ್ತು ನಿಧಿಗೆ ಜಮಾ. ಈಗ 65% ಪೂರ್ಣ!' : '₹18,750 added to Emergency Fund. Now 65% complete!'}</p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-text-secondary text-xs">✕</button>
        </div>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-slide-up">
        <div className="card border border-idbi-orange p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-text-primary font-hindi">
              {language === 'hi' ? 'विवरण पुष्टि करें' : language === 'kn' ? 'ವಿವರ ದೃಢೀಕರಿಸಿ' : 'Confirm Details'}
            </p>
            <button onClick={() => { setShowConfirm(false); setDismissed(true); }} className="text-text-secondary text-sm">✕</button>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{language === 'hi' ? 'राशि' : language === 'kn' ? 'ಮೊತ್ತ' : 'Amount'}</span>
              <span className="text-xs font-bold">{nudgeData.confirmDetails.amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{language === 'hi' ? 'उद्देश्य' : language === 'kn' ? 'ಉದ್ದೇಶ' : 'Purpose'}</span>
              <span className="text-xs font-bold">{nudgeData.purpose}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{language === 'hi' ? 'से' : language === 'kn' ? 'ಇಂದ' : 'From'}</span>
              <span className="text-xs font-bold">{nudgeData.confirmDetails.from}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{language === 'hi' ? 'को' : language === 'kn' ? 'ಗೆ' : 'To'}</span>
              <span className="text-xs font-bold">{nudgeData.confirmDetails.to}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowConfirm(false); setDismissed(true); }} className="flex-1 py-2 rounded-full border border-gray-200 text-xs font-medium text-text-secondary">
              {language === 'hi' ? 'रद्द करें' : language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
            </button>
            <button onClick={async () => {
              try { await fetch('/api/data/portfolio-linked', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bank: 'Emergency Fund (RD)', type: 'savings', number: 'Emergency Fund ₹18,750', balance: 18750, icon: '🛡️' }) }); } catch(e){}
              setShowConfirm(false); setAccepted(true);
            }} className="flex-1 py-2 rounded-full bg-idbi-teal text-white text-xs font-semibold">
              {language === 'hi' ? 'पुष्टि करें' : language === 'kn' ? 'ದೃಢೀಕರಿಸಿ' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-slide-up">
      <div className="card border-l-4 border-l-idbi-orange p-3 shadow-xl">
        <div className="flex items-start gap-2">
          <span className="text-lg">🔔</span>
          <div className="flex-1">
            <p className="font-bold text-xs text-text-primary font-hindi">{nudgeData.title[language]}</p>
            <p className="text-[11px] text-text-secondary mt-0.5 font-hindi">
              {nudgeData.message[language]}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-success text-white text-[11px] font-medium px-3 py-1 rounded-full hover:bg-success/90 transition-colors"
              >
                {nudgeData.acceptLabel[language] || t('nudge_accept', language)}
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="text-text-secondary text-[11px] font-medium px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {t('nudge_dismiss', language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
