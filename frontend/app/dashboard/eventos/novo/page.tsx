"use client";

// VERSAO_EVENTOS_NOVO_PREMIUM_V2_13_AJUSTES_FINOS
// Objetivo: manter logo aprovado, cores ricas e aplicar ajustes finos de scroll, acessibilidade e mensagem IA sem mexer no backend.
// Fluxo preservado: cria evento em POST /events e redireciona para /dashboard/eventos/[eventId]/visual.

import Link from "next/link";
import {
  CSSProperties,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "../../../../src/lib/api";

type EventCategoryKey =
  | "casamento"
  | "cha-cozinha"
  | "cha-bebe"
  | "aniversario-infantil"
  | "aniversario-adulto"
  | "debutante"
  | "formatura"
  | "noivado"
  | "bodas"
  | "casa-nova"
  | "corporativo"
  | "religioso"
  | "personalizado";

type EventTemplateKey =
  | "casamento-romantico"
  | "casamento-luxo"
  | "casamento-rustico"
  | "casamento-folhas"
  | "casamento-serenata"
  | "cha-cozinha-elegante"
  | "cha-bebe-delicado"
  | "aniversario-infantil-divertido"
  | "aniversario-adulto-premium"
  | "debutante-luxo"
  | "debutante-princesa"
  | "formatura-classica"
  | "noivado-elegante"
  | "bodas-elegante"
  | "casa-nova-clean"
  | "corporativo-premium"
  | "batizado-sagrado"
  | "evento-personalizado";

type EventType =
  | "WEDDING"
  | "KITCHEN_SHOWER"
  | "BABY_SHOWER"
  | "CHILD_BIRTHDAY"
  | "ADULT_BIRTHDAY"
  | "BIRTHDAY"
  | "GRADUATION"
  | "ENGAGEMENT"
  | "ANNIVERSARY"
  | "HOUSEWARMING"
  | "CORPORATE"
  | "RELIGIOUS"
  | "OTHER";

type GiftMode = "PHYSICAL_ONLY" | "CASH_ONLY" | "HYBRID";

type EventCategory = {
  key: EventCategoryKey;
  legacyKeys: string[];
  label: string;
  shortLabel: string;
  group: string;
  description: string;
  badge: string;
  icon: string;
  eventType: EventType;
  giftMode: GiftMode;
  defaultTemplateKey: EventTemplateKey;
  suggestedName: string;
  suggestedDescription: string;
  suggestedLocation: string;
  features: string[];
};

type EventTemplate = {
  key: EventTemplateKey;
  categoryKey: EventCategoryKey;
  legacyKeys: string[];
  label: string;
  shortLabel: string;
  category: string;
  description: string;
  badge: string;
  suggestedName: string;
  suggestedDescription: string;
  suggestedLocation: string;
  eventType: EventType;
  giftMode: GiftMode;
  themeKey: string;
  previewHref?: string;
  image: string;
  features: string[];
};

type WizardStepKey = "tipo" | "modelo" | "dados" | "site" | "revisao";

type WizardStep = {
  key: WizardStepKey;
  eyebrow: string;
  title: string;
  subtitle: string;
};

type CreatedEventResponse = {
  id?: string;
  event?: {
    id?: string;
  };
  data?: {
    id?: string;
  };
};

const EVENT_CATEGORIES: EventCategory[] = [
  {
    key: "casamento",
    legacyKeys: ["wedding", "casamento-romantico", "casamento-luxo"],
    label: "Casamento",
    shortLabel: "Casamento",
    group: "Social premium",
    description:
      "Site completo para cerimônia, recepção, história do casal, padrinhos, presentes e RSVP.",
    badge: "mais desejado",
    icon: "💍",
    eventType: "WEDDING",
    giftMode: "HYBRID",
    defaultTemplateKey: "casamento-romantico",
    suggestedName: "André & Andressa",
    suggestedDescription:
      "Estamos muito felizes em compartilhar esse momento especial com vocês. Aqui vocês encontrarão os detalhes do nosso grande dia.",
    suggestedLocation: "Ex.: Espaço de eventos, São Paulo",
    features: ["Cerimônia", "Recepção", "RSVP", "Presentes"],
  },
  {
    key: "cha-cozinha",
    legacyKeys: ["cha-de-cozinha", "cha-panela", "cha-bar", "kitchen-shower"],
    label: "Chá de cozinha",
    shortLabel: "Chá de cozinha",
    group: "Casa e presentes",
    description:
      "Ideal para chá de cozinha, chá de panela ou chá bar, com lista de presentes e Pix livre.",
    badge: "casa nova",
    icon: "🍽️",
    eventType: "KITCHEN_SHOWER",
    giftMode: "HYBRID",
    defaultTemplateKey: "cha-cozinha-elegante",
    suggestedName: "Renan & Laislla",
    suggestedDescription:
      "Estamos preparando esse encontro com muito carinho para celebrar essa nova fase ao lado das pessoas que amamos.",
    suggestedLocation: "Ex.: Casa da família, salão ou espaço reservado",
    features: ["Lista", "Pix", "Reserva", "Local"],
  },
  {
    key: "cha-bebe",
    legacyKeys: ["cha-de-bebe", "cha-bebe", "cha-revelacao", "revelacao"],
    label: "Chá de bebê",
    shortLabel: "Chá de bebê",
    group: "Família",
    description:
      "Para chá de bebê ou revelação, com enxoval, recados, confirmação e lista delicada.",
    badge: "delicado",
    icon: "🧸",
    eventType: "BABY_SHOWER",
    giftMode: "HYBRID",
    defaultTemplateKey: "cha-bebe-delicado",
    suggestedName: "Chá de bebê do Miguel",
    suggestedDescription:
      "Estamos preparando um encontro cheio de carinho para celebrar a chegada do nosso bebê com pessoas especiais.",
    suggestedLocation: "Ex.: Espaço do evento, residência ou salão",
    features: ["Enxoval", "RSVP", "Recados", "Presentes"],
  },
  {
    key: "aniversario-infantil",
    legacyKeys: ["aniversario-infantil", "festa-infantil", "kids"],
    label: "Aniversário infantil",
    shortLabel: "Infantil",
    group: "Aniversários",
    description:
      "Festa infantil com tema, horário, local, confirmação, presentes e informações para os pais.",
    badge: "divertido",
    icon: "🎈",
    eventType: "CHILD_BIRTHDAY",
    giftMode: "HYBRID",
    defaultTemplateKey: "aniversario-infantil-divertido",
    suggestedName: "Aniversário do Pedro",
    suggestedDescription:
      "Vamos comemorar esse dia especial com muita alegria. Confirme sua presença e veja todos os detalhes da festa.",
    suggestedLocation: "Ex.: Buffet infantil, salão ou residência",
    features: ["Tema", "RSVP", "Presentes", "Local"],
  },
  {
    key: "aniversario-adulto",
    legacyKeys: ["aniversario", "birthday", "aniversario-adulto"],
    label: "Aniversário adulto",
    shortLabel: "Aniversário",
    group: "Aniversários",
    description:
      "Convite elegante para aniversário adulto, jantar, festa, churrasco ou encontro especial.",
    badge: "festa",
    icon: "🥂",
    eventType: "ADULT_BIRTHDAY",
    giftMode: "HYBRID",
    defaultTemplateKey: "aniversario-adulto-premium",
    suggestedName: "Aniversário da Ana",
    suggestedDescription:
      "Quero comemorar esse novo ciclo com pessoas especiais. Aqui estão os detalhes da nossa celebração.",
    suggestedLocation: "Ex.: Restaurante, salão, chácara ou residência",
    features: ["Convite", "RSVP", "Presentes", "Mapa"],
  },
  {
    key: "debutante",
    legacyKeys: ["15-anos", "quinze-anos", "debutante"],
    label: "Festa de 15 anos",
    shortLabel: "15 anos",
    group: "Grande celebração",
    description:
      "Modelo glamouroso para debutante, com galeria, dress code, atrações, RSVP e presentes.",
    badge: "premium",
    icon: "✨",
    eventType: "BIRTHDAY",
    giftMode: "HYBRID",
    defaultTemplateKey: "debutante-luxo",
    suggestedName: "15 anos da Isabela",
    suggestedDescription:
      "Uma noite especial está chegando. Criamos este site para compartilhar os detalhes da festa e receber sua confirmação.",
    suggestedLocation: "Ex.: Buffet, salão ou espaço de festas",
    features: ["Glam", "Dress code", "RSVP", "Galeria"],
  },
  {
    key: "formatura",
    legacyKeys: ["graduation", "colacao", "baile-formatura"],
    label: "Formatura",
    shortLabel: "Formatura",
    group: "Conquista",
    description:
      "Para turma, cerimônia, baile, mesa, traje, programação e confirmação dos convidados.",
    badge: "conquista",
    icon: "🎓",
    eventType: "GRADUATION",
    giftMode: "HYBRID",
    defaultTemplateKey: "formatura-classica",
    suggestedName: "Formatura da Turma 2026",
    suggestedDescription:
      "Chegou a hora de celebrar uma grande conquista. Reunimos aqui os detalhes para todos participarem desse momento.",
    suggestedLocation: "Ex.: Teatro, salão, restaurante ou espaço de eventos",
    features: ["Turma", "Programação", "RSVP", "Fotos"],
  },
  {
    key: "noivado",
    legacyKeys: ["engagement", "jantar-noivado", "pedido"],
    label: "Noivado",
    shortLabel: "Noivado",
    group: "Social premium",
    description:
      "Para jantar de noivado, celebração íntima, pedido oficial e reunião das famílias.",
    badge: "romântico",
    icon: "💌",
    eventType: "ENGAGEMENT",
    giftMode: "HYBRID",
    defaultTemplateKey: "noivado-elegante",
    suggestedName: "Noivado de Ana & Rafael",
    suggestedDescription:
      "Vamos celebrar esse novo capítulo da nossa história ao lado de pessoas muito especiais.",
    suggestedLocation: "Ex.: Restaurante, salão ou casa da família",
    features: ["Convite", "História", "RSVP", "Local"],
  },
  {
    key: "bodas",
    legacyKeys: ["anniversary", "bodas-prata", "bodas-ouro"],
    label: "Bodas",
    shortLabel: "Bodas",
    group: "Família",
    description:
      "Celebração de anos de casamento, renovação de votos, almoço familiar ou festa elegante.",
    badge: "memória",
    icon: "🤍",
    eventType: "ANNIVERSARY",
    giftMode: "HYBRID",
    defaultTemplateKey: "bodas-elegante",
    suggestedName: "Bodas de Maria & João",
    suggestedDescription:
      "Celebrar uma história construída com amor é uma alegria. Queremos você conosco nesse momento.",
    suggestedLocation: "Ex.: Igreja, restaurante, salão ou espaço reservado",
    features: ["Memórias", "Votos", "RSVP", "Fotos"],
  },
  {
    key: "casa-nova",
    legacyKeys: ["open-house", "housewarming", "cha-casa-nova"],
    label: "Casa nova",
    shortLabel: "Casa nova",
    group: "Novo lar",
    description:
      "Para open house, chá de casa nova, lista de itens, cotas e contribuição livre.",
    badge: "novo lar",
    icon: "🏡",
    eventType: "HOUSEWARMING",
    giftMode: "HYBRID",
    defaultTemplateKey: "casa-nova-clean",
    suggestedName: "Casa nova da Ana",
    suggestedDescription:
      "Vamos celebrar essa nova fase com pessoas queridas. Aqui você encontra os detalhes do encontro e da nossa lista.",
    suggestedLocation: "Ex.: Endereço do novo lar ou espaço da celebração",
    features: ["Open house", "Pix", "Presentes", "Mapa"],
  },
  {
    key: "corporativo",
    legacyKeys: [
      "empresa",
      "corporate",
      "evento-corporativo",
      "confraternizacao",
    ],
    label: "Corporativo",
    shortLabel: "Corporativo",
    group: "Empresa",
    description:
      "Para conferência, palestra, lançamento, confraternização, credenciamento e programação.",
    badge: "profissional",
    icon: "🏢",
    eventType: "CORPORATE",
    giftMode: "PHYSICAL_ONLY",
    defaultTemplateKey: "corporativo-premium",
    suggestedName: "Encontro Corporativo 2026",
    suggestedDescription:
      "Organize informações, confirmação de presença, programação e detalhes essenciais em uma página profissional.",
    suggestedLocation:
      "Ex.: Auditório, hotel, centro de eventos ou sede da empresa",
    features: ["Agenda", "Inscrição", "Palestrantes", "Local"],
  },
  {
    key: "religioso",
    legacyKeys: [
      "batizado",
      "primeira-comunhao",
      "culto",
      "cerimonia-religiosa",
    ],
    label: "Religioso",
    shortLabel: "Religioso",
    group: "Cerimônia",
    description:
      "Para batizado, primeira comunhão, culto, cerimônia religiosa ou celebração da igreja.",
    badge: "sereno",
    icon: "🕊️",
    eventType: "RELIGIOUS",
    giftMode: "HYBRID",
    defaultTemplateKey: "batizado-sagrado",
    suggestedName: "Batizado da Helena",
    suggestedDescription:
      "Será uma alegria viver esse momento de fé e carinho ao lado da família e dos amigos.",
    suggestedLocation: "Ex.: Igreja, paróquia, templo ou salão da comunidade",
    features: ["Cerimônia", "Família", "RSVP", "Recados"],
  },
  {
    key: "personalizado",
    legacyKeys: [
      "outro",
      "outros",
      "custom",
      "personalizado",
      "evento-personalizado",
    ],
    label: "Outro evento personalizado",
    shortLabel: "Personalizado",
    group: "Livre",
    description:
      "Para churrasco, encontro de família, festa temática, evento da igreja, jantar ou qualquer ideia sua.",
    badge: "livre",
    icon: "+",
    eventType: "OTHER",
    giftMode: "HYBRID",
    defaultTemplateKey: "evento-personalizado",
    suggestedName: "Meu churrasco de aniversário",
    suggestedDescription:
      "Criamos este site para reunir as informações do nosso evento e facilitar a confirmação dos convidados.",
    suggestedLocation:
      "Ex.: Chácara, salão, restaurante, igreja, empresa ou residência",
    features: ["Livre", "RSVP", "Presentes", "Mapa"],
  },
];

const EVENT_TEMPLATES: EventTemplate[] = [
  {
    key: "casamento-romantico",
    categoryKey: "casamento",
    legacyKeys: ["casamento", "wedding", "romantico"],
    label: "Casamento Romântico",
    shortLabel: "Romântico",
    category: "Casamento",
    description:
      "Editorial claro, delicado e emocional para casais que querem um site clássico e acolhedor.",
    badge: "romântico",
    suggestedName: "André & Andressa",
    suggestedDescription:
      "Estamos muito felizes em compartilhar esse momento especial com vocês. Aqui vocês encontrarão os detalhes do nosso grande dia.",
    suggestedLocation: "Ex.: Espaço de eventos, São Paulo",
    eventType: "WEDDING",
    giftMode: "HYBRID",
    themeKey: "casamento-romantico",
    previewHref: "/modelos/casamento-romantico",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90",
    features: ["História", "RSVP", "Presentes", "Galeria"],
  },
  {
    key: "casamento-luxo",
    categoryKey: "casamento",
    legacyKeys: ["black-tie", "luxo"],
    label: "Casamento Luxo",
    shortLabel: "Luxo",
    category: "Casamento",
    description:
      "Visual escuro, black tie e dourado para uma celebração sofisticada e marcante.",
    badge: "black tie",
    suggestedName: "Ana & Rafael",
    suggestedDescription:
      "Preparamos uma celebração elegante para viver esse momento com as pessoas que fazem parte da nossa história.",
    suggestedLocation:
      "Ex.: Hotel, castelo, salão premium ou espaço sofisticado",
    eventType: "WEDDING",
    giftMode: "HYBRID",
    themeKey: "casamento-luxo",
    previewHref: "/modelos/casamento-luxo",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=90",
    features: ["Black tie", "Menu fino", "RSVP", "Presentes"],
  },
  {
    key: "casamento-rustico",
    categoryKey: "casamento",
    legacyKeys: ["rustico", "campo", "floresta"],
    label: "Casamento Rústico",
    shortLabel: "Rústico",
    category: "Casamento",
    description:
      "Campo, natureza e clima afetivo com uma composição visual mais orgânica.",
    badge: "campo",
    suggestedName: "Clara & Miguel",
    suggestedDescription:
      "Nosso dia será cercado de natureza, carinho e pessoas especiais. Esperamos vocês para viver esse momento conosco.",
    suggestedLocation: "Ex.: Sítio, fazenda, chácara ou espaço ao ar livre",
    eventType: "WEDDING",
    giftMode: "HYBRID",
    themeKey: "casamento-rustico",
    previewHref: "/modelos/casamento-rustico",
    image:
      "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?auto=format&fit=crop&w=1600&q=90",
    features: ["Natureza", "Recepção", "Mapa", "Galeria"],
  },
  {
    key: "casamento-folhas",
    categoryKey: "casamento",
    legacyKeys: ["folhas", "botanico", "botanica"],
    label: "Casamento Botânico",
    shortLabel: "Botânico",
    category: "Casamento",
    description: "Capa clara com elementos naturais, folhas e elegância suave.",
    badge: "folhas",
    suggestedName: "Luísa & Henrique",
    suggestedDescription:
      "Criamos este espaço para compartilhar cada detalhe do nosso casamento com leveza, carinho e alegria.",
    suggestedLocation:
      "Ex.: Jardim, espaço ao ar livre ou salão com área verde",
    eventType: "WEDDING",
    giftMode: "HYBRID",
    themeKey: "casamento-folhas",
    previewHref: "/modelos/casamento-folhas",
    image:
      "https://images.unsplash.com/photo-1494955870715-979ca4f13bf0?auto=format&fit=crop&w=1600&q=90",
    features: ["Botânico", "História", "Padrinhos", "RSVP"],
  },
  {
    key: "casamento-serenata",
    categoryKey: "casamento",
    legacyKeys: ["serenata", "musical"],
    label: "Casamento Serenata",
    shortLabel: "Serenata",
    category: "Casamento",
    description:
      "Experiência cinematográfica com foto em rolagem, emoção e clima de grande convite.",
    badge: "cinema",
    suggestedName: "Aline & Leonardo",
    suggestedDescription:
      "Algumas histórias merecem ser vividas com calma, música e presença. Esperamos vocês para celebrar conosco.",
    suggestedLocation: "Ex.: Espaço de eventos, campo ou salão elegante",
    eventType: "WEDDING",
    giftMode: "HYBRID",
    themeKey: "casamento-serenata",
    previewHref: "/modelos/casamento-serenata",
    image:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1600&q=90",
    features: ["Scroll premium", "Fotos", "História", "RSVP"],
  },
  {
    key: "cha-cozinha-elegante",
    categoryKey: "cha-cozinha",
    legacyKeys: ["cha-cozinha", "cha-de-cozinha", "kitchen-shower"],
    label: "Chá de Cozinha Elegante",
    shortLabel: "Elegante",
    category: "Chá de cozinha",
    description:
      "Modelo acolhedor com foco em lista de presentes, Pix livre e encontro familiar.",
    badge: "casa nova",
    suggestedName: "Renan & Laislla",
    suggestedDescription:
      "Estamos preparando esse chá de cozinha com muito carinho para celebrar essa nova fase ao lado das pessoas que amamos.",
    suggestedLocation: "Ex.: Casa da família, salão ou espaço reservado",
    eventType: "KITCHEN_SHOWER",
    giftMode: "HYBRID",
    themeKey: "cha-cozinha-elegante",
    previewHref: "/modelos/cha-cozinha-elegante",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=90",
    features: ["Lista", "Pix", "Reserva", "Local"],
  },
  {
    key: "cha-bebe-delicado",
    categoryKey: "cha-bebe",
    legacyKeys: ["cha-de-bebe", "baby-shower"],
    label: "Chá de Bebê Delicado",
    shortLabel: "Delicado",
    category: "Chá de bebê",
    description:
      "Visual leve para celebrar a chegada do bebê com família, presentes e recados.",
    badge: "bebê",
    suggestedName: "Chá de bebê do Miguel",
    suggestedDescription:
      "Estamos preparando um encontro cheio de carinho para celebrar a chegada do nosso bebê com pessoas especiais.",
    suggestedLocation: "Ex.: Espaço do evento, residência ou salão",
    eventType: "BABY_SHOWER",
    giftMode: "HYBRID",
    themeKey: "cha-bebe-delicado",
    previewHref: "/modelos/cha-bebe-delicado",
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=90",
    features: ["Enxoval", "RSVP", "Presentes", "Mensagem"],
  },
  {
    key: "aniversario-infantil-divertido",
    categoryKey: "aniversario-infantil",
    legacyKeys: ["aniversario-infantil", "infantil"],
    label: "Aniversário Infantil Divertido",
    shortLabel: "Divertido",
    category: "Aniversário infantil",
    description:
      "Cores vivas, alegria e estrutura simples para pais organizarem a festa das crianças.",
    badge: "kids",
    suggestedName: "Aniversário do Pedro",
    suggestedDescription:
      "Vamos comemorar esse dia especial com muita alegria. Confirme sua presença e veja todos os detalhes da festa.",
    suggestedLocation: "Ex.: Buffet infantil, salão ou residência",
    eventType: "CHILD_BIRTHDAY",
    giftMode: "HYBRID",
    themeKey: "aniversario-infantil-divertido",
    previewHref: "/modelos/aniversario-infantil-divertido",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=90",
    features: ["Tema", "RSVP", "Presentes", "Local"],
  },
  {
    key: "aniversario-adulto-premium",
    categoryKey: "aniversario-adulto",
    legacyKeys: ["aniversario-adulto", "birthday"],
    label: "Aniversário Adulto Premium",
    shortLabel: "Premium",
    category: "Aniversário adulto",
    description:
      "Convite sofisticado para festa, jantar, churrasco ou celebração mais elegante.",
    badge: "premium",
    suggestedName: "Aniversário da Ana",
    suggestedDescription:
      "Quero comemorar esse novo ciclo com pessoas especiais. Aqui estão os detalhes da nossa celebração.",
    suggestedLocation: "Ex.: Restaurante, salão, chácara ou residência",
    eventType: "ADULT_BIRTHDAY",
    giftMode: "HYBRID",
    themeKey: "aniversario-adulto-premium",
    previewHref: "/modelos/aniversario-adulto-premium",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=90",
    features: ["Convite", "RSVP", "Presentes", "Mapa"],
  },
  {
    key: "debutante-luxo",
    categoryKey: "debutante",
    legacyKeys: ["debutante", "15-anos", "quinze-anos"],
    label: "Debutante Luxo",
    shortLabel: "Luxo",
    category: "15 anos",
    description:
      "Modelo glamouroso para festa de 15 anos com clima de red carpet e galeria marcante.",
    badge: "glam",
    suggestedName: "15 anos da Isabela",
    suggestedDescription:
      "Uma noite especial está chegando. Criamos este site para compartilhar os detalhes da festa e receber sua confirmação.",
    suggestedLocation: "Ex.: Buffet, salão ou espaço de festas",
    eventType: "BIRTHDAY",
    giftMode: "HYBRID",
    themeKey: "debutante-luxo",
    previewHref: "/modelos/debutante-luxo",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=90",
    features: ["Galeria", "Dress code", "RSVP", "Presentes"],
  },
  {
    key: "debutante-princesa",
    categoryKey: "debutante",
    legacyKeys: ["princesa", "debutante-princesa"],
    label: "Debutante Princesa",
    shortLabel: "Princesa",
    category: "15 anos",
    description:
      "Mais delicado, com brilho suave e composição de conto moderno.",
    badge: "encanto",
    suggestedName: "15 anos da Helena",
    suggestedDescription:
      "Um sonho está prestes a acontecer. Queremos celebrar essa noite com pessoas muito especiais.",
    suggestedLocation: "Ex.: Buffet, salão ou espaço de festas",
    eventType: "BIRTHDAY",
    giftMode: "HYBRID",
    themeKey: "debutante-princesa",
    previewHref: "/modelos/debutante-princesa",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=90",
    features: ["Brilho", "Galeria", "RSVP", "Traje"],
  },
  {
    key: "formatura-classica",
    categoryKey: "formatura",
    legacyKeys: ["formatura", "graduation"],
    label: "Formatura Clássica",
    shortLabel: "Clássica",
    category: "Formatura",
    description:
      "Estrutura para turma, cerimônia, baile, traje, programação e fotos.",
    badge: "conquista",
    suggestedName: "Formatura da Turma 2026",
    suggestedDescription:
      "Chegou a hora de celebrar uma grande conquista. Reunimos aqui os detalhes para todos participarem desse momento.",
    suggestedLocation: "Ex.: Espaço de eventos, teatro, salão ou restaurante",
    eventType: "GRADUATION",
    giftMode: "HYBRID",
    themeKey: "formatura-classica",
    previewHref: "/modelos/formatura-classica",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=90",
    features: ["Programação", "Turma", "RSVP", "Fotos"],
  },
  {
    key: "noivado-elegante",
    categoryKey: "noivado",
    legacyKeys: ["noivado", "engagement"],
    label: "Noivado Elegante",
    shortLabel: "Elegante",
    category: "Noivado",
    description:
      "Clima de carta, jantar e celebração íntima para reunir família e amigos.",
    badge: "carta",
    suggestedName: "Noivado de Ana & Rafael",
    suggestedDescription:
      "Vamos celebrar esse novo capítulo da nossa história ao lado de pessoas muito especiais.",
    suggestedLocation: "Ex.: Restaurante, salão ou casa da família",
    eventType: "ENGAGEMENT",
    giftMode: "HYBRID",
    themeKey: "noivado-elegante",
    previewHref: "/modelos/noivado-elegante",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=90",
    features: ["Jantar", "História", "RSVP", "Local"],
  },
  {
    key: "bodas-elegante",
    categoryKey: "bodas",
    legacyKeys: ["bodas", "anniversary"],
    label: "Bodas Elegante",
    shortLabel: "Elegante",
    category: "Bodas",
    description:
      "Composição afetiva para celebrar uma história construída com amor.",
    badge: "memória",
    suggestedName: "Bodas de Maria & João",
    suggestedDescription:
      "Celebrar uma história construída com amor é uma alegria. Queremos você conosco nesse momento.",
    suggestedLocation: "Ex.: Igreja, restaurante, salão ou espaço reservado",
    eventType: "ANNIVERSARY",
    giftMode: "HYBRID",
    themeKey: "bodas-elegante",
    previewHref: "/modelos/bodas-elegante",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=90",
    features: ["Memórias", "Votos", "RSVP", "Fotos"],
  },
  {
    key: "casa-nova-clean",
    categoryKey: "casa-nova",
    legacyKeys: ["casa-nova", "open-house", "housewarming"],
    label: "Casa Nova Clean",
    shortLabel: "Clean",
    category: "Casa nova",
    description:
      "Open house sofisticado, com lista de presentes, cotas e contribuição livre.",
    badge: "novo lar",
    suggestedName: "Casa nova da Ana",
    suggestedDescription:
      "Vamos celebrar essa nova fase com pessoas queridas. Aqui você encontra os detalhes do encontro e da nossa lista.",
    suggestedLocation: "Ex.: Endereço do novo lar ou espaço da celebração",
    eventType: "HOUSEWARMING",
    giftMode: "HYBRID",
    themeKey: "casa-nova-clean",
    previewHref: "/modelos/casa-nova-clean",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=90",
    features: ["Open house", "Pix", "Presentes", "Mapa"],
  },
  {
    key: "corporativo-premium",
    categoryKey: "corporativo",
    legacyKeys: ["corporativo", "evento-corporativo", "corporate"],
    label: "Corporativo Premium",
    shortLabel: "Premium",
    category: "Corporativo",
    description:
      "Evento empresarial com programação, palestrantes, credenciamento e inscrição.",
    badge: "empresa",
    suggestedName: "Encontro Corporativo 2026",
    suggestedDescription:
      "Organize informações, confirmação de presença, programação e detalhes essenciais em uma página profissional.",
    suggestedLocation:
      "Ex.: Centro de eventos, auditório, hotel ou sede da empresa",
    eventType: "CORPORATE",
    giftMode: "PHYSICAL_ONLY",
    themeKey: "corporativo-premium",
    previewHref: "/modelos/corporativo-premium",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=90",
    features: ["Agenda", "Inscrição", "Palestrantes", "Local"],
  },
  {
    key: "batizado-sagrado",
    categoryKey: "religioso",
    legacyKeys: ["batizado", "religioso", "primeira-comunhao"],
    label: "Religioso Sereno",
    shortLabel: "Sereno",
    category: "Religioso",
    description:
      "Visual claro, respeitoso e delicado para batizado, comunhão e cerimônias religiosas.",
    badge: "sagrado",
    suggestedName: "Batizado da Helena",
    suggestedDescription:
      "Será uma alegria viver esse momento de fé e carinho ao lado da família e dos amigos.",
    suggestedLocation: "Ex.: Igreja, paróquia, templo ou salão da comunidade",
    eventType: "RELIGIOUS",
    giftMode: "HYBRID",
    themeKey: "batizado-sagrado",
    previewHref: "/modelos/batizado-sagrado",
    image:
      "https://images.unsplash.com/photo-1495556650867-99590cea3657?auto=format&fit=crop&w=1600&q=90",
    features: ["Cerimônia", "Família", "RSVP", "Recados"],
  },
  {
    key: "evento-personalizado",
    categoryKey: "personalizado",
    legacyKeys: ["outro", "custom", "personalizado"],
    label: "Evento Personalizado",
    shortLabel: "Livre",
    category: "Personalizado",
    description:
      "Base elegante para qualquer evento que não se encaixa nas categorias prontas.",
    badge: "livre",
    suggestedName: "Meu churrasco de aniversário",
    suggestedDescription:
      "Criamos este site para reunir as informações do nosso evento e facilitar a confirmação dos convidados.",
    suggestedLocation:
      "Ex.: Chácara, salão, restaurante, igreja, empresa ou residência",
    eventType: "OTHER",
    giftMode: "HYBRID",
    themeKey: "evento-personalizado",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=90",
    features: ["Livre", "RSVP", "Presentes", "Mapa"],
  },
];

const WIZARD_STEPS: WizardStep[] = [
  {
    key: "tipo",
    eyebrow: "Passo 1",
    title: "Primeiro, que tipo de evento você vai criar?",
    subtitle:
      "Escolha a categoria. O VivaLista prepara modelos, textos e seções mais adequados para esse momento.",
  },
  {
    key: "modelo",
    eyebrow: "Passo 2",
    title: "Escolha o modelo base do site.",
    subtitle:
      "O modelo é só o ponto de partida. Depois você ajusta capa, cores, fotos, textos e seções.",
  },
  {
    key: "dados",
    eyebrow: "Passo 3",
    title: "Agora preencha os dados principais.",
    subtitle:
      "Nome, data, horário e local vão alimentar o site público, a contagem regressiva e a localização.",
  },
  {
    key: "site",
    eyebrow: "Passo 4",
    title: "Crie o endereço e a mensagem inicial.",
    subtitle:
      "Escolha um link simples para compartilhar e escreva uma abertura curta para receber seus convidados.",
  },
  {
    key: "revisao",
    eyebrow: "Passo 5",
    title: "Tudo certo. Agora vamos para o visual.",
    subtitle:
      "Ao criar o evento, você será levado para a próxima etapa: capa, cores, estilo, imagens e seções do site.",
  },
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function getCategoryByKey(key: EventCategoryKey) {
  return (
    EVENT_CATEGORIES.find((item) => item.key === key) ?? EVENT_CATEGORIES[0]
  );
}

function getCategoryByParam(value: string | null): EventCategory | null {
  if (!value) return null;

  const normalized = slugify(value.trim());

  return (
    EVENT_CATEGORIES.find((item) => item.key === normalized) ??
    EVENT_CATEGORIES.find((item) => item.legacyKeys.includes(normalized)) ??
    null
  );
}

function getTemplateByKey(key: EventTemplateKey) {
  return EVENT_TEMPLATES.find((item) => item.key === key) ?? EVENT_TEMPLATES[0];
}

function getTemplateByParam(value: string | null): EventTemplate | null {
  if (!value) return null;

  const normalized = slugify(value.trim());

  return (
    EVENT_TEMPLATES.find((item) => item.key === normalized) ??
    EVENT_TEMPLATES.find((item) => item.legacyKeys.includes(normalized)) ??
    null
  );
}

function getDefaultTemplateForCategory(categoryKey: EventCategoryKey) {
  const category = getCategoryByKey(categoryKey);
  return getTemplateByKey(category.defaultTemplateKey);
}

function buildCategoryHref(key: EventCategoryKey) {
  return `/dashboard/eventos/novo?tipo=${key}`;
}

function buildTemplateHref(key: EventTemplateKey) {
  return `/dashboard/eventos/novo?modelo=${key}`;
}

function formatPreviewDate(value: string) {
  if (!value) return "Data e horário a definir";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data e horário a definir";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getCreatedEventId(createdEvent: CreatedEventResponse | null) {
  return (
    createdEvent?.id ||
    createdEvent?.event?.id ||
    createdEvent?.data?.id ||
    null
  );
}

function getEventNameCopy(category: EventCategory, template: EventTemplate) {
  if (category.key === "casamento") {
    return {
      label: "Como devemos exibir o nome de vocês?",
      help: "Exemplo: André & Andressa. Esse nome aparece em destaque no site.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "cha-cozinha") {
    return {
      label: "Como devemos exibir o nome do chá?",
      help: "Pode ser o nome do casal, da noiva, do noivo ou da pessoa homenageada.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "cha-bebe") {
    return {
      label: "Como devemos exibir o nome do bebê ou da família?",
      help: "Esse nome será o destaque principal da página.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "debutante") {
    return {
      label: "Qual nome deve aparecer na festa?",
      help: "Exemplo: 15 anos da Isabela.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "aniversario-infantil") {
    return {
      label: "Qual é o nome do aniversariante?",
      help: "Esse nome aparece como título do convite e do site.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "aniversario-adulto") {
    return {
      label: "Como devemos exibir o nome da comemoração?",
      help: "Pode ser o nome da pessoa ou uma frase curta da festa.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "noivado") {
    return {
      label: "Como devemos exibir o nome do noivado?",
      help: "Exemplo: Noivado de Ana & Rafael.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "bodas") {
    return {
      label: "Como devemos exibir os nomes do casal?",
      help: "Exemplo: Bodas de Prata de Maria & João.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "formatura") {
    return {
      label: "Qual é o nome da turma ou da cerimônia?",
      help: "Exemplo: Formatura de Medicina 2026.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "casa-nova") {
    return {
      label: "Como devemos exibir o nome do evento?",
      help: "Exemplo: Casa nova da Ana ou Open House dos Silva.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "corporativo") {
    return {
      label: "Qual é o nome do evento corporativo?",
      help: "Use um nome claro para inscrição, RSVP e divulgação.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "religioso") {
    return {
      label: "Qual é o nome da cerimônia?",
      help: "Exemplo: Batizado da Helena ou Primeira Comunhão do Gabriel.",
      placeholder: template.suggestedName,
    };
  }

  if (category.key === "personalizado") {
    return {
      label: "Qual será o nome do seu evento personalizado?",
      help: "Exemplo: Meu churrasco de aniversário, Festa da igreja ou Encontro de família.",
      placeholder: template.suggestedName,
    };
  }

  return {
    label: "Qual será o nome principal do site?",
    help: "Esse será o primeiro destaque visto pelos convidados.",
    placeholder: template.suggestedName,
  };
}


function buildSmartInitialMessage({
  category,
  template,
  name,
  date,
  eventLocation,
}: {
  category: EventCategory;
  template: EventTemplate;
  name: string;
  date: string;
  eventLocation: string;
}) {
  const eventName = name.trim() || template.suggestedName;
  const locationText = eventLocation.trim() ? ` em ${eventLocation.trim()}` : "";
  const dateText = date.trim() ? ` no dia ${formatPreviewDate(date)}` : "";

  if (category.key === "casamento") {
    return `Estamos muito felizes em compartilhar esse momento tão especial com vocês. Criamos este site para reunir os detalhes do nosso casamento${locationText}${dateText} e facilitar a confirmação de presença. Será uma alegria viver esse dia ao lado de pessoas tão importantes para nós.`;
  }

  if (category.key === "cha-cozinha") {
    return `Estamos preparando o ${eventName} com muito carinho para celebrar essa nova fase. Aqui você encontra os detalhes do encontro${locationText}, nossa lista e as informações para participar desse momento especial com a gente.`;
  }

  if (category.key === "cha-bebe") {
    return `A chegada do nosso bebê merece ser celebrada com muito amor. Reunimos neste site os detalhes do ${eventName}${locationText}, a lista de presentes e as informações para confirmar sua presença.`;
  }

  if (category.key === "aniversario-infantil") {
    return `Vamos comemorar o ${eventName} com muita alegria. Aqui estão os detalhes da festa${locationText}, informações importantes para os convidados e o caminho para confirmar presença.`;
  }

  if (category.key === "aniversario-adulto") {
    return `Chegou a hora de celebrar o ${eventName}. Preparamos este espaço para reunir os detalhes da comemoração${locationText}, facilitar a confirmação e compartilhar tudo com pessoas especiais.`;
  }

  if (category.key === "debutante") {
    return `Uma noite muito especial está chegando. Criamos este site para compartilhar os detalhes do ${eventName}${locationText}, receber as confirmações e deixar todos por dentro dessa celebração tão marcante.`;
  }

  if (category.key === "formatura") {
    return `Chegou o momento de celebrar uma grande conquista. Aqui estão os detalhes da ${eventName}${locationText}, a programação e as informações para todos participarem desse dia tão importante.`;
  }

  if (category.key === "noivado") {
    return `Vamos celebrar o ${eventName} ao lado de pessoas muito especiais. Reunimos neste site os detalhes do encontro${locationText}, a confirmação de presença e as informações principais desse novo capítulo.`;
  }

  if (category.key === "bodas") {
    return `Celebrar uma história construída com amor é uma alegria imensa. Criamos este site para compartilhar os detalhes do ${eventName}${locationText} e receber a presença de quem faz parte dessa caminhada.`;
  }

  if (category.key === "casa-nova") {
    return `Uma nova fase começou e queremos celebrar com pessoas queridas. Neste site você encontra os detalhes do ${eventName}${locationText}, nossa lista e as informações para participar desse momento.`;
  }

  if (category.key === "corporativo") {
    return `O ${eventName} foi criado para reunir informações importantes em um só lugar. Aqui você encontra detalhes do evento${locationText}, programação, orientações e o caminho para confirmar participação.`;
  }

  if (category.key === "religioso") {
    return `Será uma alegria viver o ${eventName} ao lado da família e dos amigos. Reunimos neste site os detalhes da cerimônia${locationText} e as informações para confirmar presença com tranquilidade.`;
  }

  return `Criamos este site para reunir todas as informações do ${eventName}${locationText}, facilitar a confirmação dos convidados e deixar esse momento mais organizado, bonito e especial.`;
}

function VivaListaLogo() {
  return (
    <Link href="/" className="brand-logo-link" aria-label="VivaLista">
      <img src="/logo-vivalista.png" alt="VivaLista" className="brand-logo" />
    </Link>
  );
}

function NovoEventoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const templateParam = searchParams.get("modelo") || null;
  const typeParam =
    searchParams.get("tipo") || searchParams.get("evento") || null;

  const templateFromUrl = useMemo(
    () => getTemplateByParam(templateParam),
    [templateParam],
  );

  const categoryFromUrl = useMemo(() => {
    if (templateFromUrl) return getCategoryByKey(templateFromUrl.categoryKey);
    return getCategoryByParam(typeParam);
  }, [templateFromUrl, typeParam]);

  const [skipCategoryStep] = useState(() => Boolean(categoryFromUrl));
  const [skipTemplateStep] = useState(() => Boolean(templateFromUrl));
  const firstStepIndex = skipTemplateStep ? 2 : skipCategoryStep ? 1 : 0;

  const [selectedCategoryKey, setSelectedCategoryKey] =
    useState<EventCategoryKey>(categoryFromUrl?.key ?? EVENT_CATEGORIES[0].key);

  const selectedCategory = useMemo(() => {
    return getCategoryByKey(selectedCategoryKey);
  }, [selectedCategoryKey]);

  const [selectedTemplateKey, setSelectedTemplateKey] =
    useState<EventTemplateKey>(
      templateFromUrl?.key ?? selectedCategory.defaultTemplateKey,
    );

  const filteredTemplates = useMemo(() => {
    const templates = EVENT_TEMPLATES.filter(
      (template) => template.categoryKey === selectedCategory.key,
    );

    return templates.length > 0
      ? templates
      : [getDefaultTemplateForCategory("personalizado")];
  }, [selectedCategory.key]);

  const selectedTemplate = useMemo(() => {
    const currentTemplate = getTemplateByKey(selectedTemplateKey);

    if (currentTemplate.categoryKey === selectedCategory.key) {
      return currentTemplate;
    }

    return filteredTemplates[0] ?? EVENT_TEMPLATES[0];
  }, [filteredTemplates, selectedCategory.key, selectedTemplateKey]);

  const selectedCategoryIndex = useMemo(() => {
    return EVENT_CATEGORIES.findIndex(
      (category) => category.key === selectedCategory.key,
    );
  }, [selectedCategory.key]);

  const selectedTemplateIndex = useMemo(() => {
    return filteredTemplates.findIndex(
      (template) => template.key === selectedTemplate.key,
    );
  }, [filteredTemplates, selectedTemplate.key]);

  const [currentStep, setCurrentStep] = useState(firstStepIndex);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [siteSlug, setSiteSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const scrollRailLineRef = useRef<HTMLButtonElement | null>(null);
  const scrollDraggingRef = useRef(false);
  const scrollAnimationRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollThumbTop, setScrollThumbTop] = useState(12);

  const visibleSteps = useMemo(() => {
    return WIZARD_STEPS.slice(firstStepIndex);
  }, [firstStepIndex]);

  const visibleStepIndex = currentStep - firstStepIndex;
  const safeVisibleStepIndex = Math.max(0, visibleStepIndex);
  const step = WIZARD_STEPS[currentStep];
  const stepEyebrow = `Passo ${safeVisibleStepIndex + 1}`;
  const progressPercent =
    ((safeVisibleStepIndex + 1) / visibleSteps.length) * 100;
  const nameCopy = getEventNameCopy(selectedCategory, selectedTemplate);
  const publicPreviewUrl = siteSlug.trim()
    ? `vivalista.com/e/${siteSlug.trim()}`
    : "vivalista.com/e/seu-evento";

  useEffect(() => {
    if (!categoryFromUrl) return;
    setSelectedCategoryKey(categoryFromUrl.key);
  }, [categoryFromUrl]);

  useEffect(() => {
    if (!templateFromUrl) return;
    setSelectedTemplateKey(templateFromUrl.key);
    setSelectedCategoryKey(templateFromUrl.categoryKey);
  }, [templateFromUrl]);

  useEffect(() => {
    if (selectedTemplate.categoryKey === selectedCategory.key) return;
    setSelectedTemplateKey(selectedCategory.defaultTemplateKey);
  }, [
    selectedCategory.defaultTemplateKey,
    selectedCategory.key,
    selectedTemplate.categoryKey,
  ]);

  useEffect(() => {
    if (slugEdited) return;
    setSiteSlug(slugify(name));
  }, [name, slugEdited]);

  function updateScrollProgress() {
    const container = contentScrollRef.current;
    const rail = scrollRailLineRef.current;

    if (!container) {
      setScrollProgress(0);
      setScrollThumbTop(12);
      return;
    }

    const maxScroll = container.scrollHeight - container.clientHeight;

    if (maxScroll <= 0) {
      setScrollProgress(0);
      setScrollThumbTop(12);
      return;
    }

    const nextProgress = container.scrollTop / maxScroll;
    setScrollProgress(nextProgress);

    if (rail) {
      const minTop = 12;
      const maxTop = Math.max(minTop, rail.clientHeight - 12);
      setScrollThumbTop(minTop + (maxTop - minTop) * nextProgress);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      updateScrollProgress();
    });
  }, [currentStep]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.requestAnimationFrame(updateScrollProgress);
  }, [selectedCategory.key, selectedTemplate.key, filteredTemplates.length]);

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  function scrollStepContent(direction: "up" | "down") {
    const container = contentScrollRef.current;

    if (!container) return;

    if (scrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }

    const maxScroll = container.scrollHeight - container.clientHeight;
    const startTop = container.scrollTop;
    const distanceBase = Math.min(Math.max(container.clientHeight * 0.18, 64), 118);
    const distance = direction === "up" ? -distanceBase : distanceBase;
    const targetTop = Math.min(Math.max(startTop + distance, 0), maxScroll);
    const duration = 620;
    const startedAt = window.performance.now();

    function animateScroll(now: number) {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      container.scrollTop = startTop + (targetTop - startTop) * easedProgress;
      updateScrollProgress();

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(animateScroll);
        return;
      }

      scrollAnimationRef.current = null;
      updateScrollProgress();
    }

    scrollAnimationRef.current = window.requestAnimationFrame(animateScroll);
  }

  function scrollContentByRailPosition(clientY: number) {
    const container = contentScrollRef.current;
    const rail = scrollRailLineRef.current;

    if (!container || !rail) return;

    const railRect = rail.getBoundingClientRect();
    const maxScroll = container.scrollHeight - container.clientHeight;

    if (railRect.height <= 0 || maxScroll <= 0) return;

    const relativeY = Math.min(
      Math.max(clientY - railRect.top, 0),
      railRect.height,
    );

    const nextProgress = relativeY / railRect.height;

    container.scrollTo({
      top: maxScroll * nextProgress,
      behavior: "auto",
    });

    setScrollProgress(nextProgress);

    if (rail) {
      const minTop = 12;
      const maxTop = Math.max(minTop, rail.clientHeight - 12);
      setScrollThumbTop(minTop + (maxTop - minTop) * nextProgress);
    }
  }

  function handleScrollRailPointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    scrollDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scrollContentByRailPosition(event.clientY);
  }

  function handleScrollRailPointerMove(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    if (!scrollDraggingRef.current) return;
    event.preventDefault();
    scrollContentByRailPosition(event.clientY);
  }

  function handleScrollRailPointerUp(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    scrollDraggingRef.current = false;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // O navegador pode liberar automaticamente a captura do ponteiro.
    }
  }

  function applyTemplateSuggestion(template: EventTemplate) {
    setName((current) => current || template.suggestedName);
    setDescription((current) => current || template.suggestedDescription);
    setLocation((current) => current || template.suggestedLocation);
    setErrorMessage(null);
  }

  function handleSuggestInitialMessage() {
    if (description.trim()) {
      const confirmed = window.confirm(
        "Isso vai substituir a mensagem que você escreveu. Continuar?",
      );

      if (!confirmed) return;
    }

    const nextMessage = buildSmartInitialMessage({
      category: selectedCategory,
      template: selectedTemplate,
      name,
      date,
      eventLocation: location,
    });

    setDescription(nextMessage);
    setErrorMessage(null);
  }

  function handleChooseCategory(category: EventCategory) {
    const defaultTemplate = getDefaultTemplateForCategory(category.key);

    setSelectedCategoryKey(category.key);
    setSelectedTemplateKey(defaultTemplate.key);
    setErrorMessage(null);
    router.replace(buildCategoryHref(category.key), { scroll: false });
  }

  function handleChooseTemplate(template: EventTemplate) {
    setSelectedCategoryKey(template.categoryKey);
    setSelectedTemplateKey(template.key);
    setErrorMessage(null);
    router.replace(buildTemplateHref(template.key), { scroll: false });
  }

  function validateStep(stepIndex: number) {
    const stepKey = WIZARD_STEPS[stepIndex]?.key;

    if (stepKey === "tipo" && !selectedCategory) {
      return "Escolha primeiro o tipo de evento.";
    }

    if (stepKey === "modelo" && !selectedTemplate) {
      return "Escolha o modelo visual do site.";
    }

    if (stepKey === "dados") {
      if (!name.trim()) return "Informe o nome principal do site.";
      if (!date.trim()) return "Informe a data e o horário do evento.";
      if (!location.trim()) return "Informe o local do evento.";
    }

    if (stepKey === "site") {
      if (!siteSlug.trim()) return "Crie o endereço do site.";
      if (siteSlug.trim().length < 3) {
        return "O endereço do site precisa ter pelo menos 3 caracteres.";
      }
      if (!description.trim()) return "Escreva uma mensagem inicial curta.";
    }

    return null;
  }

  function goNext() {
    const validationMessage = validateStep(currentStep);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setErrorMessage(null);
    setCurrentStep((current) => Math.min(current + 1, WIZARD_STEPS.length - 1));
  }

  function goBack() {
    setErrorMessage(null);
    setCurrentStep((current) => Math.max(current - 1, firstStepIndex));
  }

  async function createEvent(payload: Record<string, unknown>) {
    return apiFetch("/events", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<CreatedEventResponse>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationMessage =
      validateStep(2) || validateStep(3) || validateStep(currentStep);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      setCurrentStep(
        validationMessage.includes("nome") ||
          validationMessage.includes("data") ||
          validationMessage.includes("local")
          ? Math.max(firstStepIndex, 2)
          : Math.max(firstStepIndex, 3),
      );
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const baseDescription = description.trim();
      const finalDescription = `[Evento: ${selectedCategory.label}] [Modelo: ${selectedTemplate.label}] ${baseDescription}`;

      const basePayload = {
        name: name.trim(),
        date: new Date(date).toISOString(),
        location: location.trim(),
        description: finalDescription,
      };

      const enrichedPayload = {
        ...basePayload,
        slug: siteSlug.trim(),
        eventType: selectedCategory.eventType,
        eventCategory: selectedCategory.key,
        giftMode: selectedTemplate.giftMode,
        templateKey: selectedTemplate.key,
        themeKey: selectedTemplate.themeKey,
        pixEnabled: true,
        freeContributionEnabled: selectedTemplate.giftMode !== "PHYSICAL_ONLY",
        quotaEnabled: selectedTemplate.giftMode !== "PHYSICAL_ONLY",
      };

      let createdEvent: CreatedEventResponse | null = null;

      try {
        createdEvent = await createEvent(enrichedPayload);
      } catch (firstError) {
        console.warn(
          "Criação com contexto do modelo falhou. Tentando payload básico.",
          firstError,
        );
        createdEvent = await createEvent(basePayload);
      }

      const createdId = getCreatedEventId(createdEvent);

      if (createdId) {
        router.push(`/dashboard/eventos/${createdId}/visual`);
        return;
      }

      router.push("/dashboard/eventos");
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o evento.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  function renderStepContent() {
    if (step.key === "tipo") {
      return (
        <div className="event-type-grid">
          {EVENT_CATEGORIES.map((category, index) => {
            const isSelected = selectedCategory.key === category.key;

            return (
              <article
                key={category.key}
                className={`event-type-card ${isSelected ? "active" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => handleChooseCategory(category)}
                  className="event-type-button"
                >
                  <span className="event-type-icon">{category.icon}</span>

                  <span className="event-type-content">
                    <span className="template-topline">
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      <em>{category.badge}</em>
                    </span>

                    <strong>{category.label}</strong>
                    <span>{category.description}</span>

                    <span className="event-type-features">
                      {category.features.slice(0, 3).map((feature) => (
                        <i key={feature}>{feature}</i>
                      ))}
                    </span>
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      );
    }

    if (step.key === "modelo") {
      return (
        <div className="model-step-wrap">
          <div className="model-step-note">
            <strong>{selectedCategory.label}</strong>
            <span>
              Escolha um visual para esse tipo de evento. Depois você pode
              ajustar capa, textos, cores e seções.
            </span>
          </div>

          <div className="template-grid">
            {filteredTemplates.map((template, index) => {
              const isSelected = selectedTemplate.key === template.key;

              return (
                <article
                  key={template.key}
                  className={`template-card ${isSelected ? "active" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => handleChooseTemplate(template)}
                    className="template-button"
                  >
                    <span
                      className="template-thumb"
                      style={{ backgroundImage: `url(${template.image})` }}
                    />

                    <span className="template-content">
                      <span className="template-topline">
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        <em>{template.badge}</em>
                      </span>

                      <strong>{template.label}</strong>
                      <span>{template.description}</span>
                    </span>
                  </button>

                  <div className="template-footer">
                    <div>
                      {template.features.slice(0, 2).map((feature) => (
                        <i key={feature}>{feature}</i>
                      ))}
                    </div>

                    {template.previewHref ? (
                      <Link href={template.previewHref}>Ver modelo</Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      );
    }

    if (step.key === "dados") {
      return (
        <div className="form-stack data-step">
          <button
            type="button"
            onClick={() => applyTemplateSuggestion(selectedTemplate)}
            className="suggestion-button"
          >
            Usar exemplo de {selectedTemplate.shortLabel}
          </button>
          <span className="suggestion-helper">
            Preenche apenas os campos vazios para não apagar o que você já
            escreveu.
          </span>

          <div className="field-block featured-field">
            <label htmlFor="name">{nameCopy.label}</label>
            <p>{nameCopy.help}</p>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={nameCopy.placeholder}
            />
          </div>

          <div className="field-block date-field-block">
            <label htmlFor="date">Quando será o evento?</label>
            <p>Essa data será usada na contagem regressiva do site.</p>
            <input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="field-block featured-field location-field-block">
            <label htmlFor="location">Nome do espaço, endereço ou CEP</label>
            <p>
              Digite o nome do local, cidade, endereço ou CEP. Este campo já fica preparado
              para a próxima evolução com preenchimento automático por CEP e busca por espaço.
            </p>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Ex.: Espaço Villa Jardim, 01001-000 ou Rua das Flores, 100"
            />
            <p className="location-coming-soon">
              Em breve: preenchimento automático por CEP e busca de espaços.
            </p>
          </div>
        </div>
      );
    }

    if (step.key === "site") {
      return (
        <div className="form-stack site-step">
          <div className="field-block featured-field">
            <label htmlFor="siteSlug">Crie o endereço do seu site</label>
            <p>Escolha algo simples, bonito e fácil de compartilhar.</p>
            <div className="slug-field">
              <span>vivalista.com/e/</span>
              <input
                id="siteSlug"
                type="text"
                value={siteSlug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setSiteSlug(slugify(event.target.value));
                }}
                placeholder="andre-e-andressa"
              />
            </div>
          </div>

          <div className="field-block message-field-block">
            <div className="message-field-head">
              <div>
                <label htmlFor="description">Mensagem inicial</label>
                <p>
                  Poucas palavras bem escolhidas deixam o site mais bonito e
                  acolhedor.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSuggestInitialMessage}
                className="ai-message-button"
              >
                ✨ Gerar mensagem por IA
              </button>
            </div>

            <span className="message-ai-note">
              Sugestão automática baseada no tipo de evento, nome, data e local.
              Depois você pode editar livremente.
            </span>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={selectedTemplate.suggestedDescription}
              rows={4}
            />
          </div>

          <div className="info-card">
            <strong>Depois desta etapa</strong>
            <p>
              Ao criar, vamos abrir a próxima tela para cuidar do visual: capa,
              cores, estilo, imagens e seções. Galeria, presentes e convidados
              ficam em telas próprias para não bagunçar a criação.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="review-premium-shell">
        <section className="review-preview-panel">
          <div
            className="review-image"
            style={{ backgroundImage: `url(${selectedTemplate.image})` }}
          >
            <div className="review-overlay">
              <span>{selectedCategory.label}</span>
              <h2>{name.trim() || selectedTemplate.suggestedName}</h2>
              <p>{formatPreviewDate(date)}</p>
            </div>
          </div>

          <div className="review-template-bar">
            <div>
              <span>Modelo escolhido</span>
              <strong>{selectedTemplate.label}</strong>
            </div>
            <em>{selectedTemplate.badge}</em>
          </div>
        </section>

        <section className="review-summary-panel">
          <div className="review-final-headline">
            <span>revisão final</span>
            <h3>Confira os dados antes de abrir o editor visual.</h3>
            <p>
              Na próxima tela você ajusta capa, cores, estilo, imagens e seções
              do site.
            </p>
          </div>

          <div className="review-grid">
            <div className="review-card large">
              <span>Tipo de evento</span>
              <strong>{selectedCategory.label}</strong>
              <p>{selectedCategory.description}</p>
            </div>

            <div className="review-card">
              <span>Nome do site</span>
              <strong>{name.trim() || selectedTemplate.suggestedName}</strong>
            </div>

            <div className="review-card">
              <span>Data e horário</span>
              <strong>{formatPreviewDate(date)}</strong>
            </div>

            <div className="review-card">
              <span>Local</span>
              <strong>
                {location.trim() || selectedTemplate.suggestedLocation}
              </strong>
            </div>

            <div className="review-card large">
              <span>Endereço público</span>
              <strong>{publicPreviewUrl}</strong>
              <p>
                Esse será o caminho principal para compartilhar com convidados.
              </p>
            </div>
          </div>

          <span className="review-feature-label">Este modelo inclui</span>
          <div className="review-feature-list">
            {selectedTemplate.features.map((feature) => (
              <i key={feature}>{feature}</i>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <main
      className="create-event-wizard"
      style={
        {
          "--progress-percent": `${progressPercent}%`,
          "--scroll-progress": `${scrollProgress}`,
          "--scroll-thumb-top": `${scrollThumbTop}px`,
        } as CSSProperties
      }
    >
      <style jsx global>{`
        :root {
          --vv-ink: #241433;
          --vv-ink-2: #3d2a54;
          --vv-purple: #5d35a1;
          --vv-purple-soft: #efe6ff;
          --vv-gold: #c6a15f;
          --vv-gold-2: #d7ad47;
          --vv-gold-3: #f2d486;
          --vv-ivory: #fffdf8;
          --vv-cream: #f7efe6;
          --vv-muted: rgba(36, 20, 51, 0.62);
          --vv-line: rgba(36, 20, 51, 0.12);
          --vv-shadow: 0 26px 80px rgba(61, 42, 84, 0.1);
          --vv-shadow-strong: 0 34px 110px rgba(61, 42, 84, 0.16);
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          height: auto;
          min-height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          background: #fffaf2;
        }

        body {
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .create-event-wizard {
          min-height: 100svh;
          position: relative;
          isolation: isolate;
          padding-bottom: 28px;
          color: var(--vv-ink);
          background:
            radial-gradient(
              circle at 8% 8%,
              rgba(93, 53, 161, 0.14),
              transparent 30%
            ),
            radial-gradient(
              circle at 92% 10%,
              rgba(215, 173, 71, 0.26),
              transparent 28%
            ),
            radial-gradient(
              circle at 50% -8%,
              rgba(255, 255, 255, 0.78),
              transparent 35%
            ),
            linear-gradient(135deg, #fffaf2 0%, #f7efe6 44%, #efe4d8 100%);
        }

        .create-event-wizard::before,
        .create-event-wizard::after {
          content: "";
          position: fixed;
          z-index: -1;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(12px);
        }

        .create-event-wizard::before {
          width: 560px;
          height: 560px;
          left: -260px;
          bottom: -300px;
          background: radial-gradient(
            circle,
            rgba(215, 173, 71, 0.16),
            transparent 66%
          );
        }

        .create-event-wizard::after {
          width: 500px;
          height: 500px;
          right: -240px;
          top: -220px;
          background: radial-gradient(
            circle,
            rgba(93, 53, 161, 0.12),
            transparent 66%
          );
        }

        .form-side {
          display: block;
          min-height: 100svh;
        }


        .brand-logo-link {
          display: inline-flex;
          justify-self: center;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .brand-logo {
          width: min(250px, 30vw);
          max-height: 72px;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 14px 24px rgba(61, 42, 84, 0.1));
        }


        .step-area {
          padding: 0 clamp(18px, 3vw, 44px) 34px;
        }

        .step-shell {
          position: relative;
          overflow: hidden;
          width: min(100%, 1480px);
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.74);
          border-radius: 38px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.8),
              rgba(255, 249, 239, 0.7)
            ),
            radial-gradient(
              circle at 0% 0%,
              rgba(215, 173, 71, 0.13),
              transparent 34%
            ),
            radial-gradient(
              circle at 100% 0%,
              rgba(93, 53, 161, 0.08),
              transparent 32%
            );
          box-shadow: var(--vv-shadow-strong);
          backdrop-filter: blur(24px);
          padding: clamp(18px, 2.1vw, 30px);
        }

        .step-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.55),
              transparent
            ),
            radial-gradient(
              circle at 50% 0%,
              rgba(255, 255, 255, 0.78),
              transparent 26%
            );
          opacity: 0.7;
        }

        .step-shell > * {
          position: relative;
          z-index: 1;
        }

        .progress-mini {
          width: min(100%, 760px);
          margin: 0 auto 22px;
        }

        .progress-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          padding: 0 4px;
          color: rgba(36, 20, 51, 0.56);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.035em;
        }

        .progress-summary span,
        .progress-summary strong {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(215, 173, 71, 0.18);
          padding: 0 14px;
          box-shadow: 0 10px 26px rgba(61, 42, 84, 0.04);
          white-space: nowrap;
        }

        .progress-summary strong {
          color: var(--vv-purple);
        }

        .progress-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .progress-item {
          display: flex;
          align-items: center;
          flex: 1 1 auto;
          min-width: 0;
        }

        .progress-item:last-child {
          flex: 0 0 auto;
        }

        .progress-dot {
          position: relative;
          flex: 0 0 auto;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          border: 1px solid rgba(215, 173, 71, 0.52);
          background: radial-gradient(
            circle at 32% 25%,
            rgba(255, 255, 255, 0.98) 0 14%,
            rgba(255, 249, 239, 0.96) 15% 40%,
            rgba(242, 212, 134, 0.78) 100%
          );
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.92),
            0 8px 18px rgba(61, 42, 84, 0.1);
          transition: 0.25s ease;
        }

        .progress-dot::after {
          content: "";
          position: absolute;
          top: 5px;
          left: 6px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 0 7px rgba(255, 255, 255, 0.82);
        }

        .progress-dot.done {
          background: radial-gradient(
            circle at 35% 28%,
            #fff9dd 0 13%,
            #f2d486 14% 48%,
            #b88419 100%
          );
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.74),
            0 0 0 5px rgba(215, 173, 71, 0.1),
            0 12px 24px rgba(184, 132, 25, 0.22);
        }

        .progress-dot.current {
          width: 34px;
          height: 34px;
          border-color: rgba(36, 20, 51, 0.88);
          background: radial-gradient(
            circle at 34% 24%,
            rgba(255, 255, 255, 0.62) 0 10%,
            #5d35a1 11% 42%,
            #241433 100%
          );
          box-shadow:
            inset 0 1px 3px rgba(255, 255, 255, 0.32),
            0 0 0 8px rgba(215, 173, 71, 0.14),
            0 14px 30px rgba(36, 20, 51, 0.26);
        }

        .progress-dot.current::after {
          top: 7px;
          left: 9px;
          width: 7px;
          height: 7px;
        }

        .progress-line {
          flex: 1 1 auto;
          min-width: 30px;
          height: 3px;
          margin: 0 10px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(215, 173, 71, 0.2),
            rgba(93, 53, 161, 0.12)
          );
        }

        .progress-line.done {
          background: linear-gradient(90deg, #d7ad47, #f2d486);
        }

        .step-eyebrow {
          min-height: 30px;
          width: max-content;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 1px solid rgba(215, 173, 71, 0.38);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.66);
          color: rgba(93, 53, 161, 0.78);
          box-shadow: 0 12px 28px rgba(61, 42, 84, 0.04);
          padding: 0 16px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .step-title {
          max-width: 980px;
          margin: 10px auto 0;
          color: var(--vv-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 3.1vw, 52px);
          line-height: 0.98;
          font-weight: 400;
          letter-spacing: -0.06em;
          text-align: center;
          text-wrap: balance;
        }

        .step-title::after {
          content: "";
          display: block;
          width: 100px;
          height: 2px;
          margin: 18px auto 0;
          background: linear-gradient(
            90deg,
            transparent,
            #d7ad47,
            #5d35a1,
            transparent
          );
        }

        .step-subtitle {
          max-width: 900px;
          margin: 12px auto 0;
          color: var(--vv-muted);
          font-size: 14.5px;
          line-height: 1.5;
          text-align: center;
          text-wrap: balance;
        }

        .step-content {
          margin-top: 24px;
        }

        .event-type-grid,
        .template-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          overflow: visible;
        }

        .event-type-card,
        .template-card,
        .field-block,
        .review-card,
        .info-card,
        .model-step-note {
          border: 1px solid rgba(255, 255, 255, 0.72);
          background: rgba(255, 255, 255, 0.74);
          box-shadow: var(--vv-shadow);
          backdrop-filter: blur(18px);
        }

        .event-type-card,
        .template-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border-radius: 28px;
          transition: 0.28s ease;
        }

        .event-type-card::before,
        .template-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0;
          background:
            radial-gradient(
              circle at top right,
              rgba(215, 173, 71, 0.2),
              transparent 38%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(93, 53, 161, 0.1),
              transparent 42%
            );
          transition: 0.28s ease;
        }

        .event-type-card:hover,
        .template-card:hover {
          transform: translateY(-4px);
          border-color: rgba(215, 173, 71, 0.44);
          box-shadow: 0 30px 90px rgba(61, 42, 84, 0.14);
        }

        .event-type-card:hover::before,
        .template-card:hover::before,
        .event-type-card.active::before,
        .template-card.active::before {
          opacity: 1;
        }

        .event-type-card.active,
        .template-card.active {
          border-color: rgba(215, 173, 71, 0.72);
          background: rgba(255, 255, 255, 0.94);
          box-shadow:
            0 32px 96px rgba(61, 42, 84, 0.16),
            0 0 0 5px rgba(215, 173, 71, 0.1);
        }

        .event-type-button,
        .template-button {
          width: 100%;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          text-align: left;
        }

        .event-type-button {
          min-height: 176px;
          padding: 16px;
          display: grid;
          grid-template-columns: 58px minmax(0, 1fr);
          gap: 14px;
        }

        .event-type-icon {
          width: 58px;
          height: 58px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at 30% 22%,
              rgba(255, 255, 255, 0.98),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              rgba(242, 212, 134, 0.58),
              rgba(93, 53, 161, 0.14)
            );
          color: var(--vv-ink);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.86),
            0 14px 28px rgba(61, 42, 84, 0.1);
          font-size: 25px;
          font-weight: 950;
        }

        .event-type-content,
        .template-content {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .template-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
        }

        .template-topline small,
        .template-topline em {
          color: rgba(184, 132, 25, 0.95);
          font-size: 9px;
          font-style: normal;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .event-type-content strong,
        .template-content strong,
        .review-card strong {
          color: var(--vv-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          letter-spacing: -0.04em;
        }

        .event-type-content strong {
          font-size: 22px;
          line-height: 1.05;
        }

        .template-content strong {
          font-size: 21px;
          line-height: 1.05;
        }

        .event-type-content
          > span:not(.template-topline):not(.event-type-features),
        .template-content > span:last-child,
        .review-card p,
        .field-block p,
        .info-card p,
        .model-step-note span {
          color: var(--vv-muted);
        }

        .event-type-content
          > span:not(.template-topline):not(.event-type-features) {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: 6px;
          font-size: 12.2px;
          line-height: 1.45;
        }

        .event-type-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
          padding-top: 12px;
        }

        .event-type-features i,
        .template-footer i {
          border: 1px solid rgba(93, 53, 161, 0.08);
          border-radius: 999px;
          background: rgba(93, 53, 161, 0.08);
          color: rgba(61, 42, 84, 0.78);
          padding: 4px 7px;
          font-size: 9px;
          font-style: normal;
          font-weight: 850;
        }

        .model-step-wrap {
          display: grid;
          gap: 18px;
        }

        .model-step-note {
          width: min(100%, 980px);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-radius: 28px;
          border-color: rgba(215, 173, 71, 0.28);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.76),
            rgba(255, 248, 235, 0.84)
          );
          padding: 18px 20px;
        }

        .model-step-note strong {
          color: var(--vv-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: -0.04em;
        }

        .model-step-note span {
          max-width: 580px;
          font-size: 13px;
          line-height: 1.5;
          text-align: right;
        }

        .template-button {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 10px;
        }

        .template-thumb {
          min-height: 128px;
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          background-size: cover;
          background-position: center;
          box-shadow:
            inset 0 -58px 88px rgba(36, 20, 51, 0.2),
            0 14px 32px rgba(61, 42, 84, 0.1);
        }

        .template-thumb::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 42%,
            rgba(36, 20, 51, 0.22)
          );
        }

        .template-content {
          padding: 0 2px 4px;
        }

        .template-content > span:last-child {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: 6px;
          font-size: 12px;
          line-height: 1.42;
        }

        .template-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border-top: 1px solid rgba(215, 173, 71, 0.18);
          padding: 9px 10px 12px;
        }

        .template-footer div {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .template-footer a {
          flex: 0 0 auto;
          color: var(--vv-purple);
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .form-stack {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          gap: 14px;
        }

        .data-step {
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          align-items: start;
        }

        .data-step .suggestion-button {
          grid-column: 1 / -1;
        }

        .data-step .featured-field {
          grid-column: 1;
        }

        .data-step .date-field-block {
          grid-column: 2;
        }

        .data-step .location-field-block {
          grid-column: 1 / -1;
        }

        .site-step {
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          align-items: start;
        }

        .site-step .field-block.featured-field {
          grid-column: 1;
        }

        .site-step > .field-block:not(.featured-field) {
          grid-column: 2;
          grid-row: 1 / span 2;
        }

        .site-step .info-card {
          grid-column: 1;
        }

        .site-step textarea {
          min-height: 150px;
        }

        .field-grid.two {
          display: grid;
          gap: 14px;
        }

        .suggestion-button {
          min-height: 42px;
          justify-self: start;
          border: 1px solid rgba(93, 53, 161, 0.18);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          color: var(--vv-purple);
          box-shadow: 0 14px 34px rgba(61, 42, 84, 0.07);
          padding: 0 18px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.22s ease;
        }

        .suggestion-button:hover {
          transform: translateY(-1px);
          border-color: rgba(215, 173, 71, 0.44);
          background: #ffffff;
          box-shadow: 0 20px 44px rgba(61, 42, 84, 0.1);
        }

        .field-block {
          border-radius: 28px;
          padding: 20px;
        }

        .field-block.featured-field {
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(215, 173, 71, 0.12),
              transparent 36%
            ),
            rgba(255, 255, 255, 0.92);
          border-color: rgba(215, 173, 71, 0.38);
        }

        .location-field-block {
          grid-column: 1 / -1;
        }

        .field-block .location-coming-soon {
          margin: 10px 0 0;
          border: 1px solid rgba(215, 173, 71, 0.18);
          border-radius: 16px;
          background: rgba(255, 248, 235, 0.58);
          color: rgba(61, 42, 84, 0.62);
          padding: 9px 11px;
          font-size: 11px;
          font-weight: 850;
          line-height: 1.35;
        }

        .message-field-block {
          background:
            radial-gradient(circle at top right, rgba(93, 53, 161, 0.10), transparent 36%),
            rgba(255, 255, 255, 0.82);
        }

        .message-field-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .ai-message-button {
          flex: 0 0 auto;
          min-height: 42px;
          border: 1px solid rgba(215, 173, 71, 0.36);
          border-radius: 999px;
          background:
            radial-gradient(circle at 20% 0%, rgba(242, 212, 134, 0.42), transparent 30%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(245, 235, 255, 0.82));
          color: var(--vv-purple);
          box-shadow: 0 14px 32px rgba(61, 42, 84, 0.08);
          padding: 0 16px;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
          transition: 0.22s ease;
          white-space: nowrap;
        }

        .ai-message-button:hover {
          transform: translateY(-1px);
          border-color: rgba(215, 173, 71, 0.72);
          background: #ffffff;
          box-shadow: 0 20px 46px rgba(61, 42, 84, 0.12);
        }

        .message-ai-note {
          display: block;
          margin: -2px 0 12px;
          color: rgba(61, 42, 84, 0.56);
          font-size: 11px;
          font-weight: 800;
          line-height: 1.45;
        }

        .field-block label {
          display: block;
          color: var(--vv-ink);
          font-size: 14px;
          font-weight: 900;
        }

        .field-block p {
          margin: 6px 0 12px;
          font-size: 12.5px;
          line-height: 1.45;
        }

        .field-block input,
        .field-block textarea {
          width: 100%;
          min-height: 48px;
          border: 1px solid rgba(61, 42, 84, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
          color: var(--vv-ink);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
          outline: none;
          padding: 12px 14px;
          font-size: 14px;
          font-weight: 650;
          transition: 0.22s ease;
        }

        .field-block textarea {
          resize: none;
          line-height: 1.55;
        }

        .field-block input::placeholder,
        .field-block textarea::placeholder {
          color: rgba(36, 20, 51, 0.34);
        }

        .field-block input:focus,
        .field-block textarea:focus {
          border-color: rgba(215, 173, 71, 0.72);
          background: #ffffff;
          box-shadow:
            0 0 0 5px rgba(215, 173, 71, 0.1),
            0 18px 40px rgba(61, 42, 84, 0.08);
        }

        .slug-field {
          display: flex;
          align-items: center;
          overflow: hidden;
          min-height: 48px;
          border: 1px solid rgba(61, 42, 84, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
          transition: 0.22s ease;
        }

        .slug-field:focus-within {
          border-color: rgba(215, 173, 71, 0.72);
          box-shadow:
            0 0 0 5px rgba(215, 173, 71, 0.1),
            0 18px 40px rgba(61, 42, 84, 0.08);
        }

        .slug-field span {
          flex: 0 0 auto;
          padding-left: 15px;
          color: rgba(36, 20, 51, 0.44);
          font-size: 13px;
          font-weight: 850;
        }

        .slug-field input {
          min-width: 0;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }

        .info-card {
          border-radius: 28px;
          background:
            radial-gradient(
              circle at top right,
              rgba(215, 173, 71, 0.18),
              transparent 34%
            ),
            linear-gradient(
              135deg,
              rgba(255, 252, 245, 0.94),
              rgba(245, 235, 255, 0.64)
            );
          padding: 18px;
        }

        .info-card strong {
          color: var(--vv-ink);
          font-size: 14px;
          font-weight: 900;
        }

        .info-card p {
          margin: 6px 0 0;
          font-size: 12.5px;
          line-height: 1.48;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .review-card {
          border-radius: 26px;
          padding: 18px;
        }

        .review-card.large {
          border-color: rgba(215, 173, 71, 0.36);
          background: rgba(255, 255, 255, 0.88);
        }

        .review-card span {
          display: block;
          margin-bottom: 8px;
          color: rgba(184, 132, 25, 0.95);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .review-card strong {
          display: block;
          font-size: 20px;
          line-height: 1.16;
          word-break: break-word;
        }

        .review-card p {
          margin: 7px 0 0;
          font-size: 12.5px;
          line-height: 1.44;
        }

        .message-error {
          margin-top: 14px;
          border: 1px solid rgba(190, 18, 60, 0.2);
          border-radius: 20px;
          background: rgba(255, 241, 242, 0.92);
          color: #9f1239;
          box-shadow: 0 18px 40px rgba(159, 18, 57, 0.08);
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 850;
          line-height: 1.5;
        }

        .bottom-actions {
          position: relative;
          z-index: 80;
          width: min(calc(100% - 32px), 1480px);
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 12px auto 18px;
          padding: 14px clamp(18px, 3vw, 34px);
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 30px;
          background:
            linear-gradient(180deg, rgba(255, 250, 242, 0.78), rgba(255, 255, 255, 0.96)),
            radial-gradient(circle at 88% 10%, rgba(215, 173, 71, 0.18), transparent 32%);
          box-shadow: 0 24px 70px rgba(61, 42, 84, 0.1);
          backdrop-filter: blur(18px);
        }

        .action-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .secondary-button,
        .primary-button {
          min-height: 54px;
          border-radius: 999px;
          padding: 0 26px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.22s ease;
        }

        .secondary-button {
          border: 1px solid rgba(61, 42, 84, 0.13);
          background: rgba(255, 255, 255, 0.86);
          color: var(--vv-ink);
          box-shadow: 0 12px 28px rgba(61, 42, 84, 0.05);
        }

        .primary-button {
          border: 1px solid rgba(36, 20, 51, 0.88);
          background:
            radial-gradient(
              circle at 20% 0%,
              rgba(242, 212, 134, 0.32),
              transparent 28%
            ),
            linear-gradient(135deg, #5d35a1 0%, #241433 55%, #b88419 100%);
          color: #ffffff;
          box-shadow: 0 22px 50px rgba(61, 42, 84, 0.22);
        }

        .secondary-button:hover,
        .primary-button:hover {
          transform: translateY(-2px);
        }

        .primary-button:hover {
          box-shadow: 0 28px 64px rgba(61, 42, 84, 0.3);
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.48;
          cursor: not-allowed;
          transform: none;
        }

        .selected-template-note {
          min-height: 36px;
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(215, 173, 71, 0.2);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.64);
          color: rgba(36, 20, 51, 0.52);
          padding: 0 14px;
          font-size: 12px;
          font-weight: 900;
        }

        .suggestion-helper {
          grid-column: 1 / -1;
          margin: -8px 0 0 2px;
          color: rgba(36, 20, 51, 0.48);
          font-size: 12px;
          font-weight: 750;
        }

        .review-premium-shell {
          display: grid;
          grid-template-columns: minmax(320px, 0.82fr) minmax(0, 1.18fr);
          gap: 18px;
          align-items: stretch;
        }

        .review-preview-panel,
        .review-summary-panel {
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.76);
          box-shadow: var(--vv-shadow);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }

        .review-preview-panel {
          display: grid;
          grid-template-rows: minmax(280px, 1fr) auto;
        }

        .review-image {
          position: relative;
          min-height: 330px;
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }

        .review-image::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 18% 18%,
              rgba(242, 212, 134, 0.36),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              rgba(36, 20, 51, 0.06),
              rgba(36, 20, 51, 0.74)
            );
        }

        .review-overlay {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 22px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 28px;
          background: rgba(36, 20, 51, 0.42);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(14px);
          padding: 20px;
          color: #ffffff;
        }

        .review-overlay span,
        .review-template-bar span,
        .review-final-headline span {
          display: block;
          color: #f2d486;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .review-overlay h2 {
          margin: 8px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 3.2vw, 48px);
          line-height: 0.98;
          font-weight: 400;
          letter-spacing: -0.06em;
        }

        .review-overlay p {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          font-weight: 800;
        }

        .review-template-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 18px 20px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(215, 173, 71, 0.18),
              transparent 34%
            ),
            rgba(255, 255, 255, 0.84);
        }

        .review-template-bar strong {
          display: block;
          margin-top: 5px;
          color: var(--vv-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          line-height: 1.06;
          font-weight: 400;
          letter-spacing: -0.04em;
        }

        .review-template-bar em {
          flex: 0 0 auto;
          border-radius: 999px;
          background: rgba(93, 53, 161, 0.09);
          color: var(--vv-purple);
          padding: 8px 11px;
          font-size: 10px;
          font-style: normal;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .review-summary-panel {
          padding: 22px;
        }

        .review-final-headline {
          margin-bottom: 16px;
        }

        .review-final-headline h3 {
          max-width: 640px;
          margin: 8px 0 0;
          color: var(--vv-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(26px, 2.4vw, 38px);
          line-height: 1.02;
          font-weight: 400;
          letter-spacing: -0.05em;
        }

        .review-final-headline p {
          max-width: 680px;
          margin: 9px 0 0;
          color: var(--vv-muted);
          font-size: 13px;
          line-height: 1.48;
        }


        .review-feature-label {
          display: block;
          margin-top: 16px;
          color: rgba(184, 132, 25, 0.95);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .review-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .review-feature-list i {
          border: 1px solid rgba(215, 173, 71, 0.22);
          border-radius: 999px;
          background: rgba(255, 249, 239, 0.78);
          color: rgba(36, 20, 51, 0.66);
          padding: 8px 11px;
          font-size: 11px;
          font-style: normal;
          font-weight: 900;
        }



        .compact-fixed-head {
          flex: 0 0 auto;
          position: relative;
          z-index: 2;
          padding-bottom: 10px;
        }

        .compact-progress-row {
          display: grid;
          grid-template-columns: 330px minmax(0, 1fr);
          align-items: center;
          gap: 18px;
          margin-bottom: 10px;
        }

        .compact-progress-row .brand-logo-link {
          justify-self: start;
          width: 330px;
          min-height: 82px;
          align-items: center;
          justify-content: flex-start;
        }

        .compact-progress-row .brand-logo {
          width: auto;
          height: 78px;
          max-width: 330px;
          max-height: none;
          object-fit: contain;
          object-position: left center;
          transform: translateX(-4px) scale(1.08);
          transform-origin: left center;
        }

        .scroll-content-shell {
          min-height: 0;
          flex: 1 1 auto;
          position: relative;
          overflow: hidden;
        }

        .scroll-arrow {
          display: none;
          position: absolute;
          right: 3px;
          z-index: 12;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(215, 173, 71, 0.34);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          color: var(--vv-purple);
          box-shadow: 0 12px 28px rgba(61, 42, 84, 0.12);
          cursor: pointer;
          font-size: 15px;
          font-weight: 950;
          line-height: 1;
          transition: 0.2s ease;
        }

        .scroll-arrow:hover {
          transform: translateY(-1px);
          border-color: rgba(215, 173, 71, 0.72);
          background: #ffffff;
        }

        .scroll-arrow-up {
          top: 4px;
        }

        .scroll-arrow-down {
          bottom: 8px;
        }

        .scroll-rail {
          display: none;
        }

        .scroll-rail-line {
          display: block;
          position: relative;
        }

        .scroll-rail-thumb {
          display: none;
        }


        @media (min-width: 821px) {
          html,
          body {
            height: 100%;
            overflow: hidden;
          }

          .create-event-wizard {
            height: 100svh;
            min-height: 680px;
            overflow: hidden;
            padding-bottom: 0;
          }

          .form-side {
            height: 100svh;
            min-height: 680px;
            display: grid;
            grid-template-rows: minmax(0, 1fr) 86px;
            overflow: hidden;
          }

          .step-area {
            min-height: 0;
            overflow: hidden;
            padding: 12px clamp(18px, 3vw, 44px) 0;
          }

          .step-shell {
            height: 100%;
            min-height: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 16px 22px 14px;
          }

          .compact-fixed-head,
          .message-error {
            flex: 0 0 auto;
          }

          .progress-mini {
            width: min(100%, 620px);
            margin: 0 auto;
          }

          .progress-summary {
            margin-bottom: 8px;
          }

          .progress-dot {
            width: 16px;
            height: 16px;
          }

          .progress-dot.current {
            width: 25px;
            height: 25px;
            box-shadow:
              inset 0 1px 3px rgba(255, 255, 255, 0.32),
              0 0 0 5px rgba(215, 173, 71, 0.12),
              0 10px 22px rgba(36, 20, 51, 0.22);
          }

          .progress-line {
            min-width: 24px;
            margin: 0 8px;
          }

          .step-eyebrow {
            min-height: 24px;
            padding: 0 12px;
            font-size: 9px;
          }

          .step-title {
            max-width: 900px;
            margin-top: 7px;
            font-size: clamp(25px, 2.2vw, 38px);
            line-height: 1;
          }

          .step-title::after {
            width: 74px;
            margin-top: 10px;
          }

          .step-subtitle {
            max-width: 820px;
            margin-top: 8px;
            font-size: 13px;
            line-height: 1.4;
          }

          .scroll-arrow {
            display: grid;
            place-items: center;
          }

          .step-content {
            height: 100%;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            margin-top: 0;
            padding: 4px 42px 16px 2px;
            scrollbar-gutter: stable;
          }

          .step-content {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .step-content::-webkit-scrollbar {
            width: 0;
            height: 0;
          }

          .event-type-grid,
          .template-grid,
          .review-grid,
          .form-stack {
            padding-bottom: 4px;
          }

          .bottom-actions {
            align-self: end;
            min-height: 70px;
            margin-top: 8px;
            margin-bottom: 8px;
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }
        @media (min-width: 821px) {
          .form-side {
            grid-template-rows: minmax(0, 1fr) 72px;
          }

          .step-area {
            padding-top: 8px;
          }

          .step-shell {
            padding: 10px 18px 10px;
          }

          .compact-fixed-head {
            padding-bottom: 4px;
          }

          .compact-progress-row {
            grid-template-columns: 350px minmax(0, 1fr);
            gap: 14px;
            margin-bottom: 4px;
          }

          .compact-progress-row .brand-logo-link {
            width: 350px;
            min-height: 88px;
          }

          .compact-progress-row .brand-logo {
            width: auto;
            height: 84px;
            max-width: 350px;
            max-height: none;
            transform: translateX(-6px) scale(1.12);
            transform-origin: left center;
          }

          .progress-mini {
            width: min(100%, 560px);
          }

          .progress-summary {
            margin-bottom: 4px;
            font-size: 11px;
          }

          .progress-summary span,
          .progress-summary strong {
            min-height: 24px;
            padding: 0 10px;
            box-shadow: none;
          }

          .progress-dot {
            width: 13px;
            height: 13px;
          }

          .progress-dot::after {
            top: 3px;
            left: 4px;
            width: 4px;
            height: 4px;
          }

          .progress-dot.current {
            width: 22px;
            height: 22px;
            box-shadow:
              inset 0 1px 3px rgba(255, 255, 255, 0.32),
              0 0 0 4px rgba(215, 173, 71, 0.11),
              0 8px 18px rgba(36, 20, 51, 0.2);
          }

          .progress-dot.current::after {
            top: 5px;
            left: 6px;
            width: 5px;
            height: 5px;
          }

          .progress-line {
            height: 2px;
            min-width: 22px;
            margin: 0 7px;
          }

          .step-eyebrow {
            min-height: 22px;
            padding: 0 11px;
            font-size: 8px;
          }

          .step-title {
            max-width: 860px;
            margin-top: 5px;
            font-size: clamp(22px, 1.72vw, 30px);
            line-height: 1.04;
          }

          .step-title::after {
            width: 54px;
            height: 1px;
            margin-top: 6px;
          }

          .step-subtitle {
            max-width: 780px;
            margin-top: 5px;
            font-size: 11.5px;
            line-height: 1.32;
          }

          .scroll-content-shell {
            padding-right: 46px;
          }

          .step-content {
            padding: 6px 10px 12px 2px;
          }

          .scroll-rail {
            position: absolute;
            top: 14px;
            right: 10px;
            bottom: 18px;
            z-index: 12;
            width: 34px;
            display: grid;
            grid-template-rows: 34px minmax(56px, 1fr) 34px;
            align-items: center;
            justify-items: center;
            border: 1px solid rgba(36, 20, 51, 0.08);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.72);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.92),
              0 14px 36px rgba(61, 42, 84, 0.10);
            backdrop-filter: blur(16px);
            overflow: hidden;
          }

          .scroll-arrow {
            position: relative;
            width: 28px;
            height: 28px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(36, 20, 51, 0.07);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.88);
            color: rgba(36, 20, 51, 0.68);
            box-shadow:
              0 6px 18px rgba(61, 42, 84, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.96);
            cursor: pointer;
            transition:
              background 0.18s ease,
              color 0.18s ease,
              transform 0.18s ease,
              box-shadow 0.18s ease;
          }

          .scroll-arrow:hover {
            transform: translateY(-1px);
            border-color: rgba(93, 53, 161, 0.16);
            background: #ffffff;
            color: #241433;
            box-shadow:
              0 10px 24px rgba(61, 42, 84, 0.13),
              inset 0 1px 0 rgba(255, 255, 255, 0.98);
          }

          .scroll-arrow:active {
            transform: translateY(0) scale(0.96);
          }

          .scroll-arrow-svg {
            width: 17px;
            height: 17px;
            display: block;
            stroke: currentColor;
          }

          .scroll-rail-line {
            position: relative;
            width: 100%;
            height: calc(100% - 2px);
            display: block;
            border: 0;
            border-radius: 999px;
            background: transparent;
            cursor: grab;
            touch-action: none;
            padding: 0;
          }

          .scroll-rail-line:active {
            cursor: grabbing;
          }

          .scroll-rail-line::before {
            content: "";
            position: absolute;
            inset: 5px 15px;
            border-radius: 999px;
            background: rgba(36, 20, 51, 0.10);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.44),
              inset 0 8px 16px rgba(255, 255, 255, 0.42);
          }

          .scroll-rail-line::after {
            content: "";
            position: absolute;
            top: 5px;
            left: 15px;
            right: 15px;
            bottom: 5px;
            border-radius: 999px;
            background: linear-gradient(180deg, rgba(215, 173, 71, 0.80), rgba(93, 53, 161, 0.62));
            box-shadow: 0 0 12px rgba(215, 173, 71, 0.18);
            transform: scaleY(var(--scroll-progress, 0));
            transform-origin: top center;
          }

          .scroll-rail-thumb {
            display: block;
            position: absolute;
            left: 50%;
            top: var(--scroll-thumb-top, 12px);
            width: 18px;
            height: 18px;
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 999px;
            background:
              radial-gradient(circle at 35% 28%, rgba(255, 255, 255, 0.96) 0 14%, transparent 15% 100%),
              linear-gradient(135deg, #d7ad47 0%, #5d35a1 100%);
            box-shadow:
              0 8px 18px rgba(61, 42, 84, 0.18),
              0 0 0 4px rgba(255, 255, 255, 0.42);
            transform: translate(-50%, -50%);
            transition: top 0.18s ease-out;
            pointer-events: none;
          }

          .bottom-actions {
            min-height: 72px;
            padding-top: 9px;
            padding-bottom: calc(9px + env(safe-area-inset-bottom));
          }

          .secondary-button,
          .primary-button {
            min-height: 46px;
            padding: 0 22px;
          }

          .event-type-button {
            min-height: 132px;
            padding: 12px;
            grid-template-columns: 46px minmax(0, 1fr);
            gap: 12px;
          }

          .event-type-icon {
            width: 46px;
            height: 46px;
            border-radius: 18px;
            font-size: 20px;
          }

          .event-type-content strong {
            font-size: 18px;
          }

          .event-type-content > span:not(.template-topline):not(.event-type-features) {
            -webkit-line-clamp: 2;
            font-size: 11.5px;
            line-height: 1.34;
          }

          .event-type-features {
            padding-top: 8px;
          }
        }



        @media (max-width: 1240px) and (min-width: 821px) {
          .compact-progress-row {
            grid-template-columns: 285px minmax(0, 1fr);
          }

          .compact-progress-row .brand-logo-link {
            width: 285px;
            min-height: 76px;
          }

          .compact-progress-row .brand-logo {
            height: 72px;
            max-width: 285px;
            transform: translateX(-5px) scale(1.08);
          }
        }

        @media (max-width: 1180px) and (min-width: 821px) {
          .event-type-grid,
          .template-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .create-event-wizard {
            padding-bottom: 24px;
          }


          .brand-logo {
            width: min(230px, 72vw);
            max-height: none;
          }


          .compact-progress-row {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 10px;
            margin-bottom: 14px;
          }

          .compact-progress-row .brand-logo {
            width: auto;
            height: min(72px, 17vw);
            max-width: min(270px, 76vw);
            max-height: none;
            object-fit: contain;
          }

          .scroll-content-shell {
            overflow: visible;
          }

          .scroll-arrow {
            display: none;
          }

          .step-content {
            overflow: visible;
            margin-top: 22px;
            padding: 0;
          }

          .step-area {
            padding-left: 14px;
            padding-right: 14px;
          }

          .step-shell {
            border-radius: 32px;
            padding: 22px;
          }

          .step-title {
            font-size: clamp(31px, 9vw, 44px);
          }

          .step-subtitle {
            font-size: 14px;
          }

          .event-type-grid,
          .template-grid,
          .review-grid,
          .data-step,
          .site-step,
          .field-grid.two {
            grid-template-columns: 1fr;
          }

          .data-step .suggestion-button,
          .data-step .featured-field,
          .data-step .date-field-block,
          .data-step .location-field-block,
          .site-step .field-block.featured-field,
          .site-step > .field-block:not(.featured-field),
          .site-step .info-card {
            grid-column: auto;
            grid-row: auto;
          }

          .event-type-button {
            min-height: 146px;
          }

          .template-button {
            grid-template-columns: 112px minmax(0, 1fr);
          }

          .template-thumb {
            min-height: 124px;
          }

          .field-block {
            padding: 18px;
          }

          .bottom-actions {
            width: calc(100% - 28px);
            min-height: auto;
            display: grid;
            grid-template-columns: 1fr;
            align-items: stretch;
            gap: 10px;
            margin: 0 auto 18px;
            padding: 12px 18px calc(14px + env(safe-area-inset-bottom));
          }

          .action-right {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .secondary-button,
          .primary-button {
            width: 100%;
          }

          .selected-template-note {
            justify-content: center;
          }

          .suggestion-helper {
            text-align: center;
          }

          .message-field-head {
            display: grid;
            gap: 10px;
          }

          .ai-message-button {
            width: 100%;
          }


          .review-premium-shell {
            grid-template-columns: 1fr;
          }

          .review-preview-panel {
            grid-template-rows: minmax(260px, auto) auto;
          }

          .review-image {
            min-height: 300px;
          }

          .review-overlay {
            left: 14px;
            right: 14px;
            bottom: 14px;
            padding: 14px;
          }

          .review-overlay h2 {
            font-size: clamp(24px, 7vw, 34px);
          }
        }

        @media (max-width: 560px) {
          .create-event-wizard {
            padding-bottom: 24px;
          }

          .progress-summary {
            gap: 10px;
          }

          .progress-summary span,
          .progress-summary strong {
            min-height: 32px;
            padding: 0 10px;
            font-size: 12px;
          }

          .progress-line {
            min-width: 12px;
            margin: 0 5px;
          }

          .progress-dot {
            width: 18px;
            height: 18px;
          }

          .progress-dot.current {
            width: 28px;
            height: 28px;
          }

          .template-button {
            grid-template-columns: 1fr;
          }

          .template-thumb {
            min-height: 155px;
          }

          .event-type-button {
            grid-template-columns: 54px minmax(0, 1fr);
          }

          .slug-field {
            display: block;
            padding-top: 12px;
          }

          .slug-field span {
            display: block;
            padding: 0 14px 4px;
          }
        }
      `}</style>

      <form className="form-side" onSubmit={handleSubmit}>
        <section className="step-area">
          <div className="step-shell">
            <div className="compact-fixed-head">
              <div className="compact-progress-row">
                <VivaListaLogo />

                <div className="progress-mini" aria-label="Progresso da criação">
                  <div className="progress-summary">
                    <span>
                      Passo {safeVisibleStepIndex + 1} de {visibleSteps.length}
                    </span>
                    <strong>{Math.round(progressPercent)}%</strong>
                  </div>

                  <ol className="progress-dots" aria-label="Progresso da criação">
                    {visibleSteps.map((item, index) => {
                      const actualIndex = index + firstStepIndex;
                      const isDone = actualIndex < currentStep;
                      const isCurrent = actualIndex === currentStep;

                      return (
                        <li className="progress-item" key={item.key}>
                          <span
                            className={`progress-dot ${isDone ? "done" : ""} ${
                              isCurrent ? "current" : ""
                            }`}
                            role="img"
                            aria-label={
                              isDone
                                ? `Etapa ${index + 1} concluída`
                                : isCurrent
                                  ? `Etapa ${index + 1} atual`
                                  : `Etapa ${index + 1}`
                            }
                          />

                          {index < visibleSteps.length - 1 ? (
                            <span
                              className={`progress-line ${actualIndex < currentStep ? "done" : ""}`}
                            />
                          ) : null}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              <span className="step-eyebrow">{stepEyebrow}</span>
              <h1 className="step-title">{step.title}</h1>
              <p className="step-subtitle">{step.subtitle}</p>
            </div>

            <div className="scroll-content-shell">
              <div
                className="step-content"
                ref={contentScrollRef}
                onScroll={updateScrollProgress}
              >
                {renderStepContent()}
              </div>

              <div className="scroll-rail" role="presentation">
                <button
                  type="button"
                  className="scroll-arrow"
                  onClick={() => scrollStepContent("up")}
                  aria-label="Rolar para cima"
                >
                  <svg className="scroll-arrow-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M7 14.5L12 9.5L17 14.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.4"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  ref={scrollRailLineRef}
                  className="scroll-rail-line"
                  onPointerDown={handleScrollRailPointerDown}
                  onPointerMove={handleScrollRailPointerMove}
                  onPointerUp={handleScrollRailPointerUp}
                  onPointerCancel={handleScrollRailPointerUp}
                  aria-label="Arrastar rolagem"
                >
                  <span className="scroll-rail-thumb" />
                </button>

                <button
                  type="button"
                  className="scroll-arrow"
                  onClick={() => scrollStepContent("down")}
                  aria-label="Rolar para baixo"
                >
                  <svg className="scroll-arrow-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M7 9.5L12 14.5L17 9.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {errorMessage ? (
              <div className="message-error">{errorMessage}</div>
            ) : null}
          </div>
        </section>

        <footer className="bottom-actions">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === firstStepIndex || loading}
            className="secondary-button"
          >
            Voltar
          </button>

          <div className="action-right">
            {currentStep === 0 ? (
              <span className="selected-template-note">
                Tipo {selectedCategoryIndex + 1} de {EVENT_CATEGORIES.length}
              </span>
            ) : null}

            {currentStep === 1 ? (
              <span className="selected-template-note">
                Modelo {selectedTemplateIndex + 1} de {filteredTemplates.length}
              </span>
            ) : null}

            {currentStep < WIZARD_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={loading}
                className="primary-button"
              >
                Continuar →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="primary-button"
              >
                {loading ? "Criando..." : "Criar evento e ir para o visual"}
              </button>
            )}
          </div>
        </footer>
      </form>
    </main>
  );
}

function NovoEventoLoading() {
  return (
    <main className="create-event-loading">
      <style jsx global>{`
        .create-event-loading {
          min-height: 100svh;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at 12% 8%,
              rgba(93, 53, 161, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 88% 10%,
              rgba(215, 173, 71, 0.22),
              transparent 28%
            ),
            linear-gradient(135deg, #fffaf2 0%, #f7efe6 100%);
          color: #241433;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .create-event-loading-card {
          display: grid;
          justify-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.74);
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.78);
          padding: 36px;
          box-shadow: 0 28px 90px rgba(61, 42, 84, 0.12);
          backdrop-filter: blur(18px);
        }

        .create-event-loading-card img {
          width: 240px;
          height: auto;
          filter: drop-shadow(0 14px 24px rgba(61, 42, 84, 0.1));
        }

        .create-event-loading-card p {
          margin: 0;
          color: rgba(36, 20, 51, 0.64);
          font-size: 14px;
          font-weight: 850;
        }
      `}</style>

      <div className="create-event-loading-card">
        <img src="/logo-vivalista.png" alt="VivaLista" />
        <p>Carregando criador do evento...</p>
      </div>
    </main>
  );
}

export default function NovoEventoPage() {
  return (
    <Suspense fallback={<NovoEventoLoading />}>
      <NovoEventoPageContent />
    </Suspense>
  );
}
