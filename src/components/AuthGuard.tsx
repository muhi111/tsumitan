import { useAtomValue } from 'jotai';
import type React from 'react';
import { Navigate } from 'react-router-dom';
import { authLoadingAtom, authUserAtom } from '../atoms';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // trueの場合は認証が必要、falseの場合は匿名でもOK
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  redirectTo = '/auth'
}) => {
  const authUser = useAtomValue(authUserAtom);
  const authLoading = useAtomValue(authLoadingAtom);

  // ローディング中の場合
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証が必要で、ユーザーが未認証または匿名ユーザーの場合
  if (requireAuth && (!authUser || authUser.isAnonymous)) {
    return <Navigate to={redirectTo} replace />;
  }

  // 条件を満たしている場合、子コンポーネントを表示
  return <>{children}</>;
};

export default AuthGuard;
