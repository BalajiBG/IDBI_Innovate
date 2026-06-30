import { useState } from 'react';
import { formatINR } from '../utils/formatCurrency';

const billGroups = [
  {
    category: 'emi',
    icon: '🏠',
    label: { hi: 'EMI / ऋण', en: 'EMI / Loans', kn: 'EMI / ಸಾಲ' },
    items: [
      { name: 'IDBI Home Loan', amount: 18000, dueDate: '2026-07-05', account: 'HL-2024-001' },
      { name: 'HDFC Car Loan', amount: 8500, dueDate: '2026-07-07', account: 'CL-9981234' }
    ]
  },
  {
    category: 'credit_card',
    icon: '💳',
    label: { hi: 'क्रेडिट कार्ड', en: 'Credit Cards', kn: 'ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್' },
    items: [
      { name: 'IDBI Imperium', amount: 4200, dueDate: '2026-07-10', account: 'XXXX-4521' },
      { name: 'SBI SimplyCLICK', amount: 2800, dueDate: '2026-07-15', account: 'XXXX-8834' },
      { name: 'HDFC Millennia', amount: 1200, dueDate: '2026-07-12', account: 'XXXX-6672' }
    ]
  },
  {
    category: 'telecom',
    icon: '📱',
    label: { hi: 'मोबाइल / WiFi', en: 'Mobile / WiFi', kn: 'ಮೊಬೈಲ್ / WiFi' },
    items: [
      { name: 'Jio Postpaid - Primary', amount: 599, dueDate: '2026-07-12', account: '98765-XXXXX' },
      { name: 'Airtel Postpaid - Spouse', amount: 449, dueDate: '2026-07-14', account: '87654-XXXXX' },
      { name: 'Airtel Xstream WiFi', amount: 999, dueDate: '2026-07-15', account: 'BB-12345' }
    ]
  },
  {
    category: 'utilities',
    icon: '⚡',
    label: { hi: 'बिजली / पानी / गैस', en: 'Electricity / Water / Gas', kn: 'ವಿದ್ಯುತ್ / ನೀರು / ಗ್ಯಾಸ್' },
    items: [
      { name: 'MSEB Electricity', amount: 1800, dueDate: '2026-07-18', account: 'CON-887654' },
      { name: 'PMC Water', amount: 300, dueDate: '2026-07-20', account: 'W-4432' },
      { name: 'Mahanagar Gas', amount: 450, dueDate: '2026-07-22', account: 'MG-9912' }
    ]
  },
  {
    category: 'housing',
    icon: '🏢',
    label: { hi: 'आवास / रखरखाव', en: 'Housing / Maintenance', kn: 'ವಸತಿ / ನಿರ್ವಹಣೆ' },
    items: [
      { name: 'Society Maintenance', amount: 3500, dueDate: '2026-07-01', account: 'Flat B-402' }
    ]
  },
  {
    category: 'insurance',
    icon: '🛡️',
    label: { hi: 'बीमा प्रीमियम', en: 'Insurance Premium', kn: 'ವಿಮೆ ಪ್ರೀಮಿಯಂ' },
    items: [
      { name: 'IDBI Federal Health', amount: 1000, dueDate: '2026-07-25', account: 'HF-2024-98712' }
    ]
  }
];

export default function UpcomingBills({ language }) {
  const [expanded, setExpanded] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const toggleExpand = (category) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const getDaysLeft = (dateStr) => {
    const due = new Date(dateStr);
    const today = new Date();
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const getDueLabel = (daysLeft) => {
    if (daysLeft < 0) return { text: language === 'hi' ? `${Math.abs(daysLeft)} दिन देरी` : language === 'kn' ? `${Math.abs(daysLeft)} ದಿನ ವಿಳಂಬ` : `${Math.abs(daysLeft)} days overdue`, color: 'text-red-500' };
    if (daysLeft === 0) return { text: language === 'hi' ? 'आज देय' : language === 'kn' ? 'ಇಂದು ಬಾಕಿ' : 'Due today', color: 'text-red-500' };
    if (daysLeft <= 3) return { text: language === 'hi' ? `${daysLeft} दिन में देय` : language === 'kn' ? `${daysLeft} ದಿನದಲ್ಲಿ ಬಾಕಿ` : `Due in ${daysLeft} days`, color: 'text-idbi-orange' };
    return { text: language === 'hi' ? `${daysLeft} दिन में देय` : language === 'kn' ? `${daysLeft} ದಿನದಲ್ಲಿ ಬಾಕಿ` : `Due in ${daysLeft} days`, color: 'text-text-secondary' };
  };

  const totalBills = billGroups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.amount, 0), 0);

  return (
    <div className="card p-4">
      {/* Collapsed header — tap to expand */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-idbi-orange/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F98220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-text-primary">
              {language === 'hi' ? 'आगामी बिल' : language === 'kn' ? 'ಮುಂಬರುವ ಬಿಲ್‌ಗಳು' : 'Upcoming Bills'}
            </h3>
            <p className="text-xs text-text-secondary">
              {billGroups.reduce((s, g) => s + g.items.length, 0)} {language === 'hi' ? 'आइटम' : language === 'kn' ? 'ಐಟಂ' : 'items'} • {formatINR(totalBills)}
            </p>
          </div>
        </div>
        <span className={`text-sm text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-fade-in">
      <div className="space-y-1">
        {billGroups.map((group) => {
          const totalAmount = group.items.reduce((s, i) => s + i.amount, 0);
          const nearestDue = Math.min(...group.items.map(i => getDaysLeft(i.dueDate)));
          const dueInfo = getDueLabel(nearestDue);
          const isExpanded = expanded[group.category];

          return (
            <div key={group.category}>
              {/* Group header — tap to expand */}
              <button onClick={() => toggleExpand(group.category)} className="w-full flex items-center justify-between py-2 hover:bg-surface rounded-lg px-1 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{group.icon}</span>
                  <div className="text-left">
                    <p className="text-xs font-medium text-text-primary">{group.label[language] || group.label.en}</p>
                    <p className={`text-xs text-text-secondary`}>
                      {group.items.length} {language === 'hi' ? 'आइटम' : language === 'kn' ? 'ಐಟಂ' : group.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold tabular-nums text-text-primary">{formatINR(totalAmount)}</p>
                  <span className={`text-[10px] text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </button>

              {/* Expanded items */}
              {isExpanded && (
                <div className="ml-8 mb-2 space-y-1.5 animate-fade-in">
                  {group.items.map((item, i) => {
                    const days = getDaysLeft(item.dueDate);
                    const info = getDueLabel(days);
                    return (
                      <div key={i} className="flex items-center justify-between py-1.5 px-2 bg-surface rounded-lg">
                        <div>
                          <p className="text-[11px] font-medium text-text-primary">{item.name}</p>
                          <p className="text-[9px] text-text-secondary">{item.account} • <span className={info.color}>{info.text}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold tabular-nums">{formatINR(item.amount)}</p>
                          {days <= 3 && (
                            <button className="text-[8px] text-idbi-teal font-medium">
                              {language === 'hi' ? 'भुगतान' : language === 'kn' ? 'ಪಾವತಿ' : 'Pay'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-text-secondary">
          {language === 'hi' ? 'इस महीने कुल बिल' : language === 'kn' ? 'ಈ ತಿಂಗಳ ಒಟ್ಟು ಬಿಲ್' : 'Total bills this month'}
        </span>
        <span className="text-sm font-bold text-text-primary tabular-nums">{formatINR(totalBills)}</span>
      </div>
    </div>
      )}
    </div>
  );
}
