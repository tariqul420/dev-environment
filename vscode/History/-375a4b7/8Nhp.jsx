export default async function page({ params }) {
  const { id } = await params;
  return <div>page</div>;
}
