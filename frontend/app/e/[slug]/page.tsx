"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type PublicEventResponse = {
  event?: {
    id?: string;
    name?: string;
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    slug?: string;
    status?: string;
    coverImage?: string | null;
    eventType?: string;
    giftMode?: string;
    templateKey?: string | null;
    themeKey?: string | null;
    openingMessage?: string | null;
    pixEnabled?: boolean;
    freeContributionEnabled?: boolean;
    quotaEnabled?: boolean;
    contributionsFeedEnabled?: boolean;
    publicTitle?: string | null;
    publicSubtitle?: string | null;
    heroImageUrl?: string | null;
    welcomeMessage?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    fontStyle?: string | null;
    heroLayout?: string | null;
    showCountdown?: boolean;
    showStory?: boolean;
    showGallery?: boolean;
    showLocation?: boolean;
    showGifts?: boolean;
    showRsvp?: boolean;
  };
  rsvp?: {
    enabled?: boolean;
    lookupMode?: string;
  };
};

type GiftApiItem = {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  amount?: number;
  imageUrl?: string | null;
  purchaseUrl?: string | null;
  isActive?: boolean;
  isReserved?: boolean;
  isPurchased?: boolean;
  reservedByName?: string | null;
  reservedAt?: string | null;
  purchasedByName?: string | null;
  purchasedAt?: string | null;
  giftType?: string;
  priceMode?: string;
  giftStatus?: string;
  allowCustomAmount?: boolean;
  minAmount?: number | null;
  maxAmount?: number | null;
  category?: string | null;
  isFeatured?: boolean;
  displayOrder?: number;
  quotaTotal?: number;
  quotaSold?: number;
  quotaRemaining?: number;
  progress?: number;
  ui?: {
    canReserve?: boolean;
    canPurchase?: boolean;
    canContribute?: boolean;
    acceptsCustomAmount?: boolean;
  };
};

type Contribution = {
  id: string;
  contributorName: string;
  message?: string | null;
  amount: number;
  paymentMethod?: string;
  paidAt?: string | null;
  createdAt?: string;
  gift?: {
    id?: string;
    title?: string;
    giftType?: string;
  } | null;
};

type FinancialSummary = {
  totalRaised: number;
  paidContributionsCount: number;
  pendingContributionsCount: number;
  averageContribution: number;
};

type PaymentResponse = {
  message?: string;
  payment?: {
    id?: string;
    status?: string;
  };
  gift?: {
    id?: string;
    isPurchased?: boolean;
    purchasedByName?: string | null;
  };
  paymentData?: {
    paymentMethod?: string;
    status?: string;
    checkoutUrl?: string | null;
    pixCode?: string | null;
    pixQrCode?: string | null;
    boletoUrl?: string | null;
    boletoBarcode?: string | null;
  };
};

type LookupResponse = {
  event: {
    id: string;
    name: string;
    slug: string;
  };
  guest: {
    id: string;
    name: string;
    status: "INVITED" | "CONFIRMED" | "DECLINED";
    rsvpCode: string;
  };
};

type PublicEvent = {
  id: string;
  title: string;
  description: string;
  date?: string;
  location: string;
  slug: string;
  status?: string;
  coverImage?: string | null;
  heroImage?: string | null;
  publicSubtitle?: string | null;
  welcomeMessage?: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontStyle?: string | null;
  heroLayout?: string | null;
  showCountdown: boolean;
  showStory: boolean;
  showGallery: boolean;
  showLocation: boolean;
  showGifts: boolean;
  showRsvp: boolean;
  eventType?: string;
  giftMode?: string;
  templateKey?: string | null;
  themeKey?: string | null;
  openingMessage?: string | null;
  pixEnabled: boolean;
  freeContributionEnabled: boolean;
  quotaEnabled: boolean;
  contributionsFeedEnabled: boolean;
  rsvpEnabled: boolean;
  rsvpLookupMode: string;
};

type Gift = {
  id: string;
  title: string;
  description: string;
  price?: number;
  imageUrl?: string | null;
  purchaseUrl?: string | null;
  isReserved: boolean;
  isPurchased: boolean;
  reservedByName?: string | null;
  purchasedByName?: string | null;
  giftType?: string;
  priceMode?: string;
  giftStatus?: string;
  allowCustomAmount?: boolean;
  minAmount?: number | null;
  maxAmount?: number | null;
  category?: string | null;
  isFeatured?: boolean;
  displayOrder?: number;
  quotaTotal?: number;
  quotaSold?: number;
  quotaRemaining?: number;
  progress?: number;
  ui?: {
    canReserve?: boolean;
    canPurchase?: boolean;
    canContribute?: boolean;
    acceptsCustomAmount?: boolean;
  };
};

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3000";

function buildPublicAssetUrl(value?: string | null) {
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

  const normalizedApi = API.endsWith("/") ? API.slice(0, -1) : API;
  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;

  return `${normalizedApi}${normalizedPath}`;
}

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

