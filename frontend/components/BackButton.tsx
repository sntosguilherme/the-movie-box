import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex rounded-lg border border-border bg-primary px-4 py-2.5 font-semibold text-foreground hover:bg-primary-hover"
    >
      Voltar ao catálogo
    </Link>
  );
}
