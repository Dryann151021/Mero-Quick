import { useState } from 'react';

export default function Header({
  activePage,
  isLoggedIn,
  userRole,
  userName,
  onNavigate,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = userRole === 'admin';
  const greeting = isAdmin ? 'Hai, Admin!' : `Hai, ${userName}!`;

  const navLinks = [
    !isAdmin && {
      label: 'Home',
      page: 'rooms',
    },
    isAdmin && {
      label: 'Manage Rooms',
      page: 'register',
    },
    isLoggedIn && {
      label: isAdmin ? 'Manage Booking' : 'Booking',
      page: 'bookings',
    },
  ].filter(Boolean);

  const authButtons = isLoggedIn ? (
    <button
      className="header__btn header__btn--danger"
      onClick={() => {
        setMenuOpen(false);
        onLogout();
      }}
    >
      Logout
    </button>
  ) : (
    <>
      <button
        className={`header__btn header__btn--outline${activePage === 'login' ? ' header__btn--active' : ''}`}
        onClick={() => {
          setMenuOpen(false);
          onNavigate('login');
        }}
      >
        Login
      </button>
      <button
        className={`header__btn header__btn--primary${activePage === 'signup' ? ' header__btn--active' : ''}`}
        onClick={() => {
          setMenuOpen(false);
          onNavigate('signup');
        }}
      >
        Register
      </button>
    </>
  );

  const handleNavigate = (page) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand-group">
          <button
            className="header__mobile-toggle"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="header__mobile-toggle-icon" />
          </button>

          <div
            className="header__logo"
            onClick={() => handleNavigate('rooms')}
          >
            <div className="header__logo-icon">Q</div>
            <span>Mero Quick</span>
          </div>
        </div>

        <nav className="header__nav">
          {navLinks.map((link) => (
            <button
              key={link.page}
              className={`header__nav-link${activePage === link.page ? ' header__nav-link--active' : ''}`}
              onClick={() => handleNavigate(link.page)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="header__actions">
          {isLoggedIn && (
            <div className="header__user">
              <div className="header__user-avatar">
                {isAdmin ? 'A' : userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="header__user-name">{greeting}</span>
            </div>
          )}
          <div className="header__action-buttons">{authButtons}</div>
        </div>
      </div>

      <div
        className={`header__mobile-menu${menuOpen ? ' header__mobile-menu--open' : ''}`}
      >
        <div className="header__mobile-links">
          {navLinks.map((link) => (
            <button
              key={link.page}
              className={`header__nav-link${activePage === link.page ? ' header__nav-link--active' : ''}`}
              onClick={() => handleNavigate(link.page)}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="header__mobile-actions">
          {isLoggedIn ? (
            <button
              className="header__btn header__btn--danger"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className={`header__btn header__btn--outline${activePage === 'login' ? ' header__btn--active' : ''}`}
                onClick={() => handleNavigate('login')}
              >
                Login
              </button>
              <button
                className={`header__btn header__btn--primary${activePage === 'signup' ? ' header__btn--active' : ''}`}
                onClick={() => handleNavigate('signup')}
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
