import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Check, X, Menu } from 'lucide-react';

const Pricing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      description: 'Perfect for small websites and blogs',
      features: [
        'Up to 10,000 monthly visitors',
        'Basic consent popup',
        'Standard analytics',
        'Email support',
        'GDPR compliant',
      ],
      notIncluded: [
        'Custom branding',
        'Multiple websites',
        'Advanced analytics',
        'Priority support',
      ],
      cta: 'Start with Starter',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$79',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 100,000 monthly visitors',
        'Customizable consent popup',
        'Advanced analytics',
        'Custom branding',
        'Up to 5 websites',
        'Priority email support',
        'GDPR & CCPA compliant',
      ],
      notIncluded: [
        'Unlimited websites',
        'Phone support',
      ],
      cta: 'Go Professional',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      description: 'For large organizations with complex needs',
      features: [
        'Unlimited monthly visitors',
        'Fully customizable consent solution',
        'Comprehensive analytics',
        'Custom branding',
        'Unlimited websites',
        'Priority phone & email support',
        'GDPR, CCPA & global compliance',
        'Dedicated account manager',
        'Custom integration support',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">ConsentHub</span>
              </Link>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <button
                type="button"
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link to="/features" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Features
              </Link>
              <Link to="/pricing" className="text-base font-medium text-gray-900 hover:text-gray-900">
                Pricing
              </Link>
              <Link to="/contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link to="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                Sign in
              </Link>
              <Link
                to="/admin/signup"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Pricing</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Simple, transparent pricing
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Choose the plan that's right for your business and stay compliant with privacy regulations.
            </p>
          </div>

          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-lg shadow-sm divide-y divide-gray-200 ${plan.popular ? 'border-2 border-blue-500 relative' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/mo</span>
                  </p>
                  <Link
                    to="/admin/signup"
                    className={`mt-8 block w-full bg-${plan.popular ? 'blue' : 'gray'}-600 hover:bg-${plan.popular ? 'blue' : 'gray'}-700 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center`}
                  >
                    {plan.cta}
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-3 text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="mt-8 text-sm font-medium text-gray-900 tracking-wide uppercase">Not included</h4>
                      <ul className="mt-6 space-y-4">
                        {plan.notIncluded.map((feature) => (
                          <li key={feature} className="flex">
                            <X className="flex-shrink-0 h-5 w-5 text-red-500" />
                            <span className="ml-3 text-sm text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Frequently asked questions
          </h2>
          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  What is ConsentHub?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  ConsentHub is a GDPR-compliant consent management platform that helps websites collect and manage user consent for cookies and tracking technologies.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  How does billing work?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  We offer monthly and annual billing options. Annual plans come with a 20% discount. You can upgrade or downgrade your plan at any time.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  Do you offer a free trial?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, we offer a 14-day free trial on all plans. No credit card required to start your trial.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  How do I install ConsentHub on my website?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Installation is simple - just add a single line of JavaScript to your website's header. We provide detailed instructions and support if needed.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  Is ConsentHub compliant with all privacy regulations?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, ConsentHub is designed to help you comply with GDPR, CCPA, ePrivacy Directive, and other global privacy regulations.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  Can I customize the appearance of the consent popup?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Absolutely! You can customize colors, text, position, and more to match your website's design. Professional and Enterprise plans offer advanced customization options.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            No credit card required. 14-day free trial on all plans.
          </p>
          <Link
            to="/admin/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">ConsentHub</span>
              </div>
              <p className="text-gray-300 text-base">
                Making GDPR compliance simple and effective for websites of all sizes.
              </p>
              <div className="flex space-x-6">
                {/* Social links would go here */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        GDPR Compliance
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        CCPA Compliance
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Cookie Management
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Consent Analytics
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Guides
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        API Status
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Contact Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Jobs
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Press
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        Cookie Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-400 hover:text-white">
                        GDPR Commitment
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} ConsentHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
