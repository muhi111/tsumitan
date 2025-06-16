import type { ReactNode } from 'react';
import { LAYOUT_CONSTANTS } from '../constants/layout';
import Footer, { Sidebar } from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

const Layout = ({ children, showHeader = false }: LayoutProps) => {
  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-['Newsreader','Noto_Sans',sans-serif] overflow-hidden">
      {/* ヘッダー - 全画面サイズで共通 */}
      {showHeader && <Header />}

      {/* デスクトップレイアウト - Grid構造 */}
      <div
        className="hidden lg:grid lg:grid-cols-[256px_1fr] h-full"
        style={{
          height: showHeader
            ? `calc(100vh - ${LAYOUT_CONSTANTS.HEADER_HEIGHT}px)`
            : '100vh'
        }}
      >
        {/* サイドバー - デスクトップのみ */}
        <div className="lg:border-r lg:border-slate-200 h-full overflow-hidden">
          <Sidebar />
        </div>

        {/* メインコンテンツエリア */}
        <main className="h-full overflow-y-auto flex flex-col">
          <div className="flex-1">
            <div className="container mx-auto px-4 py-6 sm:px-6 md:px-10 max-w-7xl h-full">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* モバイルレイアウト */}
      <div
        className="lg:hidden h-full overflow-hidden flex flex-col"
        style={{
          height: showHeader
            ? `calc(100dvh - ${LAYOUT_CONSTANTS.HEADER_HEIGHT}px)`
            : '100dvh'
        }}
      >
        <main className="flex-1 overflow-y-auto">
          <div
            className="container mx-auto px-4 py-6 sm:px-6 md:px-10 max-w-7xl h-full"
            style={{
              paddingBottom: `calc(${LAYOUT_CONSTANTS.MOBILE_FOOTER_HEIGHT}px + env(safe-area-inset-bottom))`
            }}
          >
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
