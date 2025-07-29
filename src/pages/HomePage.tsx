import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { FormEvent } from 'react';
import { useEffect } from 'react';
import { search, searchErrorAtom, searchResultAtom } from '../atoms';
import { getWordMeaning, searchWord } from '../utils/api';

const HomePage = () => {
  const [searchValue, setSearchValue] = useAtom(search);
  const setSearchResult = useSetAtom(searchResultAtom);
  const searchResult = useAtomValue(searchResultAtom);
  const searchError = useAtomValue(searchErrorAtom);

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    console.log('検索語:', searchValue);
    try {
      // Record search and get word meaning
      await searchWord({ word: searchValue });

      // Get word meaning
      const data = await getWordMeaning(searchValue);
      console.log('🔍 検索結果データ:', data);
      setSearchResult(data);
    } catch (err: unknown) {
      console.error('検索中にエラー:', err);
      setSearchResult(null);
      if (err instanceof Error) {
        if (err.message.includes('意味の取得に失敗')) {
          alert('単語が見つかりませんでした');
        } else {
          alert(`検索中にエラーが発生しました: ${err.message}`);
        }
      } else {
        alert('予期しないエラーが発生しました');
      }
    }
  };

  useEffect(() => {
    console.log('🔍 [HomePage] searchResult:', searchResult);
    console.log('⚠️ [HomePage] searchError:', searchError);
  }, [searchResult, searchError]);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* 検索フォーム */}
      <div className="flex-shrink-0 mb-6">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-icons text-slate-500">search</span>
            </div>
            <input
              className="form-input block w-full rounded-xl border-0 bg-slate-100 py-3 pl-10 pr-10 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition focus:outline-none sm:text-sm"
              placeholder="Search for a word..."
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
              >
                <span className="material-icons">clear</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 検索結果・初期画面 */}
      <div className="flex-1 flex items-center justify-center">
        {searchError ? (
          <p className="text-red-600 text-center">{searchError}</p>
        ) : searchResult ? (
          <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {searchResult.word}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-800 leading-relaxed">
              {searchResult.meanings.split(' / ').map((meaning: string) => (
                <li key={meaning}>{meaning}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center w-full max-w-2xl sm:max-w-lg px-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="検索"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              英単語を検索してみましょう
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              上の検索ボックスに調べたい英単語を入力すると、
              <br />
              日本語の意味を確認できます
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-center mb-3">
                <div className="w-5 h-5 mr-2 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-blue-700 text-sm font-medium">
                  スマート単語帳機能
                </p>
              </div>
              <ul className="text-blue-600 text-sm space-y-1">
                <li>• 検索した単語は自動的に単語帳に追加</li>
                <li>• 検索回数に応じて最適な学習順序を提案</li>
                <li>• 効率的な復習で英語力アップをサポート</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
