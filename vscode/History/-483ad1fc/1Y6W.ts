/** biome-ignore-all lint/correctness/noUnusedVariables: <> */

type GetUsersInput = {
  page?: number;
  limit?: number;
  search?: string;
};

type DashboardPros = {
  searchParams: Promise<{
    pageSize: string;
    search: string;
    pageIndex: string;
  }>;
};
