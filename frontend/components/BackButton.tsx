export default function BackButton({ href = "/" }: { href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex rounded-lg border border-border bg-primary px-4 py-2.5 font-semibold text-foreground hover:bg-primary-hover"
    >
      Voltar ao catálogo
    </a>
  );
}
