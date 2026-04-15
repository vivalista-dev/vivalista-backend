"use client";

import Image from "next/image";
import Link from "next/link";

const celebrations = [
  {
    title: "Casamento",
    subtitle: "Elegância para o grande dia.",
    icon: "💍",
  },
  {
    title: "Aniversário",
    subtitle: "Momentos especiais com estilo.",
    icon: "🎂",
  },
  {
    title: "Chá de Bebê",
    subtitle: "Delicadeza em cada detalhe.",
    icon: "🧸",
  },
  {
    title: "Formatura",
    subtitle: "Uma conquista que merece destaque.",
    icon: "🎓",
  },
  {
    title: "Casa Nova",
    subtitle: "Presentes e contribuições em um só lugar.",
    icon: "🏡",
  },
];

const steps = [
  {
    step: "01",
    title: "Crie seu evento",
    description:
      "Escolha o estilo da página, organize as informações principais e monte uma experiência mais elegante para os convidados.",
  },
  {
    step: "02",
    title: "Compartilhe sua página",
    description:
      "Envie um único link com apresentação do evento, confirmação de presença, presentes e contribuições em um só ambiente.",
  },
  {
    step: "03",
    title: "Acompanhe em tempo real",
    description:
      "Gerencie RSVP, presentes reservados, contribuições pagas e toda a operação do evento com mais clareza.",
  },
];

const highlights = [
  "Página pública por slug",
  "Lista de presentes premium",
  "RSVP integrado",
  "Pix e pagamentos",
];

const dashboardHighlights = [
  {
    label: "Painel administrativo",
    description:
      "Gerencie evento, convidados, presentes e configurações visuais.",
  },
  {
    label: "Página pública elegante",
    description: "Compartilhe um link único com identidade personalizada.",
  },
  {
    label: "Fluxo financeiro integrado",
    description: "Receba contribuições com clareza e acompanhe os pagamentos.",
  },
];

const trustItems = [
  "Experiência pública elegante",
  "Gestão clara de convidados",
  "Presentes físicos, cotas e contribuições",
  "Acompanhamento em tempo real",
];

