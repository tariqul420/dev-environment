export default function InitialCheckoutTracking() {
    useEffect(() => {
    // GA
        event({
          action: "buy_now",
          category: "ecommerce",
          label: slug,
          value: qty,
        });

        // FB Pixel
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("trackCustom", "BuyNowClicked", {
        content_name: slug,
        value: qty,
        content_type: "product",
      });
    }

    // TikTok (equivalent of InitiateCheckout)
    if (typeof window !== "undefined" && typeof window.ttq === "object") {
      window.ttq.track("InitiateCheckout", {
        contents: items.map((it) => ({
          content_id: String(it.id),
          quantity: it.quantity,
          price: it.price,
        })),
        value,
        currency: "BDT",
      });
    }
  }, [value]);

  return null
}
