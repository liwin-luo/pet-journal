export function usePg(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
