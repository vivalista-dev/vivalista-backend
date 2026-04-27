"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "../../../../src/lib/api";

type EventTemplateKey =
  | "casamento"
  | "aniversario"
  | "cha-de-bebe"
  | "formatura"
  | "casa-nova";

type EventTemplate = {
  key: EventTemplateKey;
  label: string;
  shortLabel: string;
  description: string;
  badge: string;
  icon: string;
  suggestedName: string;
  suggestedDescription: string;
  suggestedLocation: string;
};

const EVENT_TEMPLATES: EventTemplate[] = [
  {
    key: "casamento",
    label: "Casamento",
    shortLabel: "Casamento",
    description:
      "Ideal para cerimônia, recepção, RSVP, lista de presentes e página pública elegante.",
    badge: "cerimônia + festa",
    icon: "💍",
    suggestedName: "Casamento Nome 1 e Nome 2",
    suggestedDescription:
      "Celebre esse grande dia com uma página elegante, confirmações de presença e lista de presentes.",
    suggestedLocation: "Ex.: Espaço para casamento, cidade",
  },
  {
    key: "aniversario",
    label: "Aniversário",
    shortLabel: "Aniversário",
    description:
      "Perfeito para festas de aniversário com convidados, confirmação e presentes.",
    badge: "festa",
    icon: "🎂",
    suggestedName: "Aniversário de Nome",
    suggestedDescription:
      "Organize sua comemoração com uma página bonita, convidados e presentes em um só lugar.",
    suggestedLocation: "Ex.: Buffet, salão ou residência",
  },
  {
    key: "cha-de-bebe",
    label: "Chá de bebê",
    shortLabel: "Chá de bebê",
    description:
      "Modelo pensado para chá revelação, chá de bebê e encontros mais delicados e íntimos.",
    badge: "família + convidados",
    icon: "🧸",
    suggestedName: "Chá de bebê de Nome",
    suggestedDescription:
      "Monte uma página especial para compartilhar a celebração, confirmar presença e organizar presentes.",
    suggestedLocation: "Ex.: Espaço do evento, residência ou salão",
  },
  {
    key: "formatura",
    label: "Formatura",
    shortLabel: "Formatura",
    description:
      "Estrutura ideal para formaturas, celebrações de conquista e página pública refinada.",
    badge: "conquista",
    icon: "🎓",
    suggestedName: "Formatura de Nome",
    suggestedDescription:
      "Reúna convidados, confirmação e detalhes da comemoração em uma experiência mais organizada.",
    suggestedLocation: "Ex.: Espaço de eventos, casa de festas ou restaurante",
  },
  {
    key: "casa-nova",
    label: "Casa nova",
    shortLabel: "Casa nova",
    description:
      "Ótimo para open house, chá de casa nova e organização de presentes por cotas ou itens.",
    badge: "novo lar",
    icon: "🏡",
    suggestedName: "Casa nova de Nome",
    suggestedDescription:
      "Crie uma página para celebrar o novo lar com convidados, presentes e comunicação clara.",
    suggestedLocation: "Ex.: Endereço do novo lar ou espaço da celebração",
  },
];

function toDatetimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function getTemplateByKey(key: string | null): EventTemplate | null {
  if (!key) return null;

  return EVENT_TEMPLATES.find((item) => item.key === key) ?? null;
}

function buildTemplateHref(key: EventTemplateKey) {
  return `/dashboard/eventos/novo?tipo=${key}`;
}

function NovoEventoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedType = searchParams.get("tipo");

  const selectedTemplate = useMemo(
    () => getTemplateByKey(selectedType),
    [selectedType],
  );

  const [name, setName] = useState("");
  const [date, setDate] = useState(toDatetimeLocalValue(new Date()));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function applyTemplateSuggestion(template: EventTemplate) {
    setName((current) => current || template.suggestedName);
    setDescription((current) => current || template.suggestedDescription);
    setLocation((current) => current || template.suggestedLocation);
    setErrorMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTemplate) {
      setErrorMessage("Escolha primeiro o modelo do evento.");
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Informe o nome do evento.");
      return;
    }

    if (!date.trim()) {
      setErrorMessage("Informe a data do evento.");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Informe o local do evento.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const baseDescription = description.trim();
      const finalDescription = baseDescription
        ? `[Modelo: ${selectedTemplate.label}] ${baseDescription}`
        : `[Modelo: ${selectedTemplate.label}]`;

      const payload = {
        name: name.trim(),
        date: new Date(date).toISOString(),
        location: location.trim(),
        description: finalDescription,
        capacity: capacity.trim() ? Number(capacity) : undefined,
      };

      const createdEvent = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const createdId = createdEvent?.id || createdEvent?.event?.id || null;

      if (createdId) {
        router.push(`/dashboard/eventos/${createdId}`);
        return;
      }

      router.push("/dashboard/eventos");
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o evento.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f8f3ec_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-[#e8dfd2] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f3ec_100%)] p-6 shadow-sm sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(111,74,166,0.05),transparent_26%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-[#ead79a] bg-[#fbf3d8] px-4 py-2 shadow-[0_10px_24px_rgba(201,162,39,0.10)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a16]">
                  criação de evento
                </p>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Escolha o modelo do evento
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
                Primeiro selecione o tipo do evento. Depois você preenche os
                dados e monta a base inicial do site ou do painel do cliente com
                mais contexto.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-[#ddd1f2] bg-[#efe7fb] px-4 py-2 text-sm font-medium text-[#5f3d95] transition hover:bg-[#e7ddf7]"
              >
                Voltar ao dashboard
              </Link>

              <Link
                href="/dashboard/eventos"
                className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
              >
                Ver eventos
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
              passo 1
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
              Modelo do evento
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Escolha a base mais próxima do que você quer criar. Isso organiza
              melhor o fluxo do sistema.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {EVENT_TEMPLATES.map((template) => {
              const isSelected = selectedTemplate?.key === template.key;

              return (
                <button
                  key={template.key}
                  type="button"
                  onClick={() => {
                    router.push(buildTemplateHref(template.key));
                    applyTemplateSuggestion(template);
                  }}
                  className={`rounded-[24px] border p-5 text-left shadow-sm transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-[#c8a24b] bg-[#fff8e7] ring-2 ring-[#ecd9a3]"
                      : "border-[#e8dfd2] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-3xl">{template.icon}</div>

                    <span className="rounded-full border border-[#ead79a] bg-[#fbf3d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f6a16]">
                      {template.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-neutral-900">
                    {template.label}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {template.description}
                  </p>

                  <div className="mt-4 text-sm font-medium text-[#8f6a16]">
                    {isSelected ? "Modelo selecionado" : "Selecionar modelo"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-[#e8dfd2] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a7d74]">
                passo 2
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                Dados iniciais do evento
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {selectedTemplate
                  ? `Você está criando um evento do tipo ${selectedTemplate.shortLabel}.`
                  : "Escolha primeiro o modelo acima para continuar com mais contexto."}
              </p>
            </div>

            {selectedTemplate ? (
              <button
                type="button"
                onClick={() => applyTemplateSuggestion(selectedTemplate)}
                className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-4 py-2 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
              >
                Usar sugestões do modelo
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-neutral-900"
              >
                Nome do evento
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={
                  selectedTemplate?.suggestedName ||
                  "Ex.: Casamento André e Maria"
                }
                className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-neutral-900"
                >
                  Data do evento
                </label>

                <input
                  id="date"
                  type="datetime-local"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                />
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="mb-2 block text-sm font-medium text-neutral-900"
                >
                  Capacidade
                </label>

                <input
                  id="capacity"
                  type="number"
                  min="0"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  placeholder="Ex.: 150"
                  className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-neutral-900"
              >
                Local do evento
              </label>

              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={
                  selectedTemplate?.suggestedLocation ||
                  "Ex.: Espaço Jardim Imperial, São Paulo"
                }
                className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-neutral-900"
              >
                Descrição
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={
                  selectedTemplate?.suggestedDescription ||
                  "Descreva o evento de forma breve."
                }
                rows={5}
                className="w-full rounded-2xl border border-[#d9cec2] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#8f6a16]"
              />
            </div>

            {selectedTemplate ? (
              <div className="rounded-2xl border border-[#ead79a] bg-[#fff8e7] px-4 py-3 text-sm text-[#7a5911]">
                Modelo escolhido: <strong>{selectedTemplate.label}</strong>
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-[#8f6a16] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7a5911] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Criando evento..." : "Criar evento"}
              </button>

              <Link
                href="/dashboard/eventos"
                className="inline-flex items-center justify-center rounded-xl border border-[#e8dfd2] bg-white px-5 py-3 text-sm font-medium text-[#8f6a16] transition hover:bg-[#fcfaf7]"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function NovoEventoLoading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f8f3ec_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-[#e8dfd2] bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-neutral-600">
            Carregando criação do evento...
          </p>
        </section>
      </div>
    </main>
  );
}

export default function NovoEventoPage() {
  return (
    <Suspense fallback={<NovoEventoLoading />}>
      <NovoEventoPageContent />
    </Suspense>
  );
}