import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  const lastUpdated = "December 5, 2024";

  return (
    <div className="min-h-screen pt-32 pb-24 container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-darkest mb-4">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-lg prose-headings:font-serif prose-headings:text-brand-darkest prose-p:text-gray-700 prose-a:text-brand-clay max-w-none">

          <p>
            Montessori Milestones ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at montessorimilestones.com.
          </p>

          <h2>Information We Collect</h2>

          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Email addresses</strong> when you subscribe to our newsletter</li>
            <li><strong>Contact information</strong> when you reach out via email or contact forms</li>
            <li><strong>Chat conversations</strong> when you interact with our AI assistant "Maria"</li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage data</strong> including pages visited, time spent, and navigation paths</li>
            <li><strong>Device information</strong> such as browser type, operating system, and screen size</li>
            <li><strong>IP address</strong> (anonymized where possible)</li>
            <li><strong>Cookies and similar technologies</strong> (see Cookie Policy below)</li>
          </ul>

          <h2>AI Chatbot ("Maria") Data</h2>
          <p>
            Our website features an AI-powered chatbot named "Maria" that helps parents find age-appropriate Montessori resources. When you use this feature:
          </p>
          <ul>
            <li>Your chat messages are processed by third-party AI services (Groq) to generate responses</li>
            <li>We may store conversation logs to improve our recommendations</li>
            <li>No personally identifiable information is required to use the chatbot</li>
            <li>Child age information you share is used only to provide relevant product recommendations</li>
            <li>Chat data is not sold to third parties</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To send you our newsletter (with your consent)</li>
            <li>To respond to your inquiries</li>
            <li>To improve our website and content</li>
            <li>To personalize product recommendations</li>
            <li>To analyze website traffic and usage patterns</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services that may collect data:</p>
          <ul>
            <li><strong>Vercel</strong> - Website hosting and analytics</li>
            <li><strong>Groq</strong> - AI processing for our chatbot</li>
            <li><strong>Impact.com</strong> - Affiliate link tracking</li>
            <li><strong>Supabase</strong> - Authentication and data storage</li>
          </ul>
          <p>
            Each of these services has their own privacy policy governing their use of your data.
          </p>

          <h2>Affiliate Links & Partnerships</h2>
          <p>
            Our website contains affiliate links to products we recommend. When you click these links and make a purchase, we may earn a commission at no additional cost to you. Our affiliate partners (such as Lovevery via Impact.com) may use cookies to track referrals.
          </p>
          <p>
            For more information about our affiliate relationships, please see our <Link to="/terms">Terms of Service</Link>.
          </p>

          <h2>Cookie Policy</h2>
          <p>We use cookies for:</p>
          <ul>
            <li><strong>Essential cookies</strong> - Required for the website to function</li>
            <li><strong>Analytics cookies</strong> - Help us understand how visitors use our site</li>
            <li><strong>Affiliate cookies</strong> - Track referrals to our partner sites</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary for the purposes outlined in this policy, or as required by law. Newsletter subscribers can unsubscribe at any time, after which we will delete your email from our mailing list.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
          </ul>

          <h2>Children's Privacy</h2>
          <p>
            Our website is intended for adults (parents and educators). We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us so we can delete it.
          </p>

          <h2>California Residents (CCPA)</h2>
          <p>
            California residents have additional rights under the California Consumer Privacy Act, including the right to know what personal information is collected, request deletion, and opt out of the sale of personal information. We do not sell personal information.
          </p>

          <h2>European Residents (GDPR)</h2>
          <p>
            If you are in the European Economic Area, you have rights under the General Data Protection Regulation including access, rectification, erasure, and data portability. Our legal basis for processing is consent (for newsletters) and legitimate interest (for website analytics).
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> revella@montessorimilestones.com
          </p>

        </div>
      </div>
    </div>
  );
};
