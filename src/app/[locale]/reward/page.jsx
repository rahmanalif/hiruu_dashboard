import DashboardLayout from '@/components/layout/DashboardLayout';
import RewardsManagement from '@/components/home/Reward';

export default function RewardsManagementPage() {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Rewards']}>
      <RewardsManagement />
    </DashboardLayout>
  );
}