// MainComponents.tsx
const MainComponents = () => {
  // モックデータとして類義語のリストを定義
  const synonyms: string[] = ["lexicon", "terminology", "word-stock", "glossary"];

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
    </main>
  );
};

export default MainComponents;