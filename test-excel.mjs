import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = process.cwd();
const excelPath = path.join(projectRoot, 'public', 'data.xlsx');

const fileBuffer = fs.readFileSync(excelPath);
// Mock File object
const file = new File([fileBuffer], "data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

import { importData } from './src/utils/excel.ts';

importData(file).then(() => {
    console.log("Import success");
}).catch(err => {
    console.error("Import failed:", err);
});
