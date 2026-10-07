import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync(new URL('../../src/data/initialData.ts', import.meta.url), 'utf8');
const students = [...source.matchAll(
  /id: '(std-g[12]-\d+)',\s*rollNo: '([^']+)',\s*name: '([^']+)',\s*group: '(Group I|Group II)'/g,
)].map(([, id, rollNo, name, group]) => ({ id, rollNo, name, group }));

if (students.length !== 35) {
  throw new Error(`Expected 35 prototype students; found ${students.length}`);
}

writeFileSync(new URL('../assets/students.json', import.meta.url), `${JSON.stringify(students, null, 2)}\n`);
console.log(`Exported ${students.length} students from the web prototype.`);
