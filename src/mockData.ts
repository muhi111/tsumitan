
export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed';
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  stats: {
    wordsLearned: number;
    daysStudied: number;
    dayStreak: number;
  };
  weeklyGoal: {
    description: string;
    targetWords: number;
    learnedWords: number;
  };
  todayTasks: Task[]; // Task型を定義し、配列として持つ
};

let mockUserProfile: UserProfile = {
  id: 'user123',
  name: '田中 太郎',
  email: 'taro.tanaka@example.com',
  avatarUrl: 'https://via.placeholder.com/150/add8e6/000000?text=User', // 初期アバター画像
  stats: {
    wordsLearned: 1250,
    daysStudied: 75,
    dayStreak: 12,
  },
  weeklyGoal: {
    description: '新しい単語を週に100語学習する',
    targetWords: 100,
    learnedWords: 45,
  },
  todayTasks: [
    { id: 't1', title: '単語帳を20分学習', description: 'Unit 5の単語を復習', status: 'In Progress' },
    { id: 't2', title: 'リスニング練習', description: 'ポッドキャストを1つ聞く', status: 'Completed' },
    { id: 't3', title: 'シャドーイング', description: 'ニュース記事で実践', status: 'In Progress' },
  ],
};

// プロフィールデータを取得するモック関数
export const fetchMockUserProfile = async (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserProfile);
    }, 500); // 擬似的な遅延
  });
};

// プロフィールデータを更新するモック関数
export const updateMockUserProfile = async (
  formData: { name: string; email: string }
): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockUserProfile = { ...mockUserProfile, ...formData };
      resolve(mockUserProfile);
    }, 500);
  });
};

// アバター画像をアップロードするモック関数
export const uploadMockAvatar = async (
  file: File
): Promise<{ success: boolean; avatarUrl: string; message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file.size > 2 * 1024 * 1024) { // 2MB以上のファイルはエラーとする例
        reject({ success: false, message: 'ファイルサイズが大きすぎます（最大2MB）。' });
        return;
      }
      const newAvatarUrl = URL.createObjectURL(file); // アップロードされたファイルのURLを生成
      mockUserProfile = { ...mockUserProfile, avatarUrl: newAvatarUrl };
      resolve({ success: true, avatarUrl: newAvatarUrl, message: 'アバターが正常にアップロードされました。' });
    }, 1000);
  });
};

// --- 新しいタスク関連のモック関数 ---

// タスクを追加するモック関数
export const addMockTask = async (currentUser: UserProfile, newTask: Task): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedTasks = [...currentUser.todayTasks, newTask];
      mockUserProfile = { ...currentUser, todayTasks: updatedTasks };
      resolve(mockUserProfile);
    }, 500);
  });
};

//タスクを削除するモック関数
export const deleteMockTask = async (
    currentUser: UserProfile,
     taskId:string)
     : Promise<UserProfile> => {
    return new Promise((resolve) => {
        setTimeout(()=> {
            const updatedTasks = currentUser.todayTasks.filter(task => task.id !== taskId);
            mockUserProfile = {...currentUser, todayTasks: updatedTasks};
            resolve(mockUserProfile);
        },500);
    });
};


// タスクのステータスを更新するモック関数
export const updateMockTaskStatus = async (
  currentUser: UserProfile,
  taskId: string,
  newStatus: 'In Progress' | 'Completed'
): Promise<UserProfile> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = currentUser.todayTasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        reject(new Error('指定されたタスクが見つかりません。'));
        return;
      }

      const updatedTasks = [...currentUser.todayTasks];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: newStatus };
      mockUserProfile = { ...currentUser, todayTasks: updatedTasks };
      resolve(mockUserProfile);
    }, 500);
  });
};

