export const dynamic = "force-dynamic";

import { AdminStats } from "@/components/dashboard/admin/admin-stats";
import SearchBar from "@/components/global/search-bar";
import SortSelect from "@/components/global/sort-select";
import { SidebarInset } from "@/components/ui/sidebar";

export default async function Dashboard() {
  return (
    <SidebarInset>
      {/* <SiteHeader /> */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 md:gap-6">
          <AdminStats />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-8">
        <SearchBar />
        <SortSelect
          items={[
            { value: "default", label: "Default" },
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "popular", label: "Most popular" },
          ]}
        />
      </div>
    </SidebarInset>
  );
}
