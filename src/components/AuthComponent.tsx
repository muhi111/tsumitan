import React, { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { linkWithCredential, EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth } from '../firebase/config';
import { authUserAtom } from '../atoms';

interface AuthComponentProps {
  mode: 'signin' | 'signup'; // サインインまたはサインアップ
  onSuccess?: () => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ mode, onSuccess }) => {
  const authUser = useAtomValue(authUserAtom);
  const uiRef = useRef<HTMLDivElement>(null);
  const uiInstance = useRef<firebaseui.auth.AuthUI | null>(null);

  useEffect(() => {
    if (!uiRef.current) return;

    // 既存のFirebaseUIインスタンスを取得または新規作成
    let ui;
    try {
      ui = firebaseui.auth.AuthUI.getInstance();
    } catch (error) {
      // インスタンスが存在しない場合は新規作成
      ui = new firebaseui.auth.AuthUI(auth);
    }
    
    // インスタンスが削除されている場合は新規作成
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(auth);
    }
    
    uiInstance.current = ui;

    // FirebaseUIの設定
    const uiConfig: firebaseui.auth.Config = {
      signInFlow: 'popup',
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
        GoogleAuthProvider.PROVIDER_ID,
      ],
      // アカウント選択ヘルパーを無効化
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      // サインイン成功時のURL設定を削除してコールバックに依存
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          // 匿名ユーザーがいる場合はアカウントをリンク（非同期処理）
          if (authUser && authUser.isAnonymous && authResult.credential) {
            linkWithCredential(auth.currentUser!, authResult.credential)
              .then(() => {
                console.log('匿名ユーザーのアップグレードが完了しました');
              })
              .catch((error) => {
                console.error('匿名ユーザーのアップグレードに失敗しました:', error);
              });
          }
          
          // 成功コールバックを実行
          if (onSuccess) {
            onSuccess();
          }
          return false; // リダイレクトを無効にする
        },
        uiShown: () => {
          // UIが表示されたときの処理
          console.log('FirebaseUI が表示されました');
        },
        signInFailure: (error) => {
          // サインインエラーの詳細ログ
          console.error('サインインエラー:', error);
          return Promise.resolve();
        },
      },
    };

    // UIを開始
    ui.start(uiRef.current, uiConfig);

    // クリーンアップ関数
    return () => {
      try {
        if (ui && !ui.isPendingRedirect()) {
          ui.reset();
        }
        uiInstance.current = null;
      } catch (error) {
        console.log('FirebaseUIクリーンアップ中にエラーが発生しました:', error);
      }
    };
  }, [mode, authUser, onSuccess]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'signup' ? 'アカウント作成' : 'サインイン'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'signup' 
            ? '新しいアカウントを作成して学習を始めましょう' 
            : 'アカウントにサインインしてください'
          }
        </p>
      </div>
      <div ref={uiRef}></div>
    </div>
  );
};

export default AuthComponent;
