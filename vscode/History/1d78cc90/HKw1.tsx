import { IconDotsVertical } from "@tabler/icons-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { deleteCategory, updateCategory } from "@/lib/actions/category.action";
import { CategoryRecord } from "@/types/table-columns";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

export default function AdminCategoryTableMenu({
  row,
}: {
  row: Row<CategoryRecord>;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: row.original.name || "",
    },
  });

  const handleEditCategory = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!row.original._id) {
        throw new Error("Category ID is required");
      }

      toast.promise(updateCategory(row.original._id.toString(), data.name), {
        loading: "Saving information...",
        success: () => {
          setIsEditDialogOpen(false);
          return "Category updated successfully!";
        },
        error: (err) => {
          throw new Error("Error updating category. Please try again.", err);
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteCategory = async () => {
    try {
      if (!row.original._id) {
        throw new Error("Category ID is required");
      }

      toast.promise(deleteCategory(row.original._id.toString()), {
        loading: "Deleting category...",
        success: () => {
          setIsDeleteDialogOpen(false);
          return "Category deleted successfully!";
        },
        error: (err) => {
          return err?.message || "Failed to delete category";
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

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
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsEditDialogOpen(true);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the category &quot;
                {row.original.name}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-center"}>Edit Category</DialogTitle>
            <DialogDescription className={"text-center"}>
              Modify the category details below. Changes can be saved or
              canceled.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEditCategory)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
