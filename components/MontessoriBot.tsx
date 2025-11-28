import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { generateMariaResponse } from '../services/groqService';
import { ChatMessage } from '../types';

export const MontessoriBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Greetings. I am Maria. How may I aid you in observing your child today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateMariaResponse(userMsg.text);
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          id="montessori-bot-trigger"
          onClick={() => setIsOpen(true)}
          className="bg-brand-plum hover:bg-brand-darkest text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 group"
          aria-label="Ask Maria"
        >
          <span className="hidden group-hover:block pr-2 font-serif text-sm">Ask Maria</span>
          <MessageCircle size={32} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden border border-brand-paper animate-fade-in-up" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-brand-darkest text-brand-cream p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center">
                <Sparkles size={20} className="text-brand-plum" />
              </div>
              <div>
                <h3 className="font-serif font-bold">Ask Maria</h3>
                <p className="text-xs text-brand-cream/70">AI Guide</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-brand-cream/70 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-paper/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-clay text-white rounded-br-none'
                      : 'bg-white border border-brand-paper text-brand-darkest rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-brand-paper">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-brand-plum rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-plum rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-brand-plum rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-brand-paper">
            <div className="flex items-center gap-2 bg-brand-paper/50 rounded-full px-4 py-2 border border-transparent focus-within:border-brand-plum transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about education..."
                className="flex-1 bg-transparent focus:outline-none text-sm text-brand-darkest placeholder-brand-darkest/40"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="text-brand-clay hover:text-brand-wine disabled:opacity-30"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-center mt-2 text-gray-400">AI generated responses. For entertainment purposes.</p>
          </div>
        </div>
      )}
    </div>
  );
};