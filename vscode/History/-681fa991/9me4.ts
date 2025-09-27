import type { Server as HTTPServer } from "http";
import type { Socket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import logger from "@/lib/logger";

interface CustomSocket extends Socket {
  server: HTTPServer & {
    io?: IOServer;
  };
}

interface CustomResponse extends NextApiResponse {
  socket: CustomSocket;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(_req: NextApiRequest, res: CustomResponse) {
  const server = res.socket.server;

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
      logger.info(`Socket connected: ${socket.id}`);
    });
  }

  res.end();
}
