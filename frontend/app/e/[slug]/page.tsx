"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type PublicEventResponse = {
  event?: {
    id?: string;
    name?: string;
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    slug?: string;
    status?: string;
  };
  rsvp?: {
    enabled?: boolean;
    lookupMode?: string;
  };
};

type GiftApiItem = {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  amount?: number;
  imageUrl?: string | null;
  purchaseUrl?: string | null;
  isActive?: boolean;
  isReserved?: boolean;
  isPurchased?: boolean;
  reservedByName?: string | null;
  reservedAt?: string | null;
  purchasedByName?: string | null;
  purchasedAt?: string | null;
};

type PublicEvent = {
  id: string;
  title: string;
  description: string;
  date?: string;
  location: string;
  slug: string;
  rsvpEnabled: boolean;
  rsvpLookupMode: string;
};

type Gift = {
  id: string;
  title: string;
  description: string;
  price?: number;
  isReserved: boolean;
  isPurchased: boolean;
  reservedByName?: string | null;
  purchasedByName?: string | null;
};

type PaymentResponse = {
  message?: string;
  payment?: {
    id?: string;
    status?: string;
  };
  gift?: {
    id?: string;
    isPurchased?: boolean;
    purchasedByName?: string | null;
  };
  paymentData?: {
    paymentMethod?: string;
    status?: string;
    checkoutUrl?: string | null;
    pixCode?: string | null;
    pixQrCode?: string | null;
    boletoUrl?: string | null;
    boletoBarcode?: string | null;
  };
};

type RsvpGuestResponse = {
  id?: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  status?: "INVITED" | "CONFIRMED" | "DECLINED";
  rsvpCode?: string | null;
  event?: {
    id?: string;
    name?: string;
    slug?: string | null;
  };
};

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3000";

