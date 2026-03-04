import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const excelPath = 'public/data.xlsx';

async function fetchWikiData(name) {
    try {
        let searchQueries = [];
        const parts = name.split(' ');

        if (parts.length === 2) {
            // Try standard "First Last" and "Last First"
            const firstLast = `${parts[1]} ${parts[0]}`;
            const lastFirst = `${parts[0]} ${parts[1]}`;

            searchQueries.push(`"${firstLast}"`);
            searchQueries.push(`"${lastFirst}"`);
            searchQueries.push(`"${firstLast}" (The Sims 4)`);
        } else {
            searchQueries.push(`"${name}"`);
        }

        let bestTitle = null;
        for (const query of searchQueries) {
            const searchUrl = `https://sims.fandom.com/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();

            if (searchData.query?.search?.length) {
                // Find first result that contains the sim's name parts
                const match = searchData.query.search.find(s => {
                    const title = s.title.toLowerCase();
                    return parts.every(p => title.includes(p.toLowerCase()));
                });

                if (match) {
                    bestTitle = match.title;
                    break;
                }
            }
        }

        if (!bestTitle) return null;

        // Fetch content
        const contentUrl = `https://sims.fandom.com/api.php?action=query&prop=revisions&titles=${encodeURIComponent(bestTitle)}&rvprop=content&format=json`;
        const contentRes = await fetch(contentUrl);
        const contentData = await contentRes.json();

        const pages = contentData.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId === '-1') return null;

        const content = pages[pageId].revisions[0]['*'];
        return parseInfobox(content);
    } catch (e) {
        console.error(`Error fetching ${name}:`, e.message);
        return null;
    }
}

function parseInfobox(content) {
    const data = {};
    const infoboxMatch = content.match(/\{\{Infobox Sim[^\n]*([\s\S]*?)\}\}/i);
    if (!infoboxMatch) return data;

    const infobox = infoboxMatch[0];
    const fields = [
        ['gender', ['gender', 'sex']],
        ['age', ['age']],
        ['marital', ['marital', 'maritalStatus', 'relation']],
        ['career', ['career', 'job']],
        ['traits', ['traits', 'trait1', 'trait2', 'trait3', 'trait4']],
        ['aspiration', ['asp', 'aspiration']],
        ['skills', ['skills', 'skill']]
    ];

    for (const [key, aliases] of fields) {
        let value = '';
        for (const alias of aliases) {
            const regex = new RegExp(`\\|\\s*${alias}\\s*=\\s*([^\\|\\}\\n]*)`, 'i');
            const match = infobox.match(regex);
            if (match && match[1].trim()) {
                let val = match[1].trim()
                    .replace(/\[\[([^|\]]+\|)?([^\]]+)\]\]/g, '$2')
                    .replace(/\{\{[^}]+\}\}/g, '')
                    .replace(/<[^>]+>/g, '')
                    .trim();

                if (key === 'traits' && alias.startsWith('trait')) {
                    value = value ? `${value}, ${val}` : val;
                } else if (!value) {
                    value = val;
                    break;
                }
            }
        }
        if (value) data[key] = value;
    }
    return data;
}

async function main() {
    const limit = process.argv.includes('--limit') ? parseInt(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
    const dryRun = process.argv.includes('--dry-run');

    if (!fs.existsSync(excelPath)) {
        console.error('File not found:', excelPath);
        process.exit(1);
    }

    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames.find(n => n.toLowerCase() === 'sims');
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    console.log(`Processing ${Math.min(rows.length, limit)} Sims...`);

    for (let i = 0; i < Math.min(rows.length, limit); i++) {
        const row = rows[i];
        const name = row.name;
        if (!name) continue;

        process.stdout.write(`Fetching [${i + 1}/${Math.min(rows.length, limit)}] ${name}... `);
        const wikiData = await fetchWikiData(name);

        if (wikiData) {
            // Map Wiki keys to Excel keys (Matching user requested names exactly)
            if (wikiData.gender) row.Gender = wikiData.gender;
            if (wikiData.age) {
                let age = wikiData.age;
                if (age === 'Young Audlt') age = 'Young Adult'; // Fix wiki typo
                row.Age = age;
            }
            if (wikiData.marital) row.maritalStatus = wikiData.marital;
            if (wikiData.career) row.Career = wikiData.career;
            if (wikiData.traits) row.Traits = wikiData.traits;
            if (wikiData.aspiration) row.Aspiration = wikiData.aspiration;
            if (wikiData.skills) row.Skills = wikiData.skills;

            console.log(`OK`);
        } else {
            console.log(`FAILED`);
        }

        await new Promise(r => setTimeout(r, 200));
    }

    if (!dryRun) {
        workbook.Sheets[sheetName] = xlsx.utils.json_to_sheet(rows);
        xlsx.writeFile(workbook, excelPath);
        console.log('Database updated.');
    } else {
        console.log('Dry run finished.');
    }
}

main();