function normalizeText(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
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

function fontClass(fontStyle?: string | null) {
  if (fontStyle === "classico") return "font-serif";
  if (fontStyle === "elegante") return "font-serif";
  return "font-sans";
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

function normalizeEvent(data: PublicEventResponse, slug: string): PublicEvent | null {
  if (!data?.event) return null;

  const safePrimaryColor = normalizeColor(data.event.primaryColor, "#7c4ce0");
  const safeSecondaryColor = normalizeColor(data.event.secondaryColor, "#f8f2ec");

  const baseTitle =
    data.event.publicTitle ?? data.event.name ?? data.event.title ?? "Evento VivaLista";
  const baseDescription =
    data.event.welcomeMessage ??
    data.event.openingMessage ??
    data.event.description ??
    "Evento VivaLista";

  return {
    id: String(data.event.id ?? slug),
    title: baseTitle,
    description: baseDescription,
    date: data.event.date,
    location: data.event.location ?? "Local a definir",
    slug: data.event.slug ?? slug,
    status: data.event.status ?? "PUBLISHED",
    coverImage: buildPublicAssetUrl(data.event.coverImage ?? null),
    heroImage: buildPublicAssetUrl(data.event.heroImageUrl ?? data.event.coverImage ?? null),
    publicSubtitle: data.event.publicSubtitle ?? data.event.location ?? null,
    welcomeMessage:
      data.event.welcomeMessage ??
      data.event.openingMessage ??
      data.event.description ??
      null,
    primaryColor: safePrimaryColor,
    secondaryColor: safeSecondaryColor,
    fontStyle: data.event.fontStyle ?? null,
    heroLayout: data.event.heroLayout ?? "centralizado",
    showCountdown: data.event.showCountdown ?? true,
    showStory: data.event.showStory ?? true,
    showGallery: data.event.showGallery ?? true,
    showLocation: data.event.showLocation ?? true,
    showGifts: data.event.showGifts ?? true,
    showRsvp: data.event.showRsvp ?? true,
    eventType: data.event.eventType ?? "OTHER",
    giftMode: data.event.giftMode ?? "PHYSICAL_ONLY",
    templateKey: data.event.templateKey ?? null,
    themeKey: data.event.themeKey ?? null,
    openingMessage: data.event.openingMessage ?? null,
    pixEnabled: Boolean(data.event.pixEnabled),
    freeContributionEnabled: Boolean(data.event.freeContributionEnabled),
    quotaEnabled: Boolean(data.event.quotaEnabled),
    contributionsFeedEnabled: Boolean(data.event.contributionsFeedEnabled),
    rsvpEnabled: Boolean(data.rsvp?.enabled),
    rsvpLookupMode: data.rsvp?.lookupMode ?? "CODE",
  };
}

function normalizeGift(item: GiftApiItem): Gift {
  return {
    id: String(item.id ?? ""),
    title: item.title ?? item.name ?? "Presente",
    description: item.description ?? "",
    price:
      typeof item.price === "number"
        ? item.price
        : typeof item.amount === "number"
          ? item.amount
          : undefined,
    imageUrl: buildPublicAssetUrl(item.imageUrl ?? null),
    purchaseUrl: item.purchaseUrl ?? null,
    isReserved: Boolean(item.isReserved),
    isPurchased: Boolean(item.isPurchased),
    reservedByName: item.reservedByName ?? null,
    purchasedByName: item.purchasedByName ?? null,
    giftType: item.giftType ?? "PHYSICAL",
    priceMode: item.priceMode ?? "FIXED",
    giftStatus:
      item.giftStatus ??
      (item.isPurchased ? "PURCHASED" : item.isReserved ? "RESERVED" : "AVAILABLE"),
    allowCustomAmount: Boolean(item.allowCustomAmount),
    minAmount: item.minAmount ?? null,
    maxAmount: item.maxAmount ?? null,
    category: item.category ?? null,
    isFeatured: Boolean(item.isFeatured),
    displayOrder: item.displayOrder ?? 0,
    quotaTotal: item.quotaTotal ?? 0,
    quotaSold: item.quotaSold ?? 0,
    quotaRemaining:
      item.quotaRemaining ??
      Math.max((item.quotaTotal ?? 0) - (item.quotaSold ?? 0), 0),
    progress: item.progress ?? 0,
    ui: item.ui ?? {
      canReserve: !item.isReserved && !item.isPurchased,
      canPurchase: !item.isPurchased,
      canContribute:
        item.giftType === "CASH" ||
        item.giftType === "QUOTA" ||
        item.giftType === "FREE_CONTRIBUTION",
      acceptsCustomAmount:
        Boolean(item.allowCustomAmount) || item.priceMode === "FLEXIBLE",
    },
  };
}

function getGiftSortValue(gift: Gift, sortBy: string) {
  if (sortBy === "price-asc") return gift.price ?? Number.MAX_SAFE_INTEGER;
  if (sortBy === "price-desc") return -(gift.price ?? 0);
  return gift.displayOrder ?? 0;
}

function getGiftBadge(gift: Gift) {
  if (gift.giftType === "QUOTA") return "COTAS";
  if (gift.giftType === "CASH") return "EM DINHEIRO";
  if (gift.giftType === "FREE_CONTRIBUTION") return "VALOR LIVRE";
  if (gift.isPurchased) return "COMPRADO";
  if (gift.isReserved) return "RESERVADO";
  return "DISPONÍVEL";
}

function getGiftBadgeClass(gift: Gift) {
  if (gift.giftType === "QUOTA") return "border border-sky-100 bg-sky-50 text-sky-700";
  if (gift.giftType === "CASH" || gift.giftType === "FREE_CONTRIBUTION") {
    return "border border-violet-100 bg-violet-50 text-violet-700";
  }
  if (gift.isPurchased) return "border border-emerald-200 bg-emerald-50 text-emerald-800";
  if (gift.isReserved) return "border border-amber-200 bg-amber-50 text-amber-800";
  return "border border-rose-100 bg-rose-50 text-rose-700";
}

function getGiftCardClassName(gift: Gift) {
  if (gift.isPurchased) {
    return "border-emerald-200 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbf6_100%)] shadow-[0_24px_70px_rgba(16,185,129,0.10)]";
  }
  if (gift.isReserved) {
    return "border-amber-200 bg-[linear-gradient(180deg,#ffffff_0%,#fff9f1_100%)] shadow-[0_24px_70px_rgba(245,158,11,0.10)]";
  }
  return "border-[#eadfd7] bg-white shadow-[0_22px_64px_rgba(15,23,42,0.06)]";
}

function getGiftImageStateClass(gift: Gift) {
  if (gift.isPurchased) return "scale-100 saturate-[0.82] brightness-[0.86]";
  if (gift.isReserved) return "scale-100 saturate-[0.88] brightness-[0.92] blur-[1.2px]";
  return "group-hover:scale-105";
}

function getGiftOverlayToneClass(gift: Gift) {
  if (gift.isPurchased) return "bg-emerald-950/42";
  if (gift.isReserved) return "bg-amber-950/28";
  return "bg-transparent";
}

function getGiftOverlayCardClass(gift: Gift) {
  if (gift.isPurchased) {
    return "border border-emerald-200/80 bg-white/92 text-emerald-900 shadow-[0_20px_50px_rgba(16,185,129,0.18)]";
  }
  return "border border-amber-200/80 bg-white/92 text-amber-900 shadow-[0_20px_50px_rgba(245,158,11,0.18)]";
}

function getGiftStateTitle(gift: Gift) {
  if (gift.isPurchased) return "Presente comprado";
  if (gift.isReserved) return "Presente reservado";
  return "Presente disponível";
}

function getGiftStateDescription(gift: Gift) {
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

function getGiftActionLabel(gift: Gift) {
  if (gift.giftType === "QUOTA") return "Contribuir";
  if (gift.giftType === "CASH") return "Presentear em dinheiro";
  if (gift.giftType === "FREE_CONTRIBUTION") return "Contribuir livre";
  if (gift.isPurchased) return "Comprado";
  if (gift.isReserved) return "Reservado";
  return "Presentear";
}

function getGiftActionDisabled(gift: Gift) {
  if (
    gift.giftType === "CASH" ||
    gift.giftType === "QUOTA" ||
    gift.giftType === "FREE_CONTRIBUTION"
  ) {
    return false;
  }
  return gift.isPurchased || gift.isReserved;
}

function getGiftImage(gift: Gift) {
  const image = gift.imageUrl?.trim();
  return image && image.length > 0 ? image : GIFT_PLACEHOLDER;
}

function getCountdownParts(date?: string, nowMs?: number) {
  if (!date || !nowMs) {
    return [
      { label: "dias", value: "--" },
      { label: "horas", value: "--" },
      { label: "min", value: "--" },
      { label: "seg", value: "--" },
    ];
  }

  const eventDate = new Date(date).getTime();
  const diff = eventDate - nowMs;

  if (Number.isNaN(eventDate) || diff <= 0) {
    return [
      { label: "dias", value: "00" },
      { label: "horas", value: "00" },
      { label: "min", value: "00" },
      { label: "seg", value: "00" },
    ];
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "dias", value: String(days).padStart(2, "0") },
    { label: "horas", value: String(hours).padStart(2, "0") },
    { label: "min", value: String(minutes).padStart(2, "0") },
    { label: "seg", value: String(seconds).padStart(2, "0") },
  ];
}

function SectionHeader({
  eyebrow,
  title,
  description,
  primaryColor,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  primaryColor: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-4xl text-center">
      <div
        className="inline-flex rounded-full border px-4 py-2 shadow-[0_10px_26px_rgba(188,145,38,0.08)]"
        style={{
          borderColor: `${primaryColor}22`,
          backgroundColor: `${primaryColor}10`,
        }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.35em]"
          style={{ color: primaryColor }}
        >
          {eyebrow}
        </p>
      </div>
      <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[38px] border border-[#eadfd7] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function HeroActionButton({
  href,
  children,
  primaryColor,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  primaryColor: string;
  secondary?: boolean;
}) {
  if (secondary) {
    return (
      <a
        href={href}
        className="rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="rounded-full px-7 py-3.5 text-sm font-semibold shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition hover:scale-[1.02]"
      style={getButtonStyle(primaryColor)}
    >
      {children}
    </a>
  );
}

function HeroInfoPanel({
  event,
  countdown,
  showCountdown,
}: {
  event: PublicEvent;
  countdown: { label: string; value: string }[];
  showCountdown: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[40px] border border-white/15 bg-white/10 p-4 shadow-[0_34px_110px_rgba(0,0,0,0.30)] backdrop-blur-xl">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] p-5">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.35em]"
            style={{ color: event.primaryColor }}
          >
            o grande dia
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-[24px] p-4" style={{ backgroundColor: event.secondaryColor }}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Data
              </p>
              <p className="mt-2 text-lg font-semibold text-zinc-900">
                {formatDateShort(event.date)}
              </p>
            </div>

            <div className="rounded-[24px] p-4" style={{ backgroundColor: event.secondaryColor }}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Local
              </p>
              <p className="mt-2 text-lg font-semibold leading-6 text-zinc-900 break-words">
                {event.location}
              </p>
            </div>
          </div>
        </div>

        {showCountdown ? (
          <div className="mt-4 rounded-[32px] bg-[linear-gradient(135deg,#111827,#27272a)] p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-200">
                  contagem regressiva
                </p>
                <p className="mt-2 text-sm text-white/65">
                  tudo pronto para esse momento especial
                </p>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 sm:block">
                RSVP: {event.rsvpLookupMode}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {countdown.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center"
                >
                  <div className="text-2xl font-semibold md:text-3xl">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/65">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function HeroImagePanel({
  image,
  title,
  subtitle,
}: {
  image?: string | null;
  title: string;
  subtitle?: string | null;
}) {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[40px] border border-white/15 bg-white/10 shadow-[0_34px_110px_rgba(0,0,0,0.30)] backdrop-blur-xl">
      <img
        src={image || GIFT_PLACEHOLDER}
        alt={title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/75">
          destaque
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight">{title}</h2>
        {subtitle ? <p className="mt-3 text-sm text-white/80">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function HeroSection({
  event,
  countdown,
  showCountdown,
  showRsvp,
  showGifts,
}: {
  event: PublicEvent;
  countdown: { label: string; value: string }[];
  showCountdown: boolean;
  showRsvp: boolean;
  showGifts: boolean;
}) {
  const heroLayout = event.heroLayout || "centralizado";

  const infoBadges = (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
        {formatDateShort(event.date)}
      </div>
      <div className="max-w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md md:max-w-[420px]">
        <span className="block break-words">{event.location}</span>
      </div>
      {showRsvp ? (
        <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
          RSVP ativo
        </div>
      ) : null}
    </div>
  );

  const actions = (
    <div className="mt-10 flex flex-wrap gap-4">
      {showRsvp ? (
        <HeroActionButton href="#confirmacao" primaryColor={event.primaryColor}>
          Confirmar presença
        </HeroActionButton>
      ) : null}
      {showGifts ? (
        <HeroActionButton
          href="#presentes"
          primaryColor={event.primaryColor}
          secondary
        >
          Ver lista de presentes
        </HeroActionButton>
      ) : null}
    </div>
  );

  const intro = (
    <>
      <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-rose-100">
          site do evento
        </p>
      </div>

      <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.9] text-white md:text-7xl xl:text-[90px]">
        {event.title}
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 md:text-xl">
        {event.publicSubtitle || event.welcomeMessage || event.description}
      </p>

      {infoBadges}
      {actions}
    </>
  );

  if (heroLayout === "minimalista") {
    return (
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-rose-100">
            site do evento
          </p>
        </div>

        <h1 className="mt-6 text-5xl font-semibold leading-[0.95] text-white md:text-7xl">
          {event.title}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/85 md:text-xl">
          {event.publicSubtitle || event.welcomeMessage || event.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
            {formatDateShort(event.date)}
          </div>
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
            {event.location}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {showRsvp ? (
            <HeroActionButton href="#confirmacao" primaryColor={event.primaryColor}>
              Confirmar presença
            </HeroActionButton>
          ) : null}
          {showGifts ? (
            <HeroActionButton
              href="#presentes"
              primaryColor={event.primaryColor}
              secondary
            >
              Ver lista de presentes
            </HeroActionButton>
          ) : null}
        </div>

        {showCountdown ? (
          <div className="mx-auto mt-12 max-w-4xl rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {countdown.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center text-white"
                >
                  <div className="text-2xl font-semibold md:text-3xl">{item.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/65">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (heroLayout === "imagem-esquerda") {
    return (
      <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="lg:pr-3">
          <HeroImagePanel
            image={event.heroImage}
            title={event.title}
            subtitle={event.publicSubtitle}
          />
        </div>

        <div className="max-w-4xl">
          {intro}
          {showCountdown ? (
            <div className="mt-10 max-w-3xl">
              <HeroInfoPanel event={event} countdown={countdown} showCountdown />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (heroLayout === "imagem-direita") {
    return (
      <div className="grid items-center gap-12 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="max-w-4xl">{intro}</div>
        <div className="lg:pl-3">
          <HeroImagePanel
            image={event.heroImage}
            title={event.title}
            subtitle={event.publicSubtitle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.18fr_0.82fr]">
      <div className="max-w-4xl">{intro}</div>
      <div className="lg:pl-3">
        <HeroInfoPanel event={event} countdown={countdown} showCountdown={showCountdown} />
      </div>
    </div>
  );
}


type WeddingPublicPageProps = {
  event: PublicEvent;
  countdown: { label: string; value: string }[];
  galleryImages: string[];
  filteredGifts: Gift[];
  giftCategories: string[];
  financialSummary: FinancialSummary;
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
  openPaymentModal: (gift: Gift) => void;
  selectedGift: Gift | null;
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
  guest: LookupResponse["guest"] | null;
  handleLookupGuest: () => Promise<void>;
  handleRsvpAction: (action: "confirm" | "decline") => Promise<void>;
  showBackToTop: boolean;
};

const WEDDING_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=92",
];

function WeddingPublicPage({
  event,
  countdown,
  galleryImages,
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
}: WeddingPublicPageProps) {
  const gold = "#b88b54";
  const champagne = "#fbf3ea";
  const paper = "#fffaf3";
  const dark = "#0d0a08";
  const heroImage =
    event.heroImage ||
    event.coverImage ||
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2400&q=92";

  const weddingGallery =
    galleryImages.filter((image) => image && image !== GIFT_PLACEHOLDER).length > 0
      ? galleryImages
      : WEDDING_FALLBACK_IMAGES;

  return (
    <main className="min-h-screen bg-[#f6eadf] text-[#2f2721]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scroll-behavior: smooth; }
            .wedding-display {
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-weight: 400;
              letter-spacing: -.055em;
            }
            .wedding-serif {
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
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
            @media (max-width: 768px) {
              .wedding-display { letter-spacing: -.035em; }
            }
          `,
        }}
      />

      <header className="sticky top-0 z-50 border-b border-[#e4d2bf]/70 bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="wedding-serif text-2xl text-[#9d7442]">
            A / L
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#inicio" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[#9d7442]">
              Início
            </a>
            {showStory ? (
              <a href="#historia" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[#9d7442]">
                Nossa história
              </a>
            ) : null}
            <a href="#cerimonia" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[#9d7442]">
              Cerimônia
            </a>
            {showGallery ? (
              <a href="#galeria" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[#9d7442]">
                Galeria
              </a>
            ) : null}
            {showGifts ? (
              <a href="#presentes" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[#9d7442]">
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a href="#confirmacao" className="text-xs font-bold uppercase tracking-[0.16em] text-[#746053] transition hover:text-[#9d7442]">
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

      <section id="inicio" className="relative min-h-[760px] overflow-hidden bg-[#0d0a08] text-white">
        <div
          className="absolute inset-0 wedding-photo opacity-95"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,10,8,.95)_0%,rgba(13,10,8,.62)_47%,rgba(13,10,8,.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f6eadf] to-transparent" />
        <div className="absolute left-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_22%_20%,rgba(184,139,84,.18),transparent_34%)]" />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="wedding-eyebrow text-[#d2ad78]">Com muito amor</p>
            <h1 className="wedding-display mt-7 text-6xl leading-[0.86] text-[#fff2df] sm:text-8xl lg:text-[118px]">
              {event.title}
            </h1>
            <p className="wedding-serif mt-7 max-w-2xl text-3xl italic leading-tight text-[#eed7bb] sm:text-4xl">
              {event.publicSubtitle || event.welcomeMessage || "O início do nosso para sempre."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                {formatDateShort(event.date)}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                {event.location}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {showRsvp ? (
                <a
                  href="#confirmacao"
                  className="rounded-full bg-[#d1a05f] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#17100b] shadow-[0_18px_50px_rgba(0,0,0,.28)] transition hover:-translate-y-0.5"
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
        </div>
      </section>

      {showCountdown ? (
        <section className="bg-[#0d0a08] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="wedding-eyebrow text-[#d1a05f]">Contagem regressiva</p>
            <h2 className="wedding-serif mt-4 text-4xl text-[#fff2df] sm:text-5xl">
              Está chegando o grande dia.
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {countdown.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/10 bg-white/[.075] px-4 py-7 shadow-[0_20px_60px_rgba(0,0,0,.26)] backdrop-blur"
                >
                  <strong className="wedding-serif block text-5xl font-normal text-[#d1a05f]">
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

      <section className="bg-[#fffaf3] px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[38px] border border-[#ead8c5] bg-white/75 px-7 py-12 wedding-card-shadow sm:px-12">
          <p className="wedding-eyebrow text-[#b88b54]">Mensagem aos convidados</p>
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
                style={{ backgroundImage: `url("${weddingGallery[1] || weddingGallery[0]}")` }}
              />
              <div
                className="absolute bottom-0 right-0 h-[310px] w-[48%] border-[10px] border-white bg-[#ead8c5] wedding-card-shadow wedding-photo"
                style={{ backgroundImage: `url("${weddingGallery[0]}")` }}
              />
            </div>

            <div>
              <p className="wedding-eyebrow text-[#b88b54]">Nossa história</p>
              <h2 className="wedding-display mt-5 text-6xl leading-[0.9] text-[#2f2721] sm:text-7xl">
                Dois caminhos. Um mesmo destino.
              </h2>
              <p className="mt-7 text-lg leading-9 text-[#746053]">
                Entre sonhos, escolhas e momentos especiais, este dia marca o começo
                de uma nova fase. Esta página reúne as informações mais importantes
                para que todos participem com carinho e tranquilidade.
              </p>
              <p className="wedding-serif mt-8 border-l-2 border-[#b88b54] pl-6 text-3xl leading-tight text-[#9d7442]">
                Cada detalhe foi pensado para celebrar o amor.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section id="cerimonia" className="relative overflow-hidden bg-[#0d0a08] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-25 wedding-photo"
          style={{ backgroundImage: `url("${weddingGallery[2] || heroImage}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,10,8,.96),rgba(13,10,8,.72),rgba(13,10,8,.46))]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="wedding-eyebrow text-[#d1a05f]">Cerimônia & Recepção</p>
          <h2 className="wedding-serif mt-4 text-4xl text-[#fff2df] sm:text-5xl">
            Informações do grande dia
          </h2>

          <div className="mt-12 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <div className="text-5xl text-[#d1a05f]">♙</div>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.26em] text-[#d1a05f]">
                Cerimônia
              </h3>
              <strong className="wedding-serif mt-3 block text-4xl font-normal text-white">
                {formatDateShort(event.date)}
              </strong>
              <p className="mt-3 text-white/65">{event.location}</p>
            </div>

            <div className="hidden h-36 w-px bg-white/15 md:block" />

            <div>
              <div className="text-5xl text-[#d1a05f]">♢</div>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.26em] text-[#d1a05f]">
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
        <section id="galeria" className="bg-[#fffaf3] py-16 text-center">
          <p className="wedding-eyebrow text-[#b88b54]">Galeria</p>
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
          <div className="rounded-[34px] border border-[#e1c7b1] bg-[#fffaf3]/80 p-8 wedding-card-shadow">
            <p className="wedding-eyebrow text-[#b88b54]">Informações</p>
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
              <p className="wedding-eyebrow text-[#b88b54]">Data</p>
              <p className="mt-4 text-2xl font-semibold text-[#2f2721]">{formatDate(event.date)}</p>
            </div>
            <div className="rounded-[28px] border border-[#e1c7b1] bg-white/70 p-6 wedding-card-shadow">
              <p className="wedding-eyebrow text-[#b88b54]">Local</p>
              <p className="mt-4 break-words text-2xl font-semibold text-[#2f2721]">{event.location}</p>
            </div>
            <div className="rounded-[28px] border border-[#e1c7b1] bg-white/70 p-6 wedding-card-shadow">
              <p className="wedding-eyebrow text-[#b88b54]">Presentes</p>
              <p className="mt-4 text-2xl font-semibold text-[#2f2721]">{filteredGifts.length} disponíveis</p>
            </div>
            <div className="rounded-[28px] border border-[#e1c7b1] bg-white/70 p-6 wedding-card-shadow">
              <p className="wedding-eyebrow text-[#b88b54]">Arrecadado</p>
              <p className="mt-4 text-2xl font-semibold text-[#2f2721]">{formatMoney(financialSummary.totalRaised)}</p>
            </div>
          </div>
        </div>
      </section>

      {showLocation ? (
        <section id="localizacao" className="bg-[#fffaf3] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.86fr_1.14fr]">
            <div className="rounded-[34px] bg-[#0d0a08] p-8 text-white wedding-card-shadow">
              <p className="wedding-eyebrow text-[#d1a05f]">Localização</p>
              <h2 className="wedding-serif mt-5 text-5xl leading-tight text-[#fff2df]">
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
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0d0a08] transition hover:bg-[#f7eadf]"
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

            <div className="grid min-h-[360px] place-items-center rounded-[34px] border border-[#e1c7b1] bg-[#f7eadf] p-8 text-center wedding-card-shadow">
              <div>
                <p className="wedding-eyebrow text-[#b88b54]">Mapa</p>
                <h3 className="wedding-serif mt-3 text-4xl text-[#2f2721]">
                  {event.location}
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[#746053]">
                  No site final, esta área pode receber mapa incorporado e botões de rota.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showGifts ? (
        <section id="presentes" className="bg-[#f3dfd3] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="wedding-eyebrow text-[#b88b54]">Presentes</p>
              <h2 className="wedding-serif mt-4 text-5xl leading-tight text-[#2f2721] sm:text-6xl">
                Lista de presentes
              </h2>
              <p className="mt-5 text-base leading-8 text-[#746053]">
                Sua presença é o nosso maior presente. Se desejar nos presentear,
                escolha uma das opções abaixo.
              </p>
            </div>

            <div className="mb-8 rounded-[30px] border border-[#e1c7b1] bg-[#fffaf3]/85 p-5 wedding-card-shadow">
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  value={giftSearch}
                  onChange={(event) => setGiftSearch(event.target.value)}
                  placeholder="Buscar presente"
                  className="rounded-2xl border border-[#dec7b2] bg-white px-4 py-3 text-sm outline-none focus:border-[#b88b54]"
                />
                <select
                  value={giftCategory}
                  onChange={(event) => setGiftCategory(event.target.value)}
                  className="rounded-2xl border border-[#dec7b2] bg-white px-4 py-3 text-sm outline-none focus:border-[#b88b54]"
                >
                  <option value="all">Todas as categorias</option>
                  {giftCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={giftSort}
                  onChange={(event) => setGiftSort(event.target.value)}
                  className="rounded-2xl border border-[#dec7b2] bg-white px-4 py-3 text-sm outline-none focus:border-[#b88b54]"
                >
                  <option value="featured">Destaques</option>
                  <option value="az">A-Z</option>
                  <option value="price-asc">Menor valor</option>
                  <option value="price-desc">Maior valor</option>
                </select>
              </div>
            </div>

            {filteredGifts.length === 0 ? (
              <div className="rounded-[34px] border border-[#e1c7b1] bg-[#fffaf3]/85 p-10 text-center wedding-card-shadow">
                <h3 className="wedding-serif text-4xl text-[#2f2721]">
                  Lista em preparação
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-[#746053]">
                  Os presentes ainda não foram cadastrados para este evento.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {filteredGifts.map((gift) => {
                  const disabled = getGiftActionDisabled(gift);

                  return (
                    <article
                      key={gift.id}
                      className="overflow-hidden rounded-[32px] border border-[#e1c7b1] bg-[#fffaf3] wedding-card-shadow transition hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={getGiftImage(gift)}
                          alt={gift.title}
                          className={`h-full w-full object-cover transition duration-500 ${getGiftImageStateClass(gift)}`}
                        />
                        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${getGiftBadgeClass(gift)}`}>
                          {getGiftBadge(gift)}
                        </span>
                      </div>

                      <div className="p-6">
                        {gift.category ? (
                          <p className="wedding-eyebrow text-[#b88b54]">{gift.category}</p>
                        ) : null}
                        <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#2f2721]">
                          {gift.title}
                        </h3>
                        <p className="mt-3 min-h-[70px] text-sm leading-7 text-[#746053]">
                          {gift.description || "Presente disponível na lista do evento."}
                        </p>
                        <p className="wedding-serif mt-4 text-3xl text-[#9d7442]">
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
                              : "bg-[#0d0a08] text-[#d1a05f] hover:-translate-y-0.5"
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

      <section className="bg-[#0d0a08] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="wedding-eyebrow text-[#d1a05f]">Próximo passo</p>
            <h2 className="wedding-serif mt-4 max-w-3xl text-5xl leading-tight text-[#fff2df]">
              Confirme sua presença e participe deste momento especial.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {showRsvp ? (
              <a href="#confirmacao" className="rounded-full bg-[#d1a05f] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#17100b]">
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
        <section id="confirmacao" className="bg-[#fffaf3] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.92fr_1.08fr]">
            <div className="rounded-[34px] bg-[#0d0a08] p-8 text-white wedding-card-shadow">
              <p className="wedding-eyebrow text-[#d1a05f]">RSVP</p>
              <h2 className="wedding-serif mt-5 text-5xl leading-tight text-[#fff2df]">
                Sua presença é muito importante.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/70">
                Digite o código do convite para localizar seu cadastro e confirmar
                sua presença.
              </p>
            </div>

            <div className="rounded-[34px] border border-[#e1c7b1] bg-white/80 p-7 wedding-card-shadow">
              <p className="wedding-eyebrow text-[#b88b54]">Localizar convite</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={rsvpCode}
                  onChange={(event) => setRsvpCode(event.target.value)}
                  placeholder="Digite seu código RSVP"
                  className="rounded-2xl border border-[#dec7b2] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#b88b54]"
                />
                <button
                  type="button"
                  onClick={handleLookupGuest}
                  disabled={rsvpLoading}
                  className="rounded-2xl bg-[#0d0a08] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-[#d1a05f] disabled:opacity-60"
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
                <div className="mt-6 rounded-[28px] border border-[#ead8c5] bg-[#fffaf3] p-5">
                  <p className="wedding-eyebrow text-[#b88b54]">Convidado localizado</p>
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

      <footer className="bg-[#0d0a08] px-4 py-10 text-center text-white/60">
        <p className="wedding-serif text-3xl text-[#d1a05f]">A / L</p>
        <p className="mt-2 text-sm">
          {formatDateShort(event.date)} • {event.location}
        </p>
      </footer>

      {selectedGift ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[rgba(17,24,39,0.78)] px-3 py-3 backdrop-blur-[5px] sm:px-6 sm:py-8 lg:items-center">
          <div className="max-h-[96vh] w-full max-w-4xl overflow-y-auto rounded-[34px] border border-white/40 bg-[#fffaf3] shadow-[0_38px_120px_rgba(15,23,42,0.22)]">
            <div className="sticky top-0 z-10 border-b border-[#ead8c5] bg-[#fffaf3]/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="wedding-eyebrow text-[#b88b54]">Pagamento</p>
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
                  <p className="wedding-serif mt-4 text-3xl text-[#9d7442]">
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
                    className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[#b88b54]"
                  />
                  <input
                    value={buyerEmail}
                    onChange={(event) => setBuyerEmail(event.target.value)}
                    placeholder="Seu e-mail"
                    className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[#b88b54]"
                  />
                  <input
                    value={buyerPhone}
                    onChange={(event) => setBuyerPhone(event.target.value)}
                    placeholder="Seu telefone"
                    className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[#b88b54]"
                  />
                  <textarea
                    value={buyerMessage}
                    onChange={(event) => setBuyerMessage(event.target.value)}
                    placeholder="Mensagem opcional"
                    className="min-h-[110px] rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[#b88b54]"
                  />

                  {(selectedGift.ui?.acceptsCustomAmount ||
                    selectedGift.giftType === "FREE_CONTRIBUTION") ? (
                    <input
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="Valor"
                      className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[#b88b54]"
                    />
                  ) : null}

                  {selectedGift.giftType === "QUOTA" ? (
                    <input
                      type="number"
                      min={1}
                      max={selectedGift.quotaRemaining ?? undefined}
                      value={quotaQuantity}
                      onChange={(event) => setQuotaQuantity(event.target.value)}
                      className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[#b88b54]"
                    />
                  ) : null}

                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="rounded-2xl border border-[#dec7b2] px-4 py-3.5 text-sm outline-none focus:border-[#b88b54]"
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
                    className="rounded-full bg-[#0d0a08] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#d1a05f] disabled:opacity-60"
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
          className="fixed bottom-24 right-4 z-40 rounded-full bg-[#0d0a08] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#d1a05f] shadow-xl transition hover:-translate-y-0.5 md:bottom-6"
        >
          Topo
        </button>
      ) : null}

      {(showGifts || showRsvp) ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e1c7b1] bg-[#fffaf3]/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl gap-3">
            {showGifts ? (
              <a
                href="#presentes"
                className="flex-1 rounded-full bg-[#0d0a08] px-4 py-3 text-center text-sm font-bold text-[#d1a05f]"
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




const KITCHEN_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1800&q=92",
];

function KitchenShowerPublicPage({
  event,
  countdown,
  galleryImages,
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
}: WeddingPublicPageProps) {
  const heroImage =
    event.heroImage ||
    event.coverImage ||
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=2400&q=92";

  const kitchenGallery =
    galleryImages.filter((image) => image && image !== GIFT_PLACEHOLDER).length > 0
      ? galleryImages
      : KITCHEN_FALLBACK_IMAGES;

  return (
    <main className="min-h-screen bg-[#f3ede3] text-[#2e3e35]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scroll-behavior: smooth; }
            .kitchen-display {
              font-family: "Cormorant Garamond", "Georgia", serif;
              font-weight: 500;
              letter-spacing: -.035em;
            }
            .kitchen-serif {
              font-family: "Cormorant Garamond", "Georgia", serif;
              font-weight: 500;
            }
            .kitchen-eyebrow {
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .28em;
              text-transform: uppercase;
            }
            .kitchen-shadow {
              box-shadow: 0 24px 70px rgba(73, 55, 39, .10);
            }
            .kitchen-photo {
              background-size: cover;
              background-position: center;
            }
            .kitchen-paper {
              background-image:
                radial-gradient(circle at 1px 1px, rgba(100,124,98,.10) 1px, transparent 0),
                linear-gradient(180deg, rgba(255,250,241,.96), rgba(255,246,232,.92));
              background-size: 18px 18px, 100% 100%;
            }
          `,
        }}
      />

      <header className="sticky top-0 z-50 border-b border-[#d9cbb9]/80 bg-[#fffaf1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="kitchen-serif text-2xl text-[#647c62]">
            VivaLista
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#inicio" className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d6259] transition hover:text-[#647c62]">
              Início
            </a>
            {showStory ? (
              <a href="#historia" className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d6259] transition hover:text-[#647c62]">
                História
              </a>
            ) : null}
            <a href="#detalhes" className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d6259] transition hover:text-[#647c62]">
              Detalhes
            </a>
            {showGallery ? (
              <a href="#galeria" className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d6259] transition hover:text-[#647c62]">
                Galeria
              </a>
            ) : null}
            {showGifts ? (
              <a href="#presentes" className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d6259] transition hover:text-[#647c62]">
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a href="#confirmacao" className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d6259] transition hover:text-[#647c62]">
                RSVP
              </a>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden rounded-full border border-[#d8c9b8] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6d6259] transition hover:bg-white md:inline-flex"
            >
              {copied ? "Copiado" : "Copiar link"}
            </button>

            {showRsvp ? (
              <a
                href="#confirmacao"
                className="rounded-full bg-[#647c62] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Confirmar
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden bg-[#203129] text-white">
        <div
          className="absolute inset-0 kitchen-photo opacity-80"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,49,41,.96)_0%,rgba(32,49,41,.70)_52%,rgba(32,49,41,.20)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f3ede3] to-transparent" />
        <div className="absolute left-8 top-12 h-80 w-80 rounded-full bg-[#b46545]/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid min-h-[740px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <p className="kitchen-eyebrow text-[#d9b48f]">Chá de cozinha</p>
            <h1 className="kitchen-display mt-7 max-w-3xl text-6xl leading-[0.9] text-[#fff5e8] sm:text-8xl lg:text-[108px]">
              {event.title}
            </h1>
            <p className="kitchen-serif mt-7 max-w-2xl text-3xl leading-tight text-[#f3dbc6] sm:text-4xl">
              {event.publicSubtitle ||
                event.welcomeMessage ||
                "Um encontro aconchegante para celebrar a nova fase."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                {formatDateShort(event.date)}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                {event.location}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {showRsvp ? (
                <a
                  href="#confirmacao"
                  className="rounded-full bg-[#d7a070] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#203129] shadow-[0_18px_50px_rgba(0,0,0,.25)] transition hover:-translate-y-0.5"
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

          <div className="relative hidden lg:block">
            <div className="rounded-[42px] border border-white/15 bg-white/10 p-4 backdrop-blur-md kitchen-shadow">
              <div
                className="min-h-[520px] rounded-[32px] kitchen-photo"
                style={{ backgroundImage: `url("${kitchenGallery[0] || heroImage}")` }}
              />
            </div>
            <div className="absolute -bottom-8 -left-8 rounded-[28px] border border-[#d8c0a5] bg-[#fffaf1] p-6 text-[#2e3e35] kitchen-shadow">
              <p className="kitchen-eyebrow text-[#b46545]">lista</p>
              <p className="kitchen-serif mt-2 text-4xl">{filteredGifts.length}</p>
              <p className="text-sm text-[#6d6259]">presentes cadastrados</p>
            </div>
          </div>
        </div>
      </section>

      {showCountdown ? (
        <section className="bg-[#203129] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="kitchen-eyebrow text-[#d7a070]">Contagem regressiva</p>
            <h2 className="kitchen-serif mt-4 text-4xl text-[#fff5e8] sm:text-5xl">
              Falta pouco para esse encontro especial.
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {countdown.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/10 bg-white/[.075] px-4 py-7 shadow-[0_20px_60px_rgba(0,0,0,.24)] backdrop-blur"
                >
                  <strong className="kitchen-serif block text-5xl font-normal text-[#d7a070]">
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

      <section className="kitchen-paper px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[38px] border border-[#d9cbb9] bg-white/70 px-7 py-12 kitchen-shadow sm:px-12">
          <p className="kitchen-eyebrow text-[#b46545]">Mensagem aos convidados</p>
          <h2 className="kitchen-serif mt-5 text-4xl leading-tight text-[#2e3e35] sm:text-6xl">
            Uma nova casa começa com afeto.
          </h2>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#6d6259] sm:text-lg">
            {event.welcomeMessage ||
              event.openingMessage ||
              event.description ||
              "Preparamos este cantinho para reunir os detalhes do nosso chá de cozinha, confirmar presença e organizar os presentes com carinho."}
          </p>
        </div>
      </section>

      {showStory ? (
        <section id="historia" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.95fr_1.05fr]">
            <div className="rounded-[36px] border border-[#d9cbb9] bg-[#fffaf1] p-7 kitchen-shadow">
              <div
                className="min-h-[520px] rounded-[28px] kitchen-photo"
                style={{ backgroundImage: `url("${kitchenGallery[1] || kitchenGallery[0]}")` }}
              />
            </div>

            <div>
              <p className="kitchen-eyebrow text-[#b46545]">Nossa nova fase</p>
              <h2 className="kitchen-display mt-5 text-6xl leading-[0.94] text-[#2e3e35] sm:text-7xl">
                Entre receitas, casa e boas memórias.
              </h2>
              <p className="mt-7 text-lg leading-9 text-[#6d6259]">
                Este encontro foi pensado para reunir pessoas queridas em um clima
                leve, bonito e acolhedor. Aqui os convidados encontram detalhes,
                confirmação de presença, localização e a lista de presentes.
              </p>
              <p className="kitchen-serif mt-8 border-l-2 border-[#b46545] pl-6 text-3xl leading-tight text-[#647c62]">
                Cada presente ajuda a montar um lar cheio de significado.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section id="detalhes" className="bg-[#e8ddce] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.86fr_1.14fr]">
          <div className="rounded-[36px] bg-[#203129] p-8 text-white kitchen-shadow">
            <p className="kitchen-eyebrow text-[#d7a070]">Detalhes</p>
            <h2 className="kitchen-serif mt-5 text-5xl leading-tight text-[#fff5e8]">
              Tudo para o dia ficar gostoso e organizado.
            </h2>
            <p className="mt-6 text-base leading-8 text-white/70">
              Data, local, presentes e confirmação reunidos em uma página clara,
              elegante e fácil de compartilhar.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[28px] border border-[#d9cbb9] bg-[#fffaf1]/85 p-6 kitchen-shadow">
              <p className="kitchen-eyebrow text-[#b46545]">Data</p>
              <p className="mt-4 text-2xl font-semibold text-[#2e3e35]">
                {formatDate(event.date)}
              </p>
            </div>
            <div className="rounded-[28px] border border-[#d9cbb9] bg-[#fffaf1]/85 p-6 kitchen-shadow">
              <p className="kitchen-eyebrow text-[#b46545]">Local</p>
              <p className="mt-4 break-words text-2xl font-semibold text-[#2e3e35]">
                {event.location}
              </p>
            </div>
            <div className="rounded-[28px] border border-[#d9cbb9] bg-[#fffaf1]/85 p-6 kitchen-shadow">
              <p className="kitchen-eyebrow text-[#b46545]">Presentes</p>
              <p className="mt-4 text-2xl font-semibold text-[#2e3e35]">
                {filteredGifts.length} disponíveis
              </p>
            </div>
            <div className="rounded-[28px] border border-[#d9cbb9] bg-[#fffaf1]/85 p-6 kitchen-shadow">
              <p className="kitchen-eyebrow text-[#b46545]">Arrecadado</p>
              <p className="mt-4 text-2xl font-semibold text-[#2e3e35]">
                {formatMoney(financialSummary.totalRaised)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {showGallery ? (
        <section id="galeria" className="bg-[#fffaf1] py-16 text-center">
          <p className="kitchen-eyebrow text-[#b46545]">Galeria</p>
          <h2 className="kitchen-serif mt-3 text-4xl text-[#2e3e35] sm:text-5xl">
            Clima de casa, mesa posta e carinho
          </h2>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-5">
            {kitchenGallery.slice(0, 5).map((image, index) => (
              <div key={`${image}-${index}`} className="h-64 overflow-hidden bg-[#e8ddce] md:h-80">
                <div
                  className="h-full w-full kitchen-photo transition duration-700 hover:scale-105"
                  style={{ backgroundImage: `url("${image}")` }}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showLocation ? (
        <section id="localizacao" className="bg-[#f3ede3] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.86fr_1.14fr]">
            <div className="rounded-[34px] bg-[#203129] p-8 text-white kitchen-shadow">
              <p className="kitchen-eyebrow text-[#d7a070]">Localização</p>
              <h2 className="kitchen-serif mt-5 text-5xl leading-tight text-[#fff5e8]">
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
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#203129] transition hover:bg-[#f7eadf]"
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

            <div className="grid min-h-[360px] place-items-center rounded-[34px] border border-[#d9cbb9] bg-[#fffaf1] p-8 text-center kitchen-shadow">
              <div>
                <p className="kitchen-eyebrow text-[#b46545]">Mapa</p>
                <h3 className="kitchen-serif mt-3 text-4xl text-[#2e3e35]">
                  {event.location}
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[#6d6259]">
                  Use os botões de rota para chegar com tranquilidade ao encontro.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showGifts ? (
        <section id="presentes" className="bg-[#e8ddce] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="kitchen-eyebrow text-[#b46545]">Presentes</p>
              <h2 className="kitchen-serif mt-4 text-5xl leading-tight text-[#2e3e35] sm:text-6xl">
                Lista para o novo lar
              </h2>
              <p className="mt-5 text-base leading-8 text-[#6d6259]">
                Escolha um presente para ajudar a montar essa nova fase com carinho.
              </p>
            </div>

            <div className="mb-8 rounded-[30px] border border-[#d9cbb9] bg-[#fffaf1]/85 p-5 kitchen-shadow">
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  value={giftSearch}
                  onChange={(event) => setGiftSearch(event.target.value)}
                  placeholder="Buscar presente"
                  className="rounded-2xl border border-[#d8c9b8] bg-white px-4 py-3 text-sm outline-none focus:border-[#647c62]"
                />
                <select
                  value={giftCategory}
                  onChange={(event) => setGiftCategory(event.target.value)}
                  className="rounded-2xl border border-[#d8c9b8] bg-white px-4 py-3 text-sm outline-none focus:border-[#647c62]"
                >
                  <option value="all">Todas as categorias</option>
                  {giftCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={giftSort}
                  onChange={(event) => setGiftSort(event.target.value)}
                  className="rounded-2xl border border-[#d8c9b8] bg-white px-4 py-3 text-sm outline-none focus:border-[#647c62]"
                >
                  <option value="featured">Destaques</option>
                  <option value="az">A-Z</option>
                  <option value="price-asc">Menor valor</option>
                  <option value="price-desc">Maior valor</option>
                </select>
              </div>
            </div>

            {filteredGifts.length === 0 ? (
              <div className="rounded-[34px] border border-[#d9cbb9] bg-[#fffaf1]/85 p-10 text-center kitchen-shadow">
                <h3 className="kitchen-serif text-4xl text-[#2e3e35]">
                  Lista em preparação
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-[#6d6259]">
                  Os presentes ainda não foram cadastrados para este evento.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {filteredGifts.map((gift) => {
                  const disabled = getGiftActionDisabled(gift);

                  return (
                    <article
                      key={gift.id}
                      className="overflow-hidden rounded-[32px] border border-[#d9cbb9] bg-[#fffaf1] kitchen-shadow transition hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={getGiftImage(gift)}
                          alt={gift.title}
                          className={`h-full w-full object-cover transition duration-500 ${getGiftImageStateClass(gift)}`}
                        />
                        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${getGiftBadgeClass(gift)}`}>
                          {getGiftBadge(gift)}
                        </span>
                      </div>

                      <div className="p-6">
                        {gift.category ? (
                          <p className="kitchen-eyebrow text-[#b46545]">{gift.category}</p>
                        ) : null}
                        <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#2e3e35]">
                          {gift.title}
                        </h3>
                        <p className="mt-3 min-h-[70px] text-sm leading-7 text-[#6d6259]">
                          {gift.description || "Presente disponível na lista do evento."}
                        </p>
                        <p className="kitchen-serif mt-4 text-3xl text-[#647c62]">
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
                              ? "cursor-not-allowed bg-[#dfd2c3] text-[#6d6259]"
                              : "bg-[#647c62] text-white hover:-translate-y-0.5"
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

      <section className="bg-[#203129] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="kitchen-eyebrow text-[#d7a070]">Próximo passo</p>
            <h2 className="kitchen-serif mt-4 max-w-3xl text-5xl leading-tight text-[#fff5e8]">
              Confirme sua presença e escolha um presente para o novo lar.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {showRsvp ? (
              <a href="#confirmacao" className="rounded-full bg-[#d7a070] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#203129]">
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
        <section id="confirmacao" className="bg-[#fffaf1] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.92fr_1.08fr]">
            <div className="rounded-[34px] bg-[#203129] p-8 text-white kitchen-shadow">
              <p className="kitchen-eyebrow text-[#d7a070]">RSVP</p>
              <h2 className="kitchen-serif mt-5 text-5xl leading-tight text-[#fff5e8]">
                Sua presença deixa a mesa mais completa.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/70">
                Digite o código do convite para localizar seu cadastro e confirmar.
              </p>
            </div>

            <div className="rounded-[34px] border border-[#d9cbb9] bg-white/80 p-7 kitchen-shadow">
              <p className="kitchen-eyebrow text-[#b46545]">Localizar convite</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={rsvpCode}
                  onChange={(event) => setRsvpCode(event.target.value)}
                  placeholder="Digite seu código RSVP"
                  className="rounded-2xl border border-[#d8c9b8] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#647c62]"
                />
                <button
                  type="button"
                  onClick={handleLookupGuest}
                  disabled={rsvpLoading}
                  className="rounded-2xl bg-[#647c62] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
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
                <div className="mt-6 rounded-[28px] border border-[#d9cbb9] bg-[#fffaf1] p-5">
                  <p className="kitchen-eyebrow text-[#b46545]">Convidado localizado</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#2e3e35]">
                    {guest.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#6d6259]">
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
                      className="rounded-2xl border border-[#d8c9b8] bg-white px-5 py-4 text-sm font-bold text-[#2e3e35] disabled:opacity-60"
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

      <footer className="bg-[#203129] px-4 py-10 text-center text-white/60">
        <p className="kitchen-serif text-3xl text-[#d7a070]">Chá de cozinha</p>
        <p className="mt-2 text-sm">
          {formatDateShort(event.date)} • {event.location}
        </p>
      </footer>

      {selectedGift ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[rgba(17,24,39,0.78)] px-3 py-3 backdrop-blur-[5px] sm:px-6 sm:py-8 lg:items-center">
          <div className="max-h-[96vh] w-full max-w-4xl overflow-y-auto rounded-[34px] border border-white/40 bg-[#fffaf1] shadow-[0_38px_120px_rgba(15,23,42,0.22)]">
            <div className="sticky top-0 z-10 border-b border-[#d9cbb9] bg-[#fffaf1]/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="kitchen-eyebrow text-[#b46545]">Pagamento</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#2e3e35]">
                    {selectedGift.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="rounded-full border border-[#d8c9b8] bg-white px-4 py-2 text-sm font-bold text-[#6d6259]"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[.9fr_1.1fr]">
              <div className="overflow-hidden rounded-[28px] border border-[#d9cbb9] bg-white">
                <img
                  src={getGiftImage(selectedGift)}
                  alt={selectedGift.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-xl font-semibold text-[#2e3e35]">
                    {selectedGift.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#6d6259]">
                    {selectedGift.description || "Pagamento do presente selecionado."}
                  </p>
                  <p className="kitchen-serif mt-4 text-3xl text-[#647c62]">
                    {paymentPreviewAmount ? formatMoney(paymentPreviewAmount) : "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#d9cbb9] bg-white p-5">
                <div className="grid gap-4">
                  <input
                    value={buyerName}
                    onChange={(event) => setBuyerName(event.target.value)}
                    placeholder="Seu nome"
                    className="rounded-2xl border border-[#d8c9b8] px-4 py-3.5 text-sm outline-none focus:border-[#647c62]"
                  />
                  <input
                    value={buyerEmail}
                    onChange={(event) => setBuyerEmail(event.target.value)}
                    placeholder="Seu e-mail"
                    className="rounded-2xl border border-[#d8c9b8] px-4 py-3.5 text-sm outline-none focus:border-[#647c62]"
                  />
                  <input
                    value={buyerPhone}
                    onChange={(event) => setBuyerPhone(event.target.value)}
                    placeholder="Seu telefone"
                    className="rounded-2xl border border-[#d8c9b8] px-4 py-3.5 text-sm outline-none focus:border-[#647c62]"
                  />
                  <textarea
                    value={buyerMessage}
                    onChange={(event) => setBuyerMessage(event.target.value)}
                    placeholder="Mensagem opcional"
                    className="min-h-[110px] rounded-2xl border border-[#d8c9b8] px-4 py-3.5 text-sm outline-none focus:border-[#647c62]"
                  />

                  {(selectedGift.ui?.acceptsCustomAmount ||
                    selectedGift.giftType === "FREE_CONTRIBUTION") ? (
                    <input
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="Valor"
                      className="rounded-2xl border border-[#d8c9b8] px-4 py-3.5 text-sm outline-none focus:border-[#647c62]"
                    />
                  ) : null}

                  {selectedGift.giftType === "QUOTA" ? (
                    <input
                      type="number"
                      min={1}
                      max={selectedGift.quotaRemaining ?? undefined}
                      value={quotaQuantity}
                      onChange={(event) => setQuotaQuantity(event.target.value)}
                      className="rounded-2xl border border-[#d8c9b8] px-4 py-3.5 text-sm outline-none focus:border-[#647c62]"
                    />
                  ) : null}

                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="rounded-2xl border border-[#d8c9b8] px-4 py-3.5 text-sm outline-none focus:border-[#647c62]"
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
                    className="rounded-full bg-[#647c62] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60"
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
          className="fixed bottom-24 right-4 z-40 rounded-full bg-[#647c62] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl transition hover:-translate-y-0.5 md:bottom-6"
        >
          Topo
        </button>
      ) : null}

      {(showGifts || showRsvp) ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d9cbb9] bg-[#fffaf1]/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl gap-3">
            {showGifts ? (
              <a
                href="#presentes"
                className="flex-1 rounded-full bg-[#647c62] px-4 py-3 text-center text-sm font-bold text-white"
              >
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a
                href="#confirmacao"
                className="flex-1 rounded-full border border-[#d8c9b8] bg-white px-4 py-3 text-center text-sm font-bold text-[#2e3e35]"
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


export default function EventPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalRaised: 0,
    paidContributionsCount: 0,
    pendingContributionsCount: 0,
    averageContribution: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerMessage, setBuyerMessage] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [quotaQuantity, setQuotaQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [rsvpCode, setRsvpCode] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState("");
  const [guest, setGuest] = useState<LookupResponse["guest"] | null>(null);

  const [giftSearch, setGiftSearch] = useState("");
  const [giftCategory, setGiftCategory] = useState("all");
  const [giftSort, setGiftSort] = useState("featured");

  async function loadPage() {
    if (!slug) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const [eventRes, giftsRes, contributionsRes, financialRes] = await Promise.all([
        fetch(`${API}/events/public/${slug}`, { cache: "no-store" }),
        fetch(`${API}/events/public/${slug}/gifts`, { cache: "no-store" }),
        fetch(`${API}/events/public/${slug}/contributions`, { cache: "no-store" }),
        fetch(`${API}/events/public/${slug}/financial-summary`, { cache: "no-store" }),
      ]);

      if (!eventRes.ok) {
        throw new Error("Não foi possível carregar o evento.");
      }

      const eventJson: PublicEventResponse = await eventRes.json();
      const normalizedEvent = normalizeEvent(eventJson, slug);

      if (!normalizedEvent) {
        throw new Error("Evento não encontrado.");
      }

      const giftsJson = giftsRes.ok ? await giftsRes.json() : [];
      const rawGifts = Array.isArray(giftsJson)
        ? giftsJson
        : Array.isArray((giftsJson as { gifts?: unknown[] })?.gifts)
          ? (giftsJson as { gifts: unknown[] }).gifts
          : Array.isArray((giftsJson as { data?: unknown[] })?.data)
            ? (giftsJson as { data: unknown[] }).data
            : Array.isArray((giftsJson as { data?: { gifts?: unknown[] } })?.data?.gifts)
              ? (giftsJson as { data: { gifts: unknown[] } }).data.gifts
              : [];

      const contributionsJson = contributionsRes.ok
        ? await contributionsRes.json()
        : { contributions: [] };

      const rawContributions = Array.isArray(
        (contributionsJson as { contributions?: unknown[] })?.contributions
      )
        ? (contributionsJson as { contributions: unknown[] }).contributions
        : [];

      const financialJson = financialRes.ok
        ? await financialRes.json()
        : { financial: null };

      const financial = (financialJson as { financial?: FinancialSummary })?.financial ?? {
        totalRaised: 0,
        paidContributionsCount: 0,
        pendingContributionsCount: 0,
        averageContribution: 0,
      };

      setEvent(normalizedEvent);
      setGifts((rawGifts as GiftApiItem[]).map(normalizeGift));
      setContributions(rawContributions as Contribution[]);
      setFinancialSummary(financial);
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível carregar a página do evento.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, [slug]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 700);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = selectedGift ? "hidden" : previousOverflow || "";
    return () => {
      document.body.style.overflow = previousOverflow || "";
    };
  }, [selectedGift]);

  useEffect(() => {
    if (!selectedGift) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePaymentModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedGift]);

  const countdown = useMemo(() => getCountdownParts(event?.date, nowMs), [event?.date, nowMs]);

  const giftCategories = useMemo(() => {
    return Array.from(
      new Set(
        gifts
          .map((gift) => gift.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [gifts]);

  const filteredGifts = useMemo(() => {
    const search = normalizeText(giftSearch);

    const list = gifts.filter((gift) => {
      const matchesSearch =
        !search ||
        normalizeText(gift.title).includes(search) ||
        normalizeText(gift.description).includes(search) ||
        normalizeText(gift.category).includes(search);

      const matchesCategory =
        giftCategory === "all" || (gift.category ?? "") === giftCategory;

      return matchesSearch && matchesCategory;
    });

    if (giftSort === "az") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    if (giftSort === "price-asc") {
      return [...list].sort(
        (a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER)
      );
    }

    if (giftSort === "price-desc") {
      return [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return [...list].sort((a, b) => {
      const featuredWeightA = a.isFeatured ? -100000 : 0;
      const featuredWeightB = b.isFeatured ? -100000 : 0;

      return (
        featuredWeightA +
        getGiftSortValue(a, "featured") -
        (featuredWeightB + getGiftSortValue(b, "featured"))
      );
    });
  }, [gifts, giftSearch, giftCategory, giftSort]);

  const galleryImages = useMemo(() => {
    const images: string[] = [];
    if (event?.heroImage) images.push(event.heroImage);
    if (event?.coverImage && event.coverImage !== event.heroImage) images.push(event.coverImage);

    const giftImages = gifts
      .map((gift) => gift.imageUrl)
      .filter((item): item is string => Boolean(item))
      .slice(0, 5);

    images.push(...giftImages);

    if (images.length === 0) {
      return [GIFT_PLACEHOLDER, GIFT_PLACEHOLDER, GIFT_PLACEHOLDER, GIFT_PLACEHOLDER];
    }

    while (images.length < 4) {
      images.push(images[images.length % images.length]);
    }

    return images.slice(0, 4);
  }, [event?.heroImage, event?.coverImage, gifts]);

  const paymentPreviewAmount = useMemo(() => {
    if (!selectedGift) return null;

    const qty =
      selectedGift.giftType === "QUOTA" ? Number(quotaQuantity || "1") || 1 : 1;

    const baseAmount =
      selectedGift.ui?.acceptsCustomAmount && customAmount
        ? Number(customAmount.replace(",", "."))
        : selectedGift.price ?? 0;

    const total =
      selectedGift.giftType === "QUOTA" ? baseAmount * qty : baseAmount;

    return Number.isFinite(total) && total > 0 ? total : null;
  }, [selectedGift, quotaQuantity, customAmount]);

  async function handleCopyLink() {
    if (typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  function openPaymentModal(gift: Gift) {
    setSelectedGift(gift);
    setBuyerName("");
    setBuyerEmail("");
    setBuyerPhone("");
    setBuyerMessage("");
    setCustomAmount("");
    setQuotaQuantity("1");
    setPaymentMethod("CARD");
    setPaymentError("");
  }

  function closePaymentModal() {
    setSelectedGift(null);
    setBuyerName("");
    setBuyerEmail("");
    setBuyerPhone("");
    setBuyerMessage("");
    setCustomAmount("");
    setQuotaQuantity("1");
    setPaymentMethod("CARD");
    setPaymentError("");
  }

  async function handleCreatePublicPayment() {
    if (!event || !selectedGift) return;

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      setPaymentError("Preencha nome, email e telefone.");
      return;
    }

    const selectedQuotaQuantity =
      selectedGift.giftType === "QUOTA" ? Number(quotaQuantity || "1") : 1;

    if (
      selectedGift.giftType === "QUOTA" &&
      (!selectedQuotaQuantity ||
        Number.isNaN(selectedQuotaQuantity) ||
        selectedQuotaQuantity <= 0)
    ) {
      setPaymentError("Escolha uma quantidade válida de cotas.");
      return;
    }

    if (
      selectedGift.giftType === "QUOTA" &&
      selectedGift.quotaRemaining !== undefined &&
      selectedGift.quotaRemaining !== null &&
      selectedQuotaQuantity > selectedGift.quotaRemaining
    ) {
      setPaymentError("A quantidade escolhida é maior do que as cotas disponíveis.");
      return;
    }

    const baseAmount =
      selectedGift.ui?.acceptsCustomAmount && customAmount
        ? Number(customAmount.replace(",", "."))
        : selectedGift.price;

    const amount =
      selectedGift.giftType === "QUOTA"
        ? (baseAmount ?? 0) * selectedQuotaQuantity
        : baseAmount;

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setPaymentError("Informe um valor válido para continuar.");
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError("");

      const response = await fetch(`${API}/payments/public/intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          giftId:
            selectedGift.giftType === "FREE_CONTRIBUTION" ? undefined : selectedGift.id,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          buyerPhone: buyerPhone.trim(),
          paymentMethod,
          amount,
          message: buyerMessage.trim() || undefined,
          quotaQuantity:
            selectedGift.giftType === "QUOTA" ? selectedQuotaQuantity : undefined,
        }),
      });

      const data: PaymentResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Não foi possível gerar o pagamento.");
      }

      const checkoutUrl = data?.paymentData?.checkoutUrl;
      if (!checkoutUrl) {
        throw new Error("O checkout não foi retornado pelo servidor.");
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível gerar o pagamento.";
      setPaymentError(message);
    } finally {
      setPaymentLoading(false);
    }
  }

  async function handleLookupGuest() {
    if (!slug || !rsvpCode.trim()) {
      setRsvpError("Digite o código RSVP.");
      setRsvpSuccess("");
      setGuest(null);
      return;
    }

    try {
      setRsvpLoading(true);
      setRsvpError("");
      setRsvpSuccess("");
      setGuest(null);

      const response = await fetch(`${API}/events/public/${slug}/rsvp/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: rsvpCode.trim() }),
      });

      const data: LookupResponse = await response.json();

      if (!response.ok) {
        throw new Error("Convite não encontrado.");
      }

      setGuest(data.guest);
      setRsvpSuccess("Convidado encontrado com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao buscar convidado.";
      setRsvpError(message);
      setRsvpSuccess("");
      setGuest(null);
    } finally {
      setRsvpLoading(false);
    }
  }

  async function handleRsvpAction(action: "confirm" | "decline") {
    if (!slug || !guest?.rsvpCode) return;

    try {
      setRsvpLoading(true);
      setRsvpError("");
      setRsvpSuccess("");

      const response = await fetch(
        `${API}/events/public/${slug}/rsvp/${guest.rsvpCode}/${action}`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Não foi possível atualizar a confirmação.");
      }

      setGuest((current) =>
        current
          ? {
              ...current,
              status: action === "confirm" ? "CONFIRMED" : "DECLINED",
            }
          : current
      );

      setRsvpSuccess(
        action === "confirm"
          ? "Presença confirmada com sucesso!"
          : "Presença recusada com sucesso!"
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a confirmação.";
      setRsvpError(message);
      setRsvpSuccess("");
    } finally {
      setRsvpLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f2ec]">
        <div className="rounded-[32px] border border-[#eadfd7] bg-white px-8 py-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <p className="text-lg text-zinc-700">Carregando evento...</p>
        </div>
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f2ec] px-6 text-center">
        <div className="rounded-[32px] border border-[#eadfd7] bg-white px-8 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <h1 className="text-2xl font-semibold text-zinc-900">Erro ao carregar</h1>
          <p className="mt-3 text-zinc-600">
            {errorMessage || "Evento não encontrado."}
          </p>
        </div>
      </main>
    );
  }

  const showStory = event.showStory;
  const showGallery = event.showGallery;
  const showLocation = event.showLocation;
  const showGifts = event.showGifts;
  const showRsvp = event.showRsvp && event.rsvpEnabled;
  const showCountdown = event.showCountdown;

  const quickFacts = [
    { label: "Data", value: formatDateShort(event.date) },
    { label: "Local", value: event.location },
    { label: "Presentes", value: `${gifts.length}` },
    { label: "RSVP", value: showRsvp ? "Ativo" : "Desativado" },
  ];

  const capabilities = [
    event.pixEnabled ? "Pix" : null,
    event.freeContributionEnabled ? "Contribuição livre" : null,
    event.quotaEnabled ? "Sistema de cotas" : null,
    showRsvp ? "Confirmação online" : null,
  ].filter(Boolean) as string[];

  const isWeddingTemplate =
    event.templateKey === "casamento-romantico" ||
    event.themeKey === "casamento-romantico" ||
    event.eventType === "WEDDING";

  const isKitchenShowerTemplate =
    event.templateKey === "cha-cozinha-elegante" ||
    event.themeKey === "cha-cozinha-elegante" ||
    event.eventType === "KITCHEN_SHOWER";

  if (isWeddingTemplate) {
    return (
      <WeddingPublicPage
        event={event}
        countdown={countdown}
        galleryImages={galleryImages}
        filteredGifts={filteredGifts}
        giftCategories={giftCategories}
        financialSummary={financialSummary}
        showStory={showStory}
        showGallery={showGallery}
        showLocation={showLocation}
        showGifts={showGifts}
        showRsvp={showRsvp}
        showCountdown={showCountdown}
        copied={copied}
        handleCopyLink={handleCopyLink}
        giftSearch={giftSearch}
        setGiftSearch={setGiftSearch}
        giftCategory={giftCategory}
        setGiftCategory={setGiftCategory}
        giftSort={giftSort}
        setGiftSort={setGiftSort}
        openPaymentModal={openPaymentModal}
        selectedGift={selectedGift}
        closePaymentModal={closePaymentModal}
        buyerName={buyerName}
        setBuyerName={setBuyerName}
        buyerEmail={buyerEmail}
        setBuyerEmail={setBuyerEmail}
        buyerPhone={buyerPhone}
        setBuyerPhone={setBuyerPhone}
        buyerMessage={buyerMessage}
        setBuyerMessage={setBuyerMessage}
        customAmount={customAmount}
        setCustomAmount={setCustomAmount}
        quotaQuantity={quotaQuantity}
        setQuotaQuantity={setQuotaQuantity}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentLoading={paymentLoading}
        paymentError={paymentError}
        paymentPreviewAmount={paymentPreviewAmount}
        handleCreatePublicPayment={handleCreatePublicPayment}
        rsvpCode={rsvpCode}
        setRsvpCode={setRsvpCode}
        rsvpLoading={rsvpLoading}
        rsvpError={rsvpError}
        rsvpSuccess={rsvpSuccess}
        guest={guest}
        handleLookupGuest={handleLookupGuest}
        handleRsvpAction={handleRsvpAction}
        showBackToTop={showBackToTop}
      />
    );
  }

  if (isKitchenShowerTemplate) {
    return (
      <KitchenShowerPublicPage
        event={event}
        countdown={countdown}
        galleryImages={galleryImages}
        filteredGifts={filteredGifts}
        giftCategories={giftCategories}
        financialSummary={financialSummary}
        showStory={showStory}
        showGallery={showGallery}
        showLocation={showLocation}
        showGifts={showGifts}
        showRsvp={showRsvp}
        showCountdown={showCountdown}
        copied={copied}
        handleCopyLink={handleCopyLink}
        giftSearch={giftSearch}
        setGiftSearch={setGiftSearch}
        giftCategory={giftCategory}
        setGiftCategory={setGiftCategory}
        giftSort={giftSort}
        setGiftSort={setGiftSort}
        openPaymentModal={openPaymentModal}
        selectedGift={selectedGift}
        closePaymentModal={closePaymentModal}
        buyerName={buyerName}
        setBuyerName={setBuyerName}
        buyerEmail={buyerEmail}
        setBuyerEmail={setBuyerEmail}
        buyerPhone={buyerPhone}
        setBuyerPhone={setBuyerPhone}
        buyerMessage={buyerMessage}
        setBuyerMessage={setBuyerMessage}
        customAmount={customAmount}
        setCustomAmount={setCustomAmount}
        quotaQuantity={quotaQuantity}
        setQuotaQuantity={setQuotaQuantity}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentLoading={paymentLoading}
        paymentError={paymentError}
        paymentPreviewAmount={paymentPreviewAmount}
        handleCreatePublicPayment={handleCreatePublicPayment}
        rsvpCode={rsvpCode}
        setRsvpCode={setRsvpCode}
        rsvpLoading={rsvpLoading}
        rsvpError={rsvpError}
        rsvpSuccess={rsvpSuccess}
        guest={guest}
        handleLookupGuest={handleLookupGuest}
        handleRsvpAction={handleRsvpAction}
        showBackToTop={showBackToTop}
      />
    );
  }

  return (
    <main
      className={`min-h-screen bg-[linear-gradient(180deg,#f8f2ec_0%,#f5ede6_100%)] pb-24 text-zinc-800 md:pb-0 ${fontClass(
        event.fontStyle
      )}`}
      style={{
        background: `linear-gradient(180deg, ${event.secondaryColor} 0%, #f5ede6 100%)`,
      }}
    >
      <header className="sticky top-0 z-50 border-b border-white/40 bg-[#fbf7f2]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src="/logo-vivalista.png"
              alt="VivaLista"
              width={150}
              height={52}
              className="h-auto w-[120px] md:w-[148px]"
              priority
            />
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#inicio" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
              Início
            </a>
            <a href="#visao-geral" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
              Visão geral
            </a>
            {showStory ? (
              <a href="#historia" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
                História
              </a>
            ) : null}
            {showGallery ? (
              <a href="#galeria" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
                Galeria
              </a>
            ) : null}
            <a href="#informacoes" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
              Informações
            </a>
            {showLocation ? (
              <a href="#localizacao" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
                Localização
              </a>
            ) : null}
            {showGifts ? (
              <a href="#presentes" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a href="#confirmacao" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
                Confirmação
              </a>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 md:inline-flex"
            >
              {copied ? "Link copiado" : "Copiar link"}
            </button>

            {showGifts ? (
              <a
                href="#presentes"
                className="rounded-full px-5 py-2.5 text-sm font-semibold shadow-[0_16px_36px_rgba(15,23,42,0.18)] transition hover:scale-[1.02]"
                style={getButtonStyle(event.primaryColor)}
              >
                Ver presentes
              </a>
            ) : (
              <a
                href="#inicio"
                className="rounded-full px-5 py-2.5 text-sm font-semibold shadow-[0_16px_36px_rgba(15,23,42,0.18)] transition hover:scale-[1.02]"
                style={getButtonStyle(event.primaryColor)}
              >
                Início
              </a>
            )}
          </div>
        </div>
      </header>

      <section
        id="inicio"
        className="relative overflow-hidden"
        style={
          event.heroImage
            ? {
                backgroundImage: `linear-gradient(115deg, rgba(15,23,42,0.80), rgba(24,24,27,0.56) 46%, rgba(0,0,0,0.22)), url("${event.heroImage}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {
                backgroundImage: `linear-gradient(135deg, ${event.primaryColor} 0%, #27272a 45%, #57534e 100%)`,
              }
        }
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.17),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%)]" />
        <div className="absolute -left-20 top-10 z-10 h-80 w-80 rounded-full bg-rose-200/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 z-10 h-[28rem] w-[28rem] rounded-full bg-amber-100/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f8f2ec] to-transparent" />

        <div className="relative z-20 mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 md:pb-28 md:pt-20 lg:px-8 lg:pb-32 lg:pt-24">
          <HeroSection
            event={event}
            countdown={countdown}
            showCountdown={showCountdown}
            showRsvp={showRsvp}
            showGifts={showGifts}
          />

          <div className="relative mt-10 hidden lg:block">
            <div className="grid max-w-5xl grid-cols-4 gap-4 rounded-[34px] border border-white/12 bg-white/10 p-4 backdrop-blur-md shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
              <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">
                  Página do evento
                </p>
                <p className="mt-3 text-sm leading-7 text-white/78">
                  Data, local e apresentação em uma experiência mais elegante.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">
                  Lista de presentes
                </p>
                <p className="mt-3 text-sm leading-7 text-white/78">
                  Presentes físicos, em dinheiro, cotas e contribuição livre.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">
                  RSVP
                </p>
                <p className="mt-3 text-sm leading-7 text-white/78">
                  Confirmação de presença prática e integrada.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">
                  Pagamentos
                </p>
                <p className="mt-3 text-sm leading-7 text-white/78">
                  Pix, cartão e outros fluxos com aparência mais profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="visao-geral" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionCard className="p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.35em]"
                style={{ color: event.primaryColor }}
              >
                visão geral
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
                Tudo o que você precisa para participar deste momento especial.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
                {event.welcomeMessage ||
                  event.description ||
                  "Esta página reúne apresentação, confirmação de presença, presentes e informações importantes do evento em uma experiência única."}
              </p>

              {capabilities.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {capabilities.map((item) => (
                    <span
                      key={item}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: event.secondaryColor,
                        color: event.primaryColor,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-[26px] border border-[#efe4db] p-5"
                  style={{ backgroundColor: "#fcf8f5" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                    {fact.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-zinc-900">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </section>

      {showStory ? (
        <section id="historia" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionCard className="bg-[linear-gradient(135deg,#18181b,#27272a)] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
              <div className="p-0">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-300">
                  história do evento
                </p>
                <h2 className="mt-5 text-3xl font-semibold leading-tight text-white md:text-4xl">
                  Um momento especial merece uma apresentação mais bonita e mais bem cuidada.
                </h2>
                <p className="mt-6 text-base leading-8 text-white/80">
                  {event.welcomeMessage ||
                    event.openingMessage ||
                    event.description ||
                    "Criamos este espaço para reunir as informações do evento, a confirmação de presença e a lista de presentes em uma experiência mais elegante para todos os convidados."}
                </p>
              </div>
            </SectionCard>

            <SectionCard className="p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
                    Nome
                  </p>
                  <p className="mt-2 text-lg leading-8 text-zinc-700">{event.title}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
                    Data
                  </p>
                  <p className="mt-2 text-lg leading-8 text-zinc-700">
                    {formatDate(event.date)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
                    Local
                  </p>
                  <p className="mt-2 text-lg leading-8 text-zinc-700 break-words">{event.location}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
                    RSVP
                  </p>
                  <p className="mt-2 text-lg leading-8 text-zinc-700">
                    {event.rsvpEnabled ? "Ativado" : "Desativado"}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-[#f0e5de] pt-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
                  Mensagem
                </p>
                <p className="mt-3 text-lg leading-8 text-zinc-700">
                  {event.welcomeMessage || event.description}
                </p>
              </div>
            </SectionCard>
          </div>
        </section>
      ) : null}

      {showGallery ? (
        <section id="galeria" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionCard className="p-6 md:p-8">
            <SectionHeader
              eyebrow="galeria"
              title="Atmosfera do evento"
              description="Uma seção visual forte para valorizar a experiência e aproximar a página do estilo de um site de evento premium."
              primaryColor={event.primaryColor}
            />

            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-[#f7efe9]">
                <img
                  src={galleryImages[0]}
                  alt="Galeria principal"
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                    destaque
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{event.title}</p>
                </div>
              </div>

              <div className="grid gap-4">
                {galleryImages.slice(1, 4).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative min-h-[126px] overflow-hidden rounded-[28px] bg-[#f7efe9]"
                  >
                    <img
                      src={image}
                      alt={`Galeria ${index + 2}`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </section>
      ) : null}

      <section id="informacoes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="informações"
          title="Tudo em um só lugar"
          description="Informações importantes apresentadas com mais clareza, mais respiro e melhor hierarquia visual."
          primaryColor={event.primaryColor}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Data e horário
            </p>
            <p className="mt-4 text-xl font-semibold text-zinc-900">
              {formatDate(event.date)}
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Recomendamos chegar com antecedência para aproveitar tudo com tranquilidade.
            </p>
          </SectionCard>

          <SectionCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Local
            </p>
            <p className="mt-4 text-xl font-semibold text-zinc-900 break-words">
              {event.location}
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              O endereço do evento está disponível nesta página para facilitar o acesso dos convidados.
            </p>
          </SectionCard>

          <SectionCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Recepção
            </p>
            <p className="mt-4 text-xl font-semibold text-zinc-900">
              Experiência organizada
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Confirmação de presença, presentes e informações reunidos em um ambiente único.
            </p>
          </SectionCard>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <SectionCard className="bg-[#fcf8f5] p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Pagamentos
            </p>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              {event.pixEnabled ? "Pix ativo" : "Pix opcional"} •{" "}
              {event.freeContributionEnabled ? "contribuição livre ativa" : "contribuição livre opcional"}
            </p>
          </SectionCard>

          <SectionCard className="bg-[#fcf8f5] p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Presentes
            </p>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              {gifts.length} item{gifts.length === 1 ? "" : "s"} disponível
              {gifts.length === 1 ? "" : "eis"} na lista do evento.
            </p>
          </SectionCard>

          <SectionCard className="bg-[#fcf8f5] p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Organização
            </p>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Página pública conectada à API, com slug real e conteúdo dinâmico do evento.
            </p>
          </SectionCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-4">
          <SectionCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Total arrecadado
            </p>
            <p className="mt-4 text-3xl font-semibold text-zinc-900">
              {formatMoney(financialSummary.totalRaised)}
            </p>
          </SectionCard>

          <SectionCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Contribuições pagas
            </p>
            <p className="mt-4 text-3xl font-semibold text-zinc-900">
              {financialSummary.paidContributionsCount}
            </p>
          </SectionCard>

          <SectionCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Pendentes
            </p>
            <p className="mt-4 text-3xl font-semibold text-zinc-900">
              {financialSummary.pendingContributionsCount}
            </p>
          </SectionCard>

          <SectionCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
              Ticket médio
            </p>
            <p className="mt-4 text-3xl font-semibold text-zinc-900">
              {formatMoney(financialSummary.averageContribution)}
            </p>
          </SectionCard>
        </div>
      </section>

      {showLocation ? (
        <section id="localizacao" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionCard className="bg-[linear-gradient(135deg,#18181b,#27272a)] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-300">
                localização
              </p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight text-white md:text-4xl">
                Chegue com facilidade ao local do evento.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/80">
                O endereço está centralizado nesta página para facilitar o acesso e ajudar seus convidados a se organizarem melhor.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={getMapsUrl(event.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                >
                  Abrir no Google Maps
                </a>

                <a
                  href={getWazeUrl(event.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Abrir no Waze
                </a>
              </div>
            </SectionCard>

            <SectionCard className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
                Endereço
              </p>
              <p className="mt-3 text-2xl font-semibold text-zinc-900">{event.location}</p>

              <div className="mt-8 overflow-hidden rounded-[28px] border border-[#efe4db] bg-[#faf5f0] p-5">
                <div className="flex min-h-[220px] items-center justify-center rounded-[22px] border border-dashed border-[#d9c6b8] bg-white text-center">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: event.primaryColor }}>
                      mapa
                    </p>
                    <p className="mt-3 text-base leading-7 text-zinc-600">
                      Clique em um dos botões para abrir a localização.
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </section>
      ) : null}

      {showGifts ? (
        <section id="presentes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="presentes"
            title="Lista de presentes"
            description="Uma experiência mais polida para navegar, escolher e contribuir sem perder a lógica real do sistema."
            primaryColor={event.primaryColor}
          />

          <div className="mb-6 grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
            <SectionCard className="p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Buscar
                  </label>
                  <input
                    value={giftSearch}
                    onChange={(e) => setGiftSearch(e.target.value)}
                    placeholder="Digite o nome do presente"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Categoria
                  </label>
                  <select
                    value={giftCategory}
                    onChange={(e) => setGiftCategory(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                  >
                    <option value="all">Todas as categorias</option>
                    {giftCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Ordenar
                  </label>
                  <select
                    value={giftSort}
                    onChange={(e) => setGiftSort(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                  >
                    <option value="featured">Destaques e ordem padrão</option>
                    <option value="az">A–Z</option>
                    <option value="price-asc">Menor valor</option>
                    <option value="price-desc">Maior valor</option>
                  </select>
                </div>
              </div>
            </SectionCard>

            <SectionCard className="bg-[linear-gradient(135deg,#18181b,#27272a)] p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-200">
                resumo da lista
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-semibold">{filteredGifts.length}</p>
                  <p className="mt-1 text-sm text-white/70">visíveis agora</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold">{gifts.length}</p>
                  <p className="mt-1 text-sm text-white/70">total do evento</p>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-600">
              {filteredGifts.length} presente{filteredGifts.length === 1 ? "" : "s"} encontrado
              {filteredGifts.length === 1 ? "" : "s"}
            </p>

            {(giftSearch || giftCategory !== "all" || giftSort !== "featured") && (
              <button
                type="button"
                onClick={() => {
                  setGiftSearch("");
                  setGiftCategory("all");
                  setGiftSort("featured");
                }}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {filteredGifts.length === 0 ? (
            <SectionCard className="p-10 text-center">
              <p className="text-lg font-medium text-zinc-900">
                Nenhum presente encontrado.
              </p>
              <p className="mt-2 text-zinc-600">
                Tente ajustar a busca, categoria ou ordenação.
              </p>
            </SectionCard>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filteredGifts.map((gift) => {
                const disabled = getGiftActionDisabled(gift);

                return (
                  <article
                    key={gift.id}
                    className={`group overflow-hidden rounded-[34px] border transition ${
                      getGiftCardClassName(gift)
                    } ${disabled ? "" : "hover:-translate-y-1.5"}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f7efe9]">
                      <img
                        src={getGiftImage(gift)}
                        alt={gift.title}
                        className={`h-full w-full object-cover transition duration-500 ${getGiftImageStateClass(
                          gift
                        )}`}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
                      {disabled ? (
                        <div className={`absolute inset-0 ${getGiftOverlayToneClass(gift)}`} />
                      ) : null}

                      <div className="absolute left-4 top-4 right-4 flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          {gift.isFeatured ? (
                            <span className="rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg">
                              Destaque
                            </span>
                          ) : null}
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${getGiftBadgeClass(
                              gift
                            )}`}
                          >
                            {getGiftBadge(gift)}
                          </span>
                        </div>

                        {(gift.isReserved || gift.isPurchased) && (
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm ${
                              gift.isPurchased
                                ? "border border-emerald-200 bg-white/90 text-emerald-800"
                                : "border border-amber-200 bg-white/90 text-amber-800"
                            }`}
                          >
                            {gift.isPurchased ? "Finalizado" : "Indisponível"}
                          </span>
                        )}
                      </div>

                      {disabled ? (
                        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                          <div
                            className={`max-w-[280px] rounded-[24px] px-5 py-4 ${getGiftOverlayCardClass(
                              gift
                            )}`}
                          >
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                              status do presente
                            </p>
                            <p className="mt-2 text-base font-semibold">
                              {getGiftStateTitle(gift)}
                            </p>
                            <p className="mt-1 text-sm leading-6 opacity-90">
                              {getGiftStateDescription(gift)}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="p-6">
                      <div className="flex min-h-[26px] items-center justify-between gap-3">
                        {gift.category ? (
                          <p
                            className="text-xs font-semibold uppercase tracking-[0.25em]"
                            style={{ color: event.primaryColor }}
                          >
                            {gift.category}
                          </p>
                        ) : (
                          <span />
                        )}

                        {(gift.isReserved || gift.isPurchased) && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                              gift.isPurchased
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {gift.isPurchased ? "Já comprado" : "Já reservado"}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 min-h-[58px] break-words text-[28px] font-semibold leading-[1.02] tracking-tight text-zinc-900">
                        {gift.title}
                      </h3>

                      <p className="mt-3 min-h-[84px] break-words text-sm leading-7 text-zinc-600">
                        {gift.description || "Presente disponível na lista do evento."}
                      </p>

                      <div className="mt-5 space-y-3">
                        <p className="text-2xl font-semibold text-zinc-900">
                          {gift.giftType === "FREE_CONTRIBUTION"
                            ? "Você escolhe o valor"
                            : formatMoney(gift.price)}
                        </p>

                        {gift.giftType === "QUOTA" ? (
                          <p className="text-sm text-zinc-600">
                            {gift.quotaSold ?? 0} de {gift.quotaTotal ?? 0} cotas vendidas
                            {gift.quotaRemaining !== undefined ? (
                              <> • {gift.quotaRemaining} restantes</>
                            ) : null}
                          </p>
                        ) : null}

                        {gift.giftType === "QUOTA" &&
                        typeof gift.progress === "number" ? (
                          <div className="mt-3">
                            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.max(0, Math.min(100, gift.progress))}%`,
                                  backgroundColor: event.primaryColor,
                                }}
                              />
                            </div>
                          </div>
                        ) : null}

                        {gift.isReserved && gift.reservedByName ? (
                          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                              reservado
                            </p>
                            <p className="mt-1 break-words font-medium">
                              {gift.reservedByName}
                            </p>
                          </div>
                        ) : null}

                        {gift.isPurchased && gift.purchasedByName ? (
                          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                              comprado por
                            </p>
                            <p className="mt-1 break-words font-medium">
                              {gift.purchasedByName}
                            </p>
                          </div>
                        ) : null}

                        {gift.giftType === "FREE_CONTRIBUTION" &&
                        gift.minAmount !== null &&
                        gift.minAmount !== undefined ? (
                          <p className="text-sm text-zinc-600">
                            Valor mínimo sugerido: {formatMoney(gift.minAmount)}
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => openPaymentModal(gift)}
                        disabled={disabled}
                        className={`mt-6 w-full rounded-full px-5 py-3.5 text-sm font-semibold shadow-[0_16px_36px_rgba(15,23,42,0.10)] transition ${
                          disabled
                            ? gift.isPurchased
                              ? "cursor-not-allowed border border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "cursor-not-allowed border border-amber-200 bg-amber-50 text-amber-700"
                            : "hover:scale-[1.01]"
                        }`}
                        style={!disabled ? getButtonStyle(event.primaryColor) : undefined}
                      >
                        {getGiftActionLabel(gift)}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : null}

      {event.contributionsFeedEnabled && contributions.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="contribuições"
            title="Feed de contribuições"
            description="Um resumo social e financeiro do que já aconteceu no evento."
            primaryColor={event.primaryColor}
          />

          <div className="grid gap-4">
            {contributions.map((item) => (
              <SectionCard key={item.id} className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-zinc-900 break-words">
                      {item.contributorName}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {item.gift?.title
                        ? `Contribuiu para ${item.gift.title}`
                        : "Contribuição para o evento"}
                    </p>
                    {item.message ? (
                      <p className="mt-3 text-sm leading-7 text-zinc-700">
                        “{item.message}”
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xl font-semibold text-zinc-900">
                      {formatMoney(item.amount)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {item.paymentMethod || "Pagamento"}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDateTime(item.paidAt || item.createdAt)}
                    </p>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionCard className="overflow-hidden bg-[linear-gradient(135deg,#18181b,#27272a)] p-8 text-white md:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-200">
                próximo passo
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-4xl">
                Confirme sua presença e escolha um presente para este momento especial.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
                A página agora reúne apresentação, navegação visual, lista de presentes e confirmação em uma experiência mais coerente.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {showRsvp ? (
                <a
                  href="#confirmacao"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                >
                  Confirmar presença
                </a>
              ) : null}
              {showGifts ? (
                <a
                  href="#presentes"
                  className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Ver presentes
                </a>
              ) : null}
            </div>
          </div>
        </SectionCard>
      </section>

      {showRsvp ? (
        <section id="confirmacao" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="confirmação"
            title="Confirmar presença"
            description="Informe seu código RSVP para localizar seu convite e atualizar sua presença."
            primaryColor={event.primaryColor}
          />

          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.94fr_1.06fr]">
            <SectionCard className="overflow-hidden bg-[linear-gradient(135deg,#18181b,#27272a)] p-0 text-white">
              <div className="border-b border-white/10 px-7 py-7 sm:px-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-200">
                  RSVP
                </p>
                <h3 className="mt-5 text-3xl font-semibold leading-tight">
                  Sua presença é muito importante.
                </h3>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
                  Use o código do seu convite para localizar seu cadastro e confirmar ou recusar presença diretamente nesta página.
                </p>
              </div>

              <div className="grid gap-4 px-7 py-7 sm:grid-cols-2 sm:px-8">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                    Evento
                  </p>
                  <p className="mt-2 break-words text-base font-semibold">{event.title}</p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                    Tipo de código
                  </p>
                  <p className="mt-2 text-base font-semibold">{event.rsvpLookupMode}</p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                    Como funciona
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    Primeiro localize seu convite. Depois você poderá confirmar presença ou informar que não poderá comparecer.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard className="p-6 sm:p-8">
              <div className="rounded-[28px] border border-[#efe4db] bg-[#fcf8f5] p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: event.primaryColor }}>
                  localizar convite
                </p>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  Digite o código RSVP exatamente como ele foi enviado para você.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={rsvpCode}
                    onChange={(e) => setRsvpCode(e.target.value)}
                    placeholder="Digite seu código RSVP"
                    className="w-full rounded-[20px] border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                  />
                  <button
                    type="button"
                    onClick={handleLookupGuest}
                    disabled={rsvpLoading}
                    className="rounded-[20px] px-6 py-3.5 text-sm font-semibold shadow-[0_16px_36px_rgba(15,23,42,0.10)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    style={getButtonStyle(event.primaryColor)}
                  >
                    {rsvpLoading ? "Buscando..." : "Buscar convite"}
                  </button>
                </div>
              </div>

              {rsvpError ? (
                <div className="mt-5 rounded-[22px] border border-red-100 bg-[linear-gradient(180deg,#fff5f5_0%,#fff0f0_100%)] px-4 py-4 text-sm text-red-700 shadow-[0_12px_25px_rgba(239,68,68,0.06)]">
                  <p className="font-semibold">Não foi possível localizar o convite</p>
                  <p className="mt-1 leading-6">{rsvpError}</p>
                </div>
              ) : null}

              {rsvpSuccess && !guest ? (
                <div className="mt-5 rounded-[22px] border border-emerald-100 bg-[linear-gradient(180deg,#f2fff7_0%,#ecfdf3_100%)] px-4 py-4 text-sm text-emerald-700 shadow-[0_12px_25px_rgba(16,185,129,0.06)]">
                  <p className="font-semibold">Convite encontrado</p>
                  <p className="mt-1 leading-6">{rsvpSuccess}</p>
                </div>
              ) : null}

              {guest ? (
                <div className="mt-6 overflow-hidden rounded-[30px] border border-[#eadfd7] bg-[#fcf8f5]">
                  <div className="border-b border-[#efe4db] bg-white px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: event.primaryColor }}>
                          convidado localizado
                        </p>
                        <h3 className="mt-2 break-words text-2xl font-semibold text-zinc-900 sm:text-[28px]">
                          {guest.name}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-zinc-600">
                          Agora escolha uma das opções abaixo para atualizar sua resposta.
                        </p>
                      </div>

                      <span className={`inline-flex shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${getGuestStatusTone(guest.status).className}`}>
                        {getGuestStatusTone(guest.status).label}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[22px] border border-white bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                          Status atual
                        </p>
                        <p className="mt-2 text-base font-semibold text-zinc-900">
                          {translateGuestStatus(guest.status)}
                        </p>
                      </div>

                      <div className="rounded-[22px] border border-white bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                          Código localizado
                        </p>
                        <p className="mt-2 break-all text-base font-semibold text-zinc-900">
                          {guest.rsvpCode}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => handleRsvpAction("confirm")}
                        disabled={rsvpLoading}
                        className="rounded-[20px] bg-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(5,150,105,0.18)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {rsvpLoading ? "Atualizando..." : "Confirmar presença"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRsvpAction("decline")}
                        disabled={rsvpLoading}
                        className="rounded-[20px] border border-zinc-200 bg-white px-5 py-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Não poderei ir
                      </button>
                    </div>
                  </div>

                  {rsvpSuccess ? (
                    <div className="border-t border-emerald-100 bg-[linear-gradient(180deg,#f2fff7_0%,#ecfdf3_100%)] px-5 py-4 text-sm text-emerald-700 sm:px-6">
                      <p className="font-semibold">Resposta atualizada com sucesso</p>
                      <p className="mt-1 leading-6">{rsvpSuccess}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </SectionCard>
          </div>
        </section>
      ) : null}

      {selectedGift ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[rgba(17,24,39,0.78)] px-3 py-3 backdrop-blur-[5px] sm:px-6 sm:py-8 lg:items-center">
          <div className="max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-[34px] border border-white/40 bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f3_100%)] shadow-[0_38px_120px_rgba(15,23,42,0.22)] sm:rounded-[40px]">
            <div className="sticky top-0 z-10 border-b border-[#efe4db] bg-[rgba(255,252,248,0.96)] px-4 py-4 backdrop-blur-xl sm:px-7 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: event.primaryColor }}>
                    pagamento do presente
                  </p>
                  <h3 className="mt-2 break-words text-xl font-semibold leading-tight text-zinc-900 sm:text-[30px]">
                    {selectedGift.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
                    Preencha seus dados abaixo para seguir ao checkout com mais segurança e clareza.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="shrink-0 rounded-full border border-[#e7dbd1] bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-[#f9f4ef]"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="grid gap-6 p-4 sm:gap-8 sm:p-7 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[28px] border border-[#eadfd7] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:rounded-[30px]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f7efe9]">
                    <img
                      src={getGiftImage(selectedGift)}
                      alt={selectedGift.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${getGiftBadgeClass(selectedGift)}`}>
                        {getGiftBadge(selectedGift)}
                      </span>
                      {selectedGift.giftType === "QUOTA" ? (
                        <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                          {selectedGift.quotaRemaining ?? 0} cotas disponíveis
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-4 break-words text-lg font-semibold text-zinc-900 sm:text-xl">
                      {selectedGift.title}
                    </p>
                    <p className="mt-2 break-words text-sm leading-7 text-zinc-600">
                      {selectedGift.description || "Pagamento do presente selecionado."}
                    </p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#eadfd7] bg-[#fcf8f5] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:rounded-[30px] sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: event.primaryColor }}>
                        resumo do pagamento
                      </p>
                      <p className="mt-2 text-sm leading-7 text-zinc-600">
                        Confira os dados antes de continuar.
                      </p>
                    </div>
                    <div
                      className="rounded-[22px] px-4 py-3 text-left sm:min-w-[170px] sm:text-right"
                      style={{ backgroundColor: event.secondaryColor }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        total estimado
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-zinc-900">
                        {paymentPreviewAmount ? formatMoney(paymentPreviewAmount) : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 rounded-[24px] border border-white/80 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
                      <span className="text-sm text-zinc-500">Tipo</span>
                      <span className="text-right text-sm font-semibold text-zinc-900">
                        {getGiftBadge(selectedGift)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
                      <span className="text-sm text-zinc-500">Valor base</span>
                      <span className="text-right text-sm font-semibold text-zinc-900">
                        {selectedGift.giftType === "FREE_CONTRIBUTION"
                          ? "Valor livre"
                          : formatMoney(selectedGift.price)}
                      </span>
                    </div>

                    {selectedGift.giftType === "QUOTA" ? (
                      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
                        <span className="text-sm text-zinc-500">Cotas restantes</span>
                        <span className="text-right text-sm font-semibold text-zinc-900">
                          {selectedGift.quotaRemaining ?? 0}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-500">Método selecionado</span>
                      <span className="text-right text-sm font-semibold text-zinc-900">
                        {getPaymentMethodLabel(paymentMethod)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#eadfd7] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:rounded-[30px] sm:p-6">
                <div className="mb-6 border-b border-[#f1e7df] pb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: event.primaryColor }}>
                    seus dados
                  </p>
                  <h4 className="mt-2 text-xl font-semibold text-zinc-900 sm:text-2xl">
                    Complete as informações para continuar
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">
                    Esses dados serão usados para identificar sua contribuição antes do checkout.
                  </p>
                </div>

                <div className="grid gap-4 sm:gap-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Seu nome
                    </label>
                    <input
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full rounded-[20px] border border-zinc-200 bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                      placeholder="Digite seu nome"
                      autoComplete="name"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Seu e-mail
                      </label>
                      <input
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full rounded-[20px] border border-zinc-200 bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                        placeholder="Digite seu e-mail"
                        autoComplete="email"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Seu telefone
                      </label>
                      <input
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full rounded-[20px] border border-zinc-200 bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                        placeholder="Digite seu telefone"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Mensagem
                    </label>
                    <textarea
                      value={buyerMessage}
                      onChange={(e) => setBuyerMessage(e.target.value)}
                      className="min-h-[120px] w-full rounded-[20px] border border-zinc-200 bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                      placeholder="Deixe uma mensagem opcional"
                    />
                  </div>

                  {(selectedGift.ui?.acceptsCustomAmount ||
                    selectedGift.giftType === "FREE_CONTRIBUTION") ? (
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Valor
                      </label>
                      <input
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full rounded-[20px] border border-zinc-200 bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                        placeholder={
                          selectedGift.minAmount
                            ? `Digite o valor (mínimo ${formatMoney(selectedGift.minAmount)})`
                            : "Digite o valor"
                        }
                      />
                    </div>
                  ) : null}

                  {selectedGift.giftType === "QUOTA" ? (
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Quantidade de cotas
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={selectedGift.quotaRemaining ?? undefined}
                        value={quotaQuantity}
                        onChange={(e) => setQuotaQuantity(e.target.value)}
                        className="w-full rounded-[20px] border border-zinc-200 bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                      />
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Método de pagamento
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-[20px] border border-zinc-200 bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                    >
                      <option value="CARD">Cartão</option>
                      <option value="PIX">Pix</option>
                      <option value="BOLETO">Boleto</option>
                    </select>
                  </div>

                  {paymentError ? (
                    <div className="rounded-[22px] border border-red-100 bg-[linear-gradient(180deg,#fff5f5_0%,#fff0f0_100%)] px-4 py-4 text-sm text-red-700 shadow-[0_12px_25px_rgba(239,68,68,0.06)]">
                      <p className="font-semibold">Não foi possível continuar</p>
                      <p className="mt-1 leading-6">{paymentError}</p>
                    </div>
                  ) : null}

                  <div className="rounded-[24px] border border-[#efe4db] bg-[#fcf8f5] p-4 shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-zinc-500">Total estimado</span>
                      <span className="text-xl font-semibold text-zinc-900">
                        {paymentPreviewAmount ? formatMoney(paymentPreviewAmount) : "-"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-zinc-500">
                      Ao continuar, você será direcionado para a etapa final de pagamento.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreatePublicPayment}
                    disabled={paymentLoading}
                    className="w-full rounded-full px-5 py-4 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    style={getButtonStyle(event.primaryColor)}
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
          className="fixed bottom-24 right-4 z-40 rounded-full px-4 py-3 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition hover:scale-[1.03] md:bottom-6"
          style={getButtonStyle(event.primaryColor)}
        >
          Voltar ao topo
        </button>
      ) : null}

      {(showGifts || showRsvp) ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/40 bg-[#fbf7f2]/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl gap-3">
            {showGifts ? (
              <a
                href="#presentes"
                className="flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold"
                style={getButtonStyle(event.primaryColor)}
              >
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a
                href="#confirmacao"
                className="flex-1 rounded-full border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-800"
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