export const revalidate = 86400;
export const fetchCache = "force-cache";

import MyButton from "@/components/global/my-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            ন্যাচারাল সেফা সম্পর্কে
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl">
            শুদ্ধ, জৈব উপাদান ব্যবহার করে আপনার সুস্থতা বৃদ্ধি করতে ১০০%
            প্রাকৃতিক স্বাস্থ্য সমাধান প্রদান।
          </p>
        </div>
      </section>
      {/* Our Story Section */}
      <section className="pt-12">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="md:w-1/2">
            <h2 className="mb-4 text-3xl font-semibold">আমাদের গল্প</h2>
            <p className="mb-4">
              ন্যাচারাল সেফা প্রতিষ্ঠিত হয়েছে একটি সরল কিন্তু শক্তিশালী
              লক্ষ্যে: প্রকৃতির আরোগ্যকর শক্তি সবার কাছে নিয়ে আসা। পারম্পরিক
              ঔষধি প্রণালী থেকে অনুপ্রাণিত হয়ে, আমরা ২০২০ সালে গ্যাস্ট্রিক
              সমস্যা, ডায়াবেটিস, এলার্জি এবং হৃদরোগের মতো সাধারণ স্বাস্থ্য
              সমস্যার জন্য ১০০% প্রাকৃতিক, রাসায়নিক-মুক্ত এবং কার্যকর পণ্য
              তৈরির যাত্রা শুরু করি।
            </p>
            <p>
              বাংলাদেশে আমাদের সামান্য শুরু থেকে, আমরা হাজার হাজার গ্রাহকের
              পরিষেবা করেছি এবং মেথি মিক্স, কালোজিরা তেল এবং অর্জুন হার্ট
              কেয়ারের মতো আমাদের পণ্যের সাহায্যে তাদের সুস্থ জীবনযাপন করতে
              সহায়তা করেছি।
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-[200px] md:h-[250px]">
              <Image
                src="/assets/about-us.png"
                alt="Hero Image"
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Mission & Vision Section */}
      <section className="pt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Mission */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  আমাদের লক্ষ্য
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  নিরাপদ, কার্যকর এবং ১০০% প্রাকৃতিক স্বাস্থ্য সমাধানের মাধ্যমে
                  ব্যক্তিদের সক্ষমতা বৃদ্ধি করা, যা কুশলী জীবন এবং জীবনশক্তি
                  প্রচার করে, টেকসই উৎস থেকে সেরা জৈব উপাদান ব্যবহার করে।
                </p>
              </CardContent>
            </Card>
            {/* Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  আমাদের দৃষ্টিভঙ্গি
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  প্রাকৃতিক স্বাস্থ্য পণ্যে বিশ্বব্যাপী নেতৃত্ব লাভ করা এবং
                  সমগ্র কুশলী জীবন এবং টেকসই জীবনযাপনের জন্য একটি আন্দোলন
                  প্ররোচনা করা, ভবিষ্যৎ প্রজন্মের জন্য।
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Our Values Section */}
      <section className="pt-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-semibold">
            আমাদের মূল মূল্যবোধ
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">প্রকৃতি</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  আমরা নিশ্চিত করি যে আমাদের সমস্ত পণ্য, যেমন মেথি মিক্স এবং
                  ডায়াবেটিস চা, ১০০% প্রাকৃতিক উপাদান দিয়ে তৈরি, যা রাসায়নিক
                  ও সংযোজনী থেকে মুক্ত।
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">টেকসইতা</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  আমরা আমাদের উপাদান দায়িত্বশীলভাবে সংগ্রহ করি, যা পরিবেশের
                  ক্ষতি হ্রাস করে এবং স্থানীয় কৃষকদের সমর্থন করে।
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">বিশ্বাস</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  আমরা আমাদের প্রক্রিয়ায় স্বচ্ছতা বজায় রেখে এবং সত্যিই
                  কার্যকর পণ্য সরবরাহ করে বিশ্বাস নির্মাণ করি।
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">
                  কুশলী জীবন
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  আমাদের লক্ষ্য হলো আপনার সামগ্রিক কুশলী জীবন উন্নত করা, এলার্জি
                  থেকে হৃদরোগ পর্যন্ত নির্দিষ্ট স্বাস্থ্য চাহিদার জন্য পণ্য নকশা
                  করা।
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="pt-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-3xl font-semibold">
            আমাদের যাত্রায় যোগ দিন
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-lg">
            ন্যাচারাল সেফার পণ্যের সাথে প্রকৃতির শক্তি আবিষ্কার করুন। একসঙ্গে
            একটি সুস্থ, আরও প্রাকৃতিক জীবনযাপনের দিকে কাজ করা যাক।
          </p>
          <MyButton href="/products" className="inline-block">
            আমাদের পণ্যগুলো দেখুন
          </MyButton>
        </div>
      </section>
    </div>
  );
}
