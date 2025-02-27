import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, Check, Settings, BarChart2, Globe, Code, Lock, Zap } from 'lucide-react';

const Features: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const features = [
    {
      name: 'Easy Integration',
      description: 'Add our GDPR-compliant consent popup to your website with a single line of code.',
      icon: <Code className="h-6 w-6 text-blue-600" />,
    },
    {
      name: 'Customizable Design',
      description: 'Match your brand with customizable colors, logos, and layouts.',
      icon: <Settings className="h-6 w-6 text-blue-600" />,
    },
    {
      name: 'Detailed Analytics',
      description: 'Track consent rates and user interactions with comprehensive analytics.',
      icon: <BarChart2 className="h-6 w-6 text-blue-600" />,
    },
    {
      name: 'Multi-language Support',
      description: 'Reach global audiences with support for multiple languages.',
      icon: <Globe className="h-6 w-6 text-blue-600" />,
    },
    {
      name: 'GDPR Compliant',
      description: 'Stay compliant with the latest GDPR, CCPA, and cookie regulations.',
      icon: <Lock className="h-6 w-6 text-blue-600" />,
    },
    {
      name: 'Granular Consent Options',
      description: 'Allow users to choose which categories of cookies they accept.',
      icon: <Check className="h-6 w-6 text-blue-600" />,
    },
    {
      name: 'Fast Performance',
      description: 'Lightweight implementation that won\'t slow down your website.',
      icon: <Zap className="h-6 w-6 text-blue-600" />,
    },
    {
      name: 'Regular Updates',
      description: 'Stay up-to-date with the latest privacy regulations and best practices.',
      icon: <Shield className="h-6 w-6 text-blue-600" />,
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
              <Link to="/features" className="text-base font-medium text-gray-900 hover:text-gray-900">
                Features
              </Link>
              <Link to="/pricing" className="text-base font-medium text-gray-500 hover:text-gray-900">
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-10">
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">ConsentHub</span>
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    <Link
                      to="/features"
                      className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="ml-3 text-base font-medium text-gray-900">Features</span>
                    </Link>
                    <Link
                      to="/pricing"
                      className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="ml-3 text-base font-medium text-gray-900">Pricing</span>
                    </Link>
                    <Link
                      to="/contact"
                      className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="ml-3 text-base font-medium text-gray-900">Contact</span>
                    </Link>
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <div>
                  <Link
                    to="/admin/signup"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                  <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero section */}
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              Features that make GDPR compliance simple
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              ConsentHub provides everything you need to implement GDPR-compliant cookie consent on your website, with minimal effort and maximum customization.
            </p>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      {feature.icon}
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Feature details section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to manage cookie consent
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              ConsentHub provides everything you need to implement GDPR-compliant cookie consent on your website, with minimal effort and maximum customization.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                Easy integration for any website
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Adding ConsentHub to your website is as simple as adding a single line of code. No complex setup or technical knowledge required.
              </p>

              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Code className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Simple JavaScript snippet</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Just add a single line of JavaScript to your website's header and you're ready to go.
                  </dd>
                </div>
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Globe className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Works with any platform</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Compatible with WordPress, Shopify, Wix, Squarespace, and any custom-built website.
                  </dd>
                </div>
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Zap className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Lightweight and fast</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Our code is optimized for performance and won't slow down your website.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
              <img
                className="relative mx-auto rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
                alt="Dashboard screenshot"
              />
            </div>
          </div>

          <div className="relative mt-12 sm:mt-16 lg:mt-24">
            <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="lg:col-start-2">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  Comprehensive analytics and insights
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Gain valuable insights into how users interact with your consent popup and make data-driven decisions.
                </p>

                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <BarChart2 className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Detailed consent metrics</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Track consent rates, rejection rates, and user interactions with your consent popup.
                    </dd>
                  </div>
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <Globe className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Geographic insights</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      See how consent rates vary by country and region to optimize your compliance strategy.
                    </dd>
                  </div>
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <Settings className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Customizable reports</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Create custom reports and export data for further analysis and compliance documentation.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
                <img
                  className="relative mx-auto rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1581092921461-7d65ca45393a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
                  alt="Analytics screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Sign up for ConsentHub today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Join thousands of websites that trust ConsentHub for their GDPR consent management needs.
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

export default Features;
