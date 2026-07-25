import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/* VERSAO_MODELOS_LINK_REGISTER_CORRIGIDO_VIVALISTA */

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Palette = {
  bg: string;
  paper: string;
  ink: string;
  muted: string;
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
};

type TemplateKind =
  | "wedding-romantic"
  | "wedding-blacktie"
  | "wedding-forest"
  | "love-letters"
  | "debutante-luxury"
  | "birthday-premium"
  | "kitchen-elegant"
  | "baby-delicate"
  | "reveal-soft"
  | "house-clean"
  | "graduation-classic"
  | "corporate-premium"
  | "faith-sacred";

type Model = {
  slug: string;
  title: string;
  type: string;
  hosts: string;
  date: string;
  isoDate: string;
  time: string;
  place: string;
  city: string;
  description: string;
  previewImage: string;
  heroImage: string;
  gallery: string[];
  palette: Palette;
  kind: TemplateKind;
  eyebrow: string;
  headline: string;
  subheadline: string;
  storyTitle: string;
  storyText: string;
  giftTitle: string;
  rsvpText: string;
};

const images = {
  weddingHero:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=96",
  weddingCouple:
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1800&q=96",
  weddingCouple2:
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=96",
  weddingVenue:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=96",
  weddingDinner:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=96",
  weddingFlowers:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=96",
  weddingCake:
    "https://images.unsplash.com/photo-1519741347686-c1e331fcb4d7?auto=format&fit=crop&w=1800&q=96",
  blackTie:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=96",
  forest:
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2400&q=96",
  letters:
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=2200&q=96",
  debutante:
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=2200&q=96",
  debutante2:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=96",
  party:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2200&q=96",
  childParty:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=2200&q=96",
  kitchen:
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=2200&q=96",
  kitchen2:
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1800&q=96",
  kitchen3:
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1800&q=96",
  baby:
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=2200&q=96",
  baby2:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1800&q=96",
  reveal:
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=2200&q=96",
  house:
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=2200&q=96",
  house2:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=96",
  graduation:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2200&q=96",
  graduation2:
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1800&q=96",
  corporate:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=96",
  corporate2:
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=96",
  baptism:
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=2200&q=96",
};

