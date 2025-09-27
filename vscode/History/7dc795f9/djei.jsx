"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { formUrlQuery } from "@/lib/utils";

const LoadMore = ({ hasNextPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observerRef = (useRef < IntersectionObserver) | (null > null);
  const loaderRef = (useRef < HTMLDivElement) | (null > null);
  const isLoadingRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  useEffect(() => {
    // Reset states when search params change
    isLoadingRef.current = false;
    setIsVisible(false);
  }, [searchParams]);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting && !isLoadingRef.current && hasNextPage) {
          isLoadingRef.current = true;

          // Add a small delay to prevent rapid loading
          const timeoutId = setTimeout(() => {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);

            const query = formUrlQuery({
              params: searchParams.toString(),
              key: "page",
              value: nextPage.toString(),
            });

            router.push(query, { scroll: false });
          }, 500);

          return () => clearTimeout(timeoutId);
        }
      },
      {
        threshold: 0.8, // Trigger when 80% of the element is visible (like Facebook)
        rootMargin: "400px", // Start loading when user is 400px away from bottom (like YouTube)
      },
    );

    observerRef.current = observer;

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, currentPage, router, searchParams]);

  if (!hasNextPage) return null;

  return (
    <div
      ref={loaderRef}
      className="my-8 flex h-20 w-full items-center justify-center"
    >
      {isVisible && (
        <div className="flex flex-col items-center gap-2">
          <div className="border-accent-main h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="text-sm text-gray-500">Loading more ...</span>
        </div>
      )}
    </div>
  );
};

export default LoadMore;
