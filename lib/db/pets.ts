import type { Friend, Pet } from "../types.ts";
import { readyDb } from "./client.ts";

type PetRow = {
  id: string;
  user_id: string;
  name: string;
  species: Pet["species"];
  breed: string | null;
  sex: Pet["sex"] | null;
  age: Pet["age"] | null;
  traits: string[];
  hobbies: string | null;
  toys: string | null;
  food: string | null;
  catchphrase: string | null;
  photos: string[];
  friends: Friend[];
  created_at: Date;
};

function mapPet(row: PetRow): Pet {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    species: row.species,
    breed: row.breed ?? undefined,
    sex: row.sex ?? undefined,
    age: row.age ?? undefined,
    traits: row.traits ?? [],
    hobbies: row.hobbies ?? undefined,
    toys: row.toys ?? undefined,
    food: row.food ?? undefined,
    catchphrase: row.catchphrase ?? undefined,
    photos: row.photos ?? [],
    friends: row.friends ?? [],
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function listPets(userId: string): Promise<Pet[]> {
  const pool = await readyDb();
  const result = await pool.query(
    `SELECT * FROM pets WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
  return result.rows.map(mapPet);
}

export async function getPet(userId: string, id: string): Promise<Pet | undefined> {
  const pool = await readyDb();
  const result = await pool.query(`SELECT * FROM pets WHERE id = $1 AND user_id = $2`, [id, userId]);
  return result.rows[0] ? mapPet(result.rows[0]) : undefined;
}

export async function upsertPet(userId: string, pet: Pet): Promise<Pet> {
  const pool = await readyDb();
  const result = await pool.query(
    `INSERT INTO pets (
       id, user_id, name, species, breed, sex, age, traits, hobbies, toys, food, catchphrase, photos, friends
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb
     )
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       species = EXCLUDED.species,
       breed = EXCLUDED.breed,
       sex = EXCLUDED.sex,
       age = EXCLUDED.age,
       traits = EXCLUDED.traits,
       hobbies = EXCLUDED.hobbies,
       toys = EXCLUDED.toys,
       food = EXCLUDED.food,
       catchphrase = EXCLUDED.catchphrase,
       photos = EXCLUDED.photos,
       friends = EXCLUDED.friends
     WHERE pets.user_id = $2
     RETURNING *`,
    [
      pet.id,
      userId,
      pet.name.trim(),
      pet.species,
      pet.breed ?? null,
      pet.sex ?? null,
      pet.age ?? null,
      pet.traits,
      pet.hobbies ?? null,
      pet.toys ?? null,
      pet.food ?? null,
      pet.catchphrase ?? null,
      pet.photos,
      JSON.stringify(pet.friends),
    ],
  );
  if (!result.rows[0]) throw new Error("这只不在你的册子里");
  return mapPet(result.rows[0]);
}

export async function removePet(userId: string, id: string): Promise<void> {
  const pool = await readyDb();
  await pool.query(`DELETE FROM pets WHERE id = $1 AND user_id = $2`, [id, userId]);
  await pool.query(
    `UPDATE pets SET friends = (
       SELECT COALESCE(jsonb_agg(f), '[]'::jsonb)
       FROM jsonb_array_elements(friends) AS f
       WHERE f->>'petId' IS DISTINCT FROM $2
     ) WHERE user_id = $1`,
    [userId, id],
  );
}
