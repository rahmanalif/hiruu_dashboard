"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift } from "lucide-react";
import { createCoupon, resetCreateCouponState } from "@/redux/couponsSlice";
import { useTranslations } from "next-intl";

const generateCouponCode = () =>
    `OFFER${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function CouponWizardModal({
    open,
    onOpenChange,
    onSuccess,
}) {
    const dispatch = useDispatch();
    const t = useTranslations('CouponWizard');
    const { createStatus, createError } = useSelector((state) => state.coupons);
    const [currentStep, setCurrentStep] = useState(1);
    const [campaignName, setCampaignName] = useState("Summer Sale");
    const [couponType, setCouponType] = useState("custom");
    const [couponCode, setCouponCode] = useState("SUMMER20");
    const [discountType, setDiscountType] = useState("percentage");
    const [discountValue, setDiscountValue] = useState("20");
    const [fixedAmount, setFixedAmount] = useState("10");
    const [expiryDate, setExpiryDate] = useState("");
    const [noExpiry, setNoExpiry] = useState(false);
    const [usageLimit, setUsageLimit] = useState("max");
    const [maxUses, setMaxUses] = useState("1000");

    const resetForm = () => {
        setCurrentStep(1);
        setCampaignName("Summer Sale");
        setCouponType("custom");
        setCouponCode("SUMMER20");
        setDiscountType("percentage");
        setDiscountValue("20");
        setFixedAmount("10");
        setExpiryDate("");
        setNoExpiry(false);
        setUsageLimit("max");
        setMaxUses("1000");
    };

    const handleOpenChange = (nextOpen) => {
        if (!nextOpen) {
            dispatch(resetCreateCouponState());
            resetForm();
        }
        onOpenChange(nextOpen);
    };

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePublish = async () => {
        const activeCouponCode =
            couponType === "auto" ? couponCode || generateCouponCode() : couponCode.trim();
        const payload = {
            name: campaignName.trim(),
            code: activeCouponCode,
            discount: Number(discountType === "percentage" ? discountValue : fixedAmount),
            discountType: discountType === "percentage" ? "percent" : "amount",
            isActive: true,
            limit: usageLimit === "unlimited" ? null : Number(maxUses),
            expiredAt: noExpiry || !expiryDate ? null : new Date(expiryDate).toISOString(),
        };

        const resultAction = await dispatch(createCoupon(payload));

        if (createCoupon.fulfilled.match(resultAction)) {
            const createdCoupon = resultAction.payload;
            if (onSuccess) {
                onSuccess({
                    id: createdCoupon?.id || activeCouponCode,
                    campaign: createdCoupon?.name || payload.name,
                    code: createdCoupon?.code || payload.code,
                    discount:
                        payload.discountType === "percent"
                            ? `${payload.discount}%`
                            : `${payload.discount} (${t('labels.fixed')})`,
                    uses: payload.limit == null ? t('labels.unlimited') : String(payload.limit),
                    target: t('labels.all') || "All",
                    expiry: payload.expiredAt
                        ? new Date(payload.expiredAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                          })
                        : t('labels.noExpiry'),
                    status: payload.isActive ? "Active" : "Inactive",
                });
            }

            dispatch(resetCreateCouponState());
            resetForm();
            handleOpenChange(false);
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return t('steps.basic');
            case 2:
                return t('steps.review');
            default:
                return "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Gift className="h-3 w-3 text-green-500" />
                            <span>{t('steps.breadcrumb', { step: currentStep })}</span>
                            <Gift className="h-3 w-3 text-green-500" />
                        </div>
                    </div>
                    <DialogTitle className="text-xl font-semibold">
                        {getStepTitle()}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {/* Step 1: Basic Settings */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm">{t('labels.campaignName')}</Label>
                                <Input
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    placeholder={t('placeholders.campaign')}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm">{t('labels.couponCode')}</Label>
                                <RadioGroup
                                    value={couponType}
                                    onValueChange={(value) => {
                                        setCouponType(value);
                                        if (value === "auto") {
                                            setCouponCode(generateCouponCode());
                                        }
                                    }}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="auto" id="auto" />
                                        <Label htmlFor="auto" className="font-normal cursor-pointer">
                                            {t('labels.autoGenerated')}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="custom" id="custom" />
                                        <Label htmlFor="custom" className="font-normal cursor-pointer">
                                            {t('labels.custom')}
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {couponType === "custom" && (
                                    <Input
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder={t('placeholders.coupon')}
                                        className="mt-2"
                                    />
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm">{t('labels.discountType')}</Label>
                                <RadioGroup
                                    value={discountType}
                                    onValueChange={(value) => setDiscountType(value)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="percentage" id="percentage" />
                                            <Label htmlFor="percentage" className="font-normal cursor-pointer">
                                                {t('labels.percentage')}
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="fixed" id="fixed" />
                                            <Label htmlFor="fixed" className="font-normal cursor-pointer">
                                                {t('labels.fixed')}
                                            </Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                                <div className="flex gap-4">
                                    <Input
                                        type="number"
                                        value={discountType === "percentage" ? discountValue : fixedAmount}
                                        onChange={(e) =>
                                            discountType === "percentage"
                                                ? setDiscountValue(e.target.value)
                                                : setFixedAmount(e.target.value)
                                        }
                                        className="w-24"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm">{t('labels.expiry')}</Label>
                                <Input
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    disabled={noExpiry}
                                />
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="no-expiry"
                                        checked={noExpiry}
                                        onCheckedChange={(checked) => setNoExpiry(checked)}
                                    />
                                    <Label htmlFor="no-expiry" className="font-normal cursor-pointer text-sm">
                                        {t('labels.noExpiry')}
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm">{t('labels.usageLimit')}</Label>
                                <RadioGroup
                                    value={usageLimit}
                                    onValueChange={(value) => setUsageLimit(value)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="max" id="max" />
                                            <Label htmlFor="max" className="font-normal cursor-pointer">
                                                {t('labels.maxUses')}
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="unlimited" id="unlimited" />
                                            <Label htmlFor="unlimited" className="font-normal cursor-pointer">
                                                {t('labels.unlimited')}
                                            </Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                                {usageLimit === "max" && (
                                    <Input
                                        type="number"
                                        value={maxUses}
                                        onChange={(e) => setMaxUses(e.target.value)}
                                        className="w-32"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Review & Deploy */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold">{t('summary.title')}</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('summary.campaignName')}</span>
                                        <span className="font-medium">{campaignName}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('summary.couponName')}</span>
                                        <span className="font-medium">{couponCode}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('summary.discount')}</span>
                                        <span className="font-medium">
                                            {discountType === "percentage" ? `${discountValue}% ${t('summary.off')}` : `$${fixedAmount} ${t('summary.off')}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('summary.usageLimit')}</span>
                                        <span className="font-medium">
                                            {usageLimit === "max" ? `${maxUses} ${t('summary.users')}` : t('summary.unlimited')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('summary.targetAudience')}</span>
                                        <span className="font-medium">{t('summary.allUses')}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('summary.expiry')}</span>
                                        <span className="font-medium">
                                            {noExpiry ? t('summary.noExpiry') : expiryDate || t('summary.noExpiry')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {createError ? (
                    <p className="text-sm text-red-500">{createError}</p>
                ) : null}

                <DialogFooter className="gap-2 sm:gap-4">
                    {currentStep > 1 && (
                        <Button variant="outline" onClick={handlePrevious} disabled={createStatus === "loading"}>
                            {t('actions.previous')}
                        </Button>
                    )}
                    {currentStep === 1 && (
                        <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={createStatus === "loading"}>
                            {t('actions.cancel')}
                        </Button>
                    )}
                    {currentStep < 2 ? (
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleNext}>
                            {t('actions.next')}
                        </Button>
                    ) : (
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={handlePublish}
                            disabled={createStatus === "loading"}
                        >
                            {createStatus === "loading" ? t('actions.publishing') : t('actions.publish')}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
