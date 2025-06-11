// App.tsx
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import AuthProvider from './components/AuthProvider';
import Footer from './components/Footer';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
// --- pages ディレクトリから各画面コンポーネントをインポート ---
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import ProfilePage from './pages/ProfilePage';

// Appコンポーネントの内部でHeaderの表示を制御するためのコンポーネント
const AppContent = () => {
  const location = useLocation(); //  現在のURL情報を取得
  const showHeader = ['/home'].includes(location.pathname); //homeの時だけHeaderを表示

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Newsreader','Noto_Sans',sans-serif]">
      <div className="lg:flex">
        <div className="flex-grow flex flex-col lg:ml-64">
          {showHeader && <Header />}{' '}
          {/* showHeaderがtrueの時だけHeaderをレンダリング */}
          <main className="flex-grow px-4 py-6 sm:px-6 md:px-10">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route
                path="/profile"
                element={
                  <AuthGuard requireAuth={true}>
                    <ProfilePage />
                  </AuthGuard>
                }
              />
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
    <HashRouter>
      <AuthProvider>
        <AppContent /> {/*  useLocationを使うためにコンポーネントを分離 */}
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
