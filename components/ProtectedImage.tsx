"use client";

import Image, { type ImageProps } from "next/image";

const blockSave = (e: React.SyntheticEvent) => e.preventDefault();

/** Image avec protections basiques contre le téléchargement casual. */
export default function ProtectedImage({ className = "", ...props }: ImageProps) {
  return (
    <Image
      {...props}
      draggable={false}
      onContextMenu={blockSave}
      onDragStart={blockSave}
      className={`protected-photo select-none ${className}`.trim()}
    />
  );
}
