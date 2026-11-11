import { pageMetadata } from '@/lib/metadata';
import { Suspense } from 'react';
import { EnrollView } from '@/components/EnrollView';
import { getCourseOptions } from '@/lib/content/courses';
import '../training.css';

export const metadata = pageMetadata('/enroll', 'Enroll', 'Express your interest in a Modesh Empowerment Hub baking or entrepreneurship course through our enrollment form.');

export default function EnrollPage() {
  return (
    <Suspense>
      <EnrollView courses={getCourseOptions()} />
    </Suspense>
  );
}
