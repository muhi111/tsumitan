import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { searchErrorAtom, searchResultAtom } from '../atoms';

const HomePage = () => {
  const searchResult = useAtomValue(searchResultAtom);
  const searchError = useAtomValue(searchErrorAtom); // ← エラーも取得

  useEffect(() => {
    console.log('🔍 [HomePage] searchResult:', searchResult);
    console.log('⚠️ [HomePage] searchError:', searchError);
  }, [searchResult, searchError]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      {searchError ? (
        <p className="text-red-600 text-center">{searchError}</p>
      ) : searchResult ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
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
        <div className="flex items-center justify-center min-h-[60vh] px-2 sm:px-0">
          <div className="text-center w-full max-w-2xl sm:max-w-sm">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              英単語を検索してみましょう
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              上の検索ボックスに調べたい英単語を入力すると、
              <br />
              日本語の意味を確認できます
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
              <p className="text-blue-700 text-sm font-medium mb-2">
                💡 スマート単語帳機能
              </p>
              <ul className="text-blue-600 text-sm space-y-1">
                <li>• 検索した単語は自動的に単語帳に追加</li>
                <li>• 検索回数に応じて最適な学習順序を提案</li>
                <li>• 効率的な復習で英語力アップをサポート</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
