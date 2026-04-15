"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../../../../src/lib/api";

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

type GiftType = "PHYSICAL" | "CASH" | "QUOTA" | "FREE_CONTRIBUTION";
type PriceMode = "FIXED" | "FLEXIBLE";
type GiftStatusType =
  | "AVAILABLE"
  | "RESERVED"
  | "PURCHASED"
  | "PARTIALLY_FUNDED"
  | "DISABLED";

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
  giftType?: GiftType;
  priceMode?: PriceMode;
  giftStatus?: GiftStatusType;
  allowCustomAmount?: boolean;
  quotaTotal?: number | null;
  quotaSold?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  isFeatured?: boolean;
  displayOrder?: number | null;
  category?: string | null;
};

function formatDateTime(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("pt-BR");
}

function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) return "-";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getGiftStatus(gift: GiftItem) {
  if (!gift.isActive || gift.giftStatus === "DISABLED") {
    return {
      label: "INATIVO",
      background: "#f3f4f6",
      color: "#374151",
    };
  }

  if (gift.isPurchased || gift.giftStatus === "PURCHASED") {
    return {
      label: "COMPRADO",
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (gift.giftStatus === "PARTIALLY_FUNDED") {
    return {
      label: "PARCIAL",
      background: "#dbeafe",
      color: "#1d4ed8",
    };
  }

  if (gift.isReserved || gift.giftStatus === "RESERVED") {
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

function getGiftTypeLabel(type?: GiftType) {
  switch (type) {
    case "CASH":
      return "Dinheiro";
    case "QUOTA":
      return "Cotas";
    case "FREE_CONTRIBUTION":
      return "Contribuição livre";
    default:
      return "Físico";
  }
}

function getPriceModeLabel(mode?: PriceMode) {
  return mode === "FLEXIBLE" ? "Flexível" : "Fixo";
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: 32,
  background: "linear-gradient(180deg, #fcf8f5 0%, #f8f1ec 100%)",
  color: "#18181b",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const shellStyle: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #eadfd7",
  borderRadius: 24,
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  marginTop: 8,
  borderRadius: 16,
  border: "1px solid #e4e4e7",
  outline: "none",
  fontSize: 14,
  background: "#fff",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: "#71717a",
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "14px 20px",
  background: "#09090b",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #d4d4d8",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#fff",
  color: "#18181b",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "14px 20px",
  background: "#dc2626",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const checkboxCardStyle: React.CSSProperties = {
  border: "1px solid #e4e4e7",
  borderRadius: 18,
  padding: 14,
  background: "#fafafa",
};

export default function EditGiftPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = String(params.eventId);
  const giftId = String(params.giftId);

  const [event, setEvent] = useState<EventItem | null>(null);
  const [gift, setGift] = useState<GiftItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [purchaseUrl, setPurchaseUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [giftType, setGiftType] = useState<GiftType>("PHYSICAL");
  const [priceMode, setPriceMode] = useState<PriceMode>("FIXED");
  const [giftStatus, setGiftStatus] = useState<GiftStatusType>("AVAILABLE");
  const [allowCustomAmount, setAllowCustomAmount] = useState(false);
  const [quotaTotal, setQuotaTotal] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("");
  const [category, setCategory] = useState("");

  async function loadPageData() {
    try {
      setLoading(true);

      const [eventData, giftData] = await Promise.all([
        apiFetch(`/events/${eventId}`),
        apiFetch(`/events/${eventId}/gifts/${giftId}`),
      ]);

      if (!eventData || !eventData.id) {
        throw new Error("Evento não encontrado.");
      }

      if (!giftData || !giftData.id) {
        throw new Error("Presente não encontrado.");
      }

      setEvent(eventData);
      setGift(giftData);

      setTitle(giftData.title ?? "");
      setDescription(giftData.description ?? "");
      setPrice(giftData.price !== null && giftData.price !== undefined ? String(giftData.price) : "");
      setImageUrl(giftData.imageUrl ?? "");
      setPurchaseUrl(giftData.purchaseUrl ?? "");
      setIsActive(Boolean(giftData.isActive));
      setGiftType((giftData.giftType as GiftType) ?? "PHYSICAL");
      setPriceMode((giftData.priceMode as PriceMode) ?? "FIXED");
      setGiftStatus((giftData.giftStatus as GiftStatusType) ?? "AVAILABLE");
      setAllowCustomAmount(Boolean(giftData.allowCustomAmount));
      setQuotaTotal(
        giftData.quotaTotal !== null && giftData.quotaTotal !== undefined
          ? String(giftData.quotaTotal)
          : "",
      );
      setMinAmount(
        giftData.minAmount !== null && giftData.minAmount !== undefined
          ? String(giftData.minAmount)
          : "",
      );
      setMaxAmount(
        giftData.maxAmount !== null && giftData.maxAmount !== undefined
          ? String(giftData.maxAmount)
          : "",
      );
      setIsFeatured(Boolean(giftData.isFeatured));
      setDisplayOrder(
        giftData.displayOrder !== null && giftData.displayOrder !== undefined
          ? String(giftData.displayOrder)
          : "",
      );
      setCategory(giftData.category ?? "");
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar o presente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (eventId && giftId) {
      loadPageData();
    }
  }, [eventId, giftId]);

  const statusInfo = useMemo(() => {
    return gift ? getGiftStatus(gift) : null;
  }, [gift]);

  const showPriceField = giftType !== "FREE_CONTRIBUTION" && priceMode === "FIXED";
  const showPurchaseUrl = giftType === "PHYSICAL";
  const showQuotaFields = giftType === "QUOTA";
  const showFlexibleFields =
    giftType === "CASH" || giftType === "FREE_CONTRIBUTION" || priceMode === "FLEXIBLE";

  async function handleUpdateGift() {
    try {
      if (!title.trim()) {
        alert("Título do presente é obrigatório.");
        return;
      }

      if (giftType === "QUOTA" && !quotaTotal) {
        alert("Para presente por cotas, informe a quantidade total de cotas.");
        return;
      }

      if (giftType !== "FREE_CONTRIBUTION" && priceMode === "FIXED" && !price) {
        alert("Informe o preço quando o modo de preço for fixo.");
        return;
      }

      if (
        (giftType === "CASH" || giftType === "FREE_CONTRIBUTION" || priceMode === "FLEXIBLE") &&
        minAmount &&
        maxAmount &&
        Number(minAmount) > Number(maxAmount)
      ) {
        alert("O valor mínimo não pode ser maior que o valor máximo.");
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
        giftType,
        priceMode,
        giftStatus,
        allowCustomAmount,
        quotaTotal: quotaTotal ? Number(quotaTotal) : null,
        minAmount: minAmount ? Number(minAmount) : null,
        maxAmount: maxAmount ? Number(maxAmount) : null,
        isFeatured,
        displayOrder: displayOrder ? Number(displayOrder) : 0,
        category: category.trim() || null,
      };

      const updatedGift = await apiFetch(`/events/${eventId}/gifts/${giftId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!updatedGift || !updatedGift.id) {
        throw new Error("Erro ao atualizar presente.");
      }

      alert("Presente atualizado com sucesso!");
      await loadPageData();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar presente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGift() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este presente? Essa ação não pode ser desfeita.",
    );

    if (!confirmed) return;

    try {
      setRemoving(true);

      await apiFetch(`/events/${eventId}/gifts/${giftId}`, {
        method: "DELETE",
      });

      alert("Presente excluído com sucesso!");
      router.push(`/dashboard/eventos/${eventId}/presentes`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir presente.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#e11d48",
              }}
            >
              Dashboard
            </p>
            <h1
              style={{
                marginTop: 10,
                marginBottom: 0,
                fontSize: 36,
                lineHeight: 1.05,
                fontWeight: 700,
              }}
            >
              Editar presente
            </h1>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href={`/dashboard/eventos/${eventId}/presentes`}
              style={{ ...secondaryButtonStyle, textDecoration: "none" }}
            >
              Voltar para presentes
            </Link>

            <Link href="/dashboard/eventos" style={{ ...secondaryButtonStyle, textDecoration: "none" }}>
              Voltar para eventos
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ ...cardStyle, padding: 28 }}>
            <p style={{ margin: 0 }}>Carregando presente...</p>
          </div>
        ) : !event || !gift ? (
          <div style={{ ...cardStyle, padding: 28 }}>
            <p style={{ margin: 0 }}>Presente não encontrado.</p>
          </div>
        ) : (
          <>
            <section style={{ ...cardStyle, padding: 24, marginBottom: 24 }}>
              <div
                style={{
                  display: "grid",
                  gap: 16,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                <div>
                  <p style={labelStyle}>Evento</p>
                  <p style={{ marginTop: 10, marginBottom: 0, fontSize: 22, fontWeight: 700 }}>
                    {event.name}
                  </p>
                </div>

                <div>
                  <p style={labelStyle}>Presente</p>
                  <p style={{ marginTop: 10, marginBottom: 0 }}>{gift.title}</p>
                </div>

                <div>
                  <p style={labelStyle}>Tipo</p>
                  <p style={{ marginTop: 10, marginBottom: 0 }}>
                    {getGiftTypeLabel(gift.giftType)}
                  </p>
                </div>

                <div>
                  <p style={labelStyle}>Modo de preço</p>
                  <p style={{ marginTop: 10, marginBottom: 0 }}>
                    {getPriceModeLabel(gift.priceMode)}
                  </p>
                </div>

                <div>
                  <p style={labelStyle}>Preço atual</p>
                  <p style={{ marginTop: 10, marginBottom: 0 }}>
                    {formatMoney(gift.price)}
                  </p>
                </div>

                <div>
                  <p style={labelStyle}>Criado em</p>
                  <p style={{ marginTop: 10, marginBottom: 0 }}>
                    {formatDateTime(gift.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            <section style={{ ...cardStyle, padding: 24, marginBottom: 24 }}>
              <div
                style={{
                  display: "grid",
                  gap: 18,
                  gridTemplateColumns: gift.imageUrl ? "220px 1fr" : "1fr",
                }}
              >
                {gift.imageUrl && (
                  <div>
                    <img
                      src={gift.imageUrl}
                      alt={gift.title}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 18,
                        background: "#f4f4f5",
                        border: "1px solid #e4e4e7",
                      }}
                    />
                  </div>
                )}

                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    {statusInfo && (
                      <span
                        style={{
                          padding: "8px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: statusInfo.background,
                          color: statusInfo.color,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    )}

                    {gift.isFeatured && (
                      <span
                        style={{
                          padding: "8px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: "#18181b",
                          color: "#fff",
                        }}
                      >
                        Destaque
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 10,
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      <strong>Categoria:</strong> {gift.category || "-"}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Ordem:</strong> {gift.displayOrder ?? 0}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Reservado por:</strong> {gift.reservedByName || "-"}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Comprado por:</strong> {gift.purchasedByName || "-"}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Reservado em:</strong> {formatDateTime(gift.reservedAt)}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Comprado em:</strong> {formatDateTime(gift.purchasedAt)}
                    </p>
                    {gift.giftType === "QUOTA" && (
                      <>
                        <p style={{ margin: 0 }}>
                          <strong>Total de cotas:</strong> {gift.quotaTotal ?? 0}
                        </p>
                        <p style={{ margin: 0 }}>
                          <strong>Cotas vendidas:</strong> {gift.quotaSold ?? 0}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section style={{ ...cardStyle, padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#e11d48",
                  }}
                >
                  Edição
                </p>
                <h2 style={{ marginTop: 10, marginBottom: 0, fontSize: 28 }}>
                  Atualizar dados do presente
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 18,
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Título do presente</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                    placeholder="Ex: Air Fryer"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                    placeholder="Ex: Presente para a cozinha"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tipo do presente</label>
                  <select
                    value={giftType}
                    onChange={(e) => setGiftType(e.target.value as GiftType)}
                    style={inputStyle}
                  >
                    <option value="PHYSICAL">Físico</option>
                    <option value="CASH">Dinheiro</option>
                    <option value="QUOTA">Cotas</option>
                    <option value="FREE_CONTRIBUTION">Contribuição livre</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Modo de preço</label>
                  <select
                    value={priceMode}
                    onChange={(e) => setPriceMode(e.target.value as PriceMode)}
                    style={inputStyle}
                  >
                    <option value="FIXED">Fixo</option>
                    <option value="FLEXIBLE">Flexível</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={giftStatus}
                    onChange={(e) => setGiftStatus(e.target.value as GiftStatusType)}
                    style={inputStyle}
                  >
                    <option value="AVAILABLE">Disponível</option>
                    <option value="RESERVED">Reservado</option>
                    <option value="PURCHASED">Comprado</option>
                    <option value="PARTIALLY_FUNDED">Parcial</option>
                    <option value="DISABLED">Desabilitado</option>
                  </select>
                </div>

                {showPriceField && (
                  <div>
                    <label style={labelStyle}>Preço</label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={inputStyle}
                      placeholder="Ex: 399.90"
                    />
                  </div>
                )}

                {showQuotaFields && (
                  <div>
                    <label style={labelStyle}>Quantidade total de cotas</label>
                    <input
                      type="number"
                      value={quotaTotal}
                      onChange={(e) => setQuotaTotal(e.target.value)}
                      style={inputStyle}
                      placeholder="Ex: 10"
                    />
                  </div>
                )}

                {showFlexibleFields && (
                  <>
                    <div>
                      <label style={labelStyle}>Valor mínimo</label>
                      <input
                        type="number"
                        step="0.01"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        style={inputStyle}
                        placeholder="Ex: 20"
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Valor máximo</label>
                      <input
                        type="number"
                        step="0.01"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        style={inputStyle}
                        placeholder="Ex: 500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={labelStyle}>Categoria</label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={inputStyle}
                    placeholder="Ex: Eletrodomésticos"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ordem de exibição</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    style={inputStyle}
                    placeholder="Ex: 1"
                  />
                </div>

                <div>
                  <label style={labelStyle}>URL da imagem</label>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={inputStyle}
                    placeholder="https://..."
                  />
                </div>

                {showPurchaseUrl && (
                  <div>
                    <label style={labelStyle}>URL de compra</label>
                    <input
                      value={purchaseUrl}
                      onChange={(e) => setPurchaseUrl(e.target.value)}
                      style={inputStyle}
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 14,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  marginTop: 20,
                }}
              >
                <label style={checkboxCardStyle}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ marginRight: 10 }}
                  />
                  Presente ativo
                </label>

                <label style={checkboxCardStyle}>
                  <input
                    type="checkbox"
                    checked={allowCustomAmount}
                    onChange={(e) => setAllowCustomAmount(e.target.checked)}
                    style={{ marginRight: 10 }}
                  />
                  Permitir valor customizado
                </label>

                <label style={checkboxCardStyle}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{ marginRight: 10 }}
                  />
                  Destacar presente
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 24,
                }}
              >
                <button
                  type="button"
                  onClick={handleUpdateGift}
                  disabled={saving}
                  style={{
                    ...primaryButtonStyle,
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/eventos/${eventId}/presentes`)}
                  style={secondaryButtonStyle}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleDeleteGift}
                  disabled={removing}
                  style={{
                    ...dangerButtonStyle,
                    opacity: removing ? 0.7 : 1,
                  }}
                >
                  {removing ? "Excluindo..." : "Excluir presente"}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}