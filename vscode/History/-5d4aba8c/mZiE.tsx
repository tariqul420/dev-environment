"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteReview } from "@/lib/actions/review.action";
import logger from "@/lib/logger";
import { ReviewRecord } from "@/types/table-columns";
import { Row } from "@tanstack/react-table";

export default function AdminBlogTableMenu({
  row,
}: {
  row: Row<ReviewRecord>;
}) {
  const pathname = usePathname();
  const { slug } = useParams() as { slug: string };
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function HandleDeleteReview() {
    try {
      toast.promise(
        deleteReview({
          reviewId: row.original._id as string,
          path: pathname as string,
        }),
        {
          loading: "Deleting blog...",
          success: () => {
            setIsDialogOpen(false);
            return "Blog deleted successfully";
          },
          error: (err) => `Error deleting blog: ${err.message}`,
        },
      );
    } catch (error) {
      logger.error("Error deleting blog:", error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem>
          <Link
            href={`/admin/products/${slug}/${row.original._id}`}
            className="block w-full"
          >
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Blog</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the Blog &quot;
                {row.original.review.slice(0, 50)} &quot;? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={HandleDeleteReview}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
