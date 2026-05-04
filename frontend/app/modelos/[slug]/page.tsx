import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Palette = {
  bg: string;
  paper: string;
  ink: string;
  muted: string;
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
};

type Model = {
  slug: string;
  title: string;
  type: string;
  hosts: string;
  date: string;
  isoDate: string;
  time: string;
  place: string;
  city: string;
  description: string;
  previewImage: string;
  heroImage: string;
  gallery: string[];
  palette: Palette;
};

const weddingImages = {
  preview: "/modelos/previews/casamento-romantico.png",
  hero:
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2400&q=96",
  couple:
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=96",
  couple2:
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=96",
  venue:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=96",
  dinner:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=96",
  flowers:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=96",
  cake:
    "https://images.unsplash.com/photo-1519741347686-c1e331fcb4d7?auto=format&fit=crop&w=1800&q=96",
  gift:
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1800&q=96",
  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=96",
  menu:
    "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1800&q=96",
  dress:
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=96",
};

const models = {
  "casamento-romantico": {
    slug: "casamento-romantico",
    title: "Casamento Romântico",
    type: "Casamento",
    hosts: "Aline & Leonardo",
    date: "24 de agosto de 2026",
    isoDate: "2026-08-24T17:00:00",
    time: "17h00",
    place: "Villa Oliva",
    city: "Itu, SP",
    description:
      "Convite premium com abertura pelo selo, site completo por seções, contagem regressiva, galeria, presentes e confirmação.",
    previewImage: weddingImages.preview,
    heroImage: weddingImages.hero,
    gallery: [
      weddingImages.flowers,
      weddingImages.couple,
      weddingImages.dinner,
      weddingImages.couple2,
      weddingImages.cake,
    ],
    palette: {
      bg: "#efe4d8",
      paper: "#fffaf2",
      ink: "#2b241f",
      muted: "#7c6a5f",
      primary: "#b88b54",
      secondary: "#d8b890",
      accent: "#c6964e",
      dark: "#0a0807",
    },
  },
  "cha-cozinha-elegante": {
    slug: "cha-cozinha-elegante",
    title: "Chá de Cozinha Elegante",
    type: "Chá de cozinha",
    hosts: "Laislla & Renan",
    date: "02 de maio de 2026",
    isoDate: "2026-05-02T13:00:00",
    time: "13h00",
    place: "Casa da Família",
    city: "São Paulo",
    description:
      "Verde sálvia, terracota e atmosfera artesanal para uma lista de presentes acolhedora.",
    previewImage:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1800&q=94",
    heroImage:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1800&q=94",
    gallery: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1800&q=94",
    ],
    palette: {
      bg: "#f4efe7",
      paper: "#fffaf2",
      ink: "#2e3e35",
      muted: "#74665a",
      primary: "#647c62",
      secondary: "#b46545",
      accent: "#c9a46c",
      dark: "#24342c",
    },
  },
  "debutante-luxo": {
    slug: "debutante-luxo",
    title: "Debutante Luxo",
    type: "15 anos",
    hosts: "Isabella",
    date: "18 de outubro de 2026",
    isoDate: "2026-10-18T20:00:00",
    time: "20h00",
    place: "Espaço Imperial",
    city: "São Paulo",
    description:
      "Roxo profundo, ouro líquido e clima red carpet para uma noite inesquecível.",
    previewImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=94",
    heroImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=94",
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1800&q=94",
    ],
    palette: {
      bg: "#14091f",
      paper: "#211033",
      ink: "#fff8ff",
      muted: "#d9c3eb",
      primary: "#8b3ff2",
      secondary: "#3b0b5f",
      accent: "#f6cb63",
      dark: "#0d0417",
    },
  },
  "cha-bebe-delicado": {
    slug: "cha-bebe-delicado",
    title: "Chá de Bebê Delicado",
    type: "Chá de bebê",
    hosts: "Chá do Miguel",
    date: "12 de julho de 2026",
    isoDate: "2026-07-12T15:00:00",
    time: "15h00",
    place: "Casa da Família",
    city: "São Paulo",
    description:
      "Azul névoa, areia e luz suave para um convite delicado, poético e familiar.",
    previewImage:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1800&q=94",
    heroImage:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1800&q=94",
    gallery: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1800&q=94",
    ],
    palette: {
      bg: "#f5f9fb",
      paper: "#ffffff",
      ink: "#263f52",
      muted: "#6f8494",
      primary: "#8ab7cc",
      secondary: "#cdb99b",
      accent: "#d7c4a6",
      dark: "#17384d",
    },
  },
  "casa-nova-clean": {
    slug: "casa-nova-clean",
    title: "Casa Nova Clean",
    type: "Casa nova",
    hosts: "Ana & Pedro",
    date: "04 de setembro de 2026",
    isoDate: "2026-09-04T18:00:00",
    time: "18h00",
    place: "Apartamento novo",
    city: "Vila Mariana",
    description:
      "Grafite, cobre e interiores sofisticados para open house e casa nova.",
    previewImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=94",
    heroImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=94",
    gallery: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1800&q=94",
    ],
    palette: {
      bg: "#f3f1ed",
      paper: "#ffffff",
      ink: "#222629",
      muted: "#6a6864",
      primary: "#2f3437",
      secondary: "#a0603d",
      accent: "#c47a4a",
      dark: "#171a1d",
    },
  },
  "formatura-classica": {
    slug: "formatura-classica",
    title: "Formatura Clássica",
    type: "Formatura",
    hosts: "Medicina 2026",
    date: "29 de novembro de 2026",
    isoDate: "2026-11-29T19:30:00",
    time: "19h30",
    place: "Salão Nobre",
    city: "São Paulo",
    description:
      "Preto absoluto, dourado e editorial de luxo para uma grande conquista.",
    previewImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=94",
    heroImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=94",
    gallery: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=94",
    ],
    palette: {
      bg: "#f7f3ea",
      paper: "#ffffff",
      ink: "#111111",
      muted: "#626262",
      primary: "#111111",
      secondary: "#020202",
      accent: "#d6b557",
      dark: "#030303",
    },
  },
  "corporativo-premium": {
    slug: "corporativo-premium",
    title: "Corporativo Premium",
    type: "Evento empresarial",
    hosts: "VivaLista Summit",
    date: "08 de dezembro de 2026",
    isoDate: "2026-12-08T09:00:00",
    time: "09h00",
    place: "Centro de Eventos",
    city: "São Paulo",
    description:
      "Navy, cyan elétrico e atmosfera tech premium para eventos empresariais.",
    previewImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=94",
    heroImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=94",
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=94",
    ],
    palette: {
      bg: "#edf4f8",
      paper: "#ffffff",
      ink: "#071526",
      muted: "#506173",
      primary: "#071b34",
      secondary: "#0b2f5a",
      accent: "#21c8ff",
      dark: "#020b16",
    },
  },
} satisfies Record<string, Model>;

