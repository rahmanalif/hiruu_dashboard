import DashboardLayout from '@/components/layout/DashboardLayout';
import Payment from '@/components/home/Payment';

export default function PaymentPage() {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Payment']}>
      <Payment />
    </DashboardLayout>
  );
}