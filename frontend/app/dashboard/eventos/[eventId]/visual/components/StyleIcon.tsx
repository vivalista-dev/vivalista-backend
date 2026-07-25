type StyleIconType = "classic" | "romantic" | "minimal" | "rustic" | "modern" | "boho";

export function StyleIcon({ type }: { type: StyleIconType }) {
  if (type === "classic") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M34 8c-5 9-8 18-8 28 0 8 3 15 8 20" />
        <path d="M26 36c-7-4-13-10-17-18 10 2 17 7 21 14" />
        <path d="M32 35c8-4 15-10 21-19-11 2-19 8-24 17" />
        <path d="M34 20c4 6 8 11 15 15" />
      </svg>
    );
  }

  if (type === "romantic") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 35c-7-9-17-10-20-3-4 8 5 17 20 25 15-8 24-17 20-25-3-7-13-6-20 3Z" />
        <path d="M32 35c0-10 0-21 0-27" />
        <path d="M32 17c-5-8-14-6-16 1-2 9 8 14 16 17" />
        <path d="M32 17c5-8 14-6 16 1 2 9-8 14-16 17" />
      </svg>
    );
  }

  if (type === "minimal") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="10" />
        <path d="M32 6v10" />
        <path d="M32 48v10" />
        <path d="M6 32h10" />
        <path d="M48 32h10" />
        <path d="M14 14l7 7" />
        <path d="M43 43l7 7" />
        <path d="M50 14l-7 7" />
        <path d="M21 43l-7 7" />
      </svg>
    );
  }

  if (type === "rustic") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M13 47c17-7 29-18 38-34" />
        <path d="M22 42c-9-9-8-20 3-26 5 12 5 21-3 26Z" />
        <path d="M35 31c-5-10-2-19 10-23 1 11-2 19-10 23Z" />
        <path d="M31 35c8 1 15 5 20 13-10 2-17-2-20-13Z" />
      </svg>
    );
  }

  if (type === "modern") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 7l7 17 18 2-14 12 4 18-15-10-15 10 4-18L7 26l18-2 7-17Z" />
        <path d="M32 18l3 8 8 1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M20 14l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" />
      <path d="M44 8l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z" />
      <path d="M42 34l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" />
    </svg>
  );
}

