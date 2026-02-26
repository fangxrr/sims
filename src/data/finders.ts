export interface Finder {
  id: string;
  name: string;
  avatar: string;
  url: string;
}

// Helper function to automatically generate the avatar path from the id
const createFinder = (data: Omit<Finder, 'avatar'>): Finder => ({
  ...data,
  avatar: `/images/finders/${data.id}.jpg`
});

const defaultFindersData: Finder[] = [
  createFinder({ id: 'maxis-match-cc-world', name: 'Maxis Match CC World', url: 'https://maxismatchccworld.tumblr.com/' }),
  createFinder({ id: 'snootysims', name: 'SnootySims', url: 'https://snootysims.com/' }),
  createFinder({ id: 'the-sims-resource', name: 'The Sims Resource', url: 'https://www.thesimsresource.com/' }),
  createFinder({ id: 'mod-the-sims', name: 'Mod The Sims', url: 'https://modthesims.info/' }),
  createFinder({ id: 'sims-4-updates', name: 'Sims 4 Updates', url: 'https://sims4updates.net/' }),
  createFinder({ id: 'lilsimsie-cc-finds', name: 'Lilsimsie CC Finds', url: 'https://lilsimsiecc.tumblr.com/' }),
];

const getFindersData = (): Finder[] => {
  try {
    const stored = localStorage.getItem('sims_data_finders');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => createFinder(item));
    }
  } catch (e) {
    console.error('Failed to load finders data from localStorage', e);
  }
  return defaultFindersData;
};

export const FINDERS_DATA = getFindersData();
