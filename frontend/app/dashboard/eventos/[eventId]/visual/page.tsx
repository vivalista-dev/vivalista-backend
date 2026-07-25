"use client";

import Link from "next/link";
import { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VisualBuilderStyles } from "./components/VisualBuilderStyles";
import { VisualStepContent } from "./components/VisualStepContent";
import { VivaListaLogo } from "./components/VivaListaLogo";
import { FullSitePreview } from "./components/preview/FullSitePreview";

/* VERSAO_VISUAL_BUILDER_PREMIUM_V5_ETAPA4_5K_AJUSTES_CAPA_FOTO_COR */

type EventData = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  capacity?: number | null;
  status?: string | null;
  coverImage?: string | null;
  heroImageUrl?: string | null;
};

type VisualSettings = {
  publicTitle?: string | null;
  publicSubtitle?: string | null;
  heroImageUrl?: string | null;
  welcomeMessage?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  fontStyle?: string | null;
  heroLayout?: string | null;
  showCountdown?: boolean | null;
  showStory?: boolean | null;
  showGallery?: boolean | null;
  showLocation?: boolean | null;
  showGifts?: boolean | null;
  showRsvp?: boolean | null;
};

type VisualResponse = {
  visual?: VisualSettings | null;
  message?: string;
};

type VisualFormData = {
  publicTitle: string;
  publicSubtitle: string;
  heroImageUrl: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
  fontStyle: string;
  titleSize: string;
  titleScale: number;
  detailScale: number;
  textDensity: string;
  textFrameStyle: string;
  siteAtmosphere: string;
  heroLayout: string;
  showCountdown: boolean;
  showStory: boolean;
  showGallery: boolean;
  showLocation: boolean;
  showGifts: boolean;
  showRsvp: boolean;
};

type PhotoSettings = {
  fit: "cover" | "contain";
  zoom: number;
  x: number;
  y: number;
};

type TextSettings = {
  align: "left" | "center" | "right";
  placement: "top" | "middle" | "bottom";
};

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type ToggleKey =
  | "showCountdown"
  | "showStory"
  | "showGallery"
  | "showLocation"
  | "showGifts"
  | "showRsvp";

type StepKey =
  | "imagem"
  | "capa"
  | "estilo"
  | "cores"
  | "tipografia"
  | "secoes"
  | "revisao";

type StepConfig = {
  key: StepKey;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
};

type StyleIconType = "classic" | "romantic" | "minimal" | "rustic" | "modern" | "boho";

type VisualStyleOption = {
  value: string;
  label: string;
  description: string;
  icon: StyleIconType;
  primaryColor: string;
  secondaryColor: string;
  suggestedLayout: string;
  suggestedFont: string;
};

type TypographyOption = {
  value: string;
  label: string;
  category: "sugeridas" | "classicas" | "modernas" | "elegantes" | "manuscritas" | "divertidas";
  sample: string;
  description: string;
};


const steps: StepConfig[] = [
  {
    key: "estilo",
    eyebrow: "Atmosfera do site",
    title: "Escolha a atmosfera do site",
    subtitle:
      "Primeiro defina o clima geral: branco clean, luxo, jardim, infantil, festa, corporativo ou outro estilo do site inteiro.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=90",
  },
  {
    key: "capa",
    eyebrow: "Modelo de capa",
    title: "Escolha o modelo de capa",
    subtitle:
      "Agora escolha a estrutura da primeira tela: foto grande, meio a meio, editorial, convite luxo, black tie, neon ou minimal.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90",
  },
  {
    key: "tipografia",
    eyebrow: "Letras e posição",
    title: "Escolha as letras e a posição do texto",
    subtitle:
      "Defina fonte, tamanho, alinhamento e posição inicial do texto. A caixa de leitura fica junto das cores no último ajuste visual.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1800&q=90",
  },
  {
    key: "imagem",
    eyebrow: "Foto da capa",
    title: "Escolha e ajuste a foto",
    subtitle: "Adicione a foto principal e ajuste zoom, corte e posição olhando a prévia da esquerda.",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=90",
  },
  {
    key: "cores",
    eyebrow: "Cores e leitura",
    title: "Defina as cores e a caixa de leitura",
    subtitle:
      "A paleta colore o site inteiro. Aqui você também pode inverter as cores e escolher se o texto precisa de caixa de leitura.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=90",
  },
  {
    key: "secoes",
    eyebrow: "Seções do site",
    title: "Escolha as áreas que vão aparecer",
    subtitle:
      "Ative somente o que faz sentido. A prévia da esquerda mostra a estrutura do site quase pronto.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=90",
  },
  {
    key: "revisao",
    eyebrow: "Revisão final",
    title: "Revise seu site antes de avançar",
    subtitle:
      "Confira atmosfera, capa, letras, foto, cores, caixa de leitura e seções. Depois você segue para montar o site com mais detalhes.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90",
  },
];

