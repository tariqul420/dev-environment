import ProductForm from "@/components/dashboard/admin/product/product-form";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";

export default async function AddProduct() {
  return (
    <div className="container mx-auto max-w-4xl">
      <BreadcrumbContainer
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/admin" },
          { label: "Add Product" },
        ]}
      />
      <ProductForm />
    </div>
  );
}
