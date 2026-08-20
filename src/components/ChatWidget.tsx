"use client";

import React, { useEffect, useState } from 'react';

type Action = { label: string; view?: string; params?: Record<string, unknown> };

type AssistantData = {
  intent?: string;
  actions?: Action[];
  [key: string]: unknown;
};

type Msg = { id: string; sender: 'user' | 'assistant'; text: string; data?: AssistantData };

const STORAGE_KEY = 'assistantChatHistory';

export default function ChatWidget() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Msg[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Msg = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }), // do NOT send client snapshot to server
      });
      const body = await res.json();
      const assistantMsg: Msg = { id: Date.now().toString() + '-a', sender: 'assistant', text: body.text || 'No hay respuesta', data: body };
      setMessages((m) => [...m, assistantMsg]);

      // scroll into view
      setTimeout(() => {
        const el = document.getElementById('chat-scroll');
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    } catch (error) {
      // Log error for debugging and show a friendly message to the user
      console.error('Assistant request failed', error);
      const errMsg: Msg = { id: Date.now().toString() + '-e', sender: 'assistant', text: 'Error al contactar al asistente.' };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAction = (action: Action) => {
    // Dispatch an event so the app can handle navigation
    if (action.view) {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: { view: action.view, params: action.params } }));
      setOpen(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!open && (
        <button onClick={() => setOpen(true)} className="w-12 h-12 rounded-full bg-[#1E4D3A] text-white flex items-center justify-center shadow-lg" aria-label="Abrir asistente">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
            <rect x="3" y="7" width="18" height="10" rx="2" strokeWidth="1.5" stroke="white" fill="transparent" />
            <circle cx="8" cy="11" r="1" fill="white" />
            <circle cx="16" cy="11" r="1" fill="white" />
            <rect x="9" y="13" width="6" height="1.2" rx="0.6" fill="white" />
            <rect x="11" y="4" width="2" height="2" rx="0.6" fill="white" />
          </svg>
        </button>
      )}

      {open && (
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50 font-bold">
              <div>Asistente · Pregúntame sobre multas, ingresos o asistencia</div>
              <button onClick={() => setOpen(false)} className="text-sm text-gray-600">Cerrar</button>
            </div>
            <div className="h-64 overflow-y-auto p-3 space-y-2" id="chat-scroll">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.sender === 'user' ? 'bg-[#1E4D3A] text-white' : 'bg-gray-100 text-gray-900'} px-3 py-2 rounded-xl max-w-[85%]`}>
                    {m.text}
                    {m.sender === 'assistant' && m.data?.actions && (
                      <div className="mt-2 flex gap-2">
                        {m.data.actions.map((a: Action, idx: number) => (
                          <button key={idx} onClick={() => handleAction(a)} className="text-sm bg-white border rounded px-3 py-1">
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-100 bg-white">
              <div className="flex gap-2 mb-2">
                {['¿Quién tiene más multas?', '¿Quién tiene menos multas?', '¿Cuánto ingresó por multas este mes?', '¿Cuántas personas asistieron a la última reunión?'].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); setTimeout(() => sendMessage(), 50); }}
                    className="text-sm px-3 py-1 rounded-lg border border-gray-200 bg-[#f6fff6] text-[#065f46] hover:bg-[#ecfdf3] shadow-sm truncate max-w-[48%] text-left"
                    title={q}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Pregunta: ¿Quién tiene más multas?"
                  className="flex-1 px-3 py-2 border bg-white rounded-xl outline-none"
                />
                <button onClick={sendMessage} disabled={loading} className="px-4 py-2 bg-[#1E4D3A] text-white rounded-xl font-bold disabled:opacity-60">
                  {loading ? '...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
