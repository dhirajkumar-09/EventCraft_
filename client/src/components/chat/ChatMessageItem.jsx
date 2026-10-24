import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessageItem({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
          isUser
            ? 'bg-slate-700 dark:bg-slate-700'
            : 'bg-gradient-to-tr from-amber-600 to-rose-600'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
          isUser
            ? 'bg-amber-600 text-white rounded-tr-xs'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        <span
          className={`block text-[10px] mt-1.5 ${
            isUser ? 'text-amber-200 text-right' : 'text-slate-400'
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
