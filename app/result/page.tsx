'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [result, setResult] = useState<{ result?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('divineResult');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      // 如果直接访问 /result 而没有经过首页，就跳回首页
      router.push('/');
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        读取星盘中…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white flex flex-col items-center px-4 py-10">
      <h2 className="text-2xl mb-8">🌠 你的专属启示</h2>
      <div className="bg-white/5 backdrop-blur border border-purple-500/20 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-purple-900/10">
        <div className="whitespace-pre-wrap leading-relaxed text-purple-100 font-light">
          {result.result}
        </div>
        <div className="mt-6 text-xs text-purple-400/40 text-right">
          仅供娱乐 · 理性看待
        </div>
      </div>
      <button
        onClick={() => router.push('/')}
        className="mt-8 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-500/30 px-6 py-3 rounded-full transition"
      >
        再求一签
      </button>
    </main>
  );
}