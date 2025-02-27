import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BarChart2, Code, ArrowUp, ArrowDown } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Code className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Websites</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">3</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </a>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Consents</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">24.5K</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/client/analytics" className="font-medium text-blue-600 hover:text-blue-500">
                View analytics
              </a>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUp className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Consent Rate</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">78.3%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/client/analytics" className="font-medium text-blue-600 hover:text-blue-500">
                View details
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Consent script */}
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Your Consent Script</h2>
        <div className="mt-2 bg-gray-800 rounded-lg p-4 text-white font-mono text-sm overflow-auto">
          <pre>{`<script>
  (function() {
    // ConsentHub Script
    var ch = document.createElement('script');
    ch.type = 'text/javascript';
    ch.async = true;
    ch.src = 'https://cdn.consenthub.com/loader.js';
    ch.setAttribute('data-client-id', 'client-123456');
    ch.setAttribute('data-domain', 'example.com');
    
    // Branding settings
    ch.setAttribute('data-primary-color', '#3B82F6');
    ch.setAttribute('data-secondary-color', '#1E40AF');
    ch.setAttribute('data-position', 'bottom');
    ch.setAttribute('data-theme', 'light');
    
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ch, s);
  })();
</script>`}</pre>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">Consent popup viewed</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Impression
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      example.com/home
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Just now
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">Consent accepted</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Accepted
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      example.com/products
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      5 minutes ago
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">Consent rejected</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rejected
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      example.com/blog
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      1 hour ago
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
