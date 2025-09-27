import { ICategory } from "@/types/category";
import { ProductProps } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

export default function RightSection({
  products,
  categories,
}: {
  products: ProductProps[];
  categories: ICategory[];
}) {
  return (
    <section className="font-grotesk hidden w-full md:w-1/4 lg:block">
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold uppercase">
          FEATURED PRODUCTS
        </h2>
        <div className="flex flex-col gap-4">
          {products.map((product: ProductProps) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group flex items-center gap-4 overflow-hidden rounded-lg border p-2 shadow-sm transition-all hover:shadow-md"
            >
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={product.imageUrls[0]}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-md mb-1 line-clamp-2 font-medium">
                  <span className="en text-md font-semibold">
                    {product.title}
                  </span>{" "}
                  -{" "}
                  <span className="text-base font-medium">
                    {product.titleBengali}
                  </span>
                </h3>
                <p className="en mb-auto">
                  <span className="line-through">{product.regularPrice} ৳</span>{" "}
                  -{" "}
                  <span className="text-accent-main text-lg font-bold">
                    {product.salePrice} ৳
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold uppercase">
          PRODUCT CATEGORIES
        </h2>
        <ul className="space-y-3">
          {categories.map((category: { name: string; slug: string }) => (
            <li key={category.slug} className="hover:text-accent-hover">
              <Link href={`/products?category=${category.slug}`}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
