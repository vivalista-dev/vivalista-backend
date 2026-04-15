"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

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

type GiftType = "PHYSICAL" | "CASH" | "QUOTA" | "FREE_CONTRIBUTION";
type PriceMode = "FIXED" | "FLEXIBLE";
type GiftStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "PURCHASED"
  | "PARTIALLY_FUNDED"
  | "DISABLED";

type GiftItem = {
  id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  purchaseUrl?: string | null;
  isActive?: boolean;
  isReserved?: boolean;
  isPurchased?: boolean;
  reservedByName?: string | null;
  reservedAt?: string | null;
  purchasedByName?: string | null;
  purchasedAt?: string | null;
  giftType?: GiftType;
  priceMode?: PriceMode;
  giftStatus?: GiftStatus;
  allowCustomAmount?: boolean;
  quotaTotal?: number | null;
  quotaSold?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  isFeatured?: boolean;
  displayOrder?: number | null;
  category?: string | null;
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

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type GiftFormData = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  purchaseUrl: string;
  isActive: boolean;
  giftType: GiftType;
  priceMode: PriceMode;
  giftStatus: GiftStatus;
  allowCustomAmount: boolean;
  quotaTotal: string;
  minAmount: string;
  maxAmount: string;
  isFeatured: boolean;
  displayOrder: string;
  category: string;
};

