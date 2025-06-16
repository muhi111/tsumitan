import type { Status } from '../utils/wordUtils';

export type Word = {
  word: string;
  search_count: number;
  review_count?: number;
  last_reviewed?: string;
  meaning?: string;
};

export type WordWithStatus = Word & { status: Status };

export interface ReviewRequest {
  word: string;
}
