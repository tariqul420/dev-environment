"use client";

import DataTable from "@/components/dashboard/data-table";
import { getOrdersForAdmin } from "@/lib/actions/order.action";
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
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);

  // Only add new orders in realtime (prepend at start)
  const handleNewOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  // When page/search changes: Always server fetch new data!
  const handlePaginateOrSearch = async ({
    page = 1,
    pageSize = 20,
    search = "",
  }: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const { orders: freshOrders } = await getOrdersForAdmin({
      limit: pageSize,
      page,
      search,
    });
    setOrders(freshOrders);
  };

  return (
    <>
      {/* Only for new-order realtime */}
      <OrderRealtimeListener onNewOrder={handleNewOrder} />
      <DataTable
        data={orders}
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={totalItems}
        uniqueIdProperty="_id"
        onPaginateOrSearch={handlePaginateOrSearch}
      />
    </>
  );
}
