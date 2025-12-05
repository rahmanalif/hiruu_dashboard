"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, Check, CheckCheck, Paperclip, Smile, Send, MapPin, Phone, Mail, Calendar, User } from 'lucide-react';

const ChatMessagingInterface = () => {
  const [message, setMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('Open');

  const conversations = Array(9).fill({
    name: 'Mr. Rosemary',
    preview: 'Hi, I want to ask som...',
    unread: 1,
    avatar: '/Ellipse 1.png'
  });

  const messages = [
    {
      id: 1,
      text: "Hi, I'm facing an issue with submitting my leave request.",
      sender: 'user',
      time: '1:44 PM',
      status: 'read'
    },
    {
      id: 2,
      text: "Hi there 👋 No worries, we're here to help! Can you please tell us what issue you're seeing?",
      sender: 'support',
      time: '1:44 PM'
    },
    {
      id: 3,
      text: 'The form doesn\'t load when I tap on "Submit Request".',
      sender: 'user',
      time: '1:44 PM',
      status: 'read'
    }
  ];

  const businesses = [
    { name: 'Business Name', type: 'Restaurant', icon: '🍴' },
    { name: 'Business Name', type: 'Restaurant', icon: '🍴' },
    { name: 'Business Name', type: 'Restaurant', icon: '🍴' }
  ];

  const activities = [
    { name: 'Business Name', type: 'Restaurant', icon: '🍴' },
    { name: 'Business Name', type: 'Restaurant', icon: '🍴' },
    { name: 'Business Name', type: 'Restaurant', icon: '🍴' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === 'Open' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter('Open')}
                className={activeFilter === 'Open' ? 'bg-gray-900' : ''}
              >
                Open
                {activeFilter === 'Open' && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Button>
              <Button
                variant={activeFilter === 'Newest' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter('Newest')}
                className={activeFilter === 'Newest' ? 'bg-gray-900' : ''}
              >
                Newest
                {activeFilter === 'Newest' && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={conv.avatar} />
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900">{conv.name}</div>
                <div className="text-sm text-gray-500 truncate">{conv.preview}</div>
              </div>
              <Badge className="bg-red-500 text-white hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs">
                {conv.unread}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="bg-green-100 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/Ellipse 2.png" />
              <AvatarFallback>CG</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">Cora Goyette</div>
              <div className="text-sm text-[#E4F6E8]">Online</div>
            </div>
          </div>
          <Button className="bg-[#3EBF5A] hover:bg-[#2e8d42] text-white">
            <Check className="w-4 h-4 mr-2" />
            Open
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center text-sm text-gray-500 mb-6">Today</div>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'support' && (
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src="/Ellipse 2.png" />
                    <AvatarFallback>CG</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-md ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    {msg.sender === 'user' && msg.status === 'read' && (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    )}
                    <span>{msg.time}</span>
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="w-8 h-8 ml-2">
                    <AvatarImage src="/Ellipse 1.png" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/Ellipse 2.png" />
                <AvatarFallback>CG</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </Button>
            <Input
              type="text"
              placeholder="Type Something...."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" size="sm" className="p-2">
              <Smile className="w-5 h-5 text-gray-500" />
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Send
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - User Info */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        {/* User Profile */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/Ellipse 1.png" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">Mr. Rosemary Koss</div>
              <div className="text-sm text-gray-500">user@example.com</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">About</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Mr. Rosemary Koss</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">775 Rolling Green Rd.</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">(603) 555-0123</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">dolores.chambers@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Joined: Aug 5, 2023</span>
            </div>
          </div>
        </div>

        {/* User Business Section */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">User Business</h3>
          <div className="space-y-3">
            {businesses.map((business, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                  {business.icon}
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{business.name}</div>
                  <div className="text-xs text-gray-500">{business.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activities Section */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">User activities</h3>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                  {activity.icon}
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{activity.name}</div>
                  <div className="text-xs text-gray-500">{activity.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessagingInterface;