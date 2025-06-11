import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { useSetAtom } from 'jotai';
import type React from 'react';
import { useEffect } from 'react';
import {
  type AuthUser,
  authErrorAtom,
  authLoadingAtom,
  authUserAtom
} from '../atoms';
import { auth } from '../firebase/config';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const setAuthUser = useSetAtom(authUserAtom);
  const setAuthLoading = useSetAtom(authLoadingAtom);
  const setAuthError = useSetAtom(authErrorAtom);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        setAuthLoading(true);
        setAuthError(null);

        // Firebase認証状態の監視を開始
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // ユーザーが認証済みの場合
            const authUser: AuthUser = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isAnonymous: user.isAnonymous
            };
            setAuthUser(authUser);
          } else {
            // ユーザーが未認証の場合、匿名認証を実行
            try {
              const result = await signInAnonymously(auth);
              const authUser: AuthUser = {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                isAnonymous: result.user.isAnonymous
              };
              setAuthUser(authUser);
            } catch (anonymousSignInError) {
              console.error('匿名認証エラー:', anonymousSignInError);
              setAuthError('匿名認証に失敗しました');
              setAuthUser(null);
            }
          }
          setAuthLoading(false);
        });
      } catch (error) {
        console.error('認証初期化エラー:', error);
        setAuthError('認証の初期化に失敗しました');
        setAuthLoading(false);
      }
    };

    initializeAuth();

    // クリーンアップ関数
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setAuthUser, setAuthLoading, setAuthError]);

  return <>{children}</>;
};

export default AuthProvider;
