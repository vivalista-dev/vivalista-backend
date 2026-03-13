"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../../../src/lib/api";

type EventItem = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  date: string;
  location: string;
  capacity: number | null;
  status: string;
  createdAt: string;
};

type GuestItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  rsvpCode: string | null;
  createdAt: string;
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("pt-BR");
}

function getGuestStatusStyle(status: string) {
  if (status === "CONFIRMED") {
    return {
      background: "#dcfce7",
      color: "#166534",
      label: "CONFIRMADO",
    };
  }

  if (status === "DECLINED") {
    return {
      background: "#fee2e2",
      color: "#b91c1c",
      label: "RECUSOU",
    };
  }

  return {
    background: "#fef3c7",
    color: "#92400e",
    label: "CONVIDADO",
  };
}

function getSummaryCardStyle(type: "total" | "confirmed" | "declined" | "pending") {
  if (type === "confirmed") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
  }

  if (type === "declined") {
    return {
      background: "#fee2e2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
    };
  }

  if (type === "pending") {
    return {
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fde68a",
    };
  }

  return {
    background: "#e5e7eb",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
}

export default function EventGuestsPage() {
  const params = useParams();
  const eventId = String(params.eventId);

  const [event, setEvent] = useState<EventItem | null>(null);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function loadPageData() {
    try {
      setLoading(true);

      const [eventData, guestsData] = await Promise.all([
        apiFetch(`/events/${eventId}`),
        apiFetch(`/events/${eventId}/guests`),
      ]);

      if (!eventData || !eventData.id) {
        throw new Error("Evento não encontrado.");
      }

      if (!Array.isArray(guestsData)) {
        throw new Error("Resposta inválida ao carregar convidados.");
      }

      setEvent(eventData);
      setGuests(guestsData);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os dados dos convidados.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGuest() {
    try {
      if (!name.trim()) {
        alert("Nome do convidado é obrigatório.");
        return;
      }

      setSaving(true);

      const payload = {
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
      };

      const createdGuest = await apiFetch(`/events/${eventId}/guests`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!createdGuest || !createdGuest.id) {
        throw new Error("Erro ao criar convidado.");
      }

      alert("Convidado criado com sucesso!");

      setName("");
      setEmail("");
      setPhone("");

      await loadPageData();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar convidado.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (eventId) {
      loadPageData();
    }
  }, [eventId]);

  const summary = useMemo(() => {
    const total = guests.length;
    const confirmed = guests.filter((guest) => guest.status === "CONFIRMED").length;
    const declined = guests.filter((guest) => guest.status === "DECLINED").length;
    const pending = guests.filter((guest) => guest.status === "INVITED").length;

    return {
      total,
      confirmed,
      declined,
      pending,
    };
  }, [guests]);

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link
          href="/dashboard/eventos"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            border: "1px solid #000",
            color: "#000",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Voltar para eventos
        </Link>

        <Link
          href={`/dashboard/eventos/${eventId}/presentes`}
          style={{
            display: "inline-block",
            padding: "10px 14px",
            background: "black",
            color: "white",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Ir para presentes
        </Link>
      </div>

      {loading ? (
        <p>Carregando convidados...</p>
      ) : !event ? (
        <p>Evento não encontrado.</p>
      ) : (
        <>
          <h1>Convidados do evento</h1>

          <div
            style={{
              marginTop: 20,
              marginBottom: 30,
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              maxWidth: 800,
            }}
          >
            <h2 style={{ marginTop: 0 }}>{event.name}</h2>

            <p>
              <strong>Status:</strong> {event.status}
            </p>

            <p>
              <strong>Slug:</strong> {event.slug || "-"}
            </p>

            <p>
              <strong>Local:</strong> {event.location}
            </p>

            <p>
              <strong>Data:</strong> {new Date(event.date).toLocaleString("pt-BR")}
            </p>
          </div>

          <section style={{ marginTop: 30, maxWidth: 1000 }}>
            <h2>Resumo dos convidados</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  ...getSummaryCardStyle("total"),
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>TOTAL</p>
                <h3 style={{ margin: "10px 0 0 0", fontSize: 32 }}>{summary.total}</h3>
              </div>

              <div
                style={{
                  ...getSummaryCardStyle("confirmed"),
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>CONFIRMADOS</p>
                <h3 style={{ margin: "10px 0 0 0", fontSize: 32 }}>{summary.confirmed}</h3>
              </div>

              <div
                style={{
                  ...getSummaryCardStyle("declined"),
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>RECUSARAM</p>
                <h3 style={{ margin: "10px 0 0 0", fontSize: 32 }}>{summary.declined}</h3>
              </div>

              <div
                style={{
                  ...getSummaryCardStyle("pending"),
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>PENDENTES</p>
                <h3 style={{ margin: "10px 0 0 0", fontSize: 32 }}>{summary.pending}</h3>
              </div>
            </div>
          </section>

          <section
            style={{
              marginTop: 30,
              maxWidth: 800,
              border: "1px solid #ddd",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Cadastrar convidado</h2>

            <div style={{ marginTop: 15 }}>
              <label>Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: 10, marginTop: 8 }}
                placeholder="Ex: Maria Souza"
              />
            </div>

            <div style={{ marginTop: 15 }}>
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: 10, marginTop: 8 }}
                placeholder="Ex: maria@email.com"
              />
            </div>

            <div style={{ marginTop: 15 }}>
              <label>Telefone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", padding: 10, marginTop: 8 }}
                placeholder="Ex: 11999999999"
              />
            </div>

            <button
              onClick={handleCreateGuest}
              disabled={saving}
              style={{
                marginTop: 20,
                padding: 12,
                width: "100%",
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Salvando..." : "Criar convidado"}
            </button>
          </section>

          <section style={{ marginTop: 40 }}>
            <h2>Lista de convidados</h2>

            {guests.length === 0 ? (
              <p>Nenhum convidado cadastrado ainda.</p>
            ) : (
              <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
                {guests.map((guest) => {
                  const statusStyle = getGuestStatusStyle(guest.status);

                  return (
                    <div
                      key={guest.id}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        padding: 16,
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <h3 style={{ marginTop: 0, marginBottom: 0 }}>{guest.name}</h3>

                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                            background: statusStyle.background,
                            color: statusStyle.color,
                          }}
                        >
                          {statusStyle.label}
                        </span>
                      </div>

                      <p style={{ marginTop: 12 }}>
                        <strong>Email:</strong> {guest.email || "-"}
                      </p>

                      <p>
                        <strong>Telefone:</strong> {guest.phone || "-"}
                      </p>

                      <p>
                        <strong>Status:</strong> {guest.status}
                      </p>

                      <p>
                        <strong>Código RSVP:</strong> {guest.rsvpCode || "-"}
                      </p>

                      <p>
                        <strong>Criado em:</strong> {formatDateTime(guest.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}