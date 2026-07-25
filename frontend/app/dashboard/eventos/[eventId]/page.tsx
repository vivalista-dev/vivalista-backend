"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* VERSAO_EVENT_DASHBOARD_LINK_MONTAR_SITE_VIVALISTA */

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | string;

type EventData = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  capacity?: number | null;
  status?: EventStatus | null;
  coverImage?: string | null;
  heroImageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type GiftDashboardResponse = {
  eventId: string;
  dashboard: {
    totalGifts: number;
    activeGifts: number;
    reservedGifts: number;
    purchasedGifts: number;
    availableGifts: number;
  };
};

type GuestDashboardResponse = {
  eventId: string;
  dashboard: {
    totalGuests: number;
    confirmedGuests: number;
    invitedGuests: number;
    declinedGuests: number;
  };
};

type FinancialSummaryResponse = {
  event?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  financial?: {
    totalRaised: number;
    paidContributionsCount: number;
    pendingContributionsCount: number;
    averageContribution: number;
  };
};

type SectionMediaResponse = {
  media?: Array<{
    id: string;
    sectionKey: string;
    isActive?: boolean;
  }>;
};

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type SetupStatus = "done" | "warning" | "pending";

type SetupStep = {
  number: string;
  title: string;
  description: string;
  status: SetupStatus;
  href: string;
  cta: string;
};

type ActionGroup = {
  title: string;
  description: string;
  items: Array<{
    label: string;
    description: string;
    href?: string | null;
    button?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    external?: boolean;
    highlight?: boolean;
  }>;
};

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

  if (raw.startsWith("/")) {
    return `${backendUrl}${raw}`;
  }

  return `${backendUrl}/${raw}`;
}

function formatEventDate(date?: string | null): string {
  if (!date) return "Data não informada";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(parsed);
}

function formatShortDate(date?: string | null): string {
  if (!date) return "Não informado";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
}

function formatMoney(value?: number | null): string {
  if (value === undefined || value === null) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error instanceof Error) {
    return error.message;
  }

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

  return "Não foi possível carregar os dados do evento.";
}

function statusLabel(status?: string | null): string {
  if (!status) return "Sem status";
  if (status === "DRAFT") return "Rascunho";
  if (status === "PUBLISHED") return "Publicado";
  if (status === "CANCELLED") return "Cancelado";
  return status;
}

function statusPillClasses(status?: string | null): string {
  if (status === "PUBLISHED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "CANCELLED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-[#eadfbd] bg-[#fff8e6] text-[#8a6518]";
}

function setupPillClasses(status: SetupStatus): string {
  if (status === "done") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "warning") {
    return "border-[#eadfbd] bg-[#fff8e6] text-[#8a6518]";
  }

  return "border-[#eee9e1] bg-[#fbfaf7] text-[#7f738c]";
}

function setupLabel(status: SetupStatus): string {
  if (status === "done") return "Pronto";
  if (status === "warning") return "Revisar";
  return "Pendente";
}

function normalizeEventResponse(data: EventData | { data?: EventData }): EventData {
  if ("data" in data && data.data) return data.data;
  return data as EventData;
}

function OverviewCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-[26px] border border-[#eee9e1] bg-white p-6 shadow-[0_18px_46px_rgba(36,24,47,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9a7926]">
        {label}
      </p>

      <p className="mt-3 text-2xl font-light tracking-[-0.04em] text-[#24182f]">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#7f738c]">{description}</p>
    </div>
  );
}

