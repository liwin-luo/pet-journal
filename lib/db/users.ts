import { readyDb } from "./client.ts";

export type UserRow = {
  id: string;
  googleSub: string;
  email: string;
  name?: string;
  lastPetId?: string;
};

export async function upsertGoogleUser(input: {
  googleSub: string;
  email: string;
  name?: string;
}): Promise<UserRow> {
  const pool = await readyDb();
  const existing = await pool.query(
    `SELECT id, google_sub, email, name, last_pet_id FROM users WHERE google_sub = $1`,
    [input.googleSub],
  );
  if (existing.rows[0]) {
    const row = existing.rows[0];
    await pool.query(`UPDATE users SET email = $2, name = $3 WHERE id = $1`, [
      row.id,
      input.email,
      input.name ?? row.name,
    ]);
    return mapUser(row);
  }
  const id = crypto.randomUUID();
  const inserted = await pool.query(
    `INSERT INTO users (id, google_sub, email, name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (google_sub) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name
     RETURNING id, google_sub, email, name, last_pet_id`,
    [id, input.googleSub, input.email, input.name ?? null],
  );
  return mapUser(inserted.rows[0]);
}

export async function rememberLastPet(userId: string, petId: string): Promise<void> {
  const pool = await readyDb();
  await pool.query(`UPDATE users SET last_pet_id = $2 WHERE id = $1`, [userId, petId]);
}

export async function lastPetId(userId: string): Promise<string> {
  const pool = await readyDb();
  const result = await pool.query(`SELECT last_pet_id FROM users WHERE id = $1`, [userId]);
  return result.rows[0]?.last_pet_id ?? "";
}

function mapUser(row: {
  id: string;
  google_sub: string;
  email: string;
  name?: string | null;
  last_pet_id?: string | null;
}): UserRow {
  return {
    id: row.id,
    googleSub: row.google_sub,
    email: row.email,
    name: row.name ?? undefined,
    lastPetId: row.last_pet_id ?? undefined,
  };
}
