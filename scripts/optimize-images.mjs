import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imgDir = './public/img';
const files = fs.readdirSync(imgDir);

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const name = path.basename(file, ext);
  const filePath = path.join(imgDir, file);
  const stat = fs.statSync(filePath);
  
  // Skip small files and SVGs
  if (stat.size < 100 * 1024 || ext === '.svg') continue;
  
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    const webpPath = path.join(imgDir, `${name}.webp`);
    
    // Skip if webp already exists
    if (fs.existsSync(webpPath)) continue;
    
    try {
      const img = sharp(filePath);
      const meta = await img.metadata();
      
      // Resize if wider than 1920px
      const maxWidth = name.includes('hero') ? 1920 : 800;
      const resizeOpts = meta.width > maxWidth ? { width: maxWidth } : {};
      
      await img
        .resize(resizeOpts)
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      const newStat = fs.statSync(webpPath);
      console.log(`✅ ${file} (${Math.round(stat.size/1024)}KB) → ${name}.webp (${Math.round(newStat.size/1024)}KB) | -${Math.round((1 - newStat.size/stat.size) * 100)}%`);
    } catch (err) {
      console.log(`❌ ${file}: ${err.message}`);
    }
  }
}
