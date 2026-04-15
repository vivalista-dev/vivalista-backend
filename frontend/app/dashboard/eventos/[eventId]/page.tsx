"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

function getBackendUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3000";

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
    raw.startsWith("blob:")
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
  if (!date) return "Não informada";

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

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function statusCardClasses(status?: string | null): string {
  if (status === "PUBLISHED") {
    return "border-emerald-200 bg-emerald-50";
  }

  if (status === "CANCELLED") {
    return "border-red-200 bg-red-50";
  }

  return "border-amber-200 bg-amber-50";
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
    <div className="rounded-[24px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-neutral-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

function SummaryCard({
  eyebrow,
  title,
  primaryValue,
  lines,
}: {
  eyebrow: string;
  title: string;
  primaryValue: string;
  lines: string[];
}) {
  return (
    <article className="rounded-[28px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h3>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900">
        {primaryValue}
      </p>
      <div className="mt-4 space-y-2">
        {lines.map((line) => (
          <div
            key={line}
            className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] px-4 py-3 text-sm text-neutral-700"
          >
            {line}
          </div>
        ))}
      </div>
    </article>
  );
}

function ActionCard({
  href,
  eyebrow,
  title,
  description,
  highlight = false,
  targetBlank = false,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  highlight?: boolean;
  targetBlank?: boolean;
}) {
  return (
    <Link
      href={href}
      target={targetBlank ? "_blank" : undefined}
      className={`group rounded-[22px] border p-5 transition hover:shadow-sm ${
        highlight
          ? "border-[#c9a227] bg-[linear-gradient(135deg,#c9a227_0%,#8f6a16_100%)] text-white hover:shadow-[0_18px_40px_rgba(201,162,39,0.22)]"
          : "border-[#e8dfd2] bg-[#f8f3ec] text-neutral-900 hover:bg-[#fcfaf7]"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          highlight ? "text-[#fff3cf]" : "text-[#8a7d74]"
        }`}
      >
        {eyebrow}
      </p>
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <p
        className={`mt-2 text-sm leading-6 ${
          highlight ? "text-[#fff3cf]" : "text-neutral-600"
        }`}
      >
        {description}
      </p>
      <span
        className={`mt-4 inline-flex text-sm font-medium ${
          highlight ? "text-white" : "text-[#8f6a16]"
        }`}
      >
        Abrir →
      </span>
    </Link>
  );
}

