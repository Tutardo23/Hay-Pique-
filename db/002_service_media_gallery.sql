ALTER TABLE hp_services
ADD COLUMN IF NOT EXISTS media_gallery jsonb NOT NULL DEFAULT '[]'::jsonb;
