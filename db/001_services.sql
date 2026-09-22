BEGIN;

CREATE TABLE IF NOT EXISTS hp_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  highlights text,
  audience text,
  professional_name text,
  professional_role text,
  modality text CHECK (modality IS NULL OR modality IN ('presencial', 'virtual', 'hibrida', 'a_definir')),
  location text,
  starts_on date,
  time_label text,
  duration text,
  price_label text,
  capacity integer CHECK (capacity IS NULL OR capacity > 0),
  image_url text,
  image_alt text,
  media_authorized boolean NOT NULL DEFAULT false,
  cta_label text,
  cta_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_by text NOT NULL,
  updated_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hp_services_status_idx ON hp_services(status);
CREATE INDEX IF NOT EXISTS hp_services_featured_idx ON hp_services(featured, sort_order, published_at DESC);

CREATE TABLE IF NOT EXISTS hp_admin_users (
  email text PRIMARY KEY,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('editor')),
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hp_service_audit (
  id bigserial PRIMARY KEY,
  service_id uuid REFERENCES hp_services(id) ON DELETE SET NULL,
  actor_email text NOT NULL,
  action text NOT NULL,
  snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hp_service_audit_service_idx ON hp_service_audit(service_id, created_at DESC);

CREATE TABLE IF NOT EXISTS hp_admin_audit (
  id bigserial PRIMARY KEY,
  actor_email text NOT NULL,
  action text NOT NULL,
  target_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hp_admin_audit_created_idx ON hp_admin_audit(created_at DESC);

COMMIT;
