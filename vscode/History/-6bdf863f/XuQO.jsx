import { getProjectBySlug } from "@/lib/actions/project.action";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return <div className="p-8 text-red-500">Project not found.</div>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* Title & Short Description */}
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">{project.title}</h1>
        <p className="text-gray-600">{project.shortDescription}</p>
      </header>

      {/* Cover Image */}
      {project.coverImage && (
        <div className="mb-8">
          <Image
            src={project.coverImage}
            alt={project.title}
            width={1200}
            height={600}
            className="rounded-2xl object-cover shadow-lg"
          />
        </div>
      )}

      {/* Description */}
      {project.description && (
        <section
          className="prose mb-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
      )}

      {/* Links */}
      <div className="mb-8 flex gap-4">
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target="_blank"
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Live Demo
          </Link>
        )}
        {project.github && (
          <Link
            href={project.github}
            target="_blank"
            className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
          >
            GitHub
          </Link>
        )}
      </div>

      {/* Extra Info */}
      <div className="space-y-4">
        <p>
          <strong>Category:</strong> {project.category}
        </p>
        <p>
          <strong>Impact:</strong> {project.impact}
        </p>
        <p>
          <strong>Launch Date:</strong>{" "}
          {new Date(project.launchDate).toLocaleDateString()}
        </p>
        {project.tags?.length > 0 && (
          <p>
            <strong>Tags:</strong> {project.tags.join(", ")}
          </p>
        )}
      </div>

      {/* Future Plans */}
      {project.futurePlans?.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-2xl font-semibold">Future Plans</h2>
          <ul className="list-disc pl-5">
            {project.futurePlans.map((plan, idx) => (
              <li key={idx}>{plan}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Screenshots */}
      {project.screenshots?.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Screenshots</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {project.screenshots.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`${project.title} screenshot ${idx + 1}`}
                width={800}
                height={450}
                className="rounded-xl shadow-md"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
