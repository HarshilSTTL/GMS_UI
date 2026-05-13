'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, ChevronDown } from 'lucide-react';

type MessageRole = 'bot' | 'user';

interface Message {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  options?: string[];
  type?: 'text' | 'options' | 'form' | 'confirm';
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1', role: 'bot', time: '9:41 AM', type: 'text',
    text: '🙏 *Welcome to GMS Citizen Services*\n\nHello! I\'m your GMS Virtual Assistant. I can help you:\n• File a new grievance\n• Track your complaint\n• Get status updates\n• Connect with an officer\n\nHow can I help you today?',
  },
  {
    id: 'm2', role: 'bot', time: '9:41 AM', type: 'options',
    text: 'Please choose an option:',
    options: ['📝 File New Complaint', '🔍 Track My Complaint', '📊 View All My Cases', '📞 Talk to Officer'],
  },
];

const FLOW: Record<string, Message[]> = {
  '📝 File New Complaint': [
    { id: 'f1', role: 'bot', time: '', type: 'text', text: '📝 *New Complaint*\n\nPlease describe your complaint in detail.\n\nFor example:\n_"Water supply disrupted in our area for 3 days"_' },
  ],
  '🔍 Track My Complaint': [
    { id: 't1', role: 'bot', time: '', type: 'text', text: '🔍 *Track Complaint*\n\nPlease enter your complaint token number.\n\nExample: *GVM-2025-05341*' },
  ],
  'GVM-2025-05341': [
    {
      id: 'tr1', role: 'bot', time: '', type: 'text',
      text: '✅ *Complaint Found*\n\n*Token:* GVM-2025-05341\n*Category:* Water Supply\n*Filed:* May 5, 2025\n*Status:* 🔄 In Progress\n*Assigned to:* Ravi Varma (GWSSB Zone 3)\n*SLA Deadline:* May 10, 2025\n\n📌 Last Update: Field visit scheduled for tomorrow 10 AM.',
    },
    { id: 'tr2', role: 'bot', time: '', type: 'options', text: 'What would you like to do?', options: ['💬 Add Comment', '🔔 Get Notified', '📞 Call Officer', '🏠 Main Menu'] },
  ],
  '📊 View All My Cases': [
    {
      id: 'a1', role: 'bot', time: '', type: 'text',
      text: '📊 *Your Cases*\n\n1️⃣ *GVM-2025-05341* — Water Supply\n   🔄 In Progress · Day 2 of 5\n\n2️⃣ *GVM-2025-04812* — Road Damage\n   ✅ Resolved on Apr 28\n\n3️⃣ *GVM-2025-03201* — Street Light\n   ⏳ Pending Assignment',
    },
  ],
  '📞 Talk to Officer': [
    { id: 'o1', role: 'bot', time: '', type: 'text', text: '📞 *Connecting you to an officer...*\n\nA GMS officer will join this chat shortly. Typical wait time: *2–3 minutes*.\n\nYou can also call our helpline:\n☎️ *1800-180-6127* (toll-free)' },
  ],
};

function formatText(text: string) {
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function CitizenVoicePage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function addBotMessages(msgs: Message[]) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const time = now();
      setMessages(prev => [...prev, ...msgs.map(m => ({ ...m, time }))]);
    }, 1200);
  }

  function handleOption(option: string) {
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', time: now(), text: option, status: 'read' };
    setMessages(prev => [...prev, userMsg]);
    const flow = FLOW[option];
    if (flow) {
      addBotMessages(flow);
    } else {
      addBotMessages([{
        id: `b${Date.now()}`, role: 'bot', time: '', type: 'options',
        text: 'I didn\'t understand that. Please choose from the options below:',
        options: ['📝 File New Complaint', '🔍 Track My Complaint', '📊 View All My Cases', '📞 Talk to Officer'],
      }]);
    }
  }

  function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    handleOption(text);
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto shadow-2xl">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-sm font-bold flex-shrink-0">
          GMS
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold">GMS Citizen Services</p>
          <p className="text-[11px] text-green-300">Online · Usually replies instantly</p>
        </div>
        <div className="flex items-center gap-4">
          <Video size={20} className="opacity-80 cursor-pointer" />
          <Phone size={20} className="opacity-80 cursor-pointer" />
          <MoreVertical size={20} className="opacity-80 cursor-pointer" />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='30' font-size='20' opacity='0.04'%3E🌿%3C/text%3E%3C/svg%3E")` }}>
        {/* Date badge */}
        <div className="flex justify-center mb-3">
          <span className="text-[11px] bg-[#D4E8CC] text-[#4A7B5C] px-3 py-1 rounded-full font-semibold shadow-sm">Today</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-1`}>
            {msg.role === 'bot' ? (
              <div className="max-w-[85%]">
                <div className="bg-white rounded-[14px] rounded-tl-sm px-3 py-2 shadow-sm">
                  <div className="text-[13px] text-[#111] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                  {msg.options && (
                    <div className="mt-2 space-y-1">
                      {msg.options.map(opt => (
                        <button key={opt} onClick={() => handleOption(opt)}
                          className="w-full text-left px-3 py-2 rounded-[10px] text-[12px] font-semibold text-[#075E54] bg-[#F0FDF4] border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-all">
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-[#999]">{msg.time}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-[85%]">
                <div className="bg-[#DCF8C6] rounded-[14px] rounded-tr-sm px-3 py-2 shadow-sm">
                  <p className="text-[13px] text-[#111]">{msg.text}</p>
                  <div className="flex justify-end items-center gap-1 mt-1">
                    <span className="text-[10px] text-[#999]">{msg.time}</span>
                    {msg.status === 'read' && <span className="text-[11px] text-blue-500">✓✓</span>}
                    {msg.status === 'delivered' && <span className="text-[11px] text-[#999]">✓✓</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-1">
            <div className="bg-white rounded-[14px] rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-[#F0F2F5] px-2 py-2 flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
          <Smile size={18} className="text-gray-400 flex-shrink-0 cursor-pointer" />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message"
            className="flex-1 text-[13px] outline-none bg-transparent text-[#111]"
          />
          <Paperclip size={18} className="text-gray-400 flex-shrink-0 cursor-pointer" />
        </div>
        <button onClick={handleSend}
          className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center flex-shrink-0 hover:bg-[#064F47] transition-all shadow-sm">
          <Send size={16} className="text-white ml-0.5" />
        </button>
      </div>
    </div>
  );
}
