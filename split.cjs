const fs = require('fs');

const code = fs.readFileSync('src/data/projects.js', 'utf8');
const lines = code.split('\n');

const startIndex = lines.findIndex(l => l.startsWith('const fallbackProjects = ['));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.startsWith('];'));

if (startIndex === -1 || endIndex === -1) {
  console.log('Error finding markers');
  process.exit(1);
}

const fallbackLines = lines.slice(startIndex, endIndex + 1);
fs.writeFileSync('src/data/fallbackProjects.js', 'export ' + fallbackLines.join('\n') + '\n');

lines.splice(startIndex, endIndex - startIndex + 1);
let newCode = lines.join('\n');

newCode += `
export const heroProjects = [
  { name: 'BosDepot', src: '/img/bosdepot-opt.webp' },
  { name: 'ChatTask', src: '/img/chattask-opt.webp' },
  { name: 'SiAbsen', src: '/img/siabsen-opt.webp' },
  { name: 'MPP Digital', src: '/img/mpp-opt.webp' },
  { name: 'JokiPro', src: '/img/jokipro-opt.webp' },
  { name: 'PEKA', src: '/img/peka-opt.webp' },
  { name: 'Siskamling App', src: '/img/siskamling-opt.webp' },
  { name: 'SimPPK', src: '/img/simppk-opt.webp' }
];
`;

newCode = newCode.replace(
  /return fallbackProjects;/g,
  "const { fallbackProjects } = await import('./fallbackProjects');\n    return fallbackProjects;"
);

newCode = newCode.replace(
  /return fallbackProjects\.find\(\(p\) => p\.slug === slug\) \|\| null;/g,
  "const { fallbackProjects } = await import('./fallbackProjects');\n    return fallbackProjects.find((p) => p.slug === slug) || null;"
);

newCode = newCode.replace(
  /export const projects = fallbackProjects;/g,
  ""
);

newCode = newCode.replace(
  /export function getProjectBySlug[\s\S]*?}/g,
  ""
);

// Update src to -opt.webp
newCode = newCode.replace(
  /src: \`\/img\/\$\{row\.slug\}\.webp\`,/g,
  "src: `/img/${row.slug}-opt.webp`,"
);

fs.writeFileSync('src/data/projects.js', newCode);
console.log('Success!');
