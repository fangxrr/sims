import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const excelPath = path.join(projectRoot, 'public', 'data.xlsx');
const outputPath = path.join(projectRoot, 'src', 'data', 'generated.ts');

// Check if excel file exists
if (!fs.existsSync(excelPath)) {
    console.log('No data.xlsx found in public/. Skipping build-time excel import.');
    fs.writeFileSync(outputPath, `export default ${JSON.stringify({
        sims: [], families: [], lots: [], worlds: [],
        districts: [], creators: [], trackers: [],
        finders: [], gallery: []
    }, null, 2)};`);
    process.exit(0);
}

console.log('Found public/data.xlsx. Parsing...');

try {
    const fileData = fs.readFileSync(excelPath);
    const workbook = xlsx.read(fileData, { type: 'buffer' });

    const getSheet = (name) => {
        const sheetName = workbook.SheetNames.find(s => s.toLowerCase() === name.toLowerCase());
        if (!sheetName) return [];
        return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    };

    const getRowVal = (row, key) => {
        const actualKey = Object.keys(row).find(k => k.trim().toLowerCase() === key.toLowerCase());
        return actualKey ? row[actualKey] : undefined;
    };

    const parseArray = (str) => {
        if (!str) return [];
        if (typeof str !== 'string') return [str];
        return str.split(',').map(s => s.trim()).filter(Boolean);
    };

    const parseRefs = (str) => {
        if (!str) return [];
        if (typeof str !== 'string') return [{ id: str }];
        return str.split(',').map(s => ({ id: s.trim() })).filter(r => r.id);
    };

    // 1. Sims
    const rawSims = getSheet('Sims');
    const simsData = rawSims.map(row => ({
        id: getRowVal(row, 'id'),
        familyId: getRowVal(row, 'familyId'),
        name: getRowVal(row, 'name'),
        chineseName: getRowVal(row, 'chineseName'),
        gender: getRowVal(row, 'gender'),
        age: getRowVal(row, 'age'),
        maritalStatus: getRowVal(row, 'maritalStatus'),
        world: getRowVal(row, 'world'),
        worldId: getRowVal(row, 'worldId'),
        career: getRowVal(row, 'career'),
        aspiration: { name: getRowVal(row, 'aspiration') },
        skills: parseArray(getRowVal(row, 'skills'))?.map(s => {
            const parts = s.split(':');
            return { name: parts[0]?.trim(), level: parseInt(parts[1]?.trim() || '1') };
        }) || [],
        relationships: {
            spouse: parseRefs(getRowVal(row, 'spouse')),
            lover: parseRefs(getRowVal(row, 'lover')),
            parents: parseRefs(getRowVal(row, 'parents')),
            children: parseRefs(getRowVal(row, 'children')),
            siblings: parseRefs(getRowVal(row, 'siblings')),
            grandparents: parseRefs(getRowVal(row, 'grandparents')),
            grandchildren: parseRefs(getRowVal(row, 'grandchildren')),
        }
    }));

    // 2. Families
    const rawFamilies = getSheet('Families');
    const familiesData = rawFamilies.map(row => ({
        id: getRowVal(row, 'id'),
        name: getRowVal(row, 'name'),
        chineseName: getRowVal(row, 'chineseName'),
        world: getRowVal(row, 'world'),
        address: getRowVal(row, 'address'),
        lotId: getRowVal(row, 'lotId'),
        description: getRowVal(row, 'description'),
        sims: parseRefs(getRowVal(row, 'sims')) || []
    }));

    // 3. Lots
    const rawLots = getSheet('Lots');
    const lotsData = rawLots.map(row => ({
        id: getRowVal(row, 'id'),
        name: getRowVal(row, 'name'),
        type: getRowVal(row, 'type'),
        price: getRowVal(row, 'price') ? parseInt(getRowVal(row, 'price')) : 0,
        size: getRowVal(row, 'size'),
        world: getRowVal(row, 'world'),
        worldId: getRowVal(row, 'worldId'),
        address: getRowVal(row, 'address'),
        description: getRowVal(row, 'description'),
        bedrooms: getRowVal(row, 'bedrooms') ? parseInt(getRowVal(row, 'bedrooms')) : undefined,
        bathrooms: getRowVal(row, 'bathrooms') ? parseInt(getRowVal(row, 'bathrooms')) : undefined,
        creator: getRowVal(row, 'creator'),
        downloadUrl: getRowVal(row, 'downloadUrl'),
        isDownloaded: getRowVal(row, 'isDownloaded') === 'true' || getRowVal(row, 'isDownloaded') === true
    }));

    // 4. Worlds
    const rawWorlds = getSheet('Worlds');
    const worldsData = rawWorlds.map(row => ({
        id: getRowVal(row, 'id'),
        name: getRowVal(row, 'name'),
        chineseName: getRowVal(row, 'chineseName'),
        description: getRowVal(row, 'description'),
        sizes: parseArray(getRowVal(row, 'sizes')) || [],
        pack: getRowVal(row, 'pack'),
    }));

    // 5. Districts
    const rawDistricts = getSheet('Districts');
    const districtsData = rawDistricts.map(row => ({
        id: getRowVal(row, 'id'),
        worldId: getRowVal(row, 'worldId'),
        name: getRowVal(row, 'name'),
        chineseName: getRowVal(row, 'chineseName'),
        description: getRowVal(row, 'description'),
        lots: parseRefs(getRowVal(row, 'lots')) || []
    }));

    // 6. Creators
    const rawCreators = getSheet('Creators');
    const creatorsData = rawCreators.map(row => ({
        id: getRowVal(row, 'id'),
        name: getRowVal(row, 'name'),
        favLevel: getRowVal(row, 'favLevel'),
        types: parseArray(getRowVal(row, 'types')) || [],
        status: getRowVal(row, 'status'),
        url: getRowVal(row, 'url')
    }));

    // 7. Trackers
    const rawTrackers = getSheet('Trackers');
    const trackersData = rawTrackers.map(row => ({
        id: getRowVal(row, 'id'),
        title: getRowVal(row, 'title'),
        author: getRowVal(row, 'author'),
        type: getRowVal(row, 'type'),
        subtype: getRowVal(row, 'subtype'),
        downloadUrl: getRowVal(row, 'downloadUrl'),
        translationUrl: getRowVal(row, 'translationUrl')
    }));

    const rawFinders = getSheet('Finders');
    const findersData = rawFinders.map(row => ({
        id: getRowVal(row, 'id'),
        name: getRowVal(row, 'name'),
        url: getRowVal(row, 'url')
    }));

    const rawGallery = getSheet('Gallery');
    const galleryData = rawGallery.map(row => ({
        id: getRowVal(row, 'id')
    }));

    const fullData = {
        sims: simsData,
        families: familiesData,
        lots: lotsData,
        worlds: worldsData,
        districts: districtsData,
        creators: creatorsData,
        trackers: trackersData,
        finders: findersData,
        gallery: galleryData
    };

    fs.writeFileSync(outputPath, `export default ${JSON.stringify(fullData, null, 2)};`);
    console.log(`Successfully generated src/data/generated.ts with ${simsData.length} sims, ${familiesData.length} families.`);

} catch (error) {
    console.error("Error parsing excel file:", error);
    process.exit(1);
}
