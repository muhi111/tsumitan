import { atom } from 'jotai';

//初期の単語表示用
export const searchErrorAtom = atom<string | null>(null); // ← エラー用の新しい Atom

export const search = atom(''); //検索キーワードをおく

type SearchResult = {
  word: string;
  meanings: string;
};

export const searchResultAtom = atom<SearchResult | null>(null);
