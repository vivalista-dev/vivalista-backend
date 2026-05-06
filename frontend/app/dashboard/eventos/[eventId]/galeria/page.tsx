"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type EventData = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  capacity?: number | null;
  status?: string | null;
  coverImage?: string | null;
  heroImageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type GalleryImage = {
  id: string;
  eventId: string;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
  displayOrder: number;
  isCover: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type GalleryResponse = {
  eventId: string;
  images: GalleryImage[];
};

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type LinkForm = {
  imageUrl: string;
  title: string;
  description: string;
  isCover: boolean;
};

const emptyLinkForm: LinkForm = {
  imageUrl: "",
  title: "",
  description: "",
  isCover: false,
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

  const keys = [
    "token",
    "accessToken",
    "authToken",
    "jwt",
    "vivalista_token",
    "vivalista_access_token",
  ];

  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value?.trim()) return value;
  }

  return null;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const apiError = error as ApiError;

    if (Array.isArray(apiError.message)) {
      return apiError.message.join(", ");
    }

    if (typeof apiError.message === "string") {
      return apiError.message;
    }

    if (typeof apiError.error === "string") {
      return apiError.error;
    }
  }

  return "Não foi possível concluir a operação.";
}

function assetUrl(value?: string | null): string | null {
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

function normalizeEvent(data: EventData | { data?: EventData }): EventData {
  if ("data" in data && data.data) return data.data;
  return data as EventData;
}

function statusLabel(status?: string | null): string {
  if (status === "PUBLISHED") return "Publicado";
  if (status === "DRAFT") return "Rascunho";
  if (status === "CANCELLED") return "Cancelado";
  return status || "Sem status";
}

function dateLabel(date?: string | null): string {
  if (!date) return "Não informado";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
}

function fileSizeLabel(size: number): string {
  const mb = size / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(2).replace(".", ",")} MB`;

  return `${Math.round(size / 1024)} KB`;
}

function photoTitle(image: GalleryImage, index: number): string {
  return image.title?.trim() || `Foto ${index + 1}`;
}

function Pill({
  children,
  variant = "light",
}: {
  children: React.ReactNode;
  variant?: "light" | "gold" | "dark" | "success" | "danger";
}) {
  const variants = {
    light: "border-[#eadfce] bg-white text-[#6e6156]",
    gold: "border-[#e8cd90] bg-[#fff3d5] text-[#8f6a16]",
    dark: "border-white/15 bg-white/10 text-white/85",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

function Button({
  children,
  tone = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const tones = {
    primary:
      "bg-[#8f6a16] text-white shadow-[0_16px_34px_rgba(143,106,22,0.22)] hover:bg-[#785812]",
    secondary:
      "border border-[#eadfce] bg-white text-[#65564a] hover:bg-[#fff8ef]",
    danger:
      "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    ghost:
      "border border-white/15 bg-white/10 text-white hover:bg-white/15",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-[#eadfce] bg-[#fffaf3] px-4 py-3 text-sm text-[#251e17] outline-none transition placeholder:text-[#b1a293] focus:border-[#8f6a16] focus:bg-white ${props.className || ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-2xl border border-[#eadfce] bg-[#fffaf3] px-4 py-3 text-sm text-[#251e17] outline-none transition placeholder:text-[#b1a293] focus:border-[#8f6a16] focus:bg-white ${props.className || ""}`}
    />
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9b846c]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-2 text-xs leading-5 text-[#8a7a6b]">{hint}</p> : null}
    </label>
  );
}

