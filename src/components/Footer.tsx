import { Link, useLocation } from 'react-router-dom';

type NavItem = {
  icon: string;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { icon: 'home', label: 'Home', path: '/home' },
  { icon: 'school', label: 'Learn', path: '/learn' },
  { icon: 'person_outline', label: 'Profile', path: '/profile' }
];

// デスクトップサイドバー用のコンポーネント
export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="h-full bg-slate-50 flex flex-col">
      <nav className="flex flex-col p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map(({ icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors flex-shrink-0
                ${
                  isActive
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <span className="material-icons text-xl">{icon}</span>
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

// モバイルフッター用のコンポーネント
const Footer = () => {
  const location = useLocation();

  return (
    <footer className="flex-shrink-0 bg-slate-50/80 backdrop-blur-sm border-t border-slate-200">
      <nav className="flex justify-around px-2 py-3 max-w-screen-xl mx-auto">
        {navItems.map(({ icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`
                flex flex-1 flex-col items-center justify-center gap-1 py-2
                ${isActive ? 'text-blue-500' : 'text-slate-500 hover:text-blue-400'}
              `}
            >
              <span className="material-icons text-xl">{icon}</span>
              <p className="text-[0.65rem] font-medium tracking-wide">
                {label}
              </p>
            </Link>
          );
        })}
      </nav>
      <div className="h-safe-area-bottom bg-slate-50 min-h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
};

export default Footer;
