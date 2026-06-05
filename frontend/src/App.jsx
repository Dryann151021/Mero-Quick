import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import MeetingEventPage from "./pages/MeetingEventPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import ManageRoomsPage from "./pages/ManageRoomsPage";
import BookingsPage from "./pages/BookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { BookingProvider } from "./contexts/BookingContext";
import { getUserRole, hasStoredSession, clearAuth } from "./utils/auth";
import { refreshAccessToken } from "./api/auth";

export default function App() {
    const [activePage, setActivePage] = useState(() => {
        return hasStoredSession() && getUserRole() === "admin" ? "register" : "rooms";
    });
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(() => hasStoredSession());
    const [userRole, setUserRole] = useState(() =>
        hasStoredSession() ? getUserRole() : null
    );
    const [authRedirect, setAuthRedirect] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        async function restoreSession() {
            if (!hasStoredSession()) return;

            if (!localStorage.getItem("refreshToken")) {
                clearAuth();
                setIsLoggedIn(false);
                setUserRole(null);
                return;
            }

            try {
                await refreshAccessToken();
                setIsLoggedIn(true);
                setUserRole(getUserRole());
            } catch {
                clearAuth();
                setIsLoggedIn(false);
                setUserRole(null);
                setActivePage("rooms");
            }
        }

        restoreSession();

        function handleSessionExpired() {
            setIsLoggedIn(false);
            setUserRole(null);
            setSelectedRoom(null);
            setActivePage("login");
            setAuthRedirect({
                intentLabel: "mengakses fitur",
                pendingAction: null,
                returnPage: "rooms",
            });
        }

        window.addEventListener("auth:session-expired", handleSessionExpired);
        return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
    }, []);

    function requireAuth(intentLabel, action) {
        if (isLoggedIn) {
            action();
        } else {
            setAuthRedirect({
                intentLabel,
                pendingAction: action,
                returnPage: activePage,
            });
            setActivePage("login");
            setSelectedRoom(null);
        }
    }

    function handleAuthSuccess() {
        setIsLoggedIn(true);
        const role = getUserRole();
        setUserRole(role);
        const pending = authRedirect?.pendingAction;
        let returnPage = authRedirect?.returnPage || "rooms";

        if (role === "admin") {
            returnPage = "register";
        }

        setAuthRedirect(null);
        pending?.();
        if (!pending) {
            setActivePage(returnPage);
        }
    }

    function handleNavigate(page) {
        if (page === "register") {
            requireAuth("mengelola ruangan", () => {
                if (getUserRole() !== "admin") {
                    alert("Akses ditolak: Hanya Admin yang dapat mengelola ruangan.");
                    return;
                }
                setActivePage("register");
                setSelectedRoom(null);
            });
        } else if (page === "bookings") {
            requireAuth("melihat booking", () => {
                setActivePage("bookings");
                setSelectedRoom(null);
            });
        } else if (page === "login" || page === "signup") {
            if (isLoggedIn) {
                setActivePage("rooms");
                setSelectedRoom(null);
                return;
            }
            setAuthRedirect(null);
            setActivePage(page);
            setSelectedRoom(null);
        } else {
            setActivePage(page);
            setSelectedRoom(null);
        }
    }

    function handleAuthSwitchMode(mode) {
        setActivePage(mode === "register" ? "signup" : "login");
    }

    function handleRoomClick(room) {
        requireAuth("memesan ruangan", () => {
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
        setActivePage("rooms");
        setShowLogoutConfirm(false);
    }

    function renderPage() {
        if (selectedRoom) {
            return <RoomDetailPage room={selectedRoom} onBack={handleBack} />;
        }

        if (activePage === "login") {
            return (
                <LoginPage
                    intentLabel={authRedirect?.intentLabel}
                    onSuccess={handleAuthSuccess}
                    onSwitchMode={handleAuthSwitchMode}
                />
            );
        }

        if (activePage === "signup") {
            return (
                <RegisterPage
                    intentLabel={authRedirect?.intentLabel}
                    onSuccess={handleAuthSuccess}
                    onSwitchMode={handleAuthSwitchMode}
                />
            );
        }

        if (activePage === "register") {
            return <ManageRoomsPage />;
        }

        if (activePage === "bookings") {
            return <BookingsPage />;
        }

        return <MeetingEventPage onRoomClick={handleRoomClick} />;
    }

    const isAuthPage = activePage === "login" || activePage === "signup";

    return (
        <BookingProvider>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                {!isAuthPage && (
                    <Header
                        activePage={activePage}
                        isLoggedIn={isLoggedIn}
                        userRole={userRole}
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                )}
                {renderPage()}
            </div>
            {showLogoutConfirm && (
                <div className="auth-modal-overlay">
                    <div className="auth-modal" style={{ maxWidth: "360px", textAlign: "center" }}>
                        <div className="auth-modal__body">
                            <h3 className="auth-modal__title">Anda akan keluar</h3>
                            <p className="auth-modal__subtitle">
                                Apakah Anda yakin ingin keluar dari akun Anda?
                            </p>
                            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                                <button
                                    type="button"
                                    className="header__btn header__btn--outline"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowLogoutConfirm(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    className="header__btn header__btn--primary"
                                    style={{ flex: 1 }}
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
