export type DecadeStory = {
  headline: string;
  summary: string;
  landmarks: readonly string[];
};

/** Contexto do cinema em cada década do catálogo, indexado pelo primeiro ano da década. */
export const DECADE_STORIES: Readonly<Record<number, DecadeStory>> = {
  1870: {
    headline: "Antes do cinema",
    summary:
      "Cientistas e fotógrafos tentam decompor o movimento em imagens sucessivas. Jules Janssen registra a passagem de Vênus com seu revólver fotográfico, e Eadweard Muybridge fotografa um cavalo a galope em sequência, provando que as quatro patas saem do chão ao mesmo tempo.",
    landmarks: ["Revólver fotográfico de Janssen (1874)", "Praxinoscópio de Reynaud (1877)", "O cavalo em movimento, de Muybridge (1878)"],
  },
  1880: {
    headline: "As primeiras imagens em movimento",
    summary:
      "A cronofotografia de Étienne-Jules Marey transforma o movimento em objeto de estudo, e o filme flexível de celuloide torna possível registrar sequências longas. Em Leeds, Louis Le Prince grava a cena de jardim considerada o filme mais antigo preservado.",
    landmarks: ["Fuzil cronofotográfico de Marey (1882)", "Roundhay Garden Scene (1888)", "Filme de celuloide da Eastman (1889)"],
  },
  1890: {
    headline: "O nascimento do cinema",
    summary:
      "O cinetoscópio de Edison e Dickson exibe filmes para um espectador por vez, até que os irmãos Lumière projetam imagens para uma plateia pagante em Paris. Em poucos anos, Georges Méliès descobre as trucagens e transforma o registro do cotidiano em espetáculo de fantasia.",
    landmarks: ["Cinetoscópio de Edison e Dickson (1893)", "Sessão dos Lumière no Grand Café (1895)", "Primeiras trucagens de Méliès (1896)"],
  },
  1900: {
    headline: "Histórias em movimento",
    summary:
      "Os filmes deixam de ser vistas curtas e passam a contar histórias com cortes, montagem e efeitos. Méliès leva o público à Lua, Edwin S. Porter cria o faroeste de ação e os nickelodeons espalham salas baratas pelos Estados Unidos.",
    landmarks: ["Viagem à Lua (1902)", "O Grande Roubo do Trem (1903)", "A febre dos nickelodeons (1905)"],
  },
  1910: {
    headline: "O longa-metragem e Hollywood",
    summary:
      "As produções crescem até virar longas-metragens: a Itália impressiona com épicos monumentais e D. W. Griffith consolida a gramática narrativa do cinema americano. Os estúdios se instalam em Hollywood, e Chaplin apresenta Carlitos ao mundo.",
    landmarks: ["Cabíria (1914)", "Estreia de Carlitos (1914)", "Intolerância (1916)"],
  },
  1920: {
    headline: "A era de ouro do cinema mudo",
    summary:
      "O expressionismo alemão explora sombras e cenários distorcidos, a escola soviética faz da montagem uma arma e Chaplin, Keaton e Lloyd elevam a comédia física. No fim da década, o som sincronizado chega às salas e encerra a era muda.",
    landmarks: ["Nosferatu (1922)", "O Encouraçado Potemkin (1925)", "O Cantor de Jazz (1927)"],
  },
  1930: {
    headline: "Som, cor e o sistema de estúdios",
    summary:
      "Com os filmes falados, Hollywood vive o auge do sistema de estúdios: musicais, filmes de gângster, monstros da Universal e comédias malucas. O Technicolor ganha espaço, a Disney lança seu primeiro longa animado e o Código Hays passa a censurar o que vai às telas.",
    landmarks: ["Frankenstein (1931)", "Branca de Neve e os Sete Anões (1937)", "O Mágico de Oz (1939)"],
  },
  1940: {
    headline: "Guerra, noir e neorrealismo",
    summary:
      "A Segunda Guerra marca a produção mundial, entre propaganda e escapismo. Orson Welles reinventa a linguagem com Cidadão Kane, o film noir mergulha nas sombras urbanas e, no pós-guerra, o neorrealismo italiano leva a câmera para as ruas com atores não profissionais.",
    landmarks: ["Cidadão Kane (1941)", "Casablanca (1942)", "Ladrões de Bicicleta (1948)"],
  },
  1950: {
    headline: "Telas largas contra a televisão",
    summary:
      "Para competir com a TV, Hollywood aposta no CinemaScope, em épicos e no 3D, enquanto o Método de atuação revela Brando e James Dean. O cinema japonês conquista os festivais com Kurosawa, e no fim da década a Nouvelle Vague começa a surgir na França.",
    landmarks: ["Rashomon (1950)", "Os Sete Samurais (1954)", "Os Incompreendidos (1959)"],
  },
  1960: {
    headline: "As novas ondas",
    summary:
      "Jovens cineastas rompem com as regras: a Nouvelle Vague francesa, o Cinema Novo brasileiro de Glauber Rocha, os autores italianos e o faroeste spaghetti de Sergio Leone. Nos Estados Unidos, o Código Hays cai e abre caminho para a Nova Hollywood.",
    landmarks: ["Acossado (1960)", "Deus e o Diabo na Terra do Sol (1964)", "2001: Uma Odisseia no Espaço (1968)"],
  },
  1970: {
    headline: "Nova Hollywood e o blockbuster",
    summary:
      "Diretores-autores como Coppola e Scorsese ganham liberdade nos estúdios, até que Tubarão e Star Wars inventam o blockbuster de verão. No Brasil, a Embrafilme impulsiona a produção e Dona Flor e Seus Dois Maridos bate recordes de público.",
    landmarks: ["O Poderoso Chefão (1972)", "Tubarão (1975)", "Star Wars (1977)"],
  },
  1980: {
    headline: "VHS e o cinema-pipoca",
    summary:
      "O videocassete leva os filmes para dentro de casa e as locadoras viram ponto de encontro. Hollywood investe em aventuras de alto conceito, franquias e astros de ação, enquanto o cinema de Hong Kong revoluciona as cenas de luta e a ficção científica ganha visual sombrio.",
    landmarks: ["E.T. – O Extraterrestre (1982)", "Blade Runner (1982)", "De Volta para o Futuro (1985)"],
  },
  1990: {
    headline: "Independentes e efeitos digitais",
    summary:
      "A computação gráfica dá vida a dinossauros e cria o primeiro longa totalmente animado por computador. O cinema independente explode com Tarantino e os festivais, Titanic bate recordes de bilheteria e o Brasil vive a Retomada após o fim da Embrafilme.",
    landmarks: ["Jurassic Park (1993)", "Toy Story (1995)", "Central do Brasil (1998)"],
  },
  2000: {
    headline: "Franquias e câmeras digitais",
    summary:
      "Sagas como O Senhor dos Anéis e Harry Potter dominam as bilheterias, e os super-heróis se firmam como gênero. As câmeras e projeções digitais substituem a película, Avatar reaviva o 3D e o cinema brasileiro ganha projeção internacional.",
    landmarks: ["Cidade de Deus (2002)", "O Senhor dos Anéis: O Retorno do Rei (2003)", "Avatar (2009)"],
  },
  2010: {
    headline: "Universos compartilhados e streaming",
    summary:
      "Os universos compartilhados de super-heróis batem recordes, enquanto o streaming passa a produzir filmes premiados. O terror autoral ganha prestígio e o cinema não falado em inglês rompe barreiras, com a Coreia do Sul no topo de Cannes.",
    landmarks: ["Corra! (2017)", "Roma (2018)", "Parasita (2019)"],
  },
  2020: {
    headline: "Pandemia e novas janelas",
    summary:
      "A pandemia de covid-19 fecha as salas e empurra estreias direto para o streaming, encurtando a janela de exibição nos cinemas. O público volta aos poucos, embalado por fenômenos como o \"Barbenheimer\", e o cinema brasileiro conquista seu primeiro Oscar.",
    landmarks: ["Nomadland (2020)", "Barbie e Oppenheimer (2023)", "Ainda Estou Aqui (2024)"],
  },
};
