import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState(null);

  const login = async (customerId, pin, language = 'hi') => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, pin, language })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      setCustomer(data.customer);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCustomer(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, customer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
