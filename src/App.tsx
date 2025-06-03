// App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import Header from './components/Header';
import Footer from './components/Footer';
// --- pages ディレクトリから各画面コンポーネントをインポート ---
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import DictionaryPage from './pages/DictionaryPage'; // MainComponentsから変更
import ProfilePage from './pages/ProfilePage';

// Appコンポーネントの内部でHeaderの表示を制御するためのコンポーネント
const AppContent = () => {
  const location = useLocation(); //  現在のURL情報を取得
  const showHeader = location.pathname === '/dictionary'; // /dictionary の時だけHeaderを表示

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Newsreader','Noto_Sans',sans-serif]">
      <div className="lg:flex">
        
        <div className="flex-grow flex flex-col lg:ml-64">
          {showHeader && <Header />} {/* showHeaderがtrueの時だけHeaderをレンダリング */}
          <main className="flex-grow px-4 py-6 sm:px-6 md:px-10">
            <Routes>
              <Route path="/" element={<Navigate to="/dictionary" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/dictionary" element={<DictionaryPage />} /> {/* DictionaryPageを使用 */}
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent /> {/*  useLocationを使うためにコンポーネントを分離 */}
    </BrowserRouter>
  );
}

export default App;