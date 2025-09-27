import {
  FuturePlaceholder,
  FuturePlaceholderInfo,
  FuturePlaceholderMuted,
  FuturePlaceholderOutline,
  FuturePlaceholderWithLinks,
} from "@/components/global/future-placeholder";
import { Button } from "@/components/ui/button";

export default function page() {
  return (
    <main>
      <FuturePlaceholderMuted title="Coming soon" />
    </main>
  );
}
