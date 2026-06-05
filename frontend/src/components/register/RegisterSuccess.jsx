export default function RegisterSuccess({ name, email, onReset }) {
    return (
        <div className="register-page__success">
            <div className="register-page__success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <div className="register-page__success-title">Pendaftaran Berhasil!</div>
            <div className="register-page__success-desc">
                Ruangan <strong>{name}</strong> berhasil didaftarkan. Tim kami akan meninjau dan menghubungi Anda melalui <strong>{email}</strong> dalam 1–2 hari kerja.
            </div>
            <button className="register-page__success-btn" onClick={onReset}>
                Daftarkan Ruangan Lain
            </button>
        </div>
    );
}
