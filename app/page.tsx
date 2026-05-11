'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/contexts/LanguageContext';

const categories = [
  { id: 'daily', emoji: '🏮', zhName: '今日一签', enName: 'Daily Fortune', zhDesc: '星辰低语', enDesc: 'Whispers of the stars' },
  { id: 'bazi', emoji: '☯️', zhName: '八字排盘', enName: 'Bazi Destiny', zhDesc: '命盘解析', enDesc: 'Energy & elements' },
  { id: 'tarot', emoji: '🃏', zhName: '单牌指引', enName: 'One Card Draw', zhDesc: '心灵之镜', enDesc: 'Mirror of the soul' },
  { id: 'dream', emoji: '🌙', zhName: '梦境启示', enName: 'Dream Insight', zhDesc: '潜意识的密语', enDesc: 'Messages from the deep' },
];

export default function Home() {
  const router = useRouter();
  const { t } = useLang();
  const [selected, setSelected] = useState('daily');
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [gender, setGender] = useState(t('保密', 'Secret'));
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => String(1900 + i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleDivine = async () => {
    setLoading(true);
    const birth = year && month && day ? `${year}-${month}-${day}` : '';
    try {
      const res = await fetch('/api/divine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selected,
          name: name || t('有缘人', 'Seeker'),
          birth,
          gender,
          question,
        }),
      });
      const data = await res.json();
      sessionStorage.setItem('divineResult', JSON.stringify(data));
      router.push('/result');
    } catch (e) {
      alert(t('连接神秘力量失败…请重试', 'The stars are not aligned... Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a1030] to-[#0d0b1e] text-white flex flex-col items-center px-4 py-6 overflow-hidden">
      {/* Soft glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-[100px] animate-pulse" />

      {/* Header */}
      <h1 className="relative text-4xl font-extrabold tracking-widest mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-200 to-amber-300 drop-shadow-lg">
        ✦ {t('星 言', 'StarSpeak')} ✦
      </h1>
      <p className="relative text-purple-300/80 text-xs mb-4 font-light tracking-widest">
        {t('聆听宇宙的低语', 'Listen to the whispers of the universe')}
      </p>

      {/* Divination type selection */}
      <div className="relative grid grid-cols-2 gap-3 w-full max-w-md mb-4 z-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelected(cat.id)}
            className={`p-4 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
              selected === cat.id
                ? 'border-amber-400/60 bg-amber-400/10 shadow-lg shadow-amber-500/20 scale-105'
                : 'border-purple-500/20 bg-purple-900/10 hover:bg-purple-900/20 hover:border-purple-400/40'
            }`}
          >
            <span className="text-2xl block mb-1">{cat.emoji}</span>
            <span className="text-xs font-semibold tracking-wider">{t(cat.zhName, cat.enName)}</span>
            <p className="text-[10px] text-purple-400/50 mt-1">{t(cat.zhDesc, cat.enDesc)}</p>
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="relative w-full max-w-md space-y-3 z-10">
        <input
          type="text"
          placeholder={t('你的名字（选填）', 'Your name (optional)')}
          className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 outline-none focus:border-amber-400/60 focus:bg-white/10 transition-all placeholder-purple-400/50 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Birthday dropdowns */}
        <div className="grid grid-cols-3 gap-2">
          <select
            className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-2 py-2 outline-none focus:border-amber-400/60 focus:bg-white/10 transition-all text-purple-200 text-sm cursor-pointer"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">{t('年', 'Year')}</option>
            {years.map((y) => (<option key={y} value={y}>{y}</option>))}
          </select>
          <select
            className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-2 py-2 outline-none focus:border-amber-400/60 focus:bg-white/10 transition-all text-purple-200 text-sm cursor-pointer"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">{t('月', 'Month')}</option>
            {months.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
          <select
            className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-2 py-2 outline-none focus:border-amber-400/60 focus:bg-white/10 transition-all text-purple-200 text-sm cursor-pointer"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">{t('日', 'Day')}</option>
            {days.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>

        {/* Gender dropdown */}
        <select
          className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 outline-none focus:border-amber-400/60 focus:bg-white/10 transition-all text-purple-200 text-sm cursor-pointer"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value={t('保密', 'Secret')}>{t('性别（选填）', 'Gender (optional)')}</option>
          <option value={t('男', 'Male')}>{t('男', 'Male')}</option>
          <option value={t('女', 'Female')}>{t('女', 'Female')}</option>
          <option value={t('其他', 'Other')}>{t('其他', 'Other')}</option>
        </select>

        <textarea
          placeholder={t('你想了解什么？（选填）', 'What do you seek clarity on? (optional)')}
          className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 h-20 resize-none outline-none focus:border-amber-400/60 focus:bg-white/10 transition-all placeholder-purple-400/50 text-sm"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* Submit button */}
        <button
          onClick={handleDivine}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-gray-600 disabled:to-gray-500 text-black font-bold py-3 rounded-xl transition-all text-base shadow-lg shadow-amber-500/30 disabled:shadow-none transform active:scale-95"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('观测命运之轮…', 'Consulting the stars...')}
            </span>
          ) : (
            t('✨ 开始占卜', '✨ Begin Divination')
          )}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="relative text-[10px] text-purple-400/40 mt-4 max-w-md text-center z-10 tracking-wider leading-relaxed">
        {t(
          '⚠️ 本网站内容由AI生成，仅供娱乐消遣。命运永远握在你自己手中，请理性看待。',
          '⚠️ This content is AI-generated for entertainment only. Your destiny is always in your own hands. Please be rational.'
        )}
      </p>
    </main>
  );
}