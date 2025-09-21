// Lightweight dynamic wrapper for HashConnect to avoid hard dependency until installed.
// Usage: const tx = await connectAndTransfer({ toAccount: '0.0.x', amount: 1 });

export async function connectAndTransfer({ toAccount, amount }: { toAccount: string; amount: number }) {
  // Dynamically import to avoid breaking builds if package not installed
  // Use @vite-ignore to prevent Vite from trying to resolve this at build time.
  const { HashConnect } = await import(/* @vite-ignore */ 'hashconnect');

  const hashconnect = new HashConnect();
  const initData = await hashconnect.init();
  // For simplicity, pairing with extension/wallet will require user interaction
  const state = hashconnect.connect();
  // Implementation is non-trivial: this is a scaffolding function demonstrating how you'd wire it.
  // Real implementation requires building a Hedera transfer transaction, converting to bytes, and requesting signing.
  throw new Error('connectAndTransfer is a scaffold – please implement the full HashConnect flow and run npm install hashconnect');
}
