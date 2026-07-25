"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | string;

type EventData = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  status?: EventStatus | null;
  coverImage?: string | null;
  heroImageUrl?: string | null;
};

type SectionKey =
  | "INVITATION"
  | "HERO"
  | "COUPLE"
  | "STORY"
  | "GALLERY"
  | "RECEPTION"
  | "INFO"
  | "MENU"
  | "LOCATION"
  | "ACCOMMODATION"
  | "GIFTS"
  | "DEFAULT_GIFT"
  | "RSVP";

type SectionMedia = {
  id: string;
  eventId: string;
  organizationId?: string;
  sectionKey: SectionKey;
  mediaRole?: string | null;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  buttonLabel?: string | null;
  metadata?: unknown;
  displayOrder: number;
  isActive: boolean;
  isPrimary: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type SectionMediaResponse = {
  event: EventData;
  media: SectionMedia[];
  sections: Partial<Record<SectionKey, SectionMedia[]>>;
  availableSections?: SectionKey[];
};

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type MediaFormData = {
  imageUrl: string;
  title: string;
  description: string;
  linkUrl: string;
  buttonLabel: string;
  mediaRole: string;
  isActive: boolean;
  isPrimary: boolean;
};

type SectionConfig = {
  key: SectionKey;
  eyebrow: string;
  title: string;
  description: string;
  recommended: string;
  isSingle: boolean;
  defaultRole: string;
  roleHint: string;
  examples: string[];
};

const SECTION_CONFIGS: SectionConfig[] = [
  {
    key: "INVITATION",
    eyebrow: "Entrada",
    title: "Convite de abertura",
    description:
      "Imagem inicial antes da pessoa entrar no site. Pode ser envelope, convite, selo ou arte premium.",
    recommended: "1 imagem principal",
    isSingle: true,
    defaultRole: "convite",
    roleHint: "Ex.: envelope, convite, selo",
    examples: ["Envelope premium", "Arte do convite", "Selo de abertura"],
  },
  {
    key: "HERO",
    eyebrow: "Capa",
    title: "Capa principal / Hero",
    description:
      "Foto forte do topo do site. É a imagem que representa o evento logo na primeira dobra.",
    recommended: "1 imagem principal",
    isSingle: true,
    defaultRole: "capa",
    roleHint: "Ex.: capa, hero, foto principal",
    examples: ["Foto principal", "Casal na capa", "Aniversariante"],
  },
  {
    key: "COUPLE",
    eyebrow: "Pessoas",
    title: "Fotos do casal / homenageado",
    description:
      "Fotos usadas na seção do casal, aniversariante, bebê, formando ou anfitriões.",
    recommended: "1 a 3 imagens",
    isSingle: false,
    defaultRole: "casal",
    roleHint: "Ex.: casal, noiva, noivo, família",
    examples: ["Foto do casal", "Foto da família", "Foto do homenageado"],
  },
  {
    key: "STORY",
    eyebrow: "História",
    title: "História / Sobre o evento",
    description:
      "Imagem emocional para acompanhar o texto da história ou mensagem de boas-vindas.",
    recommended: "1 ou 2 imagens",
    isSingle: false,
    defaultRole: "historia",
    roleHint: "Ex.: história, memória, momento",
    examples: ["Primeiro encontro", "Foto antiga", "Momento especial"],
  },
  {
    key: "GALLERY",
    eyebrow: "Álbum",
    title: "Galeria / Carrossel",
    description:
      "Álbum principal do site. Aqui entram várias fotos, sem repetir nos outros blocos.",
    recommended: "várias imagens",
    isSingle: false,
    defaultRole: "galeria",
    roleHint: "Ex.: slide, galeria, álbum",
    examples: ["Slide 1", "Slide 2", "Ensaio", "Momentos"],
  },
  {
    key: "RECEPTION",
    eyebrow: "Evento",
    title: "Recepção / Festa",
    description:
      "Imagem da festa, recepção, salão, mesa ou ambiente onde os convidados serão recebidos.",
    recommended: "1 imagem principal",
    isSingle: true,
    defaultRole: "recepcao",
    roleHint: "Ex.: recepção, salão, festa",
    examples: ["Salão", "Mesa posta", "Ambiente da festa"],
  },
  {
    key: "INFO",
    eyebrow: "Orientações",
    title: "Informações gerais / Dress code",
    description:
      "Imagens de referência para traje, cores, orientações, estacionamento ou avisos.",
    recommended: "0 a 3 imagens",
    isSingle: false,
    defaultRole: "informacao",
    roleHint: "Ex.: dress-code, aviso, referência",
    examples: ["Dress code", "Paleta de cores", "Aviso aos convidados"],
  },
  {
    key: "MENU",
    eyebrow: "Cardápio",
    title: "Cardápio / Menu",
    description:
      "Fotos de comida, bebida, mesa de doces, buffet ou cardápio do evento.",
    recommended: "0 a 3 imagens",
    isSingle: false,
    defaultRole: "cardapio",
    roleHint: "Ex.: comida, bebida, menu",
    examples: ["Buffet", "Mesa de doces", "Drinks"],
  },
  {
    key: "LOCATION",
    eyebrow: "Lugar",
    title: "Localização / Foto do local",
    description:
      "Imagem do local do evento, fachada, paisagem, entrada ou espaço principal.",
    recommended: "1 imagem principal",
    isSingle: true,
    defaultRole: "local",
    roleHint: "Ex.: local, fachada, entrada",
    examples: ["Fachada", "Cachoeira", "Salão externo"],
  },
  {
    key: "ACCOMMODATION",
    eyebrow: "Apoio",
    title: "Hospedagem / Sugestão",
    description:
      "Imagem de hotel, pousada ou hospedagem sugerida para convidados.",
    recommended: "1 imagem principal",
    isSingle: true,
    defaultRole: "hospedagem",
    roleHint: "Ex.: hotel, pousada, quarto",
    examples: ["Hotel", "Pousada", "Quarto sugerido"],
  },
  {
    key: "GIFTS",
    eyebrow: "Presentes",
    title: "Imagens dos presentes",
    description:
      "Imagens de apoio para lista de presentes ou categorias. A imagem individual de cada presente poderá evoluir depois.",
    recommended: "várias imagens",
    isSingle: false,
    defaultRole: "presente",
    roleHint: "Ex.: cozinha, casa, enxoval",
    examples: ["Categoria cozinha", "Presente destaque", "Lista de presentes"],
  },
  {
    key: "DEFAULT_GIFT",
    eyebrow: "Padrão",
    title: "Imagem padrão de presente",
    description:
      "Imagem usada quando um presente não tiver foto própria. Evita card vazio ou amador.",
    recommended: "1 imagem padrão",
    isSingle: true,
    defaultRole: "presente-padrao",
    roleHint: "Ex.: padrão, sem-foto, fallback",
    examples: ["Caixa de presente", "Ícone premium", "Produto sem foto"],
  },
  {
    key: "RSVP",
    eyebrow: "Confirmação",
    title: "Confirmação de presença / RSVP",
    description:
      "Imagem opcional para a seção onde o convidado confirma presença.",
    recommended: "0 ou 1 imagem",
    isSingle: true,
    defaultRole: "rsvp",
    roleHint: "Ex.: confirmação, presença, RSVP",
    examples: ["Imagem do RSVP", "Convite para confirmar"],
  },
];

const emptyForm: MediaFormData = {
  imageUrl: "",
  title: "",
  description: "",
  linkUrl: "",
  buttonLabel: "",
  mediaRole: "",
  isActive: true,
  isPrimary: true,
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

  return "Não foi possível concluir a operação.";
}

async function readApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError;
    return getErrorMessage(data);
  } catch {
    return `Erro na API. Status ${response.status}.`;
  }
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

