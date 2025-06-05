import { atom } from "jotai";




//Profile.tsx 
// ユーザーデータの型定義
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  joinedDate: string;
  stats: {
    wordsLearned: number;
    daysStudied: number;
    dayStreak: number;
  };
  weeklyGoal: {
    targetWords: number;
    learnedWords: number;
    description: string;
  };
  todayTasks: Array<{
    id: string;
    title: string;
    description: string;
    status: 'In Progress' | 'Completed';
  }>;
}


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
