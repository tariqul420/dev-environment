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

      <SearchBar />
      <SortSelect
        defaultValue="default"
        items={[
          { value: "default", label: "Default sorting" },
          { value: "date", label: "Sort by oldest" },
          { value: "price-low", label: "Sort by price: low to high" },
          { value: "price-high", label: "Sort by price: high to low" },
        ]}
      />
    </SidebarInset>
  );
}
