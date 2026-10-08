"use client";

import Image from "next/image";
import { useState } from "react";
import { TMDB_PREFIX, tmdbLoader } from "./PosterImage";
import type { CastMember } from "./types";

export type CastListProps = {
  cast: readonly CastMember[];
};

const AVATAR_TONES = [
  "bg-primary",
  "bg-surface-raised",
  "bg-primary-hover",
  "bg-primary",
] as const;

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

function CastPhoto({ member, tone }: { member: CastMember; tone: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const url = member.photoUrl;

  if (!url || status === "failed") {
    return (
      <div aria-hidden="true" className={`grid h-full w-full place-items-center ${tone} font-display text-5xl text-white/90`}>
        {initials(member.name)}
      </div>
    );
  }

  return (
    <>
      {status === "loading" && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-surface-raised motion-reduce:animate-none" />}
      <Image
        src={url.replace(TMDB_PREFIX, "")}
        loader={tmdbLoader}
        alt=""
        fill
        sizes="(min-width: 1024px) 190px, (min-width: 640px) 30vw, 45vw"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("failed")}
        className={`object-cover object-top transition-[opacity,filter,scale] duration-700 ease-smooth group-hover:scale-[1.04] ${
          status === "loaded" ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
      />
    </>
  );
}

export default function CastList({ cast }: CastListProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-5">
      {cast.map((member, index) => (
        <li key={`${member.name}-${index}`} style={{ animationDelay: `${index * 60}ms` }} className="group min-w-0 animate-fade-up">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface shadow-lg shadow-black/30 ring-1 ring-white/[0.06] transition-[box-shadow,translate] duration-500 ease-smooth group-hover:-translate-y-1 group-hover:ring-white/15">
            <CastPhoto member={member} tone={AVATAR_TONES[index % AVATAR_TONES.length]} />
          </div>
          <p className="mt-3 truncate font-semibold leading-snug" title={member.name}>
            {member.name}
          </p>
          {member.character && (
            <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted" title={member.character}>
              {member.character}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
