import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserProfile from '@/components/users/UserProfile';

export default async function UserDetailsPage({ params }) {
    const { id } = await params;

    return (
        <DashboardLayout breadcrumbs={['Dashboards', 'Users', id]}>
            <UserProfile userId={id} />
        </DashboardLayout>
    );
}
