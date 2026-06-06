import { useState, useEffect } from 'react';
import { getMyBookings, getAdminBookings, updateBookingStatus } from '../api/bookings';
import { formatCurrency, formatDateShort } from '../utils/formatters';
import { getUserRole } from '../utils/auth';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'history'
  const [currentBookings, setCurrentBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const role = getUserRole();
  const isAdmin = role === 'admin';

  const fetchBookings = () => {
    setLoading(true);
    setError(null);
    const fetchFn = isAdmin ? getAdminBookings : getMyBookings;
    
    fetchFn()
      .then((data) => {
        setCurrentBookings(data.currentBookings || []);
        setHistoryBookings(data.historyBookings || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Gagal memuat data booking');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [isAdmin]);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      fetchBookings(); // Refresh list after update
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Gagal mengubah status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted': return 'status-badge--success';
      case 'rejected': return 'status-badge--danger';
      case 'pending': default: return 'status-badge--warning';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      case 'pending': default: return 'Menunggu Konfirmasi';
    }
  };

  const bookingsToDisplay = activeTab === 'current' ? currentBookings : historyBookings;

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {isAdmin ? 'Dashboard Admin: Kelola Booking' : 'Booking Saya'}
        </h1>
        <p className="page-subtitle">
          {isAdmin ? 'Terima atau tolak pemesanan ruangan dari pengguna' : 'Lihat status pemesanan ruangan Anda'}
        </p>
      </div>

      <div className="bookings-page__tabs">
        <button
          className={`bookings-page__tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Booking Aktif
        </button>
        <button
          className={`bookings-page__tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Riwayat Booking
        </button>
      </div>

      {loading ? (
        <div className="state-loading">Memuat data...</div>
      ) : error ? (
        <div className="state-error">{error}</div>
      ) : bookingsToDisplay.length === 0 ? (
        <div className="state-empty">
          <div className="state-empty__icon">📝</div>
          <h3 className="state-empty__title">Belum ada data</h3>
          <p className="state-empty__desc">Tidak ada booking di tab ini.</p>
        </div>
      ) : (
        <div className="bookings-page__list">
          {bookingsToDisplay.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card__info">
                <div className="booking-card__name-row">
                  <h3 className="booking-card__name">{booking.room_name}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
                
                <div className="booking-card__details">
                  <div>
                    <p className="booking-card__detail-label">Waktu Pelaksanaan</p>
                    <p className="booking-card__detail-value">
                      {formatDateShort(new Date(booking.booking_date))} • {booking.start_time} - {booking.end_time}
                    </p>
                  </div>
                  <div>
                    <p className="booking-card__detail-label">Kegiatan</p>
                    <p className="booking-card__detail-value">{booking.activity}</p>
                  </div>
                  <div>
                    <p className="booking-card__detail-label">Organisasi</p>
                    <p className="booking-card__detail-value">{booking.organization}</p>
                  </div>
                  {isAdmin && (
                    <div>
                      <p className="booking-card__detail-label">Pemesan</p>
                      <p className="booking-card__detail-value">{booking.user_email}</p>
                    </div>
                  )}
                </div>
              </div>

              {isAdmin && booking.status === 'pending' && activeTab === 'current' && (
                <div className="booking-card__actions">
                  <button 
                    onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                    className="booking-card__btn booking-card__btn--reject"
                  >
                    Tolak
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(booking.id, 'accepted')}
                    className="booking-card__btn booking-card__btn--accept"
                  >
                    Terima
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
