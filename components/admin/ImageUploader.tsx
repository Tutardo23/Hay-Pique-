"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

export function ImageUploader({ initialUrl = "" }: { initialUrl?: string | null }) {
  const [url, setUrl] = useState(initialUrl || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    if (file.size > 3_500_000) {
      setError("La imagen debe pesar menos de 3,5 MB.");
      event.target.value = "";
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "No se pudo subir la imagen.");
      setUrl(data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="hp-admin-image-uploader">
      <input type="hidden" name="image_url" value={url} />
      {url ? (
        <div className="hp-admin-image-preview">
          <Image src={url} alt="Vista previa de la imagen" fill sizes="320px" />
        </div>
      ) : (
        <div className="hp-admin-image-empty">Todavía no hay imagen</div>
      )}
      <div className="hp-admin-upload-actions">
        <label className="hp-admin-button hp-admin-button-secondary">
          {busy ? "Subiendo…" : url ? "Cambiar imagen" : "Subir imagen"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            disabled={busy}
            hidden
          />
        </label>
        {url ? (
          <button type="button" className="hp-admin-text-button" onClick={() => setUrl("")}>
            Quitar
          </button>
        ) : null}
      </div>
      <small>JPG, PNG o WEBP · máximo 3,5 MB.</small>
      {error ? <p className="hp-admin-error">{error}</p> : null}
    </div>
  );
}
