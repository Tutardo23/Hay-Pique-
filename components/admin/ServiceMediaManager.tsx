"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Star, Trash2, UploadCloud, Video } from "lucide-react";
import type { ServiceMedia } from "@/types/service";

const IMAGE_MAX = 40 * 1024 * 1024;
const VIDEO_MAX = 500 * 1024 * 1024;
const MAX_GALLERY = 24;

const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

function humanSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
  return `${Math.ceil(bytes / 1024)} KB`;
}

function publicRoute(pathname: string) {
  return `/api/media/service/${pathname.split("/").map(encodeURIComponent).join("/")}`;
}

function putFileDirectly(
  uploadUrl: string,
  file: File,
  onProgress: (value: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }

      reject(new Error(`Vercel Blob rechazó la carga (${xhr.status}).`));
    };

    xhr.onerror = () => reject(new Error("Se cortó la conexión mientras se subía el archivo."));
    xhr.send(file);
  });
}

async function uploadMedia(file: File, kind: "image" | "video", onProgress: (value: number) => void) {
  const extension = extensionByType[file.type];
  if (!extension) throw new Error("Formato no admitido.");

  const pathname = `hay-pique/servicios/${kind === "image" ? "images" : "videos"}/${crypto.randomUUID()}.${extension}`;

  const tokenResponse = await fetch("/api/admin/media-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pathname,
      kind,
      contentType: file.type,
      size: file.size,
    }),
  });

  const tokenResult = (await tokenResponse.json()) as {
    uploadUrl?: string;
    pathname?: string;
    error?: string;
  };

  if (!tokenResponse.ok || !tokenResult.uploadUrl || !tokenResult.pathname) {
    throw new Error(tokenResult.error || "No se pudo preparar la carga.");
  }

  await putFileDirectly(tokenResult.uploadUrl, file, onProgress);

  return {
    id: crypto.randomUUID(),
    kind,
    url: publicRoute(tokenResult.pathname),
    pathname: tokenResult.pathname,
    name: file.name.slice(0, 180),
    contentType: file.type,
    bytes: file.size,
    alt: "",
  } satisfies ServiceMedia;
}

