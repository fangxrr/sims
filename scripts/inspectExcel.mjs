import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const excelPath = 'public/data.xlsx';

if (!fs.existsSync(excelPath)) {
    console.error('File not found:', excelPath);
    process.exit(1);
}

const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames.find(n => n.toLowerCase() === 'sims');

if (!sheetName) {
    console.error('Sims sheet not found');
    console.log('Available sheets:', workbook.SheetNames);
    process.exit(1);
}

const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
console.log(JSON.stringify(data.slice(0, 5), null, 2));
console.log('Total Sims:', data.length);
