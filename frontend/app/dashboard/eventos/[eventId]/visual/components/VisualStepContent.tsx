import { ChangeEvent } from "react";
import { StyleIcon } from "./StyleIcon";

type VisualStepContentProps = {
  [key: string]: any;
  handleHeroFileChange: (eventChange: ChangeEvent<HTMLInputElement>) => void;
};

export function VisualStepContent(props: VisualStepContentProps) {
  const { step, handleHeroFileChange, heroLayoutOptions, updateHeroLayout, form, photoFit, setPhotoFit, photoZoom, setPhotoZoom, photoPositionX, setPhotoPositionX, photoPositionY, setPhotoPositionY, visualStyleOptions, updateVisualStyle, colorOptions, updateColor, handleTextChange, typographyCategories, typographyOptions, getFontClass, updateChoice, titleSizeOptions, setForm, textDensityOptions, textAlign, setTextAlign, textPlacement, setTextPlacement, visualSections, updateToggle, event, publicUrlLabel, getTypographyLabel, getAtmosphereLabel, activeSectionsCount } = props;

    if (step.key === "imagem") {
      return (
        <div className="form-area image-step-area upload-only-step">
          <div className="upload-card upload-card-hero">
            <span>Mídia principal</span>
            <strong>Escolha e ajuste a foto</strong>
            <p className="upload-lead">
              Clique aqui e adicione sua foto favorita. Depois ajuste zoom, corte e posição sem trocar o modelo da capa.
            </p>

            <div className="upload-actions upload-actions-centered">
              <label
                htmlFor="heroImageFile"
                className="upload-button upload-button-large"
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.currentTarget.click();
                  }
                }}
              >
                Selecionar imagem
              </label>
              <input
                id="heroImageFile"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                onChange={handleHeroFileChange}
              />
            </div>

            <p className="upload-rules">
              Formatos aceitos: .jpg, .gif ou .png. Tamanho máximo: até 10MB.
            </p>

            <div className="media-future-row" aria-label="Opções futuras de mídia">
              <span className="active">Foto disponível</span>
              <span>Vídeo em breve</span>
              <span>Animação em breve</span>
            </div>
          </div>

          <div className="photo-adjust-card photo-adjust-card-inside-model">
            <span className="mini-label">Ajuste a foto dentro da capa</span>
            <p>
              A foto já entra preenchendo a moldura. Use zoom e posição apenas para corrigir o enquadramento.
            </p>

            <div className="photo-fit-row">
              <button
                type="button"
                onClick={() => setPhotoFit("contain")}
                className={`chip-button ${photoFit === "contain" ? "active" : ""}`}
              >
                Sem cortar
              </button>
              <button
                type="button"
                onClick={() => setPhotoFit("cover")}
                className={`chip-button ${photoFit === "cover" ? "active" : ""}`}
              >
                Preencher toda a moldura
              </button>
            </div>

            <div className="photo-range-grid">
              <label>
                Zoom
                <input
                  type="range"
                  min="80"
                  max="170"
                  value={photoZoom}
                  aria-valuetext={`${photoZoom}% de zoom da foto`}
                  onChange={(event) => {
                    setPhotoFit("cover");
                    setPhotoZoom(Number(event.target.value));
                  }}
                />
              </label>
              <label>
                Mover lado
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={photoPositionX}
                  aria-valuetext={`${photoPositionX}% de posição horizontal da foto`}
                  onChange={(event) => setPhotoPositionX(Number(event.target.value))}
                />
              </label>
              <label>
                Mover cima/baixo
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={photoPositionY}
                  aria-valuetext={`${photoPositionY}% de posição vertical da foto`}
                  onChange={(event) => setPhotoPositionY(Number(event.target.value))}
                />
              </label>
            </div>
          </div>
        </div>
      );
    }

    if (step.key === "capa") {
      return (
        <div className="layout-block cover-model-step">
          <span className="mini-label">Modelos de capa</span>
          <p className="field-help">
            Escolha a estrutura da capa. A foto será escolhida e ajustada no próximo passo.
          </p>
          <div className="layout-grid layout-grid-expanded">
            {heroLayoutOptions.map((layout) => (
              <button
                key={layout.value}
                type="button"
                onClick={() => updateHeroLayout(layout.value)}
                className={`layout-option ${
                  form.heroLayout === layout.value ? "active" : ""
                }`}
              >
                <strong>{layout.title}</strong>
                <small>{layout.description}</small>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step.key === "estilo") {
      return (
        <div className="option-grid style-grid">
          {visualStyleOptions.map((option) => {
            const active = form.siteAtmosphere === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateVisualStyle(option)}
                className={`brand-option style-option atmosphere-option atmosphere-card-${option.value} ${active ? "active" : ""}`}
              >
                <span className={`atmosphere-preview-swatch atmosphere-swatch-${option.value}`} aria-hidden="true">
                  <i />
                </span>

                <span className="style-icon-wrap">
                  <StyleIcon type={option.icon} />
                </span>

                <span className="style-label">
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
              </button>
            );
          })}
        </div>
      );
    }
    if (step.key === "cores") {
      return (
        <div className="color-builder">
          <div className="color-grid">
            {colorOptions.map((color) => {
              const active =
                form.primaryColor === color.primary &&
                form.secondaryColor === color.secondary;

              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => updateColor(color.primary, color.secondary)}
                  className={`color-option ${active ? "active" : ""}`}
                >
                  <span className="color-preview">
                    <i style={{ backgroundColor: color.primary }} />
                    <i style={{ backgroundColor: color.secondary }} />
                  </span>
                  <strong>{color.name}</strong>
                </button>
              );
            })}
          </div>

          <div className="custom-colors">
            <span className="mini-label">Personalizar cores do site inteiro</span>
            <div className="color-input-row">
              <label htmlFor="primaryColor">
                Cor principal
                <input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  value={form.primaryColor}
                  onChange={handleTextChange}
                />
              </label>

              <label htmlFor="secondaryColor">
                Cor de destaque
                <input
                  id="secondaryColor"
                  name="secondaryColor"
                  type="color"
                  value={form.secondaryColor}
                  onChange={handleTextChange}
                />
              </label>
            </div>

            <div className="chip-row" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="chip-button"
                onClick={() => updateColor(form.secondaryColor, form.primaryColor)}
              >
                Inverter cores
              </button>
            </div>

            <p>
              A paleta escolhida alimenta a capa, botões, detalhes, cards e contagem regressiva. O modelo visual permanece o mesmo; as cores acompanham o site.
            </p>
          </div>

          <div className="text-position-card">
            <div>
              <span className="mini-label">Caixa de leitura do texto</span>
              <p className="field-help">
                Use somente se as letras não aparecerem bem sobre a foto ou sobre o fundo escolhido.
              </p>
              <div className="chip-row">
                {[
                  { value: "auto", label: "Automático" },
                  { value: "solto", label: "Sem caixa" },
                  { value: "retangular", label: "Caixa elegante" },
                  { value: "quadrado", label: "Caixa forte" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateChoice("textFrameStyle", option.value)}
                    className={`chip-button ${form.textFrameStyle === option.value ? "active" : ""}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step.key === "tipografia") {
      return (
        <div className="typography-builder">

          <div className="font-browser">
            {typographyCategories.map((category) => (
              <div className="font-category" key={category.key}>
                <span className="mini-label">{category.label}</span>
                <div className="font-grid">
                  {typographyOptions
                    .filter((font) => font.category === category.key)
                    .map((font) => (
                      <button
                        key={font.value}
                        type="button"
                        onClick={() => updateChoice("fontStyle", font.value)}
                        className={`font-card ${form.fontStyle === font.value ? "active" : ""}`}
                      >
                        <strong className={getFontClass(font.value)}>{font.sample}</strong>
                        <span>{font.label}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="type-controls">
            <div>
              <span className="mini-label">Tamanho do título</span>
              <div className="chip-row">
                {titleSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateChoice("titleSize", option.value)}
                    className={`chip-button ${form.titleSize === option.value ? "active" : ""}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="title-scale-control">
              <span className="mini-label">Ajuste fino do título</span>
              <label className="title-scale-range">
                <span>{form.titleScale}%</span>
                <input
                  type="range"
                  min="62"
                  max="115"
                  step="1"
                  value={form.titleScale}
                  aria-valuetext={`${form.titleScale}% do tamanho base do título`}
                  onChange={(event) => setForm((current) => ({ ...current, titleScale: Number(event.target.value) }))}
                />
              </label>
              <p className="field-help compact-help">Use a barra para ajustar o tamanho do nome sem deixar o texto invadir a foto.</p>
            </div>

            <div className="title-scale-control detail-scale-control">
              <span className="mini-label">Ajuste fino da data e local</span>
              <label className="title-scale-range">
                <span>{form.detailScale}%</span>
                <input
                  type="range"
                  min="80"
                  max="125"
                  step="1"
                  value={form.detailScale}
                  aria-valuetext={`${form.detailScale}% do tamanho base da data e local`}
                  onChange={(event) => setForm((current) => ({ ...current, detailScale: Number(event.target.value) }))}
                />
              </label>
              <p className="field-help compact-help">Ajusta a data, local e texto menor sem mexer no nome principal.</p>
            </div>

            <div>
              <span className="mini-label">Leitura dos textos</span>
              <div className="chip-row">
                {textDensityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateChoice("textDensity", option.value)}
                    className={`chip-button ${form.textDensity === option.value ? "active" : ""}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-position-card">
            <div>
              <span className="mini-label">Alinhamento do texto</span>
              <div className="chip-row">
                {[
                  { value: "left", label: "Esquerda" },
                  { value: "center", label: "Centro" },
                  { value: "right", label: "Direita" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTextAlign(option.value as "left" | "center" | "right")}
                    className={`chip-button ${textAlign === option.value ? "active" : ""}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mini-label">Posição na capa</span>
              <div className="chip-row">
                {[
                  { value: "top", label: "Em cima" },
                  { value: "middle", label: "Centro" },
                  { value: "bottom", label: "Embaixo" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTextPlacement(option.value as "top" | "middle" | "bottom")}
                    className={`chip-button ${textPlacement === option.value ? "active" : ""}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      );
    }

    if (step.key === "secoes") {
      return (
        <div className="section-list">
          {visualSections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => updateToggle(section.key, !form[section.key])}
              className={`section-option ${form[section.key] ? "active" : ""}`}
            >
              <span>{section.title}</span>
              <strong>{form[section.key] ? "Ativo" : "Oculto"}</strong>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="review-final-panel">
        <div className="review-hero-card">
          <span>Resumo final</span>
          <strong className={`${getFontClass(form.fontStyle)} title-size-${form.titleSize}`}>
            {form.publicTitle || event?.name || "Nome do evento"}
          </strong>
          <p>{publicUrlLabel}</p>
        </div>

        <div className="review-check-grid">
          <div>
            <span>Imagem</span>
            <strong>{form.heroImageUrl ? "Capa escolhida" : "Sem imagem"}</strong>
          </div>
          <div>
            <span>Modelo de capa</span>
            <strong>{heroLayoutOptions.find((layout) => layout.value === form.heroLayout)?.title ?? "Editorial central"}</strong>
          </div>
          <div>
            <span>Letras</span>
            <strong>{getTypographyLabel(form.fontStyle)} • {titleSizeOptions.find((item) => item.value === form.titleSize)?.label ?? "Grande"}</strong>
          </div>
          <div>
            <span>Cores e leitura</span>
            <strong>Paleta principal + caixa do texto</strong>
          </div>
          <div>
            <span>Atmosfera</span>
            <strong>{getAtmosphereLabel(form.siteAtmosphere)}</strong>
          </div>
          <div>
            <span>Seções ativas</span>
            <strong>{activeSectionsCount} área(s)</strong>
          </div>
        </div>

        <div className="review-edit-field">
          <label htmlFor="publicSubtitle">Subtítulo do site</label>
          <input
            id="publicSubtitle"
            name="publicSubtitle"
            type="text"
            value={form.publicSubtitle}
            onChange={handleTextChange}
            placeholder="Ex.: 20 de maio de 2026 • Espaço Villa Jardim"
          />
        </div>

        <div className="review-device-row">
          <div>
            <span>Prévia desktop</span>
            <p>Veja no painel da esquerda a página completa com capa, contagem, mensagem, galeria, localização, presentes e RSVP.</p>
          </div>
          <div>
            <span>Prévia celular</span>
            <p>A versão mobile será refinada na próxima tela de montagem do site.</p>
          </div>
        </div>
      </div>
    );
}
