import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

export default function AvatarDisplay({ isSpeaking, responseText }) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Circle */}
      <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-idbi-orange to-idbi-teal flex items-center justify-center shadow-lg ${isSpeaking ? 'animate-pulse-slow' : ''}`}>
        <span className="text-3xl">🧑‍💼</span>
        {isSpeaking && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-idbi-orange/30 animate-ping" />
          </>
        )}
      </div>

      {/* Sound wave bars */}
      {isSpeaking && (
        <div className="flex items-center justify-center gap-1 mt-3 h-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-idbi-orange rounded-full sound-wave-bar"
              style={{ height: '100%', animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      )}

      {/* Name label */}
      <p className="text-xs font-semibold text-idbi-teal mt-2">{t('seva_name', language)}</p>
      <p className="text-[10px] text-text-secondary">{t('seva_subtitle', language)}</p>
    </div>
  );
}
