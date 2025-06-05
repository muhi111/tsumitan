
//Profile.tsx パスワード設定などはいったん除去コメントアウト中
//パスワードーの別コンポーネントとの分離？

import React, { useState, useEffect } from 'react';
import {
  fetchMockUserProfile,
  updateMockUserProfile,
  // changeMockPassword, // コメントアウト
  uploadMockAvatar,
  
} from '../mockData'; // mockData.tsのパスに合わせて調整
import { profileErrorAtom, profileLoadingAtom, userProfileAtom,  type UserProfile } from '../atoms';
import { useAtom } from 'jotai';



const ProfilePage: React.FC = () => {

  
 // Jotaiのatomから状態とsetterを取得
  const [user, setUser] = useAtom(userProfileAtom);
  const [loading, setLoading] = useAtom(profileLoadingAtom);
  const [error, setError] = useAtom(profileErrorAtom);


  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
 // const [passwordChangeFormData, setPasswordChangeFormData] = useState({
   // currentPassword: '',
    //newPassword: '',
    //confirmNewPassword: '',
  //});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

   // 初期データの読み込み
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true); // Jotaiのsetterを使用
        setError(null);   // Jotaiのsetterを使用
        const data = await fetchMockUserProfile() as UserProfile;
        setUser(data);    // Jotaiのsetterを使用
        setEditFormData({ name: data.name, email: data.email });
      } catch (err) {
        setError('ユーザーデータの読み込みに失敗しました。'); // Jotaiのsetterを使用
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false); // Jotaiのsetterを使用
      }
    };

    // userがまだロードされていない場合のみフェッチを実行
    // これにより、ProfilePageが再マウントされてもデータが再度フェッチされるのを防ぐ
    if (!user) {
      loadUserProfile();
    } else {
      // 既にユーザーデータがある場合は、ローディングを終了しフォームデータを初期化
      setLoading(false);
      setEditFormData({ name: user.name, email: user.email });
    }
  }, [user, setUser, setLoading, setError]); // Jotaiのsetterも依存配列に追加

  // プロフィール編集フォームの変更ハンドラ
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // プロフィール更新の送信ハンドラ
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // userがnullの場合は処理を中断

    try {
      setLoading(true); // Jotaiのsetterを使用
      setError(null);   // Jotaiのsetterを使用
      const updatedUser = await updateMockUserProfile(editFormData) as UserProfile; // モックAPI呼び出し
      setUser(updatedUser); // Jotaiのsetterを使用
      setIsEditingProfile(false);
      alert('プロフィールが正常に更新されました！');
    } catch (err) {
      setError('プロフィールの更新に失敗しました。'); // Jotaiのsetterを使用
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false); // Jotaiのsetterを使用
    }
  };

  // アバターファイル選択ハンドラ
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // アバターアップロードハンドラ
  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setError('アップロードするファイルを選択してください。'); // Jotaiのsetterを使用
      return;
    }

    try {
      setLoading(true); // Jotaiのsetterを使用
      setError(null);   // Jotaiのsetterを使用
      const result = await uploadMockAvatar(avatarFile) as { success: boolean; avatarUrl: string; message: string }; // モックAPI呼び出し
      if (result.success && user) {
        // userオブジェクトを更新する際もJotaiのsetterを使用
        setUser({ ...user, avatarUrl: result.avatarUrl });
        setAvatarFile(null); // ファイル選択をクリア
        alert('アバターが正常にアップロードされました！');
      } else {
        throw new Error(result.message || 'アバターのアップロードに失敗しました。');
      }
    } catch (err: any) {
      setError(err.message || 'アバターのアップロード中にエラーが発生しました。'); // Jotaiのsetterを使用
      console.error('Error uploading avatar:', err);
    } finally {
      setLoading(false); // Jotaiのsetterを使用
    }
  };

  // ローディング、エラー、ユーザーデータがない場合の表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">エラー: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">ユーザーデータが見つかりません。</p>
      </div>
    );
  }

  // 週ごとの目標達成進捗バーの計算
  const weeklyProgressPercentage = user.weeklyGoal.targetWords > 0
    ? (user.weeklyGoal.learnedWords / user.weeklyGoal.targetWords) * 100
    : 0;




  return (
    // 横スクロール禁止の立並びで美しいUIふう

    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"> 
      <div className="flex-grow">
        <header className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md">
          <div className="flex items-center p-4 pb-3">
            <h1 className="text-slate-900 text-xl font-bold leading-tight tracking-tight flex-1 text-center pr-10">Profile</h1>
          </div>
        </header>

        <main className="px-4 pt-2 pb-6 @container">
          <section className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 ring-4 ring-white shadow-lg"
                style={{ backgroundImage: `url("${user.avatarUrl}")` }}
              ></div>
              <button
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                onClick={() => document.getElementById('avatar-upload-input')?.click()} // ファイル選択inputをトリガー
              >
                <span className="material-icons text-base">edit </span>
              </button>
              {/* 非表示のファイル入力フィールド */}
              <input
                type="file"
                id="avatar-upload-input"
                className="hidden"
                accept="image/*"
                aria-label="プロフィール画像のアップロード"
                onChange={handleAvatarFileChange}
              />
            </div>
            <h2 className="text-slate-900 text-2xl font-Newsreader leading-tight tracking-tight">{user.name}</h2>

            {/*プロフィール編集の中*/}
            {avatarFile && (
              <button
                onClick={handleAvatarUpload}
                className="mt-2 bg-purple-500 hover:bg-purple-600 text-white font-Newsreader py-1 px-3 rounded text-sm"
                disabled={loading}
              >
                {loading ? 'アップロード中...' : 'アバターを保存'}
              </button>
            )}
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-Newsreader py-2 px-4 rounded"
            >
              {isEditingProfile ? '編集をキャンセル' : 'プロフィールを編集'}
            </button>
          </section>

          {isEditingProfile && (
            <section className="mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-900 text-xl  leading-tight tracking-tight font-Newsreader mb-4">プロフィール編集</h3>
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-Newsreader mb-2">名前:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled={loading}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-Newsreader mb-2">メールアドレス:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font- py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? '更新中...' : 'プロフィールを更新'}
                </button>
              </form>
            </section>
          )}

      
          <section className="grid grid-cols-3 gap-3 mb-8">
            <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 items-center text-center shadow-sm">
              <p className="text-slate-900 text-3xl font-bold leading-tight">{user.stats.wordsLearned}</p>
              <p className="text-slate-500 text-sm font-normal leading-normal">Words Learned</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 items-center text-center shadow-sm">
              <p className="text-slate-900 text-3xl font-bold leading-tight">{user.stats.daysStudied}</p>
              <p className="text-slate-500 text-sm font-normal leading-normal">Days Studied</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 items-center text-center shadow-sm">
              <p className="text-slate-900 text-3xl font-bold leading-tight">{user.stats.dayStreak}</p>
              <p className="text-slate-500 text-sm font-normal leading-normal">Day Streak</p>
            </div>
          </section>

          <section className="mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-900 text-xl font-bold leading-tight tracking-tight px-1 pb-3 pt-2">Study Progress</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900 text-lg font-medium leading-normal">Weekly Goal</p>
                <p className="text-slate-500 text-sm font-normal leading-normal">{user.weeklyGoal.description}</p>
              </div>
              <button className="text-slate-500 hover:text-slate-700">
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
            <div className="mt-3 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${weeklyProgressPercentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 text-right">{user.weeklyGoal.learnedWords}/{user.weeklyGoal.targetWords} words ({weeklyProgressPercentage.toFixed(0)}%)</p>
          </section>

          {/* パスワード変更セクション */}
          
           {/* <section className="mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-900 text-xl font-bold leading-tight tracking-tight mb-4">パスワード変更</h3>
            <form onSubmit={handlePasswordUpdate}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">現在のパスワード:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordChangeFormData.currentPassword}
                  onChange={handlePasswordChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">新しいパスワード:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordChangeFormData.newPassword}
                  onChange={handlePasswordChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={loading}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">新しいパスワード（確認用）:</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={passwordChangeFormData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? '変更中...' : 'パスワードを変更'}
              </button>
            </form>
          </section>

           */}
          <section>
            <h3 className="text-slate-900 text-xl font-bold leading-tight tracking-tight px-1 pb-3 pt-2">Today's Tasks</h3>
            <div className="space-y-3">
              {user.todayTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-900 text-lg font-medium leading-normal">{task.title}</p>
                    <p className="text-slate-500 text-sm font-normal leading-normal">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${task.status === 'In Progress' ? 'text-blue-500' : 'text-green-500'}`}>
                      {task.status === 'In Progress' ? 'In Progress' : 'Completed'}
                    </span>
                    <button className="text-slate-500 hover:text-slate-700">
                      <span className="material-icons">chevron_right</span>
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 text-blue-500 font-medium py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:bg-slate-100 transition-colors">
                <span className="material-icons">add_circle_outline</span>
                Add New Task
              </button>
            </div>
          </section>
        </main>
      </div>


    </div>
  );
};

export default ProfilePage;