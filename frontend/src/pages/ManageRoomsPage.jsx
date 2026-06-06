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
            <main className="page-container page-container--narrow">
                <div className="page-header">
                    <h1 className="page-title">
                        {view === 'edit' ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                    </h1>
                    <p className="page-subtitle">
                        {view === 'edit' ? 'Perbarui detail ruangan yang sudah ada' : 'Tambahkan ruangan baru ke dalam sistem'}
                    </p>
                </div>
                <div className="register-page__inner">
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
        <main className="page-container">
            <div className="page-header--split">
                <div>
                    <h1 className="page-title">
                        Kelola Ruangan
                    </h1>
                    <p className="page-subtitle">
                        Daftar semua ruangan yang tersedia di sistem
                    </p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="manage-rooms-page__add-btn"
                >
                    + Tambah Ruangan
                </button>
            </div>

            {loading ? (
                <div className="state-loading">Memuat data...</div>
            ) : error ? (
                <div className="state-error">{error}</div>
            ) : rooms.length === 0 ? (
                <div className="state-empty">
                    <div className="state-empty__icon">🏢</div>
                    <h3 className="state-empty__title">Belum ada ruangan</h3>
                    <p className="state-empty__desc">Silakan tambahkan ruangan baru.</p>
                </div>
            ) : (
                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nama Ruangan</th>
                                <th>Tipe</th>
                                <th>Kapasitas</th>
                                <th>Harga/Jam</th>
                                <th className="th--right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.id}>
                                    <td className="td--name">{room.name}</td>
                                    <td>{room.type === 'meeting' ? 'Meeting Room' : 'Event Space'}</td>
                                    <td>{room.capacity} org</td>
                                    <td>{formatCurrency(room.pricePerHour)}</td>
                                    <td className="td--right">
                                        <button 
                                            onClick={() => handleEdit(room)}
                                            className="data-table__btn"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(room)}
                                            className="data-table__btn data-table__btn--danger"
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
