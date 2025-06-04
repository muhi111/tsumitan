import { useAtom } from "jotai";
import { search } from "../atoms";

const Header = () => {

  const [searchValue,setSearchValue] = useAtom(search)

  const handleClearSearch = () => {
    setSearchValue(''); //検索フォームのリセット
  };

//辞書で調べたら
  return (
    <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        
          {/*<button className="text-slate-700 p-2 -ml-2">
            {/*<span className="material-icons">arrow_back_ios_new</span>
          </button>*/}
          <div className="flex items-center pt-4 mb-4">
          <h1 className="text-slate-900 text-xl md:text-2xl font-bold flex-1 text-center mt-4">
            Dictionary
          </h1>
          </div>

        <div className="pb-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> 
              <span className="material-icons text-slate-500">search</span>
            </div>
            <input
              className="form-input block w-full rounded-xl border-0 bg-slate-100 py-3 pl-10 pr-10 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition focus:outline-none sm:text-sm"
              placeholder="Search for a word..."
              type="text"
              value={searchValue}
              onChange={(e)=>setSearchValue(e.target.value)}
            />
            {searchValue && ( //クリアボタンの表示
            <button
            onClick={handleClearSearch}
             className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700">
              <span className="material-icons">clear</span>
            </button>)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