function isModelSlug(slug: string): slug is keyof typeof models {
  return slug in models;
}

function themeVars(model: Model): CSSProperties & Record<string, string> {
  return {
    "--bg": model.palette.bg,
    "--paper": model.palette.paper,
    "--ink": model.palette.ink,
    "--muted": model.palette.muted,
    "--primary": model.palette.primary,
    "--secondary": model.palette.secondary,
    "--accent": model.palette.accent,
    "--dark": model.palette.dark,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isModelSlug(slug)) {
    return {
      title: "Modelo não encontrado | VivaLista",
    };
  }

  const model = models[slug];

  return {
    title: `${model.title} | Modelos VivaLista`,
    description: model.description,
  };
}

export function generateStaticParams() {
  return Object.keys(models).map((slug) => ({
    slug,
  }));
}

function GlobalStyle({ model }: { model: Model }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scroll-behavior: smooth; }

            .vl-event-preview {
              min-height: 100vh;
              color: var(--ink);
              background:
                radial-gradient(circle at 10% 2%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 28%),
                radial-gradient(circle at 92% 12%, rgba(255,255,255,.72), transparent 28%),
                linear-gradient(180deg, var(--bg), color-mix(in srgb, var(--bg) 76%, #ffffff));
              font-family: "Montserrat", "Avenir Next", Arial, sans-serif;
            }

            .vl-display {
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-weight: 400;
              letter-spacing: -.055em;
            }

            .vl-serif {
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-weight: 400;
            }

            .vl-section-title {
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-weight: 400;
              letter-spacing: .18em;
              text-transform: uppercase;
            }

            .vl-open-checkbox {
              position: absolute;
              opacity: 0;
              pointer-events: none;
              width: 1px;
              height: 1px;
            }

            .vl-invite-gate {
              position: fixed;
              inset: 0;
              z-index: 100;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              background:
                radial-gradient(circle at 14% 18%, rgba(255,255,255,.72), transparent 31%),
                radial-gradient(circle at 88% 14%, rgba(255,255,255,.56), transparent 28%),
                linear-gradient(135deg, #f8efe6 0%, #ead8c7 46%, #fff6ee 100%);
              transition:
                opacity .75s ease 1.02s,
                visibility .75s ease 1.02s;
            }

            .vl-invite-gate::before {
              content: "";
              position: absolute;
              inset: 0;
              opacity: .44;
              background-image:
                radial-gradient(circle at 1px 1px, rgba(184,139,84,.18) 1px, transparent 0);
              background-size: 18px 18px;
            }

            .vl-invite-stage {
              position: relative;
              width: min(1080px, calc(100vw - 28px));
              height: min(720px, calc(100vh - 36px));
              display: grid;
              place-items: center;
              perspective: 1800px;
            }

            .vl-real-envelope {
              position: relative;
              width: min(940px, 100%);
              height: min(480px, 72vh);
              overflow: hidden;
              border-radius: 30px;
              background-color: #fff7ee;
              background-repeat: no-repeat;
              background-size: 1840px auto;
              background-position: center -72px;
              box-shadow:
                0 48px 145px rgba(86,57,31,.28),
                0 18px 44px rgba(86,57,31,.16),
                0 0 0 1px rgba(255,255,255,.92);
              transform-style: preserve-3d;
              transition:
                transform 1.35s cubic-bezier(.2,.8,.2,1),
                opacity .78s ease 1.35s,
                filter 1s ease;
            }

            .vl-real-envelope::before {
              content: "";
              position: absolute;
              inset: 0;
              z-index: 1;
              pointer-events: none;
              background:
                linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.24)),
                radial-gradient(circle at 50% 48%, transparent 0 96px, rgba(255,248,239,.10) 255px);
            }

            .vl-paper-preview {
              position: absolute;
              left: 50%;
              top: 24px;
              z-index: 2;
              width: min(470px, 70%);
              min-height: 255px;
              transform: translate(-50%, 80px) scale(.92);
              border: 1px solid rgba(184,139,84,.18);
              background:
                radial-gradient(circle at 22% 16%, rgba(201,150,78,.10), transparent 32%),
                linear-gradient(180deg, rgba(255,253,247,.96), rgba(248,236,220,.94));
              box-shadow: 0 18px 46px rgba(86,57,31,.16);
              opacity: .08;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              color: #8d6737;
              transition:
                transform 1.18s cubic-bezier(.2,.8,.2,1),
                opacity .55s ease,
                filter .8s ease;
            }

            .vl-paper-preview strong {
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-size: clamp(2.6rem, 5vw, 5.3rem);
              font-weight: 400;
              line-height: .92;
              letter-spacing: -.05em;
              color: #8f683c;
            }

            .vl-paper-preview span {
              margin-top: 18px;
              width: 86px;
              height: 1px;
              background: linear-gradient(90deg, transparent, #c6964e, transparent);
            }

            .vl-paper-preview p {
              margin: 18px 0 0;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .24em;
              text-transform: uppercase;
              color: #9a7650;
            }

            .vl-envelope-glow {
              position: absolute;
              inset: 0;
              z-index: 3;
              pointer-events: none;
              background:
                linear-gradient(90deg, rgba(255,255,255,.16), transparent 18%, transparent 82%, rgba(255,255,255,.16)),
                radial-gradient(circle at 50% 50%, rgba(255,255,255,.16), transparent 38%);
            }

            .vl-animated-flap {
              position: absolute;
              left: 50%;
              top: 0;
              z-index: 4;
              width: min(680px, 76%);
              height: min(210px, 42%);
              transform: translateX(-50%) rotateX(0deg);
              transform-origin: top center;
              clip-path: polygon(0 0, 100% 0, 50% 100%);
              background:
                linear-gradient(180deg, rgba(255,255,255,.98), rgba(236,222,204,.90)),
                radial-gradient(circle at 50% 0%, rgba(201,150,78,.18), transparent 60%);
              box-shadow: 0 24px 42px rgba(95,65,37,.16);
              opacity: .72;
              transition:
                transform 1.18s cubic-bezier(.18,.88,.25,1),
                opacity .85s ease,
                filter .75s ease;
              transform-style: preserve-3d;
              backface-visibility: visible;
            }

            .vl-open-seal {
              position: absolute;
              left: 50%;
              top: 50%;
              z-index: 8;
              width: 140px;
              height: 140px;
              transform: translate(-50%, -50%);
              border: 0;
              border-radius: 999px;
              cursor: pointer;
              display: grid;
              place-items: center;
              background: transparent;
              color: white;
              transition:
                transform .28s ease,
                filter .28s ease,
                opacity .58s ease;
            }

            .vl-open-seal::before {
              content: "";
              position: absolute;
              inset: 17px;
              border-radius: 999px;
              background:
                radial-gradient(circle at 32% 28%, #ffe8a8, #c88c35 42%, #823f1d 76%, #361409);
              box-shadow:
                0 16px 34px rgba(90,48,20,.36),
                inset 0 2px 8px rgba(255,255,255,.48);
              opacity: .30;
              animation: vlSealPulse 2s ease-in-out infinite;
            }

            .vl-open-seal span {
              position: relative;
              display: block;
              max-width: 116px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.74);
              background: rgba(49,32,20,.58);
              padding: 14px 16px;
              font-size: 10px;
              line-height: 1.35;
              font-weight: 900;
              letter-spacing: .19em;
              text-align: center;
              text-transform: uppercase;
              box-shadow: 0 10px 28px rgba(0,0,0,.22);
              backdrop-filter: blur(4px);
            }

            .vl-open-seal:hover {
              transform: translate(-50%, -50%) scale(1.05);
              filter: brightness(1.08);
            }

            .vl-gate-hint {
              position: absolute;
              left: 50%;
              bottom: 26px;
              z-index: 9;
              transform: translateX(-50%);
              border-radius: 999px;
              background: rgba(255,250,242,.90);
              padding: 13px 22px;
              color: #8d6737;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .22em;
              text-align: center;
              text-transform: uppercase;
              box-shadow: 0 14px 34px rgba(79,55,34,.12);
              backdrop-filter: blur(10px);
              transition: opacity .45s ease;
            }

            #vlOpenInvite:checked ~ .vl-invite-gate .vl-animated-flap {
              transform: translateX(-50%) rotateX(-176deg) translateY(-14px);
              opacity: .30;
              filter: brightness(1.08);
            }

            #vlOpenInvite:checked ~ .vl-invite-gate .vl-paper-preview {
              transform: translate(-50%, -185px) scale(1.02);
              opacity: 1;
              filter: brightness(1.03);
            }

            #vlOpenInvite:checked ~ .vl-invite-gate .vl-real-envelope {
              transform: translateY(-26px) scale(.96);
              opacity: .98;
              filter: brightness(1.06);
            }

            #vlOpenInvite:checked ~ .vl-invite-gate .vl-open-seal,
            #vlOpenInvite:checked ~ .vl-invite-gate .vl-gate-hint {
              opacity: 0;
              pointer-events: none;
            }

            #vlOpenInvite:checked ~ .vl-invite-gate {
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
            }

            #vlOpenInvite:not(:checked) ~ .vl-site {
              height: 0;
              overflow: hidden;
              opacity: 0;
              pointer-events: none;
            }

            #vlOpenInvite:checked ~ .vl-site {
              animation: vlRevealSite 1.05s cubic-bezier(.2,.8,.2,1) 1.55s both;
            }

            .vl-menu {
              position: sticky;
              top: 0;
              z-index: 40;
              border-bottom: 1px solid rgba(184,139,84,.18);
              background: rgba(255,250,242,.88);
              backdrop-filter: blur(16px);
            }

            .vl-menu-inner {
              margin: 0 auto;
              display: flex;
              max-width: 1180px;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              gap: 4px 22px;
              padding: 15px 16px;
            }

            .vl-menu a {
              position: relative;
              padding: 8px 0;
              color: var(--muted);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .18em;
              text-transform: uppercase;
              transition: color .25s ease;
            }

            .vl-menu a::after {
              content: "";
              position: absolute;
              left: 50%;
              bottom: 3px;
              width: 0;
              height: 1px;
              background: var(--accent);
              transform: translateX(-50%);
              transition: width .25s ease;
            }

            .vl-menu a:hover {
              color: var(--primary);
            }

            .vl-menu a:hover::after {
              width: 76%;
            }

            .vl-hero {
              position: relative;
              min-height: 760px;
              overflow: hidden;
              background: var(--dark);
              color: white;
            }

            .vl-hero-bg {
              position: absolute;
              inset: 0;
              background-size: cover;
              background-position: center;
            }

            .vl-hero::before {
              content: "";
              position: absolute;
              inset: 0;
              background:
                linear-gradient(90deg, rgba(10,8,7,.92) 0%, rgba(10,8,7,.55) 44%, rgba(10,8,7,.08) 100%),
                linear-gradient(180deg, rgba(10,8,7,.10), rgba(10,8,7,.52));
            }

            .vl-hero-content {
              position: relative;
              z-index: 2;
              margin: 0 auto;
              display: flex;
              min-height: 760px;
              max-width: 1180px;
              align-items: center;
              padding: 88px 24px;
            }

            .vl-hero-box {
              max-width: 660px;
            }

            .vl-eyebrow {
              color: var(--accent);
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .28em;
              text-transform: uppercase;
            }

            .vl-hero-title {
              margin-top: 24px;
              font-size: clamp(4.5rem, 10vw, 8.6rem);
              line-height: .82;
              color: #fff1e1;
            }

            .vl-hero-title span {
              display: block;
              color: #ddbf98;
            }

            .vl-hero-subtitle {
              margin-top: 28px;
              max-width: 520px;
              color: #f1dfc8;
              font-size: clamp(1.7rem, 3vw, 2.55rem);
              font-style: italic;
              line-height: 1.14;
            }

            .vl-hero-meta {
              margin-top: 32px;
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
            }

            .vl-pill {
              border: 1px solid rgba(255,255,255,.18);
              border-radius: 999px;
              background: rgba(255,255,255,.08);
              padding: 12px 16px;
              color: rgba(255,255,255,.82);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .18em;
              text-transform: uppercase;
              backdrop-filter: blur(8px);
            }

            .vl-countdown {
              position: relative;
              overflow: hidden;
              background:
                radial-gradient(circle at 12% 10%, rgba(255,255,255,.12), transparent 28%),
                linear-gradient(135deg, var(--dark), color-mix(in srgb, var(--dark) 80%, var(--accent)));
              color: white;
              padding: 78px 20px;
              text-align: center;
            }

            .vl-countdown h2 {
              margin: 0 0 30px;
              color: #f7e5c9;
            }

            .vl-time-grid {
              margin: 0 auto;
              display: grid;
              max-width: 840px;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 16px;
            }

            .vl-time-card {
              border: 1px solid rgba(255,255,255,.10);
              border-radius: 26px;
              background: rgba(255,255,255,.09);
              padding: 26px 18px;
              box-shadow: 0 18px 50px rgba(0,0,0,.18);
              backdrop-filter: blur(10px);
            }

            .vl-time-card strong {
              display: block;
              color: var(--accent);
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-size: clamp(2.4rem, 4vw, 4.4rem);
              font-weight: 400;
              line-height: 1;
            }

            .vl-time-card span {
              margin-top: 10px;
              display: block;
              color: rgba(255,255,255,.62);
              font-size: 10px;
              font-weight: 900;
              letter-spacing: .22em;
              text-transform: uppercase;
            }

            .vl-welcome {
              background: var(--paper);
              padding: 82px 20px;
              text-align: center;
            }

            .vl-welcome-card {
              margin: 0 auto;
              max-width: 950px;
              border: 1px solid rgba(184,139,84,.18);
              border-radius: 34px;
              background:
                radial-gradient(circle at 18% 12%, rgba(201,150,78,.12), transparent 28%),
                linear-gradient(180deg, rgba(255,255,255,.78), rgba(255,255,255,.52));
              padding: 56px 36px;
              box-shadow: 0 24px 76px rgba(84,57,31,.08);
            }

            .vl-welcome-card h2 {
              margin: 0;
              color: var(--primary);
              font-size: clamp(2.2rem, 5vw, 4.5rem);
              line-height: 1.02;
            }

            .vl-welcome-card p {
              margin: 28px auto 0;
              max-width: 760px;
              color: var(--muted);
              font-size: 17px;
              line-height: 1.9;
            }

            .vl-editorial-section {
              padding: 88px 20px;
            }

            .vl-inner {
              margin: 0 auto;
              max-width: 1180px;
            }

            .vl-story-grid {
              display: grid;
              grid-template-columns: .92fr 1.08fr;
              gap: 54px;
              align-items: center;
            }

            .vl-photo-stack {
              position: relative;
              min-height: 560px;
            }

            .vl-photo-main {
              position: absolute;
              inset: 0 80px 70px 0;
              overflow: hidden;
              border: 12px solid var(--paper);
              background: var(--paper);
              box-shadow: 0 24px 80px rgba(84,57,31,.14);
            }

            .vl-photo-main div,
            .vl-photo-small div,
            .vl-info-image div,
            .vl-hotel-image div {
              width: 100%;
              height: 100%;
              background-size: cover;
              background-position: center;
              transition: transform .65s ease;
            }

            .vl-photo-main:hover div,
            .vl-photo-small:hover div,
            .vl-info-image:hover div,
            .vl-hotel-image:hover div {
              transform: scale(1.04);
            }

            .vl-photo-small {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 46%;
              height: 310px;
              overflow: hidden;
              border: 10px solid var(--paper);
              background: var(--paper);
              box-shadow: 0 22px 70px rgba(84,57,31,.14);
            }

            .vl-text-block h2 {
              margin: 18px 0 0;
              color: var(--ink);
              font-size: clamp(3rem, 6vw, 6rem);
              line-height: .9;
            }

            .vl-text-block p {
              margin-top: 26px;
              color: var(--muted);
              font-size: 17px;
              line-height: 1.9;
            }

            .vl-text-block .vl-quote {
              margin-top: 30px;
              border-left: 2px solid var(--accent);
              padding-left: 24px;
              color: var(--primary);
              font-size: 30px;
              line-height: 1.18;
            }

            .vl-ceremony-band {
              position: relative;
              overflow: hidden;
              background: var(--dark);
              color: white;
            }

            .vl-ceremony-band::before {
              content: "";
              position: absolute;
              inset: 0;
              background-size: cover;
              background-position: center;
              background-image: var(--venue-image);
              opacity: .26;
            }

            .vl-ceremony-band::after {
              content: "";
              position: absolute;
              inset: 0;
              background: linear-gradient(90deg, rgba(10,8,7,.95), rgba(10,8,7,.70), rgba(10,8,7,.42));
            }

            .vl-ceremony-content {
              position: relative;
              z-index: 2;
              margin: 0 auto;
              max-width: 1050px;
              padding: 76px 20px;
              text-align: center;
            }

            .vl-ceremony-content h2 {
              margin: 0 0 34px;
              color: #f7e5c9;
            }

            .vl-event-details {
              display: grid;
              grid-template-columns: 1fr auto 1fr;
              gap: 38px;
              align-items: center;
            }

            .vl-detail-card {
              padding: 24px;
            }

            .vl-detail-icon {
              color: var(--accent);
              font-size: 44px;
              line-height: 1;
            }

            .vl-detail-card h3 {
              margin: 16px 0 0;
              color: var(--accent);
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .27em;
              text-transform: uppercase;
            }

            .vl-detail-card strong {
              margin-top: 12px;
              display: block;
              color: white;
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-size: 38px;
              font-weight: 400;
            }

            .vl-detail-card p {
              margin: 12px 0 0;
              color: rgba(255,255,255,.65);
              line-height: 1.7;
            }

            .vl-vertical-line {
              width: 1px;
              height: 160px;
              background: rgba(255,255,255,.18);
            }

            .vl-gallery-section {
              background: var(--paper);
              padding: 68px 0 24px;
              text-align: center;
            }

            .vl-gallery-title {
              margin-bottom: 28px;
              color: var(--primary);
            }

            .vl-gallery-strip {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
            }

            .vl-gallery-item {
              height: 300px;
              overflow: hidden;
              background: #eee;
            }

            .vl-gallery-item div {
              width: 100%;
              height: 100%;
              background-size: cover;
              background-position: center;
              transition: transform .7s ease, filter .5s ease;
            }

            .vl-gallery-item:hover div {
              transform: scale(1.06);
              filter: brightness(1.02) contrast(1.04);
            }

            .vl-reception {
              background: #f4e7dc;
              padding: 86px 20px;
            }

            .vl-reception-grid {
              display: grid;
              grid-template-columns: .82fr 1.18fr;
              gap: 42px;
              align-items: center;
            }

            .vl-info-card {
              border: 1px solid rgba(184,139,84,.18);
              background: rgba(255,250,242,.82);
              padding: 42px;
              box-shadow: 0 24px 76px rgba(84,57,31,.08);
            }

            .vl-info-card h2 {
              margin: 0;
              color: var(--ink);
              font-size: clamp(2.7rem, 5vw, 5.7rem);
              line-height: .93;
            }

            .vl-info-card p {
              margin: 24px 0 0;
              color: var(--muted);
              font-size: 16px;
              line-height: 1.85;
            }

            .vl-info-image,
            .vl-hotel-image {
              min-height: 430px;
              overflow: hidden;
              border: 12px solid var(--paper);
              background: var(--paper);
              box-shadow: 0 24px 80px rgba(84,57,31,.14);
            }

            .vl-duo {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 22px;
              margin-top: 26px;
            }

            .vl-mini-card {
              border: 1px solid rgba(184,139,84,.16);
              background: rgba(255,255,255,.66);
              padding: 22px;
            }

            .vl-mini-card strong {
              color: var(--ink);
              font-size: 14px;
              letter-spacing: .16em;
              text-transform: uppercase;
            }

            .vl-mini-card p {
              margin: 10px 0 0;
              color: var(--muted);
              font-size: 14px;
              line-height: 1.7;
            }

            .vl-location {
              background: var(--paper);
              padding: 88px 20px;
            }

            .vl-location-grid {
              display: grid;
              grid-template-columns: .82fr 1.18fr;
              gap: 32px;
              align-items: stretch;
            }

            .vl-map-box {
              min-height: 440px;
              overflow: hidden;
              border: 1px solid rgba(184,139,84,.16);
              background:
                linear-gradient(135deg, rgba(255,255,255,.62), rgba(255,255,255,.20)),
                radial-gradient(circle at 20% 20%, rgba(201,150,78,.12), transparent 28%);
              box-shadow: 0 24px 76px rgba(84,57,31,.08);
            }

            .vl-map-placeholder {
              display: grid;
              height: 100%;
              min-height: 440px;
              place-items: center;
              padding: 32px;
              text-align: center;
            }

            .vl-map-placeholder strong {
              display: block;
              font-size: 32px;
              color: var(--ink);
            }

            .vl-map-placeholder p {
              margin: 12px auto 0;
              max-width: 360px;
              color: var(--muted);
              line-height: 1.75;
            }

            .vl-gifts {
              background: #f3dcd1;
              padding: 88px 20px;
            }

            .vl-gifts-grid {
              display: grid;
              grid-template-columns: .72fr 1.28fr;
              gap: 42px;
              align-items: center;
            }

            .vl-gift-cards {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 18px;
            }

            .vl-gift-card {
              overflow: hidden;
              background: var(--paper);
              box-shadow: 0 20px 64px rgba(84,57,31,.10);
            }

            .vl-gift-card-image {
              height: 190px;
              background-size: cover;
              background-position: center;
            }

            .vl-gift-card-body {
              padding: 22px;
            }

            .vl-gift-card h3 {
              margin: 0;
              color: var(--muted);
              font-size: 12px;
              font-weight: 900;
              letter-spacing: .17em;
              line-height: 1.55;
              text-transform: uppercase;
            }

            .vl-gift-card p {
              margin: 12px 0 0;
              color: var(--primary);
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-size: 30px;
            }

            .vl-rsvp {
              background: var(--paper);
              padding: 88px 20px 120px;
            }

            .vl-rsvp-box {
              margin: 0 auto;
              display: grid;
              max-width: 1080px;
              grid-template-columns: .8fr 1.2fr;
              overflow: hidden;
              border: 1px solid rgba(184,139,84,.16);
              background: rgba(255,255,255,.70);
              box-shadow: 0 26px 80px rgba(84,57,31,.10);
            }

            .vl-rsvp-left {
              background: var(--dark);
              color: white;
              padding: 48px;
            }

            .vl-rsvp-left h2 {
              margin: 18px 0 0;
              color: #f7e5c9;
              font-size: clamp(2.7rem, 5vw, 5.6rem);
              line-height: .95;
            }

            .vl-rsvp-left p {
              margin: 24px 0 0;
              color: rgba(255,255,255,.66);
              line-height: 1.8;
            }

            .vl-rsvp-form {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 14px;
              padding: 48px;
            }

            .vl-rsvp-form input,
            .vl-rsvp-form select {
              border: 1px solid rgba(184,139,84,.24);
              background: transparent;
              padding: 15px 14px;
              color: var(--ink);
              font-size: 11px;
              font-weight: 800;
              letter-spacing: .12em;
              outline: none;
              text-transform: uppercase;
            }

            .vl-rsvp-form button {
              grid-column: 1 / -1;
              border: 0;
              background: var(--dark);
              padding: 16px;
              color: var(--accent);
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .22em;
              text-transform: uppercase;
              cursor: pointer;
              transition: transform .24s ease, filter .24s ease;
            }

            .vl-rsvp-form button:hover {
              transform: translateY(-2px);
              filter: brightness(1.08);
            }

            .vl-footer {
              background: var(--dark);
              color: rgba(255,255,255,.64);
              padding: 30px 20px 110px;
              text-align: center;
            }

            .vl-footer strong {
              color: var(--accent);
              font-family: "Bodoni 72", "Didot", "Playfair Display", Georgia, serif;
              font-size: 28px;
              font-weight: 400;
            }

            .vl-floating-actions {
              position: fixed;
              inset-inline: 0;
              bottom: 16px;
              z-index: 60;
              display: flex;
              justify-content: center;
              padding: 0 16px;
            }

            .vl-action-shell {
              display: flex;
              width: 100%;
              max-width: 560px;
              gap: 10px;
              border: 1px solid rgba(255,255,255,.35);
              border-radius: 999px;
              background: rgba(0,0,0,.36);
              padding: 8px;
              box-shadow: 0 24px 70px rgba(0,0,0,.28);
              backdrop-filter: blur(18px);
            }

            .vl-action-shell a {
              flex: 1;
              border-radius: 999px;
              padding: 15px 14px;
              text-align: center;
              color: white;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .16em;
              text-transform: uppercase;
              transition: transform .22s ease, background .22s ease;
            }

            .vl-action-shell a:first-child {
              border: 1px solid rgba(255,255,255,.18);
            }

            .vl-action-shell a:last-child {
              flex: 1.35;
              background: var(--accent);
              color: var(--dark);
              box-shadow: 0 14px 30px rgba(0,0,0,.24);
            }

            .vl-action-shell a:hover {
              transform: translateY(-1px);
            }

            .vl-simple-model {
              min-height: 100vh;
              padding: 76px 20px 120px;
            }

            .vl-simple-card {
              margin: 0 auto;
              display: grid;
              max-width: 1180px;
              grid-template-columns: .8fr 1.2fr;
              gap: 40px;
              align-items: center;
            }

            .vl-simple-card h1 {
              margin: 22px 0 0;
              font-size: clamp(4rem, 8vw, 8rem);
              line-height: .86;
            }

            .vl-simple-card p {
              margin-top: 24px;
              color: var(--muted);
              font-size: 18px;
              line-height: 1.85;
            }

            .vl-simple-image {
              min-height: 620px;
              border: 12px solid var(--paper);
              border-radius: 40px;
              background-size: cover;
              background-position: center;
              box-shadow: 0 34px 100px rgba(0,0,0,.18);
            }

            @keyframes vlSealPulse {
              0%, 100% { transform: scale(1); opacity: .28; }
              50% { transform: scale(1.10); opacity: .42; }
            }

            @keyframes vlRevealSite {
              from { opacity: 0; transform: translateY(34px); filter: blur(10px); }
              to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }

            @media (max-width: 980px) {
              .vl-story-grid,
              .vl-reception-grid,
              .vl-location-grid,
              .vl-gifts-grid,
              .vl-rsvp-box,
              .vl-simple-card {
                grid-template-columns: 1fr;
              }

              .vl-event-details {
                grid-template-columns: 1fr;
                gap: 18px;
              }

              .vl-vertical-line {
                display: none;
              }

              .vl-gallery-strip {
                grid-template-columns: repeat(2, 1fr);
              }

              .vl-gift-cards {
                grid-template-columns: 1fr;
              }

              .vl-rsvp-form {
                grid-template-columns: 1fr;
              }
            }

            @media (max-width: 720px) {
              .vl-invite-stage {
                width: calc(100vw - 18px);
                height: calc(100vh - 22px);
              }

              .vl-real-envelope {
                width: min(96vw, 720px);
                height: min(360px, 54vh);
                border-radius: 24px;
                background-size: 1380px auto;
                background-position: center -52px;
              }

              .vl-paper-preview {
                width: 72%;
                min-height: 205px;
                transform: translate(-50%, 62px) scale(.92);
              }

              .vl-paper-preview strong {
                font-size: clamp(2.2rem, 11vw, 4.2rem);
              }

              .vl-animated-flap {
                width: 78%;
                height: min(150px, 38%);
              }

              .vl-open-seal {
                top: 50%;
                width: 118px;
                height: 118px;
              }

              .vl-open-seal span {
                font-size: 9px;
                letter-spacing: .15em;
              }

              .vl-gate-hint {
                bottom: 18px;
                max-width: calc(100vw - 34px);
                font-size: 9px;
                letter-spacing: .16em;
              }

              .vl-menu-inner {
                gap: 2px 14px;
                padding: 12px 12px;
              }

              .vl-menu a {
                font-size: 9px;
                letter-spacing: .12em;
              }

              .vl-hero,
              .vl-hero-content {
                min-height: 640px;
              }

              .vl-hero-content {
                padding: 70px 20px;
              }

              .vl-time-grid {
                grid-template-columns: repeat(2, 1fr);
              }

              .vl-welcome-card,
              .vl-info-card,
              .vl-rsvp-left,
              .vl-rsvp-form {
                padding: 32px 22px;
              }

              .vl-photo-stack {
                min-height: 470px;
              }

              .vl-photo-main {
                inset: 0 40px 90px 0;
              }

              .vl-photo-small {
                width: 52%;
                height: 240px;
              }

              .vl-gallery-item {
                height: 220px;
              }

              .vl-action-shell a {
                padding: 14px 8px;
                font-size: 9px;
                letter-spacing: .10em;
              }
            }
          `,
        }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var targetDate = new Date("${model.isoDate}").getTime();

              function pad(value) {
                return String(value).padStart(2, "0");
              }

              function updateCountdown() {
                var now = new Date().getTime();
                var distance = Math.max(targetDate - now, 0);

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
                var minutes = Math.floor((distance / (1000 * 60)) % 60);
                var seconds = Math.floor((distance / 1000) % 60);

                var d = document.getElementById("vl-count-days");
                var h = document.getElementById("vl-count-hours");
                var m = document.getElementById("vl-count-minutes");
                var s = document.getElementById("vl-count-seconds");

                if (d) d.textContent = String(days);
                if (h) h.textContent = pad(hours);
                if (m) m.textContent = pad(minutes);
                if (s) s.textContent = pad(seconds);
              }

              updateCountdown();
              setInterval(updateCountdown, 1000);
            })();
          `,
        }}
      />
    </>
  );
}

