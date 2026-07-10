import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../utils/api';
import { formatINR } from '../utils/formatCurrency';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

const COLORS = ['#F98220', '#00836C', '#006B57', '#FFA54C', '#00A88A', '#E06D0E', '#4DB8A4', '#FF8C42', '#2D9B83'];

export default function SpendingPage() {
  const [data, setData] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    api.getSpendingBreakdown().then(setData).catch(console.error);
  }, []);

  const donutData = data?.breakdown?.filter(d => d.name !== 'Salary' && d.name !== 'Investment (RD)').slice(0, 8) || [];

  const trendData = [
    { month: 'Jan', 'Food Delivery': 3800, Groceries: 8200, Entertainment: 2500 },
    { month: 'Feb', 'Food Delivery': 4200, Groceries: 8500, Entertainment: 2800 },
    { month: 'Mar', 'Food Delivery': 5100, Groceries: 8800, Entertainment: 3200 },
    { month: 'Apr', 'Food Delivery': 4000, Groceries: 8400, Entertainment: 2600 },
    { month: 'May', 'Food Delivery': 4200, Groceries: 8600, Entertainment: 2900 },
    { month: 'Jun', 'Food Delivery': 3900, Groceries: 8300, Entertainment: 2700 }
  ];

  const insightCards = [
    { type: 'alert', icon: '⚠️', title: t('insight_alert', language), cta: t('insight_alert_cta', language) },
    { type: 'achievement', icon: '✅', title: t('insight_achievement', language), cta: null },
    { type: 'opportunity', icon: '💡', title: t('insight_opportunity', language), cta: 'SIP →' }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-idbi-orange font-hindi">{t('spending_title', language)}</h2>
        <p className="text-xs text-white">{t('spending_subtitle', language)}</p>
      </div>

      {/* Salary Flow — where money goes */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          {language === 'hi' ? '₹65,000 वेतन कहाँ जाता है?' : language === 'kn' ? '₹65,000 ವೇತನ ಎಲ್ಲಿ ಹೋಗುತ್ತದೆ?' : 'Where does ₹65,000 salary go?'}
        </h3>
        <div className="space-y-2">
          {[
            { label: { hi: 'EMI (Home Loan)', en: 'EMI (Home Loan)', kn: 'EMI (Home Loan)' }, amount: 18000, pct: 27.7, color: '#CC3333' },
            { label: { hi: 'किराना / खाना', en: 'Groceries / Food', kn: 'ದಿನಸಿ / ಆಹಾರ' }, amount: 12700, pct: 19.5, color: '#F98220' },
            { label: { hi: 'शिक्षा', en: 'Education', kn: 'ಶಿಕ್ಷಣ' }, amount: 4500, pct: 6.9, color: '#00836C' },
            { label: { hi: 'बिजली / पानी / फोन', en: 'Utilities', kn: 'ಸೌಲಭ್ಯ' }, amount: 3200, pct: 4.9, color: '#006B57' },
            { label: { hi: 'यात्रा / मनोरंजन', en: 'Travel / Entertainment', kn: 'ಪ್ರಯಾಣ / ಮನರಂಜನೆ' }, amount: 5800, pct: 8.9, color: '#F59E0B' },
            { label: { hi: 'चिकित्सा', en: 'Medical', kn: 'ವೈದ್ಯಕೀಯ' }, amount: 1500, pct: 2.3, color: '#8B5CF6' },
            { label: { hi: 'RD निवेश', en: 'RD Investment', kn: 'RD ಹೂಡಿಕೆ' }, amount: 2000, pct: 3.1, color: '#00836C' },
            { label: { hi: '✅ बचत (अवसर!)', en: '✅ Surplus (opportunity!)', kn: '✅ ಉಳಿತಾಯ (ಅವಕಾಶ!)' }, amount: 17300, pct: 26.6, color: '#00836C' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-full flex-1">
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs text-text-primary font-hindi">{item.label[language] || item.label.en}</span>
                  <span className="text-xs font-semibold tabular-nums">{formatINR(item.amount)} <span className="text-text-secondary font-normal">({item.pct}%)</span></span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donut Chart */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">{t('monthly_breakdown', language)}</h3>
          <span className="text-[9px] text-text-secondary bg-surface px-2 py-0.5 rounded-full">
            {language === 'hi' ? 'वास्तविक लेनदेन से' : language === 'kn' ? 'ನಿಜ ವಹಿವಾಟಿನಿಂದ' : 'From actual transactions'}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={donutData} dataKey="amount" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {donutData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
            </Pie>
            <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={8}
              formatter={(value, entry) => (<span className="text-[10px] text-text-secondary">{value} ({formatINR(entry.payload.amount)})</span>)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Line Chart */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">{t('trend_title', language)}</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatINR(value)} />
            <Line type="monotone" dataKey="Food Delivery" stroke="#F98220" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Groceries" stroke="#00836C" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Entertainment" stroke="#006B57" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-idbi-orange" />Food Delivery</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-idbi-teal" />Groceries</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-idbi-teal-dark" />Entertainment</span>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-3" style={{ width: 'max-content' }}>
          {insightCards.map((card, i) => (
            <div key={i} className="card p-4 w-64 flex-shrink-0">
              <span className="text-xl">{card.icon}</span>
              <p className="text-sm text-text-primary mt-2 font-hindi">{card.title}</p>
              {card.cta && (
                <button className="mt-3 text-xs font-semibold text-idbi-orange hover:underline">{card.cta} →</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
