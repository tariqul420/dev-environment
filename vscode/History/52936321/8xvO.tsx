'use client';

import { ProjectProps } from '@/types/project';
import SearchInput from '../search-bar';

interface FilterBarProps {
  projects: ProjectProps[];
  total: number;
}

const FilterBar = ({ projects, total }: FilterBarProps) => {
  return (
    <>
      <div className="filter-bar items-left container mx-auto my-3 flex min-h-[60px] flex-col justify-between rounded-md border px-2 py-4 shadow-md md:flex-row">
        <div className="left-content order-2 mt-5 flex items-center justify-between gap-4 text-2xl md:order-1 md:mt-0">
          <p className="text-sm">
            Showing {projects?.length} of {total} Results
          </p>
        </div>
        <div className="right-content order-1 flex flex-col items-start gap-3 sm:flex-row sm:items-center md:order-2 md:gap-5">
          <div className="w-full sm:w-auto">
            <SearchInput />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterBar;
