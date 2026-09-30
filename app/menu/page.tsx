import PreviewPage from '@/features/menu/page/PreviewPage';
import AuthGuard from '@/core/auth/components/AuthGuard';

export default function MenuPage() {
  return (
    <AuthGuard>
      <PreviewPage />
    </AuthGuard>
  );
}
