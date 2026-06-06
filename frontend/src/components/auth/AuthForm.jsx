import { useState } from 'react';
import { apiClient } from '../../api/client';

export default function AuthForm({
  mode = 'login',
  intentLabel,
  onSuccess,
  onSwitchMode,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  const isRegister = mode === 'register';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isRegister && password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await apiClient('/users', {
          method: 'POST',
          data: {
            email: email,
            password: password,
            name: name,
            address: address,
            phoneNumber: phoneNumber,
          },
        });
        setShowConfirmRegister(true);
        return;
      }

      const res = await apiClient('/authentications', {
        method: 'POST',
        data: {
          email: email,
          password: password,
        },
      });

      if (res.data && res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        setShowLoginSuccess(true);
      } else {
        setError('Gagal mendapatkan token dari server.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="auth-modal">
        <div className="auth-modal__body">
          {intentLabel && (
            <div className="auth-modal__intent-note">
              <svg
                className="auth-modal__intent-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>
                Silakan masuk atau daftar terlebih dahulu untuk{' '}
                <strong>{intentLabel}</strong>.
              </span>
            </div>
          )}

          <div>
            <h2 className="auth-modal__title">
              {isRegister ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
            </h2>
            <p className="auth-modal__subtitle">
              {isRegister
                ? 'Daftar untuk mulai menggunakan Mero Quick'
                : 'Masuk ke akun Mero Anda'}
            </p>
          </div>

          {error && <div className="auth-modal__error">{error}</div>}

          <form
            onSubmit={handleSubmit}
            className="form-col"
          >
            {isRegister && (
              <div className="auth-modal__field">
                <label className="auth-modal__label">Nama Lengkap</label>
                <input
                  className="auth-modal__input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-modal__field">
              <label className="auth-modal__label">Email</label>
              <input
                className="auth-modal__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {isRegister && (
              <div className="auth-modal__field">
                <label className="auth-modal__label">Alamat</label>
                <input
                  className="auth-modal__input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            )}

            {isRegister && (
              <div className="auth-modal__field">
                <label className="auth-modal__label">Nomor Telepon</label>
                <input
                  className="auth-modal__input"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-modal__field">
              <label className="auth-modal__label">Password</label>
              <input
                className="auth-modal__input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isRegister && (
              <div className="auth-modal__field">
                <label className="auth-modal__label">Konfirmasi Password</label>
                <input
                  className="auth-modal__input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              className="btn-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? isRegister
                  ? 'Mendaftar...'
                  : 'Masuk...'
                : isRegister
                  ? 'Buat Akun'
                  : 'Masuk'}
            </button>
          </form>

          <p className="auth-modal__footer">
            {isRegister ? (
              <>
                Sudah punya akun?{' '}
                <button
                  className="auth-modal__footer-link"
                  type="button"
                  onClick={() => onSwitchMode('login')}
                >
                  Masuk
                </button>
              </>
            ) : (
              <>
                Belum punya akun?{' '}
                <button
                  className="auth-modal__footer-link"
                  type="button"
                  onClick={() => onSwitchMode('register')}
                >
                  Daftar sekarang
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {showConfirmRegister && (
        <div className="auth-modal-overlay">
          <div className="auth-modal modal--sm">
            <div className="auth-modal__body">
              <h3 className="auth-modal__title">Apakah yakin?</h3>
              <p className="auth-modal__subtitle">
                Apakah Anda yakin data yang dimasukkan sudah benar dan ingin
                melanjutkan ke halaman login?
              </p>
              <div className="modal__actions">
                <button
                  type="button"
                  className="header__btn header__btn--outline"
                  onClick={() => setShowConfirmRegister(false)}
                >
                  Tidak
                </button>
                <button
                  type="button"
                  className="header__btn header__btn--primary"
                  onClick={() => {
                    setShowConfirmRegister(false);
                    onSwitchMode('login');
                  }}
                >
                  Iya
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoginSuccess && (
        <div className="auth-modal-overlay">
          <div className="auth-modal modal--sm">
            <div className="auth-modal__body">
              <div className="success-icon">
                ✓
              </div>
              <h3 className="auth-modal__title">Login Berhasil</h3>
              <p className="auth-modal__subtitle">
                Selamat datang kembali di Mero Quick!
              </p>
              <button
                type="button"
                className="header__btn header__btn--primary w-full mt-4"
                onClick={() => {
                  setShowLoginSuccess(false);
                  onSuccess();
                }}
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
