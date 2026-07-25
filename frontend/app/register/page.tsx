"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent, InputHTMLAttributes, ReactNode } from "react";
import { useRouter } from "next/navigation";

/* VERSAO_REGISTER_V24_LIMPEZA_FINAL_PRE_DEPLOY */

type RegisterResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  authToken?: string;
  jwt?: string;
  user?: unknown;
  data?: {
    accessToken?: string;
    access_token?: string;
    token?: string;
    authToken?: string;
    jwt?: string;
    user?: unknown;
  };
  message?: string | string[];
  error?: string;
};

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3001"
  ).replace(/\/+$/, "");
}

function getRegisterToken(data: RegisterResponse | null): string | null {
  if (!data) return null;

  return (
    data.accessToken ||
    data.access_token ||
    data.token ||
    data.authToken ||
    data.jwt ||
    data.data?.accessToken ||
    data.data?.access_token ||
    data.data?.token ||
    data.data?.authToken ||
    data.data?.jwt ||
    null
  );
}

function saveAuthSession(data: RegisterResponse | null, token: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem("token", token);
  window.localStorage.setItem("accessToken", token);
  window.localStorage.setItem("vivalista_token", token);

  const user = data?.user || data?.data?.user;
  if (user) window.localStorage.setItem("user", JSON.stringify(user));
}

function buildCreateEventPath(tipo: string, modelo: string): string {
  const params = new URLSearchParams();
  if (tipo.trim()) params.set("tipo", tipo.trim());
  if (modelo.trim()) params.set("modelo", modelo.trim());

  const query = params.toString();
  return query ? `/dashboard/eventos/novo?${query}` : "/dashboard/eventos/novo";
}

function buildLoginPath(tipo: string, modelo: string): string {
  const redirectPath = buildCreateEventPath(tipo, modelo);
  const params = new URLSearchParams();

  params.set("redirect", redirectPath);
  if (tipo.trim()) params.set("tipo", tipo.trim());
  if (modelo.trim()) params.set("modelo", modelo.trim());

  return `/login?${params.toString()}`;
}

function savePendingEventChoice(tipo: string, modelo: string) {
  if (typeof window === "undefined") return;

  const redirectPath = buildCreateEventPath(tipo, modelo);
  window.localStorage.setItem("vivalista_pending_redirect", redirectPath);
  window.localStorage.setItem("vivalista_pending_tipo", tipo.trim());
  window.localStorage.setItem("vivalista_pending_modelo", modelo.trim());
}

function getRedirectEventChoice(searchParams: URLSearchParams) {
  if (typeof window === "undefined") return { tipo: "", modelo: "" };

  const redirect = searchParams.get("redirect") || searchParams.get("next") || "";
  if (!redirect) return { tipo: "", modelo: "" };

  try {
    const redirectUrl = new URL(redirect, window.location.origin);

    if (redirectUrl.origin !== window.location.origin) {
      return { tipo: "", modelo: "" };
    }

    return {
      tipo: getSearchParamAlias(redirectUrl.searchParams, ["tipo", "type", "eventType", "eventTypeSlug"]),
      modelo: getSearchParamAlias(redirectUrl.searchParams, ["modelo", "model", "modelSlug", "template", "templateKey", "templateSlug", "themeKey", "slug"]),
    };
  } catch {
    return { tipo: "", modelo: "" };
  }
}

function getSearchParamAlias(searchParams: URLSearchParams, names: string[]): string {
  for (const name of names) {
    const value = searchParams.get(name);
    if (value) return value;
  }

  return "";
}

function formatModelName(value: string): string {
  if (!value.trim()) return "modelo escolhido";

  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type RegisterVisualVariant =
  | "generic"
  | "wedding"
  | "corporate"
  | "baby"
  | "kitchen"
  | "birthday"
  | "graduation"
  | "house";

type RegisterVisualProfile = {
  variant: RegisterVisualVariant;
  kicker: string;
  title: string;
  titleAccent: string;
  modelSmallLabel: string;
  modelStrongLabel: string;
  imageUrl: string;
  focusLabel: string;
  chips: string[];
  gradient: string;
};

type RotatingEventSlide = {
  label: string;
  tagline: string;
  chips: string[];
  imageUrl: string;
  gradient: string;
};

const ROTATION_INTERVAL_MS = 6200;

const VL_REGISTER_ASSET_WEDDING = "/register-assets/vivalista-register-casamento.png";
const VL_REGISTER_ASSET_CORPORATE = "/register-assets/vivalista-register-corporativo.png";
const VL_REGISTER_ASSET_BIRTHDAY = "/register-assets/vivalista-register-aniversario.png";
const VL_REGISTER_ASSET_GRADUATION = "/register-assets/vivalista-register-formatura.png";
const VL_REGISTER_ASSET_HOUSE = "/register-assets/vivalista-register-casa-nova.png";

const GENERIC_ROTATING_SLIDES: RotatingEventSlide[] = [
  {
    label: "Casamento",
    tagline: "Convite, presentes e RSVP com um visual claro, elegante e acolhedor.",
    chips: ["Convite", "História", "Presentes", "RSVP"],
    imageUrl:
      VL_REGISTER_ASSET_WEDDING,
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 249, 241, 0.08) 48%, rgba(246, 233, 216, 0.06) 100%)",
  },
  {
    label: "Corporativo",
    tagline: "Landing profissional com visual limpo, claro e contemporâneo.",
    chips: ["Página", "Programação", "Inscrições", "Local"],
    imageUrl:
      VL_REGISTER_ASSET_CORPORATE,
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.13) 0%, rgba(247, 250, 252, 0.08) 48%, rgba(229, 238, 244, 0.06) 100%)",
  },
  {
    label: "Chá de bebê",
    tagline: "Delicado, leve e luminoso para organizar tudo com carinho.",
    chips: ["Enxoval", "Família", "Lista", "Confirmação"],
    imageUrl:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=88",
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(248, 252, 251, 0.09) 48%, rgba(231, 243, 241, 0.06) 100%)",
  },
  {
    label: "Chá de cozinha",
    tagline: "Encontros charmosos com uma estética clara, prática e convidativa.",
    chips: ["Mesa", "Lista", "Encontro", "Local"],
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=88",
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 250, 242, 0.08) 48%, rgba(239, 232, 222, 0.06) 100%)",
  },
  {
    label: "Aniversário",
    tagline: "Uma experiência vibrante, bonita e iluminada para celebrar.",
    chips: ["Convite", "Fotos", "Presentes", "RSVP"],
    imageUrl:
      VL_REGISTER_ASSET_BIRTHDAY,
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 247, 238, 0.08) 48%, rgba(243, 229, 248, 0.06) 100%)",
  },
  {
    label: "Formatura",
    tagline: "Elegância e presença para grandes conquistas com visual mais claro.",
    chips: ["Cerimônia", "Turma", "Local", "Confirmação"],
    imageUrl:
      VL_REGISTER_ASSET_GRADUATION,
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(251, 245, 236, 0.08) 48%, rgba(236, 227, 208, 0.06) 100%)",
  },
  {
    label: "Casa nova",
    tagline: "Receba convidados com uma página refinada, leve e acolhedora.",
    chips: ["Open house", "Lista", "Local", "Confirmação"],
    imageUrl:
      VL_REGISTER_ASSET_HOUSE,
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(250, 248, 242, 0.08) 48%, rgba(232, 227, 216, 0.06) 100%)",
  },
]


