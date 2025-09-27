"use client";

import DataTable from "@/components/dashboard/data-table";
import { adminOrdersColumns } from "@/components/dashboard/table-columns";
import { OrdersPageWrapperProps } from "@/types/order";
import { useState } from "react";
import OrderRealtimeListener from "./order-realtime-listener";

export default function OrdersPageWrapper({
  initialOrders,
  totalItems,
  pageIndex,
  pageSize,
}: OrdersPageWrapperProps) {
  const [orders, setOrders] = useState(initialOrders);

  const handleNewOrder = (order: ) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <>
      <OrderRealtimeListener onNewOrder={handleNewOrder} />
      <DataTable
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={totalItems}
        data={orders}
        columns={adminOrdersColumns}
        uniqueIdProperty="_id"
      />
    </>
  );
}
