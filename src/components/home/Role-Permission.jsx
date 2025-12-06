"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, SlidersHorizontal } from 'lucide-react';
import EditRoleModal from '@/components/modals/EditRolePermissionModal';

import { cn } from '@/lib/utils';

// Table components inline
const Table = ({ children, className, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props}>{children}</table>
  </div>
);
const TableHeader = ({ children, className, ...props }) => <thead className={cn("border-b bg-gray-50", className)} {...props}>{children}</thead>;
const TableBody = ({ children, className, ...props }) => <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>{children}</tbody>;
const TableRow = ({ children, className, ...props }) => <tr className={cn("border-b transition-colors hover:bg-gray-50", className)} {...props}>{children}</tr>;
const TableHead = ({ children, className, ...props }) => <th className={cn("h-12 px-4 text-left align-middle font-medium text-gray-700 text-sm", className)} {...props}>{children}</th>;
const TableCell = ({ children, className, ...props }) => <td className={cn("p-4 align-middle text-sm", className)} {...props}>{children}</td>;

const RoleManagement = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const roleData = [
    {
      id: '29506',
      name: 'Leslie Alexander',
      email: 'oxheart@email.com',
      access: 'View Reports',
      role: 'Admin'
    },
    {
      id: '29505',
      name: 'Marvin McKinney',
      email: 'mountain@email.com',
      access: 'Access Support, Ban User...',
      role: 'Sales & Marketing'
    },
    {
      id: '29504',
      name: 'Kristin Watson',
      email: 'juniper@email.com',
      access: 'Manage user, Ban User',
      role: 'Help & Support'
    },
    {
      id: '29502',
      name: 'Darrell Steward',
      email: 'oxheart@email.com',
      access: 'Manage subscriptions',
      role: 'Sales & Marketing'
    },
    {
      id: '29501',
      name: 'Theresa Webb',
      email: 'juniper@email.com',
      access: 'View Reports',
      role: 'Admin'
    }
  ];

  return (
    <div className="bg-gray-50 p-8">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Role Management</h1>

        <Card>
          <CardHeader className="border-b bg-[#ECF7FE] p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Role & Permission</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="bg-white w-9 h-9">
                  <Plus className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white w-9 h-9">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleData.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium text-gray-900">{employee.id}</TableCell>
                    <TableCell className="text-gray-900">{employee.name}</TableCell>
                    <TableCell className="text-gray-600">{employee.email}</TableCell>
                    <TableCell className="text-gray-900">{employee.access}</TableCell>
                    <TableCell className="text-gray-900">{employee.role}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-6 text-blue-600 border-blue-600 hover:bg-blue-50"
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <EditRoleModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </div>
  );
};

export default RoleManagement;