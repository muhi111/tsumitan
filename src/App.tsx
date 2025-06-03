// App.tsx 
import Header from './components/Header';
import Footer from './components/Footer'; // このコンポーネントがサイドバー兼フッターとして機能
import MainComponents from './components/MainComponents';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';


// --- 各画面用のダミーコンポーネントを作成 ---
const HomePage = () => <div className="p-4">Home Page Content</div>;
const LearnPage = () => <div className="p-4">Learn Page Content</div>;
const ProfilePage = () => <div className="p-4">Profile Page Content</div>;
function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Newsreader','Noto_Sans',sans-serif]">
      <div className="lg:flex"> {/* PC表示時 (lg以上) にflexコンテナにし、サイドバーとメインコンテンツを横並びにする */}
        
       
        
        {/* メインコンテンツエリア */}
        {/* PC表示時 (lg以上) は、サイドバーの幅 (w-64) だけ左マージンを設定 */}
        <div className="flex-grow flex flex-col lg:ml-64"> 
        <Header />
        <main className="flex-grow px-4 py-6 sm:px-6 md:px-10">

              <Routes> {/* 一様のルート定義 */}
                <Route path="/" element={<Navigate to="/dictionary" replace />} /> {/* 初期表示を /dictionary へリダイレクト */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/dictionary" element={<MainComponents />} /> {/* MainComponentsがDictionary画面を担当 */}
                <Route path="/profile" element={<ProfilePage />} />
                {/* 必要に応じて他のルートも追加 */}
                
              </Routes>
            </main>
        </div>
        <Footer /> {/* サイドバー (PC) または フッター (モバイル) */}
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;