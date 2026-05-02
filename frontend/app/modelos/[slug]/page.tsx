import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Modelo = {
  slug: string;
  nome: string;
  categoria: string;
  estilo: string;
  frase: string;
  descricao: string;
  anfitrioes: string;
  data: string;
  local: string;
  imagem: string;
  corPrincipal: string;
  corSecundaria: string;
  fundo: string;
  secoes: string[];
  presentes: {
    nome: string;
    valor: string;
  }[];
};

const modelos = {
  "debutante-luxo": {
    slug: "debutante-luxo",
    nome: "Debutante Luxo",
    categoria: "Aniversário de 15 anos",
    estilo: "Luxo, brilho e celebração",
    frase: "Uma noite inesquecível para celebrar uma nova fase.",
    descricao:
      "Modelo pensado para festas de debutante com visual sofisticado, destaque para fotos, programação, confirmação de presença e lista de presentes.",
    anfitrioes: "Isabella 15 anos",
    data: "18 de outubro de 2026",
    local: "Espaço Imperial • São Paulo",
    imagem:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80",
    corPrincipal: "#6d28d9",
    corSecundaria: "#f4c95d",
    fundo: "from-purple-950 via-purple-900 to-fuchsia-900",
    secoes: [
      "Convite de abertura",
      "Contagem regressiva",
      "Galeria de fotos",
      "Programação da festa",
      "Confirmação de presença",
      "Lista de presentes",
    ],
    presentes: [
      { nome: "Cota vestido dos sonhos", valor: "R$ 150,00" },
      { nome: "Viagem especial", valor: "R$ 250,00" },
      { nome: "Maquiagem profissional", valor: "R$ 120,00" },
    ],
  },
  "cha-bebe-delicado": {
    slug: "cha-bebe-delicado",
    nome: "Chá de Bebê Delicado",
    categoria: "Chá de bebê",
    estilo: "Suave, acolhedor e familiar",
    frase: "Um momento cheio de carinho para receber quem está chegando.",
    descricao:
      "Modelo delicado para chá de bebê, com cores suaves, mensagem da família, local do encontro, lista de presentes e confirmação de presença.",
    anfitrioes: "Chá do Miguel",
    data: "12 de julho de 2026",
    local: "Casa da Família • São Paulo",
    imagem:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80",
    corPrincipal: "#7dd3fc",
    corSecundaria: "#f9a8d4",
    fundo: "from-sky-100 via-pink-50 to-amber-50",
    secoes: [
      "Mensagem dos pais",
      "Contagem regressiva",
      "Localização",
      "Lista de fraldas",
      "Lista de presentes",
      "Confirmação de presença",
    ],
    presentes: [
      { nome: "Pacote de fraldas", valor: "R$ 80,00" },
      { nome: "Kit higiene bebê", valor: "R$ 120,00" },
      { nome: "Cota enxoval", valor: "R$ 150,00" },
    ],
  },
  "casa-nova-clean": {
    slug: "casa-nova-clean",
    nome: "Casa Nova Clean",
    categoria: "Casa nova",
    estilo: "Moderno, leve e elegante",
    frase: "Uma nova casa, uma nova história e muitos sonhos pela frente.",
    descricao:
      "Modelo ideal para chá de casa nova, chá de cozinha ou open house, com visual limpo, lista de presentes organizada e contribuição por Pix.",
    anfitrioes: "Lar da Ana e do Pedro",
    data: "04 de setembro de 2026",
    local: "Apartamento novo • Vila Mariana",
    imagem:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    corPrincipal: "#334155",
    corSecundaria: "#c9a46c",
    fundo: "from-stone-100 via-white to-slate-100",
    secoes: [
      "Convite de abertura",
      "Mensagem do casal",
      "Localização",
      "Lista de presentes",
      "Pix livre",
      "Confirmação de presença",
    ],
    presentes: [
      { nome: "Jogo de panelas", valor: "R$ 280,00" },
      { nome: "Air fryer", valor: "R$ 350,00" },
      { nome: "Cota decoração", valor: "R$ 100,00" },
    ],
  },
  "formatura-classica": {
    slug: "formatura-classica",
    nome: "Formatura Clássica",
    categoria: "Formatura",
    estilo: "Clássico, elegante e marcante",
    frase: "Uma conquista merece ser celebrada em grande estilo.",
    descricao:
      "Modelo para formatura com destaque para trajetória, programação, galeria, confirmação de presença e presentes em dinheiro.",
    anfitrioes: "Formatura Medicina 2026",
    data: "29 de novembro de 2026",
    local: "Salão Nobre • São Paulo",
    imagem:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
    corPrincipal: "#111827",
    corSecundaria: "#d4af37",
    fundo: "from-slate-950 via-slate-900 to-black",
    secoes: [
      "Convite de abertura",
      "Mensagem da turma",
      "Galeria",
      "Programação",
      "Localização",
      "Confirmação de presença",
    ],
    presentes: [
      { nome: "Cota baile", valor: "R$ 200,00" },
      { nome: "Cota viagem", valor: "R$ 300,00" },
      { nome: "Presente livre", valor: "Valor livre" },
    ],
  },
  "corporativo-premium": {
    slug: "corporativo-premium",
    nome: "Corporativo Premium",
    categoria: "Evento empresarial",
    estilo: "Profissional, moderno e premium",
    frase: "Uma experiência digital elegante para eventos corporativos.",
    descricao:
      "Modelo para eventos empresariais, lançamentos, encontros de equipe, palestras e confraternizações com visual profissional.",
    anfitrioes: "VivaLista Summit",
    data: "08 de dezembro de 2026",
    local: "Centro de Eventos • São Paulo",
    imagem:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    corPrincipal: "#0f172a",
    corSecundaria: "#38bdf8",
    fundo: "from-slate-950 via-blue-950 to-slate-900",
    secoes: [
      "Página institucional",
      "Agenda do evento",
      "Palestrantes",
      "Mapa",
      "Credenciamento",
      "Confirmação de presença",
    ],
    presentes: [
      { nome: "Credencial premium", valor: "R$ 99,00" },
      { nome: "Cota networking", valor: "R$ 150,00" },
      { nome: "Ingresso convidado", valor: "R$ 199,00" },
    ],
  },
} satisfies Record<string, Modelo>;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isModeloSlug(slug: string): slug is keyof typeof modelos {
  return slug in modelos;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isModeloSlug(slug)) {
    return {
      title: "Modelo não encontrado | VivaLista",
    };
  }

  const modelo = modelos[slug];

  return {
    title: `${modelo.nome} | Modelos VivaLista`,
    description: modelo.descricao,
  };
}

