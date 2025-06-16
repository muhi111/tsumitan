import { useCallback, useEffect, useState } from 'react';
import type { ReviewRequest, Word, WordWithStatus } from '../types/word';
import { apiGet, apiPatch } from '../utils/api';
import type { Status } from '../utils/wordUtils';
import { cleanMeaning } from '../utils/wordUtils';

export const useWordManagement = () => {
  const [words, setWords] = useState<WordWithStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 意味取得API
  const fetchMeaning = useCallback(async (word: string): Promise<string> => {
    try {
      const res = await apiGet(`/api/search?word=${encodeURIComponent(word)}`);
      if (!res.ok) throw new Error('意味の取得に失敗');
      const data = await res.json();
      const rawMeaning = data.meanings || '';
      return cleanMeaning(rawMeaning);
    } catch (err) {
      console.error(`意味取得失敗 (${word}):`, err);
      return '';
    }
  }, []);

  // 単語＋意味の取得
  const fetchAllWords = useCallback(async () => {
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
  }, [fetchMeaning]);

  // 復習記録の送信
  const submitReview = useCallback(async (word: string): Promise<void> => {
    try {
      const requestBody: ReviewRequest = { word };
      const response = await apiPatch('/api/review', requestBody);

      if (!response.ok) throw new Error('復習記録の送信に失敗しました');
    } catch (err) {
      console.error('復習記録送信エラー:', err);
    }
  }, []);

  // 単語のステータス更新
  const updateWordStatus = useCallback((word: string, newStatus: Status) => {
    setWords((prev) => {
      const updated = prev.map((w) =>
        w.word === word ? { ...w, status: newStatus } : w
      );
      return updated;
    });
  }, []);

  // 指定されたステータスの単語をフィルタリング
  const getFilteredWords = useCallback(
    (showStatus: Status): WordWithStatus[] => {
      return words.filter(({ status }) =>
        showStatus === 'all' ? true : status === showStatus
      );
    },
    [words]
  );

  useEffect(() => {
    fetchAllWords();
  }, [fetchAllWords]);

  return {
    words,
    loading,
    updateWordStatus,
    submitReview,
    getFilteredWords
  };
};