export default function DashboardEventPage() {
  const params = useParams<{ eventId: string }>();

  const eventId = useMemo(() => {
    const raw = params?.eventId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [event, setEvent] = useState<EventData | null>(null);
  const [giftsDashboard, setGiftsDashboard] = useState<GiftDashboardResponse["dashboard"]>({
    totalGifts: 0,
    activeGifts: 0,
    reservedGifts: 0,
    purchasedGifts: 0,
    availableGifts: 0,
  });
  const [guestsDashboard, setGuestsDashboard] = useState<GuestDashboardResponse["dashboard"]>({
    totalGuests: 0,
    confirmedGuests: 0,
    invitedGuests: 0,
    declinedGuests: 0,
  });
  const [financialSummary, setFinancialSummary] = useState<NonNullable<FinancialSummaryResponse["financial"]>>({
    totalRaised: 0,
    paidContributionsCount: 0,
    pendingContributionsCount: 0,
    averageContribution: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadEventDashboard() {
      if (!eventId) {
        setErrorMessage("ID do evento não encontrado na rota.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);

        const token = getAuthToken();
        const backendUrl = getBackendUrl();

        const eventResponse = await fetch(`${backendUrl}/events/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        if (!eventResponse.ok) {
          let apiError: ApiError | null = null;

          try {
            apiError = (await eventResponse.json()) as ApiError;
          } catch {
            apiError = null;
          }

          if (eventResponse.status === 401) {
            throw new Error(
              "Usuário não autenticado. Faça login novamente para acessar este evento."
            );
          }

          if (eventResponse.status === 403) {
            throw new Error("Você não tem permissão para acessar este evento.");
          }

          if (eventResponse.status === 404) {
            throw new Error("Evento não encontrado no backend para este ID.");
          }

          throw new Error(
            getErrorMessage(apiError) ||
              `Erro ao buscar evento. Status ${eventResponse.status}.`
          );
        }

        const eventData = (await eventResponse.json()) as EventData | { data?: EventData };
        const normalizedEvent =
          "data" in eventData && eventData.data ? eventData.data : (eventData as EventData);

        setEvent(normalizedEvent);

        const [giftsResponse, guestsResponse] = await Promise.all([
          fetch(`${backendUrl}/events/${eventId}/gifts/dashboard`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          }),
          fetch(`${backendUrl}/events/${eventId}/guests/dashboard`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          }),
        ]);

        if (giftsResponse.ok) {
          const giftsData = (await giftsResponse.json()) as GiftDashboardResponse;
          setGiftsDashboard(giftsData.dashboard);
        }

        if (guestsResponse.ok) {
          const guestsData = (await guestsResponse.json()) as GuestDashboardResponse;
          setGuestsDashboard(guestsData.dashboard);
        }

        if (normalizedEvent.slug) {
          const financialResponse = await fetch(
            `${backendUrl}/events/public/${normalizedEvent.slug}/financial-summary`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          if (financialResponse.ok) {
            const financialData = (await financialResponse.json()) as FinancialSummaryResponse;
            setFinancialSummary(
              financialData.financial ?? {
                totalRaised: 0,
                paidContributionsCount: 0,
                pendingContributionsCount: 0,
                averageContribution: 0,
              }
            );
          } else {
            setFinancialSummary({
              totalRaised: 0,
              paidContributionsCount: 0,
              pendingContributionsCount: 0,
              averageContribution: 0,
            });
          }
        } else {
          setFinancialSummary({
            totalRaised: 0,
            paidContributionsCount: 0,
            pendingContributionsCount: 0,
            averageContribution: 0,
          });
        }
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadEventDashboard();
  }, [eventId]);

  const publicUrl = event?.slug ? `/e/${event.slug}` : null;
  const editUrl = event?.id ? `/dashboard/eventos/${event.id}/editar` : null;
  const visualUrl = event?.id ? `/dashboard/eventos/${event.id}/visual` : null;
  const giftsUrl = event?.id ? `/dashboard/eventos/${event.id}/presentes` : null;
  const guestsUrl = event?.id ? `/dashboard/eventos/${event.id}/convidados` : null;
  const coverImageUrl = buildAssetUrl(event?.coverImage);

  async function handleCopyPublicLink() {
    if (!publicUrl || typeof window === "undefined") return;

    try {
      const fullUrl = `${window.location.origin}${publicUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopyMessage("Link público copiado com sucesso.");
      setTimeout(() => setCopyMessage(null), 2500);
    } catch {
      setCopyMessage("Não foi possível copiar o link público.");
      setTimeout(() => setCopyMessage(null), 2500);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f8f3ec_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <section className="space-y-6">
            <div className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
              <div className="h-4 w-36 animate-pulse rounded bg-neutral-200" />
              <div className="mt-4 h-10 w-1/2 animate-pulse rounded bg-neutral-200" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="h-10 w-36 animate-pulse rounded-xl bg-neutral-200" />
                <div className="h-10 w-40 animate-pulse rounded-xl bg-neutral-200" />
                <div className="h-10 w-32 animate-pulse rounded-xl bg-neutral-200" />
                <div className="h-10 w-36 animate-pulse rounded-xl bg-neutral-200" />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-[#e8dfd2] bg-white p-5 shadow-sm"
                >
                  <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-3 h-7 w-2/3 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-neutral-200" />
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4"
                    >
                      <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                      <div className="mt-3 h-5 w-full animate-pulse rounded bg-neutral-200" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                  <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-4 h-56 animate-pulse rounded-[24px] bg-neutral-200" />
                </div>
              </div>
            </div>
          </section>
        ) : errorMessage ? (
          <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-800">
              Erro ao abrir o evento
            </h2>
            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard/eventos"
                className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                Voltar para eventos
              </Link>
            </div>
          </section>
        ) : !event ? (
          <section className="rounded-[28px] border border-[#e8dfd2] bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">
              Evento não encontrado
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Não foi possível carregar os dados deste evento.
            </p>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="relative overflow-hidden rounded-[32px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f3ec_100%)] p-6 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(111,74,166,0.05),transparent_26%)]" />
              <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex rounded-full border border-[#ead79a] bg-[#fbf3d8] px-4 py-2 shadow-[0_10px_24px_rgba(201,162,39,0.10)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a16]">
                      dashboard do evento
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      {event.name || "Evento sem nome"}
                    </h1>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClasses(
                        event.status
                      )}`}
                    >
                      {statusLabel(event.status)}
                    </span>
                  </div>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
                    {event.description ||
                      "Página principal de configuração e acompanhamento do evento."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/dashboard/eventos"
                      className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-4 py-2 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                    >
                      Voltar para eventos
                    </Link>

                    {editUrl ? (
                      <Link
                        href={editUrl}
                        className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Editar evento
                      </Link>
                    ) : null}

                    {visualUrl ? (
                      <Link
                        href={visualUrl}
                        className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Configurações visuais
                      </Link>
                    ) : null}

                    {publicUrl ? (
                      <>
                        <Link
                          href={publicUrl}
                          target="_blank"
                          className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7a5911]"
                        >
                          Ver página pública
                        </Link>

                        <button
                          type="button"
                          onClick={handleCopyPublicLink}
                          className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                        >
                          Copiar link público
                        </button>
                      </>
                    ) : null}
                  </div>

                  {copyMessage ? (
                    <p className="mt-3 text-sm font-medium text-[#8f6a16]">
                      {copyMessage}
                    </p>
                  ) : null}
                </div>

                <div className="grid min-w-full gap-3 sm:grid-cols-2 xl:min-w-[360px] xl:max-w-[420px]">
                  <div className="rounded-[22px] border border-[#e8dfd2] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Slug público
                    </p>
                    <p className="mt-2 break-all text-sm font-medium text-neutral-900">
                      {event.slug || "Não informado"}
                    </p>
                  </div>

                  <div
                    className={`rounded-[22px] border p-4 ${statusCardClasses(
                      event.status
                    )}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-semibold text-neutral-900">
                      {statusLabel(event.status)}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#e8dfd2] bg-white p-4 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Leitura rápida
                    </p>
                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      Evento central pronto para gestão, visual público e operação.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Use este painel como ponto principal para navegar entre edição, visual, presentes e convidados.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-4">
              <OverviewCard
                label="Data do evento"
                value={formatEventDate(event.date)}
                description="Data oficial cadastrada para o evento."
              />
              <OverviewCard
                label="Local"
                value={event.location || "Não informado"}
                description="Endereço ou local principal do evento."
              />
              <OverviewCard
                label="Capacidade"
                value={event.capacity ?? "Não informada"}
                description="Quantidade máxima de convidados prevista."
              />
              <OverviewCard
                label="Event ID"
                value={event.id}
                description="Identificador técnico do evento no sistema."
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">
                <article className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                      Visão executiva
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                      Resumo rápido do evento
                    </h2>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-3">
                    <SummaryCard
                      eyebrow="presentes"
                      title="Lista"
                      primaryValue={String(giftsDashboard.totalGifts)}
                      lines={[
                        `Ativos: ${giftsDashboard.activeGifts}`,
                        `Disponíveis: ${giftsDashboard.availableGifts}`,
                        `Reservados: ${giftsDashboard.reservedGifts}`,
                        `Comprados: ${giftsDashboard.purchasedGifts}`,
                      ]}
                    />

                    <SummaryCard
                      eyebrow="convidados"
                      title="RSVP"
                      primaryValue={String(guestsDashboard.totalGuests)}
                      lines={[
                        `Confirmados: ${guestsDashboard.confirmedGuests}`,
                        `Convidados: ${guestsDashboard.invitedGuests}`,
                        `Recusados: ${guestsDashboard.declinedGuests}`,
                      ]}
                    />

                    <SummaryCard
                      eyebrow="pagamentos"
                      title="Recebimentos"
                      primaryValue={formatMoney(financialSummary.totalRaised)}
                      lines={[
                        `Pagos: ${financialSummary.paidContributionsCount}`,
                        `Pendentes: ${financialSummary.pendingContributionsCount}`,
                        `Ticket médio: ${formatMoney(financialSummary.averageContribution)}`,
                      ]}
                    />
                  </div>
                </article>

                <article className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                      Gestão do evento
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                      Atalhos rápidos
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {editUrl ? (
                      <ActionCard
                        href={editUrl}
                        eyebrow="edição"
                        title="Editar dados do evento"
                        description="Altere nome, slug, descrição, data, local, capacidade e status."
                      />
                    ) : null}

                    {visualUrl ? (
                      <ActionCard
                        href={visualUrl}
                        eyebrow="visual"
                        title="Configurações visuais"
                        description="Ajuste título público, mensagem inicial, aparência e seções do site."
                      />
                    ) : null}

                    {giftsUrl ? (
                      <ActionCard
                        href={giftsUrl}
                        eyebrow="presentes"
                        title="Gerenciar presentes"
                        description="Cadastre, envie imagens e organize a lista de presentes do evento."
                      />
                    ) : null}

                    {guestsUrl ? (
                      <ActionCard
                        href={guestsUrl}
                        eyebrow="convidados"
                        title="Gerenciar convidados"
                        description="Acompanhe confirmações e organize a lista de convidados."
                      />
                    ) : null}

                    {publicUrl ? (
                      <ActionCard
                        href={publicUrl}
                        eyebrow="site público"
                        title="Abrir página pública"
                        description="Visualize a experiência real do convidado com a página do evento."
                        highlight
                        targetBlank
                      />
                    ) : null}
                  </div>
                </article>

                <article className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                      Dados principais
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                      Informações do evento
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Nome do evento
                      </p>
                      <p className="mt-2 text-sm text-neutral-900">
                        {event.name || "Não informado"}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Slug público
                      </p>
                      <p className="mt-2 break-all text-sm text-neutral-900">
                        {event.slug || "Não informado"}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Data do evento
                      </p>
                      <p className="mt-2 text-sm text-neutral-900">
                        {formatEventDate(event.date)}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Capacidade
                      </p>
                      <p className="mt-2 text-sm text-neutral-900">
                        {event.capacity ?? "Não informada"}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4 sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Local
                      </p>
                      <p className="mt-2 text-sm text-neutral-900">
                        {event.location || "Não informado"}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4 sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Descrição
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-900">
                        {event.description || "Sem descrição cadastrada."}
                      </p>
                    </div>
                  </div>
                </article>
              </div>

              <aside className="space-y-6">
                <article className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                    Preview da capa
                  </p>

                  <div className="mt-4 overflow-hidden rounded-[24px] border border-[#e8dfd2] bg-[#f3ece3]">
                    {coverImageUrl ? (
                      <img
                        src={coverImageUrl}
                        alt={event.name || "Capa do evento"}
                        className="h-72 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center px-6 text-center text-sm text-[#8a7d74]">
                        O evento ainda não possui capa enviada.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Página pública
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-neutral-900">
                        {publicUrl || "Sem slug público"}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Criado em
                      </p>
                      <p className="mt-2 text-sm text-neutral-900">
                        {formatShortDate(event.createdAt)}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Atualizado em
                      </p>
                      <p className="mt-2 text-sm text-neutral-900">
                        {formatShortDate(event.updatedAt)}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                    Links rápidos
                  </p>

                  <div className="mt-4 space-y-3">
                    <Link
                      href="/dashboard/eventos"
                      className="block rounded-[20px] border border-[#ddd1f2] bg-[#efe7fb] px-4 py-3 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                    >
                      Voltar para lista de eventos
                    </Link>

                    {editUrl ? (
                      <Link
                        href={editUrl}
                        className="block rounded-[20px] border border-[#e8dfd2] bg-white px-4 py-3 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Editar evento
                      </Link>
                    ) : null}

                    {visualUrl ? (
                      <Link
                        href={visualUrl}
                        className="block rounded-[20px] border border-[#e8dfd2] bg-white px-4 py-3 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Configurações visuais
                      </Link>
                    ) : null}

                    {giftsUrl ? (
                      <Link
                        href={giftsUrl}
                        className="block rounded-[20px] border border-[#e8dfd2] bg-white px-4 py-3 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Abrir presentes
                      </Link>
                    ) : null}

                    {guestsUrl ? (
                      <Link
                        href={guestsUrl}
                        className="block rounded-[20px] border border-[#e8dfd2] bg-white px-4 py-3 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Abrir convidados
                      </Link>
                    ) : null}

                    {publicUrl ? (
                      <Link
                        href={publicUrl}
                        target="_blank"
                        className="block rounded-[20px] border border-[#e8dfd2] bg-white px-4 py-3 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Ver página pública
                      </Link>
                    ) : null}
                  </div>
                </article>

                <article className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                    Resumo técnico
                  </p>

                  <div className="mt-4 space-y-4 text-sm text-neutral-700">
                    <div>
                      <p className="font-semibold text-neutral-900">Status bruto</p>
                      <p>{event.status || "Não informado"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Slug</p>
                      <p className="break-all">{event.slug || "Não informado"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Cover image</p>
                      <p className="break-all">{event.coverImage || "Não informado"}</p>
                    </div>
                  </div>
                </article>
              </aside>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}