const visualStyleOptions: VisualStyleOption[] = [
  {
    value: "cristal-prata-pro",
    label: "Prata cristal pro",
    description: "Protótipo 1: cristal, prata, brilho, moldura nobre e cards tipo vidro lapidado.",
    icon: "classic",
    primaryColor: "#3f4650",
    secondaryColor: "#dfe4ec",
    suggestedLayout: "convite-luxo",
    suggestedFont: "empire-serif",
  },
  {
    value: "papel-rasgado-pro",
    label: "Papel rasgado pro",
    description: "Protótipo 2: papel claro rasgado, faixa escura premium e números protegidos.",
    icon: "modern",
    primaryColor: "#161514",
    secondaryColor: "#d8c8a4",
    suggestedLayout: "minimal-luxo",
    suggestedFont: "editorial-classic",
  },
  {
    value: "neon-futurista-pro",
    label: "Neon futurista pro",
    description: "Protótipo 3: painel tecnológico com neon azul e roxo, forte para corporativo/festa.",
    icon: "modern",
    primaryColor: "#070d20",
    secondaryColor: "#18d9ff",
    suggestedLayout: "corporativo-neon",
    suggestedFont: "studio-modern",
  },
  {
    value: "roxo-luxo",
    label: "Roxo luxo",
    description: "Fundo roxo profundo, textura fina e proteção automática para leitura.",
    icon: "classic",
    primaryColor: "#2a1234",
    secondaryColor: "#d3af67",
    suggestedLayout: "esquerda-esfumada",
    suggestedFont: "editorial-classic",
  },
  {
    value: "clean-luxo",
    label: "Champagne clean",
    description: "Base clara, sofisticada, com brilho champagne e cards elegantes.",
    icon: "minimal",
    primaryColor: "#43263f",
    secondaryColor: "#c4a262",
    suggestedLayout: "centralizado",
    suggestedFont: "editorial-classic",
  },
  {
    value: "offwhite-3d",
    label: "Off-white 3D",
    description: "Parede clara com volumes discretos, adulta e premium.",
    icon: "minimal",
    primaryColor: "#34303a",
    secondaryColor: "#c8b07b",
    suggestedLayout: "minimal-luxo",
    suggestedFont: "poise-serif",
  },
  {
    value: "art-deco-dourado",
    label: "Art déco dourado",
    description: "Linhas geométricas finas, cara de salão nobre e convite premium.",
    icon: "classic",
    primaryColor: "#3b2538",
    secondaryColor: "#caa45d",
    suggestedLayout: "convite-luxo",
    suggestedFont: "empire-serif",
  },
  {
    value: "seda-champagne",
    label: "Seda champagne",
    description: "Textura suave de tecido, clássica, limpa e confortável.",
    icon: "classic",
    primaryColor: "#5a4039",
    secondaryColor: "#d8c1a5",
    suggestedLayout: "editorial-cartao",
    suggestedFont: "chandelier",
  },
  {
    value: "marmore-noite",
    label: "Mármore noite",
    description: "Mármore escuro com veios dourados, forte e elegante.",
    icon: "classic",
    primaryColor: "#101018",
    secondaryColor: "#d4af37",
    suggestedLayout: "black-tie",
    suggestedFont: "empire-serif",
  },
  {
    value: "preto-ouro",
    label: "Preto ouro premium",
    description: "Fundo escuro acetinado, brilho dourado e leitura protegida.",
    icon: "modern",
    primaryColor: "#211826",
    secondaryColor: "#c7a15d",
    suggestedLayout: "cinematografica",
    suggestedFont: "studio-modern",
  },
  {
    value: "folhagem-fina",
    label: "Jardim orgânico",
    description: "Papel de parede botânico fino, com folhas elegantes e fundo respirando.",
    icon: "rustic",
    primaryColor: "#3f4f45",
    secondaryColor: "#c8ad75",
    suggestedLayout: "foto-moldura",
    suggestedFont: "poise-serif",
  },
  {
    value: "floral-noturno",
    label: "Jardim editorial",
    description: "Floral adulto, escuro e sofisticado, sem faixa rasgada infantil.",
    icon: "romantic",
    primaryColor: "#2a1428",
    secondaryColor: "#d493a3",
    suggestedLayout: "oval",
    suggestedFont: "serenata-script",
  },
  {
    value: "azul-corporativo",
    label: "Azul corporativo",
    description: "Grid escuro, brilho azul e estrutura profissional moderna.",
    icon: "modern",
    primaryColor: "#071424",
    secondaryColor: "#12d7ff",
    suggestedLayout: "corporativo-neon",
    suggestedFont: "studio-modern",
  },
  {
    value: "festa-glow-premium",
    label: "Festa glow premium",
    description: "Energia de festa com brilho controlado, sem cara infantil.",
    icon: "modern",
    primaryColor: "#351a4f",
    secondaryColor: "#ffb347",
    suggestedLayout: "festa-palco",
    suggestedFont: "studio-modern",
  },
  {
    value: "pattern-fino",
    label: "Geométrico fino",
    description: "Padrão geométrico adulto, bom para eventos elegantes e modernos.",
    icon: "boho",
    primaryColor: "#43263f",
    secondaryColor: "#c4a262",
    suggestedLayout: "minimal-luxo",
    suggestedFont: "serenata-script",
  },
  {
    value: "casamento-damasco",
    label: "Casamento damasco",
    description: "Papel de parede clássico de casamento, com desenho fino e fundo claro.",
    icon: "classic",
    primaryColor: "#4f3343",
    secondaryColor: "#c9a46c",
    suggestedLayout: "convite-luxo",
    suggestedFont: "editorial-classic",
  },
  {
    value: "debutante-cristal",
    label: "Debutante cristal",
    description: "Brilho lilás e rosa sofisticado para 15 anos, sem parecer infantil.",
    icon: "modern",
    primaryColor: "#3a194f",
    secondaryColor: "#e0a7c8",
    suggestedLayout: "circular",
    suggestedFont: "chandelier",
  },
  {
    value: "infantil-aquarela-premium",
    label: "Infantil aquarela",
    description: "Fundo infantil delicado, limpo e premium para bebê e aniversário infantil.",
    icon: "romantic",
    primaryColor: "#36556b",
    secondaryColor: "#f2b6a0",
    suggestedLayout: "oval",
    suggestedFont: "honey",
  },
  {
    value: "prata-cerimonial",
    label: "Prata cerimonial",
    description: "Prateado elegante, brilho de salão e efeito metal fosco para casamento sofisticado.",
    icon: "classic",
    primaryColor: "#3f4650",
    secondaryColor: "#cfd4dc",
    suggestedLayout: "convite-luxo",
    suggestedFont: "empire-serif",
  },
  {
    value: "cinza-perola",
    label: "Cinza pérola",
    description: "Cinza claro premium, discreto e adulto, com textura pérola e leitura limpa.",
    icon: "minimal",
    primaryColor: "#4b4f55",
    secondaryColor: "#d8d3c8",
    suggestedLayout: "minimal-luxo",
    suggestedFont: "poise-serif",
  },
  {
    value: "amarelo-dourado",
    label: "Amarelo dourado",
    description: "Amarelo elegante com dourado suave, alegre sem perder o visual premium.",
    icon: "modern",
    primaryColor: "#5b4521",
    secondaryColor: "#f4c84a",
    suggestedLayout: "faixa-convite",
    suggestedFont: "chandelier",
  },
  {
    value: "verde-bambu-casamento",
    label: "Verde bambu casamento",
    description: "Verde natural, bambu fino e clima de casamento ao ar livre com sofisticação.",
    icon: "rustic",
    primaryColor: "#314f3d",
    secondaryColor: "#c7b06a",
    suggestedLayout: "foto-moldura",
    suggestedFont: "editorial-classic",
  },
  {
    value: "doodle-whatsapp-premium",
    label: "Doodle premium",
    description: "Papel com vários desenhos pequenos no estilo conversa, divertido e ainda adulto.",
    icon: "boho",
    primaryColor: "#394458",
    secondaryColor: "#d8b66a",
    suggestedLayout: "meio-a-meio",
    suggestedFont: "viva-sans",
  },
];

