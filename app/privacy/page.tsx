import { LegalPage } from '@/components/LegalPage';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Modesh Empowerment Hub collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      intro="Modesh Empowerment Hub is committed to protecting your privacy. This policy explains what information we collect through this website and how we use it."
    >
      <div>
        <h2>Information We Collect</h2>
        <p>
          When you submit our enrollment or contact forms, we collect the information you provide — such as your name,
          email address, phone number, course of interest, and any message you send. We do not collect this information
          unless you choose to submit it.
        </p>
      </div>
      <div>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to your enquiries and enrollment applications.</li>
          <li>To share information about our programs, intakes, and community activities that you have asked about.</li>
          <li>To improve the services and training we offer.</li>
        </ul>
      </div>
      <div>
        <h2>How We Store Your Information</h2>
        <p>
          Form submissions are processed and stored through our website host&apos;s form service. We retain the
          information only for as long as needed to respond to you and administer our programs.
        </p>
      </div>
      <div>
        <h2>Sharing Your Information</h2>
        <p>
          We do not sell or rent your personal information. We only share it with team members and partners who need it
          to support your enrollment or enquiry.
        </p>
      </div>
      <div>
        <h2>Your Rights</h2>
        <p>
          You may ask us to access, correct, or delete the personal information we hold about you at any time by
          contacting us at <a href="mailto:info@modeshempowermenthub.org">info@modeshempowermenthub.org</a>.
        </p>
      </div>
      <div>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this policy, email{' '}
          <a href="mailto:info@modeshempowermenthub.org">info@modeshempowermenthub.org</a> or call{' '}
          <a href="tel:+254726844169">+254-726844169</a>.
        </p>
      </div>
    </LegalPage>
  );
}
