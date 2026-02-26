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

    const normalizeId = (id) => {
        if (!id) return id;
        // IDs should be lowercase for routing and consistency
        return String(id).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const getImagePath = (id, subfolder) => {
        if (!id) return undefined;
        // Preserves casing for the filename part
        const filename = String(id).trim().replace(/\s+/g, '-');
        return `/images/${subfolder}/${filename}.jpg`;
    };

    const parseRefs = (str) => {
        if (!str) return [];
        if (typeof str !== 'string') return [{ id: normalizeId(str) }];
        return str.split(',').map(s => ({ id: normalizeId(s.trim()) })).filter(r => r.id);
    };

    // 1. Sims
    const rawSims = getSheet('Sims');
    console.log(`Raw Sims found: ${rawSims.length}.`);

    const simsData = rawSims.map(row => {
        const rawId = getRowVal(row, 'id');
        const rawName = getRowVal(row, 'name');
        const id = normalizeId(rawId || rawName);

        return {
            id,
            familyId: normalizeId(getRowVal(row, 'familyId')),
            name: rawName,
            chineseName: getRowVal(row, 'chineseName'),
            gender: getRowVal(row, 'gender'),
            age: getRowVal(row, 'age'),
            maritalStatus: getRowVal(row, 'maritalStatus'),
            world: getRowVal(row, 'world'),
            worldId: normalizeId(getRowVal(row, 'worldId')),
            image: getImagePath(rawId || rawName, 'sims'),
            career: getRowVal(row, 'career'),
            aspiration: { name: getRowVal(row, 'aspiration') },
            skills: parseArray(getRowVal(row, 'skills'))?.map(s => {
                const parts = s.split(':');
                return { name: parts[0]?.trim(), level: parseInt(parts[1]?.trim() || '1') };
            }) || [],
            relationships: {
                spouse: parseRefs(getRowVal(row, 'spouseIds') || getRowVal(row, 'spouse')),
                lover: parseRefs(getRowVal(row, 'loverIds') || getRowVal(row, 'lover')),
                parents: parseRefs(getRowVal(row, 'parentsIds') || getRowVal(row, 'parents')),
                children: parseRefs(getRowVal(row, 'childrenIds') || getRowVal(row, 'children')),
                siblings: parseRefs(getRowVal(row, 'siblingIds') || getRowVal(row, 'siblings')),
                grandparents: parseRefs(getRowVal(row, 'grandparentIds') || getRowVal(row, 'grandparents')),
                grandchildren: parseRefs(getRowVal(row, 'grandchildIds') || getRowVal(row, 'grandchildren')),
            }
        };
    }).filter(row => row.id);

    // 2. Families
    const rawFamilies = getSheet('Families');
    const familiesData = rawFamilies.map(row => {
        const rawId = getRowVal(row, 'id');
        const rawName = getRowVal(row, 'name');
        return {
            id: normalizeId(rawId || rawName),
            name: rawName,
            chineseName: getRowVal(row, 'chineseName'),
            world: getRowVal(row, 'world'),
            address: getRowVal(row, 'address'),
            lotId: normalizeId(getRowVal(row, 'lotId')),
            worldId: normalizeId(getRowVal(row, 'worldId')),
            image: getImagePath(rawId || rawName, 'families'),
            description: getRowVal(row, 'description'),
            sims: parseRefs(getRowVal(row, 'sims')) || []
        };
    }).filter(row => row.id);

    // 3. Lots
    const rawLots = getSheet('Lots');
    const lotsData = rawLots.map(row => {
        const rawId = getRowVal(row, 'id');
        const rawName = getRowVal(row, 'name');
        return {
            id: normalizeId(rawId || rawName),
            name: rawName || rawId,
            type: getRowVal(row, 'type'),
            price: getRowVal(row, 'price') ? parseInt(getRowVal(row, 'price')) : 0,
            size: getRowVal(row, 'size'),
            world: getRowVal(row, 'world'),
            worldId: normalizeId(getRowVal(row, 'worldId')),
            address: getRowVal(row, 'address'),
            districtId: normalizeId(getRowVal(row, 'districtId')),
            image: getImagePath(rawId || rawName, 'lots'),
            chineseName: getRowVal(row, 'chineseName'),
            description: getRowVal(row, 'description'),
            bedrooms: getRowVal(row, 'bedrooms') ? parseInt(getRowVal(row, 'bedrooms')) : undefined,
            bathrooms: getRowVal(row, 'bathrooms') ? parseInt(getRowVal(row, 'bathrooms')) : undefined,
            creator: getRowVal(row, 'creator'),
            downloadUrl: getRowVal(row, 'downloadUrl'),
            isDownloaded: String(getRowVal(row, 'isDownloaded')) === 'true' || getRowVal(row, 'isDownloaded') === true,
            isBuilt: String(getRowVal(row, 'isBuilt')) === 'true' || getRowVal(row, 'isBuilt') === true
        };
    }).filter(row => row.id);

    // 4. Worlds
    const rawWorlds = getSheet('Worlds');
    const worldsData = rawWorlds.map(row => {
        const rawId = getRowVal(row, 'id');
        const rawName = getRowVal(row, 'name');
        return {
            id: normalizeId(rawId || rawName),
            name: rawName,
            chineseName: getRowVal(row, 'chineseName'),
            description: getRowVal(row, 'description'),
            image: getImagePath(rawId || rawName, 'worlds'),
            sizes: parseArray(getRowVal(row, 'sizes')) || [],
            pack: getRowVal(row, 'pack'),
        };
    }).filter(row => row.id);

    // 5. Districts
    const rawDistricts = getSheet('Districts');
    const districtsData = rawDistricts.map(row => {
        const rawId = getRowVal(row, 'id');
        const rawName = getRowVal(row, 'name');
        return {
            id: normalizeId(rawId || rawName),
            worldId: normalizeId(getRowVal(row, 'worldId')),
            name: getRowVal(row, 'name'),
            image: getImagePath(rawId || rawName, 'worlds/districts'),
            chineseName: getRowVal(row, 'chineseName'),
            description: getRowVal(row, 'description'),
            lots: parseRefs(getRowVal(row, 'lots')) || []
        };
    }).filter(row => row.id);

    // 6. Creators
    const rawCreators = getSheet('Creators');
    const creatorsData = rawCreators.filter(row => getRowVal(row, 'id')).map(row => ({
        id: normalizeId(getRowVal(row, 'id')),
        name: getRowVal(row, 'name'),
        favLevel: getRowVal(row, 'favLevel'),
        types: parseArray(getRowVal(row, 'types')) || [],
        status: getRowVal(row, 'status'),
        url: getRowVal(row, 'url')
    }));

    // 7. Trackers
    const rawTrackers = getSheet('Trackers');
    const trackersData = rawTrackers.filter(row => getRowVal(row, 'id')).map(row => ({
        id: normalizeId(getRowVal(row, 'id')),
        title: getRowVal(row, 'title'),
        author: getRowVal(row, 'author'),
        type: getRowVal(row, 'type'),
        subtype: getRowVal(row, 'subtype'),
        downloadUrl: getRowVal(row, 'downloadUrl'),
        translationUrl: getRowVal(row, 'translationUrl')
    }));

    const rawFinders = getSheet('Finders');
    const findersData = rawFinders.filter(row => getRowVal(row, 'id')).map(row => ({
        id: normalizeId(getRowVal(row, 'id')),
        name: getRowVal(row, 'name'),
        url: getRowVal(row, 'url')
    }));

    const rawGallery = getSheet('Gallery');
    const galleryData = rawGallery.filter(row => getRowVal(row, 'id')).map(row => ({
        id: normalizeId(getRowVal(row, 'id'))
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
