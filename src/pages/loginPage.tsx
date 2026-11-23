import Login from '@/features/auth/Login';

type LoginPageProps = {
  onLogin: (user: { usuario: string; password: string }) => Promise<void>;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  return <Login onLogin={onLogin} />;
}