export default async function page({ params }) {
  const { id } = await params;

  const service = await getServiceById(id);

  if (!service) return null;
  return <div>{JSON.stringify(service)}</div>;
}
