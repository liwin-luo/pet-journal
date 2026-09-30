// 内联图标：统一 20px 视口，currentColor 描边。
type P = { className?: string };
const base = "inline-block h-5 w-5 shrink-0";

export function PawIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <ellipse cx="7" cy="8.5" rx="2.1" ry="2.8" />
      <ellipse cx="12" cy="6.8" rx="2.1" ry="2.9" />
      <ellipse cx="17" cy="8.5" rx="2.1" ry="2.8" />
      <path d="M12 11.2c3.1 0 5.6 2.2 5.6 4.7 0 1.9-1.6 3.1-3.4 3.1-1 0-1.6-.3-2.2-.3s-1.2.3-2.2.3c-1.8 0-3.4-1.2-3.4-3.1 0-2.5 2.5-4.7 5.6-4.7z" />
    </svg>
  );
}

export function SparkIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path d="M12 2l1.9 5.7L20 9.6l-5.3 2.4L13.5 18 12 13.6 9.3 18l-1.2-6L3 9.6l6.1-1.9L12 2z" opacity=".9" />
      <circle cx="19" cy="17" r="2" opacity=".7" />
      <circle cx="5" cy="19" r="1.4" opacity=".7" />
    </svg>
  );
}

export function UploadIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}

export function DownloadIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
      <path d="M4 18v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
    </svg>
  );
}

export function CopyIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 012-2h9" />
    </svg>
  );
}

export function RefreshIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path d="M20 11a8 8 0 10-2.3 6.3" />
      <path d="M20 5v6h-6" />
    </svg>
  );
}

export function StarIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9 2.9-6z" />
    </svg>
  );
}

export function CheckIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function HeartIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path d="M12 21s-7.5-4.7-9.7-9A5.6 5.6 0 0112 5.7 5.6 5.6 0 0121.7 12c-2.2 4.3-9.7 9-9.7 9z" opacity=".9" />
    </svg>
  );
}
