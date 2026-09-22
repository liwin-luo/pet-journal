/** Live catalog prices. Client token stays in NEXT_PUBLIC_PADDLE_CLIENT_TOKEN. */
export const PADDLE_PLUS_PRICE = "pri_01m33ze2t25scag15k3pcwdx0d";
export const PADDLE_FAMILY_PRICE = "pri_01m33zf6nf4x2s50mwf4jan1bs";

export function paddleToken(): string {
  return process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
}

export function paddlePriceId(checkout: string): string {
  if (!paddleToken()) return "";
  if (checkout === "plus") return PADDLE_PLUS_PRICE;
  if (checkout === "family") return PADDLE_FAMILY_PRICE;
  return "";
}

type PaddleCheckout = {
  Initialize: (opts: { token: string }) => void;
  Checkout: {
    open: (opts: {
      items: { priceId: string; quantity: number }[];
      settings?: { successUrl?: string };
    }) => void;
  };
};

let booted = false;
let loading: Promise<PaddleCheckout> | null = null;

function loadPaddle(): Promise<PaddleCheckout> {
  const existing = (window as Window & { Paddle?: PaddleCheckout }).Paddle;
  if (existing) return Promise.resolve(existing);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => {
      const paddle = (window as Window & { Paddle?: PaddleCheckout }).Paddle;
      if (paddle) resolve(paddle);
      else reject(new Error("paddle"));
    };
    script.onerror = () => reject(new Error("paddle"));
    document.head.appendChild(script);
  });
  return loading;
}

export async function openPaddleCheckout(priceId: string): Promise<void> {
  const token = paddleToken();
  if (!token || !priceId) return;
  const paddle = await loadPaddle();
  if (!booted) {
    paddle.Initialize({ token });
    booted = true;
  }
  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    settings: { successUrl: `${location.origin}/today` },
  });
}
