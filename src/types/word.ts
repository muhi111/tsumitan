import type { Status } from '../utils/wordUtils';

// Frontend Word type (simplified for UI)
type FrontendWord = {
  word: string;
  meaning: string;
  searchCount: number;
  reviewCount?: number;
  lastReviewed?: string;
  correctCount?: number;
  wrongCount?: number;
};

export type WordWithStatus = FrontendWord & { status: Status };
