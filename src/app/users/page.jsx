import DashboardLayout from '@/components/layout/DashboardLayout';
import UserManagement from '@/components/home/Users';

export default function UsersPage() {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Users']}>
      <UserManagement />
    </DashboardLayout>
  );
}
