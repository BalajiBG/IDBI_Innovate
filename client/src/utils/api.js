const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  login: (customerId, pin) => request('/auth/login', { method: 'POST', body: JSON.stringify({ customerId, pin }) }),
  getCustomer: () => request('/data/customer'),
  getPortfolio: () => request('/data/portfolio'),
  getWealthVitals: () => request('/data/wealth-vitals'),
  getTransactions: () => request('/data/transactions'),
  getProducts: () => request('/data/products'),
  getSpendingBreakdown: () => request('/data/spending-breakdown'),
  sendChat: (message, sessionId) => request('/chat', { method: 'POST', body: JSON.stringify({ message, sessionId }) }),
  speakAvatar: (text) => request('/avatar/speak', { method: 'POST', body: JSON.stringify({ text }) }),
  getAvatarStatus: () => request('/avatar/status')
};
