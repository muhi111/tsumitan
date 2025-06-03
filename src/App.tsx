import Header from './components/Header';
import Footer from './components/Footer';
import MainComponents from './components/MainComponents';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Newsreader','Noto_Sans',sans-serif]">
      <div className="flex-grow px-4 py-6 sm:px-6 md:px-10">
        <Header />
      <MainComponents />
      </div>
      <div className="flex-grow px-4 py-6 sm:px-6 md:px-10">
      <Footer />
    </div>
    </div>
  );
}

export default App;
