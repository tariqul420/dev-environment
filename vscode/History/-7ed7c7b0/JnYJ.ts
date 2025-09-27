import type { Socket as NetSocket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

// Extend the socket server type
interface NextApiResponseWithSocket extends NextApiResponse {
  socket: NetSocket & {
    server: {
      io?: Server;
    };
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket,
) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socketio",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;
    (globalThis as any).io = io;

    io.on("connection", (socket) => {
      console.log("🟢 Socket.io connected:", socket.id);
    });
  }

  res.end();
}