const typographyCategories: Array<{ key: TypographyOption["category"]; label: string }> = [
  { key: "sugeridas", label: "Sugeridas" },
  { key: "classicas", label: "Clássicas" },
  { key: "modernas", label: "Modernas" },
  { key: "elegantes", label: "Elegantes" },
  { key: "manuscritas", label: "Handwritten" },
  { key: "divertidas", label: "Fun" },
];

const typographyOptions: TypographyOption[] = [
  { value: "serenata-script", label: "Serenata", category: "sugeridas", sample: "André & Andressa", description: "Assinatura romântica e premium." },
  { value: "editorial-classic", label: "Editorial Classic", category: "sugeridas", sample: "Editorial Classic", description: "Serif elegante para casamento e eventos premium." },
  { value: "viva-sans", label: "Viva Sans", category: "sugeridas", sample: "Viva Sans", description: "Limpa, moderna e fácil de ler." },
  { value: "poise-serif", label: "Poise", category: "sugeridas", sample: "Poise", description: "Sofisticada, com ar de convite impresso." },
  { value: "empire-serif", label: "Empire", category: "classicas", sample: "Empire", description: "Clássica, forte e refinada." },
  { value: "roman-elegance", label: "Roman Elegance", category: "classicas", sample: "Roman Elegance", description: "Tradicional e cerimonial." },
  { value: "classical", label: "Classical", category: "classicas", sample: "Classical", description: "Leitura nobre e atemporal." },
  { value: "beaumont", label: "Beaumont", category: "classicas", sample: "Beaumont", description: "Serif delicada para títulos." },
  { value: "studio-modern", label: "Studio Modern", category: "modernas", sample: "Studio Modern", description: "Editorial, limpa e urbana." },
  { value: "urban-clean", label: "Urban Clean", category: "modernas", sample: "Urban Clean", description: "Minimalista e objetiva." },
  { value: "contour", label: "Contour", category: "modernas", sample: "Contour", description: "Alta presença visual." },
  { value: "typewriter", label: "Typewriter", category: "modernas", sample: "Typewriter", description: "Charmosa, editorial e diferente." },
  { value: "champagne-script", label: "Champagne", category: "elegantes", sample: "Champagne", description: "Cursiva fina para eventos sofisticados." },
  { value: "chandelier", label: "Chandelier", category: "elegantes", sample: "Chandelier", description: "Elegante, leve e memorável." },
  { value: "wellington", label: "Wellington", category: "elegantes", sample: "Wellington", description: "Assinatura luxuosa e delicada." },
  { value: "sacramento", label: "Sacramento", category: "elegantes", sample: "Sacramento", description: "Romântica e refinada." },
  { value: "love-note", label: "Love Note", category: "manuscritas", sample: "Love Note", description: "Parece escrita à mão, com toque pessoal." },
  { value: "soft-signature", label: "Soft Signature", category: "manuscritas", sample: "Soft Signature", description: "Assinatura moderna e suave." },
  { value: "sunkissed", label: "Sunkissed", category: "manuscritas", sample: "Sunkissed", description: "Leve, solar e espontânea." },
  { value: "beautiful-script", label: "Beautiful", category: "manuscritas", sample: "Beautiful", description: "Romântica sem pesar." },
  { value: "honey", label: "Honey", category: "divertidas", sample: "Honey", description: "Doce, jovem e alegre." },
  { value: "bubble", label: "Bubble", category: "divertidas", sample: "Bubble", description: "Boa para aniversário e infantil." },
  { value: "peace-love", label: "Peace & Love", category: "divertidas", sample: "Peace & Love", description: "Boho, livre e descontraída." },
  { value: "papercute", label: "Papercute", category: "divertidas", sample: "Papercute", description: "Criativa para festas temáticas." },
];

const titleSizeOptions = [
  { value: "delicado", label: "Delicado" },
  { value: "medio", label: "Médio" },
  { value: "grande", label: "Grande" },
  { value: "impactante", label: "Impactante" },
];

const textDensityOptions = [
  { value: "compacto", label: "Compacto" },
  { value: "padrao", label: "Padrão" },
  { value: "confortavel", label: "Confortável" },
];

const colorOptions = [
  { name: "VivaLista", primary: "#43263f", secondary: "#c4a262" },
  { name: "Champagne", primary: "#5a4039", secondary: "#d8c1a5" },
  { name: "Oliva", primary: "#3f4f45", secondary: "#c8ad75" },
  { name: "Rosé", primary: "#7f4f5d", secondary: "#d9a6a9" },
  { name: "Rosa e dourado", primary: "#d88fa3", secondary: "#e6c76b" },
  { name: "Noite", primary: "#211826", secondary: "#c7a15d" },
  { name: "Areia", primary: "#7a6656", secondary: "#d6c4ae" },
  { name: "Azul noite", primary: "#132238", secondary: "#8cb7d5" },
  { name: "Terracota", primary: "#6f3f32", secondary: "#d89c72" },
  { name: "Prata luxo", primary: "#3f4650", secondary: "#cfd4dc" },
  { name: "Cinza pérola", primary: "#4b4f55", secondary: "#d8d3c8" },
  { name: "Amarelo solar", primary: "#5b4521", secondary: "#f4c84a" },
  { name: "Verde bambu", primary: "#314f3d", secondary: "#c7b06a" },
];

const heroLayoutOptions = [
  {
    value: "centralizado",
    title: "Editorial central",
    description: "Imagem grande com cartão elegante sobre a foto.",
  },
  {
    value: "tela-cheia",
    title: "Tela cheia",
    description: "Capa dominante, com impacto visual forte.",
  },
  {
    value: "esquerda-esfumada",
    title: "Foto esfumaçada",
    description: "Texto à esquerda, foto à direita e gradiente que mistura fundo e imagem.",
  },
  {
    value: "meio-a-meio",
    title: "Meio a meio clean",
    description: "Imagem de um lado e texto do outro, estilo premium moderno.",
  },
  {
    value: "split-curvo",
    title: "Divisão curva",
    description: "Foto lateral com recorte arredondado e texto em área limpa.",
  },
  {
    value: "minimal-luxo",
    title: "Minimal luxo",
    description: "Muito respiro, foto grande e texto editorial sem caixa pesada.",
  },
  {
    value: "black-tie",
    title: "Black tie",
    description: "Escuro, elegante, com foto dramática e letras de alto impacto.",
  },
  {
    value: "corporativo-neon",
    title: "Corporativo neon",
    description: "Foto lateral, fundo escuro e brilho azul para eventos profissionais.",
  },
  {
    value: "festa-palco",
    title: "Festa palco",
    description: "Capa vibrante com luz, cor e sensação de celebração.",
  },
  {
    value: "cinematografica",
    title: "Cinematográfica",
    description: "Foto escura, texto delicado e sensação de filme.",
  },
  {
    value: "circular",
    title: "Foto circular",
    description: "Foto em círculo separada do texto, boa para casal, bebê ou aniversariante.",
  },
  {
    value: "oval",
    title: "Foto oval",
    description: "Delicado e sofisticado, estilo convite premium.",
  },
  {
    value: "foto-moldura",
    title: "Moldura editorial",
    description: "Foto em destaque com moldura e respiro elegante.",
  },
  {
    value: "poster-editorial",
    title: "Poster editorial",
    description: "Foto vertical com texto como capa de revista premium.",
  },
  {
    value: "editorial-cartao",
    title: "Cartão sobreposto",
    description: "Um cartão refinado sobre a imagem principal.",
  },
  {
    value: "faixa-convite",
    title: "Faixa convite",
    description: "Foto em faixa superior e texto abaixo, como convite impresso moderno.",
  },
  {
    value: "monograma-clean",
    title: "Monograma clean",
    description: "Modelo tipográfico: a foto vira detalhe suave e o nome ganha protagonismo.",
  },
  {
    value: "convite-luxo",
    title: "Convite luxuoso",
    description: "Abertura com cara de convite impresso premium.",
  },
];

