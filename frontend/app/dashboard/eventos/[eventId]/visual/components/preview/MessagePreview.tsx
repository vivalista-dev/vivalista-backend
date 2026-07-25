type MessagePreviewProps = {
  welcomeMessage: string;
};

export function MessagePreview({ welcomeMessage }: MessagePreviewProps) {
  return (
    <section className="mini-site-section message-preview">
      <span>Mensagem</span>
      <h3>{welcomeMessage || "Uma mensagem especial para receber seus convidados."}</h3>
      <p>Esse bloco aparece logo depois da capa e ajuda o site a ficar mais humano.</p>
    </section>
  );
}
