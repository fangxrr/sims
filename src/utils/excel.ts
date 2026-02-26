import * as XLSX from 'xlsx';
import { SIMS_DATA } from '../data/sims';
import { FAMILIES_DATA } from '../data/families';
import { LOTS_DATA } from '../data/lots';
import { WORLDS_DATA } from '../data/worlds';
import { CREATORS_DATA } from '../data/creators';
import { TRACKERS_DATA } from '../data/trackers';
import { FINDERS_DATA } from '../data/finders';
import { GALLERY_DATA } from '../data/gallery';

export const exportTemplate = () => {
  const wb = XLSX.utils.book_new();

  // Sims Sheet
  const simsData = Object.values(SIMS_DATA).map(sim => ({
    id: sim.id,
    familyId: sim.familyId,
    name: sim.name,
    chineseName: sim.chineseName || '',
    gender: sim.gender,
    age: sim.age,
    maritalStatus: sim.maritalStatus,
    world: sim.world,
    worldId: sim.worldId,
    career: sim.career,
    isHomeless: sim.isHomeless ? 'TRUE' : 'FALSE',
    traits: sim.traits?.map(t => t.name).join(',') || '',
    aspiration: sim.aspiration?.name || '',
    skills: sim.skills?.map(s => `${s.name}:${s.level}`).join(',') || '',
    spouseIds: sim.relationships?.spouse?.map(p => p.id).join(',') || '',
    loverIds: sim.relationships?.lover?.map(l => l.id).join(',') || '',
    childrenIds: sim.relationships?.children?.map(c => c.id).join(',') || '',
    parentsIds: sim.relationships?.parents?.map(p => p.id).join(',') || '',
    siblingIds: sim.relationships?.siblings?.map(s => s.id).join(',') || '',
    grandparentIds: sim.relationships?.grandparents?.map(g => g.id).join(',') || '',
    grandchildIds: sim.relationships?.grandchildren?.map(g => g.id).join(',') || '',
  }));
  const wsSims = XLSX.utils.json_to_sheet(simsData);
  XLSX.utils.book_append_sheet(wb, wsSims, 'Sims');

  // Families Sheet
  const familiesData = Object.values(FAMILIES_DATA).map(fam => ({
    id: fam.id,
    name: fam.name,
    chineseName: fam.chineseName || '',
    description: fam.description || '',
    world: fam.world,
    worldId: fam.worldId,
    lot: fam.lot || '',
    lotId: fam.lotId || '',
    memberIds: fam.members?.map(m => m.id).join(',') || '',
  }));
  const wsFamilies = XLSX.utils.json_to_sheet(familiesData);
  XLSX.utils.book_append_sheet(wb, wsFamilies, 'Families');

  // Lots Sheet
  const lotsData = Object.values(LOTS_DATA).map(lot => ({
    id: lot.id,
    name: lot.name,
    chineseName: lot.chineseName || '',
    size: lot.size,
    worldId: lot.worldId,
    districtId: lot.districtId || '',
    type: lot.type,
    downloadUrl: lot.downloadUrl || '',
    isBuilt: lot.isBuilt ? 'TRUE' : 'FALSE',
  }));
  const wsLots = XLSX.utils.json_to_sheet(lotsData);
  XLSX.utils.book_append_sheet(wb, wsLots, 'Lots');

  // Worlds Sheet
  const worldsData = Object.values(WORLDS_DATA).map(world => ({
    id: world.id,
    name: world.name,
    chineseName: world.chineseName || '',
    description: world.description,
    sizes: world.sizes.join(','),
  }));
  const wsWorlds = XLSX.utils.json_to_sheet(worldsData);
  XLSX.utils.book_append_sheet(wb, wsWorlds, 'Worlds');

  // Districts Sheet
  const districtsData = Object.values(WORLDS_DATA).flatMap(world =>
    world.districts.map(dist => ({
      worldId: world.id,
      id: dist.id,
      name: dist.name,
      description: dist.description,
    }))
  );
  const wsDistricts = XLSX.utils.json_to_sheet(districtsData);
  XLSX.utils.book_append_sheet(wb, wsDistricts, 'Districts');

  // Creators Sheet
  const creatorsData = CREATORS_DATA.map(creator => ({
    id: creator.id,
    name: creator.name,
    favLevel: creator.favLevel,
    types: creator.types.join(','),
    status: creator.status,
    url: creator.url,
  }));
  const wsCreators = XLSX.utils.json_to_sheet(creatorsData);
  XLSX.utils.book_append_sheet(wb, wsCreators, 'Creators');

  // Trackers Sheet
  const trackersData = TRACKERS_DATA.map(cc => ({
    id: cc.id,
    title: cc.title,
    author: cc.author,
    type: cc.type,
    subtype: cc.subtype,
    downloadUrl: cc.downloadUrl,
    translationUrl: cc.translationUrl || '',
  }));
  const wsTrackers = XLSX.utils.json_to_sheet(trackersData);
  XLSX.utils.book_append_sheet(wb, wsTrackers, 'Trackers');

  // Finders Sheet
  const findersData = FINDERS_DATA.map(f => ({
    id: f.id,
    name: f.name,
    url: f.url,
  }));
  const wsFinders = XLSX.utils.json_to_sheet(findersData);
  XLSX.utils.book_append_sheet(wb, wsFinders, 'Finders');

  // Gallery Sheet
  const galleryData = GALLERY_DATA.map(g => ({
    id: g.id,
  }));
  const wsGallery = XLSX.utils.json_to_sheet(galleryData);
  XLSX.utils.book_append_sheet(wb, wsGallery, 'Gallery');

  XLSX.writeFile(wb, 'SimsFiles_Template.xlsx');
};

