import { createContext, useContext, useState } from 'react';
import { useLanguage } from './LanguageContext';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const { language } = useLanguage();

  const sendMessage = async (text) => {
    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: 'demo-session', language })
      });
      const data = await res.json();

      const assistantMsg = { role: 'assistant', content: data.reply, timestamp: data.timestamp, suggestions: data.suggestions };
      setMessages(prev => [...prev, assistantMsg]);
      setCurrentResponse(data.reply);
      setIsSpeaking(true);

      // Stop speaking animation after 3 seconds (short enough to not feel stuck)
      setTimeout(() => setIsSpeaking(false), 3000);

      return data;
    } catch (error) {
      const errorMessages = {
        hi: 'कनेक्शन में समस्या है। एक मिनट में फिर से कोशिश करें।',
        en: 'Connection issue. Please try again in a minute.',
        kn: 'ಸಂಪರ್ಕದಲ್ಲಿ ಸಮಸ್ಯೆ ಇದೆ. ಒಂದು ನಿಮಿಷದಲ್ಲಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
      };
      const errorMsg = { role: 'assistant', content: errorMessages[language] || errorMessages.en, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMsg]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentResponse('');
    setIsSpeaking(false);
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, isSpeaking, currentResponse, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
