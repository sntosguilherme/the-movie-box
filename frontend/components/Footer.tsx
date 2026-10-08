export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-1 px-4 py-8 text-xs text-muted/80 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>THE MOVIE BOX. · Estrutura de Dados II</p>
        {/* Atribuição exigida pelos termos de uso da API do TMDB. */}
        <p>
          Dados e imagens do{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="font-semibold text-muted underline-offset-4 hover:text-foreground hover:underline">
            TMDB
          </a>
          . Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.
        </p>
      </div>
    </footer>
  );
}
