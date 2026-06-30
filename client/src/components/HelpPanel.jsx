import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const labels = {
  helpTitle: { hi: 'सहायता', en: 'Help', kn: 'ಸಹಾಯ' },
  placeholder: { hi: 'अपना सवाल पूछें...', en: 'Ask your question...', kn: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ...' },
  greeting: {
    hi: 'नमस्ते! मैं आपकी सहायता के लिए हूँ। आप इस ऐप की किसी भी सुविधा, अपने खाते, खर्चे, SIP, लक्ष्य — कुछ भी पूछ सकते हैं।',
    en: "Hi! I'm here to help. You can ask me about any feature of this app, your account, spending, SIP, goals — anything at all.",
    kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ಈ ಆ್ಯಪ್‌ನ ಯಾವುದೇ ವೈಶಿಷ್ಟ್ಯ, ನಿಮ್ಮ ಖಾತೆ, ಖರ್ಚು, SIP, ಗುರಿಗಳ ಬಗ್ಗೆ — ಏನು ಬೇಕಾದರೂ ಕೇಳಿ.'
  },
  cantHelp: {
    hi: 'क्या आप हमारी टीम से बात करना चाहेंगे?',
    en: 'Would you like to talk to our team?',
    kn: 'ನಮ್ಮ ತಂಡದೊಂದಿಗೆ ಮಾತನಾಡಲು ಬಯಸುವಿರಾ?'
  },
  callLabel: { hi: 'कॉल करें (निःशुल्क)', en: 'Call (Toll-Free)', kn: 'ಕರೆ ಮಾಡಿ (ಉಚಿತ)' },
  emailLabel: { hi: 'ईमेल करें', en: 'Send Email', kn: 'ಇಮೇಲ್ ಕಳುಹಿಸಿ' },
  contactBtn: { hi: 'ग्राहक सेवा से बात करें', en: 'Talk to Customer Care', kn: 'ಗ್ರಾಹಕ ಸೇವೆಯೊಂದಿಗೆ ಮಾತನಾಡಿ' }
};

export default function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { language } = useLanguage();
  const messagesEndRef = useRef(null);

  const l = (key) => labels[key]?.[language] || labels[key]?.en || key;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const open = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: l('greeting') }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);
    setShowContact(false);

    try {
      const res = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

      // If the AI says it can't help, show contact option
      if (data.showContact) {
        setShowContact(true);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: l('cantHelp') }]);
      setShowContact(true);
    } finally {
      setIsLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={open}
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-idbi-teal text-white shadow-lg flex items-center justify-center text-xl hover:bg-idbi-teal-dark transition-all z-30 hover:scale-110"
        aria-label="Help"
      >
        ?
      </button>

      {/* Help Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={close} />

          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl h-[80vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-idbi-teal/10 flex items-center justify-center text-sm">🤝</span>
                <h2 className="text-base font-bold text-text-primary font-hindi">{l('helpTitle')}</h2>
              </div>
              <button onClick={close} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-gray-200">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-hindi ${
                    msg.role === 'user'
                      ? 'bg-idbi-teal text-white rounded-br-md'
                      : 'bg-surface text-text-primary rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Options */}
              {showContact && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-text-secondary text-center font-hindi">{l('cantHelp')}</p>
                  <a href="tel:1800-209-4324" className="flex items-center gap-3 p-3 bg-idbi-teal/5 rounded-xl">
                    <span className="text-lg">📞</span>
                    <div>
                      <p className="text-sm font-semibold text-idbi-teal">1800-209-4324</p>
                      <p className="text-[10px] text-text-secondary">{l('callLabel')}</p>
                    </div>
                  </a>
                  <a href="mailto:customercare@idbi.co.in?subject=WealthSeva Help" className="flex items-center gap-3 p-3 bg-idbi-orange/5 rounded-xl">
                    <span className="text-lg">✉️</span>
                    <div>
                      <p className="text-sm font-semibold text-idbi-orange">customercare@idbi.co.in</p>
                      <p className="text-[10px] text-text-secondary">{l('emailLabel')}</p>
                    </div>
                  </a>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Contact button always visible */}
            {!showContact && messages.length > 2 && (
              <div className="flex-shrink-0 px-4 pb-1">
                <button onClick={() => setShowContact(true)} className="w-full text-xs text-text-secondary hover:text-idbi-teal py-1 font-hindi">
                  {l('contactBtn')} →
                </button>
              </div>
            )}

            {/* Input */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={l('placeholder')}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-surface rounded-full text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 disabled:opacity-50 font-hindi"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-idbi-teal flex items-center justify-center text-white disabled:opacity-40"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
