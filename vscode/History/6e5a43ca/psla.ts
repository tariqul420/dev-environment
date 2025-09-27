import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const server = res.socket?.server as HTTPServer & { io?: IOServer };

  if (!server.io) {
    const io = new IOServer(server, {
      path: "/api/socketio",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    server.io = io;
    globalThis.io = io;

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);
    });
  }

  res.end();
}
