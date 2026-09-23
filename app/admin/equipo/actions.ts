"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireOwner } from "@/lib/admin-auth";

export type TeamActionState = { error?: string; ok?: string };

const usernameSchema = z
  .string()
  .trim()
  .min(4, "El usuario debe tener al menos 4 caracteres.")
  .max(32, "El usuario puede tener hasta 32 caracteres.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Usá solamente letras, números y guion bajo en el usuario.",
  )
  .transform((value) => value.toLowerCase());

const displayNameSchema = z
  .string()
  .trim()
  .min(2, "Ingresá el nombre de la persona.")
  .max(60, "El nombre es demasiado largo.");

const passwordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .max(128, "La contraseña es demasiado larga.");

type ClerkErrorShape = {
  errors?: Array<{
    code?: string;
    message?: string;
    longMessage?: string;
  }>;
};

function clerkErrorMessage(error: unknown) {
  const clerkError = error as ClerkErrorShape;
  const first = clerkError?.errors?.[0];
  const code = first?.code ?? "";
  const detail = first?.longMessage || first?.message || "";

  if (
    code.includes("identifier_already") ||
    code.includes("username") && code.includes("taken") ||
    detail.toLowerCase().includes("already been taken")
  ) {
    return "Ese usuario ya existe. Elegí otro.";
  }

  if (
    code.includes("password_pwned") ||
    detail.toLowerCase().includes("breach") ||
    detail.toLowerCase().includes("compromised")
  ) {
    return "Clerk rechazó esa contraseña por seguridad. Elegí otra más fuerte.";
  }

  if (
    detail.toLowerCase().includes("email") &&
    (detail.toLowerCase().includes("required") ||
      detail.toLowerCase().includes("missing"))
  ) {
    return "Clerk todavía exige email para crear usuarios. Activá Username + Password y dejá Email como no obligatorio en la configuración de Clerk.";
  }

  if (
    detail.toLowerCase().includes("username") &&
    detail.toLowerCase().includes("not enabled")
  ) {
    return "Primero activá Username en Clerk → User & authentication.";
  }

  return detail || "No se pudo crear el usuario en Clerk.";
}

export async function addEditorAction(
  _previousState: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  await requireOwner();

  const usernameResult = usernameSchema.safeParse(
    String(formData.get("username") ?? ""),
  );
  const displayNameResult = displayNameSchema.safeParse(
    String(formData.get("displayName") ?? ""),
  );
  const passwordResult = passwordSchema.safeParse(
    String(formData.get("password") ?? ""),
  );

  if (!usernameResult.success) {
    return { error: usernameResult.error.issues[0]?.message };
  }

  if (!displayNameResult.success) {
    return { error: displayNameResult.error.issues[0]?.message };
  }

  if (!passwordResult.success) {
    return { error: passwordResult.error.issues[0]?.message };
  }

  const client = await clerkClient();
  let createdUserId: string | null = null;

  try {
    const user = await client.users.createUser({
      username: usernameResult.data,
      password: passwordResult.data,
      firstName: displayNameResult.data,
    });

    createdUserId = user.id;

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hayPiqueRole: "editor",
      },
    });

    revalidatePath("/admin/equipo");

    return {
      ok: `Usuario ${usernameResult.data} creado. Ya puede entrar en /sign-in con esa contraseña.`,
    };
  } catch (error) {
    // Si Clerk creó la identidad pero falló al asignar el permiso,
    // se revierte para no dejar una cuenta incompleta.
    if (createdUserId) {
      try {
        await client.users.deleteUser(createdUserId);
      } catch {
        // Aunque falle el borrado, ese usuario no tiene el metadata "editor"
        // y por lo tanto no puede acceder al panel.
      }
    }

    return { error: clerkErrorMessage(error) };
  }
}

export async function removeEditorAction(
  userId: string,
  _formData: FormData,
) {
  await requireOwner();
  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  if (user.privateMetadata?.hayPiqueRole !== "editor") {
    return;
  }

  // Primero se revoca el permiso. Si después falla el borrado de la cuenta,
  // igualmente deja de poder entrar al admin.
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { hayPiqueRole: null },
  });

  try {
    await client.users.deleteUser(userId);
  } finally {
    revalidatePath("/admin/equipo");
  }
}

export async function resetEditorPasswordAction(
  userId: string,
  _previousState: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  await requireOwner();

  const passwordResult = passwordSchema.safeParse(
    String(formData.get("password") ?? ""),
  );

  if (!passwordResult.success) {
    return { error: passwordResult.error.issues[0]?.message };
  }

  const client = await clerkClient();

  try {
    const user = await client.users.getUser(userId);

    if (user.privateMetadata?.hayPiqueRole !== "editor") {
      return { error: "Ese usuario no es un editor autorizado." };
    }

    await client.users.updateUser(userId, {
      password: passwordResult.data,
      signOutOfOtherSessions: true,
    });

    return { ok: "Contraseña actualizada. Las otras sesiones fueron cerradas." };
  } catch (error) {
    return { error: clerkErrorMessage(error) };
  }
}
