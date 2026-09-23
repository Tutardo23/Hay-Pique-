import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { AdminIdentity } from "@/types/service";

function normalizeEmail(value: string | undefined | null) {
  return value?.trim().toLowerCase() ?? "";
}

function editorRole(value: unknown) {
  return value === "editor";
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await currentUser();

  if (!user) return null;

  const emails = user.emailAddresses
    .map((address) => normalizeEmail(address.emailAddress))
    .filter(Boolean);

  const ownerEmail = normalizeEmail(process.env.HAYPIQUE_OWNER_EMAIL);

  // El propietario actual puede seguir entrando con Google.
  if (ownerEmail && emails.includes(ownerEmail)) {
    return {
      userId,
      email: ownerEmail,
      name: user.fullName || user.firstName || "Administrador",
      role: "owner",
    };
  }

  /*
   * Los editores de usuario + contraseña se autorizan exclusivamente
   * mediante privateMetadata de Clerk. Ese dato solamente puede modificarse
   * desde el Backend API de Clerk, nunca desde el navegador.
   */
  if (editorRole(user.privateMetadata?.hayPiqueRole) && user.username) {
    return {
      userId,
      // Se mantiene la propiedad "email" por compatibilidad con el audit
      // existente. Para usuarios sin email guarda el identificador.
      email: `@${user.username}`,
      name: user.fullName || user.firstName || user.username,
      role: "editor",
    };
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