function ActionItem({
  href,
  label,
  description,
  button,
  onClick,
  disabled,
  external,
  highlight,
}: {
  href?: string | null;
  label: string;
  description: string;
  button?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
  highlight?: boolean;
}) {
  const className = `group block rounded-[24px] border p-5 text-left transition ${
    highlight
      ? "border-[#c79a2b] bg-[#fffaf0] shadow-[0_18px_46px_rgba(201,154,43,0.10)] hover:-translate-y-0.5 hover:bg-white"
      : "border-[#eee9e1] bg-white hover:-translate-y-0.5 hover:border-[#d8caa9] hover:shadow-[0_18px_42px_rgba(36,24,47,0.07)]"
  }`;

  const content = (
    <>
      <p
        className={`text-sm font-semibold ${
          highlight ? "text-[#8a6518]" : "text-[#24182f]"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#7f738c]">{description}</p>

      <span
        className={`mt-4 inline-flex text-[12px] font-semibold uppercase tracking-[0.18em] ${
          highlight ? "text-[#8a6518]" : "text-[#5f35c6]"
        }`}
      >
        Abrir
      </span>
    </>
  );

  if (button) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`${className} w-full disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {content}
      </button>
    );
  }

  if (!href) {
    return (
      <div className="rounded-[24px] border border-[#eee9e1] bg-[#fbfaf7] p-5 opacity-70">
        <p className="text-sm font-semibold text-[#7f738c]">{label}</p>
        <p className="mt-2 text-sm leading-6 text-[#9a909e]">{description}</p>
        <span className="mt-4 inline-flex text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9a909e]">
          Indisponível
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}

function ActionGroupCard({ group }: { group: ActionGroup }) {
  return (
    <section className="rounded-[34px] border border-[#eee9e1] bg-[#fbfaf7] p-5 sm:p-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9a7926]">
          {group.title}
        </p>

        <p className="mt-2 text-sm leading-6 text-[#7f738c]">
          {group.description}
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {group.items.map((item) => (
          <ActionItem
            key={`${group.title}-${item.label}`}
            href={item.href}
            label={item.label}
            description={item.description}
            button={item.button}
            onClick={item.onClick}
            disabled={item.disabled}
            external={item.external}
            highlight={item.highlight}
          />
        ))}
      </div>
    </section>
  );
}

function ProgressStepCard({ step }: { step: SetupStep }) {
  return (
    <Link
      href={step.href}
      className="rounded-[28px] border border-[#eee9e1] bg-white p-5 shadow-[0_18px_46px_rgba(36,24,47,0.05)] transition hover:-translate-y-1 hover:border-[#d8caa9] hover:shadow-[0_24px_58px_rgba(36,24,47,0.08)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24182f] text-sm font-semibold text-white">
          {step.number}
        </span>

        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${setupPillClasses(
            step.status
          )}`}
        >
          {setupLabel(step.status)}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-light tracking-[-0.04em] text-[#24182f]">
        {step.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#7f738c]">
        {step.description}
      </p>

      <span className="mt-5 inline-flex rounded-full bg-[#fff4d8] px-4 py-2 text-sm font-semibold text-[#8a6518]">
        {step.cta}
      </span>
    </Link>
  );
}
export default function EventDashboardPage() {
  const params = useParams();
  const eventIdParam = params?.eventId;
  const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;

  const [event, setEvent] = useState<EventData | null>(null);
  const [giftDashboard, setGiftDashboard] =
    useState<GiftDashboardResponse["dashboard"] | null>(null);
  const [guestDashboard, setGuestDashboard] =
    useState<GuestDashboardResponse["dashboard"] | null>(null);
  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummaryResponse["financial"] | null>(null);
  const [sectionMedia, setSectionMedia] = useState<
    SectionMediaResponse["media"]
  >([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const backendUrl = getBackendUrl();

  async function apiRequest<T>(path: string): Promise<T> {
    const token = getAuthToken();

    const response = await fetch(`${backendUrl}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      throw data || new Error(`Erro ${response.status}`);
    }

    return data as T;
  }

  useEffect(() => {
    let active = true;

    async function loadEventDashboard() {
      if (!eventId) {
        setErrorMessage("Evento não encontrado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);

        const [
          eventResponse,
          giftsResult,
          guestsResult,
          financialResult,
          mediaResult,
        ] = await Promise.allSettled([
          apiRequest<EventData | { data?: EventData }>(`/events/${eventId}`),
          apiRequest<GiftDashboardResponse>(
            `/events/${eventId}/gifts/dashboard`,
          ),
          apiRequest<GuestDashboardResponse>(
            `/events/${eventId}/guests/dashboard`,
          ),
          apiRequest<FinancialSummaryResponse>(
            `/events/${eventId}/financial-summary`,
          ),
          apiRequest<SectionMediaResponse>(
            `/events/${eventId}/section-media`,
          ),
        ]);

        if (!active) return;

        if (eventResponse.status === "fulfilled") {
          setEvent(normalizeEventResponse(eventResponse.value));
        } else {
          throw eventResponse.reason;
        }

        if (giftsResult.status === "fulfilled") {
          setGiftDashboard(giftsResult.value.dashboard);
        }

        if (guestsResult.status === "fulfilled") {
          setGuestDashboard(guestsResult.value.dashboard);
        }

        if (financialResult.status === "fulfilled") {
          setFinancialSummary(financialResult.value.financial ?? null);
        }

        if (mediaResult.status === "fulfilled") {
          setSectionMedia(mediaResult.value.media ?? []);
        }
      } catch (error) {
        if (!active) return;
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEventDashboard();

    return () => {
      active = false;
    };
  }, [backendUrl, eventId]);

  const publicUrl = useMemo(() => {
    if (!event?.slug) return null;

    if (typeof window === "undefined") {
      return `/e/${event.slug}`;
    }

    return `${window.location.origin}/e/${event.slug}`;
  }, [event?.slug]);

  const publicPath = event?.slug ? `/e/${event.slug}` : null;

  const coverImage = useMemo(() => {
    return (
      buildAssetUrl(event?.coverImage) ||
      buildAssetUrl(event?.heroImageUrl) ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90"
    );
  }, [event?.coverImage, event?.heroImageUrl]);

  const activeMediaCount = useMemo(() => {
    return sectionMedia.filter((item) => item.isActive !== false).length;
  }, [sectionMedia]);

  const progressSteps = useMemo<SetupStep[]>(() => {
    if (!eventId) return [];

    const hasBasicData = Boolean(event?.name && event?.date && event?.location);
    const hasVisual = Boolean(event?.coverImage || event?.heroImageUrl);
    const hasGifts = Boolean((giftDashboard?.totalGifts ?? 0) > 0);
    const hasGuests = Boolean((guestDashboard?.totalGuests ?? 0) > 0);
    const isPublished = event?.status === "PUBLISHED";

    return [
      {
        number: "01",
        title: "Dados do evento",
        description:
          "Nome, data, local e descrição precisam estar claros para os convidados.",
        status: hasBasicData ? "done" : "warning",
        href: `/dashboard/eventos/${eventId}/editar`,
        cta: hasBasicData ? "Revisar dados" : "Completar dados",
      },
      {
        number: "02",
        title: "Visual do site",
        description:
          "Capa, fotos, cores e organização visual dão a primeira impressão do evento.",
        status: hasVisual || activeMediaCount > 0 ? "done" : "pending",
        href: `/dashboard/eventos/${eventId}/visual`,
        cta: hasVisual || activeMediaCount > 0 ? "Ajustar visual" : "Montar visual",
      },
      {
        number: "03",
        title: "Lista de presentes",
        description:
          "Cadastre presentes, cotas ou contribuições para facilitar a vida dos convidados.",
        status: hasGifts ? "done" : "pending",
        href: `/dashboard/eventos/${eventId}/presentes`,
        cta: hasGifts ? "Gerenciar lista" : "Criar lista",
      },
      {
        number: "04",
        title: "Convidados e RSVP",
        description:
          "Acompanhe convidados, confirmações e recusas em um só lugar.",
        status: hasGuests ? "done" : "pending",
        href: `/dashboard/eventos/${eventId}/convidados`,
        cta: hasGuests ? "Ver convidados" : "Adicionar convidados",
      },
      {
        number: "05",
        title: "Publicação",
        description:
          "Quando tudo estiver pronto, compartilhe o link público do evento.",
        status: isPublished ? "done" : event?.slug ? "warning" : "pending",
        href: publicPath ?? `/dashboard/eventos/${eventId}/visual`,
        cta: isPublished ? "Ver publicado" : "Ver prévia",
      },
    ];
  }, [
    activeMediaCount,
    event?.coverImage,
    event?.date,
    event?.heroImageUrl,
    event?.location,
    event?.name,
    event?.slug,
    event?.status,
    eventId,
    giftDashboard?.totalGifts,
    guestDashboard?.totalGuests,
    publicPath,
  ]);

  async function handleCopyPublicLink() {
    if (!publicUrl) {
      setCopyMessage("Este evento ainda não possui link público.");
      return;
    }

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyMessage("Link copiado com sucesso.");
    } catch {
      setCopyMessage("Não foi possível copiar. Abra o site público e copie pela barra do navegador.");
    }

    window.setTimeout(() => {
      setCopyMessage(null);
    }, 3500);
  }

  const actionGroups = useMemo<ActionGroup[]>(() => {
    if (!eventId) return [];

    return [
      {
        title: "Editar site",
        description:
          "Tudo que muda a aparência e as informações principais do site.",
        items: [
          {
            label: "Montar meu site",
            description:
              "Abra a central de montagem para organizar visual, fotos, presentes, convidados e publicação.",
            href: `/dashboard/eventos/${eventId}/montar-site`,
            highlight: true,
          },
          {
            label: "Editar informações",
            description:
              "Altere nome, data, local, capacidade e descrição do evento.",
            href: `/dashboard/eventos/${eventId}/editar`,
          },
          {
            label: "Ver site público",
            description:
              "Abra a página que os convidados vão acessar.",
            href: publicPath,
            external: Boolean(publicPath),
          },
        ],
      },
      {
        title: "Lista de presentes",
        description:
          "Gerencie presentes, contribuições, Pix, cotas e recebimentos.",
        items: [
          {
            label: "Adicionar presente",
            description:
              "Cadastre um novo presente na lista do evento.",
            href: `/dashboard/eventos/${eventId}/presentes`,
            highlight: true,
          },
          {
            label: "Presentes cadastrados",
            description:
              "Veja, edite e organize todos os presentes da lista.",
            href: `/dashboard/eventos/${eventId}/presentes`,
          },
          {
            label: "Presentes recebidos",
            description:
              "Acompanhe presentes reservados, comprados e contribuições pagas.",
            href: `/dashboard/eventos/${eventId}/presentes`,
          },
          {
            label: "Configurar Pix e pagamentos",
            description:
              "Revise formas de pagamento, Pix e contribuições livres.",
            href: "/dashboard/configuracoes-pagamento",
          },
        ],
      },
      {
        title: "Convidados",
        description:
          "Organize quem será convidado e acompanhe confirmações.",
        items: [
          {
            label: "Gerenciar convidados",
            description:
              "Cadastre convidados e acompanhe a lista do evento.",
            href: `/dashboard/eventos/${eventId}/convidados`,
            highlight: true,
          },
          {
            label: "Confirmações RSVP",
            description:
              "Veja quem confirmou, recusou ou ainda está pendente.",
            href: `/dashboard/eventos/${eventId}/convidados`,
          },
          {
            label: "Compartilhar convite",
            description:
              "Copie o link público para enviar no WhatsApp ou redes sociais.",
            button: true,
            onClick: handleCopyPublicLink,
            disabled: !publicUrl,
          },
        ],
      },
      {
        title: "Publicação",
        description:
          "Ações finais para revisar e compartilhar o evento.",
        items: [
          {
            label: "Copiar link público",
            description:
              "Copie o endereço do site do evento para compartilhar.",
            button: true,
            onClick: handleCopyPublicLink,
            disabled: !publicUrl,
            highlight: true,
          },
          {
            label: "Abrir página pública",
            description:
              "Veja exatamente o que o convidado verá.",
            href: publicPath,
            external: Boolean(publicPath),
          },
          {
            label: "Voltar para meus eventos",
            description:
              "Retorne para a lista geral de eventos cadastrados.",
            href: "/dashboard/eventos",
          },
        ],
      },
    ];
  }, [eventId, publicPath, publicUrl]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fbfaf7] px-4 py-8 text-[#24182f] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[34px] border border-[#eee9e1] bg-white p-7 shadow-[0_24px_70px_rgba(36,24,47,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9a7926]">
              VivaLista
            </p>

            <h1 className="mt-3 text-3xl font-light tracking-[-0.05em]">
              Carregando central do evento...
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#7f738c]">
              Estamos buscando as informações do evento, presentes, convidados e publicação.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="min-h-screen bg-[#fbfaf7] px-4 py-8 text-[#24182f] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-[34px] border border-red-200 bg-white p-7 shadow-[0_24px_70px_rgba(36,24,47,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-600">
              erro ao carregar
            </p>

            <h1 className="mt-3 text-3xl font-light tracking-[-0.05em]">
              Não conseguimos abrir este evento.
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#7f738c]">
              {errorMessage || "Evento não encontrado."}
            </p>

            <Link
              href="/dashboard/eventos"
              className="mt-6 inline-flex rounded-full bg-[#24182f] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Voltar para meus eventos
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#24182f]">
      <style jsx global>{`
        :root {
          --vivalista-deep: #24182f;
          --vivalista-purple: #5f35c6;
          --vivalista-gold: #c79a2b;
          --vivalista-soft: #fbfaf7;
          --vivalista-muted: #7f738c;
        }

        html {
          scroll-behavior: smooth;
        }

        .btn-primary {
          color: #ffffff !important;
          background: #5f35c6;
          box-shadow: 0 18px 38px rgba(95, 53, 198, 0.18);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          background: #4f2daf;
          box-shadow: 0 22px 46px rgba(95, 53, 198, 0.25);
        }

        .btn-dark {
          color: #ffffff !important;
          background: #24182f;
          box-shadow: 0 18px 38px rgba(36, 24, 47, 0.16);
        }

        .btn-dark:hover {
          transform: translateY(-2px);
          background: #1d1328;
          box-shadow: 0 22px 46px rgba(36, 24, 47, 0.23);
        }

        .btn-light {
          color: #24182f !important;
          background: #ffffff;
          box-shadow: 0 14px 34px rgba(36, 24, 47, 0.1);
        }

        .btn-light:hover {
          transform: translateY(-2px);
          background: #fbfaf7;
        }

        .premium-shadow {
          box-shadow: 0 24px 70px rgba(36, 24, 47, 0.09);
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

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[38px] border border-[#eee9e1] bg-white premium-shadow">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusPillClasses(
                    event.status,
                  )}`}
                >
                  {statusLabel(event.status)}
                </span>

                <span className="inline-flex rounded-full border border-[#eee9e1] bg-[#fbfaf7] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7f738c]">
                  Central do evento
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-light leading-[1.06] tracking-[-0.055em] text-[#24182f] sm:text-5xl lg:text-6xl">
                {event.name}
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[#7f738c]">
                {event.description ||
                  "Organize visual, presentes, convidados e publicação em uma central simples e clara."}
              </p>

              <div className="mt-7 grid gap-3 text-sm text-[#5f5568] sm:grid-cols-2">
                <div className="rounded-[22px] border border-[#eee9e1] bg-[#fbfaf7] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a7926]">
                    Data
                  </p>
                  <p className="mt-2 font-semibold">{formatEventDate(event.date)}</p>
                </div>

                <div className="rounded-[22px] border border-[#eee9e1] bg-[#fbfaf7] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a7926]">
                    Local
                  </p>
                  <p className="mt-2 font-semibold">
                    {event.location || "Local não informado"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={`/dashboard/eventos/${event.id}/montar-site`}
                  className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-semibold transition"
                >
                  Montar meu site
                </Link>

                {publicPath ? (
                  <Link
                    href={publicPath}
                    className="btn-light inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-semibold transition"
                  >
                    Ver site público
                  </Link>
                ) : null}

                <button
                  type="button"
                  onClick={handleCopyPublicLink}
                  disabled={!publicUrl}
                  className="inline-flex items-center justify-center rounded-full border border-[#eee9e1] bg-white px-7 py-4 text-sm font-semibold text-[#24182f] transition hover:-translate-y-0.5 hover:bg-[#fbfaf7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Copiar link
                </button>
              </div>

              {copyMessage ? (
                <p className="mt-4 rounded-[18px] border border-[#eadfbd] bg-[#fffaf0] px-4 py-3 text-sm font-semibold text-[#8a6518]">
                  {copyMessage}
                </p>
              ) : null}
            </div>
                        <div className="relative min-h-[420px] bg-[#24182f] lg:min-h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,11,30,0.08)_0%,rgba(20,11,30,0.76)_100%)]" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f2d889]">
                  prévia do evento
                </p>

                <h2 className="mt-3 max-w-xl text-4xl font-light leading-tight tracking-[-0.05em] text-white">
                  {event.name}
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">
                  {formatShortDate(event.date)} •{" "}
                  {event.location || "Local não informado"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            label="Presentes"
            value={giftDashboard?.totalGifts ?? 0}
            description={`${giftDashboard?.availableGifts ?? 0} disponíveis, ${
              giftDashboard?.reservedGifts ?? 0
            } reservados e ${giftDashboard?.purchasedGifts ?? 0} comprados.`}
          />

          <OverviewCard
            label="Convidados"
            value={guestDashboard?.totalGuests ?? 0}
            description={`${guestDashboard?.confirmedGuests ?? 0} confirmados, ${
              guestDashboard?.invitedGuests ?? 0
            } convidados e ${guestDashboard?.declinedGuests ?? 0} recusas.`}
          />

          <OverviewCard
            label="Recebido"
            value={formatMoney(financialSummary?.totalRaised ?? 0)}
            description={`${
              financialSummary?.paidContributionsCount ?? 0
            } pagamento(s) confirmado(s).`}
          />

          <OverviewCard
            label="Mídias"
            value={activeMediaCount}
            description="Fotos e imagens ativas nas seções visuais do evento."
          />
        </section>

        <section className="mt-6 rounded-[38px] border border-[#eee9e1] bg-white p-5 premium-shadow sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9a7926]">
                roteiro de montagem
              </p>

              <h2 className="mt-3 text-3xl font-light leading-tight tracking-[-0.05em] text-[#24182f] sm:text-4xl">
                O que falta para deixar seu evento pronto?
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-[#7f738c] lg:justify-self-end lg:text-right">
              Use este roteiro como guia. A ideia é o cliente saber exatamente
              onde começar, onde continuar e quando o site está pronto para ser
              compartilhado.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {progressSteps.map((step) => (
              <ProgressStepCard key={step.number} step={step} />
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {actionGroups.map((group) => (
            <ActionGroupCard key={group.title} group={group} />
          ))}
        </section>

        <section className="mt-6 rounded-[38px] border border-[#eee9e1] bg-white p-5 premium-shadow sm:p-7 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9a7926]">
                informações rápidas
              </p>

              <h2 className="mt-3 text-3xl font-light leading-tight tracking-[-0.05em] text-[#24182f]">
                Resumo técnico do evento.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#7f738c]">
                Estes dados ajudam a conferir se o evento está correto antes de
                publicar e compartilhar com os convidados.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[24px] border border-[#eee9e1] bg-[#fbfaf7] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a7926]">
                  ID do evento
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-[#24182f]">
                  {event.id}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#eee9e1] bg-[#fbfaf7] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a7926]">
                  Slug público
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-[#24182f]">
                  {event.slug || "Ainda não informado"}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#eee9e1] bg-[#fbfaf7] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a7926]">
                  Capacidade
                </p>
                <p className="mt-2 text-sm font-semibold text-[#24182f]">
                  {event.capacity ? `${event.capacity} pessoas` : "Não informada"}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#eee9e1] bg-[#fbfaf7] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a7926]">
                  Última atualização
                </p>
                <p className="mt-2 text-sm font-semibold text-[#24182f]">
                  {formatShortDate(event.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-3 pb-4 text-center text-sm text-[#7f738c] sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>VivaLista — central premium do evento.</p>

          <div className="flex justify-center gap-5">
            <Link
              href="/dashboard/eventos"
              className="font-semibold text-[#5f5568] transition hover:text-[#24182f]"
            >
              Meus eventos
            </Link>

            <Link
              href="/dashboard"
              className="font-semibold text-[#5f5568] transition hover:text-[#24182f]"
            >
              Dashboard
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}