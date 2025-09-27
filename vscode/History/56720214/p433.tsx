import { recordClickAndRedirect } from '@/lib/actions/shortener';

export default async function ShortCatchAll({ params }: { params: { id: string } }) {
  // Immediately count + redirect
  await recordClickAndRedirect(params.id);
  return null;
}
