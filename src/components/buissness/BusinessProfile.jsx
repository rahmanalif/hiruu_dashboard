"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Store,
  CheckCircle2,
  Users,
  Briefcase,
  UserCheck,
  MessageSquare,
  Ban,
  ChevronLeft
} from 'lucide-react';
import BanBusinessModal from '@/components/modals/BanBusinessModal';

const BusinessProfile = ({ business, onBack }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  const activities = [
    { id: 1, type: 'Application', title: 'New application received for Graphic Designer job', date: 'Date & Time' },
    { id: 2, type: 'Application', title: 'Apply for promotion', date: 'Date & Time' },
    { id: 3, type: 'Job Posts', title: 'Job posting UI/UX Designer', date: 'Date & Time' },
    { id: 4, type: 'Job Posts', title: 'Created Job Post for spp', date: 'Date & Time' },
    { id: 5, type: 'Text', title: 'Text', date: 'Date & Time' },
    { id: 6, type: 'Text', title: 'Text', date: 'Date & Time' },
    { id: 7, type: 'Text', title: 'Text', date: 'Date & Time' },
    { id: 8, type: 'Text', title: 'Text', date: 'Date & Time' },
    { id: 9, type: 'Text', title: 'Text', date: 'Date & Time' },
    { id: 10, type: 'Text', title: 'Text', date: 'Date & Time' }
  ];

  const activityLogs = [
    { name: 'Jenny Wilson', action: 'meticulously review logs to detect anomalies, unauthorized access, or policy violations', date: 'Aug 12, 2025', avatar: '👤' },
    { name: 'Robert Fox', action: 'detection of suspicious activities', date: 'Aug 12, 2025', avatar: '👤' },
    { name: 'Darrell Steward', action: 'Upgraded to Premium Yearly plan', date: 'Aug 12, 2025', avatar: '👥' },
    { name: 'Brooklyn Simmons', action: 'Apply for clenar', date: 'Aug 12, 2025', avatar: '👤' },
    { name: 'Floyd Miles', action: 'Sub text', date: 'Aug 12, 2025', avatar: '👤' },
    { name: 'Kathryn Murphy', action: 'Sub text', date: 'Aug 12, 2025', avatar: '👤' },
    { name: 'Cameron Williamson', action: 'Sub text', date: 'Aug 12, 2025', avatar: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 pl-0 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to list
        </Button>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6 ">
              <div className="flex items-start space-x-4 mb-6 bg-[#ECF7FE] rounded-3xl px-8 py-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  <img src="/BProfile.png" alt="Business Profile" />
                </div>
                <div className="flex-1 ">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-lg font-semibold">{business?.name || "Tech-Haven"}</h2>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.03959 1.71687C10.1285 0.650369 11.8702 0.650368 12.9591 1.71686L13.4959 2.24265C14.0122 2.74833 14.704 3.03487 15.4266 3.04237L16.178 3.05017C17.7021 3.06598 18.9337 4.29762 18.9495 5.82169L18.9573 6.57305C18.9648 7.29569 19.2513 7.98747 19.757 8.50375L20.2828 9.04056C21.3493 10.1294 21.3493 11.8712 20.2828 12.9601L19.757 13.4969C19.2513 14.0132 18.9648 14.705 18.9573 15.4276L18.9495 16.179C18.9337 17.703 17.7021 18.9347 16.178 18.9505L15.4266 18.9583C14.704 18.9658 14.0122 19.2523 13.4959 19.758L12.9591 20.2838C11.8702 21.3503 10.1285 21.3503 9.03959 20.2838L8.50278 19.758C7.98649 19.2523 7.29472 18.9658 6.57208 18.9583L5.82071 18.9505C4.29664 18.9347 3.06501 17.703 3.04919 16.179L3.04139 15.4276C3.03389 14.705 2.74735 14.0132 2.24167 13.4969L1.71589 12.9601C0.649392 11.8712 0.649391 10.1294 1.71589 9.04056L2.24167 8.50375C2.74735 7.98747 3.03389 7.29569 3.04139 6.57305L3.04919 5.82169C3.06501 4.29762 4.29664 3.06598 5.82071 3.05017L6.57208 3.04237C7.29472 3.03487 7.98649 2.74833 8.50278 2.24265L9.03959 1.71687Z" fill="#4FB2F3" />
                      <path d="M7.33398 10.9698L9.63397 13.3833C9.71105 13.4642 9.84693 13.4651 9.9253 13.3853L14.6673 8.55566" stroke="white" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    New york, North Bergen
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium border-2 border-[#3EBF5A] rounded-xl px-2 py-1">Store</span>
                    <img src="/Vector.png" alt="Vector" className='w-6 h-6' />
                  </div>
                </div>
              </div>

              {/* Rating Summary */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="30" rx="15" fill="#E5F4FD" />
                    <path d="M11.668 9.16797H6.66797M9.16797 20.832H6.66797M7.5013 15H6.66797M17.8235 9.34297L18.9985 11.693C19.1568 12.018 19.5818 12.3263 19.9402 12.393L22.0652 12.743C23.4235 12.968 23.7402 13.9513 22.7652 14.9346L21.1068 16.593C20.8318 16.868 20.6735 17.4096 20.7652 17.8013L21.2402 19.8513C21.6152 21.468 20.7485 22.1013 19.3235 21.2513L17.3318 20.068C16.9735 19.8513 16.3735 19.8513 16.0152 20.068L14.0235 21.2513C12.5985 22.093 11.7318 21.468 12.1068 19.8513L12.5818 17.8013C12.6735 17.418 12.5152 16.8763 12.2402 16.593L10.5818 14.9346C9.60684 13.9596 9.9235 12.9763 11.2818 12.743L13.4068 12.393C13.7652 12.3346 14.1902 12.018 14.3485 11.693L15.5235 9.34297C16.1485 8.06797 17.1818 8.06797 17.8235 9.34297Z" stroke="#111111" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span className="text-sm font-semibold">Rating Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="28" stroke="#fbbf24" strokeWidth="4" fill="none" strokeDasharray="176" strokeDashoffset="35" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">3.5/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">work environment</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="176" strokeDashoffset="18" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">4.5/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">pay on time</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="28" stroke="#ef4444" strokeWidth="4" fill="none" strokeDasharray="176" strokeDashoffset="105" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">2.0/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">communication</p>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">About</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  About New View Hotel is a premium beachfront destination renowned for its exceptional guest service, welcoming atmosphere, and dynamic work culture.
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-semibold mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Business Name :</span>
                    <span className="text-gray-600">{business?.name || "Tech-Haven"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span className="text-gray-600">Rome, Italy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Schedules Count:</span>
                    <span className="text-gray-600">24 active this season</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Joined Date :</span>
                    <span className="text-gray-600">Aug 5, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Business Status:</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Contact:</span>
                    <span className="text-gray-600">{business?.phone || "(603) 555-0123"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email :</span>
                    <span className="text-gray-600 text-xs">support@romesportsclub.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Language:</span>
                    <span className="text-gray-600">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Referred by:</span>
                    <span className="text-gray-600">User A</span>
                  </div>
                </div>
              </div>

              {/* Team Overview */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-4">Team & Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Total Employee</span>
                    </div>
                    <span className="font-semibold">50+</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Active job posting</span>
                    </div>
                    <span className="font-semibold">04</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Actively Recruiting</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Open</Badge>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Members</h3>
                  <button className="text-sm text-blue-600 hover:underline">See All</button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Manager</span>
                    </div>
                    <span className="font-semibold">01</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Staff</span>
                    </div>
                    <span className="font-semibold">10</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Part-time</span>
                    </div>
                    <span className="font-semibold">05</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-6">
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setIsBanModalOpen(true)}>
                  <Ban className="w-4 h-4 mr-2" />
                  Ban
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="border-b">
              <div className="flex space-x-1 p-1">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`px-6 py-3 text-sm font-medium rounded-lg ${activeTab === 'account'
                    ? 'bg-[#ECF7FE] text-gray-900 border-2 border-[#4FB2FE]'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`px-6 py-3 text-sm font-medium rounded-lg ${activeTab === 'billing'
                    ? 'bg-[#ECF7FE] text-gray-900 border-2 border-[#4FB2FE]'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Billing & Plan
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-6 py-3 text-sm font-medium rounded-lg ${activeTab === 'activity'
                    ? 'bg-[#ECF7FE] text-gray-900 border-2 border-[#4FB2FE]'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Activity Log
                </button>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">User Business Activity Timeline</h2>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex space-x-2 mb-6 overflow-x-auto">
                    <Button variant="outline" size="sm" className="rounded-full bg-[#4FB2F3] text-white border-0 hover:bg-[#4FB2F3] mr-2">All</Button>
                    <Button variant="outline" size="sm" className="rounded-full mr-2">Role Changes</Button>
                    <Button variant="outline" size="sm" className="rounded-full mr-2">AI Actions</Button>
                    <Button variant="outline" size="sm" className="rounded-full mr-2">Tokens</Button>
                    <Button variant="outline" size="sm" className="rounded-full mr-2">Premium</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Job Posts</Button>
                  </div>

                  {/* Activity Timeline */}
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="bg-blue-50 border-l-4 border-[#4FB2F3] rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{activity.type}</h3>
                            <p className="text-sm text-blue-600">{activity.title}</p>
                          </div>
                          <span className="text-xs text-gray-500">{activity.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Billing & Plan Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Current Plan</h3>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm">Current Plan is free</p>
                        <p className="text-sm">
                          <span className="font-medium">Active :</span> July 25, 2025 till August 30, 2025
                        </p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-orange-800 font-medium mb-1">We need your attention!</p>
                        <p className="text-orange-700 text-sm">This plan requires update</p>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Days</span>
                          <span>30 of 5 Days</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing Address */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <h3 className="font-semibold">Billing Address</h3>
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Owner:</p>
                          <p className="font-medium">Selina Kyle</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Contact:</p>
                          <p className="font-medium">{business?.phone || "(603) 555-0123"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Business Name:</p>
                          <p className="font-medium">Selina Kyle</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Country:</p>
                          <p className="font-medium">USA</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Billing Email:</p>
                          <p className="font-medium text-xs">nena.dubrovna@wayne.com</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">State:</p>
                          <p className="font-medium">Queensland</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Tax ID:</p>
                          <p className="font-medium">TAX-554523</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Language:</p>
                          <p className="font-medium">English</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">VAT Number:</p>
                          <p className="font-medium">VFR265JJ</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Zip:</p>
                          <p className="font-medium">542165</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600 mb-1">Business Address:</p>
                          <p className="font-medium">100 Water Plant Avenue, Building 1303 Wake Island</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Info */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4 mb-6 bg-[#ECF7FE] rounded-3xl px-8 py-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          <img src="/BProfile.png" alt="Business Profile" />
                        </div>
                        <div className="flex-1 ">
                          <div className="flex items-center space-x-2 mb-1">
                            <h2 className="text-lg font-semibold">{business?.name || "Tech-Haven"}</h2>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.03959 1.71687C10.1285 0.650369 11.8702 0.650368 12.9591 1.71686L13.4959 2.24265C14.0122 2.74833 14.704 3.03487 15.4266 3.04237L16.178 3.05017C17.7021 3.06598 18.9337 4.29762 18.9495 5.82169L18.9573 6.57305C18.9648 7.29569 19.2513 7.98747 19.757 8.50375L20.2828 9.04056C21.3493 10.1294 21.3493 11.8712 20.2828 12.9601L19.757 13.4969C19.2513 14.0132 18.9648 14.705 18.9573 15.4276L18.9495 16.179C18.9337 17.703 17.7021 18.9347 16.178 18.9505L15.4266 18.9583C14.704 18.9658 14.0122 19.2523 13.4959 19.758L12.9591 20.2838C11.8702 21.3503 10.1285 21.3503 9.03959 20.2838L8.50278 19.758C7.98649 19.2523 7.29472 18.9658 6.57208 18.9583L5.82071 18.9505C4.29664 18.9347 3.06501 17.703 3.04919 16.179L3.04139 15.4276C3.03389 14.705 2.74735 14.0132 2.24167 13.4969L1.71589 12.9601C0.649392 11.8712 0.649391 10.1294 1.71589 9.04056L2.24167 8.50375C2.74735 7.98747 3.03389 7.29569 3.04139 6.57305L3.04919 5.82169C3.06501 4.29762 4.29664 3.06598 5.82071 3.05017L6.57208 3.04237C7.29472 3.03487 7.98649 2.74833 8.50278 2.24265L9.03959 1.71687Z" fill="#4FB2F3" />
                              <path d="M7.33398 10.9698L9.63397 13.3833C9.71105 13.4642 9.84693 13.4651 9.9253 13.3853L14.6673 8.55566" stroke="white" stroke-linecap="round" />
                            </svg>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            New york, North Bergen
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium border-2 border-[#3EBF5A] rounded-xl px-2 py-1">Store</span>
                            <img src="/Vector.png" alt="Vector" className='w-6 h-6' />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Activity Log Tab */}
              {activeTab === 'activity' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">User Activity</h2>
                  <div className="space-y-3">
                    {activityLogs.map((log, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img src="/Ellipse1.png" alt={log.name} className="w-10 h-10 rounded-full object-cover" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-medium text-gray-900">{log.name}</h3>
                              <span className="text-xs text-gray-500">{log.date}</span>
                            </div>
                            <p className="text-sm text-gray-600">{log.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <BanBusinessModal
        open={isBanModalOpen}
        onOpenChange={setIsBanModalOpen}
        businessName={business?.name || "Tech-Haven"}
        ownerName="Selina Kyle"
      />
    </div>
  );
};

export default BusinessProfile;