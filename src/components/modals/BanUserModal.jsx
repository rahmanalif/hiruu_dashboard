"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const DEFAULT_REASON = "violated platform policy";

export default function BanUserModal({
  open,
  onOpenChange,
  onConfirm,
  userName = "User",
  isRestricted = false,
  loading = false,
  error = "",
}) {
  const [banReason, setBanReason] = useState(DEFAULT_REASON);

  useEffect(() => {
    if (open) {
      setBanReason(DEFAULT_REASON);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">
              {isRestricted ? "Unban" : "Ban"} {userName}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {isRestricted ? (
            <p className="text-sm text-gray-600">
              This will remove the restriction from this user.
            </p>
          ) : (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Ban Reason</Label>
              <Select
                value={banReason}
                onValueChange={setBanReason}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="violated platform policy">
                    Violated platform policy
                  </SelectItem>
                  <SelectItem value="fraudulent activity">
                    Fraudulent activity
                  </SelectItem>
                  <SelectItem value="abusive behavior">
                    Abusive behavior
                  </SelectItem>
                  <SelectItem value="suspicious account activity">
                    Suspicious account activity
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() =>
              onConfirm?.(
                isRestricted
                  ? { isRestricted: false }
                  : { isRestricted: true, reason: banReason }
              )
            }
            disabled={loading}
          >
            {loading ? "Saving..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
