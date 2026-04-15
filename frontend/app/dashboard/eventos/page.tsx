"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | string;

type EventItem = {
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

function formatDate(date?: string | null): string {
  if (!date) return "Não informada";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
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

  return "Não foi possível carregar os eventos.";
}

function statusLabel(status?: string | null): string {
  if (!status) return "Sem status";
  if (status === "DRAFT") return "Rascunho";
  if (status === "PUBLISHED") return "Publicado";
  if (status === "CANCELLED") return "Cancelado";
  return status;
}

function statusClasses(status?: string | null): string {
  if (status === "PUBLISHED") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "CANCELLED") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
}

function statusCardAccent(status?: string | null): string {
  if (status === "PUBLISHED") {
    return "ring-emerald-100";
  }

  if (status === "CANCELLED") {
    return "ring-red-100";
  }

  return "ring-amber-100";
}

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function sortEvents(events: EventItem[], sortBy: string): EventItem[] {
  const list = [...events];

  if (sortBy === "name") {
    return list.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "pt-BR"));
  }

  if (sortBy === "dateAsc") {
    return list.sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
  }

  if (sortBy === "dateDesc") {
    return list.sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    });
  }

  if (sortBy === "updatedDesc") {
    return list.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  return list.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

function buildPublicUrl(slug?: string | null): string | null {
  if (!slug) return null;
  return `http://localhost:3001/e/${slug}`;
}

function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-neutral-900">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

export default function DashboardEventosPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdDesc");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const token = getAuthToken();
        const backendUrl = getBackendUrl();

        const response = await fetch(`${backendUrl}/events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        if (!response.ok) {
          let apiError: ApiError | null = null;

          try {
            apiError = (await response.json()) as ApiError;
          } catch {
            apiError = null;
          }

          if (response.status === 401) {
            throw new Error(
              "Usuário não autenticado. Faça login novamente para acessar os eventos."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "Você não tem permissão para acessar a lista de eventos."
            );
          }

          throw new Error(
            getErrorMessage(apiError) ||
              `Erro ao buscar eventos. Status ${response.status}.`
          );
        }

        const data = (await response.json()) as EventItem[] | { data?: EventItem[] };
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setEvents(normalized);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const term = normalizeText(search);

    const result = events.filter((event) => {
      const matchesSearch =
        !term ||
        normalizeText(event.name).includes(term) ||
        normalizeText(event.slug).includes(term) ||
        normalizeText(event.location).includes(term) ||
        normalizeText(event.description).includes(term);

      const matchesStatus =
        statusFilter === "all" || (event.status ?? "") === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return sortEvents(result, sortBy);
  }, [events, search, statusFilter, sortBy]);

  const summary = useMemo(() => {
    return {
      total: events.length,
      published: events.filter((event) => event.status === "PUBLISHED").length,
      draft: events.filter((event) => event.status === "DRAFT").length,
      cancelled: events.filter((event) => event.status === "CANCELLED").length,
    };
  }, [events]);

  const latestUpdatedEvent = useMemo(() => {
    if (events.length === 0) return null;

    return [...events].sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    })[0];
  }, [events]);

  async function handleCopyPublicLink(event: EventItem) {
    const publicUrl = buildPublicUrl(event.slug);

    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedId(event.id);
      window.setTimeout(() => setCopiedId(null), 2200);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f8f3ec_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f3ec_100%)] p-6 shadow-sm sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(111,74,166,0.05),transparent_26%)]" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-[#ead79a] bg-[#fbf3d8] px-4 py-2 shadow-[0_10px_24px_rgba(201,162,39,0.10)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a16]">
                  dashboard
                </p>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Eventos
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
                Aqui fica a lista dos eventos da organização para abrir, gerenciar e
                entrar no painel de cada evento com mais clareza visual e leitura executiva.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-4 py-2 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
              >
                Voltar ao dashboard
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <SectionShell
            eyebrow="resumo"
            title="Visão geral dos eventos"
            description="Resumo rápido da organização para facilitar a navegação."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total"
                value={summary.total}
                description="Quantidade total de eventos cadastrados."
              />
              <SummaryCard
                label="Publicados"
                value={summary.published}
                description="Eventos já liberados para a experiência pública."
              />
              <SummaryCard
                label="Rascunhos"
                value={summary.draft}
                description="Eventos ainda em preparação ou configuração."
              />
              <SummaryCard
                label="Cancelados"
                value={summary.cancelled}
                description="Eventos fora da operação ativa."
              />
            </div>

            {latestUpdatedEvent ? (
              <div className="mt-5 rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                  Última atualização
                </p>
                <p className="mt-2 text-sm font-semibold text-neutral-900">
                  {latestUpdatedEvent.name}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  Atualizado em {formatDate(latestUpdatedEvent.updatedAt)}
                </p>
              </div>
            ) : null}
          </SectionShell>
        </div>

        <div className="mt-6">
          <SectionShell
            eyebrow="busca e filtros"
            title="Encontrar evento"
            description="Busque por nome, slug, local ou descrição e refine a lista."
          >
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label
                  htmlFor="search-events"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]"
                >
                  Buscar evento
                </label>
                <input
                  id="search-events"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Digite nome, slug, local ou descrição"
                  className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                />
              </div>

              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]"
                >
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                >
                  <option value="all">Todos</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="DRAFT">Rascunho</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sort-by"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]"
                >
                  Ordenar
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                >
                  <option value="createdDesc">Mais recentes</option>
                  <option value="updatedDesc">Última atualização</option>
                  <option value="name">Nome A–Z</option>
                  <option value="dateAsc">Data mais próxima</option>
                  <option value="dateDesc">Data mais distante</option>
                </select>
              </div>
            </div>
          </SectionShell>
        </div>

        <div className="mt-6">
          {loading ? (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] border border-[#e8dfd2] bg-white shadow-sm"
                >
                  <div className="h-44 animate-pulse bg-neutral-200" />
                  <div className="p-6">
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-4 h-7 w-2/3 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-4 h-4 w-full animate-pulse rounded bg-neutral-200" />
                    <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-6 h-10 w-36 animate-pulse rounded bg-neutral-200" />
                  </div>
                </div>
              ))}
            </section>
          ) : errorMessage ? (
            <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-red-800">
                Erro ao carregar eventos
              </h2>
              <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
            </section>
          ) : filteredEvents.length === 0 ? (
            <section className="rounded-[28px] border border-[#e8dfd2] bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-900">
                Nenhum evento encontrado
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Ajuste a busca, filtros ou crie eventos no backend para eles aparecerem aqui.
              </p>
            </section>
          ) : (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => {
                const publicUrl = buildPublicUrl(event.slug);
                const coverImageUrl = buildAssetUrl(event.coverImage);

                return (
                  <article
                    key={event.id}
                    className={`overflow-hidden rounded-[28px] border border-[#e8dfd2] bg-white shadow-sm ring-1 transition hover:-translate-y-1 hover:shadow-md ${statusCardAccent(
                      event.status
                    )}`}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-[#f3ece3]">
                      {coverImageUrl ? (
                        <img
                          src={coverImageUrl}
                          alt={event.name || "Capa do evento"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#8a7d74]">
                          Sem capa enviada
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 flex items-start gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${statusClasses(
                            event.status
                          )}`}
                        >
                          {statusLabel(event.status)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                          {event.name || "Evento sem nome"}
                        </h2>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                            Data
                          </p>
                          <p className="mt-2 text-sm font-medium text-neutral-900">
                            {formatDate(event.date)}
                          </p>
                        </div>

                        <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                            Capacidade
                          </p>
                          <p className="mt-2 text-sm font-medium text-neutral-900">
                            {event.capacity ?? "Não informada"}
                          </p>
                        </div>

                        <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4 sm:col-span-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                            Local
                          </p>
                          <p className="mt-2 text-sm font-medium text-neutral-900">
                            {event.location || "Não informado"}
                          </p>
                        </div>

                        <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4 sm:col-span-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                            Slug público
                          </p>
                          <p className="mt-2 break-all text-sm font-medium text-neutral-900">
                            {event.slug || "Não informado"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600">
                        {event.description || "Sem descrição cadastrada."}
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <Link
                          href={`/dashboard/eventos/${event.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7a5911]"
                        >
                          Abrir painel
                        </Link>

                        {event.slug ? (
                          <Link
                            href={`/e/${event.slug}`}
                            target="_blank"
                            className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-4 py-2 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                          >
                            Ver página pública
                          </Link>
                        ) : null}

                        <Link
                          href={`/dashboard/eventos/${event.id}/visual`}
                          className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                        >
                          Abrir visual
                        </Link>

                        <Link
                          href={`/dashboard/eventos/${event.id}/presentes`}
                          className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                        >
                          Abrir presentes
                        </Link>

                        <Link
                          href={`/dashboard/eventos/${event.id}/convidados`}
                          className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                        >
                          Abrir convidados
                        </Link>

                        {publicUrl ? (
                          <button
                            type="button"
                            onClick={() => handleCopyPublicLink(event)}
                            className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                          >
                            {copiedId === event.id ? "Link copiado" : "Copiar link público"}
                          </button>
                        ) : (
                          <div className="inline-flex items-center justify-center rounded-xl border border-dashed border-[#d7c9b9] bg-[#f8f3ec] px-4 py-2 text-sm text-[#8a7d74]">
                            Sem link público
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}