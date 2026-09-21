import type { Pool } from "pg";

export async function migrate(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_sub TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      last_pet_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      sex TEXT,
      age TEXT,
      traits TEXT[] NOT NULL DEFAULT '{}',
      hobbies TEXT,
      toys TEXT,
      food TEXT,
      catchphrase TEXT,
      photos TEXT[] NOT NULL DEFAULT '{}',
      friends JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS diaries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      pet_name TEXT NOT NULL,
      date TEXT NOT NULL,
      index INT NOT NULL,
      source TEXT NOT NULL,
      user_note TEXT,
      photo TEXT,
      body TEXT NOT NULL,
      image_url TEXT,
      mock BOOLEAN,
      edited BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS diaries_auto_once
      ON diaries (user_id, pet_id, date)
      WHERE source = 'auto';

    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      pet_id TEXT NOT NULL,
      pet_name TEXT NOT NULL,
      source TEXT NOT NULL,
      template_id TEXT,
      diary_id TEXT,
      friend_id TEXT,
      friend_name TEXT,
      image_url TEXT NOT NULL,
      mock BOOLEAN NOT NULL DEFAULT false,
      seed INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}
