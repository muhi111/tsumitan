import {
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  updateProfile
} from 'firebase/auth';
import { useAtomValue, useSetAtom } from 'jotai';
import type React from 'react';
import { useState } from 'react';
import { type AuthUser, authUserAtom } from '../atoms';
import { auth } from '../firebase/config';

interface SignUpFormProps {
  onSuccess?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const authUser = useAtomValue(authUserAtom);
  const setAuthUser = useSetAtom(authUserAtom);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 認証状態を即座に更新する関数
  const updateAuthState = () => {
    if (auth.currentUser) {
      const updatedUser: AuthUser = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        isAnonymous: auth.currentUser.isAnonymous
      };
      setAuthUser(updatedUser);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.displayName) {
      setError('すべてのフィールドを入力してください');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return false;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return false;
    }

    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // 匿名ユーザーをメール/パスワードアカウントにアップグレード
      if (!authUser || !authUser.isAnonymous || !auth.currentUser) {
        throw new Error('匿名ユーザーが見つかりません');
      }

      const credential = EmailAuthProvider.credential(
        formData.email,
        formData.password
      );
      await linkWithCredential(auth.currentUser, credential);

      // 表示名を更新
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName
      });

      // 認証状態を即座に更新
      updateAuthState();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      let errorMessage = 'アカウント作成に失敗しました';

      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'このメールアドレスは既に使用されています';
          break;
        case 'auth/invalid-email':
          errorMessage = '無効なメールアドレスです';
          break;
        case 'auth/weak-password':
          errorMessage = 'パスワードが弱すぎます';
          break;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      // 匿名ユーザーをGoogleアカウントにアップグレード
      if (!authUser || !authUser.isAnonymous || !auth.currentUser) {
        throw new Error('匿名ユーザーが見つかりません');
      }

      const provider = new GoogleAuthProvider();

      // Firebase公式ドキュメントに基づく正しい実装
      // 匿名ユーザーをGoogleアカウントとリンク
      const result = await linkWithPopup(auth.currentUser, provider);

      // リンク成功後、ユーザー情報を取得
      const user = result.user;
      console.log(
        '匿名アカウントがGoogleアカウントに正常にリンクされました:',
        user
      );

      // 認証状態を即座に更新
      updateAuthState();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      let errorMessage = 'Googleアカウントでの登録に失敗しました';

      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case 'auth/credential-already-in-use':
          errorMessage =
            'このGoogleアカウントは既に別のアカウントで使用されています';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'このメールアドレスは別の方法で既に登録されています';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'ポップアップがキャンセルされました';
          break;
        case 'auth/popup-blocked':
          errorMessage =
            'ポップアップがブロックされました。ポップアップを許可してください';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = '認証がキャンセルされました';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google認証が有効になっていません';
          break;
        default:
          console.error('Google認証エラー:', error);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">アカウント作成</h2>
        <p className="mt-2 text-sm text-gray-600">
          新しいアカウントを作成して学習を始めましょう
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            表示名
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
            minLength={6}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            パスワード確認
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'アカウント作成中...' : 'アカウントを作成'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">または</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-label="Google">
            <title>Google</title>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Googleアカウントで登録
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
