export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
}

export interface AuthFormProps {
  onSuccess?: () => void;
}

export interface AuthFormState {
  loading: boolean;
  error: string;
  resetEmailSent?: boolean;
}
