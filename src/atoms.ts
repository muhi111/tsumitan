import { atom } from "jotai";

//初期の単語表示用
export const searchErrorAtom = atom<string | null>(null); // ← エラー用の新しい Atom

export const search = atom('') //検索キーワードをおく

// 認証関連の型定義
export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
};

// 認証状態のアトム
export const authUserAtom = atom<AuthUser | null>(null);

// 認証ローディング状態のアトム
export const authLoadingAtom = atom<boolean>(true);

// 認証エラー状態のアトム
export const authErrorAtom = atom<string | null>(null);

type SearchResult = {
  word: string;
  meanings: string;
};

export const searchResultAtom = atom<SearchResult | null>(null);
