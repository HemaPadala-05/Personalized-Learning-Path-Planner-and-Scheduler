import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('smart_learn_chat_history');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ id: '1', role: 'model', text: 'Hello! I am Smart Learn AI. How can I help with your studies today?' }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('smart_learn_chat_history', JSON.stringify(messages));
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await getChatbotResponse(history, input);
      
      // Explicitly type the model message to prevent role widening and handle potential undefined text
      // This fix addresses the error on line 51 where type widening was occurring
      const modelMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response || 'Sorry, I could not generate a response.' 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    // Explicitly type the initial message to match ChatMessage interface
    const initial: ChatMessage = { id: '1', role: 'model', text: 'History cleared. How can I help?' };
    setMessages([initial]);
    localStorage.removeItem('smart_learn_chat_history');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Smart Assistant</h2>
            <p className="text-slate-500 text-sm">Powered by Gemini AI (Context Aware)</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-500 hover:text-pink-500 transition-colors"
          title="Clear History"
        >
          <Trash2 size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 mb-4 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} className="text-indigo-400" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-indigo-400" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input 
          type="text" 
          placeholder="Ask about your syllabus, exam tips, or schedule..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-6 pr-16 text-white outline-none focus:border-indigo-500 transition-all shadow-xl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg"
          disabled={!input || loading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;