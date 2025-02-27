import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BarChart2, PieChart, TrendingUp, Calendar, Download, Filter } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30');
  const [selectedClient, setSelectedClient] = useState('all');
  
  // Mock data for analytics
  const overviewStats = [
    { name: 'Total Impressions', value: '450K', change: '+8%', trend: 'up' },
    { name: 'Consent Rate', value: '84%', change: '+3%', trend: 'up' },
    { name: 'Rejection Rate', value: '11%', change: '-1%', trend: 'down' },
    { name: 'Customized Consents', value: '5%', change: '+2%', trend: 'up' },
  ];

  const clients = [
    { id: 'client1', name: 'Acme Corporation' },
    { id: 'client2', name: 'Globex Industries' },
    { id: 'client3', name: 'Soylent Corp' },
    { id: 'client4', name: 'Initech' },
    { id: 'client5', name: 'Umbrella Corporation' },
  ];

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(e.target.value);
  };

  return (
    <DashboardLayout title="Analytics">
      <div className="grid grid-cols-1 gap-6">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <label htmlFor="clientSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  id="clientSelect"
                  name="clientSelect"
                  value={selectedClient}
                  onChange={handleClientChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Clients</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-48">
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  id="dateRange"
                  name="dateRange"
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7">Last 7 days</option>
                  <option value="last30">Last 30 days</option>
                  <option value="thisMonth">This month</option>
                  <option value="lastMonth">Last month</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label htmlFor="exportData" className="block text-sm font-medium text-gray-700 mb-1">
                  Export Data
                </label>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {stat.name.includes('Impressions') ? (
                      <BarChart2 className="h-6 w-6 text-blue-600" />
                    ) : stat.name.includes('Consent') ? (
                      <PieChart className="h-6 w-6 text-green-600" />
                    ) : stat.name.includes('Rejection') ? (
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    ) : (
                      <Calendar className="h-6 w-6 text-purple-600" />
                    )}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                        <div className={`ml-2 flex items-center text-sm font-semibold ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Consent Rate Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Consent Rate Trends</h3>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Consent rate trend chart will be displayed here</p>
          </div>
        </div>

        {/* Consent by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Consent by Category</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Consent category chart will be displayed here</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Consent by Country</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Geographical consent chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Client Performance Comparison */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Client Performance Comparison</h3>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Client comparison chart will be displayed here</p>
          </div>
        </div>

        {/* Device and Browser Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Device Breakdown</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Device analytics chart will be displayed here</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Browser Breakdown</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Browser analytics chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
