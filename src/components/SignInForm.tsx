import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import type React from 'react';
import { useState } from 'react';
import { auth } from '../firebase/config';
import type { AuthFormData, AuthFormProps, AuthFormState } from '../types/auth';
import { getFirebaseErrorMessage } from '../utils/authUtils';
import ErrorMessage from './auth/ErrorMessage';
import FormField from './auth/FormField';
import GoogleSignInButton from './auth/GoogleSignInButton';

const SignInForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<
    Pick<AuthFormData, 'email' | 'password'>
  >({
    email: '',
    password: ''
  });
  const [state, setState] = useState<
    AuthFormState & { resetEmailSent: boolean }
  >({
    loading: false,
    error: '',
    resetEmailSent: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setState((prev) => ({
        ...prev,
        error: 'メールアドレスとパスワードを入力してください'
      }));
      return false;
    }
    return true;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setState((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const errorMessage = getFirebaseErrorMessage(
        firebaseError.code || '',
        'signin'
      );
      setState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleGoogleSignIn = async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const errorMessage = getFirebaseErrorMessage(
        firebaseError.code || '',
        'signin'
      );
      setState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setState((prev) => ({
        ...prev,
        error: 'パスワードリセットには、まずメールアドレスを入力してください'
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setState((prev) => ({ ...prev, resetEmailSent: true }));
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const errorMessage = getFirebaseErrorMessage(
        firebaseError.code || '',
        'reset'
      );
      setState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">サインイン</h2>
        <p className="mt-2 text-sm text-gray-600">
          アカウントにサインインしてください
        </p>
      </div>

      {state.error && <ErrorMessage message={state.error} />}

      {state.resetEmailSent && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">
            パスワードリセットメールを送信しました。メールボックスをご確認ください。
          </p>
        </div>
      )}

      <form onSubmit={handleEmailSignIn} className="space-y-4">
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
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={state.loading}
            className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
          >
            パスワードを忘れた場合
          </button>
        </div>

        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {state.loading ? 'サインイン中...' : 'サインイン'}
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
          onClick={handleGoogleSignIn}
          disabled={state.loading}
        >
          Googleアカウントでサインイン
        </GoogleSignInButton>
      </div>
    </div>
  );
};

export default SignInForm;
