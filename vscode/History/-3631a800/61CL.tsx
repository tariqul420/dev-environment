"use client";

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
} from "@/components/ui/dialog";
import { updateUserRole } from "@/lib/actions/user.action";

export default function ChangeUserRole({
  userId,
  userName,
  currentRole,
}: {
  userId: string;
  userName: string;
  currentRole: "admin" | "customer";
}) {
  const [openModal, setOpenModal] = useState(false);
  const pathname = usePathname();

  const handleChangeRole = async () => {
    const newRole = currentRole === "admin" ? "customer" : "admin";

    try {
      toast.promise(
        updateUserRole({
          userId,
          newRole,
          path: pathname as string,
        }),
        {
          loading: `Changing role to ${newRole}...`,
          success: `Role updated to ${newRole} successfully!`,
          error: "Failed to change role.",
        },
      );
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <Button
        variant="ghost"
        className="text-main bg-light-bg dark:bg-dark-bg hover:text-main cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        Change Role
      </Button>
      <DialogContent className="max-h-[80vh] w-full max-w-md overflow-x-auto rounded-lg p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Change User Role
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to change{" "}
            <span className="font-semibold">{userName || "this user"}</span>
            ’s role from{" "}
            <span className="font-semibold">{currentRole}</span> to{" "}
            <span className="font-semibold">
              {currentRole === "admin" ? "customer" : "admin"}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              handleChangeRole();
              setOpenModal(false);
            }}
            className="w-full sm:w-auto"
          >
            Change Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
