"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgePercent, Check, Lock, X } from "lucide-react";
import { resetUpdateCouponState, updateCoupon } from "@/redux/couponsSlice";

const getInitialFormState = (couponData) => ({
    campaignName: couponData?.campaignName || "",
    couponName: couponData?.couponName || "",
    discount:
        couponData?.discount != null
            ? String(couponData.discount).replace("%", "").replace(" (Fixed)", "")
            : "",
    discountType: couponData?.discountType || "percent",
    usage: couponData?.usage === "Unlimited" ? "" : String(couponData?.usage || ""),
    isActive: Boolean(couponData?.isActive),
    noExpiry: !couponData?.expiredAt,
    expiryDate: couponData?.expiredAt
        ? new Date(couponData.expiredAt).toISOString().slice(0, 10)
        : "",
});

export default function ViewCouponModal({
    open,
    onOpenChange,
    onSuccess,
    couponData = {
        id: "",
        campaignName: "Summer Sale",
        couponName: "SUMMER 20",
        discount: "20",
        discountType: "percent",
        usage: "100",
        isActive: true,
        targetAudience: "All",
        expiry: "No expiry",
        expiredAt: null,
    },
}) {
    const dispatch = useDispatch();
    const { updateStatus, updateError } = useSelector((state) => state.coupons);
    const [formState, setFormState] = useState(() => getInitialFormState(couponData));

    const {
        campaignName,
        couponName,
        discount,
        discountType,
        usage,
        isActive,
        noExpiry,
        expiryDate,
    } = formState;

    useEffect(() => {
        if (!open) {
            dispatch(resetUpdateCouponState());
        }
    }, [dispatch, open]);

    const handleSave = () => {
        if (!couponData?.id || !campaignName.trim() || !couponName.trim() || !discount.trim()) {
            return;
        }

        dispatch(
            updateCoupon({
                id: couponData.id,
                couponData: {
                    name: campaignName.trim(),
                    code: couponName.trim(),
                    discount: Number(discount),
                    discountType,
                    isActive,
                    limit: usage.trim() ? Number(usage) : null,
                    expiredAt: noExpiry || !expiryDate ? null : new Date(expiryDate).toISOString(),
                },
            })
        )
            .unwrap()
            .then(async () => {
                onOpenChange(false);
                if (typeof onSuccess === "function") {
                    await onSuccess();
                }
            })
            .catch(() => {});
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            <DialogTitle className="text-lg font-medium">
                                Edit Coupon
                            </DialogTitle>
                        </div>
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
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
                                <BadgePercent className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Update coupon details
                                </p>
                                <p className="text-xs text-gray-600">
                                    Change the campaign settings and coupon information.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">Campaign Name</Label>
                            <Input
                                value={campaignName}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        campaignName: event.target.value,
                                    }))
                                }
                                placeholder="Campaign name"
                            />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">Coupon Code</Label>
                            <Input
                                value={couponName}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        couponName: event.target.value,
                                    }))
                                }
                                placeholder="Coupon code"
                            />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">Discount</Label>
                            <Input
                                type="number"
                                value={discount}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        discount: event.target.value,
                                    }))
                                }
                                placeholder="Discount"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">Usage Limit</Label>
                            <Input
                                type="number"
                                value={usage}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        usage: event.target.value,
                                    }))
                                }
                                placeholder="Usage limit"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">Discount Type</Label>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    className={`rounded-md px-3 py-1.5 text-sm ${discountType === "percent" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`}
                                    onClick={() =>
                                        setFormState((current) => ({
                                            ...current,
                                            discountType: "percent",
                                        }))
                                    }
                                >
                                    Percentage
                                </button>
                                <button
                                    type="button"
                                    className={`rounded-md px-3 py-1.5 text-sm ${discountType === "amount" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`}
                                    onClick={() =>
                                        setFormState((current) => ({
                                            ...current,
                                            discountType: "amount",
                                        }))
                                    }
                                >
                                    Fixed
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">Expiry</Label>
                        <Input
                            type="date"
                            value={expiryDate}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    expiryDate: event.target.value,
                                }))
                            }
                            disabled={noExpiry}
                        />
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="coupon-no-expiry"
                                checked={noExpiry}
                                onCheckedChange={(checked) =>
                                    setFormState((current) => ({
                                        ...current,
                                        noExpiry: Boolean(checked),
                                    }))
                                }
                            />
                            <Label htmlFor="coupon-no-expiry" className="font-normal cursor-pointer text-sm">
                                No expiry
                            </Label>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 rounded border border-yellow-200 bg-yellow-50 px-3 py-2">
                        <Checkbox
                            id="coupon-active"
                            checked={isActive}
                            onCheckedChange={(checked) =>
                                setFormState((current) => ({
                                    ...current,
                                    isActive: Boolean(checked),
                                }))
                            }
                        />
                        <Label htmlFor="coupon-active" className="font-normal cursor-pointer text-sm text-yellow-900">
                            Keep this coupon active
                        </Label>
                    </div>

                    {updateError ? (
                        <p className="text-sm text-red-500">{updateError}</p>
                    ) : null}

                    <div className="rounded border border-yellow-200 bg-yellow-50 px-3 py-2">
                        <p className="text-xs text-yellow-800">
                            <span className="font-medium">Note:</span> Review the coupon settings carefully before saving.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={handleSave}
                        disabled={updateStatus === "loading" || !campaignName.trim() || !couponName.trim() || !discount.trim()}
                    >
                        <Check className="mr-1 h-4 w-4" />
                        {updateStatus === "loading" ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
