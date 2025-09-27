export default function InitialCheckoutTracking() {
    useEffect(() => {
    // Meta
    fbq("track", "InitiateCheckout", {
      content_ids: contentIds,
      content_type: "product",
      value,
      currency: "BDT",
      num_items: items.reduce((s, it) => s + it.quantity, 0),
      contents: items.map((it) => ({
        id: String(it.id),
        quantity: it.quantity,
        item_price: it.price,
      })),
      event_id: eventId, // optional, useful for server-side events later
    });

    // GA4
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", {
        currency: "BDT",
        value,
        items: items.map((it) => ({
          item_id: String(it.id),
          price: it.price,
          quantity: it.quantity,
        })),
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
