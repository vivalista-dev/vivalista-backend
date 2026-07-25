import { CountdownPreview } from "./CountdownPreview";
import { GalleryPreview } from "./GalleryPreview";
import { MessagePreview } from "./MessagePreview";
import { MiniHeroPreview } from "./MiniHeroPreview";
import { MiniSiteGrid } from "./MiniSiteGrid";

type TitleParts = {
  first: string;
  second: string;
};

type PreviewFormData = {
  heroLayout: string;
  siteAtmosphere: string;
  textDensity: string;
  fontStyle: string;
  titleSize: string;
  welcomeMessage: string;
  showCountdown: boolean;
  showStory: boolean;
  showGallery: boolean;
  showLocation: boolean;
  showGifts: boolean;
  showRsvp: boolean;
};

type FullSitePreviewProps = {
  form: PreviewFormData;
  leftImage: string;
  titleParts: TitleParts;
  heroLeadText: string;
  eventDateLabel: string;
  eventLocationLabel: string;
  textAlign: "left" | "center" | "right";
  textPlacement: "top" | "middle" | "bottom";
  effectiveTextFrame: "solto" | "retangular" | "quadrado";
  fontClass: string;
  liveTitleSize: number;
};

export function FullSitePreview({
  form,
  leftImage,
  titleParts,
  heroLeadText,
  eventDateLabel,
  eventLocationLabel,
  textAlign,
  textPlacement,
  effectiveTextFrame,
  fontClass,
  liveTitleSize,
}: FullSitePreviewProps) {
  return (
    <div className={`full-site-preview layout-${form.heroLayout} atmosphere-${form.siteAtmosphere}`}>
      <MiniHeroPreview
        leftImage={leftImage}
        titleParts={titleParts}
        heroLeadText={heroLeadText}
        eventDateLabel={eventDateLabel}
        eventLocationLabel={eventLocationLabel}
        textAlign={textAlign}
        textPlacement={textPlacement}
        effectiveTextFrame={effectiveTextFrame}
        textDensity={form.textDensity}
        fontClass={fontClass}
        titleSize={form.titleSize}
        liveTitleSize={liveTitleSize}
      />

      {form.showCountdown ? <CountdownPreview /> : null}

      {form.showStory ? <MessagePreview welcomeMessage={form.welcomeMessage} /> : null}

      {form.showGallery ? <GalleryPreview /> : null}

      <MiniSiteGrid
        showLocation={form.showLocation}
        showGifts={form.showGifts}
        showRsvp={form.showRsvp}
        eventLocationLabel={eventLocationLabel}
      />
    </div>
  );
}
