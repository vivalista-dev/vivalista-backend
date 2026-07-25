import { CSSProperties } from "react";

type TitleParts = {
  first: string;
  second: string;
};

type MiniHeroPreviewProps = {
  leftImage: string;
  titleParts: TitleParts;
  heroLeadText: string;
  eventDateLabel: string;
  eventLocationLabel: string;
  textAlign: "left" | "center" | "right";
  textPlacement: "top" | "middle" | "bottom";
  effectiveTextFrame: "solto" | "retangular" | "quadrado";
  textDensity: string;
  fontClass: string;
  titleSize: string;
  liveTitleSize: number;
};

export function MiniHeroPreview({
  leftImage,
  titleParts,
  heroLeadText,
  eventDateLabel,
  eventLocationLabel,
  textAlign,
  textPlacement,
  effectiveTextFrame,
  textDensity,
  fontClass,
  titleSize,
  liveTitleSize,
}: MiniHeroPreviewProps) {
  return (
    <section className="mini-hero-preview">
      <div
        className="visual-photo-layer"
        style={{
          backgroundImage: `url(${leftImage})`,
        }}
      />

      <div
        className="visual-photo-shape"
        style={{
          backgroundImage: `url(${leftImage})`,
        }}
      />

      <div
        className={`mini-hero-copy align-${textAlign} place-${textPlacement} frame-${effectiveTextFrame} body-density-${textDensity}`}
      >
        <strong
          className={`${fontClass} title-size-${titleSize} vivalista-live-title`}
          style={{ "--live-title-size": `${liveTitleSize}px` } as CSSProperties}
        >
          {titleParts.first || "Seu evento"}
          {titleParts.second ? (
            <>
              <br />
              <span>&amp; {titleParts.second}</span>
            </>
          ) : null}
        </strong>

        {heroLeadText ? <p>{heroLeadText}</p> : null}

        <div className="preview-meta">
          <span>{eventDateLabel}</span>
          <i />
          <span>{eventLocationLabel}</span>
        </div>
      </div>
    </section>
  );
}
