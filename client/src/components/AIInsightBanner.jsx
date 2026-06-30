import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatINR } from '../utils/formatCurrency';

// AI-generated insights based on customer data analysis
// In production, these would come from Bedrock analyzing real transaction patterns

function generateInsights(language) {
  const insights = [
    {
      id: 'food-spike',
      type: 'alert',
      icon: '🔍',
      route: '/spending',
      title: {
        hi: 'मार्च में Food Delivery 21% बढ़ गया',
        en: 'Food Delivery spiked 21% in March',
        kn: 'ಮಾರ್ಚ್‌ನಲ್ಲಿ Food Delivery 21% ಹೆಚ್ಚಾಗಿದೆ'
      },
      body: {
        hi: '₹5,100 खर्च हुआ vs ₹4,200 औसत। ₹900 बचाकर SIP में डालें तो 10 साल में ₹2.1L बनेगा।',
        en: '₹5,100 spent vs ₹4,200 average. Saving ₹900 and putting it in SIP could grow to ₹2.1L in 10 years.',
        kn: '₹5,100 ಖರ್ಚು vs ₹4,200 ಸರಾಸರಿ. ₹900 ಉಳಿಸಿ SIP ನಲ್ಲಿ ಹಾಕಿದರೆ 10 ವರ್ಷದಲ್ಲಿ ₹2.1L ಆಗುತ್ತದೆ.'
      },
      action: { hi: 'ವ ವ‌', en: 'View Details', kn: 'ವಿವರ ನೋಡಿ' }
    },
    {
      id: 'insurance-gap',
      type: 'critical',
      icon: '🛡️',
      route: '/products',
      title: {
        hi: 'Term Life Insurance अभी नहीं है',
        en: 'Term Life Insurance missing',
        kn: 'Term Life Insurance ಇಲ್ಲ'
      },
      body: {
        hi: 'Health Insurance ₹5L है (अच्छा!), लेकिन Term Life cover नहीं है। 4 परिवार सदस्यों के लिए ₹1 Cr cover ~₹700/month में मिल सकता है।',
        en: 'Health Insurance ₹5L is active (good!), but no Term Life cover. With 4 family members, ₹1 Cr cover is available at ~₹700/month.',
        kn: 'Health Insurance ₹5L ಸಕ್ರಿಯ (ಒಳ್ಳೆಯದು!), ಆದರೆ Term Life cover ಇಲ್ಲ. 4 ಕುಟುಂಬ ಸದಸ್ಯರಿಗೆ ₹1 Cr cover ~₹700/ತಿಂಗಳಿಗೆ ಸಿಗುತ್ತದೆ.'
      },
      action: { hi: 'बीमा देखें', en: 'View Insurance', kn: 'ವಿಮೆ ನೋಡಿ' }
    },
    {
      id: 'sip-opportunity',
      type: 'opportunity',
      icon: '📈',
      route: '/goals',
      title: {
        hi: 'सुझाव: ₹5,000 SIP शुरू करने का सही समय',
        en: 'Suggestion: Right time to start ₹5,000 SIP',
        kn: 'ಸಲಹೆ: ₹5,000 SIP ಶುರು ಮಾಡಲು ಸರಿಯಾದ ಸಮಯ'
      },
      body: {
        hi: 'आपके पास हर महीने ₹17,300 surplus है और कोई Equity allocation नहीं। ₹5,000/month SIP से 15 साल में ₹25.2L संभव।',
        en: 'You have ₹17,300 surplus monthly with zero Equity allocation. ₹5,000/month SIP can grow to ₹25.2L in 15 years.',
        kn: 'ಪ್ರತಿ ತಿಂಗಳು ₹17,300 ಉಳಿತಾಯ ಇದೆ, Equity allocation ಶೂನ್ಯ. ₹5,000/ತಿಂಗಳು SIP 15 ವರ್ಷದಲ್ಲಿ ₹25.2L ಆಗಬಹುದು.'
      },
      action: { hi: 'SIP शुरू करें', en: 'Start SIP', kn: 'SIP ಶುರು ಮಾಡಿ' }
    },
    {
      id: 'tax-saving',
      type: 'tip',
      icon: '💰',
      route: '/goals',
      title: {
        hi: '₹35,880 कर बचा सकते हैं',
        en: 'You can save ₹35,880 in tax',
        kn: '₹35,880 ತೆರಿಗೆ ಉಳಿಸಬಹುದು'
      },
      body: {
        hi: '80C सीमा का सिर्फ 23% उपयोग हुआ है। PPF या ELSS में ₹1,16,000 और निवेश करें।',
        en: 'Only 23% of 80C limit used. Invest ₹1,16,000 more in PPF or ELSS.',
        kn: '80C ಮಿತಿಯ 23% ಮಾತ್ರ ಬಳಸಲಾಗಿದೆ. PPF ಅಥವಾ ELSS ನಲ್ಲಿ ₹1,16,000 ಇನ್ನೂ ಹೂಡಿಕೆ ಮಾಡಿ.'
      },
      action: { hi: 'कर बचत देखें', en: 'View Tax Plan', kn: 'ತೆರಿಗೆ ಯೋಜನೆ ನೋಡಿ' }
    },
    {
      id: 'emergency-close',
      type: 'progress',
      icon: '🎉',
      route: '/goals',
      title: {
        hi: 'आपातकालीन निधि 61.5% पूरा!',
        en: 'Emergency Fund 61.5% complete!',
        kn: 'ತುರ್ತು ನಿಧಿ 61.5% ಪೂರ್ಣ!'
      },
      body: {
        hi: '₹75,000 और चाहिए। मौजूदा गति से 4 महीने में पूरा हो जाएगा। बहुत अच्छे!',
        en: '₹75,000 more needed. At current pace, complete in 4 months. Great going!',
        kn: '₹75,000 ಇನ್ನೂ ಬೇಕು. ಪ್ರಸ್ತುತ ವೇಗದಲ್ಲಿ 4 ತಿಂಗಳಲ್ಲಿ ಪೂರ್ಣ. ತುಂಬಾ ಚೆನ್ನಾಗಿ ಮಾಡುತ್ತಿದ್ದೀರಿ!'
      },
      action: { hi: 'लक्ष्य देखें', en: 'View Goals', kn: 'ಗುರಿ ನೋಡಿ' }
    }
  ];

  return insights;
}

