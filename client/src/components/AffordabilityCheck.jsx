import { useLanguage } from '../context/LanguageContext';
import { checkMonthlyAffordability, checkLumpSumAffordability, getRecommendedAmount } from '../utils/affordability';
import { formatINR } from '../utils/formatCurrency';

/**
 * Shows affordability status for an amount input.
 * Props:
 *   amount: number — the amount user entered
 *   type: 'monthly' | 'lumpsum' — type of commitment
 *   frequency: 'daily'|'weekly'|'monthly'|... — converts to monthly for check
 */
export default function AffordabilityCheck({ amount, type = 'monthly', frequency = 'monthly' }) {
  const { language } = useLanguage();

  if (!amount || amount <= 0) return null;

  // Convert frequency to monthly equivalent
  let monthlyEquivalent = amount;
  if (type === 'monthly' || type === 'recurring') {
    const freqToMonthly = {
      daily: amount * 30,
      weekly: amount * 4.33,
      biweekly: amount * 2.17,
      monthly: amount,
      quarterly: amount / 3,
      halfyearly: amount / 6,
      yearly: amount / 12
    };
    monthlyEquivalent = Math.round(freqToMonthly[frequency] || amount);
  }

  const result = type === 'lumpsum'
    ? checkLumpSumAffordability(amount, language)
    : checkMonthlyAffordability(monthlyEquivalent, language);

  if (result.status === 'none') return null;

  const recommended = getRecommendedAmount(language);

  return (
    <div className={`mt-2 p-2.5 rounded-xl text-xs font-hindi border ${
      result.status === 'safe' ? 'bg-success/5 border-success/20' :
      result.status === 'stretch' ? 'bg-idbi-orange/5 border-idbi-orange/20' :
      'bg-red-50 border-red-200'
    }`}>
      <p style={{ color: result.color }} className="font-medium">{result.message}</p>
      {result.status !== 'safe' && type !== 'lumpsum' && (
        <p className="text-[10px] text-text-secondary mt-1">
          {language === 'hi' ? `सुझाव: ${formatINR(recommended.monthly)}/माह तक रहें` :
           language === 'kn' ? `ಸಲಹೆ: ${formatINR(recommended.monthly)}/ತಿಂಗಳು ವರೆಗೆ ಇರಿ` :
           `Suggestion: Stay within ${formatINR(recommended.monthly)}/month`}
        </p>
      )}
    </div>
  );
}
