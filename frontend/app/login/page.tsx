"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

const trustPoints = [
  "Painel administrativo completo",
  "Eventos, convidados e presentes em um só lugar",
  "Base pronta para RSVP e pagamentos",
];

const quickStats = [
  { label: "Página pública", value: "elegante" },
  { label: "Gestão", value: "centralizada" },
  { label: "Fluxo", value: "profissional" },
];

export default function LoginPage() {
  const router = useRouter();

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Informe seu e-mail.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Informe sua senha.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        let data: any = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        const message =
          data?.message && Array.isArray(data.message)
            ? data.message.join(", ")
            : data?.message || "Login inválido. Verifique seu e-mail e senha.";

        setErrorMessage(message);
        return;
      }

      const data = await response.json();

      const token = data.access_token || data.accessToken || data.token;

      if (!token) {
        setErrorMessage("Token não encontrado na resposta do servidor.");
        console.log(data);
        return;
      }

      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f1fb] text-[#4b2c73]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.97),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(195,160,255,0.16),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[linear-gradient(180deg,#fbf8ff_0%,#f4ebff_42%,#f6f1fb_100%)]" />
        <div className="absolute left-[-8%] top-[180px] h-36 w-[128%] rotate-[-4deg] rounded-[100%] bg-white/40 blur-2xl" />
        <div className="absolute left-[-10%] top-[250px] h-40 w-[140%] rotate-[2deg] rounded-[100%] bg-[#e2cffd]/42 blur-2xl" />
        <div className="absolute right-[-8%] top-[90px] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,219,92,0.24),transparent_62%)] blur-3xl" />

        <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="max-w-[660px]">
              <Link href="/" className="inline-flex">
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

              <div className="mt-8 inline-flex rounded-full border border-[#f3df9b]/70 bg-white/88 px-4 py-2 shadow-[0_10px_26px_rgba(188,145,38,0.10)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#9d7a1d]">
                  acesso ao painel VivaLista
                </p>
              </div>

              <h1 className="mt-8 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#4d2a78] sm:text-5xl xl:text-6xl">
                Entre no seu painel
                <br />
                <span className="font-normal text-[#6b4aa3]">
                  e continue gerenciando
                </span>
                <br />
                <span className="font-normal text-[#6b4aa3]">
                  seus eventos com clareza
                </span>
                <br />
                <span className="font-normal text-[#6b4aa3]">
                  e elegância.
                </span>
              </h1>

              <p className="mt-6 max-w-[580px] text-lg leading-8 text-[#7b64a4]">
                Acesse sua conta para administrar eventos, convidados,
                presentes, RSVP, pagamentos e toda a experiência pública do
                VivaLista em uma base profissional e organizada.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {quickStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/70 bg-white/74 px-4 py-4 shadow-[0_10px_24px_rgba(91,58,140,0.06)] backdrop-blur"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c73b1]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#5d3d8f]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/65 bg-white/70 px-4 py-4 text-sm font-medium text-[#6a5494] shadow-[0_10px_24px_rgba(91,58,140,0.05)] backdrop-blur"
                  >
                    <span className="text-[#f1b626]">✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/"
                  className="rounded-2xl border border-[#f2dfaa]/70 bg-white/84 px-6 py-3 text-sm font-semibold text-[#5e3e90] shadow-[0_12px_26px_rgba(188,145,38,0.08)] backdrop-blur transition hover:bg-white"
                >
                  Voltar para a home
                </Link>

                <Link
                  href="/login"
                  className="rounded-2xl bg-[linear-gradient(135deg,#9b63ff_0%,#7d4fe1_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(124,76,224,0.24)] transition hover:scale-[1.02]"
                >
                  Acessar painel
                </Link>
              </div>
            </section>

            <section className="relative">
              <div className="relative mx-auto max-w-[560px]">
                <div className="absolute inset-0 rounded-[50px] bg-[radial-gradient(circle_at_center,rgba(164,114,255,0.22),transparent_58%)] blur-2xl" />
                <div className="absolute right-6 top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,219,92,0.20),transparent_62%)] blur-2xl" />

                <div className="relative rounded-[36px] border border-white/75 bg-white/78 p-6 shadow-[0_30px_80px_rgba(112,76,170,0.14)] backdrop-blur-xl sm:p-8">
                  <div className="rounded-[30px] border border-[#ede2fb] bg-white p-6 shadow-[0_18px_40px_rgba(107,74,163,0.08)] sm:p-8">
                    <div className="text-center">
                      <div className="mx-auto inline-flex rounded-full border border-[#efe1ff] bg-[#faf6ff] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a63cf]">
                        login seguro
                      </div>

                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[#4d2a78]">
                        Entrar
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                        Use seu e-mail e senha para acessar o painel administrativo
                        do VivaLista.
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-5">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-[#5d3d8f]"
                        >
                          E-mail
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Digite seu e-mail"
                          autoComplete="email"
                          className="w-full rounded-2xl border border-[#e8def8] bg-[#fcfaff] px-4 py-3.5 text-sm text-[#4b2c73] outline-none transition focus:border-[#a980ff] focus:bg-white"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-[#5d3d8f]"
                          >
                            Senha
                          </label>
                          <span className="text-xs font-medium text-[#8d73b3]">
                            acesso ao painel
                          </span>
                        </div>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Digite sua senha"
                          autoComplete="current-password"
                          className="w-full rounded-2xl border border-[#e8def8] bg-[#fcfaff] px-4 py-3.5 text-sm text-[#4b2c73] outline-none transition focus:border-[#a980ff] focus:bg-white"
                        />
                      </div>

                      {errorMessage ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                          {errorMessage}
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-[linear-gradient(135deg,#8f57f5_0%,#7c4ce0_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(124,76,224,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Entrando..." : "Entrar no painel"}
                      </button>
                    </form>

                    <div className="mt-6 rounded-[22px] border border-[#efe5fb] bg-[#faf7ff] p-4 text-center">
                      <p className="text-sm leading-7 text-[#826ca6]">
                        Ao entrar, você continua a gestão do seu evento no painel
                        principal do VivaLista.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}