export default function AIInsightBanner() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState([]);

  const allInsights = generateInsights(language);
  const insights = allInsights.filter(i => !dismissed.includes(i.id));

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (insights.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % insights.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [insights.length]);

  if (insights.length === 0) return null;
  const insight = insights[currentIndex % insights.length];
  if (!insight) return null;

  const bgColor = {
    alert: 'bg-idbi-orange/5 border-idbi-orange/20',
    critical: 'bg-red-50 border-red-200',
    opportunity: 'bg-idbi-teal/5 border-idbi-teal/20',
    tip: 'bg-amber-50 border-amber-200',
    progress: 'bg-success/5 border-success/20'
  }[insight.type] || 'bg-surface border-gray-200';

  const aiLabel = {
    hi: 'सलाहकार सुझाव',
    en: 'Wealth Advisor Insight',
    kn: 'ಸಲಹೆಗಾರ ಸೂಚನೆ'
  }[language];

  return (
    <div className={`card p-4 border ${bgColor} relative`}>
      {/* AI Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-idbi-teal flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className="text-[10px] font-bold text-idbi-teal uppercase">{aiLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          {insights.length > 1 && (
            <span className="text-[9px] text-text-secondary">{(currentIndex % insights.length) + 1}/{insights.length}</span>
          )}
          <button onClick={() => setDismissed(prev => [...prev, insight.id])} className="text-text-secondary text-xs hover:text-text-primary">✕</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{insight.icon}</span>
        <div className="flex-1">
          <p className="text-xs font-bold text-text-primary font-hindi">{insight.title[language]}</p>
          <p className="text-[11px] text-text-secondary mt-1 font-hindi leading-relaxed">{insight.body[language]}</p>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => navigate(insight.route)}
        className="mt-3 w-full py-2 rounded-lg bg-idbi-teal/10 text-idbi-teal text-xs font-semibold hover:bg-idbi-teal/20 transition-colors font-hindi"
      >
        {insight.action[language]} →
      </button>

      {/* Dot indicators */}
      {insights.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {insights.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === (currentIndex % insights.length) ? 'bg-idbi-teal w-3' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
