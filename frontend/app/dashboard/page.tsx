"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../src/lib/api";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | string;

type EventItem = {
  id: string;
  name: string;
  slug?: string | null;
  status?: EventStatus | null;
  date?: string | null;
  location?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type PaymentSettingsResponse = {
  organization?: {
    paymentGateway?: string | null;
    paymentAccountId?: string | null;
    paymentAccountStatus?: string | null;
    paymentAccountReady?: boolean | null;
  };
};

type MetricTone = "gold" | "purple" | "green" | "rose";

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#f5d675_0%,#b47a16_45%,#4b2778_100%)] shadow-[0_18px_34px_rgba(75,39,120,0.22)]">
        <div className="absolute inset-[3px] rounded-[14px] border border-white/35" />
        <span className="text-xl">🎁</span>
      </div>
      <div>
        <p className="text-lg font-semibold tracking-tight text-[#231735]">VivaLista</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#9a7a35]">
          painel premium
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[34px] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(61,42,84,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function PremiumButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "soft" | "dark";
}) {
  const variantClass =
    variant === "primary"
      ? "bg-[linear-gradient(135deg,#5d35a1_0%,#2b183f_55%,#b88419_100%)] text-white shadow-[0_18px_40px_rgba(93,53,161,0.22)] hover:shadow-[0_22px_48px_rgba(93,53,161,0.30)]"
      : variant === "dark"
        ? "bg-[#261735] text-white shadow-[0_16px_36px_rgba(38,23,53,0.18)] hover:bg-[#1d112a]"
        : "border border-[#eadfca] bg-white/80 text-[#3d2a54] shadow-[0_12px_30px_rgba(61,42,84,0.06)] hover:bg-[#fbf7ef]";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${variantClass}`}
    >
      {children}
    </Link>
  );
}

function ActionCard({
  eyebrow,
  title,
  description,
  href,
  cta,
  icon,
  primary = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: string;
  primary?: boolean;
}) {
  const shellClass = primary
    ? "border-white/30 bg-[linear-gradient(135deg,#4b2778_0%,#241433_58%,#b98519_100%)] text-white shadow-[0_28px_80px_rgba(75,39,120,0.24)]"
    : "border-white/70 bg-white/82 text-[#241433] shadow-[0_24px_70px_rgba(61,42,84,0.08)]";

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[34px] border p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(61,42,84,0.14)] ${shellClass}`}
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl transition group-hover:scale-125" />
      <div className="relative flex items-start justify-between gap-5">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[0.24em] ${primary ? "text-[#f9dfa1]" : "text-[#9a7a35]"}`}>
            {eyebrow}
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h2>
          <p className={`mt-3 max-w-md text-sm leading-6 ${primary ? "text-white/78" : "text-[#6b6075]"}`}>
            {description}
          </p>
        </div>
        <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${primary ? "bg-white/16" : "bg-[#f5efe5]"}`}>
          {icon}
        </div>
      </div>
      <span className={`relative mt-7 inline-flex items-center gap-2 text-sm font-semibold ${primary ? "text-white" : "text-[#5d35a1]"}`}>
        {cta} <span className="transition group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

function statusLabel(status?: EventStatus | null): string {
  if (!status) return "Sem status";
  if (status === "DRAFT") return "Rascunho";
  if (status === "PUBLISHED") return "Publicado";
  if (status === "CANCELLED") return "Cancelado";
  return status;
}

function statusPillClasses(status?: EventStatus | null): string {
  if (status === "PUBLISHED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "CANCELLED") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function paymentStatusLabel(status?: string | null): string {
  if (!status) return "Não definido";
  if (status === "NOT_CONNECTED") return "Não conectado";
  if (status === "PENDING") return "Pendente";
  if (status === "CONNECTED") return "Conectado";
  if (status === "REJECTED") return "Rejeitado";
  return status;
}

function gatewayLabel(gateway?: string | null): string {
  if (!gateway) return "Não definido";
  if (gateway.toLowerCase() === "mercadopago") return "Mercado Pago";
  if (gateway.toLowerCase() === "stripe") return "Stripe";
  if (gateway.toLowerCase() === "pagarme") return "Pagar.me";
  return gateway;
}

function formatShortDate(date?: string | null): string {
  if (!date) return "Não informado";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
}

function formatEventDate(date?: string | null): string {
  if (!date) return "Data não informada";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(parsed);
}

function DashboardOverviewCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: MetricTone;
}) {
  const toneClass: Record<MetricTone, string> = {
    gold: "from-[#fff7dd] to-white text-[#8a6013]",
    purple: "from-[#f2e9ff] to-white text-[#5d35a1]",
    green: "from-[#e9fbf2] to-white text-emerald-700",
    rose: "from-[#fff0f4] to-white text-rose-700",
  };

  return (
    <div className={`relative overflow-hidden rounded-[30px] border border-white/70 bg-gradient-to-br ${toneClass[tone]} p-6 shadow-[0_22px_60px_rgba(61,42,84,0.07)]`}>
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/50 blur-2xl" />
      <p className="relative text-[11px] font-bold uppercase tracking-[0.24em] opacity-80">{label}</p>
      <p className="relative mt-3 text-4xl font-semibold tracking-tight text-[#241433]">{value}</p>
      <p className="relative mt-2 text-sm leading-6 text-[#6b6075]">{description}</p>
    </div>
  );
}

function SoftInfoCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: string;
}) {
  return (
    <div className="group rounded-[26px] border border-[#eee3d1] bg-[linear-gradient(180deg,#ffffff_0%,#fbf7ef_100%)] p-5 transition hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(61,42,84,0.10)]">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#efe4ff] text-sm font-bold text-[#5d35a1]">{index}</div>
      <p className="mt-4 text-base font-semibold text-[#241433]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#6b6075]">{description}</p>
    </div>
  );
}

function PublicPreviewCard({ publishedEvents, totalEvents }: { publishedEvents: number; totalEvents: number }) {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[34px] border border-white/30 bg-[linear-gradient(135deg,#231735_0%,#4b2778_45%,#d5a533_100%)] p-6 text-white shadow-[0_30px_90px_rgba(75,39,120,0.22)]">
      <div className="absolute -right-20 top-8 h-56 w-56 rounded-full bg-[#f5d675]/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffeab0]">
            experiência pública
          </div>
          <h3 className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-tight">
            Cada evento vira uma página premium para convidados.
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/76">
            Use a rota /e/[slug] para validar a experiência final com capa, presentes, RSVP e informações importantes.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] border border-white/15 bg-white/12 p-4 backdrop-blur">
            <p className="text-3xl font-semibold">{publishedEvents}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/70">publicados</p>
          </div>
          <div className="rounded-[24px] border border-white/15 bg-white/12 p-4 backdrop-blur">
            <p className="text-3xl font-semibold">{totalEvents}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/70">eventos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [paymentGateway, setPaymentGateway] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentReady, setPaymentReady] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const [eventsResponse, paymentResponse] = await Promise.all([
          apiFetch("/events"),
          apiFetch("/organizations/me/payment-settings"),
        ]);

        const normalizedEvents = Array.isArray(eventsResponse) ? (eventsResponse as EventItem[]) : [];
        const paymentData = (paymentResponse as PaymentSettingsResponse) || {};

        setEvents(normalizedEvents);
        setPaymentGateway(paymentData.organization?.paymentGateway || "");
        setPaymentStatus(paymentData.organization?.paymentAccountStatus || "");
        setPaymentReady(Boolean(paymentData.organization?.paymentAccountReady));
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível carregar o resumo geral do dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalEvents = events.length;
  const publishedEvents = useMemo(() => events.filter((event) => event.status === "PUBLISHED").length, [events]);
  const draftEvents = useMemo(() => events.filter((event) => event.status === "DRAFT").length, [events]);
  const cancelledEvents = useMemo(() => events.filter((event) => event.status === "CANCELLED").length, [events]);

  const latestEvent = useMemo(() => {
    if (events.length === 0) return null;
    return [...events].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    })[0];
  }, [events]);

  const paymentReadinessHeadline = useMemo(() => {
    if (paymentReady && paymentStatus === "CONNECTED") return "Recebimento liberado";
    if (paymentStatus === "PENDING") return "Recebimento em validação";
    if (paymentStatus === "REJECTED") return "Recebimento bloqueado";
    return "Recebimento não liberado";
  }, [paymentReady, paymentStatus]);

  const paymentReadinessDescription = useMemo(() => {
    if (paymentReady && paymentStatus === "CONNECTED") return "A organização está pronta para operar fluxos de pagamento.";
    if (paymentStatus === "PENDING") return "A conta existe, mas ainda depende de validação para liberar recebimentos.";
    if (paymentStatus === "REJECTED") return "A conta possui pendência ou rejeição e precisa de correção.";
    return "Ainda não há configuração suficiente para uso pleno do fluxo financeiro.";
  }, [paymentReady, paymentStatus]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e8] text-[#241433]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(93,53,161,0.16),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(213,165,51,0.24),transparent_28%),linear-gradient(180deg,#fffaf3_0%,#f6efe6_48%,#efe6dc_100%)]" />
      <div className="pointer-events-none fixed left-1/2 top-0 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-white/45 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/70 px-5 py-4 shadow-[0_18px_50px_rgba(61,42,84,0.07)] backdrop-blur-xl">
          <LogoMark />
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#5f526e]">
            <Link className="rounded-full px-4 py-2 transition hover:bg-[#f4eadb] hover:text-[#241433]" href="/dashboard/eventos">Eventos</Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-[#f4eadb] hover:text-[#241433]" href="/dashboard/configuracoes-pagamento">Pagamentos</Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-[#f4eadb] hover:text-[#241433]" href="/">Site</Link>
          </nav>
        </header>

        {loading ? (
          <section className="space-y-6">
            <section className="rounded-[34px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_70px_rgba(61,42,84,0.08)] backdrop-blur-xl">
              <div className="h-4 w-44 animate-pulse rounded-full bg-[#eadfca]" />
              <div className="mt-5 h-12 w-2/3 animate-pulse rounded-2xl bg-[#eadfca]" />
              <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-[#eadfca]" />
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded-full bg-[#eadfca]" />
            </section>

            <div className="grid gap-5 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_22px_60px_rgba(61,42,84,0.07)]">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-[#eadfca]" />
                  <div className="mt-4 h-10 w-20 animate-pulse rounded-2xl bg-[#eadfca]" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-[#eadfca]" />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-stretch">
              <div className="relative overflow-hidden rounded-[38px] border border-white/35 bg-[linear-gradient(135deg,#261735_0%,#4b2778_48%,#b98519_100%)] p-7 text-white shadow-[0_34px_100px_rgba(75,39,120,0.26)] sm:p-9">
                <div className="absolute -left-24 top-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f5d675]/30 blur-3xl" />
                <div className="absolute bottom-8 right-12 hidden h-40 w-40 rounded-full border border-white/10 sm:block" />
                <div className="absolute bottom-14 right-20 hidden h-24 w-24 rounded-full border border-[#f5d675]/30 sm:block" />

                <div className="relative max-w-3xl">
                  <div className="inline-flex rounded-full border border-white/18 bg-white/12 px-4 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur">
                    <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#ffe9aa]">central de comando</p>
                  </div>

                  <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                    Painel VivaLista com cara de produto premium.
                  </h1>

                  <p className="mt-6 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                    Gerencie eventos, publique experiências e prepare pagamentos em uma área administrativa mais bonita, clara e pronta para evoluir como SaaS.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <PremiumButton href="/dashboard/eventos/novo" variant="primary">Criar novo evento →</PremiumButton>
                    <PremiumButton href="/dashboard/eventos" variant="soft">Meus eventos</PremiumButton>
                  </div>

                  {errorMessage ? (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/95 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</div>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <DashboardOverviewCard label="Total de eventos" value={String(totalEvents)} description="Eventos cadastrados na organização." tone="purple" />
                <DashboardOverviewCard label="Publicados" value={String(publishedEvents)} description="Experiências públicas liberadas." tone="green" />
                <DashboardOverviewCard label="Rascunhos" value={String(draftEvents)} description="Eventos ainda em preparação." tone="gold" />
                <DashboardOverviewCard label="Cancelados" value={String(cancelledEvents)} description="Eventos encerrados ou removidos." tone="rose" />
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <ActionCard eyebrow="comece aqui" title="Criar evento" description="Abra o fluxo guiado para montar um novo evento com dados, visual e estrutura pública." href="/dashboard/eventos/novo" cta="Criar agora" icon="✨" primary />
              <ActionCard eyebrow="operação" title="Meus eventos" description="Entre na lista completa, acesse o painel de cada evento e continue a configuração." href="/dashboard/eventos" cta="Abrir lista" icon="🗂️" />
              <ActionCard eyebrow="financeiro" title="Pagamentos" description="Configure o recebimento para presentes, contribuições e fluxos financeiros futuros." href="/dashboard/configuracoes-pagamento" cta="Configurar" icon="💳" />
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <PublicPreviewCard publishedEvents={publishedEvents} totalEvents={totalEvents} />

              <SectionCard className="p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9a7a35]">fluxo recomendado</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#241433]">Da criação ao site público</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b6075]">
                      O dashboard precisa conduzir o usuário sem confusão: criar, ajustar visual, revisar presentes e publicar.
                    </p>
                  </div>
                  <span className="rounded-full border border-[#eadfca] bg-[#fbf7ef] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a6013]">4 passos</span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <SoftInfoCard index="1" title="Criar evento" description="Defina nome, data, local e capacidade para alimentar o site público." />
                  <SoftInfoCard index="2" title="Ajustar visual" description="Escolha capa, modelo, cores, textos e blocos do evento." />
                  <SoftInfoCard index="3" title="Montar conteúdo" description="Organize presentes, convidados, galeria, RSVP e informações importantes." />
                  <SoftInfoCard index="4" title="Publicar" description="Revise a experiência final em /e/[slug] antes de compartilhar." />
                </div>
              </SectionCard>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <SectionCard className="p-6 sm:p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9a7a35]">financeiro</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#241433]">Status de recebimento</h2>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[26px] border border-[#eee3d1] bg-[#fbf7ef] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7a35]">Gateway</p>
                    <p className="mt-3 text-lg font-semibold text-[#241433]">{gatewayLabel(paymentGateway)}</p>
                  </div>
                  <div className="rounded-[26px] border border-[#eee3d1] bg-[#fbf7ef] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7a35]">Status</p>
                    <p className="mt-3 text-lg font-semibold text-[#241433]">{paymentStatusLabel(paymentStatus)}</p>
                  </div>
                  <div className="rounded-[26px] border border-[#eee3d1] bg-[#fbf7ef] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7a35]">Ready</p>
                    <p className="mt-3 text-lg font-semibold text-[#241433]">{paymentReady ? "Sim" : "Não"}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-[28px] border border-[#e4d3f6] bg-[linear-gradient(135deg,#f5edff_0%,#fffaf3_100%)] p-5">
                  <p className="text-lg font-semibold text-[#241433]">{paymentReadinessHeadline}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6b6075]">{paymentReadinessDescription}</p>
                  <div className="mt-4">
                    <PremiumButton href="/dashboard/configuracoes-pagamento" variant="soft">Abrir configurações</PremiumButton>
                  </div>
                </div>
              </SectionCard>

              <SectionCard className="p-6 sm:p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9a7a35]">última atividade</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#241433]">Evento mais recente</h2>

                {latestEvent ? (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[28px] border border-[#eee3d1] bg-[linear-gradient(180deg,#ffffff_0%,#fbf7ef_100%)] p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-xl font-semibold text-[#241433]">{latestEvent.name}</p>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClasses(latestEvent.status)}`}>
                          {statusLabel(latestEvent.status)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#6b6075]">
                        {latestEvent.location || "Local não informado"} • {formatEventDate(latestEvent.date)}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#6b6075]">
                        Atualizado em {formatShortDate(latestEvent.updatedAt || latestEvent.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <PremiumButton href={`/dashboard/eventos/${latestEvent.id}`} variant="primary">Abrir painel</PremiumButton>
                      {latestEvent.slug ? <PremiumButton href={`/e/${latestEvent.slug}`} variant="soft">Ver site público</PremiumButton> : null}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[28px] border border-dashed border-[#d7c9b9] bg-[#fbf7ef] p-6 text-sm leading-6 text-[#6b6075]">
                    Ainda não existem eventos. Crie o primeiro evento para começar a montar uma experiência pública premium.
                    <div className="mt-5">
                      <PremiumButton href="/dashboard/eventos/novo" variant="primary">Criar primeiro evento</PremiumButton>
                    </div>
                  </div>
                )}
              </SectionCard>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <SectionCard className="p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9a7a35]">Eventos</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#241433]">Gestão central</h2>
                <p className="mt-3 text-sm leading-6 text-[#6b6075]">O evento é o coração do VivaLista: dele saem o site público, presentes, convidados e confirmação.</p>
              </SectionCard>

              <SectionCard className="p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9a7a35]">Página pública</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#241433]">Rota /e/[slug]</h2>
                <p className="mt-3 text-sm leading-6 text-[#6b6075]">A experiência final do convidado continua concentrada na rota oficial do evento.</p>
              </SectionCard>

              <SectionCard className="p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9a7a35]">Escala</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#241433]">Pronto para evoluir</h2>
                <p className="mt-3 text-sm leading-6 text-[#6b6075]">A base visual agora fica mais próxima de um SaaS premium, mantendo a lógica real conectada ao backend.</p>
              </SectionCard>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
