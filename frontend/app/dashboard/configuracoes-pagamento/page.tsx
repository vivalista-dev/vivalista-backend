"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../src/lib/api";

type PaymentSettingsResponse = {
  organization?: {
    paymentGateway?: string | null;
    paymentAccountId?: string | null;
    paymentAccountStatus?: string | null;
    paymentAccountReady?: boolean | null;
  };
};

type PaymentAccountStatus =
  | ""
  | "NOT_CONNECTED"
  | "PENDING"
  | "CONNECTED"
  | "REJECTED"
  | string;

function statusLabel(status: PaymentAccountStatus): string {
  if (!status) return "Não definido";
  if (status === "NOT_CONNECTED") return "Não conectado";
  if (status === "PENDING") return "Pendente";
  if (status === "CONNECTED") return "Conectado";
  if (status === "REJECTED") return "Rejeitado";
  return status;
}

function statusClasses(status: PaymentAccountStatus): string {
  if (status === "CONNECTED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "PENDING") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-neutral-200 bg-neutral-100 text-neutral-700";
}

function gatewayLabel(gateway?: string | null): string {
  if (!gateway) return "Não definido";
  if (gateway.toLowerCase() === "mercadopago") return "Mercado Pago";
  if (gateway.toLowerCase() === "stripe") return "Stripe";
  if (gateway.toLowerCase() === "pagarme") return "Pagar.me";
  return gateway;
}

function readinessTitle(status: PaymentAccountStatus, ready: boolean): string {
  if (ready && status === "CONNECTED") {
    return "Conta pronta para receber";
  }

  if (status === "PENDING") {
    return "Conta em validação";
  }

  if (status === "REJECTED") {
    return "Conta bloqueada por pendência";
  }

  if (status === "NOT_CONNECTED") {
    return "Conta ainda não conectada";
  }

  return "Configuração ainda não pronta";
}

function readinessDescription(status: PaymentAccountStatus, ready: boolean): string {
  if (ready && status === "CONNECTED") {
    return "A organização está liberada para operar fluxos de recebimento no sistema.";
  }

  if (status === "PENDING") {
    return "A conta já foi iniciada, mas ainda depende de validação ou revisão para liberar recebimentos.";
  }

  if (status === "REJECTED") {
    return "A conta está com erro, rejeição ou pendência crítica. O recebimento deve permanecer bloqueado até correção.";
  }

  if (status === "NOT_CONNECTED") {
    return "Ainda não existe uma conta conectada e validada para processar pagamentos.";
  }

  if (ready) {
    return "A chave de prontidão foi ativada, mas o status ainda não indica conexão completa.";
  }

  return "A configuração atual ainda não libera o uso pleno dos pagamentos.";
}

function accountBlockingMessage(status: PaymentAccountStatus, ready: boolean): {
  title: string;
  description: string;
  classes: string;
} {
  if (ready && status === "CONNECTED") {
    return {
      title: "Recebimento liberado",
      description:
        "Os fluxos financeiros podem operar normalmente para a organização.",
      classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
    };
  }

  if (status === "PENDING") {
    return {
      title: "Recebimento parcialmente bloqueado",
      description:
        "A conta existe, mas ainda está em análise. Até a validação concluir, o recebimento não deve ser tratado como totalmente liberado.",
      classes: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (status === "REJECTED") {
    return {
      title: "Recebimento bloqueado",
      description:
        "A conta foi rejeitada ou possui pendências que impedem o uso seguro do fluxo de pagamento.",
      classes: "border-red-200 bg-red-50 text-red-800",
    };
  }

  return {
    title: "Recebimento não liberado",
    description:
      "A organização ainda não possui uma configuração suficiente para operar pagamentos com segurança.",
    classes: "border-neutral-200 bg-neutral-100 text-neutral-800",
  };
}

function readinessPillClasses(status: PaymentAccountStatus, ready: boolean): string {
  if (ready && status === "CONNECTED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "PENDING") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-neutral-200 bg-neutral-100 text-neutral-700";
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

function OverviewCard({
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
      <p className="mt-3 text-xl font-semibold text-neutral-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

export default function PaymentSettingsPage() {
  const [gateway, setGateway] = useState("");
  const [accountId, setAccountId] = useState("");
  const [status, setStatus] = useState<PaymentAccountStatus>("");
  const [ready, setReady] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  async function loadSettings() {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSavedMessage(null);

      const data = (await apiFetch(
        "/organizations/me/payment-settings"
      )) as PaymentSettingsResponse;

      if (!data || !data.organization) {
        throw new Error("Resposta inválida ao carregar configuração.");
      }

      setGateway(data.organization.paymentGateway || "");
      setAccountId(data.organization.paymentAccountId || "");
      setStatus(data.organization.paymentAccountStatus || "");
      setReady(Boolean(data.organization.paymentAccountReady));
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao carregar os dados da configuração de pagamento.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setErrorMessage(null);
      setSavedMessage(null);

      const data = await apiFetch("/organizations/me/payment-settings", {
        method: "PATCH",
        body: JSON.stringify({
          paymentGateway: gateway.trim() || null,
          paymentAccountId: accountId.trim() || null,
          paymentAccountStatus: status || null,
          paymentAccountReady: ready,
        }),
      });

      if (!data) {
        throw new Error("Erro ao salvar configuração.");
      }

      setSavedMessage("Configuração salva com sucesso.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao salvar os dados da configuração de pagamento.");
    } finally {
      setSaving(false);
    }
  }

  function prepareForTests() {
    setGateway("mercadopago");
    setAccountId("mp_test_account_001");
    setStatus("CONNECTED");
    setReady(true);
    setSavedMessage(null);
    setErrorMessage(null);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const readinessHeadline = useMemo(() => {
    return readinessTitle(status, ready);
  }, [ready, status]);

  const readinessText = useMemo(() => {
    return readinessDescription(status, ready);
  }, [ready, status]);

  const blockingState = useMemo(() => {
    return accountBlockingMessage(status, ready);
  }, [ready, status]);

  const flowSteps = useMemo(() => {
    return [
      {
        title: "1. Gateway definido",
        description: gateway
          ? `O gateway atual da organização é ${gatewayLabel(gateway)}.`
          : "Nenhum gateway foi definido ainda.",
      },
      {
        title: "2. Conta conectada",
        description: accountId
          ? `A conta vinculada usa o identificador ${accountId}.`
          : "Ainda não existe um identificador de conta salvo.",
      },
      {
        title: "3. Status operacional",
        description: `O status atual da conta é ${statusLabel(status)}.`,
      },
      {
        title: "4. Liberação final",
        description: ready
          ? "A prontidão está marcada como ativa."
          : "A prontidão ainda está desligada.",
      },
    ];
  }, [gateway, accountId, status, ready]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f8f3ec_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <section className="space-y-6">
            <div className="rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm">
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
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
                  <div className="mt-4 h-10 w-24 animate-pulse rounded bg-neutral-200" />
                </div>
              ))}
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
                      financeiro
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      Configuração de Pagamentos
                    </h1>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                        status
                      )}`}
                    >
                      {statusLabel(status)}
                    </span>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${readinessPillClasses(
                        status,
                        ready
                      )}`}
                    >
                      {ready ? "Ready ativo" : "Ready inativo"}
                    </span>
                  </div>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                    Use esta tela para deixar a organização pronta para receber
                    pagamentos e controlar o estado da conta conectada ao sistema.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-4 py-2 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
                    >
                      Voltar ao dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={prepareForTests}
                      className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
                    >
                      Preparar para testes
                    </button>

                    <button
                      type="button"
                      onClick={saveSettings}
                      disabled={saving}
                      className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7a5911] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Salvando..." : "Salvar configuração"}
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
                      Gateway atual
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-900">
                      {gatewayLabel(gateway)}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#e8dfd2] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Conta pronta
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-900">
                      {ready ? "Sim" : "Não"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#e8dfd2] bg-white p-4 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                      Readiness da conta
                    </p>
                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      {readinessHeadline}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {readinessText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <SectionShell
              eyebrow="resumo"
              title="Estado da configuração"
              description="Visão rápida da prontidão da organização para operar pagamentos."
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <OverviewCard
                  label="Gateway"
                  value={gatewayLabel(gateway)}
                  description="Provedor atualmente configurado para a organização."
                />

                <OverviewCard
                  label="Account ID"
                  value={accountId || "Não definido"}
                  description="Identificador técnico da conta conectada no gateway."
                />

                <OverviewCard
                  label="Status"
                  value={statusLabel(status)}
                  description="Estado operacional atual da conta de pagamento."
                />

                <OverviewCard
                  label="Prontidão"
                  value={ready ? "Liberada" : "Bloqueada"}
                  description="Leitura final de readiness para uso do fluxo financeiro."
                />
              </div>
            </SectionShell>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <SectionShell
                  eyebrow="situação da conta"
                  title="Bloqueio ou liberação do recebimento"
                  description="Leitura mais clara do que o estado atual significa para a operação da organização."
                >
                  <div className={`rounded-[28px] border p-6 ${blockingState.classes}`}>
                    <h3 className="text-xl font-semibold">{blockingState.title}</h3>
                    <p className="mt-3 text-sm leading-6">
                      {blockingState.description}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-5">
                      <p className="text-sm font-semibold text-neutral-900">
                        Quando está liberado
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        O ideal é ter gateway definido, conta conectada, status
                        compatível com operação e prontidão final marcada como ativa.
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-5">
                      <p className="text-sm font-semibold text-neutral-900">
                        Quando deve permanecer bloqueado
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Se a conta ainda não existe, está pendente, foi rejeitada
                        ou a prontidão final ainda não foi confirmada.
                      </p>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="configuração"
                  title="Conta de pagamento da organização"
                  description="Defina o gateway, o identificador da conta e o estado operacional do recebimento."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="gateway"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Gateway
                      </label>
                      <input
                        id="gateway"
                        value={gateway}
                        onChange={(e) => setGateway(e.target.value)}
                        placeholder="Ex: mercadopago"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="accountId"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Account ID
                      </label>
                      <input
                        id="accountId"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        placeholder="Ex: mp_test_account_001"
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="status"
                        className="mb-2 block text-sm font-medium text-neutral-800"
                      >
                        Status da conta
                      </label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                      >
                        <option value="">Selecione</option>
                        <option value="NOT_CONNECTED">NOT_CONNECTED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="CONNECTED">CONNECTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>

                    <div className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7d74]">
                        Gateway reconhecido
                      </p>
                      <p className="mt-2 text-sm font-semibold text-neutral-900">
                        {gatewayLabel(gateway)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Esse é o nome exibido de forma amigável no painel.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <ToggleRow
                        label="Conta pronta para receber pagamentos"
                        description="Ative esta opção quando a organização estiver operacional para testes ou produção."
                        checked={ready}
                        onChange={setReady}
                      />
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="fluxo"
                  title="Clareza do fluxo de recebimento"
                  description="Leitura simples de como o sistema entende a prontidão da organização."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {flowSteps.map((step) => (
                      <div
                        key={step.title}
                        className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-5"
                      >
                        <p className="text-sm font-semibold text-neutral-900">
                          {step.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="operação"
                  title="Como isso impacta o sistema"
                  description="Essas definições influenciam a capacidade de receber pagamentos nas páginas públicas do VivaLista."
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-5">
                      <p className="text-sm font-semibold text-neutral-900">
                        Presentes e contribuições
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        A base financeira da organização precisa estar pronta para
                        viabilizar fluxos de pagamento na experiência pública.
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-5">
                      <p className="text-sm font-semibold text-neutral-900">
                        Testes internos
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        O botão “Preparar para testes” acelera a configuração para
                        validar o fluxo técnico do sistema.
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-[#e8dfd2] bg-[#f8f3ec] p-5">
                      <p className="text-sm font-semibold text-neutral-900">
                        Evolução futura
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Esta tela é a base para onboarding real de gateway,
                        credenciais e automações financeiras.
                      </p>
                    </div>
                  </div>
                </SectionShell>
              </div>

              <aside className="space-y-6">
                <SectionShell
                  eyebrow="leitura rápida"
                  title="Resumo técnico"
                >
                  <div className="space-y-4 text-sm text-neutral-700">
                    <div>
                      <p className="font-semibold text-neutral-900">Gateway</p>
                      <p>{gateway || "Não definido"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Account ID</p>
                      <p className="break-all">{accountId || "Não definido"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Status bruto</p>
                      <p>{status || "Não definido"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Ready</p>
                      <p>{ready ? "true" : "false"}</p>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="status da conta"
                  title="Leitura rápida da readiness"
                >
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="font-semibold text-neutral-900">Headline</p>
                      <p className="mt-2">{readinessHeadline}</p>
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      <p className="font-semibold text-neutral-900">Descrição</p>
                      <p className="mt-2 leading-6">{readinessText}</p>
                    </div>
                  </div>
                </SectionShell>

                <SectionShell
                  eyebrow="próximas evoluções"
                  title="Base pronta para crescer"
                >
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Onboarding real do gateway
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Validação automática da conta
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Credenciais segregadas por ambiente
                    </div>
                    <div className="rounded-[20px] border border-[#e8dfd2] bg-[#f8f3ec] p-4">
                      Métricas financeiras administrativas
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