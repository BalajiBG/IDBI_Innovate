import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WealthVitalsGauge from '../components/WealthVitalsGauge';
import QuickStatsRow from '../components/QuickStatsRow';
import CreditScoreCard from '../components/CreditScoreCard';
import AIInsightBanner from '../components/AIInsightBanner';
import UpcomingBills from '../components/UpcomingBills';
import { AccountsIcon } from '../components/Icons';
import { api } from '../utils/api';
import { formatINR } from '../utils/formatCurrency';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

export default function DashboardPage() {
  const [vitals, setVitals] = useState(null);
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    api.getWealthVitals().then(setVitals).catch(console.error);
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Accounts link — collapsible */}
      <div className="card p-3">
        <button onClick={() => navigate('/accounts')} className="w-full flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-idbi-teal/10 flex items-center justify-center">
            <AccountsIcon size={16} color="#00836C" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-text-primary">{t('nav_accounts', language)}</p>
            <p className="text-[10px] text-text-secondary">IDBI + Investments + Insurances + Other Income</p>
          </div>
          <span className="text-text-secondary text-sm">→</span>
        </button>
      </div>

      {/* Upcoming Bills */}
      <UpcomingBills language={language} />

      {/* Credit Score */}
      <CreditScoreCard />

      {/* Financial Health Score */}
      <WealthVitalsGauge
        score={vitals?.totalScore || 61}
        subScores={vitals?.subScores || []}
        sevaComment={vitals?.sevaComment || ''}
      />

      {/* Wealth Advisor Insights */}
      <AIInsightBanner />
    </div>
  );
}
