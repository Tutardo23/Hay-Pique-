import Image from "next/image";

type MediaSlotProps = {
  src?: string;
  alt?: string;
  label: string;
  note: string;
  className?: string;
  priority?: boolean;
};

export function MediaSlot({
  src,
  alt = "",
  label,
  note,
  className = "",
  priority = false,
}: MediaSlotProps) {
  return (
    <figure className={`media-slot ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 760px) 88vw, 46vw" className="media-slot-image" />
      ) : (
        <div className="media-slot-placeholder">
          <span className="media-slot-mark" aria-hidden="true" />
          <div>
            <strong>{label}</strong>
            <small>{note}</small>
          </div>
        </div>
      )}
    </figure>
  );
}
