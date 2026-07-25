"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* VERSAO_RESET_PASSWORD_V3_REDIRECIONA_LOGIN_APOS_SUCESSO */

type ResetPasswordResponse = {
  message?: string | string[];
  error?: string;
};

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

function formatApiMessage(data: ResetPasswordResponse | null) {
  if (!data) return null;

  if (Array.isArray(data.message)) return data.message.join(", ");
  if (data.message) return data.message;
  if (data.error) return data.error;

  return null;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token") || "";
    const urlEmail = params.get("email") || "";

    setToken(urlToken.trim());
    setEmail(urlEmail.trim());
  }, []);

  useEffect(() => {
    if (!successMessage) return;

    const redirectTimer = window.setTimeout(() => {
      router.push("/login?reset=success");
    }, 2500);

    return () => window.clearTimeout(redirectTimer);
  }, [router, successMessage]);

  const passwordError =
    passwordTouched && !newPassword.trim()
      ? "Digite a nova senha."
      : passwordTouched && newPassword.trim() && newPassword.length < 6
        ? "A senha deve ter pelo menos 6 caracteres."
        : null;

  const confirmPasswordError =
    confirmTouched && !confirmPassword.trim()
      ? "Confirme a nova senha."
      : confirmTouched &&
          confirmPassword.trim() &&
          newPassword.trim() &&
          confirmPassword !== newPassword
        ? "As senhas não conferem."
        : null;

  const missingToken = !token.trim();

  function handleBack() {
    router.push("/login");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordTouched(true);
    setConfirmTouched(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!token.trim()) {
      setErrorMessage(
        "Link inválido ou incompleto. Solicite uma nova recuperação de senha.",
      );
      return;
    }

    if (!newPassword.trim()) {
      setErrorMessage("Digite a nova senha.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (!confirmPassword.trim()) {
      setErrorMessage("Confirme a nova senha.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${apiBaseUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token.trim(),
          email: email.trim() || undefined,
          newPassword,
        }),
      });

      let data: ResetPasswordResponse | null = null;

      try {
        data = (await response.json()) as ResetPasswordResponse;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const apiMessage = formatApiMessage(data);

        setErrorMessage(
          apiMessage ||
            "Não foi possível redefinir a senha. Solicite um novo link de recuperação.",
        );
        return;
      }

      setSuccessMessage("Senha redefinida com sucesso. Você será levado para o login em alguns segundos.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Não foi possível conectar ao servidor. Verifique se o backend está ligado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="vl-reset-page"
      data-version="VERSAO_RESET_PASSWORD_V3_REDIRECIONA_LOGIN_APOS_SUCESSO"
    >
      <style jsx global>{`
        :root {
          --vl-purple: #56269b;
          --vl-purple-dark: #35145f;
          --vl-purple-deep: #24102f;
          --vl-purple-soft: #7b52c8;
          --vl-gold: #c88c16;
          --vl-gold-bright: #f8d88d;
          --vl-cream: #fffaf3;
          --vl-ink: #2c1746;
          --vl-line: rgba(86, 38, 155, 0.14);
        }

        * {
          box-sizing: border-box;
        }

        html {
          min-height: 100%;
        }

        body {
          margin: 0;
          min-height: 100%;
          background: #fffaf3;
        }

        .vl-reset-page {
          min-height: 100dvh;
          overflow-x: hidden;
          color: var(--vl-ink);
          background:
            radial-gradient(circle at 10% 12%, rgba(200, 140, 22, 0.16), transparent 30%),
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
          grid-template-columns: minmax(0, 1.22fr) minmax(390px, 0.78fr);
          align-items: stretch;
          gap: clamp(20px, 4vw, 54px);
          padding: 24px;
        }

        .vl-visual {
          position: relative;
          height: calc(100dvh - 48px);
          min-height: 520px;
          overflow: hidden;
          border-radius: 42px;
          background:
            radial-gradient(circle at 18% 16%, rgba(255, 231, 177, 0.30), transparent 24%),
            radial-gradient(circle at 82% 18%, rgba(148, 98, 231, 0.28), transparent 28%),
            radial-gradient(circle at 78% 82%, rgba(200, 140, 22, 0.22), transparent 28%),
            linear-gradient(135deg, #35145f 0%, #56269b 44%, #24102f 100%);
          box-shadow: 0 34px 90px rgba(72, 36, 106, 0.24);
          isolation: isolate;
        }

        .vl-visual::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(115deg, rgba(255, 255, 255, 0.13) 0 1px, transparent 1px 54px),
            radial-gradient(circle at 20% 18%, rgba(255, 248, 225, 0.16), transparent 30%),
            linear-gradient(180deg, rgba(255, 253, 248, 0.10) 0%, rgba(255, 253, 248, 0.03) 42%, rgba(31, 12, 55, 0.20) 100%);
        }

        .vl-visual::after {
          content: "";
          position: absolute;
          inset: 24px;
          z-index: 2;
          pointer-events: none;
          border-radius: 34px;
          border: 1px solid rgba(255, 247, 218, 0.22);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            0 30px 70px rgba(23, 8, 42, 0.18);
        }

        .vl-orb {
          position: absolute;
          z-index: 2;
          border-radius: 999px;
          pointer-events: none;
        }

        .vl-orb-one {
          width: 230px;
          height: 230px;
          left: -54px;
          top: 112px;
          background: radial-gradient(circle at 35% 30%, rgba(255, 246, 218, 0.64), rgba(200, 140, 22, 0.22) 42%, rgba(86, 38, 155, 0.05) 70%);
          box-shadow: 0 30px 80px rgba(200, 140, 22, 0.22);
        }

        .vl-orb-two {
          width: 310px;
          height: 310px;
          right: -92px;
          bottom: 92px;
          background: radial-gradient(circle at 35% 30%, rgba(184, 144, 255, 0.34), rgba(86, 38, 155, 0.20) 50%, rgba(255, 255, 255, 0.05) 72%);
          box-shadow: 0 36px 96px rgba(40, 14, 74, 0.28);
        }

        .vl-gold-line {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(248, 216, 141, 0.72), transparent);
          height: 1px;
          transform: rotate(-18deg);
        }

        .vl-gold-line-one {
          width: 52%;
          top: 31%;
          right: 7%;
        }

        .vl-gold-line-two {
          width: 44%;
          bottom: 27%;
          left: 8%;
          opacity: 0.7;
        }

        .vl-recovery-visual {
          position: absolute;
          top: clamp(82px, 9.4vh, 112px);
          right: clamp(18px, 2.8vw, 44px);
          z-index: 4;
          width: clamp(238px, 24vw, 340px);
          aspect-ratio: 1;
          pointer-events: none;
          filter: drop-shadow(0 34px 64px rgba(23, 8, 42, 0.22));
        }

        .vl-recovery-glow {
          position: absolute;
          inset: 2%;
          border-radius: 999px;
          background:
            radial-gradient(circle at 34% 24%, rgba(255, 250, 231, 0.54), transparent 22%),
            radial-gradient(circle at 72% 68%, rgba(248, 216, 141, 0.38), transparent 32%),
            radial-gradient(circle at 48% 52%, rgba(148, 98, 231, 0.44), transparent 57%),
            radial-gradient(circle at 52% 50%, rgba(53, 20, 95, 0.18), transparent 68%);
          filter: blur(1.5px);
          opacity: 1;
        }

        .vl-recovery-orbit {
          position: absolute;
          inset: 5%;
          border-radius: 999px;
          border: 1px solid rgba(255, 247, 218, 0.24);
          transform: rotate(-18deg);
          box-shadow:
            inset 0 0 44px rgba(255, 255, 255, 0.05),
            0 0 42px rgba(248, 216, 141, 0.08);
        }

        .vl-recovery-orbit::before,
        .vl-recovery-orbit::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
        }

        .vl-recovery-orbit::before {
          inset: 14%;
          border: 1px solid rgba(248, 216, 141, 0.22);
          transform: rotate(36deg);
        }

        .vl-recovery-orbit::after {
          width: 11px;
          height: 11px;
          right: 11%;
          top: 25%;
          background: #f8d88d;
          box-shadow: 0 0 0 10px rgba(248, 216, 141, 0.10);
        }

        .vl-recovery-card {
          position: absolute;
          left: 50%;
          top: 52%;
          width: 70%;
          height: 61%;
          border-radius: 44px;
          transform: translate(-50%, -50%);
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.07)),
            radial-gradient(circle at 30% 18%, rgba(255, 247, 218, 0.34), transparent 34%),
            linear-gradient(180deg, rgba(86, 38, 155, 0.12), rgba(36, 16, 47, 0.06));
          border: 1px solid rgba(255, 247, 218, 0.34);
          box-shadow:
            0 32px 78px rgba(23, 8, 42, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.25),
            inset 0 -1px 0 rgba(248, 216, 141, 0.10);
          backdrop-filter: blur(18px);
        }

        .vl-lock-shackle {
          position: absolute;
          left: 50%;
          top: 22%;
          width: 33%;
          height: 34%;
          border: clamp(12px, 1.35vw, 18px) solid rgba(248, 216, 141, 0.98);
          border-bottom: 0;
          border-radius: 999px 999px 0 0;
          transform: translateX(-50%);
          box-shadow:
            0 18px 38px rgba(200, 140, 22, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.42);
          z-index: 6;
        }

        .vl-lock-body {
          position: absolute;
          left: 50%;
          top: 48%;
          width: 50%;
          height: 42%;
          border-radius: 34px;
          transform: translateX(-50%);
          background: linear-gradient(145deg, #fffdf8 0%, #f1e9ff 40%, #d8c4ff 100%);
          border: 1px solid rgba(255, 255, 255, 0.82);
          box-shadow:
            0 28px 62px rgba(23, 8, 42, 0.28),
            0 0 48px rgba(248, 216, 141, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.88),
            inset 0 -10px 24px rgba(53, 20, 95, 0.08);
          z-index: 7;
        }

        .vl-lock-body::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 35%;
          width: 16%;
          aspect-ratio: 1;
          border-radius: 999px;
          transform: translateX(-50%);
          background: radial-gradient(circle at 35% 28%, #5b35a4, #35145f 70%);
          box-shadow: 0 0 0 8px rgba(53, 20, 95, 0.08);
        }

        .vl-lock-body::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 6%;
          height: 30%;
          border-radius: 999px;
          transform: translateX(-50%);
          background: #35145f;
        }

        .vl-lock-shine {
          position: absolute;
          left: 20%;
          top: 18%;
          width: 38%;
          height: 9%;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          transform: rotate(-18deg);
          z-index: 8;
        }

        .vl-recovery-key {
          position: absolute;
          right: 0;
          bottom: 16%;
          width: 48%;
          height: 15%;
          transform: rotate(-28deg);
          z-index: 10;
          filter: drop-shadow(0 16px 26px rgba(200, 140, 22, 0.24));
        }

        .vl-key-head {
          position: absolute;
          left: 0;
          top: 0;
          width: 33%;
          aspect-ratio: 1;
          border-radius: 999px;
          border: clamp(8px, 0.95vw, 12px) solid rgba(248, 216, 141, 1);
          box-shadow: 0 16px 34px rgba(200, 140, 22, 0.28);
        }

        .vl-key-line {
          position: absolute;
          left: 28%;
          top: 39%;
          width: 68%;
          height: 24%;
          border-radius: 999px;
          background: linear-gradient(90deg, #fff2bd 0%, #f8d88d 22%, #c88c16 100%);
          box-shadow: 0 16px 32px rgba(200, 140, 22, 0.25);
        }

        .vl-key-tooth-one,
        .vl-key-tooth-two {
          position: absolute;
          right: 7%;
          width: 9%;
          border-radius: 0 0 999px 999px;
          background: #c88c16;
        }

        .vl-key-tooth-one {
          top: 56%;
          height: 38%;
        }

        .vl-key-tooth-two {
          right: 18%;
          top: 56%;
          height: 27%;
        }

        .vl-question-badge {
          position: absolute;
          right: 10%;
          top: 11%;
          z-index: 11;
          width: clamp(52px, 5.4vw, 76px);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 22%, #fffdf0 0%, #fff0b8 26%, #f8d88d 52%, #c88c16 100%);
          color: #35145f;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 3.8vw, 52px);
          font-weight: 900;
          line-height: 1;
          box-shadow:
            0 18px 38px rgba(200, 140, 22, 0.32),
            0 0 0 10px rgba(248, 216, 141, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.68);
        }

        .vl-spark {
          position: absolute;
          z-index: 12;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #f8d88d;
          box-shadow:
            0 0 0 8px rgba(248, 216, 141, 0.10),
            0 0 24px rgba(248, 216, 141, 0.55);
        }

        .vl-spark::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(248, 216, 141, 0.78), transparent);
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .vl-spark-one {
          left: 13%;
          top: 22%;
        }

        .vl-spark-two {
          left: 16%;
          bottom: 22%;
          width: 8px;
          height: 8px;
        }

        .vl-spark-three {
          right: 19%;
          bottom: 32%;
          width: 7px;
          height: 7px;
        }

        .vl-memory-pill {
          position: absolute;
          left: 0;
          bottom: 3%;
          z-index: 13;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          border-radius: 999px;
          border: 1px solid rgba(255, 247, 218, 0.32);
          background: linear-gradient(135deg, rgba(255, 253, 248, 0.18), rgba(255, 253, 248, 0.08));
          color: rgba(255, 253, 248, 0.88);
          padding: 0 16px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          box-shadow: 0 18px 36px rgba(23, 8, 42, 0.18);
          backdrop-filter: blur(16px);
        }

        .vl-memory-pill::before {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #f8d88d;
          box-shadow:
            0 0 0 6px rgba(248, 216, 141, 0.12),
            0 0 20px rgba(248, 216, 141, 0.55);
        }

        .vl-back {
          position: absolute;
          left: 26px;
          top: 24px;
          z-index: 80;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          border-radius: 999px;
          border: 1px solid rgba(255, 247, 218, 0.28);
          background: rgba(255, 253, 248, 0.12);
          color: #fff7db;
          padding: 0 16px;
          font-size: 13px;
          font-weight: 850;
          font-family: inherit;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 16px 34px rgba(23, 8, 42, 0.18);
          backdrop-filter: blur(16px);
        }

        .vl-back:hover {
          background: rgba(255, 253, 248, 0.20);
        }

        .vl-visual-content {
          position: relative;
          z-index: 18;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(24px, 3.6vw, 46px);
        }

        .vl-logo-link {
          width: fit-content;
          margin-top: 70px;
          margin-bottom: auto;
          display: inline-flex;
        }

        .vl-logo {
          width: clamp(182px, 14vw, 234px);
          height: auto;
          display: block;
          object-fit: contain;
          filter:
            drop-shadow(0 2px 0 rgba(255, 255, 255, 0.92))
            drop-shadow(0 16px 28px rgba(0, 0, 0, 0.22));
        }

        .vl-headline-block {
          position: relative;
          z-index: 24;
          width: min(58%, 540px);
          max-width: 540px;
          margin-top: auto;
          padding-bottom: clamp(58px, 12vh, 126px);
        }

        .vl-kicker {
          display: inline-flex;
          width: fit-content;
          margin: 0 0 13px;
          border-radius: 999px;
          border: 1px solid rgba(248, 216, 141, 0.28);
          background: rgba(255, 253, 247, 0.12);
          box-shadow: 0 8px 20px rgba(23, 8, 42, 0.10);
          padding: 7px 12px;
          color: var(--vl-gold-bright);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          backdrop-filter: blur(14px);
        }

        .vl-headline-block h1 {
          margin: 0;
          color: #fffaf3;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(50px, 5.35vw, 82px);
          font-weight: 400;
          letter-spacing: -0.052em;
          line-height: 1;
          text-wrap: balance;
          overflow: visible;
          text-shadow: 0 18px 38px rgba(23, 8, 42, 0.24);
        }

        .vl-headline-block h1 span {
          display: inline-block;
          width: fit-content;
          padding-left: 0.18em;
          padding-right: 0.08em;
          padding-bottom: 0.12em;
          margin-left: -0.02em;
          line-height: 1.12;
          overflow: visible;
          color: var(--vl-gold-bright);
          background: linear-gradient(135deg, #f8d88d 0%, #c88c16 46%, #fff2bd 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
        }

        .vl-visual-copy {
          max-width: 560px;
          margin: 18px 0 0;
          color: rgba(255, 250, 243, 0.84);
          font-size: clamp(15px, 1.28vw, 18px);
          line-height: 1.7;
        }

        .vl-mini-seal {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 247, 218, 0.28);
          background: rgba(255, 253, 248, 0.10);
          color: rgba(255, 253, 248, 0.74);
          padding: 8px 14px;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
        }

        .vl-form-area {
          min-height: calc(100dvh - 48px);
          display: flex;
          align-items: stretch;
          justify-content: center;
        }

        .vl-form-card {
          width: min(100%, 486px);
          min-height: calc(100dvh - 48px);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: clamp(24px, 3.2vh, 40px) clamp(24px, 3vw, 38px);
          padding-top: max(24px, calc((100dvh - 590px) / 2));
          border: 1px solid rgba(86, 38, 155, 0.12);
          border-radius: 36px;
          background: rgba(255, 253, 248, 0.88);
          box-shadow: 0 28px 80px rgba(72, 36, 106, 0.14);
          backdrop-filter: blur(22px);
          animation: vlFormEnter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes vlFormEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vl-form-head {
          margin-bottom: 22px;
        }

        .vl-form-head small {
          display: inline-flex;
          min-height: 30px;
          align-items: center;
          border-radius: 999px;
          border: 1px solid rgba(200, 140, 22, 0.25);
          background: rgba(255, 250, 238, 0.76);
          color: var(--vl-gold);
          padding: 0 12px;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vl-form-head h2 {
          margin: 14px 0 0;
          color: var(--vl-purple);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(40px, 4.2vw, 58px);
          font-weight: 400;
          letter-spacing: -0.06em;
          line-height: 0.98;
        }

        .vl-form-head p {
          margin: 10px 0 0;
          color: rgba(53, 20, 95, 0.62);
          font-size: 15px;
          line-height: 1.55;
        }

        .vl-reset-form {
          display: grid;
          gap: 13px;
        }

        .vl-field {
          display: grid;
          gap: 6px;
        }

        .vl-field-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .vl-label {
          color: var(--vl-purple);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.10em;
          text-transform: uppercase;
        }

        .vl-input {
          width: 100%;
          min-height: 52px;
          border: 1px solid rgba(86, 38, 155, 0.14);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.88);
          color: var(--vl-ink);
          font-size: 15px;
          outline: 0;
          padding: 0 15px;
          box-shadow: 0 10px 22px rgba(72, 36, 106, 0.04);
          transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .vl-input:focus {
          border-color: rgba(200, 140, 22, 0.60);
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(200, 140, 22, 0.12);
        }

        .vl-input.has-error {
          border-color: rgba(220, 38, 38, 0.55);
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.08);
        }

        .vl-input:disabled {
          color: rgba(53, 20, 95, 0.58);
          background: rgba(250, 247, 255, 0.72);
        }

        .vl-field-error {
          min-height: 15px;
          color: #b42318;
          font-size: 12px;
          font-weight: 750;
          line-height: 1.25;
        }

        .vl-alert {
          border-radius: 18px;
          border: 1px solid rgba(220, 38, 38, 0.22);
          background: rgba(254, 242, 242, 0.90);
          color: #b42318;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.4;
        }

        .vl-success {
          border-radius: 18px;
          border: 1px solid rgba(22, 163, 74, 0.22);
          background: rgba(240, 253, 244, 0.90);
          color: #166534;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.4;
        }

        .vl-submit {
          width: 100%;
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-radius: 18px;
          background: linear-gradient(135deg, var(--vl-purple) 0%, #35145f 100%);
          color: #fff7db;
          cursor: pointer;
          font-size: 14px;
          font-weight: 950;
          letter-spacing: 0.04em;
          box-shadow: 0 18px 38px rgba(86, 38, 155, 0.24);
          transition: transform 0.18s ease, filter 0.18s ease, opacity 0.18s ease;
        }

        .vl-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }

        .vl-submit:disabled {
          cursor: not-allowed;
          opacity: 0.62;
        }

        .vl-spinner {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.42);
          border-top-color: #ffffff;
          animation: vlSpin 0.8s linear infinite;
        }

        @keyframes vlSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .vl-login-line,
        .vl-help-box {
          margin-top: 18px;
          border: 1px solid rgba(86, 38, 155, 0.10);
          border-radius: 22px;
          background: rgba(250, 247, 255, 0.78);
          padding: 13px;
          color: rgba(53, 20, 95, 0.64);
          font-size: 14px;
          line-height: 1.55;
          text-align: center;
        }

        .vl-help-box {
          margin-top: 13px;
          text-align: left;
          background: rgba(255, 250, 238, 0.76);
          border-color: rgba(200, 140, 22, 0.18);
        }

        .vl-login-line a,
        .vl-help-box a {
          color: var(--vl-purple);
          font-weight: 900;
          text-decoration: none;
        }

        .vl-login-line a:hover,
        .vl-help-box a:hover {
          text-decoration: underline;
        }

        @media (min-width: 1041px) and (max-width: 1280px) {
          .vl-headline-block {
            width: min(54%, 470px);
            max-width: 470px;
          }

          .vl-headline-block h1 {
            font-size: clamp(46px, 5.1vw, 68px);
          }

          .vl-visual-copy {
            max-width: 420px;
          }

          .vl-recovery-visual {
            width: clamp(220px, 24vw, 300px);
            right: clamp(14px, 2.2vw, 30px);
            top: clamp(88px, 10vh, 118px);
          }
        }

        @media (max-width: 1040px) {
          .vl-shell {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .vl-visual {
            min-height: 420px;
            height: auto;
          }

          .vl-recovery-visual {
            width: min(310px, 48vw);
            top: 74px;
            right: 24px;
            opacity: 0.74;
          }

          .vl-headline-block {
            width: min(62%, 560px);
            max-width: 560px;
          }

          .vl-form-area,
          .vl-form-card {
            min-height: auto;
          }

          .vl-form-card {
            width: 100%;
            padding: 28px;
          }
        }

        @media (max-width: 720px) {
          .vl-shell {
            padding: 12px;
            gap: 14px;
          }

          .vl-visual {
            min-height: 380px;
            border-radius: 28px;
          }

          .vl-visual::after {
            inset: 14px;
            border-radius: 22px;
          }

          .vl-back {
            left: 18px;
            top: 16px;
          }

          .vl-logo-link {
            margin-top: 58px;
          }

          .vl-recovery-visual {
            top: 72px;
            right: 6px;
            width: min(58vw, 230px);
            opacity: 0.34;
          }

          .vl-headline-block {
            width: min(100%, 470px);
            max-width: 470px;
            padding-bottom: 20px;
          }

          .vl-headline-block h1 {
            font-size: clamp(42px, 13vw, 58px);
          }

          .vl-form-card {
            border-radius: 26px;
            padding: 24px 18px;
          }

          .vl-form-head h2 {
            font-size: 40px;
          }
        }
      `}</style>

      <div className="vl-shell">
        <section className="vl-visual" aria-label="Área visual VivaLista">
          <span className="vl-orb vl-orb-one" aria-hidden="true" />
          <span className="vl-orb vl-orb-two" aria-hidden="true" />
          <span className="vl-gold-line vl-gold-line-one" aria-hidden="true" />
          <span className="vl-gold-line vl-gold-line-two" aria-hidden="true" />

          <div className="vl-recovery-visual" aria-hidden="true">
            <span className="vl-recovery-glow" />
            <span className="vl-recovery-orbit" />
            <span className="vl-recovery-card" />
            <span className="vl-lock-shackle" />
            <span className="vl-lock-body">
              <span className="vl-lock-shine" />
            </span>
            <span className="vl-recovery-key">
              <span className="vl-key-head" />
              <span className="vl-key-line" />
              <span className="vl-key-tooth-one" />
              <span className="vl-key-tooth-two" />
            </span>
            <span className="vl-question-badge">✓</span>
            <span className="vl-spark vl-spark-one" />
            <span className="vl-spark vl-spark-two" />
            <span className="vl-spark vl-spark-three" />
            <span className="vl-memory-pill">nova senha</span>
          </div>

          <button type="button" className="vl-back" onClick={handleBack}>
            ← Voltar
          </button>

          <div className="vl-visual-content">
            <div className="vl-logo-link">
              <Image
                src="/logo-vivalista.png"
                alt="VivaLista"
                width={260}
                height={90}
                className="vl-logo"
                priority
              />
            </div>

            <div className="vl-headline-block">
              <p className="vl-kicker">Nova senha</p>
              <h1>
                Crie uma nova
                <span>senha</span>
              </h1>
              <p className="vl-visual-copy">
                Finalize a recuperação do acesso e volte ao painel do VivaLista com segurança.
              </p>

              <div className="vl-mini-seal">token • senha • acesso</div>
            </div>
          </div>
        </section>

        <section className="vl-form-area" aria-label="Redefinir senha do VivaLista">
          <div className="vl-form-card">
            <div className="vl-form-head">
              <small>redefinir senha</small>
              <h2>Nova senha</h2>
              <p>Digite e confirme uma nova senha para sua conta.</p>
            </div>

            {missingToken ? (
              <div className="vl-alert">
                Link inválido ou incompleto. Solicite uma nova recuperação de senha.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="vl-reset-form">
              {email ? (
                <div className="vl-field">
                  <div className="vl-field-top">
                    <label htmlFor="email" className="vl-label">
                      E-mail
                    </label>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="vl-input"
                  />
                  <span className="vl-field-error" />
                </div>
              ) : null}

              <div className="vl-field">
                <div className="vl-field-top">
                  <label htmlFor="newPassword" className="vl-label">
                    Nova senha
                  </label>
                </div>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    if (errorMessage) setErrorMessage(null);
                    if (successMessage) setSuccessMessage(null);
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="Digite sua nova senha"
                  autoComplete="new-password"
                  autoFocus
                  disabled={missingToken || loading || Boolean(successMessage)}
                  className={`vl-input ${passwordError ? "has-error" : ""}`}
                />

                <span className="vl-field-error">{passwordError || ""}</span>
              </div>

              <div className="vl-field">
                <div className="vl-field-top">
                  <label htmlFor="confirmPassword" className="vl-label">
                    Confirmar senha
                  </label>
                </div>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    if (errorMessage) setErrorMessage(null);
                    if (successMessage) setSuccessMessage(null);
                  }}
                  onBlur={() => setConfirmTouched(true)}
                  placeholder="Confirme sua nova senha"
                  autoComplete="new-password"
                  disabled={missingToken || loading || Boolean(successMessage)}
                  className={`vl-input ${confirmPasswordError ? "has-error" : ""}`}
                />

                <span className="vl-field-error">{confirmPasswordError || ""}</span>
              </div>

              {errorMessage ? <div className="vl-alert">{errorMessage}</div> : null}
              {successMessage ? <div className="vl-success">{successMessage}</div> : null}

              <button
                type="submit"
                disabled={missingToken || loading || Boolean(successMessage)}
                className="vl-submit"
              >
                {loading ? (
                  <>
                    <span className="vl-spinner" />
                    Salvando...
                  </>
                ) : (
                  "Redefinir senha"
                )}
              </button>
            </form>

            <div className="vl-login-line">
              Já redefiniu? <Link href="/login">Entrar no painel</Link>
            </div>

            <div className="vl-help-box">
              Link expirado? <Link href="/forgot-password">Solicite uma nova recuperação</Link>.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
