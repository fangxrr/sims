import fs from 'fs';
import path from 'path';

const dir = './src/data';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'generated.ts');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /^[ \t]*try \{\s*const stored = localStorage\.getItem\('[^']+'\);[\s\S]*?\} catch \(e\) \{\s*console\.error\([^)]+\);\s*\}[ \t]*\n?/gm;
  
  const newContent = content.replace(regex, '');
  if(content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${file}`);
  }
});
