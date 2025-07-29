import type { Status } from '../utils/wordUtils';

export type Word = {
  word: string;
  searchCount: number;
  reviewCount?: number;
  lastReviewed?: string;
  meaning?: string;
};

export type WordWithStatus = Word & { status: Status };

export interface ReviewRequest {
  word: string;
}