const EMPTY_FORM: GiftFormData = {
  title: "",
  description: "",
  price: "",
  imageUrl: "",
  purchaseUrl: "",
  isActive: true,
  giftType: "PHYSICAL",
  priceMode: "FIXED",
  giftStatus: "AVAILABLE",
  allowCustomAmount: false,
  quotaTotal: "",
  minAmount: "",
  maxAmount: "",
  isFeatured: false,
  displayOrder: "0",
  category: "",
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

function formatMoney(value?: number | null): string {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateTime(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function giftTypeLabel(value?: GiftType): string {
  if (value === "CASH") return "Dinheiro";
  if (value === "QUOTA") return "Cotas";
  if (value === "FREE_CONTRIBUTION") return "Contribuição livre";
  return "Físico";
}

function giftStatusLabel(value?: GiftStatus): string {
  if (value === "RESERVED") return "Reservado";
  if (value === "PURCHASED") return "Comprado";
  if (value === "PARTIALLY_FUNDED") return "Parcial";
  if (value === "DISABLED") return "Desativado";
  return "Disponível";
}

function giftStatusClasses(value?: GiftStatus): string {
  if (value === "PURCHASED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (value === "RESERVED") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (value === "PARTIALLY_FUNDED") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }

  if (value === "DISABLED") {
    return "border-neutral-200 bg-neutral-100 text-neutral-600";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

function giftStatusAccent(value?: GiftStatus): string {
  if (value === "PURCHASED") {
    return "ring-emerald-100";
  }

  if (value === "RESERVED") {
    return "ring-amber-100";
  }

  if (value === "PARTIALLY_FUNDED") {
    return "ring-sky-100";
  }

  if (value === "DISABLED") {
    return "ring-neutral-100";
  }

  return "ring-rose-100";
}

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buildFormFromGift(gift: GiftItem): GiftFormData {
  return {
    title: gift.title ?? "",
    description: gift.description ?? "",
    price: gift.price !== null && gift.price !== undefined ? String(gift.price) : "",
    imageUrl: gift.imageUrl ?? "",
    purchaseUrl: gift.purchaseUrl ?? "",
    isActive: gift.isActive ?? true,
    giftType: gift.giftType ?? "PHYSICAL",
    priceMode: gift.priceMode ?? "FIXED",
    giftStatus: gift.giftStatus ?? "AVAILABLE",
    allowCustomAmount: gift.allowCustomAmount ?? false,
    quotaTotal:
      gift.quotaTotal !== null && gift.quotaTotal !== undefined
        ? String(gift.quotaTotal)
        : "",
    minAmount:
      gift.minAmount !== null && gift.minAmount !== undefined
        ? String(gift.minAmount)
        : "",
    maxAmount:
      gift.maxAmount !== null && gift.maxAmount !== undefined
        ? String(gift.maxAmount)
        : "",
    isFeatured: gift.isFeatured ?? false,
    displayOrder:
      gift.displayOrder !== null && gift.displayOrder !== undefined
        ? String(gift.displayOrder)
        : "0",
    category: gift.category ?? "",
  };
}

function buildPayload(formData: GiftFormData) {
  const price =
    formData.price.trim() === "" ? null : Number(formData.price.replace(",", "."));
  const quotaTotal =
    formData.quotaTotal.trim() === ""
      ? null
      : Number(formData.quotaTotal.replace(",", "."));
  const minAmount =
    formData.minAmount.trim() === ""
      ? null
      : Number(formData.minAmount.replace(",", "."));
  const maxAmount =
    formData.maxAmount.trim() === ""
      ? null
      : Number(formData.maxAmount.replace(",", "."));
  const displayOrder =
    formData.displayOrder.trim() === ""
      ? 0
      : Number(formData.displayOrder.replace(",", "."));

  return {
    title: formData.title.trim(),
    description: formData.description.trim() || null,
    price,
    imageUrl: formData.imageUrl.trim() || null,
    purchaseUrl: formData.purchaseUrl.trim() || null,
    isActive: formData.isActive,
    giftType: formData.giftType,
    priceMode: formData.priceMode,
    giftStatus: formData.giftStatus,
    allowCustomAmount: formData.allowCustomAmount,
    quotaTotal,
    minAmount,
    maxAmount,
    isFeatured: formData.isFeatured,
    displayOrder,
    category: formData.category.trim() || null,
  };
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

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] px-4 py-3 text-left"
    >
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <span
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
          checked ? "bg-[#8f6a16]" : "bg-[#d6c8b8]"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs leading-5 text-[#8a7d74]">{children}</p>;
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

export default function DashboardEventGiftsPage() {
  const params = useParams<{ eventId: string }>();

  const eventId = useMemo(() => {
    const raw = params?.eventId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [event, setEvent] = useState<EventData | null>(null);
  const [dashboard, setDashboard] = useState<GiftDashboardResponse["dashboard"]>({
    totalGifts: 0,
    activeGifts: 0,
    reservedGifts: 0,
    purchasedGifts: 0,
    availableGifts: 0,
  });
  const [gifts, setGifts] = useState<GiftItem[]>([]);

  const [search, setSearch] = useState("");
  const [giftTypeFilter, setGiftTypeFilter] = useState("all");
  const [giftStatusFilter, setGiftStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("displayOrder");

  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GiftFormData>(EMPTY_FORM);

  const [uploadingGiftId, setUploadingGiftId] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

      const [eventResponse, dashboardResponse, giftsResponse] = await Promise.all([
        fetch(`${backendUrl}/events/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        }),
        fetch(`${backendUrl}/events/${eventId}/gifts/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        }),
        fetch(`${backendUrl}/events/${eventId}/gifts`, {
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

      if (!dashboardResponse.ok) {
        let apiError: ApiError | null = null;

        try {
          apiError = (await dashboardResponse.json()) as ApiError;
        } catch {
          apiError = null;
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao buscar dashboard de presentes. Status ${dashboardResponse.status}.`
        );
      }

      if (!giftsResponse.ok) {
        let apiError: ApiError | null = null;

        try {
          apiError = (await giftsResponse.json()) as ApiError;
        } catch {
          apiError = null;
        }

        throw new Error(
          getErrorMessage(apiError) ||
            `Erro ao buscar presentes. Status ${giftsResponse.status}.`
        );
      }

      const eventRaw = (await eventResponse.json()) as EventData | { data?: EventData };
      const eventData = normalizeEventResponse(eventRaw);

      const dashboardRaw = (await dashboardResponse.json()) as GiftDashboardResponse;
      const giftsRaw = (await giftsResponse.json()) as GiftItem[];

      setEvent(eventData);
      setDashboard(dashboardRaw.dashboard);
      setGifts(Array.isArray(giftsRaw) ? giftsRaw : []);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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

  function handleBooleanChange<K extends keyof GiftFormData>(key: K, value: boolean) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleCreateNew() {
    setEditingGiftId(null);
    setFormData(EMPTY_FORM);
    setSavedMessage(null);
    setErrorMessage(null);
  }

  function handleEditGift(gift: GiftItem) {
    setEditingGiftId(gift.id);
    setFormData(buildFormFromGift(gift));
    setSavedMessage(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!eventId) return;

    if (!formData.title.trim()) {
      setErrorMessage("Título do presente é obrigatório.");
      return;
    }

    try {
      setSaving(true);
      setSavedMessage(null);
      setErrorMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();
      const payload = buildPayload(formData);

      const isEditing = Boolean(editingGiftId);
      const response = await fetch(
        isEditing
          ? `${backendUrl}/events/${eventId}/gifts/${editingGiftId}`
          : `${backendUrl}/events/${eventId}/gifts`,
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
            `Erro ao salvar presente. Status ${response.status}.`
        );
      }

      setSavedMessage(
        isEditing
          ? "Presente atualizado com sucesso."
          : "Presente criado com sucesso."
      );
      setEditingGiftId(null);
      setFormData(EMPTY_FORM);
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGift(gift: GiftItem) {
    if (!eventId) return;

    const confirmed = window.confirm(
      `Deseja realmente excluir o presente "${gift.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(gift.id);
      setSavedMessage(null);
      setErrorMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(`${backendUrl}/events/${eventId}/gifts/${gift.id}`, {
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
            `Erro ao excluir presente. Status ${response.status}.`
        );
      }

      setSavedMessage("Presente excluído com sucesso.");
      if (editingGiftId === gift.id) {
        setEditingGiftId(null);
        setFormData(EMPTY_FORM);
      }
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleGiftImageUpload(giftId: string, file: File | null) {
    if (!eventId || !file) return;

    try {
      setUploadingGiftId(giftId);
      setSavedMessage(null);
      setErrorMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();
      const form = new FormData();
      form.append("file", file);

      const response = await fetch(
        `${backendUrl}/events/${eventId}/gifts/${giftId}/image`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: form,
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
            `Erro ao enviar imagem. Status ${response.status}.`
        );
      }

      setSavedMessage("Imagem do presente enviada com sucesso.");
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploadingGiftId(null);
      const input = fileInputRefs.current[giftId];
      if (input) {
        input.value = "";
      }
    }
  }

  const filteredGifts = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    const list = gifts.filter((gift) => {
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(gift.title).includes(normalizedSearch) ||
        normalizeText(gift.description).includes(normalizedSearch) ||
        normalizeText(gift.category).includes(normalizedSearch);

      const matchesType =
        giftTypeFilter === "all" || gift.giftType === giftTypeFilter;

      const matchesStatus =
        giftStatusFilter === "all" || gift.giftStatus === giftStatusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });

    if (sortBy === "title") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    if (sortBy === "priceAsc") {
      return [...list].sort(
        (a, b) =>
          (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER)
      );
    }

    if (sortBy === "priceDesc") {
      return [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return [...list].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    );
  }, [gifts, search, giftTypeFilter, giftStatusFilter, sortBy]);

  const publicPath = event?.slug ? `/e/${event.slug}` : null;
  const formGiftType = formData.giftType;
  const showPriceField = formGiftType !== "FREE_CONTRIBUTION";
  const showQuotaField = formGiftType === "QUOTA";
  const showCustomAmountFields =
    formGiftType === "CASH" ||
    formGiftType === "QUOTA" ||
    formGiftType === "FREE_CONTRIBUTION" ||
    formData.priceMode === "FLEXIBLE" ||
    formData.allowCustomAmount;

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
              Erro ao abrir presentes
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
                      dashboard de presentes
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      Gerenciar presentes
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
                    Cadastre, edite, organize e acompanhe o status real dos presentes do evento.
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
                        href={`/dashboard/eventos/${eventId}/convidados`}
                        className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                      >
                        Abrir convidados
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
                      onClick={handleCreateNew}
                      className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                    >
                      Novo presente
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
                      {dashboard.availableGifts} disponíveis de {dashboard.totalGifts} presentes
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Acompanhe disponibilidade, reservas, compras e organização visual da lista.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <SectionShell
              eyebrow="resumo"
              title="Dashboard dos presentes"
              description="Acompanhe o estado da lista em tempo real."
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <SummaryCard
                  label="Total"
                  value={dashboard.totalGifts}
                  description="Quantidade total de presentes cadastrados."
                />
                <SummaryCard
                  label="Ativos"
                  value={dashboard.activeGifts}
                  description="Presentes atualmente ativos na operação."
                />
                <SummaryCard
                  label="Disponíveis"
                  value={dashboard.availableGifts}
                  description="Itens liberados para reserva ou compra."
                />
                <SummaryCard
                  label="Reservados"
                  value={dashboard.reservedGifts}
                  description="Itens já reservados por convidados."
                />
                <SummaryCard
                  label="Comprados"
                  value={dashboard.purchasedGifts}
                  description="Itens já concluídos na experiência pública."
                />
              </div>
            </SectionShell>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <SectionShell
                  eyebrow={editingGiftId ? "edição" : "cadastro"}
                  title={editingGiftId ? "Editar presente" : "Novo presente"}
                  description="Preencha os dados principais, defina o modelo e salve no backend real."
                >
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                          >
                            Título do presente
                          </label>
                          <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Ex: Geladeira, cota da lua de mel..."
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          />
                          <FieldHint>
                            Nome principal que aparecerá no dashboard e na página pública.
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
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Descreva o presente e sua utilidade."
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          />
                          <FieldHint>
                            Ajuda o convidado a entender melhor o item ou a contribuição.
                          </FieldHint>
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <label
                            htmlFor="giftType"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                          >
                            Tipo do presente
                          </label>
                          <select
                            id="giftType"
                            name="giftType"
                            value={formData.giftType}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          >
                            <option value="PHYSICAL">Físico</option>
                            <option value="CASH">Dinheiro</option>
                            <option value="QUOTA">Cotas</option>
                            <option value="FREE_CONTRIBUTION">Contribuição livre</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="giftStatus"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                          >
                            Status
                          </label>
                          <select
                            id="giftStatus"
                            name="giftStatus"
                            value={formData.giftStatus}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          >
                            <option value="AVAILABLE">Disponível</option>
                            <option value="RESERVED">Reservado</option>
                            <option value="PURCHASED">Comprado</option>
                            <option value="PARTIALLY_FUNDED">Parcialmente financiado</option>
                            <option value="DISABLED">Desativado</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="priceMode"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                          >
                            Modo de preço
                          </label>
                          <select
                            id="priceMode"
                            name="priceMode"
                            value={formData.priceMode}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          >
                            <option value="FIXED">Fixo</option>
                            <option value="FLEXIBLE">Flexível</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                          >
                            Categoria
                          </label>
                          <input
                            id="category"
                            name="category"
                            type="text"
                            value={formData.category}
                            onChange={handleInputChange}
                            placeholder="Ex: Cozinha"
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          />
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {showPriceField ? (
                          <div>
                            <label
                              htmlFor="price"
                              className="mb-2 block text-sm font-medium text-neutral-800"
                            >
                              Valor base
                            </label>
                            <input
                              id="price"
                              name="price"
                              type="text"
                              value={formData.price}
                              onChange={handleInputChange}
                              placeholder="Ex: 3500"
                              className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                            />
                          </div>
                        ) : null}

                        {showQuotaField ? (
                          <div>
                            <label
                              htmlFor="quotaTotal"
                              className="mb-2 block text-sm font-medium text-neutral-800"
                            >
                              Total de cotas
                            </label>
                            <input
                              id="quotaTotal"
                              name="quotaTotal"
                              type="text"
                              value={formData.quotaTotal}
                              onChange={handleInputChange}
                              placeholder="Ex: 10"
                              className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                            />
                          </div>
                        ) : null}

                        {showCustomAmountFields ? (
                          <>
                            <div>
                              <label
                                htmlFor="minAmount"
                                className="mb-2 block text-sm font-medium text-neutral-800"
                              >
                                Valor mínimo
                              </label>
                              <input
                                id="minAmount"
                                name="minAmount"
                                type="text"
                                value={formData.minAmount}
                                onChange={handleInputChange}
                                placeholder="Ex: 20"
                                className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="maxAmount"
                                className="mb-2 block text-sm font-medium text-neutral-800"
                              >
                                Valor máximo
                              </label>
                              <input
                                id="maxAmount"
                                name="maxAmount"
                                type="text"
                                value={formData.maxAmount}
                                onChange={handleInputChange}
                                placeholder="Ex: 500"
                                className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                              />
                            </div>
                          </>
                        ) : null}

                        <div>
                          <label
                            htmlFor="displayOrder"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                          >
                            Ordem de exibição
                          </label>
                          <input
                            id="displayOrder"
                            name="displayOrder"
                            type="text"
                            value={formData.displayOrder}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          />
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="imageUrl"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                          >
                            URL da imagem
                          </label>
                          <input
                            id="imageUrl"
                            name="imageUrl"
                            type="text"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            placeholder="https://..."
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          />
                          <FieldHint>
                            Pode ser preenchida manualmente ou atualizada pelo upload real do card.
                          </FieldHint>
                        </div>

                        <div>
                          <label
                            htmlFor="purchaseUrl"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                          >
                            URL de compra
                          </label>
                          <input
                            id="purchaseUrl"
                            name="purchaseUrl"
                            type="text"
                            value={formData.purchaseUrl}
                            onChange={handleInputChange}
                            placeholder="https://..."
                            className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <ToggleField
                        label="Presente ativo"
                        checked={formData.isActive}
                        onChange={(value) => handleBooleanChange("isActive", value)}
                      />
                      <ToggleField
                        label="Valor customizado"
                        checked={formData.allowCustomAmount}
                        onChange={(value) =>
                          handleBooleanChange("allowCustomAmount", value)
                        }
                      />
                      <ToggleField
                        label="Marcar destaque"
                        checked={formData.isFeatured}
                        onChange={(value) => handleBooleanChange("isFeatured", value)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7a5911] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving
                          ? "Salvando..."
                          : editingGiftId
                            ? "Salvar alterações"
                            : "Criar presente"}
                      </button>

                      <button
                        type="button"
                        onClick={handleCreateNew}
                        className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-5 py-3 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                      >
                        Limpar formulário
                      </button>
                    </div>
                  </form>
                </SectionShell>

                <SectionShell
                  eyebrow="lista"
                  title="Presentes cadastrados"
                  description="Busque, filtre e gerencie os itens da lista."
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por nome, descrição ou categoria"
                      className="md:col-span-2 w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                    />

                    <select
                      value={giftTypeFilter}
                      onChange={(e) => setGiftTypeFilter(e.target.value)}
                      className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="PHYSICAL">Físico</option>
                      <option value="CASH">Dinheiro</option>
                      <option value="QUOTA">Cotas</option>
                      <option value="FREE_CONTRIBUTION">Contribuição livre</option>
                    </select>

                    <select
                      value={giftStatusFilter}
                      onChange={(e) => setGiftStatusFilter(e.target.value)}
                      className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                    >
                      <option value="all">Todos os status</option>
                      <option value="AVAILABLE">Disponível</option>
                      <option value="RESERVED">Reservado</option>
                      <option value="PURCHASED">Comprado</option>
                      <option value="PARTIALLY_FUNDED">Parcial</option>
                      <option value="DISABLED">Desativado</option>
                    </select>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-neutral-600">
                      {filteredGifts.length} presente
                      {filteredGifts.length === 1 ? "" : "s"} encontrado
                      {filteredGifts.length === 1 ? "" : "s"}
                    </p>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                    >
                      <option value="displayOrder">Ordenar por ordem</option>
                      <option value="title">Ordenar por título</option>
                      <option value="priceAsc">Menor valor</option>
                      <option value="priceDesc">Maior valor</option>
                    </select>
                  </div>

                  <div className="mt-6 grid gap-5">
                    {filteredGifts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#d7c9b9] bg-[#f8f3ec] p-8 text-center text-sm text-neutral-600">
                        Nenhum presente encontrado com os filtros atuais.
                      </div>
                    ) : (
                      filteredGifts.map((gift) => {
                        const resolvedImageUrl = buildAssetUrl(gift.imageUrl);

                        return (
                          <article
                            key={gift.id}
                            className={`overflow-hidden rounded-[28px] border border-[#e8dfd2] bg-white shadow-sm ring-1 ${giftStatusAccent(
                              gift.giftStatus
                            )}`}
                          >
                            <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                              <div className="bg-[#f3ece3]">
                                {resolvedImageUrl ? (
                                  <img
                                    src={resolvedImageUrl}
                                    alt={gift.title}
                                    className="h-full min-h-[220px] w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-[#8a7d74]">
                                    Sem imagem
                                  </div>
                                )}
                              </div>

                              <div className="p-5">
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap gap-2">
                                      <span className="rounded-full border border-[#e8dfd2] bg-[#f8f3ec] px-3 py-1 text-xs font-medium text-neutral-700">
                                        {giftTypeLabel(gift.giftType)}
                                      </span>

                                      <span
                                        className={`rounded-full border px-3 py-1 text-xs font-medium ${giftStatusClasses(
                                          gift.giftStatus
                                        )}`}
                                      >
                                        {giftStatusLabel(gift.giftStatus)}
                                      </span>

                                      {gift.isFeatured ? (
                                        <span className="rounded-full border border-[#c9a227] bg-[#fbf3d8] px-3 py-1 text-xs font-medium text-[#8f6a16]">
                                          Destaque
                                        </span>
                                      ) : null}

                                      {gift.category ? (
                                        <span className="rounded-full border border-[#e8dfd2] bg-[#f8f3ec] px-3 py-1 text-xs font-medium text-neutral-700">
                                          {gift.category}
                                        </span>
                                      ) : null}
                                    </div>

                                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
                                      {gift.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                                      {gift.description || "Sem descrição cadastrada."}
                                    </p>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                      <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                          Valor
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-neutral-900">
                                          {gift.giftType === "FREE_CONTRIBUTION"
                                            ? "Livre"
                                            : formatMoney(gift.price)}
                                        </p>
                                      </div>

                                      <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                          Ordem
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-neutral-900">
                                          {gift.displayOrder ?? 0}
                                        </p>
                                      </div>

                                      <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                          Ativo
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-neutral-900">
                                          {gift.isActive ? "Sim" : "Não"}
                                        </p>
                                      </div>

                                      <div className="rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                          Atualização
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-neutral-900">
                                          {gift.isPurchased
                                            ? formatDateTime(gift.purchasedAt)
                                            : gift.isReserved
                                              ? formatDateTime(gift.reservedAt)
                                              : "—"}
                                        </p>
                                      </div>
                                    </div>

                                    {gift.giftType === "QUOTA" ? (
                                      <div className="mt-4 rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                                        <p className="text-sm font-medium text-neutral-900">
                                          Cotas: {gift.quotaSold ?? 0} / {gift.quotaTotal ?? 0}
                                        </p>
                                        <p className="mt-1 text-sm text-neutral-600">
                                          Restantes:{" "}
                                          {Math.max(
                                            (gift.quotaTotal ?? 0) - (gift.quotaSold ?? 0),
                                            0
                                          )}
                                        </p>
                                      </div>
                                    ) : null}

                                    {gift.isReserved && gift.reservedByName ? (
                                      <p className="mt-4 text-sm text-amber-700">
                                        Reservado por {gift.reservedByName}
                                      </p>
                                    ) : null}

                                    {gift.isPurchased && gift.purchasedByName ? (
                                      <p className="mt-2 text-sm text-emerald-700">
                                        Comprado por {gift.purchasedByName}
                                      </p>
                                    ) : null}

                                    <div className="mt-5 rounded-[22px] border border-dashed border-[#d7c9b9] bg-[#f8f3ec] p-4">
                                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                                        Upload real da imagem
                                      </p>
                                      <p className="mt-2 text-sm text-neutral-600">
                                        Envie JPG, JPEG, PNG ou WEBP. A imagem será salva no backend e refletida no dashboard e na página pública.
                                      </p>

                                      <div className="mt-4 flex flex-wrap gap-3">
                                        <input
                                          ref={(element) => {
                                            fileInputRefs.current[gift.id] = element;
                                          }}
                                          type="file"
                                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleGiftImageUpload(
                                              gift.id,
                                              e.target.files?.[0] ?? null
                                            )
                                          }
                                        />

                                        <button
                                          type="button"
                                          disabled={uploadingGiftId === gift.id}
                                          onClick={() =>
                                            fileInputRefs.current[gift.id]?.click()
                                          }
                                          className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          {uploadingGiftId === gift.id
                                            ? "Enviando imagem..."
                                            : "Enviar imagem"}
                                        </button>

                                        {resolvedImageUrl ? (
                                          <a
                                            href={resolvedImageUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                                          >
                                            Abrir imagem
                                          </a>
                                        ) : null}
                                      </div>

                                      <p className="mt-3 break-all text-xs text-[#8a7d74]">
                                        {gift.imageUrl || "Nenhuma imagem salva ainda."}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex shrink-0 flex-wrap gap-3 xl:flex-col xl:items-stretch">
                                    <button
                                      type="button"
                                      onClick={() => handleEditGift(gift)}
                                      className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                                    >
                                      Editar
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteGift(gift)}
                                      disabled={deletingId === gift.id}
                                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {deletingId === gift.id ? "Excluindo..." : "Excluir"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })
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
                      <p className="font-semibold text-neutral-900">Quantidade de presentes</p>
                      <p>{dashboard.totalGifts}</p>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="modelo"
                  title="Tipos aceitos"
                >
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Físico: item tradicional com reserva ou compra.
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Dinheiro: presente monetário com valor fixo ou flexível.
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Cotas: item dividido em partes.
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Contribuição livre: convidado escolhe o valor.
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="próximas evoluções"
                  title="Base pronta para crescer"
                >
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Upload real de imagem do presente
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Reordenação visual por arrastar
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Edição em lote e ações rápidas
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Métricas financeiras por presente
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