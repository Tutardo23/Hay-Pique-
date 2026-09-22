export type ServiceStatus = "draft" | "published" | "archived";
export type AdminRole = "owner" | "editor";
export type ServiceMediaKind = "image" | "video";

export type ServiceMedia = {
  id: string;
  kind: ServiceMediaKind;
  url: string;
  pathname: string;
  name: string;
  contentType: string;
  bytes: number;
  alt: string;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  highlights: string | null;
  audience: string | null;
  professional_name: string | null;
  professional_role: string | null;
  modality: "presencial" | "virtual" | "hibrida" | "a_definir" | null;
  location: string | null;
  starts_on: string | null;
  time_label: string | null;
  duration: string | null;
  price_label: string | null;
  capacity: number | null;
  image_url: string | null;
  image_alt: string | null;
  media_gallery: ServiceMedia[];
  media_authorized: boolean;
  cta_label: string | null;
  cta_url: string | null;
  status: ServiceStatus;
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

export type AdminIdentity = {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
};
