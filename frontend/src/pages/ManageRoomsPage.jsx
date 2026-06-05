import { useState, useEffect } from "react";
import { getRooms, deleteRoom } from "../api/rooms";
import { formatCurrency } from "../utils/formatters";
import RegisterForm from "../components/register/RegisterForm";

export default function ManageRoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // view state: 'list', 'create', 'edit'
    const [view, setView] = useState('list');
    const [selectedRoom, setSelectedRoom] = useState(null);

    const fetchRooms = () => {
        setLoading(true);
        getRooms()
            .then(data => {
                setRooms(data);
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError('Gagal memuat data ruangan');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (view === 'list') {
            fetchRooms();
        }
    }, [view]);

    const handleDelete = async (room) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus ruangan "${room.name}"?\nTindakan ini tidak dapat dibatalkan.`)) return;
        
        try {
            await deleteRoom(room.id);
            fetchRooms();
        } catch (err) {
            alert('Gagal menghapus ruangan: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (room) => {
        setSelectedRoom(room);
        setView('edit');
    };

    const handleCreate = () => {
        setSelectedRoom(null);
        setView('create');
    };

    const handleFormSuccess = () => {
        setView('list');
        setSelectedRoom(null);
        // fetchRooms will be called by useEffect
    };

    const handleFormCancel = () => {
        setView('list');
        setSelectedRoom(null);
    };

    if (view === 'create' || view === 'edit') {
        return (
            <main className="register-page" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
                        {view === 'edit' ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                    </h1>
                    <p style={{ color: '#64748b' }}>
                        {view === 'edit' ? 'Perbarui detail ruangan yang sudah ada' : 'Tambahkan ruangan baru ke dalam sistem'}
                    </p>
                </div>
                <div className="register-page__inner" style={{ margin: 0, maxWidth: '100%' }}>
                    <RegisterForm 
                        initialData={selectedRoom} 
                        onSuccess={handleFormSuccess} 
                        onCancel={handleFormCancel} 
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="manage-rooms-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
                        Kelola Ruangan
                    </h1>
                    <p style={{ color: '#64748b' }}>
                        Daftar semua ruangan yang tersedia di sistem
                    </p>
                </div>
                <button 
                    onClick={handleCreate}
                    style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                    + Tambah Ruangan
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Memuat data...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>
            ) : rooms.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🏢</div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '8px' }}>Belum ada ruangan</h3>
                    <p style={{ color: '#64748b' }}>Silakan tambahkan ruangan baru.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#475569', fontWeight: '600', fontSize: '0.875rem' }}>Nama Ruangan</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#475569', fontWeight: '600', fontSize: '0.875rem' }}>Tipe</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#475569', fontWeight: '600', fontSize: '0.875rem' }}>Kapasitas</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#475569', fontWeight: '600', fontSize: '0.875rem' }}>Harga/Jam</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: '#475569', fontWeight: '600', fontSize: '0.875rem' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '16px', color: '#0f172a', fontWeight: '500' }}>{room.name}</td>
                                    <td style={{ padding: '16px', color: '#64748b' }}>{room.type === 'meeting' ? 'Meeting Room' : 'Event Space'}</td>
                                    <td style={{ padding: '16px', color: '#64748b' }}>{room.capacity} org</td>
                                    <td style={{ padding: '16px', color: '#64748b' }}>{formatCurrency(room.pricePerHour)}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleEdit(room)}
                                            style={{ backgroundColor: 'transparent', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', color: '#475569', fontWeight: '500' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(room)}
                                            style={{ backgroundColor: '#fee2e2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#b91c1c', fontWeight: '500' }}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
