import { initDatabase } from '../database/database';
import {
  type PendingReview,
  type ReviewHistory,
  createOrUpdateWordSearch,
  getPendingReviews,
  getReviewHistory,
  recordCorrectAnswer,
  recordWrongAnswer,
  updateWordReview
} from '../database/wordOperations';

/**
 * Initialize the database when the API is first used
 */
const dbInitPromise = initDatabase();

/**
 * Dictionary API response type
 */
interface DictionaryResponse {
  word: string;
  meanings: string;
}

/**
 * Search request type
 */
interface SearchRequest {
  word: string;
}

/**
 * Review request type
 */
interface ReviewRequest {
  word: string;
}

/**
 * Fetch word meaning from dictionary API using Cloudflare Pages Functions proxy
 * This function uses our own /api/dictionary endpoint to avoid CORS issues
 */
async function fetchWordMeaning(word: string): Promise<string> {
  if (!word) {
    throw new Error('単語が指定されていません');
  }

  const proxyUrl = `/dictionary?word=${encodeURIComponent(word)}`;

  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`辞書APIステータスエラー: ${response.status}`);
  }

  const meanings = await response.text();
  return meanings;
}

/**
 * Search for a word and record the search (POST /api/search equivalent)
 */
export async function searchWord(
  request: SearchRequest
): Promise<{ message: string }> {
  await dbInitPromise;

  const { word } = request;

  if (!word) {
    throw new Error('必須フィールドが不足しています');
  }

  // Get word meaning from API
  let meanings = '';
  try {
    meanings = await fetchWordMeaning(word);
    if (!meanings || meanings.trim() === '') {
      throw new Error('意味が空です');
    }
  } catch (error) {
    throw new Error('意味の取得に失敗しました');
  }

  // Record search in IndexedDB with meaning
  await createOrUpdateWordSearch(word, meanings);

  return { message: '検索が記録されました' };
}

/**
 * Get word meaning without recording search (GET /api/search equivalent)
 */
export async function getWordMeaning(
  word: string
): Promise<DictionaryResponse> {
  if (!word) {
    throw new Error('単語パラメータが必要です');
  }

  const meanings = await fetchWordMeaning(word);
  if (!meanings) {
    throw new Error('意味の取得に失敗しました');
  }

  return {
    word,
    meanings
  };
}

/**
 * Get pending reviews (GET /api/review/pending equivalent)
 */
export async function getPendingReviewsApi(): Promise<PendingReview[]> {
  await dbInitPromise;
  return await getPendingReviews();
}

/**
 * Record a word review (PATCH /api/review equivalent)
 */
export async function reviewWord(
  request: ReviewRequest
): Promise<{ message: string }> {
  await dbInitPromise;

  const { word } = request;

  if (!word) {
    throw new Error('必須フィールドが不足しています');
  }

  await updateWordReview(word);

  return { message: '復習が記録されました。' };
}

/**
 * Get review history (GET /api/review/history equivalent)
 */
export async function getReviewHistoryApi(): Promise<ReviewHistory[]> {
  await dbInitPromise;
  return await getReviewHistory();
}

/**
 * Record a correct answer for a word
 */
export async function recordCorrect(word: string): Promise<void> {
  await dbInitPromise;
  await recordCorrectAnswer(word);
}

/**
 * Record a wrong answer for a word
 */
export async function recordWrong(word: string): Promise<void> {
  await dbInitPromise;
  await recordWrongAnswer(word);
}
