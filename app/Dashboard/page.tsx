import PreviewPage from '@/features/menu/page/PreviewPage';
import AuthGuard from '@/core/auth/components/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <PreviewPage />
    </AuthGuard>
  );
}
