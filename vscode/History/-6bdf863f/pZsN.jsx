import { getProjectBySlug } from "@/lib/actions/project.action";

export default async function page({ params }) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);

  return <div>page</div>;
}
