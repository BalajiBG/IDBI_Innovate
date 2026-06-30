import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { formatINR } from '../utils/formatCurrency';

const labels = {
  title: { hi: 'मेरी प्रोफ़ाइल', en: 'My Profile', kn: 'ನನ್ನ ಪ್ರೊಫೈಲ್' },
  subtitle: { hi: 'जीवनशैली विवरण — बेहतर सलाह के लिए', en: 'Lifestyle details — for better advice', kn: 'ಜೀವನಶೈಲಿ ವಿವರ — ಉತ್ತಮ ಸಲಹೆಗಾಗಿ' },
  family: { hi: 'परिवार', en: 'Family', kn: 'ಕುಟುಂಬ' },
  familyMembers: { hi: 'परिवार के सदस्य (आप सहित)', en: 'Family members (including you)', kn: 'ಕುಟುಂಬ ಸದಸ್ಯರು (ನೀವು ಸೇರಿ)' },
  dependents: { hi: 'आश्रित (बच्चे/बुज़ुर्ग)', en: 'Dependents (children/elderly)', kn: 'ಅವಲಂಬಿತರು (ಮಕ್ಕಳು/ಹಿರಿಯರು)' },
  lifestyle: { hi: 'अनुमानित मासिक जीवनशैली खर्च', en: 'Approximate Monthly Lifestyle Expenses', kn: 'ಅಂದಾಜು ಮಾಸಿಕ ಜೀವನಶೈಲಿ ಖರ್ಚು' },
  rent: { hi: 'किराया / EMI', en: 'Rent / EMI', kn: 'ಬಾಡಿಗೆ / EMI' },
  electricity: { hi: 'बिजली बिल', en: 'Electricity Bill', kn: 'ವಿದ್ಯುತ್ ಬಿಲ್' },
  water: { hi: 'पानी बिल', en: 'Water Bill', kn: 'ನೀರಿನ ಬಿಲ್' },
  maintenance: { hi: 'घर रखरखाव', en: 'Home Maintenance', kn: 'ಮನೆ ನಿರ್ವಹಣೆ' },
  helpers: { hi: 'सहायक / नौकर', en: 'Helpers / Maid', kn: 'ಸಹಾಯಕರು / ಕೆಲಸಗಾರರು' },
  recharges: { hi: 'मोबाइल / TV / WiFi', en: 'Mobile / TV / WiFi', kn: 'ಮೊಬೈಲ್ / TV / WiFi' },
  gifts: { hi: 'उपहार / जन्मदिन / त्योहार', en: 'Gifts / Birthdays / Festivals', kn: 'ಉಡುಗೊರೆ / ಹುಟ್ಟುಹಬ್ಬ / ಹಬ್ಬಗಳು' },
  outings: { hi: 'बाहर घूमना / मनोरंजन', en: 'Outings / Entertainment', kn: 'ಹೊರಹೋಗುವಿಕೆ / ಮನರಂಜನೆ' },
  transport: { hi: 'यात्रा / ईंधन', en: 'Transport / Fuel', kn: 'ಸಾರಿಗೆ / ಇಂಧನ' },
  groceries: { hi: 'किराना / राशन', en: 'Groceries', kn: 'ದಿನಸಿ' },
  education: { hi: 'शिक्षा / ट्यूशन', en: 'Education / Tuition', kn: 'ಶಿಕ್ಷಣ / ಟ್ಯೂಶನ್' },
  medical: { hi: 'चिकित्सा / दवाई', en: 'Medical / Medicine', kn: 'ವೈದ್ಯಕೀಯ / ಔಷಧ' },
  save: { hi: 'सहेजें', en: 'Save', kn: 'ಉಳಿಸಿ' },
  saved: { hi: '✓ प्रोफ़ाइल अपडेट हुई!', en: '✓ Profile updated!', kn: '✓ ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ!' },
  summary: { hi: 'खर्च सारांश', en: 'Expense Summary', kn: 'ಖರ್ಚು ಸಾರಾಂಶ' },
  totalLifestyle: { hi: 'कुल जीवनशैली खर्च', en: 'Total Lifestyle Expenses', kn: 'ಒಟ್ಟು ಜೀವನಶೈಲಿ ಖರ್ಚು' },
  remainingForInvest: { hi: 'निवेश के लिए उपलब्ध', en: 'Available for Investment', kn: 'ಹೂಡಿಕೆಗೆ ಲಭ್ಯ' },
  spendRatio: { hi: 'खर्च-आय अनुपात', en: 'Expense-Income Ratio', kn: 'ಖರ್ಚು-ಆದಾಯ ಅನುಪಾತ' },
  scoreImpact: { hi: 'स्कोर पर प्रभाव', en: 'Score Impact', kn: 'ಸ್ಕೋರ್ ಮೇಲೆ ಪ್ರಭಾವ' },
  perMonth: { hi: '/महीना', en: '/month', kn: '/ತಿಂಗಳು' }
};

const defaultProfile = {
  familyMembers: 4,
  dependents: 3,
  rent: 18000,
  electricity: 1800,
  water: 300,
  maintenance: 1500,
  helpers: 3000,
  recharges: 1200,
  gifts: 2000,
  outings: 3000,
  transport: 3000,
  groceries: 8500,
  education: 4500,
  medical: 1500
};

