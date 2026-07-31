"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ChangeEvent, ReactNode } from "react";
import { useParams } from "next/navigation";

/* VERSAO_MONTAR_SITE_EDITOR_LATERAL_PREMIUM_V18_EDITOR_DIRETO_SEM_CAPAS_RAPIDAS */

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | string;

type EventData = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  status?: EventStatus | null;
  eventType?: string | null;
  template?: string | null;
  templateKey?: string | null;
  themeKey?: string | null;
  coverImage?: string | null;
  heroImageUrl?: string | null;
  showGifts?: boolean | null;
  showRsvp?: boolean | null;
  showGallery?: boolean | null;
  showStory?: boolean | null;
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

type SectionKey =
  | "INVITATION"
  | "HERO"
  | "COUPLE"
  | "STORY"
  | "GALLERY"
  | "RECEPTION"
  | "INFO"
  | "MENU"
  | "LOCATION"
  | "ACCOMMODATION"
  | "GIFTS"
  | "DEFAULT_GIFT"
  | "RSVP";

type SectionMedia = {
  id: string;
  eventId: string;
  sectionKey: SectionKey;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
  mediaRole?: string | null;
  displayOrder: number;
  isActive: boolean;
  isPrimary: boolean;
  createdAt?: string | null;
};

type SectionMediaResponse = {
  event?: EventData;
  media?: SectionMedia[];
  sections?: Partial<Record<SectionKey, SectionMedia[]>>;
  availableSections?: SectionKey[];
};

type Gift = {
  id: string;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  price?: number | string | null;
  amount?: number | string | null;
  imageUrl?: string | null;
  image?: string | null;
  status?: string | null;
};

type GiftsResponse = {
  event?: EventData;
  gifts?: Gift[];
};

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type EditorMode = "capa" | "texto" | "dados" | "data" | "local" | "secoes" | "fotos" | "presentes" | "convidados";

type PhotoEditorTarget = "gallery" | "story" | "location";

type EditorDraft = {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  publicTitle: string;
  publicSubtitle: string;
  welcomeMessage: string;
  heroImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
  heroLayout: HeroLayout;
  fontStyle: string;
  titleSize: TypographySettings["titleSize"];
  textDensity: TypographySettings["textDensity"];
  showCountdown: boolean;
  showStory: boolean;
  showGallery: boolean;
  showLocation: boolean;
  showGifts: boolean;
  showRsvp: boolean;
};

type SiteSectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  onEdit?: () => void;
  buttonLabel: string;
  children?: ReactNode;
  isComplete?: boolean;
};

const VERSION_MARKER =
  "VERSAO_MONTAR_SITE_EDITOR_LATERAL_PREMIUM_V18_EDITOR_DIRETO_SEM_CAPAS_RAPIDAS";

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90";

const FALLBACK_STORY_IMAGE =
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=88";

const FALLBACK_LOCATION_IMAGE =
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=88";

const FALLBACK_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
];

const assetUrlCache = new Map<string, string>();

function readAssetCache(raw: string): string | null {
  if (raw.startsWith("data:") || raw.startsWith("blob:")) return null;
  return assetUrlCache.get(raw) ?? null;
}

function writeAssetCache(raw: string, resolved: string): string {
  if (!raw.startsWith("data:") && !raw.startsWith("blob:")) {
    assetUrlCache.set(raw, resolved);
  }

  return resolved;
}


const QUICK_COVER_IMAGES = [
  { label: "Flores", url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=90" },
  { label: "Casal", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=90" },
  { label: "Noite", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=90" },
  { label: "Mesa", url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=90" },
];

const QUICK_HERO_LAYOUTS: Array<{ value: HeroLayout; label: string }> = [
  { value: "centralizado", label: "Editorial" },
  { value: "tela-cheia", label: "Tela cheia" },
  { value: "meio-a-meio", label: "Meio a meio" },
  { value: "circular", label: "Circular" },
  { value: "oval", label: "Oval" },
  { value: "foto-moldura", label: "Moldura" },
  { value: "editorial-cartao", label: "Cartão" },
  { value: "cinematografica", label: "Cinemática" },
];

const QUICK_FONTS = [
  { value: "editorial-classic", label: "Editorial" },
  { value: "serenata-script", label: "Serenata" },
  { value: "champagne-script", label: "Champagne" },
  { value: "wellington", label: "Wellington" },
  { value: "sunkissed", label: "Sunkissed" },
  { value: "beaumont", label: "Beaumont" },
  { value: "studio-modern", label: "Studio Modern" },
  { value: "viva-sans", label: "Viva Sans" },
];

const MAX_INLINE_IMAGE_BYTES = 8 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1).replace(".0", "")} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}

function validateInlineImageFile(file: File, contextLabel: string): string | null {
  if (!file.type.startsWith("image/")) {
    return `Escolha uma imagem válida para ${contextLabel}.`;
  }

  if (file.size > MAX_INLINE_IMAGE_BYTES) {
    return `Esta imagem tem ${formatFileSize(file.size)}. Para manter o editor rápido, envie uma imagem de até ${formatFileSize(MAX_INLINE_IMAGE_BYTES)}.`;
  }

  return null;
}

function isQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const record = error as { name?: string; code?: number };
  return (
    record.name === "QuotaExceededError" ||
    record.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    record.code === 22 ||
    record.code === 1014
  );
}

function getSaveErrorMessage(error: unknown): string {
  const baseMessage = getErrorMessage(error);
  const normalized = baseMessage.toLowerCase();

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "Você parece estar sem internet. Confira a conexão e tente salvar novamente.";
  }

  if (normalized.includes("401") || normalized.includes("login") || normalized.includes("token") || normalized.includes("unauthorized")) {
    return "Sua sessão pode ter expirado. Faça login novamente e tente salvar.";
  }

  if (normalized.includes("validation") || normalized.includes("validar") || normalized.includes("inválid") || normalized.includes("invalid")) {
    return `Algum campo precisa ser corrigido antes de salvar: ${baseMessage}`;
  }

  if (normalized.includes("failed to fetch") || normalized.includes("network") || normalized.includes("fetch")) {
    return "Não consegui falar com o servidor agora. Confira se o backend está ligado e tente novamente.";
  }

  return baseMessage;
}

const WEDDING_GIFT_SUGGESTIONS = [
  "Cota para lua de mel",
  "Jogo de jantar",
  "Jogo de panelas",
  "Air fryer",
  "Jogo de cama",
  "Contribuição livre",
];

const BABY_SHOWER_GIFT_SUGGESTIONS = [
  "Fraldas",
  "Lenço umedecido",
  "Banheira",
  "Mamadeira",
  "Kit higiene",
  "Contribuição livre",
];

const BIRTHDAY_GIFT_SUGGESTIONS = [
  "Contribuição livre",
  "Cota para presente especial",
  "Vale-presente",
  "Experiência",
  "Decoração da festa",
];

function getBackendUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3001";

  return value.replace(/\/+$/, "");
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

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
    if (value && value.trim()) return value;
  }

  return null;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;

  if (error && typeof error === "object") {
    const maybeApiError = error as ApiError;

    if (Array.isArray(maybeApiError.message)) {
      return maybeApiError.message.join(", ");
    }

    if (typeof maybeApiError.message === "string") {
      return maybeApiError.message;
    }

    if (typeof maybeApiError.error === "string") {
      return maybeApiError.error;
    }
  }

  return "Não foi possível carregar a montagem do site.";
}

async function readApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError;
    return getErrorMessage(data);
  } catch {
    return `Erro na API. Status ${response.status}.`;
  }
}

function normalizeEventResponse(
  data: EventData | { data?: EventData } | { event?: EventData },
): EventData {
  if ("data" in data && data.data) return data.data;
  if ("event" in data && data.event) return data.event;
  return data as EventData;
}

function buildAssetUrl(value?: string | null): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  const cached = readAssetCache(raw);
  if (cached) return cached;

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:") ||
    raw.startsWith("//")
  ) {
    return writeAssetCache(raw, raw);
  }

  const backendUrl = getBackendUrl();
  if (raw.startsWith("/")) return writeAssetCache(raw, `${backendUrl}${raw}`);
  return writeAssetCache(raw, `${backendUrl}/${raw}`);
}


function formatShortDate(date?: string | null): string {
  if (!date) return "Data não informada";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function formatMoney(value?: number | string | null): string {
  if (value === undefined || value === null || value === "")
    return "Valor livre";

  const parsed = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(parsed)) return "Valor livre";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parsed);
}

function statusLabel(status?: string | null): string {
  if (!status) return "Rascunho";
  if (status === "DRAFT") return "Rascunho";
  if (status === "PUBLISHED") return "Publicado";
  if (status === "CANCELLED") return "Cancelado";
  return status;
}

function inferEventKind(
  event?: EventData | null,
):
  | "wedding"
  | "baby"
  | "birthday"
  | "corporate"
  | "graduation"
  | "house"
  | "religious"
  | "generic" {
  const raw = `${event?.name || ""} ${event?.eventType || ""} ${
    event?.template || ""
  } ${event?.templateKey || ""} ${event?.themeKey || ""}`.toLowerCase();

  if (
    raw.includes("casamento") ||
    raw.includes("wedding") ||
    raw.includes("noivado") ||
    raw.includes("bodas") ||
    raw.includes("noiva") ||
    raw.includes("noivo")
  ) {
    return "wedding";
  }

  if (raw.includes("beb") || raw.includes("baby") || raw.includes("revel")) {
    return "baby";
  }

  if (
    raw.includes("corpor") ||
    raw.includes("empresa") ||
    raw.includes("business")
  ) {
    return "corporate";
  }

  if (raw.includes("formatura") || raw.includes("graduation")) {
    return "graduation";
  }

  if (
    raw.includes("casa") ||
    raw.includes("open house") ||
    raw.includes("house")
  ) {
    return "house";
  }

  if (
    raw.includes("relig") ||
    raw.includes("batizado") ||
    raw.includes("comunhão") ||
    raw.includes("comunhao") ||
    raw.includes("culto")
  ) {
    return "religious";
  }

  if (
    raw.includes("anivers") ||
    raw.includes("birthday") ||
    raw.includes("festa") ||
    raw.includes("debutante") ||
    raw.includes("15")
  ) {
    return "birthday";
  }

  return "generic";
}

function getEventKindLabel(event?: EventData | null): string {
  const kind = inferEventKind(event);

  if (kind === "wedding") return "Casamento / Noivado";
  if (kind === "baby") return "Chá de bebê";
  if (kind === "birthday") return "Festa / Aniversário";
  if (kind === "corporate") return "Evento corporativo";
  if (kind === "graduation") return "Formatura";
  if (kind === "house") return "Casa nova";
  if (kind === "religious") return "Evento religioso";

  return "Evento personalizado";
}

function getGiftSuggestions(event?: EventData | null): string[] {
  const kind = inferEventKind(event);

  if (kind === "wedding") return WEDDING_GIFT_SUGGESTIONS;
  if (kind === "baby") return BABY_SHOWER_GIFT_SUGGESTIONS;
  if (kind === "birthday") return BIRTHDAY_GIFT_SUGGESTIONS;

  if (kind === "house") {
    return [
      "Cota para decoração",
      "Utensílios de cozinha",
      "Itens de mesa posta",
      "Contribuição livre",
      "Vale-presente",
    ];
  }

  if (kind === "graduation") {
    return [
      "Cota para viagem",
      "Contribuição livre",
      "Presente especial",
      "Experiência",
      "Vale-presente",
    ];
  }

  return [
    "Contribuição livre",
    "Cota de presente",
    "Presente especial",
    "Vale-presente",
    "Item personalizado",
  ];
}

function getGiftTitle(gift: Gift): string {
  return gift.name || gift.title || "Presente sem nome";
}

