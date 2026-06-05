import { useState } from 'react';
import RoomCard from '../components/rooms/RoomCard';
import RoomFilters from '../components/rooms/RoomFilters';
import { useRooms } from '../hooks/useRooms';
import { formatInputDate } from '../utils/formatters';

export default function MeetingEventPage({ onRoomClick }) {
  const { rooms, loading, error, filters, updateFilter, resetFilters } = useRooms();
  const [selectedDate, setSelectedDate] = useState(formatInputDate(new Date()));
  const heroTitle = 'Temukan Ruangan Ideal Anda';
  const heroSub = 'Ratusan ruangan profesional siap mendukung acara dan produktivitas Anda';
  
  return (
    <main className="listing-page">
      <section className="listing-page__hero">
        <div className="listing-page__hero-inner">
          <h1 className="listing-page__hero-title">{heroTitle}</h1>
          <p className="listing-page__hero-sub">{heroSub}</p>
        </div>
      </section>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Memuat data ruangan...</div>
      ) : error ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Terjadi kesalahan: {error}</div>
      ) : (
        <div className="listing-page__body">
          <div className="listing-page__filters">
            <RoomFilters
              filters={filters}
              onUpdate={updateFilter}
              onReset={resetFilters}
            />
          </div>

          <div className="listing-page__results-header">
            <span className="listing-page__results-count">
              Menampilkan <strong>{rooms.length}</strong> ruangan
            </span>
          </div>

          <div className="listing-page__grid">
            {rooms.length === 0 ? (
              <div className="listing-page__empty">
                <div className="listing-page__empty-icon">🔍</div>
                <div className="listing-page__empty-title">
                  Tidak ada ruangan ditemukan
                </div>
                <div className="listing-page__empty-desc">
                  Coba ubah filter pencarian Anda
                </div>
              </div>
            ) : (
              rooms.map((room) => (
                <RoomCard key={room.id} room={room} onClick={onRoomClick} />
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}
