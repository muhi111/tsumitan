import { useAtomValue } from "jotai";
import { searchResultAtom } from "../atoms";

const HomePage = () => {
  const searchResult = useAtomValue(searchResultAtom);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {searchResult ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            {searchResult.word}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-800 leading-relaxed">
            {searchResult.meaning
              .split(" / ")
              .map((meaning: string, index: number) => (
                <li key={index}>{meaning}</li>
              ))}
          </ul>
        </div>
      ) : (
        <p className="text-slate-500 text-center">検索結果はありません。</p>
      )}
    </div>
  );
};

export default HomePage;
