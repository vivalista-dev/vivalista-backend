"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

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

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type EventFormData = {
  name: string;
  slug: string;
  description: string;
  location: string;
  date: string;
  capacity: string;
  status: string;
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

  return "Não foi possível concluir a operação.";
}

function toDatetimeLocalValue(date?: string | null): string {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const offset = parsed.getTimezoneOffset();
  const localDate = new Date(parsed.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function toIsoDate(dateValue: string): string | null {
  if (!dateValue.trim()) return null;

  const parsed = new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function normalizeEventResponse(
  data: EventData | { data?: EventData }
): EventData {
  if ("data" in data && data.data) {
    return data.data;
  }

  return data as EventData;
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

function buildAssetUrl(path?: string | null): string | null {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${getBackendUrl()}${path.startsWith("/") ? path : `/${path}`}`;
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
  value: string;
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

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs leading-5 text-[#8a7d74]">{children}</p>;
}

export default function DashboardEditEventPage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();

  const eventId = useMemo(() => {
    const raw = params?.eventId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [coverSuccessMessage, setCoverSuccessMessage] = useState<string | null>(
    null
  );
  const [loadedEvent, setLoadedEvent] = useState<EventData | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    slug: "",
    description: "",
    location: "",
    date: "",
    capacity: "",
    status: "DRAFT",
  });

  const coverImageUrl = useMemo(
    () => buildAssetUrl(loadedEvent?.coverImage),
    [loadedEvent?.coverImage]
  );

  useEffect(() => {
    async function loadEvent() {
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

        const response = await fetch(`${backendUrl}/events/${eventId}`, {
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
              "Usuário não autenticado. Faça login novamente para editar este evento."
            );
          }

          if (response.status === 403) {
            throw new Error("Você não tem permissão para editar este evento.");
          }

          if (response.status === 404) {
            throw new Error("Evento não encontrado no backend para este ID.");
          }

          throw new Error(
            getErrorMessage(apiError) ||
              `Erro ao buscar evento. Status ${response.status}.`
          );
        }

        const rawData = (await response.json()) as EventData | { data?: EventData };
        const event = normalizeEventResponse(rawData);

        setLoadedEvent(event);
        setFormData({
          name: event.name || "",
          slug: event.slug || "",
          description: event.description || "",
          location: event.location || "",
          date: toDatetimeLocalValue(event.date),
          capacity:
            typeof event.capacity === "number" ? String(event.capacity) : "",
          status: event.status || "DRAFT",
        });
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleCoverFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setSelectedCoverFile(file);
    setCoverSuccessMessage(null);
    setErrorMessage(null);
  }

  async function handleCoverUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventId) {
      setErrorMessage("ID do evento não encontrado.");
      return;
    }

    if (!selectedCoverFile) {
      setErrorMessage("Selecione uma imagem antes de enviar.");
      return;
    }

    try {
      setUploadingCover(true);
      setErrorMessage(null);
      setCoverSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const form = new FormData();
      form.append("file", selectedCoverFile);

      const response = await fetch(`${backendUrl}/events/${eventId}/cover-image`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      let responseData: any = null;

      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Usuário não autenticado. Faça login novamente para enviar a capa."
          );
        }

        if (response.status === 403) {
          throw new Error("Você não tem permissão para enviar a capa deste evento.");
        }

        if (response.status === 404) {
          throw new Error("Evento não encontrado para upload da capa.");
        }

        throw new Error(
          getErrorMessage(responseData) ||
            `Erro ao enviar capa. Status ${response.status}.`
        );
      }

      const updatedEvent =
        responseData?.event && typeof responseData.event === "object"
          ? (responseData.event as EventData)
          : loadedEvent;

      if (updatedEvent) {
        setLoadedEvent(updatedEvent);
      }

      setSelectedCoverFile(null);
      setCoverSuccessMessage("Capa do evento enviada com sucesso.");
      setTimeout(() => setCoverSuccessMessage(null), 2800);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventId) {
      setErrorMessage("ID do evento não encontrado.");
      return;
    }

    if (!formData.name.trim()) {
      setErrorMessage("O nome do evento é obrigatório.");
      return;
    }

    const isoDate = toIsoDate(formData.date);

    if (formData.date.trim() && !isoDate) {
      setErrorMessage("A data informada é inválida.");
      return;
    }

    const capacityNumber = formData.capacity.trim()
      ? Number(formData.capacity)
      : null;

    if (formData.capacity.trim() && Number.isNaN(capacityNumber)) {
      setErrorMessage("A capacidade precisa ser numérica.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || null,
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        date: isoDate,
        capacity: capacityNumber,
        status: formData.status,
      };

      const response = await fetch(`${backendUrl}/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
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
            "Usuário não autenticado. Faça login novamente para salvar este evento."
          );
        }

        if (response.status === 403) {
          throw new Error("Você não tem permissão para salvar este evento.");
        }

        if (response.status === 404) {
          throw new Error("Evento não encontrado para atualização.");
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao salvar evento. Status ${response.status}.`
        );
      }

      const rawData = (await response.json()) as EventData | { data?: EventData };
      const updatedEvent = normalizeEventResponse(rawData);

      setLoadedEvent(updatedEvent);
      setFormData({
        name: updatedEvent.name || "",
        slug: updatedEvent.slug || "",
        description: updatedEvent.description || "",
        location: updatedEvent.location || "",
        date: toDatetimeLocalValue(updatedEvent.date),
        capacity:
          typeof updatedEvent.capacity === "number"
            ? String(updatedEvent.capacity)
            : "",
        status: updatedEvent.status || "DRAFT",
      });

      setSuccessMessage("Evento atualizado com sucesso.");

      setTimeout(() => {
        router.push(`/dashboard/eventos/${eventId}`);
      }, 900);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const publicPath = formData.slug.trim() ? `/e/${formData.slug.trim()}` : null;
  const publicUrl =
    typeof window !== "undefined" && publicPath
      ? `${window.location.origin}${publicPath}`
      : publicPath;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f8f3ec_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mb-8 overflow-hidden rounded-[32px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f3ec_100%)] p-6 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(111,74,166,0.05),transparent_26%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-[#ead79a] bg-[#fbf3d8] px-4 py-2 shadow-[0_10px_24px_rgba(201,162,39,0.10)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a16]">
                  dashboard do evento
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                  Editar evento
                </h1>

                {!loading ? (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClasses(
                      formData.status
                    )}`}
                  >
                    {statusLabel(formData.status)}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Altere os dados principais do evento e envie a capa real do evento.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {eventId ? (
                <Link
                  href={`/dashboard/eventos/${eventId}`}
                  className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-4 py-2 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                >
                  Voltar ao painel
                </Link>
              ) : null}

              <Link
                href="/dashboard/eventos"
                className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
              >
                Voltar para eventos
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <section className="space-y-6">
            <div className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
              <div className="mt-4 h-12 w-1/2 animate-pulse rounded-2xl bg-neutral-200" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
            </div>

            <div className="grid gap-6 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-[#e8dfd2] bg-white p-5 shadow-sm"
                >
                  <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-neutral-200" />
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200" />
                <div className="h-28 w-full animate-pulse rounded-2xl bg-neutral-200" />
                <div className="h-12 w-40 animate-pulse rounded-2xl bg-neutral-200" />
              </div>
            </div>
          </section>
        ) : errorMessage && !loadedEvent ? (
          <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-800">
              Erro ao carregar evento
            </h2>
            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage ? (
              <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            {coverSuccessMessage ? (
              <div className="rounded-[20px] border border-sky-200 bg-sky-50 p-4 text-sm text-sky-700">
                {coverSuccessMessage}
              </div>
            ) : null}

            <section className="grid gap-6 xl:grid-cols-4">
              <SummaryCard
                label="Nome atual"
                value={formData.name || "Não informado"}
                description="Nome principal exibido no painel e no evento."
              />
              <SummaryCard
                label="Slug público"
                value={formData.slug || "Não informado"}
                description="Caminho usado na rota pública do evento."
              />
              <SummaryCard
                label="Status"
                value={statusLabel(formData.status)}
                description="Controle atual de publicação do evento."
              />
              <SummaryCard
                label="Atualizado em"
                value={formatShortDate(loadedEvent?.updatedAt)}
                description="Última atualização registrada no backend."
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <SectionShell
                  eyebrow="capa do evento"
                  title="Imagem principal"
                  description="Envie a capa principal do evento e acompanhe a prévia atual."
                >
                  <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                    <div className="overflow-hidden rounded-[24px] border border-[#e8dfd2] bg-[#f3ece3]">
                      {coverImageUrl ? (
                        <img
                          src={coverImageUrl}
                          alt="Capa atual do evento"
                          className="h-[260px] w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[260px] items-center justify-center px-6 text-center text-sm text-[#8a7d74]">
                          Nenhuma capa enviada ainda.
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                          Estado atual da capa
                        </p>
                        <p className="mt-2 text-sm font-medium text-neutral-900">
                          {coverImageUrl ? "Capa configurada" : "Sem capa enviada"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                          A imagem enviada aqui é usada como capa principal do evento no sistema.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="coverFile"
                          className="mb-2 block text-sm font-medium text-neutral-800"
                        >
                          Selecionar nova capa
                        </label>
                        <input
                          id="coverFile"
                          name="coverFile"
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleCoverFileChange}
                          className="block w-full rounded-2xl border border-[#d9cec2] bg-white px-4 py-3 text-sm text-neutral-900"
                        />
                        <FieldHint>
                          Formatos aceitos: JPG, JPEG, PNG e WEBP. Tamanho máximo: 5MB.
                        </FieldHint>
                      </div>

                      {selectedCoverFile ? (
                        <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-3 text-sm text-neutral-700">
                          Arquivo selecionado:{" "}
                          <span className="font-medium">{selectedCoverFile.name}</span>
                        </div>
                      ) : null}

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const form = document.getElementById("cover-upload-form");
                            if (form instanceof HTMLFormElement) {
                              form.requestSubmit();
                            }
                          }}
                          disabled={uploadingCover}
                          className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7a5911] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {uploadingCover ? "Enviando capa..." : "Enviar capa"}
                        </button>

                        {coverImageUrl ? (
                          <a
                            href={coverImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-5 py-2.5 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                          >
                            Abrir capa
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <form id="cover-upload-form" onSubmit={handleCoverUpload} className="hidden" />
                </SectionShell>

                <SectionShell
                  eyebrow="dados principais"
                  title="Informações do evento"
                  description="Edite nome, slug, data, local, status e descrição principal."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Nome do evento
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Casamento Renan e Laislla"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                        required
                      />
                      <FieldHint>
                        Nome principal exibido no dashboard e na página pública.
                      </FieldHint>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="slug"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Slug público
                      </label>
                      <input
                        id="slug"
                        name="slug"
                        type="text"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="Ex: casamento-renan-e-laislla"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                      <FieldHint>
                        Valor usado na rota pública do evento em /e/[slug].
                      </FieldHint>
                    </div>

                    <div>
                      <label
                        htmlFor="date"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Data e hora
                      </label>
                      <input
                        id="date"
                        name="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="capacity"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Capacidade
                      </label>
                      <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        min="0"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="Ex: 150"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="location"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Local
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ex: Cachoeira Grande, Lagoinha - SP"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                      <FieldHint>
                        Esse texto é usado no painel e na página pública do evento.
                      </FieldHint>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="status"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      >
                        <option value="DRAFT">Rascunho</option>
                        <option value="PUBLISHED">Publicado</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                      <FieldHint>
                        Controla se o evento está em preparação, publicado ou cancelado.
                      </FieldHint>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Descrição
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Descreva o evento"
                        rows={7}
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                      <FieldHint>
                        Texto de apoio usado em várias áreas do painel e da experiência pública.
                      </FieldHint>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="salvamento"
                  title="Salvar alterações"
                  description="Envie as mudanças para o backend e atualize a leitura principal do evento."
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Feedback visual de salvamento
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        Ao salvar, os novos dados são enviados ao backend e o painel volta automaticamente para o evento.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {eventId ? (
                        <Link
                          href={`/dashboard/eventos/${eventId}`}
                          className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-4 py-2 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                        >
                          Cancelar
                        </Link>
                      ) : null}

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7a5911] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? "Salvando..." : "Salvar evento"}
                      </button>
                    </div>
                  </div>
                </SectionShell>
              </div>

              <aside className="space-y-6">
                <SectionShell
                  eyebrow="preview público"
                  title="Leitura da rota"
                  description="Veja rapidamente como o evento será acessado na página pública."
                >
                  <div className="space-y-4 text-sm text-neutral-700">
                    <div>
                      <p className="font-semibold text-neutral-900">Rota pública</p>
                      <p className="break-all">
                        {publicPath || "Preencha o slug para gerar a rota pública."}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">URL completa</p>
                      <p className="break-all">
                        {publicUrl || "A URL completa aparecerá quando houver slug."}
                      </p>
                    </div>

                    {publicPath ? (
                      <Link
                        href={publicPath}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Ver página pública
                      </Link>
                    ) : null}
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="resumo técnico"
                  title="Contexto atual"
                >
                  <div className="space-y-4 text-sm text-neutral-700">
                    <div>
                      <p className="font-semibold text-neutral-900">Event ID</p>
                      <p className="break-all">{loadedEvent?.id || "Não informado"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Criado em</p>
                      <p>{formatShortDate(loadedEvent?.createdAt)}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Atualizado em</p>
                      <p>{formatShortDate(loadedEvent?.updatedAt)}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Capa atual</p>
                      <p className="break-all text-xs">
                        {loadedEvent?.coverImage || "Nenhuma capa enviada"}
                      </p>
                    </div>
                  </div>
                </SectionShell>
              </aside>
            </section>
          </form>
        )}
      </div>
    </main>
  );
}