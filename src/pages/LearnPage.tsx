import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import CardStack from '../components/CardStack';
import { useFeedback } from '../hooks/useFeedback';
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
  const [showStatus, setShowStatus] = useState<Status>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Use the custom feedback hook
  const { feedback, showFeedback } = useFeedback();

  const cleanMeaning = useCallback((text: string): string => {
    return text
      .replace(/\([^)]*\)/g, '') // 半角かっこ (…)
      .replace(/《.*?》/g, '') // 山かっこ《…》
      .replace(/〈.*?〉/g, '') // 山かっこ《…》
      .replace(/\s+/g, ' ') // 余分な空白を1つに
      .trim();
  }, []);

  // 意味取得API
  const fetchMeaning = useCallback(
    async (word: string): Promise<string> => {
      try {
        const res = await apiGet(
          `/api/search?word=${encodeURIComponent(word)}`
        );
        if (!res.ok) throw new Error('意味の取得に失敗');
        const data = await res.json();
        const rawMeaning = data.meanings || '';
        return cleanMeaning(rawMeaning); // ← ここで前処理を適用！
      } catch (err) {
        console.error(`意味取得失敗 (${word}):`, err);
        return '';
      }
    },
    [cleanMeaning]
  );

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
      } catch (err) {
        console.error('単語取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWords();
  }, [fetchMeaning]);

  const visibleWords = words.filter(({ status }) =>
    showStatus === 'all' ? true : status === showStatus
  );

  const handleCardSwipe = async (word: string, direction: 'left' | 'right') => {
    const newStatus: Status = direction === 'right' ? 'correct' : 'wrong';

    // Update the word status in local state
    setWords((prev) => {
      const updated = prev.map((w) =>
        w.word === word ? { ...w, status: newStatus } : w
      );
      return updated;
    });

    showFeedback(
      newStatus === 'correct'
        ? '✅ よくできました！この調子✨'
        : '❌ 間違えても大丈夫！次に活かそう💪'
    );

    try {
      const requestBody: ReviewRequest = { word };
      const response = await apiPatch('/api/review', requestBody);

      if (!response.ok) throw new Error('復習記録の送信に失敗しました');
    } catch (err) {
      console.error('復習記録送信エラー:', err);
    }
  };

  const handleStackComplete = () => {
    // Show completion message only once
    if (!isCompleted) {
      showFeedback('🎉 すべての復習が完了しました！');
      setIsCompleted(true);
    }
  };

  const statusLabels: Record<Status, string> = {
    all: 'すべて',
    unchecked: '未復習',
    correct: '復習済み',
    wrong: '苦手'
  };

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Feedback Overlay */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-blue-300 text-blue-700 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-fade-in text-sm font-medium whitespace-nowrap">
          {feedback}
        </div>
      )}

      {/* Header section - optimized layout */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 bg-slate-50 border-b border-gray-200">
        <div className="flex items-center justify-center mb-3">
          <h2 className="text-2xl font-bold">単語帳</h2>
        </div>

        <div className="flex gap-1 sm:gap-2">
          {(Object.keys(statusLabels) as Status[]).map((status) => (
            <button
              type="button"
              key={status}
              className={`flex-1 sm:flex-initial sm:px-3 py-2 rounded text-xs sm:text-sm font-medium whitespace-nowrap ${
                showStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => {
                setShowStatus(status);
              }}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : (
          <CardStack
            words={visibleWords}
            onCardSwipe={handleCardSwipe}
            onComplete={handleStackComplete}
          />
        )}
      </div>
    </div>
  );
};

export default LearnPage;
