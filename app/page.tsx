'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { id: 'daily', name: '今日一签', emoji: '🏮' },
  { id: 'bazi', name: '八字排盘解读', emoji: '☯️' },
  { id: 'tarot', name: '单牌指引', emoji: '🃏' },
  { id: 'dream', name: '梦境启示', emoji: '🌙' },
];

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState('daily');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('保密');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDivine = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/divine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selected,
          name: name || '有缘人',
          birth,
          gender,
          question,
        }),
      });
      const data = await res.json();
      // 将结果存到 sessionStorage，方便结果页使用
      sessionStorage.setItem('divineResult', JSON.stringify(data));
      router.push('/result');
    } catch (e) {
      alert('连接神秘力量失败…请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 tracking-wider">✨ 星 言 ✨</h1>
      <p className="text-purple-300 text-sm mb-8">聆听宇宙的低语</p>

      {/* 类型选择 */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelected(cat.id)}
            className={`p-4 rounded-2xl border transition-all ${
              selected === cat.id
                ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/20'
                : 'border-purple-700/50 bg-purple-900/20'
            }`}
          >
            <span className="text-2xl block mb-1">{cat.emoji}</span>
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="你的名字（选填）"
          className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-3 outline-none focus:border-amber-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-3 outline-none focus:border-amber-400"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
        />
        <select
          className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-3 outline-none focus:border-amber-400"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="保密">性别（选填）</option>
          <option value="男">男</option>
          <option value="女">女</option>
          <option value="其他">其他</option>
        </select>
        <textarea
          placeholder="你想了解什么？（选填）"
          className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-3 h-24 resize-none outline-none focus:border-amber-400"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={handleDivine}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-gray-600 text-black font-bold py-4 rounded-xl transition-all text-lg shadow-lg shadow-amber-500/30"
        >
          {loading ? '观测命运之轮…' : '✨ 开始占卜'}
        </button>
      </div>

      <p className="text-xs text-purple-400/60 mt-10 max-w-md text-center">
        ⚠️ 本网站内容由AI生成，仅供娱乐消遣。命运永远握在你自己手中，请理性看待。
      </p>
    </main>
  );
}