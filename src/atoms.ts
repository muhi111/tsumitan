import { atom } from "jotai";




//Profile.tsx 
// UserProfile型の定義を更新
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  stats: {
    wordsLearned: number;
    daysStudied: number;
    dayStreak: number;
  };
  weeklyGoal: {
    description: string;
    targetWords: number;
    learnedWords: number;
  };
  todayTasks: Task[]; // Task型を配列として持つように変更
};

//todos 
export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed';
};

// ユーザープロファイルデータのアトム
export const userProfileAtom = atom<UserProfile | null>(null);

// ローディング状態のアトム
export const profileLoadingAtom = atom<boolean>(true); // 初期値はtrue (読み込み中)

// エラー状態のアトム
export const profileErrorAtom = atom<string | null>(null);



//表示している単語な単語の情報
export type WordInfo = {
    word: string;
    pronunciation?:string; //発音記号　(オプショナルな気がする)
    meaning:string;
    example:string;
    synonyms?:string[];//類義語　配列なう
};

//最初の表示するためだけのモックデータ
const initialWordInfo : WordInfo = {
    word: 'Vocabulary',
  pronunciation: '/vəˈkæbjʊˌlɛrɪ/',
  meaning: 'The body of words used in a particular language.',
  example: '"The vocabulary of a language is constantly evolving."',
  synonyms: ['lexicon', 'terminology', 'word-stock']   
};

//初期の単語hyou示用
export const currentWordInfoAtom = atom<WordInfo>(initialWordInfo)



//学習用のメタデータなどLEarn.tsxを実装していく際に拡張していくyo


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

export type SearchResult = {
  word: string;
  meaning: string;
};

export const searchResultAtom = atom<any[]>([]);
