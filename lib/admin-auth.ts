import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import type { AdminIdentity, AdminRole } from "@/types/service";

function normalizeEmail(value: string | undefined | null) {
  return value?.trim().toLowerCase() ?? "";
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await currentUser();

  if (!user) return null;

  const emails = user.emailAddresses
    .map((address) => normalizeEmail(address.emailAddress))
    .filter(Boolean);

  if (!emails.length) return null;

  const ownerEmail = normalizeEmail(process.env.HAYPIQUE_OWNER_EMAIL);

  if (ownerEmail && emails.includes(ownerEmail)) {
    return {
      userId,
      email: ownerEmail,
      name: user.fullName || user.firstName || "Administrador",
      role: "owner",
    };
  }

  /*
   * Para editores buscamos el Gmail autenticado en la allowlist.
   * No hay invitaciones ni permisos derivados de Clerk.
   * Si Neon falla o no hay coincidencia exacta, se niega el acceso.
   */
  try {
    const sql = getSql();

    for (const email of emails) {
      const rows = (await sql`
        SELECT email, role
        FROM hp_admin_users
        WHERE LOWER(email) = ${email}
        LIMIT 1
      `) as Array<{ email: string; role: AdminRole }>;

      const access = rows[0];

      if (access?.role === "editor") {
        return {
          userId,
          email,
          name: user.fullName || user.firstName || "Editor",
          role: "editor",
        };
      }
    }
  } catch {
    return null;
  }

  return null;
}

export async function requireAdmin(): Promise<AdminIdentity> {
  const admin = await getAdminIdentity();

  if (admin) return admin;

  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  redirect("/sin-acceso");
}

export async function requireOwner(): Promise<AdminIdentity> {
  const admin = await requireAdmin();

  if (admin.role !== "owner") {
    redirect("/admin/servicios");
  }

  return admin;
}
