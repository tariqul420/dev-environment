"use client";

import { UserRole } from "@prisma/client";
import { IconDotsVertical } from "@tabler/icons-react";
import type { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import SelectField from "@/components/global/form-field/select-field";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserRole } from "@/lib/actions/user.action";
import logger from "@/lib/logger";

export default function AdminUserTableMenu({ row }: { row: Row<UserRecord> }) {
  const user = row.original;
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user.role as UserRole,
  );
  const [isPending, startTransition] = useTransition();

  const canCopyPhone = Boolean(user.phone && user.phone.trim().length > 0);

  const roleOptions = useMemo(
    () => [
      { label: "USER", value: UserRole.USER },
      { label: "STAFF", value: UserRole.STAFF },
      { label: "ADMIN", value: UserRole.ADMIN },
    ],
    [],
  );

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch (err) {
      logger.error(
        "Clipboard copy failed: " +
          (err instanceof Error ? err.message : String(err)),
      );
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
        await updateUserRole({ userId: user.id, role: selectedRole });
        toast.success("Role updated");
        setIsRoleDialogOpen(false);
      } catch (error) {
        logger.error(
          "Role update failed: " +
            (error instanceof Error ? error.message : String(error)),
        );
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
            onClick={() => {
              if (canCopyPhone) copyToClipboard(user.phone, "Phone");
            }}
          >
            {canCopyPhone ? "Copy phone" : "No phone"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Change Role (opens dialog with SelectField) */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
              <SelectField
                name="role"
                label="Role"
                placeholder="Select role"
                options={roleOptions}
                value={selectedRole}
                onValueChange={(val) => {
                  setSelectedRole(val as UserRole);
                }}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveRole} disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
