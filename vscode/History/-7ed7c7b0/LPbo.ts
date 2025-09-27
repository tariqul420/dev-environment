import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextRequest) {}