const featureCards = [
  {
    title: "Página pública refinada",
    description:
      "Uma apresentação bonita para o seu evento, com identidade visual e navegação clara para os convidados.",
  },
  {
    title: "Gestão completa no dashboard",
    description:
      "Controle presentes, convidados, RSVP, capa, visual do evento e operação financeira em um único painel.",
  },
  {
    title: "Fluxo real de contribuição",
    description:
      "Trabalhe com Pix, cartão, boleto e formatos diferentes de presente com uma experiência mais profissional.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f1fb] text-[#4b2c73]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(195,160,255,0.14),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[linear-gradient(180deg,#fbf8ff_0%,#f4ebff_38%,#f6f1fb_100%)]" />

        <div className="absolute left-[-8%] top-[240px] h-36 w-[128%] rotate-[-4deg] rounded-[100%] bg-white/40 blur-2xl" />
        <div className="absolute left-[-10%] top-[308px] h-40 w-[140%] rotate-[2deg] rounded-[100%] bg-[#e2cffd]/42 blur-2xl" />
        <div className="absolute left-[-8%] top-[388px] h-40 w-[130%] rotate-[-2deg] rounded-[100%] bg-white/52 blur-2xl" />
        <div className="absolute right-[-8%] top-[90px] h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,219,92,0.24),transparent_62%)] blur-3xl" />
        <div className="absolute left-[-10%] top-[1320px] h-40 w-[135%] rotate-[2deg] rounded-[100%] bg-[#eadcff]/50 blur-2xl" />
        <div className="absolute left-[-10%] top-[1440px] h-44 w-[140%] rotate-[-2deg] rounded-[100%] bg-white/58 blur-2xl" />

        <header className="sticky top-0 z-50 border-b border-white/45 bg-[#f7f2fb]/88 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-4">
              <div className="rounded-[24px] border border-white/85 bg-white/94 px-5 py-3 shadow-[0_20px_42px_rgba(107,74,163,0.14)]">
                <Image
                  src="/logo-vivalista.png"
                  alt="VivaLista"
                  width={250}
                  height={82}
                  className="h-auto w-[190px] md:w-[225px]"
                  priority
                />
              </div>
            </Link>

            <nav className="hidden items-center gap-10 md:flex">
              <a
                href="#sobre"
                className="text-sm font-medium text-[#6b4aa3] transition hover:text-[#4b2c73]"
              >
                Sobre
              </a>
              <a
                href="#recursos"
                className="text-sm font-medium text-[#6b4aa3] transition hover:text-[#4b2c73]"
              >
                Recursos
              </a>
              <a
                href="#como-funciona"
                className="text-sm font-medium text-[#6b4aa3] transition hover:text-[#4b2c73]"
              >
                Como funciona
              </a>
              <a
                href="#contato"
                className="text-sm font-medium text-[#6b4aa3] transition hover:text-[#4b2c73]"
              >
                Contato
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden rounded-2xl border border-white/70 bg-white/86 px-5 py-3 text-sm font-semibold text-[#5e3e90] shadow-[0_12px_26px_rgba(91,58,140,0.08)] backdrop-blur transition hover:bg-white sm:inline-flex"
              >
                Entrar
              </Link>

              <Link
                href="/login"
                className="rounded-2xl bg-[linear-gradient(135deg,#8f57f5_0%,#7c4ce0_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(124,76,224,0.28)] transition hover:scale-[1.02]"
              >
                Criar meu evento
              </Link>
            </div>
          </div>
        </header>

        <section id="sobre" className="relative z-20">
          <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-14">
            <div className="grid items-center gap-14 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="max-w-[670px]">
                <div className="inline-flex rounded-full border border-[#f3df9b]/70 bg-white/88 px-4 py-2 shadow-[0_10px_26px_rgba(188,145,38,0.10)] backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#9d7a1d]">
                    plataforma premium para eventos
                  </p>
                </div>

                <h1 className="mt-8 text-[46px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#4d2a78] sm:text-[60px] xl:text-[80px]">
                  O jeito mais elegante
                  <br />
                  <span className="font-normal text-[#6b4aa3]">
                    de apresentar seu evento,
                  </span>
                  <br />
                  <span className="font-normal text-[#6b4aa3]">
                    organizar presentes
                  </span>
                  <br />
                  <span className="font-normal text-[#6b4aa3]">
                    e confirmar presença.
                  </span>
                </h1>

                <p className="mt-7 max-w-[600px] text-lg leading-8 text-[#7b64a4]">
                  O VivaLista reúne página pública do evento, RSVP, presentes,
                  contribuições e gestão administrativa em uma experiência
                  sofisticada, prática e pronta para uso real.
                </p>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    href="/login"
                    className="rounded-2xl bg-[linear-gradient(135deg,#9b63ff_0%,#7d4fe1_100%)] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(124,76,224,0.28)] transition hover:scale-[1.02]"
                  >
                    Criar meu evento
                  </Link>

                  <Link
                    href="/login"
                    className="rounded-2xl border border-[#f2dfaa]/70 bg-white/84 px-7 py-4 text-base font-semibold text-[#5e3e90] shadow-[0_12px_26px_rgba(188,145,38,0.08)] backdrop-blur transition hover:bg-white"
                  >
                    Entrar no painel
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {trustItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/70 bg-white/72 px-4 py-4 text-sm font-medium text-[#6a5494] shadow-[0_10px_24px_rgba(91,58,140,0.06)] backdrop-blur"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {dashboardHighlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] border border-white/70 bg-white/72 p-4 shadow-[0_10px_24px_rgba(91,58,140,0.06)] backdrop-blur"
                    >
                      <p className="text-sm font-semibold text-[#5d3d8f]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#826ca6]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative mx-auto max-w-[720px]">
                  <div className="absolute inset-0 rounded-[60px] bg-[radial-gradient(circle_at_center,rgba(164,114,255,0.22),transparent_58%)] blur-2xl" />
                  <div className="absolute right-8 top-6 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,219,92,0.38),transparent_62%)] blur-2xl" />
                  <div className="absolute left-10 bottom-10 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,219,92,0.22),transparent_62%)] blur-2xl" />

                  <div className="relative rounded-[50px] border border-white/70 bg-white/40 p-6 shadow-[0_34px_96px_rgba(112,76,170,0.16)] backdrop-blur-xl">
                    <div className="grid items-center gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                      <div className="order-2 lg:order-1">
                        <div className="rounded-[38px] border border-white/80 bg-white/86 p-4 shadow-[0_24px_58px_rgba(110,80,160,0.12)]">
                          <div className="mx-auto max-w-[300px] overflow-hidden rounded-[34px] border border-[#eadffd] bg-white shadow-[0_22px_50px_rgba(107,74,163,0.12)]">
                            <div className="bg-[#f8f1ff] px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-[#d7b9ff]" />
                                <div className="h-2 w-2 rounded-full bg-[#c799ff]" />
                                <div className="h-2 w-2 rounded-full bg-[#b783ff]" />
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#f4ebff_0%,#efe2ff_45%,#fff7e8_100%)] p-5">
                                <div className="absolute right-[-18px] top-[-18px] h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,219,92,0.34),transparent_62%)] blur-xl" />
                                <div className="absolute left-[-12px] bottom-[-16px] h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(164,114,255,0.22),transparent_62%)] blur-xl" />

                                <div className="relative">
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b70b1]">
                                        Evento
                                      </p>
                                      <h3 className="mt-2 text-xl font-semibold text-[#5a358a]">
                                        Lucas e Amanda
                                      </h3>
                                    </div>

                                    <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-[#7a59ad]">
                                      /e/lucas-e-amanda
                                    </div>
                                  </div>

                                  <div className="mt-4 rounded-2xl border border-white/70 bg-white/72 p-4">
                                    <p className="text-sm font-medium text-[#7a62a1]">
                                      Contribua para esse dia tão especial
                                    </p>

                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                      <div className="rounded-xl bg-[#faf6ff] px-3 py-3 text-center">
                                        <div className="text-xs text-[#8a74b0]">
                                          Pix
                                        </div>
                                        <div className="mt-1 text-sm font-semibold text-[#5a358a]">
                                          fácil
                                        </div>
                                      </div>
                                      <div className="rounded-xl bg-[#faf6ff] px-3 py-3 text-center">
                                        <div className="text-xs text-[#8a74b0]">
                                          RSVP
                                        </div>
                                        <div className="mt-1 text-sm font-semibold text-[#5a358a]">
                                          real
                                        </div>
                                      </div>
                                      <div className="rounded-xl bg-[#faf6ff] px-3 py-3 text-center">
                                        <div className="text-xs text-[#8a74b0]">
                                          Lista
                                        </div>
                                        <div className="mt-1 text-sm font-semibold text-[#5a358a]">
                                          premium
                                        </div>
                                      </div>
                                    </div>

                                    <button className="mt-4 w-full rounded-2xl bg-[linear-gradient(135deg,#9b63ff_0%,#7d4fe1_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(134,83,230,0.18)]">
                                      Ver contribuições
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="order-1 flex items-center justify-center lg:order-2">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,218,90,0.68),transparent_60%)] blur-2xl" />
                          <div className="absolute inset-0 rounded-full border border-[#f1d47a]/35" />
                          <div className="relative rounded-[42px] border border-[#f3dfa0]/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.52))] px-10 py-10 shadow-[0_28px_64px_rgba(188,145,38,0.14)]">
                            <div className="text-center">
                              <div className="text-[120px] leading-none drop-shadow-[0_10px_24px_rgba(190,145,25,0.22)]">
                                ✨
                              </div>
                              <div className="mt-3 text-lg font-semibold text-[#8f6a12]">
                                Produto real
                              </div>
                              <div className="mt-1 text-sm text-[#9a7e39]">
                                página + presentes + RSVP + painel
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3 text-[#d9bf72]">
                      <span className="text-xl">✦</span>
                      <span className="text-sm uppercase tracking-[0.28em] text-[#b38a1f]">
                        experiência premium
                      </span>
                      <span className="text-xl">✦</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-20 mt-12">
              <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/70 bg-white/68 px-4 py-4 text-center text-sm font-medium text-[#6a5494] shadow-[0_10px_24px_rgba(91,58,140,0.06)] backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="recursos"
          className="relative z-20 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="rounded-[40px] border border-white/60 bg-white/58 p-8 shadow-[0_24px_66px_rgba(110,80,160,0.08)] backdrop-blur-xl">
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-[-0.03em] text-[#4d2a78]">
                Um sistema completo para o seu evento
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#826ca6]">
                O VivaLista não é só uma página bonita. Ele conecta experiência
                pública, operação interna e fluxo real de presentes e contribuições.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {featureCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-[#ede2fb] bg-white/78 p-6 shadow-[0_12px_28px_rgba(123,90,170,0.06)]"
                >
                  <div className="text-lg font-semibold text-[#5b3890]">
                    {item.title}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#8a74b0]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="exemplos"
          className="relative z-20 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="rounded-[40px] border border-white/60 bg-white/58 p-8 shadow-[0_24px_66px_rgba(110,80,160,0.08)] backdrop-blur-xl">
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-[-0.03em] text-[#4d2a78]">
                Perfeito para diferentes tipos de celebração
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#826ca6]">
                O VivaLista foi pensado para eventos especiais que precisam unir
                apresentação, presentes e confirmação de presença em um único lugar.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-5">
              {celebrations.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-[#ede2fb] bg-white/78 px-5 py-7 text-center shadow-[0_12px_28px_rgba(123,90,170,0.06)]"
                >
                  <div className="text-4xl">{item.icon}</div>
                  <div className="mt-4 text-2xl font-medium text-[#5b3890]">
                    {item.title}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-[#8a74b0]">
                    {item.subtitle}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href="#como-funciona"
                className="inline-flex rounded-2xl border border-white/70 bg-white/82 px-7 py-4 text-base font-semibold text-[#5e3e90] shadow-[0_12px_26px_rgba(91,58,140,0.08)] backdrop-blur transition hover:bg-white"
              >
                Entender como funciona
              </a>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          className="relative z-20 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-[-0.03em] text-[#4d2a78]">
              Simples como deveria ser
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#826ca6]">
              Uma jornada clara para quem organiza e uma experiência elegante para
              quem participa.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-[32px] border border-white/65 bg-white/64 p-7 shadow-[0_18px_40px_rgba(120,88,175,0.07)] backdrop-blur"
              >
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#a980ff]">
                  {item.step}
                </div>

                <div className="mt-5 text-2xl font-semibold leading-tight text-[#6b45a1]">
                  {item.title}
                </div>

                <p className="mt-4 text-base leading-8 text-[#8871ad]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-20 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[40px] border border-white/65 bg-white/64 p-8 shadow-[0_24px_66px_rgba(110,80,160,0.08)] backdrop-blur md:p-10">
              <h2 className="text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#4d2a78]">
                Uma base sólida
                <br />
                para organizar tudo
              </h2>

              <div className="mt-8 space-y-4">
                {trustItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 text-lg text-[#6f5897]"
                  >
                    <span className="text-[#f1b626]">☑</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[40px] border border-white/65 bg-white/64 p-8 shadow-[0_24px_66px_rgba(110,80,160,0.08)] backdrop-blur md:p-10">
              <div className="grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr]">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,212,100,0.30),transparent_65%)] blur-2xl" />
                    <div className="relative rounded-[30px] border border-[#eadffd] bg-white p-3 shadow-[0_18px_40px_rgba(107,74,163,0.10)]">
                      <div className="relative h-48 w-48 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#f6edff_0%,#fff6e6_100%)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,219,92,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(164,114,255,0.18),transparent_32%)]" />
                        <div className="relative flex h-full items-center justify-center text-6xl">
                          🎉
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[#f1b626]">★★★★★</div>
                  <p className="mt-4 text-2xl leading-10 text-[#6b4aa3]">
                    “Foi a forma mais fácil de concentrar os presentes, o RSVP e
                    a página do nosso evento em um só lugar.”
                  </p>
                  <p className="mt-6 text-2xl font-semibold text-[#4d2a78]">
                    Mariana e Thiago
                  </p>
                  <p className="mt-2 text-[#f1b626]">★★★★★</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contato"
          className="relative z-20 border-t border-white/45 bg-white/58 backdrop-blur"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-4xl font-semibold tracking-[-0.03em] text-[#4d2a78]">
              Crie seu evento em poucos minutos
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#826ca6]">
              Comece com uma base elegante, compartilhe sua página, acompanhe seus
              convidados e gerencie tudo pelo painel do VivaLista.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="rounded-2xl bg-[linear-gradient(135deg,#8f57f5_0%,#7c4ce0_100%)] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(124,76,224,0.28)] transition hover:scale-[1.02]"
              >
                Criar meu evento
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/70 bg-white/86 px-8 py-4 text-base font-semibold text-[#5e3e90] shadow-[0_12px_26px_rgba(91,58,140,0.08)] backdrop-blur transition hover:bg-white"
              >
                Entrar no painel
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}