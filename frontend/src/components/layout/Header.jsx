export default function Header({
  activePage,
  isLoggedIn,
  userRole,
  onNavigate,
  onLogout,
}) {
  const isAdmin = userRole === "admin";

  return (
    <header className="header">
      <div className="header__inner">
        <div
          className="header__logo"
          onClick={() => onNavigate("rooms")}
          style={{ cursor: "pointer" }}
        >
          <div className="header__logo-icon">Q</div>
          <span>Mero Quick</span>
        </div>

        <nav className="header__nav">
          {!isAdmin && (
            <button
              className={`header__nav-link${activePage === "rooms" ? " header__nav-link--active" : ""}`}
              onClick={() => onNavigate("rooms")}
            >
              Rooms
            </button>
          )}
          {isAdmin && (
            <button
              className={`header__nav-link${activePage === "register" ? " header__nav-link--active" : ""}`}
              onClick={() => onNavigate("register")}
            >
              Manage Rooms
            </button>
          )}
          {isLoggedIn && (
            <button
              className={`header__nav-link${activePage === "bookings" ? " header__nav-link--active" : ""}`}
              onClick={() => onNavigate("bookings")}
            >
              {isAdmin ? "Manage Booking" : "Booking"}
            </button>
          )}
        </nav>

        <div className="header__actions">
          {isLoggedIn ? (
            <>
              <div className="header__user">
                <div className="header__user-avatar">U</div>
                <span className="header__user-name">ini nama user</span>
              </div>
              <button
                className="header__btn header__btn--outline"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className={`header__btn header__btn--outline${activePage === "login" ? " header__btn--active" : ""}`}
                onClick={() => onNavigate("login")}
              >
                Login
              </button>
              <button
                className={`header__btn header__btn--primary${activePage === "signup" ? " header__btn--active" : ""}`}
                onClick={() => onNavigate("signup")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
