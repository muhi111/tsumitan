//画面　真ん中部分　辞書検索のやつ
import { useState } from "react";
import Modal from "../components/Modal";

// MainComponents.tsx
const DictionaryPage = () => {
  // モックデータとして類義語

  const [isModalOpen, setIsModalOpen] = useState(false);
  const synonyms: string[] = ["lexicon", "terminology", "word-stock", "glossary"];


  const handleAddClick = () => {
    // ここで単語帳に追加する処理を入れてもよい 6/03　/17:13　現在どこのやつにその単語帳をいれるのか迷うなう
    // 検索された回数ごとに分ける？　6/04/11:12 
 
    
    setIsModalOpen(true);
  };


  return (
    <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-slate-900 text-3xl font-bold tracking-tight">Vocabulary</h2>
          <button className="text-blue-500 p-2 -mr-2">
            <span className="material-icons">volume_up</span>
          </button>
        </div>
        <p className="text-slate-600 text-lg sm:text-base font-normal leading-relaxed mt-1">
          /vəˈkæbjʊˌlɛrɪ/
        </p>
      </section>

      <section className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-slate-800 text-lg font-semibold leading-tight tracking-tight">意味</h3>
        <p className="text-slate-700 text-base font-normal leading-relaxed mt-2">
          The body of words used in a particular language.
        </p>
      </section>

      <section className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-slate-800 text-lg font-semibold leading-tight tracking-tight">例文</h3>
        <p className="text-slate-700 text-base font-normal leading-relaxed mt-2 italic">
          "The <strong className="font-medium text-slate-900">vocabulary</strong> of a language is constantly evolving."
        </p>
      </section>

      {/* 👇 類義語セクションの追加 */}
      <section className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-slate-800 text-lg font-semibold leading-tight tracking-tight">類義語</h3>
        {synonyms.length > 0 ? (
          <ul className="list-disc list-inside text-slate-700 text-base font-normal leading-relaxed mt-2 space-y-1">
            {synonyms.map((synonym, index) => (
              <li key={index}>{synonym}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-base font-normal leading-relaxed mt-2 italic">
            No synonyms available.
          </p>
        )}
      </section>


             {/*これらの結局何がしたいか→モーダルでどの単語帳かを選択可能にする→リストみたいなものに保存していく感じ？*/}


            <section className="bg-white p-5 rounded-xl shadow-sm">
        <h3 
        className="text-slate-800 text-lg font-semibold leading-tight tracking-tight">
          単語帳に追加する
          </h3>
        <p className="text-slate-700 text-base font-normal leading-relaxed mt-2 italic"></p>
        <div className="flex justify-center items-center">
        <button 
        type="button"
        className=" w-1/2 flex justify-center items-center w-1/2 mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
        onClick={handleAddClick}>
          追加
        </button>
        </div>
      </section>
            {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto text-center">
            <h2 className="text-lg font-bold mb-4">単語帳に追加しました！</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className=" flex justify-center items-center w-1/2 mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              閉じる
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default DictionaryPage;