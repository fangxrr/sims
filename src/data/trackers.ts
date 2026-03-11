export interface CCItem {
  id: string;
  title: string;
  chineseTitle?: string;
  author: string;
  type: string;
  subtype: string;
  image: string;
  downloadUrl: string;
  translationUrl?: string;
  date?: string;
  isDownloaded?: boolean;
}

// Helper function to automatically generate the image path from the id
const createCCItem = (data: Partial<CCItem> & { id: string; title: string }): CCItem => ({
  ...data,
  image: data.image || `/images/trackers/${data.id}.jpg`
} as CCItem);

const defaultTrackersData: CCItem[] = [
  createCCItem({ id: 'goth-galore-hair', title: 'Goth Galore Hair', chineseTitle: '哥特风华发型', author: 'GreenLlama', type: 'CAS', subtype: 'Female Hair', downloadUrl: '#', translationUrl: '#' }),
  createCCItem({ id: 'mid-century-modern-sofa', title: 'Mid-Century Modern Sofa', chineseTitle: '世纪中期现代沙发', author: 'Peacemaker', type: 'Build/Buy', subtype: 'Furniture', downloadUrl: '#' }),
  createCCItem({ id: 'better-buildbuy', title: 'Better BuildBuy', chineseTitle: '更好的建筑模式', author: 'TwistedMexi', type: 'Mods', subtype: 'UI', downloadUrl: '#', translationUrl: '#' }),
  createCCItem({ id: 'woohoo-wellness', title: 'WooHoo Wellness', chineseTitle: '嘿咻健康', author: 'Lumpinou', type: 'Mods', subtype: 'Gameplay', downloadUrl: '#', translationUrl: '#' }),
  createCCItem({ id: 'vintage-glamour-dress', title: 'Vintage Glamour Dress', chineseTitle: '复古风情连衣裙', author: 'Sentate', type: 'CAS', subtype: 'Clothes', downloadUrl: '#' }),
  createCCItem({ id: 'rustic-kitchen-counters', title: 'Rustic Kitchen Counters', chineseTitle: '乡村厨房流理台', author: 'Harrie', type: 'Build/Buy', subtype: 'Furniture', downloadUrl: '#' }),
  createCCItem({ id: 'chunky-boots', title: 'Chunky Boots', chineseTitle: '笨重靴子', author: 'Sentate', type: 'CAS', subtype: 'Shoes', downloadUrl: '#' }),
  createCCItem({ id: 'messy-male-hair', title: 'Messy Male Hair', chineseTitle: '凌乱男士发型', author: 'Johnnysims', type: 'CAS', subtype: 'Male Hair', downloadUrl: '#' }),
  createCCItem({ id: 'mc-command-center', title: 'MC Command Center', chineseTitle: 'MC 指挥中心', author: 'Deaderpool', type: 'Mods', subtype: 'Core', downloadUrl: '#', translationUrl: '#' }),
  createCCItem({ id: 'boho-bedroom-set', title: 'Boho Bedroom Set', chineseTitle: '波西米亚卧室套装', author: 'Felixandre', type: 'Build/Buy', subtype: 'Furniture', downloadUrl: '#' }),
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
