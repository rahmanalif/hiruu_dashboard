"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddMaintainerModal from '@/components/modals/AddMaintainerModal';
import EditMaintainerModal from '@/components/modals/EditMaintainerModal';
import { cn } from '@/lib/utils';
import { readStoredAuth, resolveAccessToken } from '@/lib/auth';

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

const formatPermissionKey = (permissionKey) =>
  permissionKey
    .split(".")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const formatAccess = (permissions) => {
  if (!permissions || typeof permissions !== "object") {
    return "N/A";
  }

  const entries = Object.entries(permissions);
  if (!entries.length) {
    return "N/A";
  }

  return entries
    .map(([key, value]) => `${formatPermissionKey(key)} (${value})`)
    .join(", ");
};

const RoleManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All');
  const [roleData, setRoleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaintainer, setSelectedMaintainer] = useState(null);

  useEffect(() => {
    const fetchMaintainers = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        setError("Missing NEXT_PUBLIC_API_BASE_URL");
        setIsLoading(false);
        return;
      }

      const accessToken = resolveAccessToken(readStoredAuth()?.tokens);
      if (!accessToken) {
        setError("Missing access token");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/maintainers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || "Failed to load maintainers");
        }

        const maintainers = Array.isArray(payload?.data) ? payload.data : [];
        setRoleData(
          maintainers.map((maintainer) => ({
            id: maintainer.id,
            name: maintainer.user?.name || "N/A",
            email: maintainer.user?.email || "N/A",
            access: formatAccess(maintainer.platformRole?.permissions),
            role: maintainer.platformRole?.name || "N/A",
          }))
        );
        setError(null);
      } catch (fetchError) {
        setError(fetchError?.message || "Failed to load maintainers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintainers();
  }, []);

  const filterOptions = useMemo(
    () => [...new Set(roleData.map((employee) => employee.role).filter(Boolean))],
    [roleData]
  );

  const filteredRoleData = roleData.filter((employee) => {
    if (selectedRole === 'All') return true;
    return employee.role === selectedRole;
  });

  return (
    <div className="bg-gray-50 p-8">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Role Management</h1>

        <Card>
          <CardHeader className="border-b bg-[#ECF7FE] p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Role & Permission</CardTitle>
              <div className="flex items-center space-x-2">
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white w-40 h-9"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  
                  <Plus className="w-5 h-5" />
                  Add Maintainer
                  {/* <div className='m-2 p-2'>Add Mainterner</div> */}

                </Button>
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-white w-9 h-9"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.75 12C18.75 12.1989 18.671 12.3897 18.5303 12.5303C18.3897 12.671 18.1989 12.75 18 12.75H6C5.80109 12.75 5.61032 12.671 5.46967 12.5303C5.32902 12.3897 5.25 12.1989 5.25 12C5.25 11.8011 5.32902 11.6103 5.46967 11.4697C5.61032 11.329 5.80109 11.25 6 11.25H18C18.1989 11.25 18.3897 11.329 18.5303 11.4697C18.671 11.6103 18.75 11.8011 18.75 12ZM21.75 6.75H2.25C2.05109 6.75 1.86032 6.82902 1.71967 6.96967C1.57902 7.11032 1.5 7.30109 1.5 7.5C1.5 7.69891 1.57902 7.88968 1.71967 8.03033C1.86032 8.17098 2.05109 8.25 2.25 8.25H21.75C21.9489 8.25 22.1397 8.17098 22.2803 8.03033C22.421 7.88968 22.5 7.69891 22.5 7.5C22.5 7.30109 22.421 7.11032 22.2803 6.96967C22.1397 6.82902 21.9489 6.75 21.75 6.75ZM14.25 15.75H9.75C9.55109 15.75 9.36032 15.829 9.21967 15.9697C9.07902 16.1103 9 16.3011 9 16.5C9 16.6989 9.07902 16.8897 9.21967 17.0303C9.36032 17.171 9.55109 17.25 9.75 17.25H14.25C14.4489 17.25 14.6397 17.171 14.7803 17.0303C14.921 16.8897 15 16.6989 15 16.5C15 16.3011 14.921 16.1103 14.7803 15.9697C14.6397 15.829 14.4489 15.75 14.25 15.75Z" fill="#11293A"/>
                    </svg>
                  </Button>

                  {isFilterOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
                        <div 
                          className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${selectedRole === 'All' ? 'text-blue-600 bg-blue-50/50 font-medium' : 'text-gray-700'}`}
                          onClick={() => { setSelectedRole('All'); setIsFilterOpen(false); }}
                        >
                          All
                        </div>
                        {filterOptions.map((role) => (
                          <div 
                            key={role}
                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${selectedRole === role ? 'text-blue-600 bg-blue-50/50 font-medium' : 'text-gray-700'}`}
                            onClick={() => { setSelectedRole(role); setIsFilterOpen(false); }}
                          >
                            {role}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>Employee ID</TableHead> */}
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      Loading maintainers...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredRoleData.length ? (
                  filteredRoleData.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="text-gray-900">{employee.name}</TableCell>
                      <TableCell className="text-gray-600">{employee.email}</TableCell>
                      <TableCell className="text-gray-900">{employee.access}</TableCell>
                      <TableCell className="text-gray-900">{employee.role}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full px-6 text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedMaintainer(employee);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No maintainers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <AddMaintainerModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
      <EditMaintainerModal
        key={selectedMaintainer?.id || 'edit-maintainer'}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setSelectedMaintainer(null);
          }
        }}
        maintainer={selectedMaintainer}
        roleOptions={filterOptions}
      />
    </div>
  );
};

export default RoleManagement;
