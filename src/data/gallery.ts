export interface GalleryImage {
  id: string;
  url: string;
}

// Helper function to automatically generate the url path from the id
const createGalleryImage = (id: string): GalleryImage => ({
  id,
  url: `/images/gallery/${id}.jpg`
});

const defaultGalleryData: GalleryImage[] = [
  createGalleryImage('gal1'),
  createGalleryImage('gal2'),
  createGalleryImage('gal3'),
  createGalleryImage('gal4'),
  createGalleryImage('gal5'),
  createGalleryImage('gal6'),
  createGalleryImage('gal7'),
  createGalleryImage('gal8'),
  createGalleryImage('gal9'),
  createGalleryImage('gal10'),
  createGalleryImage('gal11'),
  createGalleryImage('gal12'),
];

const getGalleryData = (): GalleryImage[] => {
  try {
    const stored = localStorage.getItem('sims_data_gallery');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => createGalleryImage(item.id));
    }
  } catch (e) {
    console.error('Failed to load gallery data from localStorage', e);
  }
  return defaultGalleryData;
};

export const GALLERY_DATA = getGalleryData();
