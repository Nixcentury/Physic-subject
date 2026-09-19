import { execFileSync } from 'node:child_process';
import { mkdir, copyFile, readFile, writeFile, lstat } from 'node:fs/promises';
import { resolve, dirname, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function packageLegacyPages(source, destination, metadata = {}) {
  const root = resolve(source), output = resolve(destination);
  if (output === root || output.startsWith(root + sep)) throw Error('Output must be a fresh folder outside the source repository.');
  // Never reuse an artifact folder: deleted source files must disappear too.
  await mkdir(output);
  const files = execFileSync('git', ['-C', root, 'ls-files', '-z', '--', ':(exclude)LEARNING HUB/**', ':(exclude).github/**'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  if (!files.includes('index.html')) throw Error('Missing the repository landing page.');
  // A frozen, tracked snapshot keeps old tool/content/asset URLs alive. No Hub
  // build, dependency install, content validation or remote download is needed.
  const compatibilityPrefix = '.github/hub-compat/';
  const compatibilityFiles = execFileSync('git', ['-C', root, 'ls-files', '-z', '--', compatibilityPrefix], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const entries = [
    ...files.map(name => ({ source: name, target: name })),
    ...compatibilityFiles.map(name => ({ source: name, target: name.slice(compatibilityPrefix.length) })),
  ];
  const published = new Set();
  for (const entry of entries) {
    const name = entry.target;
    if (!name || published.has(name.toLowerCase())) throw Error(`Publication path collision: ${name}`);
    published.add(name.toLowerCase());
    const from = resolve(root, entry.source), to = resolve(output, name);
    if (!from.startsWith(root + sep) || !to.startsWith(output + sep)) throw Error(`Unsafe tracked path: ${name}`);
    if (name.split('/').some(part => part === '.git' || part === 'node_modules' || part.startsWith('.env')) || /\.(?:pem|p12|pfx)$/i.test(name)) throw Error(`Refusing private/dependency file: ${name}`);
    if (!(await lstat(from)).isFile()) throw Error(`Refusing non-file or symlink: ${name}`);
    await mkdir(dirname(to), { recursive: true });
    await copyFile(from, to);
    if (!(await readFile(from)).equals(await readFile(to))) throw Error(`Copy mismatch: ${name}`);
  }
  await writeFile(join(output, '.nojekyll'), '');
  await writeFile(join(output, 'deployment.json'), JSON.stringify({ repository: 'Nixcentury/Physic-subject', commit: metadata.commit || null, buildTime: new Date().toISOString(), files: entries.length, compatibilityFiles: compatibilityFiles.length, hubBuilt: false }, null, 2) + '\n');
  return { files: entries.length, htmlFiles: entries.filter(entry => /\.html$/i.test(entry.target)).length, compatibilityFiles: compatibilityFiles.length, output };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) throw Error('Pass a new output folder outside this repository.');
  const source = fileURLToPath(new URL('../../', import.meta.url));
  console.log(await packageLegacyPages(source, process.argv[2], { commit: process.env.GITHUB_SHA }));
}
