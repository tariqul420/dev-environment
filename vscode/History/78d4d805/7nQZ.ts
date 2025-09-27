import { getAuth } from "@clerk/nextjs/server";
import formidable from "formidable";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowedOrigins = ["http://localhost:3000", "https://naturalsefaa.com"];

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  if (!allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
  }

  const auth = getAuth(req);
  const userId = auth.userId;
  const sessionClaims = auth.sessionClaims as {
    publicMetadata?: { role?: string };
  };

  if (!userId || sessionClaims?.publicMetadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
  }

  const form = formidable({ multiples: false });
  const uploadDir = "/var/www/html/images"; // VPS public folder

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err || !files.image) {
        return resolve(
          NextResponse.json({ error: "No file" }, { status: 400 }),
        );
      }

      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const tempPath = file.filepath;
      const ext = path.extname(file.originalFilename || ".jpg");
      const filename = `${uuid()}${ext}`;
      const outputPath = path.join(uploadDir, filename);

      try {
        await sharp(tempPath)
          .jpeg({ quality: 90 }) // or png
          .toFile(outputPath);
        fs.unlinkSync(tempPath);

        const publicUrl = `https://naturalsefaa.com/images/${filename}`;
        return resolve(NextResponse.json({ url: publicUrl }, { status: 200 }));
      } catch (error) {
        return resolve(
          NextResponse.json(
            { error: "Image processing failed" },
            { status: 500 },
          ),
        );
      }
    });
  });
}
