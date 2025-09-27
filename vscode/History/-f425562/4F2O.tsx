"use client";

import DataTable from "@/components/dashboard/data-table";
import { adminOrdersColumns } from "@/components/dashboard/table-columns";
import { OrdersPageWrapperProps } from "@/types/order";
import { OrderRecord } from "@/types/table-columns";
import { useState } from "react";
import OrderRealtimeListener from "./order-realtime-listener";

export default function OrdersPageWrapper({
  initialOrders,
  totalItems,
  pageIndex,
  pageSize,
}: OrdersPageWrapperProps) {
  const [orders, setOrders] = useState(initialOrders);

  const handleNewOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleOrderUpdated = (updatedOrder: OrderRecord) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order,
      ),
    );
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order._id !== orderId));
  };

  const handleOrdersDeleted = (orderIds: string[]) => {
    setOrders((prev) => prev.filter((order) => !orderIds.includes(order._id)));
  };

  return (
    <>
      <OrderRealtimeListener
        onNewOrder={handleNewOrder}
        onOrderUpdated={handleOrderUpdated}
        onOrderDeleted={handleOrderDeleted}
        onOrdersDeleted={handleOrdersDeleted}
      />
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
