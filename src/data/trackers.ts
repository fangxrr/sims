export interface CCItem {
  id: string;
  title: string;
  author: string;
  type: string;
  subtype: string;
  image: string;
  downloadUrl: string;
  translationUrl?: string;
}

// Helper function to automatically generate the image path from the id
const createCCItem = (data: Omit<CCItem, 'image'>): CCItem => ({
  ...data,
  image: `/images/trackers/${data.id}.jpg`
});

const defaultTrackersData: CCItem[] = [
  createCCItem({ id: 'goth-galore-hair', title: 'Goth Galore Hair', author: 'GreenLlama', type: 'CAS', subtype: 'Female Hair', downloadUrl: '#', translationUrl: '#' }),
  createCCItem({ id: 'mid-century-modern-sofa', title: 'Mid-Century Modern Sofa', author: 'Peacemaker', type: 'Build/Buy', subtype: 'Furniture', downloadUrl: '#' }),
  createCCItem({ id: 'better-buildbuy', title: 'Better BuildBuy', author: 'TwistedMexi', type: 'Mods', subtype: 'UI', downloadUrl: '#', translationUrl: '#' }),
  createCCItem({ id: 'woohoo-wellness', title: 'WooHoo Wellness', author: 'Lumpinou', type: 'Mods', subtype: 'Gameplay', downloadUrl: '#', translationUrl: '#' }),
  createCCItem({ id: 'vintage-glamour-dress', title: 'Vintage Glamour Dress', author: 'Sentate', type: 'CAS', subtype: 'Clothes', downloadUrl: '#' }),
  createCCItem({ id: 'rustic-kitchen-counters', title: 'Rustic Kitchen Counters', author: 'Harrie', type: 'Build/Buy', subtype: 'Furniture', downloadUrl: '#' }),
  createCCItem({ id: 'chunky-boots', title: 'Chunky Boots', author: 'Sentate', type: 'CAS', subtype: 'Shoes', downloadUrl: '#' }),
  createCCItem({ id: 'messy-male-hair', title: 'Messy Male Hair', author: 'Johnnysims', type: 'CAS', subtype: 'Male Hair', downloadUrl: '#' }),
  createCCItem({ id: 'mc-command-center', title: 'MC Command Center', author: 'Deaderpool', type: 'Mods', subtype: 'Core', downloadUrl: '#', translationUrl: '#' }),
  createCCItem({ id: 'boho-bedroom-set', title: 'Boho Bedroom Set', author: 'Felixandre', type: 'Build/Buy', subtype: 'Furniture', downloadUrl: '#' }),
];

import generatedData from './generated';

const getTrackersData = (): CCItem[] => {

  // Use generated data if available
  if (generatedData?.trackers?.length > 0) {
    return generatedData.trackers.map((item: any) => createCCItem(item));
  }

  return defaultTrackersData;
};

export const TRACKERS_DATA = getTrackersData();