const visualSections: Array<{
  key: ToggleKey;
  title: string;
}> = [
  { key: "showCountdown", title: "Contagem regressiva" },
  { key: "showStory", title: "História / mensagem" },
  { key: "showGallery", title: "Galeria de fotos" },
  { key: "showLocation", title: "Localização" },
  { key: "showGifts", title: "Lista de presentes" },
  { key: "showRsvp", title: "Confirmação de presença" },
];

function getBackendUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3001";

  return value.replace(/\/+$/, "");
}

let cachedAuthToken: string | null | undefined = undefined;

function invalidateAuthCache() {
  cachedAuthToken = undefined;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  if (cachedAuthToken !== undefined) {
    return cachedAuthToken;
  }

  const possibleKeys = [
    "token",
    "accessToken",
    "authToken",
    "jwt",
    "vivalista_token",
    "vivalista_access_token",
  ];

  for (const key of possibleKeys) {
    const value = window.localStorage.getItem(key);
    if (value && value.trim()) {
      cachedAuthToken = value;
      return value;
    }
  }

  cachedAuthToken = null;
  return null;
}

async function apiRequest<T>(
  backendUrl: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      invalidateAuthCache();
    }

    throw data || new Error(`Erro ${response.status}`);
  }

  return data as T;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;

  if (error && typeof error === "object") {
    const apiError = error as ApiError;

    if (Array.isArray(apiError.message)) {
      return apiError.message.join(", ");
    }

    if (typeof apiError.message === "string") {
      return apiError.message;
    }

    if (typeof apiError.error === "string") {
      return apiError.error;
    }
  }

  return "Não foi possível carregar ou salvar o visual do evento.";
}

function normalizeEventResponse(
  data: EventData | { data?: EventData },
): EventData {
  if ("data" in data && data.data) return data.data;
  return data as EventData;
}

function formatEventDate(date?: string | null): string {
  if (!date) return "Data do evento";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Data do evento";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function buildAssetUrl(value?: string | null): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:") ||
    raw.startsWith("//")
  ) {
    return raw;
  }

  const backendUrl = getBackendUrl();

  if (raw.startsWith("/")) return `${backendUrl}${raw}`;

  return `${backendUrl}/${raw}`;
}

function parseFontPayload(value?: string | null): {
  fontStyle: string;
  titleSize: string;
  titleScale: number;
  detailScale: number;
  textDensity: string;
  textFrameStyle: string;
  siteAtmosphere: string;
  photoSettings: PhotoSettings;
  textSettings: TextSettings;
} {
  const raw = value?.trim();

  if (!raw) {
    return {
      fontStyle: "serenata-script",
      titleSize: "grande",
      titleScale: 92,
      detailScale: 100,
      textDensity: "padrao",
      textFrameStyle: "auto",
      siteAtmosphere: "clean-luxo",
      photoSettings: { fit: "cover", zoom: 112, x: 50, y: 50 },
      textSettings: { align: "center", placement: "middle" },
    };
  }

  if (["elegante", "romantico", "minimalista", "rustico", "moderno", "boho"].includes(raw)) {
    const legacyMap: Record<string, string> = {
      elegante: "editorial-classic",
      romantico: "serenata-script",
      minimalista: "viva-sans",
      rustico: "poise-serif",
      moderno: "studio-modern",
      boho: "love-note",
    };

    return {
      fontStyle: legacyMap[raw] ?? "serenata-script",
      titleSize: "grande",
      titleScale: 92,
      detailScale: 100,
      textDensity: "padrao",
      textFrameStyle: "auto",
      siteAtmosphere: "clean-luxo",
      photoSettings: { fit: "cover", zoom: 112, x: 50, y: 50 },
      textSettings: { align: "center", placement: "middle" },
    };
  }

  const parts = raw.split("|");
  const fontStyle = parts[0] || "serenata-script";
  const titleSize =
    parts.find((part) => part.startsWith("size:"))?.replace("size:", "") ||
    "grande";
  const textDensity =
    parts.find((part) => part.startsWith("text:"))?.replace("text:", "") ||
    "padrao";
  const parsedScale = Number(
    parts.find((part) => part.startsWith("scale:"))?.replace("scale:", "") || 92,
  );
  const titleScale = Number.isFinite(parsedScale)
    ? Math.min(115, Math.max(62, parsedScale))
    : 92;
  const parsedDetailScale = Number(
    parts.find((part) => part.startsWith("detail:"))?.replace("detail:", "") || 100,
  );
  const detailScale = Number.isFinite(parsedDetailScale)
    ? Math.min(125, Math.max(80, parsedDetailScale))
    : 100;
  const textFrameStyle =
    parts.find((part) => part.startsWith("frame:"))?.replace("frame:", "") ||
    "auto";
  const siteAtmosphere =
    parts.find((part) => part.startsWith("atmosphere:"))?.replace("atmosphere:", "") ||
    "clean-luxo";
  const parsedPhotoZoom = Number(
    parts.find((part) => part.startsWith("photozoom:"))?.replace("photozoom:", "") || 112,
  );
  const parsedPhotoX = Number(
    parts.find((part) => part.startsWith("photox:"))?.replace("photox:", "") || 50,
  );
  const parsedPhotoY = Number(
    parts.find((part) => part.startsWith("photoy:"))?.replace("photoy:", "") || 50,
  );
  const parsedPhotoFit =
    parts.find((part) => part.startsWith("photofit:"))?.replace("photofit:", "") ||
    "contain";
  const parsedTextAlign =
    parts.find((part) => part.startsWith("align:"))?.replace("align:", "") ||
    "center";
  const parsedTextPlacement =
    parts.find((part) => part.startsWith("place:"))?.replace("place:", "") ||
    "middle";

  return {
    fontStyle,
    titleSize,
    titleScale,
    detailScale,
    textDensity,
    textFrameStyle,
    siteAtmosphere,
    photoSettings: {
      fit: parsedPhotoFit === "cover" ? "cover" : "contain",
      zoom: Number.isFinite(parsedPhotoZoom) ? Math.min(170, Math.max(80, parsedPhotoZoom)) : 112,
      x: Number.isFinite(parsedPhotoX) ? Math.min(100, Math.max(0, parsedPhotoX)) : 50,
      y: Number.isFinite(parsedPhotoY) ? Math.min(100, Math.max(0, parsedPhotoY)) : 50,
    },
    textSettings: {
      align: parsedTextAlign === "left" || parsedTextAlign === "right" ? parsedTextAlign : "center",
      placement:
        parsedTextPlacement === "top" || parsedTextPlacement === "bottom"
          ? parsedTextPlacement
          : "middle",
    },
  };
}

