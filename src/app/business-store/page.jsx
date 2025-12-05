import DashboardLayout from '@/components/layout/DashboardLayout';
import BusinessStore from '@/components/home/BusinessStore';

export default function BusinessStorePage() {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Business']}>
      <BusinessStore />
    </DashboardLayout>
  );
}
