'use client';

import { useSession } from 'next-auth/react';
import LoginPage from './login/page';
import DashboardPage from './dashboard/page';

export default function Home() {
  const { data: session, status } = useSession();

  if (session) {
    return <DashboardPage />;
  }

  return <LoginPage />;
}