function formatFileSize(size: number): string {
  const mb = size / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(2).replace(".", ",")} MB`;

  const kb = size / 1024;
  return `${kb.toFixed(0)} KB`;
}

function statusLabel(status?: string | null): string {
  if (!status) return "Sem status";
  if (status === "DRAFT") return "Rascunho";
  if (status === "PUBLISHED") return "Publicado";
  if (status === "CANCELLED") return "Cancelado";
  return status;
}

function getSectionConfig(sectionKey: SectionKey): SectionConfig {
  return (
    SECTION_CONFIGS.find((item) => item.key === sectionKey) ||
    SECTION_CONFIGS[0]
  );
}

function sortMedia(items: SectionMedia[]): SectionMedia[] {
  return [...items].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }

    return (a.createdAt || "").localeCompare(b.createdAt || "");
  });
}

function mediaName(media: SectionMedia, index: number): string {
  return media.title?.trim() || media.mediaRole?.trim() || `Imagem ${index + 1}`;
}

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "dark" | "gold" | "green" | "red" | "muted";
}) {
  const tones = {
    default: "border-[#eadfce] bg-white text-[#6d5d4f]",
    dark: "border-white/15 bg-white/10 text-white/85",
    gold: "border-[#e4c688] bg-[#fff4d8] text-[#8f6a16]",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-700",
    muted: "border-[#eadfce] bg-[#f6efe6] text-[#8b7c70]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function FieldLabel({
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
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9d856c]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-2 text-xs leading-5 text-[#8b7c70]">{hint}</p> : null}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-[#eadfce] bg-[#fffaf3] px-4 py-3 text-sm text-[#302821] outline-none transition placeholder:text-[#b4a696] focus:border-[#8f6a16] focus:bg-white ${
        props.className || ""
      }`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-2xl border border-[#eadfce] bg-[#fffaf3] px-4 py-3 text-sm text-[#302821] outline-none transition placeholder:text-[#b4a696] focus:border-[#8f6a16] focus:bg-white ${
        props.className || ""
      }`}
    />
  );
}

function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl bg-[#8f6a16] px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(143,106,22,0.22)] transition hover:-translate-y-0.5 hover:bg-[#785812] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-bold text-[#6d5d4f] transition hover:-translate-y-0.5 hover:bg-[#fff8ef] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
}

function DangerButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#f4eadf] px-5 py-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[#17120d] p-8 text-white shadow-[0_26px_90px_rgba(44,30,12,0.28)]">
        <Pill tone="dark">Imagens e seções</Pill>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">
          Carregando conteúdo visual...
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
          Buscando evento, seções cadastradas e permissões da sua organização.
        </p>
      </div>
    </main>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f4eadf] px-5 py-8">
      <div className="mx-auto max-w-4xl rounded-[34px] border border-red-200 bg-red-50 p-8 shadow-[0_18px_70px_rgba(65,45,23,0.10)]">
        <Pill tone="red">Erro</Pill>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#221b14]">
          Não foi possível abrir o conteúdo visual
        </h1>
        <p className="mt-3 text-sm leading-6 text-red-700">{message}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/dashboard/eventos"
            className="inline-flex rounded-2xl bg-[#8f6a16] px-5 py-3 text-sm font-black text-white transition hover:bg-[#785812]"
          >
            Voltar para eventos
          </Link>
          <SecondaryButton type="button" onClick={onRetry}>
            Tentar novamente
          </SecondaryButton>
        </div>
      </div>
    </main>
  );
}

export default function EventVisualContentPage() {
  const params = useParams<{ eventId: string }>();

  const eventId = useMemo(() => {
    const raw = params?.eventId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [event, setEvent] = useState<EventData | null>(null);
  const [media, setMedia] = useState<SectionMedia[]>([]);
  const [selectedSectionKey, setSelectedSectionKey] =
    useState<SectionKey>("HERO");
  const [activeMode, setActiveMode] = useState<"upload" | "link">("upload");
  const [form, setForm] = useState<MediaFormData>({
    ...emptyForm,
    mediaRole: getSectionConfig("HERO").defaultRole,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(
    null
  );
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingUpload, setSavingUpload] = useState(false);
  const [savingLink, setSavingLink] = useState(false);
  const [savingMediaId, setSavingMediaId] = useState<string | null>(null);
  const [removingMediaId, setRemovingMediaId] = useState<string | null>(null);
  const [reorderingSectionKey, setReorderingSectionKey] =
    useState<SectionKey | null>(null);
  const [togglingSectionKey, setTogglingSectionKey] =
    useState<SectionKey | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const publicPath = event?.slug ? `/e/${event.slug}` : null;
  const panelPath = event?.id
    ? `/dashboard/eventos/${event.id}`
    : "/dashboard/eventos";

  const selectedConfig = getSectionConfig(selectedSectionKey);

  const groupedMedia = useMemo(() => {
    return SECTION_CONFIGS.reduce((acc, config) => {
      acc[config.key] = sortMedia(
        media.filter((item) => item.sectionKey === config.key)
      );
      return acc;
    }, {} as Record<SectionKey, SectionMedia[]>);
  }, [media]);

  const selectedSectionMedia = groupedMedia[selectedSectionKey] || [];
  const totalMedia = media.length;
  const totalActive = media.filter((item) => item.isActive).length;
  const coverMedia =
    media.find((item) => item.sectionKey === "HERO" && item.isPrimary) ||
    media.find((item) => item.sectionKey === "HERO") ||
    media.find((item) => item.isPrimary) ||
    media[0];

  const coverMediaUrl = buildAssetUrl(
    coverMedia?.imageUrl || event?.heroImageUrl || event?.coverImage
  );

  const loadSectionMedia = useCallback(async () => {
    if (!eventId) return;

    const token = getAuthToken();
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/events/${eventId}/section-media`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    const data = (await response.json()) as SectionMediaResponse;
    setMedia(Array.isArray(data.media) ? data.media : []);
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
        if (eventResponse.status === 401) {
          throw new Error("Faça login novamente para acessar este evento.");
        }

        if (eventResponse.status === 403) {
          throw new Error("Você não tem permissão para acessar este evento.");
        }

        if (eventResponse.status === 404) {
          throw new Error("Evento não encontrado no backend para este ID.");
        }

        throw new Error(await readApiError(eventResponse));
      }

      const eventRaw = (await eventResponse.json()) as
        | EventData
        | { data?: EventData };

      setEvent(normalizeEventResponse(eventRaw));
      await loadSectionMedia();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [eventId, loadSectionMedia]);

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

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedFile]);

  function showSuccess(message: string) {
    setSuccessMessage(message);
    setErrorMessage(null);
  }

  function showError(message: string) {
    setErrorMessage(message);
    setSuccessMessage(null);
  }

  function selectSection(sectionKey: SectionKey) {
    const config = getSectionConfig(sectionKey);

    setSelectedSectionKey(sectionKey);
    setEditingMediaId(null);
    setForm({
      ...emptyForm,
      mediaRole: config.defaultRole,
      isPrimary: config.isSingle,
      isActive: true,
    });
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFormChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleFormBooleanChange(name: "isActive" | "isPrimary", value: boolean) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setSuccessMessage(file ? "Imagem escolhida. Agora clique em enviar." : null);
    setErrorMessage(null);
  }

  function updateMediaLocal(mediaId: string, changes: Partial<SectionMedia>) {
    setMedia((current) =>
      current.map((item) =>
        item.id === mediaId
          ? {
              ...item,
              ...changes,
            }
          : item
      )
    );
  }

  function resetAddForm() {
    const config = getSectionConfig(selectedSectionKey);

    setForm({
      ...emptyForm,
      mediaRole: config.defaultRole,
      isPrimary: config.isSingle,
      isActive: true,
    });
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUploadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventId) return;

    if (!selectedFile) {
      showError("Escolha uma imagem antes de enviar.");
      return;
    }

    try {
      setSavingUpload(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("sectionKey", selectedSectionKey);
      formData.append("mediaRole", form.mediaRole || selectedConfig.defaultRole);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("linkUrl", form.linkUrl);
      formData.append("buttonLabel", form.buttonLabel);
      formData.append("isActive", String(form.isActive));
      formData.append("isPrimary", String(form.isPrimary));

      const response = await fetch(
        `${backendUrl}/events/${eventId}/section-media/upload`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      resetAddForm();
      showSuccess("Imagem enviada para a seção selecionada.");
      await loadSectionMedia();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSavingUpload(false);
    }
  }

  async function handleLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventId) return;

    if (!form.imageUrl.trim()) {
      showError("Informe a URL da imagem.");
      return;
    }

    try {
      setSavingLink(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(`${backendUrl}/events/${eventId}/section-media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          sectionKey: selectedSectionKey,
          mediaRole: form.mediaRole || selectedConfig.defaultRole,
          imageUrl: form.imageUrl.trim(),
          title: form.title.trim() || null,
          description: form.description.trim() || null,
          linkUrl: form.linkUrl.trim() || null,
          buttonLabel: form.buttonLabel.trim() || null,
          isActive: form.isActive,
          isPrimary: form.isPrimary,
        }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      resetAddForm();
      showSuccess("Imagem adicionada por link.");
      await loadSectionMedia();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSavingLink(false);
    }
  }

  async function handleSaveMedia(item: SectionMedia) {
    if (!eventId) return;

    try {
      setSavingMediaId(item.id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(
        `${backendUrl}/events/${eventId}/section-media/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            sectionKey: item.sectionKey,
            mediaRole: item.mediaRole?.trim() || null,
            imageUrl: item.imageUrl.trim(),
            title: item.title?.trim() || null,
            description: item.description?.trim() || null,
            linkUrl: item.linkUrl?.trim() || null,
            buttonLabel: item.buttonLabel?.trim() || null,
            displayOrder: item.displayOrder,
            isActive: item.isActive,
            isPrimary: item.isPrimary,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setEditingMediaId(null);
      showSuccess("Imagem atualizada com sucesso.");
      await loadSectionMedia();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSavingMediaId(null);
    }
  }

  async function handleSetPrimary(item: SectionMedia) {
    if (!eventId) return;

    try {
      setSavingMediaId(item.id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(
        `${backendUrl}/events/${eventId}/section-media/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            isPrimary: true,
            isActive: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      showSuccess("Imagem definida como principal da seção.");
      await loadSectionMedia();
      await loadPageData();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSavingMediaId(null);
    }
  }

  async function handleRemoveMedia(item: SectionMedia) {
    if (!eventId) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja remover esta imagem?"
    );

    if (!confirmed) return;

    try {
      setRemovingMediaId(item.id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(
        `${backendUrl}/events/${eventId}/section-media/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      showSuccess("Imagem removida com sucesso.");
      await loadSectionMedia();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setRemovingMediaId(null);
    }
  }

  async function handleReorder(sectionKey: SectionKey, mediaId: string, direction: "up" | "down") {
    if (!eventId) return;

    const sectionItems = groupedMedia[sectionKey] || [];
    const currentIndex = sectionItems.findIndex((item) => item.id === mediaId);
    if (currentIndex < 0) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sectionItems.length) return;

    const nextItems = [...sectionItems];
    const current = nextItems[currentIndex];
    const target = nextItems[targetIndex];

    nextItems[currentIndex] = target;
    nextItems[targetIndex] = current;

    const normalizedItems = nextItems.map((item, index) => ({
      id: item.id,
      displayOrder: index + 1,
    }));

    try {
      setReorderingSectionKey(sectionKey);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      const response = await fetch(
        `${backendUrl}/events/${eventId}/section-media/reorder`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            items: normalizedItems,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      showSuccess("Ordem da seção atualizada.");
      await loadSectionMedia();
    } catch (error) {
      showError(getErrorMessage(error));
      await loadSectionMedia();
    } finally {
      setReorderingSectionKey(null);
    }
  }

  async function handleToggleSection(sectionKey: SectionKey, active: boolean) {
    if (!eventId) return;

    const sectionItems = groupedMedia[sectionKey] || [];

    if (sectionItems.length === 0) {
      showError("Cadastre pelo menos uma imagem antes de ligar ou ocultar esta seção.");
      return;
    }

    try {
      setTogglingSectionKey(sectionKey);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = getAuthToken();
      const backendUrl = getBackendUrl();

      for (const item of sectionItems) {
        const response = await fetch(
          `${backendUrl}/events/${eventId}/section-media/${item.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              isActive: active,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(await readApiError(response));
        }
      }

      showSuccess(active ? "Seção ativada no site." : "Seção ocultada do site.");
      await loadSectionMedia();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setTogglingSectionKey(null);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (errorMessage && !event) {
    return <ErrorState message={errorMessage} onRetry={loadPageData} />;
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
                  <Pill tone="dark">Imagens e seções do site</Pill>
                  <Pill tone={event?.status === "PUBLISHED" ? "green" : "gold"}>
                    {statusLabel(event?.status)}
                  </Pill>
                </div>

                <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  Controle visual completo do evento
                </h1>

                <p className="mt-5 max-w-3xl text-base leading-8 text-white/68">
                  Escolha quais blocos entram no site público e coloque cada foto no
                  lugar certo: convite, capa, casal, galeria, local, hospedagem,
                  presentes e muito mais.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={panelPath}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Voltar ao painel
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

                  <button
                    type="button"
                    onClick={loadPageData}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Atualizar
                  </button>
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
                  {coverMediaUrl ? (
                    <img
                      src={coverMediaUrl}
                      alt="Imagem principal atual"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
                      Capa ainda não configurada
                    </div>
                  )}

                  <div className="absolute left-4 top-4">
                    <Pill tone="dark">Capa atual</Pill>
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
                      Mídias
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {totalMedia} total
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d6a74f]">
                      Ativas
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {totalActive} no site
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[28px] border border-white/12 bg-white/10 p-5 text-sm leading-6 text-white/65 backdrop-blur">
                <strong className="text-white">Regra visual:</strong> cada imagem tem
                uma função. Evite repetir a mesma foto em todos os blocos. Use a
                galeria apenas como álbum principal.
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-[34px] border border-[#eadfce] bg-white/75 p-4 shadow-[0_20px_70px_rgba(65,45,23,0.08)] backdrop-blur lg:grid-cols-3">
          {[
            ["1", "Escolha o bloco", "Clique em convite, capa, casal, galeria, local, hospedagem ou presentes."],
            ["2", "Envie a imagem", "Suba uma foto do computador ou cole uma URL externa."],
            ["3", "Ligue ou oculte", "Use ativo/inativo para decidir se aquela seção aparece no site."],
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
                <Pill tone="gold">Mapa do site</Pill>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                  Blocos visuais
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#76695f]">
                  Selecione o bloco que você quer preencher ou organizar.
                </p>
              </div>

              <div className="max-h-[760px] space-y-3 overflow-y-auto p-4">
                {SECTION_CONFIGS.map((config) => {
                  const items = groupedMedia[config.key] || [];
                  const activeItems = items.filter((item) => item.isActive);
                  const isSelected = selectedSectionKey === config.key;
                  const sectionIsActive = activeItems.length > 0;
                  const primary = items.find((item) => item.isPrimary) || items[0];
                  const thumbnail = buildAssetUrl(primary?.imageUrl);

                  return (
                    <button
                      key={config.key}
                      type="button"
                      onClick={() => selectSection(config.key)}
                      className={`w-full overflow-hidden rounded-[24px] border text-left transition hover:-translate-y-0.5 ${
                        isSelected
                          ? "border-[#8f6a16] bg-[#fff4d8] shadow-[0_14px_38px_rgba(143,106,22,0.14)]"
                          : "border-[#eadfce] bg-[#fffaf3] hover:border-[#d6b06c]"
                      }`}
                    >
                      <div className="grid grid-cols-[76px_1fr] gap-3 p-3">
                        <div className="overflow-hidden rounded-2xl bg-[#eadfce]">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={config.title}
                              className="h-[76px] w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-[76px] items-center justify-center text-2xl">
                              ✦
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2">
                            <Pill tone={sectionIsActive ? "green" : "muted"}>
                              {sectionIsActive ? "Ativo" : "Sem mídia"}
                            </Pill>
                            <Pill tone="muted">{items.length}</Pill>
                          </div>

                          <p className="mt-2 line-clamp-1 text-sm font-black text-[#241c15]">
                            {config.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#76695f]">
                            {config.recommended}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="overflow-hidden rounded-[36px] border border-[#eadfce] bg-white shadow-[0_22px_80px_rgba(65,45,23,0.09)]">
              <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
                <div className="border-b border-[#eadfce] bg-[linear-gradient(135deg,#fffaf3,#f1e4d1)] p-6 lg:border-b-0 lg:border-r">
                  <div className="flex flex-wrap gap-3">
                    <Pill tone="gold">{selectedConfig.eyebrow}</Pill>
                    <Pill tone="muted">{selectedConfig.key}</Pill>
                  </div>

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {selectedConfig.title}
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#76695f]">
                    {selectedConfig.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill tone="muted">{selectedConfig.recommended}</Pill>
                    <Pill tone={selectedConfig.isSingle ? "gold" : "muted"}>
                      {selectedConfig.isSingle ? "imagem única" : "várias imagens"}
                    </Pill>
                  </div>
                </div>

                <div className="bg-[#241c15] p-6 text-white">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d6a74f]">
                    Status da seção
                  </p>
                  <p className="mt-2 text-3xl font-semibold">
                    {selectedSectionMedia.length}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    imagem{selectedSectionMedia.length === 1 ? "" : "s"} cadastrada
                    {selectedSectionMedia.length === 1 ? "" : "s"}
                  </p>

                  <div className="mt-5 grid gap-2">
                    <SecondaryButton
                      type="button"
                      onClick={() => handleToggleSection(selectedSectionKey, true)}
                      disabled={
                        selectedSectionMedia.length === 0 ||
                        togglingSectionKey === selectedSectionKey
                      }
                      className="border-white/15 bg-white/10 text-white hover:bg-white/15"
                    >
                      Incluir no site
                    </SecondaryButton>

                    <DangerButton
                      type="button"
                      onClick={() => handleToggleSection(selectedSectionKey, false)}
                      disabled={
                        selectedSectionMedia.length === 0 ||
                        togglingSectionKey === selectedSectionKey
                      }
                      className="border-red-300/20 bg-red-400/10 text-red-100 hover:bg-red-400/15"
                    >
                      Não incluir
                    </DangerButton>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[36px] border border-[#eadfce] bg-white shadow-[0_22px_80px_rgba(65,45,23,0.09)]">
              <div className="border-b border-[#eadfce] p-5">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f3e7d8] p-1">
                  <button
                    type="button"
                    onClick={() => setActiveMode("upload")}
                    className={`rounded-xl px-3 py-2 text-sm font-black transition ${
                      activeMode === "upload"
                        ? "bg-white text-[#8f6a16] shadow-sm"
                        : "text-[#76695f] hover:bg-white/50"
                    }`}
                  >
                    Enviar foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode("link")}
                    className={`rounded-xl px-3 py-2 text-sm font-black transition ${
                      activeMode === "link"
                        ? "bg-white text-[#8f6a16] shadow-sm"
                        : "text-[#76695f] hover:bg-white/50"
                    }`}
                  >
                    Usar link
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeMode === "upload" ? (
                  <form onSubmit={handleUploadSubmit} className="space-y-5">
                    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full overflow-hidden rounded-[30px] border border-dashed border-[#d4c0a1] bg-[#fffaf3] p-5 text-center transition hover:border-[#8f6a16] hover:bg-[#fff7e9]"
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
                                  alt="Prévia da imagem selecionada"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-4 text-left">
                                <p className="text-sm font-black text-[#241c15]">
                                  {selectedFile?.name}
                                </p>
                                {selectedFile ? (
                                  <p className="mt-1 text-xs text-[#76695f]">
                                    {formatFileSize(selectedFile.size)}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="py-10">
                              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-[0_14px_40px_rgba(143,106,22,0.12)]">
                                📷
                              </div>
                              <p className="mt-5 text-lg font-black text-[#241c15]">
                                Clique para escolher uma imagem
                              </p>
                              <p className="mt-2 text-sm leading-6 text-[#76695f]">
                                JPG, PNG ou WEBP até 5MB.
                              </p>
                            </div>
                          )}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <FieldLabel label="Função da imagem" hint={selectedConfig.roleHint}>
                          <TextInput
                            name="mediaRole"
                            value={form.mediaRole}
                            onChange={handleFormChange}
                            placeholder={selectedConfig.defaultRole}
                          />
                        </FieldLabel>

                        <FieldLabel label="Título">
                          <TextInput
                            name="title"
                            value={form.title}
                            onChange={handleFormChange}
                            placeholder="Ex.: Foto principal do casal"
                          />
                        </FieldLabel>

                        <FieldLabel label="Legenda / descrição">
                          <TextArea
                            name="description"
                            value={form.description}
                            onChange={handleFormChange}
                            placeholder="Texto opcional para explicar esta imagem."
                            rows={3}
                          />
                        </FieldLabel>
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-[26px] border border-[#eadfce] bg-[#fffaf3] p-4 md:grid-cols-2">
                      <label className="flex items-start gap-3 text-sm leading-6 text-[#76695f]">
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(event) =>
                            handleFormBooleanChange("isActive", event.target.checked)
                          }
                          className="mt-1 h-4 w-4 rounded border-[#cbb898] text-[#8f6a16]"
                        />
                        <span>
                          <strong className="text-[#241c15]">Incluir no site.</strong>
                          <br />
                          Se desligar, a imagem fica salva, mas oculta.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 text-sm leading-6 text-[#76695f]">
                        <input
                          type="checkbox"
                          checked={form.isPrimary}
                          onChange={(event) =>
                            handleFormBooleanChange("isPrimary", event.target.checked)
                          }
                          className="mt-1 h-4 w-4 rounded border-[#cbb898] text-[#8f6a16]"
                        />
                        <span>
                          <strong className="text-[#241c15]">Imagem principal.</strong>
                          <br />
                          Use para capa, convite, local ou imagem destaque.
                        </span>
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <PrimaryButton
                        type="submit"
                        disabled={savingUpload || !selectedFile}
                        className="min-w-[220px]"
                      >
                        {savingUpload ? "Enviando..." : "Enviar para esta seção"}
                      </PrimaryButton>

                      <SecondaryButton type="button" onClick={resetAddForm}>
                        Limpar campos
                      </SecondaryButton>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleLinkSubmit} className="space-y-5">
                    <div className="grid gap-5 lg:grid-cols-2">
                      <div className="space-y-4">
                        <FieldLabel label="URL da imagem">
                          <TextInput
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleFormChange}
                            placeholder="https://..."
                          />
                        </FieldLabel>

                        <FieldLabel label="Função da imagem" hint={selectedConfig.roleHint}>
                          <TextInput
                            name="mediaRole"
                            value={form.mediaRole}
                            onChange={handleFormChange}
                            placeholder={selectedConfig.defaultRole}
                          />
                        </FieldLabel>

                        <FieldLabel label="Título">
                          <TextInput
                            name="title"
                            value={form.title}
                            onChange={handleFormChange}
                            placeholder="Ex.: Foto principal do casal"
                          />
                        </FieldLabel>
                      </div>

                      <div className="space-y-4">
                        <FieldLabel label="Legenda / descrição">
                          <TextArea
                            name="description"
                            value={form.description}
                            onChange={handleFormChange}
                            placeholder="Texto opcional para explicar esta imagem."
                            rows={4}
                          />
                        </FieldLabel>

                        <FieldLabel label="Link opcional">
                          <TextInput
                            name="linkUrl"
                            value={form.linkUrl}
                            onChange={handleFormChange}
                            placeholder="Ex.: link do hotel, WhatsApp ou mapa"
                          />
                        </FieldLabel>

                        <FieldLabel label="Texto do botão opcional">
                          <TextInput
                            name="buttonLabel"
                            value={form.buttonLabel}
                            onChange={handleFormChange}
                            placeholder="Ex.: Ver localização"
                          />
                        </FieldLabel>
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-[26px] border border-[#eadfce] bg-[#fffaf3] p-4 md:grid-cols-2">
                      <label className="flex items-start gap-3 text-sm leading-6 text-[#76695f]">
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(event) =>
                            handleFormBooleanChange("isActive", event.target.checked)
                          }
                          className="mt-1 h-4 w-4 rounded border-[#cbb898] text-[#8f6a16]"
                        />
                        <span>
                          <strong className="text-[#241c15]">Incluir no site.</strong>
                          <br />
                          Se desligar, a imagem fica salva, mas oculta.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 text-sm leading-6 text-[#76695f]">
                        <input
                          type="checkbox"
                          checked={form.isPrimary}
                          onChange={(event) =>
                            handleFormBooleanChange("isPrimary", event.target.checked)
                          }
                          className="mt-1 h-4 w-4 rounded border-[#cbb898] text-[#8f6a16]"
                        />
                        <span>
                          <strong className="text-[#241c15]">Imagem principal.</strong>
                          <br />
                          Use para capa, convite, local ou imagem destaque.
                        </span>
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <PrimaryButton type="submit" disabled={savingLink}>
                        {savingLink ? "Salvando..." : "Adicionar por link"}
                      </PrimaryButton>

                      <SecondaryButton type="button" onClick={resetAddForm}>
                        Limpar campos
                      </SecondaryButton>
                    </div>
                  </form>
                )}
              </div>
            </section>

            <section className="rounded-[36px] border border-[#eadfce] bg-white p-5 shadow-[0_22px_80px_rgba(65,45,23,0.09)] sm:p-6">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <Pill tone="gold">Imagens cadastradas</Pill>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {selectedConfig.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#76695f]">
                    Edite, oculte, remova ou reorganize as imagens deste bloco.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fff8ef] px-4 py-3 text-sm font-black text-[#8f6a16]">
                  {selectedSectionMedia.length} imagem
                  {selectedSectionMedia.length === 1 ? "" : "s"}
                </div>
              </div>

              {selectedSectionMedia.length === 0 ? (
                <div className="flex min-h-[360px] items-center justify-center rounded-[34px] border border-dashed border-[#d5c4aa] bg-[radial-gradient(circle_at_top,#fffaf3_0%,#f2e7d7_100%)] p-8 text-center">
                  <div>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-[0_18px_50px_rgba(143,106,22,0.14)]">
                      ✦
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[#221b14]">
                      Este bloco ainda não tem imagem
                    </h3>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#76695f]">
                      Use o formulário acima para cadastrar a imagem correta deste
                      bloco. Enquanto não tiver mídia ativa, essa seção não deve
                      aparecer completa no site público.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {selectedSectionMedia.map((item, index) => {
                    const assetUrl = buildAssetUrl(item.imageUrl);
                    const isEditing = editingMediaId === item.id;
                    const isSaving = savingMediaId === item.id;
                    const isRemoving = removingMediaId === item.id;

                    return (
                      <article
                        key={item.id}
                        className={`group overflow-hidden rounded-[32px] border bg-[#fffaf3] shadow-[0_16px_50px_rgba(65,45,23,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(65,45,23,0.13)] ${
                          item.isPrimary ? "border-[#8f6a16]" : "border-[#eadfce]"
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-[#eadfce]">
                          {assetUrl ? (
                            <img
                              src={assetUrl}
                              alt={mediaName(item, index)}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-[#76695f]">
                              Imagem sem URL
                            </div>
                          )}

                          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white backdrop-blur">
                              {index + 1}
                            </span>

                            {item.isPrimary ? (
                              <span className="rounded-full bg-[#8f6a16] px-3 py-1 text-xs font-black text-white shadow">
                                Principal
                              </span>
                            ) : null}

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black shadow ${
                                item.isActive
                                  ? "bg-emerald-600 text-white"
                                  : "bg-neutral-700 text-white"
                              }`}
                            >
                              {item.isActive ? "Ativa" : "Oculta"}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          {!isEditing ? (
                            <>
                              <div className="min-h-[92px]">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9d856c]">
                                  {item.mediaRole || selectedConfig.defaultRole}
                                </p>

                                <h3 className="mt-2 line-clamp-2 text-xl font-semibold tracking-tight text-[#241c15]">
                                  {mediaName(item, index)}
                                </h3>

                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#76695f]">
                                  {item.description?.trim() ||
                                    "Sem legenda cadastrada."}
                                </p>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-2">
                                <PrimaryButton
                                  type="button"
                                  onClick={() => setEditingMediaId(item.id)}
                                  className="shadow-none"
                                >
                                  Editar
                                </PrimaryButton>

                                <SecondaryButton
                                  type="button"
                                  onClick={() => handleSetPrimary(item)}
                                  disabled={isSaving || item.isPrimary}
                                >
                                  {item.isPrimary ? "Principal" : "Principal"}
                                </SecondaryButton>

                                <SecondaryButton
                                  type="button"
                                  onClick={() =>
                                    handleReorder(selectedSectionKey, item.id, "up")
                                  }
                                  disabled={
                                    index === 0 ||
                                    reorderingSectionKey === selectedSectionKey
                                  }
                                >
                                  Subir
                                </SecondaryButton>

                                <SecondaryButton
                                  type="button"
                                  onClick={() =>
                                    handleReorder(selectedSectionKey, item.id, "down")
                                  }
                                  disabled={
                                    index === selectedSectionMedia.length - 1 ||
                                    reorderingSectionKey === selectedSectionKey
                                  }
                                >
                                  Descer
                                </SecondaryButton>

                                <DangerButton
                                  type="button"
                                  onClick={() => handleRemoveMedia(item)}
                                  disabled={isRemoving}
                                  className="col-span-2"
                                >
                                  {isRemoving ? "Removendo..." : "Remover imagem"}
                                </DangerButton>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-4">
                              <FieldLabel label="Função">
                                <TextInput
                                  value={item.mediaRole ?? ""}
                                  onChange={(event) =>
                                    updateMediaLocal(item.id, {
                                      mediaRole: event.target.value,
                                    })
                                  }
                                  placeholder={selectedConfig.defaultRole}
                                />
                              </FieldLabel>

                              <FieldLabel label="Título">
                                <TextInput
                                  value={item.title ?? ""}
                                  onChange={(event) =>
                                    updateMediaLocal(item.id, {
                                      title: event.target.value,
                                    })
                                  }
                                  placeholder="Título da imagem"
                                />
                              </FieldLabel>

                              <FieldLabel label="Legenda">
                                <TextArea
                                  value={item.description ?? ""}
                                  onChange={(event) =>
                                    updateMediaLocal(item.id, {
                                      description: event.target.value,
                                    })
                                  }
                                  placeholder="Legenda da imagem"
                                  rows={3}
                                />
                              </FieldLabel>

                              <div className="grid gap-3 rounded-2xl border border-[#eadfce] bg-white p-4 md:grid-cols-2">
                                <label className="flex items-start gap-3 text-sm leading-6 text-[#76695f]">
                                  <input
                                    type="checkbox"
                                    checked={item.isActive}
                                    onChange={(event) =>
                                      updateMediaLocal(item.id, {
                                        isActive: event.target.checked,
                                      })
                                    }
                                    className="mt-1 h-4 w-4 rounded border-[#cbb898] text-[#8f6a16]"
                                  />
                                  <span>Incluir no site</span>
                                </label>

                                <label className="flex items-start gap-3 text-sm leading-6 text-[#76695f]">
                                  <input
                                    type="checkbox"
                                    checked={item.isPrimary}
                                    onChange={(event) =>
                                      updateMediaLocal(item.id, {
                                        isPrimary: event.target.checked,
                                      })
                                    }
                                    className="mt-1 h-4 w-4 rounded border-[#cbb898] text-[#8f6a16]"
                                  />
                                  <span>Imagem principal</span>
                                </label>
                              </div>

                              <details className="rounded-2xl border border-[#eadfce] bg-white p-4">
                                <summary className="cursor-pointer text-[11px] font-black uppercase tracking-[0.18em] text-[#9d856c]">
                                  Campos técnicos / opcionais
                                </summary>

                                <div className="mt-4 space-y-4">
                                  <FieldLabel label="URL da imagem">
                                    <TextInput
                                      value={item.imageUrl}
                                      onChange={(event) =>
                                        updateMediaLocal(item.id, {
                                          imageUrl: event.target.value,
                                        })
                                      }
                                    />
                                  </FieldLabel>

                                  <FieldLabel label="Link opcional">
                                    <TextInput
                                      value={item.linkUrl ?? ""}
                                      onChange={(event) =>
                                        updateMediaLocal(item.id, {
                                          linkUrl: event.target.value,
                                        })
                                      }
                                      placeholder="Ex.: mapa, WhatsApp, Instagram"
                                    />
                                  </FieldLabel>

                                  <FieldLabel label="Texto do botão">
                                    <TextInput
                                      value={item.buttonLabel ?? ""}
                                      onChange={(event) =>
                                        updateMediaLocal(item.id, {
                                          buttonLabel: event.target.value,
                                        })
                                      }
                                      placeholder="Ex.: Ver localização"
                                    />
                                  </FieldLabel>
                                </div>
                              </details>

                              <div className="grid grid-cols-2 gap-2">
                                <PrimaryButton
                                  type="button"
                                  onClick={() => handleSaveMedia(item)}
                                  disabled={isSaving}
                                  className="shadow-none"
                                >
                                  {isSaving ? "Salvando..." : "Salvar"}
                                </PrimaryButton>

                                <SecondaryButton
                                  type="button"
                                  onClick={() => {
                                    setEditingMediaId(null);
                                    void loadSectionMedia();
                                  }}
                                >
                                  Cancelar
                                </SecondaryButton>
                              </div>
                            </div>
                          )}

                          <p className="mt-4 text-xs leading-5 text-[#9d856c]">
                            Criada em {formatShortDate(item.createdAt)} • Ordem{" "}
                            {item.displayOrder}
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
      </div>
    </main>
  );
}
