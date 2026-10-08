"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { Film } from "lucide-react";
import { useState, ViewTransition } from "react";

export const TMDB_PREFIX = /^https:\/\/image\.tmdb\.org\/t\/p\/[^/]+/;
const TMDB_WIDTHS = [92, 154, 185, 342, 500, 780];

/** Larguras que os cards ocupam na grade; reutilizar a mesma string aproveita o cache do navegador. */
export const CARD_POSTER_SIZES = "(min-width: 1280px) 220px, (min-width: 768px) 200px, 45vw";

// O CDN do TMDB já publica cada pôster em tamanhos fixos: o loader troca o segmento de tamanho
// pelo menor que cobre a largura pedida, sem passar pelo otimizador do Next.
export function tmdbLoader({ src, width }: ImageLoaderProps) {
  const size = TMDB_WIDTHS.find((available) => available >= width);
  return `https://image.tmdb.org/t/p/${size ? `w${size}` : "original"}${src}`;
}

export type PosterImageProps = {
  title: string;
  posterUrl?: string | null;
  sizes: string;
  /** `sizes` de uma versão menor já carregada, exibida por baixo enquanto a maior chega. */
  placeholderSizes?: string;
  eager?: boolean;
  /** Nome compartilhado para a transição entre a grade e a página de detalhes. */
  transitionName?: string;
  className?: string;
};

export default function PosterImage({
  title,
  posterUrl,
  sizes,
  placeholderSizes,
  eager = false,
  transitionName,
  className = "",
}: PosterImageProps) {
  const [loadedPoster, setLoadedPoster] = useState<string | null>(null);
  const [failedPoster, setFailedPoster] = useState<string | null>(null);
  const url = posterUrl?.trim() || null;
  const showPoster = url !== null && url !== failedPoster;
  const isTmdb = url !== null && TMDB_PREFIX.test(url);
  const source = isTmdb
    ? { src: url.replace(TMDB_PREFIX, ""), loader: tmdbLoader }
    : { src: url ?? "", unoptimized: true };
  const isLoaded = loadedPoster === url;

  const frame = (
    <div className={`relative aspect-[2/3] overflow-hidden bg-surface ${className}`}>
      {showPoster ? (
        <>
          {!isLoaded && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-surface-raised motion-reduce:animate-none" />}
          {placeholderSizes && !isLoaded && (
            <Image {...source} alt="" aria-hidden="true" fill sizes={placeholderSizes} loading="eager" className="object-cover" />
          )}
          <Image
            {...source}
            alt={`Pôster de ${title}`}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            onLoad={() => setLoadedPoster(url)}
            onError={() => setFailedPoster(url)}
            className={`object-cover transition-[opacity,filter,scale] duration-700 ease-smooth group-hover:scale-[1.04] ${
              isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
            }`}
          />
        </>
      ) : (
        <div
          role="img"
          aria-label={`Pôster indisponível para ${title}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-raised p-4 text-center"
        >
          <Film aria-hidden="true" className="h-8 w-8 text-accent/80" strokeWidth={1.5} />
          <span className="line-clamp-3 font-display text-xl leading-tight text-foreground/90">{title}</span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">Pôster indisponível</span>
        </div>
      )}
    </div>
  );

  if (!transitionName) return frame;
  return (
    <ViewTransition name={transitionName} share="morph" default="none">
      {frame}
    </ViewTransition>
  );
}
