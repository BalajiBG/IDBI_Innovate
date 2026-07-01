import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

export default function NudgeNotification() {
  const [visible, setVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nudgeData, setNudgeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  // Editable transfer fields
  const [editAmount, setEditAmount] = useState('');
  const [editFromAccount, setEditFromAccount] = useState('');
  const [editToAccount, setEditToAccount] = useState('');
  const [editRemarks, setEditRemarks] = useState('');

  // Fetch smart nudge from server (checks completed actions)
  useEffect(() => {
    async function fetchNudge() {
      try {
        const res = await fetch('/api/data/smart-nudge');
        const data = await res.json();
        if (data.nudge && data.nudge.type !== 'no_action') {
          setNudgeData(data.nudge);
          setEditAmount(String(data.nudge.suggestedAmount));
          setEditFromAccount(data.nudge.fromAccount);
          setEditToAccount(data.nudge.toAccount);
          setEditRemarks(data.nudge.purpose);
        } else if (data.nudge && data.nudge.type === 'no_action') {
          setNudgeData(data.nudge);
        } else {
          setNudgeData(null);
        }
      } catch (e) {
        console.error('Failed to fetch nudge:', e);
        setNudgeData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchNudge();
  }, []);

  // Show nudge after delay
  useEffect(() => {
    if (!loading && nudgeData) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, nudgeData]);

  if (loading || dismissed || !visible || !nudgeData) return null;

  // If no surplus left — show congratulatory message briefly
  if (nudgeData.type === 'no_action') {
    return (
      <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-slide-up">
        <div className="card border border-success p-3 flex items-center gap-3">
          <span className="text-lg">🎉</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-success">{nudgeData.title[language]}</p>
            <p className="text-[10px] text-text-secondary">{nudgeData.message[language]}</p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-text-secondary text-xs">✕</button>
        </div>
      </div>
    );
  }

  // Transfer success state
  if (accepted) {
    const amt = parseInt(editAmount) || 0;
    return (
      <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-bounce-in">
        <div className="card border border-success p-3 flex items-center gap-3">
          <span className="text-lg">✅</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-success">
              {language === 'hi' ? 'जमा सफल!' : language === 'kn' ? 'ವರ್ಗಾವಣೆ ಯಶಸ್ವಿ!' : 'Transfer Successful!'}
            </p>
            <p className="text-[10px] text-text-secondary">
              {language === 'hi'
                ? `₹${amt.toLocaleString('en-IN')} ${editRemarks} में जमा किया गया।`
                : language === 'kn'
                ? `₹${amt.toLocaleString('en-IN')} ${editRemarks} ಗೆ ಜಮಾ ಮಾಡಲಾಗಿದೆ.`
                : `₹${amt.toLocaleString('en-IN')} transferred to ${editRemarks}.`}
            </p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-text-secondary text-xs">✕</button>
        </div>
      </div>
    );
  }

  // Editable confirmation form
  if (showConfirm) {
    return (
      <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-slide-up">
        <div className="card border border-idbi-orange p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-text-primary font-hindi">
              {language === 'hi' ? 'विवरण संपादित करें और पुष्टि करें' : language === 'kn' ? 'ವಿವರ ಸಂಪಾದಿಸಿ ಮತ್ತು ದೃಢೀಕರಿಸಿ' : 'Edit & Confirm Transfer'}
            </p>
            <button onClick={() => { setShowConfirm(false); setDismissed(true); }} className="text-text-secondary text-sm">✕</button>
          </div>

          <div className="space-y-2.5 mb-3">
            {/* Amount — editable */}
            <div>
              <label className="text-[10px] text-text-secondary block mb-0.5">
                {language === 'hi' ? 'राशि (₹)' : language === 'kn' ? 'ಮೊತ್ತ (₹)' : 'Amount (₹)'}
              </label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-idbi-teal"
                min="100"
                max={nudgeData.remainingSurplus || 50000}
              />
              {nudgeData.remainingSurplus && (
                <p className="text-[9px] text-text-secondary mt-0.5">
                  {language === 'hi' ? `उपलब्ध surplus: ₹${nudgeData.remainingSurplus.toLocaleString('en-IN')}` : `Available surplus: ₹${nudgeData.remainingSurplus.toLocaleString('en-IN')}`}
                </p>
              )}
            </div>

            {/* From Account — editable */}
            <div>
              <label className="text-[10px] text-text-secondary block mb-0.5">
                {language === 'hi' ? 'से (खाता)' : language === 'kn' ? 'ಇಂದ (ಖಾತೆ)' : 'From Account'}
              </label>
              <select
                value={editFromAccount}
                onChange={(e) => setEditFromAccount(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-idbi-teal"
              >
                <option value="IDBI Savings XXXX-4521">IDBI Savings XXXX-4521</option>
                <option value="IDBI Salary XXXX-7890">IDBI Salary XXXX-7890</option>
              </select>
            </div>

            {/* To Account — editable */}
            <div>
              <label className="text-[10px] text-text-secondary block mb-0.5">
                {language === 'hi' ? 'को (खाता)' : language === 'kn' ? 'ಗೆ (ಖಾತೆ)' : 'To Account'}
              </label>
              <select
                value={editToAccount}
                onChange={(e) => setEditToAccount(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-idbi-teal"
              >
                <option value="IDBI Emergency Fund RD">IDBI Emergency Fund RD</option>
                <option value="IDBI Mutual Fund SIP">IDBI Mutual Fund SIP</option>
                <option value="IDBI PPF Account">IDBI PPF Account</option>
                <option value="IDBI Tax Saver FD">IDBI Tax Saver FD</option>
              </select>
            </div>

            {/* Remarks — editable */}
            <div>
              <label className="text-[10px] text-text-secondary block mb-0.5">
                {language === 'hi' ? 'टिप्पणी' : language === 'kn' ? 'ಟಿಪ್ಪಣಿ' : 'Remarks'}
              </label>
              <input
                type="text"
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-idbi-teal"
                placeholder={language === 'hi' ? 'उदाहरण: आपातकालीन निधि' : 'e.g. Emergency Fund'}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setShowConfirm(false); setDismissed(true); }}
              className="flex-1 py-2 rounded-full border border-gray-200 text-xs font-medium text-text-secondary"
            >
              {language === 'hi' ? 'रद्द करें' : language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
            </button>
            <button
              onClick={async () => {
                const amt = parseInt(editAmount) || 0;
                if (amt <= 0) return;
                try {
                  // Record the completed nudge action
                  await fetch('/api/data/nudge-actions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      purpose: nudgeData.purpose,
                      amount: amt,
                      fromAccount: editFromAccount,
                      toAccount: editToAccount,
                      remarks: editRemarks
                    })
                  });
                  // Also add to portfolio for visibility
                  await fetch('/api/data/portfolio-linked', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      bank: editToAccount,
                      type: 'savings',
                      number: `${editRemarks} ₹${amt.toLocaleString('en-IN')}`,
                      balance: amt,
                      icon: nudgeData.type === 'emergency_fund' ? '🛡️' : '📈'
                    })
                  });
                } catch (e) {
                  console.error('Failed to save nudge action:', e);
                }
                setShowConfirm(false);
                setAccepted(true);
              }}
              className="flex-1 py-2 rounded-full bg-idbi-teal text-white text-xs font-semibold"
            >
              {language === 'hi' ? 'पुष्टि करें' : language === 'kn' ? 'ದೃಢೀಕರಿಸಿ' : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial nudge notification — no "before SIP" messaging
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
            {/* Show progress indicator for emergency fund */}
            {nudgeData.type === 'emergency_fund' && nudgeData.emergencyPct !== undefined && (
              <div className="mt-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-text-secondary">
                    {language === 'hi' ? 'प्रगति' : language === 'kn' ? 'ಪ್ರಗತಿ' : 'Progress'}
                  </span>
                  <span className="text-[9px] font-bold text-idbi-teal">{nudgeData.emergencyPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-0.5">
                  <div
                    className="h-full bg-idbi-teal rounded-full transition-all"
                    style={{ width: `${nudgeData.emergencyPct}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-success text-white text-[11px] font-medium px-3 py-1 rounded-full hover:bg-success/90 transition-colors"
              >
                {language === 'hi'
                  ? `₹${(nudgeData.suggestedAmount || 0).toLocaleString('en-IN')} जमा करें`
                  : language === 'kn'
                  ? `₹${(nudgeData.suggestedAmount || 0).toLocaleString('en-IN')} ವರ್ಗಾಯಿಸಿ`
                  : `Transfer ₹${(nudgeData.suggestedAmount || 0).toLocaleString('en-IN')}`}
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
