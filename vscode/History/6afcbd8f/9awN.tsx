import { IconDotsVertical } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { deleteProduct } from "@/lib/actions/product.action";
import logger from "@/lib/logger";
import { ProductRecord } from "@/types/table-columns";
import { Row } from "@tanstack/react-table";

export default function AdminProductTableMenu({
  row,
}: {
  row: Row<ProductRecord>;
}) {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function HandleDeleteProduct() {
    try {
      toast.promise(
        deleteProduct({
          productId: row.original._id as string,
          path: pathname as string,
        }),
        {
          loading: "Deleting product...",
          success: () => {
            setIsDialogOpen(false);
            return "Product deleted successfully";
          },
          error: (err) => `Error deleting product: ${err.message}`,
        },
      );
    } catch (error) {
      logger.error("Error deleting product:", error);
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
            href={`/products/${row.original.slug}`}
            className="block w-full"
          >
            Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={`/admin/products/${row.original.slug}`}
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
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the product &quot;
                {row.original.title}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={HandleDeleteProduct}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
