"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const NotificationSection = () => {
  const notifications = [
    {
      id: 1,
      name: 'Jenny Wilson',
      message: 'Periodically review logs to detect anomalies, unauthorized access, or policy violations',
      date: 'Aug,12 2025',
      image: '/Ellipse 1.png',
    },
    {
      id: 2,
      name: 'Robert Fox',
      message: 'detection of suspicious activities',
      date: 'Aug,12 2025',
      image: '/Ellipse 2.png',
    },
    {
      id: 3,
      name: 'Darrell Steward',
      message: 'Upgraded to Premium Yearly plan',
      date: 'Aug,12 2025',
      image: '/Ellipse1.png',
    },
    {
      id: 4,
      name: 'Brooklyn Simmons',
      message: 'Apply for clenar',
      date: 'Aug,12 2025',
      image: '/BProfile.png',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification</h1>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="border border-gray-300 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <img 
                      src={notification.image} 
                      alt={notification.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-base">{notification.name}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{notification.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;