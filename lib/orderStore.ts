import type { Order } from './types';

// NOTE: In-memory store for the demo. Production uses a database (e.g. Postgres +
// Prisma). Attached to globalThis so the singleton survives Next.js dev module
// re-evaluation and is shared across route handlers in the same server process.
const globalForStore = globalThis as unknown as { __mjpStore?: Map<string, Order> };
const store = globalForStore.__mjpStore ?? (globalForStore.__mjpStore = new Map<string, Order>());

export function createOrder(order: Order): Order {
  store.set(order.id, order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return store.get(id);
}

export function getAllOrders(): Order[] {
  return Array.from(store.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function markOrderPaid(id: string, ref?: string): Order | undefined {
  const order = store.get(id);
  if (!order) return undefined;
  order.status = 'paid';
  if (ref) order.paymentRef = ref;
  store.set(id, order);
  return order;
}
