import { prisma } from "../prisma";

export async function getAllImages() {
  try {
    const images = await prisma.productImage.findMany({
      select: { id: true, url: true, alt: true },
      orderBy: { id: "desc" },
    });

    return JSON.parse(JSON.stringify(images));
  } catch (err) {
    throw new Error("Failed to fetch images", { cause: err });
  }
}
