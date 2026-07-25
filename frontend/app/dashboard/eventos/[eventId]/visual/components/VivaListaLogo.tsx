import Link from "next/link";

export function VivaListaLogo() {
  return (
    <Link href="/" className="brand-logo-link" aria-label="VivaLista">
      <img
        src="/logo-vivalista.png"
        alt="VivaLista"
        className="brand-logo-img"
      />
    </Link>
  );
}

