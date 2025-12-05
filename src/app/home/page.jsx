"use client";
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Overview from '@/components/home/Overview';

const Dashboard = () => {
  return (
    <DashboardLayout breadcrumbs={['Dashboards', 'Overview']}>
      <Overview />
    </DashboardLayout>
  );
};

export default Dashboard;