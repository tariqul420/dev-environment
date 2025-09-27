"use client";

import { useUser } from "@clerk/nextjs"; // client-safe
import { UserRole } from "@prisma/client";
import { IconDotsVertical } from "@tabler/icons-react";
import type { Row } from "@tanstack/react-table";
import { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logger from "@/lib/logger";

export default function AdminUserTableMenu({ row }: { row: Row<UserRecord> }) {
  const user = row.original;
  const { user: current } = useUser();
  const isSelf = current?.id === user.id;

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user.role as UserRole,
  );
  const [isPending, startTransition] = useTransition();

  const canCopyPhone = Boolean(user.phone && user.phone.trim().length > 0);

  const roleOptions = useMemo(
    () => [UserRole.USER, UserRole.STAFF, UserRole.ADMIN],
    [],
  );

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch (err) {
      logger.error("Clipboard copy failed:", err);
      toast.error(`Failed to copy ${label}`);
    }
  };

  const handleSaveRole = async () => {
    startTransition(async () => {
      try {
        if (selectedRole === user.role) {
          toast("No changes to save");
          return;
        }
        const res = await fetch("/api/admin/users/role", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId: user.id, role: selectedRole }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok)
          throw new Error(data?.error || "Failed to update user role");

        toast.success("Role updated");
        setIsRoleDialogOpen(false);
        // Optionally refresh page or mutate table row here
        // router.refresh();
      } catch (error) {
        logger.error("Role update failed:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to update role",
        );
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
          aria-label="Open menu"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={() => copyToClipboard(user.email, "Email")}
          >
            Copy email
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!canCopyPhone}
            onSelect={(e) => e.preventDefault()}
            onClick={() =>
              canCopyPhone && copyToClipboard(user.phone!, "Phone")
            }
          >
            {canCopyPhone ? "Copy phone" : "No phone"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Change Role */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              disabled={isSelf}
              className={isSelf ? "opacity-60 cursor-not-allowed" : ""}
              title={isSelf ? "You cannot change your own role" : undefined}
            >
              Change role…
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the role for <b>{user.name || "Unnamed"}</b> (
                {user.email})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={selectedRole}
                  onValueChange={(val) => setSelectedRole(val as UserRole)}
                  disabled={isSelf}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveRole} disabled={isPending || isSelf}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
