"use client";

// V5 ETAPA 4.5O — PÁGINA PÚBLICA CASAMENTO COM CAPA CIRCULAR IGUAL AO PREVIEW

import { useState, type CSSProperties } from "react";

type PublicSectionKey =
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

type PublicSectionMedia = {
  id?: string;
  sectionKey?: PublicSectionKey | string;
  mediaRole?: string | null;
  imageUrl?: string | null;
  title?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  buttonLabel?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  isPrimary?: boolean;
};

type PublicTemplateProps = {
  event: any;
  countdown: { label: string; value: string }[];
  galleryImages: string[];
  sectionMedia?: PublicSectionMedia[];
  filteredGifts: any[];
  giftCategories: string[];
  financialSummary: any;
  showStory: boolean;
  showGallery: boolean;
  showLocation: boolean;
  showGifts: boolean;
  showRsvp: boolean;
  showCountdown: boolean;
  copied: boolean;
  handleCopyLink: () => Promise<void>;
  giftSearch: string;
  setGiftSearch: (value: string) => void;
  giftCategory: string;
  setGiftCategory: (value: string) => void;
  giftSort: string;
  setGiftSort: (value: string) => void;
  openPaymentModal: (gift: any) => void;
  selectedGift: any | null;
  closePaymentModal: () => void;
  buyerName: string;
  setBuyerName: (value: string) => void;
  buyerEmail: string;
  setBuyerEmail: (value: string) => void;
  buyerPhone: string;
  setBuyerPhone: (value: string) => void;
  buyerMessage: string;
  setBuyerMessage: (value: string) => void;
  customAmount: string;
  setCustomAmount: (value: string) => void;
  quotaQuantity: string;
  setQuotaQuantity: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  paymentLoading: boolean;
  paymentError: string;
  paymentPreviewAmount: number | null;
  handleCreatePublicPayment: () => Promise<void>;
  rsvpCode: string;
  setRsvpCode: (value: string) => void;
  rsvpLoading: boolean;
  rsvpError: string;
  rsvpSuccess: string;
  guest: any | null;
  handleLookupGuest: () => Promise<void>;
  handleRsvpAction: (action: "confirm" | "decline") => Promise<void>;
  showBackToTop: boolean;
};

const GIFT_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f7efe9"/>
          <stop offset="100%" stop-color="#eee0d4"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bg)"/>
      <rect x="220" y="170" width="360" height="250" rx="28" fill="#e0c7b7"/>
      <rect x="380" y="130" width="40" height="320" rx="16" fill="#cfa88f"/>
      <rect x="250" y="255" width="300" height="34" rx="17" fill="#cfa88f"/>
      <circle cx="350" cy="160" r="40" fill="#cfa88f"/>
      <circle cx="450" cy="160" r="40" fill="#cfa88f"/>
      <text x="400" y="510" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#8e715d">
        VivaLista
      </text>
    </svg>
  `);

function formatDate(date?: string) {
  if (!date) return "Data a definir";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

function formatDateShort(date?: string | null) {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

function formatDateTime(date?: string | null) {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

function formatMoney(value?: number | null) {
  if (value === undefined || value === null) return "Valor a consultar";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function isValidHexColor(value: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

function expandHexColor(value: string) {
  const hex = value.replace("#", "").trim();

  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((char) => char + char)
      .join("")}`;
  }

  if (hex.length === 6) {
    return `#${hex}`;
  }

  return null;
}

function normalizeColor(value?: string | null, fallback = "#7c4ce0") {
  const raw = value?.trim();

  if (!raw) return fallback;

  if (isValidHexColor(raw)) {
    return expandHexColor(raw) ?? fallback;
  }

  return fallback;
}

function getContrastTextColor(backgroundColor?: string | null) {
  const normalized = normalizeColor(backgroundColor, "#7c4ce0");
  const expanded = expandHexColor(normalized);

  if (!expanded) return "#ffffff";

  const hex = expanded.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.62 ? "#111827" : "#ffffff";
}

function getButtonStyle(backgroundColor?: string | null) {
  const safeBackground = normalizeColor(backgroundColor, "#7c4ce0");

  return {
    backgroundColor: safeBackground,
    color: getContrastTextColor(safeBackground),
  };
}

function translateGuestStatus(status?: string) {
  if (status === "CONFIRMED") return "CONFIRMADO";
  if (status === "DECLINED") return "RECUSOU";
  return "CONVIDADO";
}

