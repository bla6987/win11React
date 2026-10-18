import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

test('all inventoried replacement artwork is present and has SVG content', () => {
  const paths = JSON.parse(readFileSync('scripts/asset-paths.json'));
  assert.ok(paths.length > 300);
  for (const path of paths) assert.match(readFileSync(path, 'utf8'), /^<svg/);
});

test('the served asset tree has no remaining undocumented raster artwork or fonts', () => {
  const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
  assert.deepEqual(walk('public').filter(path => /\.(png|jpg|jpeg|gif|webp|ico|ttf|woff2?)$/i.test(path)), []);
  for (const path of ['public/licenses/FONT-AWESOME.txt', 'public/licenses/FONT-AWESOME-CODE.txt', 'public/licenses/DYCALENDAR.txt']) assert.ok(existsSync(path));
  assert.equal(existsSync('.github/FUNDING.yml'), false);
});
