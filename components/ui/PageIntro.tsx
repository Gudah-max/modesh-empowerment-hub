import type { ReactNode } from 'react';

export function PageIntro({ title, children, actions }: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="training-intro">
      <h1 className="training-title">{title}</h1>
      <div className="section-lead">{children}</div>
      {actions && <div className="home-actions">{actions}</div>}
    </div>
  );
}
