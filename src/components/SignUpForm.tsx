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
import type { AuthFormData, AuthFormProps, AuthFormState } from '../types/auth';
import { getFirebaseErrorMessage } from '../utils/authUtils';
import ErrorMessage from './auth/ErrorMessage';
import FormField from './auth/FormField';
import GoogleSignInButton from './auth/GoogleSignInButton';

const SignUpForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const authUser = useAtomValue(authUserAtom);
  const setAuthUser = useSetAtom(authUserAtom);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [state, setState] = useState<AuthFormState>({
    loading: false,
    error: ''
  });

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
      setState((prev) => ({
        ...prev,
        error: 'すべてのフィールドを入力してください'
      }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setState((prev) => ({ ...prev, error: 'パスワードが一致しません' }));
      return false;
    }

    if (formData.password.length < 6) {
      setState((prev) => ({
        ...prev,
        error: 'パスワードは6文字以上で入力してください'
      }));
      return false;
    }

    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setState((prev) => ({ ...prev, loading: true, error: '' }));

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
      const firebaseError = error as { code?: string };
      const errorMessage = getFirebaseErrorMessage(
        firebaseError.code || '',
        'signup'
      );
      setState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleGoogleSignUp = async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));

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
      const firebaseError = error as { code?: string };
      const errorMessage = getFirebaseErrorMessage(
        firebaseError.code || '',
        'signup'
      );
      setState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
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

      {state.error && <ErrorMessage message={state.error} />}

      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <FormField
          id="displayName"
          name="displayName"
          type="text"
          label="表示名"
          value={formData.displayName || ''}
          onChange={handleChange}
          disabled={state.loading}
          required
        />

        <FormField
          id="email"
          name="email"
          type="email"
          label="メールアドレス"
          value={formData.email}
          onChange={handleChange}
          disabled={state.loading}
          required
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="パスワード"
          value={formData.password}
          onChange={handleChange}
          disabled={state.loading}
          required
          minLength={6}
        />

        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="パスワード確認"
          value={formData.confirmPassword || ''}
          onChange={handleChange}
          disabled={state.loading}
          required
        />

        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {state.loading ? 'アカウント作成中...' : 'アカウントを作成'}
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

        <GoogleSignInButton
          onClick={handleGoogleSignUp}
          disabled={state.loading}
        >
          Googleアカウントで登録
        </GoogleSignInButton>
      </div>
    </div>
  );
};

export default SignUpForm;
