import { preconnect } from "react-dom";

// Família e peso por escrita. A fonte é pedida ao Google Fonts com `text=`, que devolve
// só os glifos do título (poucos KB), em vez das centenas de fatias de uma fonte CJK completa.
const fonts = {
  ja: { family: "Noto Serif JP", weight: 300 },
  zh: { family: "Noto Serif SC", weight: 300 },
  cn: { family: "Noto Serif TC", weight: 300 },
  ko: { family: "Noto Serif KR", weight: 300 },
  greekCyrillic: { family: "Noto Serif Display", weight: 300 },
  devanagari: { family: "Noto Serif Devanagari", weight: 300 },
  arabic: { family: "Noto Naskh Arabic", weight: 400 },
  thai: { family: "Noto Serif Thai", weight: 300 },
  hebrew: { family: "Noto Serif Hebrew", weight: 300 },
};

type Script = keyof typeof fonts | "latin" | "other";

function scriptOf(text: string, language: string): Script {
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text)) return "ja";
  if (/\p{Script=Han}/u.test(text)) return language === "ja" || language === "ko" || language === "cn" ? language : "zh";
  if (/\p{Script=Hangul}/u.test(text)) return "ko";
  if (/[\p{Script=Greek}\p{Script=Cyrillic}]/u.test(text)) return "greekCyrillic";
  if (/\p{Script=Devanagari}/u.test(text)) return "devanagari";
  if (/\p{Script=Arabic}/u.test(text)) return "arabic";
  if (/\p{Script=Thai}/u.test(text)) return "thai";
  if (/\p{Script=Hebrew}/u.test(text)) return "hebrew";
  if (/\p{Script=Latin}/u.test(text)) return "latin";
  return "other";
}

// O TMDB usa "cn" para cantonês, que não é um código ISO 639-1.
const languageTag = (language: string) => (language === "cn" ? "yue" : language);

function languageName(language: string) {
  try {
    return new Intl.DisplayNames(["pt-BR"], { type: "language" }).of(languageTag(language));
  } catch {
    return undefined;
  }
}

export type OriginalTitleProps = {
  title: string;
  language: string;
  /** Classes aplicadas apenas à versão vertical (posicionamento na página). */
  verticalClassName?: string;
};

export function isVerticalTitle(title: string, language: string) {
  const script = scriptOf(title, language);
  return (script === "ja" || script === "zh" || script === "cn") && [...title].length <= 12;
}

export default function OriginalTitle({ title, language, verticalClassName = "" }: OriginalTitleProps) {
  const script = scriptOf(title, language);
  const name = languageName(language);
  const label = `Título original${name && name !== language ? ` · ${name}` : ""}`;
  const font = script in fonts ? fonts[script as keyof typeof fonts] : undefined;
  const fontStyle = { fontFamily: font ? `"${font.family}", serif` : "serif", fontWeight: font?.weight ?? 300 };
  const lang = languageTag(language) || undefined;

  if (script === "latin") {
    return (
      <p className="animate-fade-up text-muted [animation-delay:90ms]">
        <span className="sr-only">{label}: </span>
        <span lang={lang} className="font-display text-2xl italic text-foreground/70 sm:text-3xl">
          {title}
        </span>
      </p>
    );
  }

  preconnect("https://fonts.gstatic.com", { crossOrigin: "anonymous" });
  const stylesheet = font && (
    <link
      rel="stylesheet"
      precedence="default"
      href={`https://fonts.googleapis.com/css2?family=${font.family.replaceAll(" ", "+")}:wght@${font.weight}&display=swap&text=${encodeURIComponent(title)}`}
    />
  );

  const horizontal = (
    <p className="animate-fade-up space-y-1 [animation-delay:90ms]">
      <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</span>
      <span
        lang={lang}
        dir="auto"
        style={fontStyle}
        className={`inline-block bg-gradient-to-r from-accent via-accent to-gold bg-clip-text pb-1 text-3xl leading-snug tracking-wide text-transparent sm:text-4xl`}
      >
        {title}
      </span>
    </p>
  );

  if (!isVerticalTitle(title, language)) {
    return (
      <>
        {stylesheet}
        {horizontal}
      </>
    );
  }

  // Títulos CJK curtos ficam na vertical, como na tradição tipográfica; em telas estreitas, na horizontal.
  return (
    <>
      {stylesheet}
      <div className="lg:hidden">{horizontal}</div>
      <div className={`hidden select-none flex-row-reverse gap-3 lg:flex ${verticalClassName}`}>
        <span
          lang={lang}
          style={fontStyle}
          className={`animate-ink-reveal bg-gradient-to-b from-accent via-accent to-gold bg-clip-text text-6xl leading-none tracking-[0.12em] text-transparent [writing-mode:vertical-rl]`}
        >
          {title}
        </span>
        <span className="animate-fade-in text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted [animation-delay:700ms] [writing-mode:vertical-rl]">
          {label}
        </span>
      </div>
    </>
  );
}
