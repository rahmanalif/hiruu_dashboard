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

export default function ViewCouponModal({
    open,
    onOpenChange,
    couponData = {
        campaignName: "Summer Sale",
        couponName: "SUMMER 20",
        discount: "20% OFF",
        usage: "100/500",
        targetAudience: "All uses",
        expiry: "No expiry",
    },
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl" showCloseButton={false}>
                <DialogHeader>
                    <div className="text-xs text-gray-500 mb-2">View/Coupon (popup)</div>
                    <DialogTitle className="text-2xl font-semibold">Coupon</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <h3 className="text-lg font-semibold mb-6">Campaign Summary</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Campaign Name:</span>
                            <span className="font-medium">{couponData.campaignName}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Coupon Name:</span>
                            <span className="font-medium">{couponData.couponName}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Discount:</span>
                            <span className="font-medium">{couponData.discount}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Usage:</span>
                            <span className="font-medium">{couponData.usage}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Target Audience:</span>
                            <span className="font-medium">{couponData.targetAudience}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Expiry:</span>
                            <span className="font-medium">{couponData.expiry}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