const models = {
  "casamento-romantico": {
    slug: "casamento-romantico",
    title: "Casamento Romântico",
    type: "Casamento",
    hosts: "Aline & Leonardo",
    date: "24 de agosto de 2026",
    isoDate: "2026-08-24T17:00:00",
    time: "17h00",
    place: "Villa Oliva",
    city: "Itu, SP",
    description:
      "Convite premium com abertura pelo selo, site completo por seções, contagem regressiva, galeria, presentes e confirmação.",
    previewImage: images.weddingHero,
    heroImage: images.weddingHero,
    gallery: [
      images.weddingCouple,
      images.weddingCouple2,
      images.weddingVenue,
      images.weddingDinner,
      images.weddingFlowers,
    ],
    palette: {
      bg: "#efe4d8",
      paper: "#fffaf2",
      ink: "#2b241f",
      muted: "#7c6a5f",
      primary: "#b88b54",
      secondary: "#d8b890",
      accent: "#c6964e",
      dark: "#0a0807",
    },
    kind: "wedding-romantic",
    eyebrow: "Com muito amor",
    headline: "O início do nosso para sempre",
    subheadline: "Uma celebração elegante para viver com família e amigos.",
    storyTitle: "Dois caminhos. Um mesmo destino.",
    storyText:
      "Nos encontramos quando menos esperávamos e, desde então, cada momento juntos fez sentido. Entre risos, sonhos e escolhas, descobrimos que o amor é o nosso melhor capítulo.",
    giftTitle: "Com carinho",
    rsvpText: "Confirme sua presença para celebrarmos esse dia juntos.",
  },
  "casamento-luxo": {
    slug: "casamento-luxo",
    title: "Casamento Luxo",
    type: "Casamento",
    hosts: "Helena & Rafael",
    date: "19 de setembro de 2026",
    isoDate: "2026-09-19T20:00:00",
    time: "20h00",
    place: "Palácio das Artes",
    city: "São Paulo",
    description:
      "Black tie, alto contraste, dourado e capa cinematográfica para uma noite sofisticada.",
    previewImage: images.blackTie,
    heroImage: images.blackTie,
    gallery: [images.blackTie, images.weddingCouple2, images.weddingDinner, images.weddingFlowers],
    palette: {
      bg: "#070506",
      paper: "#111111",
      ink: "#f7efe4",
      muted: "#b8a890",
      primary: "#f0c96b",
      secondary: "#8d6a24",
      accent: "#f6d778",
      dark: "#030303",
    },
    kind: "wedding-blacktie",
    eyebrow: "Black tie wedding",
    headline: "Uma noite de gala para o amor",
    subheadline: "Elegância, jantar, música e celebração em grande estilo.",
    storyTitle: "Sofisticação em cada detalhe.",
    storyText:
      "Escolhemos uma noite elegante para celebrar com quem faz parte da nossa história. Entre luzes, brindes e música, queremos viver cada detalhe com presença e emoção.",
    giftTitle: "Lista nobre",
    rsvpText: "Confirme sua presença para uma noite inesquecível.",
  },
  "casamento-rustico": {
    slug: "casamento-rustico",
    title: "Casamento Rústico",
    type: "Casamento",
    hosts: "Clara & Miguel",
    date: "08 de novembro de 2026",
    isoDate: "2026-11-08T16:30:00",
    time: "16h30",
    place: "Fazenda Boa Vista",
    city: "São Roque, SP",
    description:
      "Natureza, campo, textura orgânica e uma experiência acolhedora para cerimônias ao ar livre.",
    previewImage: images.forest,
    heroImage: images.forest,
    gallery: [images.forest, images.weddingCouple, images.weddingVenue, images.weddingFlowers],
    palette: {
      bg: "#e9eadf",
      paper: "#fffaf0",
      ink: "#243026",
      muted: "#687061",
      primary: "#58704f",
      secondary: "#a97342",
      accent: "#d4a261",
      dark: "#172018",
    },
    kind: "wedding-forest",
    eyebrow: "Campo e natureza",
    headline: "Um sim cercado de verde",
    subheadline: "Leve, natural e perfeito para cerimônias ao ar livre.",
    storyTitle: "A beleza mora no simples.",
    storyText:
      "Sonhamos com um dia leve, cercado de verde, família e amigos. Queremos que cada convidado sinta o aconchego do campo e a alegria desse encontro ao ar livre.",
    giftTitle: "Presentes para a nova fase",
    rsvpText: "Confirme sua presença para aproveitarmos esse dia na natureza.",
  },
  "casamento-folhas": {
    slug: "casamento-folhas",
    title: "Casamento Folhas",
    type: "Casamento",
    hosts: "Lívia & Daniel",
    date: "17 de outubro de 2026",
    isoDate: "2026-10-17T16:00:00",
    time: "16h00",
    place: "Jardim das Oliveiras",
    city: "Vinhedo, SP",
    description: "Um modelo botânico, claro e delicado, com clima de folhas, luz natural e cerimônia ao ar livre.",
    previewImage: images.weddingCouple,
    heroImage: images.weddingCouple,
    gallery: [images.weddingCouple, images.forest, images.weddingVenue, images.weddingFlowers],
    palette: {
      bg: "#eef0e7",
      paper: "#fffdf5",
      ink: "#243326",
      muted: "#69715f",
      primary: "#566f4b",
      secondary: "#9f7b4f",
      accent: "#c9a46c",
      dark: "#152016",
    },
    kind: "wedding-forest",
    eyebrow: "Folhas e amor",
    headline: "Um sim cercado de natureza",
    subheadline: "Um casamento leve, orgânico e cheio de presença.",
    storyTitle: "A delicadeza de viver o simples.",
    storyText: "Escolhemos um lugar com verde, luz natural e afeto para celebrar o nosso amor com as pessoas mais importantes da nossa história.",
    giftTitle: "Para nossa nova fase",
    rsvpText: "Confirme sua presença para vivermos esse dia juntos.",
  },
  "casamento-serenata": {
    slug: "casamento-serenata",
    title: "Casamento Serenata",
    type: "Casamento",
    hosts: "Ana & Rafael",
    date: "06 de junho de 2026",
    isoDate: "2026-06-06T18:30:00",
    time: "18h30",
    place: "Casa das Artes",
    city: "São Paulo",
    description: "Um modelo romântico, musical e emocional, com fotos em tela cheia e transições suaves durante a rolagem.",
    previewImage: images.weddingCouple2,
    heroImage: images.weddingCouple2,
    gallery: [images.weddingCouple2, images.weddingCouple, images.weddingDinner, images.weddingFlowers],
    palette: {
      bg: "#f2e4d7",
      paper: "#fff8ef",
      ink: "#33231f",
      muted: "#80685e",
      primary: "#9b654d",
      secondary: "#d6a66f",
      accent: "#d7a758",
      dark: "#1d1210",
    },
    kind: "wedding-romantic",
    eyebrow: "Serenata de amor",
    headline: "A trilha do nosso para sempre",
    subheadline: "Um convite romântico com pausas visuais, fotos grandes e emoção na rolagem.",
    storyTitle: "Nosso amor também tem melodia.",
    storyText: "Cada encontro, cada riso e cada escolha nos trouxe até aqui. Agora queremos transformar essa história em uma celebração cheia de música e afeto.",
    giftTitle: "Com carinho",
    rsvpText: "Confirme sua presença para celebrar essa noite conosco.",
  },
  "noivado-elegante": {
    slug: "noivado-elegante",
    title: "Noivado Elegante",
    type: "Noivado",
    hosts: "Bianca & Lucas",
    date: "15 de março de 2026",
    isoDate: "2026-03-15T18:00:00",
    time: "18h00",
    place: "Jardim da Família",
    city: "Campinas, SP",
    description:
      "Visual de carta, papel, promessa e anúncio especial para família e amigos.",
    previewImage: images.letters,
    heroImage: images.letters,
    gallery: [images.letters, images.weddingCouple, images.weddingCouple2, images.weddingFlowers],
    palette: {
      bg: "#f5eadf",
      paper: "#fffdf8",
      ink: "#3d2f2a",
      muted: "#806f66",
      primary: "#9e7053",
      secondary: "#d8b18e",
      accent: "#c7875c",
      dark: "#2b1d18",
    },
    kind: "love-letters",
    eyebrow: "Cartas de amor",
    headline: "O começo de uma promessa",
    subheadline: "Uma página delicada para anunciar o próximo capítulo.",
    storyTitle: "Uma carta aberta aos nossos convidados.",
    storyText:
      "Escrevemos este convite como quem guarda uma carta importante: com carinho, cuidado e vontade de dividir com vocês o começo de uma nova fase.",
    giftTitle: "Carinho em forma de presente",
    rsvpText: "Confirme sua presença nesse encontro especial.",
  },
  "bodas-elegante": {
    slug: "bodas-elegante",
    title: "Bodas Elegante",
    type: "Bodas",
    hosts: "Marina & Roberto",
    date: "26 de junho de 2026",
    isoDate: "2026-06-26T19:00:00",
    time: "19h00",
    place: "Salão Família",
    city: "Santos, SP",
    description:
      "Linha do tempo, votos, memórias e galeria para celebrar uma história construída juntos.",
    previewImage: images.weddingCouple2,
    heroImage: images.weddingCouple2,
    gallery: [images.weddingCouple2, images.letters, images.weddingCouple, images.weddingDinner],
    palette: {
      bg: "#f4eee6",
      paper: "#fffdf8",
      ink: "#2f2a26",
      muted: "#77706b",
      primary: "#9a744f",
      secondary: "#c6a078",
      accent: "#d1a461",
      dark: "#26201c",
    },
    kind: "love-letters",
    eyebrow: "Nossa história",
    headline: "Anos de amor, memórias e cuidado",
    subheadline: "Uma celebração para honrar tudo que foi vivido.",
    storyTitle: "Uma vida escrita a dois.",
    storyText:
      "Foram muitos anos de parceria, cuidado e memórias. Agora queremos celebrar essa história com a família e os amigos que caminharam ao nosso lado.",
    giftTitle: "Lembranças e carinho",
    rsvpText: "Confirme sua presença para celebrar essa história conosco.",
  },
  "debutante-luxo": {
    slug: "debutante-luxo",
    title: "Debutante Luxo",
    type: "15 anos",
    hosts: "Isabella",
    date: "18 de outubro de 2026",
    isoDate: "2026-10-18T20:00:00",
    time: "20h00",
    place: "Espaço Imperial",
    city: "São Paulo",
    description:
      "Roxo profundo, ouro líquido e clima red carpet para uma noite inesquecível.",
    previewImage: images.debutante,
    heroImage: images.debutante,
    gallery: [images.debutante, images.debutante2, images.party, images.weddingFlowers],
    palette: {
      bg: "#14091f",
      paper: "#211033",
      ink: "#fff8ff",
      muted: "#d9c3eb",
      primary: "#8b3ff2",
      secondary: "#3b0b5f",
      accent: "#f6cb63",
      dark: "#0d0417",
    },
    kind: "debutante-luxury",
    eyebrow: "15 anos premium",
    headline: "Uma noite para brilhar",
    subheadline: "Capa glamourosa, dress code, contagem regressiva e RSVP.",
    storyTitle: "O início de uma nova fase.",
    storyText:
      "Chegou a noite que eu tanto sonhei. Preparei cada detalhe para receber pessoas especiais e viver uma celebração cheia de brilho, dança e emoção.",
    giftTitle: "Mimos e experiências",
    rsvpText: "Confirme sua presença para essa noite especial.",
  },
  "debutante-princesa": {
    slug: "debutante-princesa",
    title: "Debutante Princesa",
    type: "15 anos",
    hosts: "Sofia",
    date: "22 de agosto de 2026",
    isoDate: "2026-08-22T20:00:00",
    time: "20h00",
    place: "Castelo Garden",
    city: "São Paulo",
    description: "Delicado, mágico e com clima de sonho para uma festa encantadora.",
    previewImage: images.debutante2,
    heroImage: images.debutante2,
    gallery: [images.debutante2, images.debutante, images.party, images.weddingFlowers],
    palette: {
      bg: "#fbedf6",
      paper: "#fff8fd",
      ink: "#4a2341",
      muted: "#946e8a",
      primary: "#b65ca0",
      secondary: "#f1b4d7",
      accent: "#f4ca75",
      dark: "#36132e",
    },
    kind: "debutante-luxury",
    eyebrow: "15 anos encantado",
    headline: "Um sonho em forma de festa",
    subheadline: "Romântico, delicado e cheio de brilho.",
    storyTitle: "Um capítulo inesquecível.",
    storyText: "Sempre imaginei esse dia como um sonho delicado. Agora chegou a hora de viver essa noite ao lado das pessoas que fazem meu mundo mais bonito.",
    giftTitle: "Presentes especiais",
    rsvpText: "Confirme sua presença nessa celebração.",
  },
  "aniversario-infantil-divertido": {
    slug: "aniversario-infantil-divertido",
    title: "Infantil Divertido",
    type: "Aniversário infantil",
    hosts: "Pedro faz 7",
    date: "11 de abril de 2026",
    isoDate: "2026-04-11T15:00:00",
    time: "15h00",
    place: "Buffet Mundo Feliz",
    city: "São Paulo",
    description: "Colorido, alegre e fácil de compartilhar com a família.",
    previewImage: images.childParty,
    heroImage: images.childParty,
    gallery: [images.childParty, images.party, images.baby2, images.weddingCake],
    palette: {
      bg: "#fff8e8",
      paper: "#ffffff",
      ink: "#2d2560",
      muted: "#756a92",
      primary: "#5f4fd8",
      secondary: "#ff8f3d",
      accent: "#ffce4f",
      dark: "#251b55",
    },
    kind: "birthday-premium",
    eyebrow: "Festa divertida",
    headline: "A diversão começa no convite",
    subheadline: "Tema, endereço, confirmação e presentes em uma página alegre.",
    storyTitle: "Um dia para brincar, sorrir e comemorar.",
    storyText: "Preparem os sorrisos, a alegria e a vontade de brincar. O Pedro vai comemorar com muita diversão, carinho e momentos especiais com a família.",
    giftTitle: "Sugestões de presente",
    rsvpText: "Confirme a presença da família.",
  },
  "aniversario-adulto-premium": {
    slug: "aniversario-adulto-premium",
    title: "Aniversário Premium",
    type: "Aniversário adulto",
    hosts: "Festa da Camila",
    date: "13 de junho de 2026",
    isoDate: "2026-06-13T21:00:00",
    time: "21h00",
    place: "Lounge Rooftop",
    city: "São Paulo",
    description: "Moderno, elegante e perfeito para uma noite especial.",
    previewImage: images.party,
    heroImage: images.party,
    gallery: [images.party, images.blackTie, images.debutante, images.weddingDinner],
    palette: {
      bg: "#120d18",
      paper: "#21172c",
      ink: "#fff8f2",
      muted: "#c6b8cf",
      primary: "#c57bff",
      secondary: "#f0a45a",
      accent: "#f6cf72",
      dark: "#08060c",
    },
    kind: "birthday-premium",
    eyebrow: "Aniversário premium",
    headline: "Uma noite para celebrar em grande estilo",
    subheadline: "Capa marcante, dress code, local, RSVP e galeria.",
    storyTitle: "Celebre sua fase com presença.",
    storyText: "Quero celebrar mais um ciclo com pessoas especiais, boa música, boas conversas e uma noite para guardar na memória.",
    giftTitle: "Experiências e carinho",
    rsvpText: "Confirme sua presença para essa noite especial.",
  },
  "cha-bebe-delicado": {
    slug: "cha-bebe-delicado",
    title: "Chá de Bebê Delicado",
    type: "Chá de bebê",
    hosts: "Chá do Miguel",
    date: "12 de julho de 2026",
    isoDate: "2026-07-12T15:00:00",
    time: "15h00",
    place: "Casa da Família",
    city: "São Paulo",
    description: "Azul névoa, areia e luz suave para um convite delicado e familiar.",
    previewImage: images.baby,
    heroImage: images.baby,
    gallery: [images.baby, images.baby2, images.reveal, images.house2],
    palette: {
      bg: "#f5f9fb",
      paper: "#ffffff",
      ink: "#263f52",
      muted: "#6f8494",
      primary: "#8ab7cc",
      secondary: "#cdb99b",
      accent: "#d7c4a6",
      dark: "#17384d",
    },
    kind: "baby-delicate",
    eyebrow: "Chá de bebê",
    headline: "Miguel está chegando",
    subheadline: "Um encontro delicado para celebrar a nova vida.",
    storyTitle: "Uma espera cheia de amor.",
    storyText:
      "Estamos vivendo uma espera linda e queremos dividir esse momento com vocês. Cada presença, mensagem e carinho fará parte da chegada do Miguel.",
    giftTitle: "Lista do enxoval",
    rsvpText: "Confirme sua presença nesse momento especial.",
  },
  "cha-revelacao-suave": {
    slug: "cha-revelacao-suave",
    title: "Chá Revelação Suave",
    type: "Chá revelação",
    hosts: "Família Martins",
    date: "05 de julho de 2026",
    isoDate: "2026-07-05T16:00:00",
    time: "16h00",
    place: "Espaço Jardim",
    city: "São Paulo",
    description: "Uma descoberta emocionante em uma página encantadora.",
    previewImage: images.reveal,
    heroImage: images.reveal,
    gallery: [images.reveal, images.baby, images.baby2, images.childParty],
    palette: {
      bg: "#fff7fb",
      paper: "#ffffff",
      ink: "#39415d",
      muted: "#7e7b92",
      primary: "#7db5d8",
      secondary: "#e49bbf",
      accent: "#f0cf7d",
      dark: "#26304a",
    },
    kind: "reveal-soft",
    eyebrow: "Chá revelação",
    headline: "Menino ou menina?",
    subheadline: "Um convite leve para viver a surpresa com família e amigos.",
    storyTitle: "A descoberta mais esperada.",
    storyText: "A curiosidade está no ar e queremos descobrir essa surpresa ao lado de quem amamos. Venha viver esse momento com a nossa família.",
    giftTitle: "Presentes e carinho",
    rsvpText: "Confirme sua presença para descobrir com a gente.",
  },
  "cha-cozinha-elegante": {
    slug: "cha-cozinha-elegante",
    title: "Chá de Cozinha Elegante",
    type: "Chá de cozinha",
    hosts: "Laislla & Renan",
    date: "02 de maio de 2026",
    isoDate: "2026-05-02T13:00:00",
    time: "13h00",
    place: "Casa da Família",
    city: "São Paulo",
    description:
      "Verde sálvia, terracota e atmosfera artesanal para lista de presentes, reserva e Pix livre.",
    previewImage: images.kitchen,
    heroImage: images.kitchen,
    gallery: [images.kitchen, images.kitchen2, images.kitchen3, images.house2],
    palette: {
      bg: "#f4efe7",
      paper: "#fffaf2",
      ink: "#2e3e35",
      muted: "#74665a",
      primary: "#647c62",
      secondary: "#b46545",
      accent: "#c9a46c",
      dark: "#24342c",
    },
    kind: "kitchen-elegant",
    eyebrow: "Chá de cozinha",
    headline: "Uma nova casa começa com carinho",
    subheadline: "Lista de presentes, reserva, Pix livre e localização em uma página acolhedora.",
    storyTitle: "Um encontro para equipar a casa nova.",
    storyText:
      "Estamos preparando uma tarde leve e especial para celebrar nossa nova fase. Sua presença e carinho vão deixar esse momento ainda mais bonito.",
    giftTitle: "Lista da cozinha",
    rsvpText: "Confirme sua presença e escolha um presente com carinho.",
  },
  "casa-nova-clean": {
    slug: "casa-nova-clean",
    title: "Casa Nova Clean",
    type: "Casa nova",
    hosts: "Ana & Pedro",
    date: "04 de setembro de 2026",
    isoDate: "2026-09-04T18:00:00",
    time: "18h00",
    place: "Apartamento novo",
    city: "Vila Mariana",
    description: "Grafite, cobre e interiores sofisticados para open house e casa nova.",
    previewImage: images.house,
    heroImage: images.house,
    gallery: [images.house, images.house2, images.kitchen2, images.kitchen3],
    palette: {
      bg: "#f3f1ed",
      paper: "#ffffff",
      ink: "#222629",
      muted: "#6a6864",
      primary: "#2f3437",
      secondary: "#a0603d",
      accent: "#c47a4a",
      dark: "#171a1d",
    },
    kind: "house-clean",
    eyebrow: "Casa nova",
    headline: "Nosso novo lar",
    subheadline: "Open house, localização, presentes e contribuição livre em um visual clean.",
    storyTitle: "A casa começa a ganhar vida.",
    storyText: "Abrir as portas do nosso novo lar é uma alegria enorme. Queremos receber vocês para brindar, conversar e começar essa fase com boas memórias.",
    giftTitle: "Itens para o novo lar",
    rsvpText: "Confirme sua presença para conhecer nosso novo cantinho.",
  },
  "formatura-classica": {
    slug: "formatura-classica",
    title: "Formatura Clássica",
    type: "Formatura",
    hosts: "Medicina 2026",
    date: "29 de novembro de 2026",
    isoDate: "2026-11-29T19:30:00",
    time: "19h30",
    place: "Salão Nobre",
    city: "São Paulo",
    description: "Preto absoluto, dourado e editorial de luxo para uma grande conquista.",
    previewImage: images.graduation,
    heroImage: images.graduation,
    gallery: [images.graduation, images.graduation2, images.corporate2, images.blackTie],
    palette: {
      bg: "#f7f3ea",
      paper: "#ffffff",
      ink: "#111111",
      muted: "#626262",
      primary: "#111111",
      secondary: "#020202",
      accent: "#d6b557",
      dark: "#030303",
    },
    kind: "graduation-classic",
    eyebrow: "Formatura",
    headline: "Uma conquista para celebrar",
    subheadline: "Programação, local, turma, confirmação e fotos em um site elegante.",
    storyTitle: "O fim de uma jornada. O início de muitas outras.",
    storyText: "Depois de tantos plantões, provas, noites de estudo e histórias compartilhadas, chegou a hora de comemorar essa conquista juntos.",
    giftTitle: "Contribuições e homenagens",
    rsvpText: "Confirme sua presença nessa conquista.",
  },
  "batizado-sagrado": {
    slug: "batizado-sagrado",
    title: "Batizado Sagrado",
    type: "Batizado",
    hosts: "Batizado da Helena",
    date: "16 de agosto de 2026",
    isoDate: "2026-08-16T10:00:00",
    time: "10h00",
    place: "Paróquia São José",
    city: "São Paulo",
    description: "Delicado, familiar e cheio de significado para cerimônias religiosas.",
    previewImage: images.baptism,
    heroImage: images.baptism,
    gallery: [images.baptism, images.baby, images.letters, images.weddingFlowers],
    palette: {
      bg: "#f8f5ee",
      paper: "#ffffff",
      ink: "#31302d",
      muted: "#77736c",
      primary: "#8b7a55",
      secondary: "#d6c6a0",
      accent: "#c6a963",
      dark: "#25231f",
    },
    kind: "faith-sacred",
    eyebrow: "Batizado",
    headline: "Um dia de bênção e família",
    subheadline: "Cerimônia, padrinhos, recepção e confirmação em um convite delicado.",
    storyTitle: "Um momento de fé e amor.",
    storyText: "Com fé e gratidão, queremos reunir nossa família para celebrar este momento de bênção, amor e cuidado na vida da Helena.",
    giftTitle: "Lembranças com carinho",
    rsvpText: "Confirme sua presença nesse momento de bênção.",
  },
  "corporativo-premium": {
    slug: "corporativo-premium",
    title: "Corporativo Premium",
    type: "Evento empresarial",
    hosts: "VivaLista Summit",
    date: "08 de dezembro de 2026",
    isoDate: "2026-12-08T09:00:00",
    time: "09h00",
    place: "Centro de Eventos",
    city: "São Paulo",
    description: "Navy, ciano elétrico e atmosfera tech premium para eventos empresariais.",
    previewImage: images.corporate,
    heroImage: images.corporate,
    gallery: [images.corporate, images.corporate2, images.graduation2, images.house2],
    palette: {
      bg: "#edf4f8",
      paper: "#ffffff",
      ink: "#071526",
      muted: "#506173",
      primary: "#071b34",
      secondary: "#0b2f5a",
      accent: "#21c8ff",
      dark: "#020b16",
    },
    kind: "corporate-premium",
    eyebrow: "Evento corporativo",
    headline: "Conteúdo, networking e presença de marca",
    subheadline: "Programação, palestrantes, inscrição, local e patrocinadores.",
    storyTitle: "Uma experiência profissional em um único link.",
    storyText: "Preparamos um encontro para conectar pessoas, ideias e oportunidades. Será um dia de conteúdo, networking e conversas que geram movimento.",
    giftTitle: "Inscrição e acesso",
    rsvpText: "Reserve sua participação no evento.",
  },
} satisfies Record<string, Model>;

function isModelSlug(slug: string): slug is keyof typeof models {
  return slug in models;
}

function themeVars(model: Model): CSSProperties & Record<string, string> {
  return {
    "--bg": model.palette.bg,
    "--paper": model.palette.paper,
    "--ink": model.palette.ink,
    "--muted": model.palette.muted,
    "--primary": model.palette.primary,
    "--secondary": model.palette.secondary,
    "--accent": model.palette.accent,
    "--dark": model.palette.dark,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isModelSlug(slug)) {
    return {
      title: "Modelo não encontrado | VivaLista",
    };
  }

  const model = models[slug];

  return {
    title: `${model.title} | Modelos VivaLista`,
    description: model.description,
  };
}

export function generateStaticParams() {
  return Object.keys(models).map((slug) => ({ slug }));
}