function buildFontPayload(
  form: Pick<VisualFormData, "fontStyle" | "titleSize" | "titleScale" | "detailScale" | "textDensity" | "textFrameStyle" | "siteAtmosphere">,
  photoSettings: PhotoSettings,
  textSettings: TextSettings,
): string {
  return `${form.fontStyle}|size:${form.titleSize}|scale:${form.titleScale}|detail:${form.detailScale}|text:${form.textDensity}|frame:${form.textFrameStyle}|atmosphere:${form.siteAtmosphere}|photofit:${photoSettings.fit}|photozoom:${photoSettings.zoom}|photox:${photoSettings.x}|photoy:${photoSettings.y}|align:${textSettings.align}|place:${textSettings.placement}`;
}

function buildInitialVisualForm(
  event: EventData | null,
  visual?: VisualSettings | null,
): VisualFormData {
  const parsedTypography = parseFontPayload(visual?.fontStyle);

  return {
    publicTitle: visual?.publicTitle ?? event?.name ?? "",
    publicSubtitle:
      visual?.publicSubtitle ??
      (event?.date
        ? `${formatEventDate(event.date)} • ${
            event?.location || "Local do evento"
          }`
        : event?.location ?? ""),
    heroImageUrl:
      visual?.heroImageUrl ??
      event?.heroImageUrl ??
      event?.coverImage ??
      "",
    welcomeMessage:
      visual?.welcomeMessage ??
      event?.description ??
      "Estamos muito felizes em compartilhar este momento especial com vocês.",
    primaryColor: visual?.primaryColor ?? "#43263f",
    secondaryColor: visual?.secondaryColor ?? "#c4a262",
    fontStyle: parsedTypography.fontStyle,
    titleSize: parsedTypography.titleSize,
    titleScale: parsedTypography.titleScale,
    detailScale: parsedTypography.detailScale,
    textDensity: parsedTypography.textDensity,
    textFrameStyle: parsedTypography.textFrameStyle,
    siteAtmosphere: parsedTypography.siteAtmosphere,
    heroLayout: visual?.heroLayout ?? "centralizado",
    showCountdown: visual?.showCountdown ?? true,
    showStory: visual?.showStory ?? true,
    showGallery: visual?.showGallery ?? true,
    showLocation: visual?.showLocation ?? true,
    showGifts: visual?.showGifts ?? true,
    showRsvp: visual?.showRsvp ?? true,
  };
}

function getFontClass(fontStyle: string): string {
  if (["serenata-script", "champagne-script", "chandelier", "wellington", "sacramento"].includes(fontStyle)) {
    return `font-script font-${fontStyle}`;
  }

  if (["love-note", "soft-signature", "sunkissed", "beautiful-script"].includes(fontStyle)) {
    return `font-handmade font-${fontStyle}`;
  }

  if (["honey", "bubble", "peace-love", "papercute"].includes(fontStyle)) {
    return `font-fun font-${fontStyle}`;
  }

  if (["studio-modern", "urban-clean", "contour", "typewriter", "viva-sans"].includes(fontStyle)) {
    return `font-modern-set font-${fontStyle}`;
  }

  if (["editorial-classic", "empire-serif", "roman-elegance", "classical", "beaumont", "poise-serif"].includes(fontStyle)) {
    return `font-serif-set font-${fontStyle}`;
  }

  if (fontStyle === "moderno") return "font-studio-modern";
  if (fontStyle === "romantico") return "font-serenata-script";
  if (fontStyle === "minimalista") return "font-viva-sans";
  if (fontStyle === "rustico") return "font-poise-serif";
  if (fontStyle === "boho") return "font-love-note";
  return "font-editorial-classic";
}

function getTypographyLabel(value: string): string {
  return typographyOptions.find((option) => option.value === value)?.label ?? "Serenata";
}


function splitTitle(title: string): { first: string; second: string } {
  const clean = title.trim();

  if (!clean) {
    return { first: "", second: "" };
  }

  if (clean.includes("&")) {
    const parts = clean.split("&");
    return {
      first: parts[0]?.trim() ?? "",
      second: parts.slice(1).join("&").trim(),
    };
  }

  if (clean.includes(" e ")) {
    const parts = clean.split(" e ");
    return {
      first: parts[0]?.trim() ?? "",
      second: parts.slice(1).join(" e ").trim(),
    };
  }

  return { first: clean, second: "" };
}

function getPreviewTitle(publicTitle: string, eventName: string): { first: string; second: string } {
  const source = publicTitle.trim() || eventName.trim();

  if (!source) {
    return { first: "Seu evento", second: "" };
  }

  return splitTitle(source);
}

