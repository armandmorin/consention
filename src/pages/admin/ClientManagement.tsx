import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PlusCircle, Edit, Trash2, Search, X, Code, Mail, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  website: string;
  status: 'active' | 'inactive';
  consentRate: number;
  createdAt: string;
}

interface ClientFormData {
  companyName: string;
  website: string;
  status: 'active' | 'inactive';
  contactName: string;
  contactEmail: string;
  createAccount: boolean;
  sendInvite: boolean;
}

const ClientManagement: React.FC = () => {
  const { signup } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form data for new client
  const [formData, setFormData] = useState<ClientFormData>({
    companyName: '',
    website: '',
    status: 'active',
    contactName: '',
    contactEmail: '',
    createAccount: true,
    sendInvite: true
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Mock data for clients
  const clients: Client[] = [
    { id: '1', name: 'Acme Corporation', website: 'acme.com', status: 'active', consentRate: 87, createdAt: '2023-05-12' },
    { id: '2', name: 'Globex Industries', website: 'globex.com', status: 'active', consentRate: 92, createdAt: '2023-05-10' },
    { id: '3', name: 'Soylent Corp', website: 'soylent.com', status: 'inactive', consentRate: 65, createdAt: '2023-05-08' },
    { id: '4', name: 'Initech', website: 'initech.com', status: 'active', consentRate: 78, createdAt: '2023-05-05' },
    { id: '5', name: 'Umbrella Corporation', website: 'umbrella.com', status: 'active', consentRate: 81, createdAt: '2023-05-03' },
    { id: '6', name: 'Stark Industries', website: 'stark.com', status: 'inactive', consentRate: 73, createdAt: '2023-05-01' },
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      // Validate form
      if (!formData.companyName || !formData.website) {
        setErrorMessage('Company name and website are required');
        setIsSubmitting(false);
        return;
      }
      
      if (formData.createAccount && (!formData.contactEmail || !formData.contactName)) {
        setErrorMessage('Contact name and email are required when creating an account');
        setIsSubmitting(false);
        return;
      }
      
      // In production, you would:
      // 1. Create the client record in your database
      // 2. If createAccount is true, create a user account
      
      console.log('Creating client:', formData.companyName);
      
      // If user account creation is selected
      if (formData.createAccount) {
        console.log('Creating user account for client contact:', formData.contactEmail);
        
        // Create client user via our signup method
        const result = await signup(
          formData.contactEmail,
          formData.contactName,
          'client', // Always 'client' role for clients
          formData.companyName
        );
        
        if (!result || !result.success) {
          throw new Error(result?.error || 'Failed to create client account');
        }
        
        // If you enabled the "send invite" option
        if (formData.sendInvite) {
          console.log('An invite would be sent to:', formData.contactEmail);
          // In production, you would trigger an email invitation here
        }
      }
      
      // Show success message
      setSuccessMessage('Client created successfully!');
      
      // Reset form
      setFormData({
        companyName: '',
        website: '',
        status: 'active',
        contactName: '',
        contactEmail: '',
        createAccount: true,
        sendInvite: true
      });
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage(null);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating client:', err);
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred creating the client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = () => {
    // Handle deleting client logic
    setShowDeleteModal(false);
    setSelectedClient(null);
  };

  return (
    <DashboardLayout title="Client Management">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative rounded-md shadow-sm max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consent Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.website}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {client.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.consentRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/code/${client.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/admin/code/${client.id}`;
                        }}
                      >
                        <Code className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/admin/client/${client.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/admin/client/${client.id}`;
                        }}
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          setSelectedClient(client);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No clients found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add New Client
                    </h3>
                    
                    {errorMessage && (
                      <div className="mt-2 rounded-md bg-red-50 p-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <X className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {successMessage && (
                      <div className="mt-2 rounded-md bg-green-50 p-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">{successMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          id="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          id="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="my-4 border-t border-gray-200 pt-4">
                        <h4 className="text-md font-medium text-gray-900 mb-3">Contact Information & User Account</h4>
                        
                        <div className="flex items-center mb-4">
                          <input
                            id="createAccount"
                            name="createAccount"
                            type="checkbox"
                            checked={formData.createAccount}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="createAccount" className="ml-2 block text-sm text-gray-900">
                            Create user account for client contact
                          </label>
                        </div>
                        
                        {formData.createAccount && (
                          <>
                            <div className="mt-3">
                              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                                Contact Name
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  id="contactName"
                                  name="contactName"
                                  type="text"
                                  value={formData.contactName}
                                  onChange={handleInputChange}
                                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                                Contact Email
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  id="contactEmail"
                                  name="contactEmail"
                                  type="email"
                                  value={formData.contactEmail}
                                  onChange={handleInputChange}
                                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center mt-3">
                              <input
                                id="sendInvite"
                                name="sendInvite"
                                type="checkbox"
                                checked={formData.sendInvite}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="sendInvite" className="ml-2 block text-sm text-gray-900">
                                Send invitation email
                              </label>
                            </div>
                            
                            <p className="mt-2 text-xs text-gray-500">
                              An email will be sent to the contact with instructions to set up their account.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleAddClient}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Add Client'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    if (!isSubmitting) {
                      setShowAddModal(false);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      // Reset form
                      setFormData({
                        companyName: '',
                        website: '',
                        status: 'active',
                        contactName: '',
                        contactEmail: '',
                        createAccount: true,
                        sendInvite: true
                      });
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Client Modal */}
      {showDeleteModal && selectedClient && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Client
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {selectedClient.name}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteClient}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedClient(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientManagement;
