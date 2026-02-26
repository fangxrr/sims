import fs from 'fs';
import path from 'path';

const dir = './src/data';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'generated.ts');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find start and end indices
  const tryIndex = content.indexOf('  try {\n    const stored = localStorage.getItem');
  if (tryIndex !== -1) {
      const catchIndex = content.indexOf('  } catch (e) {');
      const endCatchIndex = content.indexOf('  }\n', catchIndex) + 4;
      
      if (catchIndex !== -1 && endCatchIndex !== -1) {
          content = content.substring(0, tryIndex) + content.substring(endCatchIndex);
          fs.writeFileSync(filePath, content);
          console.log(`Updated ${file}`);
      }
  }
});
