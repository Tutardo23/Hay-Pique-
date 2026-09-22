import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
if (!url) {
  console.error("No encontré DATABASE_URL / POSTGRES_URL / NEON_DATABASE_URL en .env");
  process.exit(1);
}

const sql = neon(url);
await sql`ALTER TABLE hp_services ADD COLUMN IF NOT EXISTS media_gallery jsonb NOT NULL DEFAULT '[]'::jsonb`;
console.log("✓ hp_services.media_gallery listo");