export function ServiceMediaManager({
  initialCover = "",
  initialGallery = [],
}: {
  initialCover?: string | null;
  initialGallery?: ServiceMedia[] | null;
}) {
  const [cover, setCover] = useState(initialCover || "");
  const [gallery, setGallery] = useState<ServiceMedia[]>(initialGallery || []);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentName, setCurrentName] = useState("");
  const [error, setError] = useState("");

  const imageCount = useMemo(() => gallery.filter((item) => item.kind === "image").length, [gallery]);
  const videoCount = useMemo(() => gallery.filter((item) => item.kind === "video").length, [gallery]);

  function validate(file: File, kind: "image" | "video") {
    if (!extensionByType[file.type]) return "Formato no admitido.";
    if (kind === "image" && file.size > IMAGE_MAX) return "Cada imagen puede pesar hasta 40 MB.";
    if (kind === "video" && file.size > VIDEO_MAX) return "Cada video puede pesar hasta 500 MB.";
    return "";
  }

  async function handleCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const message = validate(file, "image");
    if (message) return setError(message);

    setBusy(true);
    setError("");
    setCurrentName(file.name);
    setProgress(0);
    try {
      const media = await uploadMedia(file, "image", setProgress);
      setCover(media.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la portada.");
    } finally {
      setBusy(false);
      setCurrentName("");
      setProgress(0);
    }
  }

  async function handleGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    if (gallery.length + files.length > MAX_GALLERY) {
      return setError(`La galería admite hasta ${MAX_GALLERY} archivos.`);
    }

    setBusy(true);
    setError("");
    try {
      const added: ServiceMedia[] = [];
      for (const file of files) {
        const kind = file.type.startsWith("video/") ? "video" : "image";
        const message = validate(file, kind);
        if (message) throw new Error(`${file.name}: ${message}`);
        setCurrentName(file.name);
        setProgress(0);
        added.push(await uploadMedia(file, kind, setProgress));
      }
      setGallery((current) => [...current, ...added]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setBusy(false);
      setCurrentName("");
      setProgress(0);
    }
  }

  function updateAlt(id: string, alt: string) {
    setGallery((items) => items.map((item) => (item.id === id ? { ...item, alt } : item)));
  }

  function remove(id: string) {
    setGallery((items) => items.filter((item) => item.id !== id));
  }

  function move(id: string, direction: -1 | 1) {
    setGallery((items) => {
      const index = items.findIndex((item) => item.id === id);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= items.length) return items;
      const copy = [...items];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  }

  return (
    <div className="hp-media-manager">
      <input type="hidden" name="image_url" value={cover} />
      <input type="hidden" name="media_gallery" value={JSON.stringify(gallery)} />

      <div className="hp-media-cover-block">
        <div className="hp-media-block-title">
          <div>
            <span>Portada</span>
            <strong>La imagen principal de la propuesta</strong>
          </div>
          <label className="hp-admin-button hp-admin-button-secondary">
            <UploadCloud size={15} />
            {cover ? "Cambiar portada" : "Subir portada"}
            <input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy} onChange={handleCover} />
          </label>
        </div>

        {cover ? (
          <div className="hp-media-cover-preview">
            <Image src={cover} alt="Vista previa de portada" fill sizes="560px" unoptimized={cover.startsWith("/api/media/service/")} />
            <button type="button" onClick={() => setCover("")}>Quitar portada</button>
          </div>
        ) : (
          <div className="hp-media-cover-empty">
            <ImageIcon size={24} />
            <span>Todavía no hay portada</span>
          </div>
        )}
      </div>

      <div className="hp-media-gallery-block">
        <div className="hp-media-block-title">
          <div>
            <span>Galería</span>
            <strong>Fotos y videos adicionales</strong>
            <small>{imageCount} fotos · {videoCount} videos · hasta {MAX_GALLERY} archivos</small>
          </div>
          <label className="hp-admin-button hp-admin-button-primary">
            <UploadCloud size={15} /> Agregar archivos
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              hidden
              disabled={busy}
              onChange={handleGallery}
            />
          </label>
        </div>

        {busy ? (
          <div className="hp-media-upload-progress">
            <div><strong>Subiendo</strong><span>{currentName}</span></div>
            <progress value={progress} max={100} />
            <b>{progress}%</b>
          </div>
        ) : null}

        {gallery.length ? (
          <div className="hp-media-admin-grid">
            {gallery.map((item, index) => (
              <article className="hp-media-admin-card" key={item.id}>
                <div className="hp-media-admin-preview">
                  {item.kind === "image" ? (
                    <Image src={item.url} alt={item.alt || item.name} fill sizes="260px" unoptimized={item.url.startsWith("/api/media/service/")} />
                  ) : (
                    <video src={item.url} controls preload="metadata" playsInline />
                  )}
                  <span className={`hp-media-kind hp-media-kind-${item.kind}`}>
                    {item.kind === "image" ? <ImageIcon size={12} /> : <Video size={12} />}
                    {item.kind === "image" ? "Foto" : "Video"}
                  </span>
                </div>

                <div className="hp-media-admin-card-body">
                  <strong title={item.name}>{item.name}</strong>
                  <small>{humanSize(item.bytes)}</small>
                  <input
                    value={item.alt}
                    onChange={(event) => updateAlt(item.id, event.target.value)}
                    maxLength={220}
                    placeholder={item.kind === "image" ? "Descripción de la foto" : "Descripción del video"}
                  />

                  <div className="hp-media-admin-actions">
                    {item.kind === "image" ? (
                      <button type="button" onClick={() => setCover(item.url)} title="Usar como portada">
                        <Star size={14} /> Portada
                      </button>
                    ) : null}
                    <button type="button" onClick={() => move(item.id, -1)} disabled={index === 0} title="Mover antes"><ArrowUp size={14} /></button>
                    <button type="button" onClick={() => move(item.id, 1)} disabled={index === gallery.length - 1} title="Mover después"><ArrowDown size={14} /></button>
                    <button type="button" className="is-danger" onClick={() => remove(item.id)} title="Quitar"><Trash2 size={14} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="hp-media-gallery-empty">
            <div><ImageIcon size={19} /><Video size={19} /></div>
            <strong>Podés sumar fotos y videos.</strong>
            <p>No agrandan el hero: aparecen en una galería ordenada más abajo en la página.</p>
          </div>
        )}
      </div>

      <p className="hp-media-limits">
        Imágenes JPG/PNG/WEBP hasta <strong>40 MB</strong> · Videos MP4/WEBM hasta <strong>500 MB</strong> cada uno.
      </p>
      {error ? <p className="hp-admin-error">{error}</p> : null}
    </div>
  );
}
