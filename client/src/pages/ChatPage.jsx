import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import { ChatIcon } from '../components/Icons';
import QuickPromptChips from '../components/QuickPromptChips';

const contactLabels = {
  title: { hi: 'ग्राहक सेवा से संपर्क करें', en: 'Contact Customer Care', kn: 'ಗ್ರಾಹಕ ಸೇವೆ ಸಂಪರ್ಕಿಸಿ' },
  call: { hi: 'कॉल', en: 'Call', kn: 'ಕರೆ' },
  email: { hi: 'ईमेल', en: 'Email', kn: 'ಇಮೇಲ್' },
  whatsapp: { hi: 'WhatsApp', en: 'WhatsApp', kn: 'WhatsApp' }
};

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [avatarVideo, setAvatarVideo] = useState(null);
  const [avatarEnabled, setAvatarEnabled] = useState(false);

  // Simple markdown formatter for chat messages
  const formatMessage = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n- /g, '<br/>• ')
      .replace(/\n\d+\. /g, (match) => '<br/>' + match.trim() + ' ')
      .replace(/\n/g, '<br/>')
      .replace(/- /g, '• ');
  };
  const { messages, isLoading, isSpeaking, currentResponse, sendMessage } = useChat();
  const { language } = useLanguage();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    setShowContact(false);
    setAvatarVideo(null);
    const result = await sendMessage(text);

    // Speak response aloud if toggle is ON
    if (avatarEnabled && result?.reply) {
      const utterance = new SpeechSynthesisUtterance(result.reply.replace(/\*\*/g, '').replace(/[•→📊🏦🎯💡]/g, ''));
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleChipClick = async (text) => {
    setShowContact(false);
    setAvatarVideo(null);
    const result = await sendMessage(text);

    if (avatarEnabled && result?.reply) {
      const utterance = new SpeechSynthesisUtterance(result.reply.replace(/\*\*/g, '').replace(/[•→📊🏦🎯💡]/g, ''));
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(language === 'hi' ? 'आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता' : language === 'kn' ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ವಾಯ್ಸ್ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ' : 'Your browser does not support voice input');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    const langMap = { hi: 'hi-IN', en: 'en-IN', kn: 'kn-IN' };
    recognition.lang = langMap[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-send after voice input and speak response
      setTimeout(async () => {
        if (transcript.trim()) {
          setInput('');
          const result = await sendMessage(transcript);
          // Speak the response using browser TTS
          if (result?.reply && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(result.reply.replace(/\*\*/g, '').replace(/\n/g, ' '));
            const langMap = { hi: 'hi-IN', en: 'en-IN', kn: 'kn-IN' };
            utterance.lang = langMap[language] || 'en-IN';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
          }
        }
      }, 500);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -mx-4">
      {/* Avatar — compact inline header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-idbi-teal to-idbi-teal-dark border-b border-idbi-teal-dark">
        <div className={`w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white/30 ${isSpeaking && avatarEnabled ? 'animate-pulse-slow' : ''}`}>
          <img src="/seva-avatar.png" alt="Seva AI" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-idbi-orange">{t('seva_name', language)}</p>
          <p className="text-[10px] text-white/70">{t('seva_subtitle', language)}</p>
        </div>
        {/* Avatar Video Toggle - uses browser speech */}
        <button
          onClick={() => setAvatarEnabled(!avatarEnabled)}
          className={`px-2 py-1 rounded-full text-[9px] font-medium transition-all ${avatarEnabled ? 'bg-idbi-orange text-white' : 'bg-idbi-orange/80 text-white'}`}
        >
          {avatarEnabled ? '🔊 ON' : '🔊 OFF'}
        </button>
        {isSpeaking && avatarEnabled && (
          <div className="flex items-center gap-0.5 h-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-0.5 bg-idbi-orange rounded-full sound-wave-bar" style={{ height: '100%', animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 opacity-30">
              <img src="/seva-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-text-secondary/60 font-hindi text-center px-8">
              {t('chat_empty', language)}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-hindi ${
                msg.role === 'user'
                  ? 'bg-idbi-teal text-white rounded-br-md'
                  : 'bg-white text-text-primary shadow-sm border border-gray-100 rounded-bl-md'
              }`}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <QuickPromptChips onSelect={handleChipClick} disabled={isLoading} />

      {/* Contact Panel — fixed above input, always visible when open */}
      {showContact && (
        <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-text-primary font-hindi">{contactLabels.title[language]}</p>
            <button onClick={() => setShowContact(false)} className="text-xs text-text-secondary">✕</button>
          </div>
          <div className="flex gap-2">
            <a href="tel:1800-209-4324" className="flex-1 flex flex-col items-center gap-1 p-3 bg-surface rounded-xl hover:bg-idbi-teal/5 transition-colors">
              <span className="text-xl">📞</span>
              <p className="text-[10px] font-semibold text-idbi-teal">{contactLabels.call[language]}</p>
              <p className="text-[9px] text-text-secondary">1800-209-4324</p>
            </a>
            <a href="mailto:customercare@idbi.co.in?subject=WealthSeva Help" className="flex-1 flex flex-col items-center gap-1 p-3 bg-surface rounded-xl hover:bg-idbi-orange/5 transition-colors">
              <span className="text-xl">✉️</span>
              <p className="text-[10px] font-semibold text-idbi-orange">{contactLabels.email[language]}</p>
              <p className="text-[9px] text-text-secondary truncate">customercare@idbi.co.in</p>
            </a>
            <a href="https://wa.me/918002094324?text=Hi%20IDBI%20WealthSeva" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center gap-1 p-3 bg-surface rounded-xl hover:bg-green-50 transition-colors">
              <span className="text-xl">💬</span>
              <p className="text-[10px] font-semibold text-green-600">{contactLabels.whatsapp[language]}</p>
              <p className="text-[9px] text-text-secondary">WhatsApp</p>
            </a>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat_placeholder', language)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-surface rounded-full text-sm outline-none focus:ring-2 focus:ring-idbi-teal/20 disabled:opacity-50 font-hindi"
          />
          <button
            onClick={handleVoiceInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
            title="Voice Input"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          <button
            onClick={() => setShowContact(!showContact)}
            className={`px-3 h-10 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors ${showContact ? 'bg-idbi-teal text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}
            title="Customer Care"
          >
            Reach Us
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-idbi-orange flex items-center justify-center text-white disabled:opacity-40 transition-colors hover:bg-idbi-orange-dark"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
