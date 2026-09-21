import type { Shot } from "../types.ts";
import { readyDb } from "./client.ts";

type ImageRow = {
  id: string;
  pet_id: string;
  pet_name: string;
  source: Shot["source"];
  template_id: string | null;
  diary_id: string | null;
  friend_id: string | null;
  friend_name: string | null;
  image_url: string;
  mock: boolean;
  seed: number;
  created_at: Date;
};

function mapShot(row: ImageRow): Shot {
  return {
    id: row.id,
    petId: row.pet_id,
    petName: row.pet_name,
    source: row.source,
    templateId: row.template_id ?? (row.source === "diary" ? "diary" : ""),
    diaryId: row.diary_id ?? undefined,
    friendId: row.friend_id ?? undefined,
    friendName: row.friend_name ?? undefined,
    imageUrl: row.image_url,
    mock: row.mock,
    seed: row.seed,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function listImages(userId: string): Promise<Shot[]> {
  const pool = await readyDb();
  const result = await pool.query(
    `SELECT * FROM images WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
  return result.rows.map(mapShot);
}

export async function insertImage(userId: string, shot: Shot): Promise<Shot> {
  const pool = await readyDb();
  const result = await pool.query(
    `INSERT INTO images (
       id, user_id, pet_id, pet_name, source, template_id, diary_id, friend_id, friend_name, image_url, mock, seed
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      shot.id,
      userId,
      shot.petId,
      shot.petName,
      shot.source,
      shot.templateId || null,
      shot.diaryId ?? null,
      shot.friendId ?? null,
      shot.friendName ?? null,
      shot.imageUrl,
      shot.mock,
      shot.seed,
    ],
  );
  return mapShot(result.rows[0]);
}