function FloatingActions({ model }: { model: Model }) {
  return (
    <div className="vl-floating-actions">
      <div className="vl-action-shell">
        <Link href="/">Voltar</Link>
        <Link href={`/dashboard/eventos/novo?modelo=${model.slug}`}>
          Escolher modelo
        </Link>
      </div>
    </div>
  );
}

function WeddingInvitationGate({ model }: { model: Model }) {
  return (
    <>
      <input
        id="vlOpenInvite"
        type="checkbox"
        className="vl-open-checkbox"
        aria-hidden="true"
      />

      <section className="vl-invite-gate" aria-label="Convite de abertura">
        <div className="vl-invite-stage">
          <div
            className="vl-real-envelope"
            style={{ backgroundImage: `url(${model.previewImage})` }}
            aria-label={`Envelope do modelo ${model.title}`}
          >
            <div className="vl-paper-preview" aria-hidden="true">
              <strong>Aline<br />& Leonardo</strong>
              <span />
              <p>O início do nosso para sempre</p>
            </div>

            <div className="vl-envelope-glow" />
            <div className="vl-animated-flap" />

            <label
              htmlFor="vlOpenInvite"
              className="vl-open-seal"
              aria-label="Abrir convite"
            >
              <span>Abrir convite</span>
            </label>

            <div className="vl-gate-hint">
              Clique no selo para abrir o site
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function WeddingMenu() {
  return (
    <nav className="vl-menu">
      <div className="vl-menu-inner">
        <a href="#inicio">Início</a>
        <a href="#historia">Nossa história</a>
        <a href="#cerimonia">Cerimônia</a>
        <a href="#galeria">Galeria</a>
        <a href="#recepcao">Recepção</a>
        <a href="#informacoes">Informações</a>
        <a href="#cardapio">Cardápio</a>
        <a href="#localizacao">Localização</a>
        <a href="#hospedagem">Hospedagem</a>
        <a href="#presentes">Presentes</a>
        <a href="#rsvp">Confirmação</a>
      </div>
    </nav>
  );
}

function WeddingHero({ model }: { model: Model }) {
  return (
    <section id="inicio" className="vl-hero">
      <div
        className="vl-hero-bg"
        style={{ backgroundImage: `url(${model.heroImage})` }}
      />
      <div className="vl-hero-content">
        <div className="vl-hero-box">
          <p className="vl-eyebrow">Com muito amor</p>
          <h1 className="vl-display vl-hero-title">
            Aline
            <span>& Leonardo</span>
          </h1>
          <p className="vl-serif vl-hero-subtitle">
            O início do nosso para sempre.
          </p>
          <div className="vl-hero-meta">
            <span className="vl-pill">{model.date}</span>
            <span className="vl-pill">{model.time}</span>
            <span className="vl-pill">
              {model.place} • {model.city}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Countdown() {
  return (
    <section className="vl-countdown">
      <h2 className="vl-section-title">Contagem regressiva</h2>
      <div className="vl-time-grid">
        <div className="vl-time-card">
          <strong id="vl-count-days">0</strong>
          <span>Dias</span>
        </div>
        <div className="vl-time-card">
          <strong id="vl-count-hours">00</strong>
          <span>Horas</span>
        </div>
        <div className="vl-time-card">
          <strong id="vl-count-minutes">00</strong>
          <span>Minutos</span>
        </div>
        <div className="vl-time-card">
          <strong id="vl-count-seconds">00</strong>
          <span>Segundos</span>
        </div>
      </div>
    </section>
  );
}

function WelcomeText() {
  return (
    <section className="vl-welcome">
      <div className="vl-welcome-card">
        <h2 className="vl-serif">O que Deus uniu, ninguém separe.</h2>
        <p>
          Criamos este site para compartilhar com vocês os detalhes da organização
          do nosso casamento. Estamos muito felizes e contamos com a presença de
          todos no nosso grande dia. Aqui vocês encontrarão informações sobre o
          local, trajes, estacionamento, hospedagem, presentes e confirmação de
          presença.
        </p>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section id="historia" className="vl-editorial-section">
      <div className="vl-inner vl-story-grid">
        <div className="vl-photo-stack">
          <div className="vl-photo-main">
            <div style={{ backgroundImage: `url(${weddingImages.couple2})` }} />
          </div>
          <div className="vl-photo-small">
            <div style={{ backgroundImage: `url(${weddingImages.couple})` }} />
          </div>
        </div>

        <div className="vl-text-block">
          <p className="vl-eyebrow">Nossa história</p>
          <h2 className="vl-display">Dois caminhos. Um mesmo destino.</h2>
          <p>
            Nos encontramos quando menos esperávamos e, desde então, cada momento
            juntos fez sentido. Entre risos, sonhos e escolhas, descobrimos que o
            amor é o nosso melhor capítulo. E agora queremos escrevê-lo para sempre,
            ao lado de quem amamos.
          </p>
          <p className="vl-serif vl-quote">
            Cada dia é um capítulo novo na nossa história de amor.
          </p>
        </div>
      </div>
    </section>
  );
}

function CeremonySection() {
  return (
    <section
      id="cerimonia"
      className="vl-ceremony-band"
      style={
        {
          "--venue-image": `url(${weddingImages.venue})`,
        } as CSSProperties & Record<string, string>
      }
    >
      <div className="vl-ceremony-content">
        <h2 className="vl-section-title">Cerimônia & Recepção</h2>
        <div className="vl-event-details">
          <div className="vl-detail-card">
            <div className="vl-detail-icon">♙</div>
            <h3>Cerimônia</h3>
            <strong>17h00</strong>
            <p>
              Capela São José
              <br />
              Villa Oliva • Itu, SP
            </p>
          </div>

          <div className="vl-vertical-line" />

          <div className="vl-detail-card">
            <div className="vl-detail-icon">♢</div>
            <h3>Recepção</h3>
            <strong>19h00</strong>
            <p>
              Salão principal
              <br />
              Jantar, música e celebração
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection({ model }: { model: Model }) {
  return (
    <section id="galeria" className="vl-gallery-section">
      <p className="vl-section-title vl-gallery-title">Galeria</p>
      <div className="vl-gallery-strip">
        {model.gallery.map((photo) => (
          <div className="vl-gallery-item" key={photo}>
            <div style={{ backgroundImage: `url(${photo})` }} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ReceptionSection() {
  return (
    <section id="recepcao" className="vl-reception">
      <div className="vl-inner vl-reception-grid">
        <div className="vl-info-card">
          <p className="vl-eyebrow">Recepção</p>
          <h2 className="vl-display">Depois da cerimônia, celebraremos juntos.</h2>
          <p>
            Preparamos uma noite especial para receber família e amigos com jantar,
            música, pista, boas conversas e muitos momentos para guardar na memória.
          </p>
        </div>

        <div className="vl-info-image">
          <div style={{ backgroundImage: `url(${weddingImages.dinner})` }} />
        </div>
      </div>
    </section>
  );
}

function InfoSection() {
  return (
    <section id="informacoes" className="vl-editorial-section">
      <div className="vl-inner vl-story-grid">
        <div className="vl-text-block">
          <p className="vl-eyebrow">Informações gerais</p>
          <h2 className="vl-display">Tudo pensado para você chegar tranquilo.</h2>
          <p>
            O local conta com estacionamento, estrutura coberta e equipe de apoio.
            Sugerimos traje social elegante em tons neutros. Evite salto muito fino
            nas áreas de jardim.
          </p>

          <div className="vl-duo">
            <div className="vl-mini-card">
              <strong>Dress code</strong>
              <p>Social elegante, tons neutros e tecidos leves.</p>
            </div>
            <div className="vl-mini-card">
              <strong>Orientação</strong>
              <p>Chegue com antecedência para aproveitar a cerimônia.</p>
            </div>
          </div>
        </div>

        <div className="vl-info-image">
          <div style={{ backgroundImage: `url(${weddingImages.dress})` }} />
        </div>
      </div>
    </section>
  );
}

function MenuSection() {
  return (
    <section id="cardapio" className="vl-reception">
      <div className="vl-inner vl-reception-grid">
        <div className="vl-info-image">
          <div style={{ backgroundImage: `url(${weddingImages.menu})` }} />
        </div>

        <div className="vl-info-card">
          <p className="vl-eyebrow">Cardápio</p>
          <h2 className="vl-display">Uma experiência para celebrar com sabor.</h2>
          <p>
            Os convidados serão recebidos com welcome drinks e mesa de antepastos.
            Após a cerimônia, teremos jantar, sobremesas e bebidas selecionadas para
            acompanhar a noite.
          </p>
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="localizacao" className="vl-location">
      <div className="vl-inner vl-location-grid">
        <div className="vl-info-card">
          <p className="vl-eyebrow">Localização</p>
          <h2 className="vl-display">Como chegar</h2>
          <p>
            Villa Oliva • Itu, SP
            <br />
            O endereço completo e os botões de rota entram aqui no site real. No
            VivaLista, essa área será integrada com mapa, Waze e Google Maps.
          </p>
        </div>

        <div className="vl-map-box">
          <div className="vl-map-placeholder">
            <div>
              <strong>Mapa do evento</strong>
              <p>
                Área reservada para mapa incorporado, referência do local,
                estacionamento e botão “Como chegar”.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HotelSection() {
  return (
    <section id="hospedagem" className="vl-editorial-section">
      <div className="vl-inner vl-story-grid">
        <div className="vl-hotel-image">
          <div style={{ backgroundImage: `url(${weddingImages.hotel})` }} />
        </div>

        <div className="vl-text-block">
          <p className="vl-eyebrow">Hospedagem</p>
          <h2 className="vl-display">Sugestão para convidados de fora.</h2>
          <p>
            Para maior conforto, indicamos opções próximas ao local. A reserva e o
            pagamento devem ser feitos diretamente pelo convidado. Esta seção pode
            ter hotel, telefone, WhatsApp, Instagram e mapa.
          </p>

          <div className="vl-duo">
            <div className="vl-mini-card">
              <strong>Hotel parceiro</strong>
              <p>Informações de contato e observações ao convidado.</p>
            </div>
            <div className="vl-mini-card">
              <strong>Distância</strong>
              <p>Tempo aproximado até o local da cerimônia.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftsSection() {
  const gifts = [
    {
      title: "Decoração para o nosso lar",
      value: "R$ 180",
      image: weddingImages.gift,
    },
    {
      title: "Viagem dos sonhos",
      value: "R$ 250",
      image: weddingImages.flowers,
    },
    {
      title: "Presente livre",
      value: "Valor livre",
      image: weddingImages.dinner,
    },
  ];

  return (
    <section id="presentes" className="vl-gifts">
      <div className="vl-inner vl-gifts-grid">
        <div className="vl-info-card">
          <p className="vl-eyebrow">Presentes</p>
          <h2 className="vl-display">Com carinho</h2>
          <p>
            A sua presença é o nosso maior presente. Se desejar nos presentear,
            escolhemos algumas opções especiais com muito carinho.
          </p>
        </div>

        <div className="vl-gift-cards">
          {gifts.map((gift) => (
            <article className="vl-gift-card" key={gift.title}>
              <div
                className="vl-gift-card-image"
                style={{ backgroundImage: `url(${gift.image})` }}
              />
              <div className="vl-gift-card-body">
                <h3>{gift.title}</h3>
                <p>{gift.value}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RsvpSection() {
  return (
    <section id="rsvp" className="vl-rsvp">
      <div className="vl-rsvp-box">
        <div className="vl-rsvp-left">
          <p className="vl-eyebrow">Confirmação</p>
          <h2 className="vl-display">RSVP</h2>
          <p>
            Confirme sua presença até 24 de julho de 2026. No site real, esta área
            será conectada ao RSVP do evento.
          </p>
        </div>

        <form className="vl-rsvp-form">
          <input placeholder="Nome completo" />
          <input placeholder="E-mail" />
          <select defaultValue="">
            <option value="" disabled>
              Confirma sua presença?
            </option>
            <option>Sim, estarei presente</option>
            <option>Não poderei ir</option>
          </select>
          <select defaultValue="">
            <option value="" disabled>
              Acompanhantes
            </option>
            <option>Somente eu</option>
            <option>Eu + 1 acompanhante</option>
            <option>Eu + 2 acompanhantes</option>
          </select>
          <button type="button">Confirmar presença</button>
        </form>
      </div>
    </section>
  );
}

function WeddingFooter() {
  return (
    <footer className="vl-footer">
      <strong>A / L</strong>
      <p>24 de agosto de 2026 • Villa Oliva • Itu, SP</p>
    </footer>
  );
}

function WeddingFullPreview({ model }: { model: Model }) {
  return (
    <main className="vl-event-preview" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <WeddingInvitationGate model={model} />

      <div className="vl-site">
        <FloatingActions model={model} />
        <WeddingMenu />
        <WeddingHero model={model} />
        <Countdown />
        <WelcomeText />
        <StorySection />
        <CeremonySection />
        <GallerySection model={model} />
        <ReceptionSection />
        <InfoSection />
        <MenuSection />
        <LocationSection />
        <HotelSection />
        <GiftsSection />
        <RsvpSection />
        <WeddingFooter />
      </div>
    </main>
  );
}

function OtherModelPage({ model }: { model: Model }) {
  return (
    <main className="vl-event-preview vl-simple-model" style={themeVars(model)}>
      <GlobalStyle model={model} />
      <FloatingActions model={model} />

      <section className="vl-simple-card">
        <div>
          <p className="vl-eyebrow">{model.type}</p>
          <h1 className="vl-display">{model.title}</h1>
          <p>{model.description}</p>

          <div className="vl-hero-meta">
            <span className="vl-pill">{model.hosts}</span>
            <span className="vl-pill">{model.date}</span>
            <span className="vl-pill">{model.place}</span>
          </div>
        </div>

        <div
          className="vl-simple-image"
          style={{ backgroundImage: `url(${model.previewImage})` }}
        />
      </section>
    </main>
  );
}

export default async function ModeloPreviewPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isModelSlug(slug)) {
    notFound();
  }

  const model = models[slug];

  if (model.slug === "casamento-romantico") {
    return <WeddingFullPreview model={model} />;
  }

  return <OtherModelPage model={model} />;
}
