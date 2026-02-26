import fs from 'fs';
import https from 'https';
import path from 'path';

const items = {
  creators: ['greenllama', 'peacemaker', 'sentate', 'aharris00britney', 'felixandre', 'harrie', 'simstrouble', 'johnnysims', 'rusty', 'clumsyalien', 'twistedmexi', 'lumpinou'],
  sims: ['GothMortimer', 'GothBella', 'GothCassandra', 'GothAlexander', 'KimDennis', 'SpencerLydia', 'SpencerKimAlice', 'LewisEric', 'KimLewisOlivia', 'PancakesBob', 'PancakesEliza', 'HolidaySummer', 'ScottTravis', 'LeeLiberty'],
  families: ['goth', 'spencer-kim-lewis', 'pancakes', 'bff', 'landgraab', 'caliente', 'zest', 'roomies', 'villareal', 'fyres', 'bjergsen', 'bro', 'karaoke', 'pizza'],
  lots: ['crick-cabana', 'daisy-hovel', 'garden-essence', 'streamlet-single', 'brook-bungalow', 'pique-hearth', 'potters-splay', 'riverside-roost', 'opus-hall', 'umbrage-manor', 'ophelia-villa', 'cypress-terrace', 'blue-velvet', 'movers-shakers', 'municipal-muses', 'magnolia-blossom', 'pebble-burrow', 'dusty-turf', 'nookstone', 'sandtrap-flat', 'rattlesnake-juice', 'solar-flare', 'future-past', 'desert-bloom'],
  worlds: ['willow-creek', 'oasis-springs', 'newcrest', 'san-myshuno', 'windenburg'],
  'worlds/districts': ['foundry-cove', 'courtyard-lane', 'sage-estates'],
  finders: ['maxis-match-cc-world', 'snootysims', 'the-sims-resource', 'mod-the-sims', 'sims-4-updates', 'lilsimsie-cc-finds'],
  gallery: ['gal1', 'gal2', 'gal3', 'gal4', 'gal5', 'gal6', 'gal7', 'gal8', 'gal9', 'gal10', 'gal11', 'gal12'],
  trackers: ['goth-galore-hair', 'mid-century-modern-sofa', 'better-buildbuy', 'woohoo-wellness', 'vintage-glamour-dress', 'rustic-kitchen-counters', 'chunky-boots', 'messy-male-hair', 'mc-command-center', 'boho-bedroom-set']
};

async function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location!, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  const tempDir = path.join(process.cwd(), 'temp_mocks');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  console.log('Downloading 10 base mock images from picsum...');
  const baseImages: string[] = [];
  
  const downloadTasks = [];
  for (let i = 1; i <= 10; i++) {
    const dest = path.join(tempDir, `mock${i}.jpg`);
    baseImages.push(dest);
    if (!fs.existsSync(dest)) {
      downloadTasks.push(downloadImage(`https://picsum.photos/seed/simsmock${i}/600/600`, dest));
    }
  }
  
  await Promise.all(downloadTasks);

  console.log('Copying images to respective public/images folders...');
  for (const [dir, ids] of Object.entries(items)) {
    const dirPath = path.join(process.cwd(), 'public', 'images', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const dest = path.join(dirPath, `${id}.jpg`);
      const baseImage = baseImages[i % baseImages.length];
      fs.copyFileSync(baseImage, dest);
    }
  }
  
  console.log('Done! All mock images generated successfully.');
}

main().catch(console.error);
