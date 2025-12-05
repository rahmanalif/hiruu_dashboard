import React from 'react';
import { getUserById } from '@/data/users';
import { notFound } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserProfile from '@/components/users/UserProfile';

export default async function UserDetailsPage({ params }) {
    const { id } = await params;
    const user = getUserById(id);

    if (!user) {
        notFound();
    }

    return (
        <DashboardLayout breadcrumbs={['Dashboards', 'Users', user.name]}>
            <UserProfile user={user} />
        </DashboardLayout>
    );
}
