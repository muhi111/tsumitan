import { useAtom, useAtomValue, useSetAtom } from "jotai"; // useSetAtom 追加
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { search, authUserAtom, searchResultAtom } from "../atoms"; // searchResultAtom 追加
import { auth } from "../firebase/config";
import { apiPost } from "../utils/api";
import type { FormEvent } from "react";

type SearchRequest = {
  word: string;
};

const Header = () => {
  const [searchValue, setSearchValue] = useAtom(search);
  const setSearchResult = useSetAtom(searchResultAtom);
  const authUser = useAtomValue(authUserAtom);
  const navigate = useNavigate();

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/home");
    } catch (error) {
      console.error("サインアウトエラー:", error);
    }
  };

  const handleAuthAction = () => {
    navigate("/auth");
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    const requestBody: SearchRequest = { word: searchValue };
    console.log("検索語:", requestBody.word);

    try {
      const res = await apiPost("/api/search", requestBody);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("検索失敗:", errorData);
        throw new Error("検索失敗");
      }

      const data = await res.json(); // ← APIの検索結果を受け取る
      console.log("✅ 検索結果データ:", data);
      setSearchResult(data); // Atomにセットして共有
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("検索エラー:", err.message);
        console.error("スタックトレース:", err.stack);
      } else {
        console.error("未知のエラー:", err);
      }
      alert("検索中にエラーが発生しました");
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pt-4 mb-4">
          <h1 className="text-slate-900 text-xl md:text-2xl font-bold flex-1 text-center mt-4">
            Dictionary
          </h1>
          <div className="flex items-center space-x-2">
            {authUser && !authUser.isAnonymous ? (
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
                      {authUser.displayName?.charAt(0) ||
                        authUser.email?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                )}
                <span className="text-sm text-slate-700 hidden sm:block">
                  {authUser.displayName || authUser.email}
                </span>
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
                {authUser?.isAnonymous ? "アカウント作成" : "サインイン"}
              </button>
            )}
          </div>
        </div>

        {/* 検索フォーム */}
        <div className="pb-4">
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
      </div>
    </header>
  );
};

export default Header;
