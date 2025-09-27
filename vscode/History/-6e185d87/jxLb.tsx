import BlogForm from "@/components/dashboard/admin/blog/blog-form";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";

export default async function AddBlog() {
  return (
    <div className="container mx-auto max-w-4xl">
      <BreadcrumbContainer
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/admin" },
          { label: "Add Blog" },
        ]}
      />
      <BlogForm />
    </div>
  );
}
