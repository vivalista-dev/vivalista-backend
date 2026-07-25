type MiniSiteGridProps = {
  showLocation: boolean;
  showGifts: boolean;
  showRsvp: boolean;
  eventLocationLabel: string;
};

export function MiniSiteGrid({
  showLocation,
  showGifts,
  showRsvp,
  eventLocationLabel,
}: MiniSiteGridProps) {
  return (
    <section className="mini-site-grid">
      {showLocation ? (
        <div className="mini-site-card">
          <span>Localização</span>
          <strong>{eventLocationLabel}</strong>
        </div>
      ) : null}

      {showGifts ? (
        <div className="mini-site-card">
          <span>Presentes</span>
          <strong>Lista elegante</strong>
        </div>
      ) : null}

      {showRsvp ? (
        <div className="mini-site-card accent-card">
          <span>RSVP</span>
          <strong>Confirmar presença</strong>
        </div>
      ) : null}
    </section>
  );
}
