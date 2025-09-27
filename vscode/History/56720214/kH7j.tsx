import { recordClickAndRedirect } from '@/lib/actions/shortener';

export default async function ShortCatchAll({ params }: { params: { id: string } }) {
  const { id } = await recordClickAndRedirect(params.id);
  return null;
}
