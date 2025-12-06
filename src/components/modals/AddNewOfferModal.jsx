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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Search } from "lucide-react";

export default function CouponWizardModal({
    open,
    onOpenChange,
}) {
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

    // Step 2 - Audience Targeting
    const [targetUsers, setTargetUsers] = useState(false);
    const [userFilter, setUserFilter] = useState("All");
    const [targetBusinesses, setTargetBusinesses] = useState(false);
    const [businessFilter, setBusinessFilter] = useState("All");
    const [selectedUsersMode, setSelectedUsersMode] = useState(false);
    const [selectedBusinessesMode, setSelectedBusinessesMode] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [businessSearch, setBusinessSearch] = useState("");

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePublish = () => {
        console.log("Publishing coupon...");
        onOpenChange(false);
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return "Basic Settings";
            case 2:
                return "Audience Targeting";
            case 3:
                return "Review & Deploy";
            default:
                return "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Gift className="h-3 w-3 text-green-500" />
                            <span>Gifts & Coupons/add new offer -{currentStep}</span>
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
                                <Label className="text-sm">Campaign Name</Label>
                                <Input
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    placeholder="Summer Sale"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm">Coupon Code</Label>
                                <RadioGroup
                                    value={couponType}
                                    onValueChange={(value) => setCouponType(value)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="auto" id="auto" />
                                        <Label htmlFor="auto" className="font-normal cursor-pointer">
                                            Auto-generated
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="custom" id="custom" />
                                        <Label htmlFor="custom" className="font-normal cursor-pointer">
                                            Custom
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {couponType === "custom" && (
                                    <Input
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="SUMMER20"
                                        className="mt-2"
                                    />
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm">Discount Type</Label>
                                <RadioGroup
                                    value={discountType}
                                    onValueChange={(value) => setDiscountType(value)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="percentage" id="percentage" />
                                            <Label htmlFor="percentage" className="font-normal cursor-pointer">
                                                Percentage
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="fixed" id="fixed" />
                                            <Label htmlFor="fixed" className="font-normal cursor-pointer">
                                                Fixed Amount
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
                                <Label className="text-sm">Expiry</Label>
                                <Input
                                    type="text"
                                    placeholder="mm/dd/yyyy"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                />
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="no-expiry"
                                        checked={noExpiry}
                                        onCheckedChange={(checked) => setNoExpiry(checked)}
                                    />
                                    <Label htmlFor="no-expiry" className="font-normal cursor-pointer text-sm">
                                        No expiry
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm">Usage Limit</Label>
                                <RadioGroup
                                    value={usageLimit}
                                    onValueChange={(value) => setUsageLimit(value)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="max" id="max" />
                                            <Label htmlFor="max" className="font-normal cursor-pointer">
                                                Max uses
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="unlimited" id="unlimited" />
                                            <Label htmlFor="unlimited" className="font-normal cursor-pointer">
                                                Unlimited
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

                    {/* Step 2: Audience Targeting */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <Label className="text-sm">Select Target Audience</Label>

                            {/* Users Section */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="users"
                                        checked={targetUsers && !selectedUsersMode}
                                        onChange={() => {
                                            setTargetUsers(true);
                                            setSelectedUsersMode(false);
                                            setTargetBusinesses(false);
                                            setSelectedBusinessesMode(false);
                                        }}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="users" className="font-normal cursor-pointer">
                                        Users
                                    </Label>
                                </div>
                                {targetUsers && !selectedUsersMode && (
                                    <div className="ml-6">
                                        <Select value={userFilter} onValueChange={setUserFilter}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All</SelectItem>
                                                <SelectItem value="Free">Free</SelectItem>
                                                <SelectItem value="Premium">Premium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            {/* Businesses Section */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="businesses"
                                        checked={targetBusinesses && !selectedBusinessesMode}
                                        onChange={() => {
                                            setTargetBusinesses(true);
                                            setSelectedBusinessesMode(false);
                                            setTargetUsers(false);
                                            setSelectedUsersMode(false);
                                        }}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="businesses" className="font-normal cursor-pointer">
                                        Businesses
                                    </Label>
                                </div>
                                {targetBusinesses && !selectedBusinessesMode && (
                                    <div className="ml-6">
                                        <Select value={businessFilter} onValueChange={setBusinessFilter}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All</SelectItem>
                                                <SelectItem value="Free">Free</SelectItem>
                                                <SelectItem value="Premium">Premium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            {/* Selected Users Section */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="selected-users"
                                        checked={selectedUsersMode}
                                        onChange={() => {
                                            setSelectedUsersMode(true);
                                            setTargetUsers(false);
                                            setTargetBusinesses(false);
                                            setSelectedBusinessesMode(false);
                                        }}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="selected-users" className="font-normal cursor-pointer">
                                        Users
                                    </Label>
                                </div>
                                {selectedUsersMode && (
                                    <div className="ml-6 space-y-2">
                                        <div className="text-xs text-gray-500">
                                            ID: 19205, 19206, 19266
                                        </div>
                                        <div className="relative">
                                            <Input
                                                placeholder="Select users"
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                            />
                                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selected Businesses Section */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="selected-businesses"
                                        checked={selectedBusinessesMode}
                                        onChange={() => {
                                            setSelectedBusinessesMode(true);
                                            setTargetBusinesses(false);
                                            setTargetUsers(false);
                                            setSelectedUsersMode(false);
                                        }}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="selected-businesses" className="font-normal cursor-pointer">
                                        Businesses
                                    </Label>
                                </div>
                                {selectedBusinessesMode && (
                                    <div className="ml-6 space-y-2">
                                        <div className="text-xs text-gray-500">
                                            ID: 19205, 19206, 19266
                                        </div>
                                        <div className="relative">
                                            <Input
                                                placeholder="Select business"
                                                value={businessSearch}
                                                onChange={(e) => setBusinessSearch(e.target.value)}
                                            />
                                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Deploy */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold">Campaign Summary</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Campaign Name:</span>
                                        <span className="font-medium">{campaignName}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Coupon Name:</span>
                                        <span className="font-medium">{couponCode}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discount:</span>
                                        <span className="font-medium">
                                            {discountType === "percentage" ? `${discountValue}% OFF` : `$${fixedAmount} OFF`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Usage Limit:</span>
                                        <span className="font-medium">
                                            {usageLimit === "max" ? `${maxUses} users` : "Unlimited"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Target Audience:</span>
                                        <span className="font-medium">All uses</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expiry:</span>
                                        <span className="font-medium">
                                            {noExpiry ? "No expiry" : expiryDate || "No expiry"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {currentStep > 1 && (
                        <Button variant="outline" onClick={handlePrevious}>
                            Previous
                        </Button>
                    )}
                    {currentStep === 1 && (
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                    )}
                    {currentStep < 3 ? (
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handlePublish}>
                            Publish
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}