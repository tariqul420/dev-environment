import NoResults from "@/components/global/no-results";
import { ProductProps } from "@/types/product";
import MyButton from "../../global/my-btn";
import { Title } from "../../title";
import ProductCard from "../products/product-card";

export default function OurProducts({
  products,
}: {
  products: ProductProps[];
}) {
  return (
    <section className="py-12">
      <Title
        title="আমাদের প্রোডাক্টসমূহ"
        subtitle="১০০% প্রাকৃতিক উপাদান দিয়ে তৈরি Natural Sefa-র প্রোডাক্টগুলো আপনার সুস্থতার জন্য প্রস্তুত!"
      />

      {products.length === 0 ? (
        <NoResults
          className="mx-auto max-w-3xl"
          title="দুঃখিত, কোনো প্রোডাক্ট পাওয়া যায়নি"
          description="আমাদের প্রোডাক্টগুলো খুব শীঘ্রই আপডেট করা হবে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেক করুন।"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {/* Show All Blogs Button - Only show if there are blogs */}
          <div className="mt-8 flex justify-center">
            <MyButton href="/products">সকল প্রোডাক্ট দেখুন</MyButton>
          </div>
        </>
      )}
    </section>
  );
}
