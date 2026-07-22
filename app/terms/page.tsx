import { LegalPage } from '@/components/LegalPage';

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of the Modesh Empowerment Hub website and services.',
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 2026"
      intro="By using this website and applying to our programs, you agree to the following terms."
    >
      <div>
        <h2>Use of This Website</h2>
        <p>
          The content on this website is provided for general information about Modesh Empowerment Hub and its programs.
          You agree to use the site lawfully and not to misuse our forms or contact channels.
        </p>
      </div>
      <div>
        <h2>Program Enrollment</h2>
        <p>
          Submitting an enrollment form is an expression of interest, not a guarantee of a place. Admission is subject
          to availability, our admissions process, and completion of any required registration and payment. Course
          durations, content, and schedules may change.
        </p>
      </div>
      <div>
        <h2>Intellectual Property</h2>
        <p>
          All text, images, and branding on this website belong to Modesh Empowerment Hub unless otherwise stated, and
          may not be reproduced without permission.
        </p>
      </div>
      <div>
        <h2>Limitation of Liability</h2>
        <p>
          We take care to keep the information on this site accurate and up to date, but we do not warrant that it is
          complete or error-free. We are not liable for any loss arising from reliance on the website content.
        </p>
      </div>
      <div>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{' '}
          <a href="mailto:info@modeshempowermenthub.org">info@modeshempowermenthub.org</a>.
        </p>
      </div>
    </LegalPage>
  );
}
