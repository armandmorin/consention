import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BarChart2, Users, Settings, ArrowUp, ArrowDown } from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Admins</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">24</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/superadmin/admins" className="font-medium text-blue-600 hover:text-blue-500">
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
                <Settings className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Clients</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">142</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/superadmin/clients" className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </a>
            </div>
          </div>
        </div>

        {/* Card 3 */}
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
                    <div className="text-lg font-medium text-gray-900">1.2M</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/superadmin/analytics" className="font-medium text-blue-600 hover:text-blue-500">
                View analytics
              </a>
            </div>
          </div>
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
                  <p className="text-sm font-medium text-blue-600 truncate">New admin registered</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      New
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      Acme Corp
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
                  <p className="text-sm font-medium text-blue-600 truncate">Global branding updated</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Update
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <Settings className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      System
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">Consent rate increased</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Improved
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <ArrowUp className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                      +2.5% from last week
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      1 day ago
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

export default SuperAdminDashboard;
