import Image from "next/image";

export function MediaFrame({
  src,
  alt = "",
  label = "",
  note = "",
  className = "",
  priority = false,
  position = "center",
}: {
  src?: string;
  alt?: string;
  label?: string;
  note?: string;
  className?: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <figure className={`media-frame ${src ? "has-media" : ""} ${className}`}>
      <div className="media-frame-shape">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 760px) 90vw, 50vw"
            className="media-frame-image"
            style={{ objectPosition: position }}
          />
        ) : (
          <div className="media-placeholder">
            <div>
              <strong>{label}</strong>
              <small>{note}</small>
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}
