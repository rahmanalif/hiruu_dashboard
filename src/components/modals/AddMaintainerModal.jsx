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
import { Lock, Upload, X, Check } from "lucide-react";
import {
  createMaintainer,
  fetchMaintainerRoles,
  resetCreateMaintainerState,
} from "@/redux/maintainerRolesSlice";
import { canAssignRole, resolveUserPermissions } from "@/lib/permissions";
import { useTranslations } from "next-intl";

const formatPermissionKey = (permissionKey) =>
  permissionKey
    .split(".")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export default function AddMaintainerModal({
  open,
  onOpenChange,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const t = useTranslations('AddMaintainer');
  const fileInputRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);
  const { roles, status, error, createStatus, createError } = useSelector(
    (state) => state.maintainerRoles
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (open && (status === "idle" || (status === "failed" && !roles.length))) {
      dispatch(fetchMaintainerRoles());
    }
  }, [dispatch, open, roles.length, status]);

  useEffect(() => {
    if (!open) {
      dispatch(resetCreateMaintainerState());
    }
  }, [dispatch, open]);

  const avatarPreview = useMemo(() => {
    if (!avatar) {
      return "";
    }

    return URL.createObjectURL(avatar);
  }, [avatar]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const selectedRole = useMemo(
    () => roles.find((roleOption) => roleOption.id === role) || null,
    [role, roles]
  );

  const permissionText = useMemo(() => {
    const permissions = selectedRole?.permissions;
    if (!permissions || typeof permissions !== "object") {
      return t('messages.selectRoleToSee');
    }

    const entries = Object.entries(permissions);
    if (!entries.length) {
      return t('messages.noPermissions');
    }

    return entries
      .map(([key, value]) => `${formatPermissionKey(key)} (${value})`)
      .join(", ");
  }, [selectedRole, t]);

  const allowedRoles = useMemo(() => {
    const userPermissions = resolveUserPermissions(currentUser);
    return roles.filter((roleOption) =>
      canAssignRole(userPermissions, roleOption.permissions)
    );
  }, [currentUser, roles]);

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !role) {
      return;
    }

    dispatch(
      createMaintainer({
        name,
        email,
        roleId: role,
        avatar,
      })
    )
      .unwrap()
      .then(async () => {
        setName("");
        setEmail("");
        setRole("");
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
                {t('title')}
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
                    alt="Selected avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-12 w-12 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
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
                  {t('upload.click')}
                </button>
                <span className="text-gray-500">{t('upload.or')}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {t('upload.hint')}
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t('name')}<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder={t('placeholders.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t('email')}<span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder={t('placeholders.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('role')}</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    status === "loading" ? t('placeholders.loadingRoles') : t('placeholders.selectRole')
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((roleOption) => (
                  <SelectItem key={roleOption.id} value={roleOption.id}>
                    {roleOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error ? <p className="text-xs text-red-500">{error}</p> : null}
            {!error && !allowedRoles.length ? (
              <p className="text-xs text-amber-600">
                {t('messages.noPermissionToAssign')}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('permission')}</Label>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-gray-600" />
              <span>{permissionText}</span>
            </div>
          </div>

          <div className="rounded border border-yellow-200 bg-yellow-50 px-3 py-2">
            <p className="text-xs text-yellow-800">
              <span className="font-medium">{t('messages.note')}</span> {t('messages.reviewNote')}
            </p>
          </div>
          {createError ? (
            <p className="text-sm text-red-500">{createError}</p>
          ) : null}
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('actions.cancel')}
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSave}
            disabled={
              createStatus === "loading" ||
              !name.trim() ||
              !email.trim() ||
              !role ||
              !allowedRoles.length
            }
          >
            <Check className="mr-1 h-4 w-4" />
            {createStatus === "loading" ? t('actions.saving') : t('actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
