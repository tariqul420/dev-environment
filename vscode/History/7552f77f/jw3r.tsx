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
      <FuturePlaceholder
        title="Support"
        description="This page is not ready yet."
      />

      <FuturePlaceholder
        title="Reports"
        description="Insights are coming soon."
        helpText="ETA after analytics pipeline."
        tone="info"
        size="lg"
        actions={
          <>
            <Button asChild>
              <a href="/admin">Go to Dashboard</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/docs">Read the docs</a>
            </Button>
          </>
        }
      />

      <FuturePlaceholderMuted title="Coming soon" />
      <FuturePlaceholderOutline title="Feature under construction" />
      <FuturePlaceholderInfo
        title="Beta area"
        description="We’re enabling this gradually."
      />

      <FuturePlaceholderWithLinks
        title="Not found"
        description="The page you’re looking for isn’t ready or doesn’t exist."
        homeHref="/"
        docsHref="/docs"
      />
    </main>
  );
}
