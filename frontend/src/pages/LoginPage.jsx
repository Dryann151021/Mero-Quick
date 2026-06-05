import AuthForm from "../components/auth/AuthForm";

export default function LoginPage({ intentLabel, onSuccess, onSwitchMode }) {
  return (
    <main className="auth-page">
      <AuthForm
        mode="login"
        intentLabel={intentLabel}
        onSuccess={onSuccess}
        onSwitchMode={onSwitchMode}
      />
    </main>
  );
}
