// Affordability Engine — checks if customer can safely invest/commit the amount
// Based on: Monthly Salary ₹65,000 | Existing Expenses ₹49,700 | Surplus ₹17,300

const CUSTOMER = {
  monthlySalary: 65000,
  monthlyExpenses: 49700,
  monthlySurplus: 17300,   // salary - expenses - existing investments
  existingCommitments: 2000, // current RD
  emergencyBuffer: 5000    // always keep ₹5,000 as buffer
};

// Available to invest = surplus - existing commitments - emergency buffer
const SAFE_MONTHLY_LIMIT = CUSTOMER.monthlySurplus - CUSTOMER.existingCommitments - CUSTOMER.emergencyBuffer; // ₹10,300
const STRETCH_MONTHLY_LIMIT = CUSTOMER.monthlySurplus - CUSTOMER.existingCommitments; // ₹15,300

/**
 * Check if a monthly commitment is affordable.
 * Returns: { status, message, color, limit }
 * status: 'safe' | 'stretch' | 'risky'
 */
export function checkMonthlyAffordability(monthlyAmount, language = 'en') {
  if (monthlyAmount <= 0) return { status: 'none', message: '', color: '', limit: SAFE_MONTHLY_LIMIT };

  if (monthlyAmount <= SAFE_MONTHLY_LIMIT) {
    return {
      status: 'safe',
      message: {
        hi: `✓ सुरक्षित: यह आपकी मासिक बचत सीमा (${formatNum(SAFE_MONTHLY_LIMIT)}) के अंदर है`,
        en: `✓ Safe: This is within your comfortable monthly limit (${formatNum(SAFE_MONTHLY_LIMIT)})`,
        kn: `✓ ಸುರಕ್ಷಿತ: ಇದು ನಿಮ್ಮ ಮಾಸಿಕ ಉಳಿತಾಯ ಮಿತಿಯೊಳಗೆ (${formatNum(SAFE_MONTHLY_LIMIT)}) ಇದೆ`
      }[language],
      color: '#00836C',
      limit: SAFE_MONTHLY_LIMIT
    };
  }

  if (monthlyAmount <= STRETCH_MONTHLY_LIMIT) {
    return {
      status: 'stretch',
      message: {
        hi: `⚡ थोड़ा खिंचाव: यह संभव है लेकिन आपातकालीन बफ़र कम होगा। कुछ खर्चे कम करने पड़ सकते हैं।`,
        en: `⚡ Slight stretch: Doable but your emergency buffer will reduce. Consider cutting some expenses.`,
        kn: `⚡ ಸ್ವಲ್ಪ ಎಳೆತ: ಸಾಧ್ಯ ಆದರೆ ತುರ್ತು ಬಫರ್ ಕಡಿಮೆಯಾಗುತ್ತದೆ. ಕೆಲವು ಖರ್ಚು ಕಡಿಮೆ ಮಾಡುವುದು ಒಳ್ಳೆಯದು.`
      }[language],
      color: '#F98220',
      limit: SAFE_MONTHLY_LIMIT
    };
  }

  return {
    status: 'risky',
    message: {
      hi: `⚠️ सावधान: यह राशि आपकी मासिक बचत (${formatNum(CUSTOMER.monthlySurplus)}) से अधिक है। इतना निवेश करने से रोज़मर्रा के खर्चे प्रभावित होंगे। कृपया कम राशि चुनें।`,
      en: `⚠️ Caution: This exceeds your monthly surplus (${formatNum(CUSTOMER.monthlySurplus)}). Committing this much will affect your daily expenses. Please choose a lower amount.`,
      kn: `⚠️ ಎಚ್ಚರಿಕೆ: ಇದು ನಿಮ್ಮ ಮಾಸಿಕ ಉಳಿತಾಯ (${formatNum(CUSTOMER.monthlySurplus)}) ಮೀರಿದೆ. ಇಷ್ಟು ಹೂಡಿಕೆ ಮಾಡಿದರೆ ದೈನಂದಿನ ಖರ್ಚಿಗೆ ತೊಂದರೆ ಆಗುತ್ತದೆ. ದಯವಿಟ್ಟು ಕಡಿಮೆ ಮೊತ್ತ ಆಯ್ಕೆ ಮಾಡಿ.`
    }[language],
    color: '#DC2626',
    limit: SAFE_MONTHLY_LIMIT
  };
}

