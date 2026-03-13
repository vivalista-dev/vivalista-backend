"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

type GiftItem = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  purchaseUrl: string | null;
  isActive: boolean;
  isReserved: boolean;
  isPurchased: boolean;
  reservedByName: string | null;
  reservedAt: string | null;
  purchasedByName: string | null;
  purchasedAt: string | null;
  createdAt: string;
};

function formatDateTime(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("pt-BR");
}

function formatMoney(value: number | null) {
  if (value === null || value === undefined) return "-";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getGiftStatus(gift: GiftItem) {
  if (!gift.isActive) {
    return {
      label: "INATIVO",
      background: "#f3f4f6",
      color: "#374151",
    };
  }

  if (gift.isPurchased) {
    return {
      label: "COMPRADO",
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (gift.isReserved) {
    return {
      label: "RESERVADO",
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  return {
    label: "DISPONÍVEL",
    background: "#fee2e2",
    color: "#b91c1c",
  };
}

export default function EventGiftsPage() {
  const params = useParams();
  const eventId = String(params.eventId);

  const [event, setEvent] = useState<EventItem | null>(null);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [purchaseUrl, setPurchaseUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function loadPageData() {
    try {
      setLoading(true);

      const [eventData, giftsData] = await Promise.all([
        apiFetch(`/events/${eventId}`),
        apiFetch(`/events/${eventId}/gifts`),
      ]);

      if (!eventData || !eventData.id) {
        throw new Error("Evento não encontrado.");
      }

      if (!Array.isArray(giftsData)) {
        throw new Error("Resposta inválida ao carregar presentes.");
      }

      setEvent(eventData);
      setGifts(giftsData);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os dados dos presentes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGift() {
    try {
      if (!title.trim()) {
        alert("Título do presente é obrigatório.");
        return;
      }

      setSaving(true);

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        price: price ? Number(price) : null,
        imageUrl: imageUrl.trim() || null,
        purchaseUrl: purchaseUrl.trim() || null,
        isActive,
      };

      const createdGift = await apiFetch(`/events/${eventId}/gifts`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!createdGift || !createdGift.id) {
        throw new Error("Erro ao criar presente.");
      }

      alert("Presente criado com sucesso!");

      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setPurchaseUrl("");
      setIsActive(true);

      await loadPageData();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar presente.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (eventId) {
      loadPageData();
    }
  }, [eventId]);

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <div style={{ marginBottom: 20 }}>
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
      </div>

      {loading ? (
        <p>Carregando presentes...</p>
      ) : !event ? (
        <p>Evento não encontrado.</p>
      ) : (
        <>
          <h1>Presentes do evento</h1>

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

          <section
            style={{
              marginTop: 30,
              maxWidth: 800,
              border: "1px solid #ddd",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Cadastrar presente</h2>

            <div style={{ marginTop: 15 }}>
              <label>Título do presente</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: 10, marginTop: 8 }}
                placeholder="Ex: Air Fryer"
              />
            </div>

            <div style={{ marginTop: 15 }}>
              <label>Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: 10, marginTop: 8, minHeight: 100 }}
                placeholder="Ex: Presente para a cozinha"
              />
            </div>

            <div style={{ marginTop: 15 }}>
              <label>Preço</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: "100%", padding: 10, marginTop: 8 }}
                placeholder="Ex: 399.90"
              />
            </div>

            <div style={{ marginTop: 15 }}>
              <label>URL da imagem</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ width: "100%", padding: 10, marginTop: 8 }}
                placeholder="https://..."
              />
            </div>

            <div style={{ marginTop: 15 }}>
              <label>URL de compra</label>
              <input
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                style={{ width: "100%", padding: 10, marginTop: 8 }}
                placeholder="https://..."
              />
            </div>

            <div style={{ marginTop: 15 }}>
              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ marginRight: 10 }}
                />
                Presente ativo
              </label>
            </div>

            <button
              onClick={handleCreateGift}
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
              {saving ? "Salvando..." : "Criar presente"}
            </button>
          </section>

          <section style={{ marginTop: 40 }}>
            <h2>Lista de presentes</h2>

            {gifts.length === 0 ? (
              <p>Nenhum presente cadastrado ainda.</p>
            ) : (
              <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
                {gifts.map((gift) => {
                  const statusInfo = getGiftStatus(gift);

                  return (
                    <div
                      key={gift.id}
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
                        <h3 style={{ marginTop: 0, marginBottom: 0 }}>{gift.title}</h3>

                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                            background: statusInfo.background,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <p style={{ marginTop: 12 }}>
                        <strong>Preço:</strong> {formatMoney(gift.price)}
                      </p>

                      <p>
                        <strong>Descrição:</strong> {gift.description || "-"}
                      </p>

                      <p>
                        <strong>Ativo:</strong> {gift.isActive ? "Sim" : "Não"}
                      </p>

                      <p>
                        <strong>Reservado:</strong> {gift.isReserved ? "Sim" : "Não"}
                      </p>

                      <p>
                        <strong>Comprado:</strong> {gift.isPurchased ? "Sim" : "Não"}
                      </p>

                      <p>
                        <strong>Imagem:</strong>{" "}
                        {gift.imageUrl ? (
                          <a href={gift.imageUrl} target="_blank" rel="noreferrer">
                            Abrir imagem
                          </a>
                        ) : (
                          "-"
                        )}
                      </p>

                      <p>
                        <strong>Link de compra:</strong>{" "}
                        {gift.purchaseUrl ? (
                          <a href={gift.purchaseUrl} target="_blank" rel="noreferrer">
                            Abrir link
                          </a>
                        ) : (
                          "-"
                        )}
                      </p>

                      <p>
                        <strong>Reservado por:</strong> {gift.reservedByName || "-"}
                      </p>

                      <p>
                        <strong>Data da reserva:</strong> {formatDateTime(gift.reservedAt)}
                      </p>

                      <p>
                        <strong>Comprado por:</strong> {gift.purchasedByName || "-"}
                      </p>

                      <p>
                        <strong>Data da compra:</strong> {formatDateTime(gift.purchasedAt)}
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