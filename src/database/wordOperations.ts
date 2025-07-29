import { type Word, getDatabase, getUserID } from './database';

// Search result for pending reviews
export interface PendingReview {
  word: string;
  meaning: string;
  searchCount: number;
}

// Review history result
export interface ReviewHistory {
  word: string;
  meaning: string;
  searchCount: number;
  reviewCount: number;
  lastReviewed: string;
  correctCount: number;
  wrongCount: number;
}

// Create or update word search count
export async function createOrUpdateWordSearch(
  word: string,
  meaning?: string
): Promise<void> {
  const db = await getDatabase();
  const userID = getUserID();
  const now = new Date();

  const tx = db.transaction('words', 'readwrite');
  const store = tx.objectStore('words');

  // Try to get existing record
  const existing = await store.get([userID, word]);

  if (existing) {
    // Update existing record, optionally update meaning if provided
    const updated: Word = {
      ...existing,
      searchCount: existing.searchCount + 1,
      meaning: meaning || existing.meaning || '',
      updatedAt: now
    };
    await store.put(updated);
  } else {
    // Create new record
    const newWord: Word = {
      userID,
      word,
      meaning: meaning || '',
      searchCount: 1,
      reviewCount: 0,
      correctCount: 0,
      wrongCount: 0,
      lastReviewed: new Date(0),
      createdAt: now,
      updatedAt: now
    };
    await store.put(newWord);
  }

  await tx.done;
}

// Get pending reviews (words with search count > review count)
export async function getPendingReviews(): Promise<PendingReview[]> {
  const db = await getDatabase();
  const userID = getUserID();

  const tx = db.transaction('words', 'readonly');
  const store = tx.objectStore('words');
  const index = store.index('by-user');

  const results: PendingReview[] = [];

  for await (const cursor of index.iterate(userID)) {
    const word = cursor.value;
    // Only include words that need review (search count > review count)
    if (word.searchCount > word.reviewCount) {
      results.push({
        word: word.word,
        meaning: word.meaning || '',
        searchCount: word.searchCount
      });
    }
  }

  return results;
}

// Update word review count
export async function updateWordReview(word: string): Promise<void> {
  const db = await getDatabase();
  const userID = getUserID();
  const now = new Date();

  const tx = db.transaction('words', 'readwrite');
  const store = tx.objectStore('words');

  const existing = await store.get([userID, word]);
  if (!existing) {
    throw new Error('Word not found for review');
  }

  const updated: Word = {
    ...existing,
    reviewCount: existing.reviewCount + 1,
    lastReviewed: now,
    updatedAt: now
  };

  await store.put(updated);
  await tx.done;
}

// Get review history (words that have been reviewed)
export async function getReviewHistory(): Promise<ReviewHistory[]> {
  const db = await getDatabase();
  const userID = getUserID();

  const tx = db.transaction('words', 'readonly');
  const store = tx.objectStore('words');
  const index = store.index('by-user');

  const results: ReviewHistory[] = [];

  for await (const cursor of index.iterate(userID)) {
    const word = cursor.value;
    // Only include words that have been reviewed at least once
    if (word.reviewCount > 0) {
      results.push({
        word: word.word,
        meaning: word.meaning || '',
        searchCount: word.searchCount,
        reviewCount: word.reviewCount,
        lastReviewed: word.lastReviewed.toISOString(),
        correctCount: word.correctCount || 0,
        wrongCount: word.wrongCount || 0
      });
    }
  }

  // Sort by last reviewed date (most recent first)
  results.sort(
    (a, b) =>
      new Date(b.lastReviewed).getTime() - new Date(a.lastReviewed).getTime()
  );

  return results;
}

// Record correct answer
export async function recordCorrectAnswer(word: string): Promise<void> {
  const db = await getDatabase();
  const userID = getUserID();
  const now = new Date();

  const tx = db.transaction('words', 'readwrite');
  const store = tx.objectStore('words');

  const existing = await store.get([userID, word]);
  if (!existing) {
    throw new Error('Word not found for correct answer recording');
  }

  const updated: Word = {
    ...existing,
    correctCount: (existing.correctCount || 0) + 1,
    reviewCount: existing.reviewCount + 1,
    lastReviewed: now,
    updatedAt: now
  };

  await store.put(updated);
  await tx.done;
}

// Record wrong answer
export async function recordWrongAnswer(word: string): Promise<void> {
  const db = await getDatabase();
  const userID = getUserID();
  const now = new Date();

  const tx = db.transaction('words', 'readwrite');
  const store = tx.objectStore('words');

  const existing = await store.get([userID, word]);
  if (!existing) {
    throw new Error('Word not found for wrong answer recording');
  }

  const updated: Word = {
    ...existing,
    wrongCount: (existing.wrongCount || 0) + 1,
    reviewCount: existing.reviewCount + 1,
    lastReviewed: now,
    updatedAt: now
  };

  await store.put(updated);
  await tx.done;
}
