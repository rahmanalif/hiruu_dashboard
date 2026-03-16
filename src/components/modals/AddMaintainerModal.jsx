"use client";

import { useState } from "react";
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

export default function AddMaintainerModal({ open, onOpenChange }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Sales & Marketing");
  const [isDragging, setIsDragging] = useState(false);

  const handleSave = () => {
    console.log({ name, email, role });
    onOpenChange(false);
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <DialogTitle className="text-lg font-medium">
                Add Maintainer
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
                <svg
                  className="h-12 w-12 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
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
                <button className="text-blue-500 hover:underline">
                  Click to upload
                </button>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                PNG or JPG (max. 800x800px)
              </p>
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                <SelectItem value="Customer Support">Customer Support</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Administrator">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Permission</Label>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-gray-600" />
              <span>Overview, Rewards, Gifts & Coupons</span>
            </div>
          </div>

          <div className="rounded border border-yellow-200 bg-yellow-50 px-3 py-2">
            <p className="text-xs text-yellow-800">
              <span className="font-medium">Note:</span> Please review the role
              permissions carefully before saving.
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
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
