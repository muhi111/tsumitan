import React from 'react';
import { useAtomValue } from 'jotai';
import { authUserAtom } from '../atoms';

const ProfilePage: React.FC = () => {
  // Firebase認証ユーザー情報を取得
  const authUser = useAtomValue(authUserAtom);

  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">認証情報が見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <div className="flex-grow">
        <header className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md">
          <div className="flex items-center p-4 pb-3">
            <h1 className="text-slate-900 text-xl font-bold leading-tight tracking-tight flex-1 text-center pr-10">Profile</h1>
          </div>
        </header>

        <main className="px-4 pt-2 pb-6 @container">
          {/* Firebase認証情報セクション */}
          <section className="mb-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-slate-900 text-lg font-bold leading-tight tracking-tight mb-4">アカウント情報</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-slate-600 font-medium sm:w-32 sm:flex-shrink-0">ユーザーID:</span>
                <div className="bg-slate-50 rounded-lg p-3 border sm:flex-1 sm:max-w-md">
                  <span className="text-sm text-slate-900 font-mono break-all select-all">
                    {authUser.uid}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-slate-600 font-medium sm:w-32 sm:flex-shrink-0">メールアドレス:</span>
                <div className="bg-slate-50 rounded-lg p-3 border sm:flex-1 sm:max-w-md">
                  <span className="text-sm text-slate-900 break-all">
                    {authUser.email || '未設定'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-slate-600 font-medium sm:w-32 sm:flex-shrink-0">表示名:</span>
                <div className="bg-slate-50 rounded-lg p-3 border sm:flex-1 sm:max-w-md">
                  <span className="text-sm text-slate-900">
                    {authUser.displayName || '未設定'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-slate-600 font-medium sm:w-32 sm:flex-shrink-0">アカウントタイプ:</span>
                <div className="sm:flex-1 sm:max-w-md">
                  <span className={`inline-block text-sm font-medium px-3 py-2 rounded-lg ${
                    authUser.isAnonymous 
                      ? 'text-orange-700 bg-orange-100 border border-orange-200' 
                      : 'text-green-700 bg-green-100 border border-green-200'
                  }`}>
                    {authUser.isAnonymous ? '匿名ユーザー' : '登録ユーザー'}
                  </span>
                </div>
              </div>
              
              {authUser.photoURL && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm text-slate-600 font-medium sm:w-32 sm:flex-shrink-0">プロフィール画像:</span>
                  <div className="sm:flex-1 sm:max-w-md">
                    <img
                      src={authUser.photoURL}
                      alt="プロフィール"
                      className="w-12 h-12 rounded-full border-2 border-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {authUser.isAnonymous && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800 mb-3">
                  匿名ユーザーとしてログインしています。アカウントを作成すると学習データを永続化できます。
                </p>
                <button
                  onClick={() => window.location.href = '#/auth'}
                  className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  アカウントを作成
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
