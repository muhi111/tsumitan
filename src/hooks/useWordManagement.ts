import { useCallback, useEffect, useState } from 'react';
import type { WordWithStatus } from '../types/word';
import {
  getPendingReviewsApi,
  getReviewHistoryApi,
  recordCorrect,
  recordWrong,
  reviewWord
} from '../utils/api';
import type { Status } from '../utils/wordUtils';

export const useWordManagement = () => {
  const [words, setWords] = useState<WordWithStatus[]>([]);

  // 単語＋意味の取得（DBから意味も取得）
  const fetchAllWords = useCallback(async () => {
    try {
      const [pendingWords, reviewedWords] = await Promise.all([
        getPendingReviewsApi(),
        getReviewHistoryApi()
      ]);

      // Mapを使って重複を除去し、最新の情報でマージ
      const wordMap = new Map<string, WordWithStatus>();

      // まず未復習の単語を追加
      for (const w of pendingWords) {
        wordMap.set(w.word, {
          word: w.word,
          meaning: w.meaning,
          searchCount: w.searchCount,
          status: 'unchecked' as const
        });
      }

      // 復習済みの単語を追加（既存の場合は上書き）
      for (const w of reviewedWords) {
        wordMap.set(w.word, {
          word: w.word,
          meaning: w.meaning,
          searchCount: w.searchCount,
          reviewCount: w.reviewCount,
          lastReviewed: w.lastReviewed,
          correctCount: w.correctCount,
          wrongCount: w.wrongCount,
          status: 'reviewed' as const
        });
      }

      // Mapから配列に変換
      const allWords = Array.from(wordMap.values());

      // search_count降順でソート
      const sorted = allWords.sort(
        (a, b) => (b.searchCount ?? 0) - (a.searchCount ?? 0)
      );

      console.log('✅ sorted（search_count降順）', sorted);
      setWords(sorted);
    } catch (err) {
      console.error('単語取得エラー:', err);
    }
  }, []);

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
      if (showStatus === 'all') {
        return words;
      }

      if (showStatus === 'reviewed') {
        // 復習済み = 一度でも復習した単語すべて
        return words.filter((word) => (word.reviewCount ?? 0) > 0);
      }

      if (showStatus === 'wrong') {
        // 苦手 = 復習済みで正答率が低い単語
        return words.filter((word) => {
          const correctCount = word.correctCount ?? 0;
          const wrongCount = word.wrongCount ?? 0;
          const totalReviews = correctCount + wrongCount;

          // 復習していない、または復習回数が少ない場合は除外
          if (totalReviews < 2) {
            return false;
          }

          // 正答率が70%未満なら苦手
          const accuracy = correctCount / totalReviews;
          return accuracy < 0.7;
        });
      }

      // unchecked = 未復習
      return words.filter((word) => (word.reviewCount ?? 0) === 0);
    },
    [words]
  );

  // データのリフレッシュ機能を追加
  const refreshWords = useCallback(async () => {
    await fetchAllWords();
  }, [fetchAllWords]);

  useEffect(() => {
    fetchAllWords();
  }, [fetchAllWords]);

  return {
    words,
    updateWordStatus,
    submitReview,
    getFilteredWords,
    recordCorrectAnswer,
    recordWrongAnswer,
    refreshWords // 新しく追加
  };
};
