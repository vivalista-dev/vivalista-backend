"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type EventModel = {
  slug: string;
  eventType: string;
  style: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  tag: string;
  previewUrl: string;
  useUrl: string;
  image: string;
  sections: string[];
  featured?: boolean;
};

const heroSlides = [
  {
    type: "Casamento",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90",
  },
  {
    type: "15 anos",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1800&q=90",
  },
  {
    type: "Chá de bebê",
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1800&q=90",
  },
  {
    type: "Chá revelação",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1800&q=90",
  },
  {
    type: "Aniversário infantil",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1800&q=90",
  },
  {
    type: "Casa nova",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=90",
  },
  {
    type: "Formatura",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=90",
  },
  {
    type: "Corporativo",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=90",
  },
];

const eventModels: EventModel[] = [
  {
    slug: "casamento-romantico",
    eventType: "Casamento",
    style: "Romântico",
    title: "Casamento Romântico",
    subtitle: "Elegante, emocional e completo para o grande dia.",
    description:
      "Um site delicado para contar a história do casal, mostrar fotos, orientar convidados, receber confirmações e organizar presentes em um único link.",
    icon: "💍",
    tag: "Mais desejado",
    previewUrl: "https://andrelssampaio13-debug.github.io/renan-e-laislla/",
    useUrl: "/register?tipo=casamento&modelo=casamento-romantico",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=90",
    sections: ["Convite", "História", "Galeria", "Presentes", "RSVP"],
    featured: true,
  },
  {
    slug: "casamento-luxo",
    eventType: "Casamento",
    style: "Luxo",
    title: "Casamento Luxo",
    subtitle: "Sofisticado, marcante e com visual de grande celebração.",
    description:
      "Modelo nobre para casamentos elegantes, com capa impactante, programação, dress code, lista de presentes e RSVP.",
    icon: "🥂",
    tag: "Luxo",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=casamento&modelo=casamento-luxo",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=90",
    sections: ["Capa", "Dress code", "RSVP", "Presentes", "Local"],
  },
  {
    slug: "casamento-rustico",
    eventType: "Casamento",
    style: "Rústico",
    title: "Casamento Rústico",
    subtitle: "Natural, acolhedor e perfeito para campo ou sítio.",
    description:
      "Visual leve para cerimônias ao ar livre, com mapa, hospedagem, presentes, galeria e mensagens aos convidados.",
    icon: "🌿",
    tag: "Campo",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=casamento&modelo=casamento-rustico",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=90",
    sections: ["Campo", "Mapa", "Hospedagem", "Galeria", "RSVP"],
  },
  {
    slug: "noivado-elegante",
    eventType: "Noivado",
    style: "Elegante",
    title: "Noivado Elegante",
    subtitle: "Um anúncio especial para começar a história.",
    description:
      "Página charmosa para convite de noivado, fotos do casal, local, confirmação e mensagem para família e amigos.",
    icon: "💌",
    tag: "Novo",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=noivado&modelo=noivado-elegante",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=90",
    sections: ["Convite", "Fotos", "Local", "Mensagem", "RSVP"],
  },
  {
    slug: "bodas-elegante",
    eventType: "Bodas",
    style: "Clássico",
    title: "Bodas Elegante",
    subtitle: "Uma história merece ser celebrada.",
    description:
      "Linha do tempo, galeria, votos, localização, presentes, RSVP e uma experiência emocional para família e amigos.",
    icon: "🥂",
    tag: "História",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=bodas&modelo=bodas-elegante",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=90",
    sections: ["Linha do tempo", "Galeria", "Votos", "RSVP", "Presentes"],
  },
  {
    slug: "debutante-luxo",
    eventType: "15 anos",
    style: "Luxo",
    title: "Debutante Luxo",
    subtitle: "Uma festa de 15 anos com visual de grande evento.",
    description:
      "Capa premium, contagem regressiva, galeria, dress code, localização e confirmação de presença para uma celebração memorável.",
    icon: "👑",
    tag: "Premium",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=aniversario-15-anos&modelo=debutante-luxo",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=90",
    sections: ["Capa", "Galeria", "Dress code", "RSVP", "Local"],
    featured: true,
  },
  {
    slug: "debutante-princesa",
    eventType: "15 anos",
    style: "Romântico",
    title: "Debutante Princesa",
    subtitle: "Delicado, mágico e com clima de sonho.",
    description:
      "Modelo encantador para festa de 15 anos, com fotos, contagem regressiva, homenagem, dress code e confirmação.",
    icon: "✨",
    tag: "Encantado",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=aniversario-15-anos&modelo=debutante-princesa",
    image:
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=90",
    sections: ["Homenagem", "Fotos", "Dress code", "RSVP", "Mapa"],
  },
  {
    slug: "aniversario-infantil-divertido",
    eventType: "Aniversário infantil",
    style: "Divertido",
    title: "Infantil Divertido",
    subtitle: "Colorido, alegre e fácil de compartilhar.",
    description:
      "Tema da festa, fotos, endereço, confirmação de presença, presentes e informações importantes para os convidados.",
    icon: "🎈",
    tag: "Divertido",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=aniversario-infantil&modelo=infantil-divertido",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=90",
    sections: ["Tema", "Convite", "Fotos", "RSVP", "Presentes"],
  },
  {
    slug: "aniversario-adulto-premium",
    eventType: "Aniversário adulto",
    style: "Premium",
    title: "Aniversário Premium",
    subtitle: "Moderno, elegante e perfeito para uma noite especial.",
    description:
      "Modelo para festas adultas, com capa marcante, lista de convidados, local, dress code e detalhes da celebração.",
    icon: "🎉",
    tag: "Moderno",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=aniversario-adulto&modelo=aniversario-premium",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=90",
    sections: ["Convite", "Dress code", "Local", "RSVP", "Fotos"],
  },
  {
    slug: "cha-bebe-delicado",
    eventType: "Chá de bebê",
    style: "Delicado",
    title: "Bebê Delicado",
    subtitle: "Um site doce para a chegada do bebê.",
    description:
      "Uma página suave para lista de enxoval, mensagem da família, presentes, confirmação de presença e localização.",
    icon: "🧸",
    tag: "Família",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=cha-de-bebe&modelo=bebe-delicado",
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=90",
    sections: ["Enxoval", "Mensagem", "RSVP", "Presentes", "Mapa"],
  },
  {
    slug: "cha-revelacao-suave",
    eventType: "Chá revelação",
    style: "Delicado",
    title: "Chá Revelação Suave",
    subtitle: "Uma descoberta emocionante em uma página encantadora.",
    description:
      "Modelo para reunir família e amigos, com convite, local, lista de presentes, enquete, fotos e confirmação.",
    icon: "🩵",
    tag: "Novo",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=cha-revelacao&modelo=cha-revelacao-suave",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=90",
    sections: ["Convite", "Enquete", "Presentes", "RSVP", "Mapa"],
  },
  {
    slug: "cha-cozinha-elegante",
    eventType: "Chá de cozinha",
    style: "Elegante",
    title: "Chá de Cozinha Elegante",
    subtitle: "Lista de presentes, reserva e Pix livre.",
    description:
      "Modelo perfeito para organizar presentes, compartilhar endereço, receber mensagens e facilitar contribuições pelo Pix.",
    icon: "🍳",
    tag: "Modelo real",
    previewUrl: "https://cha-de-cozinha.github.io/cha-de-cozinha/",
    useUrl: "/register?tipo=cha-de-cozinha&modelo=cha-cozinha-elegante",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=90",
    sections: ["Convite", "Presentes", "Reserva", "Pix", "Mapa"],
    featured: true,
  },
  {
    slug: "casa-nova-clean",
    eventType: "Casa nova",
    style: "Clean",
    title: "Casa Nova Clean",
    subtitle: "Celebre o novo lar com estilo.",
    description:
      "Open house, chá de casa nova, lista de presentes, contribuição livre, localização e mensagem em um visual clean.",
    icon: "🏡",
    tag: "Novo lar",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=casa-nova&modelo=casa-nova-clean",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=90",
    sections: ["Novo lar", "Presentes", "Pix", "Mensagem", "Mapa"],
  },
  {
    slug: "formatura-classica",
    eventType: "Formatura",
    style: "Clássico",
    title: "Formatura Clássica",
    subtitle: "Para celebrar uma grande conquista.",
    description:
      "Programação, turma, local, fotos, confirmação de presença e informações importantes em uma página elegante.",
    icon: "🎓",
    tag: "Conquista",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=formatura&modelo=formatura-classica",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=90",
    sections: ["Programação", "Turma", "Fotos", "RSVP", "Mapa"],
  },
  {
    slug: "batizado-sagrado",
    eventType: "Batizado",
    style: "Religioso",
    title: "Batizado Sagrado",
    subtitle: "Delicado, familiar e cheio de significado.",
    description:
      "Convite para cerimônia, recepção, localização, padrinhos, mensagem da família, fotos e confirmação de presença.",
    icon: "🕊️",
    tag: "Família",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=batizado&modelo=batizado-sagrado",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=90",
    sections: ["Cerimônia", "Padrinhos", "Mensagem", "RSVP", "Mapa"],
  },
  {
    slug: "corporativo-premium",
    eventType: "Corporativo",
    style: "Premium",
    title: "Corporativo Premium",
    subtitle: "Profissional para eventos, palestras e encontros de marca.",
    description:
      "Página para programação, inscrição, localização, palestrantes, patrocinadores e informações do evento.",
    icon: "🏢",
    tag: "Empresa",
    previewUrl: "#galeria-modelos",
    useUrl: "/register?tipo=corporativo&modelo=corporativo-premium",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=90",
    sections: ["Programação", "Inscrição", "Palestrantes", "Local", "Mapa"],
  },
];

