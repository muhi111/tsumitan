//レスポンシブ
//PCいじょう　→サイドバーで画面遷移 縦並び

import { Link, useLocation } from 'react-router-dom';

//それ以下→ 画面の最下層に固定　横並び
type NavItem = {
  icon: string;
  label: string;
  path: string;
};

//MUIIcons
const navItems: NavItem[] = [
  { icon: 'home', label: 'Home', path: '/home' },
  { icon: 'school', label: 'Learn', path: '/learn' },
  { icon: 'person_outline', label: 'Profile', path: '/profile' }
];

const Footer = () => {
  const location = useLocation(); // ◀️ 現在のURL情報を取得
  return (
    <footer
      className={`
        z-50 /* 他の要素より手前に表示 */
        
        
        /* --- モバイル (デフォルト) のスタイル: フッター --- */

        w-full fixed bottom-0 
        bg-slate-50/80 backdrop-blur-sm 
        border-t border-slate-200
        
        /* --- PC (lg以上) のスタイル: サイドバー --- */
        
        lg:h-screen lg:w-64 lg:fixed lg:left-0 lg:top-0 
         lg:flex lg:flex-col 
         lg:border-r lg:border-slate-200 
         lg:bg-slate-50 /* PCでは透過なしの背景 */

         lg:shadow-md /* PCサイドバーに影を追加しても良い */
         
         /* PCスタイル適用時にモバイル用のstickyなどを打ち消す */
         
         lg:sticky-auto lg:bottom-auto lg:backdrop-blur-none lg:bg-opacity-100

      `}
    >
      {/* PCサイドバー時に表示するロゴ */}
      <div className="hidden lg:block p-4 border-b border-slate-200 text-center">
        <Link
          to="/home"
          className="inline-block hover:opacity-80 transition-opacity"
        >
          <img
            src="/icons/icon-192x192.png"
            alt="積み単ロゴ"
            className="w-16 h-16 mx-auto"
          />
        </Link>
      </div>

      <nav
        className={`
          flex justify-around px-2 py-2 max-w-screen-xl mx-auto
          /* PC (lg以上) のナビゲーションスタイル */
          lg:flex-col lg:justify-start lg:px-0 lg:py-4 lg:mx-0 lg:h-full lg:gap-1
        `}
      >
        {navItems.map(({ icon, label, path }) => {
          const isActive = location.pathname === path; // ◀️ 現在のパスとアイテムのパスを比較してactive状態を決定
          return (
            <Link
              key={label}
              to={path}
              className={`
              flex flex-1 flex-col items-center justify-end gap-0.5 py-1 group
              ${isActive ? 'text-blue-500' : 'text-slate-500 hover:text-blue-400 lg:hover:bg-slate-100 lg:hover:text-slate-700'}
              /* PC (lg以上) のリンクスタイル */
              lg:flex-row lg:items-center lg:justify-start lg:flex-none 
              lg:px-6 lg:py-3 lg:gap-3
            `}
            >
              <span
                className={`material-icons text-2xl lg:text-xl ${isActive ? 'lg:text-blue-500' : 'group-hover:lg:text-blue-500'}`}
              >
                {' '}
                {/* ◀️ PC時のアクティブなアイコン色 */}
                {icon}
              </span>
              <p className="text-[0.7rem] sm:text-xs font-medium tracking-wide lg:text-sm">
                {label}
              </p>
            </Link>
          );
        })}
      </nav>
      {/* モバイル用のセーフエリアはPCでは非表示 */}
      <div className="h-safe-area-bottom bg-slate-50 lg:hidden" />
    </footer>
  );
};

export default Footer;
