export default function RoomFilters({ filters, onUpdate, onReset }) {
    return (<div className="room-filters">
      <div className="room-filters__group room-filters__group--search">
        <label className="room-filters__label">Cari Ruangan</label>
        <div className="room-filters__search-wrap">
          <svg className="room-filters__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="room-filters__input" type="search" placeholder="Nama atau lokasi ruangan..." value={filters.search} onChange={(e) => onUpdate("search", e.target.value)}/>
        </div>
      </div>

      <div className="room-filters__group">
        <label className="room-filters__label">Min. Kapasitas</label>
        <select className="room-filters__select" value={filters.capacity} onChange={(e) => onUpdate("capacity", Number(e.target.value))}>
          <option value={0}>Semua Kapasitas</option>
          <option value={6}>6+ orang</option>
          <option value={10}>10+ orang</option>
          <option value={20}>20+ orang</option>
          <option value={50}>50+ orang</option>
          <option value={100}>100+ orang</option>
        </select>
      </div>

      <div className="room-filters__group">
        <label className="room-filters__label">Maks. Harga / jam</label>
        <select className="room-filters__select" value={filters.maxPrice} onChange={(e) => onUpdate("maxPrice", Number(e.target.value))}>
          <option value={0}>Semua Harga</option>
          <option value={100000}>s/d Rp 100rb</option>
          <option value={200000}>s/d Rp 200rb</option>
          <option value={400000}>s/d Rp 400rb</option>
          <option value={800000}>s/d Rp 800rb</option>
        </select>
      </div>

      <button className="room-filters__reset" onClick={onReset}>
        Reset Filter
      </button>
    </div>);
}
