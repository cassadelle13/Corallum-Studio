import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X } from 'lucide-react';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskAIModal: React.FC<AskAIModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const userMessage = { id: Date.now().toString(), text: query, isUser: true };
      setMessages(prev => [...prev, userMessage]);
      setQuery('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiMessage = { 
          id: (Date.now() + 1).toString(), 
          text: `I received your question: "${userMessage.text}". This is a placeholder response.`, 
          isUser: false 
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 500);
    }
  };

  if (!isOpen) return null;

  const showSuggestions = query.length === 0 && messages.length === 0;

  return (
    <>
      <div className="ask-ai-overlay" onClick={onClose}></div>
      <div className={`ask-ai-container ${isOpen ? 'open' : ''}`}>
        <div className="ask-ai-header">
          <div className="ask-ai-title">
            <Sparkles size={20} className="ask-ai-icon" />
            <h3>Ask AI</h3>
          </div>
          <button className="ask-ai-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="ask-ai-messages">
          {messages.length === 0 && showSuggestions && (
            <div className="ask-ai-suggestions">
              <p className="suggestions-title">Suggestions:</p>
              <div className="suggestions-list">
                <button className="suggestion-item" onClick={() => setQuery('How do I create a new workflow?')}>
                  How do I create a new workflow?
                </button>
                <button className="suggestion-item" onClick={() => setQuery('Explain how to use triggers')}>
                  Explain how to use triggers
                </button>
                <button className="suggestion-item" onClick={() => setQuery('Show me examples of integrations')}>
                  Show me examples of integrations
                </button>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`ask-ai-message ${message.isUser ? 'user' : 'ai'}`}>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="ask-ai-input-form">
          <div className="ask-ai-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="ask-ai-input"
              placeholder="Ask AI anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="ask-ai-send-btn" 
              disabled={!query.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

