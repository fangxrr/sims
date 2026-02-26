import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as xlsx from 'xlsx';

const projectRoot = process.cwd();
const excelPath = path.join(projectRoot, 'public', 'data.xlsx');

const fileData = fs.readFileSync(excelPath);
const workbook = xlsx.read(fileData, { type: 'buffer' });

const getSheet = (name) => {
    const sheetName = workbook.SheetNames.find(s => s.toLowerCase() === name.toLowerCase());
    if (!sheetName) return [];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" }); // Add defval to see all columns
};

const getRowVal = (row, key) => {
    const actualKey = Object.keys(row).find(k => k.trim().toLowerCase() === key.toLowerCase());
    return actualKey ? row[actualKey] : undefined;
};

const parseArray = (str) => {
    if (!str) return [];
    if (typeof str !== 'string') return [String(str)];
    return String(str).split(',').map(s => s.trim()).filter(Boolean);
};

// ... simplified Creators check
const rawCreators = getSheet('Creators');
const creatorsData = rawCreators.map(row => ({
    id: getRowVal(row, 'id'),
    name: getRowVal(row, 'name'),
    favLevel: getRowVal(row, 'favLevel'),
    types: parseArray(getRowVal(row, 'types')) || [],
    status: getRowVal(row, 'status'),
    url: getRowVal(row, 'url')
}));

console.log("Creators Data Count:", creatorsData.length);
if (creatorsData.length > 0) {
    console.log("Sample Creator:");
    console.log(JSON.stringify(creatorsData[0], null, 2));
}

const rawWorlds = getSheet('Worlds');
const worldsData = rawWorlds.map(row => ({
    id: String(getRowVal(row, 'id') || ''),
    name: String(getRowVal(row, 'name') || ''),
    description: String(getRowVal(row, 'description') || ''),
    sizes: parseArray(getRowVal(row, 'sizes')) || [],
}));

console.log("\nWorlds Data 'lovestuck':");
console.log(JSON.stringify(worldsData.filter(w => w.id === 'lovestuck'), null, 2));

const rawSims = getSheet('Sims');
const simsData = rawSims.map((row, index) => ({
    row: index + 2,
    id: String(getRowVal(row, 'id') || ''),
    name: String(getRowVal(row, 'name') || ''),
}));
console.log("\nSims Data 'haha':");
console.log(JSON.stringify(simsData.filter(s => s.id.includes('haha')), null, 2));

const rawFamilies = getSheet('Families');
const familiesData = rawFamilies.map((row, index) => ({
    row: index + 2,
    id: String(getRowVal(row, 'id') || ''),
    name: String(getRowVal(row, 'name') || ''),
}));
console.log("\nFamilies Data 'fangfang':");
console.log(JSON.stringify(familiesData.filter(s => s.id.includes('fangfang') || s.name.includes('fangfang')), null, 2));
