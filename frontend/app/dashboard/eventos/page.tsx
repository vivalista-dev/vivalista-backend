"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../src/lib/api";

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

export default function EventosPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("DRAFT");

  async function loadEvents() {
    try {
      setLoading(true);

      const data = await apiFetch("/events");

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida ao carregar eventos.");
      }

      setEvents(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar eventos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEvent() {
    try {
      if (!name.trim()) {
        alert("Nome do evento é obrigatório.");
        return;
      }

      if (!date) {
        alert("Data do evento é obrigatória.");
        return;
      }

      if (!location.trim()) {
        alert("Local do evento é obrigatório.");
        return;
      }

      setSaving(true);

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        date: new Date(date).toISOString(),
        location: location.trim(),
        capacity: capacity ? Number(capacity) : null,
        status,
      };

      const createdEvent = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!createdEvent || !createdEvent.id) {
        throw new Error("Erro ao criar evento.");
      }

      alert("Evento criado com sucesso!");

      setName("");
      setDescription("");
      setDate("");
      setLocation("");
      setCapacity("");
      setStatus("DRAFT");

      await loadEvents();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar evento.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Eventos</h1>

      <section
        style={{
          marginTop: 30,
          maxWidth: 700,
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 8,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Criar novo evento</h2>

        <div style={{ marginTop: 15 }}>
          <label>Nome do evento</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 8 }}
            placeholder="Ex: Casamento Renan e Laislla"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <label>Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 8, minHeight: 100 }}
            placeholder="Mensagem do evento"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <label>Data e hora</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <label>Local</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 8 }}
            placeholder="Ex: Buffet Jardim Real"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <label>Capacidade</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 8 }}
            placeholder="Ex: 120"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </div>

        <button
          onClick={handleCreateEvent}
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
          {saving ? "Salvando..." : "Criar evento"}
        </button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Meus eventos</h2>

        {loading ? (
          <p>Carregando eventos...</p>
        ) : events.length === 0 ? (
          <p>Nenhum evento cadastrado ainda.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
            {events.map((event) => (
              <div
                key={event.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h3 style={{ marginTop: 0 }}>{event.name}</h3>

                <p>
                  <strong>Status:</strong> {event.status}
                </p>

                <p>
                  <strong>Slug:</strong> {event.slug || "-"}
                </p>

                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(event.date).toLocaleString("pt-BR")}
                </p>

                <p>
                  <strong>Local:</strong> {event.location}
                </p>

                <p>
                  <strong>Capacidade:</strong> {event.capacity ?? "-"}
                </p>

                <p>
                  <strong>Descrição:</strong> {event.description || "-"}
                </p>

                {event.slug && event.status === "PUBLISHED" && (
                  <p>
                    <strong>Página pública:</strong>{" "}
                    <a
                      href={`http://localhost:3001/e/${event.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://localhost:3001/e/{event.slug}
                    </a>
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 16,
                  }}
                >
                  <Link
                    href={`/dashboard/eventos/${event.id}/presentes`}
                    style={{
                      display: "inline-block",
                      padding: "10px 14px",
                      background: "black",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: 6,
                    }}
                  >
                    Gerenciar presentes
                  </Link>

                  <Link
                    href={`/dashboard/eventos/${event.id}/convidados`}
                    style={{
                      display: "inline-block",
                      padding: "10px 14px",
                      background: "#444",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: 6,
                    }}
                  >
                    Gerenciar convidados
                  </Link>

                  {event.slug && event.status === "PUBLISHED" && (
                    <a
                      href={`http://localhost:3001/e/${event.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "10px 14px",
                        border: "1px solid #000",
                        color: "#000",
                        textDecoration: "none",
                        borderRadius: 6,
                      }}
                    >
                      Abrir página pública
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}