type SelectedModelVisualPreset = {
  imageUrl: string;
  focusLabel: string;
  chips: string[];
  gradient: string;
};

const VL_SELECTED_MODEL_IMAGE_PRESETS: Record<string, SelectedModelVisualPreset> = {
  "casamento-romantico": {
    imageUrl:
      VL_REGISTER_ASSET_WEDDING,
    focusLabel: "Casamento Romântico",
    chips: ["Convite", "História", "Galeria", "Presentes"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.42) 0%, rgba(255, 253, 248, 0.30) 42%, rgba(255, 248, 235, 0.18) 100%)",
  },
  "casamento-luxo": {
    imageUrl:
      VL_REGISTER_ASSET_WEDDING,
    focusLabel: "Casamento Luxo",
    chips: ["Capa", "Dress code", "RSVP", "Presentes"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.34) 0%, rgba(255, 247, 231, 0.24) 42%, rgba(95, 55, 98, 0.07) 100%)",
  },
  "casamento-rustico": {
    imageUrl:
      VL_REGISTER_ASSET_WEDDING,
    focusLabel: "Casamento Rústico",
    chips: ["Campo", "Mapa", "Hospedagem", "Galeria"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.40) 0%, rgba(250, 246, 236, 0.28) 44%, rgba(218, 204, 184, 0.11) 100%)",
  },
  "noivado-elegante": {
    imageUrl:
      VL_REGISTER_ASSET_WEDDING,
    focusLabel: "Noivado Elegante",
    chips: ["Convite", "Fotos", "Local", "Mensagem"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.42) 0%, rgba(255, 247, 240, 0.28) 44%, rgba(245, 226, 222, 0.12) 100%)",
  },
  "bodas-elegante": {
    imageUrl:
      VL_REGISTER_ASSET_WEDDING,
    focusLabel: "Bodas Elegante",
    chips: ["Linha do tempo", "Galeria", "Votos", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.44) 0%, rgba(255, 247, 233, 0.30) 44%, rgba(238, 221, 199, 0.12) 100%)",
  },
  "debutante-luxo": {
    imageUrl:
      VL_REGISTER_ASSET_BIRTHDAY,
    focusLabel: "Debutante Luxo",
    chips: ["Capa", "Galeria", "Dress code", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.38) 0%, rgba(250, 242, 255, 0.26) 44%, rgba(223, 202, 246, 0.12) 100%)",
  },
  "debutante-princesa": {
    imageUrl:
      VL_REGISTER_ASSET_BIRTHDAY,
    focusLabel: "Debutante Princesa",
    chips: ["Homenagem", "Fotos", "Dress code", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.42) 0%, rgba(250, 242, 255, 0.28) 44%, rgba(238, 223, 250, 0.12) 100%)",
  },
  "aniversario-infantil-divertido": {
    imageUrl:
      VL_REGISTER_ASSET_BIRTHDAY,
    focusLabel: "Aniversário Infantil",
    chips: ["Tema", "Convite", "Fotos", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.40) 0%, rgba(255, 247, 232, 0.26) 44%, rgba(247, 222, 190, 0.11) 100%)",
  },
  "infantil-divertido": {
    imageUrl:
      VL_REGISTER_ASSET_BIRTHDAY,
    focusLabel: "Aniversário Infantil",
    chips: ["Tema", "Convite", "Fotos", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.40) 0%, rgba(255, 247, 232, 0.26) 44%, rgba(247, 222, 190, 0.11) 100%)",
  },
  "aniversario-adulto-premium": {
    imageUrl:
      VL_REGISTER_ASSET_BIRTHDAY,
    focusLabel: "Aniversário Premium",
    chips: ["Convite", "Dress code", "Local", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.64) 0%, rgba(255, 247, 235, 0.42) 44%, rgba(103, 61, 112, 0.14) 100%)",
  },
  "aniversario-premium": {
    imageUrl:
      VL_REGISTER_ASSET_BIRTHDAY,
    focusLabel: "Aniversário Premium",
    chips: ["Convite", "Dress code", "Local", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.64) 0%, rgba(255, 247, 235, 0.42) 44%, rgba(103, 61, 112, 0.14) 100%)",
  },
  "cha-bebe-delicado": {
    imageUrl:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=90",
    focusLabel: "Chá de Bebê Delicado",
    chips: ["Enxoval", "Mensagem", "RSVP", "Presentes"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.82) 0%, rgba(248, 252, 251, 0.58) 44%, rgba(233, 245, 243, 0.34) 100%)",
  },
  "bebe-delicado": {
    imageUrl:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=90",
    focusLabel: "Chá de Bebê Delicado",
    chips: ["Enxoval", "Mensagem", "RSVP", "Presentes"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.82) 0%, rgba(248, 252, 251, 0.58) 44%, rgba(233, 245, 243, 0.34) 100%)",
  },
  "cha-revelacao-suave": {
    imageUrl:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1600&q=90",
    focusLabel: "Chá Revelação Suave",
    chips: ["Convite", "Enquete", "Presentes", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.80) 0%, rgba(247, 251, 255, 0.56) 44%, rgba(233, 241, 252, 0.34) 100%)",
  },
  "cha-cozinha-elegante": {
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=90",
    focusLabel: "Chá de Cozinha Elegante",
    chips: ["Convite", "Presentes", "Reserva", "Pix"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.80) 0%, rgba(255, 250, 240, 0.56) 44%, rgba(240, 232, 220, 0.34) 100%)",
  },
  "casa-nova-clean": {
    imageUrl:
      VL_REGISTER_ASSET_HOUSE,
    focusLabel: "Casa Nova Clean",
    chips: ["Novo lar", "Presentes", "Pix", "Mensagem"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.80) 0%, rgba(250, 248, 241, 0.56) 44%, rgba(231, 226, 214, 0.34) 100%)",
  },
  "formatura-classica": {
    imageUrl:
      VL_REGISTER_ASSET_GRADUATION,
    focusLabel: "Formatura Clássica",
    chips: ["Programação", "Turma", "Fotos", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.78) 0%, rgba(251, 245, 235, 0.56) 44%, rgba(235, 224, 205, 0.34) 100%)",
  },
  "batizado-sagrado": {
    imageUrl:
      VL_REGISTER_ASSET_CORPORATE,
    focusLabel: "Batizado Sagrado",
    chips: ["Cerimônia", "Padrinhos", "Mensagem", "RSVP"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.80) 0%, rgba(251, 248, 241, 0.56) 44%, rgba(231, 226, 214, 0.34) 100%)",
  },
  "corporativo-premium": {
    imageUrl:
      VL_REGISTER_ASSET_CORPORATE,
    focusLabel: "Corporativo Premium",
    chips: ["Programação", "Inscrição", "Palestrantes", "Local"],
    gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.42) 0%, rgba(247, 250, 252, 0.50) 44%, rgba(229, 238, 244, 0.30) 100%)",
  },
};

function slugifyChoiceValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSelectedModelVisualPreset(tipo: string, modelo: string): SelectedModelVisualPreset | null {
  const possibleKeys = [
    slugifyChoiceValue(modelo),
    slugifyChoiceValue(tipo),
    slugifyChoiceValue(`${tipo}-${modelo}`),
    slugifyChoiceValue(`${modelo}-${tipo}`),
  ].filter(Boolean);

  for (const key of possibleKeys) {
    const exact = VL_SELECTED_MODEL_IMAGE_PRESETS[key];
    if (exact) return exact;
  }

  const raw = normalizeChoiceText(tipo, modelo);
  const foundEntry = Object.entries(VL_SELECTED_MODEL_IMAGE_PRESETS).find(([key]) =>
    raw.includes(key.replace(/-/g, " ")) || raw.includes(key),
  );

  return foundEntry?.[1] ?? null;
}


function normalizeChoiceText(tipo: string, modelo: string): string {
  return `${tipo} ${modelo}`
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getRegisterVariant(tipo: string, modelo: string): RegisterVisualVariant {
  const raw = normalizeChoiceText(tipo, modelo);

  if (!raw) return "generic";

  if (
    raw.includes("corpor") ||
    raw.includes("empresa") ||
    raw.includes("business") ||
    raw.includes("workshop") ||
    raw.includes("palestra") ||
    raw.includes("congresso") ||
    raw.includes("marca")
  ) return "corporate";

  if (
    raw.includes("bebe") ||
    raw.includes("baby") ||
    raw.includes("revelacao") ||
    raw.includes("maternidade") ||
    raw.includes("enxoval")
  ) return "baby";

  if (
    raw.includes("cozinha") ||
    raw.includes("panela") ||
    raw.includes("mesa posta") ||
    raw.includes("mesa-posta")
  ) return "kitchen";

  if (raw.includes("formatura") || raw.includes("graduation") || raw.includes("formando")) return "graduation";

  if (
    raw.includes("casa nova") ||
    raw.includes("casa-nova") ||
    raw.includes("open house") ||
    raw.includes("open-house") ||
    raw.includes("house")
  ) return "house";

  if (
    raw.includes("anivers") ||
    raw.includes("birthday") ||
    raw.includes("debutante") ||
    raw.includes("15 anos") ||
    raw.includes("quinze") ||
    raw.includes("festa")
  ) return "birthday";

  if (
    raw.includes("casamento") ||
    raw.includes("wedding") ||
    raw.includes("noivado") ||
    raw.includes("bodas") ||
    raw.includes("noivos") ||
    raw.includes("casal") ||
    raw.includes("romant") ||
    raw.includes("amor") ||
    raw.includes("blacktie") ||
    raw.includes("black tie") ||
    raw.includes("serenity") ||
    raw.includes("serenata") ||
    raw.includes("floresta") ||
    raw.includes("folhas") ||
    raw.includes("linhas") ||
    raw.includes("cartas")
  ) return "wedding";

  return "generic";
}

function getRegisterVisualProfile(
  tipo: string,
  modelo: string,
  selectedModelLabel: string,
): RegisterVisualProfile {
  const variant = getRegisterVariant(tipo, modelo);

  const profiles: Record<RegisterVisualVariant, RegisterVisualProfile> = {
    generic: {
      variant: "generic",
      kicker: "primeiro acesso",
      title: "Crie sua conta",
      titleAccent: "e comece seu evento.",
      modelSmallLabel: "Comece agora",
      modelStrongLabel: "Escolha o modelo depois",
      imageUrl:
        VL_REGISTER_ASSET_WEDDING,
      focusLabel: "Vários tipos de evento",
      chips: ["Casamento", "Aniversário", "Corporativo", "Chá de bebê"],
      gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.78) 0%, rgba(255, 249, 239, 0.58) 44%, rgba(241, 229, 248, 0.42) 100%)",
    },
    wedding: {
      variant: "wedding",
      kicker: "modelo escolhido",
      title: "Crie sua conta",
      titleAccent: "e continue seu casamento.",
      modelSmallLabel: "Modelo escolhido",
      modelStrongLabel: selectedModelLabel,
      imageUrl:
        VL_REGISTER_ASSET_WEDDING,
      focusLabel: "Site de casamento",
      chips: ["Convite", "História", "Presentes", "RSVP"],
      gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.76) 0%, rgba(255, 253, 248, 0.60) 42%, rgba(255, 248, 235, 0.42) 100%)",
    },
    corporate: {
      variant: "corporate",
      kicker: "modelo escolhido",
      title: "Crie sua conta",
      titleAccent: "e monte seu evento corporativo.",
      modelSmallLabel: "Modelo escolhido",
      modelStrongLabel: selectedModelLabel,
      imageUrl:
        VL_REGISTER_ASSET_CORPORATE,
      focusLabel: "Evento corporativo",
      chips: ["Página", "Programação", "Inscrições", "Local"],
      gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.78) 0%, rgba(246, 250, 252, 0.58) 44%, rgba(227, 237, 242, 0.38) 100%)",
    },
    baby: {
      variant: "baby",
      kicker: "modelo escolhido",
      title: "Crie sua conta",
      titleAccent: "e continue seu chá de bebê.",
      modelSmallLabel: "Modelo escolhido",
      modelStrongLabel: selectedModelLabel,
      imageUrl:
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=88",
      focusLabel: "Chá de bebê",
      chips: ["Enxoval", "Família", "Lista", "Confirmação"],
      gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.82) 0%, rgba(248, 252, 251, 0.60) 44%, rgba(233, 245, 243, 0.40) 100%)",
    },
    kitchen: {
      variant: "kitchen",
      kicker: "modelo escolhido",
      title: "Crie sua conta",
      titleAccent: "e continue seu chá de cozinha.",
      modelSmallLabel: "Modelo escolhido",
      modelStrongLabel: selectedModelLabel,
      imageUrl:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=88",
      focusLabel: "Chá de cozinha",
      chips: ["Mesa", "Lista", "Encontro", "Local"],
      gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.80) 0%, rgba(255, 250, 240, 0.58) 44%, rgba(240, 232, 220, 0.40) 100%)",
    },
    birthday: {
      variant: "birthday",
      kicker: "modelo escolhido",
      title: "Crie sua conta",
      titleAccent: "e continue sua festa.",
      modelSmallLabel: "Modelo escolhido",
      modelStrongLabel: selectedModelLabel,
      imageUrl:
        VL_REGISTER_ASSET_BIRTHDAY,
      focusLabel: "Aniversário e festas",
      chips: ["Convite", "Fotos", "Presentes", "RSVP"],
      gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.80) 0%, rgba(255, 247, 235, 0.58) 44%, rgba(243, 228, 250, 0.42) 100%)",
    },
    graduation: {
      variant: "graduation",
      kicker: "modelo escolhido",
      title: "Crie sua conta",
      titleAccent: "e continue sua formatura.",
      modelSmallLabel: "Modelo escolhido",
      modelStrongLabel: selectedModelLabel,
      imageUrl:
        VL_REGISTER_ASSET_GRADUATION,
      focusLabel: "Formatura",
      chips: ["Cerimônia", "Turma", "Local", "Confirmação"],
      gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.78) 0%, rgba(251, 245, 235, 0.58) 44%, rgba(235, 224, 205, 0.42) 100%)",
    },
    house: {
      variant: "house",
      kicker: "modelo escolhido",
      title: "Crie sua conta",
      titleAccent: "e continue sua casa nova.",
      modelSmallLabel: "Modelo escolhido",
      modelStrongLabel: selectedModelLabel,
      imageUrl:
        VL_REGISTER_ASSET_HOUSE,
      focusLabel: "Casa nova",
      chips: ["Open house", "Lista", "Local", "Confirmação"],
      gradient: "linear-gradient(180deg, rgba(255, 253, 248, 0.80) 0%, rgba(250, 248, 241, 0.58) 44%, rgba(231, 226, 214, 0.42) 100%)",
    },
  };

  const profile = profiles[variant];
  const selectedModelPreset = getSelectedModelVisualPreset(tipo, modelo);

  if (!selectedModelPreset) return profile;

  return {
    ...profile,
    imageUrl: selectedModelPreset.imageUrl,
    focusLabel: selectedModelPreset.focusLabel,
    chips: selectedModelPreset.chips,
    gradient: selectedModelPreset.gradient,
  };
}


