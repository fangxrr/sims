export interface Creator {
  id: string;
  name: string;
  avatar: string;
  favLevel: string;
  types: string[];
  status: string;
  url: string;
  date?: string;
}

// Helper function to automatically generate the avatar path from the id
const createCreator = (data: Partial<Creator> & Omit<Creator, 'avatar'>): Creator => ({
  ...data,
  avatar: data.avatar || `/images/creators/${data.id}.jpg`
});

const defaultCreatorsData: Creator[] = [
  createCreator({ id: 'greenllama', name: 'GreenLlama', favLevel: 'A', types: ['Male Hair', 'Female Hair', 'Clothes'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'peacemaker', name: 'Peacemaker', favLevel: 'A', types: ['Furniture', 'Build Items'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'sentate', name: 'Sentate', favLevel: 'A', types: ['Clothes', 'Shoes'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'aharris00britney', name: 'Aharris00britney', favLevel: 'A', types: ['Female Hair', 'Clothes'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'felixandre', name: 'Felixandre', favLevel: 'B', types: ['Furniture', 'Build Items'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'harrie', name: 'Harrie', favLevel: 'B', types: ['Furniture', 'Build Items'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'simstrouble', name: 'SimsTrouble', favLevel: 'A', types: ['Female Hair'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'johnnysims', name: 'Johnnysims', favLevel: 'A', types: ['Male Hair'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'rusty', name: 'Rusty', favLevel: 'C', types: ['Clothes', 'Male Hair'], status: 'Not Updating', url: 'https://patreon.com' }),
  createCreator({ id: 'clumsyalien', name: 'ClumsyAlien', favLevel: 'B', types: ['Clothes', 'Female Hair'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'twistedmexi', name: 'TwistedMexi', favLevel: 'A', types: ['Mods', 'Build Items'], status: 'Active', url: 'https://patreon.com' }),
  createCreator({ id: 'lumpinou', name: 'Lumpinou', favLevel: 'A', types: ['Mods', 'Gameplay'], status: 'Active', url: 'https://patreon.com' }),
];

import generatedData from './generated';

const getCreatorsData = (): Creator[] => {

  // Use generated data if available
  if (generatedData?.creators?.length > 0) {
    return generatedData.creators.map((item: any) => createCreator(item));
  }

  return defaultCreatorsData;
};

export const CREATORS_DATA = getCreatorsData();
