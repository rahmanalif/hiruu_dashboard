"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Star, MapPin, Phone, Calendar, Globe, Building2, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BanUserModal from '@/components/modals/BanUserModal';

export default function UserProfileActivity() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('all');
    const [mainTab, setMainTab] = useState('account');
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [isUserIdOpen, setIsUserIdOpen] = useState(false);
    const [userIdPopupPosition, setUserIdPopupPosition] = useState(null);

    const getPopupPosition = (triggerRect, popupWidth) => {
        const viewportPadding = 16;
        const top = Math.min(triggerRect.bottom + 8, window.innerHeight - 80);
        const left = Math.min(
            Math.max(triggerRect.left, viewportPadding),
            window.innerWidth - popupWidth - viewportPadding
        );

        return { top, left };
    };

    React.useEffect(() => {
        const handleViewportChange = () => {
            setIsUserIdOpen(false);
            setUserIdPopupPosition(null);
        };

        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("scroll", handleViewportChange, true);

        return () => {
            window.removeEventListener("resize", handleViewportChange);
            window.removeEventListener("scroll", handleViewportChange, true);
        };
    }, []);

    const activityItems = [
        {
            id: 1,
            type: 'redeem',
            title: 'Redeem Tokens',
            description: 'You used 15 Tokens to Buy 1 Month Premium',
            date: 'Date & Time',
            category: 'tokens'
        },
        {
            id: 2,
            type: 'role',
            title: 'Your Role Changes',
            description: 'Your role for project \'Alpha\' was updated from \'Viewer\'',
            date: 'Date & Time',
            category: 'role'
        },
        {
            id: 3,
            type: 'text',
            title: 'Text',
            description: 'test',
            date: 'Date & Time',
            category: 'all'
        },
        {
            id: 4,
            type: 'redeem',
            title: 'Redeem Tokens',
            description: 'You used 15 Tokens to Buy 1 Month Premium',
            date: 'Date & Time',
            category: 'tokens'
        },
        {
            id: 5,
            type: 'job',
            title: 'Job Apply',
            description: 'Log In Daily for 7 Days earn 20 token',
            date: 'Date & Time',
            category: 'job'
        },
        {
            id: 6,
            type: 'earn',
            title: 'Earn Token',
            description: 'Log In Daily for 7 Days earn 20 token',
            date: 'Date & Time',
            category: 'premium'
        },
        {
            id: 7,
            type: 'earn',
            title: 'Earn Token',
            description: 'Log In Daily for 7 Days earn 20 token',
            date: 'Date & Time',
            category: 'premium'
        },
        {
            id: 8,
            type: 'earn',
            title: 'Earn Token',
            description: 'Log In Daily for 7 Days earn 20 token',
            date: 'Date & Time',
            category: 'premium'
        }
    ];

    const referrals = [
        { user: 'Kristin Watson', date: 'Aug 10, 2025', tokens: 20 },
        { user: 'Ronald Richards', date: 'Aug 10, 2025', tokens: 20 },
        { user: 'Annette Black', date: 'Aug 10, 2025', tokens: 20 },
        { user: 'Annette Black', date: 'Aug 10, 2025', tokens: 20 },
        { user: 'Eleanor Pena', date: 'Aug 10, 2025', tokens: 20 },
        { user: 'Darrell Steward', date: 'Aug 10, 2025', tokens: 20 }
    ];

    const activityLogItems = [
        {
            id: 1,
            name: 'Louis Vuitton',
            logo: 'LV',
            description: 'Subscription renews on Jan 29, 2024',
            date: 'Aug,12 2025',
            bgColor: 'bg-red-500'
        },
        {
            id: 2,
            name: 'IBM',
            logo: 'IBM',
            description: 'Track sign-ins, failed attempts, and suspicious activities to prevent unauthorized access',
            date: 'Aug,12 2025',
            bgColor: 'bg-blue-500'
        },
        {
            id: 3,
            name: "McDonald's",
            logo: 'M',
            description: 'Monitor user actions like file access, sharing, and system changes to ensure proper use of resources',
            date: 'Aug,12 2025',
            bgColor: 'bg-red-600'
        },
        {
            id: 4,
            name: "L'Oréal",
            logo: 'L',
            description: 'Provide a trail for forensic analysis during security breaches or policy violations.',
            date: 'Aug,12 2025',
            bgColor: 'bg-gray-800'
        },
        {
            id: 5,
            name: 'Ferrari',
            logo: 'F',
            description: 'suspicious login attempts',
            date: 'Aug,12 2025',
            bgColor: 'bg-blue-600'
        },
        {
            id: 6,
            name: 'Starbucks',
            logo: 'S',
            description: 'Track sign-ins, failed attempts, and suspicious activities to prevent unauthorized access',
            date: 'Aug,12 2025',
            bgColor: 'bg-green-700'
        },
        {
            id: 7,
            name: 'Sony',
            logo: 'S',
            description: 'Track sign-ins, failed attempts, and suspicious activities to prevent unauthorized access',
            date: 'Aug,12 2025',
            bgColor: 'bg-red-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar - User Profile */}
                <div className="lg:col-span-1">
                    <Button
                        variant="ghost"
                        className="mb-4 pl-0"
                        onClick={() => {
                            if (window.history.length > 1) {
                                router.back();
                            } else {
                                router.push('/users');
                            }
                        }}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        User
                    </Button>

                    <Card className="bg-cover bg-center border-none" style={{ backgroundImage: "url('/profile-bg.png')" }}>
                        <CardContent className="p-2 m-2">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                                    <AvatarImage src="/placeholder.svg" />
                                    <AvatarFallback className="bg-blue-500 text-white">RM</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="font-semibold text-gray-900">Rohan Mehta</h2>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.03959 1.71687C10.1285 0.650369 11.8702 0.650368 12.9591 1.71686L13.4959 2.24265C14.0122 2.74833 14.704 3.03487 15.4266 3.04237L16.178 3.05017C17.7021 3.06598 18.9337 4.29762 18.9495 5.82169L18.9573 6.57305C18.9648 7.29569 19.2513 7.98747 19.757 8.50375L20.2828 9.04056C21.3493 10.1294 21.3493 11.8712 20.2828 12.9601L19.757 13.4969C19.2513 14.0132 18.9648 14.705 18.9573 15.4276L18.9495 16.179C18.9337 17.703 17.7021 18.9347 16.178 18.9505L15.4266 18.9583C14.704 18.9658 14.0122 19.2523 13.4959 19.758L12.9591 20.2838C11.8702 21.3503 10.1285 21.3503 9.03959 20.2838L8.50278 19.758C7.98649 19.2523 7.29472 18.9658 6.57208 18.9583L5.82071 18.9505C4.29664 18.9347 3.06501 17.703 3.04919 16.179L3.04139 15.4276C3.03389 14.705 2.74735 14.0132 2.24167 13.4969L1.71589 12.9601C0.649392 11.8712 0.649391 10.1294 1.71589 9.04056L2.24167 8.50375C2.74735 7.98747 3.03389 7.29569 3.04139 6.57305L3.04919 5.82169C3.06501 4.29762 4.29664 3.06598 5.82071 3.05017L6.57208 3.04237C7.29472 3.03487 7.98649 2.74833 8.50278 2.24265L9.03959 1.71687Z" fill="#4FB2F3" />
                                            <path d="M7.33398 10.9698L9.63397 13.3833C9.71105 13.4642 9.84693 13.4651 9.9253 13.3853L14.6673 8.55566" stroke="white" stroke-linecap="round" />
                                        </svg>

                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-700">
                                        <MapPin className="w-3 h-3" />
                                        <span>New york, North Belgium</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge className="mt-2 bg-white/80 text-gray-700 hover:bg-white/90">User</Badge>
                                        <img src="/badge.png" alt="" className='h-8' />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <Star className="w-4 h-4 text-gray-900" />
                            </div>
                            <span className="font-semibold text-gray-900">Rating Summary</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">Based on overall rating</p>
                        </div>
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-base">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-gray-600">User name:</span>
                                <span className="col-span-2 text-gray-900">Selina Kyle</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-gray-600">Email:</span>
                                <span className="col-span-2 text-gray-900 text-xs">hena.dubrovna@kwayne.com</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-gray-600">Status:</span>
                                <span className="col-span-2 text-green-600">active</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-gray-600">ID:</span>
                                <div className="col-span-2 relative">
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            if (isUserIdOpen) {
                                                setIsUserIdOpen(false);
                                                setUserIdPopupPosition(null);
                                                return;
                                            }

                                            setUserIdPopupPosition(
                                                getPopupPosition(event.currentTarget.getBoundingClientRect(), 220)
                                            );
                                            setIsUserIdOpen(true);
                                        }}
                                        className="text-gray-900 transition-colors hover:text-[#4FB2F3]"
                                    >
                                        15265
                                    </button>
                                    {isUserIdOpen && userIdPopupPosition && (
                                        <>
                                            <button
                                                type="button"
                                                aria-label="Close full ID popup"
                                                onClick={() => {
                                                    setIsUserIdOpen(false);
                                                    setUserIdPopupPosition(null);
                                                }}
                                                className="fixed inset-0 z-10 cursor-default"
                                            />
                                            <div
                                                className="fixed z-20 w-max max-w-[220px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-lg"
                                                style={userIdPopupPosition}
                                            >
                                                Full ID: 15265
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-gray-600">Contact:</span>
                                <span className="col-span-2 text-gray-900">(603) 555-0123</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-gray-600">Joined Date:</span>
                                <span className="col-span-2 text-gray-900">Aug 5, 2023</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-gray-600">Language:</span>
                                <span className="col-span-2 text-gray-900">English</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-gray-600">Country:</span>
                                <span className="col-span-2 text-gray-900">USA</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-base">User Business</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {['Restaurant', 'Restaurant', 'Restaurant'].map((type, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">Business Name</div>
                                        <div className="text-xs text-gray-500">{type}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex gap-3 mt-6">
                        <Button className="flex-1 bg-[#4FB2F3] hover:bg-[#4FB2F3]">Chat</Button>
                        <Button variant="destructive" className="flex-1" onClick={() => setIsBanModalOpen(true)}>Ban</Button>
                    </div>
                </div>

                {/* Right Content - Tabs */}
                <div className="lg:col-span-2">
                    <Tabs value={mainTab} onValueChange={setMainTab} className="mb-6">
                        <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-0">
                            <TabsTrigger
                                value="account"
                                className="data-[state=active]:border-2 data-[state=active]:border-[#4FB2FE] data-[state=active]:bg-[#ECF7FE] data-[state=active]:shadow-none bg-white border border-transparent"
                            >
                                Account
                            </TabsTrigger>
                            <TabsTrigger
                                value="billing"
                                className="data-[state=active]:border-2 data-[state=active]:border-[#4FB2FE] data-[state=active]:bg-[#ECF7FE] data-[state=active]:shadow-none bg-white border border-transparent"
                            >
                                Billing & Plan
                            </TabsTrigger>
                            <TabsTrigger
                                value="activity"
                                className="data-[state=active]:border-2 data-[state=active]:border-[#4FB2FE] data-[state=active]:bg-[#ECF7FE] data-[state=active]:shadow-none bg-white border border-transparent"
                            >
                                Activity Log
                            </TabsTrigger>
                        </TabsList>

                        {/* Account Tab Content */}
                        <TabsContent value="account" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Activity Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                        <Button
                                            variant={activeTab === 'all' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setActiveTab('all')}
                                            className={activeTab === 'all' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={activeTab === 'role' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setActiveTab('role')}
                                            className={activeTab === 'role' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                                        >
                                            Role Changes
                                        </Button>
                                        <Button
                                            variant={activeTab === 'ai' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setActiveTab('ai')}
                                            className={activeTab === 'ai' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                                        >
                                            AI Actions
                                        </Button>
                                        <Button
                                            variant={activeTab === 'tokens' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setActiveTab('tokens')}
                                            className={activeTab === 'tokens' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                                        >
                                            Tokens
                                        </Button>
                                        <Button
                                            variant={activeTab === 'premium' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setActiveTab('premium')}
                                            className={activeTab === 'premium' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                                        >
                                            Premium
                                        </Button>
                                        <Button
                                            variant={activeTab === 'job' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setActiveTab('job')}
                                            className={activeTab === 'job' ? 'bg-[#4FB2F3] hover:bg-[#4FB2F3]' : ''}
                                        >
                                            Job Posts
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {activityItems
                                            .filter(item => activeTab === 'all' || item.category === activeTab)
                                            .map((item) => (
                                                <div key={item.id} className="bg-blue-50 border-l-6 border-[#4FB2F3] rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                                                            <p className="text-sm text-gray-600">{item.description}</p>
                                                        </div>
                                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{item.date}</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Referrals</CardTitle>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Tokens</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {referrals.map((referral, idx) => (
                                                    <tr key={idx} className="border-b last:border-0">
                                                        <td className="py-3 px-4 text-sm">{referral.user}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{referral.date}</td>
                                                        <td className="py-3 px-4 text-sm">{referral.tokens}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Billing & Plan Tab Content */}
                        <TabsContent value="billing" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Current Plan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium mb-1">Current Plan is free</p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Active :</span> July 25, 2025 till August 1, 2025
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">Days</span>
                                                <span className="font-medium">7 of 5 Days</span>
                                            </div>
                                            <Progress value={71.4} className="h-2" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Alert className="bg-orange-50 border-orange-200">
                                    <AlertDescription>
                                        <p className="font-semibold text-orange-700 mb-1">We need your attention!</p>
                                        <p className="text-sm text-orange-600">This plan requires update</p>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </TabsContent>

                        {/* Activity Log Tab Content */}
                        <TabsContent value="activity" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Activity Log</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {activityLogItems.map((item) => (
                                            <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className={`${item.bgColor} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shrink-0`}>
                                                        {item.logo}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start gap-4 mb-1">
                                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">{item.date}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{item.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <BanUserModal
                open={isBanModalOpen}
                onOpenChange={setIsBanModalOpen}
                userName="Rohan Mehta"
            />
        </div>
    );
}
