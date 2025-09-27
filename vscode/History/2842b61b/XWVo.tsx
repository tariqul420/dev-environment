export default async function AddProduct() {
  return (
    <div className="container mx-auto max-w-4xl overflow-hidden">
      <BreadcrumbContainer className="mb-4" items={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/admin' }, { label: 'Add Product' }]} />
      <ProductForm />
    </div>
  );
}