function splitTitle(title: string): { first: string; second: string } {
  const clean = title.trim();

  if (!clean) return { first: "", second: "" };

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

type TypographySettings = {
  fontStyle: string;
  titleSize: "delicado" | "medio" | "grande" | "impactante";
  textDensity: "compacto" | "padrao" | "confortavel";
};

function parseTypographyPayload(value?: string | null): TypographySettings {
  const raw = (value || "").trim();

  const legacyMap: Record<string, TypographySettings> = {
    elegante: { fontStyle: "editorial-classic", titleSize: "grande", textDensity: "padrao" },
    classico: { fontStyle: "editorial-classic", titleSize: "grande", textDensity: "padrao" },
    romantico: { fontStyle: "serenata-script", titleSize: "grande", textDensity: "confortavel" },
    minimalista: { fontStyle: "viva-sans", titleSize: "medio", textDensity: "compacto" },
    moderno: { fontStyle: "studio-modern", titleSize: "impactante", textDensity: "padrao" },
    rustico: { fontStyle: "poise-serif", titleSize: "grande", textDensity: "confortavel" },
    boho: { fontStyle: "love-note", titleSize: "grande", textDensity: "confortavel" },
  };

  if (!raw) return legacyMap.elegante;
  if (legacyMap[raw]) return legacyMap[raw];

  const parts = raw.split("|").map((part) => part.trim()).filter(Boolean);
  const fontStyle = parts[0] || "editorial-classic";
  const titlePart = parts.find((part) => part.startsWith("size:"));
  const textPart = parts.find((part) => part.startsWith("text:"));
  const titleSize = (titlePart?.replace("size:", "") || "grande") as TypographySettings["titleSize"];
  const textDensity = (textPart?.replace("text:", "") || "padrao") as TypographySettings["textDensity"];

  return {
    fontStyle,
    titleSize: ["delicado", "medio", "grande", "impactante"].includes(titleSize) ? titleSize : "grande",
    textDensity: ["compacto", "padrao", "confortavel"].includes(textDensity) ? textDensity : "padrao",
  };
}

function buildTypographyPayload(typography: Pick<EditorDraft, "fontStyle" | "titleSize" | "textDensity">): string {
  return `${typography.fontStyle}|size:${typography.titleSize}|text:${typography.textDensity}`;
}

function toDatetimeLocalValue(date?: string | null): string {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  const offset = parsed.getTimezoneOffset();
  const local = new Date(parsed.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 16);
}

function fromDatetimeLocalValue(value: string): string | null {
  if (!value.trim()) return null;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString();
}

function buildEditorDraft(event: EventData | null, visual: VisualSettings | null): EditorDraft {
  const typography = parseTypographyPayload(visual?.fontStyle);

  return {
    eventName: event?.name || "",
    eventDate: toDatetimeLocalValue(event?.date),
    eventLocation: event?.location || "",
    publicTitle: visual?.publicTitle || event?.name || "",
    publicSubtitle:
      visual?.publicSubtitle ||
      (event?.date
        ? `${formatShortDate(event.date)} • ${event?.location || "Local do evento"}`
        : event?.location || ""),
    welcomeMessage:
      visual?.welcomeMessage ||
      event?.description ||
      "Estamos muito felizes em compartilhar este momento especial com vocês.",
    heroImageUrl:
      visual?.heroImageUrl || event?.heroImageUrl || event?.coverImage || "",
    primaryColor: visual?.primaryColor || "#43263f",
    secondaryColor: visual?.secondaryColor || "#c4a262",
    heroLayout: resolveTemplateHeroLayout(event, visual?.heroLayout),
    fontStyle: typography.fontStyle,
    titleSize: typography.titleSize,
    textDensity: typography.textDensity,
    showCountdown: getTemplateSectionVisibility(event, visual, "countdown"),
    showStory: getTemplateSectionVisibility(event, visual, "story"),
    showGallery: getTemplateSectionVisibility(event, visual, "gallery"),
    showLocation: getTemplateSectionVisibility(event, visual, "location"),
    showGifts: getTemplateSectionVisibility(event, visual, "gifts"),
    showRsvp: getTemplateSectionVisibility(event, visual, "rsvp"),
  };
}

function getFontClass(fontStyle?: string | null): string {
  const clean = (fontStyle || "editorial-classic").trim();

  const map: Record<string, string> = {
    "serenata-script": "vv-font-serenata-script",
    "champagne-script": "vv-font-champagne-script",
    chandelier: "vv-font-chandelier",
    wellington: "vv-font-wellington",
    sacramento: "vv-font-sacramento",
    "love-note": "vv-font-love-note",
    "soft-signature": "vv-font-soft-signature",
    sunkissed: "vv-font-sunkissed",
    "beautiful-script": "vv-font-beautiful-script",
    honey: "vv-font-honey",
    bubble: "vv-font-bubble",
    "peace-love": "vv-font-peace-love",
    papercute: "vv-font-papercute",
    "studio-modern": "vv-font-studio-modern",
    "urban-clean": "vv-font-urban-clean",
    contour: "vv-font-contour",
    typewriter: "vv-font-typewriter",
    "viva-sans": "vv-font-viva-sans",
    "editorial-classic": "vv-font-editorial-classic",
    "empire-serif": "vv-font-empire-serif",
    "roman-elegance": "vv-font-roman-elegance",
    classical: "vv-font-classical",
    beaumont: "vv-font-beaumont",
    "poise-serif": "vv-font-poise-serif",
    elegante: "vv-font-editorial-classic",
    classico: "vv-font-editorial-classic",
    moderno: "vv-font-studio-modern",
    romantico: "vv-font-serenata-script",
    minimalista: "vv-font-viva-sans",
    rustico: "vv-font-poise-serif",
    boho: "vv-font-love-note",
  };

  return map[clean] || "vv-font-editorial-classic";
}

function getTypographyLabel(fontStyle?: string | null): string {
  const labels: Record<string, string> = {
    "serenata-script": "Serenata",
    "editorial-classic": "Editorial Classic",
    "viva-sans": "Viva Sans",
    "poise-serif": "Poise",
    "empire-serif": "Empire",
    "roman-elegance": "Roman Elegance",
    classical: "Classical",
    beaumont: "Beaumont",
    "studio-modern": "Studio Modern",
    "urban-clean": "Urban Clean",
    contour: "Contour",
    typewriter: "Typewriter",
    "champagne-script": "Champagne",
    chandelier: "Chandelier",
    wellington: "Wellington",
    sacramento: "Sacramento",
    "love-note": "Love Note",
    "soft-signature": "Soft Signature",
    sunkissed: "Sunkissed",
    "beautiful-script": "Beautiful",
    honey: "Honey",
    bubble: "Bubble",
    "peace-love": "Peace & Love",
    papercute: "Papercute",
  };

  return labels[(fontStyle || "").trim()] || "Editorial Classic";
}

type HeroLayout =
  | "centralizado"
  | "tela-cheia"
  | "meio-a-meio"
  | "cinematografica"
  | "circular"
  | "oval"
  | "foto-moldura"
  | "editorial-cartao"
  | "monograma-clean"
  | "convite-luxo";

function normalizeHeroLayout(value?: string | null): HeroLayout {
  if (value === "tela-cheia") return "tela-cheia";
  if (value === "meio-a-meio") return "meio-a-meio";
  if (value === "cinematografica") return "cinematografica";
  if (value === "circular") return "circular";
  if (value === "oval") return "oval";
  if (value === "foto-moldura") return "foto-moldura";
  if (value === "editorial-cartao") return "editorial-cartao";
  if (value === "monograma-clean") return "monograma-clean";
  if (value === "convite-luxo") return "convite-luxo";
  return "centralizado";
}

function getHeroLayoutLabel(layout: HeroLayout): string {
  if (layout === "tela-cheia") return "Tela cheia";
  if (layout === "meio-a-meio") return "Meio a meio";
  if (layout === "cinematografica") return "Cinematográfica";
  if (layout === "circular") return "Foto circular";
  if (layout === "oval") return "Foto oval";
  if (layout === "foto-moldura") return "Moldura editorial";
  if (layout === "editorial-cartao") return "Cartão sobreposto";
  if (layout === "monograma-clean") return "Monograma clean";
  if (layout === "convite-luxo") return "Convite luxuoso";
  return "Editorial central";
}

function slugifyTemplate(value?: string | null): string {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function detectTemplateFromText(event?: EventData | null): string | null {
  const raw =
    `${event?.templateKey || ""} ${event?.template || ""} ${event?.themeKey || ""} ${event?.eventType || ""} ${event?.description || ""} ${event?.name || ""}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const checks: Array<[string, string[]]> = [
    [
      "casamento-serenata",
      [
        "casamento-serenata",
        "casamento serenata",
        "serenata de amor",
        "serenata",
      ],
    ],
    [
      "corporativo-premium",
      [
        "corporativo-premium",
        "corporativo premium",
        "evento corporativo",
        "corporativo",
      ],
    ],
    [
      "casa-nova-clean",
      ["casa-nova-clean", "casa nova clean", "open house", "casa nova"],
    ],
    [
      "cha-bebe-delicado",
      ["cha-bebe-delicado", "bebe delicado", "cha de bebe", "chá de bebê"],
    ],
    [
      "cha-cozinha-elegante",
      [
        "cha-cozinha-elegante",
        "cha de cozinha",
        "chá de cozinha",
        "cha panela",
        "chá panela",
      ],
    ],
    [
      "casamento-romantico",
      ["casamento-romantico", "casamento romantico", "casamento romântico"],
    ],
    ["casamento-luxo", ["casamento-luxo", "casamento luxo", "black tie"]],
    [
      "casamento-rustico",
      ["casamento-rustico", "casamento rustico", "casamento rústico"],
    ],
    ["casamento-folhas", ["casamento-folhas", "casamento folhas", "folhas"]],
    ["debutante-luxo", ["debutante-luxo", "debutante luxo", "15 anos"]],
    [
      "formatura-classica",
      [
        "formatura-classica",
        "formatura classica",
        "formatura clássica",
        "formatura",
      ],
    ],
  ];

  const found = checks.find(([, patterns]) =>
    patterns.some((pattern) => raw.includes(pattern)),
  );

  return found?.[0] ?? null;
}

function getTemplateKey(event?: EventData | null): string {
  const explicit = slugifyTemplate(
    event?.templateKey || event?.template || event?.themeKey || "",
  );

  if (explicit) return explicit;

  return (
    detectTemplateFromText(event) ||
    slugifyTemplate(event?.eventType) ||
    "modelo-personalizado"
  );
}

function getTemplateLabel(event?: EventData | null): string {
  const key = getTemplateKey(event);

  if (!key || key === "modelo-personalizado") return "Modelo personalizado";

  const labels: Record<string, string> = {
    "casamento-serenata": "Casamento Serenata",
    "casamento-romantico": "Casamento Romântico",
    "casamento-rustico": "Casamento Rústico",
    "casamento-folhas": "Casamento Folhas",
    "casamento-luxo": "Casamento Luxo",
    "cha-bebe-delicado": "Chá de Bebê Delicado",
    "bebe-delicado": "Chá de Bebê Delicado",
    "cha-cozinha-elegante": "Chá de Cozinha Elegante",
    "casa-nova-clean": "Casa Nova Clean",
    "debutante-luxo": "Debutante Luxo",
    "formatura-classica": "Formatura Clássica",
    "corporativo-premium": "Corporativo Premium",
  };

  if (labels[key]) return labels[key];

  return key
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getTemplateClass(event?: EventData | null): string {
  return getTemplateKey(event).replace(/[^a-z0-9-]/g, "-") || "personalizado";
}

type TemplateVariant =
  | "serenata"
  | "corporativo"
  | "casa-nova"
  | "baby"
  | "kitchen"
  | "luxury"
  | "default";

function getTemplateVariant(event?: EventData | null): TemplateVariant {
  const key = getTemplateKey(event);

  if (key === "casamento-serenata") return "serenata";
  if (key === "corporativo-premium") return "corporativo";
  if (key === "casa-nova-clean") return "casa-nova";
  if (key === "cha-bebe-delicado" || key === "bebe-delicado") return "baby";
  if (key === "cha-cozinha-elegante") return "kitchen";
  if (
    key === "casamento-luxo" ||
    key === "debutante-luxo" ||
    key === "formatura-classica"
  )
    return "luxury";

  return "default";
}


type TemplateSectionName = "countdown" | "story" | "gallery" | "location" | "gifts" | "rsvp";

type TemplateDna = {
  key: string;
  defaultHeroLayout: HeroLayout;
  heroFallbackImage: string;
  coverImages: Array<{ label: string; url: string }>;
  sections: Record<TemplateSectionName, boolean>;
  copy: {
    countdownEyebrow: string;
    countdownTitle: string;
    countdownDescription: string;
    storyEyebrow: string;
    storyTitle: string;
    storyDescription: string;
    storyInnerTitle: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryDescription: string;
    locationEyebrow: string;
    locationTitle: string;
    locationDescription: string;
    giftsEyebrow: string;
    giftsTitle: string;
    giftsDescription: string;
    rsvpEyebrow: string;
    rsvpTitle: string;
    rsvpDescription: string;
    rsvpInnerTitle: string;
    rsvpInnerDescription: string;
  };
};

const CORPORATE_COVER_IMAGES = [
  { label: "Auditório", url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=90" },
  { label: "Networking", url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90" },
  { label: "Palestra", url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=90" },
  { label: "Marca", url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=90" },
];

const HOUSE_COVER_IMAGES = [
  { label: "Sala", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=90" },
  { label: "Mesa", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=90" },
  { label: "Detalhe", url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=90" },
  { label: "Entrada", url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=90" },
];

const BABY_COVER_IMAGES = [
  { label: "Delicado", url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=90" },
  { label: "Família", url: "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1600&q=90" },
  { label: "Enxoval", url: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1600&q=90" },
  { label: "Suave", url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1600&q=90" },
];

const KITCHEN_COVER_IMAGES = [
  { label: "Mesa", url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=90" },
  { label: "Cozinha", url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=90" },
  { label: "Brunch", url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=90" },
  { label: "Detalhes", url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1600&q=90" },
];

function getDefaultTemplateCopy(): TemplateDna["copy"] {
  return {
    countdownEyebrow: "Contagem regressiva",
    countdownTitle: "O grande dia está chegando",
    countdownDescription: "A contagem usa a data cadastrada na primeira etapa. Se a data estiver errada, ajuste os dados do evento.",
    storyEyebrow: "Mensagem de abertura",
    storyTitle: "Bem-vindos ao nosso site",
    storyDescription: "Essa área aparece como apresentação inicial para os convidados.",
    storyInnerTitle: "Bem-vindos ao nosso site",
    galleryEyebrow: "Galeria",
    galleryTitle: "Fotos que contam essa história",
    galleryDescription: "Aqui aparecem as fotos cadastradas para a galeria. Se ainda não houver fotos, o cliente já sabe onde completar.",
    locationEyebrow: "Localização",
    locationTitle: "Onde tudo vai acontecer",
    locationDescription: "O endereço cadastrado alimenta a área de localização e ajuda o convidado a chegar sem confusão.",
    giftsEyebrow: "Presentes",
    giftsTitle: "Lista de presentes",
    giftsDescription: "A lista pode começar com sugestões do modelo ou ser criada manualmente pelo cliente.",
    rsvpEyebrow: "RSVP",
    rsvpTitle: "Confirmação de presença",
    rsvpDescription: "Esta área prepara o convidado para confirmar presença no site público.",
    rsvpInnerTitle: "Confirme sua presença",
    rsvpInnerDescription: "Sua presença é muito importante. No site público, o convidado poderá confirmar presença e o anfitrião acompanha tudo pelo painel.",
  };
}

function getTemplateDna(event?: EventData | null): TemplateDna {
  const variant = getTemplateVariant(event);
  const baseCopy = getDefaultTemplateCopy();

  if (variant === "corporativo") {
    return {
      key: "corporativo-premium",
      defaultHeroLayout: "meio-a-meio",
      heroFallbackImage: CORPORATE_COVER_IMAGES[0].url,
      coverImages: CORPORATE_COVER_IMAGES,
      sections: {
        countdown: false,
        story: true,
        gallery: false,
        location: true,
        gifts: false,
        rsvp: true,
      },
      copy: {
        ...baseCopy,
        storyEyebrow: "Sobre o evento",
        storyTitle: "Uma experiência pensada para sua marca",
        storyDescription: "Este bloco apresenta objetivo, público e posicionamento do encontro.",
        storyInnerTitle: "Conteúdo, conexão e presença de marca",
        locationEyebrow: "Local do encontro",
        locationTitle: "Onde a experiência acontece",
        locationDescription: "Mostre o endereço do evento, auditório, hotel ou espaço de convenções.",
        giftsEyebrow: "Apoios",
        giftsTitle: "Inscrições, apoios e cotas",
        giftsDescription: "Use esta área apenas se o evento tiver cotas, apoios ou inscrições pagas.",
        rsvpEyebrow: "Inscrição",
        rsvpTitle: "Confirmação ou inscrição",
        rsvpDescription: "Área objetiva para o convidado confirmar presença no evento corporativo.",
        rsvpInnerTitle: "Confirmar participação",
        rsvpInnerDescription: "No site público, o participante poderá confirmar presença e a organização acompanha tudo pelo painel.",
      },
    };
  }

  if (variant === "casa-nova") {
    return {
      key: "casa-nova-clean",
      defaultHeroLayout: "meio-a-meio",
      heroFallbackImage: HOUSE_COVER_IMAGES[0].url,
      coverImages: HOUSE_COVER_IMAGES,
      sections: {
        countdown: false,
        story: true,
        gallery: false,
        location: true,
        gifts: true,
        rsvp: true,
      },
      copy: {
        ...baseCopy,
        storyEyebrow: "Boas-vindas",
        storyTitle: "Um novo endereço para novas memórias",
        storyDescription: "Mensagem curta para apresentar a casa nova e convidar pessoas próximas.",
        storyInnerTitle: "As portas estão abertas",
        locationTitle: "Nosso novo endereço",
        locationDescription: "Ajude os convidados a encontrarem a casa sem confusão.",
        giftsTitle: "Itens para a casa nova",
        giftsDescription: "Sugestões úteis para montar a casa com carinho.",
      },
    };
  }

  if (variant === "baby") {
    return {
      key: "cha-bebe-delicado",
      defaultHeroLayout: "centralizado",
      heroFallbackImage: BABY_COVER_IMAGES[0].url,
      coverImages: BABY_COVER_IMAGES,
      sections: {
        countdown: true,
        story: true,
        gallery: true,
        location: true,
        gifts: true,
        rsvp: true,
      },
      copy: {
        ...baseCopy,
        storyEyebrow: "Mensagem da família",
        storyTitle: "Uma chegada esperada com muito amor",
        storyDescription: "Apresente o carinho da família e o clima do encontro.",
        storyInnerTitle: "Esperamos você com carinho",
        galleryTitle: "Fotos da família e desse momento",
        giftsTitle: "Lista de enxoval",
      },
    };
  }

  if (variant === "kitchen") {
    return {
      key: "cha-cozinha-elegante",
      defaultHeroLayout: "centralizado",
      heroFallbackImage: KITCHEN_COVER_IMAGES[0].url,
      coverImages: KITCHEN_COVER_IMAGES,
      sections: {
        countdown: true,
        story: true,
        gallery: false,
        location: true,
        gifts: true,
        rsvp: true,
      },
      copy: {
        ...baseCopy,
        storyEyebrow: "Encontro especial",
        storyTitle: "Um encontro para celebrar a nova fase",
        storyDescription: "Mostre a mensagem principal do chá e o clima do encontro.",
        storyInnerTitle: "Vamos celebrar juntos",
        giftsTitle: "Lista de cozinha",
        giftsDescription: "Itens práticos e bonitos para começar essa nova fase.",
      },
    };
  }

  if (variant === "serenata") {
    return {
      key: "casamento-serenata",
      defaultHeroLayout: "cinematografica",
      heroFallbackImage: FALLBACK_HERO_IMAGE,
      coverImages: QUICK_COVER_IMAGES,
      sections: {
        countdown: true,
        story: true,
        gallery: true,
        location: true,
        gifts: true,
        rsvp: true,
      },
      copy: {
        ...baseCopy,
        storyTitle: "Cada olhar nos trouxe até aqui",
        storyInnerTitle: "Bem-vindos ao nosso site",
      },
    };
  }

  if (variant === "luxury") {
    return {
      key: "editorial-luxo",
      defaultHeroLayout: "cinematografica",
      heroFallbackImage: FALLBACK_HERO_IMAGE,
      coverImages: QUICK_COVER_IMAGES,
      sections: {
        countdown: true,
        story: true,
        gallery: true,
        location: true,
        gifts: true,
        rsvp: true,
      },
      copy: {
        ...baseCopy,
        storyTitle: "Uma celebração para ficar na memória",
      },
    };
  }

  return {
    key: "modelo-personalizado",
    defaultHeroLayout: "centralizado",
    heroFallbackImage: FALLBACK_HERO_IMAGE,
    coverImages: QUICK_COVER_IMAGES,
    sections: {
      countdown: true,
      story: true,
      gallery: true,
      location: true,
      gifts: true,
      rsvp: true,
    },
    copy: baseCopy,
  };
}

function getVisualSectionValue(visual: VisualSettings | null | undefined, section: TemplateSectionName): boolean | null | undefined {
  if (section === "countdown") return visual?.showCountdown;
  if (section === "story") return visual?.showStory;
  if (section === "gallery") return visual?.showGallery;
  if (section === "location") return visual?.showLocation;
  if (section === "gifts") return visual?.showGifts;
  return visual?.showRsvp;
}

function getEventSectionValue(event: EventData | null | undefined, section: TemplateSectionName): boolean | null | undefined {
  if (section === "story") return event?.showStory;
  if (section === "gallery") return event?.showGallery;
  if (section === "gifts") return event?.showGifts;
  if (section === "rsvp") return event?.showRsvp;
  return null;
}

function resolveTemplateSectionVisibility(
  defaultValue: boolean,
  visualValue?: boolean | null,
  eventValue?: boolean | null,
): boolean {
  if (visualValue === true) return eventValue !== false;
  if (visualValue === false) return false;
  if (eventValue === false) return false;
  return defaultValue;
}

function getTemplateSectionVisibility(
  event: EventData | null | undefined,
  visual: VisualSettings | null | undefined,
  section: TemplateSectionName,
): boolean {
  const dna = getTemplateDna(event);
  return resolveTemplateSectionVisibility(
    dna.sections[section],
    getVisualSectionValue(visual, section),
    getEventSectionValue(event, section),
  );
}

function resolveTemplateHeroLayout(event?: EventData | null, visualHeroLayout?: string | null): HeroLayout {
  const dna = getTemplateDna(event);
  const normalizedVisualLayout = normalizeHeroLayout(visualHeroLayout);

  if (!visualHeroLayout) return dna.defaultHeroLayout;

  if (dna.defaultHeroLayout !== "centralizado" && normalizedVisualLayout === "centralizado") {
    return dna.defaultHeroLayout;
  }

  return normalizedVisualLayout;
}

function getVariantLabel(variant: TemplateVariant): string {
  if (variant === "serenata")
    return "estrutura romântica com pausas cinematográficas";
  if (variant === "corporativo")
    return "estrutura corporativa em capa meio a meio";
  if (variant === "casa-nova") return "estrutura clean de casa nova";
  if (variant === "baby") return "estrutura delicada de chá de bebê";
  if (variant === "kitchen") return "estrutura acolhedora de chá de cozinha";
  if (variant === "luxury") return "estrutura editorial de luxo";
  return "estrutura personalizada do VivaLista";
}

function getTemplateStoryTitle(variant: TemplateVariant): string {
  if (variant === "serenata") return "Cada olhar nos trouxe até aqui";
  if (variant === "corporativo")
    return "Uma experiência pensada para sua marca";
  if (variant === "casa-nova") return "Um novo endereço para novas memórias";
  if (variant === "baby") return "Uma chegada esperada com muito amor";
  if (variant === "kitchen") return "Um encontro para celebrar a nova fase";
  if (variant === "luxury") return "Uma celebração para ficar na memória";
  return "Bem-vindos ao nosso site";
}

function getTemplateGalleryTitle(variant: TemplateVariant): string {
  if (variant === "corporativo") return "Momentos, palestrantes e bastidores";
  if (variant === "casa-nova") return "Cantinhos, detalhes e inspirações";
  if (variant === "baby") return "Fotos da família e desse momento";
  if (variant === "kitchen") return "Detalhes do encontro";
  return "Fotos que contam essa história";
}

function getTemplateGiftTitle(variant: TemplateVariant): string {
  if (variant === "corporativo") return "Inscrições, apoios e cotas";
  if (variant === "casa-nova") return "Itens para a casa nova";
  if (variant === "baby") return "Lista de enxoval";
  if (variant === "kitchen") return "Lista de cozinha";
  return "Lista de presentes";
}

function getCountdownParts(date?: string | null, now = Date.now()) {
  if (!date) {
    return { days: "--", hours: "--", minutes: "--", seconds: "--" };
  }

  const target = new Date(date).getTime();

  if (Number.isNaN(target)) {
    return { days: "--", hours: "--", minutes: "--", seconds: "--" };
  }

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: String(days),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function CountdownGrid({ date }: { date?: string | null }) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const countdownParts = useMemo(
    () => getCountdownParts(date, currentTime),
    [currentTime, date],
  );

  return (
    <div className="vv-countdown-grid" aria-label="Contagem regressiva do evento">
      <div className="vv-countdown-item">
        <strong>{countdownParts.days}</strong>
        <span>Dias</span>
      </div>
      <div className="vv-countdown-item">
        <strong>{countdownParts.hours}</strong>
        <span>Horas</span>
      </div>
      <div className="vv-countdown-item">
        <strong>{countdownParts.minutes}</strong>
        <span>Minutos</span>
      </div>
      <div className="vv-countdown-item">
        <strong>{countdownParts.seconds}</strong>
        <span>Segundos</span>
      </div>
    </div>
  );
}

function countFilledItems(items: boolean[]): number {
  return items.filter(Boolean).length;
}

function EditButton({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="vv-edit-button">
        <span className="vv-pencil" aria-hidden="true">✎</span>
        <span>{children}</span>
      </button>
    );
  }

  return (
    <Link href={href || "#editor-rapido"} className="vv-edit-button">
      <span className="vv-pencil" aria-hidden="true">✎</span>
      <span>{children}</span>
    </Link>
  );
}

function TopAction({
  href,
  onClick,
  children,
  primary,
  target,
}: {
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
  primary?: boolean;
  target?: string;
}) {
  const className = primary
    ? "vv-top-action vv-top-action-primary"
    : "vv-top-action";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href || "#editor-rapido"}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

function SiteSectionCard({
  eyebrow,
  title,
  description,
  href,
  onEdit,
  buttonLabel,
  children,
  isComplete = false,
}: SiteSectionCardProps) {
  return (
    <section className={`vv-section-card ${isComplete ? "vv-section-complete" : "vv-section-pending"}`}>
      <div className="vv-section-head">
        <div>
          <p className="vv-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="vv-section-actions">
          <span
            className={`vv-section-status ${isComplete ? "vv-section-status-complete" : "vv-section-status-pending"}`}
            title={isComplete ? "Seção preenchida" : "Seção pendente"}
            aria-label={isComplete ? "Seção preenchida" : "Seção pendente"}
          />
          <EditButton href={href} onClick={onEdit}>{buttonLabel}</EditButton>
        </div>
      </div>
      {children}
    </section>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#fffaf3] px-6 py-10 text-[#2b1729]">
      <div className="mx-auto max-w-4xl rounded-[36px] border border-[#eadfce] bg-white p-8 text-center shadow-[0_24px_80px_rgba(65,45,23,0.08)]">
        <img
          src="/logo-vivalista.png"
          alt="VivaLista"
          className="mx-auto h-auto w-64 max-w-full"
        />
        <h1 className="mt-6 text-3xl font-light tracking-[-0.04em]">
          Carregando seu site quase pronto...
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#7d6e64]">
          Estamos buscando dados, visual, imagens, presentes e seções do evento.
        </p>
      </div>
    </main>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#fffaf3] px-6 py-10 text-[#2b1729]">
      <div className="mx-auto max-w-4xl rounded-[36px] border border-red-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(65,45,23,0.08)]">
        <img
          src="/logo-vivalista.png"
          alt="VivaLista"
          className="mx-auto h-auto w-64 max-w-full"
        />
        <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-red-600">
          erro ao carregar
        </p>
        <h1 className="mt-3 text-3xl font-light tracking-[-0.04em]">
          Não conseguimos abrir a montagem do site.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#7d6e64]">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-[#2b1729] px-6 py-3 text-sm font-bold text-white"
          >
            Tentar novamente
          </button>
          <Link
            href="/dashboard/eventos"
            className="rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-bold text-[#2b1729]"
          >
            Voltar para eventos
          </Link>
        </div>
      </div>
    </main>
  );
}

function TemplateExperienceBlocks({
  variant,
  event,
  visual,
  title,
  welcomeMessage,
  heroImageUrl,
  storyImageUrl,
  locationImageUrl,
  galleryPath,
  visualPath,
  contentVisualPath,
  onOpenEditor,
  onOpenStoryPhotoEditor,
}: {
  variant: TemplateVariant;
  event: EventData | null;
  visual: VisualSettings | null;
  title: string;
  welcomeMessage: string;
  heroImageUrl: string;
  storyImageUrl: string;
  locationImageUrl: string;
  galleryPath: string;
  visualPath: string;
  contentVisualPath: string;
  onOpenEditor: (mode: EditorMode) => void;
  onOpenStoryPhotoEditor: () => void;
}) {
  if (variant === "serenata") {
    return (
      <>
        <section className="vv-template-moment vv-template-moment-right">
          <div
            className="vv-template-moment-image"
            style={{ backgroundImage: `url(${storyImageUrl})` }}
          />
          <div className="vv-template-moment-card">
            <p className="vv-eyebrow">O casal</p>
            <h2>Cada olhar nos trouxe até aqui</h2>
            <p>
              Este bloco é próprio do modelo Serenata: fotos grandes aparecem
              durante a rolagem e criam uma sensação de site romântico e
              cinematográfico.
            </p>
            <EditButton onClick={onOpenStoryPhotoEditor}>
              Trocar foto do momento
            </EditButton>
          </div>
        </section>

        <section className="vv-serenata-letter">
          <p className="vv-eyebrow">Mensagem do site</p>
          <h2>{getTemplateStoryTitle(variant)}</h2>
          <p>{welcomeMessage}</p>
          <EditButton onClick={() => onOpenEditor("texto")}>Editar texto e cores</EditButton>
        </section>

        <section className="vv-template-moment vv-template-moment-left">
          <div
            className="vv-template-moment-image"
            style={{
              backgroundImage: `url(${locationImageUrl || heroImageUrl})`,
            }}
          />
          <div className="vv-template-moment-card">
            <p className="vv-eyebrow">Depois do sim</p>
            <h2>A festa começa quando vocês chegam</h2>
            <p>
              Use esta área para criar aquele respiro visual que aparece nos
              modelos premium de casamento, sem virar um painel técnico.
            </p>
            <EditButton onClick={() => onOpenEditor("fotos")}>Completar galeria</EditButton>
          </div>
        </section>
      </>
    );
  }

  if (variant === "corporativo") {
    return (
      <section className="vv-corporate-structure">
        <div className="vv-corporate-head">
          <p className="vv-eyebrow">Estrutura do modelo</p>
          <h2>Programação, palestrantes e presença de marca</h2>
          <p>
            O modelo Corporativo Premium não usa estrutura romântica. Ele abre
            com capa meio a meio e organiza o evento como página profissional.
          </p>
        </div>

        <div className="vv-corporate-grid">
          <article>
            <span>09:00</span>
            <strong>Credenciamento</strong>
            <p>Recepção dos participantes e abertura do encontro.</p>
          </article>
          <article>
            <span>10:00</span>
            <strong>Palestra principal</strong>
            <p>Momento de conteúdo, marca e posicionamento.</p>
          </article>
          <article>
            <span>14:00</span>
            <strong>Networking</strong>
            <p>Espaço para conexões, parceiros e convidados.</p>
          </article>
        </div>

        <div className="vv-corporate-kpis">
          <div>
            <strong>01</strong>
            <span>evento</span>
          </div>
          <div>
            <strong>03</strong>
            <span>blocos</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>editável</span>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "casa-nova") {
    return (
      <section className="vv-house-structure">
        <div className="vv-house-copy">
          <p className="vv-eyebrow">Casa nova</p>
          <h2>Um site clean para abrir as portas</h2>
          <p>
            O modelo Casa Nova Clean usa blocos claros, painéis suaves e uma
            leitura leve. A ideia é parecer convite de open house, não
            dashboard.
          </p>
          <EditButton onClick={() => onOpenEditor("fotos")}>
            Adicionar fotos da casa
          </EditButton>
        </div>
        <div className="vv-house-panels">
          <div style={{ backgroundImage: `url(${heroImageUrl})` }} />
          <div style={{ backgroundImage: `url(${storyImageUrl})` }} />
          <div style={{ backgroundImage: `url(${locationImageUrl})` }} />
        </div>
      </section>
    );
  }

  if (variant === "baby" || variant === "kitchen") {
    return (
      <section className="vv-soft-structure">
        <p className="vv-eyebrow">Estrutura do modelo</p>
        <h2>
          {variant === "baby"
            ? "Um carinho para a chegada do bebê"
            : "Uma nova fase começa pela cozinha"}
        </h2>
        <p>
          {variant === "baby"
            ? "Este modelo valoriza mensagem da família, enxoval, confirmação e fotos delicadas."
            : "Este modelo valoriza encontro, lista de cozinha, localização e contribuição livre."}
        </p>
      </section>
    );
  }

  if (variant === "luxury") {
    return (
      <section className="vv-luxury-structure">
        <p className="vv-eyebrow">Estrutura do modelo</p>
        <h2>{title}</h2>
        <p>
          Este modelo usa contraste, impacto visual, galeria editorial e uma
          leitura mais sofisticada.
        </p>
      </section>
    );
  }

  return null;
}

function getEditorTitle(mode: EditorMode): string {
  if (mode === "capa") return "Capa, cores e letras";
  if (mode === "texto") return "Textos do site";
  if (mode === "dados") return "Dados principais";
  if (mode === "data") return "Data e horário";
  if (mode === "local") return "Localização";
  if (mode === "secoes") return "Seções do site";
  if (mode === "fotos") return "Fotos e galeria";
  if (mode === "presentes") return "Presentes";
  if (mode === "convidados") return "Convidados e RSVP";
  return "Editar site";
}

function getEditorIcon(mode: EditorMode): string {
  if (mode === "capa") return "✦";
  if (mode === "texto") return "âœ";
  if (mode === "dados") return "☰";
  if (mode === "data") return "â—·";
  if (mode === "local") return "⌖";
  if (mode === "secoes") return "☷";
  if (mode === "fotos") return "▧";
  if (mode === "presentes") return "◇";
  if (mode === "convidados") return "☑";
  return "✎";
}

function getEditorHint(mode: EditorMode): string {
  if (mode === "capa") return "Foto, formato, cores e letras.";
  if (mode === "texto") return "Título, subtítulo e mensagem.";
  if (mode === "dados") return "Dados principais do evento.";
  if (mode === "data") return "Data e horário.";
  if (mode === "local") return "Local do evento.";
  if (mode === "secoes") return "Seções do site.";
  if (mode === "fotos") return "Fotos.";
  if (mode === "presentes") return "Presentes.";
  if (mode === "convidados") return "Convidados e RSVP.";
  return "Edite apenas o bloco selecionado.";
}

export default function MontarSitePage() {
  const params = useParams<{ eventId: string }>();

  const eventId = useMemo(() => {
    const raw = params?.eventId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [event, setEvent] = useState<EventData | null>(null);
  const [visual, setVisual] = useState<VisualSettings | null>(null);
  const [sectionMedia, setSectionMedia] = useState<SectionMedia[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("capa");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorDraft, setEditorDraft] = useState<EditorDraft>(() =>
    buildEditorDraft(null, null),
  );
  const [localHeroPreview, setLocalHeroPreview] = useState<string | null>(null);
  const [selectedHeroFile, setSelectedHeroFile] = useState<File | null>(null);
  const [localStoryPreview, setLocalStoryPreview] = useState<string | null>(null);
  const [selectedStoryFile, setSelectedStoryFile] = useState<File | null>(null);
  const [localLocationPreview, setLocalLocationPreview] = useState<string | null>(null);
  const [selectedLocationFile, setSelectedLocationFile] = useState<File | null>(null);
  const [photoEditorTarget, setPhotoEditorTarget] = useState<PhotoEditorTarget>("gallery");
  const [localGalleryPreviews, setLocalGalleryPreviews] = useState<string[]>([]);
  const [inlineSaving, setInlineSaving] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  const [inlineMessage, setInlineMessage] = useState<string | null>(null);
  const loadRequestRef = useRef(0);
  const editorInteractionRef = useRef(0);

  const backendUrl = useMemo(() => getBackendUrl(), []);
  const baseEditorDraft = useMemo(
    () => buildEditorDraft(event, visual),
    [event, visual],
  );

  const panelPath = event?.id
    ? `/dashboard/eventos/${event.id}`
    : "/dashboard/eventos";
  const visualPath = event?.id
    ? `/dashboard/eventos/${event.id}/visual`
    : "/dashboard/eventos";
  const contentVisualPath = event?.id
    ? `/dashboard/eventos/${event.id}/conteudo-visual`
    : "/dashboard/eventos";
  const galleryPath = event?.id
    ? `/dashboard/eventos/${event.id}/galeria`
    : "/dashboard/eventos";
  const giftsPath = event?.id
    ? `/dashboard/eventos/${event.id}/presentes`
    : "/dashboard/eventos";
  const guestsPath = event?.id
    ? `/dashboard/eventos/${event.id}/convidados`
    : "/dashboard/eventos";
  const publicPath = event?.slug ? `/e/${event.slug}` : null;

  const activeMedia = useMemo(() => {
    return sectionMedia
      .filter((item) => item.isActive !== false)
      .sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      });
  }, [sectionMedia]);

  const mediaBySection = useMemo(() => {
    return activeMedia.reduce(
      (acc, item) => {
        if (!acc[item.sectionKey]) acc[item.sectionKey] = [];
        acc[item.sectionKey]?.push(item);
        return acc;
      },
      {} as Partial<Record<SectionKey, SectionMedia[]>>,
    );
  }, [activeMedia]);

  const heroMedia =
    mediaBySection.HERO?.find((item) => item.isPrimary) ||
    mediaBySection.HERO?.[0] ||
    activeMedia.find((item) => item.isPrimary);

  const storyMedia =
    mediaBySection.STORY?.[0] || mediaBySection.COUPLE?.[0] || activeMedia[1];

  const locationMedia = mediaBySection.LOCATION?.[0] || activeMedia[2];

  const galleryMedia =
    mediaBySection.GALLERY && mediaBySection.GALLERY.length > 0
      ? mediaBySection.GALLERY
      : [];

  const previewDraft = editorOpen ? editorDraft : null;
  const previewDateIso = previewDraft?.eventDate
    ? fromDatetimeLocalValue(previewDraft.eventDate)
    : null;
  const previewLocation = previewDraft?.eventLocation.trim() || event?.location || "";

  const templateDna = useMemo(() => getTemplateDna(event), [event]);
  const heroImageUrl =
    buildAssetUrl(localHeroPreview) ||
    buildAssetUrl(previewDraft?.heroImageUrl) ||
    buildAssetUrl(visual?.heroImageUrl) ||
    buildAssetUrl(event?.heroImageUrl) ||
    buildAssetUrl(event?.coverImage) ||
    buildAssetUrl(heroMedia?.imageUrl) ||
    templateDna.heroFallbackImage;

  const storyImageUrl =
    buildAssetUrl(localStoryPreview) ||
    buildAssetUrl(storyMedia?.imageUrl) ||
    FALLBACK_STORY_IMAGE;
  const locationImageUrl =
    buildAssetUrl(localLocationPreview) ||
    buildAssetUrl(locationMedia?.imageUrl) ||
    FALLBACK_LOCATION_IMAGE;
  const title = previewDraft?.publicTitle || visual?.publicTitle || event?.name || "Seu evento";
  const subtitle =
    previewDraft?.publicSubtitle ||
    visual?.publicSubtitle ||
    event?.description ||
    "Uma celebração especial criada com carinho no VivaLista.";
  const welcomeMessage =
    previewDraft?.welcomeMessage ||
    visual?.welcomeMessage ||
    event?.description ||
    "Estamos muito felizes em compartilhar este momento especial com vocês. Aqui você encontra as principais informações do evento, fotos, presentes e confirmação de presença.";
  const primaryColor = previewDraft?.primaryColor || visual?.primaryColor || "#43263f";
  const secondaryColor = previewDraft?.secondaryColor || visual?.secondaryColor || "#c4a262";
  const typography = parseTypographyPayload(
    previewDraft ? buildTypographyPayload(previewDraft) : visual?.fontStyle,
  );
  const heroLayout = previewDraft
    ? previewDraft.heroLayout
    : resolveTemplateHeroLayout(event, visual?.heroLayout);
  const heroLayoutLabel = getHeroLayoutLabel(heroLayout);
  const templateLabel = getTemplateLabel(event);
  const templateClass = getTemplateClass(event);
  const templateVariant = getTemplateVariant(event);
  const titleParts = splitTitle(title);
  const showCountdown = previewDraft
    ? previewDraft.showCountdown
    : getTemplateSectionVisibility(event, visual, "countdown");
  const showStory = previewDraft
    ? previewDraft.showStory
    : getTemplateSectionVisibility(event, visual, "story");
  const showGallery = previewDraft
    ? previewDraft.showGallery
    : getTemplateSectionVisibility(event, visual, "gallery");
  const showLocation = previewDraft
    ? previewDraft.showLocation
    : getTemplateSectionVisibility(event, visual, "location");
  const showGifts = previewDraft
    ? previewDraft.showGifts
    : getTemplateSectionVisibility(event, visual, "gifts");
  const showRsvp = previewDraft
    ? previewDraft.showRsvp
    : getTemplateSectionVisibility(event, visual, "rsvp");

  const giftSuggestions = useMemo(() => getGiftSuggestions(event), [event]);

  const galleryDisplayItems = useMemo(() => {
    const savedItems = galleryMedia.map((item) => ({
      id: item.id,
      image: buildAssetUrl(item.imageUrl) || FALLBACK_HERO_IMAGE,
      title: item.title || "Foto da galeria",
      source: "saved" as const,
    }));

    const localItems = localGalleryPreviews.map((image, index) => ({
      id: `local-${index}`,
      image,
      title: `Foto escolhida ${index + 1}`,
      source: "local" as const,
    }));

    return [...localItems, ...savedItems];
  }, [galleryMedia, localGalleryPreviews]);

  const editorDynamicHint = useMemo(() => {
    if (editorMode === "fotos" && photoEditorTarget === "location") {
      return localLocationPreview || locationMedia?.imageUrl
        ? "Esta foto alimenta o bloco de localização. Troque abaixo e veja no site ao lado."
        : "O bloco de localização ainda usa uma imagem padrão. Escolha uma foto para personalizar.";
    }

    if (editorMode === "fotos" && photoEditorTarget === "story") {
      return localStoryPreview || storyMedia?.imageUrl
        ? "Esta foto alimenta o bloco de mensagem. Troque abaixo e veja no site ao lado."
        : "Este bloco ainda está usando uma foto padrão. Escolha uma foto para ver ao vivo.";
    }

    if (editorMode === "fotos") {
      const totalPhotos = localGalleryPreviews.length + galleryMedia.length;
      return totalPhotos > 0
        ? `Você tem ${totalPhotos} foto${totalPhotos === 1 ? "" : "s"}. Adicione mais ou remova as que não quiser.`
        : "Ainda não há fotos. Escolha abaixo para ver ao vivo.";
    }

    if (editorMode === "capa") {
      return selectedHeroFile || localHeroPreview || editorDraft.heroImageUrl
        ? "A capa já tem imagem. Troque o modelo, ajuste as cores ou escolha outra foto."
        : "Escolha uma capa rápida ou envie uma foto própria para ver ao vivo.";
    }

    if (editorMode === "data") {
      return editorDraft.eventDate
        ? "A contagem usa esta data. Ao salvar, ela também atualiza os dados do evento."
        : "Informe data e horário para ativar a contagem regressiva.";
    }

    if (editorMode === "local") {
      return editorDraft.eventLocation.trim()
        ? "O mapa já usa este local na prévia ao lado."
        : "Informe o local para liberar o mapa e o bloco de endereço.";
    }

    return getEditorHint(editorMode);
  }, [
    editorDraft.eventDate,
    editorDraft.eventLocation,
    editorDraft.heroImageUrl,
    editorMode,
    galleryMedia.length,
    localGalleryPreviews.length,
    localHeroPreview,
    localLocationPreview,
    localStoryPreview,
    locationMedia?.imageUrl,
    photoEditorTarget,
    selectedHeroFile,
    selectedLocationFile,
    storyMedia?.imageUrl,
  ]);

  const completionPercent = useMemo(() => {
    const completionItems = [
      Boolean(event?.name),
      Boolean(event?.date),
      Boolean(event?.location),
      Boolean(heroImageUrl),
      Boolean(welcomeMessage.trim()),
      ...(showGallery ? [galleryDisplayItems.length > 0] : []),
      ...(showGifts ? [gifts.length > 0] : []),
      ...(showRsvp ? [Boolean(publicPath)] : []),
    ];

    const completed = countFilledItems(completionItems);
    return Math.min(100, Math.round((completed / Math.max(1, completionItems.length)) * 100));
  }, [
    event?.date,
    event?.location,
    event?.name,
    galleryDisplayItems.length,
    gifts.length,
    heroImageUrl,
    publicPath,
    showGallery,
    showGifts,
    showRsvp,
    welcomeMessage,
  ]);

  const loadPageData = useCallback(async () => {
    if (!eventId) {
      setErrorMessage("ID do evento não encontrado na rota.");
      setLoading(false);
      return;
    }

    const requestId = loadRequestRef.current + 1;
    loadRequestRef.current = requestId;

    const isCurrentRequest = () => loadRequestRef.current === requestId;

    try {
      setLoading(true);
      setErrorMessage(null);

      const token = getAuthToken();

      const eventResponse = await fetch(`${backendUrl}/events/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (!eventResponse.ok) {
        if (eventResponse.status === 401) {
          throw new Error("Faça login novamente para acessar este evento.");
        }

        if (eventResponse.status === 403) {
          throw new Error("Você não tem permissão para acessar este evento.");
        }

        if (eventResponse.status === 404) {
          throw new Error("Evento não encontrado no backend para este ID.");
        }

        throw new Error(await readApiError(eventResponse));
      }

      const eventRaw = (await eventResponse.json()) as
        | EventData
        | { data?: EventData }
        | { event?: EventData };

      if (!isCurrentRequest()) return;

      const normalizedEvent = normalizeEventResponse(eventRaw);
      setEvent(normalizedEvent);

      const visualPromise = fetch(`${backendUrl}/events/${eventId}/visual`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      const mediaPromise = fetch(`${backendUrl}/events/${eventId}/section-media`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      const giftsPromise = normalizedEvent.slug
        ? fetch(`${backendUrl}/events/public/${normalizedEvent.slug}/gifts`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          })
        : Promise.resolve(null);

      const [visualResponse, mediaResponse, giftsResponse] = await Promise.all([
        visualPromise,
        mediaPromise,
        giftsPromise,
      ]);

      if (!isCurrentRequest()) return;

      if (visualResponse.ok) {
        const visualData = (await visualResponse.json()) as VisualResponse;
        if (!isCurrentRequest()) return;
        setVisual(visualData.visual ?? null);
      } else {
        setVisual(null);
      }

      if (mediaResponse.ok) {
        const mediaData = (await mediaResponse.json()) as SectionMediaResponse;
        if (!isCurrentRequest()) return;
        setSectionMedia(Array.isArray(mediaData.media) ? mediaData.media : []);
      } else {
        setSectionMedia([]);
      }

      if (giftsResponse && giftsResponse.ok) {
        const giftsData = (await giftsResponse.json()) as GiftsResponse | Gift[];
        if (!isCurrentRequest()) return;
        setGifts(
          Array.isArray(giftsData)
            ? giftsData
            : Array.isArray(giftsData.gifts)
              ? giftsData.gifts
              : [],
        );
      } else {
        setGifts([]);
      }
    } catch (error) {
      if (isCurrentRequest()) {
        setErrorMessage(getErrorMessage(error));
      }
    } finally {
      if (isCurrentRequest()) {
        setLoading(false);
      }
    }
  }, [backendUrl, eventId]);

  useEffect(() => {
    void loadPageData();
  }, [loadPageData]);

  useEffect(() => {
    setEditorDraft(baseEditorDraft);
  }, [baseEditorDraft]);

  useEffect(() => {
    if (!eventId || typeof window === "undefined") return;

    try {
      const saved = window.localStorage.getItem(`vivalista_gallery_preview_${eventId}`);
      if (!saved) {
        setLocalGalleryPreviews([]);
        return;
      }

      const parsed = JSON.parse(saved);
      setLocalGalleryPreviews(Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : []);
    } catch {
      setLocalGalleryPreviews([]);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId || typeof window === "undefined") return;

    try {
      const savedHero = window.localStorage.getItem(`vivalista_hero_preview_${eventId}`);
      if (savedHero && savedHero.startsWith("data:image/")) {
        setLocalHeroPreview(savedHero);
      }
    } catch {
      // A prévia local é apenas apoio visual. Se falhar, seguimos com a imagem salva no backend.
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId || typeof window === "undefined") return;

    try {
      const savedStory = window.localStorage.getItem(`vivalista_story_preview_${eventId}`);
      if (savedStory && savedStory.startsWith("data:image/")) {
        setLocalStoryPreview(savedStory);
      }
    } catch {
      // A prévia local do bloco de mensagem é apenas apoio visual.
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId || typeof window === "undefined") return;

    try {
      const savedLocation = window.localStorage.getItem(`vivalista_location_preview_${eventId}`);
      if (savedLocation && savedLocation.startsWith("data:image/")) {
        setLocalLocationPreview(savedLocation);
      }
    } catch {
      // A prévia local do bloco de localização é apenas apoio visual.
    }
  }, [eventId]);

  function markEditorInteraction() {
    editorInteractionRef.current += 1;
  }

  function savePreviewInLocalStorage(key: string, value: string, fallbackMessage: string): boolean {
    if (!eventId || typeof window === "undefined") return true;

    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      setInlineMessage(
        isQuotaExceededError(error)
          ? "A imagem apareceu na prévia, mas é pesada demais para ficar guardada no navegador. Salve ou escolha uma imagem menor."
          : fallbackMessage,
      );
      return false;
    }
  }

  function upsertLocalSectionMedia(sectionKey: SectionKey, imageUrl: string, title: string) {
    if (!eventId || !imageUrl.trim()) return;

    setSectionMedia((current) => {
      const withoutPrimaryForSection = current.filter(
        (item) => !(item.sectionKey === sectionKey && item.isPrimary),
      );

      const nextItem: SectionMedia = {
        id: `preview-${sectionKey.toLowerCase()}-${Date.now()}`,
        eventId,
        sectionKey,
        imageUrl,
        title,
        description: "Atualizado pela Etapa 3",
        mediaRole: sectionKey.toLowerCase(),
        displayOrder: 0,
        isActive: true,
        isPrimary: true,
        createdAt: new Date().toISOString(),
      };

      return [nextItem, ...withoutPrimaryForSection];
    });
  }

  function clearPendingFilesWhenChangingMode(
    mode: EditorMode,
    photoTarget: PhotoEditorTarget,
  ) {
    if (mode !== "capa") {
      setSelectedHeroFile(null);
      setLocalHeroPreview(null);

      if (eventId && typeof window !== "undefined") {
        window.localStorage.removeItem(`vivalista_hero_preview_${eventId}`);
      }
    }

    if (mode !== "fotos" || photoTarget !== "story") {
      setSelectedStoryFile(null);
      setLocalStoryPreview(null);

      if (eventId && typeof window !== "undefined") {
        window.localStorage.removeItem(`vivalista_story_preview_${eventId}`);
      }
    }

    if (mode !== "fotos" || photoTarget !== "location") {
      setSelectedLocationFile(null);
      setLocalLocationPreview(null);

      if (eventId && typeof window !== "undefined") {
        window.localStorage.removeItem(`vivalista_location_preview_${eventId}`);
      }
    }
  }

  function openInlineEditor(
    mode: EditorMode,
    photoTarget: PhotoEditorTarget = "gallery",
  ) {
    if (mode === "fotos") setPhotoEditorTarget(photoTarget);

    clearPendingFilesWhenChangingMode(mode, photoTarget);
    setEditorMode(mode);
    setEditorOpen(true);
    setEditorDraft(baseEditorDraft);
    setSaveConfirmed(false);
    setInlineMessage(null);
  }

  function openGalleryEditor() {
    openInlineEditor("fotos", "gallery");
  }

  function openStoryPhotoEditor() {
    openInlineEditor("fotos", "story");
  }

  function openLocationPhotoEditor() {
    openInlineEditor("fotos", "location");
  }

  function updateEditorDraft<K extends keyof EditorDraft>(
    key: K,
    value: EditorDraft[K],
  ) {
    markEditorInteraction();
    setEditorDraft((current) => ({ ...current, [key]: value }));
  }

  function handleInlineHeroFileChange(eventChange: ChangeEvent<HTMLInputElement>) {
    const file = eventChange.target.files?.[0];

    if (!file) return;

    const validationMessage = validateInlineImageFile(file, "a capa");
    if (validationMessage) {
      setInlineMessage(validationMessage);
      eventChange.target.value = "";
      return;
    }

    markEditorInteraction();
    setSelectedHeroFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const preview = reader.result;
        setLocalHeroPreview(preview);

        const previewStored = savePreviewInLocalStorage(
          `vivalista_hero_preview_${eventId}`,
          preview,
          "A foto apareceu na prévia, mas não consegui guardar esta imagem no navegador.",
        );

        if (previewStored) {
          setInlineMessage("Foto escolhida.");
        }
      }
    };

    reader.onerror = () => {
      setInlineMessage("Não foi possível ler a imagem escolhida.");
    };

    reader.readAsDataURL(file);
  }

  function handleInlineStoryFileChange(eventChange: ChangeEvent<HTMLInputElement>) {
    const file = eventChange.target.files?.[0];

    if (!file) return;

    const validationMessage = validateInlineImageFile(file, "este bloco");
    if (validationMessage) {
      setInlineMessage(validationMessage);
      eventChange.target.value = "";
      return;
    }

    markEditorInteraction();
    setSelectedStoryFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const preview = reader.result;
        setLocalStoryPreview(preview);

        const previewStored = savePreviewInLocalStorage(
          `vivalista_story_preview_${eventId}`,
          preview,
          "A foto apareceu na prévia, mas não consegui guardar esta imagem no navegador.",
        );

        if (previewStored) {
          setInlineMessage("Foto escolhida.");
        }
      }
    };

    reader.onerror = () => {
      setInlineMessage("Não foi possível ler a imagem escolhida.");
    };

    reader.readAsDataURL(file);
  }

  function handleInlineLocationFileChange(eventChange: ChangeEvent<HTMLInputElement>) {
    const file = eventChange.target.files?.[0];

    if (!file) return;

    const validationMessage = validateInlineImageFile(file, "o bloco de localização");
    if (validationMessage) {
      setInlineMessage(validationMessage);
      eventChange.target.value = "";
      return;
    }

    markEditorInteraction();
    setSelectedLocationFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const preview = reader.result;
        setLocalLocationPreview(preview);

        const previewStored = savePreviewInLocalStorage(
          `vivalista_location_preview_${eventId}`,
          preview,
          "A foto apareceu na prévia, mas não consegui guardar esta imagem no navegador.",
        );

        if (previewStored) {
          setInlineMessage("Foto escolhida.");
        }
      }
    };

    reader.onerror = () => {
      setInlineMessage("Não foi possível ler a imagem escolhida.");
    };

    reader.readAsDataURL(file);
  }

  function handleInlineGalleryFilesChange(eventChange: ChangeEvent<HTMLInputElement>) {
    setPhotoEditorTarget("gallery");

    const files = Array.from(eventChange.target.files || []);
    const invalidFile = files.find((file) => validateInlineImageFile(file, "a galeria"));

    if (invalidFile) {
      setInlineMessage(validateInlineImageFile(invalidFile, "a galeria"));
      eventChange.target.value = "";
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setInlineMessage("Escolha uma ou mais imagens válidas para a galeria.");
      return;
    }

    Promise.all(
      imageFiles.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") resolve(reader.result);
              else reject(new Error("Imagem inválida."));
            };
            reader.onerror = () => reject(new Error("Não foi possível ler uma imagem."));
            reader.readAsDataURL(file);
          }),
      ),
    )
      .then((images) => {
        setLocalGalleryPreviews((current) => {
          const next = [...current, ...images].slice(0, 12);

          if (eventId && typeof window !== "undefined") {
            try {
              window.localStorage.setItem(
                `vivalista_gallery_preview_${eventId}`,
                JSON.stringify(next),
              );
            } catch (error) {
              setInlineMessage(
                isQuotaExceededError(error)
                  ? "As fotos apareceram na prévia, mas são pesadas demais para guardar no navegador. Salve ou use imagens menores."
                  : "As fotos apareceram na prévia, mas não consegui guardar esta seleção no navegador.",
              );
            }
          }

          return next;
        });

        markEditorInteraction();
        setEditorMode("fotos");
        setEditorOpen(true);
        setInlineMessage("Fotos escolhidas.");
      })
      .catch(() => {
        setInlineMessage("Não foi possível carregar uma das imagens da galeria.");
      });
  }

  function clearInlineGalleryPreviews() {
    markEditorInteraction();
    setLocalGalleryPreviews([]);

    if (eventId && typeof window !== "undefined") {
      window.localStorage.removeItem(`vivalista_gallery_preview_${eventId}`);
    }

    setInlineMessage("Prévia local da galeria removida.");
  }

  function removeInlineGalleryPreview(indexToRemove: number) {
    markEditorInteraction();
    setLocalGalleryPreviews((current) => {
      const next = current.filter((_, index) => index !== indexToRemove);

      if (eventId && typeof window !== "undefined") {
        if (next.length > 0) {
          window.localStorage.setItem(
            `vivalista_gallery_preview_${eventId}`,
            JSON.stringify(next),
          );
        } else {
          window.localStorage.removeItem(`vivalista_gallery_preview_${eventId}`);
        }
      }

      return next;
    });

    setInlineMessage("Foto removida da prévia da galeria.");
  }

  function extractUploadedImageUrl(data: unknown): string | null {
    if (!data || typeof data !== "object") return null;

    const record = data as Record<string, unknown>;
    const possibleObjects = [
      record,
      record.data,
      record.media,
      record.item,
      record.file,
    ].filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));

    for (const item of possibleObjects) {
      for (const key of ["imageUrl", "url", "coverImage", "heroImageUrl", "path", "location"] as const) {
        const value = item[key];
        if (typeof value === "string" && value.trim()) return value;
      }
    }

    return null;
  }

  async function uploadHeroFileIfNeeded(token: string | null): Promise<string | null> {
    if (!selectedHeroFile || !eventId) return null;

    function createHeroFormData() {
      const formData = new FormData();
      formData.append("file", selectedHeroFile as File);
      formData.append("sectionKey", "HERO");
      formData.append("mediaRole", "capa");
      formData.append("title", editorDraft.publicTitle.trim() || editorDraft.eventName.trim() || "Capa do evento");
      formData.append("description", "Imagem principal editada na Etapa 3");
      formData.append("isActive", "true");
      formData.append("isPrimary", "true");
      return formData;
    }

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const mediaResponse = await fetch(`${backendUrl}/events/${eventId}/section-media/upload`, {
        method: "POST",
        headers,
        body: createHeroFormData(),
      });

      if (mediaResponse.ok) {
        let mediaData: unknown = null;
        try {
          mediaData = await mediaResponse.json();
        } catch {
          mediaData = null;
        }

        const mediaUrl = extractUploadedImageUrl(mediaData);
        if (mediaUrl) return mediaUrl;
      }
    } catch {
      // Se a rota de mídia ainda não estiver pronta em algum ambiente, tentamos a rota antiga de capa.
    }

    try {
      const coverResponse = await fetch(`${backendUrl}/events/${eventId}/cover-image`, {
        method: "POST",
        headers,
        body: createHeroFormData(),
      });

      if (!coverResponse.ok) return null;

      let coverData: unknown = null;
      try {
        coverData = await coverResponse.json();
      } catch {
        coverData = null;
      }

      return extractUploadedImageUrl(coverData);
    } catch {
      return null;
    }
  }

  async function uploadStoryFileIfNeeded(token: string | null): Promise<string | null> {
    if (!selectedStoryFile || !eventId) return null;

    const formData = new FormData();
    formData.append("file", selectedStoryFile as File);
    formData.append("sectionKey", "STORY");
    formData.append("mediaRole", "story");
    formData.append("title", "Foto do bloco de mensagem");
    formData.append("description", "Imagem do bloco de mensagem editada na Etapa 3");
    formData.append("isActive", "true");
    formData.append("isPrimary", "true");

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const mediaResponse = await fetch(`${backendUrl}/events/${eventId}/section-media/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!mediaResponse.ok) return null;

      let mediaData: unknown = null;
      try {
        mediaData = await mediaResponse.json();
      } catch {
        mediaData = null;
      }

      return extractUploadedImageUrl(mediaData);
    } catch {
      return null;
    }
  }

  async function uploadLocationFileIfNeeded(token: string | null): Promise<string | null> {
    if (!selectedLocationFile || !eventId) return null;

    const formData = new FormData();
    formData.append("file", selectedLocationFile as File);
    formData.append("sectionKey", "LOCATION");
    formData.append("mediaRole", "location");
    formData.append("title", "Foto do bloco de localização");
    formData.append("description", "Imagem do bloco de localização editada na Etapa 3");
    formData.append("isActive", "true");
    formData.append("isPrimary", "true");

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const mediaResponse = await fetch(`${backendUrl}/events/${eventId}/section-media/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!mediaResponse.ok) return null;

      let mediaData: unknown = null;
      try {
        mediaData = await mediaResponse.json();
      } catch {
        mediaData = null;
      }

      return extractUploadedImageUrl(mediaData);
    } catch {
      return null;
    }
  }


  async function publishAndOpenPublicSite() {
    if (!eventId || !event?.slug) {
      setErrorMessage("Evento não encontrado para publicar.");
      return;
    }

    try {
      setErrorMessage(null);
      setInlineMessage("Publicando site...");

      const token = getAuthToken();

      const response = await fetch(`${backendUrl}/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: "PUBLISHED",
        }),
      });

      if (!response.ok) {
        let apiError: { message?: string } | null = null;

        try {
          apiError = (await response.json()) as { message?: string };
        } catch {
          apiError = null;
        }

        throw new Error(
          apiError?.message || "Não foi possível publicar o site agora."
        );
      }

      setEvent((current) =>
        current
          ? {
              ...current,
              status: "PUBLISHED",
            }
          : current
      );

      window.location.href = `/e/${event.slug}`;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível publicar o site agora."
      );
    }
  }

  async function saveInlineEditor() {
    if (!eventId || !event) {
      setInlineMessage("Evento não encontrado para salvar.");
      return;
    }

    try {
      setInlineSaving(true);
      setSaveConfirmed(false);
      setInlineMessage(null);

      const token = getAuthToken();
      const authHeaders = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let uploadedHeroUrl: string | null = null;
      let heroUploadFailed = false;

      let uploadedStoryUrl: string | null = null;
      let storyUploadFailed = false;

      let uploadedLocationUrl: string | null = null;
      let locationUploadFailed = false;

      if (selectedHeroFile) {
        uploadedHeroUrl = await uploadHeroFileIfNeeded(token);
        heroUploadFailed = !uploadedHeroUrl;
      }

      if (photoEditorTarget === "story" && selectedStoryFile) {
        uploadedStoryUrl = await uploadStoryFileIfNeeded(token);
        storyUploadFailed = !uploadedStoryUrl;
      }

      if (photoEditorTarget === "location" && selectedLocationFile) {
        uploadedLocationUrl = await uploadLocationFileIfNeeded(token);
        locationUploadFailed = !uploadedLocationUrl;
      }

      if (["dados", "data", "local"].includes(editorMode)) {
        const eventPayload: Partial<EventData> = {};

        if (editorMode === "dados") {
          eventPayload.name = editorDraft.eventName.trim() || event.name;
        }

        if (editorMode === "dados" || editorMode === "local") {
          eventPayload.location = editorDraft.eventLocation.trim();
        }

        const parsedDate = fromDatetimeLocalValue(editorDraft.eventDate);
        if ((editorMode === "dados" || editorMode === "data") && parsedDate) eventPayload.date = parsedDate;

        if (Object.keys(eventPayload).length > 0) {
          let eventSaved = false;
          let lastEventError = "Não foi possível salvar os dados do evento.";

          for (const method of ["PATCH", "PUT"] as const) {
            const eventResponse = await fetch(`${backendUrl}/events/${eventId}`, {
              method,
              headers: authHeaders,
              body: JSON.stringify(eventPayload),
            });

            if (eventResponse.ok) {
              eventSaved = true;

              let updatedRaw: unknown = null;
              try {
                updatedRaw = await eventResponse.json();
              } catch {
                updatedRaw = null;
              }

              if (updatedRaw && typeof updatedRaw === "object") {
                const normalized = normalizeEventResponse(
                  updatedRaw as EventData | { data?: EventData } | { event?: EventData },
                );

                setEvent((current) => ({
                  ...(current || event),
                  ...(normalized?.id ? normalized : {}),
                  ...eventPayload,
                }));
              } else {
                setEvent((current) => ({
                  ...(current || event),
                  ...eventPayload,
                }));
              }

              break;
            }

            lastEventError = await readApiError(eventResponse);
          }

          if (!eventSaved) {
            throw new Error(lastEventError);
          }
        }
      }

      const safeHeroImageUrl =
        uploadedHeroUrl ||
        (editorDraft.heroImageUrl.trim().startsWith("data:")
          ? visual?.heroImageUrl || event?.heroImageUrl || event?.coverImage || heroMedia?.imageUrl || ""
          : editorDraft.heroImageUrl.trim());

      const visualPayload: VisualSettings = {
        publicTitle: editorDraft.publicTitle.trim() || editorDraft.eventName.trim(),
        publicSubtitle: editorDraft.publicSubtitle.trim(),
        welcomeMessage: editorDraft.welcomeMessage.trim(),
        heroImageUrl: safeHeroImageUrl,
        primaryColor: editorDraft.primaryColor.trim(),
        secondaryColor: editorDraft.secondaryColor.trim(),
        heroLayout: editorDraft.heroLayout,
        fontStyle: buildTypographyPayload(editorDraft),
        showCountdown: editorDraft.showCountdown,
        showStory: editorDraft.showStory,
        showGallery: editorDraft.showGallery,
        showLocation: editorDraft.showLocation,
        showGifts: editorDraft.showGifts,
        showRsvp: editorDraft.showRsvp,
      };

      const visualResponse = await fetch(`${backendUrl}/events/${eventId}/visual`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify(visualPayload),
      });

      if (!visualResponse.ok) {
        throw new Error(await readApiError(visualResponse));
      }

      const visualData = (await visualResponse.json()) as VisualResponse;
      const savedVisual = visualData.visual ?? visualPayload;
      setVisual(savedVisual);

      if (uploadedHeroUrl) {
        setLocalHeroPreview(null);
        setSelectedHeroFile(null);
        upsertLocalSectionMedia("HERO", uploadedHeroUrl, "Capa do evento");
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(`vivalista_hero_preview_${eventId}`);
        }
      }

      if (uploadedStoryUrl) {
        setLocalStoryPreview(null);
        setSelectedStoryFile(null);
        upsertLocalSectionMedia("STORY", uploadedStoryUrl, "Foto do bloco de mensagem");
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(`vivalista_story_preview_${eventId}`);
        }
      }

      if (uploadedLocationUrl) {
        setLocalLocationPreview(null);
        setSelectedLocationFile(null);
        upsertLocalSectionMedia("LOCATION", uploadedLocationUrl, "Foto do bloco de localização");
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(`vivalista_location_preview_${eventId}`);
        }
      }

      setSaveConfirmed(true);

      const warningMessage = heroUploadFailed
        ? "A alteração foi salva, mas a foto da capa ficou apenas como prévia local porque o backend ainda não confirmou o envio da imagem."
        : storyUploadFailed
          ? "A alteração foi salva, mas a foto do bloco ficou apenas como prévia local porque o backend ainda não confirmou o envio da imagem."
          : locationUploadFailed
            ? "A alteração foi salva, mas a foto da localização ficou apenas como prévia local porque o backend ainda não confirmou o envio da imagem."
            : null;

      setInlineMessage(warningMessage);

      const interactionStampAfterSave = editorInteractionRef.current;

      window.setTimeout(() => {
        if (editorInteractionRef.current !== interactionStampAfterSave) {
          setSaveConfirmed(false);
          return;
        }

        setEditorOpen(false);
        setSaveConfirmed(false);

        if (!warningMessage) {
          setInlineMessage(null);
        }
      }, 800);
    } catch (error) {
      setSaveConfirmed(false);
      setInlineMessage(getSaveErrorMessage(error));
    } finally {
      setInlineSaving(false);
    }
  }

  if (loading) return <LoadingState />;

  if (errorMessage && !event) {
    return <ErrorState message={errorMessage} onRetry={loadPageData} />;
  }

  return (
    <main
      className={`vv-page ${editorOpen ? "vv-editor-open" : "vv-editor-closed"} vv-template-${templateClass} vv-template-kind-${templateVariant} vv-hero-layout-${heroLayout} vv-title-size-${typography.titleSize} vv-text-density-${typography.textDensity}`}
      style={
        {
          "--vv-primary": primaryColor,
          "--vv-secondary": secondaryColor,
          "--vv-hero": `url(${heroImageUrl})`,
          "--vv-story": `url(${storyImageUrl})`,
          "--vv-location": `url(${locationImageUrl})`,
        } as CSSProperties
      }
    >
      <span className="hidden">{VERSION_MARKER}</span>

      <style jsx global>{`
        :root {
          --vv-cream: #fffaf3;
          --vv-ivory: #fffdf8;
          --vv-ink: #24182f;
          --vv-muted: #756a73;
          --vv-line: rgba(67, 38, 63, 0.12);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          overflow-x: hidden;
          background: var(--vv-cream);
        }

        .vv-page {
          min-height: 100svh;
          color: var(--vv-ink);
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(196, 162, 98, 0.18),
              transparent 30%
            ),
            linear-gradient(180deg, #fffaf3 0%, #f5ecdf 44%, #efe1cf 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .vv-font-editorial-classic,
        .vv-font-empire-serif,
        .vv-font-roman-elegance,
        .vv-font-classical,
        .vv-font-beaumont,
        .vv-font-poise-serif,
        .vv-font-elegant,
        .vv-font-rustic {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
        }

        .vv-font-empire-serif,
        .vv-font-classical {
          letter-spacing: -0.055em;
        }

        .vv-font-beaumont {
          letter-spacing: -0.045em;
          font-stretch: condensed;
        }

        .vv-font-poise-serif,
        .vv-font-roman-elegance {
          letter-spacing: -0.025em;
        }

        .vv-font-serenata-script,
        .vv-font-champagne-script,
        .vv-font-chandelier,
        .vv-font-wellington,
        .vv-font-sacramento,
        .vv-font-romantic {
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 400;
          letter-spacing: -0.04em;
        }

        .vv-font-champagne-script,
        .vv-font-wellington,
        .vv-font-chandelier {
          font-style: italic;
          letter-spacing: -0.065em;
        }

        .vv-font-love-note,
        .vv-font-soft-signature,
        .vv-font-sunkissed,
        .vv-font-beautiful-script,
        .vv-font-boho {
          font-family: "Segoe Script", "Brush Script MT", Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.055em;
        }

        .vv-font-honey,
        .vv-font-bubble,
        .vv-font-peace-love,
        .vv-font-papercute {
          font-family: "Trebuchet MS", Arial, sans-serif;
          font-weight: 900;
          letter-spacing: -0.055em;
        }

        .vv-font-bubble,
        .vv-font-papercute {
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .vv-font-studio-modern,
        .vv-font-urban-clean,
        .vv-font-contour,
        .vv-font-typewriter,
        .vv-font-viva-sans,
        .vv-font-modern,
        .vv-font-minimal {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .vv-font-urban-clean,
        .vv-font-viva-sans,
        .vv-font-minimal {
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .vv-font-contour {
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: -0.08em;
        }

        .vv-font-typewriter {
          font-family: "Courier New", monospace;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .vv-title-size-delicado .vv-hero-title {
          font-size: clamp(44px, 6.8vw, 92px);
        }

        .vv-title-size-medio .vv-hero-title {
          font-size: clamp(52px, 8vw, 116px);
        }

        .vv-title-size-grande .vv-hero-title {
          font-size: clamp(58px, 9vw, 136px);
        }

        .vv-title-size-impactante .vv-hero-title {
          font-size: clamp(66px, 10vw, 156px);
        }

        .vv-text-density-compacto .vv-hero-subtitle,
        .vv-text-density-compacto .vv-story-text p,
        .vv-text-density-compacto .vv-section-head p:not(.vv-eyebrow) {
          font-size: 14px;
          line-height: 1.55;
        }

        .vv-text-density-confortavel .vv-hero-subtitle,
        .vv-text-density-confortavel .vv-story-text p,
        .vv-text-density-confortavel .vv-section-head p:not(.vv-eyebrow) {
          font-size: 17px;
          line-height: 1.9;
        }


        .vv-page .vv-section-head h2,
        .vv-page .vv-story-text strong,
        .vv-page .vv-hero-panel strong,
        .vv-page .vv-template-feature h2,
        .vv-page .vv-template-feature strong {
          font-family: Georgia, "Times New Roman", serif;
        }

        .vv-editor-bar {
          position: sticky;
          top: 0;
          z-index: 60;
          border-bottom: 1px solid rgba(67, 38, 63, 0.1);
          background: rgba(255, 253, 248, 0.86);
          backdrop-filter: blur(18px);
          box-shadow: 0 16px 44px rgba(67, 38, 63, 0.08);
        }

        .vv-editor-inner {
          max-width: 1480px;
          margin: 0 auto;
          padding: 12px 18px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 18px;
        }

        .vv-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          color: var(--vv-ink);
          text-decoration: none;
        }

        .vv-brand img {
          width: 146px;
          height: auto;
          display: block;
        }

        .vv-stage {
          min-width: 0;
          text-align: center;
        }

        .vv-stage strong {
          display: block;
          color: var(--vv-primary);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .vv-stage span {
          display: block;
          margin-top: 3px;
          color: rgba(67, 38, 63, 0.62);
          font-size: 12px;
          font-weight: 700;
        }

        .vv-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
          flex-wrap: wrap;
        }

        .vv-top-action,
        .vv-edit-button,
        .vv-public-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 15px;
          border-radius: 999px;
          border: 1px solid rgba(67, 38, 63, 0.14);
          background: rgba(255, 255, 255, 0.72);
          color: var(--vv-primary);
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
          transition: 0.22s ease;
          box-shadow: 0 10px 22px rgba(67, 38, 63, 0.04);
        }

        .vv-top-action:hover,
        .vv-edit-button:hover,
        .vv-public-button:hover {
          transform: translateY(-1px);
          background: white;
          border-color: rgba(196, 162, 98, 0.45);
          box-shadow: 0 16px 30px rgba(67, 38, 63, 0.08);
        }

        .vv-top-action-primary,
        .vv-public-button {
          border-color: transparent;
          background: linear-gradient(135deg, var(--vv-primary), #24182f);
          color: #f4ddb0;
        }

        .vv-top-action-primary:hover,
        .vv-public-button:hover {
          background: linear-gradient(135deg, var(--vv-primary), #160e1e);
          color: #fff0c8;
        }

        .vv-progress-wrap {
          height: 5px;
          overflow: hidden;
          background: rgba(67, 38, 63, 0.08);
        }

        .vv-progress-bar {
          height: 100%;
          width: var(--vv-progress, 0%);
          background: linear-gradient(
            90deg,
            var(--vv-secondary),
            var(--vv-primary)
          );
          transition: width 0.35s ease;
        }

        .vv-hero {
          position: relative;
          min-height: calc(100svh - 80px);
          display: flex;
          align-items: stretch;
          overflow: hidden;
        }

        .vv-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: var(--vv-hero);
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
          filter: saturate(0.94) contrast(1.04);
        }

        .vv-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(20, 11, 25, 0.78) 0%,
              rgba(20, 11, 25, 0.48) 40%,
              rgba(20, 11, 25, 0.18) 100%
            ),
            linear-gradient(
              180deg,
              rgba(20, 11, 25, 0.16) 0%,
              rgba(20, 11, 25, 0.76) 100%
            );
        }

        .vv-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
          padding: clamp(56px, 8vw, 100px) 22px 54px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 430px);
          align-items: end;
          gap: 30px;
        }

        .vv-hero-copy {
          max-width: 790px;
          color: #fffdf8;
        }

        .vv-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 32px;
          padding: 0 13px;
          border-radius: 999px;
          border: 1px solid rgba(255, 253, 248, 0.24);
          background: rgba(255, 253, 248, 0.13);
          color: rgba(255, 253, 248, 0.88);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        .vv-hero-title {
          margin: 24px 0 0;
          font-size: clamp(56px, 9vw, 132px);
          line-height: 0.86;
          letter-spacing: -0.075em;
          text-shadow: 0 22px 54px rgba(0, 0, 0, 0.35);
        }

        .vv-hero-title span {
          color: var(--vv-secondary);
        }

        .vv-hero-subtitle {
          max-width: 620px;
          margin: 26px 0 0;
          color: rgba(255, 253, 248, 0.82);
          font-size: clamp(16px, 1.5vw, 21px);
          line-height: 1.72;
        }

        .vv-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .vv-meta-chip {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 253, 248, 0.22);
          background: rgba(255, 253, 248, 0.15);
          padding: 0 18px;
          color: rgba(255, 253, 248, 0.88);
          font-size: 13px;
          font-weight: 800;
          backdrop-filter: blur(12px);
        }

        .vv-hero-panel {
          justify-self: end;
          width: 100%;
          border: 1px solid rgba(255, 253, 248, 0.22);
          border-radius: 34px;
          background: rgba(255, 253, 248, 0.14);
          padding: 18px;
          color: #fffdf8;
          box-shadow: 0 24px 72px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
        }

        .vv-hero-panel-inner {
          border-radius: 26px;
          background: rgba(255, 253, 248, 0.92);
          padding: 22px;
          color: var(--vv-ink);
        }

        .vv-hero-panel p {
          margin: 0;
          color: rgba(67, 38, 63, 0.62);
          font-size: 13px;
          line-height: 1.6;
        }

        .vv-hero-panel strong {
          display: block;
          margin-top: 8px;
          color: var(--vv-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 400;
          line-height: 1.08;
        }

        .vv-edit-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .vv-site-body {
          max-width: 1320px;
          margin: 0 auto;
          padding: 34px 18px 90px;
        }

        .vv-section-card {
          position: relative;
          overflow: hidden;
          margin-top: 28px;
          border: 1px solid rgba(67, 38, 63, 0.1);
          border-radius: 42px;
          background: rgba(255, 253, 248, 0.78);
          box-shadow: 0 24px 80px rgba(67, 38, 63, 0.07);
          backdrop-filter: blur(12px);
        }

        .vv-section-card::before {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          right: -90px;
          top: -100px;
          background: rgba(196, 162, 98, 0.12);
          pointer-events: none;
        }

        .vv-section-head {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding: 30px 30px 0;
        }

        .vv-eyebrow {
          margin: 0 0 12px;
          color: var(--vv-secondary);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .vv-section-head h2 {
          margin: 0;
          color: var(--vv-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(32px, 4vw, 58px);
          font-weight: 400;
          letter-spacing: -0.055em;
          line-height: 1.02;
        }

        .vv-section-head p:not(.vv-eyebrow) {
          max-width: 680px;
          margin: 13px 0 0;
          color: rgba(67, 38, 63, 0.62);
          font-size: 14px;
          line-height: 1.65;
        }

        .vv-story-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 26px;
          align-items: center;
          padding: 26px 30px 30px;
        }

        .vv-story-image {
          min-height: 420px;
          border-radius: 32px;
          background-image: var(--vv-story);
          background-size: cover;
          background-position: center;
          box-shadow: 0 20px 50px rgba(67, 38, 63, 0.12);
        }

        .vv-story-text {
          border-radius: 32px;
          background: linear-gradient(
            135deg,
            rgba(255, 250, 240, 0.9),
            rgba(255, 253, 248, 0.9)
          );
          padding: clamp(26px, 4vw, 48px);
        }

        .vv-story-text strong {
          display: block;
          color: var(--vv-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 3.4vw, 52px);
          font-weight: 400;
          line-height: 1.06;
          letter-spacing: -0.05em;
        }

        .vv-story-text p {
          margin: 18px 0 0;
          color: rgba(67, 38, 63, 0.66);
          font-size: 16px;
          line-height: 1.85;
        }

        .vv-countdown-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 26px 30px 30px;
        }

        .vv-countdown-item {
          border-radius: 28px;
          background: linear-gradient(135deg, var(--vv-primary), #24182f);
          padding: 24px 16px;
          text-align: center;
          color: white;
        }

        .vv-countdown-item strong {
          display: block;
          color: var(--vv-secondary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 4vw, 56px);
          font-weight: 400;
          line-height: 1;
        }

        .vv-countdown-item span {
          display: block;
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .vv-gallery-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr 1fr;
          gap: 14px;
          padding: 26px 30px 30px;
        }

        .vv-gallery-photo {
          min-height: 280px;
          overflow: hidden;
          border-radius: 30px;
          background: #eadfce;
          box-shadow: 0 18px 42px rgba(67, 38, 63, 0.1);
        }

        .vv-gallery-photo img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 280px;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .vv-gallery-photo:hover img {
          transform: scale(1.04);
        }

        .vv-gallery-empty,
        .vv-gifts-empty {
          position: relative;
          z-index: 2;
          margin: 26px 30px 30px;
          border: 1px dashed rgba(196, 162, 98, 0.55);
          border-radius: 30px;
          background: rgba(255, 250, 240, 0.72);
          padding: 28px;
          color: rgba(67, 38, 63, 0.66);
          font-size: 15px;
          line-height: 1.7;
        }

        .vv-location-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 0.88fr 1.12fr;
          gap: 18px;
          padding: 26px 30px 30px;
        }

        .vv-location-card {
          min-height: 380px;
          border-radius: 32px;
          background-image:
            linear-gradient(
              180deg,
              rgba(36, 24, 47, 0.02),
              rgba(36, 24, 47, 0.42)
            ),
            var(--vv-location);
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 22px;
          box-shadow: 0 20px 50px rgba(67, 38, 63, 0.12);
        }

        .vv-location-card div {
          width: 100%;
          border-radius: 24px;
          background: rgba(255, 253, 248, 0.92);
          padding: 18px;
          backdrop-filter: blur(12px);
        }

        .vv-location-card strong {
          display: block;
          color: var(--vv-primary);
          font-size: 20px;
        }

        .vv-location-card span {
          display: block;
          margin-top: 8px;
          color: rgba(67, 38, 63, 0.62);
          font-size: 14px;
          line-height: 1.55;
        }

        .vv-map {
          min-height: 380px;
          overflow: hidden;
          border: 0;
          border-radius: 32px;
          background: #eadfce;
          box-shadow: 0 20px 50px rgba(67, 38, 63, 0.1);
        }

        .vv-map iframe {
          width: 100%;
          height: 100%;
          min-height: 380px;
          border: 0;
          filter: grayscale(8%) saturate(0.9);
        }

        .vv-gift-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding: 26px 30px 30px;
        }

        .vv-gift-card {
          min-height: 170px;
          border: 1px solid rgba(67, 38, 63, 0.1);
          border-radius: 28px;
          background: linear-gradient(180deg, white, #fff8ef);
          padding: 18px;
          box-shadow: 0 16px 36px rgba(67, 38, 63, 0.055);
        }

        .vv-gift-card img {
          width: 100%;
          height: 148px;
          object-fit: cover;
          border-radius: 22px;
          background: #eadfce;
          margin-bottom: 14px;
        }

        .vv-gift-card h3 {
          margin: 0;
          color: var(--vv-primary);
          font-size: 17px;
          line-height: 1.25;
        }

        .vv-gift-card p {
          margin: 8px 0 0;
          color: rgba(67, 38, 63, 0.62);
          font-size: 13px;
          line-height: 1.45;
        }

        .vv-suggestion-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .vv-suggestion-list span {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          border-radius: 999px;
          background: white;
          border: 1px solid rgba(196, 162, 98, 0.36);
          padding: 0 14px;
          color: var(--vv-primary);
          font-size: 13px;
          font-weight: 800;
        }

        .vv-rsvp-box {
          position: relative;
          z-index: 2;
          margin: 26px 30px 30px;
          border-radius: 34px;
          background: linear-gradient(135deg, var(--vv-primary), #24182f);
          padding: clamp(28px, 4vw, 48px);
          color: white;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 24px;
        }

        .vv-rsvp-box strong {
          display: block;
          color: var(--vv-secondary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 3.2vw, 48px);
          font-weight: 400;
          line-height: 1.08;
        }

        .vv-rsvp-box p {
          margin: 12px 0 0;
          max-width: 620px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 15px;
          line-height: 1.7;
        }

        .vv-final-bar {
          position: relative;
          bottom: auto;
          z-index: 1;
          max-width: 1320px;
          margin: 44px auto 0;
          padding: 0 18px 24px;
        }

        .vv-final-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border: 1px solid rgba(67, 38, 63, 0.08);
          border-radius: 26px;
          background: rgba(255, 253, 248, 0.72);
          padding: 12px 14px;
          box-shadow: 0 14px 34px rgba(67, 38, 63, 0.08);
          backdrop-filter: blur(14px);
        }

        .vv-final-inner strong {
          display: block;
          color: var(--vv-primary);
          font-size: 15px;
        }

        .vv-final-inner span {
          display: block;
          margin-top: 3px;
          color: rgba(67, 38, 63, 0.6);
          font-size: 12px;
          line-height: 1.45;
        }

        .vv-final-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          justify-content: flex-end;
        }

        /* ===== HERÓI RESPEITANDO A ESCOLHA DA ETAPA 2 ===== */
        .vv-hero-shape-photo {
          display: none;
          position: relative;
          z-index: 3;
        }

        .vv-hero-shape-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .vv-hero-centralizado .vv-hero-content {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          text-align: center;
        }

        .vv-hero-centralizado .vv-hero-copy {
          max-width: min(760px, calc(100vw - 44px));
          margin: 0 auto 18px;
          border: 1px solid rgba(255, 253, 248, 0.28);
          border-radius: 38px;
          background: rgba(255, 253, 248, 0.86);
          padding: clamp(30px, 5vw, 56px);
          color: var(--vv-ink);
          box-shadow: 0 26px 80px rgba(20, 11, 25, 0.24);
          backdrop-filter: blur(18px);
        }

        .vv-hero-centralizado .vv-pill {
          border-color: rgba(196, 162, 98, 0.32);
          background: rgba(196, 162, 98, 0.12);
          color: var(--vv-primary);
        }

        .vv-hero-centralizado .vv-hero-title {
          color: var(--vv-primary);
          text-shadow: none;
        }

        .vv-hero-centralizado .vv-hero-subtitle {
          margin-left: auto;
          margin-right: auto;
          color: rgba(67, 38, 63, 0.68);
        }

        .vv-hero-centralizado .vv-hero-meta {
          justify-content: center;
        }

        .vv-hero-centralizado .vv-meta-chip {
          border-color: rgba(196, 162, 98, 0.28);
          background: rgba(255, 253, 248, 0.72);
          color: rgba(67, 38, 63, 0.72);
        }

        .vv-hero-centralizado .vv-hero-panel {
          display: none;
        }

        .vv-hero-tela-cheia .vv-hero-content {
          grid-template-columns: minmax(0, 1fr) minmax(260px, 420px);
        }

        .vv-hero-tela-cheia .vv-hero-copy {
          align-self: end;
        }

        .vv-hero-circular,
        .vv-hero-oval {
          background:
            radial-gradient(
              circle at 70% 20%,
              rgba(196, 162, 98, 0.2),
              transparent 34%
            ),
            linear-gradient(135deg, #fffdf8 0%, #f3e7d7 100%);
        }

        .vv-hero-circular::before,
        .vv-hero-oval::before {
          opacity: 0.035;
          filter: blur(14px) saturate(0.75);
          transform: scale(1.12);
        }

        .vv-hero-circular::after,
        .vv-hero-oval::after {
          background:
            linear-gradient(
              90deg,
              rgba(255, 253, 248, 0.94),
              rgba(255, 253, 248, 0.75)
            ),
            radial-gradient(
              circle at 70% 20%,
              rgba(196, 162, 98, 0.18),
              transparent 32%
            );
        }

        .vv-hero-circular .vv-hero-content,
        .vv-hero-oval .vv-hero-content {
          grid-template-columns: minmax(0, 0.95fr) minmax(280px, 430px);
          align-items: center;
        }

        .vv-hero-circular .vv-hero-copy,
        .vv-hero-oval .vv-hero-copy {
          color: var(--vv-ink);
        }

        .vv-hero-circular .vv-pill,
        .vv-hero-oval .vv-pill {
          border-color: rgba(196, 162, 98, 0.34);
          background: rgba(255, 253, 248, 0.72);
          color: var(--vv-primary);
        }

        .vv-hero-circular .vv-hero-title,
        .vv-hero-oval .vv-hero-title {
          color: var(--vv-primary);
          text-shadow: none;
        }

        .vv-hero-circular .vv-hero-subtitle,
        .vv-hero-oval .vv-hero-subtitle {
          color: rgba(67, 38, 63, 0.68);
        }

        .vv-hero-circular .vv-meta-chip,
        .vv-hero-oval .vv-meta-chip {
          border-color: rgba(196, 162, 98, 0.28);
          background: rgba(255, 253, 248, 0.72);
          color: rgba(67, 38, 63, 0.72);
        }

        .vv-hero-circular .vv-hero-shape-photo,
        .vv-hero-oval .vv-hero-shape-photo {
          display: block;
          width: min(38vw, 430px);
          height: min(38vw, 430px);
          justify-self: center;
          border: 10px solid rgba(255, 253, 248, 0.9);
          background: #eadfce;
          box-shadow: 0 30px 80px rgba(67, 38, 63, 0.2);
          overflow: hidden;
        }

        .vv-hero-circular .vv-hero-shape-photo {
          border-radius: 999px;
        }

        .vv-hero-oval .vv-hero-shape-photo {
          width: min(34vw, 360px);
          height: min(46vw, 520px);
          border-radius: 999px 999px 48% 48%;
        }

        .vv-hero-circular .vv-hero-panel,
        .vv-hero-oval .vv-hero-panel {
          display: none;
        }

        .vv-hero-meio-a-meio {
          min-height: calc(100svh - 72px);
          background: #fffdf8;
        }

        .vv-hero-meio-a-meio::before {
          inset: 26px 26px 26px 52%;
          border-radius: 38px 0 0 38px;
          box-shadow: 0 28px 80px rgba(67, 38, 63, 0.14);
        }

        .vv-hero-meio-a-meio::after {
          background:
            linear-gradient(90deg, rgba(255, 253, 248, 0.98) 0%, rgba(255, 253, 248, 0.94) 48%, rgba(36, 24, 47, 0.1) 100%),
            radial-gradient(circle at 14% 18%, rgba(196, 162, 98, 0.18), transparent 32%);
        }

        .vv-hero-meio-a-meio .vv-hero-content {
          grid-template-columns: minmax(0, 0.88fr) minmax(340px, 0.72fr);
          align-items: center;
        }

        .vv-hero-meio-a-meio .vv-hero-copy,
        .vv-hero-monograma-clean .vv-hero-copy,
        .vv-hero-foto-moldura .vv-hero-copy {
          color: var(--vv-primary);
        }

        .vv-hero-meio-a-meio .vv-pill,
        .vv-hero-monograma-clean .vv-pill,
        .vv-hero-foto-moldura .vv-pill {
          color: rgba(67, 38, 63, 0.62);
          background: rgba(196, 162, 98, 0.12);
          border-color: rgba(196, 162, 98, 0.24);
        }

        .vv-hero-meio-a-meio .vv-hero-title,
        .vv-hero-monograma-clean .vv-hero-title,
        .vv-hero-foto-moldura .vv-hero-title {
          color: var(--vv-primary);
          text-shadow: none;
        }

        .vv-hero-meio-a-meio .vv-hero-subtitle,
        .vv-hero-monograma-clean .vv-hero-subtitle,
        .vv-hero-foto-moldura .vv-hero-subtitle {
          color: rgba(67, 38, 63, 0.68);
        }

        .vv-hero-meio-a-meio .vv-meta-chip,
        .vv-hero-monograma-clean .vv-meta-chip,
        .vv-hero-foto-moldura .vv-meta-chip {
          color: rgba(67, 38, 63, 0.72);
          background: rgba(255, 253, 248, 0.74);
          border-color: rgba(196, 162, 98, 0.24);
        }

        .vv-hero-meio-a-meio .vv-hero-shape-photo {
          display: block;
          width: 100%;
          height: min(62vh, 620px);
          border-radius: 38px;
          overflow: hidden;
          box-shadow: 0 28px 80px rgba(67, 38, 63, 0.18);
          border: 10px solid rgba(255, 253, 248, 0.86);
        }

        .vv-hero-cinematografica::after {
          background:
            linear-gradient(180deg, rgba(6, 3, 10, 0.1), rgba(6, 3, 10, 0.84)),
            linear-gradient(90deg, rgba(6, 3, 10, 0.62), rgba(6, 3, 10, 0.2));
        }

        .vv-hero-cinematografica .vv-hero-content {
          align-items: center;
          justify-items: center;
          text-align: center;
          grid-template-columns: 1fr;
        }

        .vv-hero-cinematografica .vv-hero-copy {
          margin: 0 auto;
        }

        .vv-hero-cinematografica .vv-hero-meta {
          justify-content: center;
        }

        .vv-hero-cinematografica .vv-hero-panel,
        .vv-hero-cinematografica .vv-hero-shape-photo {
          display: none;
        }

        .vv-hero-foto-moldura,
        .vv-hero-monograma-clean,
        .vv-hero-convite-luxo {
          min-height: calc(100svh - 72px);
          background:
            radial-gradient(circle at 78% 12%, rgba(196, 162, 98, 0.16), transparent 30%),
            linear-gradient(135deg, #fffdf8, #f3eadc);
        }

        .vv-hero-foto-moldura::before,
        .vv-hero-monograma-clean::before,
        .vv-hero-convite-luxo::before {
          opacity: 0.16;
          filter: blur(8px) saturate(0.92);
        }

        .vv-hero-foto-moldura::after,
        .vv-hero-monograma-clean::after,
        .vv-hero-convite-luxo::after {
          background: linear-gradient(180deg, rgba(255, 253, 248, 0.58), rgba(255, 253, 248, 0.92));
        }

        .vv-hero-foto-moldura .vv-hero-content,
        .vv-hero-monograma-clean .vv-hero-content,
        .vv-hero-convite-luxo .vv-hero-content {
          align-items: center;
          grid-template-columns: minmax(300px, 0.78fr) minmax(0, 1fr);
        }

        .vv-hero-foto-moldura .vv-hero-shape-photo,
        .vv-hero-convite-luxo .vv-hero-shape-photo {
          order: -1;
          display: block;
          height: min(64vh, 640px);
          border-radius: 40px;
          border: 16px solid rgba(255, 253, 248, 0.92);
          overflow: hidden;
          box-shadow: 0 28px 80px rgba(67, 38, 63, 0.16);
        }

        .vv-hero-convite-luxo .vv-hero-shape-photo {
          border-radius: 28px;
          transform: rotate(-1deg);
        }

        .vv-hero-monograma-clean .vv-hero-content {
          grid-template-columns: 1fr;
          justify-items: center;
          text-align: center;
        }

        .vv-hero-monograma-clean .vv-hero-copy {
          max-width: 880px;
        }

        .vv-hero-monograma-clean .vv-hero-copy::before {
          content: none !important;
          display: none !important;
        }

        .vv-monogram-emblem {
          display: grid;
          place-items: center;
          width: 92px;
          height: 92px;
          margin: 0 auto 18px;
          border-radius: 999px;
          border: 1px solid rgba(196, 162, 98, 0.42);
          color: var(--vv-secondary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 44px;
          font-weight: 400;
          line-height: 1;
          box-shadow: 0 18px 44px rgba(67, 38, 63, 0.08);
          background: rgba(255, 253, 248, 0.72);
        }

        .vv-hero-monograma-clean .vv-hero-meta {
          justify-content: center;
        }

        .vv-hero-monograma-clean .vv-hero-shape-photo,
        .vv-hero-monograma-clean .vv-hero-panel {
          display: none;
        }

        .vv-hero-convite-luxo .vv-hero-copy {
          color: var(--vv-primary);
          text-shadow: none;
          padding: clamp(28px, 5vw, 58px);
          border-radius: 38px;
          background: rgba(255, 253, 248, 0.78);
          border: 1px solid rgba(196, 162, 98, 0.22);
          box-shadow: 0 24px 70px rgba(67, 38, 63, 0.1);
        }

        .vv-hero-convite-luxo .vv-hero-title,
        .vv-hero-convite-luxo .vv-hero-subtitle {
          text-shadow: none;
        }

        .vv-hero-convite-luxo .vv-hero-subtitle {
          color: rgba(67, 38, 63, 0.68);
        }

        .vv-hero-convite-luxo .vv-pill,
        .vv-hero-convite-luxo .vv-meta-chip {
          color: rgba(67, 38, 63, 0.72);
          background: rgba(255, 253, 248, 0.82);
          border-color: rgba(196, 162, 98, 0.24);
        }

        .vv-hero-editorial-cartao .vv-hero-panel {
          display: block;
        }

        .vv-template-casamento-serenata .vv-section-card:nth-of-type(2),
        .vv-template-casamento-romantico .vv-section-card:nth-of-type(2) {
          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(196, 162, 98, 0.18),
              transparent 28%
            ),
            rgba(255, 253, 248, 0.82);
        }

        .vv-template-cha-bebe-delicado .vv-page,
        .vv-template-bebe-delicado .vv-page {
          background: linear-gradient(180deg, #fffdf8 0%, #eef5f3 100%);
        }

        /* ===== ESTRUTURAS REAIS POR MODELO ESCOLHIDO ===== */
        .vv-template-body {
          max-width: 1320px;
          margin: 0 auto;
          padding: 34px 18px 0;
        }

        .vv-template-moment {
          position: relative;
          min-height: 82svh;
          margin-top: 28px;
          overflow: hidden;
          border-radius: 44px;
          background: #1e1118;
          box-shadow: 0 28px 90px rgba(67, 38, 63, 0.16);
        }

        .vv-template-moment-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.04);
          filter: saturate(0.94) contrast(1.04);
        }

        .vv-template-moment::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(31, 17, 24, 0.88),
              rgba(31, 17, 24, 0.36),
              rgba(31, 17, 24, 0.12)
            ),
            linear-gradient(
              180deg,
              rgba(31, 17, 24, 0.08),
              rgba(31, 17, 24, 0.66)
            );
        }

        .vv-template-moment-left::after {
          background:
            linear-gradient(
              270deg,
              rgba(31, 17, 24, 0.88),
              rgba(31, 17, 24, 0.36),
              rgba(31, 17, 24, 0.12)
            ),
            linear-gradient(
              180deg,
              rgba(31, 17, 24, 0.08),
              rgba(31, 17, 24, 0.66)
            );
        }

        .vv-template-moment-card {
          position: absolute;
          z-index: 2;
          top: 50%;
          width: min(430px, calc(100% - 40px));
          transform: translateY(-50%);
          border: 1px solid rgba(255, 253, 248, 0.25);
          border-radius: 34px;
          background: rgba(255, 253, 248, 0.86);
          padding: clamp(26px, 4vw, 46px);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(16px);
        }

        .vv-template-moment-right .vv-template-moment-card {
          right: clamp(22px, 7vw, 90px);
        }

        .vv-template-moment-left .vv-template-moment-card {
          left: clamp(22px, 7vw, 90px);
        }

        .vv-template-moment-card h2,
        .vv-serenata-letter h2,
        .vv-corporate-head h2,
        .vv-house-copy h2,
        .vv-soft-structure h2,
        .vv-luxury-structure h2 {
          margin: 0;
          color: var(--vv-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 4vw, 62px);
          font-weight: 400;
          line-height: 1.02;
          letter-spacing: -0.055em;
        }

        .vv-template-moment-card p:not(.vv-eyebrow),
        .vv-serenata-letter p,
        .vv-corporate-head p,
        .vv-house-copy p,
        .vv-soft-structure p,
        .vv-luxury-structure p {
          color: rgba(67, 38, 63, 0.66);
          font-size: 15px;
          line-height: 1.78;
        }

        .vv-serenata-letter,
        .vv-soft-structure,
        .vv-luxury-structure {
          margin-top: 28px;
          border: 1px solid rgba(196, 162, 98, 0.25);
          border-radius: 44px;
          background:
            radial-gradient(
              circle at 20% 0%,
              rgba(196, 162, 98, 0.18),
              transparent 32%
            ),
            rgba(255, 253, 248, 0.86);
          padding: clamp(34px, 6vw, 76px);
          text-align: center;
          box-shadow: 0 24px 80px rgba(67, 38, 63, 0.07);
        }

        .vv-serenata-letter p,
        .vv-soft-structure p,
        .vv-luxury-structure p {
          max-width: 820px;
          margin: 18px auto 24px;
        }

        .vv-template-corporativo-premium {
          background: linear-gradient(
            180deg,
            #f7fbff 0%,
            #eef4f8 50%,
            #e6edf2 100%
          );
        }

        .vv-template-corporativo-premium .vv-hero {
          background: #07172d;
        }

        .vv-template-corporativo-premium .vv-hero::before {
          opacity: 0.16;
          filter: saturate(0.8) contrast(1.02);
        }

        .vv-template-corporativo-premium .vv-hero::after {
          background: linear-gradient(
            90deg,
            rgba(7, 23, 45, 0.97) 0%,
            rgba(7, 23, 45, 0.92) 45%,
            rgba(7, 23, 45, 0.18) 100%
          );
        }

        .vv-template-corporativo-premium .vv-hero-content,
        .vv-template-corporativo-premium.vv-hero-layout-circular
          .vv-hero-content,
        .vv-template-corporativo-premium.vv-hero-layout-oval .vv-hero-content {
          grid-template-columns: minmax(0, 0.94fr) minmax(360px, 0.86fr);
          align-items: center;
        }

        .vv-template-corporativo-premium .vv-hero-copy,
        .vv-template-corporativo-premium.vv-hero-layout-circular .vv-hero-copy,
        .vv-template-corporativo-premium.vv-hero-layout-oval .vv-hero-copy {
          color: #ffffff;
        }

        .vv-template-corporativo-premium .vv-hero-title,
        .vv-template-corporativo-premium.vv-hero-layout-circular .vv-hero-title,
        .vv-template-corporativo-premium.vv-hero-layout-oval .vv-hero-title {
          color: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 800;
          text-transform: none;
          letter-spacing: -0.07em;
          text-shadow: none;
        }

        .vv-template-corporativo-premium .vv-hero-subtitle,
        .vv-template-corporativo-premium.vv-hero-layout-circular
          .vv-hero-subtitle,
        .vv-template-corporativo-premium.vv-hero-layout-oval .vv-hero-subtitle {
          color: rgba(255, 255, 255, 0.72);
        }

        .vv-template-corporativo-premium .vv-hero-shape-photo,
        .vv-template-corporativo-premium.vv-hero-layout-circular
          .vv-hero-shape-photo,
        .vv-template-corporativo-premium.vv-hero-layout-oval
          .vv-hero-shape-photo {
          display: block;
          width: 100%;
          height: min(68svh, 620px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 36px;
          overflow: hidden;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.32);
        }

        .vv-template-corporativo-premium .vv-hero-shape-photo img {
          border-radius: 0;
        }

        .vv-template-corporativo-premium .vv-hero-panel,
        .vv-template-corporativo-premium.vv-hero-layout-circular .vv-hero-panel,
        .vv-template-corporativo-premium.vv-hero-layout-oval .vv-hero-panel {
          display: none;
        }

        .vv-corporate-structure {
          margin-top: 28px;
          overflow: hidden;
          border-radius: 44px;
          background: #07172d;
          color: white;
          padding: clamp(30px, 5vw, 70px);
          box-shadow: 0 30px 90px rgba(7, 23, 45, 0.22);
        }

        .vv-corporate-head h2 {
          color: white;
        }

        .vv-corporate-head p {
          max-width: 760px;
          color: rgba(255, 255, 255, 0.68);
        }

        .vv-corporate-grid,
        .vv-corporate-kpis {
          display: grid;
          gap: 14px;
        }

        .vv-corporate-grid {
          grid-template-columns: repeat(3, 1fr);
          margin-top: 30px;
        }

        .vv-corporate-grid article,
        .vv-corporate-kpis div {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.08);
          padding: 22px;
        }

        .vv-corporate-grid span,
        .vv-corporate-kpis span {
          color: #8dd9ff;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .vv-corporate-grid strong,
        .vv-corporate-kpis strong {
          display: block;
          margin-top: 10px;
          color: #ffffff;
          font-size: 24px;
        }

        .vv-corporate-grid p {
          color: rgba(255, 255, 255, 0.66);
          line-height: 1.62;
        }

        .vv-corporate-kpis {
          grid-template-columns: repeat(3, 1fr);
          margin-top: 14px;
        }

        .vv-corporate-kpis strong {
          font-size: 46px;
          line-height: 1;
        }

        .vv-template-casa-nova-clean {
          background: linear-gradient(180deg, #fbfbf8 0%, #f0eee8 100%);
        }

        .vv-template-casa-nova-clean .vv-hero,
        .vv-template-casa-nova-clean.vv-hero-layout-circular .vv-hero,
        .vv-template-casa-nova-clean.vv-hero-layout-oval .vv-hero {
          background: #f8f6f1;
        }

        .vv-template-casa-nova-clean .vv-hero::after,
        .vv-template-casa-nova-clean.vv-hero-layout-circular .vv-hero::after,
        .vv-template-casa-nova-clean.vv-hero-layout-oval .vv-hero::after {
          background: linear-gradient(
            90deg,
            rgba(248, 246, 241, 0.96),
            rgba(248, 246, 241, 0.76)
          );
        }

        .vv-template-casa-nova-clean .vv-hero-copy,
        .vv-template-casa-nova-clean .vv-hero-title,
        .vv-template-casa-nova-clean.vv-hero-layout-circular .vv-hero-copy,
        .vv-template-casa-nova-clean.vv-hero-layout-oval .vv-hero-copy {
          color: #27332e;
          text-shadow: none;
        }

        .vv-template-casa-nova-clean .vv-hero-title,
        .vv-template-casa-nova-clean.vv-hero-layout-circular .vv-hero-title,
        .vv-template-casa-nova-clean.vv-hero-layout-oval .vv-hero-title {
          color: #27332e;
        }

        .vv-template-casa-nova-clean .vv-hero-subtitle,
        .vv-template-casa-nova-clean.vv-hero-layout-circular .vv-hero-subtitle,
        .vv-template-casa-nova-clean.vv-hero-layout-oval .vv-hero-subtitle {
          color: rgba(39, 51, 46, 0.68);
        }

        .vv-template-casa-nova-clean .vv-meta-chip,
        .vv-template-casa-nova-clean .vv-pill {
          border-color: rgba(39, 51, 46, 0.12);
          background: rgba(255, 255, 255, 0.68);
          color: rgba(39, 51, 46, 0.72);
        }

        .vv-house-structure {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 24px;
          border: 1px solid rgba(39, 51, 46, 0.1);
          border-radius: 44px;
          background: rgba(255, 255, 255, 0.76);
          padding: clamp(26px, 4vw, 46px);
          box-shadow: 0 24px 80px rgba(39, 51, 46, 0.08);
        }

        .vv-house-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .vv-house-panels div {
          min-height: 220px;
          border-radius: 30px;
          background-size: cover;
          background-position: center;
          box-shadow: 0 16px 42px rgba(39, 51, 46, 0.08);
        }

        .vv-house-panels div:first-child {
          grid-row: span 2;
        }

        .vv-soft-structure {
          background: linear-gradient(
            135deg,
            rgba(255, 253, 248, 0.9),
            rgba(238, 247, 246, 0.88)
          );
        }

        .vv-luxury-structure {
          background: linear-gradient(135deg, #120d14, #2a182b);
        }

        .vv-luxury-structure h2,
        .vv-luxury-structure p {
          color: white;
        }


        .vv-inline-editor {
          margin: -52px auto 56px;
          max-width: 1180px;
          padding: 0 20px;
          position: relative;
          z-index: 8;
        }

        .vv-inline-editor-head,
        .vv-editor-panel {
          border: 1px solid rgba(196, 162, 98, 0.24);
          background: rgba(255, 253, 248, 0.94);
          backdrop-filter: blur(18px);
          box-shadow: 0 28px 80px rgba(36, 24, 47, 0.12);
        }

        .vv-inline-editor-head {
          align-items: center;
          border-radius: 34px;
          display: flex;
          gap: 22px;
          justify-content: space-between;
          padding: 24px;
        }

        .vv-inline-editor-head h2 {
          color: var(--vv-ink);
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 300;
          letter-spacing: -0.05em;
          margin: 6px 0 8px;
        }

        .vv-inline-editor-head p:last-child {
          color: var(--vv-muted);
          line-height: 1.65;
          max-width: 760px;
        }

        .vv-editor-toggle,
        .vv-save-inline,
        .vv-editor-note button {
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--vv-primary), #1a0f22);
          color: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          padding: 14px 22px;
          text-transform: uppercase;
          transition: 0.25s ease;
          white-space: nowrap;
        }

        .vv-editor-toggle:hover,
        .vv-save-inline:hover,
        .vv-editor-note button:hover {
          filter: brightness(1.05);
          transform: translateY(-2px);
        }

        .vv-editor-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }

        .vv-editor-tabs button,
        .vv-choice-grid button,
        .vv-switch-list button {
          border: 1px solid rgba(196, 162, 98, 0.22);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          color: var(--vv-ink);
          cursor: pointer;
          font-size: 13px;
          font-weight: 850;
          padding: 11px 15px;
          transition: 0.22s ease;
        }

        .vv-editor-tabs button.active,
        .vv-choice-grid button.active,
        .vv-switch-list button.active {
          background: var(--vv-primary);
          border-color: var(--vv-primary);
          color: white;
          box-shadow: 0 14px 32px rgba(36, 24, 47, 0.16);
        }

        .vv-editor-panel {
          border-radius: 34px;
          margin-top: 12px;
          padding: 22px;
        }

        .vv-editor-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .vv-editor-fields {
          display: grid;
          gap: 12px;
        }

        .vv-editor-fields label {
          color: var(--vv-ink);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          margin-top: 6px;
          text-transform: uppercase;
        }

        .vv-editor-fields input,
        .vv-editor-fields textarea {
          border: 1px solid rgba(67, 38, 63, 0.14);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          color: var(--vv-ink);
          font-size: 15px;
          outline: 0;
          padding: 14px 16px;
          width: 100%;
        }

        .vv-editor-fields textarea {
          line-height: 1.7;
          resize: vertical;
        }

        .vv-file-card {
          border: 1px dashed rgba(196, 162, 98, 0.55);
          border-radius: 24px;
          background: rgba(196, 162, 98, 0.08);
          cursor: pointer;
          display: grid;
          gap: 4px;
          padding: 18px;
          position: relative;
        }

        .vv-file-card input {
          cursor: pointer;
          inset: 0;
          opacity: 0;
          position: absolute;
        }

        .vv-file-card span {
          color: var(--vv-ink);
          font-weight: 900;
        }

        .vv-file-card small {
          color: var(--vv-muted);
          line-height: 1.5;
        }

        .vv-cover-options {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .vv-cover-options button {
          border: 1px solid rgba(196, 162, 98, 0.2);
          border-radius: 20px;
          background: white;
          color: var(--vv-ink);
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
          overflow: hidden;
          padding: 0 0 10px;
          transition: 0.22s ease;
        }

        .vv-cover-options button.active {
          border-color: var(--vv-primary);
          box-shadow: 0 16px 32px rgba(36, 24, 47, 0.12);
          transform: translateY(-2px);
        }

        .vv-cover-options span {
          display: block;
          height: 72px;
          margin-bottom: 8px;
          background-position: center;
          background-size: cover;
        }

        .vv-choice-grid,
        .vv-switch-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .vv-choice-grid-fonts button {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14px;
        }

        .vv-color-row {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, 1fr);
        }

        .vv-color-row input {
          height: 56px;
          padding: 6px;
        }

        .vv-editor-note {
          border: 1px solid rgba(196, 162, 98, 0.2);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.72);
          padding: 22px;
        }

        .vv-editor-note strong {
          display: block;
          color: var(--vv-ink);
          font-size: 22px;
          margin-bottom: 8px;
        }

        .vv-editor-note p {
          color: var(--vv-muted);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .vv-editor-save-row {
          align-items: center;
          border-top: 1px solid rgba(67, 38, 63, 0.1);
          display: flex;
          gap: 14px;
          justify-content: space-between;
          margin-top: 22px;
          padding-top: 18px;
        }

        .vv-editor-save-row span {
          color: var(--vv-muted);
          font-size: 13px;
          font-weight: 700;
          line-height: 1.5;
        }

        .vv-save-inline:disabled {
          cursor: wait;
          opacity: 0.64;
        }


        .vv-hero-has-live-editor {
          padding-bottom: 136px;
        }

        .vv-hero-live-editor {
          position: absolute;
          left: 50%;
          right: auto;
          bottom: 22px;
          top: auto;
          z-index: 12;
          width: min(1120px, calc(100vw - 32px));
          transform: translateX(-50%);
          border: 1px solid rgba(255, 253, 248, 0.38);
          border-radius: 28px;
          background: rgba(255, 253, 248, 0.92);
          box-shadow: 0 26px 80px rgba(20, 11, 25, 0.22);
          padding: 14px;
          color: var(--vv-ink);
          backdrop-filter: blur(18px);
          display: grid;
          grid-template-columns: minmax(130px, 0.8fr) minmax(160px, 0.9fr) minmax(280px, 2.2fr) minmax(170px, 1fr) minmax(150px, 0.75fr);
          gap: 10px;
          align-items: center;
        }

        .vv-live-editor-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 0;
        }

        .vv-live-editor-title strong {
          color: var(--vv-primary);
          font-size: 17px;
        }

        .vv-live-editor-title button,
        .vv-clear-gallery {
          border: 1px solid rgba(67, 38, 63, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          color: var(--vv-primary);
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
          min-height: 34px;
          padding: 0 13px;
        }

        .vv-live-upload {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          border-radius: 18px;
          border: 1px dashed rgba(196, 162, 98, 0.72);
          background: rgba(196, 162, 98, 0.12);
          color: var(--vv-primary);
          cursor: pointer;
          font-size: 13px;
          font-weight: 950;
          margin-bottom: 0;
          text-align: center;
        }

        .vv-live-upload input {
          display: none;
        }

        .vv-live-layouts,
        .vv-live-colors {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 0;
        }

        .vv-live-colors {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .vv-live-layouts button {
          min-height: 38px;
          border: 1px solid rgba(67, 38, 63, 0.1);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.72);
          color: rgba(67, 38, 63, 0.72);
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
        }

        .vv-live-layouts button.active {
          border-color: var(--vv-secondary);
          background: var(--vv-primary);
          color: #fffdf8;
        }

        .vv-live-colors label {
          display: grid;
          gap: 6px;
          color: rgba(67, 38, 63, 0.64);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .vv-live-colors input {
          width: 100%;
          height: 42px;
          border: 0;
          border-radius: 14px;
          background: transparent;
          cursor: pointer;
        }

        .vv-live-message {
          grid-column: 1 / -1;
          margin: 0;
          border-radius: 16px;
          background: rgba(196, 162, 98, 0.12);
          color: var(--vv-primary);
          font-size: 12px;
          font-weight: 800;
          line-height: 1.5;
          padding: 10px 12px;
        }

        .vv-live-save {
          width: 100%;
          min-height: 46px;
          margin-top: 0;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--vv-primary), #24182f);
          color: #fffdf8;
          cursor: pointer;
          font-weight: 950;
          box-shadow: 0 16px 36px rgba(36, 24, 47, 0.2);
        }

        .vv-live-save:disabled {
          cursor: wait;
          opacity: 0.64;
        }


        /* ===== EDITOR LATERAL PREMIUM — INSPIRAÇÃO CASAR.COM ===== */
        .vv-editor-bar,
        .vv-hero,
        .vv-template-body,
        .vv-site-body,
        .vv-final-bar {
          transition: margin-left 0.32s ease, width 0.32s ease, transform 0.32s ease;
        }

        .vv-page.vv-editor-open .vv-editor-bar,
        .vv-page.vv-editor-open .vv-hero,
        .vv-page.vv-editor-open .vv-template-body,
        .vv-page.vv-editor-open .vv-site-body,
        .vv-page.vv-editor-open .vv-final-bar {
          margin-left: 420px;
          width: calc(100% - 420px);
        }

        .vv-inline-editor {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 220;
          width: 420px;
          max-width: min(420px, 92vw);
          min-height: 100svh;
          margin: 0;
          padding: 0;
          border: 0;
          border-right: 1px solid rgba(67, 38, 63, 0.12);
          background: rgba(255, 253, 248, 0.96);
          box-shadow: 24px 0 70px rgba(36, 24, 47, 0.16);
          backdrop-filter: blur(20px);
          transform: translateX(-106%);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.32s ease, opacity 0.22s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .vv-inline-editor-open {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }

        .vv-inline-editor-head {
          flex: 0 0 auto;
          padding: 22px 22px 18px;
          border-bottom: 1px solid rgba(67, 38, 63, 0.1);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 14px;
          align-items: start;
          background:
            radial-gradient(circle at 20% 0%, rgba(196, 162, 98, 0.16), transparent 34%),
            rgba(255, 253, 248, 0.98);
        }

        .vv-inline-editor-head h2 {
          margin: 6px 0 0;
          color: var(--vv-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: -0.04em;
        }

        .vv-inline-editor-head p:not(.vv-eyebrow) {
          margin: 10px 0 0;
          color: rgba(67, 38, 63, 0.62);
          font-size: 13px;
          line-height: 1.55;
        }

        .vv-editor-toggle {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 1px solid rgba(67, 38, 63, 0.12);
          background: #fff;
          color: var(--vv-primary);
          font-size: 0;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(67, 38, 63, 0.08);
        }

        .vv-editor-toggle::before {
          content: "×";
          font-size: 25px;
          line-height: 1;
          font-weight: 300;
        }

        .vv-editor-tabs {
          flex: 0 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          padding: 10px 0;
          border-bottom: 1px solid rgba(67, 38, 63, 0.1);
          background: rgba(255, 255, 255, 0.78);
        }

        .vv-editor-tabs button {
          width: 100%;
          min-height: 48px;
          border: 0;
          border-left: 4px solid transparent;
          border-radius: 0;
          background: transparent;
          color: rgba(67, 38, 63, 0.64);
          cursor: pointer;
          text-align: left;
          padding: 0 22px;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 0.02em;
          transition: 0.2s ease;
        }

        .vv-editor-tabs button:hover,
        .vv-editor-tabs button.active {
          border-left-color: var(--vv-secondary);
          background: linear-gradient(90deg, rgba(196, 162, 98, 0.13), rgba(255, 255, 255, 0));
          color: var(--vv-primary);
        }

        .vv-editor-panel {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          padding: 18px 22px 24px;
          background: linear-gradient(180deg, rgba(255, 253, 248, 0.98), rgba(250, 244, 235, 0.98));
          scrollbar-gutter: stable;
        }

        .vv-editor-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .vv-editor-fields {
          display: grid;
          gap: 10px;
        }

        .vv-editor-fields label {
          margin-top: 10px;
          color: var(--vv-primary);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .vv-editor-fields input,
        .vv-editor-fields textarea {
          width: 100%;
          border: 1px solid rgba(67, 38, 63, 0.12);
          border-radius: 18px;
          background: #fff;
          padding: 13px 14px;
          color: var(--vv-ink);
          font-size: 14px;
          outline: none;
          box-shadow: 0 10px 24px rgba(67, 38, 63, 0.04);
        }

        .vv-editor-fields input:focus,
        .vv-editor-fields textarea:focus {
          border-color: rgba(196, 162, 98, 0.55);
          box-shadow: 0 0 0 4px rgba(196, 162, 98, 0.12);
        }

        .vv-editor-save-row {
          position: relative;
          z-index: 2;
          width: 100%;
          display: grid;
          gap: 10px;
          margin-top: 22px;
          padding: 16px;
          border: 1px solid rgba(67, 38, 63, 0.10);
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(255, 253, 248, 0.98), rgba(255, 248, 236, 0.94));
          box-shadow: 0 16px 34px rgba(67, 38, 63, 0.08);
          backdrop-filter: blur(18px);
        }

        .vv-editor-save-row span {
          color: rgba(67, 38, 63, 0.64);
          font-size: 12px;
          line-height: 1.45;
          min-height: 17px;
        }

        .vv-save-inline {
          width: 100%;
          min-height: 48px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--vv-primary), #1d1328);
          color: #fff0c8;
          cursor: pointer;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.04em;
          box-shadow: 0 16px 34px rgba(67, 38, 63, 0.2);
        }

        .vv-save-inline:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .vv-file-card,
        .vv-live-upload {
          border: 1px dashed rgba(67, 38, 63, 0.22);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.75);
          padding: 16px;
          color: var(--vv-primary);
          text-align: center;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(67, 38, 63, 0.04);
        }

        .vv-file-card input,
        .vv-live-upload input {
          display: none;
        }

        .vv-file-card span {
          display: block;
        }

        .vv-file-card small {
          display: block;
          margin-top: 5px;
          color: rgba(67, 38, 63, 0.52);
          font-size: 12px;
          font-weight: 600;
        }

        .vv-cover-options,
        .vv-choice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .vv-cover-options button,
        .vv-choice-grid button,
        .vv-switch-list button,
        .vv-clear-gallery {
          min-height: 46px;
          border: 1px solid rgba(67, 38, 63, 0.12);
          border-radius: 18px;
          background: #fff;
          color: rgba(67, 38, 63, 0.7);
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
          transition: 0.2s ease;
          overflow: hidden;
        }

        .vv-cover-options button.active,
        .vv-choice-grid button.active,
        .vv-switch-list button.active,
        .vv-cover-options button:hover,
        .vv-choice-grid button:hover,
        .vv-switch-list button:hover {
          border-color: rgba(196, 162, 98, 0.58);
          background: #fff7e8;
          color: var(--vv-primary);
          box-shadow: 0 12px 26px rgba(196, 162, 98, 0.12);
        }

        .vv-cover-options button span {
          display: block;
          height: 54px;
          margin: -1px -1px 8px;
          background-size: cover;
          background-position: center;
        }

        .vv-color-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .vv-color-row input,
        .vv-live-colors input {
          width: 100%;
          height: 52px;
          padding: 5px;
          border-radius: 16px;
          cursor: pointer;
        }

        .vv-switch-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .vv-editor-note {
          border: 1px solid rgba(196, 162, 98, 0.22);
          border-radius: 22px;
          background: #fff;
          padding: 18px;
          color: rgba(67, 38, 63, 0.72);
          font-size: 14px;
          line-height: 1.65;
          box-shadow: 0 12px 28px rgba(67, 38, 63, 0.05);
        }

        .vv-editor-note strong {
          display: block;
          margin-bottom: 6px;
          color: var(--vv-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
        }

        .vv-editor-note button {
          margin-top: 12px;
          min-height: 42px;
          border: 0;
          border-radius: 999px;
          background: var(--vv-primary);
          color: white;
          padding: 0 16px;
          font-weight: 850;
          cursor: pointer;
        }

        .vv-hero-live-editor {
          display: none !important;
        }

        .vv-page.vv-editor-open .vv-final-bar {
          display: none;
        }

        .vv-save-toast {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 260;
          max-width: 420px;
          border: 1px solid rgba(196, 162, 98, 0.34);
          border-radius: 22px;
          background: rgba(255, 253, 248, 0.95);
          color: var(--vv-primary);
          padding: 15px 18px;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 20px 50px rgba(67, 38, 63, 0.14);
          backdrop-filter: blur(16px);
        }



        /* ===== CUSTOMIZADOR LIMPO PREMIUM — PAINEL FINO + SITE COM PROTAGONISMO ===== */
        .vv-progress-wrap {
          display: none !important;
        }

        .vv-page.vv-editor-open .vv-editor-bar,
        .vv-page.vv-editor-open .vv-hero,
        .vv-page.vv-editor-open .vv-template-body,
        .vv-page.vv-editor-open .vv-site-body,
        .vv-page.vv-editor-open .vv-final-bar {
          margin-left: 360px !important;
          width: calc(100% - 360px) !important;
        }

        .vv-inline-editor {
          width: 360px !important;
          max-width: min(360px, 92vw) !important;
          background: #fffdf9 !important;
          box-shadow: 18px 0 48px rgba(36, 24, 47, 0.10) !important;
        }

        .vv-inline-editor-head {
          min-height: 86px !important;
          padding: 18px 18px 14px !important;
          background: #fffdf9 !important;
          border-bottom: 1px solid rgba(36, 24, 47, 0.08) !important;
        }

        .vv-inline-editor-head .vv-eyebrow {
          margin: 0 !important;
          color: rgba(67, 38, 63, 0.48) !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          letter-spacing: 0.18em !important;
        }

        .vv-inline-editor-head h2 {
          margin: 6px 0 0 !important;
          font-size: 22px !important;
          line-height: 1.08 !important;
          letter-spacing: -0.035em !important;
        }

        .vv-inline-editor-head p:not(.vv-eyebrow) {
          margin-top: 7px !important;
          max-width: 240px !important;
          color: rgba(67, 38, 63, 0.52) !important;
          font-size: 12px !important;
          line-height: 1.35 !important;
        }

        .vv-editor-toggle {
          width: 40px !important;
          height: 40px !important;
          background: #fff !important;
          box-shadow: 0 10px 24px rgba(36, 24, 47, 0.08) !important;
        }

        .vv-editor-tabs {
          padding: 6px 0 !important;
          background: #ffffff !important;
        }

        .vv-editor-tabs button {
          min-height: 44px !important;
          padding: 0 42px 0 20px !important;
          position: relative !important;
          font-size: 13px !important;
          font-weight: 750 !important;
          color: rgba(36, 24, 47, 0.62) !important;
        }

        .vv-editor-tabs button::after {
          content: "›";
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(36, 24, 47, 0.30);
          font-size: 22px;
          font-weight: 300;
        }

        .vv-editor-tabs button.active {
          color: var(--vv-primary) !important;
          border-left-color: var(--vv-secondary) !important;
          background: linear-gradient(90deg, rgba(196, 162, 98, 0.12), rgba(255, 255, 255, 0)) !important;
        }

        .vv-editor-panel {
          padding: 16px 18px 22px !important;
          background: #fffdf9 !important;
        }

        .vv-editor-grid,
        .vv-editor-fields {
          gap: 12px !important;
        }

        .vv-editor-fields label {
          margin-top: 8px !important;
          font-size: 10px !important;
          letter-spacing: 0.16em !important;
          color: rgba(67, 38, 63, 0.72) !important;
        }

        .vv-editor-fields input,
        .vv-editor-fields textarea {
          border-radius: 12px !important;
          padding: 12px 13px !important;
          font-size: 13px !important;
          box-shadow: none !important;
        }

        .vv-file-card {
          border-radius: 14px !important;
          padding: 16px !important;
          background: rgba(196, 162, 98, 0.08) !important;
        }

        .vv-file-card span {
          font-size: 13px !important;
        }

        .vv-file-card small {
          font-size: 12px !important;
        }

        .vv-cover-options {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
        }

        .vv-cover-options button {
          border-radius: 14px !important;
          font-size: 11px !important;
          padding-bottom: 8px !important;
        }

        .vv-cover-options span {
          height: 52px !important;
        }

        .vv-choice-grid,
        .vv-switch-list {
          gap: 8px !important;
        }

        .vv-choice-grid button,
        .vv-switch-list button {
          border-radius: 14px !important;
          padding: 10px 11px !important;
          font-size: 12px !important;
        }

        .vv-color-row {
          gap: 10px !important;
        }

        .vv-color-row input {
          height: 48px !important;
          border-radius: 14px !important;
        }

        .vv-editor-save-row {
          margin-top: 18px !important;
          padding: 14px !important;
          border-radius: 18px !important;
          box-shadow: 0 12px 26px rgba(36, 24, 47, 0.07) !important;
        }

        .vv-save-inline {
          min-height: 44px !important;
          font-size: 12px !important;
          letter-spacing: 0.08em !important;
        }

        .vv-editor-note {
          border-radius: 16px !important;
          padding: 15px !important;
          font-size: 13px !important;
        }

        .vv-editor-note strong {
          font-size: 18px !important;
        }

        .vv-final-bar {
          display: none !important;
        }

        .vv-page.vv-editor-open .vv-stage span {
          display: none !important;
        }

        .vv-page.vv-editor-open .vv-stage strong {
          font-size: 12px !important;
        }

        @media (max-width: 980px) {
          .vv-page.vv-editor-open .vv-editor-bar,
          .vv-page.vv-editor-open .vv-hero,
          .vv-page.vv-editor-open .vv-template-body,
          .vv-page.vv-editor-open .vv-site-body,
          .vv-page.vv-editor-open .vv-final-bar {
            margin-left: 0;
            width: 100%;
          }

          .vv-inline-editor {
            inset: auto 0 0 0;
            width: 100%;
            max-width: 100%;
            height: min(78svh, 720px);
            min-height: 0;
            border-right: 0;
            border-top: 1px solid rgba(67, 38, 63, 0.12);
            transform: translateY(110%);
            border-radius: 28px 28px 0 0;
          }

          .vv-inline-editor-open {
            transform: translateY(0);
          }

          .vv-editor-save-row {
            width: 100%;
            max-width: 100%;
          }
        }

        @media (max-width: 1100px) {
          .vv-hero-live-editor {
            grid-template-columns: 1fr 1fr;
            bottom: 16px;
            max-height: min(42svh, 360px);
            overflow-y: auto;
          }

          .vv-live-layouts {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .vv-hero-has-live-editor {
            padding-bottom: 260px;
          }

          .vv-hero-live-editor {
            grid-template-columns: 1fr;
            width: calc(100vw - 24px);
          }
        }

        .vv-gallery-live-editor {
          position: relative;
          z-index: 4;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          gap: 12px;
          align-items: center;
          margin: 26px 30px 0;
          border: 1px solid rgba(196, 162, 98, 0.26);
          border-radius: 28px;
          background: rgba(255, 253, 248, 0.88);
          box-shadow: 0 18px 46px rgba(67, 38, 63, 0.08);
          padding: 16px;
        }

        .vv-gallery-live-editor strong {
          display: block;
          color: var(--vv-primary);
          font-size: 18px;
        }

        .vv-gallery-live-editor p {
          margin: 4px 0 0;
          color: rgba(67, 38, 63, 0.62);
          font-size: 13px;
          line-height: 1.5;
        }

        .vv-gallery-upload {
          min-width: 180px;
          margin: 0;
          padding: 0 16px;
        }

        .vv-gallery-photo {
          position: relative;
        }

        .vv-gallery-photo span {
          position: absolute;
          left: 12px;
          top: 12px;
          border-radius: 999px;
          background: rgba(255, 253, 248, 0.88);
          color: var(--vv-primary);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
          padding: 7px 10px;
          text-transform: uppercase;
        }

        .vv-template-corporativo-premium.vv-hero-layout-circular .vv-hero-shape-photo,
        .vv-template-corporativo-premium.vv-hero-layout-oval .vv-hero-shape-photo,
        .vv-template-casa-nova-clean.vv-hero-layout-circular .vv-hero-shape-photo,
        .vv-template-casa-nova-clean.vv-hero-layout-oval .vv-hero-shape-photo {
          justify-self: center;
          border: 10px solid rgba(255, 253, 248, 0.9);
          background: #eadfce;
          box-shadow: 0 30px 80px rgba(67, 38, 63, 0.2);
          overflow: hidden;
        }

        .vv-template-corporativo-premium.vv-hero-layout-circular .vv-hero-shape-photo,
        .vv-template-casa-nova-clean.vv-hero-layout-circular .vv-hero-shape-photo {
          width: min(38vw, 430px);
          height: min(38vw, 430px);
          border-radius: 999px;
        }

        .vv-template-corporativo-premium.vv-hero-layout-oval .vv-hero-shape-photo,
        .vv-template-casa-nova-clean.vv-hero-layout-oval .vv-hero-shape-photo {
          width: min(34vw, 360px);
          height: min(46vw, 520px);
          border-radius: 999px 999px 48% 48%;
        }

        @media (max-width: 1100px) {
          .vv-editor-inner {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
          }

          .vv-actions {
            justify-content: center;
          }

          .vv-hero-content {
            grid-template-columns: 1fr;
            align-items: end;
          }

          .vv-hero-circular .vv-hero-content,
          .vv-hero-oval .vv-hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .vv-hero-circular .vv-hero-subtitle,
          .vv-hero-oval .vv-hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .vv-hero-circular .vv-hero-meta,
          .vv-hero-oval .vv-hero-meta {
            justify-content: center;
          }

          .vv-hero-circular .vv-hero-shape-photo,
          .vv-hero-oval .vv-hero-shape-photo {
            order: -1;
            width: min(58vw, 360px);
            height: min(58vw, 360px);
            margin: 0 auto 6px;
          }

          .vv-hero-oval .vv-hero-shape-photo {
            width: min(50vw, 310px);
            height: min(66vw, 430px);
          }

          .vv-hero-panel {
            justify-self: stretch;
            max-width: 520px;
          }

          .vv-story-grid,
          .vv-location-grid {
            grid-template-columns: 1fr;
          }

          .vv-gift-grid,
          .vv-gallery-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 1100px) {
          .vv-corporate-grid,
          .vv-corporate-kpis,
          .vv-house-structure {
            grid-template-columns: 1fr;
          }

          .vv-template-corporativo-premium .vv-hero-content,
          .vv-template-corporativo-premium.vv-hero-layout-circular
            .vv-hero-content,
          .vv-template-corporativo-premium.vv-hero-layout-oval
            .vv-hero-content {
            grid-template-columns: 1fr;
          }

          .vv-template-corporativo-premium .vv-hero-shape-photo,
          .vv-template-corporativo-premium.vv-hero-layout-circular
            .vv-hero-shape-photo,
          .vv-template-corporativo-premium.vv-hero-layout-oval
            .vv-hero-shape-photo {
            order: -1;
            height: min(54svh, 440px);
          }
        }

        @media (max-width: 760px) {
          .vv-editor-inner {
            padding: 10px 12px;
          }

          .vv-brand img {
            width: 124px;
          }

          .vv-actions {
            width: 100%;
          }

          .vv-top-action {
            flex: 1 1 auto;
            min-height: 38px;
            padding: 0 10px;
          }

          .vv-hero {
            min-height: 84svh;
          }

          .vv-hero-content {
            padding: 48px 18px 34px;
          }

          .vv-hero-centralizado .vv-hero-copy {
            padding: 26px 20px;
            border-radius: 30px;
          }

          .vv-hero-circular .vv-hero-shape-photo {
            width: min(70vw, 300px);
            height: min(70vw, 300px);
          }

          .vv-hero-oval .vv-hero-shape-photo {
            width: min(60vw, 250px);
            height: min(78vw, 340px);
          }

          .vv-hero-title {
            font-size: clamp(46px, 16vw, 78px);
          }

          .vv-hero-meta {
            gap: 8px;
          }

          .vv-meta-chip {
            width: 100%;
            border-radius: 18px;
            justify-content: center;
            text-align: center;
          }

          .vv-section-card {
            border-radius: 30px;
          }

          .vv-section-head {
            flex-direction: column;
            padding: 24px 20px 0;
          }

          .vv-edit-button {
            width: 100%;
          }

          .vv-story-grid,
          .vv-countdown-grid,
          .vv-gallery-grid,
          .vv-location-grid,
          .vv-gift-grid {
            grid-template-columns: 1fr;
            padding: 22px 20px 24px;
          }

          .vv-gallery-empty,
          .vv-gifts-empty,
          .vv-rsvp-box {
            margin: 22px 20px 24px;
          }

          .vv-story-image,
          .vv-location-card,
          .vv-map,
          .vv-map iframe {
            min-height: 290px;
          }

          .vv-countdown-grid {
            grid-template-columns: 1fr 1fr;
          }

          .vv-rsvp-box {
            grid-template-columns: 1fr;
          }

          .vv-final-inner {
            align-items: stretch;
            flex-direction: column;
          }

          .vv-final-actions,
          .vv-public-button {
            width: 100%;
          }

          .vv-public-button,
          .vv-final-actions .vv-top-action {
            flex: 1 1 100%;
          }
        }


        /* ===== AJUSTE: EDIÇÃO LIMPA, BOTÕES VISÍVEIS E UPLOAD CLICÁVEL ===== */
        .vv-hero-has-live-editor {
          padding-bottom: 0 !important;
        }

        .vv-hero-live-editor {
          display: none !important;
        }

        .vv-click-edit-helper {
          position: fixed;
          top: 84px;
          left: 50%;
          z-index: 80;
          transform: translateX(-50%);
          border: 1px solid rgba(196, 162, 98, 0.32);
          border-radius: 999px;
          background: rgba(255, 253, 248, 0.88);
          color: var(--vv-primary);
          cursor: pointer;
          padding: 11px 18px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.04em;
          box-shadow: 0 18px 48px rgba(36, 24, 47, 0.12);
          backdrop-filter: blur(16px);
          transition: 0.22s ease;
        }

        .vv-click-edit-helper:hover {
          transform: translateX(-50%) translateY(-1px);
          background: #fffdf8;
          box-shadow: 0 24px 62px rgba(36, 24, 47, 0.16);
        }

        .vv-page.vv-editor-open .vv-click-edit-helper {
          display: none;
        }

        .vv-section-edit-floating {
          position: absolute;
          z-index: 20;
          border: 1px solid rgba(255, 253, 248, 0.36);
          border-radius: 999px;
          background: rgba(255, 253, 248, 0.92);
          color: var(--vv-primary);
          cursor: pointer;
          min-height: 42px;
          padding: 0 16px;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.04em;
          box-shadow: 0 18px 48px rgba(20, 11, 25, 0.18);
          backdrop-filter: blur(14px);
          transition: 0.2s ease;
        }

        .vv-section-edit-floating:hover {
          transform: translateY(-1px);
          background: #fffdf8;
        }

        .vv-hero-edit-floating {
          right: clamp(18px, 3vw, 42px);
          top: clamp(86px, 10vw, 130px);
        }

        .vv-edit-button::before,
        .vv-top-action::before {
          content: "✎";
          margin-right: 7px;
          font-weight: 900;
        }

        .vv-brand::before,
        .vv-public-button::before,
        .vv-top-action-primary::before {
          content: none;
          margin-right: 0;
        }

        .vv-file-card {
          min-height: 96px;
          align-content: center;
        }

        .vv-file-card input {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 5;
        }

        .vv-native-file-input {
          display: block;
          width: 100%;
          border: 1px solid rgba(67, 38, 63, 0.14);
          border-radius: 18px;
          background: #fff;
          color: var(--vv-ink);
          padding: 12px;
          font-size: 13px;
          cursor: pointer;
        }

        .vv-editor-panel {
          padding-bottom: 88px;
        }

        .vv-editor-save-row {
          position: sticky;
          bottom: 0;
          z-index: 8;
          margin: 22px -16px -16px;
          padding: 14px 16px;
          background: linear-gradient(180deg, rgba(255,253,248,0.70), rgba(255,253,248,0.98));
          backdrop-filter: blur(14px);
        }

        .vv-page.vv-editor-open .vv-editor-bar {
          box-shadow: none;
        }

        @media (max-width: 760px) {
          .vv-click-edit-helper {
            top: auto;
            bottom: 18px;
            width: calc(100% - 28px);
            text-align: center;
            white-space: normal;
          }

          .vv-hero-edit-floating {
            top: 92px;
            right: 16px;
          }
        }



        /* ===== AJUSTE FINAL: EDITOR POR SEÇÃO, SEM BOTÃO FIXO ===== */
        .vv-editor-tabs {
          display: none !important;
        }



        .vv-editor-fields-single {
          max-width: 100%;
        }

        .vv-editor-save-row {
          position: static !important;
          bottom: auto !important;
          z-index: auto !important;
          margin: 22px 0 0 !important;
          padding: 14px 0 0 !important;
          border-top: 1px solid rgba(67, 38, 63, 0.10) !important;
          background: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
        }

        .vv-editor-panel {
          padding-bottom: 28px !important;
        }

        .vv-clear-gallery-panel {
          width: 100%;
          border: 1px solid rgba(67, 38, 63, 0.12);
          border-radius: 16px;
          background: #fff;
          color: var(--vv-primary);
          cursor: pointer;
          min-height: 44px;
          font-weight: 850;
        }

        .vv-page.vv-editor-open .vv-site-body,
        .vv-page.vv-editor-open .vv-template-body {
          padding-top: 18px;
        }


        /* ===== VERSAO FINAL DESTE PASSO: CUSTOMIZADOR POR BLOCO MAIS LIMPO ===== */
        .vv-editor-head-title {
          display: grid !important;
          grid-template-columns: 42px 1fr !important;
          align-items: start !important;
          gap: 12px !important;
          min-width: 0 !important;
        }

        .vv-editor-head-icon {
          width: 42px !important;
          height: 42px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 16px !important;
          background: linear-gradient(135deg, rgba(196, 162, 98, 0.18), rgba(255, 255, 255, 0.92)) !important;
          border: 1px solid rgba(196, 162, 98, 0.32) !important;
          color: var(--vv-primary) !important;
          font-size: 20px !important;
          box-shadow: 0 10px 24px rgba(36, 24, 47, 0.07) !important;
        }

        .vv-edit-button {
          gap: 8px !important;
          min-height: 36px !important;
          padding: 0 13px !important;
          font-size: 12px !important;
        }

        .vv-pencil {
          width: 22px !important;
          height: 22px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 999px !important;
          background: rgba(196, 162, 98, 0.14) !important;
          color: var(--vv-primary) !important;
          font-size: 12px !important;
          flex: 0 0 auto !important;
        }

        .vv-section-edit-floating {
          gap: 8px !important;
          min-height: 38px !important;
          border: 1px solid rgba(255, 255, 255, 0.42) !important;
          background: rgba(255, 253, 248, 0.88) !important;
          color: var(--vv-primary) !important;
          backdrop-filter: blur(14px) !important;
          box-shadow: 0 16px 40px rgba(20, 11, 25, 0.16) !important;
        }

        .vv-inline-editor {
          width: 344px !important;
          max-width: min(344px, 92vw) !important;
          background: #fffdf9 !important;
        }

        .vv-page.vv-editor-open .vv-editor-bar,
        .vv-page.vv-editor-open .vv-hero,
        .vv-page.vv-editor-open .vv-template-body,
        .vv-page.vv-editor-open .vv-site-body,
        .vv-page.vv-editor-open .vv-final-bar {
          margin-left: 344px !important;
          width: calc(100% - 344px) !important;
        }

        .vv-inline-editor-head {
          min-height: auto !important;
          padding: 16px 16px 14px !important;
        }

        .vv-inline-editor-head h2 {
          font-size: 20px !important;
          margin-top: 4px !important;
        }

        .vv-inline-editor-head p:not(.vv-eyebrow) {
          max-width: none !important;
          font-size: 12px !important;
          line-height: 1.42 !important;
        }


        .vv-editor-panel {
          overflow-y: auto !important;
          padding: 14px 16px 22px !important;
        }

        .vv-editor-grid {
          grid-template-columns: 1fr !important;
          gap: 14px !important;
        }

        .vv-file-card {
          min-height: 86px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .vv-native-file-input {
          min-height: 44px !important;
          border-radius: 12px !important;
          background: #fff !important;
        }

        .vv-cover-options span {
          height: 58px !important;
        }

        .vv-choice-grid-fonts button {
          min-height: 40px !important;
        }

        .vv-editor-save-row {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 10px !important;
        }

        .vv-editor-save-row span {
          min-height: 18px !important;
          font-size: 12px !important;
        }

        .vv-save-inline {
          width: 100% !important;
          min-height: 46px !important;
          border-radius: 16px !important;
        }

        .vv-hero-live-editor,
        .vv-gallery-live-editor {
          display: none !important;
        }

        .vv-click-edit-helper {
          left: 50% !important;
          transform: translateX(-50%) !important;
          bottom: 22px !important;
          max-width: min(560px, calc(100vw - 32px)) !important;
          border-radius: 999px !important;
          background: rgba(255, 253, 248, 0.9) !important;
          backdrop-filter: blur(16px) !important;
          box-shadow: 0 18px 46px rgba(36, 24, 47, 0.13) !important;
        }

        @media (max-width: 980px) {
          .vv-page.vv-editor-open .vv-editor-bar,
          .vv-page.vv-editor-open .vv-hero,
          .vv-page.vv-editor-open .vv-template-body,
          .vv-page.vv-editor-open .vv-site-body,
          .vv-page.vv-editor-open .vv-final-bar {
            margin-left: 0 !important;
            width: 100% !important;
          }

          .vv-inline-editor {
            width: 100% !important;
            max-width: 100% !important;
          }
        }



        /* ============================================================
           V10 — AJUSTE CIRÚRGICO SOBRE O ARQUIVO REAL PRESERVADO
           Objetivo: manter o arquivo grande original, remover conflito visual,
           deixar o editor lateral limpo e impedir bolas/decorativos gigantes.
        ============================================================ */

        .vv-page {
          --vv-editor-width: 344px;
          --vv-title-font: Georgia, "Times New Roman", serif;
        }

        .vv-progress-wrap,
        .vv-hero-live-editor,
        .vv-gallery-live-editor {
          display: none !important;
        }

        .vv-section-card::before {
          width: 120px !important;
          height: 120px !important;
          right: -42px !important;
          top: -44px !important;
          opacity: 0.45 !important;
          pointer-events: none !important;
        }

        .vv-template-moment,
        .vv-section-card,
        .vv-house-structure,
        .vv-soft-structure,
        .vv-luxury-structure,
        .vv-corporate-structure {
          isolation: isolate;
        }

        .vv-page.vv-editor-open .vv-editor-bar,
        .vv-page.vv-editor-open .vv-hero,
        .vv-page.vv-editor-open .vv-template-body,
        .vv-page.vv-editor-open .vv-site-body,
        .vv-page.vv-editor-open .vv-final-bar {
          margin-left: var(--vv-editor-width) !important;
          width: calc(100% - var(--vv-editor-width)) !important;
        }

        .vv-inline-editor {
          position: fixed !important;
          inset: 0 auto 0 0 !important;
          z-index: 240 !important;
          width: var(--vv-editor-width) !important;
          max-width: min(var(--vv-editor-width), 92vw) !important;
          min-height: 100svh !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          border-right: 1px solid rgba(36, 24, 47, 0.10) !important;
          border-radius: 0 !important;
          background: #fffdf9 !important;
          box-shadow: 18px 0 48px rgba(36, 24, 47, 0.12) !important;
          backdrop-filter: blur(18px) !important;
          transform: translateX(-106%) !important;
          opacity: 0 !important;
          pointer-events: none !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          transition: transform 0.28s ease, opacity 0.2s ease !important;
        }

        .vv-inline-editor-open {
          transform: translateX(0) !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        .vv-inline-editor-head {
          flex: 0 0 auto !important;
          min-height: auto !important;
          display: grid !important;
          grid-template-columns: 1fr auto !important;
          align-items: start !important;
          gap: 12px !important;
          padding: 16px 16px 14px !important;
          border: 0 !important;
          border-bottom: 1px solid rgba(36, 24, 47, 0.08) !important;
          border-radius: 0 !important;
          background: linear-gradient(180deg, #fffdf9 0%, #fff8ee 100%) !important;
          box-shadow: none !important;
        }

        .vv-editor-head-title {
          display: grid !important;
          grid-template-columns: 40px minmax(0, 1fr) !important;
          align-items: start !important;
          gap: 11px !important;
          min-width: 0 !important;
        }

        .vv-editor-head-icon {
          width: 40px !important;
          height: 40px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 15px !important;
          background: linear-gradient(135deg, rgba(196, 162, 98, 0.18), rgba(255, 255, 255, 0.95)) !important;
          border: 1px solid rgba(196, 162, 98, 0.30) !important;
          color: var(--vv-primary) !important;
          font-size: 19px !important;
          box-shadow: 0 10px 24px rgba(36, 24, 47, 0.06) !important;
        }

        .vv-inline-editor-head .vv-eyebrow {
          margin: 0 !important;
          color: rgba(67, 38, 63, 0.50) !important;
          font-size: 9px !important;
          font-weight: 950 !important;
          letter-spacing: 0.18em !important;
        }

        .vv-inline-editor-head h2 {
          margin: 5px 0 0 !important;
          color: var(--vv-primary) !important;
          font-family: var(--vv-title-font) !important;
          font-size: 20px !important;
          font-weight: 400 !important;
          line-height: 1.05 !important;
          letter-spacing: -0.035em !important;
        }

        .vv-inline-editor-head p:not(.vv-eyebrow) {
          margin-top: 7px !important;
          max-width: none !important;
          color: rgba(67, 38, 63, 0.55) !important;
          font-size: 12px !important;
          line-height: 1.42 !important;
        }

        .vv-editor-toggle {
          width: 38px !important;
          height: 38px !important;
          min-width: 38px !important;
          padding: 0 !important;
          border-radius: 999px !important;
          border: 1px solid rgba(67, 38, 63, 0.12) !important;
          background: #fff !important;
          color: var(--vv-primary) !important;
          box-shadow: 0 10px 22px rgba(36, 24, 47, 0.08) !important;
        }



        .vv-editor-panel {
          flex: 1 1 auto !important;
          min-height: 0 !important;
          overflow-y: auto !important;
          padding: 14px 16px 22px !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: #fffdf9 !important;
          box-shadow: none !important;
          scrollbar-gutter: stable !important;
        }

        .vv-editor-grid,
        .vv-editor-fields {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 12px !important;
        }

        .vv-editor-fields label {
          margin-top: 8px !important;
          color: rgba(67, 38, 63, 0.72) !important;
          font-size: 10px !important;
          font-weight: 950 !important;
          letter-spacing: 0.16em !important;
          text-transform: uppercase !important;
        }

        .vv-editor-fields input,
        .vv-editor-fields textarea {
          width: 100% !important;
          border: 1px solid rgba(67, 38, 63, 0.12) !important;
          border-radius: 13px !important;
          background: #ffffff !important;
          color: var(--vv-ink) !important;
          font-size: 13px !important;
          outline: 0 !important;
          padding: 12px 13px !important;
          box-shadow: none !important;
        }

        .vv-editor-fields input:focus,
        .vv-editor-fields textarea:focus {
          border-color: rgba(196, 162, 98, 0.58) !important;
          box-shadow: 0 0 0 4px rgba(196, 162, 98, 0.12) !important;
        }

        .vv-native-file-input {
          display: none !important;
        }

        .vv-file-card {
          min-height: 86px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          border-radius: 15px !important;
          padding: 16px !important;
          background: rgba(196, 162, 98, 0.08) !important;
        }

        .vv-file-card input {
          display: block !important;
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          opacity: 0 !important;
          cursor: pointer !important;
          z-index: 5 !important;
        }

        .vv-cover-options,
        .vv-choice-grid,
        .vv-switch-list {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
        }

        .vv-cover-options button,
        .vv-choice-grid button,
        .vv-switch-list button,
        .vv-clear-gallery-panel {
          min-height: 42px !important;
          border-radius: 14px !important;
          padding: 9px 10px !important;
          font-size: 12px !important;
          font-weight: 850 !important;
          box-shadow: none !important;
        }

        .vv-cover-options span {
          height: 56px !important;
        }

        .vv-color-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 10px !important;
        }

        .vv-color-row input {
          height: 48px !important;
          padding: 5px !important;
          border-radius: 14px !important;
        }

        .vv-editor-note {
          border-radius: 16px !important;
          padding: 15px !important;
          background: #ffffff !important;
          box-shadow: none !important;
        }

        .vv-editor-note strong {
          color: var(--vv-primary) !important;
          font-family: var(--vv-title-font) !important;
          font-size: 19px !important;
          font-weight: 400 !important;
        }

        .vv-editor-save-row {
          position: static !important;
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 10px !important;
          width: 100% !important;
          margin: 20px 0 0 !important;
          padding: 14px 0 0 !important;
          border: 0 !important;
          border-top: 1px solid rgba(67, 38, 63, 0.10) !important;
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
        }

        .vv-editor-save-row span {
          min-height: 18px !important;
          color: rgba(67, 38, 63, 0.60) !important;
          font-size: 12px !important;
          line-height: 1.45 !important;
        }

        .vv-save-inline {
          width: 100% !important;
          min-height: 46px !important;
          border-radius: 16px !important;
          background: linear-gradient(135deg, var(--vv-primary), #1d1328) !important;
          color: #fff0c8 !important;
          font-size: 12px !important;
          font-weight: 950 !important;
          letter-spacing: 0.08em !important;
          box-shadow: 0 14px 30px rgba(67, 38, 63, 0.18) !important;
        }

        .vv-click-edit-helper {
          top: auto !important;
          bottom: 22px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 80 !important;
          max-width: min(560px, calc(100vw - 32px)) !important;
          border-radius: 999px !important;
          background: rgba(255, 253, 248, 0.92) !important;
          box-shadow: 0 18px 46px rgba(36, 24, 47, 0.13) !important;
          backdrop-filter: blur(16px) !important;
        }

        .vv-click-edit-helper:hover {
          transform: translateX(-50%) translateY(-1px) !important;
        }

        .vv-section-edit-floating,
        .vv-edit-button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          min-height: 38px !important;
          border-radius: 999px !important;
          border: 1px solid rgba(255, 255, 255, 0.42) !important;
          background: rgba(255, 253, 248, 0.90) !important;
          color: var(--vv-primary) !important;
          box-shadow: 0 16px 40px rgba(20, 11, 25, 0.14) !important;
          backdrop-filter: blur(14px) !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .vv-edit-button::before,
        .vv-top-action::before {
          content: none !important;
        }

        .vv-pencil {
          width: 22px !important;
          height: 22px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 999px !important;
          background: rgba(196, 162, 98, 0.14) !important;
          color: var(--vv-primary) !important;
          font-size: 12px !important;
          flex: 0 0 auto !important;
        }

        .vv-final-bar {
          display: none !important;
        }

        @media (max-width: 980px) {
          .vv-page.vv-editor-open .vv-editor-bar,
          .vv-page.vv-editor-open .vv-hero,
          .vv-page.vv-editor-open .vv-template-body,
          .vv-page.vv-editor-open .vv-site-body,
          .vv-page.vv-editor-open .vv-final-bar {
            margin-left: 0 !important;
            width: 100% !important;
          }

          .vv-inline-editor {
            inset: auto 0 0 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: min(78svh, 720px) !important;
            min-height: 0 !important;
            border-right: 0 !important;
            border-top: 1px solid rgba(67, 38, 63, 0.12) !important;
            border-radius: 26px 26px 0 0 !important;
            transform: translateY(110%) !important;
          }

          .vv-inline-editor-open {
            transform: translateY(0) !important;
          }
        }

        @media (max-width: 760px) {
          .vv-click-edit-helper {
            width: calc(100% - 28px) !important;
            white-space: normal !important;
            text-align: center !important;
          }
        }


        /* ===== V11 — REFINO 9/10 DO EDITOR LATERAL ===== */
        .vv-section-card {
          outline: 2px solid transparent !important;
          outline-offset: 0 !important;
          transition: outline-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease !important;
        }

        .vv-section-card:hover {
          outline-color: var(--vv-secondary) !important;
          box-shadow: 0 28px 86px rgba(67, 38, 63, 0.105) !important;
        }

        .vv-section-actions {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          flex: 0 0 auto !important;
        }

        .vv-section-status {
          width: 10px !important;
          height: 10px !important;
          border-radius: 999px !important;
          box-shadow: 0 0 0 4px rgba(255, 253, 248, 0.9), 0 8px 18px rgba(36, 24, 47, 0.12) !important;
          flex: 0 0 auto !important;
        }

        .vv-section-status-complete {
          background: #4d9f6f !important;
        }

        .vv-section-status-pending {
          background: #d7a647 !important;
        }

        .vv-page.vv-editor-open .vv-section-card:hover {
          transform: none !important;
        }

        .vv-hero-monograma-clean .vv-hero-copy::before {
          content: none !important;
          display: none !important;
        }

        .vv-editor-grid-capa {
          gap: 15px !important;
        }

        .vv-file-card-compact {
          min-height: 62px !important;
          padding: 12px 14px !important;
          border-radius: 14px !important;
        }

        .vv-file-card-compact span {
          font-size: 13px !important;
        }

        .vv-file-card-compact small {
          margin-top: 3px !important;
          font-size: 11px !important;
          line-height: 1.35 !important;
        }

        .vv-choice-grid-layouts {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }

        .vv-url-details {
          margin-top: 4px !important;
          border: 1px solid rgba(67, 38, 63, 0.10) !important;
          border-radius: 14px !important;
          background: rgba(255, 255, 255, 0.72) !important;
          padding: 0 !important;
          overflow: hidden !important;
        }

        .vv-url-details summary {
          cursor: pointer !important;
          list-style: none !important;
          padding: 12px 13px !important;
          color: rgba(67, 38, 63, 0.70) !important;
          font-size: 12px !important;
          font-weight: 850 !important;
        }

        .vv-url-details summary::-webkit-details-marker {
          display: none !important;
        }

        .vv-url-details summary::after {
          content: "+" !important;
          float: right !important;
          color: var(--vv-secondary) !important;
          font-size: 16px !important;
          line-height: 1 !important;
        }

        .vv-url-details[open] summary::after {
          content: "−" !important;
        }

        .vv-url-details input {
          border: 0 !important;
          border-top: 1px solid rgba(67, 38, 63, 0.08) !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }

        .vv-panel-gallery-preview {
          display: grid !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: 8px !important;
          margin-top: 4px !important;
        }

        .vv-panel-gallery-thumb {
          position: relative !important;
          aspect-ratio: 1 / 1 !important;
          overflow: hidden !important;
          border-radius: 14px !important;
          background: #eadfce !important;
          box-shadow: 0 10px 22px rgba(36, 24, 47, 0.08) !important;
        }

        .vv-panel-gallery-thumb img {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        .vv-panel-gallery-thumb button {
          position: absolute !important;
          top: 5px !important;
          right: 5px !important;
          width: 24px !important;
          height: 24px !important;
          border: 0 !important;
          border-radius: 999px !important;
          background: rgba(255, 253, 248, 0.92) !important;
          color: var(--vv-primary) !important;
          cursor: pointer !important;
          font-size: 17px !important;
          line-height: 1 !important;
          box-shadow: 0 8px 18px rgba(36, 24, 47, 0.14) !important;
        }

        .vv-editor-save-row {
          margin-top: 24px !important;
          padding-top: 16px !important;
        }

        .vv-editor-save-row span {
          color: rgba(67, 38, 63, 0.58) !important;
        }

        .vv-save-inline-success {
          background: linear-gradient(135deg, #4d9f6f, #347d57) !important;
          color: #fff !important;
          box-shadow: 0 16px 34px rgba(77, 159, 111, 0.22) !important;
        }

        @media (max-width: 760px) {
          .vv-section-actions {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }


        /* ===== V12: REFINO 10/10, BUGFIX DATA E FOTO DO BLOCO ===== */
        .vv-hero::before {
          transition: background-image 0.3s ease, opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease !important;
        }

        .vv-inline-editor {
          border-left: 4px solid var(--vv-primary) !important;
          box-shadow:
            inset 4px 0 0 color-mix(in srgb, var(--vv-primary) 72%, transparent),
            18px 0 48px rgba(36, 24, 47, 0.10) !important;
        }

        .vv-file-card-compact {
          border-style: solid !important;
          border-color: rgba(67, 38, 63, 0.13) !important;
          background: linear-gradient(180deg, #ffffff, #fff8ee) !important;
        }

        .vv-file-card-compact:hover {
          border-color: color-mix(in srgb, var(--vv-primary) 42%, #ffffff) !important;
          box-shadow: 0 14px 28px rgba(67, 38, 63, 0.08) !important;
        }

        .vv-field-action-label {
          margin-top: 14px !important;
          color: rgba(67, 38, 63, 0.58) !important;
        }

        .vv-editor-panel > .vv-editor-save-row {
          margin-top: 26px !important;
        }

        .vv-panel-story-preview {
          display: grid;
          gap: 10px;
          margin-top: 8px;
        }

        .vv-panel-story-preview img {
          width: 100%;
          height: 152px;
          object-fit: cover;
          border-radius: 16px;
          border: 1px solid rgba(67, 38, 63, 0.10);
          box-shadow: 0 12px 28px rgba(67, 38, 63, 0.08);
        }

        .vv-panel-story-preview button {
          width: 100%;
          min-height: 40px;
          border: 1px solid rgba(67, 38, 63, 0.12);
          border-radius: 14px;
          background: #fff;
          color: var(--vv-primary);
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
        }


        /* ===== V13: LIMPEZA TÉCNICA SEGURA ===== */
        .vv-field-help {
          margin: 4px 0 0 !important;
          color: rgba(67, 38, 63, 0.58) !important;
          font-size: 12px !important;
          line-height: 1.55 !important;
        }

        .vv-inline-editor {
          box-shadow: 18px 0 48px rgba(36, 24, 47, 0.10) !important;
          box-shadow:
            inset 4px 0 0 color-mix(in srgb, var(--vv-primary) 72%, transparent),
            18px 0 48px rgba(36, 24, 47, 0.10) !important;
        }

        .vv-file-card-compact:hover {
          border-color: rgba(67, 38, 63, 0.22) !important;
          border-color: color-mix(in srgb, var(--vv-primary) 42%, #ffffff) !important;
        }

        .vv-file-card-compact {
          border-style: solid !important;
        }

        .vv-editor-panel {
          padding-top: 18px !important;
        }

        /* ===== V14: ESTABILIDADE DE UPLOAD E FOTO DA LOCALIZAÇÃO ===== */
        .vv-location-edit-row {
          margin-top: 14px !important;
        }

        .vv-location-edit-row .vv-edit-button {
          min-height: 34px !important;
          padding: 0 12px !important;
          font-size: 11px !important;
        }

        .vv-file-card-compact small strong {
          color: var(--vv-primary) !important;
        }

        /* ===== V17: DNA REAL DOS MODELOS NA ETAPA 3 ===== */
        .vv-template-kind-corporativo .vv-site-body {
          max-width: 1180px !important;
        }

        .vv-template-kind-corporativo .vv-section-card {
          border-radius: 34px !important;
          background: rgba(255, 255, 255, 0.86) !important;
        }

        .vv-template-kind-corporativo .vv-story-grid {
          grid-template-columns: 1fr !important;
        }

        .vv-template-kind-corporativo .vv-story-image {
          display: none !important;
        }

        .vv-template-kind-corporativo .vv-story-text {
          background: linear-gradient(135deg, #ffffff, #f2f7fb) !important;
          border: 1px solid rgba(7, 23, 45, 0.08) !important;
        }

        .vv-template-kind-corporativo .vv-rsvp-box {
          background: linear-gradient(135deg, #07172d, #0d2b4d) !important;
        }

        .vv-template-kind-corporativo .vv-section-card::before {
          background: rgba(36, 130, 180, 0.10) !important;
        }




        /* V18 — editor mais direto: sem capas rápidas e menos explicação */
        .vv-cover-options {
          display: none !important;
        }

        .vv-inline-editor-head p:not(.vv-eyebrow) {
          display: none !important;
        }

        .vv-file-card-compact {
          min-height: 54px !important;
          border-style: solid !important;
          border-color: rgba(67, 38, 63, 0.14) !important;
          background: #ffffff !important;
          box-shadow: 0 10px 24px rgba(36, 24, 47, 0.05) !important;
        }

        .vv-file-card-compact small {
          display: none !important;
        }

        .vv-field-action-label {
          margin-top: 0 !important;
        }

      `}</style>

      <div
        className="vv-progress-wrap"
        style={{ "--vv-progress": `${completionPercent}%` } as CSSProperties}
      >
        <div className="vv-progress-bar" />
      </div>

      <header className="vv-editor-bar">
        <div className="vv-editor-inner">
          <Link href="/" className="vv-brand" aria-label="VivaLista">
            <img src="/logo-vivalista.png" alt="VivaLista" />
          </Link>

          <div className="vv-stage">
            <strong>Etapa 3 — seu site quase pronto</strong>
            <span>
              {completionPercent}% completo • Modelo {templateLabel} • {getVariantLabel(templateVariant)} • estrutura {templateDna.key} • capa{" "}
              {heroLayoutLabel} • letra {getTypographyLabel(typography.fontStyle)}.
            </span>
          </div>

          <nav className="vv-actions" aria-label="Ações de edição do site">
            <TopAction href={panelPath}>Painel</TopAction>
            <TopAction onClick={() => openInlineEditor("capa")}>Visual</TopAction>
            {showGallery ? <TopAction onClick={openGalleryEditor}>Fotos</TopAction> : null}
            {showGifts ? <TopAction onClick={() => { window.location.href = giftsPath; }}>Presentes</TopAction> : null}
            {publicPath ? (
              <TopAction onClick={publishAndOpenPublicSite} primary>
                Publicar e ver site
              </TopAction>
            ) : null}
          </nav>
        </div>
      </header>

      {!editorOpen ? (
        <button
          type="button"
          className="vv-click-edit-helper"
          onClick={() => openInlineEditor("capa")}
        >
          ✎ Clique em editar em qualquer bloco para modificar somente aquela seção
        </button>
      ) : null}

      {!editorOpen && inlineMessage ? (
        <div className="vv-save-toast" role="status">
          {inlineMessage}
        </div>
      ) : null}

      <section
        className={`vv-hero vv-hero-${heroLayout}`}
        id="inicio"
      >
        <button
          type="button"
          className="vv-section-edit-floating vv-hero-edit-floating"
          onClick={() => openInlineEditor("capa")}
          aria-label="Editar capa"
        >
          ✎ Editar capa
        </button>

        <div className="vv-hero-content">
          <div className="vv-hero-copy">
            <span className="vv-pill">
              {getEventKindLabel(event)} • {templateLabel}
            </span>

            {heroLayout === "monograma-clean" ? (
              <span className="vv-monogram-emblem" aria-hidden="true">
                {(titleParts.first || title || "V").trim().charAt(0).toUpperCase() || "V"}
              </span>
            ) : null}

            <h1 className={`vv-hero-title ${getFontClass(typography.fontStyle)}`}>
              {titleParts.first || title}
              {titleParts.second ? (
                <>
                  <br />
                  <span>&amp; {titleParts.second}</span>
                </>
              ) : null}
            </h1>

            <p className="vv-hero-subtitle">{subtitle}</p>

            <div className="vv-hero-meta">
              <span className="vv-meta-chip">
                📅 {formatShortDate(previewDateIso || event?.date)}
              </span>
              <span className="vv-meta-chip">
                📍 {previewLocation || "Local ainda não informado"}
              </span>
              <span className="vv-meta-chip">{statusLabel(event?.status)}</span>
            </div>
          </div>

          <div className="vv-hero-shape-photo" aria-hidden="true">
            <img src={heroImageUrl} alt="" />
          </div>

          <aside className="vv-hero-panel">
            <div className="vv-hero-panel-inner">
              <p>Modo edição</p>
              <strong>{heroLayoutLabel} + {getTypographyLabel(typography.fontStyle)}.</strong>
              <p>Prévia do site em edição.</p>
              <div className="vv-edit-row">
                <EditButton onClick={() => openInlineEditor("capa")}>Editar capa e cores</EditButton>
                <EditButton onClick={() => openInlineEditor("dados")}>Editar dados</EditButton>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <aside
        id="editor-rapido"
        aria-label="Editor do site"
        className={`vv-inline-editor ${editorOpen ? "vv-inline-editor-open" : ""}`}
      >
        <div className="vv-inline-editor-head">
          <div className="vv-editor-head-title">
            <span className="vv-editor-head-icon" aria-hidden="true">{getEditorIcon(editorMode)}</span>
            <div>
              <p className="vv-eyebrow">Customização do site</p>
              <h2>{getEditorTitle(editorMode)}</h2>
            </div>
          </div>

          <button
            type="button"
            className="vv-editor-toggle"
            aria-label="Fechar editor"
            onClick={() => {
              setEditorOpen((current) => !current);
              if (!editorOpen) setEditorDraft(baseEditorDraft);
            }}
          >
            {editorOpen ? "Fechar edição" : "Abrir editor"}
          </button>
        </div>

        {editorOpen ? (
          <div className="vv-editor-panel">
              {editorMode === "capa" ? (
                <div className="vv-editor-grid vv-editor-grid-capa">
                  <div className="vv-editor-fields">
                    <label className="vv-field-action-label">Foto da capa</label>
                    <label className="vv-file-card vv-file-card-compact" htmlFor="inlineHeroFile">
                      <input
                        id="inlineHeroFile"
                        type="file"
                        accept="image/*"
                        onChange={handleInlineHeroFileChange}
                      />
                      <span>📷 Escolher foto</span>
                    </label>

                    <label>Modelo de capa</label>
                    <div className="vv-choice-grid vv-choice-grid-layouts">
                      {QUICK_HERO_LAYOUTS.map((layout) => (
                        <button
                          key={layout.value}
                          type="button"
                          onClick={() => updateEditorDraft("heroLayout", layout.value)}
                          className={editorDraft.heroLayout === layout.value ? "active" : ""}
                        >
                          {layout.label}
                        </button>
                      ))}
                    </div>

                    <label>Cores do site</label>
                    <div className="vv-color-row">
                      <input
                        type="color"
                        aria-label="Cor principal"
                        value={editorDraft.primaryColor}
                        onChange={(eventChange) =>
                          updateEditorDraft("primaryColor", eventChange.target.value)
                        }
                      />
                      <input
                        type="color"
                        aria-label="Cor de detalhe"
                        value={editorDraft.secondaryColor}
                        onChange={(eventChange) =>
                          updateEditorDraft("secondaryColor", eventChange.target.value)
                        }
                      />
                    </div>

                    <label>Letras</label>
                    <div className="vv-choice-grid vv-choice-grid-fonts">
                      {QUICK_FONTS.map((font) => (
                        <button
                          key={font.value}
                          type="button"
                          onClick={() => updateEditorDraft("fontStyle", font.value)}
                          className={editorDraft.fontStyle === font.value ? "active" : ""}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>

                    <details className="vv-url-details">
                      <summary>Usar imagem por URL</summary>
                      <input
                        value={editorDraft.heroImageUrl}
                        onChange={(eventChange) => {
                          setLocalHeroPreview(null);
                          setSelectedHeroFile(null);
                          updateEditorDraft("heroImageUrl", eventChange.target.value);
                        }}
                        placeholder="https://..."
                      />
                    </details>
                  </div>
                </div>
              ) : null}

              {editorMode === "texto" ? (
                <div className="vv-editor-grid">
                  <div className="vv-editor-fields">
                    <label>Título público</label>
                    <input
                      value={editorDraft.publicTitle}
                      onChange={(eventChange) =>
                        updateEditorDraft("publicTitle", eventChange.target.value)
                      }
                    />

                    <label>Subtítulo</label>
                    <input
                      value={editorDraft.publicSubtitle}
                      onChange={(eventChange) =>
                        updateEditorDraft("publicSubtitle", eventChange.target.value)
                      }
                    />
                  </div>

                  <div className="vv-editor-fields">
                    <label>Mensagem de abertura</label>
                    <textarea
                      value={editorDraft.welcomeMessage}
                      onChange={(eventChange) =>
                        updateEditorDraft("welcomeMessage", eventChange.target.value)
                      }
                      rows={7}
                    />
                  </div>
                </div>
              ) : null}

              {editorMode === "dados" ? (
                <div className="vv-editor-fields vv-editor-fields-single">
                  <label>Nome do evento</label>
                  <input
                    value={editorDraft.eventName}
                    onChange={(eventChange) =>
                      updateEditorDraft("eventName", eventChange.target.value)
                    }
                  />
                </div>
              ) : null}

              {editorMode === "data" ? (
                <div className="vv-editor-fields vv-editor-fields-single">
                  <label>Data e horário</label>
                  <input
                    type="datetime-local"
                    value={editorDraft.eventDate}
                    onChange={(eventChange) =>
                      updateEditorDraft("eventDate", eventChange.target.value)
                    }
                  />

                </div>
              ) : null}

              {editorMode === "local" ? (
                <div className="vv-editor-fields vv-editor-fields-single">
                  <label>Local do evento</label>
                  <input
                    value={editorDraft.eventLocation}
                    onChange={(eventChange) =>
                      updateEditorDraft("eventLocation", eventChange.target.value)
                    }
                    placeholder="Ex.: Espaço Villa Jardim, São Paulo"
                  />

                </div>
              ) : null}

              {editorMode === "secoes" ? (
                <div className="vv-editor-fields vv-editor-fields-single">
                  <label>Seções ativas</label>
                  <div className="vv-switch-list">
                    {(
                      [
                        ["showCountdown", "Contagem"],
                        ["showStory", "Mensagem"],
                        ["showGallery", "Galeria"],
                        ["showLocation", "Localização"],
                        ["showGifts", "Presentes"],
                        ["showRsvp", "RSVP"],
                      ] as Array<[
                        keyof Pick<
                          EditorDraft,
                          | "showCountdown"
                          | "showStory"
                          | "showGallery"
                          | "showLocation"
                          | "showGifts"
                          | "showRsvp"
                        >,
                        string,
                      ]>
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setEditorDraft((current) => ({
                            ...current,
                            [key]: !current[key],
                          }))
                        }
                        className={editorDraft[key] ? "active" : ""}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {editorMode === "fotos" ? (
                <div className="vv-editor-fields vv-editor-fields-single">
                  {photoEditorTarget === "story" ? (
                    <>
                      <label>Foto deste bloco</label>
                      <label className="vv-file-card vv-file-card-compact" htmlFor="inlineStoryFilePanel">
                        <input
                          id="inlineStoryFilePanel"
                          type="file"
                          accept="image/*"
                          onChange={handleInlineStoryFileChange}
                        />
                        <span>🖼️ Trocar foto do bloco</span>
                      </label>

                      {localStoryPreview ? (
                        <div className="vv-panel-story-preview" aria-label="Foto escolhida para este bloco">
                          <img src={localStoryPreview} alt="Prévia da foto do bloco" />
                          <button
                            type="button"
                            onClick={() => {
                              markEditorInteraction();
                              setLocalStoryPreview(null);
                              setSelectedStoryFile(null);
                              if (eventId && typeof window !== "undefined") {
                                window.localStorage.removeItem(`vivalista_story_preview_${eventId}`);
                              }
                            }}
                          >
                            Remover foto escolhida
                          </button>
                        </div>
                      ) : null}


                    </>
                  ) : photoEditorTarget === "location" ? (
                    <>
                      <label>Foto da localização</label>
                      <label className="vv-file-card vv-file-card-compact" htmlFor="inlineLocationFilePanel">
                        <input
                          id="inlineLocationFilePanel"
                          type="file"
                          accept="image/*"
                          onChange={handleInlineLocationFileChange}
                        />
                        <span>📍 Trocar foto do local</span>
                      </label>

                      {localLocationPreview ? (
                        <div className="vv-panel-story-preview" aria-label="Foto escolhida para localização">
                          <img src={localLocationPreview} alt="Prévia da foto da localização" />
                          <button
                            type="button"
                            onClick={() => {
                              markEditorInteraction();
                              setLocalLocationPreview(null);
                              setSelectedLocationFile(null);
                              if (eventId && typeof window !== "undefined") {
                                window.localStorage.removeItem(`vivalista_location_preview_${eventId}`);
                              }
                            }}
                          >
                            Remover foto escolhida
                          </button>
                        </div>
                      ) : null}


                    </>
                  ) : (
                    <>
                      <label>Fotos da galeria</label>
                      <label className="vv-file-card vv-file-card-compact" htmlFor="inlineGalleryFilesPanel">
                        <input
                          id="inlineGalleryFilesPanel"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleInlineGalleryFilesChange}
                        />
                        <span>🖼️ Escolher várias fotos</span>
                      </label>

                      {localGalleryPreviews.length > 0 ? (
                        <div className="vv-panel-gallery-preview" aria-label="Fotos escolhidas para a galeria">
                          {localGalleryPreviews.map((image, index) => (
                            <div className="vv-panel-gallery-thumb" key={`${image.slice(0, 32)}-${index}`}>
                              <img src={image} alt={`Foto escolhida ${index + 1}`} />
                              <button
                                type="button"
                                onClick={() => removeInlineGalleryPreview(index)}
                                aria-label={`Remover foto ${index + 1}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {localGalleryPreviews.length > 0 ? (
                        <button
                          type="button"
                          className="vv-clear-gallery vv-clear-gallery-panel"
                          onClick={clearInlineGalleryPreviews}
                        >
                          Limpar todas as fotos escolhidas
                        </button>
                      ) : null}


                    </>
                  )}
                </div>
              ) : null}

              {editorMode === "presentes" ? (
                <div className="vv-editor-note">
                  <strong>Presentes dentro da Etapa 3</strong>
                  <p>
                    O caminho correto é editar presentes aqui mesmo, sem jogar o
                    cliente para fora. Nesta versão, deixei o bloco preparado; o
                    próximo arquivo a migrar é a lista de presentes para dentro
                    desta área.
                  </p>
                </div>
              ) : null}

              {editorMode === "convidados" ? (
                <div className="vv-editor-note">
                  <strong>Convidados e RSVP dentro da Etapa 3</strong>
                  <p>
                    A mesma regra vale para convidados: o cliente deve ajustar o
                    RSVP aqui, olhando o site quase pronto. Vamos migrar esse
                    bloco em uma próxima etapa para não quebrar convidados.
                  </p>
                </div>
              ) : null}

              <div className="vv-editor-save-row">
                {inlineMessage ? <span>{inlineMessage}</span> : <span>O editor fecha e o site atualiza.</span>}
                <button
                  type="button"
                  onClick={saveInlineEditor}
                  disabled={inlineSaving || saveConfirmed}
                  className={`vv-save-inline ${saveConfirmed ? "vv-save-inline-success" : ""}`}
                >
                  {inlineSaving ? "Salvando..." : saveConfirmed ? "✓ Salvo" : "Salvar alterações"}
                </button>
              </div>
          </div>
        ) : null}
      </aside>

      <div className="vv-template-body">
        <TemplateExperienceBlocks
          variant={templateVariant}
          event={event}
          visual={visual}
          title={title}
          welcomeMessage={welcomeMessage}
          heroImageUrl={heroImageUrl}
          storyImageUrl={storyImageUrl}
          locationImageUrl={locationImageUrl}
          galleryPath={galleryPath}
          visualPath={visualPath}
          contentVisualPath={contentVisualPath}
          onOpenEditor={openInlineEditor}
          onOpenStoryPhotoEditor={openStoryPhotoEditor}
        />
      </div>

      <div className="vv-site-body">
        {showCountdown ? (
          <SiteSectionCard
            eyebrow={templateDna.copy.countdownEyebrow}
            title={templateDna.copy.countdownTitle}
            description={templateDna.copy.countdownDescription}
            onEdit={() => openInlineEditor("data")}
            buttonLabel="Editar data"
            isComplete={Boolean(event?.date)}
          >
            <CountdownGrid date={previewDateIso || event?.date} />
          </SiteSectionCard>
        ) : null}

        {showStory ? (
          <SiteSectionCard
            eyebrow={templateDna.copy.storyEyebrow}
            title={templateDna.copy.storyTitle}
            description={templateDna.copy.storyDescription}
            onEdit={() => openInlineEditor("texto")}
            buttonLabel="Editar mensagem"
            isComplete={Boolean(welcomeMessage.trim())}
          >
            <div className="vv-story-grid">
              <div className="vv-story-image" />
              <div className="vv-story-text">
                <strong>{templateDna.copy.storyInnerTitle}</strong>
                <p>{welcomeMessage}</p>
                <div className="vv-edit-row">
                  <EditButton onClick={openStoryPhotoEditor}>
                    Trocar foto desta seção
                  </EditButton>
                  <EditButton onClick={() => openInlineEditor("texto")}>Editar texto</EditButton>
                </div>
              </div>
            </div>
          </SiteSectionCard>
        ) : null}

        {showGallery ? (
          <SiteSectionCard
            eyebrow={templateDna.copy.galleryEyebrow}
            title={templateDna.copy.galleryTitle}
            description={templateDna.copy.galleryDescription}
            onEdit={openGalleryEditor}
            buttonLabel="Montar galeria"
            isComplete={galleryDisplayItems.length > 0}
          >
            {galleryDisplayItems.length > 0 ? (
              <div className="vv-gallery-grid">
                {galleryDisplayItems.slice(0, 9).map((item) => (
                  <div className="vv-gallery-photo" key={item.id}>
                    <img src={item.image} alt={item.title} />
                    {item.source === "local" ? <span>Prévia</span> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="vv-gallery-empty">
                A galeria ainda não tem fotos cadastradas. Clique em
                <strong> “Montar galeria” </strong>
                para escolher várias imagens aqui mesmo.
                <div className="vv-suggestion-list">
                  {FALLBACK_GALLERY_IMAGES.map((image, index) => (
                    <span key={image}>Sugestão visual {index + 1}</span>
                  ))}
                </div>
              </div>
            )}
          </SiteSectionCard>
        ) : null}

        {showLocation ? (
          <SiteSectionCard
            eyebrow={templateDna.copy.locationEyebrow}
            title={templateDna.copy.locationTitle}
            description={templateDna.copy.locationDescription}
            onEdit={() => openInlineEditor("local")}
            buttonLabel="Editar local"
            isComplete={Boolean(previewLocation.trim())}
          >
            <div className="vv-location-grid">
              <div className="vv-location-card">
                <div>
                  <strong>
                    {previewLocation || "Local ainda não informado"}
                  </strong>
                  <span>
                    {previewLocation
                      ? "Confira o endereço e veja o mapa ao lado."
                      : "Adicione o local na etapa de dados do evento."}
                  </span>
                  <div className="vv-edit-row vv-location-edit-row">
                    <EditButton onClick={openLocationPhotoEditor}>Trocar foto do local</EditButton>
                    <EditButton onClick={() => openInlineEditor("local")}>Editar endereço</EditButton>
                  </div>
                </div>
              </div>

              <div className="vv-map">
                {previewLocation ? (
                  <iframe
                    title="Mapa do evento"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      previewLocation,
                    )}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-full min-h-[380px] items-center justify-center px-6 text-center text-sm leading-6 text-[#756a73]">
                    O mapa aparece automaticamente depois que o local for
                    preenchido.
                  </div>
                )}
              </div>
            </div>
          </SiteSectionCard>
        ) : null}

        {showGifts ? (
          <SiteSectionCard
            eyebrow={templateDna.copy.giftsEyebrow}
            title={templateDna.copy.giftsTitle}
            description={templateDna.copy.giftsDescription}
            onEdit={() => { window.location.href = giftsPath; }}
            buttonLabel="Editar presentes"
            isComplete={gifts.length > 0}
          >
            {gifts.length > 0 ? (
              <div className="vv-gift-grid">
                {gifts.slice(0, 6).map((gift) => {
                  const giftImage = buildAssetUrl(gift.imageUrl || gift.image);
                  return (
                    <article className="vv-gift-card" key={gift.id}>
                      {giftImage ? (
                        <img src={giftImage} alt={getGiftTitle(gift)} />
                      ) : null}
                      <h3>{getGiftTitle(gift)}</h3>
                      <p>{formatMoney(gift.price ?? gift.amount)}</p>
                      {gift.description ? <p>{gift.description}</p> : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="vv-gifts-empty">
                Ainda não há presentes cadastrados. O ideal é começar com uma
                lista sugerida e depois trocar o que não fizer sentido.
                <div className="vv-suggestion-list">
                  {giftSuggestions.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            )}
          </SiteSectionCard>
        ) : null}

        {showRsvp ? (
          <SiteSectionCard
            eyebrow={templateDna.copy.rsvpEyebrow}
            title={templateDna.copy.rsvpTitle}
            description={templateDna.copy.rsvpDescription}
            onEdit={() => { window.location.href = guestsPath; }}
            buttonLabel="Gerenciar convidados"
            isComplete={Boolean(publicPath)}
          >
            <div className="vv-rsvp-box">
              <div>
                <strong>{templateDna.copy.rsvpInnerTitle}</strong>
                <p>{templateDna.copy.rsvpInnerDescription}</p>
              </div>
              <EditButton onClick={() => { window.location.href = guestsPath; }}>Abrir convidados</EditButton>
            </div>
          </SiteSectionCard>
        ) : null}
      </div>

      <div className="vv-final-bar">
        <div className="vv-final-inner">
          <div>
            <strong>Seu site está quase pronto</strong>
            <span>Use o topo para editar fotos, presentes e publicação.</span>
          </div>

          <div className="vv-final-actions">
            {showGallery ? <TopAction onClick={openGalleryEditor}>Completar fotos</TopAction> : null}
            {showGifts ? <TopAction onClick={() => { window.location.href = giftsPath; }}>Presentes</TopAction> : null}
            {publicPath ? (
              <Link
                href={publicPath}
                target="_blank"
                className="vv-public-button"
              >
                Ver site público
              </Link>
            ) : (
              <TopAction onClick={() => openInlineEditor("capa")} primary>
                Preparar publicação
              </TopAction>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


