import { UpdateState } from '@/components/UpdateState';
import { Section } from '@/components/ui/Section';

export default function UpdateNotFound() {
  return <div className="training-page reading-page"><Section><UpdateState kind="missing" detail /></Section></div>;
}