const showcaseModelSlugs = [
  "casamento-romantico",
  "debutante-luxo",
  "cha-bebe-delicado",
  "cha-cozinha-elegante",
];

const galleryPrioritySlugs = [
  "casamento-romantico",
  "debutante-luxo",
  "cha-bebe-delicado",
  "cha-cozinha-elegante",
  "aniversario-infantil-divertido",
  "casa-nova-clean",
  "formatura-classica",
  "cha-revelacao-suave",
  "aniversario-adulto-premium",
  "corporativo-premium",
  "noivado-elegante",
  "bodas-elegante",
  "batizado-sagrado",
  "casamento-luxo",
  "casamento-rustico",
  "debutante-princesa",
];

const getGalleryOrder = (model: EventModel) => {
  const index = galleryPrioritySlugs.indexOf(model.slug);
  return index === -1 ? galleryPrioritySlugs.length : index;
};

const categories = [
  "Todos",
  ...Array.from(new Set(eventModels.map((model) => model.eventType))),
];

const styles = [
  "Todos",
  ...Array.from(new Set(eventModels.map((model) => model.style))),
];

const eventRibbon = [
  "Casamento",
  "Noivado",
  "Bodas",
  "15 anos",
  "Aniversário infantil",
  "Aniversário adulto",
  "Chá de bebê",
  "Chá revelação",
  "Chá de cozinha",
  "Casa nova",
  "Formatura",
  "Batizado",
  "Corporativo",
  "Religioso",
];

const stats = [
  { value: `${eventModels.length}+`, label: "modelos para diferentes momentos" },
  { value: "1 link", label: "convite, RSVP, presentes, Pix e informações" },
  { value: "Premium", label: "visual pensado para encantar no primeiro clique" },
];

const valueCards = [
  {
    title: "Encante antes da festa",
    text: "O convidado sente o clima do evento antes mesmo de chegar. Foto bonita, texto certo e um link fácil de compartilhar.",
    icon: "sparkle",
  },
  {
    title: "Organize sem confusão",
    text: "Confirmações, presentes, Pix, localização e recados importantes ficam centralizados em um único lugar.",
    icon: "organize",
  },
  {
    title: "Venda uma experiência",
    text: "O VivaLista transforma cada evento em uma vitrine emocional, visual e prática para convidados e organizadores.",
    icon: "diamond",
  },
] as const;

const features = [
  {
    title: "Site do evento",
    text: "Capa, data, local, fotos, mensagem e detalhes importantes em uma página bonita e fácil de compartilhar.",
    icon: "website",
  },
  {
    title: "RSVP inteligente",
    text: "Confirmação de presença simples para reduzir mensagens soltas e organizar os convidados com mais segurança.",
    icon: "check",
  },
  {
    title: "Presentes e Pix",
    text: "Lista visual, cotas, contribuição livre e Pix para facilitar a vida de quem organiza e de quem presenteia.",
    icon: "gift",
  },
  {
    title: "IA premium",
    text: "Ajuda para textos, ideias, fotos mais bonitas e lembranças digitais nos planos avançados.",
    icon: "ai",
  },
] as const;

