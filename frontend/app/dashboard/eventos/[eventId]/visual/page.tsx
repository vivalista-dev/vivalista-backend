"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

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
  createdAt?: string | null;
  updatedAt?: string | null;
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
  showCountdown?: boolean;
  showStory?: boolean;
  showGallery?: boolean;
  showLocation?: boolean;
  showGifts?: boolean;
  showRsvp?: boolean;
};

type VisualResponse = {
  eventId: string;
  visual: VisualSettings;
};

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type VisualFormData = {
  publicTitle: string;
  publicSubtitle: string;
  heroImageUrl: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
  fontStyle: string;
  heroLayout: string;
  showCountdown: boolean;
  showStory: boolean;
  showGallery: boolean;
  showLocation: boolean;
  showGifts: boolean;
  showRsvp: boolean;
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

  return "Não foi possível carregar os dados do evento.";
}

function normalizeEventResponse(
  data: EventData | { data?: EventData }
): EventData {
  if ("data" in data && data.data) {
    return data.data;
  }

  return data as EventData;
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

function buildInitialVisualForm(
  event: EventData | null,
  visual?: VisualSettings | null
): VisualFormData {
  return {
    publicTitle: visual?.publicTitle ?? event?.name ?? "",
    publicSubtitle: visual?.publicSubtitle ?? event?.location ?? "",
    heroImageUrl: visual?.heroImageUrl ?? "",
    welcomeMessage:
      visual?.welcomeMessage ??
      event?.description ??
      "Estamos muito felizes em compartilhar este momento especial com vocês.",
    primaryColor: visual?.primaryColor ?? "#8f6a16",
    secondaryColor: visual?.secondaryColor ?? "#f8f3ec",
    fontStyle: visual?.fontStyle ?? "elegante",
    heroLayout: visual?.heroLayout ?? "centralizado",
    showCountdown: visual?.showCountdown ?? true,
    showStory: visual?.showStory ?? true,
    showGallery: visual?.showGallery ?? true,
    showLocation: visual?.showLocation ?? true,
    showGifts: visual?.showGifts ?? true,
    showRsvp: visual?.showRsvp ?? true,
  };
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
          checked ? "bg-[#8f6a16]" : "bg-[#d6c8b8]"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs leading-5 text-[#8a7d74]">{children}</p>;
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

function HeroPreview({
  formData,
}: {
  formData: VisualFormData;
}) {
  const title = formData.publicTitle || "Título público do evento";
  const subtitle = formData.publicSubtitle || "Subtítulo do evento";
  const message =
    formData.welcomeMessage || "Mensagem inicial da página pública.";
  const hasImage = Boolean(formData.heroImageUrl.trim());
  const heroLayout = formData.heroLayout || "centralizado";

  const imageBlock = (
    <div className="relative min-h-[260px] overflow-hidden rounded-[28px] border border-white/15 bg-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      {hasImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${formData.heroImageUrl})` }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75">
          imagem de destaque
        </p>
        <p className="mt-2 text-xl font-semibold">{title}</p>
      </div>
    </div>
  );

  const textBlock = (
    <div className="max-w-3xl">
      <div
        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          backgroundColor: formData.primaryColor,
          color: "#ffffff",
        }}
      >
        Preview público
      </div>

      <h3
        className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl"
        style={{ color: "#ffffff" }}
      >
        {title}
      </h3>

      <p className="mt-4 text-base font-medium text-white/85 md:text-lg">
        {subtitle}
      </p>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {formData.showCountdown ? (
          <span className="rounded-full bg-white/12 px-3 py-1 text-white">
            Countdown
          </span>
        ) : null}
        {formData.showGallery ? (
          <span className="rounded-full bg-white/12 px-3 py-1 text-white">
            Galeria
          </span>
        ) : null}
        {formData.showLocation ? (
          <span className="rounded-full bg-white/12 px-3 py-1 text-white">
            Localização
          </span>
        ) : null}
        {formData.showGifts ? (
          <span className="rounded-full bg-white/12 px-3 py-1 text-white">
            Presentes
          </span>
        ) : null}
        {formData.showRsvp ? (
          <span className="rounded-full bg-white/12 px-3 py-1 text-white">
            RSVP
          </span>
        ) : null}
      </div>
    </div>
  );

  const countdownBlock = formData.showCountdown ? (
    <div className="mt-8 grid max-w-2xl grid-cols-4 gap-3">
      {["dias", "horas", "min", "seg"].map((label) => (
        <div
          key={label}
          className="rounded-2xl border border-white/10 bg-white/10 px-3 py-4 text-center text-white backdrop-blur"
        >
          <div className="text-2xl font-semibold">00</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
            {label}
          </div>
        </div>
      ))}
    </div>
  ) : null;

  if (heroLayout === "minimalista") {
    return (
      <div
        className="rounded-[32px] border border-[#e8dfd2] px-6 py-10 md:px-10"
        style={{
          background: `linear-gradient(135deg, ${formData.primaryColor}, #27272a)`,
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          {textBlock}
          <div className="mx-auto mt-8 max-w-md">{countdownBlock}</div>
        </div>
      </div>
    );
  }

  if (heroLayout === "imagem-esquerda") {
    return (
      <div
        className="rounded-[32px] border border-[#e8dfd2] p-5 md:p-6"
        style={{
          background: `linear-gradient(135deg, ${formData.primaryColor}, #27272a)`,
        }}
      >
        <div className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {imageBlock}
          <div>
            {textBlock}
            {countdownBlock}
          </div>
        </div>
      </div>
    );
  }

  if (heroLayout === "imagem-direita") {
    return (
      <div
        className="rounded-[32px] border border-[#e8dfd2] p-5 md:p-6"
        style={{
          background: `linear-gradient(135deg, ${formData.primaryColor}, #27272a)`,
        }}
      >
        <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            {textBlock}
            {countdownBlock}
          </div>
          {imageBlock}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[32px] border border-[#e8dfd2] p-5 md:p-6"
      style={{
        background: `linear-gradient(135deg, ${formData.primaryColor}, #27272a)`,
      }}
    >
      <div className="grid items-center gap-6 lg:grid-cols-[1.18fr_0.82fr]">
        <div>{textBlock}</div>

        <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: formData.primaryColor }}
          >
            painel do hero
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div
              className="rounded-[20px] p-4"
              style={{ backgroundColor: formData.secondaryColor }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Data
              </p>
              <p className="mt-2 text-base font-semibold text-neutral-900">
                22/08/2026
              </p>
            </div>

            <div
              className="rounded-[20px] p-4"
              style={{ backgroundColor: formData.secondaryColor }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Local
              </p>
              <p className="mt-2 text-base font-semibold text-neutral-900">
                Evento
              </p>
            </div>
          </div>

          {countdownBlock ? (
            <div
              className="mt-4 rounded-[24px] p-4"
              style={{
                background: "linear-gradient(135deg,#111827,#27272a)",
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
                Countdown
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {["00", "00", "00", "00"].map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    className="rounded-xl border border-white/10 bg-white/10 px-2 py-3 text-center text-white"
                  >
                    <div className="text-lg font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function VisualSummaryCard({
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

export default function DashboardEventVisualPage() {
  const params = useParams<{ eventId: string }>();

  const eventId = useMemo(() => {
    const raw = params?.eventId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);

  const [formData, setFormData] = useState<VisualFormData>(
    buildInitialVisualForm(null)
  );

  useEffect(() => {
    async function loadData() {
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

        const [eventResponse, visualResponse] = await Promise.all([
          fetch(`${backendUrl}/events/${eventId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          }),
          fetch(`${backendUrl}/events/${eventId}/visual`, {
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

        if (!visualResponse.ok) {
          let apiError: ApiError | null = null;

          try {
            apiError = (await visualResponse.json()) as ApiError;
          } catch {
            apiError = null;
          }

          throw new Error(
            getErrorMessage(apiError) ||
              `Erro ao buscar configurações visuais. Status ${visualResponse.status}.`
          );
        }

        const eventRaw = (await eventResponse.json()) as EventData | { data?: EventData };
        const eventData = normalizeEventResponse(eventRaw);

        const visualRaw = (await visualResponse.json()) as VisualResponse;
        const visualData = visualRaw?.visual ?? {};

        setEvent(eventData);
        setFormData(buildInitialVisualForm(eventData, visualData));
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [eventId]);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleToggle<K extends keyof VisualFormData>(key: K, value: boolean) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSave() {
    if (!eventId) return;

    try {
      setSaving(true);
      setSavedMessage(null);
      setErrorMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const payload = {
        publicTitle: formData.publicTitle.trim() || null,
        publicSubtitle: formData.publicSubtitle.trim() || null,
        heroImageUrl: formData.heroImageUrl.trim() || null,
        welcomeMessage: formData.welcomeMessage.trim() || null,
        primaryColor: formData.primaryColor.trim() || null,
        secondaryColor: formData.secondaryColor.trim() || null,
        fontStyle: formData.fontStyle.trim() || null,
        heroLayout: formData.heroLayout.trim() || null,
        showCountdown: formData.showCountdown,
        showStory: formData.showStory,
        showGallery: formData.showGallery,
        showLocation: formData.showLocation,
        showGifts: formData.showGifts,
        showRsvp: formData.showRsvp,
      };

      const response = await fetch(`${backendUrl}/events/${eventId}/visual`, {
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

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao salvar configurações visuais. Status ${response.status}.`
        );
      }

      const saved = (await response.json()) as VisualResponse & { message?: string };

      setFormData((current) => buildInitialVisualForm(event, saved.visual ?? current));
      setSavedMessage(saved.message || "Configurações visuais salvas com sucesso.");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

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

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200" />
                  <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200" />
                  <div className="h-28 w-full animate-pulse rounded-2xl bg-neutral-200" />
                  <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200" />
                </div>
              </div>

              <div className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
                <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                <div className="mt-4 space-y-3">
                  <div className="h-24 w-full animate-pulse rounded-2xl bg-neutral-200" />
                  <div className="h-24 w-full animate-pulse rounded-2xl bg-neutral-200" />
                </div>
              </div>
            </div>
          </section>
        ) : errorMessage ? (
          <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-800">
              Erro ao abrir configurações visuais
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
                      dashboard visual do evento
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      Configurações visuais
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
                    Ajuste a apresentação pública do evento, simule o hero principal e salve no backend real.
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
                        href={`/dashboard/eventos/${eventId}/editar`}
                        className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Editar dados do evento
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
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Salvando..." : "Salvar configurações visuais"}
                    </button>
                  </div>

                  {savedMessage ? (
                    <p className="mt-3 text-sm font-medium text-[#8f6a16]">
                      {savedMessage}
                    </p>
                  ) : null}
                </div>

                <div className="grid min-w-full gap-3 sm:grid-cols-2 xl:min-w-[380px] xl:max-w-[440px]">
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
                      Rota pública
                    </p>
                    <p className="mt-2 break-all text-sm font-medium text-neutral-900">
                      {publicPath || "Sem slug público"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#e8dfd2] bg-white p-4 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Leitura rápida
                    </p>
                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      {formData.publicTitle || "Título público do evento"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Hero em {formData.heroLayout} com fonte {formData.fontStyle} e foco em personalização pública do evento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <SectionShell
              eyebrow="preview principal"
              title="Prévia do hero público"
              description="Este bloco simula o topo da página pública usando o layout, as cores, a imagem e os textos atuais."
            >
              <HeroPreview formData={formData} />
            </SectionShell>

            <SectionShell
              eyebrow="resumo visual"
              title="Leitura rápida da configuração"
              description="Visão executiva do que está sendo personalizado nesta tela."
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <VisualSummaryCard
                  label="Título público"
                  value={formData.publicTitle || "Não definido"}
                  description="Texto principal do hero e do topo da experiência pública."
                />
                <VisualSummaryCard
                  label="Layout do hero"
                  value={formData.heroLayout}
                  description="Estrutura visual escolhida para o topo da página."
                />
                <VisualSummaryCard
                  label="Estilo de fonte"
                  value={formData.fontStyle}
                  description="Tom visual e sensação de tipografia do evento."
                />
                <VisualSummaryCard
                  label="Imagem principal"
                  value={formData.heroImageUrl.trim() ? "Configurada" : "Não configurada"}
                  description="Imagem de destaque usada no hero público."
                />
              </div>
            </SectionShell>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <SectionShell
                  eyebrow="conteúdo visual"
                  title="Hero e mensagem inicial"
                  description="Esses campos controlam os elementos mais visíveis da página pública."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="publicTitle"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Título público
                      </label>
                      <input
                        id="publicTitle"
                        name="publicTitle"
                        type="text"
                        value={formData.publicTitle}
                        onChange={handleInputChange}
                        placeholder="Ex: Renan & Laislla"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                      <FieldHint>
                        É o texto principal que aparece no hero da página pública.
                      </FieldHint>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="publicSubtitle"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Subtítulo público
                      </label>
                      <input
                        id="publicSubtitle"
                        name="publicSubtitle"
                        type="text"
                        value={formData.publicSubtitle}
                        onChange={handleInputChange}
                        placeholder="Ex: Nosso grande dia está chegando"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                      <FieldHint>
                        Aparece logo abaixo do título principal no topo do site.
                      </FieldHint>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="heroImageUrl"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        URL da imagem de capa
                      </label>
                      <input
                        id="heroImageUrl"
                        name="heroImageUrl"
                        type="text"
                        value={formData.heroImageUrl}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                      <FieldHint>
                        Hoje funciona por URL. Depois podemos evoluir para upload real de imagem.
                      </FieldHint>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="welcomeMessage"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Mensagem de boas-vindas
                      </label>
                      <textarea
                        id="welcomeMessage"
                        name="welcomeMessage"
                        value={formData.welcomeMessage}
                        onChange={handleInputChange}
                        rows={7}
                        placeholder="Escreva a mensagem inicial da página pública"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                      <FieldHint>
                        Texto principal usado nos blocos emocionais e de apresentação.
                      </FieldHint>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="identidade visual"
                  title="Cores, fonte e composição"
                  description="Esses campos definem a sensação visual da página do evento."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="primaryColor"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Cor principal
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="primaryColor"
                          name="primaryColor"
                          type="color"
                          value={formData.primaryColor}
                          onChange={handleInputChange}
                          className="h-12 w-16 rounded-xl border border-[#d9cec2] bg-white p-1"
                        />
                        <input
                          name="primaryColor"
                          type="text"
                          value={formData.primaryColor}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                        />
                      </div>
                      <FieldHint>
                        Cor de destaque usada em botões, títulos e detalhes do hero.
                      </FieldHint>
                    </div>

                    <div>
                      <label
                        htmlFor="secondaryColor"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Cor secundária
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="secondaryColor"
                          name="secondaryColor"
                          type="color"
                          value={formData.secondaryColor}
                          onChange={handleInputChange}
                          className="h-12 w-16 rounded-xl border border-[#d9cec2] bg-white p-1"
                        />
                        <input
                          name="secondaryColor"
                          type="text"
                          value={formData.secondaryColor}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                        />
                      </div>
                      <FieldHint>
                        Cor de apoio usada em fundos, cartões e contraste do layout.
                      </FieldHint>
                    </div>

                    <div>
                      <label
                        htmlFor="fontStyle"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Estilo de fonte
                      </label>
                      <select
                        id="fontStyle"
                        name="fontStyle"
                        value={formData.fontStyle}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      >
                        <option value="elegante">Elegante</option>
                        <option value="moderno">Moderno</option>
                        <option value="classico">Clássico</option>
                        <option value="clean">Clean</option>
                      </select>
                      <FieldHint>
                        Ajuda a definir a sensação geral da identidade visual.
                      </FieldHint>
                    </div>

                    <div>
                      <label
                        htmlFor="heroLayout"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Layout do hero
                      </label>
                      <select
                        id="heroLayout"
                        name="heroLayout"
                        value={formData.heroLayout}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      >
                        <option value="centralizado">Centralizado</option>
                        <option value="imagem-esquerda">Imagem à esquerda</option>
                        <option value="imagem-direita">Imagem à direita</option>
                        <option value="minimalista">Minimalista</option>
                      </select>
                      <FieldHint>
                        Define como o texto e a imagem se organizam no topo da página.
                      </FieldHint>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="exibição pública"
                  title="Exibir ou ocultar seções"
                  description="Defina quais blocos realmente aparecem para os convidados."
                >
                  <div className="space-y-4">
                    <ToggleRow
                      label="Contagem regressiva"
                      description="Mostra o contador automático até a data do evento."
                      checked={formData.showCountdown}
                      onChange={(value) => handleToggle("showCountdown", value)}
                    />

                    <ToggleRow
                      label="História / mensagem especial"
                      description="Exibe o bloco emocional com texto principal do evento."
                      checked={formData.showStory}
                      onChange={(value) => handleToggle("showStory", value)}
                    />

                    <ToggleRow
                      label="Galeria"
                      description="Mostra a seção de fotos e imagens do evento."
                      checked={formData.showGallery}
                      onChange={(value) => handleToggle("showGallery", value)}
                    />

                    <ToggleRow
                      label="Localização"
                      description="Exibe o bloco com mapa, endereço e informações do local."
                      checked={formData.showLocation}
                      onChange={(value) => handleToggle("showLocation", value)}
                    />

                    <ToggleRow
                      label="Presentes"
                      description="Mantém a seção pública da lista de presentes visível."
                      checked={formData.showGifts}
                      onChange={(value) => handleToggle("showGifts", value)}
                    />

                    <ToggleRow
                      label="RSVP"
                      description="Mantém o bloco de confirmação de presença visível."
                      checked={formData.showRsvp}
                      onChange={(value) => handleToggle("showRsvp", value)}
                    />
                  </div>
                </SectionShell>
              </div>

              <aside className="space-y-6">
                <SectionShell
                  eyebrow="resumo"
                  title="Estrutura atual"
                >
                  <div className="space-y-4 text-sm text-neutral-700">
                    <div>
                      <p className="font-semibold text-neutral-900">Título público</p>
                      <p>{formData.publicTitle || "Não preenchido"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Slug atual</p>
                      <p className="break-all">{event?.slug || "Não informado"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Layout do hero</p>
                      <p>{formData.heroLayout}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Fonte</p>
                      <p>{formData.fontStyle}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Cor principal</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="inline-block h-5 w-5 rounded-full border border-[#d9cec2]"
                          style={{ backgroundColor: formData.primaryColor }}
                        />
                        <span>{formData.primaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Cor secundária</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="inline-block h-5 w-5 rounded-full border border-[#d9cec2]"
                          style={{ backgroundColor: formData.secondaryColor }}
                        />
                        <span>{formData.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="mapeamento"
                  title="Seções ativas"
                >
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Hero principal: <strong>{formData.publicTitle || "Título"}</strong>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Countdown: <strong>{formData.showCountdown ? "ativo" : "oculto"}</strong>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Galeria: <strong>{formData.showGallery ? "ativa" : "oculta"}</strong>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Localização: <strong>{formData.showLocation ? "ativa" : "oculta"}</strong>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Presentes: <strong>{formData.showGifts ? "ativo" : "oculto"}</strong>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      RSVP: <strong>{formData.showRsvp ? "ativo" : "oculto"}</strong>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="próximas evoluções"
                  title="Base pronta para crescer"
                >
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Upload real de imagem de capa
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Galeria real com múltiplas fotos
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Sistema de templates visuais
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Mais blocos públicos configuráveis
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