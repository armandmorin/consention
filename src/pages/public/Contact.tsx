import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
    }, 1000);
  };

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
              <Link to="/pricing" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
              <Link to="/contact" className="text-base font-medium text-gray-900 hover:text-gray-900">
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

      {/* Contact section */}
      <main className="overflow-hidden">
        <div className="bg-warm-gray-50">
          <div className="py-24 lg:py-32">
            <div className="relative z-10 max-w-7xl mx-auto pl-4 pr-8 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-warm-gray-900 sm:text-5xl lg:text-6xl">
                Get in touch
              </h1>
              <p className="mt-6 text-xl text-warm-gray-500 max-w-3xl">
                Have questions about ConsentHub? We're here to help. Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <section className="relative bg-white" aria-labelledby="contact-heading">
          <div className="absolute w-full h-1/2 bg-warm-gray-50" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-white shadow-xl">
              <h2 id="contact-heading" className="sr-only">
                Contact us
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Contact information */}
                <div className="relative overflow-hidden py-10 px-6 bg-gradient-to-b from-blue-500 to-blue-600 sm:px-10 xl:p-12">
                  <div className="absolute inset-0 pointer-events-none sm:hidden" aria-hidden="true">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={343}
                      height={388}
                      viewBox="0 0 343 388"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                        fill="url(#linear1)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear1"
                          x1="254.553"
                          y1="107.554"
                          x2="961.66"
                          y2="814.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none sm:block lg:hidden"
                    aria-hidden="true"
                  >
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={359}
                      height={339}
                      viewBox="0 0 359 339"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                        fill="url(#linear2)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear2"
                          x1="192.553"
                          y1="28.553"
                          x2="899.66"
                          y2="735.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none lg:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={160}
                      height={678}
                      viewBox="0 0 160 678"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
                        fill="url(#linear3)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear3"
                          x1="192.553"
                          y1="325.553"
                          x2="899.66"
                          y2="1032.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">Contact information</h3>
                  <p className="mt-6 text-base text-blue-50 max-w-3xl">
                    Our team is ready to answer your questions about ConsentHub and help you implement GDPR-compliant consent management on your website.
                  </p>
                  <dl className="mt-8 space-y-6">
                    <dt>
                      <span className="sr-only">Phone number</span>
                    </dt>
                    <dd className="flex text-base text-blue-50">
                      <Phone className="flex-shrink-0 w-6 h-6 text-blue-200" />
                      <span className="ml-3">+1 (555) 123-4567</span>
                    </dd>
                    <dt>
                      <span className="sr-only">Email</span>
                    </dt>
                    <dd className="flex text-base text-blue-50">
                      <Mail className="flex-shrink-0 w-6 h-6 text-blue-200" />
                      <span className="ml-3">contact@consenthub.com</span>
                    </dd>
                    <dt>
                      <span className="sr-only">Address</span>
                    </dt>
                    <dd className="flex text-base text-blue-50">
                      <MapPin className="flex-shrink-0 w-6 h-6 text-blue-200" />
                      <span className="ml-3">123 Privacy Street, San Francisco, CA 94107</span>
                    </dd>
                  </dl>
                  <ul className="mt-8 flex space-x-12">
                    <li>
                      <a className="text-blue-200 hover:text-blue-100" href="#">
                        <span className="sr-only">Facebook</span>
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1<boltArtifact id="global-analytics-file" title="Create GlobalAnalytics Component">
<boltAction type="file" filePath="src/pages/public/Contact.tsx">
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
    }, 1000);
  };

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
              <Link to="/pricing" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
              <Link to="/contact" className="text-base font-medium text-gray-900 hover:text-gray-900">
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

      {/* Contact section */}
      <main className="overflow-hidden">
        <div className="bg-warm-gray-50">
          <div className="py-24 lg:py-32">
            <div className="relative z-10 max-w-7xl mx-auto pl-4 pr-8 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-warm-gray-900 sm:text-5xl lg:text-6xl">
                Get in touch
              </h1>
              <p className="mt-6 text-xl text-warm-gray-500 max-w-3xl">
                Have questions about ConsentHub? We're here to help. Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <section className="relative bg-white" aria-labelledby="contact-heading">
          <div className="absolute w-full h-1/2 bg-warm-gray-50" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-white shadow-xl">
              <h2 id="contact-heading" className="sr-only">
                Contact us
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Contact information */}
                <div className="relative overflow-hidden py-10 px-6 bg-gradient-to-b from-blue-500 to-blue-600 sm:px-10 xl:p-12">
                  <div className="absolute inset-0 pointer-events-none sm:hidden" aria-hidden="true">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={343}
                      height={388}
                      viewBox="0 0 343 388"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                        fill="url(#linear1)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear1"
                          x1="254.553"
                          y1="107.554"
                          x2="961.66"
                          y2="814.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none sm:block lg:hidden"
                    aria-hidden="true"
                  >
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={359}
                      height={339}
                      viewBox="0 0 359 339"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                        fill="url(#linear2)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear2"
                          x1="192.553"
                          y1="28.553"
                          x2="899.66"
                          y2="735.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none lg:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={160}
                      height={678}
                      viewBox="0 0 160 678"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
                        fill="url(#linear3)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear3"
                          x1="192.553"
                          y1="325.553"
                          x2="899.66"
                          y2="1032.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">Contact information</h3>
                  <p className="mt-6 text-base text-blue-50 max-w-3xl">
                    Our team is ready to answer your questions about ConsentHub and help you implement GDPR-compliant consent management on your website.
                  </p>
                  <dl className="mt-8 space-y-6">
                    <dt>
                      <span className="sr-only">Phone number</span>
                    </dt>
                    <dd className="flex text-base text-blue-50">
                      <Phone className="flex-shrink-0 w-6 h-6 text-blue-200" />
                      <span className="ml-3">+1 (555) 123-4567</span>
                    </dd>
                    <dt>
                      <span className="sr-only">Email</span>
                    </dt>
                    <dd className="flex text-base text-blue-50">
                      <Mail className="flex-shrink-0 w-6 h-6 text-blue-200" />
                      <span className="ml-3">contact@consenthub.com</span>
                    </dd>
                    <dt>
                      <span className="sr-only">Address</span>
                    </dt>
                    <dd className="flex text-base text-blue-50">
                      <MapPin className="flex-shrink-0 w-6 h-6 text-blue-200" />
                      <span className="ml-3">123 Privacy Street, San Francisco, CA 94107</span>
                    </dd>
                  </dl>
                  <ul className="mt-8 flex space-x-12">
                    <li>
                      <a className="text-blue-200 hover:text-blue-100" href="#">
                        <span className="sr-only">Facebook</span>
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a className="text-blue-200 hover:text-blue-100" href="#">
                        <span className="sr-only">Twitter</span>
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a className="text-blue-200 hover:text-blue-100" href="#">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact form */}
                <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
                  {formSubmitted ? (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Message sent successfully</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>
                              Thank you for contacting us! We've received your message and will get back to you as soon as possible.
                            </p>
                          </div>
                          <div className="mt-4">
                            <div className="-mx-2 -my-1.5 flex">
                              <button
                                type="button"
                                onClick={() => setFormSubmitted(false)}
                                className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Send another message
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-900">Send us a message</h3>
                      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                            First name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="firstName"
                              id="firstName"
                              autoComplete="given-name"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                            Last name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="lastName"
                              id="lastName"
                              autoComplete="family-name"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Email
                          </label>
                          <div className="mt-1">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                              Phone
                            </label>
                            <span id="phone-optional" className="text-sm text-gray-500">
                              Optional
                            </span>
                          </div>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              autoComplete="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              aria-describedby="phone-optional"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="company" className="block text-sm font-medium text-gray-900">
                            Company
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="company"
                              id="company"
                              autoComplete="organization"
                              value={formData.company}
                              onChange={handleChange}
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                            Message
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="message"
                              name="message"
                              rows={4}
                              value={formData.message}
                              onChange={handleChange}
                              required
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <input
                                id="privacy-policy"
                                name="privacy-policy"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-base text-gray-500">
                                By selecting this, you agree to our{' '}
                                <a href="#" className="font-medium text-gray-700 underline">
                                  Privacy Policy
                                </a>{' '}
                                and{' '}
                                <a href="#" className="font-medium text-gray-700 underline">
                                  Cookie Policy
                                </a>
                                .
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Let's talk
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Frequently asked questions
            </h2>
            <div className="mt-12">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    How quickly can I implement ConsentHub on my website?
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Implementation takes just a few minutes. Simply add our JavaScript snippet to your website's header, and you're ready to go.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Is ConsentHub compliant with GDPR and other privacy regulations?
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
                    Absolutely! You can customize colors, text, position, and more to match your website's design.
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
              </dl>
            </div>
          </div>
        </div>
      </main>

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

export default Contact;
