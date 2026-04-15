"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

type GuestResponse = {
  guestId: string;
  name: string;
  status: "INVITED" | "CONFIRMED" | "DECLINED";
  event: {
    id: string;
    name: string;
    slug?: string | null;
    date: string;
    location: string;
  };
};

function getStatusConfig(status: GuestResponse["status"]) {
  if (status === "CONFIRMED") {
    return {
      label: "Presença confirmada",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      panelClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      softClass: "bg-[linear-gradient(180deg,#f2fff7_0%,#ecfdf3_100%)]",
      icon: "✓",
      actionText: "Sua presença já está confirmada.",
    };
  }

  if (status === "DECLINED") {
    return {
      label: "Não poderá comparecer",
      badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
      panelClass: "border-rose-200 bg-rose-50 text-rose-700",
      softClass: "bg-[linear-gradient(180deg,#fff5f5_0%,#fff0f0_100%)]",
      icon: "—",
      actionText: "Sua resposta atual indica ausência no evento.",
    };
  }

  return {
    label: "Aguardando resposta",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    panelClass: "border-amber-200 bg-amber-50 text-amber-700",
    softClass: "bg-[linear-gradient(180deg,#fffdf4_0%,#fff8e8_100%)]",
    icon: "•",
    actionText: "Você ainda não respondeu a este convite.",
  };
}

