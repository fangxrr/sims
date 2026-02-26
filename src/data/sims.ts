import { SimSchema, Sim } from '../types/schemas';

const imageExtensions = ['.jpg', '.png', '.webp'];

// Helper function to automatically generate the image path from the id
const createSim = (data: any): Sim => {
  // Migrate partner to spouse if needed
  if (data?.relationships?.partner && !data.relationships.spouse) {
    data.relationships.spouse = data.relationships.partner;
    delete data.relationships.partner;
  }

  // Validate basic structure
  const result = SimSchema.safeParse(data);
  if (!result.success) {
    console.warn(`Invalid sim data for ${data?.id}:`, result.error.format());
  }

  const sim = result.success ? result.data : (data as Sim);

  return {
    ...sim,
    image: sim.image || `/images/sims/${sim.id}.jpg`
  };
};

const defaultSimsData: Record<string, Sim> = {
  // ... (GothMortimer, etc. remain the same but will be validated)
  'GothMortimer': createSim({
    id: 'GothMortimer',
    familyId: 'goth',
    name: 'Mortimer Goth',
    chineseName: '莫蒂默·哥特',
    gender: 'Male',
    age: 'Adult',
    maritalStatus: 'Married',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Writer (Author Branch)',
    aspiration: { name: 'Bestselling Author' },
    skills: [
      { name: 'Writing', level: 8 },
      { name: 'Logic', level: 6 },
      { name: 'Charisma', level: 5 }
    ],
    relationships: {
      spouse: [
        { id: 'GothBella' }
      ],
      lover: [
        { id: 'CalienteDina' }
      ],
      children: [
        { id: 'GothCassandra' },
        { id: 'GothAlexander' }
      ],
      parents: [
        { id: 'GothGunther' },
        { id: 'GothCornelia' }
      ]
    }
  }),
  'GothBella': createSim({
    id: 'GothBella',
    familyId: 'goth',
    name: 'Bella Goth',
    chineseName: '贝拉·哥特',
    gender: 'Female',
    age: 'Adult',
    maritalStatus: 'Married',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Secret Agent',
    skills: [
      { name: 'Charisma', level: 1 }
    ]
  }),
  'GothCassandra': createSim({
    id: 'GothCassandra',
    familyId: 'goth',
    name: 'Cassandra Goth',
    chineseName: '卡珊德拉·哥特',
    gender: 'Female',
    age: 'Teen',
    maritalStatus: 'Single',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'High School Student',
    skills: [
      { name: 'Violin', level: 1 }
    ],
    relationships: {
      siblings: [
        { id: 'GothAlexander' }
      ]
    }
  }),
  'GothAlexander': createSim({
    id: 'GothAlexander',
    familyId: 'goth',
    name: 'Alexander Goth',
    chineseName: '亚历山大·哥特',
    gender: 'Male',
    age: 'Child',
    maritalStatus: 'Single',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Grade School Student',
    skills: [
      { name: 'Creativity', level: 1 }
    ]
  }),
  'KimDennis': createSim({
    id: 'KimDennis',
    familyId: 'kim',
    name: 'Dennis Kim',
    chineseName: '丹尼斯·金',
    gender: 'Male',
    age: 'Elder',
    maritalStatus: 'Widowed',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Retired',
    skills: [
      { name: 'Gardening', level: 1 }
    ]
  }),
  'SpencerLydia': createSim({
    id: 'SpencerLydia',
    familyId: 'spencer',
    name: 'Lydia Spencer',
    chineseName: '莉迪亚·斯宾塞',
    gender: 'Female',
    age: 'Adult',
    maritalStatus: 'Divorced',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Business',
    skills: [
      { name: 'Logic', level: 1 }
    ]
  }),
  'SpencerKimAlice': createSim({
    id: 'SpencerKimAlice',
    familyId: 'spencer-kim-lewis',
    name: 'Alice Spencer-Kim',
    chineseName: '爱丽丝·斯宾塞-金',
    gender: 'Female',
    age: 'Young Adult',
    maritalStatus: 'Married',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Painter',
    skills: [
      { name: 'Painting', level: 1 }
    ]
  }),
  'LewisEric': createSim({
    id: 'LewisEric',
    familyId: 'spencer-kim-lewis',
    name: 'Eric Lewis',
    chineseName: '埃里克·刘易斯',
    gender: 'Male',
    age: 'Young Adult',
    maritalStatus: 'Married',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Tech Guru',
    skills: [
      { name: 'Programming', level: 1 }
    ]
  }),
  'KimLewisOlivia': createSim({
    id: 'KimLewisOlivia',
    familyId: 'spencer-kim-lewis',
    name: 'Olivia Kim-Lewis',
    chineseName: '奥利维亚·金-刘易斯',
    gender: 'Female',
    age: 'Child',
    maritalStatus: 'Single',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Grade School Student',
    skills: [
      { name: 'Motor', level: 1 }
    ]
  }),
  'PancakesBob': createSim({
    id: 'PancakesBob',
    familyId: 'pancakes',
    name: 'Bob Pancakes',
    chineseName: '鲍勃·潘凯克斯',
    gender: 'Male',
    age: 'Young Adult',
    maritalStatus: 'Married',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Culinary',
    skills: [
      { name: 'Cooking', level: 1 }
    ]
  }),
  'PancakesEliza': createSim({
    id: 'PancakesEliza',
    familyId: 'pancakes',
    name: 'Eliza Pancakes',
    chineseName: '伊丽莎·潘凯克斯',
    gender: 'Female',
    age: 'Young Adult',
    maritalStatus: 'Married',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Unemployed',
    skills: [
      { name: 'Fitness', level: 1 }
    ]
  }),
  'HolidaySummer': createSim({
    id: 'HolidaySummer',
    familyId: 'holiday',
    name: 'Summer Holiday',
    chineseName: '夏日·假日',
    gender: 'Female',
    age: 'Young Adult',
    maritalStatus: 'Single',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Culinary',
    skills: [
      { name: 'Cooking', level: 1 }
    ]
  }),
  'ScottTravis': createSim({
    id: 'ScottTravis',
    familyId: 'scott',
    name: 'Travis Scott',
    chineseName: '特拉维斯·斯科特',
    gender: 'Male',
    age: 'Young Adult',
    maritalStatus: 'Single',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Tech Guru',
    skills: [
      { name: 'Video Gaming', level: 1 }
    ]
  }),
  'LeeLiberty': createSim({
    id: 'LeeLiberty',
    familyId: 'lee',
    name: 'Liberty Lee',
    chineseName: '利伯蒂·李',
    gender: 'Female',
    age: 'Young Adult',
    maritalStatus: 'Single',
    world: 'Willow Creek',
    worldId: 'willow-creek',
    career: 'Astronaut',
    skills: [
      { name: 'Rocket Science', level: 1 }
    ]
  }),
};

const getSimsData = (): Record<string, Sim> => {
  try {
    const stored = localStorage.getItem('sims_data_sims');
    if (stored) {
      const parsed = JSON.parse(stored);
      const result: Record<string, Sim> = {};
      for (const key in parsed) {
        result[key] = createSim(parsed[key]);
      }
      return result;
    }
  } catch (e) {
    console.error('Failed to load sims data from localStorage', e);
  }
  return defaultSimsData;
};

export const SIMS_DATA = getSimsData();

