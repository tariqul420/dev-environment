import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconLoader,
  IconPackage,
  IconTruck,
  IconX,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import React from "react";

type AnyStatus = string | null | undefined;
type StatusKey =
  | "pending"
  | "hold"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const META: Record<
  StatusKey,
  { className: string; Icon: TablerIcon; label: string }
> = {
  pending: {
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Icon: IconLoader,
    label: "pending",
  },
  hold: {
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    Icon: IconX,
    label: "on hold",
  },
  confirmed: {
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Icon: IconCircleCheck,
    label: "confirmed",
  },
  processing: {
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Icon: IconPackage,
    label: "processing",
  },
  shipped: {
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    Icon: IconTruck,
    label: "shipped",
  },
  delivered: {
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
    Icon: IconCircleCheckFilled,
    label: "delivered",
  },
  cancelled: {
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    Icon: IconX,
    label: "cancelled",
  },
};

function normalizeStatus(status: AnyStatus): StatusKey {
  const s = String(status ?? "").toLowerCase();
  if (s in META) return s as StatusKey;
  switch (s) {
    case "pending":
    case "hold":
    case "confirmed":
    case "processing":
    case "shipped":
    case "delivered":
    case "cancelled":
      return s;
    default:
      return "pending";
  }
}

export function getStatusColorClass(status: AnyStatus) {
  return META[normalizeStatus(status)].className;
}

export default function getStatusIcon(status: AnyStatus) {
  const { Icon } = META[normalizeStatus(status)];
  return React.createElement(Icon, { className: "mr-1 h-4 w-4" });
}

export function getStatusLabel(status: AnyStatus) {
  return META[normalizeStatus(status)].label;
}
