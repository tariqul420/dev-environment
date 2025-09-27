import { NextRequest, NextResponse } from "next/server";
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextRequest, res: NextResponse) {
  if (!res.socket.server.io) {
    const io = new Server(req.socket.server, {
      path: "/api/socketio",
      cors: { origin: "*" },
    });

    (globalThis as any).io = io;
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("");
    });
  }
}
