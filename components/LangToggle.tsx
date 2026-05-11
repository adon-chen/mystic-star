'use client';
import { useLang } from '@/contexts/LanguageContext';

export default function LangToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={toggleLang}
        className="text-xs bg-white/10 border border-purple-500/30 rounded-full px-3 py-1 text-purple-300 hover:bg-white/20 transition"
      >
        {lang === 'zh' ? 'EN' : '中'}
      </button>
    </div>
  );
}