import { neon } from "@neondatabase/serverless";

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Falta DATABASE_URL. Conectá Neon antes de usar el panel de servicios.");
  }
  return neon(url);
}
