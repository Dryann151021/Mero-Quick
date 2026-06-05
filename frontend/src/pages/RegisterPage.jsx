import AuthForm from "../components/auth/AuthForm";

export default function RegisterPage({ intentLabel, onSuccess, onSwitchMode }) {
  return (
    <main className="auth-page">
      <AuthForm
        mode="register"
        intentLabel={intentLabel}
        onSuccess={onSuccess}
        onSwitchMode={onSwitchMode}
      />
    </main>
  );
}