function getHeroLeadText(
  publicSubtitle: string,
  welcomeMessage: string,
  dateLabel: string,
  locationLabel: string,
): string {
  const subtitle = publicSubtitle.trim();
  const message = welcomeMessage.trim();
  const normalizedSubtitle = subtitle.toLowerCase();
  const normalizedDate = dateLabel.toLowerCase();
  const normalizedLocation = locationLabel.toLowerCase();

  const looksLikeSystemText = (value: string) => {
    const normalized = value.toLowerCase();
    return (
      normalized.includes("[evento:") ||
      normalized.includes("[modelo:") ||
      normalized.includes("local do evento") ||
      normalized.includes("data do evento")
    );
  };

  const subtitleLooksLikeMeta =
    Boolean(subtitle) &&
    (normalizedSubtitle.includes(normalizedDate) ||
      normalizedSubtitle.includes(normalizedLocation) ||
      looksLikeSystemText(subtitle));

  if (subtitle && !subtitleLooksLikeMeta) {
    return subtitle.length > 90 ? `${subtitle.slice(0, 87).trim()}...` : subtitle;
  }

  if (message && !looksLikeSystemText(message) && message.length <= 90) {
    return message;
  }

  return "";
}


function getEffectiveTextFrame(heroLayout: string, textFrameStyle: string): "solto" | "retangular" | "quadrado" {
  if (["solto", "retangular", "quadrado"].includes(textFrameStyle)) {
    return textFrameStyle as "solto" | "retangular" | "quadrado";
  }

  if (["meio-a-meio", "esquerda-esfumada", "split-curvo", "minimal-luxo", "black-tie", "corporativo-neon", "festa-palco", "circular", "oval", "monograma-clean", "poster-editorial", "faixa-convite"].includes(heroLayout)) {
    return "solto";
  }

  if (["tela-cheia", "cinematografica", "foto-moldura"].includes(heroLayout)) {
    return "retangular";
  }

  return "quadrado";
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getDefaultPhotoSettingsForLayout(layout: string): {
  fit: "cover" | "contain";
  zoom: number;
  x: number;
  y: number;
} {
  if (["circular", "oval"].includes(layout)) {
    return { fit: "cover", zoom: 124, x: 50, y: 42 };
  }

  if (["meio-a-meio", "foto-moldura", "esquerda-esfumada", "split-curvo", "minimal-luxo", "black-tie", "corporativo-neon", "festa-palco"].includes(layout)) {
    return { fit: "cover", zoom: 108, x: 50, y: 48 };
  }

  if (["poster-editorial", "faixa-convite"].includes(layout)) {
    return { fit: "cover", zoom: 112, x: 50, y: 46 };
  }

  if (["monograma-clean"].includes(layout)) {
    return { fit: "contain", zoom: 96, x: 50, y: 50 };
  }

  if (["editorial-cartao", "convite-luxo"].includes(layout)) {
    return { fit: "cover", zoom: 112, x: 50, y: 48 };
  }

  return { fit: "cover", zoom: 110, x: 50, y: 50 };
}

function getAtmosphereLabel(value: string): string {
  const option = visualStyleOptions.find((item) => item.value === value);
  return option?.label ?? "Clássico";
}

function getLiveTitleSize({
  heroLayout,
  titleSize,
  titleScale,
  textFrameStyle,
}: {
  heroLayout: string;
  titleSize: string;
  titleScale: number;
  textFrameStyle: string;
}): number {
  const baseBySize: Record<string, number> = {
    delicado: 36,
    medio: 44,
    grande: 52,
    impactante: 60,
  };

  const compactLayouts = [
    "meio-a-meio",
    "esquerda-esfumada",
    "split-curvo",
    "minimal-luxo",
    "black-tie",
    "corporativo-neon",
    "festa-palco",
    "foto-moldura",
    "poster-editorial",
    "faixa-convite",
    "editorial-cartao",
    "convite-luxo",
  ];

  const portraitLayouts = ["circular", "oval", "monograma-clean"];
  const fullLayouts = ["centralizado", "tela-cheia", "cinematografica"];

  let base = baseBySize[titleSize] ?? 46;

  if (compactLayouts.includes(heroLayout)) {
    const compactBase: Record<string, number> = {
      delicado: 32,
      medio: 38,
      grande: 44,
      impactante: 50,
    };
    base = compactBase[titleSize] ?? 42;
  }

  if (portraitLayouts.includes(heroLayout)) {
    const portraitBase: Record<string, number> = {
      delicado: 34,
      medio: 42,
      grande: 50,
      impactante: 56,
    };
    base = portraitBase[titleSize] ?? 44;
  }

  if (fullLayouts.includes(heroLayout)) {
    const fullBase: Record<string, number> = {
      delicado: 38,
      medio: 46,
      grande: 54,
      impactante: 62,
    };
    base = fullBase[titleSize] ?? 46;
  }

  if (textFrameStyle === "quadrado") {
    base = Math.min(base, 42);
  }

  return Math.round(clampNumber(base * (titleScale / 100), 22, 74));
}

export default function EventVisualPage() {
  const params = useParams();
  const router = useRouter();
  const eventIdParam = params?.eventId;
  const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;

  const backendUrl = getBackendUrl();

  const [event, setEvent] = useState<EventData | null>(null);
  const [form, setForm] = useState<VisualFormData>(() =>
    buildInitialVisualForm(null, null),
  );
  const [localHeroPreview, setLocalHeroPreview] = useState<string | null>(null);
  const [photoSettings, setPhotoSettings] = useState<PhotoSettings>(() => ({
    fit: "cover",
    zoom: 112,
    x: 50,
    y: 50,
  }));
  const [textSettings, setTextSettings] = useState<TextSettings>(() => ({
    align: "center",
    placement: "middle",
  }));

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(() => new Set());
  const navigatingRef = useRef(false);

  const photoFit = photoSettings.fit;
  const photoZoom = photoSettings.zoom;
  const photoPositionX = photoSettings.x;
  const photoPositionY = photoSettings.y;
  const textAlign = textSettings.align;
  const textPlacement = textSettings.placement;

  function updatePhotoSettings(patch: Partial<PhotoSettings>) {
    setPhotoSettings((current) => ({ ...current, ...patch }));
  }

  function setPhotoFit(fit: PhotoSettings["fit"]) {
    updatePhotoSettings({ fit });
  }

  function setPhotoZoom(zoom: number) {
    updatePhotoSettings({ zoom });
  }

  function setPhotoPositionX(x: number) {
    updatePhotoSettings({ x });
  }

  function setPhotoPositionY(y: number) {
    updatePhotoSettings({ y });
  }

  function setTextAlign(align: TextSettings["align"]) {
    setTextSettings((current) => ({ ...current, align }));
  }

  function setTextPlacement(placement: TextSettings["placement"]) {
    setTextSettings((current) => ({ ...current, placement }));
  }

  const step = steps[currentStep];
  const isAtmosphereStep = step.key === "estilo";
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const leftImage = useMemo(() => {
    return localHeroPreview || buildAssetUrl(form.heroImageUrl) || step.image;
  }, [form.heroImageUrl, localHeroPreview, step.image]);

  const activeSectionsCount = useMemo(() => {
    return visualSections.filter((section) => form[section.key]).length;
  }, [form]);

  const publicPath = event?.slug ? `/e/${event.slug}` : null;
  const publicUrlLabel = event?.slug
    ? `vivalista.com/e/${event.slug}`
    : "vivalista.com/e/seu-evento";
  const eventDateLabel = formatEventDate(event?.date);
  const eventLocationLabel = event?.location || "Local ainda não informado";

  const titleParts = useMemo(
    () => getPreviewTitle(form.publicTitle, event?.name ?? ""),
    [event?.name, form.publicTitle],
  );

  const heroLeadText = useMemo(
    () =>
      getHeroLeadText(
        form.publicSubtitle,
        form.welcomeMessage,
        eventDateLabel,
        eventLocationLabel,
      ),
    [eventDateLabel, eventLocationLabel, form.publicSubtitle, form.welcomeMessage],
  );

  const effectiveTextFrame = useMemo(
    () => getEffectiveTextFrame(form.heroLayout, form.textFrameStyle),
    [form.heroLayout, form.textFrameStyle],
  );

  const liveTitleSize = useMemo(
    () =>
      getLiveTitleSize({
        heroLayout: form.heroLayout,
        titleSize: form.titleSize,
        titleScale: form.titleScale,
        textFrameStyle: effectiveTextFrame,
      }),
    [effectiveTextFrame, form.heroLayout, form.titleScale, form.titleSize],
  );

  useEffect(() => {
    let active = true;

    async function loadVisualData() {
      if (!eventId) {
        setErrorMessage("Evento não encontrado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const [eventResponse, visualResponse] = await Promise.allSettled([
          apiRequest<EventData | { data?: EventData }>(backendUrl, `/events/${eventId}`),
          apiRequest<VisualResponse>(backendUrl, `/events/${eventId}/visual`),
        ]);

        if (!active) return;

        if (eventResponse.status !== "fulfilled") {
          throw eventResponse.reason;
        }

        const loadedEvent = normalizeEventResponse(eventResponse.value);

        const loadedVisual =
          visualResponse.status === "fulfilled"
            ? visualResponse.value.visual
            : null;

        const parsedTypography = parseFontPayload(loadedVisual?.fontStyle);

        setEvent(loadedEvent);
        setForm(buildInitialVisualForm(loadedEvent, loadedVisual));
        setPhotoSettings(parsedTypography.photoSettings);
        setTextSettings(parsedTypography.textSettings);
      } catch (error) {
        if (!active) return;
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadVisualData();

    return () => {
      active = false;
      navigatingRef.current = false;
    };
  }, [backendUrl, eventId]);

  function handleTextChange(
    eventChange: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = eventChange.target;

    if (name === "heroImageUrl") {
      setLocalHeroPreview(null);
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleHeroFileChange(eventChange: ChangeEvent<HTMLInputElement>) {
    const file = eventChange.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSizeInBytes = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Escolha uma imagem nos formatos .jpg, .gif ou .png.");
      eventChange.target.value = "";
      return;
    }

    if (file.size > maxSizeInBytes) {
      setErrorMessage("A imagem precisa ter no máximo 10MB.");
      eventChange.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const imageDataUrl = reader.result;
        setLocalHeroPreview(imageDataUrl);
        setForm((current) => ({
          ...current,
          heroImageUrl: imageDataUrl,
        }));
        setPhotoFit("cover");
        setPhotoZoom(112);
        setPhotoPositionX(50);
        setPhotoPositionY(50);
        setErrorMessage(null);
      }
    };

    reader.onerror = () => {
      setErrorMessage("Não foi possível carregar a imagem escolhida.");
    };

    reader.readAsDataURL(file);
  }

  function updateChoice(
    key: keyof Pick<VisualFormData, "fontStyle" | "heroLayout" | "titleSize" | "textDensity" | "textFrameStyle" | "siteAtmosphere">,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateHeroLayout(layout: string) {
    const nextPhoto = getDefaultPhotoSettingsForLayout(layout);

    setForm((current) => ({
      ...current,
      heroLayout: layout,
    }));

    setPhotoSettings(nextPhoto);
  }

  function updateVisualStyle(option: VisualStyleOption) {
    setForm((current) => ({
      ...current,
      siteAtmosphere: option.value,
    }));
  }

  function updateColor(primaryColor: string, secondaryColor: string) {
    setForm((current) => ({
      ...current,
      primaryColor,
      secondaryColor,
    }));
  }

  function updateToggle(key: ToggleKey, value: boolean) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function goBack() {
    setCurrentStep((current) => Math.max(current - 1, 0));
  }

  function goNext() {
    setCurrentStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function skipStep() {
    setSkippedSteps((current) => {
      const next = new Set(current);
      next.add(currentStep);
      return next;
    });
    goNext();
  }

  async function handleSave() {
    if (!eventId) {
      setErrorMessage("Evento não encontrado.");
      return;
    }

    if (!form.heroImageUrl.trim()) {
      setErrorMessage("Adicione uma imagem de capa antes de salvar.");
      setCurrentStep(3);
      return;
    }

    if (saving || navigatingRef.current) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await apiRequest<VisualResponse>(backendUrl, `/events/${eventId}/visual`, {
        method: "PATCH",
        body: JSON.stringify({
          publicTitle: form.publicTitle.trim(),
          publicSubtitle: form.publicSubtitle.trim(),
          heroImageUrl: form.heroImageUrl.trim(),
          welcomeMessage: form.welcomeMessage.trim(),
          primaryColor: form.primaryColor.trim(),
          secondaryColor: form.secondaryColor.trim(),
          fontStyle: buildFontPayload(form, photoSettings, textSettings),
          heroLayout: form.heroLayout,
          showCountdown: form.showCountdown,
          showStory: form.showStory,
          showGallery: form.showGallery,
          showLocation: form.showLocation,
          showGifts: form.showGifts,
          showRsvp: form.showRsvp,
        }),
      });

      setSuccessMessage("Visual salvo com sucesso. Abrindo seu site quase pronto...");
      setCurrentStep(steps.length - 1);
      navigatingRef.current = true;

      window.setTimeout(() => {
        router.push(`/dashboard/eventos/${eventId}/montar-site`);
      }, 700);
    } catch (error) {
      navigatingRef.current = false;
      setErrorMessage(getErrorMessage(error));
    } finally {
      if (!navigatingRef.current) {
        setSaving(false);
      }
    }
  }



  if (loading) {
    return (
      <main className="clean-loading">
        <div>
          <VivaListaLogo />
          <h1>Carregando visual do site...</h1>
        </div>
      </main>
    );
  }

  if (errorMessage && !event) {
    return (
      <main className="clean-loading">
        <div>
          <VivaListaLogo />
          <h1>Não conseguimos abrir este evento.</h1>
          <span>{errorMessage}</span>
          <Link href="/dashboard/eventos">Voltar para eventos</Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`vivalista-wizard ${isAtmosphereStep ? "preview-atmosphere-only" : ""}`}
      style={
        {
          "--brand-primary": form.primaryColor,
          "--brand-secondary": form.secondaryColor,
          "--progress-percent": `${progressPercent}%`,
          "--photo-size": photoFit === "contain" ? "contain" : `${photoZoom}%`,
          "--photo-position": `${photoPositionX}% ${photoPositionY}%`,
          "--title-scale": String(form.titleScale / 100),
          "--detail-scale": String(form.detailScale / 100),
          "--copy-scale": String(Math.min(1.16, Math.max(0.88, form.detailScale / 100))),
        } as CSSProperties
      }
    >
            <VisualBuilderStyles liveTitleSize={liveTitleSize} />
      <style jsx global>{`
        /*
          PASSO 1 — ATMOSFERA DO SITE
          Neste passo a prévia não deve mostrar capa, letras, cartão de texto
          nem moldura central. A pessoa escolhe apenas o clima visual do site.
        */
        .preview-atmosphere-only .mini-hero-copy,
        .preview-atmosphere-only .preview-card,
        .preview-atmosphere-only .site-preview-content,
        .preview-atmosphere-only .visual-photo-shape,
        .preview-atmosphere-only .preview-photo-large,
        .preview-atmosphere-only .preview-photo {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .preview-atmosphere-only .mini-hero-preview {
          min-height: 66%;
        }

        .preview-atmosphere-only .visual-photo-layer {
          opacity: 1;
        }
      `}</style>

      <section className="image-side">
        <FullSitePreview
          form={form}
          leftImage={leftImage}
          titleParts={titleParts}
          heroLeadText={heroLeadText}
          eventDateLabel={eventDateLabel}
          eventLocationLabel={eventLocationLabel}
          textAlign={textAlign}
          textPlacement={textPlacement}
          effectiveTextFrame={effectiveTextFrame}
          fontClass={getFontClass(form.fontStyle)}
          liveTitleSize={liveTitleSize}
        />
      </section>


      <section className="form-side">
        <div className="compact-fixed-head">
          <div className="compact-progress-row">
            <VivaListaLogo />

            <div className="progress-mini">
              <div className="progress-summary">
                <span>
                  Passo {currentStep + 1} de {steps.length}
                </span>
                <strong>{Math.round(progressPercent)}%</strong>
              </div>

              <ol className="progress-dots" role="list" aria-label="Progresso da etapa visual">
                {steps.map((item, index) => {
                  const isDone = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isSkipped = skippedSteps.has(index);

                  return (
                    <li className="progress-item" key={item.key}>
                      <span
                        className={`progress-dot ${isDone ? "done" : ""} ${
                          isCurrent ? "current" : ""
                        } ${isSkipped ? "skipped" : ""}`}
                        role="img"
                        aria-label={
                          isSkipped
                            ? `Etapa ${index + 1} pulada`
                            : isDone
                              ? `Etapa ${index + 1} concluída`
                              : isCurrent
                                ? `Etapa ${index + 1} atual`
                                : `Etapa ${index + 1}`
                        }
                      />

                      {index < steps.length - 1 ? (
                        <span
                          className={`progress-line ${
                            index < currentStep ? "done" : ""
                          }`}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <h1 className="question-title">{step.title}</h1>
          <p className="question-subtitle">{step.subtitle}</p>
        </div>

        <div className="wizard-content">
          <div className="question-box">
            <div className="step-content"><VisualStepContent
              step={step}
              handleHeroFileChange={handleHeroFileChange}
              heroLayoutOptions={heroLayoutOptions}
              updateHeroLayout={updateHeroLayout}
              form={form}
              photoFit={photoFit}
              setPhotoFit={setPhotoFit}
              photoZoom={photoZoom}
              setPhotoZoom={setPhotoZoom}
              photoPositionX={photoPositionX}
              setPhotoPositionX={setPhotoPositionX}
              photoPositionY={photoPositionY}
              setPhotoPositionY={setPhotoPositionY}
              visualStyleOptions={visualStyleOptions}
              updateVisualStyle={updateVisualStyle}
              colorOptions={colorOptions}
              updateColor={updateColor}
              handleTextChange={handleTextChange}
              typographyCategories={typographyCategories}
              typographyOptions={typographyOptions}
              getFontClass={getFontClass}
              updateChoice={updateChoice}
              titleSizeOptions={titleSizeOptions}
              setForm={setForm}
              textDensityOptions={textDensityOptions}
              textAlign={textAlign}
              setTextAlign={setTextAlign}
              textPlacement={textPlacement}
              setTextPlacement={setTextPlacement}
              effectiveTextFrame={effectiveTextFrame}
              visualSections={visualSections}
              updateToggle={updateToggle}
              event={event}
              publicUrlLabel={publicUrlLabel}
              getTypographyLabel={getTypographyLabel}
              getAtmosphereLabel={getAtmosphereLabel}
              activeSectionsCount={activeSectionsCount}
            /></div>

            {errorMessage ? (
              <div className="message error">{errorMessage}</div>
            ) : null}

            {successMessage ? (
              <div className="message success">{successMessage}</div>
            ) : null}
          </div>
        </div>

        <footer className="bottom-bar bottom-actions-bar">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0 || saving || navigatingRef.current}
            className="secondary-button"
          >
            Voltar
          </button>

          <div className="bottom-center-actions">
            {currentStep < steps.length - 1 ? (
              <button type="button" onClick={skipStep} className="skip-button compact-skip-button">
                Pular por enquanto
              </button>
            ) : publicPath ? (
              <Link href={publicPath} className="compact-site-link">
                Ver site público
              </Link>
            ) : (
              <Link href={`/dashboard/eventos/${eventId}`} className="compact-site-link">
                Voltar ao evento
              </Link>
            )}
          </div>

          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={goNext} className="primary-button compact-primary-button">
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || navigatingRef.current}
              className="primary-button compact-primary-button"
            >
              {saving || navigatingRef.current
                ? "Salvando..."
                : "Salvar visual e ver meu site quase pronto"}
            </button>
          )}
        </footer>
      </section>
    </main>
  );
}