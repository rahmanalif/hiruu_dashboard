import DashboardLayout from '@/components/layout/DashboardLayout';
import SupportChat from '@/components/home/SupportChat';

export default function SupportChatPage() {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Support Chat']}>
      <SupportChat />
    </DashboardLayout>
  );
}