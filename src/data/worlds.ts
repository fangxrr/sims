import { WorldSchema, DistrictSchema, World, District } from '../types/schemas';

// Helper functions to automatically generate the image path from the id
const createDistrict = (data: any): District => {
  const result = DistrictSchema.safeParse(data);
  if (!result.success) {
    console.warn(`Invalid district data for ${data?.id}:`, result.error.format());
  }
  const district = result.success ? result.data : (data as District);
  return {
    ...district,
    image: district.image || `/images/worlds/districts/${district.id}.jpg`
  };
};

const createWorld = (data: any): World => {
  const result = WorldSchema.safeParse(data);
  if (!result.success) {
    console.warn(`Invalid world data for ${data?.id}:`, result.error.format());
  }
  const world = result.success ? result.data : (data as World);
  return {
    ...world,
    image: world.image || `/images/worlds/${world.id}.jpg`,
    districts: world.districts.map(createDistrict)
  };
};

const defaultWorldsData: Record<string, World> = {
  'willow-creek': createWorld({
    id: 'willow-creek',
    name: 'Willow Creek',
    chineseName: '柳溪',
    description: 'A lush, green world featuring traditional style homes, winding rivers, and plenty of parks for Sims to enjoy.',
    sizes: ['50x50', '40x30', '30x20', '20x15'],
    districts: [
      {
        id: 'foundry-cove',
        name: 'Foundry Cove',
        description: 'A quiet, affordable neighborhood perfect for starters.',
      },
      {
        id: 'courtyard-lane',
        name: 'Courtyard Lane',
        description: 'A charming middle-class area with larger homes.',
      },
      {
        id: 'sage-estates',
        name: 'Sage Estates',
        description: 'The most prestigious address in Willow Creek.',
      }
    ]
  }),
  'oasis-springs': createWorld({
    id: 'oasis-springs',
    name: 'Oasis Springs',
    chineseName: '绿洲泉',
    description: 'A desert landscape with modern homes and a mid-century vibe. Hot days and cool nights await.',
    sizes: ['50x50', '30x20', '20x15'],
    districts: []
  }),
  'newcrest': createWorld({
    id: 'newcrest',
    name: 'Newcrest',
    chineseName: '纽克雷斯特',
    description: 'A blank canvas world waiting for your creativity. Build your dream neighborhood from scratch.',
    sizes: ['50x40', '40x30', '30x20', '20x15'],
    districts: []
  }),
  'san-myshuno': createWorld({
    id: 'san-myshuno',
    name: 'San Myshuno',
    chineseName: '三米舒诺',
    description: 'A bustling city world with apartments, festivals, and a diverse population.',
    sizes: ['40x30', '30x20'],
    districts: []
  }),
  'windenburg': createWorld({
    id: 'windenburg',
    name: 'Windenburg',
    chineseName: '温登堡',
    description: 'An old-world European style town with ancient ruins, cozy cafes, and a beautiful island.',
    sizes: ['64x64', '30x20', '20x20'],
    districts: []
  }),
};

import generatedData from './generated';

const getWorldsData = (): Record<string, World> => {

  // Use generated data if available
  if (generatedData?.worlds?.length > 0) {
    const result: Record<string, World> = {};

    // Process worlds and mix in districts
    generatedData.worlds.forEach((world: any) => {
      // Find districts for this world
      const worldDistricts = generatedData.districts?.filter((d: any) => d.worldId === world.id) || [];
      world.districts = worldDistricts;
      result[world.id] = createWorld(world);
    });

    return result;
  }

  return defaultWorldsData;
};

export const WORLDS_DATA = getWorldsData();
