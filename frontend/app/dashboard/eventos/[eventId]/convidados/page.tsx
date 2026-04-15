"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | string;
type GuestStatus = "INVITED" | "CONFIRMED" | "DECLINED" | string;

type EventItem = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  date: string;
  location: string;
  capacity: number | null;
  status: string;
  createdAt: string;
  updatedAt?: string | null;
};

type GuestItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: GuestStatus;
  rsvpCode: string | null;
  createdAt: string;
};

type GuestDashboardResponse = {
  eventId: string;
  dashboard: {
    totalGuests: number;
    confirmedGuests: number;
    declinedGuests: number;
    invitedGuests: number;
  };
};

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type GuestFormData = {
  name: string;
  email: string;
  phone: string;
  status: GuestStatus;
};

const EMPTY_FORM: GuestFormData = {
  name: "",
  email: "",
  phone: "",
  status: "INVITED",
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

  return "Não foi possível carregar os dados.";
}

function formatDateTime(value?: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatEventDate(value?: string | null): string {
  if (!value) return "Não informado";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
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

function guestStatusLabel(status?: GuestStatus): string {
  if (status === "CONFIRMED") return "Confirmado";
  if (status === "DECLINED") return "Recusou";
  return "Convidado";
}

function guestStatusPillClasses(status?: GuestStatus): string {
  if (status === "CONFIRMED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "DECLINED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function guestStatusAccent(status?: GuestStatus): string {
  if (status === "CONFIRMED") {
    return "ring-emerald-100";
  }

  if (status === "DECLINED") {
    return "ring-red-100";
  }

  return "ring-amber-100";
}

function buildFormFromGuest(guest: GuestItem): GuestFormData {
  return {
    name: guest.name ?? "",
    email: guest.email ?? "",
    phone: guest.phone ?? "",
    status: guest.status ?? "INVITED",
  };
}

function buildGuestPayload(formData: GuestFormData) {
  return {
    name: formData.name.trim(),
    email: formData.email.trim() || null,
    phone: formData.phone.trim() || null,
    status: formData.status,
  };
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
      <p className="mt-3 text-3xl font-semibold text-neutral-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

export default function EventGuestsPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const [summary, setSummary] = useState({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdDesc");

  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GuestFormData>(EMPTY_FORM);

  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadPageData() {
    if (!eventId) {
      setErrorMessage("ID do evento não encontrado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const [eventResponse, guestsResponse, dashboardResponse] = await Promise.all([
        fetch(`${backendUrl}/events/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        }),
        fetch(`${backendUrl}/events/${eventId}/guests`, {
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

      if (!eventResponse.ok) {
        let apiError: ApiError | null = null;

        try {
          apiError = (await eventResponse.json()) as ApiError;
        } catch {
          apiError = null;
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao buscar evento. Status ${eventResponse.status}.`
        );
      }

      if (!guestsResponse.ok) {
        let apiError: ApiError | null = null;

        try {
          apiError = (await guestsResponse.json()) as ApiError;
        } catch {
          apiError = null;
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao buscar convidados. Status ${guestsResponse.status}.`
        );
      }

      if (!dashboardResponse.ok) {
        let apiError: ApiError | null = null;

        try {
          apiError = (await dashboardResponse.json()) as ApiError;
        } catch {
          apiError = null;
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao buscar resumo de convidados. Status ${dashboardResponse.status}.`
        );
      }

      const eventData = (await eventResponse.json()) as EventItem;
      const guestsData = (await guestsResponse.json()) as GuestItem[];
      const dashboardData = (await dashboardResponse.json()) as GuestDashboardResponse;

      setEvent(eventData);
      setGuests(Array.isArray(guestsData) ? guestsData : []);
      setSummary({
        total: dashboardData.dashboard.totalGuests,
        confirmed: dashboardData.dashboard.confirmedGuests,
        declined: dashboardData.dashboard.declinedGuests,
        pending: dashboardData.dashboard.invitedGuests,
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, [eventId]);

  function resetForm() {
    setEditingGuestId(null);
    setFormData(EMPTY_FORM);
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEditGuest(guest: GuestItem) {
    setEditingGuestId(guest.id);
    setFormData(buildFormFromGuest(guest));
    setSavedMessage(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleCreateOrUpdateGuest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!eventId) return;

    try {
      if (!formData.name.trim()) {
        setErrorMessage("Nome do convidado é obrigatório.");
        return;
      }

      setSaving(true);
      setSavedMessage(null);
      setErrorMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();
      const payload = buildGuestPayload(formData);

      const isEditing = Boolean(editingGuestId);
      const response = await fetch(
        isEditing
          ? `${backendUrl}/events/${eventId}/guests/${editingGuestId}`
          : `${backendUrl}/events/${eventId}/guests`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let apiError: ApiError | null = null;

        try {
          apiError = (await response.json()) as ApiError;
        } catch {
          apiError = null;
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao salvar convidado. Status ${response.status}.`
        );
      }

      setSavedMessage(
        isEditing
          ? "Convidado atualizado com sucesso."
          : "Convidado criado com sucesso."
      );
      resetForm();
      await loadPageData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGuest(guest: GuestItem) {
    if (!eventId) return;

    const confirmed = window.confirm(
      `Deseja realmente excluir o convidado "${guest.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(guest.id);
      setSavedMessage(null);
      setErrorMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(`${backendUrl}/events/${eventId}/guests/${guest.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        let apiError: ApiError | null = null;

        try {
          apiError = (await response.json()) as ApiError;
        } catch {
          apiError = null;
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao excluir convidado. Status ${response.status}.`
        );
      }

      setSavedMessage("Convidado excluído com sucesso.");

      if (editingGuestId === guest.id) {
        resetForm();
      }

      await loadPageData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleQuickStatusUpdate(guest: GuestItem, nextStatus: GuestStatus) {
    if (!eventId) return;

    try {
      setStatusUpdatingId(guest.id);
      setSavedMessage(null);
      setErrorMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(`${backendUrl}/events/${eventId}/guests/${guest.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          status: nextStatus,
        }),
      });

      if (!response.ok) {
        let apiError: ApiError | null = null;

        try {
          apiError = (await response.json()) as ApiError;
        } catch {
          apiError = null;
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao atualizar status do convidado. Status ${response.status}.`
        );
      }

      setSavedMessage("Status do convidado atualizado com sucesso.");
      await loadPageData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setStatusUpdatingId(null);
    }
  }

  const filteredGuests = useMemo(() => {
    const term = normalizeText(search);

    const result = guests.filter((guest) => {
      const matchesSearch =
        !term ||
        normalizeText(guest.name).includes(term) ||
        normalizeText(guest.email).includes(term) ||
        normalizeText(guest.phone).includes(term) ||
        normalizeText(guest.rsvpCode).includes(term);

      const matchesStatus =
        statusFilter === "all" || guest.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (sortBy === "name") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    }

    if (sortBy === "status") {
      return [...result].sort((a, b) =>
        (a.status ?? "").localeCompare(b.status ?? "", "pt-BR")
      );
    }

    return [...result].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  }, [guests, search, statusFilter, sortBy]);

  const publicPath = event?.slug ? `/e/${event.slug}` : null;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f8f3ec_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <section className="space-y-6">
            <div className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
              <div className="h-4 w-36 animate-pulse rounded bg-neutral-200" />
              <div className="mt-4 h-10 w-1/2 animate-pulse rounded bg-neutral-200" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-[#e8dfd2] bg-white p-6 shadow-sm"
                >
                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-4 h-10 w-16 animate-pulse rounded bg-neutral-200" />
                </div>
              ))}
            </div>
          </section>
        ) : errorMessage && !event ? (
          <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-800">
              Erro ao abrir convidados
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
        ) : (
          <section className="space-y-6">
            <div className="relative overflow-hidden rounded-[32px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f3ec_100%)] p-6 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(111,74,166,0.05),transparent_26%)]" />
              <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex rounded-full border border-[#ead79a] bg-[#fbf3d8] px-4 py-2 shadow-[0_10px_24px_rgba(201,162,39,0.10)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a16]">
                      dashboard de convidados
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      Gerenciar convidados
                    </h1>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClasses(
                        event?.status
                      )}`}
                    >
                      {statusLabel(event?.status)}
                    </span>
                  </div>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                    Cadastre, edite e acompanhe os convidados e o RSVP do evento em tempo real.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {eventId ? (
                      <Link
                        href={`/dashboard/eventos/${eventId}`}
                        className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-4 py-2 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                      >
                        Voltar ao painel
                      </Link>
                    ) : null}

                    {eventId ? (
                      <Link
                        href={`/dashboard/eventos/${eventId}/presentes`}
                        className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Abrir presentes
                      </Link>
                    ) : null}

                    {publicPath ? (
                      <Link
                        href={publicPath}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7a5911]"
                      >
                        Ver página pública
                      </Link>
                    ) : null}

                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                    >
                      Novo convidado
                    </button>
                  </div>

                  {savedMessage ? (
                    <p className="mt-3 text-sm font-medium text-[#8f6a16]">
                      {savedMessage}
                    </p>
                  ) : null}

                  {errorMessage ? (
                    <p className="mt-3 text-sm font-medium text-red-700">
                      {errorMessage}
                    </p>
                  ) : null}
                </div>

                <div className="grid min-w-full gap-3 sm:grid-cols-2 xl:min-w-[360px] xl:max-w-[420px]">
                  <div className="rounded-[22px] border border-[#e8dfd2] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Evento
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-900">
                      {event?.name || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#e8dfd2] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Data do evento
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-900">
                      {formatEventDate(event?.date)}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#e8dfd2] bg-white p-4 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Leitura rápida
                    </p>
                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      {summary.confirmed} confirmados de {summary.total} convidados
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Acompanhe confirmação, recusa e pendência de RSVP em um único painel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <SectionShell
              eyebrow="resumo"
              title="Dashboard de convidados"
              description="Acompanhe o estado geral do RSVP e da lista de convidados."
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                  label="Total"
                  value={summary.total}
                  description="Quantidade total de convidados cadastrados."
                />
                <SummaryCard
                  label="Confirmados"
                  value={summary.confirmed}
                  description="Convidados que já responderam positivamente."
                />
                <SummaryCard
                  label="Recusaram"
                  value={summary.declined}
                  description="Convidados que informaram ausência."
                />
                <SummaryCard
                  label="Pendentes"
                  value={summary.pending}
                  description="Convidados ainda aguardando resposta de RSVP."
                />
              </div>
            </SectionShell>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <SectionShell
                  eyebrow={editingGuestId ? "edição" : "cadastro"}
                  title={editingGuestId ? "Editar convidado" : "Novo convidado"}
                  description="Cadastre ou edite convidados e defina o status inicial do RSVP."
                >
                  <form onSubmit={handleCreateOrUpdateGuest} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-neutral-800"
                        >
                          Nome do convidado
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ex: Maria Souza"
                          className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-neutral-800"
                        >
                          E-mail
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="text"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Ex: maria@email.com"
                          className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-medium text-neutral-800"
                        >
                          Telefone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="text"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Ex: 11999999999"
                          className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="status"
                          className="mb-2 block text-sm font-medium text-neutral-800"
                        >
                          Status do RSVP
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                        >
                          <option value="INVITED">Convidado</option>
                          <option value="CONFIRMED">Confirmado</option>
                          <option value="DECLINED">Recusou</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7a5911] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving
                          ? "Salvando..."
                          : editingGuestId
                            ? "Salvar alterações"
                            : "Criar convidado"}
                      </button>

                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-5 py-3 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                      >
                        Limpar formulário
                      </button>
                    </div>
                  </form>
                </SectionShell>

                <SectionShell
                  eyebrow="lista"
                  title="Lista de convidados"
                  description="Busque, filtre, edite e acompanhe rapidamente o status de cada convidado."
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por nome, e-mail, telefone ou código RSVP"
                      className="md:col-span-2 w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                    />

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                    >
                      <option value="all">Todos os status</option>
                      <option value="INVITED">Convidado</option>
                      <option value="CONFIRMED">Confirmado</option>
                      <option value="DECLINED">Recusou</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                    >
                      <option value="createdDesc">Mais recentes</option>
                      <option value="name">Nome A–Z</option>
                      <option value="status">Status</option>
                    </select>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-neutral-600">
                      {filteredGuests.length} convidado
                      {filteredGuests.length === 1 ? "" : "s"} encontrado
                      {filteredGuests.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-5">
                    {filteredGuests.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#d7c9b9] bg-[#f8f3ec] p-8 text-center text-sm text-neutral-600">
                        Nenhum convidado encontrado com os filtros atuais.
                      </div>
                    ) : (
                      filteredGuests.map((guest) => (
                        <article
                          key={guest.id}
                          className={`rounded-[28px] border border-[#e8dfd2] bg-white p-5 shadow-sm ring-1 ${guestStatusAccent(
                            guest.status
                          )}`}
                        >
                          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-medium ${guestStatusPillClasses(
                                    guest.status
                                  )}`}
                                >
                                  {guestStatusLabel(guest.status)}
                                </span>
                              </div>

                              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
                                {guest.name}
                              </h3>

                              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                    E-mail
                                  </p>
                                  <p className="mt-2 break-all text-sm font-semibold text-neutral-900">
                                    {guest.email || "-"}
                                  </p>
                                </div>

                                <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                    Telefone
                                  </p>
                                  <p className="mt-2 text-sm font-semibold text-neutral-900">
                                    {guest.phone || "-"}
                                  </p>
                                </div>

                                <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                    Código RSVP
                                  </p>
                                  <p className="mt-2 break-all text-sm font-semibold text-neutral-900">
                                    {guest.rsvpCode || "-"}
                                  </p>
                                </div>

                                <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                    Criado em
                                  </p>
                                  <p className="mt-2 text-sm font-semibold text-neutral-900">
                                    {formatDateTime(guest.createdAt)}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 flex flex-wrap gap-3">
                                {guest.status !== "CONFIRMED" ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickStatusUpdate(guest, "CONFIRMED")
                                    }
                                    disabled={statusUpdatingId === guest.id}
                                    className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {statusUpdatingId === guest.id
                                      ? "Atualizando..."
                                      : "Marcar confirmado"}
                                  </button>
                                ) : null}

                                {guest.status !== "DECLINED" ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickStatusUpdate(guest, "DECLINED")
                                    }
                                    disabled={statusUpdatingId === guest.id}
                                    className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {statusUpdatingId === guest.id
                                      ? "Atualizando..."
                                      : "Marcar recusado"}
                                  </button>
                                ) : null}

                                {guest.status !== "INVITED" ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickStatusUpdate(guest, "INVITED")
                                    }
                                    disabled={statusUpdatingId === guest.id}
                                    className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {statusUpdatingId === guest.id
                                      ? "Atualizando..."
                                      : "Voltar para convidado"}
                                  </button>
                                ) : null}
                              </div>
                            </div>

                            <div className="flex shrink-0 flex-wrap gap-3 xl:flex-col xl:items-stretch">
                              <button
                                type="button"
                                onClick={() => handleEditGuest(guest)}
                                className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteGuest(guest)}
                                disabled={deletingId === guest.id}
                                className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {deletingId === guest.id ? "Excluindo..." : "Excluir"}
                              </button>
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </SectionShell>
              </div>

              <aside className="space-y-6">
                <SectionShell
                  eyebrow="resumo técnico"
                  title="Contexto do evento"
                >
                  <div className="space-y-4 text-sm text-neutral-700">
                    <div>
                      <p className="font-semibold text-neutral-900">Evento</p>
                      <p>{event?.name || "Não informado"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Slug atual</p>
                      <p className="break-all">{event?.slug || "Não informado"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Status</p>
                      <p>{statusLabel(event?.status)}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Capacidade</p>
                      <p>{event?.capacity ?? "Não informada"}</p>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="status de presença"
                  title="Leitura rápida do RSVP"
                >
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Confirmados: <strong>{summary.confirmed}</strong>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Recusaram: <strong>{summary.declined}</strong>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Pendentes: <strong>{summary.pending}</strong>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Total: <strong>{summary.total}</strong>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="próximas evoluções"
                  title="Base pronta para crescer"
                >
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Importação em lote de convidados
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Envio de convite por WhatsApp
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Métricas mais detalhadas de RSVP
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      QR Code e link individual por convidado
                    </div>
                  </div>
                </SectionShell>
              </aside>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}