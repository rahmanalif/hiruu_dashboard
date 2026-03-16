"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Lock, PencilLine, X } from "lucide-react";

export default function EditMaintainerModal({
  open,
  onOpenChange,
  maintainer,
  roleOptions = [],
}) {
  const [name, setName] = useState(() => maintainer?.name || "");
  const [email, setEmail] = useState(() => maintainer?.email || "");
  const [role, setRole] = useState(() => maintainer?.role || "");

  const normalizedRoleOptions = useMemo(() => {
    const options = roleOptions.filter(Boolean);
    if (role && !options.includes(role)) {
      options.unshift(role);
    }
    return options;
  }, [role, roleOptions]);

  const handleSave = () => {
    console.log({
      maintainerId: maintainer?.id,
      name,
      email,
      role,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <DialogTitle className="text-lg font-medium">
                Edit Maintainer
              </DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
                <PencilLine className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Update maintainer details
                </p>
                <p className="text-xs text-gray-600">
                  Change the assigned role or update account information.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="User name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Email<span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {normalizedRoleOptions.map((roleOption) => (
                  <SelectItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Permission Access</Label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {maintainer?.access || "N/A"}
            </div>
          </div>

          <div className="rounded border border-yellow-200 bg-yellow-50 px-3 py-2">
            <p className="text-xs text-yellow-800">
              <span className="font-medium">Note:</span> Confirm the role change
              before saving. Permission access should match the selected role.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSave}
          >
            <Check className="mr-1 h-4 w-4" />
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
