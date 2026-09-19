import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, access, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { packageLegacyPages } from './package-legacy-pages.mjs';

test('legacy publication is independent of Hub and reflects add/edit/delete in fresh artifacts', async () => {
  // Disposable fixture only. No existing repository or teaching file is altered.
  const fixture = await mkdtemp(join(tmpdir(), 'hub-migration-pack-test-'));
  const repo = join(fixture, 'repo');
  await mkdir(repo);
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { stdio: 'pipe' });
  git('init');
  await mkdir(join(repo, 'LEARNING HUB', 'public'), { recursive: true });
  await mkdir(join(repo, '.github'), { recursive: true });
  await mkdir(join(repo, 'ข้อสอบ ที่มีช่องว่าง'), { recursive: true });
  await writeFile(join(repo, 'index.html'), '<a href="https://nixcentury.github.io/learning-hub/">Hub</a>');
  await writeFile(join(repo, 'LEARNING HUB', 'package.json'), 'deliberately broken Hub');
  await writeFile(join(repo, 'LEARNING HUB', 'public', 'broken.html'), '<a href="missing.html">missing</a>');
  await writeFile(join(repo, '.github', 'private-source.txt'), 'not for Pages');
  const compat = join(repo, '.github', 'hub-compat');
  for (const name of ['pages/tools', 'shared', 'content/samples', 'assets']) await mkdir(join(compat, name), { recursive: true });
  const preserved = {
    'pages/tools/quiz-player.html': '<script src="../../shared/quiz-core.js"></script>',
    'shared/quiz-core.js': '/* frozen public engine */',
    'content/samples/demo.html': '<article data-question-id="stable-id">Question</article>',
    'assets/hub-existing-hash.js': '/* cached old entry point still resolves */',
  };
  for (const [name, content] of Object.entries(preserved)) await writeFile(join(compat, name), content);
  const question = join(repo, 'ข้อสอบ ที่มีช่องว่าง', 'quiz.html');
  await writeFile(question, 'version one');
  git('add', '.');
  await writeFile(join(repo, 'not-tracked.txt'), 'not for Pages');
  const one = join(fixture, 'one');
  const result = await packageLegacyPages(repo, one);
  assert.equal(result.htmlFiles, 4);
  assert.equal(result.compatibilityFiles, 4);
  for (const [name, content] of Object.entries(preserved)) assert.equal(await readFile(join(one, name), 'utf8'), content);
  assert.equal(await readFile(join(one, 'ข้อสอบ ที่มีช่องว่าง', 'quiz.html'), 'utf8'), 'version one');
  for (const name of ['LEARNING HUB', '.github', '.git', 'not-tracked.txt']) await assert.rejects(access(join(one, name)));
  assert.equal(JSON.parse(await readFile(join(one, 'deployment.json'), 'utf8')).hubBuilt, false);

  await writeFile(question, 'version two');
  await writeFile(join(repo, 'new.html'), 'new file');
  git('add', '.');
  const two = join(fixture, 'two');
  await packageLegacyPages(repo, two);
  assert.equal(await readFile(join(two, 'ข้อสอบ ที่มีช่องว่าง', 'quiz.html'), 'utf8'), 'version two');
  assert.equal(await readFile(join(two, 'new.html'), 'utf8'), 'new file');

  await unlink(question); // Only the disposable fixture created above.
  git('add', '-u');
  const three = join(fixture, 'three');
  await packageLegacyPages(repo, three);
  await assert.rejects(access(join(three, 'ข้อสอบ ที่มีช่องว่าง', 'quiz.html')));
  assert.equal(await readFile(join(three, 'new.html'), 'utf8'), 'new file');
  for (const [name, content] of Object.entries(preserved)) assert.equal(await readFile(join(three, name), 'utf8'), content);
  await assert.rejects(packageLegacyPages(repo, three), /EEXIST/);
  await assert.rejects(packageLegacyPages(repo, join(repo, 'unsafe-output')), /outside/);
  await mkdir(join(repo, 'shared'));
  await writeFile(join(repo, 'shared', 'quiz-core.js'), 'would overwrite compatibility file');
  git('add', '.');
  await assert.rejects(packageLegacyPages(repo, join(fixture, 'collision')), /collision/);
});
