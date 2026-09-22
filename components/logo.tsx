import Link from "next/link";

export function Mark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="32" cy="32" r="31" fill="#c4623a" />
      <circle cx="32" cy="32" r="26.5" fill="#fffaf2" />
      <circle cx="32" cy="32" r="24.2" stroke="#c4623a" strokeWidth="0.8" strokeDasharray="1.6 2.2" />
      <path d="M20.5 30.5 24.2 17.5 30.2 28.2Z" fill="#3a2c22" />
      <path d="M43.5 30.5 39.8 17.5 33.8 28.2Z" fill="#3a2c22" />
      <path d="M22.6 28.8 24.8 20.4 28.2 27.4Z" fill="#e39b3d" />
      <path d="M41.4 28.8 39.2 20.4 35.8 27.4Z" fill="#e39b3d" />
      <ellipse cx="32" cy="36.2" rx="13.2" ry="11.2" fill="#3a2c22" />
      <path d="M24.2 34.8c1.6 1.5 3.6 1.5 5.2 0" stroke="#fffaf2" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M34.6 34.8c1.6 1.5 3.6 1.5 5.2 0" stroke="#fffaf2" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M32 38.4 30.5 40.1h3Z" fill="#e39b3d" />
      <path d="M32 40.1v1.5M30 42.4c.7.6 1.4.7 2 .2M34 42.4c-.7.6-1.4.7-2 .2" stroke="#fffaf2" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  href,
  stamp,
  brand,
  size = 42,
}: {
  href: string;
  stamp: string;
  brand: string;
  size?: number;
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <Mark size={size} />
      <span>
        <span className="stamp">{stamp}</span>
        <span className="display mt-1 block text-xl leading-none">{brand}</span>
      </span>
    </Link>
  );
}
