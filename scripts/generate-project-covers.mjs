// Run manually with FFmpeg/ffprobe available; generated files are committed.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const output = path.join(root, 'public/images/project-covers');
fs.mkdirSync(output, { recursive: true });
const manifest = {};
const source = fs.readFileSync('data/projects.ts', 'utf8');
for (const block of source.split(/slug: '/).slice(1)) {
  const slug = block.split("'")[0];
  const original = /\bimage: '([^']+)'/.exec(block)?.[1];
  if (!original) continue;
  const input = path.join(root, 'public', original);
  const { width, height } = JSON.parse(execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', input,
  ], { encoding: 'utf8' })).streams[0];
  const variants = [];
  for (const targetWidth of [1600, 2400].filter(size => size < width)) {
    const filename = `${slug}-${targetWidth}.webp`;
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
      '-vf', `scale=${targetWidth}:-1:flags=lanczos`, '-frames:v', '1',
      '-c:v', 'libwebp', '-quality', '92', '-compression_level', '6', path.join(output, filename),
    ]);
    if (fs.statSync(path.join(output, filename)).size >= fs.statSync(input).size) {
      fs.unlinkSync(path.join(output, filename));
    } else variants.push({ width: targetWidth, src: `/images/project-covers/${filename}` });
  }
  variants.push({ width, src: original });
  manifest[original] = {
    slug, width, height, src: variants.find(item => item.width === 1600)?.src ?? original,
    srcSet: variants.map(item => `${item.src} ${item.width}w`).join(', '),
  };
  console.log(slug, variants.slice(0, -1).map(item => `${item.width}: ${fs.statSync(path.join(root, 'public', item.src)).size} B`).join(', '));
}
fs.writeFileSync('data/projectCoverImages.json', `${JSON.stringify(manifest, null, 2)}\n`);
