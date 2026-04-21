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

export default function RegisterPage() {
  const router = useRouter();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Informe seu nome.");
      return;
    }

    if (!organizationName.trim()) {
      setErrorMessage("Informe o nome da organização.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Informe seu e-mail.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Informe sua senha.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          organizationName: organizationName.trim(),
          email: email.trim(),
          password,
        }),
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const message =
          data?.message && Array.isArray(data.message)
            ? data.message.join(", ")
            : data?.message || "Não foi possível criar sua conta.";

        setErrorMessage(message);
        return;
      }

      setSuccessMessage("Conta criada com sucesso. Redirecionando para o login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f1fb] text-[#4b2c73]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.97),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(195,160,255,0.16),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[linear-gradient(180deg,#fbf8ff_0%,#f4ebff_42%,#f6f1fb_100%)]" />

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
                  primeiro acesso ao painel
                </p>
              </div>

              <h1 className="mt-8 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#4d2a78] sm:text-5xl xl:text-6xl">
                Crie sua conta
                <br />
                <span className="font-normal text-[#6b4aa3]">
                  e comece a organizar
                </span>
                <br />
                <span className="font-normal text-[#6b4aa3]">
                  seus eventos com
                </span>
                <br />
                <span className="font-normal text-[#6b4aa3]">
                  elegância e controle.
                </span>
              </h1>

              <p className="mt-6 max-w-[580px] text-lg leading-8 text-[#7b64a4]">
                Crie seu acesso, sua organização e entre no painel do VivaLista
                para começar a administrar eventos, convidados, presentes,
                RSVP e pagamentos.
              </p>

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
                  Já tenho conta
                </Link>
              </div>
            </section>

            <section className="relative">
              <div className="relative mx-auto max-w-[560px]">
                <div className="relative rounded-[36px] border border-white/75 bg-white/78 p-6 shadow-[0_30px_80px_rgba(112,76,170,0.14)] backdrop-blur-xl sm:p-8">
                  <div className="rounded-[30px] border border-[#ede2fb] bg-white p-6 shadow-[0_18px_40px_rgba(107,74,163,0.08)] sm:p-8">
                    <div className="text-center">
                      <div className="mx-auto inline-flex rounded-full border border-[#efe1ff] bg-[#faf6ff] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a63cf]">
                        cadastro seguro
                      </div>

                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[#4d2a78]">
                        Criar conta
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[#826ca6]">
                        Preencha os dados abaixo para criar seu primeiro acesso
                        ao painel do VivaLista.
                      </p>
                    </div>

                    <form onSubmit={handleRegister} className="mt-8 space-y-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-[#5d3d8f]"
                        >
                          Nome
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Digite seu nome"
                          className="w-full rounded-2xl border border-[#e8def8] bg-[#fcfaff] px-4 py-3.5 text-sm text-[#4b2c73] outline-none transition focus:border-[#a980ff] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="organizationName"
                          className="mb-2 block text-sm font-medium text-[#5d3d8f]"
                        >
                          Nome da organização
                        </label>
                        <input
                          id="organizationName"
                          type="text"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="Ex.: VivaLista Eventos"
                          className="w-full rounded-2xl border border-[#e8def8] bg-[#fcfaff] px-4 py-3.5 text-sm text-[#4b2c73] outline-none transition focus:border-[#a980ff] focus:bg-white"
                        />
                      </div>

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
                        <label
                          htmlFor="password"
                          className="mb-2 block text-sm font-medium text-[#5d3d8f]"
                        >
                          Senha
                        </label>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Digite sua senha"
                          autoComplete="new-password"
                          className="w-full rounded-2xl border border-[#e8def8] bg-[#fcfaff] px-4 py-3.5 text-sm text-[#4b2c73] outline-none transition focus:border-[#a980ff] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="mb-2 block text-sm font-medium text-[#5d3d8f]"
                        >
                          Confirmar senha
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repita sua senha"
                          autoComplete="new-password"
                          className="w-full rounded-2xl border border-[#e8def8] bg-[#fcfaff] px-4 py-3.5 text-sm text-[#4b2c73] outline-none transition focus:border-[#a980ff] focus:bg-white"
                        />
                      </div>

                      {errorMessage ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                          {errorMessage}
                        </div>
                      ) : null}

                      {successMessage ? (
                        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                          {successMessage}
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-[linear-gradient(135deg,#8f57f5_0%,#7c4ce0_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(124,76,224,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Criando conta..." : "Criar conta"}
                      </button>
                    </form>

                    <div className="mt-6 rounded-[22px] border border-[#efe5fb] bg-[#faf7ff] p-4 text-center">
                      <p className="text-sm leading-7 text-[#826ca6]">
                        Já possui acesso?{" "}
                        <Link
                          href="/login"
                          className="font-semibold text-[#7c4ce0] hover:underline"
                        >
                          Entrar no painel
                        </Link>
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