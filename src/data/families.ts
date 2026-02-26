import { FamilySchema, Family } from '../types/schemas';

// Helper function to automatically generate the image path from the id
const createFamily = (data: any): Family => {
  const result = FamilySchema.safeParse(data);
  if (!result.success) {
    console.warn(`Invalid family data for ${data?.id}:`, result.error.format());
  }
  const family = result.success ? result.data : (data as Family);
  return {
    ...family,
    image: family.image || `/images/families/${family.id}.jpg`
  };
};

const defaultFamiliesData: Record<string, Family> = {
  'goth': createFamily({
    id: 'goth',
    name: 'Goth Family',
    chineseName: '哥特家族',
    description: 'The aristocrats of Willow Creek. Known for their gloomy demeanor and mysterious past, the Goths are staples of the community with secrets buried deep within their history.',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    lot: 'Ophelia Villa',
    lotId: 'ophelia-villa',
    members: [
      { id: 'GothMortimer' },
      { id: 'GothBella' },
      { id: 'GothCassandra' },
      { id: 'GothAlexander' },
    ]
  }),
  'spencer-kim-lewis': createFamily({
    id: 'spencer-kim-lewis',
    name: 'Spencer-Kim-Lewis',
    chineseName: '斯宾塞-金-刘易斯',
    description: 'A modern blended family living in a large modern home. They represent the new generation of Willow Creek residents.',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    lot: 'Cypress Terrace',
    lotId: 'cypress-terrace',
    members: [
      { id: 'KimDennis' },
      { id: 'SpencerLydia' },
      { id: 'SpencerKimAlice' },
      { id: 'LewisEric' },
      { id: 'KimLewisOlivia' },
    ]
  }),
  'pancakes': createFamily({ id: 'pancakes', name: 'Pancakes', world: 'Willow Creek', worldId: 'willow-creek' }),
  'bff': createFamily({ id: 'bff', name: 'BFF Household', world: 'Willow Creek', worldId: 'willow-creek' }),
  'landgraab': createFamily({ id: 'landgraab', name: 'Landgraab', world: 'Oasis Springs', worldId: 'oasis-springs' }),
  'caliente': createFamily({ id: 'caliente', name: 'Caliente', world: 'Oasis Springs', worldId: 'oasis-springs' }),
  'zest': createFamily({ id: 'zest', name: 'Zest', world: 'Oasis Springs', worldId: 'oasis-springs' }),
  'roomies': createFamily({ id: 'roomies', name: 'Roomies', world: 'Oasis Springs', worldId: 'oasis-springs' }),
  'villareal': createFamily({ id: 'villareal', name: 'Villareal', world: 'Windenburg', worldId: 'windenburg' }),
  'fyres': createFamily({ id: 'fyres', name: 'Fyres', world: 'Windenburg', worldId: 'windenburg' }),
  'bjergsen': createFamily({ id: 'bjergsen', name: 'Bjergsen', world: 'Windenburg', worldId: 'windenburg' }),
  'bro': createFamily({ id: 'bro', name: 'Partihaus', world: 'Windenburg', worldId: 'windenburg' }),
  'karaoke': createFamily({ id: 'karaoke', name: 'Karaoke Legends', world: 'San Myshuno', worldId: 'san-myshuno' }),
  'pizza': createFamily({ id: 'pizza', name: 'Pizza Enthusiasts', world: 'San Myshuno', worldId: 'san-myshuno' }),
};

import generatedData from './generated';

const getFamiliesData = (): Record<string, Family> => {

  // Use generated data if available
  if (generatedData?.families?.length > 0) {
    const result: Record<string, Family> = {};
    generatedData.families.forEach((family: any) => {
      result[family.id] = createFamily(family);
    });
    return result;
  }

  return defaultFamiliesData;
};

export const FAMILIES_DATA = getFamiliesData();