/**
 * Check if a lump sum amount is affordable
 * (checks against 3 months of surplus as a safety measure)
 */
export function checkLumpSumAffordability(amount, language = 'en') {
  if (amount <= 0) return { status: 'none', message: '', color: '', limit: SAFE_MONTHLY_LIMIT * 3 };

  const safeLumpSum = SAFE_MONTHLY_LIMIT * 6; // 6 months of safe surplus
  const stretchLumpSum = STRETCH_MONTHLY_LIMIT * 6;

  if (amount <= safeLumpSum) {
    return {
      status: 'safe',
      message: {
        hi: `✓ सुरक्षित: यह आपकी 6 महीने की बचत के अंदर है`,
        en: `✓ Safe: This is within 6 months of your savings capacity`,
        kn: `✓ ಸುರಕ್ಷಿತ: ಇದು ನಿಮ್ಮ 6 ತಿಂಗಳ ಉಳಿತಾಯ ಸಾಮರ್ಥ್ಯದೊಳಗೆ ಇದೆ`
      }[language],
      color: '#00836C',
      limit: safeLumpSum
    };
  }

  if (amount <= stretchLumpSum) {
    return {
      status: 'stretch',
      message: {
        hi: `⚡ संभव है, लेकिन इसके लिए कुछ समय बचत करनी होगी`,
        en: `⚡ Possible, but you'll need to save for a few months first`,
        kn: `⚡ ಸಾಧ್ಯ, ಆದರೆ ಇದಕ್ಕಾಗಿ ಕೆಲವು ತಿಂಗಳು ಉಳಿಸಬೇಕಾಗುತ್ತದೆ`
      }[language],
      color: '#F98220',
      limit: safeLumpSum
    };
  }

  return {
    status: 'risky',
    message: {
      hi: `⚠️ यह राशि आपकी वर्तमान बचत क्षमता से बहुत अधिक है। कृपया छोटी राशि से शुरू करें या अवधि बढ़ाएं।`,
      en: `⚠️ This amount is well beyond your current savings capacity. Start smaller or extend the tenure.`,
      kn: `⚠️ ಈ ಮೊತ್ತ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಉಳಿತಾಯ ಸಾಮರ್ಥ್ಯವನ್ನು ಮೀರಿದೆ. ಚಿಕ್ಕ ಮೊತ್ತದಿಂದ ಶುರು ಮಾಡಿ ಅಥವಾ ಅವಧಿ ಹೆಚ್ಚಿಸಿ.`
    }[language],
    color: '#DC2626',
    limit: safeLumpSum
  };
}

/**
 * Get a recommended safe amount for the user
 */
export function getRecommendedAmount(language = 'en') {
  return {
    monthly: SAFE_MONTHLY_LIMIT,
    stretch: STRETCH_MONTHLY_LIMIT,
    surplus: CUSTOMER.monthlySurplus,
    message: {
      hi: `आपकी सुरक्षित मासिक निवेश सीमा: ${formatNum(SAFE_MONTHLY_LIMIT)}`,
      en: `Your safe monthly investment limit: ${formatNum(SAFE_MONTHLY_LIMIT)}`,
      kn: `ನಿಮ್ಮ ಸುರಕ್ಷಿತ ಮಾಸಿಕ ಹೂಡಿಕೆ ಮಿತಿ: ${formatNum(SAFE_MONTHLY_LIMIT)}`
    }[language]
  };
}

function formatNum(n) {
  return '₹' + n.toLocaleString('en-IN');
}
