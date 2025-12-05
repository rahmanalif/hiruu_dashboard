import DashboardLayout from '@/components/layout/DashboardLayout';
import RolePermission from '@/components/home/Role-Permission';

export default function RolePermissionPage() {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Role Management']}>
      <RolePermission />
    </DashboardLayout>
  );
}