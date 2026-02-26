import { LotSchema, Lot } from '../types/schemas';

// Helper function to automatically generate the image path from the id
const createLot = (data: any): Lot => {
  const result = LotSchema.safeParse(data);
  if (!result.success) {
    console.warn(`Invalid lot data for ${data?.id}:`, result.error.format());
  }
  const lot = result.success ? result.data : (data as Lot);
  return {
    ...lot,
    image: lot.image || `/images/lots/${lot.id}.jpg`
  };
};

const defaultLotsData: Record<string, Lot> = {
  'crick-cabana': createLot({ id: 'crick-cabana', name: 'Crick Cabana', size: '64x64', worldId: 'willow-creek', districtId: 'foundry-cove', type: 'Spa' }),
  'daisy-hovel': createLot({ id: 'daisy-hovel', name: 'Daisy Hovel', size: '30x20', worldId: 'willow-creek', districtId: 'foundry-cove', type: 'Residential' }),
  'garden-essence': createLot({ id: 'garden-essence', name: 'Garden Essence', size: '40x30', worldId: 'willow-creek', districtId: 'foundry-cove', type: 'Residential' }),
  'streamlet-single': createLot({ id: 'streamlet-single', name: 'Streamlet Single', size: '20x15', worldId: 'willow-creek', districtId: 'foundry-cove', type: 'Residential' }),
  'brook-bungalow': createLot({ id: 'brook-bungalow', name: 'Brook Bungalow', size: '40x30', worldId: 'willow-creek', districtId: 'courtyard-lane', type: 'Residential' }),
  'pique-hearth': createLot({ id: 'pique-hearth', name: 'Pique Hearth', size: '30x20', worldId: 'willow-creek', districtId: 'courtyard-lane', type: 'Residential' }),
  'potters-splay': createLot({ id: 'potters-splay', name: 'Potters Splay', size: '30x20', worldId: 'willow-creek', districtId: 'courtyard-lane', type: 'Residential' }),
  'riverside-roost': createLot({ id: 'riverside-roost', name: 'Riverside Roost', size: '50x40', worldId: 'willow-creek', districtId: 'courtyard-lane', type: 'Residential' }),
  'opus-hall': createLot({ id: 'opus-hall', name: 'Opus Hall', size: '50x50', worldId: 'willow-creek', districtId: 'sage-estates', type: 'Residential' }),
  'umbrage-manor': createLot({ id: 'umbrage-manor', name: 'Umbrage Manor', size: '50x50', worldId: 'willow-creek', districtId: 'sage-estates', type: 'Residential' }),
  'ophelia-villa': createLot({ id: 'ophelia-villa', name: 'Ophelia Villa', chineseName: '奥菲利亚别墅', size: '30x20', worldId: 'willow-creek', districtId: 'foundry-cove', type: 'Residential', isBuilt: true }),
  'cypress-terrace': createLot({ id: 'cypress-terrace', name: 'Cypress Terrace', chineseName: '柏树露台', size: '40x30', worldId: 'willow-creek', districtId: 'courtyard-lane', type: 'Residential', isBuilt: true }),
  'blue-velvet': createLot({ id: 'blue-velvet', name: 'The Blue Velvet', size: '30x20', type: 'Nightclub', worldId: 'willow-creek' }),
  'movers-shakers': createLot({ id: 'movers-shakers', name: 'Movers & Shakers', size: '30x20', type: 'Gym', worldId: 'willow-creek' }),
  'municipal-muses': createLot({ id: 'municipal-muses', name: 'Municipal Muses', size: '40x30', type: 'Museum', worldId: 'willow-creek' }),
  'magnolia-blossom': createLot({ id: 'magnolia-blossom', name: 'Magnolia Blossom Park', size: '50x50', type: 'Park', worldId: 'willow-creek' }),
  'pebble-burrow': createLot({ id: 'pebble-burrow', name: 'Pebble Burrow', size: '30x20', type: 'Residential', worldId: 'oasis-springs' }),
  'dusty-turf': createLot({ id: 'dusty-turf', name: 'Dusty Turf', size: '30x20', type: 'Residential', worldId: 'oasis-springs' }),
  'nookstone': createLot({ id: 'nookstone', name: 'Nookstone', size: '20x15', type: 'Residential', worldId: 'oasis-springs' }),
  'sandtrap-flat': createLot({ id: 'sandtrap-flat', name: 'Sandtrap Flat', size: '30x20', type: 'Residential', worldId: 'oasis-springs' }),
  'rattlesnake-juice': createLot({ id: 'rattlesnake-juice', name: 'Rattlesnake Juice', size: '30x20', type: 'Bar', worldId: 'oasis-springs' }),
  'solar-flare': createLot({ id: 'solar-flare', name: 'The Solar Flare', size: '30x20', type: 'Lounge', worldId: 'oasis-springs' }),
  'future-past': createLot({ id: 'future-past', name: 'The Future Past', size: '30x20', type: 'Museum', worldId: 'oasis-springs' }),
  'desert-bloom': createLot({ id: 'desert-bloom', name: 'Desert Bloom Park', size: '50x50', type: 'Park', worldId: 'oasis-springs' }),
};

import generatedData from './generated';

const getLotsData = (): Record<string, Lot> => {

  // Use generated data if available
  if (generatedData?.lots?.length > 0) {
    const result: Record<string, Lot> = {};
    generatedData.lots.forEach((lot: any) => {
      result[lot.id] = createLot(lot);
    });
    return result;
  }

  return defaultLotsData;
};

export const LOTS_DATA = getLotsData();
