import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile | Roamance',
  description: 'Manage your traveler profile and preferences',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
