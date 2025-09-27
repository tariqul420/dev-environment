const io = globalThis.io;
if (io) {
  io.emit("new-order", data);
}
