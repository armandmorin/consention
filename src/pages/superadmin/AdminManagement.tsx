import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PlusCircle, Edit, Trash2, Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Admin {
  id: string;
  name: string;
  email: string;
  company: string;
  clients: number;
  status: 'active' | 'inactive';
  joinedDate: string;
}

interface AddAdminForm {
  name: string;
  email: string;
  company: string;
  password: string;
}

const AdminManagement: React.FC = () => {
  const { signup } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState<AddAdminForm>({
    name: '',
    email: '',
    company: '',
    password: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '', 
    company: ''
  });

  // Fetch admins from database with token refresh
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        
        // First refresh the session to ensure we have a valid token
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.warn('Token refresh error before fetching admins:', refreshError);
        }
        
        // Now fetch admins with the refreshed token
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'admin');
          
        if (error) {
          // Try one more time if first attempt failed
          console.warn('Error fetching admins, retrying:', error);
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'admin');
            
          if (retryError) throw retryError;
          if (!retryData) throw new Error('No data returned from retry');
          
          // Format data to match Admin interface
          const formattedAdmins: Admin[] = retryData.map(profile => ({
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            company: profile.organization || '',
            clients: 0,
            status: 'active',
            joinedDate: new Date(profile.created_at).toISOString().split('T')[0]
          }));
          
          setAdmins(formattedAdmins);
        } else {
          // Use data from first successful attempt
          const formattedAdmins: Admin[] = data.map(profile => ({
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            company: profile.organization || '',
            clients: 0,
            status: 'active',
            joinedDate: new Date(profile.created_at).toISOString().split('T')[0]
          }));
          
          setAdmins(formattedAdmins);
        }
      } catch (err) {
        console.error('Error fetching admins:', err);
        setError('Failed to load admin accounts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAdmin = async () => {
    try {
      // Validate form
      if (!addForm.name || !addForm.email || !addForm.password) {
        setError('Please fill in all required fields');
        return;
      }
      
      setLoading(true);
      
      // Use the signup function from AuthContext to create the admin
      const result = await signup(
        addForm.email,       // email
        addForm.password,    // password
        addForm.name,        // name
        'admin',             // role
        addForm.company      // organization
      );
      
      console.log('Admin creation result:', result);
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to create admin account');
      }
      
      // Refresh admin list
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin');
        
      if (error) throw error;
      
      // Format data to match Admin interface
      const formattedAdmins: Admin[] = data.map(profile => ({
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        company: profile.organization || '',
        clients: 0,
        status: 'active',
        joinedDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '(unknown)'
      }));
      
      setAdmins(formattedAdmins);
      
      // Reset form and close modal
      setAddForm({
        name: '',
        email: '',
        company: '',
        password: ''
      });
      setShowAddModal(false);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error adding admin:', err);
      setError('Failed to create admin account: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  const handleDeleteAdmin = () => {
    // Handle deleting admin logic
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };
  
  const handleEditAdmin = () => {
    // In a real app, this would call an API to update the admin
    console.log('Updating admin:', selectedAdmin?.id, editForm);
    
    // Close the modal and reset state
    setShowEditModal(false);
    setSelectedAdmin(null);
  };
  
  const startEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      name: admin.name,
      email: admin.email,
      company: admin.company
    });
    setShowEditModal(true);
  };

  return (
    <DashboardLayout title="Admin Management">
      <div className="bg-white shadow rounded-lg">
        {error && !showAddModal && (
          <div className="bg-red-50 p-4 rounded-t-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative rounded-md shadow-sm max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search admins..."
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
            Add Admin
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
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clients
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading admin accounts...
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.clients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.joinedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={() => startEditAdmin(admin)}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900"
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredAdmins.length === 0 && !loading && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm ? 'No admins found matching your search criteria.' : 'No admin accounts found. Add your first admin using the "Add Admin" button.'}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
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
                      Add New Admin
                    </h3>
                    <div className="mt-4 space-y-4">
                      {error && (
                        <div className="rounded-md bg-red-50 p-2 mb-3">
                          <div className="flex">
                            <div className="ml-2">
                              <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={addForm.name}
                          onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={addForm.email}
                          onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="company"
                          value={addForm.company}
                          onChange={(e) => setAddForm({...addForm, company: e.target.value})}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={addForm.password}
                          onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddAdmin}
                >
                  Add Admin
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
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
                      Edit Admin: {selectedAdmin.name}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="edit-name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                          Email (read-only)
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="edit-email"
                          value={editForm.email}
                          disabled
                          className="mt-1 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-company" className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="edit-company"
                          value={editForm.company}
                          onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleEditAdmin}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAdmin(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Admin Modal */}
      {showDeleteModal && selectedAdmin && (
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
                      Delete Admin
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {selectedAdmin.name}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteAdmin}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedAdmin(null);
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

export default AdminManagement;
