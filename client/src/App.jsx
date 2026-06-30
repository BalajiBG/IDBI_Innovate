import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import SpendingPage from './pages/SpendingPage';
import GoalsPage from './pages/GoalsPage';
import ProductsPage from './pages/ProductsPage';
import AccountsPage from './pages/AccountsPage';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './components/MainLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<DashboardPage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="spending" element={<SpendingPage />} />
                <Route path="goals" element={<GoalsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="accounts" element={<AccountsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
