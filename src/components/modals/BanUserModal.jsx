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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function BanUserModal({
    open,
    onOpenChange,
    userName = "Rohan Mehta",
    storeName = "Tech Haven",
}) {
    const [banReason, setBanReason] = useState("Fraud");
    const [banDuration, setBanDuration] = useState("Permanent");
    const [selectedDate, setSelectedDate] = useState("mm/dd/yyyy");
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)); // August 2025

    const handleConfirm = () => {
        console.log({
            userName,
            storeName,
            banReason,
            banDuration,
            selectedDate,
        });
        onOpenChange(false);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
            });
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const days = getDaysInMonth(currentMonth);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-medium">
                            Ban {userName}
                        </DialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="rounded-sm opacity-70 hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Ban Reason */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Ban Reason</Label>
                        <Select value={banReason} onValueChange={setBanReason}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fraud">Fraud</SelectItem>
                                <SelectItem value="Policy violation">Policy violation</SelectItem>
                                <SelectItem value="Excessive Customer Complaints">
                                    Excessive Customer Complaints
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ban Duration */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Ban Duration</Label>
                        <Select value={banDuration} onValueChange={setBanDuration}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Permanent">Permanent</SelectItem>
                                <SelectItem value="Temporary">Temporary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Temporary Ban Options */}
                    {banDuration === "Temporary" && (
                        <div className="space-y-4">
                            {/* Ban Lift Date */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Ban Lift Date</Label>
                                <Select value={selectedDate} onValueChange={setSelectedDate}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mm/dd/yyyy">mm/dd/yyyy</SelectItem>
                                        <SelectItem value="08/15/2025">08/15/2025</SelectItem>
                                        <SelectItem value="08/30/2025">08/30/2025</SelectItem>
                                        <SelectItem value="09/15/2025">09/15/2025</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Calendar */}
                            <div className="rounded-lg border">
                                <div className="flex items-center justify-between border-b px-4 py-3">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="p-1 hover:bg-accent rounded"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <div className="text-sm font-medium">{monthYear}</div>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-1 hover:bg-accent rounded"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="p-3">
                                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                            <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center">
                                        {days.map((date, index) => (
                                            <button
                                                key={index}
                                                className={`
                            py-2 text-sm rounded
                            ${!date.isCurrentMonth ? "text-muted-foreground/50" : ""}
                            ${date.day === 12 && date.isCurrentMonth && currentMonth.getMonth() === 7
                                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                                        : "hover:bg-accent"
                                                    }
                          `}
                                                onClick={() => {
                                                    if (date.isCurrentMonth) {
                                                        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
                                                        const day = String(date.day).padStart(2, '0');
                                                        const year = currentMonth.getFullYear();
                                                        setSelectedDate(`${month}/${day}/${year}`);
                                                    }
                                                }}
                                            >
                                                {date.day}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Warning Note */}
                    <div className="rounded bg-yellow-50 border border-yellow-200 px-3 py-2">
                        <p className="text-xs text-yellow-800">
                            <span className="font-medium">Note:</span> This action will automatically disable all products and notify the store owner(s).
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}