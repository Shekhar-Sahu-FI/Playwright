import fs from 'fs';

export function loadTestData(fullPath: string) {

  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw);
}
