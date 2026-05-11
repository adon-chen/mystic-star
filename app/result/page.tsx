'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { useLang } from '@/contexts/LanguageContext';

export default function ResultPage() {
  const [result, setResult] = useState<{ result?: string } | null>(null);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useLang();

  useEffect(() => {
    const stored = sessionStorage.getItem('divineResult');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push('/');
    }
  }, []);

  const generateShare = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1e1b2e',
        scale: 2,
      });
      setShareImage(canvas.toDataURL('image/png'));
    }
  };

  const closeShare = () => setShareImage(null);

  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        {t('读取星盘中…', 'Reading the stars…')}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white flex flex-col items-center px-4 py-10">
      {shareImage && (
        <div className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center z-50 p-4">
          <img src={shareImage} alt="Share card" className="rounded-2xl max-w-sm w-full shadow-2xl" />
          <div className="flex gap-4 mt-4">
            <button onClick={closeShare} className="bg-gray-600 px-6 py-2 rounded-full">
              {t('关闭', 'Close')}
            </button>
            <a
              href={shareImage}
              download="StarSpeak-daily-fortune.png"
              className="bg-amber-500 text-black px-6 py-2 rounded-full font-bold"
            >
              {t('保存图片', 'Save Image')}
            </a>
          </div>
        </div>
      )}

      <h2 className="text-2xl mb-8">{t('🌠 你的专属启示', '🌠 Your Celestial Message')}</h2>

      <div
        ref={cardRef}
        className="bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-black border border-amber-400/30 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-purple-900/20"
      >
        <p className="text-lg font-bold mb-4">
          {t('✨ 星言 · 每日指引 ✨', '✨ StarSpeak · Daily Guide ✨')}
        </p>
        <div className="whitespace-pre-wrap leading-relaxed text-purple-100 font-light text-sm">
          {result.result}
        </div>
        <p className="text-right text-xs text-purple-400/40 mt-6">
          {t('仅供娱乐 · 理性看待', 'For entertainment only · Be rational')}
        </p>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => router.push('/')}
          className="bg-purple-800/50 hover:bg-purple-700/50 border border-purple-500/30 px-6 py-3 rounded-full transition"
        >
          {t('再求一签', 'Ask Again')}
        </button>
        <button
          onClick={generateShare}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full transition"
        >
          📤 {t('生成分享图', 'Share Card')}
        </button>
      </div>
    </main>
  );
}