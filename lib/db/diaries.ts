import type { DiarySource } from "../diary-copy.ts";
import type { DiaryEntry } from "../types.ts";
import { readyDb } from "./client.ts";

type DiaryRow = {
  id: string;
  pet_id: string;
  pet_name: string;
  date: string;
  index: number;
  source: DiarySource;
  user_note: string | null;
  photo: string | null;
  body: string;
  image_url: string | null;
  mock: boolean | null;
  edited: boolean;
  created_at: Date;
};

function mapDiary(row: DiaryRow): DiaryEntry {
  return {
    id: row.id,
    petId: row.pet_id,
    petName: row.pet_name,
    date: row.date,
    index: row.index,
    source: row.source,
    userNote: row.user_note ?? undefined,
    photo: row.photo ?? undefined,
    body: row.body,
    imageUrl: row.image_url ?? undefined,
    mock: row.mock ?? undefined,
    edited: row.edited,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function listDiaries(userId: string, petId: string): Promise<DiaryEntry[]> {
  const pool = await readyDb();
  const result = await pool.query(
    `SELECT * FROM diaries WHERE user_id = $1 AND pet_id = $2 ORDER BY date DESC, index DESC`,
    [userId, petId],
  );
  return result.rows.map(mapDiary);
}

export async function hasAutoDraft(userId: string, petId: string, date: string): Promise<boolean> {
  const pool = await readyDb();
  const result = await pool.query(
    `SELECT 1 FROM diaries WHERE user_id = $1 AND pet_id = $2 AND date = $3 AND source = 'auto' LIMIT 1`,
    [userId, petId, date],
  );
  return result.rowCount !== 0;
}

export async function nextIndex(userId: string, petId: string, date: string): Promise<number> {
  const pool = await readyDb();
  const result = await pool.query(
    `SELECT COUNT(*)::int AS n FROM diaries WHERE user_id = $1 AND pet_id = $2 AND date = $3`,
    [userId, petId, date],
  );
  return (result.rows[0]?.n ?? 0) + 1;
}

export async function insertDiary(
  userId: string,
  entry: Omit<DiaryEntry, "createdAt"> & { createdAt?: number },
): Promise<DiaryEntry> {
  const pool = await readyDb();
  const result = await pool.query(
    `INSERT INTO diaries (
       id, user_id, pet_id, pet_name, date, index, source, user_note, photo, body, image_url, mock, edited
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      entry.id,
      userId,
      entry.petId,
      entry.petName,
      entry.date,
      entry.index,
      entry.source,
      entry.userNote ?? null,
      entry.photo ?? null,
      entry.body,
      entry.imageUrl ?? null,
      entry.mock ?? null,
      entry.edited,
    ],
  );
  return mapDiary(result.rows[0]);
}

export async function updateDiary(
  userId: string,
  id: string,
  patch: { body?: string; edited?: boolean; imageUrl?: string; mock?: boolean },
): Promise<DiaryEntry | undefined> {
  const pool = await readyDb();
  const current = await pool.query(`SELECT * FROM diaries WHERE id = $1 AND user_id = $2`, [id, userId]);
  if (!current.rows[0]) return undefined;
  const row = current.rows[0] as DiaryRow;
  const next = await pool.query(
    `UPDATE diaries SET
       body = $3,
       edited = $4,
       image_url = $5,
       mock = $6
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [
      id,
      userId,
      patch.body ?? row.body,
      patch.edited ?? row.edited,
      patch.imageUrl ?? row.image_url,
      patch.mock ?? row.mock,
    ],
  );
  return next.rows[0] ? mapDiary(next.rows[0]) : undefined;
}
