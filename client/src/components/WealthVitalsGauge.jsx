import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

export default function WealthVitalsGauge({ score = 61, subScores = [], sevaComment = '' }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const offset = circumference - progress;

  const getColor = (s) => {
    if (s >= 71) return '#00836C';
    if (s >= 40) return '#F98220';
    return '#E06D0E';
  };

  const color = getColor(score);

  // Default sub-scores if API hasn't loaded yet
  const displayScores = subScores.length > 0 ? subScores : [
    { name: 'Emergency Fund', points: 12, maxPoints: 20, color: '#F98220' },
    { name: 'Debt-to-Income', points: 13, maxPoints: 20, color: '#F98220' },
    { name: 'Savings Rate', points: 8, maxPoints: 20, color: '#E06D0E' },
    { name: 'Investment Diversity', points: 6, maxPoints: 20, color: '#E06D0E' },
    { name: 'Goal Progress', points: 12, maxPoints: 20, color: '#F98220' }
  ];

  return (
    <div className="card p-4">
      <h2 className="text-xs font-semibold text-text-secondary mb-3">{t('wealth_vitals_title', language)}</h2>

      <div className="flex items-center gap-4">
        {/* Compact Gauge */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold tabular-nums" style={{ color }}>{animatedScore}<span className="text-text-secondary font-normal">/100</span></span>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="flex-1 space-y-1.5">
          {displayScores.map((sub, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs text-text-secondary">{sub.name}</span>
                <span className="text-xs font-semibold tabular-nums">{sub.points}/{sub.maxPoints}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(sub.points / sub.maxPoints) * 100}%`,
                    backgroundColor: sub.color,
                    transitionDelay: `${i * 150}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seva Comment */}
      <p className="text-xs text-text-secondary mt-3 p-2.5 bg-idbi-orange/5 rounded-xl border border-idbi-orange/10 font-hindi">
        💡 {t('seva_comment', language)}
      </p>
    </div>
  );
}
