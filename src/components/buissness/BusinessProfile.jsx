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

const BusinessProfile = ({ business, onBack }) => {
  const [activeTab, setActiveTab] = useState('account');

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
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  ☕
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-lg font-semibold">{business?.name || "Tech-Haven"}</h2>
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    New york, North Bergen
                  </div>
                  <div className="flex items-center space-x-2">
                    <Store className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Store</span>
                    <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Rating Summary */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Store className="w-4 h-4 text-gray-600" />
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
                    <span className="text-gray-600">Business Name :</span>
                    <span className="font-medium">{business?.name || "Tech-Haven"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">Rome, Italy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Schedules Count:</span>
                    <span className="font-medium">24 active this season</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined Date :</span>
                    <span className="font-medium">Aug 5, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Status:</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{business?.phone || "(603) 555-0123"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email :</span>
                    <span className="font-medium text-xs">support@romesportsclub.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referred by:</span>
                    <span className="font-medium">User A</span>
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
                <Button variant="destructive" className="flex-1">
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
                  className={`px-6 py-3 text-sm font-medium rounded-t-lg ${
                    activeTab === 'account'
                      ? 'bg-[#ECF7FE] text-gray-900 border-b-2 border-[#4FB2FE]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`px-6 py-3 text-sm font-medium rounded-t-lg ${
                    activeTab === 'billing'
                      ? 'bg-[#ECF7FE] text-gray-900 border-b-2 border-[#4FB2FE]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Billing & Plan
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-6 py-3 text-sm font-medium rounded-t-lg ${
                    activeTab === 'activity'
                      ? 'bg-[#ECF7FE] text-gray-900 border-b-2 border-[#4FB2FE]'
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
                      <div key={activity.id} className="bg-blue-50 border-l-4 border-[#4FB2F3] rounded-r-lg p-4">
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
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white text-xl">
                          ☕
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{business?.name || "Tech-Haven"}</h3>
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            New york, North Bergen
                          </div>
                          <div className="flex items-center space-x-2">
                            <Store className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Store</span>
                            <CheckCircle2 className="w-4 h-4 text-purple-500" />
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
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                            {log.avatar}
                          </div>
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
    </div>
  );
};

export default BusinessProfile;