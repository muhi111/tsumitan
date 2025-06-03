const MainComponents = () => {
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
        <h3 className="text-slate-800 text-lg font-semibold leading-tight tracking-tight">Meaning</h3>
        <p className="text-slate-700 text-base font-normal leading-relaxed mt-2">
          The body of words used in a particular language.
        </p>
      </section>

      <section className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-slate-800 text-lg font-semibold leading-tight tracking-tight">Example</h3>
        <p className="text-slate-700 text-base font-normal leading-relaxed mt-2 italic">
          "The <strong className="font-medium text-slate-900">vocabulary</strong> of a language is constantly evolving."
        </p>
      </section>
    </main>
  );
};

export default MainComponents;