const journey = [
  {
    number: "01",
    title: "Escolha o modelo",
    text: "Veja estilos prontos para casamento, 15 anos, chá de bebê, chá revelação, formatura e outros eventos.",
  },
  {
    number: "02",
    title: "Personalize os detalhes",
    text: "Troque fotos, textos, data, local, cores, presentes, RSVP e seções do site.",
  },
  {
    number: "03",
    title: "Publique o site",
    text: "Crie uma página elegante com as informações que os convidados realmente precisam.",
  },
  {
    number: "04",
    title: "Compartilhe o link",
    text: "Envie pelo WhatsApp, Instagram ou convite digital. Tudo fica em um único endereço.",
  },
];

const aiFeatures = [
  {
    title: "Texto do convite",
    text: "Sugestões elegantes para abrir o site com emoção e clareza.",
  },
  {
    title: "Mensagem aos convidados",
    text: "Ajuda para escrever recados, orientações e detalhes importantes.",
  },
  {
    title: "Lembrança digital",
    text: "Ideias criativas para transformar fotos e momentos em recordações especiais.",
  },
  {
    title: "Estilos artísticos",
    text: "Aquarela, retrato premium, desenho, caricatura e outros estilos visuais.",
  },
];

const audienceCards = [
  {
    title: "Para famílias",
    text: "Chá de bebê, chá revelação, aniversário infantil, batizado e casa nova.",
    icon: "family",
  },
  {
    title: "Para casais",
    text: "Noivado, casamento, bodas, lista de presentes, cotas e confirmação.",
    icon: "couple",
  },
  {
    title: "Para profissionais",
    text: "Cerimonialistas, assessorias e empresas podem apresentar eventos com mais valor percebido.",
    icon: "professional",
  },
] as const;

const plans = [
  {
    name: "Free",
    price: "Grátis",
    description: "Para começar e publicar o primeiro evento.",
    items: ["Site público", "Modelos básicos", "RSVP", "Lista de presentes"],
  },
  {
    name: "Pro",
    price: "A partir de R$ 49",
    description: "Para quem quer aparência mais premium.",
    featured: true,
    items: [
      "Modelos premium",
      "Personalização avançada",
      "Galeria",
      "IA para textos",
    ],
  },
  {
    name: "Premium IA",
    price: "Premium",
    description: "Para transformar o evento em uma experiência memorável.",
    items: [
      "Tudo do Pro",
      "IA para fotos",
      "Estilos artísticos",
      "Lembranças digitais",
    ],
  },
];

type PremiumInfoIconName =
  | "sparkle"
  | "organize"
  | "diamond"
  | "website"
  | "check"
  | "gift"
  | "ai"
  | "family"
  | "couple"
  | "professional";

const premiumInfoIconTheme: Record<
  PremiumInfoIconName,
  {
    shell: string;
    glow: string;
    icon: string;
  }
> = {
  sparkle: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#fff4c7_0%,#f3cf69_45%,#b88517_100%)] shadow-[0_16px_34px_rgba(184,133,23,0.24)]",
    glow: "bg-[#f4cf69]/26",
    icon: "text-[#5b3906]",
  },
  organize: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#fff2b8_0%,#efc23f_48%,#bd8d12_100%)] shadow-[0_16px_34px_rgba(189,141,18,0.22)]",
    glow: "bg-[#efc23f]/24",
    icon: "text-[#5c3d04]",
  },
  diamond: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#e9fbff_0%,#76c8e8_46%,#256da8_100%)] shadow-[0_16px_34px_rgba(37,109,168,0.22)]",
    glow: "bg-[#76c8e8]/24",
    icon: "text-[#133f64]",
  },
  website: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#eff9ff_0%,#8dd5ec_46%,#2d89b8_100%)] shadow-[0_16px_34px_rgba(45,137,184,0.22)]",
    glow: "bg-[#8dd5ec]/24",
    icon: "text-[#164f6c]",
  },
  check: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#f0fff4_0%,#78d896_46%,#23884f_100%)] shadow-[0_16px_34px_rgba(35,136,79,0.22)]",
    glow: "bg-[#78d896]/22",
    icon: "text-[#0f4b2a]",
  },
  gift: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#fff1c7_0%,#f2b84d_45%,#c56b1c_100%)] shadow-[0_16px_34px_rgba(197,107,28,0.22)]",
    glow: "bg-[#f2b84d]/22",
    icon: "text-[#63320b]",
  },
  ai: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#fff6cf_0%,#f5d26b_45%,#b27818_100%)] shadow-[0_16px_34px_rgba(178,120,24,0.22)]",
    glow: "bg-[#f5d26b]/24",
    icon: "text-[#5c3506]",
  },
  family: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#fff7df_0%,#f0c86b_45%,#b8791d_100%)] shadow-[0_16px_34px_rgba(184,121,29,0.22)]",
    glow: "bg-[#f0c86b]/24",
    icon: "text-[#5a3508]",
  },
  couple: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#f5f0ff_0%,#c6a6ee_46%,#7350b6_100%)] shadow-[0_16px_34px_rgba(115,80,182,0.22)]",
    glow: "bg-[#c6a6ee]/24",
    icon: "text-[#3b236e]",
  },
  professional: {
    shell:
      "bg-[radial-gradient(circle_at_30%_20%,#fff0f2_0%,#c7858f_45%,#6f2d3b_100%)] shadow-[0_16px_34px_rgba(111,45,59,0.20)]",
    glow: "bg-[#c7858f]/22",
    icon: "text-[#3d1420]",
  },
};

