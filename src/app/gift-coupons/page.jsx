import DashboardLayout from '@/components/layout/DashboardLayout';
import GiftCoupons from '@/components/home/GiftCoupons';

export default function GiftCouponsPage() {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Gifts & Coupons']}>
      <GiftCoupons />
    </DashboardLayout>
  );
}