"use client";

import Image from "next/image";
import { useState } from "react";

export type PosterImageProps = {
  title: string;
  posterUrl?: string | null;
  className?: string;
};

export default function PosterImage({ title, posterUrl, className = "" }: PosterImageProps) {
  const [failedPoster, setFailedPoster] = useState<string | null>(null);
  const url = posterUrl?.trim();
  const showPoster = Boolean(url && url !== failedPoster);

  return (
    <div className={`relative aspect-[2/3] overflow-hidden bg-background ${className}`}>
      <Image
        src={showPoster ? url! : "/poster-placeholder.svg"}
        alt={showPoster ? `Pôster de ${title}` : `Pôster indisponível para ${title}`}
        fill
        sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
        unoptimized
        onError={showPoster ? () => setFailedPoster(url!) : undefined}
        className="object-cover"
      />
    </div>
  );
}
