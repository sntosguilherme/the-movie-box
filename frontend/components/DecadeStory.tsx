import { Sparkles } from "lucide-react";
import { DECADE_STORIES } from "./decades";

export type DecadeStoryProps = {
  decade: number;
};

export default function DecadeStory({ decade }: DecadeStoryProps) {
  const story = DECADE_STORIES[decade];
  if (!story) return null;

  return (
    <section
      aria-labelledby="decade-story-title"
      className="relative isolate animate-fade-up overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-primary/50 via-surface to-surface p-6 sm:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-10 -z-10 select-none font-display text-[9rem] leading-none text-white/[0.04] sm:-top-14 sm:text-[13rem]"
      >
        {decade}
      </span>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
        O cinema nos anos {decade}
      </p>
      <h2 id="decade-story-title" className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
        {story.headline}
      </h2>
      <p className="mt-4 max-w-3xl hyphens-auto text-justify leading-relaxed text-foreground/80">{story.summary}</p>
      <ul aria-label="Marcos da década" className="mt-6 flex flex-wrap gap-2">
        {story.landmarks.map((landmark, index) => (
          <li
            key={landmark}
            style={{ animationDelay: `${150 + index * 70}ms` }}
            className="animate-fade-up rounded-full border border-white/10 bg-black/25 px-3.5 py-1.5 text-sm text-foreground/90 backdrop-blur-sm"
          >
            {landmark}
          </li>
        ))}
      </ul>
    </section>
  );
}
