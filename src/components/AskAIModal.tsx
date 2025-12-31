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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      alert(`AI Query: ${query}`);
      setQuery('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ask-ai-modal-overlay" onClick={onClose}>
      <div className="ask-ai-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ask-ai-header">
          <div className="ask-ai-title">
            <Sparkles size={20} className="ask-ai-icon" />
            <h2>Ask AI</h2>
          </div>
          <button className="modal-icon-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="ask-ai-content">
          <form onSubmit={handleSubmit}>
            <div className="ask-ai-input-group">
              <input
                ref={inputRef}
                type="text"
                className="ask-ai-input"
                placeholder="Ask AI anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="ask-ai-send-btn" disabled={!query.trim()}>
                <Send size={18} />
              </button>
            </div>
          </form>

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
        </div>
      </div>
    </div>
  );
};

