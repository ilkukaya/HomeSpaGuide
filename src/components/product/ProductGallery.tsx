import { useEffect, useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
}

interface Props {
  images: GalleryImage[];
  alt: string;
}

export default function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, images.length]);

  if (!images.length) return null;

  return (
    <div className="hsg-gallery">
      <button
        className="hsg-gallery__main"
        type="button"
        onClick={() => setLightbox(true)}
        aria-label={`Open ${alt} in lightbox`}
      >
        <img src={images[active]!.src} alt={images[active]!.alt || alt} loading="eager" />
      </button>
      {images.length > 1 && (
        <ul className="hsg-gallery__thumbs" role="list">
          {images.map((img, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                aria-label={`Show image ${i + 1}`}
                className={`hsg-gallery__thumb ${i === active ? 'is-active' : ''}`}
              >
                <img src={img.src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {lightbox && (
        <div
          className="hsg-gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Product image"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="hsg-gallery__close"
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            aria-label="Close"
          >×</button>
          <img src={images[active]!.src} alt={images[active]!.alt || alt} />
        </div>
      )}
    </div>
  );
}
