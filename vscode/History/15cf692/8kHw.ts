import { OrderStatus, Prisma } from "@prisma/client";

export function toDec(n: number) {
  return new Prisma.Decimal(n.toFixed(2));
}

function todayBounds() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
  return { start, end };
}

export async function generateOrderNo(tx: TxWithOrderCount) {
  const { start, end } = todayBounds();
  const countToday = await tx.order.count({
    where: { createdAt: { gte: start, lte: end } },
  });
  const seq = countToday + 1;
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `NS-${y}${m}${day}-${String(seq).padStart(4, "0")}`;
}

export const SENTINELS = new Set(["_all_", "__all__", "all", "ALL"]);

export function normalizeStatuses(
  input?: string | string[],
): OrderStatus[] | undefined {
  if (!input || (Array.isArray(input) && input.length === 0)) return undefined;
  const parts = Array.isArray(input)
    ? input
    : String(input)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const allowed = new Set(
    Object.keys(
      Object.values(OrderStatus).length ? OrderStatus : {},
    ) as string[],
  );

  const enumVals = new Set(Object.values(OrderStatus) as string[]);

  const out: OrderStatus[] = [];
  for (const p of parts) {
    if (enumVals.has(p)) out.push(p as OrderStatus);
    else if (enumVals.has(p.toUpperCase()))
      out.push(p.toUpperCase() as OrderStatus);
    else if (allowed.has(p))
      out.push((OrderStatus as Record<string, OrderStatus>)[p] as OrderStatus);
    else if (allowed.has(p.toUpperCase()))
      out.push(
        (OrderStatus as Record<string, OrderStatus>)[
          p.toUpperCase()
        ] as OrderStatus,
      );
  }
  return out.length ? out : undefined;
}

export function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function productCellSummary(
  items: AdminOrderRow["items"],
  orderTotal: number | string,
  currency?: string,
) {
  const symbol = currency === "BDT" ? "৳" : "";

  const fmt = (v: number | string) => {
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isFinite(n) ? n.toLocaleString("en-BD") : String(v);
  };

  if (!items?.length) return { title: "No items", line: "—" };

  const first = items[0];
  const count = items.length;

  const title = count > 1 ? `${first.title} + ${count - 1} more` : first.title;

  const line =
    count > 1
      ? `${fmt(orderTotal)}${symbol}`
      : `${first.qty} × ${fmt(first.unitPrice)}${symbol}`;

  return { title, line };
}

export function normalizeOrderStatus(input: string): OrderStatus {
  const upper = String(input ?? "").toUpperCase();
  const valid = Object.values(OrderStatus) as string[];
  if (!valid.includes(upper)) {
    throw new Error(
      `Invalid status "${input}". Allowed: ${valid.join(", ").toLowerCase()}`,
    );
  }
  return upper as OrderStatus;
}

export function variantsBD(phoneRaw: string) {
  const digits = String(phoneRaw).replace(/[^\d+]/g, "");
  const list = new Set<string>();

  // base guesses
  if (digits.startsWith("+")) list.add(digits);
  else list.add(digits);

  // 017... → +88017..., 88017...
  if (/^0\d{10}$/.test(digits)) {
    list.add("+88" + digits);
    list.add("88" + digits);
  }
  // +88017... → 017..., 88017...
  if (/^\+880\d{9}$/.test(digits)) {
    list.add(digits.replace("+880", "0"));
    list.add(digits.replace("+", ""));
  }
  // 88017... → 017..., +88017...
  if (/^880\d{9}$/.test(digits)) {
    list.add("0" + digits.slice(3));
    list.add("+" + digits);
  }

  // always include raw input too
  list.add(phoneRaw);

  return Array.from(list);
}