import { useState } from "react";
export default function RoomGallery({ images, name }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIdx, setLightboxIdx] = useState(0);
    const openLightbox = (idx) => {
        setLightboxIdx(idx);
        setLightboxOpen(true);
    };
    const shown = images.slice(0, 3);
    const extras = images.length - 3;
    return (<>
      <div className="room-gallery">
        <div className="room-gallery__main" onClick={() => openLightbox(0)}>
          <img src={images[0]} alt={name}/>
          <button className="room-gallery__fullscreen-btn" onClick={(e) => { e.stopPropagation(); openLightbox(0); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            Lihat Semua
          </button>
        </div>
        {shown.slice(1).map((img, i) => (<div key={i} className="room-gallery__thumb" onClick={() => openLightbox(i + 1)}>
            <img src={img} alt={`${name} ${i + 2}`}/>
            {i === 1 && extras > 0 && (<div className="room-gallery__more-overlay">+{extras} foto</div>)}
          </div>))}
      </div>

      {lightboxOpen && (<div className="room-gallery__lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="room-gallery__lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
          <img className="room-gallery__lightbox-img" src={images[lightboxIdx]} alt={name} onClick={(e) => e.stopPropagation()}/>
          <div className="room-gallery__lightbox-nav" onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (<img key={i} className={`room-gallery__lightbox-thumb${i === lightboxIdx ? " room-gallery__lightbox-thumb--active" : ""}`} src={img} alt="" onClick={() => setLightboxIdx(i)}/>))}
          </div>
        </div>)}
    </>);
}