function PremiumInfoIcon({ icon }: { icon: PremiumInfoIconName }) {
  const theme = premiumInfoIconTheme[icon];

  const svgProps = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <div className="relative mb-6 inline-flex">
      <span className={`absolute -inset-3 rounded-full blur-xl ${theme.glow}`} />

      <span
        className={`relative flex h-[62px] w-[62px] items-center justify-center rounded-[22px] ${theme.shell}`}
      >
        <span className="absolute inset-[1px] rounded-[21px] bg-white/12" />
        <span className={`relative ${theme.icon}`}>
          {icon === "sparkle" && (
            <svg {...svgProps}>
              <path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
              <path d="M19 15.5 19.8 18 22 18.8 19.8 19.6 19 22 18.2 19.6 16 18.8 18.2 18 19 15.5Z" />
              <path d="M5 14 5.6 15.7 7.3 16.3 5.6 16.9 5 18.5 4.4 16.9 2.8 16.3 4.4 15.7 5 14Z" />
            </svg>
          )}

          {icon === "organize" && (
            <svg {...svgProps}>
              <path d="M4 7.5h16v11.8A1.7 1.7 0 0 1 18.3 21H5.7A1.7 1.7 0 0 1 4 19.3V7.5Z" />
              <path d="M4 7.5 6.2 3h11.6L20 7.5" />
              <path d="M8 11h8" />
              <path d="M8 14.5h6" />
              <path d="M8 18h4" />
            </svg>
          )}

          {icon === "diamond" && (
            <svg {...svgProps}>
              <path d="M6.5 3.5h11L22 9l-10 12L2 9l4.5-5.5Z" />
              <path d="M2 9h20" />
              <path d="M8 9 12 21l4-12" />
              <path d="M7 3.5 8 9" />
              <path d="M17 3.5 16 9" />
            </svg>
          )}

          {icon === "website" && (
            <svg {...svgProps}>
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <path d="M3 8h18" />
              <path d="M8.5 13.5h7" />
              <path d="M8.5 16.5h4.5" />
              <path d="M7 6h.01" />
              <path d="M10 6h.01" />
            </svg>
          )}

          {icon === "check" && (
            <svg {...svgProps}>
              <path d="M20 6 9 17l-5-5" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}

          {icon === "gift" && (
            <svg {...svgProps}>
              <path d="M20 12v8H4v-8" />
              <path d="M2.5 7h19v5h-19z" />
              <path d="M12 7v13" />
              <path d="M12 7H8.6A2.3 2.3 0 1 1 11 4.7L12 7Z" />
              <path d="M12 7h3.4A2.3 2.3 0 1 0 13 4.7L12 7Z" />
            </svg>
          )}

          {icon === "ai" && (
            <svg {...svgProps}>
              <path d="M12 2.8 13.7 8 19 9.8l-5.3 1.7L12 16.8l-1.7-5.3L5 9.8 10.3 8 12 2.8Z" />
              <path d="M18.5 15.5 19.4 18l2.4.9-2.4.8-.9 2.5-.8-2.5-2.5-.8 2.5-.9.8-2.5Z" />
            </svg>
          )}

          {icon === "family" && (
            <svg {...svgProps}>
              <circle cx="8" cy="8" r="3" />
              <circle cx="16" cy="8" r="3" />
              <path d="M3.5 20a4.6 4.6 0 0 1 9 0" />
              <path d="M11.5 20a4.6 4.6 0 0 1 9 0" />
              <circle cx="12" cy="14" r="2.2" />
              <path d="M8.8 21a3.3 3.3 0 0 1 6.4 0" />
            </svg>
          )}

          {icon === "couple" && (
            <svg {...svgProps}>
              <path d="M12 21s-7.5-4.6-7.5-10.2A4.6 4.6 0 0 1 12 7.2a4.6 4.6 0 0 1 7.5 3.6C19.5 16.4 12 21 12 21Z" />
              <path d="M9.2 3.5h5.6" />
              <path d="M10.2 3.5 12 1.8l1.8 1.7" />
              <circle cx="12" cy="11.5" r="2.1" />
            </svg>
          )}

          {icon === "professional" && (
            <svg {...svgProps}>
              <path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7" />
              <rect x="3.5" y="7" width="17" height="13" rx="2.4" />
              <path d="M3.5 12.5h17" />
              <path d="M9.5 12.5v1.4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1.4" />
            </svg>
          )}
        </span>
      </span>
    </div>
  );
}

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedModelSlug, setSelectedModelSlug] = useState(eventModels[0].slug);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedStyle, setSelectedStyle] = useState("Todos");
  const [featuredSlug, setFeaturedSlug] = useState(eventModels[0].slug);
  const [showcasePaused, setShowcasePaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllModels, setShowAllModels] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resumeTimeoutRef = useRef<number | null>(null);

  const showcaseModels = useMemo(() => {
    return showcaseModelSlugs
      .map((slug) => eventModels.find((model) => model.slug === slug))
      .filter((model): model is EventModel => Boolean(model));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showcasePaused) return;

    const interval = window.setInterval(() => {
      setFeaturedSlug((currentSlug) => {
        const currentIndex = showcaseModels.findIndex(
          (model) => model.slug === currentSlug,
        );
        const nextIndex =
          currentIndex < 0 ? 0 : (currentIndex + 1) % showcaseModels.length;
        const nextModel = showcaseModels[nextIndex] ?? eventModels[0];

        setSelectedModelSlug(nextModel.slug);

        return nextModel.slug;
      });
    }, 7200);

    return () => window.clearInterval(interval);
  }, [showcaseModels, showcasePaused]);

  useEffect(() => {
    setShowAllModels(false);
  }, [selectedCategory, selectedStyle, searchTerm]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const selectedModel = useMemo(() => {
    return (
      eventModels.find((model) => model.slug === selectedModelSlug) ??
      eventModels[0]
    );
  }, [selectedModelSlug]);

  const featuredModel = useMemo(() => {
    return (
      eventModels.find((model) => model.slug === featuredSlug) ?? eventModels[0]
    );
  }, [featuredSlug]);

  const filteredModels = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...eventModels]
      .sort((a, b) => getGalleryOrder(a) - getGalleryOrder(b))
      .filter((model) => {
        const matchesCategory =
          selectedCategory === "Todos" || model.eventType === selectedCategory;
        const matchesStyle =
          selectedStyle === "Todos" || model.style === selectedStyle;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [
            model.title,
            model.eventType,
            model.style,
            model.subtitle,
            model.description,
            ...model.sections,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesCategory && matchesStyle && matchesSearch;
      });
  }, [searchTerm, selectedCategory, selectedStyle]);

  const displayedModels = showAllModels
    ? filteredModels
    : filteredModels.slice(0, 4);

  const hasMoreModels = filteredModels.length > displayedModels.length;
  const currentSlide = heroSlides[activeSlide];

  const hasRealPreview = (url: string) => url.startsWith("http");

  const getPreviewTarget = (url: string) =>
    hasRealPreview(url) ? "_blank" : "_self";

  const getPreviewRel = (url: string) =>
    hasRealPreview(url) ? "noopener noreferrer" : undefined;

  const getPreviewLabel = (url: string) =>
    hasRealPreview(url) ? "Ver modelo" : "Ver detalhes";

  const handleSelectModel = (slug: string) => {
    setFeaturedSlug(slug);
    setSelectedModelSlug(slug);
    setShowcasePaused(true);

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setShowcasePaused(false);
    }, 9000);
  };

  const clearFilters = () => {
    setSelectedCategory("Todos");
    setSelectedStyle("Todos");
    setSearchTerm("");
    setShowAllModels(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbf7f1_18%,#f7efd9_42%,#fbf7f1_68%,#ffffff_100%)] text-[#3f255f]">
      <style jsx global>{`
        :root {
          --vivalista-purple: #5f35c6;
          --vivalista-deep: #2f174a;
          --vivalista-gold: #f2cf72;
          --vivalista-cream: #fbf7f1;
          --vivalista-muted: #826ca6;
        }

        html {
          scroll-behavior: smooth;
        }

        @keyframes heroZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.075);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes floatSoft {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -10px, 0);
          }
        }

        @keyframes shineSoft {
          0% {
            transform: translateX(-120%) rotate(8deg);
            opacity: 0;
          }
          35% {
            opacity: 0.24;
          }
          100% {
            transform: translateX(150%) rotate(8deg);
            opacity: 0;
          }
        }

        .hero-bg-active {
          animation: heroZoom 7s ease-out forwards;
        }

        .marquee-track {
          animation: marquee 34s linear infinite;
        }

        .float-soft {
          animation: floatSoft 6s ease-in-out infinite;
        }

        .premium-card-motion {
          transition:
            transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 700ms ease,
            box-shadow 700ms ease,
            filter 700ms ease;
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .shine-layer {
          position: relative;
          overflow: hidden;
        }

        .shine-layer::after {
          content: "";
          position: absolute;
          inset: -35%;
          width: 38%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.42),
            transparent
          );
          animation: shineSoft 6.5s ease-in-out infinite;
          pointer-events: none;
        }

        .btn-primary {
          color: #ffffff !important;
          background: linear-gradient(135deg, #6f3fd6 0%, #5127af 100%);
          box-shadow: 0 18px 38px rgba(111, 63, 214, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 48px rgba(111, 63, 214, 0.32);
        }

        .btn-gold {
          color: #2d1a05 !important;
          background: linear-gradient(135deg, #ffe9a5 0%, #f1c85f 100%);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2);
        }

        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 54px rgba(0, 0, 0, 0.24);
        }

        .btn-soft {
          color: #3f255f !important;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 14px 34px rgba(48, 23, 74, 0.1);
        }

        .btn-soft:hover {
          transform: translateY(-2px);
          background: #ffffff;
          box-shadow: 0 20px 44px rgba(48, 23, 74, 0.14);
        }

        .section-light {
          background:
            radial-gradient(circle at 8% 12%, rgba(246, 217, 123, 0.16), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #fbf7f1 100%);
        }

        .section-champagne {
          background:
            radial-gradient(circle at 85% 12%, rgba(216, 166, 43, 0.16), transparent 34%),
            radial-gradient(circle at 12% 88%, rgba(111, 63, 214, 0.08), transparent 36%),
            linear-gradient(180deg, #fbf7f1 0%, #f8f0dc 48%, #fbf7f1 100%);
        }

        .section-white-glow {
          background:
            radial-gradient(circle at 50% 0%, rgba(246, 217, 123, 0.12), transparent 36%),
            linear-gradient(180deg, #ffffff 0%, #ffffff 48%, #fbf7f1 100%);
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/50 bg-white/90 shadow-[0_8px_30px_rgba(28,13,43,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="VivaLista">
            <Image
              src="/logo-vivalista.png"
              alt="VivaLista"
              width={220}
              height={72}
              className="h-auto w-[136px] object-contain md:w-[160px]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {[
              ["Modelos", "#modelos"],
              ["Recursos", "#recursos"],
              ["IA", "#ia"],
              ["Planos", "#planos"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-[15px] font-medium text-[#655a73] transition hover:text-[#5f35c6]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="hidden text-[15px] font-semibold text-[#4b4457] transition hover:text-[#5f35c6] sm:inline-flex"
            >
              Entrar
            </Link>

            <Link
              href="/register"
              className="btn-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition sm:px-6 sm:text-[15px]"
            >
              Criar meu site
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mt-[76px] min-h-[calc(100vh-76px)] overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.type}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ${
                index === activeSlide ? "hero-bg-active opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,9,34,0.90),rgba(43,22,65,0.58),rgba(22,9,34,0.22))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(246,217,123,0.20),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.46))]" />
        </div>

        <div className="absolute right-5 top-6 z-20 hidden rounded-full border border-white/20 bg-white/14 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/88 backdrop-blur-md lg:block">
          <span className="mr-2 text-[#f6d97b]">●</span>
          {currentSlide.type}
        </div>

        <div className="relative z-20 mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
            <div className="mx-auto mb-5 inline-flex rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#f6d97b] backdrop-blur lg:mx-0">
              sites premium para eventos
            </div>

            <h1 className="max-w-4xl text-[40px] font-light leading-[1.02] tracking-[-0.055em] text-white sm:text-[62px] lg:text-[76px]">
              Seu evento merece um site tão bonito quanto a festa.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-8 text-white/90 sm:text-lg lg:mx-0">
              Do casamento ao chá revelação, dos 15 anos ao evento corporativo.
              Escolha um modelo premium, personalize fotos, presentes, RSVP, Pix
              e entregue aos convidados uma experiência em um único link.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <a
                href="#modelos"
                className="btn-gold inline-flex min-w-[190px] items-center justify-center rounded-full px-7 py-4 text-base font-bold transition"
              >
                Ver modelos
                <span className="ml-2">↓</span>
              </a>

              <Link
                href="/register"
                className="btn-soft inline-flex min-w-[190px] items-center justify-center rounded-full border border-white/35 px-7 py-4 text-base font-bold transition"
              >
                Criar meu site
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 lg:justify-start">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.type}
                  type="button"
                  aria-label={`Ver foto de ${slide.type}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlide
                      ? "w-10 bg-[#f6d97b]"
                      : "w-2.5 bg-white/55 hover:bg-white/85"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-center text-xs font-bold uppercase tracking-[0.24em] text-white/58 lg:block">
            role para explorar
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-b border-[#eadff8] bg-white">
        <div className="marquee-track flex w-[200%] gap-8 py-5">
          {[...eventRibbon, ...eventRibbon].map((eventName, index) => (
            <div
              key={`${eventName}-${index}`}
              className="flex min-w-max items-center gap-8 text-sm font-bold uppercase tracking-[0.18em] text-[#6a6173]"
            >
              <span>{eventName}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8a62b]" />
            </div>
          ))}
        </div>
      </section>

      <section className="section-light relative z-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="rounded-[26px] border border-[#f0e8f7] bg-white/84 px-6 py-6 text-center shadow-[0_12px_32px_rgba(91,58,140,0.05)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(91,58,140,0.09)]"
            >
              <div className="text-3xl font-light tracking-[-0.04em] text-[#3f255f]">
                {stat.value}
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-[#826ca6]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="modelos"
        className="section-champagne relative z-10 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#9d7a1d]">
              modelos premium
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-light leading-[1.06] tracking-[-0.045em] text-[#3f255f] sm:text-5xl lg:text-6xl">
              Escolha um visual pronto e transforme em seu.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#826ca6]">
              Veja modelos criados para encantar no primeiro clique. Cada opção
              foi pensada para um tipo de celebração, com visual, texto e
              estrutura adaptados ao evento.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#galeria-modelos"
                className="btn-primary inline-flex min-w-[180px] items-center justify-center rounded-full px-7 py-4 text-base font-bold transition"
              >
                Ver galeria
                <span className="ml-2">↓</span>
              </a>

              <Link
                href={featuredModel.useUrl}
                className="btn-soft inline-flex min-w-[230px] items-center justify-center rounded-full border border-[#d9c5f4] px-7 py-4 text-base font-bold transition"
              >
                Usar modelo em destaque
              </Link>
            </div>
          </div>

          <div
            className="relative min-h-[560px] lg:min-h-[650px]"
            onMouseEnter={() => setShowcasePaused(true)}
            onMouseLeave={() => setShowcasePaused(false)}
          >
            <div className="float-soft absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[#d8a62b]/20 blur-3xl" />
            <div className="absolute right-[4%] top-[4%] h-80 w-80 rounded-full bg-[#6f3fd6]/12 blur-3xl" />

            <div className="hidden h-full lg:block">
              <div className="absolute left-[5%] top-[8%] h-[560px] w-[72%] rounded-[36px] bg-white/70 shadow-[0_30px_90px_rgba(91,58,140,0.10)] backdrop-blur" />

              <div className="absolute left-[10%] top-[50%] z-30 w-[58%] -translate-y-1/2 overflow-hidden rounded-[32px] bg-white p-3 shadow-[0_34px_90px_rgba(91,58,140,0.18)]">
                <div
                  className="shine-layer relative h-[430px] overflow-hidden rounded-[26px] bg-cover bg-center transition-all duration-700"
                  style={{ backgroundImage: `url(${featuredModel.image})` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(38,18,58,0.68))]" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/92 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#5f35c6] backdrop-blur">
                    {featuredModel.tag}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                    <div className="text-5xl">{featuredModel.icon}</div>
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-[#f6d97b]">
                      {featuredModel.eventType}
                    </p>
                    <h3 className="mt-2 text-4xl font-light tracking-[-0.04em]">
                      {featuredModel.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-white/84">
                      {featuredModel.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute right-[2%] top-1/2 z-40 flex w-[38%] -translate-y-1/2 flex-col gap-4">
                {showcaseModels.map((model) => {
                  const active = model.slug === featuredSlug;

                  return (
                    <button
                      key={model.slug}
                      type="button"
                      onClick={() => handleSelectModel(model.slug)}
                      className={`premium-card-motion flex items-center gap-4 rounded-[24px] border bg-white p-3 text-left shadow-[0_16px_42px_rgba(91,58,140,0.10)] ${
                        active
                          ? "scale-[1.03] border-[#a980ff] opacity-100"
                          : "border-[#f0e8f7] opacity-78 hover:scale-[1.02] hover:opacity-100"
                      }`}
                    >
                      <div
                        className="h-24 w-24 shrink-0 rounded-[18px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${model.image})` }}
                      />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9d7a1d]">
                          {model.eventType}
                        </p>
                        <h3 className="mt-1 text-xl font-light leading-tight text-[#3f255f]">
                          {model.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#826ca6]">
                          {model.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 lg:hidden">
              {showcaseModels.map((model) => (
                <button
                  key={model.slug}
                  type="button"
                  onClick={() => handleSelectModel(model.slug)}
                  className="overflow-hidden rounded-[28px] bg-white p-3 text-left shadow-[0_20px_54px_rgba(91,58,140,0.13)]"
                >
                  <div
                    className="h-[250px] rounded-[22px] bg-cover bg-center sm:h-[280px]"
                    style={{ backgroundImage: `url(${model.image})` }}
                  />
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9d7a1d]">
                      {model.eventType}
                    </p>
                    <h3 className="mt-2 text-2xl font-light text-[#3f255f]">
                      {model.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#826ca6]">
                      {model.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
            <section className="section-white-glow relative z-10 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#9d7a1d]">
                modelo em destaque
              </p>
              <h2 className="mt-4 text-4xl font-light tracking-[-0.045em] text-[#3f255f] sm:text-5xl">
                {featuredModel.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#826ca6]">
                {featuredModel.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {featuredModel.sections.map((section) => (
                  <span
                    key={section}
                    className="rounded-full bg-[#faf6ff] px-3 py-2 text-xs font-bold text-[#6a5494]"
                  >
                    {section}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={featuredModel.previewUrl}
                  target={getPreviewTarget(featuredModel.previewUrl)}
                  rel={getPreviewRel(featuredModel.previewUrl)}
                  className="btn-soft inline-flex min-w-[170px] items-center justify-center rounded-full border border-[#e7d8ff] px-6 py-3.5 text-sm font-bold transition"
                >
                  {getPreviewLabel(featuredModel.previewUrl)}
                </a>

                <Link
                  href={featuredModel.useUrl}
                  className="btn-primary inline-flex min-w-[180px] items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold transition"
                >
                  Usar este modelo
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] bg-[linear-gradient(180deg,#fbf7f1_0%,#f8f0dc_100%)] p-4 shadow-[0_28px_76px_rgba(91,58,140,0.12)]">
              <div className="overflow-hidden rounded-[24px] bg-white">
                <div className="flex items-center gap-2 border-b border-[#eee4f6] px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 rounded-full bg-[#faf6ff] px-3 py-1 text-xs font-bold text-[#826ca6]">
                    vivalista.com/e/seu-evento
                  </span>
                </div>

                <div
                  className="relative min-h-[420px] bg-cover bg-center sm:min-h-[470px]"
                  style={{ backgroundImage: `url(${featuredModel.image})` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(45,24,70,0.70))]" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="max-w-[430px] rounded-[24px] bg-white/92 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur sm:p-6">
                      <div className="text-5xl">{featuredModel.icon}</div>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-[#9d7a1d]">
                        {featuredModel.eventType}
                      </p>
                      <h4 className="mt-2 text-3xl font-light leading-tight tracking-[-0.035em] text-[#3f255f]">
                        {featuredModel.title}
                      </h4>
                      <p className="mt-3 text-sm leading-6 text-[#745c99]">
                        {featuredModel.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3 lg:mt-20">
            {valueCards.map((card) => (
              <div
                key={card.title}
                className="group rounded-[32px] border border-white/70 bg-white/90 p-7 shadow-[0_18px_48px_rgba(91,58,140,0.07)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_26px_70px_rgba(91,58,140,0.12)]"
              >
                <PremiumInfoIcon icon={card.icon} />

                <h3 className="text-[25px] font-light leading-tight tracking-[-0.035em] text-[#3f255f]">
                  {card.title}
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-[#826ca6]">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="galeria-modelos"
        className="section-champagne relative z-10 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#9d7a1d]">
                galeria de modelos
              </p>
              <h2 className="mt-4 text-4xl font-light tracking-[-0.045em] text-[#3f255f] sm:text-5xl">
                Uma coleção para todos os momentos.
              </h2>
            </div>

            <p className="text-base leading-8 text-[#826ca6] lg:text-right">
              Busque por tipo de evento, estilo ou recurso e encontre o modelo
              ideal para começar com mais segurança.
            </p>
          </div>

          <div className="mt-9 rounded-[30px] border border-[#efe6f8] bg-white/86 p-4 shadow-[0_18px_48px_rgba(91,58,140,0.06)] backdrop-blur">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar: casamento, chá revelação, RSVP, Pix, luxo..."
                  className="w-full rounded-full border border-[#eadff8] bg-[#fbf7f1] px-5 py-4 text-sm font-semibold text-[#3f255f] outline-none transition placeholder:text-[#9b89b7] focus:border-[#a980ff] focus:bg-white"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:flex">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((current) => !current)}
                  className="rounded-full border border-[#e7d8ff] bg-white px-5 py-4 text-sm font-bold text-[#5f35c6] transition hover:bg-[#faf6ff] lg:hidden"
                >
                  {filtersOpen ? "Ocultar filtros" : "Filtrar modelos"}
                </button>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full border border-[#e7d8ff] bg-white px-5 py-4 text-sm font-bold text-[#5f35c6] transition hover:bg-[#faf6ff]"
                >
                  Limpar filtros
                </button>
              </div>
            </div>

            <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
              <div className="mt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.20em] text-[#9d7a1d]">
                  Tipo de evento
                </p>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                        selectedCategory === category
                          ? "bg-[#5f35c6] text-white shadow-[0_14px_32px_rgba(111,63,214,0.22)]"
                          : "border border-[#efe6f8] bg-white text-[#3f255f] hover:bg-[#faf6ff]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.20em] text-[#9d7a1d]">
                  Estilo
                </p>
                <div className="flex flex-wrap gap-3">
                  {styles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                        selectedStyle === style
                          ? "bg-[#3f255f] text-white shadow-[0_14px_32px_rgba(63,37,95,0.20)]"
                          : "border border-[#efe6f8] bg-white text-[#3f255f] hover:bg-[#faf6ff]"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-[#826ca6]">
              {filteredModels.length} modelo
              {filteredModels.length === 1 ? "" : "s"} encontrado
              {filteredModels.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {displayedModels.map((model) => {
              const isSelected = model.slug === selectedModel.slug;

              return (
                <article
                  key={model.slug}
                  className={`group overflow-hidden rounded-[28px] border bg-white shadow-[0_18px_46px_rgba(91,58,140,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_64px_rgba(91,58,140,0.13)] ${
                    isSelected
                      ? "border-[#a980ff] ring-4 ring-[#a980ff]/16"
                      : "border-[#f0e8f7]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectModel(model.slug)}
                    className="block w-full text-left"
                  >
                    <div className="relative h-[300px] overflow-hidden sm:h-[320px]">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${model.image})` }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(45,24,70,0.70))]" />

                      <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-[#5e3e90] backdrop-blur">
                        {model.eventType}
                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-[#f6d97b] px-3 py-1.5 text-xs font-bold text-[#2d1a05]">
                        {model.style}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-4xl">{model.icon}</div>
                        <h3 className="mt-3 text-2xl font-light leading-tight tracking-[-0.035em] text-white">
                          {model.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/84">
                          {model.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {model.sections.slice(0, 3).map((section) => (
                        <span
                          key={section}
                          className="rounded-full bg-[#faf6ff] px-3 py-2 text-xs font-bold text-[#6a5494]"
                        >
                          {section}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-3">
                      <Link
                        href={model.useUrl}
                        className="btn-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition"
                      >
                        Usar este modelo
                        <span className="ml-2">→</span>
                      </Link>

                      <a
                        href={model.previewUrl}
                        target={getPreviewTarget(model.previewUrl)}
                        rel={getPreviewRel(model.previewUrl)}
                        className="inline-flex items-center justify-center rounded-full border border-[#e7d8ff] bg-white px-5 py-3 text-sm font-bold text-[#5f35c6] transition hover:bg-[#faf6ff]"
                      >
                        {getPreviewLabel(model.previewUrl)}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {hasMoreModels && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllModels(true)}
                className="btn-primary inline-flex min-w-[210px] items-center justify-center rounded-full px-7 py-4 text-base font-bold transition"
              >
                Ver mais modelos
                <span className="ml-2">↓</span>
              </button>
            </div>
          )}

          {showAllModels && filteredModels.length > 4 && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllModels(false)}
                className="inline-flex min-w-[190px] items-center justify-center rounded-full border border-[#e7d8ff] bg-white px-6 py-3.5 text-sm font-bold text-[#5f35c6] transition hover:bg-[#faf6ff]"
              >
                Mostrar menos
              </button>
            </div>
          )}

          {filteredModels.length === 0 && (
            <div className="mt-10 rounded-[28px] border border-[#efe6f8] bg-white p-8 text-center shadow-[0_18px_48px_rgba(91,58,140,0.06)]">
              <h3 className="text-2xl font-light text-[#3f255f]">
                Nenhum modelo encontrado.
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                Tente limpar os filtros ou buscar por outro tipo de evento.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold transition"
              >
                Ver todos os modelos
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        id="recursos"
        className="section-white-glow relative z-10 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#9d7a1d]">
                recursos principais
              </p>
              <h2 className="mt-4 text-4xl font-light tracking-[-0.045em] text-[#3f255f] sm:text-5xl">
                Tudo em um único link.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#826ca6]">
                O convidado acessa o site e encontra convite, endereço,
                confirmação, presentes, Pix, galeria e informações importantes.
              </p>

              <Link
                href="/register"
                className="btn-primary mt-8 inline-flex min-w-[210px] items-center justify-center rounded-full px-7 py-4 text-base font-bold transition"
              >
                Começar agora
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-[32px] border border-white/70 bg-white/92 p-7 shadow-[0_18px_48px_rgba(91,58,140,0.07)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_26px_70px_rgba(91,58,140,0.12)]"
                >
                  <PremiumInfoIcon icon={feature.icon} />

                  <h3 className="text-[25px] font-light leading-tight tracking-[-0.035em] text-[#3f255f]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-[15px] leading-7 text-[#826ca6]">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-8 rounded-[34px] bg-[linear-gradient(135deg,#fbf7f1_0%,#f8f0dc_100%)] p-6 shadow-[0_18px_48px_rgba(91,58,140,0.06)] lg:grid-cols-3 lg:p-8">
            {[
              [
                "Convite digital",
                "Apresente o evento com uma capa bonita, texto de boas-vindas e chamada clara para os convidados.",
              ],
              [
                "Lista organizada",
                "Transforme presentes, cotas e Pix em uma experiência simples, visual e fácil de acompanhar.",
              ],
              [
                "Confirmação fácil",
                "Centralize respostas dos convidados e reduza mensagens perdidas no WhatsApp.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[26px] bg-white p-6">
                <h3 className="text-2xl font-light tracking-[-0.03em] text-[#3f255f]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#826ca6]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-champagne relative z-10 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#9d7a1d]">
              para quem é
            </p>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.045em] text-[#3f255f] sm:text-5xl">
              Uma vitrine para quem celebra e para quem organiza.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {audienceCards.map((card) => (
              <div
                key={card.title}
                className="group rounded-[32px] border border-white/70 bg-white/90 p-7 shadow-[0_18px_48px_rgba(91,58,140,0.07)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_26px_70px_rgba(91,58,140,0.12)]"
              >
                <PremiumInfoIcon icon={card.icon} />

                <h3 className="text-[25px] font-light leading-tight tracking-[-0.035em] text-[#3f255f]">
                  {card.title}
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-[#826ca6]">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-white-glow relative z-10 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#9d7a1d]">
              como funciona
            </p>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.045em] text-[#3f255f] sm:text-5xl">
              Primeiro encanta. Depois compartilha.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {journey.map((item) => (
              <div
                key={item.number}
                className="rounded-[30px] bg-[linear-gradient(180deg,#fbf7f1_0%,#ffffff_100%)] p-7 shadow-[0_16px_42px_rgba(91,58,140,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(91,58,140,0.10)]"
              >
                <div className="text-sm font-bold uppercase tracking-[0.22em] text-[#9d7a1d]">
                  {item.number}
                </div>
                <h3 className="mt-5 text-2xl font-light tracking-[-0.03em] text-[#3f255f]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="ia"
        className="relative z-10 bg-[linear-gradient(180deg,#fbf7f1_0%,#ffffff_100%)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[38px] bg-[linear-gradient(135deg,#2f174a_0%,#5f35c6_52%,#d8a62b_145%)] p-7 text-white shadow-[0_30px_86px_rgba(91,58,140,0.20)] md:p-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#f6d97b]">
              diferencial premium
            </p>
            <h2 className="mt-4 text-4xl font-light leading-[1.06] tracking-[-0.045em] text-[#111111] sm:text-5xl">
              IA para textos, fotos e lembranças digitais.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/84">
              Recursos inteligentes ajudam a escrever melhor, criar mensagens
              mais bonitas e transformar o evento em uma experiência memorável.
            </p>

            <Link
              href="/register"
              className="btn-gold mt-8 inline-flex min-w-[230px] items-center justify-center rounded-full px-7 py-4 text-base font-bold transition"
            >
              Criar com ajuda da IA
              <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {aiFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[24px] border border-white/18 bg-white/12 p-5 text-white/90 backdrop-blur transition hover:-translate-y-1 hover:bg-white/16"
              >
                <div className="text-2xl">✦</div>
                <h3 className="mt-3 text-xl font-light tracking-[-0.03em] text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/74">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="planos"
        className="section-white-glow relative z-10 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#9d7a1d]">
              planos
            </p>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.045em] text-[#3f255f] sm:text-5xl">
              Comece simples. Cresça com recursos premium.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#826ca6]">
              Publique seu primeiro evento e evolua com modelos mais
              sofisticados, personalização avançada e recursos de IA.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[32px] border p-7 shadow-[0_16px_42px_rgba(91,58,140,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_62px_rgba(91,58,140,0.12)] ${
                  plan.featured
                    ? "border-[#e2c875] bg-[linear-gradient(180deg,#fff8e6_0%,#ffffff_100%)]"
                    : "border-[#f0e8f7] bg-white"
                }`}
              >
                {plan.featured && (
                  <div className="mb-5 inline-flex rounded-full bg-[#f6d97b] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5f4309]">
                    recomendado
                  </div>
                )}

                <p className="text-sm font-bold uppercase tracking-[0.20em] text-[#9d7a1d]">
                  {plan.name}
                </p>
                <h3 className="mt-4 text-4xl font-light tracking-[-0.04em] text-[#3f255f]">
                  {plan.price}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-[16px] bg-[#faf6ff] px-4 py-3 text-sm font-bold text-[#6a5494]"
                    >
                      ✦ {item}
                    </div>
                  ))}
                </div>

                <Link
                  href="/register"
                  className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold transition ${
                    plan.featured
                      ? "btn-primary"
                      : "btn-soft border border-[#e7d8ff]"
                  }`}
                >
                  Escolher plano
                  <span className="ml-2">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[linear-gradient(180deg,#ffffff_0%,#fbf7f1_100%)] px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-[38px] bg-[linear-gradient(135deg,#2f174a_0%,#3f255f_56%,#7a5520_150%)] p-7 text-white shadow-[0_30px_86px_rgba(91,58,140,0.20)] md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#f6d97b]">
                comece pela emoção
              </p>
              <h2 className="mt-4 text-4xl font-light tracking-[-0.045em] text-white sm:text-5xl">
                Escolha um modelo, personalize e compartilhe.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">
                Crie uma página elegante para convidados encontrarem tudo que
                precisam em um único link.
              </p>
            </div>

            <Link
              href={featuredModel.useUrl}
              className="btn-gold inline-flex min-w-[240px] items-center justify-center rounded-full px-7 py-4 text-base font-bold transition"
            >
              Começar com {featuredModel.title}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#eadff8] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-center text-sm text-[#826ca6] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">
          <p>
            VivaLista — sites, convites, RSVP, presentes, Pix e IA para eventos.
          </p>
          <div className="flex justify-center gap-5">
            <Link
              href="/login"
              className="font-bold text-[#6a5494] hover:text-[#3f255f]"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="font-bold text-[#6a5494] hover:text-[#3f255f]"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}