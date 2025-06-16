export const getFirebaseErrorMessage = (
  errorCode: string,
  context: 'signin' | 'signup' | 'reset'
): string => {
  const commonErrors: Record<string, string> = {
    'auth/invalid-email': '無効なメールアドレスです',
    'auth/user-disabled': 'このアカウントは無効になっています',
    'auth/too-many-requests':
      'ログイン試行回数が多すぎます。しばらく待ってから再試行してください'
  };

  const signinErrors: Record<string, string> = {
    'auth/user-not-found': 'このメールアドレスは登録されていません',
    'auth/wrong-password': 'パスワードが正しくありません'
  };

  const signupErrors: Record<string, string> = {
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/weak-password': 'パスワードが弱すぎます',
    'auth/credential-already-in-use':
      'このGoogleアカウントは既に別のアカウントで使用されています'
  };

  const googleErrors: Record<string, string> = {
    'auth/account-exists-with-different-credential':
      'このメールアドレスは別の方法で既に登録されています',
    'auth/popup-closed-by-user': 'ポップアップがキャンセルされました',
    'auth/popup-blocked':
      'ポップアップがブロックされました。ポップアップを許可してください',
    'auth/cancelled-popup-request': '認証がキャンセルされました',
    'auth/operation-not-allowed': 'Google認証が有効になっていません'
  };

  const resetErrors: Record<string, string> = {
    'auth/user-not-found': 'このメールアドレスは登録されていません'
  };

  // Check common errors first
  if (commonErrors[errorCode]) {
    return commonErrors[errorCode];
  }

  // Check Google-specific errors
  if (googleErrors[errorCode]) {
    return googleErrors[errorCode];
  }

  // Check context-specific errors
  switch (context) {
    case 'signin':
      return signinErrors[errorCode] || 'サインインに失敗しました';
    case 'signup':
      return signupErrors[errorCode] || 'アカウント作成に失敗しました';
    case 'reset':
      return (
        resetErrors[errorCode] || 'パスワードリセットメールの送信に失敗しました'
      );
    default:
      return '認証エラーが発生しました';
  }
};
