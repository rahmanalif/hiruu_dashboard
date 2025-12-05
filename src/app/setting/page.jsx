import DashboardLayout from '@/components/layout/DashboardLayout';
import Setting from '@/components/home/Setting';

export default function SettingPage() {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Setting']}>
      <Setting />
    </DashboardLayout>
  );
}