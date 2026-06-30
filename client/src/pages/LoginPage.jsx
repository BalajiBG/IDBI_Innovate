import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { t } from '../utils/translations';

export default function LoginPage() {
  const [customerId, setCustomerId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(customerId || 'IDBI-2024-RK001', pin || '1234', language);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-idbi-teal to-idbi-teal-dark flex flex-col items-center justify-center px-6 py-4">
      {/* Logo + Title — compact */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#F98220" />
            <path d="M50 20 C50 20 35 30 30 50 C27 62 35 78 50 80 C65 78 73 62 70 50 C65 30 50 20 50 20 Z" fill="none" stroke="white" strokeWidth="5" />
            <line x1="50" y1="28" x2="50" y2="72" stroke="white" strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="22" r="4" fill="white" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">IDBI Bank</h1>
      </div>
      <h2 className="text-2xl font-bold text-white font-hindi">WealthSeva AI</h2>
      <p className="text-emerald-100 font-hindi text-sm mb-4">{t('login_tagline', language)}</p>

      {/* Language Selector — compact row */}
      <div className="flex gap-2 mb-4">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              language === lang.code
                ? 'bg-white text-idbi-teal shadow'
                : 'bg-white/20 text-white'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Login Card — compact */}
      <div className="card w-full max-w-sm p-5">
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">{t('login_customer_id', language)}</label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Demo: any ID works (e.g. IDBI001)"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-idbi-teal/20 focus:border-idbi-teal outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">{t('login_pin', language)}</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Demo: any 4-digit PIN (e.g. 1234)"
              maxLength={4}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-idbi-teal/20 focus:border-idbi-teal outline-none"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm disabled:opacity-50">
            {loading ? '...' : t('login_button', language)}
          </button>
        </form>
        <p className="text-xs text-text-secondary text-center mt-3">{t('login_powered_by', language)}</p>
      </div>

      <p className="text-emerald-200/60 text-xs mt-3">IDBI Innovate 2026 × Hack2Skill × AWS</p>
    </div>
  );
}
