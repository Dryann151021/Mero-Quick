export default function RoomLocation({ address }) {
    return (
        <section>
            <h2 className="room-detail__section-title">Lokasi</h2>
            <p
                className="room-detail__description"
                style={{ marginBottom: 12 }}
            >
                {address}
            </p>
            <div className="room-detail__map-placeholder">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                Peta lokasi
            </div>
        </section>
    );
}
