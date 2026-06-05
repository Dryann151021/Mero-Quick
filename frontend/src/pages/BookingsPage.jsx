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
    <main className="bookings-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div className="bookings-page__header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
          {isAdmin ? 'Dashboard Admin: Kelola Booking' : 'Booking Saya'}
        </h1>
        <p style={{ color: '#64748b' }}>
          {isAdmin ? 'Terima atau tolak pemesanan ruangan dari pengguna' : 'Lihat status pemesanan ruangan Anda'}
        </p>
      </div>

      <div className="bookings-page__tabs" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <button
          className={`bookings-page__tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
          style={{ padding: '12px 24px', borderBottom: activeTab === 'current' ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === 'current' ? '#2563eb' : '#64748b', fontWeight: '500', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
        >
          Booking Aktif
        </button>
        <button
          className={`bookings-page__tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          style={{ padding: '12px 24px', borderBottom: activeTab === 'history' ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === 'history' ? '#2563eb' : '#64748b', fontWeight: '500', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
        >
          Riwayat Booking
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Memuat data...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>
      ) : bookingsToDisplay.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📝</div>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '8px' }}>Belum ada data</h3>
          <p style={{ color: '#64748b' }}>Tidak ada booking di tab ini.</p>
        </div>
      ) : (
        <div className="bookings-page__list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookingsToDisplay.map((booking) => (
            <div key={booking.id} className="booking-card" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="booking-card__info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{booking.room_name}</h3>
                  <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '500', 
                    backgroundColor: booking.status === 'accepted' ? '#dcfce7' : booking.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                    color: booking.status === 'accepted' ? '#166534' : booking.status === 'rejected' ? '#991b1b' : '#854d0e'
                  }}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 4px 0' }}>Waktu Pelaksanaan</p>
                    <p style={{ fontWeight: '500', color: '#0f172a', margin: 0 }}>
                      {formatDateShort(new Date(booking.booking_date))} • {booking.start_time} - {booking.end_time}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 4px 0' }}>Kegiatan</p>
                    <p style={{ fontWeight: '500', color: '#0f172a', margin: 0 }}>{booking.activity}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 4px 0' }}>Organisasi</p>
                    <p style={{ fontWeight: '500', color: '#0f172a', margin: 0 }}>{booking.organization}</p>
                  </div>
                  {isAdmin && (
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 4px 0' }}>Pemesan</p>
                      <p style={{ fontWeight: '500', color: '#0f172a', margin: 0 }}>{booking.user_email}</p>
                    </div>
                  )}
                </div>
              </div>

              {isAdmin && booking.status === 'pending' && activeTab === 'current' && (
                <div className="booking-card__actions" style={{ display: 'flex', gap: '12px', marginLeft: '24px' }}>
                  <button 
                    onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                    style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    Tolak
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(booking.id, 'accepted')}
                    style={{ padding: '8px 16px', backgroundColor: '#2563eb', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
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
