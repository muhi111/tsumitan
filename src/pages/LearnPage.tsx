import type React from 'react';
import { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../utils/api';

type Status = 'all' | 'unchecked' | 'correct' | 'wrong';

type Word = {
  word: string;
  search_count: number;
  review_count?: number;
  last_reviewed?: string;
  meaning?: string;
};

type WordWithStatus = Word & { status: Status };

interface ReviewRequest {
  word: string;
}

const LearnPage: React.FC = () => {
  const [words, setWords] = useState<WordWithStatus[]>([]);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
  const [showStatus, setShowStatus] = useState<Status>('all');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const cleanMeaning = (text: string): string => {
    return text
      .replace(/\([^)]*\)/g, '') // 半角かっこ (…)
      .replace(/《.*?》/g, '') // 山かっこ《…》
      .replace(/〈.*?〉/g, '') // 山かっこ《…》
      .replace(/\s+/g, ' ') // 余分な空白を1つに
      .trim();
  };

  // 意味取得API
  const fetchMeaning = async (word: string): Promise<string> => {
    try {
      const res = await apiGet(`/api/search?word=${encodeURIComponent(word)}`);
      if (!res.ok) throw new Error('意味の取得に失敗');
      const data = await res.json();
      const rawMeaning = data.meanings || '';
      return cleanMeaning(rawMeaning); // ← ここで前処理を適用！
    } catch (err) {
      console.error(`意味取得失敗 (${word}):`, err);
      return '';
    }
  };

  // 単語＋意味の取得
  useEffect(() => {
    const fetchAllWords = async () => {
      try {
        const [pendingRes, reviewedRes] = await Promise.all([
          apiGet('/api/review/pending'),
          apiGet('/api/review/history')
        ]);

        if (!pendingRes.ok || !reviewedRes.ok)
          throw new Error('単語取得に失敗しました');

        const pendingWords: Word[] = await pendingRes.json();
        const reviewedWords: Word[] = await reviewedRes.json();

        const allWords = [
          ...pendingWords.map((w) => ({ ...w, status: 'unchecked' as const })),
          ...reviewedWords.map((w) => ({ ...w, status: 'correct' as const }))
        ];

        const withMeanings = await Promise.all(
          allWords.map(async (w) => ({
            ...w,
            meaning: await fetchMeaning(w.word)
          }))
        );
        // 意味がある単語だけ残す
        const filtered = withMeanings
          .filter((w) => w.meaning && w.meaning.trim() !== '')
          .sort((a, b) => (b.search_count ?? 0) - (a.search_count ?? 0));
        console.log('✅ filtered（意味あり & search_count降順）', filtered);

        setWords(filtered);
        setFlippedStates(new Array(filtered.length).fill(false));
      } catch (err) {
        console.error('単語取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWords();
  }, []);

  const visibleWords = words
    .map((word, index) => ({ ...word, index }))
    .filter(({ status }) =>
      showStatus === 'all' ? true : status === showStatus
    );

  const toggleFlip = (index: number) => {
    setFlippedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const updateStatus = async (
    index: number,
    newStatus: 'correct' | 'wrong'
  ) => {
    const wordToUpdate = words[index];
    setWords((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });

    setFeedback(
      newStatus === 'correct'
        ? '✅ よくできました！この調子✨'
        : '❌ 間違えても大丈夫！次に活かそう💪'
    );

    try {
      const requestBody: ReviewRequest = { word: wordToUpdate.word };
      const response = await apiPatch('/api/review', requestBody);

      if (!response.ok) throw new Error('復習記録の送信に失敗しました');
    } catch (err) {
      console.error('復習記録送信エラー:', err);
    }
  };

  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => setFeedback(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  const statusLabels: Record<Status, string> = {
    all: 'すべて',
    unchecked: '未復習',
    correct: '復習済み',
    wrong: '苦手'
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-4">単語帳</h2>

      {feedback && (
        <div className="absolute top-4 right-4 bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded shadow-md animate-fade-in">
          {feedback}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(statusLabels) as Status[]).map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              showStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => {
              setShowStatus(status);
              setFlippedStates(new Array(words.length).fill(false));
            }}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visibleWords.map(({ word, meaning, index }) => (
            <li
              key={index}
              onClick={() => toggleFlip(index)}
              className="cursor-pointer perspective"
            >
              <div
                className="relative w-full h-48 preserve-3d transition-transform duration-500"
                style={{
                  transform: flippedStates[index] ? 'rotateY(180deg)' : 'none'
                }}
              >
                <div className="absolute w-full h-full backface-hidden bg-white border rounded-xl flex items-center justify-center text-lg font-bold shadow">
                  {word}
                </div>
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-blue-600 text-white border rounded-xl relative flex flex-col p-4 shadow">
                  {/* 意味エリア */}
                  <div className="flex-1 overflow-y-auto mb-3 pr-2">
                    <div className="text-center whitespace-pre-line">
                      {meaning || '意味が取得できませんでした'}
                    </div>
                  </div>

                  {/* ボタン + 検索回数 */}
                  <div className="flex justify-between items-center flex-shrink-0">
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 text-white text-sm px-3 py-1 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(index, 'correct');
                        }}
                      >
                        ◯
                      </button>
                      <button
                        className="bg-red-500 text-white text-sm px-3 py-1 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(index, 'wrong');
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-sm text-white opacity-100">
                      🔍 {words[index].search_count}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LearnPage;
