// Profile.tsx パスワード設定などはいったん除去コメントアウト中
// パスワードーの別コンポーネントとの分離？

import React, { useState, useEffect } from 'react';

// 

import { useAtom } from 'jotai';
// addMockTask と updateMockTaskStatus を mockData からインポートするように修正
import { fetchMockUserProfile, updateMockUserProfile, uploadMockAvatar, addMockTask, updateMockTaskStatus, deleteMockTask } from '../mockData';
import { profileErrorAtom, profileLoadingAtom, userProfileAtom, type UserProfile } from '../atoms';


const ProfilePage: React.FC = () => {

  // Jotaiのatomから状態とsetterを取得
  const [user, setUser] = useAtom(userProfileAtom);
  const [loading, setLoading] = useAtom(profileLoadingAtom);
  const [error, setError] = useAtom(profileErrorAtom);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // todos
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState(''); 
  const [newTaskDescription, setNewTaskDescription] = useState(''); 

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

  // タスク関連のイベントハンドラ
  //タスク追加
  const handleAddTask = async (e: React.FormEvent) => { // handleAddtask の t を大文字に修正
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setError('タスクのタイトルは必須です');
      return;
    }

    try {
      setLoading(true);
      setError(null)
      const newTask = {
        id: String(Date.now()), //ユニークなID
        title: newTaskTitle,
        description: newTaskDescription,
        status: 'In Progress' as 'In Progress' | 'Completed' //初期ステータス ('In progress' を 'In Progress' に修正)
      };
      const updatedUser = await addMockTask(user!, newTask); //userが存在することを保障
      setUser(updatedUser);
      setNewTaskTitle(''); 
      setNewTaskDescription(''); 
      setIsAddingTask(false); //フォームを閉じる
      alert('新しいタスクが追加されました！'); // alertメッセージを修正
    } catch (err) {
      setError('タスクの追加に失敗しました。'); // エラーメッセージを修正
      console.error('Error adding task:', err); // console.log を console.error に修正
    } finally {
      setLoading(false);
    }
  };
  //タスク削除のイベントハンドル
  const handleDeleteTask = async (taskId:string) => {
    if(!user) return;

    try {
      setLoading(true);
      setError(null);
      const updatedUser = await deleteMockTask(user, taskId)// モック関数を呼び出す
      setUser(updatedUser);
      alert('タスクが削除されました');
    }catch(err:any) {
      setError(err.message || 'タスクの削除に失敗しました');
      console.error('Error delete task', err);
    }finally {
      setLoading(false);
    }
  };

  // タスクのステータスを切り替える関数
  const handleToggleTaskStatus = async (taskId: string) => { // taskId の型を追加
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const taskToUpdate = user.todayTasks.find(task => task.id === taskId);
      // taskToUpdate が見つからなかった場合はエラーをスローするのではなく、処理を中断
      if (!taskToUpdate) {
        setError('タスクが見つかりません。'); // エラーメッセージをセット
        setLoading(false); // ローディングを終了
        return; // 処理を中断
      }

      const newStatus = taskToUpdate.status === 'In Progress' ? 'Completed' : 'In Progress';
      const updatedUser = await updateMockTaskStatus(user, taskId, newStatus); // MockTaskStatus を updateMockTaskStatus に修正
      setUser(updatedUser);
      alert('タスクのステータスが更新されました。');
    } catch (err: any) { // err の型を any にする (型エラー回避のため)
      setError(err.message || 'タスクステータスの更新に失敗しました。'); // エラーメッセージをセット
      console.error('Error updating task status:', err);
    } finally {
      setLoading(false);
    }
  };

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
              <h3 className="text-slate-900 text-xl leading-tight tracking-tight font-Newsreader mb-4">プロフィール編集</h3>
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
                    {/*タスクステータス変更ボタン */}
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)} 
                      className="text-slate-500 hover:text-slate-700">
                      <span className="material-icons">

                        {task.status === 'In Progress' ? 'check_circle_outline' : 'settings_backup_restore'}
                      </span>
                    </button>
                    <button 
                    onClick={()=> handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700">
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {/* 新しいタスク追加ボタン */}
              <button
                onClick={() => setIsAddingTask(true)} // フォーム表示
                className="w-full flex items-center justify-center gap-2 text-blue-500 font-medium py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:bg-slate-100 transition-colors"
              >
                <span className="material-icons">add_circle_outline</span>
                Add New Task
              </button>

              {/* 新しいタスク追加フォーム */}
              {isAddingTask && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-slate-900 text-lg font-bold mb-3">新しいタスクを追加</h4>
                  <form onSubmit={handleAddTask}>
                    <div className="mb-3">
                      <label htmlFor="newTaskTitle" className="block text-gray-700 text-sm font-medium mb-1">タイトル:</label>
                      <input
                        type="text"
                        id="newTaskTitle"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="タスクのタイトル"
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="newTaskDescription" className="block text-gray-700 text-sm font-medium mb-1">説明 (任意):</label>
                      <textarea
                        id="newTaskDescription"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="詳細な説明"
                        rows={2}
                        disabled={loading}
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingTask(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                        disabled={loading}
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                        disabled={loading}
                      >
                        タスクを追加
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;