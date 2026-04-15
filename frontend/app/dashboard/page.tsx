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

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-[#e8dfd2] bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function ActionCard({
  eyebrow,
  title,
  description,
  href,
  cta,
  primary = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  primary?: boolean;
}) {
  const shellClass = primary
    ? "border-[#c9a227] bg-[linear-gradient(135deg,#c9a227_0%,#8f6a16_100%)] text-white hover:translate-y-[-2px] hover:shadow-[0_18px_42px_rgba(201,162,39,0.24)]"
    : "border-[#e8dfd2] bg-white text-neutral-900 hover:-translate-y-1 hover:bg-[#fcfaf7] hover:shadow-md";

  const eyebrowClass = primary ? "text-[#fff6dc]" : "text-[#8a7d74]";
  const titleClass = primary ? "text-white" : "text-neutral-900";
  const descriptionClass = primary ? "text-[#fff3cf]" : "text-neutral-600";
  const ctaClass = primary ? "text-white" : "text-[#8f6a16]";

  return (
    <Link
      href={href}
      className={`group block rounded-[28px] border p-6 shadow-sm transition ${shellClass}`}
    >
      <p className={`text-sm font-medium uppercase tracking-[0.18em] ${eyebrowClass}`}>
        {eyebrow}
      </p>

      <h2 className={`mt-3 text-2xl font-semibold tracking-tight ${titleClass}`}>
        {title}
      </h2>

      <p className={`mt-3 text-sm leading-6 ${descriptionClass}`}>
        {description}
      </p>

      <span className={`mt-6 inline-flex text-sm font-medium ${ctaClass}`}>
        {cta} →
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
  if (status === "PUBLISHED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "CANCELLED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

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

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
}

function formatEventDate(date?: string | null): string {
  if (!date) return "Data não informada";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(parsed);
}

function DashboardOverviewCard({
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
      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

function SoftInfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-5">
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
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

        const normalizedEvents = Array.isArray(eventsResponse)
          ? (eventsResponse as EventItem[])
          : [];

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
  const publishedEvents = useMemo(
    () => events.filter((event) => event.status === "PUBLISHED").length,
    [events]
  );
  const draftEvents = useMemo(
    () => events.filter((event) => event.status === "DRAFT").length,
    [events]
  );
  const cancelledEvents = useMemo(
    () => events.filter((event) => event.status === "CANCELLED").length,
    [events]
  );

  const latestEvent = useMemo(() => {
    if (events.length === 0) return null;

    return [...events].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    })[0];
  }, [events]);

  const paymentReadinessHeadline = useMemo(() => {
    if (paymentReady && paymentStatus === "CONNECTED") {
      return "Recebimento liberado";
    }

    if (paymentStatus === "PENDING") {
      return "Recebimento em validação";
    }

    if (paymentStatus === "REJECTED") {
      return "Recebimento bloqueado";
    }

    return "Recebimento não liberado";
  }, [paymentReady, paymentStatus]);

  const paymentReadinessDescription = useMemo(() => {
    if (paymentReady && paymentStatus === "CONNECTED") {
      return "A organização está pronta para operar fluxos de pagamento.";
    }

    if (paymentStatus === "PENDING") {
      return "A conta existe, mas ainda depende de validação para liberar recebimentos.";
    }

    if (paymentStatus === "REJECTED") {
      return "A conta possui pendência ou rejeição e precisa de correção.";
    }

    return "Ainda não há configuração suficiente para uso pleno do fluxo financeiro.";
  }, [paymentReady, paymentStatus]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f8f3ec_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <section className="space-y-6">
            <section className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
              <div className="mt-4 h-10 w-1/2 animate-pulse rounded bg-neutral-200" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
            </section>

            <div className="grid gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm"
                >
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-4 h-10 w-20 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-neutral-200" />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-[32px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f3ec_100%)] p-6 shadow-sm sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(111,74,166,0.05),transparent_26%)]" />
              <div className="relative grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                <div>
                  <div className="inline-flex rounded-full border border-[#ead79a] bg-[#fbf3d8] px-4 py-2 shadow-[0_10px_24px_rgba(201,162,39,0.10)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a16]">
                      painel administrativo
                    </p>
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
                    VivaLista Dashboard
                  </h1>

                  <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
                    A entrada principal da operação do VivaLista. Gerencie eventos,
                    acompanhe a saúde do financeiro e navegue pelos fluxos centrais
                    do produto em um ambiente mais elegante, mais claro e com identidade premium.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/dashboard/eventos"
                      className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7a5911]"
                    >
                      Meus eventos
                    </Link>

                    <Link
                      href="/dashboard/configuracoes-pagamento"
                      className="inline-flex items-center justify-center rounded-xl border border-[#d8c7ef] bg-[#efe7fb] px-5 py-3 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                    >
                      Configuração de pagamentos
                    </Link>
                  </div>

                  {errorMessage ? (
                    <p className="mt-4 text-sm font-medium text-red-700">
                      {errorMessage}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Operação atual
                    </p>
                    <p className="mt-3 text-lg font-semibold text-neutral-900">
                      {totalEvents} evento{totalEvents === 1 ? "" : "s"} na organização
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Visão resumida da operação central do produto.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Publicação
                    </p>
                    <p className="mt-3 text-lg font-semibold text-neutral-900">
                      {publishedEvents} publicado{publishedEvents === 1 ? "" : "s"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Eventos prontos para experiência pública em /e/[slug].
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Financeiro
                    </p>
                    <p className="mt-3 text-lg font-semibold text-neutral-900">
                      {paymentReadinessHeadline}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {paymentReadinessDescription}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Estrutura
                    </p>
                    <p className="mt-3 text-lg font-semibold text-neutral-900">
                      SaaS multi-tenant com rota pública /e/[slug]
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Fluxo principal centralizado por evento.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-4">
              <DashboardOverviewCard
                label="Total de eventos"
                value={String(totalEvents)}
                description="Quantidade total de eventos cadastrados na organização."
              />
              <DashboardOverviewCard
                label="Publicados"
                value={String(publishedEvents)}
                description="Eventos já liberados para experiência pública."
              />
              <DashboardOverviewCard
                label="Rascunhos"
                value={String(draftEvents)}
                description="Eventos ainda em preparação ou configuração."
              />
              <DashboardOverviewCard
                label="Cancelados"
                value={String(cancelledEvents)}
                description="Eventos encerrados ou removidos da operação ativa."
              />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <ActionCard
                eyebrow="principal"
                title="Meus Eventos"
                description="Abra a lista completa de eventos da organização para entrar no painel de cada um e seguir o fluxo oficial do sistema."
                href="/dashboard/eventos"
                cta="Abrir eventos"
                primary
              />

              <ActionCard
                eyebrow="financeiro"
                title="Configuração de Pagamentos"
                description="Gerencie a base de pagamentos do sistema e prepare o ambiente para contribuições, presentes e fluxos financeiros."
                href="/dashboard/configuracoes-pagamento"
                cta="Abrir pagamentos"
              />
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-3">
              <SectionCard className="p-6 xl:col-span-2">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                  Como usar o dashboard
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                  Fluxo recomendado do VivaLista
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <SoftInfoCard
                    title="1. Escolha o evento"
                    description="Entre na lista de eventos e abra o painel do evento desejado."
                  />
                  <SoftInfoCard
                    title="2. Configure a estrutura"
                    description="Ajuste dados, visual, presentes e convidados dentro do painel do evento."
                  />
                  <SoftInfoCard
                    title="3. Valide a experiência pública"
                    description="Confira a experiência final na rota pública do evento e revise o que for necessário."
                  />
                </div>
              </SectionCard>

              <SectionCard className="p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                  Atalhos rápidos
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                  Navegação administrativa
                </h2>

                <div className="mt-6 grid gap-3">
                  <Link
                    href="/dashboard/eventos"
                    className="inline-flex items-center justify-between rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] px-4 py-4 text-sm font-medium text-neutral-800 transition hover:bg-[#f3ece3]"
                  >
                    Lista de eventos
                    <span>→</span>
                  </Link>

                  <Link
                    href="/dashboard/configuracoes-pagamento"
                    className="inline-flex items-center justify-between rounded-[22px] border border-[#ddd1f2] bg-[#f3ecfb] px-4 py-4 text-sm font-medium text-[#5f3d95] transition hover:bg-[#ece2f8]"
                  >
                    Pagamentos
                    <span>→</span>
                  </Link>

                  {latestEvent ? (
                    <Link
                      href={`/dashboard/eventos/${latestEvent.id}`}
                      className="inline-flex items-center justify-between rounded-[22px] border border-[#e8dfd2] bg-[#f8f3ec] px-4 py-4 text-sm font-medium text-neutral-800 transition hover:bg-[#f3ece3]"
                    >
                      Último evento atualizado
                      <span>→</span>
                    </Link>
                  ) : null}

                  <div className="rounded-[22px] border border-dashed border-[#d7c9b9] bg-white px-4 py-4 text-sm text-neutral-600">
                    Presentes e convidados devem ser acessados a partir do painel de
                    cada evento.
                  </div>
                </div>
              </SectionCard>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <SectionCard className="p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                  Resumo rápido
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                  Visão resumida da operação
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <SoftInfoCard
                    title="Status dos eventos"
                    description={`${publishedEvents} publicados, ${draftEvents} em rascunho e ${cancelledEvents} cancelados.`}
                  />

                  <SoftInfoCard
                    title="Pagamentos"
                    description={`Gateway atual: ${gatewayLabel(paymentGateway)} • Status: ${paymentStatusLabel(paymentStatus)} • Ready: ${paymentReady ? "sim" : "não"}.`}
                  />

                  <div className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-5 md:col-span-2">
                    <p className="text-sm font-semibold text-neutral-900">
                      Leitura operacional
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      O dashboard geral deve servir como leitura executiva da operação,
                      enquanto a gestão detalhada continua centralizada em cada evento.
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard className="p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                  Última atividade
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                  Evento mais recente
                </h2>

                {latestEvent ? (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[24px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-lg font-semibold text-neutral-900">
                          {latestEvent.name}
                        </p>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClasses(
                            latestEvent.status
                          )}`}
                        >
                          {statusLabel(latestEvent.status)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-neutral-600">
                        {latestEvent.location || "Local não informado"} • {formatEventDate(latestEvent.date)}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Atualizado em {formatShortDate(latestEvent.updatedAt || latestEvent.createdAt)}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/eventos/${latestEvent.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7a5911]"
                    >
                      Abrir painel do evento
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[22px] border border-dashed border-[#d7c9b9] bg-[#f8f3ec] p-6 text-sm text-neutral-600">
                    Ainda não existem eventos para resumir aqui.
                  </div>
                )}
              </SectionCard>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <SectionCard className="p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                  Eventos
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                  Gestão central do produto
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  O centro operacional do VivaLista está nos eventos. É por eles que
                  você controla experiência pública, presentes e convidados.
                </p>
              </SectionCard>

              <SectionCard className="p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                  Página pública
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                  Rota oficial do evento
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Cada evento publicado utiliza a estrutura pública em
                  <span className="font-medium text-neutral-900"> /e/[slug]</span>,
                  conectada ao backend real.
                </p>
              </SectionCard>

              <SectionCard className="p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                  Arquitetura
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                  Base pronta para crescer
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  O painel já está preparado para evoluir com métricas, analytics,
                  templates visuais e automações futuras.
                </p>
              </SectionCard>
            </section>
          </>
        )}
      </div>
    </main>
  );
}