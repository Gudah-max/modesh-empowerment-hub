import { Suspense } from 'react';
import { EnrollView } from '@/components/EnrollView';

export const metadata = {
  title: 'Enroll',
  description: 'Apply to join a Modesh Empowerment Hub baking and entrepreneurship program.',
};

export default function EnrollPage() {
  return (
    <Suspense>
      <EnrollView />
    </Suspense>
  );
}