function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export default function PublicRsvpPage() {
  const params = useParams();
  const code = params.code as string;

  const [guest, setGuest] = useState<GuestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadGuest() {
    try {
      setMessage("");
      const data = await apiFetch(`/public/rsvp/${code}`);
      setGuest(data);
    } catch (err: any) {
      setGuest(null);
      setMessage(err.message || "Erro ao carregar convite.");
    } finally {
      setLoading(false);
    }
  }

  async function respond(status: "CONFIRMED" | "DECLINED") {
    try {
      setSubmitting(true);
      setMessage("");

      await apiFetch(`/public/rsvp/${code}/respond`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });

      await loadGuest();

      if (status === "CONFIRMED") {
        setMessage("Sua presença foi confirmada com sucesso.");
      } else {
        setMessage("Sua resposta foi registrada com sucesso.");
      }
    } catch (err: any) {
      setMessage(err.message || "Erro ao responder convite.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (code) {
      loadGuest();
    }
  }, [code]);

  const statusConfig = useMemo(
    () => (guest ? getStatusConfig(guest.status) : null),
    [guest]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f1fb] text-[#4b2c73]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.97),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(195,160,255,0.16),transparent_30%)]" />
          <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,#fbf8ff_0%,#f4ebff_42%,#f6f1fb_100%)]" />
          <div className="absolute left-[-8%] top-[180px] h-36 w-[128%] rotate-[-4deg] rounded-[100%] bg-white/40 blur-2xl" />
          <div className="absolute left-[-10%] top-[250px] h-40 w-[140%] rotate-[2deg] rounded-[100%] bg-[#e2cffd]/42 blur-2xl" />

          <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-xl rounded-[34px] border border-white/75 bg-white/82 p-8 text-center shadow-[0_30px_80px_rgba(112,76,170,0.14)] backdrop-blur-xl">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#d9c6fb] border-t-[#7c4ce0]" />
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#4d2a78]">
                Carregando convite...
              </h1>
              <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                Aguarde um instante enquanto buscamos sua confirmação de presença.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!guest) {
    return (
      <main className="min-h-screen bg-[#f6f1fb] text-[#4b2c73]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.97),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(195,160,255,0.16),transparent_30%)]" />
          <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,#fbf8ff_0%,#f4ebff_42%,#f6f1fb_100%)]" />
          <div className="absolute left-[-8%] top-[180px] h-36 w-[128%] rotate-[-4deg] rounded-[100%] bg-white/40 blur-2xl" />
          <div className="absolute left-[-10%] top-[250px] h-40 w-[140%] rotate-[2deg] rounded-[100%] bg-[#e2cffd]/42 blur-2xl" />

          <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-xl rounded-[34px] border border-white/75 bg-white/82 p-8 text-center shadow-[0_30px_80px_rgba(112,76,170,0.14)] backdrop-blur-xl">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl font-bold text-rose-700">
                !
              </div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#4d2a78]">
                Convite não encontrado
              </h1>
              <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                {message || "Não foi possível localizar esse convite."}
              </p>

              <div className="mt-6 flex justify-center">
                <Link
                  href="/"
                  className="rounded-2xl border border-white/70 bg-white/86 px-6 py-3 text-sm font-semibold text-[#5e3e90] shadow-[0_12px_26px_rgba(91,58,140,0.08)] backdrop-blur transition hover:bg-white"
                >
                  Voltar para a home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const eventDate = formatEventDate(guest.event.date);
  const eventSlug = guest.event.slug;
  const canSeeGiftList = guest.status === "CONFIRMED" && !!eventSlug;

  return (
    <main className="min-h-screen bg-[#f6f1fb] text-[#4b2c73]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.97),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(195,160,255,0.16),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[linear-gradient(180deg,#fbf8ff_0%,#f4ebff_42%,#f6f1fb_100%)]" />
        <div className="absolute left-[-8%] top-[180px] h-36 w-[128%] rotate-[-4deg] rounded-[100%] bg-white/40 blur-2xl" />
        <div className="absolute left-[-10%] top-[250px] h-40 w-[140%] rotate-[2deg] rounded-[100%] bg-[#e2cffd]/42 blur-2xl" />
        <div className="absolute right-[-8%] top-[90px] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,219,92,0.24),transparent_62%)] blur-3xl" />

        <div className="relative z-20 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full">
            <div className="mb-10 text-center">
              <div className="inline-flex rounded-full border border-[#f3df9b]/70 bg-white/88 px-4 py-2 shadow-[0_10px_26px_rgba(188,145,38,0.10)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#9d7a1d]">
                  confirmação de presença
                </p>
              </div>

              <h1 className="mt-7 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#4d2a78] sm:text-5xl xl:text-6xl">
                {guest.event.name}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#826ca6]">
                Confirme sua presença com mais clareza, veja o status do seu
                convite e continue a experiência pública do evento em um ambiente
                elegante e organizado.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
              <section className="rounded-[34px] border border-white/75 bg-white/82 p-6 shadow-[0_30px_80px_rgba(112,76,170,0.14)] backdrop-blur-xl sm:p-8">
                <div className="rounded-[30px] border border-[#ede2fb] bg-white p-6 shadow-[0_18px_40px_rgba(107,74,163,0.08)] sm:p-8">
                  <div className="border-b border-[#ede2fb] pb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8f74b8]">
                      convidado
                    </p>
                    <h2 className="mt-3 break-words text-3xl font-semibold tracking-[-0.03em] text-[#4d2a78] sm:text-[34px]">
                      {guest.name}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                      Este é o seu convite individual para confirmar ou recusar
                      presença.
                    </p>
                  </div>

                  <div
                    className={`mt-6 rounded-[26px] border p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)] ${statusConfig?.badgeClass} ${statusConfig?.softClass}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/75 text-xl font-semibold">
                        {statusConfig?.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] opacity-80">
                          status atual
                        </p>
                        <p className="mt-2 text-lg font-semibold">
                          {statusConfig?.label}
                        </p>
                        <p className="mt-2 text-sm leading-7 opacity-90">
                          {statusConfig?.actionText}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-[#ede2fb] bg-[#fcfaff] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f74b8]">
                        Data
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-[#4d2a78]">
                        {eventDate}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#ede2fb] bg-[#fcfaff] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f74b8]">
                        Local
                      </p>
                      <p className="mt-2 break-words text-sm font-semibold leading-7 text-[#4d2a78]">
                        {guest.event.location}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#ede2fb] bg-[#fcfaff] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f74b8]">
                        Código do convite
                      </p>
                      <p className="mt-2 break-all text-sm font-semibold leading-7 text-[#4d2a78]">
                        {code}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[#ede2fb] bg-[#fcfaff] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f74b8]">
                        Evento
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-[#4d2a78]">
                        {guest.event.name}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[34px] border border-white/75 bg-white/82 p-6 shadow-[0_30px_80px_rgba(112,76,170,0.14)] backdrop-blur-xl sm:p-8">
                <div className="rounded-[30px] border border-[#ede2fb] bg-white p-6 shadow-[0_18px_40px_rgba(107,74,163,0.08)] sm:p-8">
                  <div className="border-b border-[#ede2fb] pb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8f74b8]">
                      sua resposta
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#4d2a78] sm:text-3xl">
                      Confirmar ou recusar presença
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                      Escolha uma das opções abaixo para registrar sua resposta no
                      evento.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <button
                      onClick={() => respond("CONFIRMED")}
                      disabled={submitting}
                      className="w-full rounded-[24px] bg-[linear-gradient(135deg,#22c55e_0%,#16a34a_100%)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(34,197,94,0.22)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Salvando..." : "Confirmar presença"}
                    </button>

                    <button
                      onClick={() => respond("DECLINED")}
                      disabled={submitting}
                      className="w-full rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Salvando..." : "Não poderei ir"}
                    </button>
                  </div>

                  <div className="mt-6 rounded-[24px] border border-[#efe5fb] bg-[#faf7ff] p-5">
                    <p className="text-sm font-semibold text-[#4d2a78]">
                      O que acontece depois?
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#826ca6]">
                      Sua resposta fica registrada e o status do seu convite será
                      atualizado imediatamente.
                    </p>
                  </div>

                  {canSeeGiftList ? (
                    <div className="mt-6 flex flex-col gap-4 rounded-[26px] bg-[linear-gradient(135deg,#4d2a78_0%,#6b4aa3_100%)] p-5 text-white shadow-[0_20px_44px_rgba(91,58,140,0.20)] md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-lg font-semibold">
                          Presença confirmada
                        </p>
                        <p className="mt-2 text-sm leading-7 text-white/85">
                          Agora você já pode acessar a página pública do evento e
                          ver a lista de presentes.
                        </p>
                      </div>

                      <Link
                        href={`/e/${eventSlug}`}
                        className="inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#4d2a78] transition hover:bg-[#f7f2fb]"
                      >
                        Ver lista de presentes
                      </Link>
                    </div>
                  ) : null}

                  {message ? (
                    <div
                      className={`mt-6 rounded-[22px] border px-4 py-4 text-sm font-medium ${statusConfig?.panelClass}`}
                    >
                      {message}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/"
                      className="rounded-2xl border border-white/70 bg-white/86 px-6 py-3 text-sm font-semibold text-[#5e3e90] shadow-[0_12px_26px_rgba(91,58,140,0.08)] backdrop-blur transition hover:bg-white"
                    >
                      Voltar para a home
                    </Link>

                    {eventSlug ? (
                      <Link
                        href={`/e/${eventSlug}`}
                        className="rounded-2xl border border-[#ede2fb] bg-[#faf6ff] px-6 py-3 text-sm font-semibold text-[#5e3e90] transition hover:bg-white"
                      >
                        Ver página do evento
                      </Link>
                    ) : null}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}