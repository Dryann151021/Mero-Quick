import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import MeetingEventPage from './pages/MeetingEventPage';
import RoomDetailPage from './pages/RoomDetailPage';
import ManageRoomsPage from './pages/ManageRoomsPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/not-found';
import { BookingProvider } from './contexts/BookingContext';
import {
  getUserRole,
  getUserName,
  hasStoredSession,
  clearAuth,
} from './utils/auth';
import { refreshAccessToken } from './api/auth';

export default function App() {
  const routeNames = [
    'rooms',
    'login',
    'signup',
    'register',
    'bookings',
    'not-found',
  ];

  function getPageFromHash(hash) {
    const page = hash?.replace(/^#/, '').toLowerCase();
    if (!page) return null;
    return routeNames.includes(page) ? page : 'not-found';
  }

  function getDefaultPage() {
    return hasStoredSession() && getUserRole() === 'admin'
      ? 'register'
      : 'rooms';
  }

  function setPage(page) {
    const normalizedPage = routeNames.includes(page) ? page : 'not-found';
    if (window.location.hash.slice(1) !== normalizedPage) {
      window.location.hash = normalizedPage;
    }
    setActivePage(normalizedPage);
  }

  const [activePage, setActivePage] = useState(() => {
    const route = getPageFromHash(window.location.hash);
    return route ?? getDefaultPage();
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => hasStoredSession());
  const [userRole, setUserRole] = useState(() =>
    hasStoredSession() ? getUserRole() : null,
  );
  const [userName, setUserName] = useState(() =>
    hasStoredSession() ? getUserName() : null,
  );
  const [authRedirect, setAuthRedirect] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      if (!hasStoredSession()) return;

      if (!localStorage.getItem('refreshToken')) {
        clearAuth();
        setIsLoggedIn(false);
        setUserRole(null);
        return;
      }

      try {
        await refreshAccessToken();
        setIsLoggedIn(true);
        setUserRole(getUserRole());
        setUserName(getUserName());
      } catch {
        clearAuth();
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName(null);
        setPage('rooms');
      }
    }

    restoreSession();

    function handleSessionExpired() {
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName(null);
      setSelectedRoom(null);
      setPage('login');
      setAuthRedirect({
        intentLabel: 'mengakses fitur',
        pendingAction: null,
        returnPage: 'rooms',
      });
    }

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () =>
      window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  useEffect(() => {
    function handleHashChange() {
      const route = getPageFromHash(window.location.hash);
      if (!route) {
        const defaultPage = getDefaultPage();
        window.location.hash = defaultPage;
        setActivePage(defaultPage);
        setSelectedRoom(null);
        return;
      }

      if (route === 'register') {
        if (!isLoggedIn) {
          setAuthRedirect({
            intentLabel: 'mengelola ruangan',
            pendingAction: () => setPage('register'),
            returnPage: 'rooms',
          });
          setPage('login');
          setSelectedRoom(null);
          return;
        }
        if (getUserRole() !== 'admin') {
          alert('Akses ditolak: Hanya Admin yang dapat mengelola ruangan.');
          setPage('rooms');
          return;
        }
      }

      if (route === 'bookings' && !isLoggedIn) {
        setAuthRedirect({
          intentLabel: 'melihat booking',
          pendingAction: () => setPage('bookings'),
          returnPage: 'rooms',
        });
        setPage('login');
        setSelectedRoom(null);
        return;
      }

      if ((route === 'login' || route === 'signup') && isLoggedIn) {
        setPage('rooms');
        setSelectedRoom(null);
        return;
      }

      setActivePage(route);
      setSelectedRoom(null);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn]);

  function requireAuth(intentLabel, action) {
    if (isLoggedIn) {
      action();
    } else {
      setAuthRedirect({
        intentLabel,
        pendingAction: action,
        returnPage: activePage,
      });
      setPage('login');
      setSelectedRoom(null);
    }
  }

  function handleAuthSuccess() {
    setIsLoggedIn(true);
    const role = getUserRole();
    setUserName(getUserName());
    setUserRole(role);
    const pending = authRedirect?.pendingAction;
    let returnPage = authRedirect?.returnPage || 'rooms';

    if (role === 'admin') {
      returnPage = 'register';
    }

    setAuthRedirect(null);
    pending?.();
    if (!pending) {
      setPage(returnPage);
    }
  }

  function handleNavigate(page) {
    if (page === 'register') {
      requireAuth('mengelola ruangan', () => {
        if (getUserRole() !== 'admin') {
          alert('Akses ditolak: Hanya Admin yang dapat mengelola ruangan.');
          return;
        }
        setPage('register');
        setSelectedRoom(null);
      });
    } else if (page === 'bookings') {
      requireAuth('melihat booking', () => {
        setPage('bookings');
        setSelectedRoom(null);
      });
    } else if (page === 'login' || page === 'signup') {
      if (isLoggedIn) {
        setPage('rooms');
        setSelectedRoom(null);
        return;
      }
      setAuthRedirect(null);
      setPage(page);
      setSelectedRoom(null);
    } else {
      setPage(page);
      setSelectedRoom(null);
    }
  }

  function handleAuthSwitchMode(mode) {
    setPage(mode === 'register' ? 'signup' : 'login');
  }

  function handleRoomClick(room) {
    requireAuth('memesan ruangan', () => {
      setSelectedRoom(room);
    });
  }

  function handleBack() {
    setSelectedRoom(null);
  }

  function handleLogout() {
    setShowLogoutConfirm(true);
  }

  function confirmLogout() {
    clearAuth();
    setIsLoggedIn(false);
    setUserRole(null);
    setSelectedRoom(null);
    setAuthRedirect(null);
    setPage('rooms');
    setShowLogoutConfirm(false);
  }

  function renderPage() {
    if (selectedRoom) {
      return <RoomDetailPage room={selectedRoom} onBack={handleBack} />;
    }

    if (activePage === 'login') {
      return (
        <LoginPage
          intentLabel={authRedirect?.intentLabel}
          onSuccess={handleAuthSuccess}
          onSwitchMode={handleAuthSwitchMode}
        />
      );
    }

    if (activePage === 'signup') {
      return (
        <RegisterPage
          intentLabel={authRedirect?.intentLabel}
          onSuccess={handleAuthSuccess}
          onSwitchMode={handleAuthSwitchMode}
        />
      );
    }

    if (activePage === 'register') {
      return <ManageRoomsPage />;
    }

    if (activePage === 'bookings') {
      return <BookingsPage />;
    }

    if (activePage === 'not-found') {
      return <NotFound />;
    }

    return <MeetingEventPage onRoomClick={handleRoomClick} />;
  }

  const isAuthPage = activePage === 'login' || activePage === 'signup';

  return (
    <BookingProvider>
      <div className="app-wrapper">
        {!isAuthPage && (
          <Header
            activePage={activePage}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            userName={userName}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}
        {renderPage()}
      </div>
      {showLogoutConfirm && (
        <div className="auth-modal-overlay">
          <div className="auth-modal modal--sm">
            <div className="auth-modal__body">
              <h3 className="auth-modal__title">Anda akan keluar</h3>
              <p className="auth-modal__subtitle">
                Apakah Anda yakin ingin keluar dari akun Anda?
              </p>
              <div className="modal__actions">
                <button
                  type="button"
                  className="header__btn header__btn--outline header__btn--danger"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="header__btn header__btn--danger"
                  onClick={confirmLogout}
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BookingProvider>
  );
}
