import { OrderRecord } from "@/types/table-columns";

export default function OrderRealtimeListener({
  onNewOrder,
  onOrderUpdated,
}: {
  onNewOrder: (order: OrderRecord) => void;
  onOrderUpdated: (order: OrderRecord) => void;
}) {
  useEffect(() => {
    const socket: Socket = io({ path: "/api/socketio" });

    socket.on("connect", () => {
      // logger.info("Connected to socket"); // You can use console.log in client if you want
    });

    socket.on("new-order", (order: OrderRecord) => {
      onNewOrder(order);
    });

    socket.on("order-updated", (updatedOrder: OrderRecord) => {
      onOrderUpdated(updatedOrder);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewOrder, onOrderUpdated]);

  return null;
}
