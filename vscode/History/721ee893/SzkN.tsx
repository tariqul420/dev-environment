import { IconDotsVertical } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { deleteProject } from '@/lib/actions/project.action';
import { ProjectRecord } from '@/types/table-columns';
import { Row } from '@tanstack/react-table';

export default function AdminProjectTableMenu({ row }: { row: Row<ProjectRecord> }) {
  const pathName = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function HandleDeleteProject() {
    try {
      toast.promise(
        deleteProject({
          blogId: row.original._id as string,
          path: pathName,
        }),
        {
          loading: 'Deleting blog...',
          success: () => {
            setIsDialogOpen(false);
            return 'Blog deleted successfully';
          },
          error: (err) => `Error deleting blog: ${err.message}`,
        },
      );
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem>
          <Link href={`/blogs/${row.original.slug}`} className="block w-full">
            Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/admin/blogs/${row.original.slug}`} className="block w-full">
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Blog</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the Blog &quot;
                {row.original.title}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={HandleDeleteBlog}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
