// App.tsx 
import Header from './components/Header';
import Footer from './components/Footer'; // このコンポーネントがサイドバー兼フッターとして機能
import MainComponents from './components/MainComponents';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Newsreader','Noto_Sans',sans-serif]">
      <div className="lg:flex"> {/* PC表示時 (lg以上) にflexコンテナにし、サイドバーとメインコンテンツを横並びにする */}
        
       
        
        {/* メインコンテンツエリア */}
        {/* PC表示時 (lg以上) は、サイドバーの幅 (w-64) だけ左マージンを設定 */}
        <div className="flex-grow flex flex-col lg:ml-64"> 
        <Header />
          <main className="flex-grow px-4 py-6 sm:px-6 md:px-10">
            <MainComponents />
          </main>
        </div>
 <Footer /> {/* サイドバー (PC) または フッター (モバイル) */}
      </div>
    </div>
  );
}

export default App;