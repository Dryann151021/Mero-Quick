import { useState, useEffect } from "react";
import {
  formatCurrency,
  calcDuration,
  generateTimeOptions,
} from "../../utils/formatters";
import { useBooking } from "../../hooks/useBooking";

export default function BookingPanel({ room, bookings = [], onSuccess }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [activity, setActivity] = useState("");
  const [organization, setOrganization] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [localError, setLocalError] = useState("");

  const { status, errorMsg, computePrice, submitBooking, reset } =
    useBooking(room);

  const timeOptions = generateTimeOptions(
    room.operationalHours.open,
    room.operationalHours.close,
  );
  const hours = calcDuration(startTime, endTime);
  const totalPrice = computePrice(startTime, endTime);

  useEffect(() => {
    setLocalError("");
  }, [date, startTime, endTime, activity, organization]);

  async function handleBook() {
    if (!activity.trim() || !organization.trim()) {
      setLocalError("Harap isi nama kegiatan dan institusi.");
      return;
    }

    // Front-end conflict check
    const conflict = bookings.some((b) => {
      if (b.date !== date) return false;
      return startTime < b.endTime && endTime > b.startTime;
    });

    if (conflict) {
      setLocalError("Jadwal bentrok dengan pemesanan lain pada tanggal dan jam tersebut.");
      return;
    }

    setLocalError("");
    setShowConfirmModal(true);
  }

  async function executeBooking() {
    const success = await submitBooking({
      date,
      startTime,
      endTime,
      activity,
      organization,
    });
    if (!success) return;
    if (onSuccess) {
      onSuccess();
    }
  }

  if (status === "success") {
    return (
      <div className="booking-panel">
        <div className="booking-panel__success">
          <div className="booking-panel__success-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="booking-panel__success-title">
            Pemesanan Berhasil!
          </div>
          <div className="booking-panel__success-desc">
            {room.name} telah dipesan untuk {date} pukul {startTime}–{endTime}.
            <br />
            Konfirmasi akan dikirim ke email Anda.
          </div>
          <button className="booking-panel__success-btn" onClick={reset}>
            Pesan Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-panel">
      <div>
        <div className="booking-panel__price-header">
          <span className="booking-panel__price-amount">
            {formatCurrency(room.pricePerHour)}
          </span>
          <span className="booking-panel__price-unit">/ jam</span>
        </div>
        <div className="booking-panel__rating">
          <span className="booking-panel__star">★</span>
          <strong>{room.rating}</strong>
          <span>· {room.reviewCount} ulasan</span>
        </div>
      </div>

      <div className="booking-panel__divider" />

      <div className="booking-panel__field">
        <label className="booking-panel__label">Tanggal</label>
        <input
          className="booking-panel__input"
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="booking-panel__row">
        <div className="booking-panel__field">
          <label className="booking-panel__label">Mulai</label>
          <select
            className="booking-panel__select"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="booking-panel__field">
          <label className="booking-panel__label">Selesai</label>
          <select
            className="booking-panel__select"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="booking-panel__field">
        <label className="booking-panel__label">Nama Kegiatan</label>
        <input
          className="booking-panel__input"
          type="text"
          placeholder="Rapat bulanan, interview, dll."
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          required
        />
      </div>

      <div className="booking-panel__field">
        <label className="booking-panel__label">Institusi</label>
        <input
          className="booking-panel__input"
          type="text"
          placeholder="Universitas, Sekolah, Perusahaan, dll."
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          required
        />
      </div>

      {hours > 0 && (
        <div className="booking-panel__summary">
          <div className="booking-panel__summary-row">
            <span className="booking-panel__summary-label">
              {formatCurrency(room.pricePerHour)} × {hours} jam
            </span>
            <span className="booking-panel__summary-value">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <div className="booking-panel__summary-total">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      )}

      {(errorMsg || localError) && (
        <div className="booking-panel__error">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {localError || errorMsg}
        </div>
      )}

      <button
        className="booking-panel__book-btn"
        onClick={handleBook}
        disabled={status === "loading" || hours <= 0}
      >
        {status === "loading" ? "Memproses..." : "Pesan Sekarang"}
      </button>

      <p className="booking-panel__min-note">
        Minimum pemesanan {room.minHours} jam · Jam operasional{" "}
        {room.operationalHours.open}–{room.operationalHours.close}
      </p>

      {showConfirmModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal" style={{ maxWidth: "400px" }}>
            <div className="auth-modal__body">
              <h3 className="auth-modal__title">Konfirmasi Pemesanan</h3>
              <p className="auth-modal__subtitle" style={{ marginBottom: "16px" }}>
                Silakan periksa kembali detail pesanan Anda sebelum melanjutkan.
              </p>

              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "left",
                  fontSize: "0.9rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div>
                  <strong>Ruangan:</strong> {room.name}
                </div>
                <div>
                  <strong>Tanggal:</strong> {date}
                </div>
                <div>
                  <strong>Waktu:</strong> {startTime} – {endTime} ({hours} jam)
                </div>
                <div>
                  <strong>Kegiatan:</strong> {activity}
                </div>
                <div>
                  <strong>Institusi:</strong> {organization}
                </div>
                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "8px",
                    marginTop: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total Bayar:</span>
                  <span style={{ color: "#0f766e" }}>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  className="header__btn header__btn--outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowConfirmModal(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="header__btn header__btn--primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowConfirmModal(false);
                    executeBooking();
                  }}
                >
                  Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
