import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { courses } from '@/lib/content/courses';
import { Section } from './ui/Section';
import { PageIntro } from './ui/PageIntro';
import { ButtonLink } from './ui/ButtonLink';

export function ProgramsView() {
  return (
    <div className="training-page">
      <Section>
        <PageIntro title="Our Programs & Courses" actions={<>
          <ButtonLink href="#courses">Explore Courses <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
          <ButtonLink href="#enrollment" variant="secondary">Enrollment Guide</ButtonLink>
        </>}>
          <p>Explore baking and entrepreneurship training in Manyatta, Kisumu. Compare course descriptions, practical skills and training details below.</p>
        </PageIntro>
      </Section>
      <Section id="courses" aria-label="Training programs" className="training-catalogue">
        <div className="training-course-grid">
          {courses.map(course => (
            <article key={course.id} id={course.id} aria-labelledby={course.id + '-title'} className="training-course">
              <div className="course-photo">
                <Image src={course.image.src} alt={course.image.alt} fill sizes="(min-width: 1280px) 596px, (min-width: 768px) 46vw, 92vw" className="object-cover" />
              </div>
              <div className="course-body">
                <h2 id={course.id + '-title'}>{course.title}</h2>
                <dl className="course-facts">
                  <div><dt>Level</dt><dd>{course.level}</dd></div>
                  <div><dt>Duration</dt><dd>{course.duration}</dd></div>
                </dl>
                <p className="course-description">{course.description}</p>
                <h3>What you&apos;ll learn</h3>
                <ul className="course-topics">{course.learningTopics.map(topic => <li key={topic}>{topic}</li>)}</ul>
                <ButtonLink href={'/enroll?course=' + course.id} aria-label={'Enroll in this course: ' + course.title} className="course-enroll">Enroll in this course <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section id="enrollment" aria-labelledby="joining-title" className="bg-soft-green">
        <h2 id="joining-title" className="section-title">How to Join Modesh</h2>
        <p className="section-lead">Our enrollment process is straightforward, designed to get you started on your culinary journey as smoothly as possible.</p>
        <ol className="joining-steps">
          <li><h3>1. Submit Application</h3><p>Fill out our online application form with your details and preferred course selection.</p></li>
          <li><h3>2. Admissions Interview</h3><p>A brief chat with our admissions team to ensure the program aligns with your goals.</p></li>
          <li><h3>3. Secure Your Spot</h3><p>Complete your registration and payment to officially join the Modesh family.</p></li>
        </ol>
        <div className="home-actions"><ButtonLink href="/enroll">Start Your Application <ArrowRight size={18} aria-hidden="true" /></ButtonLink><ButtonLink href="/faq" variant="secondary">Questions about joining?</ButtonLink></div>
      </Section>
    </div>
  );
}
