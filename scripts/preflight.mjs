import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const required = ['package.json','prisma/schema.prisma','src/app/layout.tsx','src/app/page.tsx','src/lib/auth.ts','src/lib/prisma.ts'];
const missing = required.filter(x => !fs.existsSync(path.join(root,x)));
if (missing.length) { console.error('Missing:', missing.join(', ')); process.exit(1); }
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
for (const x of ['next','react','react-dom','@prisma/client']) if (!pkg.dependencies?.[x]) throw new Error(`Missing dependency ${x}`);
console.log('PREFLIGHT OK');
