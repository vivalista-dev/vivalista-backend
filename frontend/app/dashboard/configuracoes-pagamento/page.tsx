"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../src/lib/api";

export default function PaymentSettingsPage() {
  const [gateway, setGateway] = useState("");
  const [accountId, setAccountId] = useState("");
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadSettings() {
    try {
      const data = await apiFetch("/organizations/me/payment-settings");

      if (!data || !data.organization) {
        throw new Error("Resposta inválida ao carregar configuração.");
      }

      setGateway(data.organization.paymentGateway || "");
      setAccountId(data.organization.paymentAccountId || "");
      setStatus(data.organization.paymentAccountStatus || "");
      setReady(Boolean(data.organization.paymentAccountReady));
    } catch (error) {
      alert("Erro ao carregar os dados da configuração de pagamento.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      const data = await apiFetch("/organizations/me/payment-settings", {
        method: "PATCH",
        body: JSON.stringify({
          paymentGateway: gateway,
          paymentAccountId: accountId,
          paymentAccountStatus: status,
          paymentAccountReady: ready,
        }),
      });

      if (!data) {
        throw new Error("Erro ao salvar configuração.");
      }

      alert("Configuração salva com sucesso!");
    } catch (error) {
      alert("Erro ao salvar os dados da configuração de pagamento.");
      console.error(error);
    }
  }

  function prepareForTests() {
    setGateway("mercadopago");
    setStatus("CONNECTED");
    setReady(true);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Carregando...</div>;
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial", maxWidth: 600 }}>
      <h1>Configuração de Pagamentos</h1>

      <p style={{ marginTop: 10, color: "#555" }}>
        Use esta tela para deixar a organização pronta para receber pagamentos de teste.
      </p>

      <div style={{ marginTop: 20 }}>
        <label>Gateway</label>
        <input
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 8 }}
          placeholder="Ex: mercadopago"
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Account ID</label>
        <input
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 8 }}
          placeholder="Ex: mp_test_account_001"
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Status da Conta</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 8 }}
        >
          <option value="">Selecione</option>
          <option value="NOT_CONNECTED">NOT_CONNECTED</option>
          <option value="PENDING">PENDING</option>
          <option value="CONNECTED">CONNECTED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={ready}
            onChange={(e) => setReady(e.target.checked)}
            style={{ marginRight: 10 }}
          />
          Conta pronta para receber pagamentos
        </label>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 30 }}>
        <button
          onClick={prepareForTests}
          style={{
            padding: 12,
            width: "100%",
            background: "#444",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Preparar para testes
        </button>

        <button
          onClick={saveSettings}
          style={{
            padding: 12,
            width: "100%",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Salvar configuração
        </button>
      </div>
    </main>
  );
}