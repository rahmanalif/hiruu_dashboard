"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Check, Lock, PencilLine, Upload, X } from "lucide-react";
import {
  fetchMaintainerRoles,
  resetUpdateMaintainerState,
  updateMaintainer,
} from "@/redux/maintainerRolesSlice";
import { canAssignRole, resolveUserPermissions } from "@/lib/permissions";

const formatPermissionKey = (permissionKey) =>
  permissionKey
    .split(".")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export default function EditMaintainerModal({
  open,
  onOpenChange,
  maintainer,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);
  const [name, setName] = useState(() => maintainer?.name || "");
  const [email, setEmail] = useState(() => maintainer?.email || "");
  const [role, setRole] = useState(() => maintainer?.roleId || "");
  const [avatar, setAvatar] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { roles, status, error, updateStatus, updateError } = useSelector(
    (state) => state.maintainerRoles
  );

  const avatarPreview = useMemo(() => {
    if (avatar) {
      return URL.createObjectURL(avatar);
    }

    return maintainer?.avatar || "";
  }, [avatar, maintainer?.avatar]);

  useEffect(() => {
    return () => {
      if (avatar) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatar, avatarPreview]);

  useEffect(() => {
    if (open && (status === "idle" || (status === "failed" && !roles.length))) {
      dispatch(fetchMaintainerRoles());
    }
  }, [dispatch, open, roles.length, status]);

  useEffect(() => {
    if (!open) {
      dispatch(resetUpdateMaintainerState());
    }
  }, [dispatch, open]);

  const normalizedRoleOptions = (() => {
    const userPermissions = resolveUserPermissions(currentUser);
    const options = roles.filter((roleOption) =>
      canAssignRole(userPermissions, roleOption.permissions)
    );
    if (
      maintainer?.roleId &&
      maintainer?.role &&
      !options.some((roleOption) => roleOption.id === maintainer.roleId)
    ) {
      options.unshift({
        id: maintainer.roleId,
        name: maintainer.role,
        permissions: {},
      });
    }
    return options;
  })();

  const selectedRole = useMemo(
    () => normalizedRoleOptions.find((roleOption) => roleOption.id === role) || null,
    [normalizedRoleOptions, role]
  );

  const permissionText = useMemo(() => {
    const permissions = selectedRole?.permissions;
    if (!permissions || typeof permissions !== "object") {
      return maintainer?.access || "Select a role to see permissions";
    }

    const entries = Object.entries(permissions);
    if (!entries.length) {
      return "No permissions assigned";
    }

    return entries
      .map(([key, value]) => `${formatPermissionKey(key)} (${value})`)
      .join(", ");
  }, [maintainer?.access, selectedRole]);

  const handleSave = () => {
    if (!maintainer?.id || !name.trim() || !email.trim() || !role) {
      return;
    }

    dispatch(
      updateMaintainer({
        id: maintainer.id,
        name,
        email,
        roleId: role,
        avatar,
      })
    )
      .unwrap()
      .then(async () => {
        setAvatar(null);
        onOpenChange(false);
        if (typeof onSuccess === "function") {
          await onSuccess();
        }
      })
      .catch(() => {});
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setAvatar(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setAvatar(selectedFile);
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
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Maintainer avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
                    <PencilLine className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>

            <div
              className={`flex-1 rounded-lg border-2 border-dashed p-6 text-center ${
                isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-2 h-5 w-5 text-gray-400" />
              <div className="text-sm">
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Click to upload
                </button>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                PNG or JPG (max. 800x800px)
              </p>
              {avatar ? (
                <p className="mt-2 text-xs text-gray-600">{avatar.name}</p>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
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
          </div> */}

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
                <SelectValue
                  placeholder={
                    status === "loading" ? "Loading roles..." : "Select role"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {normalizedRoleOptions.map((roleOption) => (
                  <SelectItem key={roleOption.id} value={roleOption.id}>
                    {roleOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error ? <p className="text-xs text-red-500">{error}</p> : null}
            {!error && !normalizedRoleOptions.length ? (
              <p className="text-xs text-amber-600">
                You do not have permission to assign any maintainer role.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Permission Access</Label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {permissionText}
            </div>
          </div>

          <div className="rounded border border-yellow-200 bg-yellow-50 px-3 py-2">
            <p className="text-xs text-yellow-800">
              <span className="font-medium">Note:</span> Confirm the role change
              before saving. Permission access should match the selected role.
            </p>
          </div>
          {updateError ? (
            <p className="text-sm text-red-500">{updateError}</p>
          ) : null}
        </div>

        <DialogFooter className="gap-3 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSave}
            disabled={
              updateStatus === "loading" ||
              !name.trim() ||
              !email.trim() ||
              !role ||
              !normalizedRoleOptions.length
            }
          >
            <Check className="mr-1 h-4 w-4" />
            {updateStatus === "loading" ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
