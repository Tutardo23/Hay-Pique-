"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireOwner } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export type TeamActionState = { error?: string; ok?: string };

export async function addEditorAction(
  _previousState: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  const owner = await requireOwner();

  const parsed = z
    .string()
    .trim()
    .email()
    .safeParse(String(formData.get("email") ?? ""));

  if (!parsed.success) {
    return { error: "Ingresá un Gmail válido." };
  }

  const email = parsed.data.toLowerCase();

  if (email === owner.email) {
    return { error: "Ese correo ya es el propietario del panel." };
  }

  const sql = getSql();

  /*
   * IMPORTANTE:
   * Esto NO crea invitaciones de Clerk y NO envía ningún mail.
   * Solo incorpora el Gmail a nuestra allowlist privada.
   *
   * Después esa persona entra normalmente con Google en /sign-in.
   * Clerk autentica su identidad y nuestra capa de servidor verifica
   * que el correo esté exactamente en hp_admin_users.
   */
  await sql`
    INSERT INTO hp_admin_users (email, role, created_by)
    VALUES (${email}, 'editor', ${owner.email})
    ON CONFLICT (email)
    DO UPDATE SET role = 'editor'
  `;

  revalidatePath("/admin/equipo");

  return {
    ok: `${email} ya puede entrar directamente con Google. No se envió ninguna invitación.`,
  };
}

export async function removeEditorAction(email: string, _formData: FormData) {
  await requireOwner();

  const normalized = email.trim().toLowerCase();
  const sql = getSql();

  await sql`
    DELETE FROM hp_admin_users
    WHERE LOWER(email) = ${normalized}
  `;

  revalidatePath("/admin/equipo");
}