function GlobalStyle({ model }: { model: Model }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scroll-behavior: smooth; }
            body { margin: 0; }
            .vl-model-page {
              min-height: 100vh;
              color: var(--ink);
              background: var(--bg);
              font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            .vl-display {
              font-family: Georgia, "Times New Roman", serif;
              font-weight: 400;
              letter-spacing: -.06em;
            }
            .vl-serif {
              font-family: Georgia, "Times New Roman", serif;
              font-weight: 400;
            }
            .vl-eyebrow {
              margin: 0;
              color: var(--accent);
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .24em;
              text-transform: uppercase;
            }
            .vl-section-title {
              margin: 0;
              color: var(--ink);
              font-family: Georgia, "Times New Roman", serif;
              font-size: clamp(2.6rem, 5vw, 5.8rem);
              font-weight: 400;
              line-height: .96;
              letter-spacing: -.055em;
            }
            .vl-muted { color: var(--muted); }
            .vl-floating-actions {
              position: fixed;
              inset-inline: 0;
              bottom: 16px;
              z-index: 80;
              display: flex;
              justify-content: center;
              padding: 0 16px;
              pointer-events: none;
            }
            .vl-action-shell {
              pointer-events: auto;
              display: flex;
              width: min(560px, 100%);
              gap: 10px;
              border: 1px solid rgba(255,255,255,.35);
              border-radius: 999px;
              background: rgba(0,0,0,.42);
              padding: 8px;
              box-shadow: 0 24px 70px rgba(0,0,0,.30);
              backdrop-filter: blur(18px);
            }
            .vl-action-shell a {
              flex: 1;
              border-radius: 999px;
              padding: 15px 14px;
              color: #fff;
              text-align: center;
              text-decoration: none;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .14em;
              text-transform: uppercase;
              transition: transform .22s ease, background .22s ease;
            }
            .vl-action-shell a:first-child { border: 1px solid rgba(255,255,255,.20); }
            .vl-action-shell a:last-child {
              flex: 1.35;
              background: var(--accent);
              color: var(--dark);
              box-shadow: 0 14px 30px rgba(0,0,0,.24);
            }
            .vl-action-shell a:hover { transform: translateY(-1px); }
            .vl-menu {
              position: sticky;
              top: 0;
              z-index: 60;
              border-bottom: 1px solid rgba(255,255,255,.18);
              background: rgba(255,255,255,.78);
              backdrop-filter: blur(18px);
            }
            .vl-menu.dark { background: rgba(0,0,0,.42); }
            .vl-menu-inner {
              margin: 0 auto;
              display: flex;
              max-width: 1180px;
              flex-wrap: wrap;
              justify-content: center;
              gap: 6px 22px;
              padding: 14px 16px;
            }
            .vl-menu a {
              color: var(--muted);
              text-decoration: none;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .16em;
              text-transform: uppercase;
            }
            .vl-menu.dark a { color: rgba(255,255,255,.72); }
            .vl-menu a:hover { color: var(--accent); }
            .vl-open-checkbox {
              position: absolute;
              opacity: 0;
              pointer-events: none;
            }
            .vl-invite-gate {
              position: fixed;
              inset: 0;
              z-index: 100;
              display: grid;
              place-items: center;
              overflow: hidden;
              background: linear-gradient(135deg, #f7eadc, #fffaf2 48%, #ead7bf);
              transition: opacity .75s ease 1.05s, visibility .75s ease 1.05s;
            }
            .vl-invite-stage {
              position: relative;
              width: min(940px, calc(100vw - 28px));
              height: min(560px, calc(100vh - 42px));
              display: grid;
              place-items: center;
              perspective: 1600px;
            }
            .vl-envelope {
              position: relative;
              width: min(900px, 100%);
              height: min(470px, 72vh);
              overflow: hidden;
              border-radius: 34px;
              background-size: cover;
              background-position: center;
              box-shadow: 0 48px 145px rgba(86,57,31,.28), 0 0 0 1px rgba(255,255,255,.88);
              transition: transform 1.3s cubic-bezier(.2,.8,.2,1), opacity .78s ease 1.32s;
            }
            .vl-envelope::before {
              content: "";
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, rgba(255,255,255,.34), rgba(86,57,31,.22));
            }
            .vl-flap {
              position: absolute;
              left: 50%; top: 0;
              z-index: 2;
              width: 74%; height: 43%;
              transform: translateX(-50%) rotateX(0);
              transform-origin: top center;
              clip-path: polygon(0 0,100% 0,50% 100%);
              background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(236,222,204,.82));
              box-shadow: 0 24px 42px rgba(95,65,37,.16);
              transition: transform 1.18s cubic-bezier(.18,.88,.25,1), opacity .85s ease;
            }
            .vl-paper {
              position: absolute;
              left: 50%; top: 38px;
              z-index: 1;
              width: min(480px, 72%);
              min-height: 255px;
              transform: translate(-50%, 90px) scale(.92);
              opacity: .14;
              border: 1px solid rgba(184,139,84,.20);
              background: rgba(255,253,247,.94);
              box-shadow: 0 18px 46px rgba(86,57,31,.16);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              color: #8d6737;
              transition: transform 1.18s cubic-bezier(.2,.8,.2,1), opacity .55s ease;
            }
            .vl-paper strong { font-size: clamp(2.8rem, 5vw, 5.6rem); line-height: .88; }
            .vl-paper p { margin: 18px 0 0; font-size: 10px; font-weight: 900; letter-spacing: .22em; text-transform: uppercase; }
            .vl-open-seal {
              position: absolute;
              left: 50%; top: 50%;
              z-index: 8;
              transform: translate(-50%, -50%);
              width: 138px; height: 138px;
              border: 0;
              border-radius: 999px;
              display: grid;
              place-items: center;
              cursor: pointer;
              color: white;
            }
            .vl-open-seal::before {
              content: "";
              position: absolute;
              inset: 17px;
              border-radius: 999px;
              background: radial-gradient(circle at 32% 28%, #ffe8a8, #c88c35 42%, #823f1d 76%, #361409);
              box-shadow: 0 16px 34px rgba(90,48,20,.36), inset 0 2px 8px rgba(255,255,255,.48);
              opacity: .34;
              animation: vlPulse 2s ease-in-out infinite;
            }
            .vl-open-seal span {
              position: relative;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.74);
              background: rgba(49,32,20,.58);
              padding: 14px 16px;
              font-size: 10px;
              line-height: 1.35;
              font-weight: 900;
              letter-spacing: .19em;
              text-align: center;
              text-transform: uppercase;
              backdrop-filter: blur(4px);
            }
            #vlOpenInvite:checked ~ .vl-invite-gate .vl-flap { transform: translateX(-50%) rotateX(-176deg) translateY(-14px); opacity: .28; }
            #vlOpenInvite:checked ~ .vl-invite-gate .vl-paper { transform: translate(-50%, -180px) scale(1.02); opacity: 1; }
            #vlOpenInvite:checked ~ .vl-invite-gate .vl-envelope { transform: translateY(-26px) scale(.96); opacity: .95; }
            #vlOpenInvite:checked ~ .vl-invite-gate .vl-open-seal { opacity: 0; pointer-events: none; }
            #vlOpenInvite:checked ~ .vl-invite-gate { opacity: 0; visibility: hidden; pointer-events: none; }
            #vlOpenInvite:not(:checked) ~ .vl-site { height: 0; overflow: hidden; opacity: 0; pointer-events: none; }
            #vlOpenInvite:checked ~ .vl-site { animation: vlReveal .95s cubic-bezier(.2,.8,.2,1) 1.45s both; }
            .vl-hero {
              position: relative;
              min-height: 720px;
              overflow: hidden;
              background: var(--dark);
              color: white;
            }
            .vl-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
            .vl-hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,0,0,.52), rgba(0,0,0,.10)); }
            .vl-hero-content {
              position: relative;
              z-index: 2;
              margin: 0 auto;
              display: flex;
              min-height: 720px;
              max-width: 1180px;
              align-items: center;
              padding: 90px 24px;
            }
            .vl-hero-box { max-width: 680px; }
            .vl-hero-title {
              margin: 22px 0 0;
              color: #fff7ea;
              font-size: clamp(4.4rem, 10vw, 8.8rem);
              line-height: .82;
            }
            .vl-hero-title span { display: block; color: var(--accent); }
            .vl-hero-subtitle { margin: 28px 0 0; max-width: 560px; color: rgba(255,255,255,.78); font-size: clamp(1.35rem, 2.3vw, 2.35rem); line-height: 1.18; }
            .vl-scroll-photo {
              position: relative;
              min-height: 92vh;
              display: grid;
              place-items: center;
              overflow: hidden;
              color: #fff;
              isolation: isolate;
              background-size: cover;
              background-position: center 34%;
              background-attachment: fixed;
            }
            .vl-scroll-photo.compact { min-height: 76vh; }
            .vl-scroll-photo::before {
              content: "";
              position: absolute;
              inset: 0;
              z-index: -2;
              background: inherit;
              filter: saturate(1.02) contrast(1.03);
            }
            .vl-scroll-photo::after {
              content: "";
              position: absolute;
              inset: 0;
              z-index: -1;
              background:
                linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.18) 36%, rgba(0,0,0,.66)),
                radial-gradient(circle at 50% 35%, rgba(255,255,255,.08), transparent 34%);
            }
            .vl-scroll-photo.fade-top::after {
              background:
                linear-gradient(180deg, var(--paper) 0%, rgba(0,0,0,.10) 18%, rgba(0,0,0,.34) 56%, rgba(0,0,0,.76) 100%),
                radial-gradient(circle at 50% 42%, rgba(255,255,255,.10), transparent 34%);
            }
            .vl-scroll-photo-content {
              width: min(760px, calc(100vw - 36px));
              padding: clamp(32px, 6vw, 64px);
              border: 1px solid rgba(255,255,255,.28);
              border-radius: 42px;
              background: linear-gradient(180deg, rgba(0,0,0,.34), rgba(0,0,0,.18));
              text-align: center;
              box-shadow: 0 30px 110px rgba(0,0,0,.24);
              backdrop-filter: blur(10px);
            }
            .vl-scroll-photo-content .vl-eyebrow { color: var(--accent); }
            .vl-scroll-photo-title {
              margin: 18px 0 0;
              color: #fff7ea;
              font-size: clamp(3.4rem, 8vw, 7.8rem);
              line-height: .88;
              text-shadow: 0 18px 70px rgba(0,0,0,.38);
            }
            .vl-scroll-photo-text {
              margin: 24px auto 0;
              max-width: 620px;
              color: rgba(255,255,255,.82);
              font-size: clamp(1.05rem, 1.9vw, 1.45rem);
              line-height: 1.72;
            }
            .vl-scroll-photo-date {
              margin-top: 28px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.28);
              background: rgba(255,255,255,.10);
              padding: 13px 20px;
              color: rgba(255,255,255,.88);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .18em;
              text-transform: uppercase;
            }
            .vl-cinematic-scroll {
              position: relative;
              min-height: 156vh;
              overflow: clip;
              background: var(--paper);
              isolation: isolate;
            }
            .vl-cinematic-bg {
              position: sticky;
              top: 0;
              z-index: 0;
              height: 100vh;
              min-height: 680px;
              background-image: var(--cinema-image);
              background-size: cover;
              background-position: var(--cinema-position, center 36%);
              background-repeat: no-repeat;
              transform: translateZ(0);
            }
            .vl-cinematic-bg::before {
              content: "";
              position: absolute;
              inset: 0;
              background:
                linear-gradient(90deg, rgba(0,0,0,.70), rgba(0,0,0,.28) 48%, rgba(0,0,0,.08)),
                radial-gradient(circle at 48% 42%, rgba(255,255,255,.10), transparent 34%);
            }
            .vl-cinematic-bg::after {
              content: "";
              position: absolute;
              inset: 0;
              background:
                linear-gradient(180deg, var(--paper) 0%, rgba(255,255,255,0) 13%, rgba(0,0,0,0) 70%, var(--paper) 100%);
              pointer-events: none;
            }
            .vl-cinematic-copy {
              position: relative;
              z-index: 2;
              width: min(760px, calc(100vw - 36px));
              margin: -78vh auto 44vh;
              padding: clamp(34px, 6vw, 68px);
              text-align: left;
              color: white;
            }
            .vl-cinematic-copy.center {
              text-align: center;
            }
            .vl-cinematic-copy.right {
              margin-left: auto;
              margin-right: min(7vw, 96px);
            }
            .vl-cinematic-copy.left {
              margin-left: min(7vw, 96px);
              margin-right: auto;
            }
            .vl-cinematic-kicker {
              display: inline-flex;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.28);
              background: rgba(255,255,255,.10);
              padding: 11px 16px;
              color: var(--accent);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .24em;
              text-transform: uppercase;
              backdrop-filter: blur(10px);
            }
            .vl-cinematic-title {
              margin: 22px 0 0;
              color: #fff7ea;
              font-size: clamp(4.2rem, 10vw, 9.4rem);
              line-height: .82;
              text-shadow: 0 20px 90px rgba(0,0,0,.48);
            }
            .vl-cinematic-title span {
              display: block;
              color: var(--accent);
            }
            .vl-cinematic-text {
              margin: 26px 0 0;
              max-width: 640px;
              color: rgba(255,255,255,.86);
              font-size: clamp(1.08rem, 1.8vw, 1.42rem);
              line-height: 1.78;
              text-shadow: 0 10px 40px rgba(0,0,0,.38);
            }
            .vl-cinematic-copy.center .vl-cinematic-text {
              margin-left: auto;
              margin-right: auto;
            }
            .vl-cinematic-meta {
              margin-top: 30px;
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            .vl-cinematic-copy.center .vl-cinematic-meta {
              justify-content: center;
            }
            .vl-cinematic-meta span {
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.24);
              background: rgba(0,0,0,.20);
              padding: 12px 15px;
              color: rgba(255,255,255,.88);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .15em;
              text-transform: uppercase;
              backdrop-filter: blur(10px);
            }
            .vl-cinematic-scroll.soft .vl-cinematic-bg::before {
              background:
                linear-gradient(90deg, rgba(0,0,0,.58), rgba(0,0,0,.20) 48%, rgba(0,0,0,.06)),
                radial-gradient(circle at 48% 42%, rgba(255,255,255,.16), transparent 36%);
            }
            .vl-cinematic-scroll.dark .vl-cinematic-bg::before {
              background:
                linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.42) 50%, rgba(0,0,0,.16)),
                radial-gradient(circle at 48% 42%, rgba(255,255,255,.08), transparent 34%);
            }

            .vl-hero-meta { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 12px; }
            .vl-pill {
              border: 1px solid rgba(255,255,255,.18);
              border-radius: 999px;
              background: rgba(255,255,255,.08);
              padding: 12px 16px;
              color: rgba(255,255,255,.82);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .16em;
              text-transform: uppercase;
              backdrop-filter: blur(8px);
            }
            .vl-countdown { padding: 70px 20px; text-align: center; background: var(--dark); color: #fff; }
            .vl-time-grid { margin: 28px auto 0; display: grid; max-width: 820px; grid-template-columns: repeat(4, 1fr); gap: 14px; }
            .vl-time-card { border: 1px solid rgba(255,255,255,.12); border-radius: 24px; background: rgba(255,255,255,.08); padding: 24px 16px; backdrop-filter: blur(10px); }
            .vl-time-card strong { display: block; color: var(--accent); font-family: Georgia, serif; font-size: clamp(2.2rem,4vw,4rem); font-weight: 400; }
            .vl-time-card span { display: block; margin-top: 8px; color: rgba(255,255,255,.62); font-size: 10px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
            .vl-section { padding: 86px 20px; }
            .vl-section.paper { background: var(--paper); }
            .vl-section.dark { background: var(--dark); color: #fff; }
            .vl-section.alt { background: color-mix(in srgb, var(--bg) 78%, #ffffff); }
            .vl-inner { max-width: 1180px; margin: 0 auto; }
            .vl-split { display: grid; grid-template-columns: .92fr 1.08fr; gap: 54px; align-items: center; }
            .vl-split.reverse { grid-template-columns: 1.08fr .92fr; }
            .vl-text p { color: var(--muted); font-size: 17px; line-height: 1.9; }
            .vl-photo-card { min-height: 500px; overflow: hidden; border: 12px solid var(--paper); background: var(--paper); box-shadow: 0 24px 80px rgba(0,0,0,.13); }
            .vl-photo-card.rounded { border-radius: 38px; }
            .vl-photo-card div, .vl-gallery-item div, .vl-card-image { width: 100%; height: 100%; background-size: cover; background-position: center 36%; transition: transform .7s ease, filter .5s ease; }
            .vl-photo-card:hover div, .vl-gallery-item:hover div { transform: scale(1.04); filter: brightness(1.02); }
            .vl-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
            .vl-gallery-item { height: 270px; overflow: hidden; border-radius: 26px; background: #ddd; }
            .vl-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
            .vl-card { overflow: hidden; border: 1px solid rgba(0,0,0,.08); border-radius: 28px; background: var(--paper); box-shadow: 0 18px 54px rgba(0,0,0,.08); }
            .vl-card-image { height: 190px; }
            .vl-card-body { padding: 22px; }
            .vl-card h3 { margin: 0; color: var(--ink); font-family: Georgia, serif; font-size: 24px; font-weight: 400; }
            .vl-card p { margin: 10px 0 0; color: var(--muted); line-height: 1.65; }
            .vl-button { display: inline-flex; align-items: center; justify-content: center; min-height: 50px; padding: 0 24px; border-radius: 999px; background: var(--accent); color: var(--dark); text-decoration: none; font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
            .vl-rsvp-box { display: grid; grid-template-columns: .8fr 1.2fr; overflow: hidden; border-radius: 34px; background: rgba(255,255,255,.72); box-shadow: 0 28px 90px rgba(0,0,0,.12); }
            .vl-rsvp-left { background: var(--dark); color: #fff; padding: 48px; }
            .vl-rsvp-form { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; padding: 48px; }
            .vl-rsvp-form input, .vl-rsvp-form select { border: 1px solid rgba(0,0,0,.12); background: transparent; padding: 15px 14px; color: var(--ink); font-size: 12px; font-weight: 800; outline: none; }
            .vl-rsvp-form button { grid-column: 1/-1; border: 0; background: var(--dark); color: var(--accent); padding: 16px; font-size: 11px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; cursor: pointer; }
            .vl-footer { background: var(--dark); color: rgba(255,255,255,.62); text-align: center; padding: 34px 20px 110px; }
            .vl-footer strong { color: var(--accent); font-family: Georgia, serif; font-size: 30px; font-weight: 400; }

            .template-blacktie { background: var(--dark); color: var(--ink); }
            .black-hero { min-height: 760px; display: grid; grid-template-columns: 1fr 1fr; background: var(--dark); color: #fff; }
            .black-hero-copy { display: flex; flex-direction: column; justify-content: center; padding: 80px clamp(24px,6vw,90px); }
            .black-hero-title { font-size: clamp(4.2rem,9vw,9rem); line-height: .82; color: #fff; }
            .black-hero-image { min-height: 760px; background-size: cover; background-position: center 34%; position: relative; }
            .black-hero-image::after { content:""; position:absolute; inset:0; background: linear-gradient(90deg, var(--dark), transparent 42%); }
            .luxury-strip { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(255,255,255,.14); }
            .luxury-strip div { padding: 34px; background: #0a0a0a; color: #fff; }
            .luxury-strip strong { display: block; color: var(--accent); font-family: Georgia,serif; font-size: 28px; font-weight: 400; }

            .forest-page { background: linear-gradient(180deg, var(--bg), #fffaf0); }
            .forest-hero { min-height: 780px; display: grid; place-items: center; text-align: center; color: #fff; background-size: cover; background-position: center 40%; position: relative; }
            .forest-hero::before { content:""; position:absolute; inset:0; background: radial-gradient(circle at center, rgba(0,0,0,.15), rgba(0,0,0,.62)); }
            .forest-hero-card { position: relative; z-index: 2; width: min(760px, calc(100vw - 34px)); padding: 54px; border-radius: 42px; border: 1px solid rgba(255,255,255,.34); background: linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.09)); box-shadow: 0 32px 110px rgba(0,0,0,.24); backdrop-filter: blur(14px); }
            .forest-hero-card h1 { font-size: clamp(4rem,10vw,8rem); line-height:.86; color: #fff; }
            .forest-circle-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }
            .forest-circle { text-align:center; }
            .forest-circle div { width: 210px; height: 210px; margin:0 auto 18px; border-radius:999px; background-size:cover; background-position:center 36%; border: 8px solid var(--paper); box-shadow: 0 18px 50px rgba(0,0,0,.15); }

            .letter-page { background: var(--bg); }
            .letter-hero { min-height: 720px; display: grid; place-items: center; padding: 80px 20px; background: radial-gradient(circle at 20% 20%, rgba(255,255,255,.74), transparent 28%), var(--bg); }
            .letter-paper { width: min(900px, 100%); padding: clamp(36px,7vw,88px); background: var(--paper); border: 1px solid rgba(0,0,0,.08); box-shadow: 0 30px 120px rgba(80,49,29,.16); transform: rotate(-1deg); }
            .letter-paper h1 { margin: 20px 0 0; font-size: clamp(3.8rem,9vw,8rem); line-height: .88; }
            .letter-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:20px; }
            .letter-note { background: var(--paper); padding:28px; border:1px solid rgba(0,0,0,.08); box-shadow:0 14px 44px rgba(0,0,0,.06); }

            .debutante-page { background: var(--dark); color: #fff; }
            .debutante-hero { min-height: 780px; display: grid; grid-template-columns: 1fr 1fr; background: radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--primary) 42%, transparent), transparent 36%), var(--dark); }
            .debutante-copy { display:flex; flex-direction:column; justify-content:center; padding:80px clamp(24px,6vw,90px); }
            .debutante-title { font-size: clamp(4.8rem,11vw,10rem); line-height:.78; color:#fff; text-shadow:0 16px 42px rgba(0,0,0,.32); }
            .debutante-photo { margin: 70px 70px 70px 0; border-radius: 999px 999px 46px 46px; background-size: cover; background-position: center 30%; box-shadow: 0 40px 120px rgba(0,0,0,.40); border: 10px solid rgba(255,255,255,.12); }
            .glam-timeline { display:grid; grid-template-columns: repeat(4,1fr); gap:18px; }
            .glam-item { border:1px solid rgba(255,255,255,.12); border-radius:30px; background:rgba(255,255,255,.08); padding:28px; }
            .glam-item strong { color: var(--accent); font-size: 30px; font-family: Georgia,serif; }

            .kitchen-page { background: var(--bg); }
            .kitchen-hero { min-height: 720px; display: grid; grid-template-columns: .95fr 1.05fr; align-items: center; gap: 42px; max-width:1180px; margin:0 auto; padding:84px 24px; }
            .kitchen-photo { min-height:580px; border-radius:44px; background-size:cover; background-position:center 38%; box-shadow: 0 30px 90px rgba(36,52,44,.16); }
            .kitchen-copy { background: rgba(255,255,255,.72); border:1px solid rgba(0,0,0,.07); border-radius:38px; padding:48px; box-shadow: 0 24px 70px rgba(36,52,44,.10); }
            .kitchen-copy h1 { font-size: clamp(3.4rem,7vw,7rem); line-height:.88; }
            .recipe-row { display:grid; grid-template-columns: repeat(3,1fr); gap:18px; }
            .recipe-card { background:var(--paper); border-radius:30px; padding:28px; box-shadow:0 18px 54px rgba(36,52,44,.08); }

            .soft-page { background: linear-gradient(180deg, var(--bg), #fff); }
            .soft-hero { min-height: 720px; display:grid; place-items:center; text-align:center; padding:80px 20px; background: radial-gradient(circle at 50% 10%, rgba(255,255,255,.9), transparent 34%), var(--bg); }
            .soft-orb { width:min(440px,72vw); height:min(440px,72vw); border-radius:999px; background-size:cover; background-position:center 34%; border:12px solid #fff; box-shadow:0 24px 80px rgba(0,0,0,.10); margin-bottom:32px; }
            .soft-hero h1 { font-size: clamp(3.8rem,9vw,7.5rem); line-height:.86; }
            .soft-card-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:20px; }
            .soft-card { background:#fff; border-radius:32px; padding:30px; box-shadow:0 18px 54px rgba(0,0,0,.07); }

            .house-hero { min-height: 740px; display:grid; grid-template-columns:1fr 1.18fr; background:#fff; }
            .house-copy { padding:90px clamp(24px,6vw,86px); display:flex; flex-direction:column; justify-content:center; }
            .house-copy h1 { font-size: clamp(4rem,9vw,8.2rem); line-height:.82; }
            .house-image { margin:32px; border-radius:42px; background-size:cover; background-position:center 38%; box-shadow: 0 24px 80px rgba(0,0,0,.12); }
            .interior-grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:18px; }
            .interior-card { min-height:310px; border-radius:32px; background-size:cover; background-position:center 40%; position:relative; overflow:hidden; }
            .interior-card span { position:absolute; left:20px; bottom:20px; border-radius:999px; background:rgba(255,255,255,.86); padding:10px 14px; font-weight:900; font-size:11px; letter-spacing:.12em; text-transform:uppercase; }

            .graduation-page { background:#f7f3ea; }
            .grad-hero { min-height:720px; display:grid; place-items:center; padding:90px 20px; background:linear-gradient(135deg,#050505,#202020); color:#fff; text-align:center; }
            .grad-hero h1 { font-size: clamp(4rem,10vw,9rem); line-height:.82; color:#fff; }
            .grad-program { display:grid; grid-template-columns: repeat(4,1fr); gap:14px; }
            .grad-program div { border-radius:28px; background:#111; color:#fff; padding:28px; }
            .grad-program strong { color:var(--accent); font-family:Georgia,serif; font-size:30px; }

            .corporate-page { background:#edf4f8; }
            .corp-hero { min-height:720px; display:grid; grid-template-columns:1fr 1fr; background:var(--dark); color:#fff; }
            .corp-copy { padding:90px clamp(24px,6vw,86px); display:flex; flex-direction:column; justify-content:center; }
            .corp-copy h1 { font-size: clamp(3.6rem,8vw,7.8rem); line-height:.88; color:#fff; }
            .corp-image { background-size:cover; background-position:center 36%; position:relative; }
            .corp-image::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,var(--dark),transparent); }
            .agenda-grid { display:grid; grid-template-columns: .7fr 1.3fr; gap:18px; }
            .agenda-time { border-radius:28px; background:var(--dark); color:var(--accent); padding:28px; font-family:Georgia,serif; font-size:34px; }
            .agenda-desc { border-radius:28px; background:#fff; padding:28px; }


            .vl-gallery-item,
            .vl-card,
            .vl-photo-card,
            .kitchen-photo,
            .house-image,
            .black-hero-image,
            .corp-image {
              isolation: isolate;
            }
            .vl-card-image::after,
            .vl-gallery-item::after {
              content: "";
              position: absolute;
              inset: 0;
              pointer-events: none;
              background: linear-gradient(180deg, transparent 48%, rgba(0,0,0,.08));
            }
            .vl-card-image,
            .vl-gallery-item {
              position: relative;
              overflow: hidden;
            }


            /* ===== VARIAÇÕES DE DNA DOS MODELOS ===== */
            .vl-signature-section {
              position: relative;
              padding: 94px 20px;
              background:
                radial-gradient(circle at 12% 12%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 32%),
                linear-gradient(180deg, var(--paper), color-mix(in srgb, var(--bg) 82%, #ffffff));
              overflow: hidden;
            }
            .vl-signature-card {
              max-width: 1120px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: .95fr 1.05fr;
              gap: 34px;
              align-items: center;
              border: 1px solid rgba(0,0,0,.08);
              border-radius: 44px;
              background: rgba(255,255,255,.62);
              box-shadow: 0 28px 90px rgba(0,0,0,.10);
              overflow: hidden;
              backdrop-filter: blur(14px);
            }
            .vl-signature-photo {
              min-height: 560px;
              background-size: cover;
              background-position: center 34%;
            }
            .vl-signature-copy {
              padding: clamp(34px, 6vw, 70px);
            }
            .vl-signature-copy h2 {
              margin: 18px 0 0;
              font-size: clamp(3.2rem, 7vw, 7.4rem);
              line-height: .86;
            }
            .vl-signature-copy p:not(.vl-eyebrow) {
              margin: 24px 0 0;
              color: var(--muted);
              font-size: 18px;
              line-height: 1.85;
            }
            .vl-soft-pair {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
              margin-top: 34px;
            }
            .vl-soft-pair div {
              min-height: 360px;
              border-radius: 34px;
              background-size: cover;
              background-position: center 36%;
              box-shadow: 0 18px 54px rgba(0,0,0,.12);
            }

            .vl-botanical-band {
              padding: 92px 20px;
              background:
                linear-gradient(135deg, color-mix(in srgb, var(--bg) 84%, #ffffff), var(--paper));
            }
            .vl-botanical-inner {
              max-width: 1180px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: 1fr .78fr 1fr;
              gap: 18px;
              align-items: center;
            }
            .vl-botanical-frame {
              min-height: 480px;
              border: 14px solid rgba(255,255,255,.72);
              border-radius: 999px 999px 34px 34px;
              background-size: cover;
              background-position: center 36%;
              box-shadow: 0 24px 80px rgba(0,0,0,.13);
            }
            .vl-botanical-text {
              padding: 34px 18px;
              text-align: center;
            }
            .vl-botanical-text h2 {
              margin: 16px 0 0;
              font-size: clamp(3rem, 6vw, 6.4rem);
              line-height: .88;
            }
            .vl-botanical-text p {
              color: var(--muted);
              line-height: 1.85;
            }

            .vl-black-feature {
              padding: 96px 20px;
              background: #050505;
              color: #fff;
              overflow: hidden;
            }
            .vl-black-feature-inner {
              max-width: 1180px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: 1.1fr .9fr;
              gap: 28px;
              align-items: stretch;
            }
            .vl-black-feature-copy {
              border: 1px solid rgba(246,203,99,.28);
              border-radius: 40px;
              padding: clamp(34px, 6vw, 70px);
              background: linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
              box-shadow: 0 30px 100px rgba(0,0,0,.34);
            }
            .vl-black-feature-copy h2 {
              margin: 18px 0 0;
              color: #fff;
              font-size: clamp(3.3rem, 7vw, 7.8rem);
              line-height: .84;
            }
            .vl-black-feature-copy p {
              color: rgba(255,255,255,.72);
              line-height: 1.85;
              font-size: 18px;
            }
            .vl-black-feature-photo {
              min-height: 560px;
              border-radius: 40px;
              background-size: cover;
              background-position: center 35%;
              box-shadow: 0 30px 100px rgba(0,0,0,.42);
              filter: saturate(.94) contrast(1.06);
            }
            .vl-luxury-mini {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
              margin-top: 28px;
            }
            .vl-luxury-mini span {
              border: 1px solid rgba(246,203,99,.20);
              border-radius: 999px;
              padding: 12px;
              color: var(--accent);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .15em;
              text-transform: uppercase;
              text-align: center;
            }

            .vl-letter-scene {
              padding: 92px 20px;
              background:
                linear-gradient(135deg, var(--paper), color-mix(in srgb, var(--bg) 80%, #ffffff));
            }
            .vl-letter-scene-inner {
              max-width: 1050px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: .86fr 1.14fr;
              gap: 30px;
              align-items: center;
            }
            .vl-letter-photo {
              min-height: 520px;
              border-radius: 30px;
              background-size: cover;
              background-position: center 36%;
              transform: rotate(-2deg);
              box-shadow: 0 28px 80px rgba(70,43,25,.15);
            }
            .vl-letter-message {
              position: relative;
              padding: clamp(34px, 6vw, 70px);
              border: 1px solid rgba(0,0,0,.08);
              background: rgba(255,255,255,.74);
              box-shadow: 0 30px 90px rgba(70,43,25,.10);
            }
            .vl-letter-message::before {
              content: "";
              position: absolute;
              inset: 14px;
              border: 1px solid rgba(0,0,0,.07);
              pointer-events: none;
            }
            .vl-letter-message h2 {
              margin: 16px 0 0;
              font-size: clamp(3rem, 6vw, 6.5rem);
              line-height: .9;
            }
            .vl-letter-message p {
              color: var(--muted);
              line-height: 1.9;
              font-size: 18px;
            }

            .vl-glam-entrance {
              padding: 96px 20px;
              background:
                radial-gradient(circle at 20% 0%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 30%),
                linear-gradient(135deg, var(--dark), var(--secondary));
              color: #fff;
              overflow: hidden;
            }
            .vl-glam-inner {
              max-width: 1180px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: .95fr 1.05fr;
              gap: 30px;
              align-items: center;
            }
            .vl-glam-copy h2 {
              margin: 18px 0 0;
              color: #fff;
              font-size: clamp(3.5rem, 8vw, 8rem);
              line-height: .84;
            }
            .vl-glam-copy p {
              color: rgba(255,255,255,.75);
              line-height: 1.85;
              font-size: 18px;
            }
            .vl-glam-photos {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px;
              transform: rotate(-1deg);
            }
            .vl-glam-photos div {
              min-height: 460px;
              border-radius: 42px 42px 8px 8px;
              background-size: cover;
              background-position: center 34%;
              box-shadow: 0 28px 90px rgba(0,0,0,.34);
            }
            .vl-glam-photos div:nth-child(2) { transform: translateY(54px); }

            .vl-kitchen-board {
              padding: 92px 20px;
              background: color-mix(in srgb, var(--bg) 78%, #ffffff);
            }
            .vl-kitchen-board-inner {
              max-width: 1120px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: .9fr 1.1fr;
              gap: 26px;
              align-items: center;
            }
            .vl-kitchen-notes {
              display: grid;
              gap: 14px;
            }
            .vl-kitchen-note {
              border: 1px solid rgba(0,0,0,.08);
              border-radius: 28px;
              background: rgba(255,255,255,.74);
              padding: 28px;
              box-shadow: 0 16px 44px rgba(0,0,0,.07);
            }
            .vl-kitchen-note strong {
              display: block;
              font-family: Georgia, serif;
              color: var(--ink);
              font-size: 28px;
              margin-bottom: 8px;
            }
            .vl-kitchen-note p { margin: 0; color: var(--muted); line-height: 1.75; }
            .vl-kitchen-board-photo {
              min-height: 560px;
              border-radius: 42px;
              background-size: cover;
              background-position: center 36%;
              box-shadow: 0 24px 80px rgba(0,0,0,.14);
            }

            .vl-house-welcome {
              padding: 94px 20px;
              background: #f4f2ee;
            }
            .vl-house-welcome-inner {
              max-width: 1180px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 18px;
            }
            .vl-house-panel {
              min-height: 430px;
              border-radius: 40px;
              background-size: cover;
              background-position: center 40%;
              position: relative;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,.12);
            }
            .vl-house-panel::after {
              content: "";
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, transparent 42%, rgba(0,0,0,.42));
            }
            .vl-house-panel span {
              position: absolute;
              left: 24px;
              bottom: 24px;
              z-index: 2;
              border-radius: 999px;
              background: rgba(255,255,255,.86);
              padding: 12px 15px;
              color: var(--ink);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .15em;
              text-transform: uppercase;
            }

            .vl-grad-stage {
              padding: 96px 20px;
              background: linear-gradient(135deg,#070707,#252525);
              color:#fff;
            }
            .vl-grad-stage-inner {
              max-width: 1120px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 28px;
              align-items: center;
            }
            .vl-grad-stage-photo {
              min-height: 540px;
              border-radius: 40px;
              background-size: cover;
              background-position: center 36%;
              box-shadow: 0 30px 95px rgba(0,0,0,.40);
            }
            .vl-grad-stage-copy h2 {
              margin: 18px 0 0;
              color:#fff;
              font-size: clamp(3.2rem, 7vw, 7rem);
              line-height: .86;
            }
            .vl-grad-stage-copy p { color: rgba(255,255,255,.72); line-height:1.85; }

            .vl-corp-kpis {
              padding: 88px 20px;
              background: #061426;
              color:#fff;
            }
            .vl-corp-kpis-inner {
              max-width: 1180px;
              margin:0 auto;
              display:grid;
              grid-template-columns: .8fr 1.2fr;
              gap: 24px;
              align-items: stretch;
            }
            .vl-corp-kpis-copy {
              border-radius: 34px;
              padding: 38px;
              background: rgba(255,255,255,.06);
              border:1px solid rgba(33,200,255,.22);
            }
            .vl-corp-kpis-copy h2 { margin:16px 0 0; color:#fff; font-size: clamp(2.9rem, 5.4vw, 6rem); line-height:.9; }
            .vl-corp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
            .vl-corp-grid div { border-radius:30px; padding:30px; background:rgba(255,255,255,.08); border:1px solid rgba(33,200,255,.20); }
            .vl-corp-grid strong { display:block; color:var(--accent); font-family:Georgia,serif; font-size: clamp(2.6rem, 5vw, 5rem); line-height:1; }
            .vl-corp-grid span { display:block; margin-top:10px; color:rgba(255,255,255,.70); font-size:10px; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }

            .vl-gallery-stack {
              position: relative;
              min-height: 620px;
              margin-top: 38px;
            }
            .vl-stack-photo {
              position: absolute;
              width: 46%;
              min-height: 360px;
              border: 12px solid var(--paper);
              border-radius: 34px;
              background-size: cover;
              background-position: center 36%;
              box-shadow: 0 26px 80px rgba(0,0,0,.16);
              transition: transform .45s ease;
            }
            .vl-stack-photo:hover { transform: translateY(-8px) rotate(0deg) !important; }
            .vl-stack-photo:nth-child(1) { left: 2%; top: 28px; transform: rotate(-4deg); }
            .vl-stack-photo:nth-child(2) { right: 6%; top: 0; min-height: 430px; transform: rotate(3deg); }
            .vl-stack-photo:nth-child(3) { left: 24%; bottom: 10px; min-height: 320px; transform: rotate(1deg); }
            .vl-stack-caption { position:absolute; left:50%; bottom:0; transform:translateX(-50%); z-index:5; width:min(520px,90%); border-radius:999px; background:rgba(255,255,255,.88); color:var(--ink); padding:16px 22px; text-align:center; font-size:11px; font-weight:900; letter-spacing:.15em; text-transform:uppercase; box-shadow:0 18px 50px rgba(0,0,0,.12); }

            .vl-ribbon-gallery { overflow:hidden; margin-top:36px; border-radius:40px; background:rgba(255,255,255,.54); padding:18px 0; box-shadow:0 24px 80px rgba(0,0,0,.10); }
            .vl-ribbon-track { display:flex; gap:18px; width:max-content; animation: vlRibbon 32s linear infinite; }
            .vl-ribbon-gallery:hover .vl-ribbon-track { animation-play-state: paused; }
            .vl-ribbon-photo { width:min(410px,72vw); height:460px; border-radius:32px; background-size:cover; background-position:center 34%; box-shadow:0 18px 50px rgba(0,0,0,.14); }
            @keyframes vlRibbon { from { transform: translateX(0); } to { transform: translateX(-50%); } }

            .vl-magazine-grid { margin-top:36px; display:grid; grid-template-columns:1.2fr .8fr 1fr; gap:16px; align-items:stretch; }
            .vl-mag-card { min-height:290px; border-radius:34px; background-size:cover; background-position:center 36%; box-shadow:0 20px 65px rgba(0,0,0,.13); overflow:hidden; position:relative; }
            .vl-mag-card:nth-child(1) { grid-row: span 2; min-height:600px; }
            .vl-mag-card:nth-child(4) { grid-column: span 2; }
            .vl-mag-card::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg, transparent 45%, rgba(0,0,0,.18)); }

            .vl-gallery-minimal { margin-top:36px; display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
            .vl-gallery-minimal div { min-height:360px; border-radius:30px; background-size:cover; background-position:center 38%; box-shadow:0 16px 45px rgba(0,0,0,.10); transition:transform .35s ease; }
            .vl-gallery-minimal div:hover { transform: translateY(-6px) scale(1.015); }

            @media (max-width: 980px) {
              .vl-signature-card,
              .vl-botanical-inner,
              .vl-black-feature-inner,
              .vl-letter-scene-inner,
              .vl-glam-inner,
              .vl-kitchen-board-inner,
              .vl-grad-stage-inner,
              .vl-corp-kpis-inner {
                grid-template-columns: 1fr;
              }
              .vl-signature-photo,
              .vl-botanical-frame,
              .vl-black-feature-photo,
              .vl-letter-photo,
              .vl-kitchen-board-photo,
              .vl-grad-stage-photo { min-height: 420px; }
              .vl-house-welcome-inner,
              .vl-corp-grid,
              .vl-magazine-grid,
              .vl-gallery-minimal { grid-template-columns: 1fr; }
              .vl-stack-photo { position: relative; inset: auto !important; width: 100%; margin-bottom: 16px; transform: none !important; min-height: 330px; }
              .vl-gallery-stack { min-height: auto; }
              .vl-stack-caption { position: relative; margin: 10px auto 0; left:auto; bottom:auto; transform:none; }
              .vl-soft-pair { grid-template-columns: 1fr; }
            }

            @keyframes vlPulse { 0%,100%{ transform:scale(1); opacity:.28;} 50%{ transform:scale(1.10); opacity:.44;} }
            @keyframes vlReveal { from { opacity:0; transform:translateY(34px); filter:blur(10px);} to { opacity:1; transform:translateY(0); filter:blur(0);} }
            @media (max-width: 980px) {
              .vl-scroll-photo {
                min-height: 78vh;
                background-attachment: scroll;
                background-position: center 34%;
              }
              .vl-scroll-photo-content {
                width: min(680px, calc(100vw - 28px));
                border-radius: 30px;
              }

              .vl-cinematic-scroll {
                min-height: 118vh;
                overflow: hidden;
              }
              .vl-cinematic-bg {
                position: relative;
                height: 78vh;
                min-height: 520px;
                background-attachment: scroll;
              }
              .vl-cinematic-copy,
              .vl-cinematic-copy.left,
              .vl-cinematic-copy.right {
                width: min(680px, calc(100vw - 28px));
                margin: -58vh auto 24vh;
                padding: 28px 6px;
                text-align: center;
              }
              .vl-cinematic-title {
                font-size: clamp(3rem, 16vw, 5.4rem);
              }
              .vl-cinematic-meta {
                justify-content: center;
              }

              .vl-split, .vl-split.reverse, .black-hero, .debutante-hero, .kitchen-hero, .house-hero, .corp-hero, .vl-rsvp-box { grid-template-columns: 1fr; }
              .black-hero-image, .debutante-photo, .house-image, .corp-image { min-height: 420px; margin:0; }
              .vl-gallery, .vl-cards, .forest-circle-grid, .recipe-row, .soft-card-grid, .interior-grid, .grad-program { grid-template-columns: 1fr; }
              .vl-time-grid { grid-template-columns: repeat(2, 1fr); }
              .vl-rsvp-form { grid-template-columns: 1fr; }
              .agenda-grid { grid-template-columns: 1fr; }
            }
            @media (max-width: 640px) {
              .vl-hero, .vl-hero-content, .debutante-hero, .black-hero, .kitchen-hero, .soft-hero, .house-hero, .grad-hero, .corp-hero { min-height: auto; }
              .vl-hero-content, .kitchen-hero, .soft-hero, .grad-hero { padding: 70px 18px; }
              .vl-section { padding: 66px 18px; }
              .kitchen-copy, .letter-paper, .forest-hero-card { padding: 30px 22px; }
              .vl-action-shell a { font-size: 9px; letter-spacing:.10em; padding: 14px 8px; }
            }
          `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var targetDate = new Date("${model.isoDate}").getTime();
              function pad(value) { return String(value).padStart(2, "0"); }
              function updateCountdown() {
                var now = new Date().getTime();
                var distance = Math.max(targetDate - now, 0);
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
                var minutes = Math.floor((distance / (1000 * 60)) % 60);
                var seconds = Math.floor((distance / 1000) % 60);
                var d = document.getElementById("vl-count-days");
                var h = document.getElementById("vl-count-hours");
                var m = document.getElementById("vl-count-minutes");
                var s = document.getElementById("vl-count-seconds");
                if (d) d.textContent = String(days);
                if (h) h.textContent = pad(hours);
                if (m) m.textContent = pad(minutes);
                if (s) s.textContent = pad(seconds);
              }
              updateCountdown();
              setInterval(updateCountdown, 1000);
            })();
          `,
        }}
      />
    </>
  );
}

type ProgramItem = {
  time: string;
  title: string;
  text: string;
};

type GiftPreview = {
  title: string;
  text: string;
  image: string;
};

function getRegisterHref(model: Model): string {
  const typeByModelSlug: Record<string, string> = {
    "casamento-romantico": "casamento",
    "casamento-luxo": "casamento",
    "casamento-rustico": "casamento",
    "casamento-folhas": "casamento",
    "casamento-serenata": "casamento",
    "noivado-elegante": "noivado",
    "bodas-elegante": "bodas",
    "debutante-luxo": "debutante",
    "debutante-princesa": "debutante",
    "aniversario-infantil-divertido": "aniversario-infantil",
    "aniversario-adulto-premium": "aniversario-adulto",
    "cha-bebe-delicado": "cha-bebe",
    "cha-revelacao-suave": "cha-bebe",
    "cha-cozinha-elegante": "cha-cozinha",
    "casa-nova-clean": "casa-nova",
    "formatura-classica": "formatura",
    "batizado-sagrado": "religioso",
    "corporativo-premium": "corporativo",
  };

  const eventType = typeByModelSlug[model.slug] ?? "personalizado";
  const params = new URLSearchParams({
    tipo: eventType,
    modelo: model.slug,
  });

  return `/register?${params.toString()}`;
}

function FloatingActions({ model }: { model: Model }) {
  return (
    <div className="vl-floating-actions">
      <div className="vl-action-shell">
        <Link href="/">Voltar</Link>
        <Link href={getRegisterHref(model)}>Usar este modelo</Link>
      </div>
    </div>
  );
}

function StandardMenu({ dark = false }: { dark?: boolean }) {
  return (
    <nav className={`vl-menu ${dark ? "dark" : ""}`}>
      <div className="vl-menu-inner">
        <a href="#inicio">Início</a>
        <a href="#historia">História</a>
        <a href="#programacao">Programação</a>
        <a href="#galeria">Galeria</a>
        <a href="#localizacao">Local</a>
        <a href="#presentes">Presentes</a>
        <a href="#rsvp">Confirmação</a>
        <a href="#recados">Recados</a>
      </div>
    </nav>
  );
}

function getModelTone(model: Model) {
  if (model.kind.startsWith("wedding")) return "wedding";
  if (model.kind === "debutante-luxury") return "debutante";
  if (model.kind === "kitchen-elegant") return "kitchen";
  if (model.kind === "baby-delicate" || model.kind === "reveal-soft") return "baby";
  if (model.kind === "house-clean") return "house";
  if (model.kind === "graduation-classic") return "graduation";
  if (model.kind === "corporate-premium") return "corporate";
  if (model.kind === "faith-sacred") return "faith";
  return "social";
}

function sectionLabel(model: Model) {
  const tone = getModelTone(model);

  if (tone === "wedding") return "Nossa história";
  if (tone === "debutante") return "A debutante";
  if (tone === "kitchen") return "Nosso encontro";
  if (tone === "baby") return "Nossa espera";
  if (tone === "house") return "Nosso novo lar";
  if (tone === "graduation") return "Nossa conquista";
  if (tone === "corporate") return "Sobre o encontro";
  if (tone === "faith") return "Família e fé";
  return "Sobre o evento";
}

function galleryTitle(model: Model) {
  const tone = getModelTone(model);

  if (tone === "wedding") return "Memórias que já guardamos";
  if (tone === "debutante") return "Brilho, dança e emoção";
  if (tone === "kitchen") return "Detalhes para a nossa casa";
  if (tone === "baby") return "Carinho para a chegada";
  if (tone === "house") return "Cantinhos do novo lar";
  if (tone === "graduation") return "Da jornada à celebração";
  if (tone === "corporate") return "Pessoas, palco e conexões";
  if (tone === "faith") return "Um dia de bênção";
  return "Momentos especiais";
}

function programTitle(model: Model) {
  const tone = getModelTone(model);

  if (tone === "wedding") return "O dia em que tudo começa";
  if (tone === "debutante") return "A noite dos 15 anos";
  if (tone === "kitchen") return "Uma tarde preparada com carinho";
  if (tone === "baby") return "A tarde da família";
  if (tone === "house") return "Open house";
  if (tone === "graduation") return "Programação da conquista";
  if (tone === "corporate") return "Agenda do evento";
  if (tone === "faith") return "Cerimônia e recepção";
  return "Programação";
}

function programItems(model: Model): ProgramItem[] {
  const tone = getModelTone(model);

  if (tone === "wedding") {
    return [
      {
        time: model.time,
        title: "Cerimônia",
        text: `${model.place} recebe o nosso sim com família e amigos por perto.`,
      },
      {
        time: "Após o sim",
        title: "Recepção",
        text: "Jantar, brindes, pista e muitos abraços para celebrar essa nova fase.",
      },
      {
        time: "Até a última música",
        title: "Celebração",
        text: "Queremos viver cada detalhe com quem faz parte da nossa história.",
      },
    ];
  }

  if (tone === "debutante") {
    return [
      { time: "20h", title: "Recepção", text: "Chegada dos convidados e primeiros registros da noite." },
      { time: "21h", title: "Entrada", text: "Um momento especial para abrir a celebração." },
      { time: "22h", title: "Valsa", text: "A dança mais esperada com família e amigos." },
      { time: "23h", title: "Pista", text: "Música, fotos e festa até o último brilho." },
    ];
  }

  if (tone === "kitchen") {
    return [
      { time: model.time, title: "Chegada", text: "Recepção leve, mesa bonita e muito carinho logo na entrada." },
      { time: "Durante a tarde", title: "Brincadeiras", text: "Momentos simples para rir, conversar e celebrar essa nova fase." },
      { time: "Com carinho", title: "Presentes", text: "A lista ajuda a montar a cozinha e deixar a casa pronta para receber." },
    ];
  }

  if (tone === "baby") {
    return [
      { time: model.time, title: "Boas-vindas", text: "Uma tarde tranquila para receber família e amigos." },
      { time: "Com amor", title: "Enxoval", text: "Cada presente ajuda a preparar a chegada com cuidado." },
      { time: "Depois", title: "Fotos", text: "Registros delicados para lembrar desse momento." },
    ];
  }

  if (tone === "house") {
    return [
      { time: model.time, title: "Portas abertas", text: "Um encontro íntimo para conhecer nosso novo cantinho." },
      { time: "Ao redor da mesa", title: "Brinde", text: "Comidinhas, conversa boa e muita alegria pelo novo lar." },
      { time: "Com carinho", title: "Lista", text: "Sugestões simples para completar nossa casa." },
    ];
  }

  if (tone === "graduation") {
    return [
      { time: "19h30", title: "Cerimônia", text: "O momento oficial para celebrar a jornada da turma." },
      { time: "21h", title: "Fotos", text: "Registros com familiares, amigos e colegas de turma." },
      { time: "22h", title: "Jantar", text: "Uma noite para brindar conquistas e novos caminhos." },
      { time: "Depois", title: "Festa", text: "Música, abraços e celebração até o fim." },
    ];
  }

  if (tone === "corporate") {
    return [
      { time: "09h", title: "Credenciamento", text: "Recepção dos participantes, café e primeiras conexões." },
      { time: "10h", title: "Abertura", text: "Conteúdo principal, visão de mercado e tendências." },
      { time: "14h", title: "Painel", text: "Especialistas convidados para uma conversa prática." },
      { time: "17h", title: "Networking", text: "Troca de contatos e encerramento com presença de marca." },
    ];
  }

  return [
    { time: model.time, title: "Cerimônia", text: "Um momento de fé, família e carinho." },
    { time: "Depois", title: "Recepção", text: "Um encontro simples para estar perto de quem amamos." },
    { time: "Com gratidão", title: "Lembranças", text: "Registros e recados para guardar esse dia." },
  ];
}

function giftPreviews(model: Model): GiftPreview[] {
  const tone = getModelTone(model);

  if (tone === "corporate") {
    return [
      { title: "Inscrição presencial", text: "Acesso ao evento, conteúdo e networking.", image: model.gallery[0] },
      { title: "Passe VIP", text: "Experiência especial para convidados e parceiros.", image: model.gallery[1] ?? model.heroImage },
      { title: "Patrocínio", text: "Cota de apoio para marcas parceiras.", image: model.gallery[2] ?? model.heroImage },
    ];
  }

  if (tone === "graduation") {
    return [
      { title: "Cota da celebração", text: "Ajude a tornar a noite ainda mais especial.", image: model.gallery[0] },
      { title: "Homenagem", text: "Uma lembrança para a turma guardar.", image: model.gallery[1] ?? model.heroImage },
      { title: "Presente livre", text: "Contribua com o valor que desejar.", image: model.gallery[2] ?? model.heroImage },
    ];
  }

  if (tone === "kitchen") {
    return [
      { title: "Jogo de panelas", text: "Para as primeiras receitas da casa.", image: model.gallery[1] ?? model.heroImage },
      { title: "Mesa posta", text: "Detalhes para receber com carinho.", image: model.gallery[2] ?? model.heroImage },
      { title: "Pix livre", text: "Ajude com qualquer quantia.", image: model.gallery[3] ?? model.heroImage },
    ];
  }

  if (tone === "baby") {
    return [
      { title: "Kit enxoval", text: "Itens delicados para a chegada.", image: model.gallery[0] },
      { title: "Fraldas e cuidados", text: "Ajuda prática para os primeiros meses.", image: model.gallery[1] ?? model.heroImage },
      { title: "Presente livre", text: "Contribuição com carinho.", image: model.gallery[2] ?? model.heroImage },
    ];
  }

  if (tone === "house") {
    return [
      { title: "Cantinho da sala", text: "Itens para deixar o lar aconchegante.", image: model.gallery[0] },
      { title: "Cozinha nova", text: "Peças úteis para o dia a dia.", image: model.gallery[1] ?? model.heroImage },
      { title: "Contribuição livre", text: "Ajude como preferir.", image: model.gallery[2] ?? model.heroImage },
    ];
  }

  return [
    { title: model.giftTitle, text: "Uma escolha feita com carinho.", image: model.gallery[0] },
    { title: "Viagem dos sonhos", text: "Cota simbólica para a nova fase.", image: model.gallery[1] ?? model.heroImage },
    { title: "Presente livre", text: "Contribua com o valor que desejar.", image: model.gallery[2] ?? model.heroImage },
  ];
}

function noteTexts(model: Model) {
  const tone = getModelTone(model);

  if (tone === "corporate") {
    return [
      "Conteúdo excelente e organização impecável. Já estou contando os dias para participar.",
      "O encontro parece muito bem preparado. Vai ser ótimo para aprender e conectar pessoas.",
      "Agenda objetiva, visual forte e uma proposta muito profissional.",
    ];
  }

  if (tone === "debutante") {
    return [
      "Que essa noite seja do tamanho dos seus sonhos. Vamos celebrar muito!",
      "Você merece uma festa linda, cheia de brilho e alegria.",
      "Vai ser inesquecível estar com você nesse momento tão especial.",
    ];
  }

  if (tone === "baby") {
    return [
      "Que essa chegada seja cercada de amor, cuidado e muita saúde.",
      "Estamos felizes em fazer parte dessa espera tão bonita.",
      "Que seja uma tarde leve, cheia de carinho e boas memórias.",
    ];
  }

  if (tone === "house") {
    return [
      "Que o novo lar seja cheio de paz, boas conversas e momentos felizes.",
      "Será lindo celebrar essa conquista com vocês.",
      "Que essa casa receba muitas histórias boas a partir de agora.",
    ];
  }

  return [
    "Que esse dia seja exatamente como vocês sonharam: leve, bonito e cheio de amor.",
    "Estamos muito felizes em fazer parte dessa história tão especial.",
    "Que a celebração seja só o começo de uma vida ainda mais linda juntos.",
  ];
}

function Countdown() {
  return (
    <section className="vl-countdown">
      <p className="vl-eyebrow">Contagem regressiva</p>
      <div className="vl-time-grid">
        <div className="vl-time-card"><strong id="vl-count-days">0</strong><span>Dias</span></div>
        <div className="vl-time-card"><strong id="vl-count-hours">00</strong><span>Horas</span></div>
        <div className="vl-time-card"><strong id="vl-count-minutes">00</strong><span>Minutos</span></div>
        <div className="vl-time-card"><strong id="vl-count-seconds">00</strong><span>Segundos</span></div>
      </div>
    </section>
  );
}

function Gallery({ model }: { model: Model }) {
  return (
    <section id="galeria" className="vl-section paper">
      <div className="vl-inner">
        <p className="vl-eyebrow">Galeria</p>
        <h2 className="vl-section-title">{galleryTitle(model)}</h2>
        <div className="vl-gallery" style={{ marginTop: 34 }}>
          {model.gallery.map((photo, index) => (
            <div className="vl-gallery-item" key={`${photo}-${index}`}>
              <div style={{ backgroundImage: `url(${photo})` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GiftCards({ model }: { model: Model }) {
  const gifts = giftPreviews(model);

  return (
    <section id="presentes" className="vl-section alt">
      <div className="vl-inner vl-split">
        <div className="vl-text">
          <p className="vl-eyebrow">Presentes</p>
          <h2 className="vl-section-title">{model.giftTitle}</h2>
          <p>
            A presença já é o maior carinho. Para quem quiser presentear, deixamos
            algumas escolhas especiais reunidas em uma lista simples e bonita.
          </p>
          <a className="vl-button" href="#rsvp">Confirmar presença</a>
        </div>
        <div className="vl-cards">
          {gifts.map((gift) => (
            <article className="vl-card" key={gift.title}>
              <div className="vl-card-image" style={{ backgroundImage: `url(${gift.image})` }} />
              <div className="vl-card-body">
                <h3>{gift.title}</h3>
                <p>{gift.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Rsvp({ model }: { model: Model }) {
  const corporate = getModelTone(model) === "corporate";

  return (
    <section id="rsvp" className="vl-section paper">
      <div className="vl-inner">
        <div className="vl-rsvp-box">
          <div className="vl-rsvp-left">
            <p className="vl-eyebrow">Confirmação</p>
            <h2 className="vl-section-title" style={{ color: "#fff" }}>
              {corporate ? "Inscrição" : "RSVP"}
            </h2>
            <p style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.85 }}>
              {model.rsvpText}
            </p>
          </div>
          <form className="vl-rsvp-form">
            <input placeholder={corporate ? "Nome completo" : "Nome completo"} />
            <input placeholder={corporate ? "E-mail profissional" : "E-mail"} />
            <select defaultValue="">
              <option value="" disabled>{corporate ? "Tipo de participação" : "Confirma presença?"}</option>
              <option>{corporate ? "Participarei presencialmente" : "Sim, estarei presente"}</option>
              <option>{corporate ? "Tenho interesse no online" : "Não poderei ir"}</option>
            </select>
            <select defaultValue="">
              <option value="" disabled>{corporate ? "Empresa" : "Acompanhantes"}</option>
              <option>{corporate ? "Sou convidado" : "Somente eu"}</option>
              <option>{corporate ? "Quero levar equipe" : "Eu + 1 acompanhante"}</option>
              <option>{corporate ? "Sou patrocinador" : "Eu + 2 acompanhantes"}</option>
            </select>
            <button type="button">{corporate ? "Reservar participação" : "Confirmar presença"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Location({ model }: { model: Model }) {
  const corporate = getModelTone(model) === "corporate";

  return (
    <section id="localizacao" className="vl-section paper">
      <div className="vl-inner vl-split reverse">
        <div className="vl-photo-card rounded">
          <div style={{ backgroundImage: `url(${model.gallery[1] ?? model.heroImage})` }} />
        </div>
        <div className="vl-text">
          <p className="vl-eyebrow">Localização</p>
          <h2 className="vl-section-title">{corporate ? "Onde nos encontramos" : "Como chegar"}</h2>
          <p>
            {model.place}, em {model.city}. Escolhemos esse lugar para receber cada
            convidado com conforto, presença e uma experiência alinhada ao clima do evento.
          </p>
          <a className="vl-button" href="#rsvp">
            {corporate ? "Reservar participação" : "Confirmar presença"}
          </a>
        </div>
      </div>
    </section>
  );
}

function GuestNotes({ model }: { model: Model }) {
  return (
    <section id="recados" className="vl-section alt">
      <div className="vl-inner">
        <p className="vl-eyebrow">Recados</p>
        <h2 className="vl-section-title">Mensagens de quem faz parte</h2>
        <div className="vl-cards" style={{ marginTop: 32 }}>
          {noteTexts(model).map((note, index) => (
            <article className="vl-card" key={note}>
              <div className="vl-card-body">
                <h3>{["Família", "Amigos", "Convidados"][index]}</h3>
                <p>{note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ model }: { model: Model }) {
  return (
    <footer className="vl-footer">
      <strong>{model.hosts}</strong>
      <p>{model.date} • {model.place} • {model.city}</p>
    </footer>
  );
}

function InvitationGate({ model }: { model: Model }) {
  return (
    <>
      <input id="vlOpenInvite" type="checkbox" className="vl-open-checkbox" aria-hidden="true" />
      <section className="vl-invite-gate" aria-label="Convite de abertura">
        <div className="vl-invite-stage">
          <div className="vl-envelope" style={{ backgroundImage: `url(${model.previewImage})` }}>
            <div className="vl-paper">
              <strong className="vl-display">{model.hosts}</strong>
              <p>{model.headline}</p>
            </div>
            <div className="vl-flap" />
            <label htmlFor="vlOpenInvite" className="vl-open-seal" aria-label="Abrir convite">
              <span>Abrir convite</span>
            </label>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroClassic({ model }: { model: Model }) {
  return (
    <section id="inicio" className="vl-hero">
      <div className="vl-hero-bg" style={{ backgroundImage: `url(${model.heroImage})` }} />
      <div className="vl-hero-overlay" />
      <div className="vl-hero-content">
        <div className="vl-hero-box">
          <p className="vl-eyebrow">{model.eyebrow}</p>
          <h1 className="vl-display vl-hero-title">{model.hosts}</h1>
          <p className="vl-serif vl-hero-subtitle">{model.subheadline}</p>
          <div className="vl-hero-meta">
            <span className="vl-pill">{model.date}</span>
            <span className="vl-pill">{model.time}</span>
            <span className="vl-pill">{model.place} • {model.city}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Story({ model, reverse = false }: { model: Model; reverse?: boolean }) {
  return (
    <section id="historia" className="vl-section paper">
      <div className={`vl-inner vl-split ${reverse ? "reverse" : ""}`}>
        <div className="vl-photo-card rounded">
          <div style={{ backgroundImage: `url(${model.gallery[1] ?? model.heroImage})` }} />
        </div>
        <div className="vl-text">
          <p className="vl-eyebrow">{sectionLabel(model)}</p>
          <h2 className="vl-section-title">{model.storyTitle}</h2>
          <p>{model.storyText}</p>
        </div>
      </div>
    </section>
  );
}

function Program({ model, dark = true }: { model: Model; dark?: boolean }) {
  const items = programItems(model);

  return (
    <section id="programacao" className={`vl-section ${dark ? "dark" : "paper"}`}>
      <div className="vl-inner">
        <p className="vl-eyebrow">Programação</p>
        <h2 className="vl-section-title" style={{ color: dark ? "#fff" : "var(--ink)", marginBottom: 30 }}>
          {programTitle(model)}
        </h2>
        <div className="vl-cards">
          {items.slice(0, 3).map((item) => (
            <article
              className="vl-card"
              key={`${item.time}-${item.title}`}
              style={dark ? { background: "rgba(255,255,255,.08)", color: "#fff" } : undefined}
            >
              <div className="vl-card-body">
                <h3 style={{ color: dark ? "var(--accent)" : "var(--ink)" }}>{item.time}</h3>
                <p style={{ color: dark ? "rgba(255,255,255,.72)" : "var(--muted)", fontWeight: 800 }}>
                  {item.title}
                </p>
                <p style={{ color: dark ? "rgba(255,255,255,.66)" : "var(--muted)" }}>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CinematicPhotoMoment({
  model,
  image,
  eyebrow,
  title,
  text,
  align = "center",
  tone = "soft",
  position = "center 36%",
}: {
  model: Model;
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  align?: "left" | "center" | "right";
  tone?: "soft" | "dark";
  position?: string;
}) {
  return (
    <section
      className={`vl-cinematic-scroll ${tone}`}
      style={
        {
          "--cinema-image": `url(${image})`,
          "--cinema-position": position,
        } as CSSProperties & Record<string, string>
      }
      aria-label={title}
    >
      <div className="vl-cinematic-bg" />
      <div className={`vl-cinematic-copy ${align}`}>
        <span className="vl-cinematic-kicker">{eyebrow}</span>
        <h2 className="vl-display vl-cinematic-title">{title}</h2>
        <p className="vl-cinematic-text">{text}</p>
        <div className="vl-cinematic-meta">
          <span>{model.date}</span>
          <span>{model.place}</span>
          <span>{model.city}</span>
        </div>
      </div>
    </section>
  );
}


function RomanticEditorialMoment({ model }: { model: Model }) {
  return (
    <section className="vl-signature-section" aria-label="Momento editorial">
      <div className="vl-signature-card">
        <div
          className="vl-signature-photo"
          style={{ backgroundImage: `url(${model.gallery[0] ?? model.heroImage})` }}
        />
        <div className="vl-signature-copy">
          <p className="vl-eyebrow">Convite vivo</p>
          <h2 className="vl-display">A presença de vocês muda tudo</h2>
          <p>
            Mais do que uma data no calendário, este é o encontro das pessoas que
            fizeram parte da nossa caminhada. Queremos que o site pareça um convite
            real: delicado, emocionante e pronto para ser compartilhado.
          </p>
          <div className="vl-soft-pair">
            <div style={{ backgroundImage: `url(${model.gallery[1] ?? model.heroImage})` }} />
            <div style={{ backgroundImage: `url(${model.gallery[2] ?? model.heroImage})` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BotanicalBand({ model }: { model: Model }) {
  return (
    <section className="vl-botanical-band" aria-label="Momento botânico">
      <div className="vl-botanical-inner">
        <div className="vl-botanical-frame" style={{ backgroundImage: `url(${model.gallery[0] ?? model.heroImage})` }} />
        <div className="vl-botanical-text">
          <p className="vl-eyebrow">Leveza natural</p>
          <h2 className="vl-display">Um jardim para o nosso sim</h2>
          <p>
            Este modelo respira verde, luz natural e delicadeza. A sensação é de
            convite aberto ao ar livre, com menos peso visual e mais poesia.
          </p>
        </div>
        <div className="vl-botanical-frame" style={{ backgroundImage: `url(${model.gallery[2] ?? model.heroImage})` }} />
      </div>
    </section>
  );
}

function BlackTieFeature({ model }: { model: Model }) {
  return (
    <section className="vl-black-feature" aria-label="Momento black tie">
      <div className="vl-black-feature-inner">
        <div className="vl-black-feature-copy">
          <p className="vl-eyebrow">Noite de gala</p>
          <h2 className="vl-display">Luz baixa, brinde alto</h2>
          <p>
            Aqui o luxo não vem do excesso. Vem do contraste, da fotografia forte,
            do menu discreto e de uma composição que parece evento de marca premium.
          </p>
          <div className="vl-luxury-mini">
            <span>Jantar</span>
            <span>Black tie</span>
            <span>Pista</span>
          </div>
        </div>
        <div className="vl-black-feature-photo" style={{ backgroundImage: `url(${model.gallery[1] ?? model.heroImage})` }} />
      </div>
    </section>
  );
}

function LetterScene({ model }: { model: Model }) {
  return (
    <section className="vl-letter-scene" aria-label="Carta de amor">
      <div className="vl-letter-scene-inner">
        <div className="vl-letter-photo" style={{ backgroundImage: `url(${model.gallery[1] ?? model.heroImage})` }} />
        <div className="vl-letter-message">
          <p className="vl-eyebrow">Carta aberta</p>
          <h2 className="vl-display">Para quem caminha conosco</h2>
          <p>
            Este modelo tem ritmo de carta: íntimo, pausado e delicado. Ele não
            tenta impressionar com movimento grande; ele conquista pelo cuidado,
            pela textura e pela sensação de mensagem pessoal.
          </p>
        </div>
      </div>
    </section>
  );
}

function GlamEntrance({ model }: { model: Model }) {
  return (
    <section className="vl-glam-entrance" aria-label="Entrada glamourosa">
      <div className="vl-glam-inner">
        <div className="vl-glam-copy">
          <p className="vl-eyebrow">Grande entrada</p>
          <h2 className="vl-display">Hoje a noite é dela</h2>
          <p>
            Para 15 anos, o efeito precisa ser outro: palco, brilho, entrada,
            movimento e energia. A galeria também deve parecer festa, não álbum parado.
          </p>
        </div>
        <div className="vl-glam-photos">
          <div style={{ backgroundImage: `url(${model.gallery[0] ?? model.heroImage})` }} />
          <div style={{ backgroundImage: `url(${model.gallery[1] ?? model.heroImage})` }} />
        </div>
      </div>
    </section>
  );
}

function KitchenBoard({ model }: { model: Model }) {
  return (
    <section className="vl-kitchen-board" aria-label="Chá de cozinha realista">
      <div className="vl-kitchen-board-inner">
        <div className="vl-kitchen-notes">
          <div className="vl-kitchen-note"><strong>Casa nova</strong><p>Uma tarde para celebrar a nova fase com pessoas próximas.</p></div>
          <div className="vl-kitchen-note"><strong>Lista prática</strong><p>Presentes, Pix livre, reserva e filtros aparecem com destaque.</p></div>
          <div className="vl-kitchen-note"><strong>Clima acolhedor</strong><p>Menos espetáculo, mais afeto, mesa posta e vontade de receber.</p></div>
        </div>
        <div className="vl-kitchen-board-photo" style={{ backgroundImage: `url(${model.gallery[0] ?? model.heroImage})` }} />
      </div>
    </section>
  );
}

function HouseWelcome({ model }: { model: Model }) {
  return (
    <section className="vl-house-welcome" aria-label="Portas abertas">
      <div className="vl-inner" style={{ marginBottom: 28 }}>
        <p className="vl-eyebrow">Portas abertas</p>
        <h2 className="vl-section-title">Nossa casa começa com vocês</h2>
      </div>
      <div className="vl-house-welcome-inner">
        {(model.gallery.length ? model.gallery : [model.heroImage]).slice(0, 3).map((photo, index) => (
          <div className="vl-house-panel" key={`${photo}-${index}`} style={{ backgroundImage: `url(${photo})` }}>
            <span>{["Sala", "Cozinha", "Receber"][index] ?? "Lar"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function GraduationStage({ model }: { model: Model }) {
  return (
    <section className="vl-grad-stage" aria-label="Palco da conquista">
      <div className="vl-grad-stage-inner">
        <div className="vl-grad-stage-photo" style={{ backgroundImage: `url(${model.gallery[0] ?? model.heroImage})` }} />
        <div className="vl-grad-stage-copy">
          <p className="vl-eyebrow">Conquista</p>
          <h2 className="vl-display">Cada etapa valeu a pena</h2>
          <p>
            Formatura pede presença de cerimônia, turma, homenagem e conquista.
            O visual precisa parecer editorial e solene, sem usar o mesmo efeito de casamento.
          </p>
        </div>
      </div>
    </section>
  );
}

function CorporateKpis({ model }: { model: Model }) {
  return (
    <section className="vl-corp-kpis" aria-label="Indicadores do evento">
      <div className="vl-corp-kpis-inner">
        <div className="vl-corp-kpis-copy">
          <p className="vl-eyebrow">Experiência ao vivo</p>
          <h2 className="vl-display">Pessoas, ideias e negócios</h2>
          <p style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.85 }}>
            Evento corporativo precisa vender organização, conteúdo e autoridade.
            O efeito aqui é de painel premium, agenda clara e presença de marca.
          </p>
        </div>
        <div className="vl-corp-grid">
          <div><strong>08</strong><span>Horas de conteúdo</span></div>
          <div><strong>12</strong><span>Palestrantes</span></div>
          <div><strong>300</strong><span>Convidados</span></div>
        </div>
      </div>
    </section>
  );
}

function GalleryStack({ model }: { model: Model }) {
  const photos = model.gallery.slice(0, 3);
  return (
    <section id="galeria" className="vl-section paper">
      <div className="vl-inner">
        <p className="vl-eyebrow">Galeria</p>
        <h2 className="vl-section-title">{galleryTitle(model)}</h2>
        <div className="vl-gallery-stack">
          {photos.map((photo, index) => (
            <div className="vl-stack-photo" key={`${photo}-${index}`} style={{ backgroundImage: `url(${photo})` }} />
          ))}
          <div className="vl-stack-caption">Fotos com cara de memória real, não de bloco parado</div>
        </div>
      </div>
    </section>
  );
}

function GalleryRibbon({ model }: { model: Model }) {
  const photos = [...model.gallery, ...model.gallery];
  return (
    <section id="galeria" className="vl-section paper">
      <div className="vl-inner">
        <p className="vl-eyebrow">Galeria</p>
        <h2 className="vl-section-title">{galleryTitle(model)}</h2>
      </div>
      <div className="vl-ribbon-gallery">
        <div className="vl-ribbon-track">
          {photos.map((photo, index) => (
            <div className="vl-ribbon-photo" key={`${photo}-${index}`} style={{ backgroundImage: `url(${photo})` }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryMagazine({ model }: { model: Model }) {
  return (
    <section id="galeria" className="vl-section paper">
      <div className="vl-inner">
        <p className="vl-eyebrow">Galeria</p>
        <h2 className="vl-section-title">{galleryTitle(model)}</h2>
        <div className="vl-magazine-grid">
          {model.gallery.slice(0, 5).map((photo, index) => (
            <div className="vl-mag-card" key={`${photo}-${index}`} style={{ backgroundImage: `url(${photo})` }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryMinimal({ model }: { model: Model }) {
  return (
    <section id="galeria" className="vl-section paper">
      <div className="vl-inner">
        <p className="vl-eyebrow">Galeria</p>
        <h2 className="vl-section-title">{galleryTitle(model)}</h2>
        <div className="vl-gallery-minimal">
          {model.gallery.slice(0, 3).map((photo, index) => (
            <div key={`${photo}-${index}`} style={{ backgroundImage: `url(${photo})` }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryByModel({ model }: { model: Model }) {
  if (model.slug === "casamento-serenata") return <GalleryRibbon model={model} />;
  if (model.kind === "wedding-romantic" || model.kind === "love-letters") return <GalleryStack model={model} />;
  if (model.kind === "wedding-blacktie" || model.kind === "debutante-luxury" || model.kind === "graduation-classic") return <GalleryMagazine model={model} />;
  if (model.kind === "house-clean" || model.kind === "corporate-premium") return <GalleryMinimal model={model} />;
  return <Gallery model={model} />;
}

function WeddingRomanticTemplate({ model }: { model: Model }) {
  const cinematic = model.slug === "casamento-serenata";

  return (
    <main className="vl-model-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <InvitationGate model={model} />
      <div className="vl-site">
        <FloatingActions model={model} />
        <StandardMenu />
        <HeroClassic model={model} />
        <Countdown />
        {cinematic ? (
          <CinematicPhotoMoment
            model={model}
            image={model.gallery[0] ?? model.heroImage}
            eyebrow="O casal"
            title="Cada olhar nos trouxe até aqui"
            text="Antes do grande dia, existe uma história feita de encontros, escolhas, planos e pequenos momentos que agora queremos dividir com vocês."
            align="right"
            tone="soft"
          />
        ) : (
          <RomanticEditorialMoment model={model} />
        )}
        <Story model={model} />
        <Program model={model} />
        {cinematic ? (
          <CinematicPhotoMoment
            model={model}
            image={model.gallery[1] ?? model.heroImage}
            eyebrow="Depois do sim"
            title="A festa começa quando vocês chegam"
            text="Queremos viver uma celebração elegante, leve e cheia de presença. O mais bonito desse dia será ter pessoas queridas perto de nós."
            align="left"
            tone="soft"
            position="center 28%"
          />
        ) : null}
        <GalleryByModel model={model} />
        <GiftCards model={model} />
        <Location model={model} />
        <Rsvp model={model} />
        <GuestNotes model={model} />
        <Footer model={model} />
      </div>
    </main>
  );
}

function BlackTieTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page template-blacktie" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu dark />
      <section id="inicio" className="black-hero">
        <div className="black-hero-copy">
          <p className="vl-eyebrow">{model.eyebrow}</p>
          <h1 className="vl-display black-hero-title">{model.hosts}</h1>
          <p className="vl-serif vl-hero-subtitle">{model.subheadline}</p>
          <div className="vl-hero-meta"><span className="vl-pill">{model.date}</span><span className="vl-pill">{model.place}</span></div>
        </div>
        <div className="black-hero-image" style={{ backgroundImage: `url(${model.heroImage})` }} />
      </section>
      <div className="luxury-strip">
        {programItems(model).map((item) => <div key={item.title}><strong>{item.time}</strong><p>{item.title}</p></div>)}
      </div>
      <BlackTieFeature model={model} />
      <Story model={model} />
      <Program model={model} />
      <GalleryByModel model={model} />
      <GiftCards model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function ForestTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page forest-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu />
      <section id="inicio" className="forest-hero" style={{ backgroundImage: `url(${model.heroImage})` }}>
        <div className="forest-hero-card">
          <p className="vl-eyebrow">{model.eyebrow}</p>
          <h1 className="vl-display">{model.hosts}</h1>
          <p style={{ color: "rgba(255,255,255,.86)", fontSize: 20 }}>{model.subheadline}</p>
          <div className="vl-hero-meta" style={{ justifyContent: "center" }}><span className="vl-pill">{model.date}</span><span className="vl-pill">{model.place}</span></div>
        </div>
      </section>
      <Countdown />
      <BotanicalBand model={model} />
      <section id="historia" className="vl-section paper">
        <div className="vl-inner">
          <p className="vl-eyebrow">{sectionLabel(model)}</p>
          <h2 className="vl-section-title">{model.storyTitle}</h2>
          <div className="forest-circle-grid" style={{ marginTop: 34 }}>
            {model.gallery.slice(0, 3).map((photo, index) => (
              <div className="forest-circle" key={photo}>
                <div style={{ backgroundImage: `url(${photo})` }} />
                <strong>{["Cerimônia", "O casal", "Recepção"][index]}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Program model={model} dark={false} />
      <GalleryByModel model={model} />
      <GiftCards model={model} />
      <Location model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function LoveLettersTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page letter-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu />
      <section id="inicio" className="letter-hero">
        <div className="letter-paper">
          <p className="vl-eyebrow">{model.eyebrow}</p>
          <h1 className="vl-display">{model.hosts}</h1>
          <p className="vl-muted" style={{ fontSize: 19, lineHeight: 1.85 }}>{model.subheadline}</p>
          <div className="vl-hero-meta"><span className="vl-pill" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,.12)" }}>{model.date}</span><span className="vl-pill" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,.12)" }}>{model.place}</span></div>
        </div>
      </section>
      <LetterScene model={model} />
      <section id="historia" className="vl-section paper">
        <div className="vl-inner">
          <p className="vl-eyebrow">Cartas</p>
          <h2 className="vl-section-title">{model.storyTitle}</h2>
          <div className="letter-grid" style={{ marginTop: 34 }}>
            {[model.storyText, "Que a presença de vocês deixe esse encontro ainda mais bonito.", "Depois da celebração, queremos guardar cada abraço como lembrança."].map((note) => (
              <div className="letter-note" key={note}>{note}</div>
            ))}
          </div>
        </div>
      </section>
      <Program model={model} dark={false} />
      <GalleryByModel model={model} />
      <GiftCards model={model} />
      <Location model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function DebutanteTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page debutante-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu dark />
      <section id="inicio" className="debutante-hero">
        <div className="debutante-copy">
          <p className="vl-eyebrow">{model.eyebrow}</p>
          <h1 className="vl-display debutante-title">{model.hosts}</h1>
          <p className="vl-serif vl-hero-subtitle">{model.subheadline}</p>
          <div className="vl-hero-meta"><span className="vl-pill">{model.date}</span><span className="vl-pill">{model.place}</span></div>
        </div>
        <div className="debutante-photo" style={{ backgroundImage: `url(${model.heroImage})` }} />
      </section>
      <Countdown />
      <GlamEntrance model={model} />
      <section id="programacao" className="vl-section dark">
        <div className="vl-inner">
          <p className="vl-eyebrow">Programação</p>
          <h2 className="vl-section-title" style={{ color: "#fff", marginBottom: 30 }}>{programTitle(model)}</h2>
          <div className="glam-timeline">
            {programItems(model).map((item, index) => (
              <div className="glam-item" key={item.title}><strong>{String(index + 1).padStart(2, "0")}</strong><p>{item.title}</p></div>
            ))}
          </div>
        </div>
      </section>
      <Story model={model} reverse />
      <GalleryByModel model={model} />
      <GiftCards model={model} />
      <Location model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function KitchenTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page kitchen-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu />
      <section id="inicio" className="kitchen-hero">
        <div className="kitchen-photo" style={{ backgroundImage: `url(${model.heroImage})` }} />
        <div className="kitchen-copy">
          <p className="vl-eyebrow">{model.eyebrow}</p>
          <h1 className="vl-display">{model.hosts}</h1>
          <p className="vl-muted" style={{ fontSize: 18, lineHeight: 1.8 }}>{model.subheadline}</p>
          <div className="vl-hero-meta"><span className="vl-pill" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,.10)" }}>{model.date}</span><span className="vl-pill" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,.10)" }}>{model.place}</span></div>
        </div>
      </section>
      <Countdown />
      <Story model={model} />
      <KitchenBoard model={model} />
      <Program model={model} dark={false} />
      <GiftCards model={model} />
      <Location model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function SoftTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page soft-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu />
      <section id="inicio" className="soft-hero">
        <div className="soft-orb" style={{ backgroundImage: `url(${model.heroImage})` }} />
        <p className="vl-eyebrow">{model.eyebrow}</p>
        <h1 className="vl-display">{model.hosts}</h1>
        <p className="vl-muted" style={{ maxWidth: 620, lineHeight: 1.8 }}>{model.subheadline}</p>
        <div className="vl-hero-meta" style={{ justifyContent: "center" }}><span className="vl-pill" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,.10)" }}>{model.date}</span><span className="vl-pill" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,.10)" }}>{model.place}</span></div>
      </section>
      <Story model={model} />
      <Program model={model} dark={false} />
      <GalleryByModel model={model} />
      <GiftCards model={model} />
      <Location model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function HouseTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu />
      <section id="inicio" className="house-hero">
        <div className="house-copy"><p className="vl-eyebrow">{model.eyebrow}</p><h1 className="vl-display">{model.hosts}</h1><p className="vl-muted">{model.subheadline}</p><div className="vl-hero-meta"><span className="vl-pill" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,.10)" }}>{model.date}</span><span className="vl-pill" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,.10)" }}>{model.place}</span></div></div>
        <div className="house-image" style={{ backgroundImage: `url(${model.heroImage})` }} />
      </section>
      <HouseWelcome model={model} />
      <section id="historia" className="vl-section paper"><div className="vl-inner"><p className="vl-eyebrow">{sectionLabel(model)}</p><h2 className="vl-section-title">{model.storyTitle}</h2><p className="vl-muted" style={{ maxWidth: 760, lineHeight: 1.85 }}>{model.storyText}</p><div className="interior-grid" style={{ marginTop: 34 }}>{model.gallery.slice(0,3).map((p,i)=><div className="interior-card" key={p} style={{ backgroundImage:`url(${p})` }}><span>{["Sala", "Cozinha", "Receber"][i]}</span></div>)}</div></div></section>
      <Program model={model} dark={false} />
      <GiftCards model={model} />
      <Location model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function GraduationTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page graduation-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu dark />
      <section id="inicio" className="grad-hero"><div><p className="vl-eyebrow">{model.eyebrow}</p><h1 className="vl-display">{model.hosts}</h1><p className="vl-serif vl-hero-subtitle">{model.subheadline}</p><div className="vl-hero-meta" style={{ justifyContent:"center" }}><span className="vl-pill">{model.date}</span><span className="vl-pill">{model.place}</span></div></div></section>
      <GraduationStage model={model} />
      <Program model={model} dark={false} />
      <GalleryByModel model={model} />
      <GiftCards model={model} />
      <Location model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function CorporateTemplate({ model }: { model: Model }) {
  return (
    <main className="vl-model-page corporate-page" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />
      <StandardMenu dark />
      <section id="inicio" className="corp-hero"><div className="corp-copy"><p className="vl-eyebrow">{model.eyebrow}</p><h1 className="vl-display">{model.headline}</h1><p className="vl-muted" style={{ color:"rgba(255,255,255,.74)" }}>{model.subheadline}</p><a className="vl-button" href="#rsvp">Inscrever-se</a></div><div className="corp-image" style={{ backgroundImage:`url(${model.heroImage})` }} /></section>
      <CorporateKpis model={model} />
      <Program model={model} dark={false} />
      <GalleryByModel model={model} />
      <Location model={model} />
      <Rsvp model={model} />
      <GuestNotes model={model} />
      <Footer model={model} />
    </main>
  );
}

function renderTemplate(model: Model) {
  if (model.kind === "wedding-romantic") return <WeddingRomanticTemplate model={model} />;
  if (model.kind === "wedding-blacktie") return <BlackTieTemplate model={model} />;
  if (model.kind === "wedding-forest") return <ForestTemplate model={model} />;
  if (model.kind === "love-letters") return <LoveLettersTemplate model={model} />;
  if (model.kind === "debutante-luxury") return <DebutanteTemplate model={model} />;
  if (model.kind === "kitchen-elegant") return <KitchenTemplate model={model} />;
  if (model.kind === "baby-delicate" || model.kind === "reveal-soft" || model.kind === "faith-sacred") return <SoftTemplate model={model} />;
  if (model.kind === "house-clean") return <HouseTemplate model={model} />;
  if (model.kind === "graduation-classic") return <GraduationTemplate model={model} />;
  if (model.kind === "corporate-premium") return <CorporateTemplate model={model} />;
  return <SoftTemplate model={model} />;
}

export default async function ModeloPreviewPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isModelSlug(slug)) {
    notFound();
  }

  const model = models[slug];

  return renderTemplate(model);
}
