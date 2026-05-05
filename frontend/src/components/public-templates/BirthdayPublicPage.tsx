"use client";

type PublicTemplateProps = {
  event: any;
  countdown: { label: string; value: string }[];
  galleryImages: string[];
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

const BIRTHDAY_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1800&q=92",
];

export default function BirthdayPublicPage({
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
}: PublicTemplateProps) {
  const heroImage =
    event.heroImage ||
    event.coverImage ||
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2400&q=92";

  const birthdayGallery =
    galleryImages.filter((image) => image && image !== GIFT_PLACEHOLDER).length > 0
      ? galleryImages
      : BIRTHDAY_FALLBACK_IMAGES;

  return (
    <main className="min-h-screen bg-[#fff6ed] text-[#33251f]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scroll-behavior: smooth; }
            .debut-display {
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-weight: 400;
              letter-spacing: -.055em;
            }
            .debut-serif {
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-weight: 400;
            }
            .debut-eyebrow {
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .32em;
              text-transform: uppercase;
            }
            .debut-photo {
              background-size: cover;
              background-position: center;
            }
            .debut-glow {
              box-shadow:
                0 34px 110px rgba(139, 63, 242, .18),
                0 0 0 1px rgba(246, 203, 99, .18);
            }
            .debut-card {
              border: 1px solid rgba(246, 203, 99, .20);
              background:
                radial-gradient(circle at 18% 12%, rgba(246,203,99,.12), transparent 30%),
                linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.045));
              box-shadow: 0 26px 80px rgba(0,0,0,.26);
              backdrop-filter: blur(14px);
            }
            @media (max-width: 768px) {
              .debut-display { letter-spacing: -.035em; }
            }
          `,
        }}
      />

      <header className="sticky top-0 z-50 border-b border-[#d86f4d]/15 bg-[#10041b]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="debut-serif text-2xl text-[#d86f4d]">
            XV
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#inicio" className="text-xs font-black uppercase tracking-[0.16em] text-[#dbc6f1] transition hover:text-[#d86f4d]">
              Início
            </a>
            {showStory ? (
              <a href="#historia" className="text-xs font-black uppercase tracking-[0.16em] text-[#dbc6f1] transition hover:text-[#d86f4d]">
                História
              </a>
            ) : null}
            <a href="#noite" className="text-xs font-black uppercase tracking-[0.16em] text-[#dbc6f1] transition hover:text-[#d86f4d]">
              A festa
            </a>
            {showGallery ? (
              <a href="#galeria" className="text-xs font-black uppercase tracking-[0.16em] text-[#dbc6f1] transition hover:text-[#d86f4d]">
                Galeria
              </a>
            ) : null}
            {showGifts ? (
              <a href="#presentes" className="text-xs font-black uppercase tracking-[0.16em] text-[#dbc6f1] transition hover:text-[#d86f4d]">
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a href="#confirmacao" className="text-xs font-black uppercase tracking-[0.16em] text-[#dbc6f1] transition hover:text-[#d86f4d]">
                RSVP
              </a>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden rounded-full border border-[#d86f4d]/20 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#d86f4d] transition hover:bg-white/10 md:inline-flex"
            >
              {copied ? "Copiado" : "Copiar link"}
            </button>

            {showRsvp ? (
              <a
                href="#confirmacao"
                className="rounded-full bg-[#d86f4d] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-[#2b1514] shadow-[0_16px_45px_rgba(246,203,99,.20)] transition hover:-translate-y-0.5"
              >
                Confirmar
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <section id="inicio" className="relative min-h-[800px] overflow-hidden bg-[#3a1c1b]">
        <div
          className="absolute inset-0 debut-photo opacity-72"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,1,17,.96)_0%,rgba(20,4,33,.78)_47%,rgba(20,4,33,.22)_100%)]" />
        <div className="absolute left-[-12%] top-[-18%] h-[560px] w-[560px] rounded-full bg-[#d86f4d]/26 blur-3xl" />
        <div className="absolute bottom-[-24%] right-[-12%] h-[620px] w-[620px] rounded-full bg-[#d86f4d]/18 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#2b1514] to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-[800px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div>
            <p className="debut-eyebrow text-[#d86f4d]">Uma festa para celebrar a vida</p>
            <h1 className="debut-display mt-7 text-7xl leading-[0.82] text-white sm:text-8xl lg:text-[128px]">
              {event.title}
            </h1>
            <p className="debut-serif mt-7 max-w-2xl text-3xl italic leading-tight text-[#fff0df] sm:text-4xl">
              {event.publicSubtitle ||
                event.welcomeMessage ||
                "Uma página alegre e elegante para reunir convidados, presentes e confirmações."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#d86f4d]/18 bg-white/8 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#f7e8ff] backdrop-blur">
                {formatDateShort(event.date)}
              </span>
              <span className="rounded-full border border-[#d86f4d]/18 bg-white/8 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#f7e8ff] backdrop-blur">
                {event.location}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {showRsvp ? (
                <a
                  href="#confirmacao"
                  className="rounded-full bg-[#d86f4d] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#2b1514] shadow-[0_18px_50px_rgba(0,0,0,.28)] transition hover:-translate-y-0.5"
                >
                  Confirmar presença
                </a>
              ) : null}

              {showGifts ? (
                <a
                  href="#presentes"
                  className="rounded-full border border-[#d86f4d]/22 bg-white/8 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_50px_rgba(0,0,0,.18)] backdrop-blur transition hover:bg-white/12"
                >
                  Ver presentes
                </a>
              ) : null}
            </div>
          </div>

          <div className="debut-card rounded-[46px] p-5">
            <div
              className="min-h-[520px] rounded-[34px] debut-photo"
              style={{ backgroundImage: `url("${birthdayGallery[0] || heroImage}")` }}
            />
            <div className="px-4 py-5">
              <p className="debut-eyebrow text-[#d86f4d]">festa</p>
              <p className="debut-serif mt-2 text-3xl leading-tight text-white">
                Uma abertura calorosa para uma comemoração cheia de boas memórias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {showCountdown ? (
        <section className="bg-[#2b1514] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="debut-eyebrow text-[#d86f4d]">Contagem regressiva</p>
            <h2 className="debut-serif mt-4 text-4xl text-[#ffe6ca] sm:text-5xl">
              A inauguração do festa está perto.
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {countdown.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[30px] border border-[#d86f4d]/15 bg-white/[.07] px-4 py-7 debut-glow"
                >
                  <strong className="debut-serif block text-5xl font-normal text-[#d86f4d]">
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

      <section className="bg-[#fff6ed] px-4 py-20 text-center text-[#3a1c1b] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[42px] border border-[#f4c8a7] bg-white/82 px-7 py-12 shadow-[0_30px_90px_rgba(49,14,74,.12)] sm:px-12">
          <p className="debut-eyebrow text-[#d86f4d]">Mensagem aos convidados</p>
          <h2 className="debut-serif mt-5 text-4xl leading-tight text-[#3a1c1b] sm:text-6xl">
            Uma nova idade merece uma grande celebração.
          </h2>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#7d665b] sm:text-lg">
            {event.welcomeMessage ||
              event.openingMessage ||
              event.description ||
              "Criamos este espaço para compartilhar os detalhes da festa, confirmar presença e reunir todos em uma experiência especial."}
          </p>
        </div>
      </section>

      {showStory ? (
        <section id="historia" className="bg-[#ffffff] px-4 py-24 text-[#3a1c1b] sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.95fr_1.05fr]">
            <div className="relative min-h-[560px]">
              <div
                className="absolute inset-0 right-20 bottom-24 rounded-[42px] border-[12px] border-white bg-[#f4c8a7] shadow-[0_30px_90px_rgba(49,14,74,.12)] debut-photo"
                style={{ backgroundImage: `url("${birthdayGallery[1] || birthdayGallery[0]}")` }}
              />
              <div
                className="absolute bottom-0 right-0 h-[310px] w-[48%] rounded-[34px] border-[10px] border-white bg-[#f4c8a7] shadow-[0_30px_90px_rgba(49,14,74,.12)] debut-photo"
                style={{ backgroundImage: `url("${birthdayGallery[2] || birthdayGallery[0]}")` }}
              />
            </div>

            <div>
              <p className="debut-eyebrow text-[#d86f4d]">Aniversário</p>
              <h2 className="debut-display mt-5 text-6xl leading-[0.9] text-[#3a1c1b] sm:text-7xl">
                Um festa pensado para conectar pessoas, marcas e oportunidades.
              </h2>
              <p className="mt-7 text-lg leading-9 text-[#7d665b]">
                Esta página reúne os detalhes do chá: data, local,
                presentes, confirmação de presença e informações para que cada
                convidado celebre esse momento com festa.
              </p>
              <p className="debut-serif mt-8 border-l-2 border-[#d86f4d] pl-6 text-3xl leading-tight text-[#d86f4d]">
                Hoje é dia de celebrar festa, família e esperança.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section id="noite" className="relative overflow-hidden bg-[#3a1c1b] px-4 py-24 text-white sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-30 debut-photo"
          style={{ backgroundImage: `url("${birthdayGallery[3] || heroImage}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,1,17,.98),rgba(17,5,28,.78),rgba(17,5,28,.48))]" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="debut-eyebrow text-[#d86f4d]">A festa</p>
          <h2 className="debut-serif mt-4 text-5xl leading-tight text-[#ffe6ca] sm:text-6xl">
            Família, festa, presentes e afeto.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="debut-card rounded-[34px] p-7">
              <p className="text-5xl">✦</p>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.26em] text-[#d86f4d]">
                Data
              </h3>
              <p className="debut-serif mt-3 text-3xl text-white">{formatDateShort(event.date)}</p>
            </div>
            <div className="debut-card rounded-[34px] p-7">
              <p className="text-5xl">◆</p>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.26em] text-[#d86f4d]">
                Local
              </h3>
              <p className="debut-serif mt-3 text-3xl text-white">{event.location}</p>
            </div>
            <div className="debut-card rounded-[34px] p-7">
              <p className="text-5xl">★</p>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.26em] text-[#d86f4d]">
                Experiência
              </h3>
              <p className="debut-serif mt-3 text-3xl text-white">Festa premium</p>
            </div>
          </div>
        </div>
      </section>

      {showGallery ? (
        <section id="galeria" className="bg-[#ffffff] py-16 text-center text-[#3a1c1b]">
          <p className="debut-eyebrow text-[#d86f4d]">Galeria</p>
          <h2 className="debut-serif mt-3 text-5xl text-[#3a1c1b]">
            Detalhes do festa
          </h2>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-5">
            {birthdayGallery.slice(0, 5).map((image, index) => (
              <div key={`${image}-${index}`} className="h-64 overflow-hidden bg-[#f4c8a7] md:h-80">
                <div
                  className="h-full w-full debut-photo transition duration-700 hover:scale-105"
                  style={{ backgroundImage: `url("${image}")` }}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="informacoes" className="bg-[#fff6ed] px-4 py-24 text-[#3a1c1b] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
          <div className="rounded-[38px] border border-[#f4c8a7] bg-white/78 p-8 shadow-[0_30px_90px_rgba(49,14,74,.12)]">
            <p className="debut-eyebrow text-[#d86f4d]">Informações</p>
            <h2 className="debut-display mt-4 text-5xl leading-[0.95] text-[#3a1c1b] sm:text-6xl">
              Tudo para celebrar o festa com tranquilidade.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#7d665b]">
              Encontre aqui data, local, confirmação, informações essenciais e as principais
              orientações para participar do festa.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[30px] border border-[#f4c8a7] bg-white/80 p-6 shadow-[0_30px_90px_rgba(49,14,74,.10)]">
              <p className="debut-eyebrow text-[#d86f4d]">Data</p>
              <p className="mt-4 text-2xl font-semibold text-[#3a1c1b]">{formatDate(event.date)}</p>
            </div>
            <div className="rounded-[30px] border border-[#f4c8a7] bg-white/80 p-6 shadow-[0_30px_90px_rgba(49,14,74,.10)]">
              <p className="debut-eyebrow text-[#d86f4d]">Local</p>
              <p className="mt-4 break-words text-2xl font-semibold text-[#3a1c1b]">{event.location}</p>
            </div>
            <div className="rounded-[30px] border border-[#f4c8a7] bg-white/80 p-6 shadow-[0_30px_90px_rgba(49,14,74,.10)]">
              <p className="debut-eyebrow text-[#d86f4d]">Presentes</p>
              <p className="mt-4 text-2xl font-semibold text-[#3a1c1b]">{filteredGifts.length} disponíveis</p>
            </div>
            <div className="rounded-[30px] border border-[#f4c8a7] bg-white/80 p-6 shadow-[0_30px_90px_rgba(49,14,74,.10)]">
              <p className="debut-eyebrow text-[#d86f4d]">Arrecadado</p>
              <p className="mt-4 text-2xl font-semibold text-[#3a1c1b]">{formatMoney(financialSummary.totalRaised)}</p>
            </div>
          </div>
        </div>
      </section>

      {showLocation ? (
        <section id="localizacao" className="bg-[#ffffff] px-4 py-24 text-[#3a1c1b] sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.86fr_1.14fr]">
            <div className="rounded-[38px] bg-[#3a1c1b] p-8 text-white shadow-[0_30px_90px_rgba(49,14,74,.20)]">
              <p className="debut-eyebrow text-[#d86f4d]">Localização</p>
              <h2 className="debut-serif mt-5 text-5xl leading-tight text-[#ffe6ca]">
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
                  className="rounded-full bg-[#d86f4d] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#2b1514] transition hover:bg-[#f39a61]"
                >
                  Google Maps
                </a>
                <a
                  href={getWazeUrl(event.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#d86f4d]/18 bg-white/8 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/12"
                >
                  Waze
                </a>
              </div>
            </div>

            <div className="grid min-h-[360px] place-items-center rounded-[38px] border border-[#f4c8a7] bg-[#fff6ed] p-8 text-center shadow-[0_30px_90px_rgba(49,14,74,.10)]">
              <div>
                <p className="debut-eyebrow text-[#d86f4d]">Mapa</p>
                <h3 className="debut-serif mt-3 text-4xl text-[#3a1c1b]">
                  {event.location}
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[#7d665b]">
                  Use os botões de rota para chegar com tranquilidade.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showGifts ? (
        <section id="presentes" className="bg-[#fff6ed] px-4 py-24 text-[#3a1c1b] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="debut-eyebrow text-[#d86f4d]">Presentes</p>
              <h2 className="debut-serif mt-4 text-5xl leading-tight text-[#3a1c1b] sm:text-6xl">
                Opções do festa
              </h2>
              <p className="mt-5 text-base leading-8 text-[#7d665b]">
                Escolha uma lembrança útil ou contribuição para o festa.
              </p>
            </div>

            <div className="mb-8 rounded-[34px] border border-[#f4c8a7] bg-white/82 p-5 shadow-[0_30px_90px_rgba(49,14,74,.10)]">
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  value={giftSearch}
                  onChange={(event) => setGiftSearch(event.target.value)}
                  placeholder="Buscar presente"
                  className="rounded-2xl border border-[#f4c8a7] bg-white px-4 py-3 text-sm outline-none focus:border-[#d86f4d]"
                />
                <select
                  value={giftCategory}
                  onChange={(event) => setGiftCategory(event.target.value)}
                  className="rounded-2xl border border-[#f4c8a7] bg-white px-4 py-3 text-sm outline-none focus:border-[#d86f4d]"
                >
                  <option value="all">Todas as categorias</option>
                  {giftCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={giftSort}
                  onChange={(event) => setGiftSort(event.target.value)}
                  className="rounded-2xl border border-[#f4c8a7] bg-white px-4 py-3 text-sm outline-none focus:border-[#d86f4d]"
                >
                  <option value="featured">Destaques</option>
                  <option value="az">A-Z</option>
                  <option value="price-asc">Menor valor</option>
                  <option value="price-desc">Maior valor</option>
                </select>
              </div>
            </div>

            {filteredGifts.length === 0 ? (
              <div className="rounded-[38px] border border-[#f4c8a7] bg-white/82 p-10 text-center shadow-[0_30px_90px_rgba(49,14,74,.10)]">
                <h3 className="debut-serif text-4xl text-[#3a1c1b]">
                  Lista em preparação
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-[#7d665b]">
                  Os presentes ainda não foram cadastrados para este festa.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {filteredGifts.map((gift) => {
                  const disabled = getGiftActionDisabled(gift);

                  return (
                    <article
                      key={gift.id}
                      className="overflow-hidden rounded-[34px] border border-[#f4c8a7] bg-white shadow-[0_30px_90px_rgba(49,14,74,.10)] transition hover:-translate-y-1"
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
                          <p className="debut-eyebrow text-[#d86f4d]">{gift.category}</p>
                        ) : null}
                        <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#3a1c1b]">
                          {gift.title}
                        </h3>
                        <p className="mt-3 min-h-[70px] text-sm leading-7 text-[#7d665b]">
                          {gift.description || "Presente disponível na lista do festa."}
                        </p>
                        <p className="debut-serif mt-4 text-3xl text-[#d86f4d]">
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
                              ? "cursor-not-allowed bg-[#f3d7c3] text-[#7d665b]"
                              : "bg-[#2b1514] text-[#d86f4d] hover:-translate-y-0.5"
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

      <section className="bg-[#3a1c1b] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="debut-eyebrow text-[#d86f4d]">Próximo passo</p>
            <h2 className="debut-serif mt-4 max-w-3xl text-5xl leading-tight text-[#ffe6ca]">
              Confirme sua presença e venha conhecer nosso festa.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {showRsvp ? (
              <a href="#confirmacao" className="rounded-full bg-[#d86f4d] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#2b1514]">
                Confirmar presença
              </a>
            ) : null}
            {showGifts ? (
              <a href="#presentes" className="rounded-full border border-[#d86f4d]/18 bg-white/8 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white">
                Ver presentes
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {showRsvp ? (
        <section id="confirmacao" className="bg-[#ffffff] px-4 py-24 text-[#3a1c1b] sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.92fr_1.08fr]">
            <div className="rounded-[38px] bg-[#3a1c1b] p-8 text-white shadow-[0_30px_90px_rgba(49,14,74,.20)]">
              <p className="debut-eyebrow text-[#d86f4d]">RSVP</p>
              <h2 className="debut-serif mt-5 text-5xl leading-tight text-[#ffe6ca]">
                Sua presença torna essa festa ainda maior.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/70">
                Digite o código do convite para localizar seu cadastro e confirmar
                sua presença.
              </p>
            </div>

            <div className="rounded-[38px] border border-[#f4c8a7] bg-white/82 p-7 shadow-[0_30px_90px_rgba(49,14,74,.10)]">
              <p className="debut-eyebrow text-[#d86f4d]">Localizar convite</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={rsvpCode}
                  onChange={(event) => setRsvpCode(event.target.value)}
                  placeholder="Digite seu código RSVP"
                  className="rounded-2xl border border-[#f4c8a7] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#d86f4d]"
                />
                <button
                  type="button"
                  onClick={handleLookupGuest}
                  disabled={rsvpLoading}
                  className="rounded-2xl bg-[#2b1514] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-[#d86f4d] disabled:opacity-60"
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
                <div className="mt-6 rounded-[30px] border border-[#f4c8a7] bg-[#fff6ed] p-5">
                  <p className="debut-eyebrow text-[#d86f4d]">Convidado localizado</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#3a1c1b]">
                    {guest.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#7d665b]">
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
                      className="rounded-2xl border border-[#f4c8a7] bg-white px-5 py-4 text-sm font-bold text-[#3a1c1b] disabled:opacity-60"
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

      <footer className="bg-[#3a1c1b] px-4 py-10 text-center text-white/60">
        <p className="debut-serif text-3xl text-[#d86f4d]">Aniversário</p>
        <p className="mt-2 text-sm">
          {formatDateShort(event.date)} • {event.location}
        </p>
      </footer>

      {selectedGift ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[rgba(9,1,17,0.82)] px-3 py-3 backdrop-blur-[5px] sm:px-6 sm:py-8 lg:items-center">
          <div className="max-h-[96vh] w-full max-w-4xl overflow-y-auto rounded-[36px] border border-[#d86f4d]/18 bg-[#ffffff] shadow-[0_38px_120px_rgba(15,23,42,0.22)]">
            <div className="sticky top-0 z-10 border-b border-[#f4c8a7] bg-[#ffffff]/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="debut-eyebrow text-[#d86f4d]">Pagamento</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#3a1c1b]">
                    {selectedGift.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="rounded-full border border-[#f4c8a7] bg-white px-4 py-2 text-sm font-bold text-[#7d665b]"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[.9fr_1.1fr]">
              <div className="overflow-hidden rounded-[30px] border border-[#f4c8a7] bg-white">
                <img
                  src={getGiftImage(selectedGift)}
                  alt={selectedGift.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-xl font-semibold text-[#3a1c1b]">
                    {selectedGift.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#7d665b]">
                    {selectedGift.description || "Pagamento do presente selecionado."}
                  </p>
                  <p className="debut-serif mt-4 text-3xl text-[#d86f4d]">
                    {paymentPreviewAmount ? formatMoney(paymentPreviewAmount) : "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-[30px] border border-[#f4c8a7] bg-white p-5">
                <div className="grid gap-4">
                  <input
                    value={buyerName}
                    onChange={(event) => setBuyerName(event.target.value)}
                    placeholder="Seu nome"
                    className="rounded-2xl border border-[#f4c8a7] px-4 py-3.5 text-sm outline-none focus:border-[#d86f4d]"
                  />
                  <input
                    value={buyerEmail}
                    onChange={(event) => setBuyerEmail(event.target.value)}
                    placeholder="Seu e-mail"
                    className="rounded-2xl border border-[#f4c8a7] px-4 py-3.5 text-sm outline-none focus:border-[#d86f4d]"
                  />
                  <input
                    value={buyerPhone}
                    onChange={(event) => setBuyerPhone(event.target.value)}
                    placeholder="Seu telefone"
                    className="rounded-2xl border border-[#f4c8a7] px-4 py-3.5 text-sm outline-none focus:border-[#d86f4d]"
                  />
                  <textarea
                    value={buyerMessage}
                    onChange={(event) => setBuyerMessage(event.target.value)}
                    placeholder="Mensagem opcional"
                    className="min-h-[110px] rounded-2xl border border-[#f4c8a7] px-4 py-3.5 text-sm outline-none focus:border-[#d86f4d]"
                  />

                  {(selectedGift.ui?.acceptsCustomAmount ||
                    selectedGift.giftType === "FREE_CONTRIBUTION") ? (
                    <input
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="Valor"
                      className="rounded-2xl border border-[#f4c8a7] px-4 py-3.5 text-sm outline-none focus:border-[#d86f4d]"
                    />
                  ) : null}

                  {selectedGift.giftType === "QUOTA" ? (
                    <input
                      type="number"
                      min={1}
                      max={selectedGift.quotaRemaining ?? undefined}
                      value={quotaQuantity}
                      onChange={(event) => setQuotaQuantity(event.target.value)}
                      className="rounded-2xl border border-[#f4c8a7] px-4 py-3.5 text-sm outline-none focus:border-[#d86f4d]"
                    />
                  ) : null}

                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="rounded-2xl border border-[#f4c8a7] px-4 py-3.5 text-sm outline-none focus:border-[#d86f4d]"
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
                    className="rounded-full bg-[#2b1514] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#d86f4d] disabled:opacity-60"
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
          className="fixed bottom-24 right-4 z-40 rounded-full bg-[#2b1514] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#d86f4d] shadow-xl transition hover:-translate-y-0.5 md:bottom-6"
        >
          Topo
        </button>
      ) : null}

      {(showGifts || showRsvp) ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f4c8a7] bg-[#ffffff]/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl gap-3">
            {showGifts ? (
              <a
                href="#presentes"
                className="flex-1 rounded-full bg-[#2b1514] px-4 py-3 text-center text-sm font-bold text-[#d86f4d]"
              >
                Presentes
              </a>
            ) : null}
            {showRsvp ? (
              <a
                href="#confirmacao"
                className="flex-1 rounded-full border border-[#f4c8a7] bg-white px-4 py-3 text-center text-sm font-bold text-[#3a1c1b]"
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