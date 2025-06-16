import { signOut } from 'firebase/auth';
import { useAtomValue } from 'jotai';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { authUserAtom } from '../atoms';
import { LAYOUT_CONSTANTS } from '../constants/layout';
import { auth } from '../firebase/config';

const Header = () => {
  const authUser = useAtomValue(authUserAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // ProfilePageとAuthPageでは認証ボタンを非表示
  const showAuthButtons = !['/profile', '/auth'].includes(location.pathname);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/home');
    } catch (error) {
      console.error('サインアウトエラー:', error);
    }
  };

  const handleAuthAction = () => {
    navigate('/auth');
  };

  return (
    <header
      className={`sticky top-0 z-[${LAYOUT_CONSTANTS.Z_INDEX.HEADER}] flex-shrink-0 bg-slate-50/80 backdrop-blur-sm shadow-sm border-b border-slate-200`}
    >
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
          </Link>{' '}
        </div>

        {/* 認証ボタン - ProfilePage以外で表示 */}
        {showAuthButtons && (
          <div className="flex items-center space-x-2 ml-auto">
            {authUser && !authUser.isAnonymous ? (
              <div className="flex items-center space-x-2">
                {authUser.photoURL ? (
                  <img
                    src={authUser.photoURL}
                    alt="プロフィール"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {authUser.displayName?.charAt(0) ||
                        authUser.email?.charAt(0) ||
                        'U'}
                    </span>
                  </div>
                )}
                <span className="text-sm text-slate-700 hidden sm:block">
                  {authUser.displayName || authUser.email}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-sm text-slate-600 hover:text-slate-800 px-3 py-1 rounded-md hover:bg-slate-100"
                >
                  サインアウト
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAuthAction}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                サインイン
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