function EmptyGallery() {
  return (
    <div className="flex min-h-[430px] items-center justify-center rounded-[34px] border border-dashed border-[#d5c2a5] bg-[radial-gradient(circle_at_top,#fffaf3_0%,#f2e5d3_100%)] p-8 text-center">
      <div>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-[0_18px_50px_rgba(143,106,22,0.14)]">
          🖼️
        </div>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[#241c15]">
          Nenhuma foto cadastrada ainda
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#76695f]">
          Comece pelo bloco <strong>Adicionar fotos</strong>. Depois de enviar,
          as imagens aparecem aqui com botões para editar, escolher capa, mudar ordem e remover.
        </p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-[#f3e7d8] px-5 py-8">
      <section className="mx-auto max-w-5xl rounded-[36px] bg-[#17120d] p-8 text-white shadow-[0_26px_90px_rgba(44,30,12,0.28)]">
        <Pill variant="dark">Galeria</Pill>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">
          Carregando estúdio de fotos...
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
          Buscando evento, galeria e permissões.
        </p>
      </section>
    </main>
  );
}

function ErrorScreen({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f3e7d8] px-5 py-8">
      <section className="mx-auto max-w-4xl rounded-[34px] border border-red-200 bg-red-50 p-8 shadow-[0_18px_70px_rgba(65,45,23,0.10)]">
        <Pill variant="danger">Erro</Pill>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#241c15]">
          Não foi possível abrir a galeria
        </h1>
        <p className="mt-3 text-sm leading-6 text-red-700">{message}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/dashboard/eventos"
            className="inline-flex rounded-2xl bg-[#8f6a16] px-5 py-3 text-sm font-black text-white transition hover:bg-[#785812]"
          >
            Voltar para eventos
          </Link>
          <Button type="button" tone="secondary" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      </section>
    </main>
  );
}

export default function EventGalleryPage() {
  const params = useParams<{ eventId: string }>();

  const eventId = useMemo(() => {
    const raw = params?.eventId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [event, setEvent] = useState<EventData | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState<LinkForm>(emptyLinkForm);

  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);
  const [savingImageId, setSavingImageId] = useState<string | null>(null);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const orderedImages = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
        return (a.createdAt || "").localeCompare(b.createdAt || "");
      }),
    [images]
  );

  const coverImage =
    orderedImages.find((image) => image.isCover) ?? orderedImages[0] ?? null;

  const coverUrl = assetUrl(
    coverImage?.imageUrl || event?.coverImage || event?.heroImageUrl
  );

  const publicPath = event?.slug ? `/e/${event.slug}` : null;
  const panelPath = event?.id
    ? `/dashboard/eventos/${event.id}`
    : "/dashboard/eventos";
  const visualPath = event?.id
    ? `/dashboard/eventos/${event.id}/visual`
    : "/dashboard/eventos";

  const loadGallery = useCallback(async () => {
    if (!eventId) return;

    const token = getAuthToken();
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/events/${eventId}/gallery`, {
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

      throw new Error(
        getErrorMessage(apiError) ||
          `Erro ao buscar galeria. Status ${response.status}.`
      );
    }

    const data = (await response.json()) as GalleryResponse;
    setImages(Array.isArray(data.images) ? data.images : []);
  }, [eventId]);

  const loadPageData = useCallback(async () => {
    if (!eventId) {
      setErrorMessage("ID do evento não encontrado na rota.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

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
          throw new Error("Faça login novamente para acessar este evento.");
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

      const eventRaw = (await eventResponse.json()) as
        | EventData
        | { data?: EventData };

      setEvent(normalizeEvent(eventRaw));
      await loadGallery();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [eventId, loadGallery]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setSelectedPreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  function flashSuccess(message: string) {
    setSuccessMessage(message);
    setErrorMessage(null);
  }

  function flashError(message: string) {
    setErrorMessage(message);
    setSuccessMessage(null);
  }

  function chooseFile(file: File | null) {
    setSelectedFile(file);
    setErrorMessage(null);
    setSuccessMessage(file ? "Foto escolhida. Agora clique em enviar." : null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0] ?? null);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files?.[0] ?? null);
  }

  function updateImageLocal(imageId: string, changes: Partial<GalleryImage>) {
    setImages((current) =>
      current.map((image) =>
        image.id === imageId
          ? {
              ...image,
              ...changes,
            }
          : image
      )
    );
  }

  async function handleUploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventId) return;

    if (!selectedFile) {
      flashError("Escolha uma foto antes de enviar.");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${backendUrl}/events/${eventId}/gallery/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
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
            `Erro ao enviar foto. Status ${response.status}.`
        );
      }

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      flashSuccess("Foto enviada para a galeria.");
      await loadGallery();
    } catch (error) {
      flashError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function handleAddByUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventId) return;

    if (!linkForm.imageUrl.trim()) {
      flashError("Informe a URL da imagem.");
      return;
    }

    try {
      setAddingUrl(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(`${backendUrl}/events/${eventId}/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          imageUrl: linkForm.imageUrl.trim(),
          title: linkForm.title.trim() || null,
          description: linkForm.description.trim() || null,
          isCover: linkForm.isCover,
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
            `Erro ao adicionar imagem. Status ${response.status}.`
        );
      }

      setLinkForm(emptyLinkForm);
      flashSuccess("Foto adicionada por link.");
      await loadGallery();
    } catch (error) {
      flashError(getErrorMessage(error));
    } finally {
      setAddingUrl(false);
    }
  }

  async function handleSaveImage(image: GalleryImage) {
    if (!eventId) return;

    try {
      setSavingImageId(image.id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(
        `${backendUrl}/events/${eventId}/gallery/${image.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            title: image.title?.trim() || null,
            description: image.description?.trim() || null,
            imageUrl: image.imageUrl.trim(),
            displayOrder: image.displayOrder,
          }),
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
            `Erro ao salvar imagem. Status ${response.status}.`
        );
      }

      setEditingImageId(null);
      flashSuccess("Título e legenda salvos.");
      await loadGallery();
    } catch (error) {
      flashError(getErrorMessage(error));
    } finally {
      setSavingImageId(null);
    }
  }

  async function handleSetCover(image: GalleryImage) {
    if (!eventId) return;

    try {
      setSavingImageId(image.id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(
        `${backendUrl}/events/${eventId}/gallery/${image.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ isCover: true }),
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
            `Erro ao definir capa. Status ${response.status}.`
        );
      }

      flashSuccess("Foto definida como capa.");
      await loadGallery();
      await loadPageData();
    } catch (error) {
      flashError(getErrorMessage(error));
    } finally {
      setSavingImageId(null);
    }
  }

  async function handleRemoveImage(image: GalleryImage) {
    if (!eventId) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja remover esta foto da galeria?"
    );

    if (!confirmed) return;

    try {
      setRemovingImageId(image.id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(
        `${backendUrl}/events/${eventId}/gallery/${image.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
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
            `Erro ao remover imagem. Status ${response.status}.`
        );
      }

      flashSuccess("Foto removida.");
      await loadGallery();
    } catch (error) {
      flashError(getErrorMessage(error));
    } finally {
      setRemovingImageId(null);
    }
  }

  async function handleReorderImages(nextImages: GalleryImage[]) {
    if (!eventId) return;

    const normalized = nextImages.map((image, index) => ({
      ...image,
      displayOrder: index + 1,
    }));

    setImages(normalized);

    try {
      setReordering(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(`${backendUrl}/events/${eventId}/gallery/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: normalized.map((image) => ({
            id: image.id,
            displayOrder: image.displayOrder,
          })),
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
            `Erro ao reordenar galeria. Status ${response.status}.`
        );
      }

      flashSuccess("Ordem atualizada.");
      await loadGallery();
    } catch (error) {
      flashError(getErrorMessage(error));
      await loadGallery();
    } finally {
      setReordering(false);
    }
  }

  function moveImage(imageId: string, direction: "up" | "down") {
    const currentIndex = orderedImages.findIndex((image) => image.id === imageId);
    if (currentIndex < 0) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= orderedImages.length) return;

    const nextImages = [...orderedImages];
    const currentImage = nextImages[currentIndex];
    const targetImage = nextImages[targetIndex];

    nextImages[currentIndex] = targetImage;
    nextImages[targetIndex] = currentImage;

    void handleReorderImages(nextImages);
  }

  if (loading) return <LoadingScreen />;

  if (errorMessage && !event) {
    return <ErrorScreen message={errorMessage} onRetry={loadPageData} />;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5ecdf_0%,#eee0cd_48%,#e8d7be_100%)] px-4 py-5 text-[#241c15] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[40px] bg-[#17120d] text-white shadow-[0_28px_100px_rgba(44,30,12,0.28)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative p-7 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#d6a74f]/25 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap gap-3">
                  <Pill variant="dark">Estúdio de fotos</Pill>
                  <Pill variant={event?.status === "PUBLISHED" ? "success" : "gold"}>
                    {statusLabel(event?.status)}
                  </Pill>
                </div>

                <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  Galeria do evento
                </h1>

                <p className="mt-5 max-w-3xl text-base leading-8 text-white/68">
                  Envie fotos, escolha a capa e organize o álbum público. Esta é a área
                  única para cuidar das imagens reais do evento.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={panelPath}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Voltar ao painel
                  </Link>

                  <Link
                    href={visualPath}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Configurações visuais
                  </Link>

                  {publicPath ? (
                    <Link
                      href={publicPath}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-[#d6a74f] px-5 py-3 text-sm font-black text-[#17120d] transition hover:-translate-y-0.5 hover:bg-[#e4bb68]"
                    >
                      Ver página pública
                    </Link>
                  ) : null}

                  <Button type="button" tone="ghost" onClick={loadPageData}>
                    Atualizar
                  </Button>
                </div>

                {successMessage ? (
                  <p className="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-400/15 px-4 py-3 text-sm font-bold text-emerald-50">
                    {successMessage}
                  </p>
                ) : null}

                {errorMessage ? (
                  <p className="mt-6 rounded-2xl border border-red-300/25 bg-red-400/15 px-4 py-3 text-sm font-bold text-red-50">
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.045] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="overflow-hidden rounded-[34px] border border-white/12 bg-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.20)] backdrop-blur">
                <div className="relative aspect-[16/11] bg-black/30">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt="Capa atual"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
                      Capa ainda não definida
                    </div>
                  )}

                  <div className="absolute left-4 top-4">
                    <Pill variant="dark">Capa atual</Pill>
                  </div>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d6a74f]">
                      Evento
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-bold text-white">
                      {event?.name || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d6a74f]">
                      Fotos
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {orderedImages.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d6a74f]">
                      Slug
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-bold text-white">
                      {event?.slug || "Sem slug"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[28px] border border-white/12 bg-white/10 p-5 text-sm leading-6 text-white/65 backdrop-blur">
                <strong className="text-white">Fluxo correto:</strong> envie a foto,
                veja a miniatura aparecer, escolha “Capa” se necessário e organize a ordem.
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-[34px] border border-[#eadfce] bg-white/75 p-4 shadow-[0_20px_70px_rgba(65,45,23,0.08)] backdrop-blur lg:grid-cols-3">
          {[
            ["1", "Adicionar", "Escolha a foto do computador ou cole uma URL externa."],
            ["2", "Editar", "Coloque título e legenda apenas quando fizer sentido."],
            ["3", "Publicar", "Defina a capa e organize a ordem do álbum público."],
          ].map(([number, title, text]) => (
            <div
              key={number}
              className="rounded-[26px] border border-[#eadfce] bg-[#fffaf3] p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8f6a16] text-sm font-black text-white">
                {number}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#76695f]">{text}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
          <aside className="space-y-6">
            <section className="overflow-hidden rounded-[34px] border border-[#eadfce] bg-white shadow-[0_22px_80px_rgba(65,45,23,0.09)]">
              <div className="border-b border-[#eadfce] bg-[linear-gradient(135deg,#fffaf3,#f1e4d1)] p-6">
                <Pill variant="gold">Adicionar fotos</Pill>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                  Envie novas imagens
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#76695f]">
                  Use upload para fotos reais. URL fica como alternativa.
                </p>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f3e7d8] p-1">
                  <button
                    type="button"
                    onClick={() => setMode("upload")}
                    className={`rounded-xl px-3 py-2 text-sm font-black transition ${
                      mode === "upload"
                        ? "bg-white text-[#8f6a16] shadow-sm"
                        : "text-[#76695f] hover:bg-white/50"
                    }`}
                  >
                    Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("link")}
                    className={`rounded-xl px-3 py-2 text-sm font-black transition ${
                      mode === "link"
                        ? "bg-white text-[#8f6a16] shadow-sm"
                        : "text-[#76695f] hover:bg-white/50"
                    }`}
                  >
                    Link
                  </button>
                </div>

                {mode === "upload" ? (
                  <form onSubmit={handleUploadFile} className="mt-5 space-y-5">
                    <div
                      role="button"
                      tabIndex={0}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(keyboardEvent) => {
                        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                          fileInputRef.current?.click();
                        }
                      }}
                      className={`cursor-pointer rounded-[30px] border border-dashed p-5 text-center transition ${
                        dragging
                          ? "border-[#8f6a16] bg-[#fff4d8]"
                          : "border-[#d4c0a1] bg-[#fffaf3] hover:border-[#8f6a16] hover:bg-[#fff7e9]"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {selectedPreviewUrl ? (
                        <div className="overflow-hidden rounded-[24px] border border-[#eadfce] bg-white">
                          <div className="aspect-[4/3]">
                            <img
                              src={selectedPreviewUrl}
                              alt="Prévia da foto selecionada"
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="p-4 text-left">
                            <p className="text-sm font-black text-[#241c15]">
                              {selectedFile?.name}
                            </p>
                            {selectedFile ? (
                              <p className="mt-1 text-xs text-[#76695f]">
                                {fileSizeLabel(selectedFile.size)}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="py-7">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-[0_14px_40px_rgba(143,106,22,0.12)]">
                            📷
                          </div>
                          <p className="mt-5 text-lg font-black text-[#241c15]">
                            Clique para escolher uma foto
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#76695f]">
                            Ou arraste a imagem para esta área.
                          </p>
                          <p className="mt-2 text-xs text-[#9d856c]">
                            JPG, PNG ou WEBP até 5MB
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={uploading || !selectedFile}
                      className="w-full py-4"
                    >
                      {uploading ? "Enviando..." : "Enviar foto para a galeria"}
                    </Button>

                    {selectedFile ? (
                      <Button
                        type="button"
                        tone="secondary"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="w-full"
                      >
                        Trocar / limpar foto escolhida
                      </Button>
                    ) : null}
                  </form>
                ) : (
                  <form onSubmit={handleAddByUrl} className="mt-5 space-y-4">
                    <Field label="URL da imagem">
                      <Input
                        name="imageUrl"
                        value={linkForm.imageUrl}
                        onChange={(event) =>
                          setLinkForm((current) => ({
                            ...current,
                            imageUrl: event.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                    </Field>

                    <Field label="Título">
                      <Input
                        name="title"
                        value={linkForm.title}
                        onChange={(event) =>
                          setLinkForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="Ex.: Ensaio do casal"
                      />
                    </Field>

                    <Field label="Legenda">
                      <Textarea
                        name="description"
                        value={linkForm.description}
                        onChange={(event) =>
                          setLinkForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Ex.: Uma lembrança especial desse momento."
                        rows={3}
                      />
                    </Field>

                    <label className="flex gap-3 rounded-2xl border border-[#eadfce] bg-[#fffaf3] p-4 text-sm leading-6 text-[#76695f]">
                      <input
                        type="checkbox"
                        checked={linkForm.isCover}
                        onChange={(event) =>
                          setLinkForm((current) => ({
                            ...current,
                            isCover: event.target.checked,
                          }))
                        }
                        className="mt-1 h-4 w-4 rounded border-[#cbb898] text-[#8f6a16]"
                      />
                      <span>Definir essa imagem como capa principal do evento.</span>
                    </label>

                    <Button type="submit" disabled={addingUrl} className="w-full py-4">
                      {addingUrl ? "Adicionando..." : "Adicionar foto por link"}
                    </Button>
                  </form>
                )}
              </div>
            </section>

            <section className="rounded-[34px] border border-[#eadfce] bg-[#241c15] p-6 text-white shadow-[0_22px_80px_rgba(65,45,23,0.16)]">
              <Pill variant="dark">Resumo</Pill>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d6a74f]">
                    Nome do evento
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {event?.name || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d6a74f]">
                    Slug público
                  </p>
                  <p className="mt-1 break-all text-sm text-white/72">
                    {event?.slug || "Sem slug"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#d6a74f]">
                      Fotos
                    </p>
                    <p className="mt-1 text-3xl font-semibold">
                      {orderedImages.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#d6a74f]">
                      Capa
                    </p>
                    <p className="mt-2 text-sm font-bold">
                      {coverImage ? "Definida" : "Pendente"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </aside>

          <section className="rounded-[36px] border border-[#eadfce] bg-white p-5 shadow-[0_22px_80px_rgba(65,45,23,0.09)] sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <Pill variant="gold">Álbum público</Pill>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Fotos cadastradas
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#76695f]">
                  As fotos do evento ficam aqui. O site público deve usar a galeria
                  como álbum principal, sem repetir o mesmo bloco em vários lugares.
                </p>
              </div>

              <Button type="button" tone="secondary" onClick={loadGallery}>
                Recarregar fotos
              </Button>
            </div>

            {orderedImages.length === 0 ? (
              <EmptyGallery />
            ) : (
              <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {orderedImages.map((image, index) => {
                  const imageUrl = assetUrl(image.imageUrl);
                  const isEditing = editingImageId === image.id;
                  const isSaving = savingImageId === image.id;
                  const isRemoving = removingImageId === image.id;

                  return (
                    <article
                      key={image.id}
                      className={`group overflow-hidden rounded-[32px] border bg-[#fffaf3] shadow-[0_16px_50px_rgba(65,45,23,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(65,45,23,0.13)] ${
                        image.isCover ? "border-[#8f6a16]" : "border-[#eadfce]"
                      }`}
                    >
                      <div className="relative aspect-[4/3] bg-[#eadfce]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={photoTitle(image, index)}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-[#76695f]">
                            Imagem sem URL
                          </div>
                        )}

                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white backdrop-blur">
                            Foto {index + 1}
                          </span>

                          {image.isCover ? (
                            <span className="rounded-full bg-[#8f6a16] px-3 py-1 text-xs font-black text-white shadow">
                              Capa
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="p-4">
                        {!isEditing ? (
                          <>
                            <div className="min-h-[82px]">
                              <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-[#241c15]">
                                {photoTitle(image, index)}
                              </h3>

                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#76695f]">
                                {image.description?.trim() ||
                                  "Sem legenda. Clique em editar para adicionar."}
                              </p>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <Button
                                type="button"
                                onClick={() => setEditingImageId(image.id)}
                                className="shadow-none"
                              >
                                Editar
                              </Button>

                              <Button
                                type="button"
                                tone="secondary"
                                onClick={() => handleSetCover(image)}
                                disabled={isSaving || image.isCover}
                              >
                                {image.isCover ? "É capa" : "Capa"}
                              </Button>

                              <Button
                                type="button"
                                tone="secondary"
                                onClick={() => moveImage(image.id, "up")}
                                disabled={index === 0 || reordering}
                              >
                                Subir
                              </Button>

                              <Button
                                type="button"
                                tone="secondary"
                                onClick={() => moveImage(image.id, "down")}
                                disabled={index === orderedImages.length - 1 || reordering}
                              >
                                Descer
                              </Button>

                              <Button
                                type="button"
                                tone="danger"
                                onClick={() => handleRemoveImage(image)}
                                disabled={isRemoving}
                                className="col-span-2"
                              >
                                {isRemoving ? "Removendo..." : "Remover imagem"}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <Field label="Título da foto">
                              <Input
                                value={image.title ?? ""}
                                onChange={(event) =>
                                  updateImageLocal(image.id, {
                                    title: event.target.value,
                                  })
                                }
                                placeholder="Título da foto"
                              />
                            </Field>

                            <Field label="Legenda">
                              <Textarea
                                value={image.description ?? ""}
                                onChange={(event) =>
                                  updateImageLocal(image.id, {
                                    description: event.target.value,
                                  })
                                }
                                placeholder="Legenda da foto"
                                rows={3}
                              />
                            </Field>

                            <details className="rounded-2xl border border-[#eadfce] bg-white p-4">
                              <summary className="cursor-pointer text-[11px] font-black uppercase tracking-[0.18em] text-[#9d856c]">
                                URL técnica
                              </summary>

                              <Input
                                value={image.imageUrl}
                                onChange={(event) =>
                                  updateImageLocal(image.id, {
                                    imageUrl: event.target.value,
                                  })
                                }
                                className="mt-3"
                              />
                            </details>

                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                type="button"
                                onClick={() => handleSaveImage(image)}
                                disabled={isSaving}
                                className="shadow-none"
                              >
                                {isSaving ? "Salvando..." : "Salvar"}
                              </Button>

                              <Button
                                type="button"
                                tone="secondary"
                                onClick={() => {
                                  setEditingImageId(null);
                                  void loadGallery();
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}

                        <p className="mt-4 text-xs leading-5 text-[#9d856c]">
                          Criada em {dateLabel(image.createdAt)} • Ordem{" "}
                          {image.displayOrder}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