export function generateStaticParams() {
  return Object.keys(modelos).map((slug) => ({
    slug,
  }));
}

export default async function ModeloPreviewPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isModeloSlug(slug)) {
    notFound();
  }

  const modelo = modelos[slug];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className={`relative overflow-hidden bg-gradient-to-br ${modelo.fundo}`}>
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15)), url(${modelo.imagem})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col px-6 py-8 text-white">
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              ← Voltar para home
            </Link>

            <span className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-md">
              Preview de modelo
            </span>
          </header>

          <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex rounded-full bg-white/15 px-5 py-2 text-sm font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                {modelo.categoria}
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                {modelo.nome}
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-8 text-white/90 sm:text-2xl">
                {modelo.frase}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="rounded-full bg-white px-5 py-3 text-slate-900">
                  {modelo.data}
                </span>
                <span className="rounded-full bg-white/15 px-5 py-3 text-white backdrop-blur-md">
                  {modelo.local}
                </span>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`/dashboard/eventos/novo?modelo=${modelo.slug}`}
                  className="rounded-full bg-white px-7 py-4 text-sm font-black uppercase tracking-wide text-slate-950 shadow-2xl transition hover:-translate-y-1 hover:shadow-white/20"
                >
                  Usar este modelo
                </Link>

                <a
                  href="#preview"
                  className="rounded-full border border-white/35 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-wide text-white backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/20"
                >
                  Ver preview
                </a>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/20 bg-white/15 p-4 shadow-2xl backdrop-blur-xl">
              <div className="overflow-hidden rounded-[2rem] bg-white text-slate-950 shadow-2xl">
                <div
                  className="h-72"
                  style={{
                    backgroundImage: `url(${modelo.imagem})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <div className="p-8">
                  <div
                    className="mb-4 h-1.5 w-24 rounded-full"
                    style={{ backgroundColor: modelo.corSecundaria }}
                  />

                  <h2 className="text-3xl font-black">{modelo.anfitrioes}</h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {modelo.descricao}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Data
                      </p>
                      <p className="mt-1 text-sm font-bold">{modelo.data}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Estilo
                      </p>
                      <p className="mt-1 text-sm font-bold">{modelo.estilo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="preview" className="bg-[#f8f5ef] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-black uppercase tracking-[0.3em] text-amber-700">
              Como ficará o site
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Preview real do modelo
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Esta tela mostra a ideia visual do modelo. Depois, o usuário poderá
              criar um evento usando este estilo e preencher os dados reais.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-white/90 px-5 py-4">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500">
                <span>Início</span>
                <span>•</span>
                <span>História</span>
                <span>•</span>
                <span>Localização</span>
                <span>•</span>
                <span>Presentes</span>
                <span>•</span>
                <span>Confirmação</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div
                className="min-h-[460px]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.2)), url(${modelo.imagem})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p
                  className="text-sm font-black uppercase tracking-[0.3em]"
                  style={{ color: modelo.corPrincipal }}
                >
                  {modelo.categoria}
                </p>

                <h3 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                  {modelo.anfitrioes}
                </h3>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  {modelo.frase}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Quando
                    </p>
                    <p className="mt-2 font-bold text-slate-900">{modelo.data}</p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Onde
                    </p>
                    <p className="mt-2 font-bold text-slate-900">{modelo.local}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl"
                    style={{ backgroundColor: modelo.corPrincipal }}
                  >
                    Confirmar presença
                  </button>

                  <button
                    type="button"
                    className="rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-black uppercase tracking-wide text-slate-900"
                  >
                    Ver presentes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {modelo.presentes.map((presente) => (
              <div
                key={presente.nome}
                className="rounded-[1.75rem] border border-amber-100 bg-white p-6 shadow-lg"
              >
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                  style={{
                    backgroundColor: `${modelo.corSecundaria}33`,
                  }}
                >
                  🎁
                </div>

                <h3 className="text-xl font-black text-slate-950">
                  {presente.nome}
                </h3>

                <p className="mt-2 text-lg font-black text-amber-700">
                  {presente.valor}
                </p>

                <button
                  type="button"
                  className="mt-5 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-wide text-white"
                >
                  Presentear
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-amber-100 bg-white p-8 shadow-xl">
            <h3 className="text-2xl font-black text-slate-950">
              Seções incluídas neste modelo
            </h3>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {modelo.secoes.map((secao) => (
                <div
                  key={secao}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700"
                >
                  {secao}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href={`/dashboard/eventos/novo?modelo=${modelo.slug}`}
              className="inline-flex rounded-full bg-slate-950 px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-2xl transition hover:-translate-y-1"
            >
              Criar evento com este modelo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}