type RegisterFieldName = "name" | "organizationName" | "email" | "password" | "confirmPassword";

type FieldErrors = Partial<Record<RegisterFieldName, string>>;

type PasswordStrength = {
  level: "empty" | "weak" | "medium" | "strong";
  label: string;
  helper: string;
  score: number;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getPasswordStrength(value: string): PasswordStrength {
  const password = value.trim();

  if (!password) {
    return {
      level: "empty",
      label: "Senha",
      helper: "Use pelo menos 6 caracteres.",
      score: 0,
    };
  }

  const hasNumber = /\d/.test(password);
  const hasLetter = /[A-Za-zÀ-ÿ]/.test(password);
  const hasSymbol = /[^A-Za-zÀ-ÿ0-9]/.test(password);

  if (password.length >= 10 && hasNumber && hasLetter && hasSymbol) {
    return {
      level: "strong",
      label: "Forte",
      helper: "Boa senha para proteger sua conta.",
      score: 3,
    };
  }

  if (password.length >= 6 && (hasNumber || hasSymbol) && hasLetter) {
    return {
      level: "medium",
      label: "Média",
      helper: "Boa. Para ficar forte, use 10+ caracteres e símbolo.",
      score: 2,
    };
  }

  return {
    level: "weak",
    label: "Fraca",
    helper: "Digite pelo menos 6 caracteres.",
    score: 1,
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectionReady, setSelectionReady] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<RegisterFieldName | null>(null);

  const createEventPath = useMemo(
    () => buildCreateEventPath(selectedType, selectedModel),
    [selectedType, selectedModel],
  );

  const loginPath = useMemo(
    () => buildLoginPath(selectedType, selectedModel),
    [selectedType, selectedModel],
  );

  const selectedModelLabel = formatModelName(selectedModel || selectedType);
  const hasSelectedModel = Boolean(selectedType || selectedModel);
  const visualProfile = useMemo(
    () => getRegisterVisualProfile(selectedType, selectedModel, selectedModelLabel),
    [selectedModel, selectedModelLabel, selectedType],
  );

  const shouldRotateVisual = selectionReady && !hasSelectedModel && visualProfile.variant === "generic";
  const activeRotationSlide = shouldRotateVisual
    ? GENERIC_ROTATING_SLIDES[activeSlideIndex % GENERIC_ROTATING_SLIDES.length]
    : null;

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const isConfirmPasswordValid = password.length >= 6 && confirmPassword.length > 0 && password === confirmPassword;


  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const redirectChoice = getRedirectEventChoice(searchParams);
    const tipo = getSearchParamAlias(searchParams, ["tipo", "type", "eventType", "eventTypeSlug"]) || redirectChoice.tipo;
    const modelo = getSearchParamAlias(searchParams, ["modelo", "model", "modelSlug", "template", "templateKey", "templateSlug", "themeKey", "slug"]) || redirectChoice.modelo;

    setSelectedType(tipo);
    setSelectedModel(modelo);
    setSelectionReady(true);

    if (tipo || modelo) savePendingEventChoice(tipo, modelo);
  }, []);

  useEffect(() => {
    if (!hasSelectedModel) return;

    const indexByVariant: Partial<Record<RegisterVisualVariant, number>> = {
      wedding: 0,
      corporate: 1,
      baby: 2,
      kitchen: 3,
      birthday: 4,
      graduation: 5,
      house: 6,
    };

    const nextIndex = indexByVariant[visualProfile.variant];
    if (typeof nextIndex === "number") setActiveSlideIndex(nextIndex);
  }, [hasSelectedModel, visualProfile.variant]);

  useEffect(() => {
    if (!shouldRotateVisual) return;

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % GENERIC_ROTATING_SLIDES.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [shouldRotateVisual]);

  function setSingleFieldError(field: RegisterFieldName, message: string | null) {
    setFieldErrors((current) => {
      const next = { ...current };

      if (message) next[field] = message;
      else delete next[field];

      return next;
    });
  }

  function handleFieldFocus(field: RegisterFieldName) {
    setFocusedField(field);

    if (fieldErrors[field]) setSingleFieldError(field, null);
    if (errorMessage === "Revise os campos destacados.") setErrorMessage(null);
  }

  function handleFieldBlur(field: RegisterFieldName) {
    setFocusedField(null);
    validateField(field);
  }

  function getFieldClass(field: RegisterFieldName, extraClass = ""): string {
    const hasError = Boolean(fieldErrors[field]);
    const isFocused = focusedField === field;
    const stateClass = hasError ? (isFocused ? "vl-input-soft-error" : "vl-input-error") : "";

    return [extraClass, stateClass].filter(Boolean).join(" ");
  }

  function validateField(field: RegisterFieldName): boolean {
    let message: string | null = null;

    if (field === "name" && !name.trim()) {
      message = "Informe seu nome.";
    }

    if (field === "organizationName" && !organizationName.trim()) {
      message = "Informe a organização.";
    }

    if (field === "email") {
      if (!email.trim()) message = "Informe seu e-mail.";
      else if (!isValidEmail(email)) message = "Digite um e-mail válido.";
    }

    if (field === "password") {
      if (!password.trim()) message = "Informe sua senha.";
      else if (password.length < 6) message = "Use pelo menos 6 caracteres.";
    }

    if (field === "confirmPassword") {
      if (!confirmPassword.trim()) message = "Confirme sua senha.";
      else if (password !== confirmPassword) message = "As senhas não coincidem.";
    }

    setSingleFieldError(field, message);
    return !message;
  }

  function validateAllFields(): boolean {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) nextErrors.name = "Informe seu nome.";
    if (!organizationName.trim()) nextErrors.organizationName = "Informe a organização.";

    if (!email.trim()) nextErrors.email = "Informe seu e-mail.";
    else if (!isValidEmail(email)) nextErrors.email = "Digite um e-mail válido.";

    if (!password.trim()) nextErrors.password = "Informe sua senha.";
    else if (password.length < 6) nextErrors.password = "Use pelo menos 6 caracteres.";

    if (!confirmPassword.trim()) nextErrors.confirmPassword = "Confirme sua senha.";
    else if (password !== confirmPassword) nextErrors.confirmPassword = "As senhas não coincidem.";

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateAllFields()) {
      setErrorMessage("Revise os campos destacados.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      savePendingEventChoice(selectedType, selectedModel);

      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          organizationName: organizationName.trim(),
          email: email.trim(),
          password,
        }),
      });

      let data: RegisterResponse | null = null;
      try {
        data = (await response.json()) as RegisterResponse;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const message = Array.isArray(data?.message)
          ? data?.message.join(", ")
          : data?.message || data?.error || "Não foi possível criar sua conta.";

        setErrorMessage(message);
        return;
      }

      const token = getRegisterToken(data);

      if (token) {
        saveAuthSession(data, token);
        setSuccessMessage("Conta criada. Abrindo o criador...");
        window.setTimeout(() => router.push(createEventPath), 700);
        return;
      }

      setSuccessMessage("Conta criada. Entre para continuar.");
      window.setTimeout(() => router.push(loginPath), 700);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const visualChips = activeRotationSlide?.chips || visualProfile.chips;
  const visualCardSmallLabel = shouldRotateVisual ? "Em destaque agora" : visualProfile.modelSmallLabel;
  const visualCardStrongLabel = shouldRotateVisual
    ? activeRotationSlide?.label || visualProfile.modelStrongLabel
    : visualProfile.modelStrongLabel;
  const visualCardNote = shouldRotateVisual
    ? activeRotationSlide?.tagline || "Você pode escolher o modelo depois."
    : visualProfile.focusLabel;

  return (
    <main
      data-version="VERSAO_REGISTER_V24_LIMPEZA_FINAL_PRE_DEPLOY"
      className="vl-register-page"
    >
      <div className="vl-shell">
        <aside
          className={`vl-visual vl-visual-${visualProfile.variant}`}
          aria-label="VivaLista"
        >
          <div className="vl-visual-layers" aria-hidden="true">
            {shouldRotateVisual
              ? GENERIC_ROTATING_SLIDES.map((slide, index) => (
                  <span
                    key={slide.label}
                    className={`vl-visual-layer ${index === activeSlideIndex ? "is-active" : ""}`}
                    style={
                      {
                        "--vl-visual-image": `url(${slide.imageUrl})`,
                        "--vl-visual-gradient": slide.gradient,
                      } as CSSProperties
                    }
                  />
                ))
              : (
                <span
                  key={`selected-${visualProfile.variant}-${visualProfile.imageUrl}`}
                  className="vl-visual-layer is-active"
                  style={
                    {
                      "--vl-visual-image": `url(${visualProfile.imageUrl})`,
                      "--vl-visual-gradient": visualProfile.gradient,
                    } as CSSProperties
                  }
                />
              )}
          </div>

          <Link href="/" className="vl-back" aria-label="Voltar para a página inicial" prefetch={false}>
            ← Voltar
          </Link>

          <div className="vl-visual-content">
            <div aria-label="VivaLista" className="vl-logo-link">
              <Image
                src="/logo-vivalista.png"
                alt="VivaLista"
                width={320}
                height={105}
                className="vl-logo"
                priority
              />
            </div>

            <div className="vl-headline-block">
              <p className={`vl-kicker ${!hasSelectedModel ? "is-gold" : ""}`}>{visualProfile.kicker}</p>
              <h1>
                {visualProfile.title}
                <span>{visualProfile.titleAccent}</span>
              </h1>
            </div>

            <div className="vl-visual-tags" aria-label="Recursos do fluxo">
              {visualChips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>

            <div className={`vl-model-card ${hasSelectedModel ? "" : "vl-model-card-soft"}`}>
              <span className="vl-model-icon">✦</span>
              <div>
                <small>{visualCardSmallLabel}</small>
                <strong>{visualCardStrongLabel}</strong>
                <p className="vl-model-note">{visualCardNote}</p>
              </div>
            </div>

            {shouldRotateVisual ? (
              <div className="vl-rotation-rail" aria-label="Tipos de evento em destaque">
                {GENERIC_ROTATING_SLIDES.map((slide, index) => (
                  <button
                    key={slide.label}
                    type="button"
                    className={`vl-rotation-dot ${index === activeSlideIndex ? "is-active" : ""}`}
                    onClick={() => setActiveSlideIndex(index)}
                    aria-label={`Ver destaque de ${slide.label}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </aside>

        <section className="vl-form-area" aria-label="Criar conta">
          <div className="vl-form-card">
            <div className="vl-form-head">
              <span>Cadastro</span>
              <h2>{hasSelectedModel ? "Continuar criação" : "Começar no VivaLista"}</h2>
            </div>

            <form onSubmit={handleRegister} className="vl-form">
              <div className="vl-two-columns">
                <Field label="Nome" htmlFor="name" error={fieldErrors.name}>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (fieldErrors.name) setSingleFieldError("name", null);
                    }}
                    onFocus={() => handleFieldFocus("name")}
                    onBlur={() => handleFieldBlur("name")}
                    placeholder="Seu nome"
                    autoComplete="name"
                    autoFocus
                    aria-invalid={Boolean(fieldErrors.name)}
                    className={getFieldClass("name")}
                  />
                </Field>

                <Field label="Organização" htmlFor="organizationName" error={fieldErrors.organizationName}>
                  <Input
                    id="organizationName"
                    type="text"
                    value={organizationName}
                    onChange={(event) => {
                      setOrganizationName(event.target.value);
                      if (fieldErrors.organizationName) setSingleFieldError("organizationName", null);
                    }}
                    onFocus={() => handleFieldFocus("organizationName")}
                    onBlur={() => handleFieldBlur("organizationName")}
                    placeholder="Ex.: Casamento da Ana"
                    autoComplete="organization"
                    aria-invalid={Boolean(fieldErrors.organizationName)}
                    className={getFieldClass("organizationName")}
                  />
                  <small className="vl-field-hint">Ex.: Casamento da Ana ou Evento da empresa.</small>
                </Field>
              </div>

              <Field label="E-mail" htmlFor="email" error={fieldErrors.email}>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (fieldErrors.email) setSingleFieldError("email", null);
                  }}
                  onFocus={() => handleFieldFocus("email")}
                  onBlur={() => handleFieldBlur("email")}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={getFieldClass("email")}
                />
              </Field>

              <div className="vl-two-columns vl-password-columns">
                <Field label="Senha" htmlFor="password" error={fieldErrors.password}>
                  <div className="vl-password-shell">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (fieldErrors.password) setSingleFieldError("password", null);
                        if (fieldErrors.confirmPassword) setSingleFieldError("confirmPassword", null);
                      }}
                      onFocus={() => handleFieldFocus("password")}
                      onBlur={() => handleFieldBlur("password")}
                      placeholder="Mín. 6 caracteres"
                      autoComplete="new-password"
                      aria-invalid={Boolean(fieldErrors.password)}
                      className={getFieldClass("password", "vl-password-input")}
                    />
                    <button
                      type="button"
                      className="vl-password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      <PasswordVisibilityIcon visible={showPassword} />
                    </button>
                  </div>
                </Field>

                <Field label="Confirmar" htmlFor="confirmPassword" error={fieldErrors.confirmPassword}>
                  <div className="vl-password-shell">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        if (fieldErrors.confirmPassword) setSingleFieldError("confirmPassword", null);
                      }}
                      onFocus={() => handleFieldFocus("confirmPassword")}
                      onBlur={() => handleFieldBlur("confirmPassword")}
                      placeholder="Repita a senha"
                      autoComplete="new-password"
                      aria-invalid={Boolean(fieldErrors.confirmPassword)}
                      className={getFieldClass("confirmPassword", `vl-password-input ${isConfirmPasswordValid ? "vl-input-success" : ""}`)}
                    />
                    {isConfirmPasswordValid ? (
                      <span className="vl-password-success-icon" aria-label="Senhas conferem">
                        <ConfirmPasswordSuccessIcon />
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="vl-password-toggle"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      aria-label={showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"}
                      title={showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"}
                    >
                      <PasswordVisibilityIcon visible={showConfirmPassword} />
                    </button>
                  </div>
                </Field>
              </div>

              <div className={`vl-password-strength vl-password-strength-${passwordStrength.level} vl-password-strength-row`}>
                <span className="vl-password-track">
                  <span style={{ width: `${passwordStrength.score * 33.333}%` }} />
                </span>
                <small>
                  {passwordStrength.label} · {passwordStrength.helper}
                </small>
              </div>

              {errorMessage ? <Feedback type="error">{errorMessage}</Feedback> : null}
              {successMessage ? <Feedback type="success">{successMessage}</Feedback> : null}

              <button type="submit" disabled={loading} className="vl-submit">
                {loading ? (
                  <>
                    <span className="vl-spinner" aria-hidden="true" />
                    Criando...
                  </>
                ) : (
                  "Criar conta"
                )}
              </button>

              <p className="vl-login-line">
                Já tem conta? <Link href={loginPath}>Entrar</Link>
              </p>
            </form>
          </div>
        </section>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #fffaf3;
        }

        .vl-register-page {
          width: 100%;
          min-height: 100dvh;
          height: auto;
          overflow-x: hidden;
          overflow-y: auto;
          color: #3f2062;
          background:
            radial-gradient(circle at 12% 12%, rgba(196, 154, 66, 0.18), transparent 30%),
            radial-gradient(circle at 88% 84%, rgba(127, 83, 214, 0.12), transparent 32%),
            linear-gradient(135deg, #fffaf3 0%, #f7efff 48%, #fffdf8 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .vl-shell {
          width: 100%;
          max-width: 1380px;
          min-height: 100dvh;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.28fr) minmax(390px, 0.72fr);
          align-items: center;
          gap: clamp(20px, 4vw, 54px);
          padding: 24px;
        }

        .vl-visual {
          position: relative;
          height: calc(100dvh - 48px);
          min-height: 560px;
          overflow: hidden;
          border-radius: 42px;
          background: #f7f1ea;
          box-shadow: 0 34px 90px rgba(72, 36, 106, 0.20);
          isolation: isolate;
        }

        .vl-visual-layers {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .vl-visual-layer {
          position: absolute;
          inset: 0;
          background:
            var(--vl-visual-gradient),
            var(--vl-visual-image);
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.02);
          transition: opacity 1100ms ease, transform 1800ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
          pointer-events: none;
          filter: saturate(1.04) contrast(1.02) brightness(1);
        }

        .vl-visual-layer.is-active {
          opacity: 1;
          transform: scale(1);
        }

        .vl-visual::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 22% 16%, rgba(255, 255, 255, 0.30), transparent 34%),
            linear-gradient(180deg, rgba(255, 253, 248, 0.16) 0%, rgba(255, 253, 248, 0.08) 46%, rgba(255, 253, 248, 0.03) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .vl-back {
          position: absolute;
          left: 26px;
          top: 24px;
          z-index: 80;
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.64);
          padding: 0 15px;
          color: #3f2062;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          backdrop-filter: blur(16px);
          box-shadow: 0 14px 34px rgba(15, 7, 22, 0.16);
          pointer-events: auto;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .vl-back:hover {
          transform: translateY(-1px);
          border-color: rgba(248, 216, 141, 0.54);
          background: rgba(255, 255, 255, 0.82);
        }

        .vl-visual-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(28px, 4vw, 48px);
        }

        .vl-logo-link {
          width: fit-content;
          margin-bottom: auto;
          margin-top: 68px;
          display: inline-flex;
          border-radius: 0;
          background: transparent;
          padding: 0;
          box-shadow: none;
          backdrop-filter: none;
          }

        .vl-logo {
          width: clamp(184px, 14vw, 238px);
          height: auto;
          display: block;
          object-fit: contain;
          filter:
            drop-shadow(0 2px 0 rgba(255, 255, 255, 0.86))
            drop-shadow(0 12px 22px rgba(63, 32, 98, 0.14));
        }

        .vl-headline-block {
          max-width: 520px;
          margin-top: 56px;
        }

        .vl-kicker {
          display: inline-flex;
          width: fit-content;
          margin: 0 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(63, 32, 98, 0.12);
          background: rgba(255, 253, 248, 0.38);
          padding: 7px 12px;
          color: #5a26a8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          backdrop-filter: blur(14px);
        }

        .vl-kicker.is-gold {
          color: #c58a12;
          border-color: rgba(223, 168, 55, 0.34);
          background: linear-gradient(135deg, rgba(255, 253, 247, 0.84), rgba(255, 247, 225, 0.62));
          box-shadow: 0 10px 24px rgba(197, 138, 18, 0.12);
        }

        .vl-headline-block h1 {
          margin: 0;
          color: #4f2491;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(45px, 5vw, 78px);
          font-weight: 400;
          line-height: 0.94;
          letter-spacing: -0.065em;
          text-shadow: 0 18px 46px rgba(255, 255, 255, 0.46);
        }

        .vl-headline-block h1 span {
          display: block;
          margin-top: 8px;
          color: #d39a1e;
          background: linear-gradient(90deg, #a96f08 0%, #d59a21 34%, #f5cc6b 58%, #b97711 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 0.62em;
          letter-spacing: -0.045em;
        }

        .vl-visual-tags {
          width: min(100%, 430px);
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 22px;
        }

        .vl-visual-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          border-radius: 999px;
          border: 1px solid rgba(63, 32, 98, 0.12);
          background: rgba(255, 255, 255, 0.62);
          padding: 0 12px;
          color: #4b2368;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(12px);
        }

        .vl-model-card {
          width: min(100%, 430px);
          margin-top: 26px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 13px;
          border-radius: 24px;
          border: 1px solid rgba(255, 253, 248, 0.22);
          background: rgba(255, 253, 248, 0.9);
          padding: 14px 16px;
          box-shadow: 0 20px 58px rgba(18, 8, 26, 0.18);
          backdrop-filter: blur(16px);
        }

        .vl-model-card-soft {
          opacity: 0.96;
        }

        .vl-model-card > div {
          min-width: 0;
        }

        .vl-model-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: linear-gradient(135deg, #4b2368, #8f57f5);
          color: #f8d88d;
          box-shadow: 0 12px 26px rgba(88, 45, 130, 0.24);
        }

        .vl-model-card small {
          display: block;
          margin-bottom: 3px;
          color: #bf8615;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vl-model-card strong {
          display: block;
          overflow: hidden;
          color: #3f2062;
          font-size: 17px;
          font-weight: 760;
          letter-spacing: -0.035em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vl-model-note {
          margin: 4px 0 0;
          color: #755392;
          font-size: 12px;
          line-height: 1.45;
        }

        .vl-rotation-rail {
          width: min(100%, 430px);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
        }

        .vl-rotation-dot {
          position: relative;
          flex: 1 1 0;
          min-width: 36px;
          height: 44px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border: none;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          transition: transform 0.25s ease;
        }

        .vl-rotation-dot::before {
          content: "";
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: rgba(63, 32, 98, 0.18);
          transition: background 0.25s ease;
        }

        .vl-rotation-dot::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #4b2368, #c49a42);
          transform: translateY(-50%) scaleX(0);
          transform-origin: left center;
        }

        .vl-rotation-dot:hover::before {
          background: rgba(63, 32, 98, 0.28);
        }

        .vl-rotation-dot.is-active {
          transform: translateY(-1px);
        }

        .vl-rotation-dot.is-active::after {
          animation: vlRotationProgress 6200ms linear forwards;
        }

        @keyframes vlRotationProgress {
          from { transform: translateY(-50%) scaleX(0); }
          to { transform: translateY(-50%) scaleX(1); }
        }

        .vl-form-area {
          display: flex;
          align-items: stretch;
          justify-content: center;
          min-height: calc(100dvh - 48px);
        }

        .vl-form-card {
          width: min(100%, 450px);
          min-height: calc(100dvh - 48px);
          height: auto;
          border-radius: 34px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.84);
          padding: clamp(24px, 3vw, 32px);
          padding-top: max(24px, calc((100dvh - 568px) / 2));
          padding-bottom: 24px;
          box-shadow: 0 30px 84px rgba(111, 73, 166, 0.16);
          backdrop-filter: blur(22px);
          animation: vlFormEnter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        @keyframes vlFormEnter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .vl-form-head {
          margin-bottom: 20px;
          text-align: center;
        }

        .vl-form-head span {
          display: inline-flex;
          margin-bottom: 10px;
          border-radius: 999px;
          border: 1px solid #eadcff;
          background: #fbf7ff;
          padding: 5px 14px;
          color: #8a63cf;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .vl-form-head h2 {
          margin: 0;
          color: #4d2a78;
          font-size: 25px;
          font-weight: 680;
          letter-spacing: -0.045em;
        }

        .vl-form {
          display: grid;
          gap: 12px;
        }

        .vl-two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .vl-password-columns > .vl-field {
          min-height: 90px;
        }

        .vl-field label {
          display: block;
          margin-bottom: 5px;
          color: #5d3d8f;
          font-size: 12px;
          font-weight: 650;
        }

        .vl-input {
          width: 100%;
          border: 1px solid #e7ddf7;
          border-radius: 14px;
          background: #fcfaff;
          padding: 10px 13px;
          color: #4b2c73;
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
        }

        .vl-input:focus {
          border-color: #a980ff;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(169, 128, 255, 0.12);
        }

        .vl-input-error,
        .vl-input-error:focus {
          border-color: #e06b6b;
          background: #fff8f8;
          box-shadow: 0 0 0 4px rgba(224, 107, 107, 0.10);
        }

        .vl-input-soft-error,
        .vl-input-soft-error:focus {
          border-color: #d8a1a1;
          background: #fffdfd;
          box-shadow: 0 0 0 4px rgba(216, 161, 161, 0.08);
        }

        .vl-input-success,
        .vl-input-success:focus {
          border-color: #16a34a;
          background: #fbfffc;
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.10);
        }

        .vl-field-error {
          display: block;
          margin-top: 5px;
          color: #a85252;
          font-size: 11px;
          font-weight: 650;
          line-height: 1.35;
        }

        .vl-field-hint {
          display: block;
          margin-top: 5px;
          color: #8b78a7;
          font-size: 11px;
          font-weight: 520;
          line-height: 1.35;
        }

        .vl-password-shell {
          position: relative;
        }

        .vl-password-input {
          padding-right: 48px;
        }

        .vl-password-input.vl-input-success {
          padding-right: 78px;
        }

        .vl-password-success-icon {
          position: absolute;
          right: 43px;
          top: 50%;
          width: 23px;
          height: 23px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          border-radius: 999px;
          background: #16a34a;
          color: #ffffff;
          box-shadow: 0 8px 18px rgba(22, 163, 74, 0.20);
          pointer-events: none;
        }

        .vl-password-success-icon svg {
          width: 12px;
          height: 12px;
          display: block;
        }

        .vl-password-toggle {
          position: absolute;
          right: 8px;
          top: 50%;
          width: 31px;
          height: 31px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          border: 0;
          border-radius: 999px;
          background: #f3ecff;
          color: #6f42b5;
          cursor: pointer;
          padding: 0;
          transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }

        .vl-password-toggle svg {
          width: 17px;
          height: 17px;
          display: block;
        }

        .vl-password-toggle:hover,
        .vl-password-toggle:focus-visible {
          background: #e6d8ff;
          color: #4d2a78;
          box-shadow: 0 0 0 3px rgba(124, 76, 224, 0.12);
          outline: none;
        }

        .vl-password-strength {
          margin-top: 7px;
          display: grid;
          gap: 5px;
        }

        .vl-password-strength-row {
          margin-top: -3px;
          padding: 0 1px;
        }

        .vl-password-track {
          display: block;
          width: 100%;
          height: 5px;
          overflow: hidden;
          border-radius: 999px;
          background: #eee6f8;
        }

        .vl-password-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #c4b5fd;
          transition: width 0.22s ease, background 0.22s ease;
        }

        .vl-password-strength small {
          color: #826ca6;
          font-size: 11px;
          line-height: 1.35;
        }

        .vl-password-strength-weak .vl-password-track span { background: #ef4444; }
        .vl-password-strength-medium .vl-password-track span { background: #d89a2e; }
        .vl-password-strength-strong .vl-password-track span { background: #16a34a; }

        .vl-feedback {
          border-radius: 14px;
          padding: 10px 13px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.45;
        }

        .vl-feedback-error {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }

        .vl-feedback-success {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #15803d;
        }

        .vl-submit {
          width: 100%;
          min-height: 47px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #6f42b5, #8f57f5);
          color: #ffffff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 760;
          box-shadow: 0 16px 38px rgba(124, 76, 224, 0.28);
          transition: transform 0.15s ease, opacity 0.15s ease, filter 0.15s ease;
        }

        .vl-spinner {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.42);
          border-top-color: #ffffff;
          animation: vlSpin 0.8s linear infinite;
        }

        @keyframes vlSpin {
          to { transform: rotate(360deg); }
        }

        .vl-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.02);
        }

        .vl-submit:disabled {
          cursor: not-allowed;
          opacity: 0.62;
        }

        .vl-login-line {
          margin: 2px 0 0;
          color: #826ca6;
          font-size: 13px;
          text-align: center;
        }

        .vl-login-line a {
          color: #7c4ce0;
          font-weight: 760;
          text-decoration: none;
        }

        @media (prefers-color-scheme: dark) {
          .vl-headline-block h1 span {
            color: #f8d88d;
            background: none;
            -webkit-background-clip: border-box;
            background-clip: border-box;
            -webkit-text-fill-color: currentColor;
            text-shadow: 0 14px 34px rgba(248, 216, 141, 0.18);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vl-visual-layer,
          .vl-rotation-dot,
          .vl-rotation-dot::after,
          .vl-back,
          .vl-submit,
          .vl-form-card,
          .vl-spinner {
            animation: none !important;
            transition: none !important;
          }
        }

        @media (max-width: 980px) {
          .vl-register-page {
            height: auto;
            overflow: auto;
          }

          .vl-shell {
            height: auto;
            min-height: 100dvh;
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 16px;
          }

          .vl-visual {
            height: auto;
            min-height: 420px;
          }

          .vl-visual-content {
            min-height: 420px;
          }

          .vl-logo-link {
            margin-top: 54px;
          }

          .vl-form-area {
            height: auto;
            min-height: auto;
            align-items: stretch;
          }

          .vl-form-card {
            height: auto;
            min-height: auto;
            margin-bottom: 24px;
            padding-top: 24px;
            padding-bottom: 24px;
          }
        }

        @media (max-width: 620px) {
          .vl-shell {
            padding: 12px;
          }

          .vl-visual {
            border-radius: 28px;
          }

          .vl-visual-content {
            padding: 24px;
          }

          .vl-logo {
            width: 215px;
          }

          .vl-headline-block h1 {
            font-size: 44px;
          }

          .vl-two-columns {
            grid-template-columns: 1fr;
          }

          .vl-form-card {
            border-radius: 28px;
            padding: 22px;
          }
        }

        @media (max-height: 730px) and (min-width: 981px) {
          .vl-shell {
            padding-top: 16px;
            padding-bottom: 16px;
          }

          .vl-visual {
            height: calc(100dvh - 32px);
          }

          .vl-logo {
            width: 230px;
          }

          .vl-logo-link {
            margin-top: 42px;
          }

          .vl-headline-block {
            margin-top: 34px;
          }

          .vl-headline-block h1 {
            font-size: 54px;
          }

          .vl-model-card {
            margin-top: 18px;
          }

          .vl-form-area {
            min-height: calc(100dvh - 32px);
          }

          .vl-form-card {
            padding-inline: 24px;
            padding-block: 24px;
          }

          .vl-form-head {
            margin-bottom: 16px;
          }
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="vl-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <small className="vl-field-error">{error}</small> : null}
    </div>
  );
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input {...rest} className={`vl-input ${className || ""}`.trim()} />;
}

function ConfirmPasswordSuccessIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.2 6.25 4.85 8.9 9.9 3.55"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PasswordVisibilityIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 12s3.4-6 9-6 9 6 9 6-3.4 6-9 6-9-6-9-6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.8 4.6 19.4 20.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.7 10.7a2.1 2.1 0 0 0 2.6 2.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.1 7.6C5 8.8 3.6 10.5 3 12c1.1 2.8 4.5 6 9 6 1.4 0 2.6-.3 3.8-.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.7 15.3c1.6-1 2.8-2.2 3.3-3.3-1.1-2.8-4.5-6-9-6-.8 0-1.6.1-2.3.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Feedback({
  type,
  children,
}: {
  type: "error" | "success";
  children: ReactNode;
}) {
  return <div className={`vl-feedback vl-feedback-${type}`}>{children}</div>;
}
