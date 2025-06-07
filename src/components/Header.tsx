import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { search, authUserAtom } from "../atoms";
import { auth } from "../firebase/config";

const Header = () => {
  const [searchValue,setSearchValue] = useAtom(search);
  const authUser = useAtomValue(authUserAtom);
  const navigate = useNavigate();

  const handleClearSearch = () => {
    setSearchValue(''); //検索フォームのリセット
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/home');
    } catch (error) {
      console.error('サインアウトエラー:', error);
    }
  };

  const handleAuthAction = () => {
    navigate('/auth');
  };

//辞書で調べたら
  return (
    <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        
          {/*<button className="text-slate-700 p-2 -ml-2">
            {/*<span className="material-icons">arrow_back_ios_new</span>
          </button>*/}
          <div className="flex items-center justify-between pt-4 mb-4">
          <h1 className="text-slate-900 text-xl md:text-2xl font-bold flex-1 text-center mt-4">
            Dictionary
          </h1>
          
          {/* 認証状態表示とアクション */}
          <div className="flex items-center space-x-2">
            {authUser && !authUser.isAnonymous ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  {authUser.photoURL ? (
                    <img 
                      src={authUser.photoURL} 
                      alt="プロフィール"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {authUser.displayName?.charAt(0) || authUser.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-slate-700 hidden sm:block">
                    {authUser.displayName || authUser.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-slate-600 hover:text-slate-800 px-3 py-1 rounded-md hover:bg-slate-100"
                >
                  サインアウト
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {authUser?.isAnonymous ? 'アカウント作成' : 'サインイン'}
              </button>
            )}
          </div>
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
