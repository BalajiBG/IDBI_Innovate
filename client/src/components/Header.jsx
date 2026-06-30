import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

export default function Header() {
  const { customer } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const name = customer?.name?.split(' ')[0] || 'Rajesh';

  return (
    <header className="px-4 pt-4 pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary font-hindi">
            {t('greeting', language, { name })}
          </h1>
        </div>
        <button onClick={() => navigate('/profile')} className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-idbi-orange to-idbi-teal flex items-center justify-center text-white text-sm font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse-slow" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-text-secondary">{dateStr}</span>
        <span className="status-pill bg-success/10 text-success">
          {t('salary_credited', language)}
        </span>
      </div>
    </header>
  );
}
