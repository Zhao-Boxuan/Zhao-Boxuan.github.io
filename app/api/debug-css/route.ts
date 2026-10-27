import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

export async function GET() {
  const css = await readFile(path.join(process.cwd(), 'app', 'globals.css'), 'utf8');
  const values = [...css.matchAll(/--line-weight-strong\s*:\s*([^;]+);/g)].map((match) => match[1]);
  return Response.json({ values });
}
