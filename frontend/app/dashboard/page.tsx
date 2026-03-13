"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Painel do VivaLista</h1>

      <p>Bem-vindo ao painel administrativo.</p>

      <div style={{ marginTop: "30px", display: "grid", gap: "10px", maxWidth: "300px" }}>
        
        <Link href="/dashboard/configuracoes-pagamento">
          <button style={{ padding: "12px", width: "100%" }}>
            Configuração de Pagamentos
          </button>
        </Link>

        <Link href="/dashboard/eventos">
          <button style={{ padding: "12px", width: "100%" }}>
            Meus Eventos
          </button>
        </Link>

        <Link href="/dashboard/presentes">
          <button style={{ padding: "12px", width: "100%" }}>
            Lista de Presentes
          </button>
        </Link>

        <Link href="/dashboard/convidados">
          <button style={{ padding: "12px", width: "100%" }}>
            Convidados
          </button>
        </Link>

      </div>
    </main>
  );
}