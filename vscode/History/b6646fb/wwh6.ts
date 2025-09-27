export async function getUserForAdmin(params: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}