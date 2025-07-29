import { useCallback, useEffect, useState } from 'react';
import type { WordWithStatus } from '../types/word';
import {
  getPendingReviewsApi,
  getReviewHistoryApi,
  getWordMeaning,
  recordCorrect,
  recordWrong,
  reviewWord
} from '../utils/api';
import type { Status } from '../utils/wordUtils';
import { cleanMeaning } from '../utils/wordUtils';

export const useWordManagement = () => {
  const [words, setWords] = useState<WordWithStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 意味取得API
  const fetchMeaning = useCallback(async (word: string): Promise<string> => {
    try {
      const data = await getWordMeaning(word);
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
      const [pendingWords, reviewedWords] = await Promise.all([
        getPendingReviewsApi(),
        getReviewHistoryApi()
      ]);

      const allWords = [
        ...pendingWords.map((w) => ({
          word: w.word,
          searchCount: w.searchCount,
          status: 'unchecked' as const
        })),
        ...reviewedWords.map((w) => ({
          word: w.word,
          searchCount: w.searchCount,
          reviewCount: w.reviewCount,
          lastReviewed: w.lastReviewed,
          status: 'correct' as const
        }))
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
        .sort((a, b) => (b.searchCount ?? 0) - (a.searchCount ?? 0));

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
      await reviewWord({ word });
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

  // 正解を記録
  const recordCorrectAnswer = useCallback(
    async (word: string) => {
      try {
        await recordCorrect(word);
        // データを再取得してステータスを更新
        await fetchAllWords();
      } catch (err) {
        console.error(`正解記録失敗 (${word}):`, err);
      }
    },
    [fetchAllWords]
  );

  // 不正解を記録
  const recordWrongAnswer = useCallback(
    async (word: string) => {
      try {
        await recordWrong(word);
        // データを再取得してステータスを更新
        await fetchAllWords();
      } catch (err) {
        console.error(`不正解記録失敗 (${word}):`, err);
      }
    },
    [fetchAllWords]
  );

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
    getFilteredWords,
    recordCorrectAnswer,
    recordWrongAnswer
  };
};
