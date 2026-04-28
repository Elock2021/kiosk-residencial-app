const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'build');
if (!fs.existsSync(outDir)) {
  console.error('build directory not found. Run npm run build first.');
  process.exit(1);
}

const outputFile = path.join(outDir, 'deploy-meta.json');
const now = new Date();

const payload = {
  deployedAtIso: now.toISOString(),
  deployedAtUnixMs: now.getTime(),
};

fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outputFile}`);