export default function ProfilePage() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState(defaultProfile);
  const [showSaved, setShowSaved] = useState(false);

  const l = (key) => labels[key]?.[language] || labels[key]?.en || key;

  // Load from backend
  useEffect(() => {
    fetch('/api/data/profile')
      .then(res => res.json())
      .then(data => { if (data && data.familyMembers) setProfile(data); })
      .catch(() => {});
  }, []);

  const salary = 65000;
  const totalExpenses = profile.rent + profile.electricity + profile.water + profile.maintenance +
    profile.helpers + profile.recharges + profile.gifts + profile.outings +
    profile.transport + profile.groceries + profile.education + profile.medical;
  const remaining = salary - totalExpenses;
  const spendRatio = Math.round((totalExpenses / salary) * 100);

  const getScoreImpact = () => {
    if (spendRatio < 50) return { text: { hi: 'उत्कृष्ट! बचत दर बहुत अच्छी', en: 'Excellent! Savings rate is great', kn: 'ಅತ್ಯುತ್ತಮ! ಉಳಿತಾಯ ದರ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ' }, color: '#00836C', boost: '+8' };
    if (spendRatio < 70) return { text: { hi: 'ठीक है, लेकिन सुधार संभव', en: 'Okay, but improvement possible', kn: 'ಸರಿ, ಆದರೆ ಸುಧಾರಣೆ ಸಾಧ್ಯ' }, color: '#F98220', boost: '+3' };
    return { text: { hi: 'खर्च अधिक है — बचत बढ़ाएं', en: 'Spending is high — increase savings', kn: 'ಖರ್ಚು ಹೆಚ್ಚಾಗಿದೆ — ಉಳಿತಾಯ ಹೆಚ್ಚಿಸಿ' }, color: '#E06D0E', boost: '-2' };
  };

  const impact = getScoreImpact();

  const handleSave = async () => {
    try {
      await fetch('/api/data/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
    } catch (e) {}
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const InputRow = ({ label, field }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-50">
      <span className="text-xs text-text-primary font-hindi">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-text-secondary">₹</span>
        <input
          type="number"
          value={profile[field]}
          onChange={(e) => updateField(field, e.target.value)}
          className="w-20 text-right text-sm font-semibold tabular-nums bg-surface px-2 py-1 rounded-lg outline-none focus:ring-1 focus:ring-idbi-teal/30"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-text-primary font-hindi">{l('title')}</h2>
        <p className="text-xs text-text-secondary font-hindi">{l('subtitle')}</p>
      </div>

      {showSaved && (
        <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-sm text-success font-medium text-center animate-slide-up font-hindi">
          {l('saved')}
        </div>
      )}

      {/* Family */}
      <div className="card p-4">
        <p className="text-sm font-semibold text-text-primary mb-3 font-hindi">{l('family')}</p>
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-xs text-text-primary font-hindi">{l('familyMembers')}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => updateField('familyMembers', Math.max(1, profile.familyMembers - 1))} className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-text-secondary">−</button>
            <span className="text-sm font-bold tabular-nums w-4 text-center">{profile.familyMembers}</span>
            <button onClick={() => updateField('familyMembers', profile.familyMembers + 1)} className="w-7 h-7 rounded-full bg-idbi-teal/10 flex items-center justify-center text-sm font-bold text-idbi-teal">+</button>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-xs text-text-primary font-hindi">{l('dependents')}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => updateField('dependents', Math.max(0, profile.dependents - 1))} className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-text-secondary">−</button>
            <span className="text-sm font-bold tabular-nums w-4 text-center">{profile.dependents}</span>
            <button onClick={() => updateField('dependents', profile.dependents + 1)} className="w-7 h-7 rounded-full bg-idbi-teal/10 flex items-center justify-center text-sm font-bold text-idbi-teal">+</button>
          </div>
        </div>
      </div>

      {/* Lifestyle Expenses */}
      <div className="card p-4">
        <p className="text-sm font-semibold text-text-primary mb-2 font-hindi">{l('lifestyle')}</p>
        <InputRow label={l('rent')} field="rent" />
        <InputRow label={l('groceries')} field="groceries" />
        <InputRow label={l('electricity')} field="electricity" />
        <InputRow label={l('water')} field="water" />
        <InputRow label={l('maintenance')} field="maintenance" />
        <InputRow label={l('helpers')} field="helpers" />
        <InputRow label={l('recharges')} field="recharges" />
        <InputRow label={l('education')} field="education" />
        <InputRow label={l('medical')} field="medical" />
        <InputRow label={l('transport')} field="transport" />
        <InputRow label={l('outings')} field="outings" />
        <InputRow label={l('gifts')} field="gifts" />
      </div>

      {/* Live Summary */}
      <div className="card p-4 bg-gradient-to-r from-idbi-teal/5 to-idbi-orange/5 border border-idbi-teal/10">
        <p className="text-sm font-semibold text-text-primary mb-3 font-hindi">{l('summary')}</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-text-secondary font-hindi">{l('totalLifestyle')}</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">{formatINR(totalExpenses)}{l('perMonth')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-text-secondary font-hindi">{l('remainingForInvest')}</span>
            <span className={`text-sm font-bold tabular-nums ${remaining > 0 ? 'text-idbi-teal' : 'text-red-500'}`}>{formatINR(remaining)}{l('perMonth')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-text-secondary font-hindi">{l('spendRatio')}</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: impact.color }}>{spendRatio}%</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs text-text-secondary font-hindi">{l('scoreImpact')}</span>
            <div className="text-right">
              <span className="text-xs font-bold" style={{ color: impact.color }}>{impact.boost} pts</span>
              <p className="text-[10px] text-text-secondary font-hindi">{impact.text[language] || impact.text.en}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} className="w-full py-3 rounded-full bg-idbi-teal text-white font-semibold text-sm hover:bg-idbi-teal-dark transition-colors font-hindi">
        {l('save')}
      </button>
    </div>
  );
}
