import { useState } from "react";
import { updateRoom, createRoom } from "../../api/rooms";

const FACILITY_OPTIONS = [
    "Wi-Fi Cepat",
    "AC",
    "Proyektor",
    "Whiteboard",
    "TV / Monitor",
    "Sound System",
    "Video Conference",
    "Kopi & Teh",
    "Catering",
    "Parkir",
    "Valet Parking",
    "Studio Lighting",
    "Panggung",
    "Pantry / Dapur",
    "Lounge",
];

const INITIAL = {
    name: "", location: "", address: "", type: "meeting",
    capacity: "", minHours: "1", pricePerHour: "", openTime: "08:00", closeTime: "22:00",
    description: "", ownerName: "Hotel Admin", ownerEmail: "admin@hotel.com", ownerPhone: "0800000000",
    facilities: [],
};

export default function RegisterForm({ initialData, onSuccess, onCancel }) {
    const [form, setForm] = useState(() => {
        if (initialData) {
            return {
                name: initialData.name || "",
                location: initialData.location || "",
                address: initialData.address || "",
                type: initialData.type || "meeting",
                capacity: initialData.capacity || "",
                minHours: initialData.minHours || "1",
                pricePerHour: initialData.pricePerHour || "",
                openTime: initialData.operationalHours?.open || "08:00",
                closeTime: initialData.operationalHours?.close || "22:00",
                description: initialData.description || "",
                ownerName: "Hotel Admin",
                ownerEmail: "admin@hotel.com",
                ownerPhone: "0800000000",
                facilities: initialData.facilities?.map(f => f.name || f) || []
            };
        }
        return INITIAL;
    });
    const [loading, setLoading] = useState(false);

    function set(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function toggleFacility(name) {
        setForm((f) => ({
            ...f,
            facilities: f.facilities.includes(name)
                ? f.facilities.filter((x) => x !== name)
                : [...f.facilities, name],
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                location: form.location,
                address: form.address,
                type: form.type,
                capacity: form.capacity,
                pricePerHour: form.pricePerHour,
                description: form.description,
                facilities: form.facilities.map(f => ({ id: f.toLowerCase().replace(/\s+/g, '-'), name: f })),
                minHours: form.minHours,
                operationalHours: {
                    open: form.openTime,
                    close: form.closeTime
                }
            };
            
            if (initialData && initialData.id) {
                await updateRoom(initialData.id, payload);
            } else {
                await createRoom(payload);
            }
            onSuccess(form.name, form.ownerEmail);
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan ruangan: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="register-page__form" onSubmit={handleSubmit}>
            <h2 className="register-page__form-title">Informasi Ruangan</h2>

            <div className="register-page__section">
                <span className="register-page__section-label">1. Detail Ruangan</span>
                <div className="register-page__grid">
                    <div className="register-page__field register-page__field--full">
                        <label className="register-page__label">
                            Nama Ruangan <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="text" placeholder="cth. Ruang Meeting Mawar Lantai 3" value={form.name} onChange={(e) => set("name", e.target.value)} required />
                    </div>

                    <div className="register-page__field">
                        <label className="register-page__label">
                            Kapasitas (orang) <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="number" min={1} placeholder="cth. 20" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} required />
                    </div>

                    <div className="register-page__field">
                        <label className="register-page__label">
                            Tipe Ruangan <span className="register-page__required">*</span>
                        </label>
                        <select className="register-page__select" value={form.type} onChange={(e) => set("type", e.target.value)} required>
                            <option value="meeting">Meeting Room</option>
                            <option value="event">Event Room</option>
                        </select>
                    </div>

                    <div className="register-page__field">
                        <label className="register-page__label">
                            Lokasi <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="text" placeholder="Nama gedung atau area" value={form.location} onChange={(e) => set("location", e.target.value)} required />
                    </div>

                    <div className="register-page__field register-page__field--full">
                        <label className="register-page__label">
                            Alamat Lengkap <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="text" placeholder="Nama jalan, nomor, kelurahan, kecamatan" value={form.address} onChange={(e) => set("address", e.target.value)} required />
                    </div>

                    <div className="register-page__field register-page__field--full">
                        <label className="register-page__label">
                            Deskripsi Ruangan <span className="register-page__required">*</span>
                        </label>
                        <textarea className="register-page__textarea" placeholder="Jelaskan keunggulan, suasana, dan kecocokan ruangan Anda..." value={form.description} onChange={(e) => set("description", e.target.value)} required />
                    </div>
                </div>
            </div>

            <div className="register-page__divider" />

            <div className="register-page__section">
                <span className="register-page__section-label">2. Harga & Jadwal</span>
                <div className="register-page__grid">
                    <div className="register-page__field">
                        <label className="register-page__label">
                            Harga per Jam (Rp) <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="number" min={0} placeholder="cth. 150000" value={form.pricePerHour} onChange={(e) => set("pricePerHour", e.target.value)} required />
                    </div>

                    <div className="register-page__field">
                        <label className="register-page__label">Minimum Pemesanan (jam)</label>
                        <select className="register-page__select" value={form.minHours} onChange={(e) => set("minHours", e.target.value)}>
                            {[1, 2, 3, 4, 6, 8].map((h) => (<option key={h} value={h}>{h} jam</option>))}
                        </select>
                    </div>

                    <div className="register-page__field">
                        <label className="register-page__label">
                            Jam Buka <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="time" value={form.openTime} onChange={(e) => set("openTime", e.target.value)} required />
                    </div>

                    <div className="register-page__field">
                        <label className="register-page__label">
                            Jam Tutup <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="time" value={form.closeTime} onChange={(e) => set("closeTime", e.target.value)} required />
                    </div>
                </div>
            </div>

            <div className="register-page__divider" />

            <div className="register-page__section">
                <span className="register-page__section-label">3. Fasilitas</span>
                <div className="register-page__facilities">
                    {FACILITY_OPTIONS.map((fac) => (<label key={fac} className={`register-page__facility-option${form.facilities.includes(fac) ? " register-page__facility-option--checked" : ""}`}>
                        <input type="checkbox" checked={form.facilities.includes(fac)} onChange={() => toggleFacility(fac)} />
                        {fac}
                    </label>))}
                </div>
            </div>

            <div className="register-page__divider" />

            <div className="register-page__section">
                <span className="register-page__section-label">4. Informasi Pemilik (Default)</span>
                <div className="register-page__grid">
                    <div className="register-page__field register-page__field--full">
                        <label className="register-page__label">
                            Nama Lengkap <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="text" placeholder="Nama Anda" value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} required />
                    </div>

                    <div className="register-page__field">
                        <label className="register-page__label">
                            Email <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="email" placeholder="email@domain.com" value={form.ownerEmail} onChange={(e) => set("ownerEmail", e.target.value)} required />
                    </div>

                    <div className="register-page__field">
                        <label className="register-page__label">
                            No. Telepon <span className="register-page__required">*</span>
                        </label>
                        <input className="register-page__input" type="tel" placeholder="08xx-xxxx-xxxx" value={form.ownerPhone} onChange={(e) => set("ownerPhone", e.target.value)} required />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                {onCancel && (
                    <button type="button" className="register-page__submit" style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', color: '#64748b' }} onClick={onCancel} disabled={loading}>
                        Batal
                    </button>
                )}
                <button className="register-page__submit" type="submit" disabled={loading} style={{ flex: 1 }}>
                    {loading ? "Menyimpan..." : (initialData ? "Simpan Perubahan" : "Daftarkan Ruangan Saya")}
                </button>
            </div>
        </form>
    );
}
