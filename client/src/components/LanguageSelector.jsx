import { useState } from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find(l => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 border border-gray-200 text-xs font-medium hover:bg-white transition-colors"
      >
        <span>{current?.flag}</span>
        <span>{current?.label}</span>
        <span className="text-[10px]">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[120px]">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface transition-colors ${
                language === lang.code ? 'bg-idbi-teal/5 text-idbi-teal font-medium' : 'text-text-primary'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
