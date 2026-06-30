import { formatINR } from '../utils/formatCurrency';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import { WalletIcon, AlertIcon, InvestIcon, ShieldIcon } from './Icons';

export default function QuickStatsRow() {
  const { language } = useLanguage();

  const stats = [
    { label: t('monthly_surplus', language), value: 17300, Icon: WalletIcon, color: '#00836C',
      sub: { hi: 'इस महीने बचा', en: 'saved this month', kn: 'ಈ ತಿಂಗಳು ಉಳಿದಿದೆ' }[language] },
    { label: t('largest_spend', language), value: 4200, Icon: AlertIcon, color: '#F98220',
      sub: { hi: 'Food Delivery पर खर्च — औसत से 40% ज़्यादा, कम करें', en: 'spent on Food Delivery — 40% above average, reduce', kn: 'Food Delivery ಖರ್ಚು — ಸರಾಸರಿಗಿಂತ 40% ಹೆಚ್ಚು, ಕಡಿಮೆ ಮಾಡಿ' }[language] },
    { label: t('portfolio_value', language), value: 141500, Icon: InvestIcon, color: '#00836C',
      sub: { hi: 'कुल निवेश मूल्य', en: 'total investment value', kn: 'ಒಟ್ಟು ಹೂಡಿಕೆ ಮೌಲ್ಯ' }[language] },
    { label: t('next_milestone', language), value: 75000, Icon: ShieldIcon, color: '#F98220',
      sub: { hi: 'Emergency Fund पूरा करने में बाकी', en: 'remaining to complete Emergency Fund', kn: 'Emergency Fund ಪೂರ್ಣ ಮಾಡಲು ಬಾಕಿ' }[language] }
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mt-3">
      {stats.map((stat, i) => (
        <div key={i} className="card p-2.5 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}10` }}>
            <stat.Icon size={14} color={stat.color} />
          </div>
          <p className="text-base font-bold tabular-nums mt-1.5" style={{ color: stat.color }}>
            {stat.value ? formatINR(stat.value) : ''}
          </p>
          <p className="text-xs text-text-secondary mt-0.5 leading-tight">
            {stat.sub || stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