function getGuestStatusTone(status?: string) {
  if (status === "CONFIRMED") {
    return {
      label: "Presença confirmada",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (status === "DECLINED") {
    return {
      label: "Presença recusada",
      className: "border-zinc-200 bg-zinc-100 text-zinc-700",
    };
  }

  return {
    label: "Aguardando resposta",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
}

function getPaymentMethodLabel(value: string) {
  if (value === "CARD") return "Cartão";
  if (value === "PIX") return "Pix";
  if (value === "BOLETO") return "Boleto";
  return value;
}

function getMapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

function getWazeUrl(location: string) {
  return `https://waze.com/ul?q=${encodeURIComponent(location)}`;
}

function getGiftBadge(gift: any) {
  if (gift.giftType === "QUOTA") return "COTAS";
  if (gift.giftType === "CASH") return "EM DINHEIRO";
  if (gift.giftType === "FREE_CONTRIBUTION") return "VALOR LIVRE";
  if (gift.isPurchased) return "COMPRADO";
  if (gift.isReserved) return "RESERVADO";
  return "DISPONÍVEL";
}

function getGiftBadgeClass(gift: any) {
  if (gift.giftType === "QUOTA") return "border border-sky-100 bg-sky-50 text-sky-700";
  if (gift.giftType === "CASH" || gift.giftType === "FREE_CONTRIBUTION") {
    return "border border-violet-100 bg-violet-50 text-violet-700";
  }
  if (gift.isPurchased) return "border border-emerald-200 bg-emerald-50 text-emerald-800";
  if (gift.isReserved) return "border border-amber-200 bg-amber-50 text-amber-800";
  return "border border-rose-100 bg-rose-50 text-rose-700";
}

function getGiftImageStateClass(gift: any) {
  if (gift.isPurchased) return "scale-100 saturate-[0.82] brightness-[0.86]";
  if (gift.isReserved) return "scale-100 saturate-[0.88] brightness-[0.92] blur-[1.2px]";
  return "group-hover:scale-105";
}


function resolveGiftImage(gift: any, index = 0): string {
  const directImage =
    typeof gift?.imageUrl === "string" && gift.imageUrl.trim()
      ? gift.imageUrl.trim()
      : typeof gift?.image === "string" && gift.image.trim()
        ? gift.image.trim()
        : typeof gift?.photoUrl === "string" && gift.photoUrl.trim()
          ? gift.photoUrl.trim()
          : typeof gift?.coverImage === "string" && gift.coverImage.trim()
            ? gift.coverImage.trim()
            : "";

  if (directImage) return directImage;

  const fallbackGiftImages = [
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85",
  ];

  return fallbackGiftImages[index % fallbackGiftImages.length];
}

function getGiftOverlayToneClass(gift: any) {
  if (gift.isPurchased) return "bg-emerald-950/42";
  if (gift.isReserved) return "bg-amber-950/28";
  return "bg-transparent";
}

function getGiftOverlayCardClass(gift: any) {
  if (gift.isPurchased) {
    return "border border-emerald-200/80 bg-white/92 text-emerald-900 shadow-[0_20px_50px_rgba(16,185,129,0.18)]";
  }
  return "border border-amber-200/80 bg-white/92 text-amber-900 shadow-[0_20px_50px_rgba(245,158,11,0.18)]";
}

function getGiftStateTitle(gift: any) {
  if (gift.isPurchased) return "Presente comprado";
  if (gift.isReserved) return "Presente reservado";
  return "Presente disponível";
}

function getGiftStateDescription(gift: any) {
  if (gift.isPurchased) {
    return gift.purchasedByName
      ? `Comprado por ${gift.purchasedByName}`
      : "Este presente já foi comprado para o evento.";
  }

  if (gift.isReserved) {
    return gift.reservedByName
      ? `Reservado por ${gift.reservedByName}`
      : "Este presente já foi reservado para o evento.";
  }

  return "Disponível para escolha neste momento.";
}

function getGiftActionLabel(gift: any) {
  if (gift.giftType === "QUOTA") return "Contribuir";
  if (gift.giftType === "CASH") return "Presentear em dinheiro";
  if (gift.giftType === "FREE_CONTRIBUTION") return "Contribuir livre";
  if (gift.isPurchased) return "Comprado";
  if (gift.isReserved) return "Reservado";
  return "Presentear";
}

function getGiftActionDisabled(gift: any) {
  if (
    gift.giftType === "CASH" ||
    gift.giftType === "QUOTA" ||
    gift.giftType === "FREE_CONTRIBUTION"
  ) {
    return false;
  }
  return gift.isPurchased || gift.isReserved;
}

function getGiftImage(gift: any) {
  const image = gift.imageUrl?.trim();
  return image && image.length > 0 ? image : GIFT_PLACEHOLDER;
}


function getSectionMediaItems(
  items: PublicSectionMedia[] | undefined,
  sectionKey: PublicSectionKey
) {
  return (items || [])
    .filter((item) => item.sectionKey === sectionKey && item.isActive !== false && item.imageUrl)
    .sort((a, b) => {
      const orderA = Number(a.displayOrder ?? 0);
      const orderB = Number(b.displayOrder ?? 0);

      if (orderA !== orderB) return orderA - orderB;
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;

      return String(a.id ?? "").localeCompare(String(b.id ?? ""));
    });
}

function getPrimarySectionImage(
  items: PublicSectionMedia[] | undefined,
  sectionKey: PublicSectionKey,
  fallback?: string | null
) {
  const sectionItems = getSectionMediaItems(items, sectionKey);
  const primary = sectionItems.find((item) => item.isPrimary) || sectionItems[0];

  return primary?.imageUrl || fallback || null;
}

function getSectionImages(
  items: PublicSectionMedia[] | undefined,
  sectionKey: PublicSectionKey
) {
  return getSectionMediaItems(items, sectionKey)
    .map((item) => item.imageUrl)
    .filter((image): image is string => Boolean(image));
}


type ParsedVisualPayload = {
  fontStyle: string;
  titleSize: string;
  titleScale: number;
  detailScale: number;
  textDensity: string;
  textFrameStyle: string;
  siteAtmosphere: string;
  photoSettings: {
    fit: "cover" | "contain";
    zoom: number;
    x: number;
    y: number;
  };
  textSettings: {
    align: "left" | "center" | "right";
    placement: "top" | "middle" | "bottom";
  };
};

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function parseVisualPayload(raw?: string | null): ParsedVisualPayload {
  const source = raw?.trim();

  if (!source) {
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

  const parts = source.split("|");
  const fontStyle = parts[0] || "serenata-script";

  const getPart = (key: string, fallback: string) =>
    parts.find((part) => part.startsWith(`${key}:`))?.replace(`${key}:`, "") ||
    fallback;

  const parsedZoom = Number(getPart("photozoom", "112"));
  const parsedX = Number(getPart("photox", "50"));
  const parsedY = Number(getPart("photoy", "50"));
  const parsedTitleScale = Number(getPart("scale", "92"));
  const parsedDetailScale = Number(getPart("detail", "100"));

  const align = getPart("align", "center");
  const placement = getPart("place", "middle");

  return {
    fontStyle,
    titleSize: getPart("size", "grande"),
    titleScale: clampNumber(parsedTitleScale, 62, 115, 92),
    detailScale: clampNumber(parsedDetailScale, 80, 125, 100),
    textDensity: getPart("text", "padrao"),
    textFrameStyle: getPart("frame", "auto"),
    siteAtmosphere: getPart("atmosphere", "clean-luxo"),
    photoSettings: {
      fit: getPart("photofit", "cover") === "contain" ? "contain" : "cover",
      zoom: clampNumber(parsedZoom, 80, 170, 112),
      x: clampNumber(parsedX, 0, 100, 50),
      y: clampNumber(parsedY, 0, 100, 50),
    },
    textSettings: {
      align: align === "left" || align === "right" ? align : "center",
      placement: placement === "top" || placement === "bottom" ? placement : "middle",
    },
  };
}

function getWeddingFontFamily(fontStyle?: string | null) {
  const value = fontStyle || "";

  if (
    [
      "serenata-script",
      "champagne-script",
      "chandelier",
      "wellington",
      "sacramento",
      "love-note",
      "soft-signature",
      "sunkissed",
      "beautiful-script",
    ].includes(value)
  ) {
    return `"Bickham Script Pro", "Snell Roundhand", "Segoe Script", "Brush Script MT", cursive`;
  }

  if (
    [
      "editorial-classic",
      "empire-serif",
      "roman-elegance",
      "classical",
      "beaumont",
      "poise-serif",
      "elegante",
      "classico",
    ].includes(value)
  ) {
    return `"Bodoni 72", "Didot", "Playfair Display", Georgia, serif`;
  }

  if (["studio-modern", "urban-clean", "contour", "typewriter", "viva-sans", "minimalista"].includes(value)) {
    return `"Montserrat", "Inter", Arial, sans-serif`;
  }

  return `"Bodoni 72", "Didot", "Playfair Display", Georgia, serif`;
}

function getWeddingBodyFontFamily(fontStyle?: string | null) {
  const value = fontStyle || "";

  if (["studio-modern", "urban-clean", "contour", "typewriter", "viva-sans", "minimalista"].includes(value)) {
    return `"Inter", Arial, sans-serif`;
  }

  return `"Montserrat", "Inter", Arial, sans-serif`;
}

function getMonogram(title?: string | null) {
  const words = String(title || "VivaLista")
    .replace(/&/g, " e ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word && !["e", "de", "da", "do", "dos", "das"].includes(word.toLowerCase()));

  const first = words[0]?.[0] ?? "V";
  const second = words[1]?.[0] ?? "L";

  return `${first.toUpperCase()} / ${second.toUpperCase()}`;
}

function getTextAlignClass(align: ParsedVisualPayload["textSettings"]["align"]) {
  if (align === "left") return "text-left items-start";
  if (align === "right") return "text-right items-end";
  return "text-center items-center";
}

function getTextPlacementClass(placement: ParsedVisualPayload["textSettings"]["placement"]) {
  if (placement === "top") return "justify-start pt-24 md:pt-32";
  if (placement === "bottom") return "justify-end pb-24 md:pb-32";
  return "justify-center";
}

function resolveHeroLayout(
  heroLayout?: string | null,
  templateKey?: string | null,
  themeKey?: string | null
) {
  const raw = String(heroLayout || "").toLowerCase().trim();
  const template = String(templateKey || "").toLowerCase().trim();
  const theme = String(themeKey || "").toLowerCase().trim();
  const combined = `${raw} ${template} ${theme}`;

  if (
    combined.includes("circular") ||
    combined.includes("circulo") ||
    combined.includes("círculo") ||
    combined.includes("foto-circular") ||
    combined.includes("foto circular") ||
    combined.includes("capa-foto-circular") ||
    combined.includes("capa foto circular") ||
    combined.includes("casamento-folhas") ||
    combined.includes("casamento folhas")
  ) {
    return "circular";
  }

  if (combined.includes("oval")) return "oval";
  if (combined.includes("moldura")) return "foto-moldura";
  if (combined.includes("poster")) return "poster-editorial";
  if (combined.includes("meio-a-meio") || combined.includes("meio a meio")) return "meio-a-meio";
  if (combined.includes("split")) return "split-curvo";
  if (combined.includes("esquerda")) return "esquerda-esfumada";
  if (combined.includes("convite")) return "convite-luxo";
  if (combined.includes("faixa")) return "faixa-convite";
  if (combined.includes("monograma")) return "monograma-clean";
  if (combined.includes("minimal")) return "minimal-luxo";
  if (combined.includes("black")) return "black-tie";
  if (combined.includes("cinematograf")) return "cinematografica";

  return heroLayout || "centralizado";
}

function getHeroContentWidth(heroLayout?: string | null) {
  if (heroLayout === "monograma-clean" || heroLayout === "convite-luxo" || heroLayout === "faixa-convite") {
    return "max-w-4xl";
  }

  if (heroLayout === "minimal-luxo" || heroLayout === "poster-editorial") {
    return "max-w-5xl";
  }

  return "max-w-3xl";
}

function getHeroTextFrameClass(textFrameStyle: string, heroLayout?: string | null) {
  const shouldFrame =
    textFrameStyle !== "solto" &&
    (textFrameStyle !== "auto" ||
      [
        "centralizado",
        "editorial-cartao",
        "convite-luxo",
        "faixa-convite",
        "monograma-clean",
        "foto-moldura",
      ].includes(heroLayout || ""));

  if (!shouldFrame) return "";

  if (textFrameStyle === "preta" || textFrameStyle === "forte") {
    return "rounded-[36px] border border-white/12 bg-black/58 p-7 shadow-[0_30px_95px_rgba(0,0,0,.32)] backdrop-blur-xl md:p-10";
  }

  if (textFrameStyle === "fosca") {
    return "rounded-[36px] border border-white/18 bg-white/14 p-7 shadow-[0_30px_95px_rgba(0,0,0,.22)] backdrop-blur-2xl md:p-10";
  }

  return "rounded-[36px] border border-white/55 bg-white/88 p-7 text-[#221711] shadow-[0_30px_95px_rgba(73,49,31,.16)] backdrop-blur-xl md:p-10";
}

function isLightTextFrame(textFrameStyle: string, heroLayout?: string | null) {
  const lightLayouts = [
    "centralizado",
    "editorial-cartao",
    "convite-luxo",
    "faixa-convite",
    "monograma-clean",
    "foto-moldura",
    "circular",
    "oval",
    "poster-editorial",
    "meio-a-meio",
    "split-curvo",
    "esquerda-esfumada",
  ];

  return (
    textFrameStyle === "branca" ||
    textFrameStyle === "elegante" ||
    lightLayouts.includes(heroLayout || "")
  );
}

function getPhotoObjectStyle(visual: ParsedVisualPayload): CSSProperties {
  return {
    objectFit: visual.photoSettings.fit,
    objectPosition: `${visual.photoSettings.x}% ${visual.photoSettings.y}%`,
    transform: `scale(${visual.photoSettings.zoom / 112})`,
  };
}

const WEDDING_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=92",
];

export default function WeddingPublicPage({
  event,
  countdown,
  galleryImages,
  sectionMedia = [],
  filteredGifts,
  giftCategories,
  financialSummary,
  showStory,
  showGallery,
  showLocation,
  showGifts,
  showRsvp,
  showCountdown,
  copied,
  handleCopyLink,
  giftSearch,
  setGiftSearch,
  giftCategory,
  setGiftCategory,
  giftSort,
  setGiftSort,
  openPaymentModal,
  selectedGift,
  closePaymentModal,
  buyerName,
  setBuyerName,
  buyerEmail,
  setBuyerEmail,
  buyerPhone,
  setBuyerPhone,
  buyerMessage,
  setBuyerMessage,
  customAmount,
  setCustomAmount,
  quotaQuantity,
  setQuotaQuantity,
  paymentMethod,
  setPaymentMethod,
  paymentLoading,
  paymentError,
  paymentPreviewAmount,
  handleCreatePublicPayment,
  rsvpCode,
  setRsvpCode,
  rsvpLoading,
  rsvpError,
  rsvpSuccess,
  guest,
  handleLookupGuest,
  handleRsvpAction,
  showBackToTop,
}: PublicTemplateProps) {
  const visual = parseVisualPayload(event.fontStyle);
  const primaryColor = normalizeColor(event.primaryColor, "#b88b54");
  const secondaryColor = normalizeColor(event.secondaryColor, "#fbf3ea");
  const paperColor = secondaryColor;
  const softBgColor = secondaryColor;
  const resolvedHeroLayout = resolveHeroLayout(
    event.heroLayout,
    event.templateKey,
    event.themeKey
  );
  const darkColor =
    event.heroLayout === "black-tie" ||
    event.heroLayout === "corporativo-neon" ||
    event.heroLayout === "festa-palco" ||
    event.heroLayout === "cinematografica"
      ? "#080709"
      : "#0d0a08";
  const headerMonogram = getMonogram(event.title);
  const displayFontFamily = getWeddingFontFamily(visual.fontStyle);
  const bodyFontFamily = getWeddingBodyFontFamily(visual.fontStyle);
  const heroTitleScale = visual.titleScale / 92;
  const heroDetailScale = visual.detailScale / 100;
  const heroTextLightFrame = isLightTextFrame(visual.textFrameStyle, resolvedHeroLayout);
  const heroTextColor = heroTextLightFrame ? "#221711" : "#fff8ef";
  const heroSubTextColor = heroTextLightFrame ? "#5c4b3e" : "rgba(255,248,239,.84)";
  const heroEyebrowColor = heroTextLightFrame ? primaryColor : "var(--wedding-primary)";
  const photoObjectStyle = getPhotoObjectStyle(visual);
  const themeVars = {
    "--wedding-primary": primaryColor,
    "--wedding-secondary": secondaryColor,
    "--wedding-paper": paperColor,
    "--wedding-soft-bg": softBgColor,
    "--wedding-dark": darkColor,
    "--wedding-muted-light": "rgba(255,248,239,.82)",
    "--wedding-body-font": bodyFontFamily,
    "--wedding-display-font": displayFontFamily,
  } as CSSProperties;

  const invitationImage = getPrimarySectionImage(sectionMedia, "INVITATION");
  const [invitationOpened, setInvitationOpened] = useState(!invitationImage);

  const coupleImages = getSectionImages(sectionMedia, "COUPLE");
  const storyImages = getSectionImages(sectionMedia, "STORY");
  const gallerySectionImages = getSectionImages(sectionMedia, "GALLERY");
  const receptionImage = getPrimarySectionImage(sectionMedia, "RECEPTION");
  const infoImages = getSectionImages(sectionMedia, "INFO");
  const menuImages = getSectionImages(sectionMedia, "MENU");
  const locationImage = getPrimarySectionImage(sectionMedia, "LOCATION");
  const accommodationImage = getPrimarySectionImage(sectionMedia, "ACCOMMODATION");
  const giftsImages = getSectionImages(sectionMedia, "GIFTS");
  const defaultGiftImage = getPrimarySectionImage(sectionMedia, "DEFAULT_GIFT");

  const heroImage =
    getPrimarySectionImage(sectionMedia, "HERO") ||
    event.heroImage ||
    event.coverImage ||
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2400&q=92";

  const weddingGallery =
    gallerySectionImages.length > 0
      ? gallerySectionImages
      : galleryImages.filter((image) => image && image !== GIFT_PLACEHOLDER).length > 0
        ? galleryImages
        : WEDDING_FALLBACK_IMAGES;

  const storyDisplayImages =
    storyImages.length > 0
      ? storyImages
      : coupleImages.length > 0
        ? coupleImages
        : weddingGallery;

  function renderHero() {
    const layout = resolvedHeroLayout;
    const titleFrameClass = getHeroTextFrameClass(visual.textFrameStyle, layout);
    const textAlignClass = getTextAlignClass(visual.textSettings.align);
    const placementClass = getTextPlacementClass(visual.textSettings.placement);
    const titleBaseStyle = {
      color: heroTextColor,
      transform: `scale(${heroTitleScale})`,
      transformOrigin: visual.textSettings.align === "right" ? "right center" : visual.textSettings.align === "left" ? "left center" : "center",
    } as CSSProperties;
    const detailBaseStyle = {
      color: heroSubTextColor,
      transform: `scale(${heroDetailScale})`,
      transformOrigin: visual.textSettings.align === "right" ? "right center" : visual.textSettings.align === "left" ? "left center" : "center",
    } as CSSProperties;

    const eyebrow = (
      <p className="wedding-eyebrow" style={{ color: heroEyebrowColor }}>
        Com muito amor
      </p>
    );

    const titleBlock = (
      <div className={`flex flex-col ${textAlignClass} ${titleFrameClass}`}>
        {eyebrow}
        <h1
          className="wedding-display mt-7 text-6xl leading-[0.86] sm:text-8xl lg:text-[118px]"
          style={titleBaseStyle}
        >
          {event.title}
        </h1>
        <p
          className="wedding-serif mt-7 max-w-2xl text-3xl italic leading-tight sm:text-4xl"
          style={detailBaseStyle}
        >
          {event.publicSubtitle || event.welcomeMessage || "O início do nosso para sempre."}
        </p>

        <div className={`mt-8 flex flex-wrap gap-3 ${visual.textSettings.align === "center" ? "justify-center" : visual.textSettings.align === "right" ? "justify-end" : "justify-start"}`}>
          <span className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] backdrop-blur" style={{ color: heroSubTextColor }}>
            {formatDateShort(event.date)}
          </span>
          <span className="max-w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] backdrop-blur" style={{ color: heroSubTextColor }}>
            {event.location}
          </span>
        </div>

        <div className={`mt-10 flex flex-wrap gap-4 ${visual.textSettings.align === "center" ? "justify-center" : visual.textSettings.align === "right" ? "justify-end" : "justify-start"}`}>
          {showRsvp ? (
            <a
              href="#confirmacao"
              className="rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.16em] shadow-[0_18px_50px_rgba(0,0,0,.28)] transition hover:-translate-y-0.5"
              style={getButtonStyle(primaryColor)}
            >
              Confirmar presença
            </a>
          ) : null}

          {showGifts ? (
            <a
              href="#presentes"
              className="rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_50px_rgba(0,0,0,.18)] backdrop-blur transition hover:bg-white/15"
            >
              Ver presentes
            </a>
          ) : null}
        </div>
      </div>
    );

    const fullPhoto = (
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt={event.title}
          className="h-full w-full wedding-hero-photo object-cover"
          style={photoObjectStyle}
        />
      </div>
    );

    if (layout === "meio-a-meio" || layout === "split-curvo" || layout === "esquerda-esfumada") {
      const imageClass =
        layout === "split-curvo"
          ? "overflow-hidden rounded-bl-[120px] rounded-tl-[44px]"
          : layout === "esquerda-esfumada"
            ? "overflow-hidden rounded-l-[90px]"
            : "overflow-hidden";

      return (
        <section id="inicio" className="relative overflow-hidden bg-[var(--wedding-secondary)] text-white">
          <div className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-0 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className={`relative z-20 flex min-h-[560px] ${placementClass}`}>
              <div className={getHeroContentWidth(layout)}>{titleBlock}</div>
            </div>
            <div className={`relative min-h-[560px] ${imageClass} border border-white/35 shadow-[0_34px_110px_rgba(73,49,31,.18)]`}>
              <img
                src={heroImage}
                alt={event.title}
                className="absolute inset-0 h-full w-full wedding-hero-photo object-cover"
                style={photoObjectStyle}
              />
              {layout === "esquerda-esfumada" ? (
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--wedding-secondary)] via-transparent to-transparent" />
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    if (layout === "circular" || layout === "oval" || layout === "foto-moldura" || layout === "poster-editorial") {
      const shapeClass =
        layout === "circular"
          ? "rounded-full aspect-square"
          : layout === "oval"
            ? "rounded-[999px] aspect-[3/4]"
            : layout === "poster-editorial"
              ? "rounded-[28px] aspect-[3/4]"
              : "rounded-[42px] aspect-[4/5]";

      return (
        <section id="inicio" className="relative overflow-hidden bg-[var(--wedding-secondary)] text-[#33404a]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,.80),transparent_30%),radial-gradient(circle_at_86%_14%,color-mix(in_srgb,var(--wedding-primary)_16%,transparent),transparent_28%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/70" />

          <div className="relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
            <div className={`flex ${placementClass}`}>
              <div className="max-w-4xl">{titleBlock}</div>
            </div>

            <div className="relative mx-auto w-full max-w-[500px]">
              <div className="absolute -right-6 top-10 hidden rounded-full border border-[#d7c8ba] bg-white/72 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#5d6670] shadow-[0_18px_50px_rgba(73,49,31,.10)] backdrop-blur md:block">
                Foto principal
              </div>

              <div className={`relative mx-auto w-full ${shapeClass} overflow-hidden border-[10px] border-white/78 bg-white shadow-[0_34px_110px_rgba(73,49,31,.20)]`}>
                <img
                  src={heroImage}
                  alt={event.title}
                  className="h-full w-full wedding-hero-photo object-cover"
                  style={photoObjectStyle}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (layout === "convite-luxo" || layout === "faixa-convite" || layout === "monograma-clean" || layout === "minimal-luxo") {
      return (
        <section id="inicio" className="relative overflow-hidden bg-[var(--wedding-secondary)] text-[#221711]">
          <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,.84),transparent_26%),radial-gradient(circle_at_82%_14%,color-mix(in_srgb,var(--wedding-primary)_20%,transparent),transparent_24%)]" />
          {layout === "faixa-convite" ? (
            <div className="relative h-[280px] overflow-hidden">
              <img
                src={heroImage}
                alt={event.title}
                className="h-full w-full wedding-hero-photo object-cover"
                style={photoObjectStyle}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ) : null}
          <div className={`relative z-10 mx-auto flex ${layout === "faixa-convite" ? "min-h-[520px]" : "min-h-[760px]"} max-w-7xl ${placementClass} px-4 py-20 sm:px-6 lg:px-8`}>
            <div className="mx-auto w-full max-w-4xl rounded-[44px] border border-white/70 bg-white/82 p-7 text-center shadow-[0_34px_110px_rgba(73,49,31,.15)] backdrop-blur-xl md:p-12">
              <p className="wedding-serif text-3xl" style={{ color: primaryColor }}>
                {headerMonogram}
              </p>
              {titleBlock}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section id="inicio" className="relative min-h-[760px] overflow-hidden bg-[var(--wedding-dark)] text-white">
        {fullPhoto}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,10,8,.95)_0%,rgba(13,10,8,.62)_47%,rgba(13,10,8,.18)_100%)]" />
        {layout === "centralizado" || layout === "editorial-cartao" ? (
          <div className="absolute inset-0 bg-black/18" />
        ) : null}
        {layout === "black-tie" || layout === "cinematografica" ? (
          <div className="absolute inset-0 bg-black/36" />
        ) : null}
        {layout === "festa-palco" ? (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,color-mix(in_srgb,var(--wedding-primary)_34%,transparent),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,.16),transparent_24%)]" />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--wedding-soft-bg)] to-transparent" />
        <div className="absolute left-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_22%_20%,color-mix(in_srgb,var(--wedding-primary)_18%,transparent),transparent_34%)]" />

        <div className={`relative z-10 mx-auto flex min-h-[760px] max-w-7xl ${placementClass} px-4 py-20 sm:px-6 lg:px-8`}>
          <div className={getHeroContentWidth(layout)}>{titleBlock}</div>
        </div>
      </section>
    );
  }

  return (
    <main className={`wedding-public-v5o wedding-atmosphere-${visual.siteAtmosphere} min-h-screen bg-[var(--wedding-soft-bg)] text-[#2f2721]`} style={themeVars}>
      {invitationImage && !invitationOpened ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--wedding-dark)] px-5">
          <div className="w-full max-w-[430px] overflow-hidden rounded-[34px] border border-white/10 bg-[var(--wedding-paper)] shadow-[0_32px_100px_rgba(0,0,0,.45)]">
            <div className="aspect-[4/5] bg-[#ead8c5]">
              <img
                src={invitationImage}
                alt="Convite de abertura"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="bg-[linear-gradient(135deg,#d1a05f,#efd09b)] p-5 text-center">
              <button
                type="button"
                onClick={() => setInvitationOpened(true)}
                className="rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#17100b] shadow-[0_14px_35px_rgba(0,0,0,.22)] transition hover:-translate-y-0.5"
              >
                Abrir convite
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scroll-behavior: smooth; }
            .wedding-public-v5o {
              font-family: var(--wedding-body-font);
            }
            .wedding-display {
              font-family: var(--wedding-display-font);
              font-weight: 400;
              letter-spacing: -.055em;
            }
            .wedding-serif {
              font-family: var(--wedding-display-font);
              font-weight: 400;
            }
            .wedding-eyebrow {
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .30em;
              text-transform: uppercase;
            }
            .wedding-card-shadow {
              box-shadow: 0 26px 80px rgba(73, 49, 31, .10);
            }
            .wedding-photo {
              background-size: cover;
              background-position: center;
            }
            .wedding-hero-photo {
              object-position: ${visual.photoSettings.x}% ${visual.photoSettings.y}%;
            }
            .wedding-atmosphere-clean-luxo {
              background:
                radial-gradient(circle at top left, color-mix(in srgb, var(--wedding-primary) 14%, transparent), transparent 34%),
                linear-gradient(180deg, var(--wedding-secondary), #fffaf5 72%);
            }
            .wedding-atmosphere-romantico-floral,
            .wedding-atmosphere-jardim-editorial {
              background:
                radial-gradient(circle at 12% 12%, rgba(255,255,255,.72), transparent 28%),
                radial-gradient(circle at 88% 18%, color-mix(in srgb, var(--wedding-primary) 18%, transparent), transparent 30%),
                linear-gradient(180deg, var(--wedding-secondary), #fff7f0 74%);
            }
            .wedding-atmosphere-marmore-noite,
            .wedding-atmosphere-preto-ouro,
            .wedding-atmosphere-azul-corporativo {
              background:
                radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--wedding-primary) 28%, transparent), transparent 30%),
                linear-gradient(180deg, #09080a, #15110e 56%, var(--wedding-secondary));
            }
            @media (max-width: 768px) {
              .wedding-display { letter-spacing: -.035em; }
            }
          `,
        }}
      />

      <header className="sticky top-0 z-50 border-b border-[#e4d2bf]/70 bg-[var(--wedding-paper)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="wedding-serif text-2xl text-[var(--wedding-primary)]">
            {headerMonogram}
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#inicio" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
              Início
            </a>
            {showStory ? (
              <a href="#historia" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
                Nossa história
              </a>
            ) : null}
            <a href="#cerimonia" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
              Cerimônia
            </a>
            {showGallery ? (
              <a href="#galeria" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
                Galeria
              </a>
            ) : null}
            <a href="#recepcao" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
              Recepção
            </a>
            <a href="#informacoes" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
              Informações
            </a>
            {menuImages.length > 0 ? (
              <a href="#cardapio" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
                Cardápio
              </a>
            ) : null}
            {accommodationImage ? (
              <a href="#hospedagem" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
                Hospedagem
              </a>
            ) : null}
            {showGifts ? (
              <a href="#presentes" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a href="#confirmacao" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[var(--wedding-primary)]">
                RSVP
              </a>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden rounded-full border border-[#dfc9b3] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#746053] transition hover:bg-white md:inline-flex"
            >
              {copied ? "Copiado" : "Copiar link"}
            </button>

            {showRsvp ? (
              <a
                href="#confirmacao"
                className="rounded-full bg-[#16110e] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-[#e5c18a] shadow-lg transition hover:-translate-y-0.5"
              >
                Confirmar
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {renderHero()}

      {showCountdown ? (
        <section className="bg-[var(--wedding-dark)] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="wedding-eyebrow text-[var(--wedding-primary)]">Contagem regressiva</p>
            <h2 className="wedding-serif mt-4 text-4xl text-[var(--wedding-paper)] sm:text-5xl">
              Está chegando o grande dia.
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {countdown.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/10 bg-white/[.075] px-4 py-7 shadow-[0_20px_60px_rgba(0,0,0,.26)] backdrop-blur"
                >
                  <strong className="wedding-serif block text-5xl font-normal text-[var(--wedding-primary)]">
                    {item.value}
                  </strong>
                  <span className="mt-3 block text-[11px] font-black uppercase tracking-[0.24em] text-white/55">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[var(--wedding-paper)] px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[38px] border border-[#ead8c5] bg-white/75 px-7 py-12 wedding-card-shadow sm:px-12">
          <p className="wedding-eyebrow text-[var(--wedding-primary)]">Mensagem aos convidados</p>
          <h2 className="wedding-serif mt-5 text-4xl leading-tight text-[#2f2721] sm:text-6xl">
            O que Deus uniu, ninguém separe.
          </h2>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#746053] sm:text-lg">
            {event.welcomeMessage ||
              event.openingMessage ||
              event.description ||
              "Criamos este site para compartilhar com vocês os detalhes do nosso casamento. Estamos muito felizes e contamos com a presença de todos no nosso grande dia."}
          </p>
        </div>
      </section>

      {showStory ? (
        <section id="historia" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative min-h-[560px]">
              <div
                className="absolute inset-0 right-20 bottom-24 border-[12px] border-white bg-[#ead8c5] wedding-card-shadow wedding-photo"
                style={{ backgroundImage: `url("${storyDisplayImages[1] || storyDisplayImages[0]}")` }}
              />
              <div
                className="absolute bottom-0 right-0 h-[310px] w-[48%] border-[10px] border-white bg-[#ead8c5] wedding-card-shadow wedding-photo"
                style={{ backgroundImage: `url("${storyDisplayImages[0]}")` }}
              />
            </div>

            <div>
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Nossa história</p>
              <h2 className="wedding-display mt-5 text-6xl leading-[0.9] text-[#2f2721] sm:text-7xl">
                Dois caminhos. Um mesmo destino.
              </h2>
              <p className="mt-7 text-lg leading-9 text-[#746053]">
                Entre sonhos, escolhas e momentos especiais, este dia marca o começo
                de uma nova fase. Esta página reúne as informações mais importantes
                para que todos participem com carinho e tranquilidade.
              </p>
              <p className="wedding-serif mt-8 border-l-2 border-[var(--wedding-primary)] pl-6 text-3xl leading-tight text-[var(--wedding-primary)]">
                Cada detalhe foi pensado para celebrar o amor.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section id="recepcao" className="relative overflow-hidden bg-[var(--wedding-dark)] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-25 wedding-photo"
          style={{ backgroundImage: `url("${receptionImage || weddingGallery[2] || heroImage}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,10,8,.96),rgba(13,10,8,.72),rgba(13,10,8,.46))]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="wedding-eyebrow text-[var(--wedding-primary)]">Cerimônia & Recepção</p>
          <h2 className="wedding-serif mt-4 text-4xl text-[var(--wedding-paper)] sm:text-5xl">
            Informações do grande dia
          </h2>

          <div className="mt-12 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <div className="text-5xl text-[var(--wedding-primary)]">♙</div>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.26em] text-[var(--wedding-primary)]">
                Cerimônia
              </h3>
              <strong className="wedding-serif mt-3 block text-4xl font-normal text-white">
                {formatDateShort(event.date)}
              </strong>
              <p className="mt-3 text-white/65">{event.location}</p>
            </div>

            <div className="hidden h-36 w-px bg-white/15 md:block" />

            <div>
              <div className="text-5xl text-[var(--wedding-primary)]">♢</div>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.26em] text-[var(--wedding-primary)]">
                Recepção
              </h3>
              <strong className="wedding-serif mt-3 block text-4xl font-normal text-white">
                Após a cerimônia
              </strong>
              <p className="mt-3 text-white/65">
                Celebração, presentes, localização e confirmação em um só lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {showGallery ? (
        <section id="galeria" className="bg-[var(--wedding-paper)] py-16 text-center">
          <p className="wedding-eyebrow text-[var(--wedding-primary)]">Galeria</p>
          <h2 className="wedding-serif mt-3 text-4xl text-[#2f2721] sm:text-5xl">
            Atmosfera do evento
          </h2>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-5">
            {weddingGallery.slice(0, 5).map((image, index) => (
              <div key={`${image}-${index}`} className="h-64 overflow-hidden bg-[#ead8c5] md:h-80">
                <div
                  className="h-full w-full wedding-photo transition duration-700 hover:scale-105"
                  style={{ backgroundImage: `url("${image}")` }}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="informacoes" className="bg-[#f3dfd3] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
          <div className="rounded-[34px] border border-[#e1c7b1] bg-[var(--wedding-paper)]/80 p-8 wedding-card-shadow">
            <p className="wedding-eyebrow text-[var(--wedding-primary)]">Informações</p>
            <h2 className="wedding-display mt-4 text-5xl leading-[0.95] text-[#2f2721] sm:text-6xl">
              Tudo pensado para você chegar tranquilo.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#746053]">
              Confira data, local, rotas, presentes e confirmação nesta página.
              O objetivo é deixar a experiência mais clara e mais bonita para os convidados.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[28px] border border-[#e1c7b1] bg-white/70 p-6 wedding-card-shadow">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Data</p>
              <p className="mt-4 text-2xl font-semibold text-[#2f2721]">{formatDate(event.date)}</p>
            </div>
            <div className="rounded-[28px] border border-[#e1c7b1] bg-white/70 p-6 wedding-card-shadow">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Local</p>
              <p className="mt-4 break-words text-2xl font-semibold text-[#2f2721]">{event.location}</p>
            </div>
            <div className="rounded-[28px] border border-[#e1c7b1] bg-white/70 p-6 wedding-card-shadow">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Presentes</p>
              <p className="mt-4 text-2xl font-semibold text-[#2f2721]">{filteredGifts.length} disponíveis</p>
            </div>
            <div className="rounded-[28px] border border-[#e1c7b1] bg-white/70 p-6 wedding-card-shadow">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Arrecadado</p>
              <p className="mt-4 text-2xl font-semibold text-[#2f2721]">{formatMoney(financialSummary.totalRaised)}</p>
            </div>
          </div>

          {infoImages.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {infoImages.slice(0, 3).map((image, index) => (
                <div key={`${image}-${index}`} className="h-64 overflow-hidden rounded-[28px] border border-[#e1c7b1] bg-[#ead8c5] wedding-card-shadow">
                  <img src={image} alt={`Informação ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>


      {menuImages.length > 0 ? (
        <section id="cardapio" className="bg-[var(--wedding-paper)] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Cardápio</p>
              <h2 className="wedding-serif mt-4 text-5xl leading-tight text-[#2f2721] sm:text-6xl">
                Sabores escolhidos para celebrar.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#746053]">
                Uma seção opcional para mostrar buffet, bebidas, mesa de doces ou detalhes do menu.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {menuImages.slice(0, 6).map((image, index) => (
                <div key={`${image}-${index}`} className="h-72 overflow-hidden rounded-[30px] border border-[#e1c7b1] bg-[#ead8c5] wedding-card-shadow">
                  <img src={image} alt={`Cardápio ${index + 1}`} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showLocation ? (
        <section id="localizacao" className="bg-[var(--wedding-paper)] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.86fr_1.14fr]">
            <div className="rounded-[34px] bg-[var(--wedding-dark)] p-8 text-white wedding-card-shadow">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Localização</p>
              <h2 className="wedding-serif mt-5 text-5xl leading-tight text-[var(--wedding-paper)]">
                Como chegar
              </h2>
              <p className="mt-6 text-base leading-8 text-white/70">
                {event.location}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={getMapsUrl(event.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--wedding-dark)] transition hover:bg-[#f7eadf]"
                >
                  Google Maps
                </a>
                <a
                  href={getWazeUrl(event.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Waze
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[34px] border border-[#e1c7b1] bg-[#f7eadf] wedding-card-shadow">
              {locationImage ? (
                <img src={locationImage} alt="Foto do local" className="h-[360px] w-full object-cover" />
              ) : (
                <div className="grid min-h-[360px] place-items-center p-8 text-center">
                  <div>
                    <p className="wedding-eyebrow text-[var(--wedding-primary)]">Mapa</p>
                    <h3 className="wedding-serif mt-3 text-4xl text-[#2f2721]">
                      {event.location}
                    </h3>
                    <p className="mx-auto mt-4 max-w-md text-[#746053]">
                      No site final, esta área pode receber mapa incorporado e botões de rota.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}


      {accommodationImage ? (
        <section id="hospedagem" className="bg-[var(--wedding-soft-bg)] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[34px] border border-[#e1c7b1] bg-[#ead8c5] wedding-card-shadow">
              <img src={accommodationImage} alt="Hospedagem sugerida" className="h-[420px] w-full object-cover" />
            </div>
            <div className="rounded-[34px] border border-[#e1c7b1] bg-[var(--wedding-paper)]/85 p-8 wedding-card-shadow">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Hospedagem</p>
              <h2 className="wedding-serif mt-5 text-5xl leading-tight text-[#2f2721]">
                Sugestão para convidados de fora.
              </h2>
              <p className="mt-6 text-base leading-8 text-[#746053]">
                Esta seção pode receber foto de hotel, pousada, quarto, contatos e observações para quem vem de longe.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {showGifts ? (
        <section id="presentes" className="bg-[#f3dfd3] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Presentes</p>
              <h2 className="wedding-serif mt-4 text-5xl leading-tight text-[#2f2721] sm:text-6xl">
                Lista de presentes
              </h2>
              <p className="mt-5 text-base leading-8 text-[#746053]">
                Sua presença é o nosso maior presente. Se desejar nos presentear,
                escolha uma das opções abaixo.
              </p>
            </div>

            <div className="mb-8 rounded-[30px] border border-[#e1c7b1] bg-[var(--wedding-paper)]/85 p-5 wedding-card-shadow">
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  value={giftSearch}
                  onChange={(event) => setGiftSearch(event.target.value)}
                  placeholder="Buscar presente"
                  className="rounded-2xl border border-[#dec7b2] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--wedding-primary)]"
                />
                <select
                  value={giftCategory}
                  onChange={(event) => setGiftCategory(event.target.value)}
                  className="rounded-2xl border border-[#dec7b2] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--wedding-primary)]"
                >
                  <option value="all">Todas as categorias</option>
                  {giftCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={giftSort}
                  onChange={(event) => setGiftSort(event.target.value)}
                  className="rounded-2xl border border-[#dec7b2] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--wedding-primary)]"
                >
                  <option value="featured">Destaques</option>
                  <option value="az">A-Z</option>
                  <option value="price-asc">Menor valor</option>
                  <option value="price-desc">Maior valor</option>
                </select>
              </div>
            </div>

            {filteredGifts.length === 0 ? (
              <div className="rounded-[34px] border border-[#e1c7b1] bg-[var(--wedding-paper)]/85 p-10 text-center wedding-card-shadow">
                <h3 className="wedding-serif text-4xl text-[#2f2721]">
                  Lista em preparação
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-[#746053]">
                  Os presentes ainda não foram cadastrados para este evento.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {filteredGifts.map((gift, index) => {
                  const disabled = getGiftActionDisabled(gift);

                  return (
                    <article
                      key={gift.id}
                      className="overflow-hidden rounded-[32px] border border-[#e1c7b1] bg-[var(--wedding-paper)] wedding-card-shadow transition hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={resolveGiftImage(gift, index)}
                          alt={gift.title}
                          className={`h-full w-full object-cover transition duration-500 ${getGiftImageStateClass(gift)}`}
                        />
                        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${getGiftBadgeClass(gift)}`}>
                          {getGiftBadge(gift)}
                        </span>
                      </div>

                      <div className="p-6">
                        {gift.category ? (
                          <p className="wedding-eyebrow text-[var(--wedding-primary)]">{gift.category}</p>
                        ) : null}
                        <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#2f2721]">
                          {gift.title}
                        </h3>
                        <p className="mt-3 min-h-[70px] text-sm leading-7 text-[#746053]">
                          {gift.description || "Presente disponível na lista do evento."}
                        </p>
                        <p className="wedding-serif mt-4 text-3xl text-[var(--wedding-primary)]">
                          {gift.giftType === "FREE_CONTRIBUTION"
                            ? "Valor livre"
                            : formatMoney(gift.price)}
                        </p>

                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => openPaymentModal(gift)}
                          className={`mt-6 w-full rounded-full px-5 py-3.5 text-sm font-black uppercase tracking-[0.14em] transition ${
                            disabled
                              ? "cursor-not-allowed bg-[#ead8c5] text-[#746053]"
                              : "bg-[var(--wedding-dark)] text-[var(--wedding-primary)] hover:-translate-y-0.5"
                          }`}
                        >
                          {getGiftActionLabel(gift)}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="bg-[var(--wedding-dark)] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="wedding-eyebrow text-[var(--wedding-primary)]">Próximo passo</p>
            <h2 className="wedding-serif mt-4 max-w-3xl text-5xl leading-tight text-[var(--wedding-paper)]">
              Confirme sua presença e participe deste momento especial.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {showRsvp ? (
              <a href="#confirmacao" className="rounded-full bg-[var(--wedding-primary)] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#17100b]">
                Confirmar presença
              </a>
            ) : null}
            {showGifts ? (
              <a href="#presentes" className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white">
                Ver presentes
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {showRsvp ? (
        <section id="confirmacao" className="bg-[var(--wedding-paper)] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.92fr_1.08fr]">
            <div className="rounded-[34px] bg-[var(--wedding-dark)] p-8 text-white wedding-card-shadow">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">RSVP</p>
              <h2 className="wedding-serif mt-5 text-5xl leading-tight text-[var(--wedding-paper)]">
                Sua presença é muito importante.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/70">
                Digite o código do convite para localizar seu cadastro e confirmar
                sua presença.
              </p>
            </div>

            <div className="rounded-[34px] border border-[#e1c7b1] bg-white/80 p-7 wedding-card-shadow">
              <p className="wedding-eyebrow text-[var(--wedding-primary)]">Localizar convite</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={rsvpCode}
                  onChange={(event) => setRsvpCode(event.target.value)}
                  placeholder="Digite seu código RSVP"
                  className="rounded-2xl border border-[#dec7b2] bg-white px-4 py-3.5 text-sm outline-none focus:border-[var(--wedding-primary)]"
                />
                <button
                  type="button"
                  onClick={handleLookupGuest}
                  disabled={rsvpLoading}
                  className="rounded-2xl bg-[var(--wedding-dark)] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--wedding-primary)] disabled:opacity-60"
                >
                  {rsvpLoading ? "Buscando..." : "Buscar"}
                </button>
              </div>

              {rsvpError ? (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {rsvpError}
                </div>
              ) : null}

              {rsvpSuccess && !guest ? (
                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {rsvpSuccess}
                </div>
              ) : null}

              {guest ? (
                <div className="mt-6 rounded-[28px] border border-[#ead8c5] bg-[var(--wedding-paper)] p-5">
                  <p className="wedding-eyebrow text-[var(--wedding-primary)]">Convidado localizado</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#2f2721]">
                    {guest.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#746053]">
                    Status atual: {translateGuestStatus(guest.status)}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleRsvpAction("confirm")}
                      disabled={rsvpLoading}
                      className="rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white disabled:opacity-60"
                    >
                      Confirmar presença
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRsvpAction("decline")}
                      disabled={rsvpLoading}
                      className="rounded-2xl border border-[#dec7b2] bg-white px-5 py-4 text-sm font-bold text-[#2f2721] disabled:opacity-60"
                    >
                      Não poderei ir
                    </button>
                  </div>

                  {rsvpSuccess ? (
                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {rsvpSuccess}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <footer className="bg-[var(--wedding-dark)] px-4 py-10 text-center text-white/60">
        <p className="wedding-serif text-3xl text-[var(--wedding-primary)]">A / L</p>
        <p className="mt-2 text-sm">
          {formatDateShort(event.date)} • {event.location}
        </p>
      </footer>

      {selectedGift ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[rgba(17,24,39,0.78)] px-3 py-3 backdrop-blur-[5px] sm:px-6 sm:py-8 lg:items-center">
          <div className="max-h-[96vh] w-full max-w-4xl overflow-y-auto rounded-[34px] border border-white/40 bg-[var(--wedding-paper)] shadow-[0_38px_120px_rgba(15,23,42,0.22)]">
            <div className="sticky top-0 z-10 border-b border-[#ead8c5] bg-[var(--wedding-paper)]/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="wedding-eyebrow text-[var(--wedding-primary)]">Pagamento</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#2f2721]">
                    {selectedGift.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="rounded-full border border-[#dec7b2] bg-white px-4 py-2 text-sm font-bold text-[#746053]"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[.9fr_1.1fr]">
              <div className="overflow-hidden rounded-[28px] border border-[#ead8c5] bg-white">
                <img
                  src={getGiftImage(selectedGift)}
                  alt={selectedGift.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-xl font-semibold text-[#2f2721]">
                    {selectedGift.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#746053]">
                    {selectedGift.description || "Pagamento do presente selecionado."}
                  </p>
                  <p className="wedding-serif mt-4 text-3xl text-[var(--wedding-primary)]">
                    {paymentPreviewAmount ? formatMoney(paymentPreviewAmount) : "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#ead8c5] bg-white p-5">
                <div className="grid gap-4">
                  <input
                    value={buyerName}
                    onChange={(event) => setBuyerName(event.target.value)}
                    placeholder="Seu nome"
                    className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[var(--wedding-primary)]"
                  />
                  <input
                    value={buyerEmail}
                    onChange={(event) => setBuyerEmail(event.target.value)}
                    placeholder="Seu e-mail"
                    className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[var(--wedding-primary)]"
                  />
                  <input
                    value={buyerPhone}
                    onChange={(event) => setBuyerPhone(event.target.value)}
                    placeholder="Seu telefone"
                    className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[var(--wedding-primary)]"
                  />
                  <textarea
                    value={buyerMessage}
                    onChange={(event) => setBuyerMessage(event.target.value)}
                    placeholder="Mensagem opcional"
                    className="min-h-[110px] rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[var(--wedding-primary)]"
                  />

                  {(selectedGift.ui?.acceptsCustomAmount ||
                    selectedGift.giftType === "FREE_CONTRIBUTION") ? (
                    <input
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="Valor"
                      className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[var(--wedding-primary)]"
                    />
                  ) : null}

                  {selectedGift.giftType === "QUOTA" ? (
                    <input
                      type="number"
                      min={1}
                      max={selectedGift.quotaRemaining ?? undefined}
                      value={quotaQuantity}
                      onChange={(event) => setQuotaQuantity(event.target.value)}
                      className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[var(--wedding-primary)]"
                    />
                  ) : null}

                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[var(--wedding-primary)]"
                  >
                    <option value="CARD">Cartão</option>
                    <option value="PIX">Pix</option>
                    <option value="BOLETO">Boleto</option>
                  </select>

                  {paymentError ? (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {paymentError}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleCreatePublicPayment}
                    disabled={paymentLoading}
                    className="rounded-full bg-[var(--wedding-dark)] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[var(--wedding-primary)] disabled:opacity-60"
                  >
                    {paymentLoading ? "Gerando pagamento..." : "Continuar para pagamento"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showBackToTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-4 z-40 rounded-full bg-[var(--wedding-dark)] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--wedding-primary)] shadow-xl transition hover:-translate-y-0.5 md:bottom-6"
        >
          Topo
        </button>
      ) : null}

      {(showGifts || showRsvp) ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e1c7b1] bg-[var(--wedding-paper)]/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl gap-3">
            {showGifts ? (
              <a
                href="#presentes"
                className="flex-1 rounded-full bg-[var(--wedding-dark)] px-4 py-3 text-center text-sm font-bold text-[var(--wedding-primary)]"
              >
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a
                href="#confirmacao"
                className="flex-1 rounded-full border border-[#dec7b2] bg-white px-4 py-3 text-center text-sm font-bold text-[#2f2721]"
              >
                Confirmar
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}


