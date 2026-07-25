type VisualBuilderStylesProps = {
  liveTitleSize: number;
};

export function VisualBuilderStyles({ liveTitleSize }: VisualBuilderStylesProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --vv-plum: #43263f;
          --vv-plum-dark: #2a182b;
          --vv-gold: #c4a262;
          --vv-gold-soft: #decda9;
          --vv-ivory: #fffdf8;
          --vv-champagne: #f5efe5;
          --vv-stone: #7b7370;
          --vv-line: rgba(67, 38, 63, 0.12);
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          background: var(--vv-ivory);
        }

        body {
          overflow-x: hidden;
        }

        .font-elegant {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          letter-spacing: -0.04em;
        }

        .font-modern {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 700;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }

        .font-romantic {
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 400;
          letter-spacing: -0.03em;
        }

        .font-minimal {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 300;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .font-rustic {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .font-boho {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          letter-spacing: -0.02em;
        }

        .vivalista-wizard {
          height: 100svh;
          min-height: 640px;
          display: grid;
          grid-template-columns: minmax(410px, 49%) 1fr;
          background:
            radial-gradient(
              circle at 78% 14%,
              rgba(196, 162, 98, 0.12),
              transparent 30%
            ),
            linear-gradient(135deg, #fffdf8 0%, #f8f1e8 100%);
          color: var(--vv-plum);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          overflow: hidden;
        }

        .image-side {
          position: relative;
          height: 100svh;
          min-height: 640px;
          overflow: hidden;
          background: #eee3d3;
          padding: 22px;
        }

        .image-frame {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 34px;
          background: #eee3d3;
          box-shadow: 0 24px 58px rgba(42, 24, 43, 0.15);
        }

        .image-side-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.01);
          filter: saturate(0.92) contrast(1.02) brightness(1);
        }

        .image-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(42, 24, 43, 0.04),
              rgba(42, 24, 43, 0.28)
            ),
            linear-gradient(
              90deg,
              rgba(255, 253, 248, 0.1),
              rgba(255, 253, 248, 0) 42%
            );
        }

        .image-caption {
          position: absolute;
          left: 30px;
          top: 28px;
          z-index: 2;
          color: rgba(255, 255, 255, 0.9);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
        }

        .site-preview-frame {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .site-preview-content {
          position: relative;
          z-index: 3;
          width: min(82%, 620px);
          text-align: center;
          color: #fffdf8;
          text-shadow: 0 14px 36px rgba(0, 0, 0, 0.38);
        }

        .site-preview-content small {
          display: block;
          margin-bottom: 16px;
          color: rgba(255, 253, 248, 0.86);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .site-preview-content strong {
          display: block;
          font-size: clamp(52px, 6vw, 102px);
          line-height: 0.88;
          font-weight: 400;
          letter-spacing: -0.075em;
        }

        .site-preview-content strong span {
          color: var(--brand-secondary);
        }

        .site-preview-content p {
          margin: 22px auto 0;
          max-width: 420px;
          color: rgba(255, 253, 248, 0.84);
          font-size: 15px;
          line-height: 1.55;
        }

        .preview-meta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255, 253, 248, 0.16);
          border: 1px solid rgba(255, 253, 248, 0.22);
          backdrop-filter: blur(10px);
          color: rgba(255, 253, 248, 0.9);
          font-size: 12px;
          font-weight: 800;
          text-shadow: none;
        }

        .preview-meta i {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: var(--brand-secondary);
        }

        .preview-photo-large {
          display: none;
          position: relative;
          z-index: 3;
          background-size: cover;
          background-position: center;
          box-shadow: 0 24px 54px rgba(42, 24, 43, 0.22);
          border: 8px solid rgba(255, 253, 248, 0.86);
        }

        .image-frame.layout-centralizado .site-preview-content {
          align-self: flex-end;
          margin-bottom: 70px;
          padding: 0 20px;
        }

        .image-frame.layout-tela-cheia .site-preview-content {
          width: min(88%, 700px);
        }

        .image-frame.layout-circular,
        .image-frame.layout-oval {
          background:
            radial-gradient(circle at 50% 22%, rgba(196, 162, 98, 0.16), transparent 34%),
            linear-gradient(135deg, #fffdf8 0%, #f4eadc 100%);
          flex-direction: column;
          gap: 22px;
        }

        .image-frame.layout-circular .image-side-image,
        .image-frame.layout-oval .image-side-image {
          opacity: 0.16;
          filter: blur(10px) saturate(0.9);
          transform: scale(1.08);
        }

        .image-frame.layout-circular::after,
        .image-frame.layout-oval::after {
          background: linear-gradient(180deg, rgba(255, 253, 248, 0.6), rgba(255, 253, 248, 0.88));
        }

        .image-frame.layout-circular .preview-photo-large,
        .image-frame.layout-oval .preview-photo-large {
          display: block;
          width: min(46vw, 330px);
          height: min(46vw, 330px);
          margin-top: 24px;
        }

        .image-frame.layout-circular .preview-photo-large {
          border-radius: 999px;
        }

        .image-frame.layout-oval .preview-photo-large {
          width: min(40vw, 285px);
          height: min(50vw, 380px);
          border-radius: 999px 999px 46% 46%;
        }

        .image-frame.layout-circular .site-preview-content,
        .image-frame.layout-oval .site-preview-content {
          color: var(--vv-plum);
          text-shadow: none;
        }

        .image-frame.layout-circular .site-preview-content small,
        .image-frame.layout-oval .site-preview-content small {
          color: rgba(67, 38, 63, 0.48);
        }

        .image-frame.layout-circular .site-preview-content p,
        .image-frame.layout-oval .site-preview-content p {
          color: rgba(67, 38, 63, 0.62);
        }

        .image-frame.layout-circular .preview-meta,
        .image-frame.layout-oval .preview-meta {
          background: rgba(255, 253, 248, 0.72);
          border-color: rgba(196, 162, 98, 0.24);
          color: rgba(67, 38, 63, 0.62);
        }

        .preview-card {
          position: absolute;
          left: 30px;
          right: 30px;
          bottom: 30px;
          z-index: 2;
          max-width: 430px;
          padding: 28px 28px 25px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.34);
          background:
            linear-gradient(
              180deg,
              rgba(255, 253, 248, 0.9),
              rgba(255, 248, 235, 0.78)
            );
          color: var(--vv-plum);
          box-shadow: 0 24px 54px rgba(42, 24, 43, 0.24);
          backdrop-filter: blur(16px);
        }

        .preview-card::before {
          content: "";
          position: absolute;
          inset: 14px;
          border-radius: 23px;
          border: 1px solid rgba(196, 162, 98, 0.22);
          pointer-events: none;
        }


        .preview-photo {
          display: none;
          width: 82px;
          height: 82px;
          margin: 0 auto 14px;
          border: 4px solid rgba(255, 253, 248, 0.88);
          background-size: cover;
          background-position: center;
          box-shadow: 0 16px 28px rgba(42, 24, 43, 0.18);
        }

        .preview-card.layout-circular,
        .preview-card.layout-oval,
        .preview-card.layout-moldura {
          text-align: center;
          max-width: 390px;
        }

        .preview-card.layout-circular .preview-photo,
        .preview-card.layout-oval .preview-photo,
        .preview-card.layout-moldura .preview-photo {
          display: block;
        }

        .preview-card.layout-circular .preview-photo {
          border-radius: 999px;
        }

        .preview-card.layout-oval .preview-photo {
          width: 76px;
          height: 98px;
          border-radius: 999px 999px 46px 46px;
        }

        .preview-card.layout-moldura .preview-photo {
          width: 96px;
          height: 76px;
          border-radius: 24px;
        }

        .preview-card.layout-tela-cheia {
          background: linear-gradient(
            180deg,
            rgba(42, 24, 43, 0.78),
            rgba(42, 24, 43, 0.56)
          );
          color: #fffdf8;
        }

        .preview-card.layout-tela-cheia small,
        .preview-card.layout-tela-cheia p {
          color: rgba(255, 253, 248, 0.76);
        }

        .preview-card.layout-tela-cheia strong {
          color: #fffdf8;
        }

        .preview-card.layout-tela-cheia strong span {
          color: var(--brand-secondary);
        }

        .preview-card small {
          display: block;
          margin-bottom: 14px;
          color: rgba(67, 38, 63, 0.52);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .preview-card strong {
          display: block;
          color: var(--brand-primary);
          font-size: clamp(42px, 4.5vw, 72px);
          line-height: 0.9;
          font-weight: 400;
          letter-spacing: -0.07em;
        }

        .preview-card strong span {
          color: var(--brand-secondary);
        }

        .preview-card p {
          margin: 18px 0 0;
          max-width: 310px;
          color: rgba(67, 38, 63, 0.62);
          font-size: 14px;
          line-height: 1.55;
        }

        .form-side {
          height: 100svh;
          min-height: 640px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          position: relative;
          overflow: hidden;
        }

        .top-bar {
          height: 112px;
          display: grid;
          grid-template-columns: 100px 1fr 100px;
          align-items: center;
          padding: 14px 48px 0;
        }

        .back-button {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(196, 162, 98, 0.25);
          background: rgba(255, 253, 248, 0.52);
          color: var(--vv-plum);
          font-size: 25px;
          line-height: 1;
          border-radius: 999px;
          cursor: pointer;
          opacity: 0.88;
          transition: 0.2s ease;
        }

        .back-button:hover {
          transform: translateX(-2px);
          background: #ffffff;
        }

        .back-button:disabled {
          opacity: 0.16;
          cursor: not-allowed;
          transform: none;
        }

        .brand-logo-link {
          justify-self: center;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 320px;
          min-height: 92px;
          text-decoration: none;
        }

        .brand-logo-img {
          display: block;
          width: 300px;
          height: auto;
          max-height: 92px;
          object-fit: contain;
          filter: drop-shadow(0 10px 18px rgba(67, 38, 63, 0.1));
        }

        .top-link {
          justify-self: end;
          color: var(--vv-plum);
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          opacity: 0.7;
          padding: 10px 12px;
          border-radius: 999px;
          transition: 0.2s ease;
        }

        .top-link:hover {
          background: rgba(196, 162, 98, 0.11);
          opacity: 1;
        }

        .wizard-content {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 0 60px 22px;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
        }

        .question-box {
          width: 100%;
          max-width: 620px;
          text-align: center;
          padding-bottom: 8px;
        }

        .step-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 29px;
          padding: 0 14px;
          margin-bottom: 12px;
          border: 1px solid rgba(196, 162, 98, 0.3);
          border-radius: 999px;
          color: rgba(67, 38, 63, 0.64);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: rgba(255, 253, 248, 0.42);
        }

        .progress-mini {
          width: min(100%, 610px);
          margin: 0 auto 27px;
        }

        .progress-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          width: 100%;
          margin-bottom: 17px;
          color: rgba(67, 38, 63, 0.56);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.035em;
        }

        .progress-summary span,
        .progress-summary strong {
          display: block;
          white-space: nowrap;
        }

        .progress-summary strong {
          color: var(--vv-plum);
          font-size: 14px;
          font-weight: 900;
        }

        .progress-summary i {
          display: none;
        }

        .progress-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .progress-item {
          display: flex;
          align-items: center;
          flex: 1 1 auto;
          min-width: 0;
        }

        .progress-item:last-child {
          flex: 0 0 auto;
        }

        .progress-dot {
          position: relative;
          flex: 0 0 auto;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          border: 1px solid rgba(196, 162, 98, 0.42);
          background:
            radial-gradient(
              circle at 34% 28%,
              rgba(255, 255, 255, 0.98) 0 14%,
              rgba(255, 253, 248, 0.96) 15% 40%,
              rgba(232, 219, 196, 0.86) 100%
            );
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.9),
            inset 0 -5px 9px rgba(196, 162, 98, 0.16),
            0 5px 13px rgba(67, 38, 63, 0.08);
          transition: 0.25s ease;
        }

        .progress-dot::after {
          content: "";
          position: absolute;
          top: 4px;
          left: 5px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 0 7px rgba(255, 255, 255, 0.82);
        }

        .progress-dot.done {
          border-color: rgba(196, 162, 98, 0.78);
          background:
            radial-gradient(
              circle at 35% 28%,
              #fff8dd 0 13%,
              #e2c879 14% 45%,
              #ba9250 100%
            );
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.75),
            inset 0 -6px 10px rgba(103, 67, 23, 0.14),
            0 0 0 4px rgba(196, 162, 98, 0.09),
            0 8px 16px rgba(196, 162, 98, 0.24);
        }

        .progress-dot.skipped {
          border-color: rgba(67, 38, 63, 0.2);
          background: rgba(67, 38, 63, 0.08);
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.7), 0 5px 12px rgba(67, 38, 63, 0.05);
        }

        .progress-dot.current {
          width: 29px;
          height: 29px;
          border-color: rgba(67, 38, 63, 0.86);
          background:
            radial-gradient(
              circle at 35% 27%,
              rgba(255, 255, 255, 0.6) 0 10%,
              rgba(87, 50, 81, 0.98) 11% 42%,
              #2a182b 100%
            );
          box-shadow:
            inset 0 1px 3px rgba(255, 255, 255, 0.34),
            inset 0 -7px 11px rgba(0, 0, 0, 0.18),
            0 0 0 7px rgba(196, 162, 98, 0.12),
            0 12px 24px rgba(67, 38, 63, 0.28);
        }

        .progress-dot.current::after {
          top: 6px;
          left: 8px;
          width: 7px;
          height: 7px;
        }

        .progress-line {
          flex: 1 1 auto;
          min-width: 20px;
          height: 2px;
          margin: 0 8px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(196, 162, 98, 0.18),
            rgba(196, 162, 98, 0.28)
          );
          transition: 0.25s ease;
        }

        .progress-line.done {
          background: linear-gradient(
            90deg,
            var(--vv-gold),
            rgba(196, 162, 98, 0.58)
          );
        }

        .question-title {
          margin: 0;
          color: var(--vv-plum);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 3.05vw, 46px);
          line-height: 1.05;
          font-weight: 400;
          letter-spacing: -0.052em;
        }

        .question-title::after {
          content: "";
          display: block;
          width: 54px;
          height: 1px;
          margin: 18px auto 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(196, 162, 98, 0.85),
            transparent
          );
        }

        .question-subtitle {
          margin: 14px auto 0;
          max-width: 410px;
          color: rgba(67, 38, 63, 0.62);
          font-size: 14px;
          line-height: 1.55;
        }

        .step-content {
          margin-top: 22px;
          text-align: left;
        }

        .form-area {
          display: grid;
          gap: 12px;
        }

        .form-area.double {
          gap: 13px;
        }

        .form-area label {
          display: block;
          margin-bottom: 7px;
          color: rgba(67, 38, 63, 0.68);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .form-area input,
        .form-area textarea {
          width: 100%;
          min-height: 52px;
          border: 1px solid rgba(196, 162, 98, 0.38);
          background: rgba(255, 253, 248, 0.74);
          border-radius: 16px;
          padding: 14px 17px;
          color: var(--vv-plum);
          outline: none;
          font-size: 15px;
          box-shadow: 0 10px 22px rgba(67, 38, 63, 0.028);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .form-area textarea {
          min-height: 102px;
          resize: none;
          line-height: 1.5;
        }

        .form-area input::placeholder,
        .form-area textarea::placeholder {
          color: rgba(67, 38, 63, 0.34);
        }

        .form-area input:focus,
        .form-area textarea:focus {
          border-color: var(--brand-primary);
          background: #ffffff;
          box-shadow: 0 12px 26px rgba(67, 38, 63, 0.07);
          transform: translateY(-1px);
        }

        .option-grid,
        .color-grid,
        .section-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .brand-option,
        .color-option,
        .section-option {
          border: 1px solid rgba(196, 162, 98, 0.3);
          background:
            linear-gradient(
              180deg,
              rgba(255, 253, 248, 0.92),
              rgba(255, 249, 239, 0.68)
            );
          color: var(--vv-plum);
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(67, 38, 63, 0.025);
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease,
            background 0.22s ease;
        }

        .brand-option {
          min-height: 76px;
          display: grid;
          grid-template-columns: 62px 1fr;
          align-items: center;
          text-align: left;
          padding: 0 18px 0 14px;
          position: relative;
          overflow: hidden;
        }

        .brand-option::after {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 19px;
          pointer-events: none;
          background: radial-gradient(
            circle at 16% 18%,
            rgba(196, 162, 98, 0.12),
            transparent 35%
          );
          opacity: 0;
          transition: 0.22s ease;
        }

        .style-icon-wrap {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: rgba(255, 253, 248, 0.72);
          border: 1px solid rgba(196, 162, 98, 0.24);
          color: var(--vv-gold);
          position: relative;
          z-index: 2;
        }

        .style-icon-wrap svg {
          width: 31px;
          height: 31px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .style-label {
          position: relative;
          z-index: 2;
        }

        .style-label strong {
          display: block;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 21px;
          line-height: 1;
          font-weight: 400;
          letter-spacing: -0.03em;
          color: rgba(67, 38, 63, 0.82);
        }

        .brand-option:hover,
        .color-option:hover,
        .section-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(67, 38, 63, 0.07);
          border-color: rgba(196, 162, 98, 0.52);
          background: #ffffff;
        }

        .brand-option:hover::after,
        .brand-option.active::after {
          opacity: 1;
        }

        .brand-option.active {
          border-color: rgba(67, 38, 63, 0.72);
          background: #ffffff;
          box-shadow: 0 16px 30px rgba(67, 38, 63, 0.09);
          transform: translateY(-1px);
        }

        .brand-option.active .style-icon-wrap {
          color: var(--vv-gold);
          border-color: rgba(196, 162, 98, 0.55);
          background: rgba(196, 162, 98, 0.09);
        }

        .brand-option.active .style-label strong {
          color: var(--vv-plum);
        }

        .color-option {
          height: 58px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 13px;
        }

        .color-preview {
          display: flex;
          align-items: center;
        }

        .color-preview i {
          width: 25px;
          height: 25px;
          display: block;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.72);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.07);
        }

        .color-preview i + i {
          margin-left: -8px;
        }

        .color-option strong {
          font-size: 13px;
          font-weight: 700;
        }

        .section-option {
          min-height: 52px;
          padding: 9px 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .section-option span {
          font-size: 12px;
          line-height: 1.25;
        }

        .section-option strong {
          font-size: 10px;
          color: var(--vv-gold);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .color-option.active,
        .section-option.active {
          border-color: var(--brand-primary);
          background: #ffffff;
          box-shadow: 0 12px 24px rgba(67, 38, 63, 0.07);
          transform: translateY(-1px);
        }

        .image-options {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 9px;
          margin-bottom: 11px;
        }

        .image-choice {
          overflow: hidden;
          border: 1px solid rgba(196, 162, 98, 0.3);
          background: rgba(255, 253, 248, 0.68);
          border-radius: 15px;
          color: var(--vv-plum);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          padding: 0 0 8px;
          box-shadow: 0 8px 18px rgba(67, 38, 63, 0.018);
        }

        .image-choice.active {
          border-color: var(--brand-primary);
          box-shadow: 0 10px 20px rgba(67, 38, 63, 0.07);
        }

        .image-choice span {
          display: block;
          height: 54px;
          margin-bottom: 7px;
          background-size: cover;
          background-position: center;
        }

        .image-step-area {
          gap: 10px;
        }

        .upload-card {
          border: 1px solid rgba(196, 162, 98, 0.3);
          border-radius: 20px;
          background: rgba(255, 253, 248, 0.68);
          padding: 13px 14px;
          text-align: left;
        }

        .upload-card span {
          display: block;
          color: rgba(67, 38, 63, 0.52);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .upload-card strong {
          display: block;
          color: var(--vv-plum);
          font-size: 13px;
          line-height: 1.35;
          margin-bottom: 10px;
        }

        .upload-card p {
          margin: 9px 0 0;
          color: rgba(67, 38, 63, 0.52);
          font-size: 11.5px;
          line-height: 1.38;
        }

        .upload-only-step {
          max-width: 520px;
          margin: 0 auto;
        }

        .upload-card-hero {
          min-height: 285px;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 34px 28px;
          border-style: dashed;
          border-color: rgba(196, 162, 98, 0.48);
          background:
            radial-gradient(circle at 50% 0%, rgba(196, 162, 98, 0.16), transparent 36%),
            linear-gradient(180deg, rgba(255, 253, 248, 0.94), rgba(255, 249, 239, 0.72));
        }

        .upload-card-hero strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1;
          font-weight: 400;
          letter-spacing: -0.045em;
        }

        .upload-card-hero .upload-lead {
          max-width: 330px;
          margin: 4px auto 0;
          font-size: 14px;
          line-height: 1.55;
        }

        .upload-actions-centered {
          justify-content: center;
          margin-top: 14px;
        }

        .upload-button-large {
          min-height: 52px !important;
          padding: 0 26px !important;
          font-size: 14px !important;
          border-color: rgba(67, 38, 63, 0.24) !important;
          background:
            linear-gradient(135deg, var(--brand-primary), var(--vv-plum-dark)) !important;
          color: #f3dfb4 !important;
        }

        .upload-rules {
          max-width: 360px;
          margin: 8px auto 0 !important;
          color: rgba(67, 38, 63, 0.48) !important;
          font-size: 12px !important;
        }

        .cover-model-step {
          margin-top: 0;
        }


        .upload-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .upload-button {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          margin: 0 !important;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid rgba(67, 38, 63, 0.2);
          background: #ffffff;
          color: var(--vv-plum) !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          letter-spacing: 0.04em !important;
          text-transform: none !important;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(67, 38, 63, 0.05);
        }

        #heroImageFile {
          display: none;
        }


        .layout-block,
        .custom-colors {
          margin-top: 2px;
          border: 1px solid rgba(196, 162, 98, 0.28);
          border-radius: 20px;
          background: rgba(255, 253, 248, 0.58);
          padding: 12px;
        }

        .mini-label {
          display: block;
          margin-bottom: 10px;
          color: rgba(67, 38, 63, 0.58);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .layout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .layout-option {
          min-height: 72px;
          border: 1px solid rgba(196, 162, 98, 0.28);
          border-radius: 17px;
          background: rgba(255, 253, 248, 0.72);
          color: var(--vv-plum);
          cursor: pointer;
          padding: 11px 12px;
          text-align: left;
          transition: 0.22s ease;
        }

        .layout-option strong {
          display: block;
          color: var(--vv-plum);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.05;
          margin-bottom: 5px;
        }

        .layout-option small {
          display: block;
          color: rgba(67, 38, 63, 0.58);
          font-size: 10.5px;
          line-height: 1.28;
        }

        .layout-option:hover,
        .layout-option.active {
          transform: translateY(-1px);
          border-color: rgba(67, 38, 63, 0.65);
          background: #ffffff;
          box-shadow: 0 12px 24px rgba(67, 38, 63, 0.06);
        }

        .example-card {
          border: 1px solid rgba(196, 162, 98, 0.28);
          background: rgba(255, 253, 248, 0.62);
          border-radius: 20px;
          padding: 15px 16px;
          color: rgba(67, 38, 63, 0.68);
          font-size: 13px;
          line-height: 1.55;
        }

        .example-card span {
          display: block;
          margin-bottom: 5px;
          color: rgba(67, 38, 63, 0.5);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .example-card p {
          margin: 0;
        }

        .example-card strong {
          color: var(--vv-plum);
          font-weight: 800;
        }

        .date-stack {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .date-card.soft {
          background: rgba(255, 250, 241, 0.68);
        }

        .site-card {
          border: 1px solid rgba(196, 162, 98, 0.34);
          background:
            linear-gradient(
              180deg,
              rgba(255, 253, 248, 0.88),
              rgba(255, 249, 239, 0.72)
            );
          border-radius: 24px;
          padding: 22px;
          text-align: center;
          box-shadow: 0 14px 28px rgba(67, 38, 63, 0.045);
        }

        .site-card span {
          display: block;
          margin-bottom: 8px;
          color: rgba(67, 38, 63, 0.54);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-weight: 900;
        }

        .site-card strong {
          display: block;
          color: var(--vv-plum);
          font-size: clamp(22px, 2vw, 28px);
          line-height: 1.15;
          word-break: break-word;
        }

        .site-card p {
          margin: 12px auto 0;
          max-width: 420px;
          color: rgba(67, 38, 63, 0.62);
          font-size: 13px;
          line-height: 1.52;
        }

        .site-preview-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          margin-top: 16px;
          padding: 0 18px;
          border-radius: 999px;
          background: rgba(196, 162, 98, 0.14);
          color: var(--vv-plum);
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .color-builder {
          display: grid;
          gap: 13px;
        }

        .color-input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .color-input-row label {
          display: grid;
          grid-template-columns: 1fr 42px;
          align-items: center;
          gap: 10px;
          min-height: 52px;
          border: 1px solid rgba(196, 162, 98, 0.28);
          border-radius: 16px;
          background: rgba(255, 253, 248, 0.76);
          padding: 0 10px 0 13px;
          color: rgba(67, 38, 63, 0.72);
          font-size: 12px;
          font-weight: 800;
        }

        .color-input-row input {
          width: 42px;
          height: 34px;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .custom-colors p {
          margin: 10px 0 0;
          color: rgba(67, 38, 63, 0.54);
          font-size: 12px;
          line-height: 1.45;
        }

        .date-card,
        .review-box {
          border: 1px solid rgba(196, 162, 98, 0.34);
          background: rgba(255, 253, 248, 0.72);
          border-radius: 22px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 10px 24px rgba(67, 38, 63, 0.035);
        }

        .date-card span,
        .review-box span {
          display: block;
          margin-bottom: 7px;
          color: rgba(67, 38, 63, 0.54);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-weight: 800;
        }

        .date-card strong {
          display: block;
          margin-bottom: 9px;
          color: var(--vv-plum);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 26px;
          font-weight: 400;
        }

        .date-card p,
        .review-box p {
          margin: 0;
          color: rgba(67, 38, 63, 0.62);
          font-size: 13px;
          line-height: 1.5;
        }

        .review-box {
          display: grid;
          gap: 12px;
          text-align: left;
        }

        .review-edit-field {
          display: grid;
          gap: 8px;
        }

        .review-edit-field label {
          display: block;
          color: rgba(67, 38, 63, 0.54);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-weight: 800;
        }

        .review-edit-field input {
          width: 100%;
          min-height: 48px;
          border: 1px solid rgba(196, 162, 98, 0.34);
          background: rgba(255, 253, 248, 0.84);
          border-radius: 16px;
          padding: 12px 14px;
          color: var(--vv-plum);
          outline: none;
          font-size: 14px;
        }

        .review-edit-field input:focus {
          border-color: var(--brand-primary);
          background: #ffffff;
          box-shadow: 0 12px 26px rgba(67, 38, 63, 0.07);
        }

        .review-box strong {
          display: block;
          color: var(--vv-plum);
          font-size: 28px;
          line-height: 1.08;
        }

        .message {
          margin-top: 12px;
          padding: 10px 13px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.45;
          text-align: center;
        }

        .message.error {
          background: #fff1f1;
          color: #a63d3d;
        }

        .message.success {
          background: #eff8ef;
          color: #2f7044;
        }

        .bottom-bar {
          position: relative;
          z-index: 20;
          min-height: 104px;
          display: grid;
          justify-items: center;
          gap: 8px;
          padding: 10px 60px 20px;
          background: linear-gradient(180deg, rgba(255, 253, 248, 0.72), #fffdf8 42%);
          border-top: 1px solid rgba(196, 162, 98, 0.16);
        }

        .primary-button {
          width: min(100%, 462px);
          height: 56px;
          border-radius: 18px;
          border: 1px solid rgba(196, 162, 98, 0.22);
          cursor: pointer;
          background:
            linear-gradient(135deg, var(--brand-primary), var(--vv-plum-dark));
          color: #f3dfb4;
          box-shadow:
            0 16px 30px rgba(67, 38, 63, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          font-size: 15px;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .primary-button::after {
          content: "→";
          color: #f3dfb4;
          font-size: 21px;
          line-height: 1;
        }

        .primary-button.full {
          width: 100%;
          margin-top: 4px;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
        }

        .primary-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .secondary-row {
          width: min(100%, 462px);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 13px;
          color: rgba(67, 38, 63, 0.38);
          font-size: 12px;
        }

        .secondary-row::before,
        .secondary-row::after {
          content: "";
          height: 1px;
          background: rgba(196, 162, 98, 0.22);
        }

        .skip-button {
          border: 0;
          background: transparent;
          color: rgba(67, 38, 63, 0.62);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }

        .clean-loading {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--vv-ivory);
          color: var(--vv-plum);
          text-align: center;
          padding: 24px;
        }

        .clean-loading .brand-logo-link {
          width: 310px;
          min-height: 94px;
        }

        .clean-loading .brand-logo-img {
          width: 292px;
          max-height: 94px;
        }

        .clean-loading h1 {
          margin: 22px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 400;
        }

        .clean-loading span {
          display: block;
          margin-top: 12px;
          color: rgba(67, 38, 63, 0.66);
        }

        .clean-loading a {
          display: inline-block;
          margin-top: 22px;
          color: var(--vv-plum);
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 1180px) {
          .vivalista-wizard {
            grid-template-columns: 47% 53%;
          }

          .image-side {
            padding: 18px;
          }

          .image-frame {
            border-radius: 30px;
          }

          .top-bar {
            height: 100px;
            padding: 10px 32px 0;
          }

          .brand-logo-link {
            width: 270px;
            min-height: 78px;
          }

          .brand-logo-img {
            width: 252px;
            max-height: 78px;
          }

          .wizard-content {
            padding: 0 40px;
          }

          .question-title {
            font-size: clamp(31px, 3vw, 40px);
          }

          .progress-line {
            min-width: 24px;
          }

          .brand-option {
            min-height: 70px;
            grid-template-columns: 56px 1fr;
            padding-right: 13px;
          }

          .style-label strong {
            font-size: 19px;
          }
        }

        @media (max-width: 900px) {
          body {
            overflow: auto;
          }

          .vivalista-wizard {
            min-height: 100svh;
            height: auto;
            display: block;
            overflow: visible;
          }

          .image-side {
            height: 29svh;
            min-height: 215px;
            padding: 10px;
            border-radius: 0 0 30px 30px;
          }

          .image-frame {
            border-radius: 26px;
          }

          .form-side {
            height: auto;
            min-height: 71svh;
            overflow: visible;
          }

          .top-bar {
            height: auto;
            grid-template-columns: 48px 1fr 48px;
            padding: 18px 20px 0;
          }

          .back-button {
            width: 40px;
            height: 40px;
            font-size: 24px;
          }

          .brand-logo-link {
            width: 224px;
            min-height: 68px;
          }

          .brand-logo-img {
            width: 210px;
            max-height: 68px;
          }

          .top-link {
            font-size: 0;
            padding: 10px 0;
          }

          .top-link::after {
            content: "Ver";
            font-size: 13px;
          }

          .wizard-content {
            padding: 14px 22px 0;
          }

          .question-box {
            max-width: 680px;
            transform: none;
          }

          .progress-mini {
            max-width: 100%;
            margin-bottom: 22px;
          }

          .progress-line {
            min-width: clamp(18px, 5vw, 42px);
          }

          .question-title {
            font-size: clamp(30px, 8vw, 42px);
          }

          .question-subtitle {
            font-size: 14px;
            max-width: 560px;
          }

          .step-content {
            margin-top: 24px;
          }

          .bottom-bar {
            min-height: auto;
            padding: 22px 22px 30px;
          }

          .primary-button {
            width: 100%;
            height: 58px;
          }

          .secondary-row {
            width: 100%;
          }

          .image-caption {
            display: none;
          }

          .preview-card {
            left: 18px;
            right: 18px;
            bottom: 18px;
            max-width: 360px;
            padding: 18px 19px 17px;
            border-radius: 24px;
          }

          .preview-card::before {
            inset: 10px;
            border-radius: 19px;
          }

  
        .preview-photo {
          display: none;
          width: 82px;
          height: 82px;
          margin: 0 auto 14px;
          border: 4px solid rgba(255, 253, 248, 0.88);
          background-size: cover;
          background-position: center;
          box-shadow: 0 16px 28px rgba(42, 24, 43, 0.18);
        }

        .preview-card.layout-circular,
        .preview-card.layout-oval,
        .preview-card.layout-moldura {
          text-align: center;
          max-width: 390px;
        }

        .preview-card.layout-circular .preview-photo,
        .preview-card.layout-oval .preview-photo,
        .preview-card.layout-moldura .preview-photo {
          display: block;
        }

        .preview-card.layout-circular .preview-photo {
          border-radius: 999px;
        }

        .preview-card.layout-oval .preview-photo {
          width: 76px;
          height: 98px;
          border-radius: 999px 999px 46px 46px;
        }

        .preview-card.layout-moldura .preview-photo {
          width: 96px;
          height: 76px;
          border-radius: 24px;
        }

        .preview-card.layout-tela-cheia {
          background: linear-gradient(
            180deg,
            rgba(42, 24, 43, 0.78),
            rgba(42, 24, 43, 0.56)
          );
          color: #fffdf8;
        }

        .preview-card.layout-tela-cheia small,
        .preview-card.layout-tela-cheia p {
          color: rgba(255, 253, 248, 0.76);
        }

        .preview-card.layout-tela-cheia strong {
          color: #fffdf8;
        }

        .preview-card.layout-tela-cheia strong span {
          color: var(--brand-secondary);
        }

        .preview-card small {
            margin-bottom: 8px;
            font-size: 9px;
          }

          .preview-card strong {
            font-size: 36px;
          }

          .preview-card p {
            margin-top: 9px;
            font-size: 12px;
          }
        }

        @media (max-width: 560px) {
          .image-side {
            height: 27svh;
            min-height: 195px;
            padding: 9px;
          }

          .image-frame {
            border-radius: 23px;
          }

          .top-bar {
            padding: 16px 18px 0;
          }

          .brand-logo-link {
            width: 194px;
            min-height: 60px;
          }

          .brand-logo-img {
            width: 182px;
            max-height: 60px;
          }

          .wizard-content {
            padding: 10px 18px 0;
          }

          .step-eyebrow {
            min-height: 28px;
            padding: 0 12px;
            margin-bottom: 12px;
            font-size: 9.5px;
          }

          .progress-summary {
            margin-bottom: 13px;
            font-size: 11px;
          }

          .progress-dot {
            width: 15px;
            height: 15px;
            border-width: 1.5px;
          }

          .progress-dot.current {
            width: 23px;
            height: 23px;
          }

          .progress-line {
            min-width: clamp(10px, 4vw, 20px);
            margin: 0 5px;
          }

          .question-title {
            font-size: 30px;
          }

          .question-title::after {
            margin-top: 15px;
          }

          .question-subtitle {
            font-size: 13.5px;
          }

          .option-grid,
          .section-list,
          .color-grid {
            gap: 9px;
          }

          .brand-option {
            min-height: 68px;
            grid-template-columns: 48px 1fr;
            padding: 0 11px;
            border-radius: 18px;
          }

          .style-icon-wrap {
            width: 38px;
            height: 38px;
            border-radius: 15px;
          }

          .style-icon-wrap svg {
            width: 27px;
            height: 27px;
          }

          .style-label strong {
            font-size: 17px;
          }

          .section-option {
            min-height: 54px;
            display: grid;
            gap: 2px;
          }

          .section-option strong {
            font-size: 9.5px;
          }

          .image-choice span {
            height: 48px;
          }

          .form-area input,
          .form-area textarea {
            min-height: 49px;
            font-size: 14px;
          }

          .form-area textarea {
            min-height: 88px;
          }

          .date-card strong {
            font-size: 23px;
          }

          .review-box strong {
            font-size: 25px;
          }
        }

        @media (max-height: 760px) and (min-width: 901px) {
          .vivalista-wizard,
          .image-side,
          .form-side {
            min-height: 600px;
          }

          .image-side {
            padding: 16px;
          }

          .top-bar {
            height: 78px;
            padding-top: 6px;
          }

          .brand-logo-link {
            width: 232px;
            min-height: 66px;
          }

          .brand-logo-img {
            width: 216px;
            max-height: 66px;
          }

          .step-eyebrow {
            min-height: 26px;
            margin-bottom: 9px;
            font-size: 9.5px;
          }

          .progress-mini {
            margin-bottom: 16px;
          }

          .progress-summary {
            margin-bottom: 12px;
          }

          .progress-dot {
            width: 17px;
            height: 17px;
          }

          .progress-dot.current {
            width: 24px;
            height: 24px;
          }

          .progress-line {
            min-width: 24px;
          }

          .question-title {
            font-size: 33px;
          }

          .question-title::after {
            margin-top: 14px;
          }

          .question-subtitle {
            margin-top: 9px;
            font-size: 13.5px;
          }

          .step-content {
            margin-top: 18px;
          }

          .brand-option {
            min-height: 62px;
          }

          .style-icon-wrap {
            width: 38px;
            height: 38px;
            border-radius: 15px;
          }

          .style-icon-wrap svg {
            width: 26px;
            height: 26px;
          }

          .style-label strong {
            font-size: 18px;
          }

          .bottom-bar {
            min-height: 82px;
            padding-bottom: 14px;
          }

          .primary-button {
            height: 52px;
          }
        }



        @media (max-width: 720px) {
          .date-stack,
          .layout-grid,
          .color-input-row {
            grid-template-columns: 1fr;
          }

          .layout-option {
            min-height: auto;
          }

          .site-card strong {
            font-size: 20px;
          }
        }



        /* ===== ETAPA 2 — CAPAS, ESTILO E TIPOGRAFIA 9/10 ===== */
        .field-help {
          margin: -4px 0 12px;
          color: rgba(67, 38, 63, 0.56);
          font-size: 12px;
          line-height: 1.45;
        }

        .layout-grid-expanded {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-height: 246px;
          overflow: auto;
          padding-right: 3px;
          scrollbar-width: thin;
        }

        .style-grid {
          grid-template-columns: 1fr 1fr;
        }

        .style-option {
          min-height: 104px;
          align-items: flex-start;
          padding-top: 16px;
          padding-bottom: 14px;
        }

        .style-label small {
          display: block;
          margin-top: 7px;
          color: rgba(67, 38, 63, 0.54);
          font-size: 11px;
          line-height: 1.35;
          letter-spacing: 0;
        }

        .typography-builder {
          display: grid;
          gap: 14px;
        }

        .font-preview-card {
          border: 1px solid rgba(196, 162, 98, 0.34);
          background:
            radial-gradient(circle at 12% 20%, rgba(196, 162, 98, 0.16), transparent 30%),
            linear-gradient(180deg, rgba(255, 253, 248, 0.92), rgba(255, 249, 239, 0.76));
          border-radius: 24px;
          padding: 18px;
          text-align: center;
          box-shadow: 0 14px 28px rgba(67, 38, 63, 0.045);
        }

        .font-preview-card span {
          display: block;
          margin-bottom: 10px;
          color: rgba(67, 38, 63, 0.5);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .font-preview-card strong {
          display: block;
          color: var(--brand-primary);
          line-height: 0.95;
        }

        .font-preview-card p {
          max-width: 460px;
          margin: 12px auto 0;
          color: rgba(67, 38, 63, 0.62);
          font-size: 13px;
          line-height: 1.55;
        }

        .font-browser {
          display: grid;
          gap: 13px;
          max-height: 284px;
          overflow: auto;
          padding-right: 3px;
          scrollbar-width: thin;
        }

        .font-category {
          display: grid;
          gap: 9px;
        }

        .font-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .font-card {
          min-height: 74px;
          border: 1px solid rgba(196, 162, 98, 0.28);
          border-radius: 17px;
          background: rgba(255, 253, 248, 0.74);
          color: var(--vv-plum);
          cursor: pointer;
          padding: 11px 12px;
          text-align: left;
          transition: 0.22s ease;
        }

        .font-card strong {
          display: block;
          color: rgba(67, 38, 63, 0.88);
          font-size: 24px;
          line-height: 1.02;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .font-card span {
          display: block;
          margin-top: 7px;
          color: rgba(67, 38, 63, 0.48);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .font-card:hover,
        .font-card.active {
          transform: translateY(-1px);
          border-color: rgba(67, 38, 63, 0.65);
          background: #ffffff;
          box-shadow: 0 12px 24px rgba(67, 38, 63, 0.06);
        }

        .type-controls {
          display: grid;
          gap: 12px;
          border: 1px solid rgba(196, 162, 98, 0.28);
          border-radius: 22px;
          background: rgba(255, 253, 248, 0.62);
          padding: 13px;
        }

        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip-button {
          min-height: 36px;
          border: 1px solid rgba(196, 162, 98, 0.28);
          border-radius: 999px;
          background: rgba(255, 253, 248, 0.84);
          color: rgba(67, 38, 63, 0.72);
          cursor: pointer;
          padding: 0 13px;
          font-size: 12px;
          font-weight: 850;
          transition: 0.2s ease;
        }

        .chip-button:hover,
        .chip-button.active {
          transform: translateY(-1px);
          border-color: var(--brand-primary);
          background: #ffffff;
          color: var(--brand-primary);
          box-shadow: 0 10px 20px rgba(67, 38, 63, 0.05);
        }

        .font-serif-set,
        .font-editorial-classic,
        .font-empire-serif,
        .font-roman-elegance,
        .font-classical,
        .font-beaumont,
        .font-poise-serif {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          letter-spacing: -0.045em;
        }

        .font-empire-serif,
        .font-classical {
          font-weight: 600;
          letter-spacing: -0.035em;
        }

        .font-roman-elegance {
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .font-beaumont {
          font-stretch: condensed;
          letter-spacing: -0.06em;
        }

        .font-modern-set,
        .font-viva-sans,
        .font-studio-modern,
        .font-urban-clean,
        .font-contour {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 800;
          letter-spacing: -0.055em;
        }

        .font-urban-clean,
        .font-viva-sans {
          font-weight: 500;
          letter-spacing: -0.035em;
        }

        .font-contour {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 900;
        }

        .font-typewriter {
          font-family: "Courier New", Courier, monospace;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .font-script,
        .font-handmade,
        .font-serenata-script,
        .font-champagne-script,
        .font-chandelier,
        .font-wellington,
        .font-sacramento,
        .font-love-note,
        .font-soft-signature,
        .font-sunkissed,
        .font-beautiful-script {
          font-family: "Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive;
          font-weight: 400;
          letter-spacing: -0.04em;
        }

        .font-champagne-script,
        .font-wellington,
        .font-sacramento {
          letter-spacing: -0.015em;
          font-style: italic;
        }

        .font-handmade,
        .font-love-note,
        .font-soft-signature,
        .font-sunkissed,
        .font-beautiful-script {
          font-family: "Segoe Print", "Comic Sans MS", cursive;
          font-weight: 500;
          letter-spacing: -0.05em;
        }

        .font-fun,
        .font-honey,
        .font-bubble,
        .font-peace-love,
        .font-papercute {
          font-family: "Trebuchet MS", Arial, sans-serif;
          font-weight: 900;
          letter-spacing: -0.055em;
        }

        .font-bubble {
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .font-papercute {
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .title-size-delicado {
          font-size: clamp(42px, 4.8vw, 74px) !important;
        }

        .title-size-medio {
          font-size: clamp(50px, 5.5vw, 88px) !important;
        }

        .title-size-grande {
          font-size: clamp(58px, 6.4vw, 104px) !important;
        }

        .title-size-impactante {
          font-size: clamp(66px, 7.5vw, 126px) !important;
        }

        .body-density-compacto {
          font-size: 13px !important;
          line-height: 1.42 !important;
        }

        .body-density-padrao {
          font-size: 15px !important;
          line-height: 1.55 !important;
        }

        .body-density-confortavel {
          font-size: 16px !important;
          line-height: 1.72 !important;
        }

        .image-frame.layout-meio-a-meio {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #fffdf8;
        }

        .image-frame.layout-meio-a-meio .image-side-image {
          position: relative;
          inset: auto;
          min-height: 100%;
          opacity: 1;
          filter: saturate(0.94) contrast(1.02);
        }

        .image-frame.layout-meio-a-meio::after {
          display: none;
        }

        .image-frame.layout-meio-a-meio .site-preview-content {
          width: auto;
          color: var(--vv-plum);
          text-shadow: none;
          align-self: center;
          padding: 32px;
        }

        .image-frame.layout-meio-a-meio .site-preview-content small,
        .image-frame.layout-meio-a-meio .site-preview-content p {
          color: rgba(67, 38, 63, 0.58);
        }

        .image-frame.layout-meio-a-meio .preview-meta {
          background: rgba(196, 162, 98, 0.12);
          border-color: rgba(196, 162, 98, 0.2);
          color: rgba(67, 38, 63, 0.66);
        }

        .image-frame.layout-cinematografica .image-side-image {
          filter: saturate(0.75) contrast(1.12) brightness(0.62);
        }

        .image-frame.layout-cinematografica::after {
          background:
            radial-gradient(circle at 50% 40%, rgba(196, 162, 98, 0.14), transparent 35%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.72));
        }

        .image-frame.layout-foto-moldura,
        .image-frame.layout-monograma-clean,
        .image-frame.layout-convite-luxo,
        .image-frame.layout-editorial-cartao {
          background:
            radial-gradient(circle at 50% 22%, rgba(196, 162, 98, 0.16), transparent 34%),
            linear-gradient(135deg, #fffdf8 0%, #f4eadc 100%);
          flex-direction: column;
          gap: 20px;
        }

        .image-frame.layout-foto-moldura .image-side-image,
        .image-frame.layout-monograma-clean .image-side-image,
        .image-frame.layout-convite-luxo .image-side-image,
        .image-frame.layout-editorial-cartao .image-side-image {
          opacity: 0.12;
          filter: blur(8px) saturate(0.86);
          transform: scale(1.08);
        }

        .image-frame.layout-foto-moldura::after,
        .image-frame.layout-monograma-clean::after,
        .image-frame.layout-convite-luxo::after,
        .image-frame.layout-editorial-cartao::after {
          background: linear-gradient(180deg, rgba(255, 253, 248, 0.58), rgba(255, 253, 248, 0.9));
        }

        .image-frame.layout-foto-moldura .preview-photo-large,
        .image-frame.layout-convite-luxo .preview-photo-large,
        .image-frame.layout-editorial-cartao .preview-photo-large {
          display: block;
          width: min(48vw, 360px);
          height: min(34vw, 260px);
          border-radius: 28px;
          margin-top: 28px;
        }

        .image-frame.layout-monograma-clean .preview-photo-large {
          display: none;
        }

        .image-frame.layout-foto-moldura .site-preview-content,
        .image-frame.layout-monograma-clean .site-preview-content,
        .image-frame.layout-convite-luxo .site-preview-content,
        .image-frame.layout-editorial-cartao .site-preview-content {
          color: var(--vv-plum);
          text-shadow: none;
        }

        .image-frame.layout-foto-moldura .site-preview-content small,
        .image-frame.layout-monograma-clean .site-preview-content small,
        .image-frame.layout-convite-luxo .site-preview-content small,
        .image-frame.layout-editorial-cartao .site-preview-content small {
          color: rgba(67, 38, 63, 0.48);
        }

        .image-frame.layout-foto-moldura .site-preview-content p,
        .image-frame.layout-monograma-clean .site-preview-content p,
        .image-frame.layout-convite-luxo .site-preview-content p,
        .image-frame.layout-editorial-cartao .site-preview-content p {
          color: rgba(67, 38, 63, 0.62);
        }

        /* ===== VISUAL BUILDER PREMIUM V2 — POLIMENTO SEGURO ===== */
        .vivalista-wizard {
          grid-template-columns: minmax(430px, 51%) minmax(0, 49%);
          background:
            radial-gradient(circle at 12% 9%, rgba(196, 162, 98, 0.18), transparent 31%),
            radial-gradient(circle at 92% 12%, rgba(67, 38, 63, 0.12), transparent 29%),
            linear-gradient(135deg, #fffdf8 0%, #f7efe4 46%, #efe3d5 100%);
        }

        .image-side {
          padding: 18px;
          background:
            radial-gradient(circle at 0% 100%, rgba(196, 162, 98, 0.18), transparent 34%),
            #eee3d3;
        }

        .image-frame {
          border-radius: 38px;
          box-shadow:
            0 34px 100px rgba(42, 24, 43, 0.18),
            inset 0 0 0 1px rgba(255, 255, 255, 0.28);
        }

        .form-side {
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.92), transparent 34%),
            radial-gradient(circle at 100% 0%, rgba(196, 162, 98, 0.14), transparent 28%);
        }

        .top-bar {
          height: 104px;
          grid-template-columns: 52px 1fr 92px;
          padding: 10px 46px 0;
        }

        .brand-logo-link {
          width: min(310px, calc(100vw - 190px));
          min-height: 86px;
        }

        .brand-logo-img {
          width: min(292px, calc(100vw - 210px));
          max-height: 86px;
          object-fit: contain;
          filter: drop-shadow(0 14px 24px rgba(67, 38, 63, 0.12));
        }

        .back-button {
          background: rgba(255, 253, 248, 0.74);
          box-shadow: 0 12px 28px rgba(67, 38, 63, 0.07);
        }

        .top-link {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(196, 162, 98, 0.22);
          background: rgba(255, 253, 248, 0.54);
          box-shadow: 0 10px 26px rgba(67, 38, 63, 0.04);
        }

        .wizard-content {
          padding: 0 clamp(34px, 4.4vw, 66px) 22px;
          scrollbar-color: rgba(67, 38, 63, 0.32) rgba(196, 162, 98, 0.12);
        }

        .question-box {
          max-width: 690px;
        }

        .progress-mini {
          margin-bottom: 22px;
          border: 1px solid rgba(196, 162, 98, 0.18);
          border-radius: 28px;
          background: rgba(255, 253, 248, 0.52);
          box-shadow: 0 18px 46px rgba(67, 38, 63, 0.055);
          padding: 14px 16px 16px;
          backdrop-filter: blur(14px);
        }

        .progress-dots {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .progress-summary {
          margin-bottom: 13px;
        }

        .step-eyebrow {
          margin-bottom: 10px;
          background: rgba(255, 253, 248, 0.7);
          box-shadow: 0 10px 24px rgba(67, 38, 63, 0.04);
        }

        .question-title {
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
        }

        .question-subtitle {
          max-width: 500px;
        }

        .step-content {
          margin-top: 20px;
        }

        .brand-option,
        .color-option,
        .section-option,
        .layout-option,
        .font-card,
        .upload-card,
        .custom-colors,
        .layout-block,
        .font-preview-card,
        .type-controls,
        .review-box {
          border-color: rgba(196, 162, 98, 0.26);
          box-shadow: 0 16px 42px rgba(67, 38, 63, 0.045);
        }

        .brand-option.active,
        .color-option.active,
        .section-option.active,
        .layout-option.active,
        .font-card.active {
          box-shadow:
            0 18px 44px rgba(67, 38, 63, 0.08),
            0 0 0 4px rgba(196, 162, 98, 0.08);
        }

        .image-step-area {
          grid-template-columns: 1fr;
        }

        .message-step-area {
          gap: 11px;
        }

        .ai-message-card {
          border: 1px solid rgba(196, 162, 98, 0.28);
          border-radius: 24px;
          background:
            radial-gradient(circle at 100% 0%, rgba(196, 162, 98, 0.18), transparent 34%),
            linear-gradient(135deg, rgba(255, 253, 248, 0.94), rgba(246, 236, 255, 0.52));
          box-shadow: 0 18px 42px rgba(67, 38, 63, 0.06);
          padding: 17px;
        }

        .ai-message-card span {
          display: block;
          color: rgba(196, 162, 98, 0.96);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .ai-message-card strong {
          display: block;
          margin-top: 6px;
          color: var(--vv-plum);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 400;
          line-height: 1.06;
          letter-spacing: -0.035em;
        }

        .ai-message-card p {
          margin: 8px 0 12px;
          color: rgba(67, 38, 63, 0.62);
          font-size: 12.5px;
          line-height: 1.48;
        }

        .ai-message-button {
          min-height: 42px;
          border: 1px solid rgba(67, 38, 63, 0.18);
          border-radius: 999px;
          background:
            radial-gradient(circle at 20% 0%, rgba(196, 162, 98, 0.34), transparent 28%),
            linear-gradient(135deg, var(--brand-primary), var(--vv-plum-dark));
          color: #f8e7bd;
          box-shadow: 0 16px 34px rgba(67, 38, 63, 0.18);
          padding: 0 16px;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .ai-message-button:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .premium-review-box {
          border-radius: 28px;
          background:
            radial-gradient(circle at 0% 0%, rgba(196, 162, 98, 0.16), transparent 32%),
            linear-gradient(180deg, rgba(255, 253, 248, 0.96), rgba(255, 249, 239, 0.78));
        }

        .bottom-bar {
          min-height: 104px;
          background:
            linear-gradient(180deg, rgba(255, 253, 248, 0.62), rgba(255, 253, 248, 0.98) 42%),
            radial-gradient(circle at 50% 0%, rgba(196, 162, 98, 0.14), transparent 34%);
          box-shadow: 0 -18px 46px rgba(67, 38, 63, 0.08);
        }

        .primary-button {
          border-radius: 999px;
          background:
            radial-gradient(circle at 20% 0%, rgba(196, 162, 98, 0.32), transparent 28%),
            linear-gradient(135deg, var(--brand-primary), var(--vv-plum-dark) 62%, #9b773d 100%);
        }

        @media (max-width: 1180px) {
          .top-bar {
            height: 96px;
            padding: 8px 32px 0;
          }

          .brand-logo-link {
            width: min(270px, calc(100vw - 160px));
            min-height: 76px;
          }

          .brand-logo-img {
            width: min(252px, calc(100vw - 180px));
            max-height: 76px;
          }
        }

        @media (max-width: 900px) {
          .top-bar {
            grid-template-columns: 48px 1fr 48px;
            height: auto;
            padding: 16px 20px 0;
          }

          .brand-logo-link {
            width: min(236px, calc(100vw - 118px));
            min-height: 66px;
          }

          .brand-logo-img {
            width: min(220px, calc(100vw - 136px));
            max-height: 66px;
          }

          .wizard-content {
            padding: 12px 20px 0;
          }

          .progress-mini {
            padding: 12px 13px 14px;
            border-radius: 24px;
          }

          .image-side {
            padding: 9px;
          }
        }

        @media (max-width: 560px) {
          .brand-logo-link {
            width: min(206px, calc(100vw - 106px));
            min-height: 60px;
          }

          .brand-logo-img {
            width: min(194px, calc(100vw - 122px));
            max-height: 60px;
          }

          .option-grid,
          .section-list,
          .color-grid,
          .font-grid,
          .image-options {
            grid-template-columns: 1fr;
          }

          .progress-mini {
            margin-bottom: 18px;
          }
        }



        /* ===== V3.2 — TOPO E RODAPÉ CONGELADOS IGUAL EVENTO NOVO ===== */
        @media (min-width: 901px) {
          .form-side {
            height: 100svh;
            min-height: 640px;
            display: grid;
            grid-template-rows: auto minmax(0, 1fr) auto;
            overflow: hidden;
          }

          .compact-fixed-head {
            position: relative;
            z-index: 30;
            flex: 0 0 auto;
            padding: 8px clamp(32px, 4.2vw, 58px) 12px;
            border-bottom: 1px solid rgba(196, 162, 98, 0.16);
            background:
              linear-gradient(180deg, rgba(255, 253, 248, 0.92), rgba(255, 253, 248, 0.74)),
              radial-gradient(circle at 8% 0%, rgba(196, 162, 98, 0.14), transparent 34%);
            box-shadow: 0 16px 42px rgba(67, 38, 63, 0.06);
            backdrop-filter: blur(18px);
          }

          .compact-progress-row {
            display: grid;
            grid-template-columns: 320px minmax(0, 1fr);
            align-items: center;
            gap: 18px;
            margin-bottom: 4px;
          }

          .compact-progress-row .brand-logo-link {
            justify-self: start;
            width: 320px;
            min-height: 76px;
            display: inline-flex;
            align-items: center;
            justify-content: flex-start;
            overflow: hidden;
          }

          .compact-progress-row .brand-logo-img {
            width: auto;
            height: 72px;
            max-width: 320px;
            max-height: none;
            object-fit: contain;
            object-position: left center;
            transform: translateX(-5px) scale(1.08);
            transform-origin: left center;
            filter: drop-shadow(0 12px 20px rgba(67, 38, 63, 0.12));
          }

          .compact-fixed-head .progress-mini {
            width: min(100%, 560px);
            margin: 0;
            border: 1px solid rgba(196, 162, 98, 0.18);
            border-radius: 24px;
            background: rgba(255, 253, 248, 0.58);
            box-shadow: 0 14px 34px rgba(67, 38, 63, 0.045);
            padding: 10px 13px 12px;
            backdrop-filter: blur(14px);
          }

          .compact-fixed-head .progress-summary {
            margin-bottom: 8px;
            font-size: 12px;
          }

          .compact-fixed-head .progress-dot {
            width: 17px;
            height: 17px;
          }

          .compact-fixed-head .progress-dot.current {
            width: 25px;
            height: 25px;
          }

          .compact-fixed-head .progress-line {
            min-width: 18px;
            margin: 0 7px;
          }

          .compact-fixed-head .step-eyebrow {
            min-height: 25px;
            margin: 6px auto 7px;
            padding: 0 13px;
            font-size: 9px;
            background: rgba(255, 253, 248, 0.72);
          }

          .compact-fixed-head .question-title {
            max-width: 660px;
            margin: 0 auto;
            font-size: clamp(27px, 2.3vw, 37px);
            line-height: 1.02;
          }

          .compact-fixed-head .question-title::after {
            width: 48px;
            margin-top: 10px;
          }

          .compact-fixed-head .question-subtitle {
            max-width: 590px;
            margin-top: 8px;
            font-size: 13px;
            line-height: 1.42;
          }

          .wizard-content {
            min-height: 0;
            height: auto;
            display: block;
            padding: 18px clamp(34px, 4.2vw, 58px) 20px;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: thin;
            scrollbar-color: rgba(67, 38, 63, 0.28) rgba(196, 162, 98, 0.12);
          }

          .question-box {
            max-width: 690px;
            margin: 0 auto;
            text-align: center;
            padding-bottom: 8px;
          }

          .step-content {
            margin-top: 0;
            text-align: left;
          }

          .bottom-actions-bar {
            position: relative;
            z-index: 30;
            min-height: 82px;
            display: grid;
            grid-template-columns: minmax(140px, 0.7fr) minmax(120px, 0.7fr) minmax(230px, 1.1fr);
            align-items: center;
            gap: 12px;
            padding: 12px clamp(32px, 4.2vw, 58px) 14px;
            border-top: 1px solid rgba(196, 162, 98, 0.2);
            background:
              linear-gradient(180deg, rgba(255, 253, 248, 0.76), #fffdf8 48%),
              radial-gradient(circle at 50% 0%, rgba(196, 162, 98, 0.13), transparent 34%);
            box-shadow: 0 -18px 46px rgba(67, 38, 63, 0.08);
            backdrop-filter: blur(18px);
          }

          .secondary-button,
          .compact-primary-button {
            min-height: 52px;
            border-radius: 999px;
            padding: 0 24px;
            font-size: 14px;
            font-weight: 900;
            cursor: pointer;
            transition: 0.22s ease;
          }

          .secondary-button {
            justify-self: start;
            border: 1px solid rgba(67, 38, 63, 0.13);
            background: rgba(255, 255, 255, 0.86);
            color: var(--vv-plum);
            box-shadow: 0 12px 28px rgba(67, 38, 63, 0.05);
          }

          .compact-primary-button {
            justify-self: end;
            width: min(100%, 380px);
            border: 1px solid rgba(196, 162, 98, 0.22);
            background:
              radial-gradient(circle at 20% 0%, rgba(196, 162, 98, 0.32), transparent 28%),
              linear-gradient(135deg, var(--brand-primary), var(--vv-plum-dark) 62%, #9b773d 100%);
            color: #f8e7bd;
            box-shadow: 0 18px 38px rgba(67, 38, 63, 0.2);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .compact-primary-button::after {
            content: "→";
            color: #f8e7bd;
            font-size: 18px;
            line-height: 1;
          }

          .secondary-button:hover,
          .compact-primary-button:hover {
            transform: translateY(-2px);
          }

          .secondary-button:disabled,
          .compact-primary-button:disabled {
            opacity: 0.48;
            cursor: not-allowed;
            transform: none;
          }

          .bottom-center-actions {
            justify-self: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 38px;
          }

          .compact-skip-button,
          .compact-site-link {
            border: 0;
            background: transparent;
            color: rgba(67, 38, 63, 0.62);
            cursor: pointer;
            font-size: 13px;
            font-weight: 800;
            text-decoration: none;
          }

          .compact-skip-button:hover,
          .compact-site-link:hover {
            color: var(--vv-plum);
            text-decoration: underline;
            text-underline-offset: 4px;
          }
        }

        @media (max-height: 760px) and (min-width: 901px) {
          .compact-progress-row {
            grid-template-columns: 280px minmax(0, 1fr);
            gap: 14px;
          }

          .compact-progress-row .brand-logo-link {
            width: 280px;
            min-height: 64px;
          }

          .compact-progress-row .brand-logo-img {
            height: 62px;
            max-width: 280px;
          }

          .compact-fixed-head {
            padding-top: 5px;
            padding-bottom: 8px;
          }

          .compact-fixed-head .progress-mini {
            padding: 8px 12px 10px;
          }

          .compact-fixed-head .question-title {
            font-size: 29px;
          }

          .compact-fixed-head .question-subtitle {
            font-size: 12.5px;
          }

          .bottom-actions-bar {
            min-height: 72px;
            padding-top: 9px;
            padding-bottom: 9px;
          }

          .secondary-button,
          .compact-primary-button {
            min-height: 48px;
          }
        }

        @media (max-width: 900px) {
          .compact-fixed-head {
            padding: 14px 20px 12px;
            border-bottom: 1px solid rgba(196, 162, 98, 0.16);
            background: rgba(255, 253, 248, 0.88);
          }

          .compact-progress-row {
            display: grid;
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 10px;
          }

          .compact-progress-row .brand-logo-link {
            width: min(236px, calc(100vw - 118px));
            min-height: 66px;
          }

          .compact-progress-row .brand-logo-img {
            width: min(220px, calc(100vw - 136px));
            max-height: 66px;
          }

          .wizard-content {
            padding-top: 18px;
          }

          .bottom-actions-bar {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 14px 22px 30px;
          }

          .secondary-button,
          .compact-primary-button {
            width: 100%;
            min-height: 54px;
            border-radius: 999px;
          }

          .bottom-center-actions {
            order: 3;
            justify-self: center;
          }
        }


        /* ===== V4 — PREVIA DO SITE COMPLETO E CONTROLES MAIS SEGUROS ===== */
        .image-caption,
        .compact-fixed-head .step-eyebrow {
          display: none;
        }

        .image-side {
          background: linear-gradient(135deg, #f6efe4 0%, #eadfce 100%);
        }

        .full-site-preview {
          position: relative;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 34px;
          background: #fffdf8;
          box-shadow: 0 24px 58px rgba(42, 24, 43, 0.15);
          scrollbar-width: thin;
          scrollbar-color: rgba(67, 38, 63, 0.28) rgba(196, 162, 98, 0.12);
        }

        .mini-hero-preview {
          position: relative;
          min-height: 74%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--brand-secondary), transparent 78%), transparent 32%),
            linear-gradient(135deg, #fffdf8 0%, #f4eadc 100%);
          isolation: isolate;
        }

        .visual-photo-layer,
        .visual-photo-shape {
          background-image: inherit;
          background-repeat: no-repeat;
          background-size: var(--photo-size, contain);
          background-position: var(--photo-position, center);
        }

        .visual-photo-layer {
          position: absolute;
          inset: 0;
          z-index: -2;
          background-color: color-mix(in srgb, var(--brand-primary), #ffffff 84%);
          filter: saturate(0.96) contrast(1.02);
        }

        .visual-photo-layer::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(42, 24, 43, 0.12), rgba(42, 24, 43, 0.42)),
            radial-gradient(circle at 50% 50%, transparent 0 46%, rgba(42, 24, 43, 0.18) 100%);
        }

        .visual-photo-shape {
          display: none;
          position: relative;
          z-index: 1;
          background-color: #f4eadc;
          border: 8px solid rgba(255, 253, 248, 0.9);
          box-shadow: 0 24px 54px rgba(42, 24, 43, 0.22);
        }

        .full-site-preview.layout-circular .visual-photo-layer,
        .full-site-preview.layout-oval .visual-photo-layer,
        .full-site-preview.layout-foto-moldura .visual-photo-layer,
        .full-site-preview.layout-editorial-cartao .visual-photo-layer,
        .full-site-preview.layout-convite-luxo .visual-photo-layer,
        .full-site-preview.layout-monograma-clean .visual-photo-layer {
          opacity: 0.16;
          filter: blur(10px) saturate(0.9);
          transform: scale(1.06);
        }

        .full-site-preview.layout-circular .visual-photo-shape,
        .full-site-preview.layout-oval .visual-photo-shape,
        .full-site-preview.layout-foto-moldura .visual-photo-shape,
        .full-site-preview.layout-editorial-cartao .visual-photo-shape,
        .full-site-preview.layout-convite-luxo .visual-photo-shape {
          display: block;
        }

        .full-site-preview.layout-circular .visual-photo-shape {
          width: min(42vw, 310px);
          height: min(42vw, 310px);
          border-radius: 999px;
        }

        .full-site-preview.layout-oval .visual-photo-shape {
          width: min(36vw, 260px);
          height: min(46vw, 350px);
          border-radius: 999px 999px 44% 44%;
        }

        .full-site-preview.layout-foto-moldura .visual-photo-shape,
        .full-site-preview.layout-editorial-cartao .visual-photo-shape,
        .full-site-preview.layout-convite-luxo .visual-photo-shape {
          width: min(46vw, 350px);
          height: min(32vw, 245px);
          border-radius: 28px;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-preview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #fffdf8;
        }

        .full-site-preview.layout-meio-a-meio .visual-photo-layer {
          position: relative;
          z-index: 1;
          min-height: 100%;
          opacity: 1;
          filter: none;
        }

        .full-site-preview.layout-cinematografica .visual-photo-layer {
          filter: saturate(0.78) contrast(1.12) brightness(0.62);
        }

        .mini-hero-copy {
          position: absolute;
          z-index: 4;
          width: min(78%, 560px);
          padding: 24px;
          border-radius: 30px;
          background: linear-gradient(180deg, rgba(42, 24, 43, 0.66), rgba(42, 24, 43, 0.42));
          border: 1px solid rgba(255, 253, 248, 0.18);
          color: #fffdf8;
          text-shadow: 0 12px 34px rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(12px);
        }

        .full-site-preview.layout-circular .mini-hero-copy,
        .full-site-preview.layout-oval .mini-hero-copy,
        .full-site-preview.layout-foto-moldura .mini-hero-copy,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy,
        .full-site-preview.layout-convite-luxo .mini-hero-copy,
        .full-site-preview.layout-monograma-clean .mini-hero-copy,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy {
          background: rgba(255, 253, 248, 0.78);
          border-color: rgba(196, 162, 98, 0.28);
          color: var(--brand-primary);
          text-shadow: none;
          box-shadow: 0 22px 54px rgba(42, 24, 43, 0.12);
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy {
          position: relative;
          inset: auto;
          width: auto;
          margin: 34px;
          align-self: center;
        }

        .mini-hero-copy.place-top {
          top: 34px;
        }

        .mini-hero-copy.place-middle {
          top: 50%;
          transform: translateY(-50%);
        }

        .mini-hero-copy.place-bottom {
          bottom: 34px;
        }

        .mini-hero-copy.align-left {
          left: 34px;
          text-align: left;
        }

        .mini-hero-copy.align-center {
          left: 50%;
          text-align: center;
          transform: translateX(-50%);
        }

        .mini-hero-copy.align-center.place-middle {
          transform: translate(-50%, -50%);
        }

        .mini-hero-copy.align-right {
          right: 34px;
          text-align: right;
        }

        .mini-hero-copy small {
          display: block;
          margin-bottom: 12px;
          color: color-mix(in srgb, var(--brand-secondary), #fffdf8 24%);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .mini-hero-copy strong {
          display: block;
          line-height: 0.9;
          font-weight: 400;
          letter-spacing: -0.075em;
        }

        .mini-hero-copy strong span,
        .mini-site-section span,
        .mini-site-card span {
          color: var(--brand-secondary);
        }

        .mini-hero-copy p {
          margin: 16px 0 0;
          color: currentColor;
          opacity: 0.78;
          font-size: 14px;
          line-height: 1.55;
        }

        .mini-site-section,
        .mini-site-card {
          margin: 18px;
          border: 1px solid rgba(196, 162, 98, 0.22);
          border-radius: 28px;
          background: rgba(255, 253, 248, 0.82);
          color: var(--brand-primary);
          box-shadow: 0 16px 36px rgba(42, 24, 43, 0.06);
        }

        .mini-site-section {
          padding: 22px;
          text-align: center;
        }

        .mini-site-section span,
        .mini-site-card span {
          display: block;
          margin-bottom: 10px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .countdown-preview div {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 14px auto;
          max-width: 360px;
        }

        .countdown-preview strong {
          display: grid;
          min-height: 72px;
          place-items: center;
          border-radius: 22px;
          background: color-mix(in srgb, var(--brand-secondary), #fffdf8 84%);
          color: var(--brand-primary);
          font-size: 32px;
        }

        .message-preview h3 {
          margin: 0 auto;
          max-width: 480px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          line-height: 1.18;
          font-weight: 400;
        }

        .gallery-preview div {
          display: grid;
          grid-template-columns: 1.1fr 0.8fr 1fr;
          gap: 10px;
        }

        .gallery-preview i {
          display: block;
          min-height: 120px;
          border-radius: 24px;
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #ffffff 74%), color-mix(in srgb, var(--brand-secondary), #ffffff 70%));
        }

        .mini-site-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin: 0 18px 22px;
        }

        .mini-site-card {
          margin: 0;
          padding: 18px;
          min-height: 118px;
        }

        .mini-site-card strong {
          display: block;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 400;
          line-height: 1.12;
        }

        .accent-card {
          background: linear-gradient(135deg, var(--brand-primary), #2a182b);
          color: #fffdf8;
        }

        .compact-fixed-head {
          background: linear-gradient(180deg, rgba(255, 253, 248, 0.96), rgba(255, 253, 248, 0.84));
        }

        .compact-fixed-head .progress-mini {
          border: 0;
          background: transparent;
          box-shadow: none;
          padding: 0;
          backdrop-filter: none;
        }

        .compact-fixed-head .progress-summary span,
        .compact-fixed-head .progress-summary strong {
          min-height: 30px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          border: 1px solid rgba(196, 162, 98, 0.18);
          background: rgba(255, 253, 248, 0.72);
          padding: 0 12px;
        }

        .photo-adjust-card,
        .text-position-card {
          border: 1px solid rgba(196, 162, 98, 0.28);
          border-radius: 22px;
          background: rgba(255, 253, 248, 0.68);
          padding: 14px;
        }

        .photo-adjust-card p {
          margin: -4px 0 12px;
          color: rgba(67, 38, 63, 0.56);
          font-size: 12px;
          line-height: 1.45;
        }

        .photo-fit-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .photo-range-grid,
        .text-position-card {
          display: grid;
          gap: 12px;
        }

        .photo-range-grid label {
          display: grid;
          gap: 7px;
          color: rgba(67, 38, 63, 0.62);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .photo-range-grid input[type="range"] {
          width: 100%;
          accent-color: var(--brand-primary);
        }

        @media (max-width: 900px) {
          .full-site-preview {
            border-radius: 26px;
          }

          .mini-hero-preview {
            min-height: 68svh;
          }

          .mini-site-grid {
            grid-template-columns: 1fr;
          }

          .gallery-preview div {
            grid-template-columns: 1fr;
          }

          .gallery-preview i {
            min-height: 92px;
          }
        }


        /* ===== V4.1 — MOTOR DE CAPAS COM FOTO E TEXTO EM ÁREAS SEGURAS =====
           Objetivo: cada modelo de capa tem composição própria. A foto não fica
           escondida atrás do texto, e os modelos circular/oval/moldura separam
           imagem e escrita como referências premium de sites grandes. */

        .mini-hero-preview {
          min-height: 620px;
        }

        .mini-hero-copy {
          max-width: 560px;
        }

        .full-site-preview.layout-centralizado .mini-hero-preview,
        .full-site-preview.layout-tela-cheia .mini-hero-preview,
        .full-site-preview.layout-cinematografica .mini-hero-preview {
          min-height: 620px;
        }

        .full-site-preview.layout-centralizado .mini-hero-copy,
        .full-site-preview.layout-tela-cheia .mini-hero-copy,
        .full-site-preview.layout-cinematografica .mini-hero-copy {
          width: min(58%, 560px);
          padding: 22px 24px;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy,
        .full-site-preview.layout-cinematografica .mini-hero-copy {
          background: linear-gradient(180deg, rgba(28, 18, 36, 0.72), rgba(28, 18, 36, 0.48));
          border-color: rgba(255, 253, 248, 0.22);
        }

        .full-site-preview.layout-tela-cheia .visual-photo-layer::after,
        .full-site-preview.layout-cinematografica .visual-photo-layer::after,
        .full-site-preview.layout-centralizado .visual-photo-layer::after {
          background:
            linear-gradient(90deg, rgba(24, 16, 30, 0.58), rgba(24, 16, 30, 0.18) 42%, rgba(24, 16, 30, 0.12)),
            linear-gradient(180deg, rgba(24, 16, 30, 0.04), rgba(24, 16, 30, 0.46));
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-preview {
          min-height: 620px;
          display: grid;
          grid-template-columns: minmax(0, 0.54fr) minmax(0, 0.46fr);
          gap: 0;
          background: linear-gradient(135deg, #fffdf8 0%, color-mix(in srgb, var(--brand-secondary), #fffdf8 88%) 100%);
        }

        .full-site-preview.layout-meio-a-meio .visual-photo-layer {
          position: relative;
          z-index: 1;
          min-height: 100%;
          width: 100%;
          opacity: 1;
          filter: saturate(0.96) contrast(1.02);
          background-size: var(--photo-size, cover);
          background-position: var(--photo-position, center);
          border-radius: 0 34px 34px 0;
          box-shadow: 18px 0 48px rgba(42, 24, 43, 0.08);
        }

        .full-site-preview.layout-meio-a-meio .visual-photo-layer::after {
          background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.10));
        }

        .full-site-preview.layout-meio-a-meio .visual-photo-shape {
          display: none;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy.align-left,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy.align-center,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy.align-right,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy.place-top,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy.place-middle,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy.place-bottom {
          position: relative;
          inset: auto;
          left: auto;
          right: auto;
          top: auto;
          bottom: auto;
          transform: none;
          width: min(86%, 520px);
          max-width: 520px;
          margin: 0 auto;
          align-self: center;
          justify-self: center;
          background: transparent;
          border: 0;
          box-shadow: none;
          padding: 34px;
          color: var(--brand-primary);
          text-shadow: none;
          text-align: left;
          backdrop-filter: none;
        }

        .full-site-preview.layout-circular .mini-hero-preview,
        .full-site-preview.layout-oval .mini-hero-preview {
          min-height: 640px;
          display: grid;
          grid-template-rows: auto auto;
          align-content: center;
          justify-items: center;
          gap: 34px;
          padding: 56px 34px;
          background:
            radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--brand-secondary), #fffdf8 82%), transparent 30%),
            linear-gradient(180deg, #fffdf8 0%, color-mix(in srgb, var(--brand-secondary), #fffdf8 90%) 100%);
        }

        .full-site-preview.layout-circular .visual-photo-layer,
        .full-site-preview.layout-oval .visual-photo-layer {
          opacity: 0.08;
          filter: blur(12px) saturate(0.72);
          transform: scale(1.08);
        }

        .full-site-preview.layout-circular .visual-photo-layer::after,
        .full-site-preview.layout-oval .visual-photo-layer::after {
          background: rgba(255, 253, 248, 0.72);
        }

        .full-site-preview.layout-circular .visual-photo-shape,
        .full-site-preview.layout-oval .visual-photo-shape {
          display: block;
          position: relative;
          z-index: 2;
          margin: 0;
          background-size: var(--photo-size, cover);
          background-position: var(--photo-position, center);
          background-color: #f4eadc;
          border: 9px solid rgba(255, 253, 248, 0.96);
          box-shadow: 0 28px 70px rgba(42, 24, 43, 0.16);
        }

        .full-site-preview.layout-circular .visual-photo-shape {
          width: clamp(220px, 31vw, 310px);
          height: clamp(220px, 31vw, 310px);
          border-radius: 999px;
        }

        .full-site-preview.layout-oval .visual-photo-shape {
          width: clamp(210px, 28vw, 285px);
          height: clamp(290px, 38vw, 380px);
          border-radius: 999px 999px 48% 48%;
        }

        .full-site-preview.layout-circular .mini-hero-copy,
        .full-site-preview.layout-oval .mini-hero-copy,
        .full-site-preview.layout-circular .mini-hero-copy.align-left,
        .full-site-preview.layout-circular .mini-hero-copy.align-center,
        .full-site-preview.layout-circular .mini-hero-copy.align-right,
        .full-site-preview.layout-circular .mini-hero-copy.place-top,
        .full-site-preview.layout-circular .mini-hero-copy.place-middle,
        .full-site-preview.layout-circular .mini-hero-copy.place-bottom,
        .full-site-preview.layout-oval .mini-hero-copy.align-left,
        .full-site-preview.layout-oval .mini-hero-copy.align-center,
        .full-site-preview.layout-oval .mini-hero-copy.align-right,
        .full-site-preview.layout-oval .mini-hero-copy.place-top,
        .full-site-preview.layout-oval .mini-hero-copy.place-middle,
        .full-site-preview.layout-oval .mini-hero-copy.place-bottom {
          position: relative;
          inset: auto;
          left: auto;
          right: auto;
          top: auto;
          bottom: auto;
          transform: none;
          width: min(92%, 560px);
          max-width: 560px;
          margin: 0 auto;
          background: transparent;
          border: 0;
          box-shadow: none;
          padding: 0;
          color: var(--brand-primary);
          text-shadow: none;
          text-align: center;
          backdrop-filter: none;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong,
        .full-site-preview.layout-oval .mini-hero-copy strong {
          line-height: 0.98;
          letter-spacing: 0.10em;
          text-transform: uppercase;
        }

        .full-site-preview.layout-foto-moldura .mini-hero-preview,
        .full-site-preview.layout-editorial-cartao .mini-hero-preview,
        .full-site-preview.layout-convite-luxo .mini-hero-preview {
          min-height: 640px;
          display: grid;
          grid-template-columns: minmax(0, 0.52fr) minmax(0, 0.48fr);
          align-items: center;
          gap: 34px;
          padding: 46px;
          background:
            radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--brand-secondary), #fffdf8 76%), transparent 32%),
            linear-gradient(135deg, #fffdf8 0%, color-mix(in srgb, var(--brand-secondary), #fffdf8 90%) 100%);
        }

        .full-site-preview.layout-foto-moldura .visual-photo-layer,
        .full-site-preview.layout-editorial-cartao .visual-photo-layer,
        .full-site-preview.layout-convite-luxo .visual-photo-layer {
          opacity: 0.07;
          filter: blur(14px) saturate(0.8);
        }

        .full-site-preview.layout-foto-moldura .visual-photo-layer::after,
        .full-site-preview.layout-editorial-cartao .visual-photo-layer::after,
        .full-site-preview.layout-convite-luxo .visual-photo-layer::after {
          background: rgba(255, 253, 248, 0.76);
        }

        .full-site-preview.layout-foto-moldura .visual-photo-shape,
        .full-site-preview.layout-editorial-cartao .visual-photo-shape,
        .full-site-preview.layout-convite-luxo .visual-photo-shape {
          display: block;
          position: relative;
          z-index: 2;
          width: 100%;
          height: clamp(260px, 40vw, 430px);
          border-radius: 32px;
          background-size: var(--photo-size, cover);
          background-position: var(--photo-position, center);
          box-shadow: 0 28px 70px rgba(42, 24, 43, 0.15);
        }

        .full-site-preview.layout-convite-luxo .visual-photo-shape {
          border-radius: 42px 42px 120px 120px;
        }

        .full-site-preview.layout-foto-moldura .mini-hero-copy,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy,
        .full-site-preview.layout-convite-luxo .mini-hero-copy,
        .full-site-preview.layout-foto-moldura .mini-hero-copy.align-left,
        .full-site-preview.layout-foto-moldura .mini-hero-copy.align-center,
        .full-site-preview.layout-foto-moldura .mini-hero-copy.align-right,
        .full-site-preview.layout-foto-moldura .mini-hero-copy.place-top,
        .full-site-preview.layout-foto-moldura .mini-hero-copy.place-middle,
        .full-site-preview.layout-foto-moldura .mini-hero-copy.place-bottom,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy.align-left,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy.align-center,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy.align-right,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy.place-top,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy.place-middle,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy.place-bottom,
        .full-site-preview.layout-convite-luxo .mini-hero-copy.align-left,
        .full-site-preview.layout-convite-luxo .mini-hero-copy.align-center,
        .full-site-preview.layout-convite-luxo .mini-hero-copy.align-right,
        .full-site-preview.layout-convite-luxo .mini-hero-copy.place-top,
        .full-site-preview.layout-convite-luxo .mini-hero-copy.place-middle,
        .full-site-preview.layout-convite-luxo .mini-hero-copy.place-bottom {
          position: relative;
          inset: auto;
          left: auto;
          right: auto;
          top: auto;
          bottom: auto;
          transform: none;
          width: min(92%, 520px);
          max-width: 520px;
          margin: 0;
          justify-self: center;
          background: rgba(255, 253, 248, 0.86);
          border: 1px solid rgba(196, 162, 98, 0.22);
          box-shadow: 0 22px 54px rgba(42, 24, 43, 0.08);
          padding: 28px;
          color: var(--brand-primary);
          text-shadow: none;
          text-align: left;
          backdrop-filter: blur(12px);
        }

        .full-site-preview.layout-monograma-clean .mini-hero-preview {
          min-height: 610px;
          display: grid;
          align-content: center;
          justify-items: center;
          padding: 58px 42px;
          background:
            radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--brand-secondary), #fffdf8 80%), transparent 34%),
            linear-gradient(180deg, #fffdf8 0%, color-mix(in srgb, var(--brand-secondary), #fffdf8 92%) 100%);
        }

        .full-site-preview.layout-monograma-clean .visual-photo-shape {
          display: none;
        }

        .full-site-preview.layout-monograma-clean .visual-photo-layer {
          opacity: 0.05;
          filter: blur(16px) saturate(0.72);
        }

        .full-site-preview.layout-monograma-clean .mini-hero-copy,
        .full-site-preview.layout-monograma-clean .mini-hero-copy.align-left,
        .full-site-preview.layout-monograma-clean .mini-hero-copy.align-center,
        .full-site-preview.layout-monograma-clean .mini-hero-copy.align-right,
        .full-site-preview.layout-monograma-clean .mini-hero-copy.place-top,
        .full-site-preview.layout-monograma-clean .mini-hero-copy.place-middle,
        .full-site-preview.layout-monograma-clean .mini-hero-copy.place-bottom {
          position: relative;
          inset: auto;
          left: auto;
          right: auto;
          top: auto;
          bottom: auto;
          transform: none;
          width: min(92%, 620px);
          max-width: 620px;
          background: transparent;
          border: 0;
          box-shadow: none;
          padding: 0;
          color: var(--brand-primary);
          text-shadow: none;
          text-align: center;
          backdrop-filter: none;
        }

        .full-site-preview.layout-monograma-clean .mini-hero-copy strong {
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .full-site-preview.layout-circular .preview-meta,
        .full-site-preview.layout-oval .preview-meta,
        .full-site-preview.layout-foto-moldura .preview-meta,
        .full-site-preview.layout-editorial-cartao .preview-meta,
        .full-site-preview.layout-convite-luxo .preview-meta,
        .full-site-preview.layout-monograma-clean .preview-meta,
        .full-site-preview.layout-meio-a-meio .preview-meta {
          background: rgba(255, 253, 248, 0.72);
          border-color: rgba(196, 162, 98, 0.24);
          color: rgba(67, 38, 63, 0.72);
          text-shadow: none;
        }

        @media (max-width: 1180px) {
          .full-site-preview.layout-circular .mini-hero-preview,
          .full-site-preview.layout-oval .mini-hero-preview,
          .full-site-preview.layout-foto-moldura .mini-hero-preview,
          .full-site-preview.layout-editorial-cartao .mini-hero-preview,
          .full-site-preview.layout-convite-luxo .mini-hero-preview,
          .full-site-preview.layout-monograma-clean .mini-hero-preview,
          .full-site-preview.layout-meio-a-meio .mini-hero-preview {
            min-height: 560px;
          }
        }

        @media (max-width: 900px) {
          .full-site-preview.layout-meio-a-meio .mini-hero-preview,
          .full-site-preview.layout-foto-moldura .mini-hero-preview,
          .full-site-preview.layout-editorial-cartao .mini-hero-preview,
          .full-site-preview.layout-convite-luxo .mini-hero-preview {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 32px 22px;
          }

          .full-site-preview.layout-meio-a-meio .visual-photo-layer {
            min-height: 320px;
            border-radius: 28px;
          }

          .full-site-preview.layout-circular .mini-hero-preview,
          .full-site-preview.layout-oval .mini-hero-preview,
          .full-site-preview.layout-monograma-clean .mini-hero-preview {
            min-height: 560px;
            padding: 38px 20px;
          }

          .full-site-preview.layout-centralizado .mini-hero-copy,
          .full-site-preview.layout-tela-cheia .mini-hero-copy,
          .full-site-preview.layout-cinematografica .mini-hero-copy {
            width: min(88%, 520px);
          }
        }

        @media (max-width: 560px) {
          .mini-hero-preview,
          .full-site-preview.layout-centralizado .mini-hero-preview,
          .full-site-preview.layout-tela-cheia .mini-hero-preview,
          .full-site-preview.layout-cinematografica .mini-hero-preview,
          .full-site-preview.layout-circular .mini-hero-preview,
          .full-site-preview.layout-oval .mini-hero-preview,
          .full-site-preview.layout-foto-moldura .mini-hero-preview,
          .full-site-preview.layout-editorial-cartao .mini-hero-preview,
          .full-site-preview.layout-convite-luxo .mini-hero-preview,
          .full-site-preview.layout-monograma-clean .mini-hero-preview,
          .full-site-preview.layout-meio-a-meio .mini-hero-preview {
            min-height: 520px;
          }

          .full-site-preview.layout-circular .visual-photo-shape {
            width: 210px;
            height: 210px;
          }

          .full-site-preview.layout-oval .visual-photo-shape {
            width: 200px;
            height: 282px;
          }

          .mini-hero-copy strong {
            letter-spacing: -0.05em;
          }
        }



        /* ===== V4.2 — LAYOUT INTELIGENTE E CORES MAIS VISÍVEIS =====
           Corrige os pontos testados: texto não deve sumir nem cobrir a foto,
           cada modelo limita o tamanho das letras conforme o espaço disponível,
           e as cores escolhidas aparecem de verdade no mini site. */

        .mini-hero-copy strong,
        .mini-hero-copy strong.title-size-delicado,
        .mini-hero-copy strong.title-size-medio,
        .mini-hero-copy strong.title-size-grande,
        .mini-hero-copy strong.title-size-impactante {
          overflow-wrap: anywhere;
          word-break: normal;
          max-width: 100%;
        }

        .full-site-preview.layout-centralizado .mini-hero-copy,
        .full-site-preview.layout-tela-cheia .mini-hero-copy,
        .full-site-preview.layout-cinematografica .mini-hero-copy {
          width: min(48%, 470px);
          max-width: 470px;
          padding: 18px 20px;
          border-radius: 26px;
        }

        .full-site-preview.layout-centralizado .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.title-size-delicado {
          font-size: clamp(30px, 3.4vw, 46px) !important;
          line-height: 1.02 !important;
        }

        .full-site-preview.layout-centralizado .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.title-size-medio {
          font-size: clamp(34px, 3.9vw, 54px) !important;
          line-height: 1 !important;
        }

        .full-site-preview.layout-centralizado .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.title-size-grande {
          font-size: clamp(38px, 4.4vw, 62px) !important;
          line-height: 0.98 !important;
        }

        .full-site-preview.layout-centralizado .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.title-size-impactante {
          font-size: clamp(42px, 4.9vw, 68px) !important;
          line-height: 0.96 !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy,
        .full-site-preview.layout-cinematografica .mini-hero-copy {
          background: linear-gradient(180deg, rgba(28, 18, 36, 0.66), rgba(28, 18, 36, 0.42));
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.16);
        }

        .full-site-preview.layout-tela-cheia .visual-photo-layer::after,
        .full-site-preview.layout-cinematografica .visual-photo-layer::after {
          background:
            linear-gradient(90deg, rgba(24, 16, 30, 0.50), rgba(24, 16, 30, 0.12) 46%, rgba(24, 16, 30, 0.06)),
            linear-gradient(180deg, rgba(24, 16, 30, 0.05), rgba(24, 16, 30, 0.34));
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-preview {
          grid-template-columns: minmax(0, 0.52fr) minmax(0, 0.48fr);
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy {
          width: min(88%, 430px);
          max-width: 430px;
          padding: 24px 18px;
          text-align: left;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.title-size-delicado {
          font-size: clamp(28px, 3.0vw, 42px) !important;
          line-height: 1.04 !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.title-size-medio {
          font-size: clamp(32px, 3.5vw, 50px) !important;
          line-height: 1.02 !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.title-size-grande {
          font-size: clamp(36px, 4.0vw, 56px) !important;
          line-height: 1 !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.title-size-impactante {
          font-size: clamp(40px, 4.4vw, 62px) !important;
          line-height: 0.98 !important;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-oval .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.title-size-delicado {
          font-size: clamp(28px, 3.2vw, 42px) !important;
          line-height: 1.12 !important;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-oval .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.title-size-medio {
          font-size: clamp(34px, 3.9vw, 52px) !important;
          line-height: 1.08 !important;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-oval .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.title-size-grande {
          font-size: clamp(40px, 4.5vw, 62px) !important;
          line-height: 1.04 !important;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-oval .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.title-size-impactante {
          font-size: clamp(46px, 5vw, 72px) !important;
          line-height: 1 !important;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong,
        .full-site-preview.layout-oval .mini-hero-copy strong {
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .full-site-preview.layout-foto-moldura .mini-hero-copy,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy,
        .full-site-preview.layout-convite-luxo .mini-hero-copy {
          width: min(90%, 460px);
          max-width: 460px;
          padding: 22px;
        }

        .mini-hero-copy small {
          font-size: calc(11px * var(--copy-scale, 1)) !important;
        }

        .mini-hero-copy p {
          font-size: calc(15px * var(--copy-scale, 1)) !important;
          line-height: 1.45 !important;
        }

        .mini-hero-copy .preview-meta {
          font-size: calc(13px * var(--copy-scale, 1)) !important;
          padding: calc(10px * var(--copy-scale, 1)) calc(18px * var(--copy-scale, 1)) !important;
        }

        .mini-hero-copy.frame-solto {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          padding: 0 !important;
          width: min(88%, 760px) !important;
        }

        .mini-hero-copy.frame-solto .preview-meta {
          background: transparent !important;
          border: none !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy.frame-solto,
        .full-site-preview.layout-cinematografica .mini-hero-copy.frame-solto {
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
        }

        .mini-hero-copy.frame-retangular {
          border-radius: 28px !important;
          width: min(84%, 760px) !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-cinematografica .mini-hero-copy.frame-retangular {
          background: linear-gradient(90deg, rgba(24, 16, 30, 0.42), rgba(24, 16, 30, 0.16)) !important;
        }

        .mini-hero-copy.frame-quadrado {
          width: min(66%, 420px) !important;
        }

        .countdown-preview-premium {
          position: relative;
          overflow: hidden;
          padding: 42px 26px 36px;
          border: 0;
          background:
            radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--brand-secondary), transparent 70%), transparent 24%),
            radial-gradient(circle at 92% 88%, color-mix(in srgb, var(--brand-secondary), transparent 62%), transparent 24%),
            linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), #000000 20%));
          color: #fffdf8;
          box-shadow: 0 22px 60px rgba(42, 24, 43, 0.16);
        }

        .countdown-preview-premium span {
          color: color-mix(in srgb, var(--brand-secondary), #fffdf8 16%);
          font-size: 12px;
          letter-spacing: 0.28em;
        }

        .countdown-preview-premium .countdown-card-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          width: min(100%, 560px);
          max-width: 560px;
          margin: 26px auto 18px;
        }

        .countdown-preview-premium .countdown-card-row strong {
          min-height: 112px;
          border-radius: 18px;
          background: rgba(255, 253, 248, 0.92);
          color: var(--brand-primary);
          display: grid;
          place-items: center;
          gap: 4px;
          padding: 16px 8px;
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.10);
        }

        .countdown-preview-premium .countdown-card-row b {
          display: block;
          color: var(--brand-secondary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 400;
          line-height: 1;
        }

        .countdown-preview-premium .countdown-card-row small {
          display: block;
          color: color-mix(in srgb, var(--brand-primary), #ffffff 30%);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .countdown-preview-premium p {
          color: rgba(255, 253, 248, 0.78);
          font-size: 14px;
        }

        .message-preview {
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 50%);
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--brand-secondary), #fffdf8 88%), rgba(255, 253, 248, 0.92));
        }

        .message-preview h3 {
          color: var(--brand-primary);
        }

        .gallery-preview i {
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--brand-secondary), #ffffff 54%), color-mix(in srgb, var(--brand-primary), #ffffff 78%));
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 58%);
        }

        .mini-site-card {
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 54%);
          background: linear-gradient(180deg, #fffdf8, color-mix(in srgb, var(--brand-secondary), #fffdf8 90%));
        }

        .mini-site-card strong {
          color: var(--brand-primary);
        }

        .mini-site-card.accent-card {
          background: linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), #000000 22%));
          color: #fffdf8;
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 38%);
        }

        .mini-site-card.accent-card span,
        .mini-site-card.accent-card strong {
          color: #fffdf8;
        }

        @media (max-width: 1180px) {
          .full-site-preview.layout-centralizado .mini-hero-copy,
          .full-site-preview.layout-tela-cheia .mini-hero-copy,
          .full-site-preview.layout-cinematografica .mini-hero-copy {
            width: min(58%, 430px);
          }

          .countdown-preview-premium .countdown-card-row {
            gap: 10px;
          }

          .countdown-preview-premium .countdown-card-row strong {
            min-height: 92px;
          }
        }

        @media (max-width: 900px) {
          .full-site-preview.layout-centralizado .mini-hero-copy,
          .full-site-preview.layout-tela-cheia .mini-hero-copy,
          .full-site-preview.layout-cinematografica .mini-hero-copy {
            width: min(86%, 430px);
          }

          .countdown-preview-premium .countdown-card-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .mini-hero-copy small {
          font-size: calc(11px * var(--copy-scale, 1)) !important;
        }

        .mini-hero-copy p {
          font-size: calc(15px * var(--copy-scale, 1)) !important;
          line-height: 1.45 !important;
        }

        .mini-hero-copy .preview-meta {
          font-size: calc(13px * var(--copy-scale, 1)) !important;
          padding: calc(10px * var(--copy-scale, 1)) calc(18px * var(--copy-scale, 1)) !important;
        }

        .mini-hero-copy.frame-solto {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          padding: 0 !important;
          width: min(88%, 760px) !important;
        }

        .mini-hero-copy.frame-solto .preview-meta {
          background: transparent !important;
          border: none !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy.frame-solto,
        .full-site-preview.layout-cinematografica .mini-hero-copy.frame-solto {
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
        }

        .mini-hero-copy.frame-retangular {
          border-radius: 28px !important;
          width: min(84%, 760px) !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-cinematografica .mini-hero-copy.frame-retangular {
          background: linear-gradient(90deg, rgba(24, 16, 30, 0.42), rgba(24, 16, 30, 0.16)) !important;
        }

        .mini-hero-copy.frame-quadrado {
          width: min(66%, 420px) !important;
        }

        .countdown-preview-premium {
            padding: 32px 16px 28px;
          }

          .countdown-preview-premium .countdown-card-row strong {
            min-height: 86px;
          }
        }


        /* ===== V4.3 — TEXTO SEGURO, BARRA DE TAMANHO E CORES MAIS FORTES ===== */
        .title-scale-control {
          border-top: 1px solid rgba(196, 162, 98, 0.18);
          padding-top: 12px;
        }

        .title-scale-range {
          display: grid;
          grid-template-columns: 54px minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          color: rgba(67, 38, 63, 0.66);
          font-size: 12px;
          font-weight: 900;
        }

        .title-scale-range span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          border-radius: 999px;
          background: rgba(255, 253, 248, 0.88);
          border: 1px solid rgba(196, 162, 98, 0.24);
        }

        .title-scale-range input {
          width: 100%;
          accent-color: var(--brand-primary);
        }

        .compact-help {
          margin: 8px 0 0;
        }

        .mini-hero-copy strong,
        .mini-hero-copy strong.title-size-delicado,
        .mini-hero-copy strong.title-size-medio,
        .mini-hero-copy strong.title-size-grande,
        .mini-hero-copy strong.title-size-impactante {
          overflow-wrap: normal !important;
          word-break: keep-all !important;
          hyphens: none !important;
          max-width: 100%;
        }

        .mini-hero-copy strong.title-size-delicado {
          --safe-title-base: 36px;
        }

        .mini-hero-copy strong.title-size-medio {
          --safe-title-base: 44px;
        }

        .mini-hero-copy strong.title-size-grande {
          --safe-title-base: 52px;
        }

        .mini-hero-copy strong.title-size-impactante {
          --safe-title-base: 60px;
        }

        .mini-hero-copy strong {
          font-size: clamp(24px, calc(var(--safe-title-base, 46px) * var(--title-scale, 0.92)), 72px) !important;
          line-height: 1.02 !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.title-size-delicado {
          --safe-title-base: 32px;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.title-size-medio {
          --safe-title-base: 38px;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.title-size-grande {
          --safe-title-base: 44px;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.title-size-impactante {
          --safe-title-base: 50px;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-oval .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.title-size-delicado {
          --safe-title-base: 34px;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-oval .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.title-size-medio {
          --safe-title-base: 42px;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-oval .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.title-size-grande {
          --safe-title-base: 50px;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-oval .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.title-size-impactante {
          --safe-title-base: 56px;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy,
        .full-site-preview.layout-cinematografica .mini-hero-copy {
          width: min(78%, 720px) !important;
          max-width: 720px !important;
          min-height: auto !important;
          padding: 18px 28px !important;
          border-radius: 24px !important;
          background: linear-gradient(90deg, rgba(24, 16, 30, 0.58), rgba(24, 16, 30, 0.30), rgba(24, 16, 30, 0.14)) !important;
          border-color: rgba(255, 253, 248, 0.18) !important;
          backdrop-filter: blur(8px) !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy p,
        .full-site-preview.layout-cinematografica .mini-hero-copy p {
          max-width: 520px;
          margin-top: 10px;
        }

        .full-site-preview.layout-tela-cheia .preview-meta,
        .full-site-preview.layout-cinematografica .preview-meta {
          width: fit-content;
          max-width: 100%;
          margin-top: 12px;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.title-size-delicado,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.title-size-delicado {
          --safe-title-base: 38px;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.title-size-medio,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.title-size-medio {
          --safe-title-base: 46px;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.title-size-grande,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.title-size-grande {
          --safe-title-base: 54px;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.title-size-impactante,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.title-size-impactante {
          --safe-title-base: 62px;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy {
          width: min(92%, 520px) !important;
          padding: 26px 20px !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong {
          line-height: 1.08 !important;
        }

        .mini-hero-copy small {
          font-size: calc(11px * var(--copy-scale, 1)) !important;
        }

        .mini-hero-copy p {
          font-size: calc(15px * var(--copy-scale, 1)) !important;
          line-height: 1.45 !important;
        }

        .mini-hero-copy .preview-meta {
          font-size: calc(13px * var(--copy-scale, 1)) !important;
          padding: calc(10px * var(--copy-scale, 1)) calc(18px * var(--copy-scale, 1)) !important;
        }

        .mini-hero-copy.frame-solto {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          padding: 0 !important;
          width: min(88%, 760px) !important;
        }

        .mini-hero-copy.frame-solto .preview-meta {
          background: transparent !important;
          border: none !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy.frame-solto,
        .full-site-preview.layout-cinematografica .mini-hero-copy.frame-solto {
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
        }

        .mini-hero-copy.frame-retangular {
          border-radius: 28px !important;
          width: min(84%, 760px) !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-cinematografica .mini-hero-copy.frame-retangular {
          background: linear-gradient(90deg, rgba(24, 16, 30, 0.42), rgba(24, 16, 30, 0.16)) !important;
        }

        .mini-hero-copy.frame-quadrado {
          width: min(66%, 420px) !important;
        }

        .countdown-preview-premium {
          background:
            radial-gradient(circle at 10% 15%, color-mix(in srgb, var(--brand-secondary), #ffffff 78%), transparent 21%),
            radial-gradient(circle at 90% 82%, color-mix(in srgb, var(--brand-secondary), #000000 70%), transparent 22%),
            linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), #000000 28%)) !important;
        }

        .countdown-preview-premium .countdown-card-row strong {
          border: 1px solid color-mix(in srgb, var(--brand-secondary), #ffffff 56%);
          background: linear-gradient(180deg, #fffdf8 0%, color-mix(in srgb, var(--brand-secondary), #ffffff 82%) 100%) !important;
        }

        .countdown-preview-premium .countdown-card-row b {
          color: var(--brand-secondary) !important;
        }

        .message-preview,
        .gallery-preview,
        .mini-site-card {
          border-width: 1.5px;
        }


        /* ===== V4.5 — CAIXA DO TEXTO FUNCIONANDO DE VERDADE ===== */
        .full-site-preview .mini-hero-preview .mini-hero-copy {
          box-sizing: border-box !important;
          transition: width .22s ease, max-width .22s ease, border-radius .22s ease, padding .22s ease, background .22s ease, box-shadow .22s ease, backdrop-filter .22s ease !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy strong {
          font-size: clamp(22px, calc(var(--safe-title-base, 46px) * var(--title-scale, 0.92)), 72px) !important;
          transform: none !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.body-density-compacto p {
          font-size: calc(13px * var(--detail-scale, 1)) !important;
          line-height: 1.28 !important;
          margin-top: 8px !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.body-density-padrao p {
          font-size: calc(15px * var(--detail-scale, 1)) !important;
          line-height: 1.42 !important;
          margin-top: 10px !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.body-density-confortavel p {
          font-size: calc(17px * var(--detail-scale, 1)) !important;
          line-height: 1.55 !important;
          margin-top: 12px !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy .preview-meta {
          font-size: calc(13px * var(--detail-scale, 1)) !important;
          line-height: 1.25 !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-solto {
          width: min(90%, 760px) !important;
          min-height: 0 !important;
          max-width: 760px !important;
          aspect-ratio: auto !important;
          padding: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-solto::before,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-solto::after {
          display: none !important;
          content: none !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-solto .preview-meta {
          width: auto !important;
          max-width: 100% !important;
          padding: 0 !important;
          margin-top: 12px !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-preview .mini-hero-copy.frame-solto,
        .full-site-preview.layout-cinematografica .mini-hero-preview .mini-hero-copy.frame-solto,
        .full-site-preview.layout-centralizado .mini-hero-preview .mini-hero-copy.frame-solto {
          color: #fffdf8 !important;
          text-shadow: 0 3px 20px rgba(0, 0, 0, 0.42) !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-preview .mini-hero-copy.frame-solto,
        .full-site-preview.layout-circular .mini-hero-preview .mini-hero-copy.frame-solto,
        .full-site-preview.layout-oval .mini-hero-preview .mini-hero-copy.frame-solto,
        .full-site-preview.layout-foto-moldura .mini-hero-preview .mini-hero-copy.frame-solto,
        .full-site-preview.layout-editorial-cartao .mini-hero-preview .mini-hero-copy.frame-solto,
        .full-site-preview.layout-convite-luxo .mini-hero-preview .mini-hero-copy.frame-solto,
        .full-site-preview.layout-monograma-clean .mini-hero-preview .mini-hero-copy.frame-solto {
          color: var(--brand-primary) !important;
          text-shadow: none !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular {
          width: min(86%, 760px) !important;
          max-width: 760px !important;
          min-height: 0 !important;
          aspect-ratio: auto !important;
          padding: 22px 30px !important;
          border-radius: 30px !important;
          border: 1px solid rgba(255, 253, 248, 0.22) !important;
          background: linear-gradient(90deg, rgba(24, 16, 30, 0.58), rgba(24, 16, 30, 0.26), rgba(24, 16, 30, 0.12)) !important;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-preview .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-circular .mini-hero-preview .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-oval .mini-hero-preview .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-foto-moldura .mini-hero-preview .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-editorial-cartao .mini-hero-preview .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-convite-luxo .mini-hero-preview .mini-hero-copy.frame-retangular,
        .full-site-preview.layout-monograma-clean .mini-hero-preview .mini-hero-copy.frame-retangular {
          background: rgba(255, 253, 248, 0.86) !important;
          border-color: rgba(196, 162, 98, 0.20) !important;
          box-shadow: 0 20px 55px rgba(67, 38, 63, 0.12) !important;
          color: var(--brand-primary) !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado {
          width: min(58%, 430px) !important;
          max-width: 430px !important;
          min-height: min(58vw, 330px) !important;
          aspect-ratio: 1 / 1 !important;
          padding: 26px !important;
          border-radius: 34px !important;
          border: 1px solid rgba(255, 253, 248, 0.24) !important;
          background: rgba(24, 16, 30, 0.58) !important;
          box-shadow: 0 24px 72px rgba(0, 0, 0, 0.25) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-preview .mini-hero-copy.frame-quadrado,
        .full-site-preview.layout-circular .mini-hero-preview .mini-hero-copy.frame-quadrado,
        .full-site-preview.layout-oval .mini-hero-preview .mini-hero-copy.frame-quadrado,
        .full-site-preview.layout-foto-moldura .mini-hero-preview .mini-hero-copy.frame-quadrado,
        .full-site-preview.layout-editorial-cartao .mini-hero-preview .mini-hero-copy.frame-quadrado,
        .full-site-preview.layout-convite-luxo .mini-hero-preview .mini-hero-copy.frame-quadrado,
        .full-site-preview.layout-monograma-clean .mini-hero-preview .mini-hero-copy.frame-quadrado {
          background: rgba(255, 253, 248, 0.90) !important;
          border-color: rgba(196, 162, 98, 0.24) !important;
          box-shadow: 0 20px 55px rgba(67, 38, 63, 0.14) !important;
          color: var(--brand-primary) !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado strong {
          --safe-title-base: 40px;
          line-height: 1.04 !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado p {
          max-width: 100% !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado .preview-meta {
          width: 100% !important;
          justify-content: center !important;
          white-space: normal !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy strong {
          font-size: var(--live-title-size, clamp(22px, calc(var(--safe-title-base, 46px) * var(--title-scale, 0.92)), 72px)) !important;
          line-height: 1.03 !important;
          transition: font-size 0.18s ease !important;
        }

        .detail-scale-control {
          border-top: 1px solid rgba(196, 162, 98, 0.18);
          padding-top: 12px;
        }


        /* ===== V4.8 — FLUXO INTELIGENTE ===== */
        .upload-only-step .photo-adjust-card {
          display: none !important;
        }

        .photo-adjust-card-inside-model {
          margin-top: 18px;
          border: 1px solid rgba(196, 162, 98, 0.18);
          background: rgba(255, 253, 248, 0.82);
        }

        .atmosphere-option small::after {
          content: "Não altera fonte nem paleta.";
          display: block;
          margin-top: 8px;
          color: rgba(67, 38, 63, 0.46);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .full-site-preview.atmosphere-romantico {
          background:
            radial-gradient(circle at 18% 8%, color-mix(in srgb, var(--brand-secondary), #ffffff 70%), transparent 28%),
            linear-gradient(180deg, #fff8f8 0%, #f7e9ed 100%);
        }

        .full-site-preview.atmosphere-rustico,
        .full-site-preview.atmosphere-boho {
          background:
            radial-gradient(circle at 80% 8%, rgba(122, 102, 86, 0.14), transparent 26%),
            linear-gradient(180deg, #fbf6ee 0%, #eadfcf 100%);
        }

        .full-site-preview.atmosphere-minimalista {
          background: linear-gradient(180deg, #ffffff 0%, #f3f1ec 100%);
        }

        .full-site-preview.atmosphere-moderno {
          background:
            radial-gradient(circle at 85% 18%, color-mix(in srgb, var(--brand-primary), transparent 78%), transparent 26%),
            linear-gradient(180deg, #f7f7f8 0%, #ece9e5 100%);
        }

        .full-site-preview.atmosphere-classico .mini-site-section {
          border-radius: 28px;
        }

        .full-site-preview.atmosphere-romantico .mini-site-section {
          border-radius: 34px;
          box-shadow: 0 18px 48px color-mix(in srgb, var(--brand-secondary), transparent 72%);
        }

        .full-site-preview.atmosphere-minimalista .mini-site-section,
        .full-site-preview.atmosphere-minimalista .mini-site-card {
          border-radius: 18px;
          box-shadow: none;
        }

        .full-site-preview.atmosphere-rustico .mini-site-section,
        .full-site-preview.atmosphere-boho .mini-site-section {
          border-radius: 30px;
          background:
            radial-gradient(circle at 0% 0%, rgba(196, 162, 98, 0.14), transparent 24%),
            rgba(255, 253, 248, 0.84);
        }

        .full-site-preview.atmosphere-moderno .mini-site-section,
        .full-site-preview.atmosphere-moderno .mini-site-card {
          border-radius: 24px;
          border-color: color-mix(in srgb, var(--brand-primary), transparent 78%);
        }

        .review-final-panel {
          display: grid;
          gap: 16px;
        }

        .review-hero-card,
        .review-check-grid > div,
        .review-device-row > div {
          border: 1px solid rgba(196, 162, 98, 0.18);
          background: rgba(255, 253, 248, 0.82);
          border-radius: 24px;
          padding: 18px;
          box-shadow: 0 12px 30px rgba(67, 38, 63, 0.06);
        }

        .review-hero-card span,
        .review-check-grid span,
        .review-device-row span {
          display: block;
          margin-bottom: 8px;
          color: rgba(67, 38, 63, 0.54);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .review-hero-card strong {
          display: block;
          color: var(--brand-primary);
          font-size: clamp(32px, 4vw, 54px);
          line-height: 1.02;
        }

        .review-hero-card p,
        .review-device-row p {
          margin: 8px 0 0;
          color: rgba(67, 38, 63, 0.58);
          line-height: 1.5;
        }

        .review-check-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .review-check-grid strong {
          color: var(--vv-plum);
          font-size: 14px;
          line-height: 1.35;
        }

        .review-device-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        @media (max-width: 720px) {
          .review-check-grid,
          .review-device-row {
            grid-template-columns: 1fr;
          }
        }


        /* ===== V4.10 — CAPAS PREMIUM + PAPÉIS DE PAREDE DO SITE ===== */
        .media-future-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .media-future-row span {
          border: 1px solid rgba(196, 162, 98, 0.18);
          background: rgba(255, 253, 248, 0.72);
          border-radius: 16px;
          padding: 12px 10px;
          color: rgba(67, 38, 63, 0.52);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: center;
          text-transform: uppercase;
        }

        .media-future-row span.active {
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 30%);
          background: color-mix(in srgb, var(--brand-secondary), #fffdf8 78%);
          color: var(--brand-primary);
        }

        .full-site-preview {
          position: relative;
          background: linear-gradient(180deg, #fffdf8 0%, #f5efe5 100%);
        }

        .full-site-preview::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.9;
        }

        .full-site-preview > * {
          position: relative;
          z-index: 1;
        }

        .full-site-preview .mini-hero-preview {
          background: transparent !important;
          box-shadow: none !important;
        }

        .full-site-preview.layout-esquerda-esfumada .mini-hero-preview {
          min-height: 620px;
          display: grid;
          grid-template-columns: minmax(0, 0.56fr) minmax(0, 0.44fr);
          gap: 0;
          background: transparent !important;
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          min-height: 620px;
          opacity: 1;
          filter: saturate(1.02) contrast(1.02);
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer::after {
          background: linear-gradient(90deg, transparent 0%, transparent 54%, rgba(255,253,248,0.58) 76%, #fffdf8 100%) !important;
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-shape {
          display: none !important;
        }

        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.align-left,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.align-center,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.align-right,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.place-top,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.place-middle,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.place-bottom {
          position: relative !important;
          inset: auto !important;
          transform: none !important;
          z-index: 2;
          width: min(88%, 520px) !important;
          justify-self: center;
          align-self: center;
          color: var(--brand-primary);
          text-shadow: none;
        }

        .full-site-preview.layout-poster-editorial .mini-hero-preview {
          min-height: 660px;
          display: grid;
          grid-template-columns: minmax(0, 0.42fr) minmax(0, 0.58fr);
          gap: 28px;
          padding: 42px;
          background: transparent !important;
        }

        .full-site-preview.layout-poster-editorial .visual-photo-layer {
          display: none !important;
        }

        .full-site-preview.layout-poster-editorial .visual-photo-shape {
          display: block;
          width: 100%;
          height: min(70vh, 520px);
          border-radius: 34px;
          box-shadow: 0 24px 55px rgba(42,24,43,0.18);
          border: 1px solid rgba(255,255,255,0.72);
        }

        .full-site-preview.layout-poster-editorial .mini-hero-copy,
        .full-site-preview.layout-poster-editorial .mini-hero-copy.align-left,
        .full-site-preview.layout-poster-editorial .mini-hero-copy.align-center,
        .full-site-preview.layout-poster-editorial .mini-hero-copy.align-right,
        .full-site-preview.layout-poster-editorial .mini-hero-copy.place-top,
        .full-site-preview.layout-poster-editorial .mini-hero-copy.place-middle,
        .full-site-preview.layout-poster-editorial .mini-hero-copy.place-bottom {
          position: relative !important;
          inset: auto !important;
          transform: none !important;
          width: min(92%, 560px) !important;
          align-self: center;
          justify-self: start;
          color: var(--brand-primary);
          text-shadow: none;
        }

        .full-site-preview.layout-faixa-convite .mini-hero-preview {
          min-height: 640px;
          display: grid;
          grid-template-rows: 0.54fr 0.46fr;
          background: transparent !important;
        }

        .full-site-preview.layout-faixa-convite .visual-photo-layer {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: 340px;
          border-bottom-left-radius: 54px;
          border-bottom-right-radius: 54px;
          box-shadow: 0 26px 52px rgba(42,24,43,0.14);
        }

        .full-site-preview.layout-faixa-convite .visual-photo-layer::after {
          background: linear-gradient(180deg, rgba(24,16,30,0.06), rgba(24,16,30,0.34)) !important;
        }

        .full-site-preview.layout-faixa-convite .visual-photo-shape {
          display: none !important;
        }

        .full-site-preview.layout-faixa-convite .mini-hero-copy,
        .full-site-preview.layout-faixa-convite .mini-hero-copy.align-left,
        .full-site-preview.layout-faixa-convite .mini-hero-copy.align-center,
        .full-site-preview.layout-faixa-convite .mini-hero-copy.align-right,
        .full-site-preview.layout-faixa-convite .mini-hero-copy.place-top,
        .full-site-preview.layout-faixa-convite .mini-hero-copy.place-middle,
        .full-site-preview.layout-faixa-convite .mini-hero-copy.place-bottom {
          position: relative !important;
          inset: auto !important;
          transform: none !important;
          justify-self: center;
          align-self: center;
          width: min(86%, 680px) !important;
          color: var(--brand-primary);
          text-shadow: none;
        }

        .full-site-preview.atmosphere-clean-luxo {
          background: linear-gradient(180deg, #fffdf8 0%, #f5efe5 100%) !important;
        }
        .full-site-preview.atmosphere-clean-luxo::before {
          background:
            linear-gradient(90deg, rgba(196,162,98,0.10) 1px, transparent 1px),
            linear-gradient(180deg, rgba(196,162,98,0.08) 1px, transparent 1px);
          background-size: 72px 72px;
          opacity: 0.42;
        }

        .full-site-preview.atmosphere-romantico-floral {
          background: linear-gradient(180deg, #fff7f8 0%, #f3dfe5 100%) !important;
        }
        .full-site-preview.atmosphere-romantico-floral::before {
          background:
            radial-gradient(circle at 12% 10%, color-mix(in srgb, var(--brand-secondary), transparent 42%) 0 32px, transparent 33px),
            radial-gradient(circle at 88% 18%, color-mix(in srgb, var(--brand-secondary), transparent 58%) 0 42px, transparent 43px),
            radial-gradient(circle at 18% 86%, color-mix(in srgb, var(--brand-primary), transparent 72%) 0 36px, transparent 37px);
          opacity: 0.72;
        }

        .full-site-preview.atmosphere-pattern-whatsapp {
          background: linear-gradient(180deg, #f8f1e8 0%, #eadfce 100%) !important;
        }
        .full-site-preview.atmosphere-pattern-whatsapp::before {
          background-image:
            radial-gradient(circle at 6px 6px, color-mix(in srgb, var(--brand-primary), transparent 78%) 0 2px, transparent 3px),
            radial-gradient(circle at 24px 22px, color-mix(in srgb, var(--brand-secondary), transparent 68%) 0 2px, transparent 3px),
            linear-gradient(45deg, transparent 0 43%, color-mix(in srgb, var(--brand-primary), transparent 88%) 44% 46%, transparent 47% 100%);
          background-size: 42px 42px, 42px 42px, 58px 58px;
          opacity: 0.72;
        }

        .full-site-preview.atmosphere-noite-premium {
          background:
            radial-gradient(circle at 18% 14%, rgba(199,161,93,0.30), transparent 30%),
            radial-gradient(circle at 92% 42%, rgba(255,255,255,0.10), transparent 25%),
            linear-gradient(180deg, #160f1b 0%, #2b1a32 100%) !important;
          color: #fffdf8;
        }
        .full-site-preview.atmosphere-noite-premium .mini-site-section,
        .full-site-preview.atmosphere-noite-premium .mini-site-card,
        .full-site-preview.atmosphere-noite-premium .message-preview,
        .full-site-preview.atmosphere-noite-premium .gallery-preview {
          background: rgba(255,253,248,0.10) !important;
          border-color: rgba(199,161,93,0.28) !important;
          color: #fffdf8;
          box-shadow: 0 28px 60px rgba(0,0,0,0.22) !important;
        }

        .full-site-preview.atmosphere-jardim-organico {
          background: linear-gradient(180deg, #f7f3ea 0%, #dfe8dc 100%) !important;
        }
        .full-site-preview.atmosphere-jardim-organico::before {
          background:
            radial-gradient(ellipse at 8% 18%, rgba(63,79,69,0.18) 0 70px, transparent 72px),
            radial-gradient(ellipse at 92% 74%, rgba(196,162,98,0.20) 0 86px, transparent 88px),
            linear-gradient(120deg, transparent 0 46%, rgba(63,79,69,0.08) 47% 49%, transparent 50% 100%);
          background-size: auto, auto, 120px 120px;
        }

        .full-site-preview.atmosphere-festa-vibrante {
          background: linear-gradient(135deg, #fff7ed 0%, #ffe2d0 45%, #f9c9c3 100%) !important;
        }
        .full-site-preview.atmosphere-festa-vibrante::before {
          background:
            radial-gradient(circle at 16% 16%, rgba(216,156,114,0.34) 0 30px, transparent 31px),
            radial-gradient(circle at 84% 26%, rgba(67,38,63,0.16) 0 24px, transparent 25px),
            linear-gradient(135deg, rgba(216,156,114,0.18) 0 14px, transparent 15px 48px);
          background-size: auto, auto, 64px 64px;
        }

        .full-site-preview.atmosphere-infantil-delicado {
          background: linear-gradient(180deg, #f7fbff 0%, #f7eaf2 100%) !important;
        }
        .full-site-preview.atmosphere-infantil-delicado::before {
          background:
            radial-gradient(circle at 12% 18%, rgba(140,183,213,0.26) 0 18px, transparent 19px),
            radial-gradient(circle at 78% 20%, rgba(228,182,199,0.30) 0 15px, transparent 16px),
            radial-gradient(circle at 50% 80%, rgba(255,255,255,0.72) 0 34px, transparent 35px);
          background-size: 120px 120px, 92px 92px, auto;
        }

        .full-site-preview.atmosphere-corporativo-premium {
          background: linear-gradient(180deg, #f7f9fb 0%, #e9eef4 100%) !important;
        }
        .full-site-preview.atmosphere-corporativo-premium::before {
          background:
            linear-gradient(90deg, rgba(19,34,56,0.08) 1px, transparent 1px),
            linear-gradient(180deg, rgba(19,34,56,0.08) 1px, transparent 1px),
            radial-gradient(circle at 88% 18%, rgba(140,183,213,0.24), transparent 28%);
          background-size: 48px 48px, 48px 48px, auto;
        }

        .full-site-preview.atmosphere-boho-editorial {
          background: linear-gradient(180deg, #fbf3e8 0%, #efe1cf 100%) !important;
        }
        .full-site-preview.atmosphere-boho-editorial::before {
          background:
            radial-gradient(circle at 20% 12%, rgba(214,168,111,0.28) 0 46px, transparent 47px),
            radial-gradient(circle at 92% 82%, rgba(122,102,86,0.18) 0 68px, transparent 69px);
        }

        .full-site-preview .mini-site-section,
        .full-site-preview .mini-site-card,
        .full-site-preview .message-preview,
        .full-site-preview .gallery-preview,
        .full-site-preview .accent-card {
          backdrop-filter: blur(12px);
        }

        .full-site-preview.atmosphere-romantico-floral .countdown-preview-premium,
        .full-site-preview.atmosphere-pattern-whatsapp .countdown-preview-premium,
        .full-site-preview.atmosphere-festa-vibrante .countdown-preview-premium,
        .full-site-preview.atmosphere-infantil-delicado .countdown-preview-premium {
          border-radius: 42px !important;
          padding: 38px 26px !important;
        }

        .full-site-preview.atmosphere-pattern-whatsapp .countdown-preview-premium {
          background:
            radial-gradient(circle at 8px 8px, rgba(255,255,255,0.18) 0 2px, transparent 3px),
            linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-secondary), var(--brand-primary) 56%)) !important;
          background-size: 32px 32px, auto !important;
        }

        .full-site-preview.atmosphere-noite-premium .countdown-preview-premium {
          background:
            radial-gradient(circle at 20% 12%, rgba(199,161,93,0.34), transparent 30%),
            linear-gradient(135deg, #09060d, #2b1a32) !important;
          border: 1px solid rgba(199,161,93,0.30) !important;
        }

        .full-site-preview.atmosphere-festa-vibrante .countdown-card-row strong {
          border-radius: 999px !important;
          transform: rotate(-1deg);
        }

        .full-site-preview.atmosphere-corporativo-premium .countdown-preview-premium,
        .full-site-preview.atmosphere-corporativo-premium .mini-site-section,
        .full-site-preview.atmosphere-corporativo-premium .mini-site-card {
          border-radius: 14px !important;
        }




        /* ===== V4.10 — CAPAS PREMIUM + PAPÉIS DE PAREDE DO SITE ===== */
        .full-site-preview {
          background-color: #fffdf8;
          isolation: isolate;
        }

        .full-site-preview::before {
          z-index: 0;
          opacity: 0.96;
        }

        .full-site-preview .mini-hero-preview {
          border-radius: 0 !important;
          border: 0 !important;
          overflow: hidden;
        }

        .full-site-preview .mini-site-section,
        .full-site-preview .mini-site-card,
        .full-site-preview .message-preview,
        .full-site-preview .gallery-preview,
        .full-site-preview .accent-card {
          background: color-mix(in srgb, #fffdf8, var(--brand-secondary) 9%) !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 58%) !important;
          box-shadow: 0 24px 70px color-mix(in srgb, var(--brand-primary), transparent 88%) !important;
        }

        .full-site-preview .countdown-preview-premium {
          background:
            radial-gradient(circle at 12% 20%, color-mix(in srgb, var(--brand-secondary), transparent 58%), transparent 25%),
            linear-gradient(135deg, var(--brand-primary) 0%, color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 26%) 100%) !important;
          color: #fffdf8 !important;
          border: 0 !important;
          box-shadow: 0 26px 76px color-mix(in srgb, var(--brand-primary), transparent 62%) !important;
        }

        .full-site-preview .countdown-card-row strong {
          background: rgba(255,255,255,0.92) !important;
          color: var(--brand-primary) !important;
          border: 1px solid rgba(255,255,255,0.44) !important;
          box-shadow: 0 14px 34px rgba(0,0,0,0.13) !important;
        }

        /* Foto esfumaçada: texto à esquerda, foto à direita e a cor invade a foto */
        .full-site-preview.layout-esquerda-esfumada .mini-hero-preview {
          position: relative;
          min-height: 660px;
          display: grid;
          grid-template-columns: minmax(320px, 0.46fr) minmax(0, 0.54fr);
          align-items: stretch;
          background:
            radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--brand-secondary), transparent 62%), transparent 28%),
            linear-gradient(90deg, var(--brand-primary) 0%, color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 18%) 44%, transparent 44%) !important;
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer {
          position: absolute !important;
          inset: 0 0 0 auto !important;
          width: 66%;
          min-height: 100%;
          opacity: 1;
          z-index: 1;
          background-size: var(--photo-size, cover);
          background-position: var(--photo-position, center);
          filter: saturate(1.06) contrast(1.03);
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer::after {
          background:
            linear-gradient(90deg,
              color-mix(in srgb, var(--brand-primary), transparent 0%) 0%,
              color-mix(in srgb, var(--brand-primary), transparent 4%) 14%,
              color-mix(in srgb, var(--brand-primary), transparent 36%) 36%,
              rgba(0,0,0,0.08) 66%,
              rgba(0,0,0,0.12) 100%) !important;
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-shape {
          display: none !important;
        }

        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.align-left,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.align-center,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.align-right,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.place-top,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.place-middle,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy.place-bottom {
          position: relative !important;
          z-index: 2;
          grid-column: 1;
          inset: auto !important;
          transform: none !important;
          width: min(88%, 560px) !important;
          max-width: 560px !important;
          margin: 0 auto;
          align-self: center;
          justify-self: center;
          padding: 42px 34px !important;
          color: #fffdf8 !important;
          text-align: left !important;
          text-shadow: 0 10px 36px rgba(0,0,0,0.28) !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
        }

        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy .preview-meta {
          background: rgba(255,255,255,0.14) !important;
          color: rgba(255,253,248,0.86) !important;
          border-color: rgba(255,255,255,0.20) !important;
          backdrop-filter: blur(10px);
        }

        /* Divisão curva */
        .full-site-preview.layout-split-curvo .mini-hero-preview {
          min-height: 650px;
          display: grid;
          grid-template-columns: minmax(0, 0.44fr) minmax(0, 0.56fr);
          align-items: center;
          padding: 58px;
          gap: 36px;
          background:
            radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--brand-secondary), transparent 66%), transparent 30%),
            linear-gradient(135deg, color-mix(in srgb, #fffdf8, var(--brand-secondary) 12%) 0%, #fffdf8 100%) !important;
        }

        .full-site-preview.layout-split-curvo .visual-photo-layer { display: none !important; }
        .full-site-preview.layout-split-curvo .visual-photo-shape {
          display: block;
          grid-column: 2;
          grid-row: 1;
          height: min(62vh, 500px);
          width: 100%;
          border-radius: 42% 24px 24px 42%;
          background-size: var(--photo-size, cover);
          background-position: var(--photo-position, center);
          box-shadow: 0 30px 80px rgba(0,0,0,0.16);
        }

        .full-site-preview.layout-split-curvo .mini-hero-copy,
        .full-site-preview.layout-split-curvo .mini-hero-copy.align-left,
        .full-site-preview.layout-split-curvo .mini-hero-copy.align-center,
        .full-site-preview.layout-split-curvo .mini-hero-copy.align-right,
        .full-site-preview.layout-split-curvo .mini-hero-copy.place-top,
        .full-site-preview.layout-split-curvo .mini-hero-copy.place-middle,
        .full-site-preview.layout-split-curvo .mini-hero-copy.place-bottom {
          position: relative !important;
          grid-column: 1;
          grid-row: 1;
          inset: auto !important;
          transform: none !important;
          width: min(100%, 520px) !important;
          padding: 0 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          color: var(--brand-primary) !important;
          text-shadow: none !important;
          text-align: left !important;
        }

        /* Minimal luxo */
        .full-site-preview.layout-minimal-luxo .mini-hero-preview {
          min-height: 650px;
          display: grid;
          grid-template-columns: minmax(0, 0.52fr) minmax(0, 0.48fr);
          gap: 46px;
          align-items: center;
          padding: 64px;
          background: transparent !important;
        }

        .full-site-preview.layout-minimal-luxo .visual-photo-layer { display: none !important; }
        .full-site-preview.layout-minimal-luxo .visual-photo-shape {
          display: block;
          grid-column: 1;
          height: min(64vh, 520px);
          border-radius: 36px;
          background-size: var(--photo-size, cover);
          background-position: var(--photo-position, center);
          box-shadow: 0 28px 72px color-mix(in srgb, var(--brand-primary), transparent 78%);
        }

        .full-site-preview.layout-minimal-luxo .mini-hero-copy,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy.align-left,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy.align-center,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy.align-right,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy.place-top,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy.place-middle,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy.place-bottom {
          position: relative !important;
          grid-column: 2;
          inset: auto !important;
          transform: none !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          color: var(--brand-primary) !important;
          text-shadow: none !important;
          text-align: left !important;
        }

        /* Black tie, corporativo neon e festa palco */
        .full-site-preview.layout-black-tie .mini-hero-preview,
        .full-site-preview.layout-corporativo-neon .mini-hero-preview,
        .full-site-preview.layout-festa-palco .mini-hero-preview {
          min-height: 660px;
          position: relative;
          display: grid;
          grid-template-columns: minmax(320px, 0.45fr) minmax(0, 0.55fr);
          align-items: center;
          padding: 60px;
          overflow: hidden;
          background: #090a10 !important;
        }

        .full-site-preview.layout-black-tie .visual-photo-layer,
        .full-site-preview.layout-corporativo-neon .visual-photo-layer,
        .full-site-preview.layout-festa-palco .visual-photo-layer {
          position: absolute !important;
          inset: 0 0 0 auto !important;
          width: 62%;
          min-height: 100%;
          opacity: 1;
          z-index: 1;
          background-size: var(--photo-size, cover);
          background-position: var(--photo-position, center);
        }

        .full-site-preview.layout-black-tie .visual-photo-layer::after {
          background: linear-gradient(90deg, #090a10 0%, rgba(9,10,16,0.96) 24%, rgba(9,10,16,0.48) 62%, rgba(9,10,16,0.18) 100%) !important;
        }

        .full-site-preview.layout-corporativo-neon .visual-photo-layer::after {
          background:
            radial-gradient(circle at 60% 35%, rgba(18,215,255,0.20), transparent 28%),
            linear-gradient(90deg, #071424 0%, rgba(7,20,36,0.94) 28%, rgba(7,20,36,0.42) 68%, rgba(7,20,36,0.12) 100%) !important;
        }

        .full-site-preview.layout-festa-palco .visual-photo-layer::after {
          background:
            radial-gradient(circle at 68% 40%, rgba(255,198,64,0.22), transparent 24%),
            linear-gradient(90deg, rgba(52,18,77,0.96) 0%, rgba(52,18,77,0.80) 34%, rgba(52,18,77,0.25) 72%, rgba(52,18,77,0.06) 100%) !important;
        }

        .full-site-preview.layout-black-tie .visual-photo-shape,
        .full-site-preview.layout-corporativo-neon .visual-photo-shape,
        .full-site-preview.layout-festa-palco .visual-photo-shape {
          display: none !important;
        }

        .full-site-preview.layout-black-tie .mini-hero-copy,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy,
        .full-site-preview.layout-festa-palco .mini-hero-copy,
        .full-site-preview.layout-black-tie .mini-hero-copy.align-left,
        .full-site-preview.layout-black-tie .mini-hero-copy.align-center,
        .full-site-preview.layout-black-tie .mini-hero-copy.align-right,
        .full-site-preview.layout-black-tie .mini-hero-copy.place-top,
        .full-site-preview.layout-black-tie .mini-hero-copy.place-middle,
        .full-site-preview.layout-black-tie .mini-hero-copy.place-bottom,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy.align-left,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy.align-center,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy.align-right,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy.place-top,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy.place-middle,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy.place-bottom,
        .full-site-preview.layout-festa-palco .mini-hero-copy.align-left,
        .full-site-preview.layout-festa-palco .mini-hero-copy.align-center,
        .full-site-preview.layout-festa-palco .mini-hero-copy.align-right,
        .full-site-preview.layout-festa-palco .mini-hero-copy.place-top,
        .full-site-preview.layout-festa-palco .mini-hero-copy.place-middle,
        .full-site-preview.layout-festa-palco .mini-hero-copy.place-bottom {
          position: relative !important;
          z-index: 2;
          grid-column: 1;
          inset: auto !important;
          transform: none !important;
          width: min(94%, 570px) !important;
          padding: 0 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          color: #fffdf8 !important;
          text-shadow: 0 14px 36px rgba(0,0,0,0.42) !important;
          text-align: left !important;
        }

        .full-site-preview.layout-corporativo-neon .mini-hero-copy strong,
        .full-site-preview.layout-festa-palco .mini-hero-copy strong {
          color: #fffdf8 !important;
        }

        .full-site-preview.layout-corporativo-neon .preview-meta,
        .full-site-preview.layout-black-tie .preview-meta,
        .full-site-preview.layout-festa-palco .preview-meta {
          background: rgba(255,255,255,0.10) !important;
          color: rgba(255,253,248,0.88) !important;
          border-color: rgba(255,255,255,0.18) !important;
        }

        .full-site-preview.layout-corporativo-neon .preview-meta i,
        .full-site-preview.layout-festa-palco .preview-meta i {
          background: var(--brand-secondary) !important;
        }

        /* Papéis de parede do Passo 5 */
        .full-site-preview.atmosphere-geometrico-3d-branco {
          background:
            linear-gradient(135deg, rgba(255,255,255,0.92), rgba(238,235,229,0.92)),
            conic-gradient(from 45deg at 18px 18px, #f7f7f5 0 25%, #e4e1dc 0 50%, #fbfaf7 0 75%, #d8d5cf 0) !important;
          background-size: auto, 72px 72px !important;
        }

        .full-site-preview.atmosphere-cubos-clean {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.88), rgba(235,238,244,0.88)),
            linear-gradient(30deg, rgba(47,52,65,0.08) 12%, transparent 12.5%, transparent 87%, rgba(47,52,65,0.08) 87.5%, rgba(47,52,65,0.08)),
            linear-gradient(150deg, rgba(47,52,65,0.08) 12%, transparent 12.5%, transparent 87%, rgba(47,52,65,0.08) 87.5%, rgba(47,52,65,0.08)),
            linear-gradient(30deg, rgba(174,182,198,0.15) 12%, transparent 12.5%, transparent 87%, rgba(174,182,198,0.15) 87.5%, rgba(174,182,198,0.15)) !important;
          background-size: auto, 82px 142px, 82px 142px, 82px 142px !important;
        }

        .full-site-preview.atmosphere-losango-champagne {
          background:
            linear-gradient(180deg, rgba(255,253,248,0.88), rgba(238,228,212,0.88)),
            linear-gradient(45deg, rgba(216,193,165,0.22) 25%, transparent 25%, transparent 75%, rgba(216,193,165,0.22) 75%),
            linear-gradient(45deg, rgba(90,64,57,0.08) 25%, transparent 25%, transparent 75%, rgba(90,64,57,0.08) 75%) !important;
          background-position: 0 0, 0 0, 32px 32px !important;
          background-size: auto, 64px 64px, 64px 64px !important;
        }

        .full-site-preview.atmosphere-ripas-madeira {
          background:
            linear-gradient(180deg, rgba(252,245,235,0.82), rgba(236,219,198,0.82)),
            repeating-linear-gradient(90deg, #7b4d31 0 12px, #b9793f 12px 22px, #e3b27a 22px 29px, #8c5735 29px 42px) !important;
          background-size: auto, auto !important;
        }

        .full-site-preview.atmosphere-marmore-preto-dourado {
          background:
            radial-gradient(circle at 18% 22%, rgba(212,175,55,0.28), transparent 20%),
            linear-gradient(120deg, transparent 0 34%, rgba(212,175,55,0.22) 35% 36%, transparent 38% 100%),
            linear-gradient(180deg, #08080d 0%, #15131c 52%, #07070b 100%) !important;
          color: #fffdf8;
        }

        .full-site-preview.atmosphere-ouro-glitter {
          background:
            radial-gradient(circle at 16% 18%, rgba(255,255,255,0.78) 0 2px, transparent 3px),
            radial-gradient(circle at 62% 22%, rgba(255,255,255,0.48) 0 2px, transparent 4px),
            radial-gradient(circle at 82% 76%, rgba(255,255,255,0.42) 0 3px, transparent 5px),
            linear-gradient(135deg, #5f3b09 0%, #d4a536 45%, #f5d36c 100%) !important;
          background-size: 58px 58px, 82px 82px, 112px 112px, auto !important;
        }

        .full-site-preview.atmosphere-metal-ouro {
          background:
            linear-gradient(115deg, rgba(255,255,255,0.20), transparent 24%, rgba(0,0,0,0.16) 48%, rgba(255,255,255,0.20) 72%, transparent),
            repeating-linear-gradient(135deg, #6a4b14 0 10px, #d7b35a 10px 22px, #8a651d 22px 34px, #f3d984 34px 42px) !important;
        }

        .full-site-preview.atmosphere-folhagem-elegante {
          background:
            linear-gradient(180deg, rgba(246,244,235,0.90), rgba(220,228,216,0.90)),
            radial-gradient(ellipse at 20% 18%, rgba(38,60,51,0.18) 0 70px, transparent 72px),
            radial-gradient(ellipse at 88% 44%, rgba(191,163,106,0.22) 0 90px, transparent 92px),
            linear-gradient(120deg, transparent 0 48%, rgba(38,60,51,0.13) 49% 50%, transparent 51% 100%) !important;
          background-size: auto, auto, auto, 110px 110px !important;
        }

        .full-site-preview.atmosphere-floral-escuro {
          background:
            radial-gradient(circle at 16% 18%, rgba(212,147,163,0.26), transparent 22%),
            radial-gradient(circle at 88% 20%, rgba(212,147,163,0.20), transparent 18%),
            radial-gradient(circle at 75% 82%, rgba(255,255,255,0.07), transparent 22%),
            linear-gradient(180deg, #160d18 0%, #2a1428 100%) !important;
          color: #fffdf8;
        }

        .full-site-preview.atmosphere-doodle-divertido {
          background:
            linear-gradient(180deg, rgba(255,251,241,0.92), rgba(246,237,222,0.92)),
            radial-gradient(circle at 10px 12px, rgba(39,54,74,0.22) 0 2px, transparent 3px),
            linear-gradient(45deg, transparent 0 42%, rgba(240,162,58,0.26) 43% 45%, transparent 46%),
            linear-gradient(-45deg, transparent 0 46%, rgba(39,54,74,0.12) 47% 49%, transparent 50%) !important;
          background-size: auto, 44px 44px, 78px 78px, 92px 92px !important;
        }

        .full-site-preview.atmosphere-confete-festa {
          background:
            radial-gradient(circle at 14% 18%, #ffcc66 0 5px, transparent 6px),
            radial-gradient(circle at 72% 26%, #5eead4 0 4px, transparent 5px),
            radial-gradient(circle at 44% 72%, #ff7ab6 0 5px, transparent 6px),
            linear-gradient(135deg, #fff4df 0%, #f7e2ff 50%, #e1f5ff 100%) !important;
          background-size: 92px 92px, 74px 74px, 118px 118px, auto !important;
        }

        .full-site-preview.atmosphere-neon-corporativo {
          background:
            radial-gradient(circle at 82% 18%, rgba(18,215,255,0.34), transparent 28%),
            radial-gradient(circle at 14% 76%, rgba(139,92,246,0.24), transparent 22%),
            linear-gradient(90deg, rgba(18,215,255,0.08) 1px, transparent 1px),
            linear-gradient(180deg, rgba(18,215,255,0.08) 1px, transparent 1px),
            linear-gradient(180deg, #06101f 0%, #071424 100%) !important;
          background-size: auto, auto, 56px 56px, 56px 56px, auto !important;
          color: #f8fbff;
        }

        .full-site-preview.atmosphere-linhas-cinza {
          background:
            linear-gradient(180deg, rgba(250,250,250,0.92), rgba(232,232,232,0.92)),
            linear-gradient(28deg, transparent 0 48%, rgba(52,50,58,0.16) 49% 50%, transparent 51%),
            linear-gradient(-28deg, transparent 0 48%, rgba(52,50,58,0.10) 49% 50%, transparent 51%) !important;
          background-size: auto, 86px 86px, 116px 116px !important;
        }

        .full-site-preview.atmosphere-tecido-champagne {
          background:
            linear-gradient(180deg, rgba(255,251,244,0.86), rgba(237,222,202,0.86)),
            repeating-linear-gradient(0deg, rgba(90,64,57,0.045) 0 1px, transparent 1px 7px),
            repeating-linear-gradient(90deg, rgba(216,193,165,0.13) 0 1px, transparent 1px 8px) !important;
        }

        .full-site-preview.atmosphere-marmore-preto-dourado .mini-site-section,
        .full-site-preview.atmosphere-marmore-preto-dourado .mini-site-card,
        .full-site-preview.atmosphere-marmore-preto-dourado .message-preview,
        .full-site-preview.atmosphere-marmore-preto-dourado .gallery-preview,
        .full-site-preview.atmosphere-floral-escuro .mini-site-section,
        .full-site-preview.atmosphere-floral-escuro .mini-site-card,
        .full-site-preview.atmosphere-floral-escuro .message-preview,
        .full-site-preview.atmosphere-floral-escuro .gallery-preview,
        .full-site-preview.atmosphere-neon-corporativo .mini-site-section,
        .full-site-preview.atmosphere-neon-corporativo .mini-site-card,
        .full-site-preview.atmosphere-neon-corporativo .message-preview,
        .full-site-preview.atmosphere-neon-corporativo .gallery-preview {
          background: rgba(255,255,255,0.09) !important;
          border-color: rgba(255,255,255,0.16) !important;
          color: #fffdf8 !important;
        }

        .full-site-preview.atmosphere-marmore-preto-dourado .countdown-preview-premium,
        .full-site-preview.atmosphere-metal-ouro .countdown-preview-premium {
          background:
            linear-gradient(115deg, rgba(212,175,55,0.30), transparent 28%, rgba(255,255,255,0.14) 50%, transparent 70%),
            linear-gradient(135deg, #08080d, #4c3510) !important;
          border: 1px solid rgba(212,175,55,0.38) !important;
        }

        .full-site-preview.atmosphere-ouro-glitter .countdown-preview-premium,
        .full-site-preview.atmosphere-confete-festa .countdown-preview-premium {
          background:
            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.60) 0 3px, transparent 4px),
            radial-gradient(circle at 78% 22%, rgba(255,255,255,0.42) 0 3px, transparent 5px),
            linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) !important;
        }

        .full-site-preview.atmosphere-neon-corporativo .countdown-preview-premium {
          background:
            radial-gradient(circle at 70% 25%, rgba(18,215,255,0.36), transparent 32%),
            linear-gradient(135deg, #04101c, #06243a) !important;
          border: 1px solid rgba(18,215,255,0.32) !important;
          box-shadow: 0 28px 76px rgba(18,215,255,0.14) !important;
        }

        .full-site-preview.atmosphere-ripas-madeira .countdown-preview-premium {
          background:
            linear-gradient(135deg, rgba(91,57,40,0.96), rgba(201,139,77,0.88)) !important;
        }

        .full-site-preview.atmosphere-geometrico-3d-branco .mini-site-section,
        .full-site-preview.atmosphere-cubos-clean .mini-site-section,
        .full-site-preview.atmosphere-losango-champagne .mini-site-section,
        .full-site-preview.atmosphere-linhas-cinza .mini-site-section,
        .full-site-preview.atmosphere-tecido-champagne .mini-site-section {
          background: rgba(255,255,255,0.74) !important;
        }

        @media (max-width: 900px) {
          .full-site-preview.layout-esquerda-esfumada .mini-hero-preview,
          .full-site-preview.layout-split-curvo .mini-hero-preview,
          .full-site-preview.layout-minimal-luxo .mini-hero-preview,
          .full-site-preview.layout-black-tie .mini-hero-preview,
          .full-site-preview.layout-corporativo-neon .mini-hero-preview,
          .full-site-preview.layout-festa-palco .mini-hero-preview {
            grid-template-columns: 1fr;
            min-height: 620px;
            padding: 36px 24px;
          }

          .full-site-preview.layout-esquerda-esfumada .visual-photo-layer,
          .full-site-preview.layout-black-tie .visual-photo-layer,
          .full-site-preview.layout-corporativo-neon .visual-photo-layer,
          .full-site-preview.layout-festa-palco .visual-photo-layer {
            width: 100%;
          }

          .full-site-preview.layout-split-curvo .visual-photo-shape,
          .full-site-preview.layout-minimal-luxo .visual-photo-shape {
            grid-column: 1;
            grid-row: auto;
            height: 340px;
            border-radius: 30px;
          }

          .full-site-preview.layout-split-curvo .mini-hero-copy,
          .full-site-preview.layout-minimal-luxo .mini-hero-copy,
          .full-site-preview.layout-esquerda-esfumada .mini-hero-copy,
          .full-site-preview.layout-black-tie .mini-hero-copy,
          .full-site-preview.layout-corporativo-neon .mini-hero-copy,
          .full-site-preview.layout-festa-palco .mini-hero-copy {
            grid-column: 1;
            grid-row: auto;
            text-align: center !important;
          }
        }


        /* ===== V5 ETAPA 4.1 — PASSO 5 IMPACTO REAL ===== */
        /* O card do modelo não escreve mais por cima do papel de parede. A amostra fica em cima, texto fica embaixo. */
        .style-grid .atmosphere-option {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 12px !important;
          min-height: 238px !important;
          padding: 14px !important;
          text-align: left !important;
          align-items: stretch !important;
          background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,250,244,.90)) !important;
          border: 1px solid rgba(130, 96, 60, .14) !important;
          box-shadow: 0 14px 36px rgba(34, 24, 18, .07) !important;
        }

        .style-grid .atmosphere-option::before,
        .style-grid .atmosphere-option::after {
          display: none !important;
          content: none !important;
        }

        .style-grid .atmosphere-option .style-icon-wrap {
          display: none !important;
        }

        .style-grid .atmosphere-option .style-label {
          z-index: 2 !important;
          max-width: 100% !important;
          display: grid !important;
          gap: 6px !important;
          padding: 0 2px 2px !important;
          color: #2d2527 !important;
          position: relative !important;
        }

        .style-grid .atmosphere-option .style-label strong {
          font-size: 15px !important;
          line-height: 1.15 !important;
          letter-spacing: -.01em !important;
        }

        .style-grid .atmosphere-option .style-label small {
          font-size: 12px !important;
          line-height: 1.45 !important;
          color: rgba(45, 37, 39, .66) !important;
        }

        .style-grid .atmosphere-option.active {
          transform: translateY(-2px) !important;
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 8%) !important;
          box-shadow: 0 22px 54px color-mix(in srgb, var(--brand-primary), transparent 82%) !important;
        }

        .style-grid .atmosphere-option.active .style-label strong {
          color: var(--brand-primary) !important;
        }

        .atmosphere-preview-swatch {
          position: relative !important;
          display: block !important;
          width: 100% !important;
          height: 132px !important;
          border-radius: 24px !important;
          overflow: hidden !important;
          border: 1px solid rgba(255,255,255,.68) !important;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,.04), 0 18px 38px rgba(32,20,20,.12) !important;
          isolation: isolate !important;
        }

        .atmosphere-preview-swatch i {
          position: absolute !important;
          inset: auto 14px 14px auto !important;
          width: 58px !important;
          height: 26px !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,.76) !important;
          border: 1px solid rgba(255,255,255,.72) !important;
          box-shadow: 0 10px 26px rgba(0,0,0,.16) !important;
        }

        .atmosphere-preview-swatch::before,
        .atmosphere-preview-swatch::after {
          content: "" !important;
          position: absolute !important;
          pointer-events: none !important;
        }

        .atmosphere-swatch-roxo-luxo {
          background:
            radial-gradient(circle at 18% 16%, rgba(211,175,103,.30), transparent 24%),
            radial-gradient(circle at 84% 82%, rgba(255,255,255,.10), transparent 28%),
            linear-gradient(135deg, #13071b, #3a1550 55%, #16091f) !important;
        }
        .atmosphere-swatch-roxo-luxo::before {
          inset: 0 !important;
          background: repeating-linear-gradient(135deg, rgba(255,255,255,.08) 0 1px, transparent 1px 18px) !important;
          opacity: .55 !important;
        }

        .atmosphere-swatch-clean-luxo,
        .atmosphere-swatch-seda-champagne {
          background:
            radial-gradient(circle at 22% 10%, rgba(196,162,98,.28), transparent 28%),
            linear-gradient(135deg, #fff8ec, #ead7b8 62%, #fffdf8) !important;
        }
        .atmosphere-swatch-clean-luxo::before,
        .atmosphere-swatch-seda-champagne::before {
          inset: 0 !important;
          background: repeating-linear-gradient(35deg, rgba(120,82,44,.08) 0 1px, transparent 1px 10px) !important;
        }

        .atmosphere-swatch-offwhite-3d {
          background: conic-gradient(from 45deg, #ffffff 0 25%, #e8e5dd 0 50%, #fbfaf6 0 75%, #d7d4cb 0) !important;
          background-size: 44px 44px !important;
        }
        .atmosphere-swatch-offwhite-3d::before {
          inset: 0 !important;
          background: linear-gradient(135deg, rgba(255,255,255,.42), rgba(0,0,0,.06)) !important;
        }

        .atmosphere-swatch-art-deco-dourado {
          background:
            linear-gradient(135deg, transparent 0 47%, rgba(90,52,30,.20) 48% 49%, transparent 50% 100%),
            linear-gradient(45deg, transparent 0 47%, rgba(196,162,98,.32) 48% 49%, transparent 50% 100%),
            linear-gradient(135deg, #fff2d0, #c99b45) !important;
          background-size: 54px 54px, 54px 54px, auto !important;
        }

        .atmosphere-swatch-marmore-noite,
        .atmosphere-swatch-preto-ouro {
          background:
            linear-gradient(115deg, transparent 0 38%, rgba(212,175,55,.62) 39% 41%, transparent 42%),
            linear-gradient(35deg, transparent 0 60%, rgba(255,255,255,.16) 61% 62%, transparent 64%),
            radial-gradient(circle at 20% 16%, rgba(212,175,55,.32), transparent 24%),
            linear-gradient(135deg, #050508, #17111d 54%, #050508) !important;
        }

        .atmosphere-swatch-folhagem-fina {
          background:
            radial-gradient(ellipse at 18% 32%, rgba(63,79,69,.30), transparent 24%),
            radial-gradient(ellipse at 78% 54%, rgba(196,162,98,.24), transparent 22%),
            linear-gradient(135deg, #edf3e7, #cbd9bf) !important;
        }
        .atmosphere-swatch-folhagem-fina::before {
          inset: 0 !important;
          background: radial-gradient(ellipse at 28px 36px, rgba(63,79,69,.20), transparent 22px) !important;
          background-size: 72px 58px !important;
        }

        .atmosphere-swatch-floral-noturno {
          background:
            radial-gradient(circle at 18% 28%, rgba(212,147,163,.42), transparent 18%),
            radial-gradient(circle at 82% 16%, rgba(196,162,98,.28), transparent 17%),
            radial-gradient(circle at 68% 78%, rgba(212,147,163,.22), transparent 22%),
            linear-gradient(135deg, #130b15, #321834 60%, #0e0a10) !important;
        }

        .atmosphere-swatch-azul-corporativo {
          background:
            linear-gradient(90deg, rgba(18,215,255,.22) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.14) 1px, transparent 1px),
            radial-gradient(circle at 80% 26%, rgba(18,215,255,.38), transparent 20%),
            linear-gradient(135deg, #06111f, #0d1f32) !important;
          background-size: 24px 24px, 24px 24px, auto, auto !important;
        }

        .atmosphere-swatch-festa-glow-premium {
          background:
            conic-gradient(from 65deg at 70% 32%, rgba(255,255,255,.28), transparent 26%, rgba(255,179,71,.56), transparent 74%),
            radial-gradient(circle at 18% 80%, rgba(255,179,71,.34), transparent 24%),
            linear-gradient(135deg, #1b0d2b, #43226d 50%, #8b4d2e) !important;
        }

        .atmosphere-swatch-pattern-fino {
          background:
            radial-gradient(circle at 12px 12px, rgba(67,38,63,.20) 0 1px, transparent 2px),
            linear-gradient(45deg, transparent 0 42%, rgba(196,162,98,.20) 43% 45%, transparent 46% 100%),
            linear-gradient(135deg, #fffdf8, #f0e7dc) !important;
          background-size: 28px 28px, 74px 74px, auto !important;
        }

        /* Passo 5: mudanças fortes na contagem sem apagar a paleta escolhida no Passo 4. */
        .full-site-preview .countdown-preview-premium {
          position: relative !important;
          overflow: hidden !important;
          isolation: isolate !important;
          padding: clamp(40px, 5vw, 68px) clamp(22px, 4vw, 42px) !important;
          transition: border-radius .25s ease, clip-path .25s ease, background .25s ease, box-shadow .25s ease !important;
        }

        .full-site-preview .countdown-preview-premium::before,
        .full-site-preview .countdown-preview-premium::after {
          content: "" !important;
          position: absolute !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }

        /* Roxo luxo — números soltos, sem cartões pesados. */
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium > span,
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium p {
          color: color-mix(in srgb, var(--brand-primary), #ffffff 12%) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row {
          gap: 22px !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row strong {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          min-width: 92px !important;
          min-height: 92px !important;
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row b {
          font-size: clamp(48px, 6.5vw, 82px) !important;
          line-height: .8 !important;
          color: var(--brand-secondary) !important;
          text-shadow: 0 18px 40px color-mix(in srgb, var(--brand-primary), transparent 60%) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row small {
          color: var(--brand-primary) !important;
          letter-spacing: .22em !important;
        }

        /* Champagne clean — faixa inteira. */
        .full-site-preview.atmosphere-clean-luxo .countdown-preview-premium,
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium {
          margin-left: clamp(-34px, -4vw, -18px) !important;
          margin-right: clamp(-34px, -4vw, -18px) !important;
          border-radius: 0 !important;
          background: linear-gradient(100deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 36%)) !important;
          box-shadow: 0 30px 86px color-mix(in srgb, var(--brand-primary), transparent 66%) !important;
        }
        .full-site-preview.atmosphere-clean-luxo .countdown-card-row strong,
        .full-site-preview.atmosphere-seda-champagne .countdown-card-row strong {
          border-radius: 999px !important;
          background: color-mix(in srgb, #ffffff, var(--brand-secondary) 8%) !important;
          min-height: 98px !important;
        }

        /* Off-white 3D — bloquinhos com sombra dura. */
        .full-site-preview.atmosphere-offwhite-3d .countdown-preview-premium {
          background: linear-gradient(135deg, #ffffff, color-mix(in srgb, #ffffff, var(--brand-secondary) 11%)) !important;
          color: var(--brand-primary) !important;
          border: 1px solid rgba(0,0,0,.06) !important;
          box-shadow: 12px 14px 0 color-mix(in srgb, var(--brand-primary), transparent 84%), 0 28px 70px rgba(0,0,0,.10) !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-preview-premium > span,
        .full-site-preview.atmosphere-offwhite-3d .countdown-preview-premium p {
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-card-row strong {
          border-radius: 14px !important;
          transform: translateY(-4px) !important;
          box-shadow: 8px 9px 0 color-mix(in srgb, var(--brand-secondary), transparent 42%), 0 18px 30px rgba(0,0,0,.09) !important;
        }

        /* Art déco — moldura geométrica. */
        .full-site-preview.atmosphere-art-deco-dourado .countdown-preview-premium {
          border-radius: 8px 48px 8px 48px !important;
          outline: 2px solid color-mix(in srgb, var(--brand-secondary), transparent 25%) !important;
          outline-offset: -12px !important;
          background: linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), #000 18%)) !important;
        }
        .full-site-preview.atmosphere-art-deco-dourado .countdown-card-row strong {
          border-radius: 0 30px 0 30px !important;
          outline: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 15%) !important;
          outline-offset: -8px !important;
        }

        /* Mármore/preto ouro — faixa escura que cobre o fundo. */
        .full-site-preview.atmosphere-marmore-noite .countdown-preview-premium,
        .full-site-preview.atmosphere-preto-ouro .countdown-preview-premium {
          margin-left: clamp(-34px, -4vw, -18px) !important;
          margin-right: clamp(-34px, -4vw, -18px) !important;
          border-radius: 0 !important;
          background:
            linear-gradient(115deg, transparent 0 42%, color-mix(in srgb, var(--brand-secondary), transparent 30%) 43% 44%, transparent 45%),
            linear-gradient(135deg, #060507, color-mix(in srgb, var(--brand-primary), #050505 50%)) !important;
          border-top: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 35%) !important;
          border-bottom: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 35%) !important;
        }
        .full-site-preview.atmosphere-marmore-noite .countdown-card-row strong,
        .full-site-preview.atmosphere-preto-ouro .countdown-card-row strong {
          border-radius: 18px !important;
          background: linear-gradient(180deg, rgba(255,255,255,.98), color-mix(in srgb, #ffffff, var(--brand-secondary) 16%)) !important;
          box-shadow: 0 26px 70px rgba(0,0,0,.28), inset 0 0 0 1px rgba(255,255,255,.74) !important;
        }

        /* Floral noturno — faixa rasgada. */
        .full-site-preview.atmosphere-floral-noturno .countdown-preview-premium {
          border-radius: 0 !important;
          clip-path: polygon(0 8%, 7% 2%, 16% 7%, 26% 0, 37% 8%, 48% 3%, 58% 10%, 70% 4%, 82% 9%, 93% 2%, 100% 8%, 100% 93%, 91% 98%, 79% 91%, 68% 99%, 55% 93%, 43% 100%, 31% 92%, 21% 98%, 11% 91%, 0 97%) !important;
          background: linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), #000 18%)) !important;
        }
        .full-site-preview.atmosphere-floral-noturno .countdown-card-row strong {
          border-radius: 50% 50% 46% 54% / 52% 45% 55% 48% !important;
          min-height: 112px !important;
        }

        /* Folhagem — orgânico assimétrico. */
        .full-site-preview.atmosphere-folhagem-fina .countdown-preview-premium {
          border-radius: 52px 18px 52px 18px !important;
          background: linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #ffffff 5%), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 30%)) !important;
        }
        .full-site-preview.atmosphere-folhagem-fina .countdown-card-row strong {
          border-radius: 60% 40% 52% 48% / 44% 62% 38% 56% !important;
          min-height: 112px !important;
        }

        /* Azul corporativo — painel digital neon. */
        .full-site-preview.atmosphere-azul-corporativo .countdown-preview-premium {
          background:
            linear-gradient(90deg, color-mix(in srgb, var(--brand-secondary), transparent 88%) 1px, transparent 1px),
            linear-gradient(0deg, color-mix(in srgb, var(--brand-secondary), transparent 90%) 1px, transparent 1px),
            linear-gradient(135deg, #06111f, color-mix(in srgb, var(--brand-primary), #000 20%)) !important;
          background-size: 34px 34px, 34px 34px, auto !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 42%) !important;
          box-shadow: 0 0 0 1px rgba(255,255,255,.04), 0 0 70px color-mix(in srgb, var(--brand-secondary), transparent 78%) !important;
        }
        .full-site-preview.atmosphere-azul-corporativo .countdown-card-row strong {
          border-radius: 8px !important;
          background: rgba(255,255,255,.90) !important;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--brand-secondary), transparent 34%), 0 0 34px color-mix(in srgb, var(--brand-secondary), transparent 78%) !important;
        }

        /* Festa glow — tickets quebrados. */
        .full-site-preview.atmosphere-festa-glow-premium .countdown-preview-premium {
          background: linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 34%)) !important;
          border-radius: 34px !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong {
          border-radius: 22px 6px 22px 6px !important;
          transform: rotate(-2.2deg) translateY(-2px) !important;
          clip-path: polygon(0 8%, 8% 0, 100% 0, 92% 8%, 100% 16%, 100% 100%, 0 100%, 8% 92%, 0 84%) !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong:nth-child(even) {
          transform: rotate(2.2deg) translateY(4px) !important;
        }

        /* Pattern fino — só números e dizeres soltos, sem fundo. */
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium > span,
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium p {
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row strong {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          min-height: auto !important;
          min-width: 84px !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row b {
          font-size: clamp(42px, 5.6vw, 68px) !important;
          color: var(--brand-secondary) !important;
          text-shadow: 0 14px 34px color-mix(in srgb, var(--brand-primary), transparent 72%) !important;
        }


        /* ===== V5 ETAPA 4.2 — PASSO 5 IMPACTO PREMIUM REAL ===== */
        /* Objetivo: Passo 5 muda fundo + estrutura da contagem de forma forte, sem sobrescrever as cores do Passo 4. */

        .style-grid {
          align-items: stretch !important;
        }

        .style-grid .atmosphere-option {
          min-height: 268px !important;
          border-radius: 30px !important;
          padding: 16px !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.98), rgba(248,242,234,.94)) !important;
          box-shadow:
            0 18px 42px rgba(23, 15, 12, .08),
            inset 0 0 0 1px rgba(255,255,255,.76) !important;
        }

        .style-grid .atmosphere-option:hover {
          transform: translateY(-3px) !important;
          box-shadow:
            0 28px 70px rgba(23, 15, 12, .13),
            inset 0 0 0 1px rgba(255,255,255,.82) !important;
        }

        .style-grid .atmosphere-option.active {
          outline: 2px solid color-mix(in srgb, var(--brand-secondary), transparent 12%) !important;
          outline-offset: 3px !important;
        }

        .style-grid .atmosphere-option .style-label {
          padding: 2px 4px 0 !important;
        }

        .style-grid .atmosphere-option .style-label strong {
          font-size: 16px !important;
          font-weight: 900 !important;
        }

        .style-grid .atmosphere-option .style-label small {
          font-size: 12.5px !important;
          line-height: 1.42 !important;
        }

        .atmosphere-preview-swatch {
          height: 156px !important;
          border-radius: 26px !important;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.52),
            inset 0 -48px 80px rgba(0,0,0,.12),
            0 20px 42px rgba(28,18,16,.15) !important;
        }

        .atmosphere-preview-swatch i {
          inset: auto 12px 12px 12px !important;
          width: auto !important;
          height: 34px !important;
          border-radius: 999px !important;
          display: grid !important;
          place-items: center !important;
          background: rgba(255,255,255,.82) !important;
          color: rgba(33, 21, 28, .82) !important;
          font-style: normal !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          letter-spacing: .12em !important;
          text-transform: uppercase !important;
          box-shadow: 0 14px 28px rgba(0,0,0,.16) !important;
        }

        .atmosphere-preview-swatch i::before {
          content: "Prévia do fundo" !important;
        }

        .atmosphere-preview-swatch::after {
          inset: 18px 18px auto auto !important;
          width: 58px !important;
          height: 42px !important;
          border-radius: 14px !important;
          background: rgba(255,255,255,.30) !important;
          border: 1px solid rgba(255,255,255,.42) !important;
          box-shadow: 0 14px 30px rgba(0,0,0,.16) !important;
        }

        .atmosphere-swatch-roxo-luxo {
          background:
            radial-gradient(circle at 16% 10%, rgba(237,203,127,.38), transparent 18%),
            radial-gradient(circle at 84% 80%, rgba(132,74,176,.35), transparent 24%),
            repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 1px, transparent 1px 18px),
            linear-gradient(135deg, #0b0611 0%, #2d1140 48%, #180624 100%) !important;
        }
        .atmosphere-swatch-roxo-luxo::after {
          border-radius: 50% !important;
          background: radial-gradient(circle, rgba(237,203,127,.72), rgba(255,255,255,.16) 62%, transparent 63%) !important;
        }
        .atmosphere-swatch-roxo-luxo i::before { content: "números soltos" !important; }

        .atmosphere-swatch-clean-luxo {
          background:
            linear-gradient(90deg, transparent 0 9%, rgba(255,255,255,.56) 10% 28%, transparent 29%),
            radial-gradient(circle at 22% 18%, rgba(203,168,104,.28), transparent 18%),
            linear-gradient(135deg, #fffbf4, #ead9bc 58%, #fffefa) !important;
        }
        .atmosphere-swatch-clean-luxo::after {
          left: 16px !important;
          right: 16px !important;
          top: 54px !important;
          width: auto !important;
          height: 28px !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,.76) !important;
        }
        .atmosphere-swatch-clean-luxo i::before { content: "faixa champagne" !important; }

        .atmosphere-swatch-offwhite-3d {
          background:
            linear-gradient(145deg, rgba(255,255,255,.88), rgba(255,255,255,.08)),
            conic-gradient(from 45deg at 50% 50%, #ffffff 0 25%, #dfddd5 0 50%, #faf9f4 0 75%, #cfccc3 0) !important;
          background-size: auto, 42px 42px !important;
        }
        .atmosphere-swatch-offwhite-3d::after {
          transform: translateY(2px) rotate(-3deg) !important;
          box-shadow: 7px 8px 0 rgba(155,142,115,.24), 0 14px 30px rgba(0,0,0,.14) !important;
        }
        .atmosphere-swatch-offwhite-3d i::before { content: "bloquinhos 3D" !important; }

        .atmosphere-swatch-art-deco-dourado {
          background:
            linear-gradient(135deg, transparent 0 46%, rgba(79,38,36,.22) 47% 49%, transparent 50%),
            linear-gradient(45deg, transparent 0 46%, rgba(218,177,85,.42) 47% 49%, transparent 50%),
            radial-gradient(circle at 50% 12%, rgba(255,255,255,.48), transparent 22%),
            linear-gradient(135deg, #fff2cf, #c78d35) !important;
          background-size: 58px 58px, 58px 58px, auto, auto !important;
        }
        .atmosphere-swatch-art-deco-dourado::after {
          border-radius: 4px 18px 4px 18px !important;
          outline: 1px solid rgba(255,255,255,.62) !important;
          outline-offset: -6px !important;
        }
        .atmosphere-swatch-art-deco-dourado i::before { content: "art déco" !important; }

        .atmosphere-swatch-seda-champagne {
          background:
            radial-gradient(ellipse at 12% 0%, rgba(255,255,255,.72), transparent 28%),
            radial-gradient(ellipse at 74% 18%, rgba(171,121,72,.18), transparent 26%),
            repeating-linear-gradient(35deg, rgba(255,255,255,.11) 0 2px, transparent 2px 12px),
            linear-gradient(135deg, #f7ead9, #d2ad82 54%, #f7eadc) !important;
        }
        .atmosphere-swatch-seda-champagne::after {
          left: -12px !important;
          right: -12px !important;
          top: 50px !important;
          width: auto !important;
          height: 38px !important;
          border-radius: 999px !important;
          transform: rotate(-3deg) !important;
          background: rgba(255,255,255,.54) !important;
        }
        .atmosphere-swatch-seda-champagne i::before { content: "faixa curva" !important; }

        .atmosphere-swatch-marmore-noite {
          background:
            linear-gradient(116deg, transparent 0 34%, rgba(218,177,85,.68) 35% 36%, transparent 37%),
            linear-gradient(35deg, transparent 0 65%, rgba(255,255,255,.16) 66% 67%, transparent 68%),
            radial-gradient(circle at 14% 18%, rgba(218,177,85,.24), transparent 20%),
            linear-gradient(135deg, #030306, #16131c 54%, #050508) !important;
        }
        .atmosphere-swatch-marmore-noite::after {
          left: 0 !important;
          right: 0 !important;
          top: 54px !important;
          width: auto !important;
          height: 34px !important;
          border-radius: 0 !important;
          background: rgba(255,255,255,.18) !important;
        }
        .atmosphere-swatch-marmore-noite i::before { content: "faixa inteira" !important; }

        .atmosphere-swatch-preto-ouro {
          background:
            radial-gradient(circle at 82% 18%, rgba(218,177,85,.34), transparent 18%),
            linear-gradient(135deg, rgba(218,177,85,.50) 0 1px, transparent 1px 12px),
            linear-gradient(135deg, #060505, #241a27 60%, #080607) !important;
        }
        .atmosphere-swatch-preto-ouro::after {
          width: 78px !important;
          height: 78px !important;
          border-radius: 50% !important;
          background: conic-gradient(from 45deg, rgba(218,177,85,.70), rgba(255,255,255,.10), rgba(218,177,85,.55)) !important;
        }
        .atmosphere-swatch-preto-ouro i::before { content: "ouro espelhado" !important; }

        .atmosphere-swatch-folhagem-fina {
          background:
            radial-gradient(ellipse at 18% 36%, rgba(57,77,63,.32), transparent 25%),
            radial-gradient(ellipse at 70% 22%, rgba(196,162,98,.28), transparent 22%),
            radial-gradient(ellipse at 82% 76%, rgba(57,77,63,.20), transparent 24%),
            linear-gradient(135deg, #f0f5eb, #c8d5bd) !important;
        }
        .atmosphere-swatch-folhagem-fina::after {
          border-radius: 64% 36% 55% 45% / 42% 62% 38% 58% !important;
          background: rgba(255,255,255,.64) !important;
        }
        .atmosphere-swatch-folhagem-fina i::before { content: "orgânico" !important; }

        .atmosphere-swatch-floral-noturno {
          background:
            radial-gradient(circle at 18% 28%, rgba(232,139,165,.45), transparent 16%),
            radial-gradient(circle at 78% 18%, rgba(218,177,85,.30), transparent 16%),
            radial-gradient(circle at 68% 78%, rgba(232,139,165,.24), transparent 20%),
            repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 1px, transparent 1px 16px),
            linear-gradient(135deg, #100911, #321635 60%, #09060a) !important;
        }
        .atmosphere-swatch-floral-noturno::after {
          left: 4px !important;
          right: 4px !important;
          top: 54px !important;
          width: auto !important;
          height: 44px !important;
          border-radius: 0 !important;
          clip-path: polygon(0 14%, 10% 0, 22% 14%, 33% 2%, 48% 18%, 61% 4%, 74% 15%, 87% 0, 100% 14%, 100% 88%, 88% 100%, 70% 86%, 56% 100%, 42% 84%, 24% 100%, 12% 86%, 0 100%) !important;
          background: rgba(255,255,255,.62) !important;
        }
        .atmosphere-swatch-floral-noturno i::before { content: "faixa rasgada" !important; }

        .atmosphere-swatch-azul-corporativo {
          background:
            linear-gradient(90deg, rgba(18,215,255,.16) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.12) 1px, transparent 1px),
            radial-gradient(circle at 78% 28%, rgba(18,215,255,.40), transparent 20%),
            linear-gradient(135deg, #05101e, #0e2239) !important;
          background-size: 24px 24px, 24px 24px, auto, auto !important;
        }
        .atmosphere-swatch-azul-corporativo::after {
          border-radius: 8px !important;
          background: rgba(255,255,255,.18) !important;
          box-shadow: 0 0 30px rgba(18,215,255,.42), inset 0 0 0 1px rgba(18,215,255,.52) !important;
        }
        .atmosphere-swatch-azul-corporativo i::before { content: "painel neon" !important; }

        .atmosphere-swatch-festa-glow-premium {
          background:
            conic-gradient(from 25deg at 72% 35%, rgba(255,255,255,.32), transparent 20%, rgba(255,179,71,.64), transparent 72%),
            radial-gradient(circle at 18% 78%, rgba(255,179,71,.38), transparent 22%),
            linear-gradient(135deg, #170b24, #45206b 48%, #a95431) !important;
        }
        .atmosphere-swatch-festa-glow-premium::after {
          border-radius: 18px 4px 18px 4px !important;
          transform: rotate(-5deg) !important;
          clip-path: polygon(0 12%, 10% 0, 100% 0, 90% 12%, 100% 24%, 100% 100%, 0 100%, 10% 88%, 0 76%) !important;
          background: rgba(255,255,255,.70) !important;
        }
        .atmosphere-swatch-festa-glow-premium i::before { content: "ticket premium" !important; }

        .atmosphere-swatch-pattern-fino {
          background:
            radial-gradient(circle at 12px 12px, rgba(67,38,63,.16) 0 1px, transparent 2px),
            linear-gradient(45deg, transparent 0 43%, rgba(196,162,98,.18) 44% 45%, transparent 46%),
            radial-gradient(circle at 82% 20%, rgba(196,162,98,.24), transparent 18%),
            linear-gradient(135deg, #fffdf8, #efe5d8) !important;
          background-size: 28px 28px, 72px 72px, auto, auto !important;
        }
        .atmosphere-swatch-pattern-fino::after {
          display: none !important;
        }
        .atmosphere-swatch-pattern-fino i::before { content: "só números" !important; }

        /* Fundos do mini site: menos infantil, mais editoriais e com profundidade. */
        .full-site-preview.atmosphere-roxo-luxo {
          background:
            radial-gradient(circle at 8% 8%, rgba(211,175,103,.28), transparent 18%),
            radial-gradient(circle at 92% 6%, rgba(255,255,255,.10), transparent 16%),
            radial-gradient(circle at 88% 88%, rgba(123,58,178,.34), transparent 24%),
            repeating-linear-gradient(135deg, rgba(255,255,255,.045) 0 1px, transparent 1px 20px),
            linear-gradient(135deg, #0c0613 0%, #2f1245 52%, #100617 100%) !important;
        }

        .full-site-preview.atmosphere-clean-luxo {
          background:
            radial-gradient(circle at 18% 8%, rgba(196,162,98,.24), transparent 21%),
            linear-gradient(90deg, rgba(255,255,255,.40), transparent 18% 82%, rgba(255,255,255,.38)),
            linear-gradient(135deg, #fffaf0, #ead8bd 60%, #fffefa) !important;
        }

        .full-site-preview.atmosphere-offwhite-3d {
          background:
            linear-gradient(145deg, rgba(255,255,255,.78), rgba(255,255,255,.10)),
            conic-gradient(from 45deg, #ffffff 0 25%, #e0ded6 0 50%, #faf8f2 0 75%, #ccc9c0 0) !important;
          background-size: auto, 56px 56px !important;
        }

        .full-site-preview.atmosphere-art-deco-dourado {
          background:
            linear-gradient(135deg, transparent 0 47%, rgba(52,29,40,.16) 48% 49%, transparent 50%),
            linear-gradient(45deg, transparent 0 47%, rgba(202,164,93,.28) 48% 49%, transparent 50%),
            linear-gradient(135deg, #fff2cf, #c79745) !important;
          background-size: 82px 82px, 82px 82px, auto !important;
        }

        .full-site-preview.atmosphere-seda-champagne {
          background:
            radial-gradient(ellipse at 10% 0%, rgba(255,255,255,.66), transparent 25%),
            repeating-linear-gradient(35deg, rgba(255,255,255,.10) 0 2px, transparent 2px 14px),
            linear-gradient(135deg, #f7ead9, #d2ad82 54%, #f7eadc) !important;
        }

        .full-site-preview.atmosphere-marmore-noite {
          background:
            linear-gradient(116deg, transparent 0 38%, rgba(212,175,55,.48) 39% 40%, transparent 41%),
            linear-gradient(35deg, transparent 0 64%, rgba(255,255,255,.12) 65% 66%, transparent 67%),
            radial-gradient(circle at 14% 18%, rgba(212,175,55,.24), transparent 22%),
            linear-gradient(135deg, #030306, #17131d 54%, #050508) !important;
        }

        .full-site-preview.atmosphere-preto-ouro {
          background:
            radial-gradient(circle at 82% 18%, rgba(218,177,85,.26), transparent 20%),
            repeating-linear-gradient(135deg, rgba(218,177,85,.12) 0 1px, transparent 1px 18px),
            linear-gradient(135deg, #060505, #221828 60%, #080607) !important;
        }

        .full-site-preview.atmosphere-floral-noturno {
          background:
            radial-gradient(circle at 12% 16%, rgba(212,147,163,.22), transparent 18%),
            radial-gradient(circle at 84% 20%, rgba(212,175,55,.16), transparent 16%),
            radial-gradient(circle at 82% 84%, rgba(212,147,163,.16), transparent 22%),
            linear-gradient(135deg, #100911, #321635 60%, #09060a) !important;
        }

        .full-site-preview.atmosphere-azul-corporativo {
          background:
            linear-gradient(90deg, rgba(18,215,255,.10) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.08) 1px, transparent 1px),
            radial-gradient(circle at 78% 25%, rgba(18,215,255,.24), transparent 21%),
            linear-gradient(135deg, #05101e, #0e2239) !important;
          background-size: 38px 38px, 38px 38px, auto, auto !important;
        }

        /* Regras globais da contagem V5.4.2 */
        .full-site-preview .countdown-preview-premium {
          overflow: visible !important;
          isolation: isolate !important;
          border: 0 !important;
        }

        .full-site-preview .countdown-preview-premium > span {
          position: relative !important;
          z-index: 2 !important;
          font-weight: 950 !important;
          letter-spacing: .26em !important;
        }

        .full-site-preview .countdown-card-row {
          position: relative !important;
          z-index: 2 !important;
        }

        .full-site-preview .countdown-card-row strong {
          position: relative !important;
          display: grid !important;
          place-items: center !important;
          align-content: center !important;
          min-height: 108px !important;
          min-width: 108px !important;
          padding: 16px 14px !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.97), color-mix(in srgb, #ffffff, var(--brand-secondary) 13%)) !important;
          color: var(--brand-primary) !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 36%) !important;
          box-shadow: 0 22px 48px color-mix(in srgb, var(--brand-primary), transparent 86%) !important;
        }

        .full-site-preview .countdown-card-row b {
          color: var(--brand-secondary) !important;
          font-weight: 950 !important;
          letter-spacing: -.06em !important;
        }

        .full-site-preview .countdown-card-row small {
          color: color-mix(in srgb, var(--brand-primary), #000000 14%) !important;
          font-weight: 900 !important;
        }

        /* Roxo luxo: números soltos, sem fundo, bem editorial. */
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium {
          padding-block: clamp(56px, 7vw, 92px) !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row strong {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          min-width: 112px !important;
          min-height: 116px !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row b {
          font-size: clamp(64px, 8vw, 108px) !important;
          color: var(--brand-secondary) !important;
          text-shadow:
            0 3px 0 color-mix(in srgb, var(--brand-primary), #000 25%),
            0 24px 54px color-mix(in srgb, var(--brand-secondary), transparent 54%) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row small {
          color: rgba(255,255,255,.82) !important;
          letter-spacing: .24em !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium p,
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium > span {
          color: rgba(255,255,255,.84) !important;
        }

        /* Champagne: faixa clara inteira, sem deixar o fundo competir. */
        .full-site-preview.atmosphere-clean-luxo .countdown-preview-premium,
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium {
          margin-inline: clamp(-42px, -5vw, -20px) !important;
          border-radius: 0 !important;
          background:
            radial-gradient(ellipse at 12% 0%, rgba(255,255,255,.74), transparent 34%),
            linear-gradient(135deg, color-mix(in srgb, #ffffff, var(--brand-secondary) 8%), color-mix(in srgb, #ffffff, var(--brand-secondary) 22%)) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.80), inset 0 -1px 0 rgba(145,100,58,.13), 0 28px 70px rgba(70,45,24,.08) !important;
        }
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium {
          border-radius: 999px 0 999px 0 !important;
          transform: rotate(-.8deg) !important;
        }
        .full-site-preview.atmosphere-seda-champagne .countdown-card-row,
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium > span,
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium p {
          transform: rotate(.8deg) !important;
        }

        /* Off-white 3D: bloquinhos com sombra deslocada. */
        .full-site-preview.atmosphere-offwhite-3d .countdown-preview-premium {
          background: rgba(255,255,255,.42) !important;
          border-radius: 28px !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-card-row strong {
          border-radius: 10px !important;
          transform: translateY(-5px) rotate(-1deg) !important;
          box-shadow:
            10px 12px 0 color-mix(in srgb, var(--brand-secondary), transparent 48%),
            0 22px 44px rgba(20,20,20,.12) !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-card-row strong:nth-child(even) {
          transform: translateY(6px) rotate(1deg) !important;
        }

        /* Art déco: moldura luxuosa e blocos cortados. */
        .full-site-preview.atmosphere-art-deco-dourado .countdown-preview-premium {
          border-radius: 6px 54px 6px 54px !important;
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #000 10%), color-mix(in srgb, var(--brand-primary), #000 28%)) !important;
          outline: 2px solid color-mix(in srgb, var(--brand-secondary), transparent 18%) !important;
          outline-offset: -14px !important;
        }
        .full-site-preview.atmosphere-art-deco-dourado .countdown-card-row strong {
          border-radius: 0 32px 0 32px !important;
          outline: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 18%) !important;
          outline-offset: -8px !important;
          background: rgba(255,255,255,.96) !important;
        }

        /* Mármore e preto ouro: faixa inteira preta/dourada cobrindo o fundo. */
        .full-site-preview.atmosphere-marmore-noite .countdown-preview-premium,
        .full-site-preview.atmosphere-preto-ouro .countdown-preview-premium {
          margin-inline: clamp(-42px, -5vw, -20px) !important;
          border-radius: 0 !important;
          background:
            linear-gradient(118deg, transparent 0 40%, color-mix(in srgb, var(--brand-secondary), transparent 22%) 41% 42%, transparent 43%),
            linear-gradient(135deg, #030304, color-mix(in srgb, var(--brand-primary), #030304 55%)) !important;
          box-shadow: 0 32px 80px rgba(0,0,0,.28) !important;
          border-top: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 34%) !important;
          border-bottom: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 34%) !important;
        }
        .full-site-preview.atmosphere-marmore-noite .countdown-card-row strong,
        .full-site-preview.atmosphere-preto-ouro .countdown-card-row strong {
          border-radius: 18px !important;
          background: linear-gradient(180deg, rgba(255,255,255,.98), color-mix(in srgb, #ffffff, var(--brand-secondary) 16%)) !important;
          box-shadow: 0 28px 74px rgba(0,0,0,.34), inset 0 0 0 1px rgba(255,255,255,.78) !important;
        }
        .full-site-preview.atmosphere-marmore-noite .countdown-preview-premium > span,
        .full-site-preview.atmosphere-preto-ouro .countdown-preview-premium > span,
        .full-site-preview.atmosphere-marmore-noite .countdown-preview-premium p,
        .full-site-preview.atmosphere-preto-ouro .countdown-preview-premium p {
          color: rgba(255,255,255,.86) !important;
        }

        /* Floral noturno: faixa rasgada dramática. */
        .full-site-preview.atmosphere-floral-noturno .countdown-preview-premium {
          margin-inline: clamp(-34px, -4vw, -18px) !important;
          border-radius: 0 !important;
          clip-path: polygon(0 7%, 7% 1%, 17% 8%, 27% 0, 37% 7%, 49% 2%, 58% 9%, 71% 3%, 82% 9%, 92% 1%, 100% 7%, 100% 93%, 91% 99%, 79% 91%, 68% 99%, 55% 93%, 43% 100%, 31% 92%, 21% 98%, 11% 91%, 0 98%) !important;
          background:
            radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--brand-secondary), transparent 72%), transparent 22%),
            linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #000 6%), color-mix(in srgb, var(--brand-primary), #000 24%)) !important;
        }
        .full-site-preview.atmosphere-floral-noturno .countdown-card-row strong {
          border-radius: 50% 50% 44% 56% / 52% 45% 55% 48% !important;
          min-height: 118px !important;
        }

        /* Folhagem: orgânico assimétrico. */
        .full-site-preview.atmosphere-folhagem-fina .countdown-preview-premium {
          border-radius: 58px 18px 58px 18px !important;
          background:
            radial-gradient(ellipse at 14% 18%, color-mix(in srgb, var(--brand-secondary), transparent 74%), transparent 24%),
            linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #ffffff 7%), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 28%)) !important;
        }
        .full-site-preview.atmosphere-folhagem-fina .countdown-card-row strong {
          border-radius: 63% 37% 53% 47% / 42% 64% 36% 58% !important;
          min-height: 116px !important;
        }

        /* Corporativo: painel digital neon. */
        .full-site-preview.atmosphere-azul-corporativo .countdown-preview-premium {
          background:
            linear-gradient(90deg, color-mix(in srgb, var(--brand-secondary), transparent 86%) 1px, transparent 1px),
            linear-gradient(0deg, color-mix(in srgb, var(--brand-secondary), transparent 88%) 1px, transparent 1px),
            linear-gradient(135deg, #06111f, color-mix(in srgb, var(--brand-primary), #000 24%)) !important;
          background-size: 34px 34px, 34px 34px, auto !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 42%) !important;
          border-radius: 18px !important;
          box-shadow: 0 0 0 1px rgba(255,255,255,.04), 0 0 80px color-mix(in srgb, var(--brand-secondary), transparent 76%) !important;
        }
        .full-site-preview.atmosphere-azul-corporativo .countdown-card-row strong {
          border-radius: 8px !important;
          background: rgba(255,255,255,.92) !important;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--brand-secondary), transparent 34%), 0 0 38px color-mix(in srgb, var(--brand-secondary), transparent 72%) !important;
        }

        /* Festa: tickets quebrados, mais movimento. */
        .full-site-preview.atmosphere-festa-glow-premium .countdown-preview-premium {
          background:
            conic-gradient(from 50deg at 80% 20%, color-mix(in srgb, var(--brand-secondary), transparent 36%), transparent 22%, rgba(255,255,255,.14), transparent 75%),
            linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 38%)) !important;
          border-radius: 34px !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong {
          border-radius: 24px 6px 24px 6px !important;
          transform: rotate(-3deg) translateY(-2px) !important;
          clip-path: polygon(0 10%, 10% 0, 100% 0, 90% 10%, 100% 20%, 100% 100%, 0 100%, 10% 90%, 0 80%) !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong:nth-child(even) {
          transform: rotate(3deg) translateY(5px) !important;
        }

        /* Pattern fino: números soltos em fundo claro. */
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium {
          background: transparent !important;
          box-shadow: none !important;
          padding-block: clamp(50px, 7vw, 84px) !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row strong {
          min-width: 110px !important;
          min-height: 112px !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row b {
          font-size: clamp(60px, 7.2vw, 94px) !important;
          color: var(--brand-secondary) !important;
          text-shadow: 0 18px 44px color-mix(in srgb, var(--brand-primary), transparent 78%) !important;
        }


        /* ===== V5 ETAPA 4.5A — CORREÇÃO DA FOTO NOS MODELOS DO PASSO 2 ===== */
        /* O bug estava no uso de background: ... com !important na moldura da foto.
           Esse shorthand apagava o background-image inline da foto escolhida em alguns modelos.
           A partir daqui só usamos background-color e reforçamos que todas as capas precisam exibir a mídia escolhida. */
        .full-site-preview .visual-photo-layer,
        .full-site-preview .visual-photo-shape {
          background-repeat: no-repeat !important;
          background-position: var(--photo-position, center) !important;
        }

        .full-site-preview .visual-photo-shape {
          background-color: rgba(255,255,255,.48) !important;
        }

        .full-site-preview.layout-circular .visual-photo-shape,
        .full-site-preview.layout-oval .visual-photo-shape,
        .full-site-preview.layout-foto-moldura .visual-photo-shape,
        .full-site-preview.layout-editorial-cartao .visual-photo-shape,
        .full-site-preview.layout-convite-luxo .visual-photo-shape,
        .full-site-preview.layout-centralizado .visual-photo-shape,
        .full-site-preview.layout-poster-editorial .visual-photo-shape,
        .full-site-preview.layout-split-curvo .visual-photo-shape,
        .full-site-preview.layout-minimal-luxo .visual-photo-shape {
          background-size: var(--photo-size, cover) !important;
        }

        .full-site-preview.layout-circular .visual-photo-shape,
        .full-site-preview.layout-oval .visual-photo-shape,
        .full-site-preview.layout-foto-moldura .visual-photo-shape,
        .full-site-preview.layout-editorial-cartao .visual-photo-shape,
        .full-site-preview.layout-convite-luxo .visual-photo-shape,
        .full-site-preview.layout-centralizado .visual-photo-shape,
        .full-site-preview.layout-poster-editorial .visual-photo-shape,
        .full-site-preview.layout-split-curvo .visual-photo-shape,
        .full-site-preview.layout-minimal-luxo .visual-photo-shape {
          display: block !important;
        }

        .full-site-preview.layout-monograma-clean .mini-hero-preview {
          grid-template-rows: auto auto !important;
          gap: 28px !important;
        }

        .full-site-preview.layout-monograma-clean .visual-photo-layer {
          display: none !important;
        }

        .full-site-preview.layout-monograma-clean .visual-photo-shape {
          display: block !important;
          width: clamp(170px, 26vw, 260px) !important;
          height: clamp(170px, 26vw, 260px) !important;
          border-radius: 999px !important;
          background-size: var(--photo-size, cover) !important;
          background-position: var(--photo-position, center) !important;
          background-color: rgba(255,255,255,.58) !important;
          border: 8px solid rgba(255,255,255,.82) !important;
          box-shadow: 0 24px 70px color-mix(in srgb, var(--brand-primary), transparent 80%) !important;
        }

        .full-site-preview.layout-faixa-convite .visual-photo-layer,
        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer,
        .full-site-preview.layout-black-tie .visual-photo-layer,
        .full-site-preview.layout-corporativo-neon .visual-photo-layer,
        .full-site-preview.layout-festa-palco .visual-photo-layer,
        .full-site-preview.layout-tela-cheia .visual-photo-layer,
        .full-site-preview.layout-cinematografica .visual-photo-layer {
          display: block !important;
          background-size: var(--photo-size, cover) !important;
          background-position: var(--photo-position, center) !important;
        }


      `}</style>
      <style jsx global>{`
        .full-site-preview .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview .mini-hero-copy strong.vivalista-live-title.title-size-delicado,
        .full-site-preview .mini-hero-copy strong.vivalista-live-title.title-size-medio,
        .full-site-preview .mini-hero-copy strong.vivalista-live-title.title-size-grande,
        .full-site-preview .mini-hero-copy strong.vivalista-live-title.title-size-impactante {
          font-size: ${liveTitleSize}px !important;
          line-height: 1.03 !important;
        }

        .full-site-preview .mini-hero-copy strong.vivalista-live-title span {
          font-size: inherit !important;
          line-height: inherit !important;
        }


        /* ===== V4.12 — RESTAURAÇÃO DO COMPORTAMENTO CERTO ===== */
        /* Passo 4 manda nas cores. Passo 5 muda fundo/estrutura sem trocar a paleta. */
        .full-site-preview .mini-hero-copy strong.vivalista-live-title {
          color: currentColor !important;
        }

        .full-site-preview .mini-hero-copy strong.vivalista-live-title span {
          color: var(--brand-secondary) !important;
        }

        .full-site-preview.layout-circular .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-oval .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy strong.vivalista-live-title {
          color: var(--brand-primary) !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-black-tie .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-festa-palco .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy strong.vivalista-live-title,
        .full-site-preview.layout-split-curvo .mini-hero-copy strong.vivalista-live-title {
          color: #fffdf8 !important;
          text-shadow: 0 12px 34px rgba(0, 0, 0, 0.32) !important;
        }

        .full-site-preview .preview-meta {
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 54%) !important;
          background: color-mix(in srgb, var(--brand-primary), transparent 82%) !important;
          color: currentColor !important;
        }

        .full-site-preview .preview-meta span:first-child {
          color: var(--brand-secondary) !important;
          font-weight: 900 !important;
        }

        .full-site-preview .preview-meta span:last-child {
          color: currentColor !important;
          opacity: 0.92 !important;
          font-weight: 800 !important;
        }

        .full-site-preview .preview-meta i {
          background: var(--brand-secondary) !important;
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-secondary), transparent 82%) !important;
        }

        .full-site-preview .countdown-preview-premium,
        .full-site-preview[class*="atmosphere-"] .countdown-preview-premium {
          background:
            radial-gradient(circle at 10% 18%, color-mix(in srgb, var(--brand-secondary), transparent 64%), transparent 25%),
            radial-gradient(circle at 92% 84%, color-mix(in srgb, var(--brand-secondary), transparent 68%), transparent 27%),
            linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), #000000 18%)) !important;
          color: #fffdf8 !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 58%) !important;
          box-shadow: 0 28px 70px color-mix(in srgb, var(--brand-primary), transparent 76%) !important;
        }

        .full-site-preview .countdown-preview-premium > span,
        .full-site-preview[class*="atmosphere-"] .countdown-preview-premium > span {
          color: color-mix(in srgb, var(--brand-secondary), #fffdf8 16%) !important;
        }

        .full-site-preview .countdown-preview-premium .countdown-card-row strong,
        .full-site-preview[class*="atmosphere-"] .countdown-preview-premium .countdown-card-row strong {
          background: linear-gradient(180deg, rgba(255, 253, 248, 0.96), color-mix(in srgb, var(--brand-secondary), #ffffff 88%)) !important;
          color: var(--brand-primary) !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 54%) !important;
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255,255,255,0.62) !important;
        }

        .full-site-preview .countdown-preview-premium .countdown-card-row b,
        .full-site-preview[class*="atmosphere-"] .countdown-preview-premium .countdown-card-row b {
          color: var(--brand-secondary) !important;
        }

        .full-site-preview .countdown-preview-premium .countdown-card-row small,
        .full-site-preview[class*="atmosphere-"] .countdown-preview-premium .countdown-card-row small {
          color: color-mix(in srgb, var(--brand-primary), #ffffff 24%) !important;
        }

        .full-site-preview .countdown-preview-premium p,
        .full-site-preview[class*="atmosphere-"] .countdown-preview-premium p {
          color: rgba(255, 253, 248, 0.82) !important;
        }

        /* Passo 5: fundos mais adultos/premium, sem cara infantil. */
        .full-site-preview.atmosphere-clean-luxo {
          background:
            radial-gradient(circle at 12% 10%, color-mix(in srgb, var(--brand-secondary), transparent 86%), transparent 22%),
            linear-gradient(135deg, #fffdf8 0%, #f2eadf 100%) !important;
        }

        .full-site-preview.atmosphere-geometrico-3d-branco {
          background-color: #f7f5ef !important;
          background-image:
            linear-gradient(30deg, rgba(255,255,255,.74) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.74) 87.5%, rgba(255,255,255,.74)),
            linear-gradient(150deg, rgba(255,255,255,.74) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.74) 87.5%, rgba(255,255,255,.74)),
            linear-gradient(30deg, rgba(120,120,120,.055) 12%, transparent 12.5%, transparent 87%, rgba(120,120,120,.055) 87.5%, rgba(120,120,120,.055)),
            linear-gradient(150deg, rgba(120,120,120,.055) 12%, transparent 12.5%, transparent 87%, rgba(120,120,120,.055) 87.5%, rgba(120,120,120,.055)) !important;
          background-size: 72px 126px !important;
        }

        .full-site-preview.atmosphere-cubos-clean {
          background:
            linear-gradient(30deg, rgba(45, 54, 66, .055) 12%, transparent 12.5%, transparent 87%, rgba(45, 54, 66, .055) 87.5%),
            linear-gradient(150deg, rgba(45, 54, 66, .055) 12%, transparent 12.5%, transparent 87%, rgba(45, 54, 66, .055) 87.5%),
            linear-gradient(30deg, rgba(255,255,255,.66) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.66) 87.5%),
            linear-gradient(150deg, rgba(255,255,255,.66) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.66) 87.5%),
            #eef0ef !important;
          background-size: 64px 112px !important;
        }

        .full-site-preview.atmosphere-losango-champagne {
          background:
            linear-gradient(45deg, rgba(196,162,98,.13) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(196,162,98,.13) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(67,38,63,.055) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(67,38,63,.055) 75%),
            linear-gradient(135deg, #fff8ec, #eadbc8) !important;
          background-size: 54px 54px !important;
        }

        .full-site-preview.atmosphere-ripas-madeira {
          background:
            repeating-linear-gradient(90deg, rgba(94, 57, 34, .16) 0 9px, rgba(255,255,255,.18) 9px 14px),
            linear-gradient(135deg, #e7d2b9, #b98256) !important;
        }

        .full-site-preview.atmosphere-marmore-preto-dourado {
          background:
            radial-gradient(circle at 18% 18%, rgba(212,175,55,.18), transparent 18%),
            radial-gradient(circle at 82% 62%, rgba(212,175,55,.12), transparent 22%),
            linear-gradient(115deg, transparent 0 38%, rgba(212,175,55,.18) 39%, transparent 41%),
            linear-gradient(135deg, #0a0b10, #1b1720 48%, #07070b) !important;
        }

        .full-site-preview.atmosphere-ouro-glitter {
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,.34) 0 1px, transparent 2px),
            radial-gradient(circle at 70% 38%, rgba(255,255,255,.24) 0 1px, transparent 2px),
            radial-gradient(circle at 42% 78%, rgba(255,255,255,.22) 0 1px, transparent 2px),
            linear-gradient(135deg, #6e430d, #d4a942 46%, #7d4d12) !important;
          background-size: 46px 46px, 62px 62px, 58px 58px, auto !important;
        }

        .full-site-preview.atmosphere-metal-ouro {
          background:
            linear-gradient(120deg, rgba(255,255,255,.18), transparent 20%, rgba(0,0,0,.16) 42%, transparent 58%, rgba(255,255,255,.16) 78%),
            linear-gradient(135deg, #7b561c, #d9bd66, #8a641f) !important;
        }

        .full-site-preview.atmosphere-folhagem-elegante {
          background:
            radial-gradient(ellipse at 18% 24%, rgba(53,90,72,.18), transparent 30%),
            radial-gradient(ellipse at 84% 34%, rgba(53,90,72,.14), transparent 28%),
            linear-gradient(135deg, #eef1e8, #d8e0d0) !important;
        }

        .full-site-preview.atmosphere-floral-escuro {
          background:
            radial-gradient(circle at 18% 30%, rgba(212,147,163,.24), transparent 18%),
            radial-gradient(circle at 82% 18%, rgba(196,162,98,.18), transparent 16%),
            radial-gradient(circle at 68% 78%, rgba(212,147,163,.13), transparent 22%),
            linear-gradient(135deg, #160d17, #301b32 56%, #0f0d12) !important;
        }

        .full-site-preview.atmosphere-pattern-whatsapp,
        .full-site-preview.atmosphere-doodle-divertido {
          background-color: #f3eee5 !important;
          background-image:
            radial-gradient(circle at 12px 12px, color-mix(in srgb, var(--brand-secondary), transparent 76%) 0 1px, transparent 2px),
            radial-gradient(circle at 42px 34px, color-mix(in srgb, var(--brand-primary), transparent 88%) 0 1px, transparent 2px),
            linear-gradient(135deg, rgba(255,255,255,.64), rgba(255,255,255,.24)) !important;
          background-size: 58px 58px, 74px 74px, auto !important;
        }

        .full-site-preview.atmosphere-confete-festa {
          background:
            radial-gradient(circle at 12% 18%, rgba(255,255,255,.22), transparent 8%),
            conic-gradient(from 45deg at 28% 28%, rgba(255,255,255,.20), transparent 20%, rgba(255,255,255,.12) 45%, transparent 70%),
            linear-gradient(135deg, #24123b, #5836a0 44%, #d9783e) !important;
        }

        .full-site-preview.atmosphere-neon-corporativo {
          background:
            radial-gradient(circle at 78% 26%, rgba(18,215,255,.24), transparent 22%),
            linear-gradient(90deg, rgba(18,215,255,.08) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.06) 1px, transparent 1px),
            linear-gradient(135deg, #071424, #0d1f32) !important;
          background-size: auto, 42px 42px, 42px 42px, auto !important;
        }

        .full-site-preview.atmosphere-linhas-cinza {
          background:
            repeating-linear-gradient(135deg, rgba(40,40,45,.055) 0 1px, transparent 1px 22px),
            linear-gradient(135deg, #f7f7f5, #e8e8e4) !important;
        }

        .full-site-preview.atmosphere-tecido-champagne {
          background:
            repeating-linear-gradient(45deg, rgba(196,162,98,.07) 0 2px, transparent 2px 8px),
            repeating-linear-gradient(-45deg, rgba(67,38,63,.035) 0 1px, transparent 1px 10px),
            linear-gradient(135deg, #f5eadc, #e4d2bd) !important;
        }

        .full-site-preview.atmosphere-boho-editorial {
          background:
            radial-gradient(circle at 12% 18%, rgba(196,162,98,.16), transparent 24%),
            radial-gradient(circle at 88% 72%, rgba(111,79,55,.12), transparent 24%),
            linear-gradient(135deg, #f1e5d6, #d7c2aa) !important;
        }

        /* Estrutura da contagem muda por atmosfera, mas as cores continuam sendo as do Passo 4. */
        .full-site-preview.atmosphere-geometrico-3d-branco .countdown-card-row strong,
        .full-site-preview.atmosphere-cubos-clean .countdown-card-row strong,
        .full-site-preview.atmosphere-linhas-cinza .countdown-card-row strong {
          border-radius: 8px !important;
          transform: skew(-1deg) !important;
        }

        .full-site-preview.atmosphere-losango-champagne .countdown-card-row strong,
        .full-site-preview.atmosphere-metal-ouro .countdown-card-row strong {
          border-radius: 22px 6px 22px 6px !important;
        }

        .full-site-preview.atmosphere-marmore-preto-dourado .countdown-card-row strong,
        .full-site-preview.atmosphere-noite-premium .countdown-card-row strong,
        .full-site-preview.atmosphere-neon-corporativo .countdown-card-row strong {
          background: color-mix(in srgb, var(--brand-primary), #ffffff 8%) !important;
          color: #fffdf8 !important;
          box-shadow: 0 0 28px color-mix(in srgb, var(--brand-secondary), transparent 58%) !important;
        }

        .full-site-preview.atmosphere-marmore-preto-dourado .countdown-card-row small,
        .full-site-preview.atmosphere-noite-premium .countdown-card-row small,
        .full-site-preview.atmosphere-neon-corporativo .countdown-card-row small {
          color: rgba(255,255,255,.78) !important;
        }

        .full-site-preview.atmosphere-ouro-glitter .countdown-card-row strong,
        .full-site-preview.atmosphere-confete-festa .countdown-card-row strong,
        .full-site-preview.atmosphere-festa-vibrante .countdown-card-row strong {
          border-radius: 999px !important;
        }

        .full-site-preview.atmosphere-ripas-madeira .countdown-card-row strong,
        .full-site-preview.atmosphere-tecido-champagne .countdown-card-row strong {
          border-radius: 12px !important;
          box-shadow: 12px 12px 0 color-mix(in srgb, var(--brand-secondary), transparent 78%) !important;
        }

        .full-site-preview.atmosphere-folhagem-elegante .countdown-card-row strong,
        .full-site-preview.atmosphere-romantico-floral .countdown-card-row strong,
        .full-site-preview.atmosphere-floral-escuro .countdown-card-row strong,
        .full-site-preview.atmosphere-boho-editorial .countdown-card-row strong {
          border-radius: 34px 34px 12px 12px !important;
        }

        .full-site-preview.atmosphere-pattern-whatsapp .countdown-card-row strong,
        .full-site-preview.atmosphere-doodle-divertido .countdown-card-row strong,
        .full-site-preview.atmosphere-infantil-delicado .countdown-card-row strong {
          border-radius: 18px !important;
          box-shadow: inset 0 -8px 0 color-mix(in srgb, var(--brand-secondary), transparent 78%), 0 16px 36px rgba(0,0,0,.10) !important;
        }


        /* ===== V4.13 — PASSO 5 PREMIUM + CONTRASTE AUTOMÁTICO ===== */
        /* Regra de ouro: Passo 4 manda na paleta; Passo 5 só muda fundo e estrutura. */
        .full-site-preview {
          --vv-ivory-glass: rgba(255, 253, 248, 0.88);
          --vv-ivory-strong: rgba(255, 253, 248, 0.96);
          --vv-dark-glass: rgba(18, 12, 24, 0.62);
          --vv-premium-shadow: 0 30px 90px rgba(20, 12, 24, 0.18);
        }

        /* Todas as letras da capa obedecem a mistura da paleta escolhida. */
        .full-site-preview .mini-hero-copy strong,
        .full-site-preview .mini-hero-copy strong.title-size-delicado,
        .full-site-preview .mini-hero-copy strong.title-size-medio,
        .full-site-preview .mini-hero-copy strong.title-size-grande,
        .full-site-preview .mini-hero-copy strong.title-size-impactante {
          color: var(--brand-primary) !important;
          text-shadow: none !important;
        }

        .full-site-preview .mini-hero-copy strong span {
          color: var(--brand-secondary) !important;
        }

        .full-site-preview .mini-hero-copy p {
          color: color-mix(in srgb, var(--brand-primary), #ffffff 16%) !important;
        }

        .full-site-preview .preview-meta {
          color: color-mix(in srgb, var(--brand-primary), #111111 8%) !important;
          background: color-mix(in srgb, #ffffff, var(--brand-secondary) 12%) !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 42%) !important;
          box-shadow: 0 14px 38px color-mix(in srgb, var(--brand-primary), transparent 88%) !important;
        }

        .full-site-preview .preview-meta span:first-child {
          color: var(--brand-secondary) !important;
          font-weight: 900 !important;
        }

        .full-site-preview .preview-meta span:last-child {
          color: var(--brand-primary) !important;
          font-weight: 800 !important;
        }

        .full-site-preview .preview-meta i {
          background: var(--brand-secondary) !important;
        }

        /* Se o fundo do Passo 5 for escuro, a capa ganha proteção automática sem trocar a cor escolhida. */
        .full-site-preview:is(
          .atmosphere-roxo-luxo,
          .atmosphere-marmore-preto-dourado,
          .atmosphere-noite-premium,
          .atmosphere-floral-escuro,
          .atmosphere-neon-corporativo,
          .atmosphere-confete-festa
        ) .mini-hero-copy.frame-solto,
        .full-site-preview:is(
          .atmosphere-roxo-luxo,
          .atmosphere-marmore-preto-dourado,
          .atmosphere-noite-premium,
          .atmosphere-floral-escuro,
          .atmosphere-neon-corporativo,
          .atmosphere-confete-festa
        ) .mini-hero-copy.frame-retangular,
        .full-site-preview:is(
          .atmosphere-roxo-luxo,
          .atmosphere-marmore-preto-dourado,
          .atmosphere-noite-premium,
          .atmosphere-floral-escuro,
          .atmosphere-neon-corporativo,
          .atmosphere-confete-festa
        ) .mini-hero-copy.frame-quadrado {
          background: linear-gradient(135deg, rgba(255,253,248,0.94), rgba(255,253,248,0.74)) !important;
          border: 1px solid rgba(255,255,255,0.72) !important;
          box-shadow: 0 28px 82px rgba(0,0,0,0.24) !important;
          backdrop-filter: blur(16px) saturate(1.08) !important;
          -webkit-backdrop-filter: blur(16px) saturate(1.08) !important;
          padding: clamp(18px, 3vw, 36px) !important;
          border-radius: 32px !important;
          text-shadow: none !important;
        }

        .full-site-preview:is(
          .atmosphere-roxo-luxo,
          .atmosphere-marmore-preto-dourado,
          .atmosphere-noite-premium,
          .atmosphere-floral-escuro,
          .atmosphere-neon-corporativo,
          .atmosphere-confete-festa
        ) .mini-hero-copy.frame-solto .preview-meta {
          background: rgba(255,255,255,0.60) !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 48%) !important;
          padding-left: calc(18px * var(--copy-scale, 1)) !important;
          padding-right: calc(18px * var(--copy-scale, 1)) !important;
        }

        /* A foto continua visível, mas o texto não morre quando fundo/foto são escuros. */
        .full-site-preview.layout-tela-cheia .mini-hero-copy,
        .full-site-preview.layout-cinematografica .mini-hero-copy,
        .full-site-preview.layout-centralizado .mini-hero-copy {
          background: linear-gradient(135deg, rgba(255,253,248,0.82), rgba(255,253,248,0.56)) !important;
          border: 1px solid rgba(255,255,255,0.62) !important;
          box-shadow: 0 24px 76px rgba(0,0,0,0.22) !important;
          backdrop-filter: blur(14px) saturate(1.06) !important;
          -webkit-backdrop-filter: blur(14px) saturate(1.06) !important;
        }

        /* Contagem: mantém exatamente a paleta do Passo 4. Passo 5 só muda formato, textura e composição. */
        .full-site-preview .countdown-preview-premium {
          background:
            radial-gradient(circle at 14% 16%, color-mix(in srgb, var(--brand-secondary), transparent 54%), transparent 28%),
            linear-gradient(135deg, var(--brand-primary) 0%, color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 34%) 100%) !important;
          color: #fffdf8 !important;
          border: 0 !important;
          box-shadow: 0 30px 86px color-mix(in srgb, var(--brand-primary), transparent 64%) !important;
        }

        .full-site-preview .countdown-preview-premium > span {
          color: color-mix(in srgb, var(--brand-secondary), #ffffff 12%) !important;
          text-shadow: 0 10px 30px rgba(0,0,0,0.22) !important;
        }

        .full-site-preview .countdown-card-row strong {
          background: rgba(255,255,255,0.94) !important;
          color: var(--brand-primary) !important;
          border: 1px solid rgba(255,255,255,0.58) !important;
          box-shadow: 0 16px 38px rgba(0,0,0,0.14) !important;
        }

        .full-site-preview .countdown-card-row b {
          color: var(--brand-secondary) !important;
        }

        .full-site-preview .countdown-card-row small {
          color: color-mix(in srgb, var(--brand-primary), #111111 10%) !important;
        }

        .full-site-preview .countdown-preview-premium p {
          color: rgba(255,253,248,0.82) !important;
        }

        /* Atmosferas refeitas: menos infantis, mais papel de parede premium. */
        .full-site-preview.atmosphere-roxo-luxo {
          background:
            radial-gradient(circle at 18% 12%, rgba(211,175,103,0.22), transparent 24%),
            radial-gradient(circle at 86% 76%, rgba(255,255,255,0.08), transparent 28%),
            repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 18px),
            linear-gradient(135deg, #1b0d27 0%, #321344 48%, #140919 100%) !important;
          color: #fffdf8;
        }

        .full-site-preview.atmosphere-roxo-luxo::before {
          background:
            radial-gradient(circle at 20px 20px, rgba(211,175,103,0.12) 0 1px, transparent 2px),
            radial-gradient(circle at 62px 62px, rgba(255,255,255,0.08) 0 1px, transparent 2px),
            linear-gradient(45deg, transparent 0 46%, rgba(211,175,103,0.09) 47% 49%, transparent 50% 100%);
          background-size: 82px 82px, 82px 82px, 118px 118px;
          opacity: .96;
        }

        .full-site-preview.atmosphere-pattern-whatsapp,
        .full-site-preview.atmosphere-doodle-divertido {
          background:
            radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--brand-secondary), transparent 72%), transparent 24%),
            linear-gradient(135deg, color-mix(in srgb, #fffdf8, var(--brand-primary) 4%), color-mix(in srgb, #f5efe5, var(--brand-secondary) 12%)) !important;
        }

        .full-site-preview.atmosphere-pattern-whatsapp::before,
        .full-site-preview.atmosphere-doodle-divertido::before {
          background-image:
            radial-gradient(circle at 12px 12px, color-mix(in srgb, var(--brand-primary), transparent 88%) 0 1px, transparent 2px),
            linear-gradient(45deg, transparent 0 42%, color-mix(in srgb, var(--brand-secondary), transparent 84%) 43% 45%, transparent 46% 100%),
            linear-gradient(-45deg, transparent 0 42%, color-mix(in srgb, var(--brand-primary), transparent 91%) 43% 45%, transparent 46% 100%);
          background-size: 72px 72px, 96px 96px, 96px 96px;
          opacity: .72;
        }

        .full-site-preview.atmosphere-geometrico-3d-branco,
        .full-site-preview.atmosphere-cubos-clean {
          background:
            linear-gradient(135deg, rgba(255,255,255,0.92), rgba(236,233,228,0.88)),
            conic-gradient(from 45deg at 50% 50%, #ffffff 0 25%, #e8e5de 0 50%, #f8f7f3 0 75%, #d8d5cd 0) !important;
          background-size: auto, 86px 86px !important;
        }

        .full-site-preview.atmosphere-linhas-cinza {
          background:
            radial-gradient(circle at 88% 16%, rgba(255,255,255,0.7), transparent 26%),
            repeating-linear-gradient(135deg, rgba(35,34,42,.075) 0 1px, transparent 1px 30px),
            linear-gradient(135deg, #f9f8f4, #e7e4dd) !important;
        }

        .full-site-preview.atmosphere-marmore-preto-dourado {
          background:
            linear-gradient(115deg, transparent 0 33%, rgba(212,175,55,0.26) 34% 35%, transparent 37% 100%),
            linear-gradient(35deg, transparent 0 58%, rgba(255,255,255,0.09) 59% 60%, transparent 62% 100%),
            radial-gradient(circle at 20% 18%, rgba(212,175,55,0.18), transparent 24%),
            linear-gradient(135deg, #07070b, #15111e 48%, #08070c) !important;
        }

        .full-site-preview.atmosphere-ouro-glitter,
        .full-site-preview.atmosphere-metal-ouro {
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.42) 0 1px, transparent 3px),
            radial-gradient(circle at 72% 36%, rgba(255,255,255,0.22) 0 2px, transparent 4px),
            linear-gradient(120deg, rgba(255,255,255,.20), transparent 18%, rgba(87,55,10,.20) 44%, transparent 64%, rgba(255,255,255,.14) 82%),
            linear-gradient(135deg, #6b420f, #d1a43c 48%, #7d5019) !important;
          background-size: 72px 72px, 110px 110px, auto, auto !important;
        }

        .full-site-preview.atmosphere-confete-festa {
          background:
            radial-gradient(circle at 78% 22%, rgba(255,255,255,.16), transparent 20%),
            conic-gradient(from 65deg at 70% 32%, rgba(255,255,255,.18), transparent 24%, rgba(255,255,255,.08) 46%, transparent 76%),
            linear-gradient(135deg, #1b0d2b, #43226d 48%, #8b4d2e) !important;
        }

        .full-site-preview.atmosphere-infantil-delicado {
          background:
            radial-gradient(circle at 16% 18%, rgba(255,255,255,.58), transparent 18%),
            radial-gradient(circle at 82% 22%, color-mix(in srgb, var(--brand-secondary), transparent 70%), transparent 20%),
            linear-gradient(135deg, #f8fbff, #f5edf5) !important;
        }

        .full-site-preview.atmosphere-neon-corporativo {
          background:
            radial-gradient(circle at 80% 28%, rgba(18,215,255,.26), transparent 24%),
            radial-gradient(circle at 20% 72%, rgba(140,183,213,.16), transparent 22%),
            linear-gradient(90deg, rgba(18,215,255,.07) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.055) 1px, transparent 1px),
            linear-gradient(135deg, #06111f, #0d1f32) !important;
          background-size: auto, auto, 54px 54px, 54px 54px, auto !important;
        }

        /* Cards do Passo 5 mais adultos/premium, com sensação de catálogo visual. */
        .atmosphere-option {
          position: relative;
          overflow: hidden;
          min-height: 122px;
          background: rgba(255,253,248,0.74) !important;
          border-color: rgba(196,162,98,0.16) !important;
        }

        .atmosphere-option::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 16% 18%, rgba(196,162,98,.20), transparent 24%),
            linear-gradient(135deg, rgba(67,38,63,.06), transparent 62%);
          opacity: .95;
          pointer-events: none;
        }

        .atmosphere-option.active {
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 10%) !important;
          box-shadow: 0 18px 48px color-mix(in srgb, var(--brand-primary), transparent 84%) !important;
        }

        .atmosphere-option .style-label,
        .atmosphere-option .style-icon-wrap {
          position: relative;
          z-index: 1;
        }



        /* ===== V4.14 — CAIXA DO TEXTO ENVOLVE TÍTULO + DATA + LOCAL ===== */
        /* O botão "Só letras" continua sem caixa. Retangular e Quadrado agora aplicam a caixa no conjunto inteiro. */
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado {
          isolation: isolate !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 10px !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular::before,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          z-index: -1 !important;
          border-radius: inherit !important;
          background:
            radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--brand-secondary), transparent 70%), transparent 34%),
            linear-gradient(135deg, rgba(255,253,248,0.90), rgba(255,253,248,0.64)) !important;
          opacity: 1 !important;
          display: block !important;
        }

        .full-site-preview.layout-tela-cheia .mini-hero-preview .mini-hero-copy.frame-retangular::before,
        .full-site-preview.layout-cinematografica .mini-hero-preview .mini-hero-copy.frame-retangular::before,
        .full-site-preview.layout-centralizado .mini-hero-preview .mini-hero-copy.frame-retangular::before,
        .full-site-preview.layout-tela-cheia .mini-hero-preview .mini-hero-copy.frame-quadrado::before,
        .full-site-preview.layout-cinematografica .mini-hero-preview .mini-hero-copy.frame-quadrado::before,
        .full-site-preview.layout-centralizado .mini-hero-preview .mini-hero-copy.frame-quadrado::before {
          background:
            radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--brand-secondary), transparent 64%), transparent 34%),
            linear-gradient(135deg, rgba(255,253,248,0.92), rgba(255,253,248,0.68)) !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular strong,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado strong,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular p,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado p,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular .preview-meta,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado .preview-meta {
          position: relative !important;
          z-index: 1 !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular strong,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado strong {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          text-align: inherit !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular p,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado p {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          text-align: inherit !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular .preview-meta,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado .preview-meta {
          width: 100% !important;
          max-width: 100% !important;
          margin-top: 2px !important;
          padding: 0 !important;
          justify-content: inherit !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          white-space: normal !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular .preview-meta span,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado .preview-meta span {
          background: transparent !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular {
          width: min(84%, 760px) !important;
          min-height: 0 !important;
          padding: clamp(18px, 2.4vw, 30px) clamp(24px, 4vw, 46px) !important;
          border-radius: 34px !important;
          border: 1px solid rgba(255,255,255,0.68) !important;
          background: transparent !important;
          box-shadow: 0 28px 82px rgba(0,0,0,0.22) !important;
          backdrop-filter: blur(16px) saturate(1.08) !important;
          -webkit-backdrop-filter: blur(16px) saturate(1.08) !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado {
          width: min(62%, 440px) !important;
          min-height: min(62vw, 360px) !important;
          aspect-ratio: 1 / 1 !important;
          padding: clamp(20px, 3vw, 34px) !important;
          border-radius: 34px !important;
          border: 1px solid rgba(255,255,255,0.70) !important;
          background: transparent !important;
          box-shadow: 0 28px 82px rgba(0,0,0,0.24) !important;
          backdrop-filter: blur(16px) saturate(1.08) !important;
          -webkit-backdrop-filter: blur(16px) saturate(1.08) !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado strong.vivalista-live-title {
          font-size: min(var(--live-title-size, 40px), 42px) !important;
          line-height: 1.02 !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular.align-left,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado.align-left {
          align-items: flex-start !important;
          text-align: left !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular.align-center,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado.align-center {
          align-items: center !important;
          text-align: center !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-retangular.align-right,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-quadrado.align-right {
          align-items: flex-end !important;
          text-align: right !important;
        }

        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-solto strong,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-solto p,
        .full-site-preview .mini-hero-preview .mini-hero-copy.frame-solto .preview-meta {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }


        /* ===== V5 ETAPA 4 — PASSO 5 PREMIUM REAL ===== */
        /* Regra de produto: Passo 4 manda nas cores. Passo 5 só muda papel de parede, textura e estrutura visual da contagem. */

        .full-site-preview {
          background-attachment: local !important;
          transition: background .28s ease, box-shadow .28s ease, border-color .28s ease !important;
        }

        .full-site-preview::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .92;
          mix-blend-mode: normal;
        }

        /* Papéis de parede premium — adultos, mais limpos e sem dependência de internet. */
        .full-site-preview.atmosphere-roxo-luxo {
          background:
            radial-gradient(circle at 18% 12%, rgba(196, 162, 98, .22), transparent 26%),
            radial-gradient(circle at 86% 76%, rgba(255, 255, 255, .08), transparent 28%),
            linear-gradient(125deg, rgba(255,255,255,.04) 0 8%, transparent 8% 100%),
            linear-gradient(135deg, #16091f 0%, #2f143e 46%, #120718 100%) !important;
          color: #fffdf8 !important;
        }
        .full-site-preview.atmosphere-roxo-luxo::before {
          background:
            radial-gradient(circle at 20px 20px, rgba(211,175,103,.13) 0 1px, transparent 2px),
            radial-gradient(circle at 62px 62px, rgba(255,255,255,.08) 0 1px, transparent 2px),
            repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 19px);
          background-size: 84px 84px, 84px 84px, auto;
        }

        .full-site-preview.atmosphere-clean-luxo,
        .full-site-preview.atmosphere-seda-champagne {
          background:
            radial-gradient(circle at 14% 12%, color-mix(in srgb, var(--brand-secondary), transparent 80%), transparent 28%),
            radial-gradient(circle at 86% 82%, rgba(255,255,255,.72), transparent 26%),
            linear-gradient(135deg, #fffaf2 0%, #efe2d0 100%) !important;
        }
        .full-site-preview.atmosphere-clean-luxo::before,
        .full-site-preview.atmosphere-seda-champagne::before {
          background:
            repeating-linear-gradient(45deg, rgba(125,93,58,.042) 0 1px, transparent 1px 11px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,.20) 0 1px, transparent 1px 14px);
        }

        .full-site-preview.atmosphere-offwhite-3d,
        .full-site-preview.atmosphere-geometrico-3d-branco,
        .full-site-preview.atmosphere-cubos-clean {
          background:
            linear-gradient(135deg, rgba(255,255,255,.96), rgba(236,233,226,.92)),
            conic-gradient(from 45deg at 50% 50%, #ffffff 0 25%, #e8e5dd 0 50%, #fbfaf6 0 75%, #d7d4cb 0) !important;
          background-size: auto, 86px 86px !important;
        }
        .full-site-preview.atmosphere-offwhite-3d::before,
        .full-site-preview.atmosphere-geometrico-3d-branco::before,
        .full-site-preview.atmosphere-cubos-clean::before {
          background:
            linear-gradient(30deg, rgba(255,255,255,.38), transparent 42%),
            linear-gradient(150deg, rgba(90,86,78,.045), transparent 40%);
          background-size: 86px 86px, 86px 86px;
          opacity: .58;
        }

        .full-site-preview.atmosphere-art-deco-dourado,
        .full-site-preview.atmosphere-losango-champagne {
          background:
            radial-gradient(circle at 16% 14%, color-mix(in srgb, var(--brand-secondary), transparent 70%), transparent 24%),
            linear-gradient(135deg, #fff7e6, #ead2ad 52%, #f9efe0) !important;
        }
        .full-site-preview.atmosphere-art-deco-dourado::before,
        .full-site-preview.atmosphere-losango-champagne::before {
          background:
            linear-gradient(135deg, transparent 0 47%, rgba(111,76,36,.12) 48% 49%, transparent 50% 100%),
            linear-gradient(45deg, transparent 0 47%, rgba(196,162,98,.18) 48% 49%, transparent 50% 100%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,.34), transparent 40%);
          background-size: 92px 92px, 92px 92px, 180px 180px;
        }

        .full-site-preview.atmosphere-marmore-noite,
        .full-site-preview.atmosphere-marmore-preto-dourado,
        .full-site-preview.atmosphere-preto-ouro,
        .full-site-preview.atmosphere-noite-premium {
          background:
            linear-gradient(115deg, transparent 0 31%, rgba(212,175,55,.24) 32% 33%, transparent 35% 100%),
            linear-gradient(35deg, transparent 0 58%, rgba(255,255,255,.09) 59% 60%, transparent 62% 100%),
            radial-gradient(circle at 18% 16%, rgba(212,175,55,.18), transparent 24%),
            radial-gradient(circle at 82% 76%, rgba(255,255,255,.07), transparent 28%),
            linear-gradient(135deg, #07070b, #17111d 48%, #08070c) !important;
          color: #fffdf8 !important;
        }
        .full-site-preview.atmosphere-marmore-noite::before,
        .full-site-preview.atmosphere-marmore-preto-dourado::before,
        .full-site-preview.atmosphere-preto-ouro::before,
        .full-site-preview.atmosphere-noite-premium::before {
          background:
            linear-gradient(72deg, transparent 0 72%, rgba(255,255,255,.08) 73% 74%, transparent 75% 100%),
            radial-gradient(circle at 40% 30%, rgba(212,175,55,.12), transparent 19%);
          background-size: 220px 220px, auto;
        }

        .full-site-preview.atmosphere-folhagem-fina,
        .full-site-preview.atmosphere-folhagem-elegante,
        .full-site-preview.atmosphere-jardim-organico {
          background:
            radial-gradient(ellipse at 16% 18%, rgba(63,79,69,.18), transparent 28%),
            radial-gradient(ellipse at 86% 34%, rgba(63,79,69,.13), transparent 27%),
            linear-gradient(135deg, #eef2e7, #d9e1d0) !important;
        }
        .full-site-preview.atmosphere-folhagem-fina::before,
        .full-site-preview.atmosphere-folhagem-elegante::before,
        .full-site-preview.atmosphere-jardim-organico::before {
          background:
            radial-gradient(ellipse at 22px 38px, rgba(63,79,69,.12), transparent 22px),
            radial-gradient(ellipse at 70px 20px, rgba(196,162,98,.10), transparent 20px);
          background-size: 104px 88px;
          opacity: .68;
        }

        .full-site-preview.atmosphere-floral-noturno,
        .full-site-preview.atmosphere-floral-escuro {
          background:
            radial-gradient(circle at 18% 30%, rgba(212,147,163,.24), transparent 18%),
            radial-gradient(circle at 82% 18%, rgba(196,162,98,.18), transparent 16%),
            radial-gradient(circle at 68% 78%, rgba(212,147,163,.13), transparent 22%),
            linear-gradient(135deg, #140c16, #301832 56%, #0e0b12) !important;
          color: #fffdf8 !important;
        }
        .full-site-preview.atmosphere-floral-noturno::before,
        .full-site-preview.atmosphere-floral-escuro::before {
          background:
            radial-gradient(ellipse at 14px 18px, rgba(255,255,255,.06), transparent 18px),
            radial-gradient(ellipse at 58px 52px, rgba(212,147,163,.14), transparent 18px);
          background-size: 98px 98px;
        }

        .full-site-preview.atmosphere-azul-corporativo,
        .full-site-preview.atmosphere-neon-corporativo,
        .full-site-preview.atmosphere-corporativo-premium {
          background:
            radial-gradient(circle at 78% 26%, rgba(18,215,255,.24), transparent 22%),
            radial-gradient(circle at 20% 72%, rgba(140,183,213,.16), transparent 22%),
            linear-gradient(90deg, rgba(18,215,255,.08) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.06) 1px, transparent 1px),
            linear-gradient(135deg, #06111f, #0d1f32) !important;
          background-size: auto, auto, 54px 54px, 54px 54px, auto !important;
          color: #fffdf8 !important;
        }

        .full-site-preview.atmosphere-festa-glow-premium,
        .full-site-preview.atmosphere-confete-festa,
        .full-site-preview.atmosphere-festa-vibrante {
          background:
            radial-gradient(circle at 78% 22%, rgba(255,255,255,.16), transparent 20%),
            conic-gradient(from 65deg at 70% 32%, rgba(255,255,255,.18), transparent 24%, rgba(255,255,255,.08) 46%, transparent 76%),
            radial-gradient(circle at 14% 84%, rgba(255,179,71,.20), transparent 23%),
            linear-gradient(135deg, #1b0d2b, #43226d 48%, #8b4d2e) !important;
          color: #fffdf8 !important;
        }

        .full-site-preview.atmosphere-pattern-fino,
        .full-site-preview.atmosphere-pattern-whatsapp,
        .full-site-preview.atmosphere-doodle-divertido {
          background:
            radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--brand-secondary), transparent 72%), transparent 24%),
            linear-gradient(135deg, color-mix(in srgb, #fffdf8, var(--brand-primary) 4%), color-mix(in srgb, #f5efe5, var(--brand-secondary) 12%)) !important;
        }
        .full-site-preview.atmosphere-pattern-fino::before,
        .full-site-preview.atmosphere-pattern-whatsapp::before,
        .full-site-preview.atmosphere-doodle-divertido::before {
          background-image:
            radial-gradient(circle at 12px 12px, color-mix(in srgb, var(--brand-primary), transparent 88%) 0 1px, transparent 2px),
            linear-gradient(45deg, transparent 0 42%, color-mix(in srgb, var(--brand-secondary), transparent 84%) 43% 45%, transparent 46% 100%),
            linear-gradient(-45deg, transparent 0 42%, color-mix(in srgb, var(--brand-primary), transparent 91%) 43% 45%, transparent 46% 100%);
          background-size: 72px 72px, 96px 96px, 96px 96px;
          opacity: .72;
        }

        /* Contraste automático: se o fundo do Passo 5 for escuro, protege a letra sem trocar a cor escolhida. */
        .full-site-preview:is(
          .atmosphere-roxo-luxo,
          .atmosphere-marmore-noite,
          .atmosphere-marmore-preto-dourado,
          .atmosphere-preto-ouro,
          .atmosphere-noite-premium,
          .atmosphere-floral-noturno,
          .atmosphere-floral-escuro,
          .atmosphere-azul-corporativo,
          .atmosphere-neon-corporativo,
          .atmosphere-festa-glow-premium,
          .atmosphere-confete-festa,
          .atmosphere-festa-vibrante
        ) .mini-hero-copy {
          background: linear-gradient(135deg, rgba(255,253,248,.84), rgba(255,253,248,.58)) !important;
          border: 1px solid rgba(255,255,255,.68) !important;
          box-shadow: 0 30px 90px rgba(0,0,0,.28) !important;
          backdrop-filter: blur(16px) saturate(1.06) !important;
          -webkit-backdrop-filter: blur(16px) saturate(1.06) !important;
          text-shadow: none !important;
        }

        .full-site-preview:is(
          .atmosphere-roxo-luxo,
          .atmosphere-marmore-noite,
          .atmosphere-marmore-preto-dourado,
          .atmosphere-preto-ouro,
          .atmosphere-noite-premium,
          .atmosphere-floral-noturno,
          .atmosphere-floral-escuro,
          .atmosphere-azul-corporativo,
          .atmosphere-neon-corporativo,
          .atmosphere-festa-glow-premium,
          .atmosphere-confete-festa,
          .atmosphere-festa-vibrante
        ) .mini-hero-copy.frame-solto {
          width: min(88%, 760px) !important;
          padding: clamp(16px, 2.4vw, 28px) clamp(22px, 4vw, 44px) !important;
          border-radius: 34px !important;
        }

        /* Contagem: mantém paleta do Passo 4 e só troca a estrutura por atmosfera. */
        .full-site-preview .countdown-preview-premium {
          background:
            radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--brand-secondary), transparent 54%), transparent 28%),
            linear-gradient(135deg, var(--brand-primary) 0%, color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 30%) 100%) !important;
          color: #fffdf8 !important;
          border: 0 !important;
          box-shadow: 0 30px 86px color-mix(in srgb, var(--brand-primary), transparent 66%) !important;
        }
        .full-site-preview .countdown-preview-premium > span {
          color: color-mix(in srgb, var(--brand-secondary), #ffffff 12%) !important;
        }
        .full-site-preview .countdown-preview-premium .countdown-card-row strong {
          background: rgba(255,255,255,.94) !important;
          color: var(--brand-primary) !important;
          border: 1px solid rgba(255,255,255,.62) !important;
          box-shadow: 0 16px 38px rgba(0,0,0,.14) !important;
          transform: none !important;
        }
        .full-site-preview .countdown-preview-premium .countdown-card-row b {
          color: var(--brand-secondary) !important;
        }
        .full-site-preview .countdown-preview-premium .countdown-card-row small {
          color: color-mix(in srgb, var(--brand-primary), #111111 10%) !important;
        }

        .full-site-preview.atmosphere-offwhite-3d .countdown-card-row strong,
        .full-site-preview.atmosphere-geometrico-3d-branco .countdown-card-row strong,
        .full-site-preview.atmosphere-cubos-clean .countdown-card-row strong {
          border-radius: 10px !important;
          box-shadow: 10px 12px 0 color-mix(in srgb, var(--brand-primary), transparent 86%), 0 20px 42px rgba(0,0,0,.10) !important;
        }

        .full-site-preview.atmosphere-art-deco-dourado .countdown-card-row strong,
        .full-site-preview.atmosphere-losango-champagne .countdown-card-row strong {
          border-radius: 4px 24px 4px 24px !important;
          outline: 2px solid color-mix(in srgb, var(--brand-secondary), transparent 48%) !important;
          outline-offset: -7px !important;
        }

        .full-site-preview.atmosphere-seda-champagne .countdown-card-row strong,
        .full-site-preview.atmosphere-clean-luxo .countdown-card-row strong {
          border-radius: 28px !important;
        }

        .full-site-preview.atmosphere-folhagem-fina .countdown-card-row strong,
        .full-site-preview.atmosphere-folhagem-elegante .countdown-card-row strong,
        .full-site-preview.atmosphere-jardim-organico .countdown-card-row strong {
          border-radius: 28px 8px 28px 8px !important;
        }

        .full-site-preview.atmosphere-marmore-noite .countdown-card-row strong,
        .full-site-preview.atmosphere-marmore-preto-dourado .countdown-card-row strong,
        .full-site-preview.atmosphere-preto-ouro .countdown-card-row strong,
        .full-site-preview.atmosphere-noite-premium .countdown-card-row strong {
          border-radius: 16px !important;
          background: linear-gradient(180deg, rgba(255,255,255,.96), color-mix(in srgb, var(--brand-secondary), #fff 86%)) !important;
          box-shadow: 0 24px 58px rgba(0,0,0,.22), inset 0 0 0 1px rgba(255,255,255,.66) !important;
        }

        .full-site-preview.atmosphere-azul-corporativo .countdown-card-row strong,
        .full-site-preview.atmosphere-neon-corporativo .countdown-card-row strong,
        .full-site-preview.atmosphere-corporativo-premium .countdown-card-row strong {
          border-radius: 10px !important;
          background: rgba(255,255,255,.90) !important;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--brand-secondary), transparent 52%), 0 0 34px color-mix(in srgb, var(--brand-secondary), transparent 78%) !important;
        }

        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong,
        .full-site-preview.atmosphere-confete-festa .countdown-card-row strong,
        .full-site-preview.atmosphere-festa-vibrante .countdown-card-row strong {
          border-radius: 22px !important;
          transform: rotate(-1.2deg) !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong:nth-child(even),
        .full-site-preview.atmosphere-confete-festa .countdown-card-row strong:nth-child(even),
        .full-site-preview.atmosphere-festa-vibrante .countdown-card-row strong:nth-child(even) {
          transform: rotate(1.2deg) !important;
        }

        .full-site-preview.atmosphere-pattern-fino .countdown-card-row strong,
        .full-site-preview.atmosphere-pattern-whatsapp .countdown-card-row strong,
        .full-site-preview.atmosphere-doodle-divertido .countdown-card-row strong {
          border-radius: 999px !important;
          min-height: 106px !important;
        }

        /* Cards do Passo 5: agora parecem catálogo premium de papel de parede. */
        .atmosphere-option {
          min-height: 122px !important;
          align-items: flex-start !important;
          background: rgba(255,253,248,.78) !important;
          border-color: rgba(196,162,98,.18) !important;
          overflow: hidden !important;
        }
        .atmosphere-option::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .94;
          pointer-events: none;
          background:
            radial-gradient(circle at 16% 18%, rgba(196,162,98,.18), transparent 24%),
            linear-gradient(135deg, rgba(67,38,63,.05), transparent 62%);
        }
        .atmosphere-option::after {
          content: "";
          position: absolute;
          right: 14px;
          top: 14px;
          width: 92px;
          height: 70px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.52);
          box-shadow: 0 14px 34px rgba(0,0,0,.10);
          background: linear-gradient(135deg, #2a1234, #d3af67);
          opacity: .95;
          pointer-events: none;
        }
        .atmosphere-option .style-label,
        .atmosphere-option .style-icon-wrap {
          position: relative;
          z-index: 2;
          max-width: calc(100% - 112px);
        }
        .atmosphere-option.active {
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 8%) !important;
          box-shadow: 0 18px 48px color-mix(in srgb, var(--brand-primary), transparent 82%) !important;
        }
        .atmosphere-card-roxo-luxo::after { background: linear-gradient(135deg, #16091f, #321344 55%, #d3af67) !important; }
        .atmosphere-card-clean-luxo::after { background: linear-gradient(135deg, #fffaf2, #ead2ad 58%, #43263f) !important; }
        .atmosphere-card-offwhite-3d::after { background: conic-gradient(from 45deg, #fff 0 25%, #e8e5dd 0 50%, #fbfaf6 0 75%, #d7d4cb 0) !important; background-size: 30px 30px !important; }
        .atmosphere-card-art-deco-dourado::after { background: linear-gradient(135deg, #fff7e6, #caa45d), repeating-linear-gradient(45deg, transparent 0 12px, rgba(67,38,63,.18) 12px 13px) !important; }
        .atmosphere-card-seda-champagne::after { background: repeating-linear-gradient(45deg, rgba(90,64,57,.08) 0 2px, transparent 2px 8px), linear-gradient(135deg, #fff4e5, #d8c1a5) !important; }
        .atmosphere-card-marmore-noite::after { background: linear-gradient(115deg, transparent 0 45%, rgba(212,175,55,.55) 46% 48%, transparent 49%), linear-gradient(135deg, #07070b, #17111d) !important; }
        .atmosphere-card-preto-ouro::after { background: radial-gradient(circle at 22% 20%, rgba(212,175,55,.35), transparent 26%), linear-gradient(135deg, #07070b, #211826) !important; }
        .atmosphere-card-folhagem-fina::after { background: radial-gradient(ellipse at 20% 30%, rgba(63,79,69,.34), transparent 30%), linear-gradient(135deg, #eef2e7, #c8ad75) !important; }
        .atmosphere-card-floral-noturno::after { background: radial-gradient(circle at 20% 36%, rgba(212,147,163,.45), transparent 20%), radial-gradient(circle at 78% 20%, rgba(196,162,98,.24), transparent 18%), linear-gradient(135deg, #140c16, #301832) !important; }
        .atmosphere-card-azul-corporativo::after { background: linear-gradient(90deg, rgba(18,215,255,.20) 1px, transparent 1px), linear-gradient(0deg, rgba(18,215,255,.12) 1px, transparent 1px), linear-gradient(135deg, #06111f, #0d1f32) !important; background-size: 18px 18px, 18px 18px, auto !important; }
        .atmosphere-card-festa-glow-premium::after { background: conic-gradient(from 65deg, rgba(255,255,255,.22), transparent 28%, rgba(255,179,71,.42), transparent 72%), linear-gradient(135deg, #1b0d2b, #8b4d2e) !important; }
        .atmosphere-card-pattern-fino::after { background: radial-gradient(circle at 12px 12px, rgba(67,38,63,.28) 0 1px, transparent 2px), linear-gradient(135deg, #fffdf8, #f5efe5) !important; background-size: 20px 20px, auto !important; }



        /* ===== V5 ETAPA 4.1 — PASSO 5 IMPACTO REAL ===== */
        /* O card do modelo não escreve mais por cima do papel de parede. A amostra fica em cima, texto fica embaixo. */
        .style-grid .atmosphere-option {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 12px !important;
          min-height: 238px !important;
          padding: 14px !important;
          text-align: left !important;
          align-items: stretch !important;
          background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,250,244,.90)) !important;
          border: 1px solid rgba(130, 96, 60, .14) !important;
          box-shadow: 0 14px 36px rgba(34, 24, 18, .07) !important;
        }

        .style-grid .atmosphere-option::before,
        .style-grid .atmosphere-option::after {
          display: none !important;
          content: none !important;
        }

        .style-grid .atmosphere-option .style-icon-wrap {
          display: none !important;
        }

        .style-grid .atmosphere-option .style-label {
          z-index: 2 !important;
          max-width: 100% !important;
          display: grid !important;
          gap: 6px !important;
          padding: 0 2px 2px !important;
          color: #2d2527 !important;
          position: relative !important;
        }

        .style-grid .atmosphere-option .style-label strong {
          font-size: 15px !important;
          line-height: 1.15 !important;
          letter-spacing: -.01em !important;
        }

        .style-grid .atmosphere-option .style-label small {
          font-size: 12px !important;
          line-height: 1.45 !important;
          color: rgba(45, 37, 39, .66) !important;
        }

        .style-grid .atmosphere-option.active {
          transform: translateY(-2px) !important;
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 8%) !important;
          box-shadow: 0 22px 54px color-mix(in srgb, var(--brand-primary), transparent 82%) !important;
        }

        .style-grid .atmosphere-option.active .style-label strong {
          color: var(--brand-primary) !important;
        }

        .atmosphere-preview-swatch {
          position: relative !important;
          display: block !important;
          width: 100% !important;
          height: 132px !important;
          border-radius: 24px !important;
          overflow: hidden !important;
          border: 1px solid rgba(255,255,255,.68) !important;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,.04), 0 18px 38px rgba(32,20,20,.12) !important;
          isolation: isolate !important;
        }

        .atmosphere-preview-swatch i {
          position: absolute !important;
          inset: auto 14px 14px auto !important;
          width: 58px !important;
          height: 26px !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,.76) !important;
          border: 1px solid rgba(255,255,255,.72) !important;
          box-shadow: 0 10px 26px rgba(0,0,0,.16) !important;
        }

        .atmosphere-preview-swatch::before,
        .atmosphere-preview-swatch::after {
          content: "" !important;
          position: absolute !important;
          pointer-events: none !important;
        }

        .atmosphere-swatch-roxo-luxo {
          background:
            radial-gradient(circle at 18% 16%, rgba(211,175,103,.30), transparent 24%),
            radial-gradient(circle at 84% 82%, rgba(255,255,255,.10), transparent 28%),
            linear-gradient(135deg, #13071b, #3a1550 55%, #16091f) !important;
        }
        .atmosphere-swatch-roxo-luxo::before {
          inset: 0 !important;
          background: repeating-linear-gradient(135deg, rgba(255,255,255,.08) 0 1px, transparent 1px 18px) !important;
          opacity: .55 !important;
        }

        .atmosphere-swatch-clean-luxo,
        .atmosphere-swatch-seda-champagne {
          background:
            radial-gradient(circle at 22% 10%, rgba(196,162,98,.28), transparent 28%),
            linear-gradient(135deg, #fff8ec, #ead7b8 62%, #fffdf8) !important;
        }
        .atmosphere-swatch-clean-luxo::before,
        .atmosphere-swatch-seda-champagne::before {
          inset: 0 !important;
          background: repeating-linear-gradient(35deg, rgba(120,82,44,.08) 0 1px, transparent 1px 10px) !important;
        }

        .atmosphere-swatch-offwhite-3d {
          background: conic-gradient(from 45deg, #ffffff 0 25%, #e8e5dd 0 50%, #fbfaf6 0 75%, #d7d4cb 0) !important;
          background-size: 44px 44px !important;
        }
        .atmosphere-swatch-offwhite-3d::before {
          inset: 0 !important;
          background: linear-gradient(135deg, rgba(255,255,255,.42), rgba(0,0,0,.06)) !important;
        }

        .atmosphere-swatch-art-deco-dourado {
          background:
            linear-gradient(135deg, transparent 0 47%, rgba(90,52,30,.20) 48% 49%, transparent 50% 100%),
            linear-gradient(45deg, transparent 0 47%, rgba(196,162,98,.32) 48% 49%, transparent 50% 100%),
            linear-gradient(135deg, #fff2d0, #c99b45) !important;
          background-size: 54px 54px, 54px 54px, auto !important;
        }

        .atmosphere-swatch-marmore-noite,
        .atmosphere-swatch-preto-ouro {
          background:
            linear-gradient(115deg, transparent 0 38%, rgba(212,175,55,.62) 39% 41%, transparent 42%),
            linear-gradient(35deg, transparent 0 60%, rgba(255,255,255,.16) 61% 62%, transparent 64%),
            radial-gradient(circle at 20% 16%, rgba(212,175,55,.32), transparent 24%),
            linear-gradient(135deg, #050508, #17111d 54%, #050508) !important;
        }

        .atmosphere-swatch-folhagem-fina {
          background:
            radial-gradient(ellipse at 18% 32%, rgba(63,79,69,.30), transparent 24%),
            radial-gradient(ellipse at 78% 54%, rgba(196,162,98,.24), transparent 22%),
            linear-gradient(135deg, #edf3e7, #cbd9bf) !important;
        }
        .atmosphere-swatch-folhagem-fina::before {
          inset: 0 !important;
          background: radial-gradient(ellipse at 28px 36px, rgba(63,79,69,.20), transparent 22px) !important;
          background-size: 72px 58px !important;
        }

        .atmosphere-swatch-floral-noturno {
          background:
            radial-gradient(circle at 18% 28%, rgba(212,147,163,.42), transparent 18%),
            radial-gradient(circle at 82% 16%, rgba(196,162,98,.28), transparent 17%),
            radial-gradient(circle at 68% 78%, rgba(212,147,163,.22), transparent 22%),
            linear-gradient(135deg, #130b15, #321834 60%, #0e0a10) !important;
        }

        .atmosphere-swatch-azul-corporativo {
          background:
            linear-gradient(90deg, rgba(18,215,255,.22) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.14) 1px, transparent 1px),
            radial-gradient(circle at 80% 26%, rgba(18,215,255,.38), transparent 20%),
            linear-gradient(135deg, #06111f, #0d1f32) !important;
          background-size: 24px 24px, 24px 24px, auto, auto !important;
        }

        .atmosphere-swatch-festa-glow-premium {
          background:
            conic-gradient(from 65deg at 70% 32%, rgba(255,255,255,.28), transparent 26%, rgba(255,179,71,.56), transparent 74%),
            radial-gradient(circle at 18% 80%, rgba(255,179,71,.34), transparent 24%),
            linear-gradient(135deg, #1b0d2b, #43226d 50%, #8b4d2e) !important;
        }

        .atmosphere-swatch-pattern-fino {
          background:
            radial-gradient(circle at 12px 12px, rgba(67,38,63,.20) 0 1px, transparent 2px),
            linear-gradient(45deg, transparent 0 42%, rgba(196,162,98,.20) 43% 45%, transparent 46% 100%),
            linear-gradient(135deg, #fffdf8, #f0e7dc) !important;
          background-size: 28px 28px, 74px 74px, auto !important;
        }

        /* Passo 5: mudanças fortes na contagem sem apagar a paleta escolhida no Passo 4. */
        .full-site-preview .countdown-preview-premium {
          position: relative !important;
          overflow: hidden !important;
          isolation: isolate !important;
          padding: clamp(40px, 5vw, 68px) clamp(22px, 4vw, 42px) !important;
          transition: border-radius .25s ease, clip-path .25s ease, background .25s ease, box-shadow .25s ease !important;
        }

        .full-site-preview .countdown-preview-premium::before,
        .full-site-preview .countdown-preview-premium::after {
          content: "" !important;
          position: absolute !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }

        /* Roxo luxo — números soltos, sem cartões pesados. */
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium > span,
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium p {
          color: color-mix(in srgb, var(--brand-primary), #ffffff 12%) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row {
          gap: 22px !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row strong {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          min-width: 92px !important;
          min-height: 92px !important;
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row b {
          font-size: clamp(48px, 6.5vw, 82px) !important;
          line-height: .8 !important;
          color: var(--brand-secondary) !important;
          text-shadow: 0 18px 40px color-mix(in srgb, var(--brand-primary), transparent 60%) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row small {
          color: var(--brand-primary) !important;
          letter-spacing: .22em !important;
        }

        /* Champagne clean — faixa inteira. */
        .full-site-preview.atmosphere-clean-luxo .countdown-preview-premium,
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium {
          margin-left: clamp(-34px, -4vw, -18px) !important;
          margin-right: clamp(-34px, -4vw, -18px) !important;
          border-radius: 0 !important;
          background: linear-gradient(100deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 36%)) !important;
          box-shadow: 0 30px 86px color-mix(in srgb, var(--brand-primary), transparent 66%) !important;
        }
        .full-site-preview.atmosphere-clean-luxo .countdown-card-row strong,
        .full-site-preview.atmosphere-seda-champagne .countdown-card-row strong {
          border-radius: 999px !important;
          background: color-mix(in srgb, #ffffff, var(--brand-secondary) 8%) !important;
          min-height: 98px !important;
        }

        /* Off-white 3D — bloquinhos com sombra dura. */
        .full-site-preview.atmosphere-offwhite-3d .countdown-preview-premium {
          background: linear-gradient(135deg, #ffffff, color-mix(in srgb, #ffffff, var(--brand-secondary) 11%)) !important;
          color: var(--brand-primary) !important;
          border: 1px solid rgba(0,0,0,.06) !important;
          box-shadow: 12px 14px 0 color-mix(in srgb, var(--brand-primary), transparent 84%), 0 28px 70px rgba(0,0,0,.10) !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-preview-premium > span,
        .full-site-preview.atmosphere-offwhite-3d .countdown-preview-premium p {
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-card-row strong {
          border-radius: 14px !important;
          transform: translateY(-4px) !important;
          box-shadow: 8px 9px 0 color-mix(in srgb, var(--brand-secondary), transparent 42%), 0 18px 30px rgba(0,0,0,.09) !important;
        }

        /* Art déco — moldura geométrica. */
        .full-site-preview.atmosphere-art-deco-dourado .countdown-preview-premium {
          border-radius: 8px 48px 8px 48px !important;
          outline: 2px solid color-mix(in srgb, var(--brand-secondary), transparent 25%) !important;
          outline-offset: -12px !important;
          background: linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), #000 18%)) !important;
        }
        .full-site-preview.atmosphere-art-deco-dourado .countdown-card-row strong {
          border-radius: 0 30px 0 30px !important;
          outline: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 15%) !important;
          outline-offset: -8px !important;
        }

        /* Mármore/preto ouro — faixa escura que cobre o fundo. */
        .full-site-preview.atmosphere-marmore-noite .countdown-preview-premium,
        .full-site-preview.atmosphere-preto-ouro .countdown-preview-premium {
          margin-left: clamp(-34px, -4vw, -18px) !important;
          margin-right: clamp(-34px, -4vw, -18px) !important;
          border-radius: 0 !important;
          background:
            linear-gradient(115deg, transparent 0 42%, color-mix(in srgb, var(--brand-secondary), transparent 30%) 43% 44%, transparent 45%),
            linear-gradient(135deg, #060507, color-mix(in srgb, var(--brand-primary), #050505 50%)) !important;
          border-top: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 35%) !important;
          border-bottom: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 35%) !important;
        }
        .full-site-preview.atmosphere-marmore-noite .countdown-card-row strong,
        .full-site-preview.atmosphere-preto-ouro .countdown-card-row strong {
          border-radius: 18px !important;
          background: linear-gradient(180deg, rgba(255,255,255,.98), color-mix(in srgb, #ffffff, var(--brand-secondary) 16%)) !important;
          box-shadow: 0 26px 70px rgba(0,0,0,.28), inset 0 0 0 1px rgba(255,255,255,.74) !important;
        }

        /* Floral noturno — faixa rasgada. */
        .full-site-preview.atmosphere-floral-noturno .countdown-preview-premium {
          border-radius: 0 !important;
          clip-path: polygon(0 8%, 7% 2%, 16% 7%, 26% 0, 37% 8%, 48% 3%, 58% 10%, 70% 4%, 82% 9%, 93% 2%, 100% 8%, 100% 93%, 91% 98%, 79% 91%, 68% 99%, 55% 93%, 43% 100%, 31% 92%, 21% 98%, 11% 91%, 0 97%) !important;
          background: linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), #000 18%)) !important;
        }
        .full-site-preview.atmosphere-floral-noturno .countdown-card-row strong {
          border-radius: 50% 50% 46% 54% / 52% 45% 55% 48% !important;
          min-height: 112px !important;
        }

        /* Folhagem — orgânico assimétrico. */
        .full-site-preview.atmosphere-folhagem-fina .countdown-preview-premium {
          border-radius: 52px 18px 52px 18px !important;
          background: linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #ffffff 5%), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 30%)) !important;
        }
        .full-site-preview.atmosphere-folhagem-fina .countdown-card-row strong {
          border-radius: 60% 40% 52% 48% / 44% 62% 38% 56% !important;
          min-height: 112px !important;
        }

        /* Azul corporativo — painel digital neon. */
        .full-site-preview.atmosphere-azul-corporativo .countdown-preview-premium {
          background:
            linear-gradient(90deg, color-mix(in srgb, var(--brand-secondary), transparent 88%) 1px, transparent 1px),
            linear-gradient(0deg, color-mix(in srgb, var(--brand-secondary), transparent 90%) 1px, transparent 1px),
            linear-gradient(135deg, #06111f, color-mix(in srgb, var(--brand-primary), #000 20%)) !important;
          background-size: 34px 34px, 34px 34px, auto !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 42%) !important;
          box-shadow: 0 0 0 1px rgba(255,255,255,.04), 0 0 70px color-mix(in srgb, var(--brand-secondary), transparent 78%) !important;
        }
        .full-site-preview.atmosphere-azul-corporativo .countdown-card-row strong {
          border-radius: 8px !important;
          background: rgba(255,255,255,.90) !important;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--brand-secondary), transparent 34%), 0 0 34px color-mix(in srgb, var(--brand-secondary), transparent 78%) !important;
        }

        /* Festa glow — tickets quebrados. */
        .full-site-preview.atmosphere-festa-glow-premium .countdown-preview-premium {
          background: linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 34%)) !important;
          border-radius: 34px !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong {
          border-radius: 22px 6px 22px 6px !important;
          transform: rotate(-2.2deg) translateY(-2px) !important;
          clip-path: polygon(0 8%, 8% 0, 100% 0, 92% 8%, 100% 16%, 100% 100%, 0 100%, 8% 92%, 0 84%) !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong:nth-child(even) {
          transform: rotate(2.2deg) translateY(4px) !important;
        }

        /* Pattern fino — só números e dizeres soltos, sem fundo. */
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium > span,
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium p {
          color: var(--brand-primary) !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row strong {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          min-height: auto !important;
          min-width: 84px !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row b {
          font-size: clamp(42px, 5.6vw, 68px) !important;
          color: var(--brand-secondary) !important;
          text-shadow: 0 14px 34px color-mix(in srgb, var(--brand-primary), transparent 72%) !important;
        }


        /* ===== V5 ETAPA 4.2 — PASSO 5 IMPACTO PREMIUM REAL ===== */
        /* Objetivo: Passo 5 muda fundo + estrutura da contagem de forma forte, sem sobrescrever as cores do Passo 4. */

        .style-grid {
          align-items: stretch !important;
        }

        .style-grid .atmosphere-option {
          min-height: 268px !important;
          border-radius: 30px !important;
          padding: 16px !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.98), rgba(248,242,234,.94)) !important;
          box-shadow:
            0 18px 42px rgba(23, 15, 12, .08),
            inset 0 0 0 1px rgba(255,255,255,.76) !important;
        }

        .style-grid .atmosphere-option:hover {
          transform: translateY(-3px) !important;
          box-shadow:
            0 28px 70px rgba(23, 15, 12, .13),
            inset 0 0 0 1px rgba(255,255,255,.82) !important;
        }

        .style-grid .atmosphere-option.active {
          outline: 2px solid color-mix(in srgb, var(--brand-secondary), transparent 12%) !important;
          outline-offset: 3px !important;
        }

        .style-grid .atmosphere-option .style-label {
          padding: 2px 4px 0 !important;
        }

        .style-grid .atmosphere-option .style-label strong {
          font-size: 16px !important;
          font-weight: 900 !important;
        }

        .style-grid .atmosphere-option .style-label small {
          font-size: 12.5px !important;
          line-height: 1.42 !important;
        }

        .atmosphere-preview-swatch {
          height: 156px !important;
          border-radius: 26px !important;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.52),
            inset 0 -48px 80px rgba(0,0,0,.12),
            0 20px 42px rgba(28,18,16,.15) !important;
        }

        .atmosphere-preview-swatch i {
          inset: auto 12px 12px 12px !important;
          width: auto !important;
          height: 34px !important;
          border-radius: 999px !important;
          display: grid !important;
          place-items: center !important;
          background: rgba(255,255,255,.82) !important;
          color: rgba(33, 21, 28, .82) !important;
          font-style: normal !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          letter-spacing: .12em !important;
          text-transform: uppercase !important;
          box-shadow: 0 14px 28px rgba(0,0,0,.16) !important;
        }

        .atmosphere-preview-swatch i::before {
          content: "Prévia do fundo" !important;
        }

        .atmosphere-preview-swatch::after {
          inset: 18px 18px auto auto !important;
          width: 58px !important;
          height: 42px !important;
          border-radius: 14px !important;
          background: rgba(255,255,255,.30) !important;
          border: 1px solid rgba(255,255,255,.42) !important;
          box-shadow: 0 14px 30px rgba(0,0,0,.16) !important;
        }

        .atmosphere-swatch-roxo-luxo {
          background:
            radial-gradient(circle at 16% 10%, rgba(237,203,127,.38), transparent 18%),
            radial-gradient(circle at 84% 80%, rgba(132,74,176,.35), transparent 24%),
            repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 1px, transparent 1px 18px),
            linear-gradient(135deg, #0b0611 0%, #2d1140 48%, #180624 100%) !important;
        }
        .atmosphere-swatch-roxo-luxo::after {
          border-radius: 50% !important;
          background: radial-gradient(circle, rgba(237,203,127,.72), rgba(255,255,255,.16) 62%, transparent 63%) !important;
        }
        .atmosphere-swatch-roxo-luxo i::before { content: "números soltos" !important; }

        .atmosphere-swatch-clean-luxo {
          background:
            linear-gradient(90deg, transparent 0 9%, rgba(255,255,255,.56) 10% 28%, transparent 29%),
            radial-gradient(circle at 22% 18%, rgba(203,168,104,.28), transparent 18%),
            linear-gradient(135deg, #fffbf4, #ead9bc 58%, #fffefa) !important;
        }
        .atmosphere-swatch-clean-luxo::after {
          left: 16px !important;
          right: 16px !important;
          top: 54px !important;
          width: auto !important;
          height: 28px !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,.76) !important;
        }
        .atmosphere-swatch-clean-luxo i::before { content: "faixa champagne" !important; }

        .atmosphere-swatch-offwhite-3d {
          background:
            linear-gradient(145deg, rgba(255,255,255,.88), rgba(255,255,255,.08)),
            conic-gradient(from 45deg at 50% 50%, #ffffff 0 25%, #dfddd5 0 50%, #faf9f4 0 75%, #cfccc3 0) !important;
          background-size: auto, 42px 42px !important;
        }
        .atmosphere-swatch-offwhite-3d::after {
          transform: translateY(2px) rotate(-3deg) !important;
          box-shadow: 7px 8px 0 rgba(155,142,115,.24), 0 14px 30px rgba(0,0,0,.14) !important;
        }
        .atmosphere-swatch-offwhite-3d i::before { content: "bloquinhos 3D" !important; }

        .atmosphere-swatch-art-deco-dourado {
          background:
            linear-gradient(135deg, transparent 0 46%, rgba(79,38,36,.22) 47% 49%, transparent 50%),
            linear-gradient(45deg, transparent 0 46%, rgba(218,177,85,.42) 47% 49%, transparent 50%),
            radial-gradient(circle at 50% 12%, rgba(255,255,255,.48), transparent 22%),
            linear-gradient(135deg, #fff2cf, #c78d35) !important;
          background-size: 58px 58px, 58px 58px, auto, auto !important;
        }
        .atmosphere-swatch-art-deco-dourado::after {
          border-radius: 4px 18px 4px 18px !important;
          outline: 1px solid rgba(255,255,255,.62) !important;
          outline-offset: -6px !important;
        }
        .atmosphere-swatch-art-deco-dourado i::before { content: "art déco" !important; }

        .atmosphere-swatch-seda-champagne {
          background:
            radial-gradient(ellipse at 12% 0%, rgba(255,255,255,.72), transparent 28%),
            radial-gradient(ellipse at 74% 18%, rgba(171,121,72,.18), transparent 26%),
            repeating-linear-gradient(35deg, rgba(255,255,255,.11) 0 2px, transparent 2px 12px),
            linear-gradient(135deg, #f7ead9, #d2ad82 54%, #f7eadc) !important;
        }
        .atmosphere-swatch-seda-champagne::after {
          left: -12px !important;
          right: -12px !important;
          top: 50px !important;
          width: auto !important;
          height: 38px !important;
          border-radius: 999px !important;
          transform: rotate(-3deg) !important;
          background: rgba(255,255,255,.54) !important;
        }
        .atmosphere-swatch-seda-champagne i::before { content: "faixa curva" !important; }

        .atmosphere-swatch-marmore-noite {
          background:
            linear-gradient(116deg, transparent 0 34%, rgba(218,177,85,.68) 35% 36%, transparent 37%),
            linear-gradient(35deg, transparent 0 65%, rgba(255,255,255,.16) 66% 67%, transparent 68%),
            radial-gradient(circle at 14% 18%, rgba(218,177,85,.24), transparent 20%),
            linear-gradient(135deg, #030306, #16131c 54%, #050508) !important;
        }
        .atmosphere-swatch-marmore-noite::after {
          left: 0 !important;
          right: 0 !important;
          top: 54px !important;
          width: auto !important;
          height: 34px !important;
          border-radius: 0 !important;
          background: rgba(255,255,255,.18) !important;
        }
        .atmosphere-swatch-marmore-noite i::before { content: "faixa inteira" !important; }

        .atmosphere-swatch-preto-ouro {
          background:
            radial-gradient(circle at 82% 18%, rgba(218,177,85,.34), transparent 18%),
            linear-gradient(135deg, rgba(218,177,85,.50) 0 1px, transparent 1px 12px),
            linear-gradient(135deg, #060505, #241a27 60%, #080607) !important;
        }
        .atmosphere-swatch-preto-ouro::after {
          width: 78px !important;
          height: 78px !important;
          border-radius: 50% !important;
          background: conic-gradient(from 45deg, rgba(218,177,85,.70), rgba(255,255,255,.10), rgba(218,177,85,.55)) !important;
        }
        .atmosphere-swatch-preto-ouro i::before { content: "ouro espelhado" !important; }

        .atmosphere-swatch-folhagem-fina {
          background:
            radial-gradient(ellipse at 18% 36%, rgba(57,77,63,.32), transparent 25%),
            radial-gradient(ellipse at 70% 22%, rgba(196,162,98,.28), transparent 22%),
            radial-gradient(ellipse at 82% 76%, rgba(57,77,63,.20), transparent 24%),
            linear-gradient(135deg, #f0f5eb, #c8d5bd) !important;
        }
        .atmosphere-swatch-folhagem-fina::after {
          border-radius: 64% 36% 55% 45% / 42% 62% 38% 58% !important;
          background: rgba(255,255,255,.64) !important;
        }
        .atmosphere-swatch-folhagem-fina i::before { content: "orgânico" !important; }

        .atmosphere-swatch-floral-noturno {
          background:
            radial-gradient(circle at 18% 28%, rgba(232,139,165,.45), transparent 16%),
            radial-gradient(circle at 78% 18%, rgba(218,177,85,.30), transparent 16%),
            radial-gradient(circle at 68% 78%, rgba(232,139,165,.24), transparent 20%),
            repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 1px, transparent 1px 16px),
            linear-gradient(135deg, #100911, #321635 60%, #09060a) !important;
        }
        .atmosphere-swatch-floral-noturno::after {
          left: 4px !important;
          right: 4px !important;
          top: 54px !important;
          width: auto !important;
          height: 44px !important;
          border-radius: 0 !important;
          clip-path: polygon(0 14%, 10% 0, 22% 14%, 33% 2%, 48% 18%, 61% 4%, 74% 15%, 87% 0, 100% 14%, 100% 88%, 88% 100%, 70% 86%, 56% 100%, 42% 84%, 24% 100%, 12% 86%, 0 100%) !important;
          background: rgba(255,255,255,.62) !important;
        }
        .atmosphere-swatch-floral-noturno i::before { content: "faixa rasgada" !important; }

        .atmosphere-swatch-azul-corporativo {
          background:
            linear-gradient(90deg, rgba(18,215,255,.16) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.12) 1px, transparent 1px),
            radial-gradient(circle at 78% 28%, rgba(18,215,255,.40), transparent 20%),
            linear-gradient(135deg, #05101e, #0e2239) !important;
          background-size: 24px 24px, 24px 24px, auto, auto !important;
        }
        .atmosphere-swatch-azul-corporativo::after {
          border-radius: 8px !important;
          background: rgba(255,255,255,.18) !important;
          box-shadow: 0 0 30px rgba(18,215,255,.42), inset 0 0 0 1px rgba(18,215,255,.52) !important;
        }
        .atmosphere-swatch-azul-corporativo i::before { content: "painel neon" !important; }

        .atmosphere-swatch-festa-glow-premium {
          background:
            conic-gradient(from 25deg at 72% 35%, rgba(255,255,255,.32), transparent 20%, rgba(255,179,71,.64), transparent 72%),
            radial-gradient(circle at 18% 78%, rgba(255,179,71,.38), transparent 22%),
            linear-gradient(135deg, #170b24, #45206b 48%, #a95431) !important;
        }
        .atmosphere-swatch-festa-glow-premium::after {
          border-radius: 18px 4px 18px 4px !important;
          transform: rotate(-5deg) !important;
          clip-path: polygon(0 12%, 10% 0, 100% 0, 90% 12%, 100% 24%, 100% 100%, 0 100%, 10% 88%, 0 76%) !important;
          background: rgba(255,255,255,.70) !important;
        }
        .atmosphere-swatch-festa-glow-premium i::before { content: "ticket premium" !important; }

        .atmosphere-swatch-pattern-fino {
          background:
            radial-gradient(circle at 12px 12px, rgba(67,38,63,.16) 0 1px, transparent 2px),
            linear-gradient(45deg, transparent 0 43%, rgba(196,162,98,.18) 44% 45%, transparent 46%),
            radial-gradient(circle at 82% 20%, rgba(196,162,98,.24), transparent 18%),
            linear-gradient(135deg, #fffdf8, #efe5d8) !important;
          background-size: 28px 28px, 72px 72px, auto, auto !important;
        }
        .atmosphere-swatch-pattern-fino::after {
          display: none !important;
        }
        .atmosphere-swatch-pattern-fino i::before { content: "só números" !important; }

        /* Fundos do mini site: menos infantil, mais editoriais e com profundidade. */
        .full-site-preview.atmosphere-roxo-luxo {
          background:
            radial-gradient(circle at 8% 8%, rgba(211,175,103,.28), transparent 18%),
            radial-gradient(circle at 92% 6%, rgba(255,255,255,.10), transparent 16%),
            radial-gradient(circle at 88% 88%, rgba(123,58,178,.34), transparent 24%),
            repeating-linear-gradient(135deg, rgba(255,255,255,.045) 0 1px, transparent 1px 20px),
            linear-gradient(135deg, #0c0613 0%, #2f1245 52%, #100617 100%) !important;
        }

        .full-site-preview.atmosphere-clean-luxo {
          background:
            radial-gradient(circle at 18% 8%, rgba(196,162,98,.24), transparent 21%),
            linear-gradient(90deg, rgba(255,255,255,.40), transparent 18% 82%, rgba(255,255,255,.38)),
            linear-gradient(135deg, #fffaf0, #ead8bd 60%, #fffefa) !important;
        }

        .full-site-preview.atmosphere-offwhite-3d {
          background:
            linear-gradient(145deg, rgba(255,255,255,.78), rgba(255,255,255,.10)),
            conic-gradient(from 45deg, #ffffff 0 25%, #e0ded6 0 50%, #faf8f2 0 75%, #ccc9c0 0) !important;
          background-size: auto, 56px 56px !important;
        }

        .full-site-preview.atmosphere-art-deco-dourado {
          background:
            linear-gradient(135deg, transparent 0 47%, rgba(52,29,40,.16) 48% 49%, transparent 50%),
            linear-gradient(45deg, transparent 0 47%, rgba(202,164,93,.28) 48% 49%, transparent 50%),
            linear-gradient(135deg, #fff2cf, #c79745) !important;
          background-size: 82px 82px, 82px 82px, auto !important;
        }

        .full-site-preview.atmosphere-seda-champagne {
          background:
            radial-gradient(ellipse at 10% 0%, rgba(255,255,255,.66), transparent 25%),
            repeating-linear-gradient(35deg, rgba(255,255,255,.10) 0 2px, transparent 2px 14px),
            linear-gradient(135deg, #f7ead9, #d2ad82 54%, #f7eadc) !important;
        }

        .full-site-preview.atmosphere-marmore-noite {
          background:
            linear-gradient(116deg, transparent 0 38%, rgba(212,175,55,.48) 39% 40%, transparent 41%),
            linear-gradient(35deg, transparent 0 64%, rgba(255,255,255,.12) 65% 66%, transparent 67%),
            radial-gradient(circle at 14% 18%, rgba(212,175,55,.24), transparent 22%),
            linear-gradient(135deg, #030306, #17131d 54%, #050508) !important;
        }

        .full-site-preview.atmosphere-preto-ouro {
          background:
            radial-gradient(circle at 82% 18%, rgba(218,177,85,.26), transparent 20%),
            repeating-linear-gradient(135deg, rgba(218,177,85,.12) 0 1px, transparent 1px 18px),
            linear-gradient(135deg, #060505, #221828 60%, #080607) !important;
        }

        .full-site-preview.atmosphere-floral-noturno {
          background:
            radial-gradient(circle at 12% 16%, rgba(212,147,163,.22), transparent 18%),
            radial-gradient(circle at 84% 20%, rgba(212,175,55,.16), transparent 16%),
            radial-gradient(circle at 82% 84%, rgba(212,147,163,.16), transparent 22%),
            linear-gradient(135deg, #100911, #321635 60%, #09060a) !important;
        }

        .full-site-preview.atmosphere-azul-corporativo {
          background:
            linear-gradient(90deg, rgba(18,215,255,.10) 1px, transparent 1px),
            linear-gradient(0deg, rgba(18,215,255,.08) 1px, transparent 1px),
            radial-gradient(circle at 78% 25%, rgba(18,215,255,.24), transparent 21%),
            linear-gradient(135deg, #05101e, #0e2239) !important;
          background-size: 38px 38px, 38px 38px, auto, auto !important;
        }

        /* Regras globais da contagem V5.4.2 */
        .full-site-preview .countdown-preview-premium {
          overflow: visible !important;
          isolation: isolate !important;
          border: 0 !important;
        }

        .full-site-preview .countdown-preview-premium > span {
          position: relative !important;
          z-index: 2 !important;
          font-weight: 950 !important;
          letter-spacing: .26em !important;
        }

        .full-site-preview .countdown-card-row {
          position: relative !important;
          z-index: 2 !important;
        }

        .full-site-preview .countdown-card-row strong {
          position: relative !important;
          display: grid !important;
          place-items: center !important;
          align-content: center !important;
          min-height: 108px !important;
          min-width: 108px !important;
          padding: 16px 14px !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.97), color-mix(in srgb, #ffffff, var(--brand-secondary) 13%)) !important;
          color: var(--brand-primary) !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 36%) !important;
          box-shadow: 0 22px 48px color-mix(in srgb, var(--brand-primary), transparent 86%) !important;
        }

        .full-site-preview .countdown-card-row b {
          color: var(--brand-secondary) !important;
          font-weight: 950 !important;
          letter-spacing: -.06em !important;
        }

        .full-site-preview .countdown-card-row small {
          color: color-mix(in srgb, var(--brand-primary), #000000 14%) !important;
          font-weight: 900 !important;
        }

        /* Roxo luxo: números soltos, sem fundo, bem editorial. */
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium {
          padding-block: clamp(56px, 7vw, 92px) !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row strong {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          min-width: 112px !important;
          min-height: 116px !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row b {
          font-size: clamp(64px, 8vw, 108px) !important;
          color: var(--brand-secondary) !important;
          text-shadow:
            0 3px 0 color-mix(in srgb, var(--brand-primary), #000 25%),
            0 24px 54px color-mix(in srgb, var(--brand-secondary), transparent 54%) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row small {
          color: rgba(255,255,255,.82) !important;
          letter-spacing: .24em !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium p,
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium > span {
          color: rgba(255,255,255,.84) !important;
        }

        /* Champagne: faixa clara inteira, sem deixar o fundo competir. */
        .full-site-preview.atmosphere-clean-luxo .countdown-preview-premium,
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium {
          margin-inline: clamp(-42px, -5vw, -20px) !important;
          border-radius: 0 !important;
          background:
            radial-gradient(ellipse at 12% 0%, rgba(255,255,255,.74), transparent 34%),
            linear-gradient(135deg, color-mix(in srgb, #ffffff, var(--brand-secondary) 8%), color-mix(in srgb, #ffffff, var(--brand-secondary) 22%)) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.80), inset 0 -1px 0 rgba(145,100,58,.13), 0 28px 70px rgba(70,45,24,.08) !important;
        }
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium {
          border-radius: 999px 0 999px 0 !important;
          transform: rotate(-.8deg) !important;
        }
        .full-site-preview.atmosphere-seda-champagne .countdown-card-row,
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium > span,
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium p {
          transform: rotate(.8deg) !important;
        }

        /* Off-white 3D: bloquinhos com sombra deslocada. */
        .full-site-preview.atmosphere-offwhite-3d .countdown-preview-premium {
          background: rgba(255,255,255,.42) !important;
          border-radius: 28px !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-card-row strong {
          border-radius: 10px !important;
          transform: translateY(-5px) rotate(-1deg) !important;
          box-shadow:
            10px 12px 0 color-mix(in srgb, var(--brand-secondary), transparent 48%),
            0 22px 44px rgba(20,20,20,.12) !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-card-row strong:nth-child(even) {
          transform: translateY(6px) rotate(1deg) !important;
        }

        /* Art déco: moldura luxuosa e blocos cortados. */
        .full-site-preview.atmosphere-art-deco-dourado .countdown-preview-premium {
          border-radius: 6px 54px 6px 54px !important;
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #000 10%), color-mix(in srgb, var(--brand-primary), #000 28%)) !important;
          outline: 2px solid color-mix(in srgb, var(--brand-secondary), transparent 18%) !important;
          outline-offset: -14px !important;
        }
        .full-site-preview.atmosphere-art-deco-dourado .countdown-card-row strong {
          border-radius: 0 32px 0 32px !important;
          outline: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 18%) !important;
          outline-offset: -8px !important;
          background: rgba(255,255,255,.96) !important;
        }

        /* Mármore e preto ouro: faixa inteira preta/dourada cobrindo o fundo. */
        .full-site-preview.atmosphere-marmore-noite .countdown-preview-premium,
        .full-site-preview.atmosphere-preto-ouro .countdown-preview-premium {
          margin-inline: clamp(-42px, -5vw, -20px) !important;
          border-radius: 0 !important;
          background:
            linear-gradient(118deg, transparent 0 40%, color-mix(in srgb, var(--brand-secondary), transparent 22%) 41% 42%, transparent 43%),
            linear-gradient(135deg, #030304, color-mix(in srgb, var(--brand-primary), #030304 55%)) !important;
          box-shadow: 0 32px 80px rgba(0,0,0,.28) !important;
          border-top: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 34%) !important;
          border-bottom: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 34%) !important;
        }
        .full-site-preview.atmosphere-marmore-noite .countdown-card-row strong,
        .full-site-preview.atmosphere-preto-ouro .countdown-card-row strong {
          border-radius: 18px !important;
          background: linear-gradient(180deg, rgba(255,255,255,.98), color-mix(in srgb, #ffffff, var(--brand-secondary) 16%)) !important;
          box-shadow: 0 28px 74px rgba(0,0,0,.34), inset 0 0 0 1px rgba(255,255,255,.78) !important;
        }
        .full-site-preview.atmosphere-marmore-noite .countdown-preview-premium > span,
        .full-site-preview.atmosphere-preto-ouro .countdown-preview-premium > span,
        .full-site-preview.atmosphere-marmore-noite .countdown-preview-premium p,
        .full-site-preview.atmosphere-preto-ouro .countdown-preview-premium p {
          color: rgba(255,255,255,.86) !important;
        }

        /* Floral noturno: faixa rasgada dramática. */
        .full-site-preview.atmosphere-floral-noturno .countdown-preview-premium {
          margin-inline: clamp(-34px, -4vw, -18px) !important;
          border-radius: 0 !important;
          clip-path: polygon(0 7%, 7% 1%, 17% 8%, 27% 0, 37% 7%, 49% 2%, 58% 9%, 71% 3%, 82% 9%, 92% 1%, 100% 7%, 100% 93%, 91% 99%, 79% 91%, 68% 99%, 55% 93%, 43% 100%, 31% 92%, 21% 98%, 11% 91%, 0 98%) !important;
          background:
            radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--brand-secondary), transparent 72%), transparent 22%),
            linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #000 6%), color-mix(in srgb, var(--brand-primary), #000 24%)) !important;
        }
        .full-site-preview.atmosphere-floral-noturno .countdown-card-row strong {
          border-radius: 50% 50% 44% 56% / 52% 45% 55% 48% !important;
          min-height: 118px !important;
        }

        /* Folhagem: orgânico assimétrico. */
        .full-site-preview.atmosphere-folhagem-fina .countdown-preview-premium {
          border-radius: 58px 18px 58px 18px !important;
          background:
            radial-gradient(ellipse at 14% 18%, color-mix(in srgb, var(--brand-secondary), transparent 74%), transparent 24%),
            linear-gradient(135deg, color-mix(in srgb, var(--brand-primary), #ffffff 7%), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 28%)) !important;
        }
        .full-site-preview.atmosphere-folhagem-fina .countdown-card-row strong {
          border-radius: 63% 37% 53% 47% / 42% 64% 36% 58% !important;
          min-height: 116px !important;
        }

        /* Corporativo: painel digital neon. */
        .full-site-preview.atmosphere-azul-corporativo .countdown-preview-premium {
          background:
            linear-gradient(90deg, color-mix(in srgb, var(--brand-secondary), transparent 86%) 1px, transparent 1px),
            linear-gradient(0deg, color-mix(in srgb, var(--brand-secondary), transparent 88%) 1px, transparent 1px),
            linear-gradient(135deg, #06111f, color-mix(in srgb, var(--brand-primary), #000 24%)) !important;
          background-size: 34px 34px, 34px 34px, auto !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 42%) !important;
          border-radius: 18px !important;
          box-shadow: 0 0 0 1px rgba(255,255,255,.04), 0 0 80px color-mix(in srgb, var(--brand-secondary), transparent 76%) !important;
        }
        .full-site-preview.atmosphere-azul-corporativo .countdown-card-row strong {
          border-radius: 8px !important;
          background: rgba(255,255,255,.92) !important;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--brand-secondary), transparent 34%), 0 0 38px color-mix(in srgb, var(--brand-secondary), transparent 72%) !important;
        }

        /* Festa: tickets quebrados, mais movimento. */
        .full-site-preview.atmosphere-festa-glow-premium .countdown-preview-premium {
          background:
            conic-gradient(from 50deg at 80% 20%, color-mix(in srgb, var(--brand-secondary), transparent 36%), transparent 22%, rgba(255,255,255,.14), transparent 75%),
            linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 38%)) !important;
          border-radius: 34px !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong {
          border-radius: 24px 6px 24px 6px !important;
          transform: rotate(-3deg) translateY(-2px) !important;
          clip-path: polygon(0 10%, 10% 0, 100% 0, 90% 10%, 100% 20%, 100% 100%, 0 100%, 10% 90%, 0 80%) !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong:nth-child(even) {
          transform: rotate(3deg) translateY(5px) !important;
        }

        /* Pattern fino: números soltos em fundo claro. */
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium {
          background: transparent !important;
          box-shadow: none !important;
          padding-block: clamp(50px, 7vw, 84px) !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row strong {
          min-width: 110px !important;
          min-height: 112px !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row b {
          font-size: clamp(60px, 7.2vw, 94px) !important;
          color: var(--brand-secondary) !important;
          text-shadow: 0 18px 44px color-mix(in srgb, var(--brand-primary), transparent 78%) !important;
        }


        /* ===== V5 ETAPA 4.3 — FUNDO INTEGRADO + MODELOS MAIS PROFISSIONAIS ===== */
        /* Regra principal: o papel de parede do Passo 5 deve aparecer no site inteiro.
           Só a capa tela cheia/cinematográfica pode cobrir o fundo com a foto. */

        .full-site-preview:not(.layout-tela-cheia):not(.layout-cinematografica) .mini-hero-preview {
          background: transparent !important;
        }

        .full-site-preview.layout-circular .visual-photo-layer,
        .full-site-preview.layout-oval .visual-photo-layer,
        .full-site-preview.layout-foto-moldura .visual-photo-layer,
        .full-site-preview.layout-editorial-cartao .visual-photo-layer,
        .full-site-preview.layout-convite-luxo .visual-photo-layer,
        .full-site-preview.layout-monograma-clean .visual-photo-layer,
        .full-site-preview.layout-split-curvo .visual-photo-layer,
        .full-site-preview.layout-minimal-luxo .visual-photo-layer {
          display: none !important;
          opacity: 0 !important;
        }

        /* Editorial central deixa de ter três fundos: vira foto destacada + cartão sobre o papel do site. */
        .full-site-preview.layout-centralizado .mini-hero-preview {
          min-height: 660px !important;
          display: grid !important;
          place-items: center !important;
          padding: clamp(34px, 5vw, 70px) !important;
          background: transparent !important;
        }

        .full-site-preview.layout-centralizado .visual-photo-layer {
          display: none !important;
        }

        .full-site-preview.layout-centralizado .visual-photo-shape {
          display: block !important;
          width: min(88%, 690px) !important;
          height: clamp(340px, 53vh, 500px) !important;
          border-radius: 38px !important;
          background-size: var(--photo-size, cover) !important;
          background-position: var(--photo-position, center) !important;
          border: 10px solid rgba(255,255,255,.72) !important;
          box-shadow: 0 34px 88px color-mix(in srgb, var(--brand-primary), transparent 78%) !important;
        }

        .full-site-preview.layout-centralizado .mini-hero-copy,
        .full-site-preview.layout-centralizado .mini-hero-copy.align-left,
        .full-site-preview.layout-centralizado .mini-hero-copy.align-center,
        .full-site-preview.layout-centralizado .mini-hero-copy.align-right,
        .full-site-preview.layout-centralizado .mini-hero-copy.place-top,
        .full-site-preview.layout-centralizado .mini-hero-copy.place-middle,
        .full-site-preview.layout-centralizado .mini-hero-copy.place-bottom {
          top: auto !important;
          left: 50% !important;
          right: auto !important;
          bottom: clamp(30px, 4vw, 54px) !important;
          transform: translateX(-50%) !important;
          width: min(78%, 560px) !important;
          padding: clamp(22px, 3vw, 34px) !important;
          border-radius: 30px !important;
          background: rgba(255, 253, 248, .88) !important;
          color: var(--brand-primary) !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 56%) !important;
          box-shadow: 0 26px 74px rgba(23, 15, 20, .18) !important;
          text-shadow: none !important;
          text-align: center !important;
          backdrop-filter: blur(16px) saturate(1.1) !important;
        }

        .full-site-preview.layout-centralizado .preview-meta {
          background: rgba(255,255,255,.70) !important;
          color: color-mix(in srgb, var(--brand-primary), transparent 22%) !important;
          border-color: color-mix(in srgb, var(--brand-secondary), transparent 54%) !important;
          text-shadow: none !important;
        }

        /* Meio a meio agora permite o papel de parede aparecer no lado do texto. */
        .full-site-preview.layout-meio-a-meio .mini-hero-preview {
          background: transparent !important;
          gap: clamp(22px, 3vw, 44px) !important;
          padding: clamp(36px, 5vw, 70px) !important;
        }

        .full-site-preview.layout-meio-a-meio .visual-photo-layer {
          border-radius: 34px !important;
          overflow: hidden !important;
          box-shadow: 0 30px 82px color-mix(in srgb, var(--brand-primary), transparent 78%) !important;
          border: 8px solid rgba(255,255,255,.62) !important;
        }

        .full-site-preview.layout-meio-a-meio .mini-hero-copy {
          background: rgba(255,253,248,.74) !important;
          backdrop-filter: blur(14px) !important;
        }

        /* Foto esfumaçada mantém a ideia, mas deixa a atmosfera do fundo respirar. */
        .full-site-preview.layout-esquerda-esfumada .mini-hero-preview {
          background: transparent !important;
        }

        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy {
          border-radius: 34px !important;
          padding: clamp(32px, 4vw, 54px) !important;
          background: linear-gradient(135deg,
            color-mix(in srgb, var(--brand-primary), transparent 4%),
            color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 16%)) !important;
          box-shadow: 0 32px 86px color-mix(in srgb, var(--brand-primary), transparent 64%) !important;
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer {
          border-radius: 48px 0 0 48px !important;
          box-shadow: -36px 0 90px color-mix(in srgb, var(--brand-primary), transparent 62%) !important;
        }

        /* Damasco casamento: clássico fino, com desenho adulto. */
        .full-site-preview.atmosphere-casamento-damasco {
          background:
            radial-gradient(circle at 18% 12%, rgba(201,164,108,.18), transparent 28%),
            radial-gradient(circle at 78% 70%, rgba(126,78,105,.12), transparent 30%),
            linear-gradient(135deg, rgba(255,253,248,.94), rgba(239,226,209,.94)),
            radial-gradient(ellipse at center, transparent 0 46%, rgba(201,164,108,.16) 47% 49%, transparent 50% 100%) !important;
          background-size: auto, auto, auto, 88px 88px !important;
        }

        .full-site-preview.atmosphere-casamento-damasco .countdown-preview-premium {
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,.86), transparent),
            linear-gradient(135deg, color-mix(in srgb, #fffdf8, var(--brand-secondary) 10%), color-mix(in srgb, #fffdf8, var(--brand-secondary) 24%)) !important;
          border-radius: 999px !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 52%) !important;
        }

        /* Debutante cristal: brilho elegante para 15 anos, sem confete infantil. */
        .full-site-preview.atmosphere-debutante-cristal {
          background:
            radial-gradient(circle at 18% 18%, rgba(224,167,200,.42), transparent 22%),
            radial-gradient(circle at 82% 12%, rgba(255,255,255,.72), transparent 18%),
            radial-gradient(circle at 66% 72%, rgba(196,162,98,.24), transparent 24%),
            linear-gradient(135deg, #fff6fb 0%, #efe4ff 48%, #f8f1ff 100%) !important;
        }

        .full-site-preview.atmosphere-debutante-cristal .countdown-preview-premium {
          background: transparent !important;
          box-shadow: none !important;
        }

        .full-site-preview.atmosphere-debutante-cristal .countdown-card-row strong {
          border-radius: 26px !important;
          transform: rotate(-2deg) !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.62)) !important;
          box-shadow:
            0 18px 48px rgba(88,34,111,.16),
            inset 0 0 0 1px rgba(255,255,255,.85) !important;
        }

        .full-site-preview.atmosphere-debutante-cristal .countdown-card-row strong:nth-child(even) {
          transform: rotate(2deg) translateY(8px) !important;
        }

        /* Infantil premium: aquarela suave e limpa, não desenho infantil pesado. */
        .full-site-preview.atmosphere-infantil-aquarela-premium {
          background:
            radial-gradient(circle at 15% 16%, rgba(242,182,160,.45), transparent 23%),
            radial-gradient(circle at 74% 18%, rgba(120,170,210,.28), transparent 21%),
            radial-gradient(circle at 78% 80%, rgba(255,219,139,.26), transparent 25%),
            linear-gradient(135deg, #fffaf5 0%, #eef8ff 52%, #fff6ee 100%) !important;
        }

        .full-site-preview.atmosphere-infantil-aquarela-premium .countdown-preview-premium {
          border-radius: 44px !important;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,.72), transparent 26%),
            linear-gradient(135deg, rgba(255,255,255,.68), rgba(255,255,255,.34)) !important;
          color: var(--brand-primary) !important;
          box-shadow: 0 28px 70px rgba(61,80,94,.12) !important;
        }

        .full-site-preview.atmosphere-infantil-aquarela-premium .countdown-card-row strong {
          border-radius: 32px 32px 18px 32px !important;
          background: rgba(255,255,255,.82) !important;
        }

        /* Jardim editorial substitui a antiga faixa rasgada. Nada de recorte de 5ª série. */
        .full-site-preview.atmosphere-floral-noturno {
          background:
            radial-gradient(circle at 14% 16%, rgba(212,147,163,.20), transparent 22%),
            radial-gradient(circle at 92% 24%, rgba(201,164,108,.16), transparent 24%),
            radial-gradient(ellipse at 18% 76%, rgba(255,255,255,.06), transparent 30%),
            linear-gradient(180deg, #120914 0%, #291329 52%, #160a19 100%) !important;
          color: #fffdf8;
        }

        .full-site-preview.atmosphere-floral-noturno::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse at 8% 16%, transparent 0 42px, rgba(212,147,163,.11) 43px 45px, transparent 46px),
            radial-gradient(ellipse at 88% 34%, transparent 0 58px, rgba(201,164,108,.12) 59px 61px, transparent 62px),
            repeating-linear-gradient(115deg, transparent 0 42px, rgba(255,255,255,.045) 43px 44px, transparent 45px 84px);
          opacity: .72;
        }

        .full-site-preview.atmosphere-floral-noturno > * {
          position: relative;
          z-index: 1;
        }

        .full-site-preview.atmosphere-floral-noturno .countdown-preview-premium {
          margin-inline: clamp(-42px, -5vw, -20px) !important;
          border-radius: 0 !important;
          clip-path: none !important;
          background:
            linear-gradient(90deg, transparent 0%, rgba(255,255,255,.10) 14%, transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.06)) !important;
          border-top: 1px solid rgba(255,255,255,.18) !important;
          border-bottom: 1px solid rgba(255,255,255,.14) !important;
          box-shadow: none !important;
        }

        .full-site-preview.atmosphere-floral-noturno .countdown-card-row strong {
          clip-path: none !important;
          border-radius: 24px !important;
          background: rgba(255,253,248,.94) !important;
        }

        .full-site-preview.atmosphere-floral-noturno .countdown-card-row b {
          color: var(--brand-secondary) !important;
        }

        /* Festa glow mais profissional: faixa palco, não ticket torto. */
        .full-site-preview.atmosphere-festa-glow-premium .countdown-preview-premium {
          margin-inline: clamp(-42px, -5vw, -20px) !important;
          border-radius: 0 !important;
          background:
            radial-gradient(circle at 18% 50%, color-mix(in srgb, var(--brand-secondary), transparent 52%), transparent 28%),
            radial-gradient(circle at 82% 50%, rgba(255,255,255,.18), transparent 24%),
            linear-gradient(90deg,
              color-mix(in srgb, var(--brand-primary), #000 20%) 0%,
              color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 34%) 50%,
              color-mix(in srgb, var(--brand-primary), #000 18%) 100%) !important;
          box-shadow: 0 28px 76px color-mix(in srgb, var(--brand-primary), transparent 68%) !important;
        }

        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong {
          clip-path: none !important;
          border-radius: 18px !important;
          transform: none !important;
        }

        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong:nth-child(even) {
          transform: translateY(0) !important;
        }

        /* Geométrico fino com números soltos e fundo respirando. */
        .full-site-preview.atmosphere-pattern-fino {
          background:
            linear-gradient(135deg, rgba(255,253,248,.88), rgba(238,229,219,.88)),
            linear-gradient(30deg, rgba(67,38,63,.13) 12%, transparent 12.5%, transparent 87%, rgba(67,38,63,.13) 87.5%),
            linear-gradient(150deg, rgba(196,162,98,.15) 12%, transparent 12.5%, transparent 87%, rgba(196,162,98,.15) 87.5%) !important;
          background-size: auto, 94px 162px, 94px 162px !important;
        }

        /* Swatches novos e swatches corrigidos dos cards do Passo 5 */
        .atmosphere-swatch-casamento-damasco {
          background:
            linear-gradient(135deg, rgba(255,253,248,.94), rgba(238,224,206,.94)),
            radial-gradient(ellipse at center, transparent 0 42%, rgba(201,164,108,.24) 43% 47%, transparent 48%) !important;
          background-size: auto, 54px 54px !important;
        }
        .atmosphere-swatch-casamento-damasco::before {
          inset: 0 !important;
          background: radial-gradient(circle at 24% 24%, rgba(79,51,67,.16), transparent 18%) !important;
        }

        .atmosphere-swatch-debutante-cristal {
          background:
            radial-gradient(circle at 18% 18%, rgba(224,167,200,.62), transparent 28%),
            radial-gradient(circle at 78% 24%, rgba(255,255,255,.88), transparent 22%),
            linear-gradient(135deg, #fff1fb, #e9dcff) !important;
        }
        .atmosphere-swatch-debutante-cristal::before {
          inset: 0 !important;
          background: repeating-linear-gradient(135deg, rgba(255,255,255,.26) 0 1px, transparent 1px 22px) !important;
        }

        .atmosphere-swatch-infantil-aquarela-premium {
          background:
            radial-gradient(circle at 18% 24%, rgba(242,182,160,.65), transparent 30%),
            radial-gradient(circle at 78% 28%, rgba(120,170,210,.42), transparent 26%),
            radial-gradient(circle at 70% 78%, rgba(255,219,139,.34), transparent 24%),
            linear-gradient(135deg, #fffaf5, #eef8ff) !important;
        }

        .atmosphere-swatch-floral-noturno {
          background:
            radial-gradient(circle at 14% 18%, rgba(212,147,163,.42), transparent 24%),
            radial-gradient(circle at 88% 28%, rgba(201,164,108,.30), transparent 22%),
            linear-gradient(180deg, #120914, #291329) !important;
        }
        .atmosphere-swatch-floral-noturno::before {
          inset: 0 !important;
          background: repeating-linear-gradient(115deg, transparent 0 34px, rgba(255,255,255,.09) 35px 36px, transparent 37px 70px) !important;
        }

        .atmosphere-swatch-pattern-fino {
          background:
            linear-gradient(135deg, #fffdf8, #eadfd2),
            linear-gradient(30deg, rgba(67,38,63,.16) 12%, transparent 12.5%, transparent 87%, rgba(67,38,63,.16) 87.5%),
            linear-gradient(150deg, rgba(196,162,98,.20) 12%, transparent 12.5%, transparent 87%, rgba(196,162,98,.20) 87.5%) !important;
          background-size: auto, 64px 112px, 64px 112px !important;
        }



        /* ===== V5 ETAPA 4.4 — RETOQUE PREMIUM DOS FUNDOS E NOVAS CORES ===== */
        .full-site-preview .mini-hero-copy {
          text-shadow: 0 2px 14px rgba(0,0,0,.14), 0 0 1px rgba(255,255,255,.54) !important;
        }
        .full-site-preview.layout-tela-cheia .mini-hero-copy,
        .full-site-preview.layout-cinematografica .mini-hero-copy,
        .full-site-preview.atmosphere-roxo-luxo .mini-hero-copy,
        .full-site-preview.atmosphere-marmore-noite .mini-hero-copy,
        .full-site-preview.atmosphere-preto-ouro .mini-hero-copy,
        .full-site-preview.atmosphere-floral-noturno .mini-hero-copy,
        .full-site-preview.atmosphere-prata-cerimonial .mini-hero-copy,
        .full-site-preview.atmosphere-doodle-whatsapp-premium .mini-hero-copy {
          background: color-mix(in srgb, #ffffff, transparent 20%) !important;
          backdrop-filter: blur(14px) saturate(1.12) !important;
          border: 1px solid rgba(255,255,255,.46) !important;
          box-shadow: 0 22px 54px rgba(0,0,0,.16) !important;
        }
        .full-site-preview.layout-circular .mini-hero-copy,
        .full-site-preview.layout-oval .mini-hero-copy,
        .full-site-preview.layout-foto-moldura .mini-hero-copy,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy,
        .full-site-preview.layout-convite-luxo .mini-hero-copy,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy,
        .full-site-preview.layout-faixa-convite .mini-hero-copy,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy {
          background: rgba(255,255,255,.72) !important;
          backdrop-filter: blur(12px) !important;
        }
        .full-site-preview:not(.layout-tela-cheia):not(.layout-cinematografica):not(.layout-black-tie):not(.layout-corporativo-neon) .visual-photo-shape {
          background-color: rgba(255,255,255,.55) !important;
          backdrop-filter: blur(2px) !important;
        }
        .full-site-preview.layout-meio-a-meio .visual-photo-shape,
        .full-site-preview.layout-esquerda-esfumada .visual-photo-shape,
        .full-site-preview.layout-split-curvo .visual-photo-shape {
          background-color: transparent !important;
        }

        .atmosphere-swatch-roxo-luxo i::before { content: "caixa fosca" !important; }
        .full-site-preview.atmosphere-roxo-luxo .countdown-preview-premium {
          margin-inline: clamp(-18px, -2vw, -8px) !important;
          padding: clamp(32px, 5vw, 56px) clamp(28px, 4vw, 52px) !important;
          border-radius: 34px !important;
          background: radial-gradient(circle at 12% 12%, rgba(211,175,103,.24), transparent 26%), linear-gradient(135deg, rgba(76,27,95,.90), rgba(28,8,40,.92)) !important;
          border: 1px solid rgba(211,175,103,.34) !important;
          box-shadow: 0 32px 90px rgba(18,5,28,.40), inset 0 1px 0 rgba(255,255,255,.16) !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row strong {
          min-width: 102px !important;
          min-height: 104px !important;
          background: rgba(255,255,255,.88) !important;
          border: 1px solid rgba(211,175,103,.28) !important;
          box-shadow: 0 18px 44px rgba(0,0,0,.18) !important;
          border-radius: 24px !important;
        }
        .full-site-preview.atmosphere-roxo-luxo .countdown-card-row b {
          font-size: clamp(44px, 5vw, 68px) !important;
          text-shadow: none !important;
        }
        .full-site-preview.atmosphere-clean-luxo .countdown-preview-premium {
          margin-inline: clamp(-18px, -2vw, -8px) !important;
          border-radius: 28px !important;
        }
        .full-site-preview.atmosphere-offwhite-3d .countdown-card-row b {
          text-shadow: 3px 4px 0 color-mix(in srgb, var(--brand-secondary), transparent 70%), 0 10px 24px rgba(80,70,50,.20) !important;
        }
        .full-site-preview.atmosphere-art-deco-dourado,
        .atmosphere-swatch-art-deco-dourado {
          background-color: #f9e6b4 !important;
        }
        .full-site-preview.atmosphere-art-deco-dourado .countdown-preview-premium {
          outline-color: color-mix(in srgb, #f3c85d, transparent 8%) !important;
          box-shadow: 0 34px 92px rgba(135,91,20,.22), inset 0 0 0 1px rgba(255,255,255,.12) !important;
        }
        .full-site-preview.atmosphere-seda-champagne {
          background: radial-gradient(ellipse at 12% 6%, rgba(255,255,255,.78), transparent 32%), radial-gradient(ellipse at 82% 18%, rgba(185,145,96,.18), transparent 32%), repeating-linear-gradient(28deg, rgba(255,255,255,.10) 0 2px, transparent 2px 17px), linear-gradient(135deg, #fff4e4, #ceb18e 58%, #fff1df) !important;
        }
        .full-site-preview.atmosphere-seda-champagne .countdown-preview-premium {
          border: 1px solid rgba(255,255,255,.56) !important;
          outline: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 34%) !important;
          outline-offset: -10px !important;
        }
        .full-site-preview.atmosphere-marmore-noite,
        .atmosphere-swatch-marmore-noite {
          background: radial-gradient(ellipse at 18% 20%, rgba(212,175,55,.22), transparent 23%), linear-gradient(123deg, transparent 0 27%, rgba(255,255,255,.08) 28% 28.5%, transparent 29%), linear-gradient(102deg, transparent 0 48%, rgba(212,175,55,.48) 49% 49.7%, transparent 51%), linear-gradient(147deg, transparent 0 61%, rgba(255,255,255,.10) 62% 62.5%, transparent 64%), radial-gradient(circle at 78% 84%, rgba(212,175,55,.16), transparent 20%), linear-gradient(135deg, #030306, #17131d 54%, #050508) !important;
        }
        .full-site-preview.atmosphere-folhagem-fina,
        .atmosphere-swatch-folhagem-fina {
          background: radial-gradient(ellipse 32px 78px at 16% 24%, rgba(49,79,61,.30), transparent 58%), radial-gradient(ellipse 30px 74px at 80% 26%, rgba(49,79,61,.24), transparent 58%), radial-gradient(ellipse 42px 92px at 72% 80%, rgba(199,176,106,.22), transparent 58%), linear-gradient(45deg, transparent 0 48%, rgba(49,79,61,.12) 49% 50%, transparent 51%), linear-gradient(135deg, #f4f8ef, #c9d8c0) !important;
        }
        .full-site-preview.atmosphere-folhagem-fina .countdown-preview-premium {
          border-radius: 62% 38% 54% 46% / 34% 62% 38% 66% !important;
        }
        .full-site-preview.atmosphere-floral-noturno,
        .atmosphere-swatch-floral-noturno {
          background: radial-gradient(ellipse 38px 20px at 16% 18%, rgba(212,147,163,.35), transparent 62%), radial-gradient(ellipse 22px 38px at 20% 22%, rgba(212,147,163,.28), transparent 62%), radial-gradient(ellipse 34px 18px at 84% 28%, rgba(212,147,163,.24), transparent 62%), radial-gradient(ellipse 18px 34px at 88% 32%, rgba(212,147,163,.22), transparent 62%), linear-gradient(36deg, transparent 0 48%, rgba(201,164,108,.12) 49% 50%, transparent 51%), linear-gradient(135deg, #100911, #321635 60%, #09060a) !important;
        }
        .full-site-preview.atmosphere-floral-noturno .countdown-preview-premium {
          clip-path: none !important;
          border-radius: 34px !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-preview-premium {
          border-radius: 26px !important;
          clip-path: polygon(0 0, 100% 0, 100% 37%, 97% 41%, 100% 45%, 100% 100%, 0 100%, 0 45%, 3% 41%, 0 37%) !important;
          border: 1px solid rgba(255,255,255,.26) !important;
        }
        .full-site-preview.atmosphere-festa-glow-premium .countdown-card-row strong {
          clip-path: polygon(0 0, 100% 0, 100% 36%, 92% 42%, 100% 48%, 100% 100%, 0 100%, 0 48%, 8% 42%, 0 36%) !important;
          border-radius: 18px !important;
        }
        .full-site-preview.atmosphere-pattern-fino {
          background: linear-gradient(135deg, rgba(255,253,248,.92), rgba(238,229,219,.92)), linear-gradient(30deg, rgba(67,38,63,.16) 12%, transparent 12.5%, transparent 87%, rgba(67,38,63,.16) 87.5%), linear-gradient(150deg, rgba(196,162,98,.22) 12%, transparent 12.5%, transparent 87%, rgba(196,162,98,.22) 87.5%) !important;
          background-size: auto, 88px 152px, 88px 152px !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-preview-premium {
          background: rgba(255,255,255,.64) !important;
          border-radius: 30px !important;
          box-shadow: 0 28px 70px rgba(58,38,32,.11) !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row strong {
          min-width: 104px !important;
          min-height: 104px !important;
          background: rgba(255,255,255,.84) !important;
          border: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 36%) !important;
          border-radius: 22px !important;
          box-shadow: 10px 10px 0 rgba(196,162,98,.18), 0 20px 44px rgba(0,0,0,.10) !important;
        }
        .full-site-preview.atmosphere-pattern-fino .countdown-card-row b { font-size: clamp(44px, 5vw, 68px) !important; }
        .full-site-preview.atmosphere-casamento-damasco,
        .atmosphere-swatch-casamento-damasco {
          background: radial-gradient(ellipse at 50% 28%, transparent 0 28%, rgba(201,164,108,.20) 29% 33%, transparent 34%), radial-gradient(ellipse at 50% 72%, transparent 0 28%, rgba(79,51,67,.12) 29% 33%, transparent 34%), linear-gradient(135deg, rgba(255,253,248,.96), rgba(238,224,206,.96)) !important;
          background-size: 74px 74px, 74px 74px, auto !important;
        }
        .full-site-preview.atmosphere-casamento-damasco .countdown-preview-premium {
          background: linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 25%)) !important;
          border-radius: 28px !important;
        }
        .full-site-preview.atmosphere-casamento-damasco .countdown-preview-premium > span,
        .full-site-preview.atmosphere-casamento-damasco .countdown-preview-premium p { color: color-mix(in srgb, #ffffff, var(--brand-secondary) 18%) !important; }
        .full-site-preview.atmosphere-debutante-cristal .countdown-preview-premium {
          border: 2px solid rgba(255,255,255,.56) !important;
          outline: 1px solid color-mix(in srgb, var(--brand-secondary), transparent 20%) !important;
          outline-offset: -12px !important;
          box-shadow: 0 32px 80px rgba(88,39,115,.18) !important;
        }
        .full-site-preview.atmosphere-infantil-aquarela-premium .countdown-preview-premium {
          margin-inline: clamp(-18px, -2vw, -8px) !important;
          border-radius: 24px !important;
          clip-path: polygon(0 9%, 6% 4%, 12% 9%, 18% 3%, 26% 8%, 34% 4%, 43% 10%, 54% 3%, 63% 9%, 72% 4%, 82% 9%, 91% 3%, 100% 9%, 100% 92%, 91% 98%, 83% 92%, 73% 97%, 64% 91%, 54% 98%, 44% 91%, 35% 96%, 26% 91%, 17% 97%, 8% 91%, 0 97%) !important;
          background: radial-gradient(circle at 18% 20%, rgba(255,255,255,.70), transparent 22%), linear-gradient(135deg, rgba(255,255,255,.92), color-mix(in srgb, #ffffff, var(--brand-secondary) 18%)) !important;
        }
        .full-site-preview.atmosphere-infantil-aquarela-premium .countdown-card-row strong {
          border-radius: 22px !important;
          box-shadow: 8px 10px 0 color-mix(in srgb, var(--brand-secondary), transparent 70%), 0 18px 38px rgba(0,0,0,.10) !important;
        }

        .atmosphere-swatch-prata-cerimonial { background: linear-gradient(120deg, rgba(255,255,255,.95), rgba(166,174,184,.42), rgba(255,255,255,.70)), repeating-linear-gradient(135deg, rgba(255,255,255,.32) 0 1px, transparent 1px 16px), linear-gradient(135deg, #eef1f4, #aeb6c0 60%, #fbfcfd) !important; }
        .atmosphere-swatch-prata-cerimonial i::before { content: "prata luxo" !important; }
        .full-site-preview.atmosphere-prata-cerimonial { background: linear-gradient(120deg, rgba(255,255,255,.92), rgba(156,164,174,.28), rgba(255,255,255,.62)), repeating-linear-gradient(135deg, rgba(255,255,255,.20) 0 1px, transparent 1px 20px), linear-gradient(135deg, #eef1f4, #b0b8c2 60%, #fbfcfd) !important; }
        .full-site-preview.atmosphere-prata-cerimonial .countdown-preview-premium { background: linear-gradient(135deg, rgba(255,255,255,.86), rgba(215,220,228,.82)) !important; border: 1px solid rgba(255,255,255,.72) !important; border-radius: 30px !important; box-shadow: 0 32px 80px rgba(70,78,90,.18), inset 0 1px 0 rgba(255,255,255,.88) !important; }
        .atmosphere-swatch-cinza-perola { background: radial-gradient(circle at 22% 18%, rgba(255,255,255,.58), transparent 20%), linear-gradient(135deg, #f3f1ec, #bfc2c3 55%, #f9f8f4) !important; }
        .atmosphere-swatch-cinza-perola i::before { content: "pérola" !important; }
        .full-site-preview.atmosphere-cinza-perola { background: radial-gradient(circle at 18% 12%, rgba(255,255,255,.55), transparent 21%), radial-gradient(circle at 84% 82%, rgba(216,211,200,.28), transparent 24%), linear-gradient(135deg, #f5f3ee, #c7c8c8 58%, #f9f8f4) !important; }
        .full-site-preview.atmosphere-cinza-perola .countdown-preview-premium { background: rgba(255,255,255,.72) !important; border-radius: 28px !important; }
        .atmosphere-swatch-amarelo-dourado { background: radial-gradient(circle at 18% 22%, rgba(255,255,255,.62), transparent 20%), radial-gradient(circle at 78% 74%, rgba(244,200,74,.38), transparent 26%), linear-gradient(135deg, #fff8d6, #f0be3b 58%, #fff3bc) !important; }
        .atmosphere-swatch-amarelo-dourado i::before { content: "solar" !important; }
        .full-site-preview.atmosphere-amarelo-dourado { background: radial-gradient(circle at 18% 22%, rgba(255,255,255,.64), transparent 20%), radial-gradient(circle at 78% 74%, rgba(244,200,74,.30), transparent 26%), repeating-linear-gradient(90deg, rgba(255,255,255,.14) 0 1px, transparent 1px 28px), linear-gradient(135deg, #fff8d6, #f0be3b 58%, #fff3bc) !important; }
        .full-site-preview.atmosphere-amarelo-dourado .countdown-preview-premium { background: linear-gradient(135deg, rgba(255,255,255,.82), rgba(244,200,74,.28)) !important; border-radius: 999px 28px 999px 28px !important; }
        .atmosphere-swatch-verde-bambu-casamento { background: linear-gradient(90deg, transparent 0 46%, rgba(49,79,61,.28) 47% 48%, transparent 49%), linear-gradient(135deg, #edf4e8, #9dae75 60%, #f5f8ef) !important; background-size: 34px auto, auto !important; }
        .atmosphere-swatch-verde-bambu-casamento i::before { content: "bambu" !important; }
        .full-site-preview.atmosphere-verde-bambu-casamento { background: radial-gradient(ellipse 28px 78px at 18% 24%, rgba(49,79,61,.22), transparent 60%), radial-gradient(ellipse 28px 78px at 80% 78%, rgba(49,79,61,.18), transparent 60%), linear-gradient(90deg, transparent 0 46%, rgba(49,79,61,.18) 47% 48%, transparent 49%), linear-gradient(135deg, #edf4e8, #9dae75 60%, #f5f8ef) !important; background-size: auto, auto, 42px auto, auto !important; }
        .full-site-preview.atmosphere-verde-bambu-casamento .countdown-preview-premium { border-radius: 50px 18px 50px 18px !important; background: linear-gradient(135deg, rgba(255,255,255,.80), rgba(199,176,106,.22)) !important; }
        .atmosphere-swatch-doodle-whatsapp-premium { background: radial-gradient(circle at 20% 20%, rgba(255,255,255,.36), transparent 12%), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(135deg, #26354b, #526174) !important; background-size: auto, 34px 34px, 34px 34px, auto !important; }
        .atmosphere-swatch-doodle-whatsapp-premium::before { content: "♡ ✨ 🎁 ☕ 🌿 ★ ♫" !important; position: absolute !important; inset: 18px 16px auto 16px !important; color: rgba(255,255,255,.42) !important; font-size: 19px !important; letter-spacing: .55em !important; line-height: 1.8 !important; z-index: 2 !important; }
        .atmosphere-swatch-doodle-whatsapp-premium i::before { content: "doodles" !important; }
        .full-site-preview.atmosphere-doodle-whatsapp-premium { background: radial-gradient(circle at 12% 12%, rgba(255,255,255,.22), transparent 12%), radial-gradient(circle at 82% 22%, rgba(216,182,106,.18), transparent 13%), linear-gradient(90deg, rgba(255,255,255,.11) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.09) 1px, transparent 1px), linear-gradient(135deg, #26354b, #526174) !important; background-size: auto, auto, 46px 46px, 46px 46px, auto !important; }
        .full-site-preview.atmosphere-doodle-whatsapp-premium::before { content: "♡  ✨  🎁  ☕  🌿  ★  ♫  ♡  ✨  🎂  🎈  ☁  ✉" !important; position: absolute !important; inset: 34px 24px auto 24px !important; color: rgba(255,255,255,.18) !important; font-size: clamp(18px, 3vw, 32px) !important; letter-spacing: .55em !important; line-height: 2.6 !important; pointer-events: none !important; z-index: 0 !important; }
        .full-site-preview.atmosphere-doodle-whatsapp-premium > * { position: relative !important; z-index: 1 !important; }
        .full-site-preview.atmosphere-doodle-whatsapp-premium .countdown-preview-premium { background: rgba(255,255,255,.74) !important; border-radius: 30px !important; }

        @media (max-width: 900px) {
          .full-site-preview.layout-centralizado .visual-photo-shape {
            width: 96% !important;
            height: 360px !important;
          }

          .full-site-preview.layout-centralizado .mini-hero-copy {
            width: 88% !important;
          }
        }


        /* ===== V5 ETAPA 4.5A — CORREÇÃO DA FOTO NOS MODELOS DO PASSO 2 ===== */
        /* O bug estava no uso de background: ... com !important na moldura da foto.
           Esse shorthand apagava o background-image inline da foto escolhida em alguns modelos.
           A partir daqui só usamos background-color e reforçamos que todas as capas precisam exibir a mídia escolhida. */
        .full-site-preview .visual-photo-layer,
        .full-site-preview .visual-photo-shape {
          background-repeat: no-repeat !important;
          background-position: var(--photo-position, center) !important;
        }

        .full-site-preview .visual-photo-shape {
          background-color: rgba(255,255,255,.48) !important;
        }

        .full-site-preview.layout-circular .visual-photo-shape,
        .full-site-preview.layout-oval .visual-photo-shape,
        .full-site-preview.layout-foto-moldura .visual-photo-shape,
        .full-site-preview.layout-editorial-cartao .visual-photo-shape,
        .full-site-preview.layout-convite-luxo .visual-photo-shape,
        .full-site-preview.layout-centralizado .visual-photo-shape,
        .full-site-preview.layout-poster-editorial .visual-photo-shape,
        .full-site-preview.layout-split-curvo .visual-photo-shape,
        .full-site-preview.layout-minimal-luxo .visual-photo-shape {
          background-size: var(--photo-size, cover) !important;
        }

        .full-site-preview.layout-circular .visual-photo-shape,
        .full-site-preview.layout-oval .visual-photo-shape,
        .full-site-preview.layout-foto-moldura .visual-photo-shape,
        .full-site-preview.layout-editorial-cartao .visual-photo-shape,
        .full-site-preview.layout-convite-luxo .visual-photo-shape,
        .full-site-preview.layout-centralizado .visual-photo-shape,
        .full-site-preview.layout-poster-editorial .visual-photo-shape,
        .full-site-preview.layout-split-curvo .visual-photo-shape,
        .full-site-preview.layout-minimal-luxo .visual-photo-shape {
          display: block !important;
        }

        .full-site-preview.layout-monograma-clean .mini-hero-preview {
          grid-template-rows: auto auto !important;
          gap: 28px !important;
        }

        .full-site-preview.layout-monograma-clean .visual-photo-layer {
          display: none !important;
        }

        .full-site-preview.layout-monograma-clean .visual-photo-shape {
          display: block !important;
          width: clamp(170px, 26vw, 260px) !important;
          height: clamp(170px, 26vw, 260px) !important;
          border-radius: 999px !important;
          background-size: var(--photo-size, cover) !important;
          background-position: var(--photo-position, center) !important;
          background-color: rgba(255,255,255,.58) !important;
          border: 8px solid rgba(255,255,255,.82) !important;
          box-shadow: 0 24px 70px color-mix(in srgb, var(--brand-primary), transparent 80%) !important;
        }

        .full-site-preview.layout-faixa-convite .visual-photo-layer,
        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer,
        .full-site-preview.layout-black-tie .visual-photo-layer,
        .full-site-preview.layout-corporativo-neon .visual-photo-layer,
        .full-site-preview.layout-festa-palco .visual-photo-layer,
        .full-site-preview.layout-tela-cheia .visual-photo-layer,
        .full-site-preview.layout-cinematografica .visual-photo-layer {
          display: block !important;
          background-size: var(--photo-size, cover) !important;
          background-position: var(--photo-position, center) !important;
        }


        /* ===== V5 ETAPA 4.5K — AJUSTES PONTUAIS DE CAPA, FOTO E COR ===== */
        /* 1) O ajuste manual da foto volta a aparecer no Passo 4. */
        .upload-only-step .photo-adjust-card.photo-adjust-card-inside-model {
          display: block !important;
        }

        /* 2) A foto deve preencher automaticamente as molduras dos modelos de capa. */
        .full-site-preview .visual-photo-layer,
        .full-site-preview .visual-photo-shape {
          background-repeat: no-repeat !important;
          background-position: var(--photo-position, center) !important;
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer,
        .full-site-preview.layout-black-tie .visual-photo-layer,
        .full-site-preview.layout-corporativo-neon .visual-photo-layer,
        .full-site-preview.layout-festa-palco .visual-photo-layer,
        .full-site-preview.layout-tela-cheia .visual-photo-layer,
        .full-site-preview.layout-cinematografica .visual-photo-layer,
        .full-site-preview.layout-faixa-convite .visual-photo-layer {
          background-size: var(--photo-size, cover) !important;
          background-position: var(--photo-position, center) !important;
        }

        .full-site-preview.layout-split-curvo .visual-photo-shape,
        .full-site-preview.layout-minimal-luxo .visual-photo-shape,
        .full-site-preview.layout-circular .visual-photo-shape,
        .full-site-preview.layout-oval .visual-photo-shape,
        .full-site-preview.layout-foto-moldura .visual-photo-shape,
        .full-site-preview.layout-editorial-cartao .visual-photo-shape,
        .full-site-preview.layout-convite-luxo .visual-photo-shape,
        .full-site-preview.layout-poster-editorial .visual-photo-shape,
        .full-site-preview.layout-monograma-clean .visual-photo-shape {
          background-size: var(--photo-size, cover) !important;
          background-position: var(--photo-position, center) !important;
        }

        /* 3) Nos modelos escuros/esfumaçados, a área da direita não pode ficar transparente.
           Ela recebe a cor completa do tema por trás da foto/fumaça. */
        .full-site-preview.layout-esquerda-esfumada .mini-hero-preview {
          background:
            radial-gradient(circle at 13% 18%, color-mix(in srgb, var(--brand-secondary), transparent 60%), transparent 28%),
            linear-gradient(
              90deg,
              var(--brand-primary) 0%,
              color-mix(in srgb, var(--brand-primary), var(--brand-secondary) 18%) 48%,
              color-mix(in srgb, var(--brand-primary), #000000 10%) 100%
            ) !important;
        }

        .full-site-preview.layout-esquerda-esfumada .visual-photo-layer::after {
          background:
            linear-gradient(
              90deg,
              color-mix(in srgb, var(--brand-primary), transparent 0%) 0%,
              color-mix(in srgb, var(--brand-primary), transparent 4%) 16%,
              color-mix(in srgb, var(--brand-primary), transparent 32%) 38%,
              color-mix(in srgb, var(--brand-primary), transparent 78%) 64%,
              color-mix(in srgb, var(--brand-primary), transparent 88%) 100%
            ) !important;
        }

        /* 4) O nome principal também acompanha a paleta.
           Antes alguns modelos deixavam o primeiro nome travado em branco. */
        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy strong,
        .full-site-preview.layout-black-tie .mini-hero-copy strong,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy strong,
        .full-site-preview.layout-festa-palco .mini-hero-copy strong,
        .full-site-preview.layout-tela-cheia .mini-hero-copy strong,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong {
          color: var(--brand-secondary) !important;
          text-shadow: 0 12px 34px rgba(0, 0, 0, 0.38) !important;
        }

        .full-site-preview.layout-esquerda-esfumada .mini-hero-copy strong span,
        .full-site-preview.layout-black-tie .mini-hero-copy strong span,
        .full-site-preview.layout-corporativo-neon .mini-hero-copy strong span,
        .full-site-preview.layout-festa-palco .mini-hero-copy strong span,
        .full-site-preview.layout-tela-cheia .mini-hero-copy strong span,
        .full-site-preview.layout-cinematografica .mini-hero-copy strong span {
          color: color-mix(in srgb, var(--brand-secondary), #ffffff 16%) !important;
        }

        .full-site-preview.layout-split-curvo .mini-hero-copy strong,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy strong,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong,
        .full-site-preview.layout-circular .mini-hero-copy strong,
        .full-site-preview.layout-oval .mini-hero-copy strong,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong,
        .full-site-preview.layout-poster-editorial .mini-hero-copy strong,
        .full-site-preview.layout-faixa-convite .mini-hero-copy strong,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong {
          color: var(--brand-primary) !important;
        }

        .full-site-preview.layout-split-curvo .mini-hero-copy strong span,
        .full-site-preview.layout-minimal-luxo .mini-hero-copy strong span,
        .full-site-preview.layout-meio-a-meio .mini-hero-copy strong span,
        .full-site-preview.layout-circular .mini-hero-copy strong span,
        .full-site-preview.layout-oval .mini-hero-copy strong span,
        .full-site-preview.layout-foto-moldura .mini-hero-copy strong span,
        .full-site-preview.layout-editorial-cartao .mini-hero-copy strong span,
        .full-site-preview.layout-convite-luxo .mini-hero-copy strong span,
        .full-site-preview.layout-poster-editorial .mini-hero-copy strong span,
        .full-site-preview.layout-faixa-convite .mini-hero-copy strong span,
        .full-site-preview.layout-monograma-clean .mini-hero-copy strong span {
          color: var(--brand-secondary) !important;
        }


      `}</style>
    </>
  );
}
