type NavItem = {
  icon: string;
  label: string;
  active?: boolean;
};

  //MUIIcons
const navItems: NavItem[] = [    
  { icon: 'home', label: 'Home' },
  { icon: 'school', label: 'Learn' },
  { icon: 'import_contacts', label: 'Dictionary', active: true },
  { icon: 'person_outline', label: 'Profile' },
];

const Footer = () => {
  return (
      <footer
      className={`
        z-50 /* 他の要素より手前に表示 */
        
        
        /* --- モバイル (デフォルト) のスタイル: フッター --- */
        
        w-full sticky bottom-0 
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
      {/* PCサイドバー時に表示するロゴやタイトル（任意） */}
      <div className="hidden lg:block p-4 border-b border-slate-200 text-center">
        <h1 className="text-xl  text-slate-700" >積み単</h1> 
      </div>

      <nav
        className={`
          flex justify-around px-2 py-2 max-w-screen-xl mx-auto
          /* PC (lg以上) のナビゲーションスタイル */
          lg:flex-col lg:justify-start lg:px-0 lg:py-4 lg:mx-0 lg:h-full lg:gap-1
        `}
      >
        {navItems.map(({ icon, label, active }) => (
          <a
            key={label}
            className={`
              flex flex-1 flex-col items-center justify-end gap-0.5 py-1 group
              ${active ? 'text-blue-500' : 'text-slate-500 hover:text-blue-400 lg:hover:bg-slate-100 lg:hover:text-slate-700'}
              /* PC (lg以上) のリンクスタイル */
              lg:flex-row lg:items-center lg:justify-start lg:flex-none 
              lg:px-6 lg:py-3 lg:gap-3
            `}
            href="#" // 適切なパスに変更してください
          >
            <span className="material-icons text-2xl lg:text-xl group-hover:lg:text-blue-500">{icon}</span>
            <p className="text-[0.7rem] sm:text-xs font-medium tracking-wide lg:text-sm">
              {label}
            </p>
          </a>
        ))}
      </nav>
      {/* モバイル用のセーフエリアはPCでは非表示 */}
      <div className="h-safe-area-bottom bg-slate-50 lg:hidden" />
    </footer>
  );
};

export default Footer;
