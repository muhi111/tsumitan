import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex-shrink-0 bg-slate-50/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center flex-shrink-0">
          <Link
            to="/home"
            className="block hover:opacity-80 transition-opacity"
          >
            <img
              src="/icons/icon-192x192.png"
              alt="積み単ロゴ"
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
