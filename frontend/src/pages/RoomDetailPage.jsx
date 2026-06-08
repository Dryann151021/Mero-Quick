import { useState, useEffect } from 'react';
import AmenitiesList from '../components/rooms/AmenitiesList';
import BookingPanel from '../components/rooms/BookingPanel';
import BookingSchedule from '../components/rooms/BookingSchedule';
import RoomHeader from '../components/rooms/RoomHeader';
import RoomSpecs from '../components/rooms/RoomSpecs';
import RoomLocation from '../components/rooms/RoomLocation';
import RoomGallery from '../components/rooms/RoomGallery';
import { getRoomById } from '../api/rooms';
import { formatInputDate } from '../utils/formatters';

export default function RoomDetailPage({ room, onBack }) {
  const [selectedDate, setSelectedDate] = useState(formatInputDate(new Date()));
  const [roomBookings, setRoomBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoomDetails = () => {
    let isMounted = true;
    setLoading(true);
    getRoomById(room.id)
      .then((data) => {
        if (isMounted && data && data.bookings) {
          const formattedBookings = data.bookings.map((b) => ({
            id: b.id,
            roomId: room.id,
            roomName: room.name,
            startDate: b.start_date || b.booking_date.split('T')[0],
            endDate: b.end_date || b.booking_date.split('T')[0],
            startTime: b.start_time,
            endTime: b.end_time,
            activity: b.activity,
            organization: b.organization,
            user_email: b.user_email,
          }));
          setAllBookings(formattedBookings);
          setRoomBookings(
            formattedBookings.filter(
              (b) => selectedDate >= b.startDate && selectedDate <= b.endDate,
            ),
          );
        }
      })
      .catch((err) => console.error('Failed to fetch room details:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [room.id, selectedDate]);

  return (
    <main className="room-detail">
      <div className="room-detail__inner">
        <button className="room-detail__back" onClick={onBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke daftar
        </button>

        <RoomHeader room={room} />

        <div className="room-detail__gallery">
          {room.images ? (
            <RoomGallery images={[room.images]} name={room.name} />
          ) : (
            <div className="room-detail__no-image">No Image Available</div>
          )}
        </div>

        <div className="room-detail__content">
          <div className="room-detail__info">
            <section>
              <h2 className="room-detail__section-title">Deskripsi</h2>
              <p className="room-detail__description">{room.description}</p>
            </section>

            <section>
              <h2 className="room-detail__section-title">Detail Ruangan</h2>
              <RoomSpecs room={room} />
            </section>

            <section>
              <h2 className="room-detail__section-title">Fasilitas</h2>
              <AmenitiesList facilities={room.facilities} />
            </section>

            <section>
              <h2 className="room-detail__section-title">Kontak Admin</h2>
              <div className="admin-contact-card">
                <div className="admin-contact-card__details">
                  <div className="admin-contact-card__name">
                    {room.adminName || 'Admin Reservasi'}
                  </div>
                  <div className="admin-contact-card__info">
                    Email:{' '}
                    <a
                      href={`mailto:${room.adminEmail || 'admin@meroapp.com'}`}
                    >
                      {room.adminEmail || 'admin@meroapp.com'}
                    </a>
                  </div>
                  <div className="admin-contact-card__info">
                    Phone:{' '}
                    <a href={`tel:${room.adminPhone || '+6281234567890'}`}>
                      {room.adminPhone || '+62 812-3456-7890'}
                    </a>
                  </div>
                </div>
                <div className="admin-contact-card__note">
                  Hubungi admin jika kamu memerlukan bantuan pemesanan atau
                  konfirmasi.
                </div>
              </div>
            </section>

            <RoomLocation address={room.address} />
          </div>

          <div>
            <BookingPanel
              room={room}
              bookings={allBookings}
              onSuccess={fetchRoomDetails}
            />
            <div className="room-detail__booking-schedule">
              <BookingSchedule
                room={room}
                bookings={roomBookings}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