import { SimSchema, FamilySchema, LotSchema, WorldSchema, CreatorSchema, TrackersSchema, FinderSchema, GallerySchema } from '../types/schemas';

export const importData = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const findSheet = (name: string) => {
          const sheetName = workbook.SheetNames.find(s => s.toLowerCase() === name.toLowerCase());
          return sheetName ? workbook.Sheets[sheetName] : null;
        };

        const getRowVal = (row: any, key: string) => {
          const actualKey = Object.keys(row).find(k => k.trim().toLowerCase() === key.toLowerCase());
          return actualKey ? row[actualKey] : undefined;
        };

        const parseSheet = (name: string) => {
          const sheet = findSheet(name);
          return sheet ? XLSX.utils.sheet_to_json(sheet) : [];
        };

        const rawSims = parseSheet('Sims') as any[];
        const rawFamilies = parseSheet('Families') as any[];
        const rawLots = parseSheet('Lots') as any[];
        const rawWorlds = parseSheet('Worlds') as any[];
        const rawDistricts = parseSheet('Districts') as any[];
        const rawCreators = parseSheet('Creators') as any[];
        const rawTrackers = parseSheet('Trackers') as any[];
        const rawFinders = parseSheet('Finders') as any[];
        const rawGallery = parseSheet('Gallery') as any[];

        console.log('Detected sheets:', workbook.SheetNames);
        console.log(`Raw row counts: Sims:${rawSims.length}, Families:${rawFamilies.length}, Lots:${rawLots.length}, Worlds:${rawWorlds.length}, Creators:${rawCreators.length}, Trackers:${rawTrackers.length}, Finders:${rawFinders.length}, Gallery:${rawGallery.length}`);


        // Process Sims
        const simsData: Record<string, any> = {};
        rawSims.forEach((row, index) => {
          const id = getRowVal(row, 'id');
          if (!id || (typeof id === 'string' && !id.trim())) return;

          const traitsStr = getRowVal(row, 'traits');
          const aspirationStr = getRowVal(row, 'aspiration');
          const skillsStr = getRowVal(row, 'skills');
          const careerStr = getRowVal(row, 'career');
          const homelessVal = getRowVal(row, 'isHomeless');

          const processedSim = {
            id: String(id).trim(),
            familyId: String(getRowVal(row, 'familyId') || '').trim(),
            name: String(getRowVal(row, 'name') || '').trim(),
            chineseName: getRowVal(row, 'chineseName') ? String(getRowVal(row, 'chineseName')).trim() : undefined,
            gender: String(getRowVal(row, 'gender') || '').trim(),
            age: String(getRowVal(row, 'age') || '').trim(),
            maritalStatus: String(getRowVal(row, 'maritalStatus') || '').trim(),
            world: String(getRowVal(row, 'world') || '').trim(),
            worldId: String(getRowVal(row, 'worldId') || '').trim(),
            career: careerStr ? String(careerStr).trim() : '',
            isHomeless: homelessVal === 'TRUE' || homelessVal === true,
            traits: traitsStr ? String(traitsStr).split(',').map((t: string) => ({ name: t.trim() })) : undefined,
            aspiration: aspirationStr ? { name: String(aspirationStr).trim() } : undefined,
            skills: skillsStr ? String(skillsStr).split(',').map((s: string) => {
              const parts = s.split(':');
              if (parts.length < 2) return { name: s.trim(), level: 1 };
              const [name, level] = parts;
              return { name: name.trim(), level: parseInt(level) || 1 };
            }) : undefined,
            relationships: {
              spouse: getRowVal(row, 'spouseIds') ? String(getRowVal(row, 'spouseIds')).split(',').map((id: string) => ({ id: id.trim() })) : undefined,
              lover: getRowVal(row, 'loverIds') ? String(getRowVal(row, 'loverIds')).split(',').map((id: string) => ({ id: id.trim() })) : undefined,
              children: getRowVal(row, 'childrenIds') ? String(getRowVal(row, 'childrenIds')).split(',').map((id: string) => ({ id: id.trim() })) : undefined,
              parents: getRowVal(row, 'parentsIds') ? String(getRowVal(row, 'parentsIds')).split(',').map((id: string) => ({ id: id.trim() })) : undefined,
              siblings: getRowVal(row, 'siblingIds') ? String(getRowVal(row, 'siblingIds')).split(',').map((id: string) => ({ id: id.trim() })) : undefined,
              grandparents: getRowVal(row, 'grandparentIds') ? String(getRowVal(row, 'grandparentIds')).split(',').map((id: string) => ({ id: id.trim() })) : undefined,
              grandchildren: getRowVal(row, 'grandchildIds') ? String(getRowVal(row, 'grandchildIds')).split(',').map((id: string) => ({ id: id.trim() })) : undefined,
            }
          };

          const result = SimSchema.safeParse(processedSim);
          if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
            throw new Error(`Sims Sheet Row ${index + 2} ("${processedSim.name}") is invalid. Problems: ${issues}`);
          }
          simsData[processedSim.id] = result.data;
        });

        // Process Families
        const familiesData: Record<string, any> = {};
        rawFamilies.forEach((row, index) => {
          const id = getRowVal(row, 'id');
          if (!id || (typeof id === 'string' && !id.trim())) return;
          const processedFamily = {
            id: String(id).trim(),
            name: String(getRowVal(row, 'name') || '').trim(),
            chineseName: getRowVal(row, 'chineseName') ? String(getRowVal(row, 'chineseName')).trim() : undefined,
            description: getRowVal(row, 'description') ? String(getRowVal(row, 'description')).trim() : undefined,
            world: String(getRowVal(row, 'world') || '').trim(),
            worldId: String(getRowVal(row, 'worldId') || '').trim(),
            lot: getRowVal(row, 'lot') ? String(getRowVal(row, 'lot')).trim() : undefined,
            lotId: getRowVal(row, 'lotId') ? String(getRowVal(row, 'lotId')).trim() : undefined,
            members: getRowVal(row, 'memberIds') ? String(getRowVal(row, 'memberIds')).split(',').map((id: string) => ({ id: id.trim() })) : undefined,
          };

          const result = FamilySchema.safeParse(processedFamily);
          if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
            throw new Error(`Families Sheet Row ${index + 2} ("${processedFamily.name}") is invalid. Problems: ${issues}`);
          }
          familiesData[processedFamily.id] = result.data;
        });

        // Process Lots
        const lotsData: Record<string, any> = {};
        rawLots.forEach((row, index) => {
          const id = getRowVal(row, 'id');
          if (!id || (typeof id === 'string' && !id.trim())) return;
          const builtVal = getRowVal(row, 'isBuilt');
          const processedLot = {
            id: String(id).trim(),
            name: String(getRowVal(row, 'name') || '').trim(),
            chineseName: getRowVal(row, 'chineseName') ? String(getRowVal(row, 'chineseName')).trim() : undefined,
            size: String(getRowVal(row, 'size') || '').trim(),
            worldId: String(getRowVal(row, 'worldId') || '').trim(),
            districtId: getRowVal(row, 'districtId') ? String(getRowVal(row, 'districtId')).trim() : undefined,
            type: String(getRowVal(row, 'type') || 'Residential').trim(),
            downloadUrl: getRowVal(row, 'downloadUrl') ? String(getRowVal(row, 'downloadUrl')).trim() : undefined,
            isBuilt: builtVal === 'TRUE' || builtVal === true,
          };

          const result = LotSchema.safeParse(processedLot);
          if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
            throw new Error(`Lots Sheet Row ${index + 2} ("${processedLot.name}") is invalid. Problems: ${issues}`);
          }
          lotsData[processedLot.id] = result.data;
        });

        // Process Worlds and Districts
        const worldsData: Record<string, any> = {};
        rawWorlds.forEach((row, index) => {
          const id = getRowVal(row, 'id');
          if (!id || (typeof id === 'string' && !id.trim())) return;
          const processedWorld = {
            id: String(id).trim(),
            name: String(getRowVal(row, 'name') || '').trim(),
            chineseName: getRowVal(row, 'chineseName') ? String(getRowVal(row, 'chineseName')).trim() : undefined,
            description: String(getRowVal(row, 'description') || '').trim(),
            sizes: getRowVal(row, 'sizes') ? String(getRowVal(row, 'sizes')).split(',').map((s: string) => s.trim()) : [],
            districts: rawDistricts.filter(d => String(getRowVal(d, 'worldId')).trim() === String(id).trim()).map(d => ({
              id: String(getRowVal(d, 'id')).trim(),
              name: String(getRowVal(d, 'name') || '').trim(),
              description: String(getRowVal(d, 'description') || '').trim(),
            }))
          };

          const result = WorldSchema.safeParse(processedWorld);
          if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
            throw new Error(`Worlds Sheet Row ${index + 2} ("${processedWorld.name}") is invalid. Problems: ${issues}`);
          }
          worldsData[processedWorld.id] = result.data;
        });

        // Process Creators
        const creatorsData = rawCreators.filter(row => getRowVal(row, 'id') && String(getRowVal(row, 'id')).trim()).map((row, index) => {
          const name = getRowVal(row, 'name');
          const processed = {
            id: String(getRowVal(row, 'id')).trim(),
            name: String(name || '').trim(),
            favLevel: String(getRowVal(row, 'favLevel') || 'A').trim(),
            types: getRowVal(row, 'types') ? String(getRowVal(row, 'types')).split(',').map((t: string) => t.trim()) : [],
            status: String(getRowVal(row, 'status') || '').trim(),
            url: String(getRowVal(row, 'url') || '').trim(),
          };
          const result = CreatorSchema.safeParse(processed);
          if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
            throw new Error(`Creators Sheet Row ${index + 2} ("${processed.name}") is invalid. Problems: ${issues}`);
          }
          return result.data;
        });

        // Process Trackers
        const trackersData = rawTrackers.filter(row => getRowVal(row, 'id') && String(getRowVal(row, 'id')).trim()).map((row, index) => {
          const title = getRowVal(row, 'title');
          const processed = {
            id: String(getRowVal(row, 'id')).trim(),
            title: String(title || '').trim(),
            author: String(getRowVal(row, 'author') || '').trim(),
            type: String(getRowVal(row, 'type') || '').trim(),
            subtype: String(getRowVal(row, 'subtype') || '').trim(),
            downloadUrl: String(getRowVal(row, 'downloadUrl') || '').trim(),
            translationUrl: getRowVal(row, 'translationUrl') ? String(getRowVal(row, 'translationUrl')).trim() : undefined,
          };
          const result = TrackersSchema.safeParse(processed);
          if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
            throw new Error(`Trackers Sheet Row ${index + 2} ("${processed.title}") is invalid. Problems: ${issues}`);
          }
          return result.data;
        });

        // Process Finders
        const findersData = rawFinders.filter(row => getRowVal(row, 'id') && String(getRowVal(row, 'id')).trim()).map((row, index) => {
          const name = getRowVal(row, 'name');
          const processed = {
            id: String(getRowVal(row, 'id')).trim(),
            name: String(name || '').trim(),
            url: String(getRowVal(row, 'url') || '').trim(),
          };
          const result = FinderSchema.safeParse(processed);
          if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
            throw new Error(`Finders Sheet Row ${index + 2} ("${processed.name}") is invalid. Problems: ${issues}`);
          }
          return result.data;
        });

        // Process Gallery
        const galleryData = rawGallery.filter(row => getRowVal(row, 'id') && String(getRowVal(row, 'id')).trim()).map((row, index) => {
          const processed = { id: String(getRowVal(row, 'id')).trim() };
          const result = GallerySchema.safeParse(processed);
          if (!result.success) throw new Error(`Gallery Sheet Row ${index + 2} is invalid`);
          return result.data;
        });

        // Check if anything was imported
        const totalCount = Object.keys(simsData).length +
          Object.keys(familiesData).length +
          Object.keys(lotsData).length +
          Object.keys(worldsData).length +
          creatorsData.length +
          trackersData.length +
          findersData.length +
          galleryData.length;

        if (totalCount === 0) {
          throw new Error('No valid data found in the uploaded file. Please ensure you haven\'t renamed the sheets (Sims, Families, Lots, etc.).');
        }

        // Save to localStorage
        localStorage.setItem('sims_data_sims', JSON.stringify(simsData));
        localStorage.setItem('sims_data_families', JSON.stringify(familiesData));
        localStorage.setItem('sims_data_lots', JSON.stringify(lotsData));
        localStorage.setItem('sims_data_worlds', JSON.stringify(worldsData));
        localStorage.setItem('sims_data_creators', JSON.stringify(creatorsData));
        localStorage.setItem('sims_data_trackers', JSON.stringify(trackersData));
        localStorage.setItem('sims_data_finders', JSON.stringify(findersData));
        localStorage.setItem('sims_data_gallery', JSON.stringify(galleryData));

        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const clearImportedData = () => {
  localStorage.removeItem('sims_data_sims');
  localStorage.removeItem('sims_data_families');
  localStorage.removeItem('sims_data_lots');
  localStorage.removeItem('sims_data_worlds');
  localStorage.removeItem('sims_data_creators');
  localStorage.removeItem('sims_data_trackers');
  localStorage.removeItem('sims_data_finders');
  localStorage.removeItem('sims_data_gallery');
};
