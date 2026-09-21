import { readyDb } from "./client.ts";

export async function putMedia(id: string, mime: string, bytes: Buffer): Promise<void> {
  const pool = await readyDb();
  await pool.query(`INSERT INTO media (id, mime, bytes) VALUES ($1, $2, $3)`, [id, mime, bytes]);
}

export async function getMedia(id: string): Promise<{ mime: string; bytes: Buffer } | undefined> {
  const pool = await readyDb();
  const result = await pool.query(`SELECT mime, bytes FROM media WHERE id = $1`, [id]);
  const row = result.rows[0] as { mime: string; bytes: Buffer } | undefined;
  if (!row) return undefined;
  return { mime: row.mime, bytes: Buffer.isBuffer(row.bytes) ? row.bytes : Buffer.from(row.bytes) };
}