function formatDate(date?: string) {
  if (!date) return "Data a definir";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "Data inválida";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

function formatMoney(value?: number) {
  if (value === undefined || value === null) return "Valor a consultar";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getCountdownParts(date?: string) {
  if (!date) {
    return [
      { label: "dias", value: "--" },
      { label: "horas", value: "--" },
      { label: "min", value: "--" },
      { label: "seg", value: "--" },
    ];
  }

  const eventDate = new Date(date).getTime();
  const now = Date.now();
  const diff = eventDate - now;

  if (Number.isNaN(eventDate) || diff <= 0) {
    return [
      { label: "dias", value: "00" },
      { label: "horas", value: "00" },
      { label: "min", value: "00" },
      { label: "seg", value: "00" },
    ];
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "dias", value: String(days).padStart(2, "0") },
    { label: "horas", value: String(hours).padStart(2, "0") },
    { label: "min", value: String(minutes).padStart(2, "0") },
    { label: "seg", value: String(seconds).padStart(2, "0") },
  ];
}

function normalizeEvent(data: PublicEventResponse, slug: string): PublicEvent | null {
  if (!data?.event) return null;

  return {
    id: String(data.event.id ?? slug),
    title: data.event.name ?? data.event.title ?? "Evento VivaLista",
    description: data.event.description ?? "Evento VivaLista",
    date: data.event.date,
    location: data.event.location ?? "Local a definir",
    slug: data.event.slug ?? slug,
    rsvpEnabled: Boolean(data.rsvp?.enabled),
    rsvpLookupMode: data.rsvp?.lookupMode ?? "CODE",
  };
}

function normalizeGift(item: GiftApiItem): Gift {
  return {
    id: String(item.id ?? ""),
    title: item.title ?? item.name ?? "Presente",
    description: item.description ?? "",
    price:
      typeof item.price === "number"
        ? item.price
        : typeof item.amount === "number"
        ? item.amount
        : undefined,
    isReserved: Boolean(item.isReserved),
    isPurchased: Boolean(item.isPurchased),
    reservedByName: item.reservedByName ?? null,
    purchasedByName: item.purchasedByName ?? null,
  };
}

function translateGuestStatus(status?: string) {
  if (status === "CONFIRMED") return "CONFIRMADO";
  if (status === "DECLINED") return "RECUSOU";
  return "CONVIDADO";
}

export default function EventPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const [rsvpCode, setRsvpCode] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState("");
  const [guest, setGuest] = useState<RsvpGuestResponse | null>(null);

  async function loadPage() {
    if (!slug) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const [eventRes, giftsRes] = await Promise.all([
        fetch(`${API}/events/public/${slug}`, { cache: "no-store" }),
        fetch(`${API}/events/public/${slug}/gifts`, { cache: "no-store" }),
      ]);

      if (!eventRes.ok) {
        throw new Error("Não foi possível carregar o evento.");
      }

      const eventJson: PublicEventResponse = await eventRes.json();
      const normalizedEvent = normalizeEvent(eventJson, slug);

      if (!normalizedEvent) {
        throw new Error("Evento não encontrado.");
      }

      const giftsJson = giftsRes.ok ? await giftsRes.json() : [];
      const rawGifts = Array.isArray(giftsJson)
        ? giftsJson
        : Array.isArray((giftsJson as { gifts?: unknown[] })?.gifts)
        ? (giftsJson as { gifts: unknown[] }).gifts
        : Array.isArray((giftsJson as { data?: unknown[] })?.data)
        ? (giftsJson as { data: unknown[] }).data
        : Array.isArray((giftsJson as { data?: { gifts?: unknown[] } })?.data?.gifts)
        ? (giftsJson as { data: { gifts: unknown[] } }).data.gifts
        : [];

      setEvent(normalizedEvent);
      setGifts((rawGifts as GiftApiItem[]).map(normalizeGift));
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível carregar a página do evento.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, [slug]);

  const countdown = useMemo(() => getCountdownParts(event?.date), [event?.date]);

  function openPaymentModal(gift: Gift) {
    setSelectedGift(gift);
    setBuyerName("");
    setBuyerEmail("");
    setBuyerPhone("");
    setPaymentMethod("PIX");
    setPaymentError("");
    setPaymentResult(null);
  }

  function closePaymentModal() {
    setSelectedGift(null);
    setBuyerName("");
    setBuyerEmail("");
    setBuyerPhone("");
    setPaymentMethod("PIX");
    setPaymentError("");
    setPaymentResult(null);
    setConfirmingPayment(false);
  }

  async function handleCreatePublicPayment() {
    if (!event || !selectedGift) return;

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      setPaymentError("Preencha nome, email e telefone.");
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError("");

      const response = await fetch(`${API}/payments/public/intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          giftId: selectedGift.id,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          buyerPhone: buyerPhone.trim(),
          paymentMethod,
          amount: selectedGift.price ?? 0,
        }),
      });

      const data: PaymentResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Não foi possível gerar o pagamento.");
      }

      setPaymentResult(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o pagamento.";

      setPaymentError(message);
    } finally {
      setPaymentLoading(false);
    }
  }

  async function reloadGifts() {
    if (!slug) return;

    try {
      const giftsRes = await fetch(`${API}/events/public/${slug}/gifts`, {
        cache: "no-store",
      });

      const giftsJson = giftsRes.ok ? await giftsRes.json() : [];
      const rawGifts = Array.isArray(giftsJson)
        ? giftsJson
        : Array.isArray((giftsJson as { gifts?: unknown[] })?.gifts)
        ? (giftsJson as { gifts: unknown[] }).gifts
        : Array.isArray((giftsJson as { data?: unknown[] })?.data)
        ? (giftsJson as { data: unknown[] }).data
        : Array.isArray((giftsJson as { data?: { gifts?: unknown[] } })?.data?.gifts)
        ? (giftsJson as { data: { gifts: unknown[] } }).data.gifts
        : [];

      setGifts((rawGifts as GiftApiItem[]).map(normalizeGift));
    } catch (error) {
      console.error(error);
    }
  }

  function copyPixCode() {
    const pixCode = paymentResult?.paymentData?.pixCode;

    if (!pixCode) return;

    navigator.clipboard.writeText(pixCode);
    window.alert("Código PIX copiado com sucesso.");
  }

  async function handleMockApprovePayment() {
    const paymentId = paymentResult?.payment?.id;

    if (!paymentId) {
      setPaymentError("Pagamento não encontrado para simular aprovação.");
      return;
    }

    try {
      setConfirmingPayment(true);
      setPaymentError("");

      const response = await fetch(`${API}/payments/public/mock/${paymentId}/paid`, {
        method: "POST",
      });

      const data: PaymentResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Não foi possível confirmar o pagamento.");
      }

      setPaymentResult(data);
      await reloadGifts();
      window.alert("Pagamento simulado como aprovado com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível confirmar o pagamento.";

      setPaymentError(message);
    } finally {
      setConfirmingPayment(false);
    }
  }

  async function handleLookupGuest() {
    if (!rsvpCode.trim()) {
      setRsvpError("Digite o código RSVP.");
      setRsvpSuccess("");
      setGuest(null);
      return;
    }

    try {
      setRsvpLoading(true);
      setRsvpError("");
      setRsvpSuccess("");
      setGuest(null);

      const response = await fetch(`${API}/rsvp/${rsvpCode.trim()}`, {
        method: "GET",
      });

      const data: RsvpGuestResponse = await response.json();

      if (!response.ok) {
        throw new Error("Convite não encontrado.");
      }

      setGuest(data);
      setRsvpSuccess("Convidado encontrado com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao buscar convidado.";

      setRsvpError(message);
      setRsvpSuccess("");
      setGuest(null);
    } finally {
      setRsvpLoading(false);
    }
  }

  async function handleRsvpAction(status: "CONFIRMED" | "DECLINED") {
    if (!guest?.rsvpCode) return;

    try {
      setRsvpLoading(true);
      setRsvpError("");
      setRsvpSuccess("");

      const response = await fetch(`${API}/rsvp/${guest.rsvpCode}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data: RsvpGuestResponse = await response.json();

      if (!response.ok) {
        throw new Error("Não foi possível atualizar a confirmação.");
      }

      setGuest(data);
      setRsvpSuccess(
        status === "CONFIRMED"
          ? "Presença confirmada com sucesso!"
          : "Presença recusada com sucesso!"
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a confirmação.";

      setRsvpError(message);
      setRsvpSuccess("");
    } finally {
      setRsvpLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf8f5]">
        <p className="text-lg text-zinc-600">Carregando evento...</p>
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf8f5] px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Erro ao carregar</h1>
          <p className="mt-3 text-zinc-600">
            {errorMessage || "Evento não encontrado."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcf8f5] text-zinc-800">
      <header className="sticky top-0 z-50 border-b border-[#e9dfd8] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src="/logo-vivalista.png"
              alt="VivaLista"
              width={150}
              height={52}
              className="h-auto w-[120px] md:w-[150px]"
              priority
            />
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#inicio" className="text-sm text-zinc-600 transition hover:text-zinc-950">
              Início
            </a>
            <a href="#detalhes" className="text-sm text-zinc-600 transition hover:text-zinc-950">
              Detalhes
            </a>
            <a href="#presentes" className="text-sm text-zinc-600 transition hover:text-zinc-950">
              Presentes
            </a>
            <a href="#confirmacao" className="text-sm text-zinc-600 transition hover:text-zinc-950">
              Confirmação
            </a>
          </nav>

          <a
            href="#presentes"
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:scale-[1.02]"
          >
            Ver presentes
          </a>
        </div>
      </header>

      <section
        id="inicio"
        className="relative overflow-hidden bg-[linear-gradient(135deg,#111827,#09090b)]"
      >
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-rose-300/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-amber-200/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-100">
                  Página pública do evento
                </p>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.02] text-white md:text-6xl xl:text-7xl">
                {event.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 md:text-xl">
                {event.description}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#confirmacao"
                  className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 transition hover:scale-[1.02]"
                >
                  Confirmar presença
                </a>

                <a
                  href="#presentes"
                  className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
                >
                  Ver lista de presentes
                </a>
              </div>

              <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-100">
                    Data
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/90">
                    {formatDate(event.date)}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-100">
                    Local
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/90">
                    {event.location}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-100">
                    RSVP
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/90">
                    {event.rsvpEnabled ? "Ativado" : "Desativado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pl-6">
              <div className="overflow-hidden rounded-[34px] border border-white/15 bg-white/10 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.07))] p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[26px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-500">
                        Data
                      </p>
                      <p className="mt-4 text-lg font-semibold leading-8 text-zinc-900">
                        {formatDate(event.date)}
                      </p>
                    </div>

                    <div className="rounded-[26px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-500">
                        Local
                      </p>
                      <p className="mt-4 text-lg font-semibold leading-8 text-zinc-900">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[28px] bg-[linear-gradient(135deg,#111827,#09090b)] p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-200">
                          Contagem regressiva
                        </p>
                        <p className="mt-2 text-sm text-white/65">
                          O grande dia está chegando
                        </p>
                      </div>

                      <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 sm:block">
                        RSVP: {event.rsvpLookupMode}
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-4 gap-3">
                      {countdown.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center"
                        >
                          <div className="text-2xl font-semibold md:text-3xl">
                            {item.value}
                          </div>
                          <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/65">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <a
                      href="#confirmacao"
                      className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                    >
                      Confirmar presença
                    </a>

                    <a
                      href="#presentes"
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Ver presentes
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="detalhes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">
            Detalhes
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Informações do evento
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            Dados carregados diretamente da API pública do VivaLista.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[34px] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">
                  Nome
                </p>
                <p className="mt-2 text-lg leading-7 text-zinc-700">
                  {event.title}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">
                  Descrição
                </p>
                <p className="mt-2 text-lg leading-7 text-zinc-700">
                  {event.description}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">
                  Data e hora
                </p>
                <p className="mt-2 text-lg leading-7 text-zinc-700">
                  {formatDate(event.date)}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">
                  Local
                </p>
                <p className="mt-2 text-lg leading-7 text-zinc-700">
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[34px] bg-zinc-950 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
                  Status
                </p>
                <p className="mt-2 text-lg leading-7 text-white/90">
                  PUBLISHED
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
                  Slug
                </p>
                <p className="mt-2 text-lg leading-7 text-white/90">
                  {event.slug}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
                  RSVP habilitado
                </p>
                <p className="mt-2 text-lg leading-7 text-white/90">
                  {event.rsvpEnabled ? "Sim" : "Não"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
                  Modo de busca RSVP
                </p>
                <p className="mt-2 text-lg leading-7 text-white/90">
                  {event.rsvpLookupMode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="presentes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">
            Presentes
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Lista de presentes
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            Presentes reais carregados da API pública do evento.
          </p>
        </div>

        {gifts.length === 0 ? (
          <div className="rounded-[34px] bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h3 className="text-2xl font-semibold text-zinc-900">
              Nenhum presente cadastrado ainda
            </h3>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-zinc-600">
              Assim que houver presentes cadastrados para este evento, eles aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gifts.map((gift) => (
              <article
                key={gift.id}
                className="rounded-[30px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              >
                <div
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${
                    gift.isPurchased
                      ? "bg-emerald-50 text-emerald-600"
                      : gift.isReserved
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {gift.isPurchased
                    ? "COMPRADO"
                    : gift.isReserved
                    ? "RESERVADO"
                    : "DISPONÍVEL"}
                </div>

                <h3 className="mt-4 text-xl font-semibold text-zinc-900">
                  {gift.title}
                </h3>

                <p className="mt-3 min-h-[48px] text-sm leading-7 text-zinc-600">
                  {gift.description || "Um presente especial para celebrar este momento."}
                </p>

                {gift.isPurchased && gift.purchasedByName ? (
                  <p className="mt-3 text-sm font-medium text-emerald-700">
                    Comprado por: {gift.purchasedByName}
                  </p>
                ) : gift.isReserved && gift.reservedByName ? (
                  <p className="mt-3 text-sm font-medium text-amber-700">
                    Reservado por: {gift.reservedByName}
                  </p>
                ) : null}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold text-rose-600">
                    {formatMoney(gift.price)}
                  </span>

                  <button
                    type="button"
                    disabled={gift.isReserved || gift.isPurchased}
                    onClick={() => openPaymentModal(gift)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      gift.isReserved || gift.isPurchased
                        ? "cursor-not-allowed bg-zinc-300 text-zinc-600"
                        : "bg-zinc-900 text-white hover:scale-[1.02]"
                    }`}
                  >
                    {gift.isPurchased
                      ? "Comprado"
                      : gift.isReserved
                      ? "Reservado"
                      : "Presentear"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        id="confirmacao"
        className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-black py-20 text-white"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-rose-200">
              Confirmação
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Confirme sua presença
            </h2>
            <p className="mt-4 text-base leading-7 text-white/75 md:text-lg">
              Digite seu código RSVP para localizar seu convite e responder sua presença.
            </p>
          </div>

          <div className="mx-auto max-w-4xl rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-semibold">Sua presença é muito importante</h3>
            <p className="mt-4 max-w-2xl leading-8 text-white/75">
              Use o código recebido no convite para confirmar ou recusar sua presença.
            </p>

            <div className="mt-8 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/90">
                  Código RSVP
                </label>
                <input
                  type="text"
                  value={rsvpCode}
                  onChange={(e) => setRsvpCode(e.target.value.toUpperCase())}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-white/30"
                  placeholder="Digite seu código"
                />
              </div>

              <button
                type="button"
                onClick={handleLookupGuest}
                disabled={rsvpLoading}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {rsvpLoading ? "Buscando..." : "Buscar convite"}
              </button>

              {rsvpError ? (
                <div className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">
                  {rsvpError}
                </div>
              ) : null}

              {rsvpSuccess ? (
                <div className="rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200">
                  {rsvpSuccess}
                </div>
              ) : null}

              {guest ? (
                <div className="mt-4 rounded-3xl border border-white/10 bg-white/10 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-200">
                    Convidado encontrado
                  </p>

                  <p className="mt-4 text-xl font-semibold text-white">
                    {guest.name}
                  </p>

                  <p className="mt-2 text-white/75">
                    Status atual: <strong>{translateGuestStatus(guest.status)}</strong>
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => handleRsvpAction("CONFIRMED")}
                      disabled={rsvpLoading}
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-zinc-300"
                    >
                      {rsvpLoading ? "Processando..." : "Confirmar presença"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRsvpAction("DECLINED")}
                      disabled={rsvpLoading}
                      className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {rsvpLoading ? "Processando..." : "Não poderei comparecer"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {selectedGift ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
                  Pagamento
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-zinc-900">
                  {selectedGift.title}
                </h3>
                <p className="mt-2 text-zinc-600">
                  Valor: <strong>{formatMoney(selectedGift.price)}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={closePaymentModal}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
              >
                Fechar
              </button>
            </div>

            {!paymentResult ? (
              <div className="mt-8 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                    placeholder="Digite seu nome"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Seu email
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                    placeholder="Digite seu email"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Seu telefone
                  </label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                    placeholder="Digite seu telefone"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Forma de pagamento
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                  >
                    <option value="PIX">PIX</option>
                    <option value="CARD">Cartão</option>
                    <option value="BOLETO">Boleto</option>
                  </select>
                </div>

                {paymentError ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {paymentError}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleCreatePublicPayment}
                  disabled={paymentLoading}
                  className="mt-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-zinc-400"
                >
                  {paymentLoading ? "Gerando pagamento..." : "Gerar pagamento"}
                </button>
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                <div className="rounded-3xl bg-emerald-50 px-5 py-4 text-emerald-700">
                  <p className="font-semibold">{paymentResult.message}</p>
                  <p className="mt-1 text-sm">
                    Status: {paymentResult.payment?.status || paymentResult.paymentData?.status || "PENDING"}
                  </p>
                </div>

                {paymentResult.paymentData?.pixCode ? (
                  <div className="rounded-3xl border border-zinc-200 p-5">
                    <h4 className="text-lg font-semibold text-zinc-900">Pagamento via PIX</h4>
                    <p className="mt-2 text-sm leading-7 text-zinc-600">
                      Use o código abaixo para pagar no aplicativo do seu banco.
                    </p>

                    <textarea
                      readOnly
                      value={paymentResult.paymentData.pixCode}
                      className="mt-4 min-h-[140px] w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 outline-none"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={copyPixCode}
                        className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                      >
                        Copiar código PIX
                      </button>

                      <button
                        type="button"
                        onClick={handleMockApprovePayment}
                        disabled={confirmingPayment}
                        className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-emerald-300"
                      >
                        {confirmingPayment
                          ? "Confirmando..."
                          : "Simular pagamento aprovado"}
                      </button>

                      <button
                        type="button"
                        onClick={closePaymentModal}
                        className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                ) : null}

                {paymentResult.paymentData?.checkoutUrl ? (
                  <div className="rounded-3xl border border-zinc-200 p-5">
                    <h4 className="text-lg font-semibold text-zinc-900">Pagamento com cartão</h4>
                    <p className="mt-2 text-sm leading-7 text-zinc-600">
                      Clique no botão abaixo para continuar o pagamento.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={paymentResult.paymentData.checkoutUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                      >
                        Ir para checkout
                      </a>

                      <button
                        type="button"
                        onClick={handleMockApprovePayment}
                        disabled={confirmingPayment}
                        className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-emerald-300"
                      >
                        {confirmingPayment
                          ? "Confirmando..."
                          : "Simular pagamento aprovado"}
                      </button>
                    </div>
                  </div>
                ) : null}

                {paymentResult.paymentData?.boletoUrl ? (
                  <div className="rounded-3xl border border-zinc-200 p-5">
                    <h4 className="text-lg font-semibold text-zinc-900">Pagamento com boleto</h4>
                    <p className="mt-2 text-sm leading-7 text-zinc-600">
                      Clique no botão abaixo para abrir o boleto.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={paymentResult.paymentData.boletoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                      >
                        Abrir boleto
                      </a>

                      <button
                        type="button"
                        onClick={handleMockApprovePayment}
                        disabled={confirmingPayment}
                        className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-emerald-300"
                      >
                        {confirmingPayment
                          ? "Confirmando..."
                          : "Simular pagamento aprovado"}
                      </button>
                    </div>
                  </div>
                ) : null}

                {paymentError ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {paymentError}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={async () => {
                    closePaymentModal();
                    await reloadGifts();
                  }}
                  className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  Atualizar presentes
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}