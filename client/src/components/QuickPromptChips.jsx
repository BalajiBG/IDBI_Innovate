import { useLanguage } from '../context/LanguageContext';

const PROMPTS = {
  hi: [
    'मेरा पैसा कहाँ जा रहा है?',
    'SIP कैसे शुरू करें?',
    'मेरा बैलेंस बताओ',
    'खाता कैसे जोड़ें?',
    'मेरा स्कोर कैसे बढ़ेगा?'
  ],
  en: [
    'Where is my money going?',
    'How to start a SIP?',
    'Show my balance',
    'How to link accounts?',
    'How to improve my score?'
  ],
  kn: [
    'ನನ್ನ ಹಣ ಎಲ್ಲಿ ಹೋಗುತ್ತಿದೆ?',
    'SIP ಹೇಗೆ ಶುರು ಮಾಡುವುದು?',
    'ನನ್ನ ಬ್ಯಾಲೆನ್ಸ್ ತೋರಿಸಿ',
    'ಖಾತೆ ಹೇಗೆ ಲಿಂಕ್ ಮಾಡುವುದು?',
    'ನನ್ನ ಸ್ಕೋರ್ ಹೇಗೆ ಸುಧಾರಿಸುತ್ತದೆ?'
  ]
};

export default function QuickPromptChips({ onSelect, disabled }) {
  const { language } = useLanguage();
  const prompts = PROMPTS[language] || PROMPTS.hi;

  return (
    <div className="flex-shrink-0 px-4 py-2 overflow-x-auto">
      <div className="flex gap-2">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSelect(prompt)}
            disabled={disabled}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-white/30 text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors font-hindi whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
